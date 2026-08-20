from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.customer import Customer
from app.schemas import (
    CustomerRegister,
    CustomerLogin,
    CustomerResponse,
    LoginResponse,
    SendOtpRequest,
    SendOtpResponse,
    VerifyOtpRequest,
)
from app.security import (
    hash_password,
    verify_password,
    create_access_token,
)
from app.auth import get_current_customer
from app.utils.customer_id import generate_customer_id

router = APIRouter(
    prefix="/customers",
    tags=["Customers"],
)


@router.post(
    "/register",
    response_model=CustomerResponse,
    status_code=status.HTTP_201_CREATED,
)
def register_customer(
    customer: CustomerRegister,
    db: Session = Depends(get_db),
):

    existing_mobile = (
        db.query(Customer)
        .filter(Customer.mobile_number == customer.mobile_number)
        .first()
    )

    if existing_mobile:
        raise HTTPException(
            status_code=400,
            detail="Mobile number already registered",
        )

    existing_email = (
        db.query(Customer)
        .filter(Customer.email == customer.email)
        .first()
    )

    if existing_email:
        raise HTTPException(
            status_code=400,
            detail="Email already registered",
        )

    new_customer = Customer(
        customer_id=generate_customer_id(db),
        full_name=customer.full_name,
        mobile_number=customer.mobile_number,
        email=customer.email,
        village=customer.village,
        password=hash_password(customer.password),
    )

    db.add(new_customer)
    db.commit()
    db.refresh(new_customer)

    return new_customer


@router.post(
    "/login",
    response_model=LoginResponse,
)
def login_customer(
    customer: CustomerLogin,
    db: Session = Depends(get_db),
):

    db_customer = (
        db.query(Customer)
        .filter(
            Customer.mobile_number == customer.mobile_number
        )
        .first()
    )

    if not db_customer:
        raise HTTPException(
            status_code=401,
            detail="Invalid Mobile Number or Password",
        )

    if not verify_password(
        customer.password,
        db_customer.password,
    ):
        raise HTTPException(
            status_code=401,
            detail="Invalid Mobile Number or Password",
        )

    access_token = create_access_token(
        {
            "sub": db_customer.customer_id
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "customer": db_customer,
    }


# In-memory OTP storage: mobile_number -> {"otp": str, "expires_at": datetime}
import random
from datetime import datetime, timedelta, timezone

OTP_STORAGE: dict = {}


@router.post(
    "/send-otp",
    response_model=SendOtpResponse,
)
def send_customer_otp(
    payload: SendOtpRequest,
    db: Session = Depends(get_db),
):
    mobile = payload.mobile_number.strip()
    if not mobile or len(mobile) < 10:
        raise HTTPException(
            status_code=400,
            detail="Please provide a valid 10-digit mobile number",
        )

    # Check if customer exists
    db_customer = (
        db.query(Customer)
        .filter(Customer.mobile_number == mobile)
        .first()
    )

    if not db_customer:
        raise HTTPException(
            status_code=404,
            detail=f"No registered customer account found with mobile number {mobile}. Please register first.",
        )

    # Generate 6-digit OTP
    generated_otp = str(random.randint(100000, 999999))
    expires_at = datetime.now(timezone.utc) + timedelta(minutes=10)

    OTP_STORAGE[mobile] = {
        "otp": generated_otp,
        "expires_at": expires_at,
    }

    return {
        "message": f"OTP sent successfully to +91 {mobile}",
        "mobile_number": mobile,
        "otp": generated_otp,
    }


@router.post(
    "/verify-otp",
    response_model=LoginResponse,
)
def verify_customer_otp(
    payload: VerifyOtpRequest,
    db: Session = Depends(get_db),
):
    mobile = payload.mobile_number.strip()
    input_otp = payload.otp.strip()

    db_customer = (
        db.query(Customer)
        .filter(Customer.mobile_number == mobile)
        .first()
    )

    if not db_customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found. Please register first.",
        )

    stored = OTP_STORAGE.get(mobile)

    # Allow master demo OTP '123456' or matching stored OTP
    is_valid = False
    if input_otp == "123456":
        is_valid = True
    elif stored and stored["otp"] == input_otp:
        if datetime.now(timezone.utc) <= stored["expires_at"]:
            is_valid = True
        else:
            raise HTTPException(
                status_code=400,
                detail="OTP has expired. Please request a new one.",
            )

    if not is_valid:
        raise HTTPException(
            status_code=400,
            detail="Invalid OTP code. Please enter the correct 6-digit OTP.",
        )

    # Clear OTP once verified
    if mobile in OTP_STORAGE:
        del OTP_STORAGE[mobile]

    access_token = create_access_token(
        {
            "sub": db_customer.customer_id
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "customer": db_customer,
    }


@router.get(
    "/profile",
    response_model=CustomerResponse,
)
def customer_profile(
    current_customer: Customer = Depends(
        get_current_customer
    ),
):
    return current_customer


