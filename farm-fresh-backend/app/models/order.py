from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import DECIMAL
from sqlalchemy import ForeignKey
from sqlalchemy import DateTime
from sqlalchemy.sql import func

from sqlalchemy.orm import relationship

from app.database import Base


class Order(Base):

    __tablename__ = "orders"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    order_number = Column(
        String(30),
        unique=True,
        nullable=False
    )

    customer_id = Column(
        Integer,
        ForeignKey("customers.id"),
        nullable=False
    )

    total_amount = Column(
        DECIMAL(10,2),
        nullable=False
    )

    delivery_charge = Column(
        DECIMAL(10,2),
        default=0
    )

    gst = Column(
        DECIMAL(10,2),
        default=0
    )

    grand_total = Column(
        DECIMAL(10,2),
        nullable=False
    )

    payment_method = Column(
        String(50)
    )

    payment_status = Column(
        String(30),
        default="Pending"
    )

    order_status = Column(
        String(30),
        default="Placed"
    )

    full_name = Column(
        String(150)
    )

    mobile = Column(
        String(20)
    )

    email = Column(
        String(150)
    )

    house_no = Column(
        String(100)
    )

    street = Column(
        String(150)
    )

    village = Column(
        String(150)
    )

    city = Column(
        String(100)
    )

    district = Column(
        String(100)
    )

    state = Column(
        String(100)
    )

    pincode = Column(
        String(20)
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    customer = relationship(
        "Customer",
        back_populates="orders"
    )

    items = relationship(
        "OrderItem",
        back_populates="order",
        cascade="all, delete-orphan"
    )