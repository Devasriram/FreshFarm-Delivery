from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from fastapi import Query


from app.database import get_db
from app.models.product import Product
from app.schemas.product import (
    ProductCreate,
    ProductUpdate,
    ProductResponse,
)

router = APIRouter(
    prefix="/admin/products",
    tags=["Admin Products"]
)
@router.get(
    "",
    response_model=list[ProductResponse]
)
def get_products(
    search: str | None = Query(default=None),
    db: Session = Depends(get_db),
):
    query = db.query(Product)

    if search:
        query = query.filter(
            Product.product_name.ilike(f"%{search}%")
        )

    return (
        query
        .order_by(Product.id.desc())
        .all()
    )
@router.post(
    "",
    response_model=ProductResponse
)
def create_product(
    product: ProductCreate,
    db: Session = Depends(get_db),
):

    exists = (
        db.query(Product)
        .filter(Product.product_name == product.product_name)
        .first()
    )

    if exists:
        raise HTTPException(
            status_code=400,
            detail="Product already exists."
        )

    db_product = Product(**product.model_dump())

    db.add(db_product)
    db.commit()
    db.refresh(db_product)

    return db_product
@router.put(
    "/{product_id}",
    response_model=ProductResponse
)
def update_product(
    product_id: int,
    product: ProductUpdate,
    db: Session = Depends(get_db),
):

    db_product = (
        db.query(Product)
        .filter(Product.id == product_id)
        .first()
    )

    if not db_product:
        raise HTTPException(
            status_code=404,
            detail="Product not found."
        )

    for key, value in product.model_dump().items():
        setattr(db_product, key, value)

    db.commit()
    db.refresh(db_product)

    return db_product
@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
):

    product = (
        db.query(Product)
        .filter(Product.id == product_id)
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found."
        )

    db.delete(product)
    db.commit()

    return {
        "message": "Product deleted successfully."
    }
@router.patch("/{product_id}/status")
def toggle_status(
    product_id: int,
    db: Session = Depends(get_db),
):

    product = (
        db.query(Product)
        .filter(Product.id == product_id)
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found."
        )

    product.status = not product.status

    db.commit()

    return {
        "status": product.status
    }
@router.patch("/{product_id}/stock")
def update_stock(
    product_id: int,
    stock: int,
    db: Session = Depends(get_db),
):

    product = (
        db.query(Product)
        .filter(Product.id == product_id)
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found."
        )

    product.stock = stock

    db.commit()

    return {
        "stock": product.stock
    }
