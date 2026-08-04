from sqlalchemy import Column, Integer, ForeignKey, Enum, DateTime
from sqlalchemy.sql import func

from app.database import Base


class OrderStatusHistory(Base):

    __tablename__ = "order_status_history"

    id = Column(Integer, primary_key=True, index=True)

    order_id = Column(
        Integer,
        ForeignKey("orders.id", ondelete="CASCADE"),
        nullable=False
    )

    status = Column(
        Enum(
            "Pending",
            "Confirmed",
            "Preparing",
            "Out for Delivery",
            "Delivered",
            "Cancelled",
            name="order_status_enum"
        ),
        nullable=False
    )

    updated_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )