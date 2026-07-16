from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Boolean

from sqlalchemy.orm import relationship

from app.database import Base


class Category(Base):

    __tablename__ = "categories"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    category_name = Column(
        String(100),
        nullable=False
    )

    category_image = Column(
        String(255)
    )

    status = Column(
        Boolean,
        default=True
    )

    products = relationship(
        "Product",
        back_populates="category"
    )