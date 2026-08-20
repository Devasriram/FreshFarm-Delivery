from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

from app.database import Base


class OrderTracking(Base):
    __tablename__ = "order_tracking"

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

    status = Column(
        String(50),
        nullable=False
    )

    updated_by = Column(
        String(100),
        default="System",
        nullable=True
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False
    )

    # Relationship to Order
    order = relationship(
        "Order",
        back_populates="tracking_history"
    )
