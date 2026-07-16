from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models.category import Category
from app.models.product import Product

router = APIRouter(
    prefix="/categories",
    tags=["Categories"]
)


@router.get("/")
def get_categories(
    db: Session = Depends(get_db)
):

    rows = (
        db.query(
            Category.id,
            Category.category_name,
            Category.category_image,
            func.count(Product.id).label("product_count")
        )
        .outerjoin(
            Product,
            Product.category_id == Category.id
        )
        .filter(Category.status == True)
        .group_by(
            Category.id,
            Category.category_name,
            Category.category_image
        )
        .order_by(Category.id)
        .all()
    )

    categories = []

    for row in rows:
        categories.append(
            {
                "id": row.id,
                "category_name": row.category_name,
                "category_image": row.category_image,
                "product_count": row.product_count,
            }
        )

    return categories