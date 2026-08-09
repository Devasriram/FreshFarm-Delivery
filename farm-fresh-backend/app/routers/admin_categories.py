from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.category import Category
from app.schemas.category import (
    CategoryCreate,
    CategoryUpdate,
    CategoryResponse,
)

router = APIRouter(
    prefix="/admin/categories",
    tags=["Admin Categories"]
)
@router.get(
    "",
    response_model=list[CategoryResponse]
)
def get_categories(db: Session = Depends(get_db)):
    return (
        db.query(Category)
        .order_by(Category.id.desc())
        .all()
    )
@router.post(
    "",
    response_model=CategoryResponse
)
def create_category(
    category: CategoryCreate,
    db: Session = Depends(get_db),
):
    exists = (
        db.query(Category)
        .filter(Category.category_name == category.category_name)
        .first()
    )

    if exists:
        raise HTTPException(
            status_code=400,
            detail="Category already exists."
        )

    new_category = Category(**category.model_dump())

    db.add(new_category)
    db.commit()
    db.refresh(new_category)

    return new_category
@router.put(
    "/{category_id}",
    response_model=CategoryResponse
)
def update_category(
    category_id: int,
    category: CategoryUpdate,
    db: Session = Depends(get_db),
):
    db_category = (
        db.query(Category)
        .filter(Category.id == category_id)
        .first()
    )

    if not db_category:
        raise HTTPException(
            status_code=404,
            detail="Category not found."
        )

    for key, value in category.model_dump().items():
        setattr(db_category, key, value)

    db.commit()
    db.refresh(db_category)

    return db_category
@router.delete("/{category_id}")
def delete_category(
    category_id: int,
    db: Session = Depends(get_db),
):
    category = (
        db.query(Category)
        .filter(Category.id == category_id)
        .first()
    )

    if not category:
        raise HTTPException(
            status_code=404,
            detail="Category not found."
        )

    db.delete(category)
    db.commit()

    return {
        "message": "Category deleted successfully."
    }
@router.patch("/{category_id}/status")
def toggle_category_status(
    category_id: int,
    db: Session = Depends(get_db),
):
    category = (
        db.query(Category)
        .filter(Category.id == category_id)
        .first()
    )

    if not category:
        raise HTTPException(
            status_code=404,
            detail="Category not found."
        )

    category.status = not category.status

    db.commit()

    return {
        "status": category.status
    }