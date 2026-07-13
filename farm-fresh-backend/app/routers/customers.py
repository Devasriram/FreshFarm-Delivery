from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.customer import Customer
from app.schemas import (
    CustomerRegister,
    CustomerLogin,
    CustomerResponse,
    LoginResponse,
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