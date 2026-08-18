from fastapi import Depends, HTTPException, status
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer

from app.config import SECRET_KEY, ALGORITHM
from app.database import get_db
from app.models.customer import Customer
from app.models.delivery import DeliveryPartner

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/customers/login"
)


def get_current_customer(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid Token",
        headers={
            "WWW-Authenticate": "Bearer"
        },
    )

    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
        )

        customer_id = payload.get("sub")

        if customer_id is None:
            raise credentials_exception

    except JWTError:
        raise credentials_exception

    customer = (
        db.query(Customer)
        .filter(
            Customer.customer_id == customer_id
        )
        .first()
    )

    if customer is None:
        raise credentials_exception

    return customer


def get_current_delivery_partner(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or Expired Delivery Partner Token",
        headers={
            "WWW-Authenticate": "Bearer"
        },
    )

    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
        )

        partner_id = payload.get("sub")
        role = payload.get("role")

        if partner_id is None:
            raise credentials_exception

    except JWTError:
        raise credentials_exception

    from sqlalchemy import func
    partner = (
        db.query(DeliveryPartner)
        .filter(
            (func.trim(DeliveryPartner.partner_id) == str(partner_id).strip()) |
            (func.trim(DeliveryPartner.mobile_number) == str(partner_id).strip()) |
            (DeliveryPartner.partner_id == str(partner_id).strip()) |
            (DeliveryPartner.mobile_number == str(partner_id).strip())
        )
        .first()
    )

    if partner is None:
        raise credentials_exception

    if not partner.status:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your delivery partner account is currently disabled. Please contact admin.",
        )

    return partner