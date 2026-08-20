from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Boolean
from sqlalchemy.orm import relationship

from app.database import Base

class DeliveryPartner(Base):

    __tablename__ = "delivery_partners"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    partner_id = Column(
        String(30),
        unique=True,
        index=True,
        nullable=True
    )

    partner_name = Column(
        String(100),
        nullable=False
    )

    mobile_number = Column(
        String(20),
        unique=True,
        nullable=False
    )

    email = Column(
        String(150),
        unique=True,
        nullable=True
    )

    password = Column(
        String(255),
        nullable=True
    )

    vehicle_number = Column(
        String(30),
        nullable=True
    )

    status = Column(
        Boolean,
        default=True
    )

    availability_status = Column(
        String(30),
        default="Available"
    )

    orders = relationship(
        "Order",
        back_populates="delivery_partner"
    )

    assignments = relationship(
        "DeliveryAssignment",
        back_populates="delivery_partner",
        cascade="all, delete-orphan"
    )

    delivery_histories = relationship(
        "DeliveryHistory",
        back_populates="delivery_partner",
        cascade="all, delete-orphan"
    )