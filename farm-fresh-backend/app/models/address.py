from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship

from app.database import Base


class CustomerAddress(Base):
    __tablename__ = "customer_addresses"

    id = Column(Integer, primary_key=True, index=True)

    customer_id = Column(
        Integer,
        ForeignKey("customers.id"),
        nullable=False
    )

    full_name = Column(String(150), nullable=False)

    mobile_number = Column(String(20), nullable=False)

    door_street = Column(String(255), nullable=False)

    village = Column(String(150), nullable=False)

    district = Column(String(150), nullable=False)

    state = Column(String(150), nullable=False)

    pincode = Column(String(10), nullable=False)

    landmark = Column(String(255), nullable=True)

    is_default = Column(Boolean, default=False)

    customer = relationship(
        "Customer",
        back_populates="addresses"
    )