from fastapi import Depends, HTTPException, status

from jose import JWTError, jwt

from sqlalchemy.orm import Session

from app.config import SECRET_KEY, ALGORITHM

from app.database import get_db

from app.models.customer import Customer

from fastapi.security import OAuth2PasswordBearer

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