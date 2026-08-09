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

    partner_name = Column(
        String(100),
        nullable=False
    )

    mobile_number = Column(
        String(20),
        unique=True
    )

    vehicle_number = Column(
        String(30)
    )

    status = Column(
        Boolean,
        default=True
    )

    orders = relationship(
        "Order",
        back_populates="delivery_partner"
    )