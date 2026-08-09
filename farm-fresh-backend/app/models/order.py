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
        DECIMAL(10, 2),
        nullable=False
    )

    delivery_charge = Column(
        DECIMAL(10, 2),
        default=0
    )

    gst = Column(
        DECIMAL(10, 2),
        default=0
    )

    grand_total = Column(
        DECIMAL(10, 2),
        nullable=False
    )

    payment_method = Column(
        String(50),
        nullable=False
    )

    payment_status = Column(
        String(30),
        default="Pending"
    )

    order_status = Column(
        String(30),
        default="Pending"
    )

    full_name = Column(
        String(150),
        nullable=False
    )

    mobile_number = Column(
        String(20),
        nullable=False
    )

    door_street = Column(
        String(255),
        nullable=False
    )

    village = Column(
        String(150),
        nullable=False
    )

    district = Column(
        String(100),
        nullable=False
    )

    state = Column(
        String(100),
        nullable=False
    )

    pincode = Column(
        String(20),
        nullable=False
    )

    landmark = Column(
        String(255)
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    # Customer Relationship
    customer = relationship(
        "Customer",
        back_populates="orders"
    )

    # Order Items Relationship
    items = relationship(
        "OrderItem",
        back_populates="order",
        cascade="all, delete-orphan"
    )

    # Delivery Partner Foreign Key
    delivery_partner_id = Column(
        Integer,
        ForeignKey("delivery_partners.id"),
        nullable=True
    )

    # Delivery Partner Relationship
    delivery_partner = relationship(
        "DeliveryPartner",
        back_populates="orders"
    )