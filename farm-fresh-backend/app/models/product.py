from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Text
from sqlalchemy import Boolean
from sqlalchemy import DECIMAL
from sqlalchemy import ForeignKey

from sqlalchemy.orm import relationship

from app.database import Base


class Product(Base):

    __tablename__ = "products"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    category_id = Column(
        Integer,
        ForeignKey("categories.id")
    )

    product_name = Column(
        String(150),
        nullable=False
    )

    description = Column(
        Text
    )

    product_image = Column(
        String(255)
    )

    price = Column(
        DECIMAL(10, 2)
    )

    stock = Column(
        Integer
    )

    unit = Column(
        String(30)
    )

    is_featured = Column(
        Boolean,
        default=False
    )

    status = Column(
        Boolean,
        default=True
    )

    # ---------------------------
    # Relationships
    # ---------------------------

    category = relationship(
        "Category",
        back_populates="products"
    )

    cart_items = relationship(
        "CartItem",
        back_populates="product",
        cascade="all, delete-orphan"
    )

    order_items = relationship(
        "OrderItem",
        back_populates="product",
        cascade="all, delete-orphan"
    )