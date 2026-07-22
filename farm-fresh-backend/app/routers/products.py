from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_

from app.database import get_db
from app.models.product import Product
from app.models.category import Category
from app.schemas.product import ProductResponse

router = APIRouter(
    prefix="/products",
    tags=["Products"]
)


# -------------------------------
# Get All Products
# -------------------------------
@router.get(
    "/",
    response_model=list[ProductResponse]
)
def get_products(
    db: Session = Depends(get_db)
):
    return (
        db.query(Product)
        .filter(Product.status == True)
        .all()
    )


# -------------------------------
# Get Products By Category
# -------------------------------
@router.get(
    "/category/{category_id}",
    response_model=list[ProductResponse]
)
def get_products_by_category(
    category_id: int,
    db: Session = Depends(get_db)
):
    return (
        db.query(Product)
        .filter(
            Product.category_id == category_id,
            Product.status == True
        )
        .all()
    )


# -------------------------------
# Featured Products
# -------------------------------
@router.get(
    "/featured",
    response_model=list[ProductResponse]
)
def featured_products(
    db: Session = Depends(get_db)
):
    return (
        db.query(Product)
        .filter(
            Product.is_featured == True,
            Product.status == True
        )
        .all()
    )


# -------------------------------
# Popular Products
# -------------------------------
@router.get(
    "/popular",
    response_model=list[ProductResponse]
)
def popular_products(
    db: Session = Depends(get_db)
):
    return (
        db.query(Product)
        .filter(Product.status == True)
        .limit(10)
        .all()
    )


# -------------------------------
# Search Products
# -------------------------------
@router.get(
    "/search/{keyword}",
    response_model=list[ProductResponse]
)
def search_products(
    keyword: str,
    db: Session = Depends(get_db)
):
    return (
        db.query(Product)
        .join(Category)
        .filter(
            Product.status == True,
            or_(
                Product.product_name.ilike(f"%{keyword}%"),
                Category.category_name.ilike(f"%{keyword}%")
            )
        )
        .all()
    )


# -------------------------------
# Get Related Products
# -------------------------------
@router.get(
    "/{product_id}/related",
    response_model=list[ProductResponse]
)
def get_related_products(
    product_id: int,
    db: Session = Depends(get_db)
):
    product = (
        db.query(Product)
        .filter(
            Product.id == product_id,
            Product.status == True
        )
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product Not Found"
        )

    related_products = (
        db.query(Product)
        .filter(
            Product.category_id == product.category_id,
            Product.id != product.id,
            Product.status == True
        )
        .limit(8)
        .all()
    )

    return related_products


# -------------------------------
# Get Single Product
# KEEP THIS ROUTE LAST
# -------------------------------
@router.get(
    "/{product_id}",
    response_model=ProductResponse
)
def get_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    product = (
        db.query(Product)
        .filter(
            Product.id == product_id,
            Product.status == True
        )
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product Not Found"
        )

    return product