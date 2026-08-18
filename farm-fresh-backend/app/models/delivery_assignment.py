from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database import Base


class DeliveryAssignment(Base):

    __tablename__ = "delivery_assignments"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    order_id = Column(
        Integer,
        ForeignKey("orders.id", ondelete="CASCADE"),
        nullable=False
    )

    delivery_partner_id = Column(
        Integer,
        ForeignKey("delivery_partners.id", ondelete="CASCADE"),
        nullable=False
    )

    delivery_status = Column(
        String(50),
        default="Assigned",
        nullable=False
    )

    assigned_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    delivered_at = Column(
        DateTime(timezone=True),
        nullable=True
    )

    order = relationship(
        "Order"
    )

    delivery_partner = relationship(
        "DeliveryPartner",
        back_populates="assignments"
    )
