from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database import Base


class DeliveryHistory(Base):
    __tablename__ = "delivery_history"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    order_id = Column(
        Integer,
        ForeignKey("orders.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    delivery_partner_id = Column(
        Integer,
        ForeignKey("delivery_partners.id", ondelete="CASCADE"),
        nullable=False,
        index=True
    )

    delivery_status = Column(
        String(50),
        default="Assigned",
        nullable=False
    )

    delivered_at = Column(
        DateTime(timezone=True),
        nullable=True
    )

    assigned_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    # Relationships
    order = relationship("Order", back_populates="delivery_history_records")
    delivery_partner = relationship("DeliveryPartner", back_populates="delivery_histories")
