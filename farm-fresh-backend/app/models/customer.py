from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import DateTime

from sqlalchemy.orm import relationship

from app.database import Base


class Customer(Base):

    __tablename__ = "customers"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    customer_id = Column(
        String(30),
        unique=True
    )

    full_name = Column(
        String(150),
        nullable=False
    )

    mobile_number = Column(
        String(20),
        unique=True,
        nullable=False
    )

    email = Column(
        String(150)
    )

    village = Column(
        String(150)
    )

    password = Column(
        String(255),
        nullable=False
    )

    created_at = Column(
        DateTime
    )

    # -----------------------------
    # Relationships
    # -----------------------------

    cart_items = relationship(
        "CartItem",
        back_populates="customer",
        cascade="all, delete-orphan"
    )

    orders = relationship(
        "Order",
        back_populates="customer",
        cascade="all, delete-orphan"
    )