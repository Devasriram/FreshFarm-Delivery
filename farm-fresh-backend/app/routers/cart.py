from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.database import get_db

from app.auth import get_current_customer

from app.models.customer import Customer
from app.models.product import Product
from app.models.cart import CartItem

from app.schemas.cart import (
    CartItemCreate,
    CartItemUpdate,
    CartItemResponse
)

router = APIRouter(
    prefix="/cart",
    tags=["Cart"]
)

@router.post("/add")
def add_to_cart(
    item: CartItemCreate,
    db: Session = Depends(get_db),
    customer: Customer = Depends(get_current_customer)
):

    product = (
        db.query(Product)
        .filter(Product.id == item.product_id)
        .first()
    )

    if not product:
        raise HTTPException(
            status_code=404,
            detail="Product not found"
        )

    cart_item = (
        db.query(CartItem)
        .filter(
            CartItem.customer_id == customer.id,
            CartItem.product_id == item.product_id
        )
        .first()
    )

    if cart_item:
        cart_item.quantity += item.quantity

    else:
        cart_item = CartItem(
            customer_id=customer.id,
            product_id=item.product_id,
            quantity=item.quantity
        )

        db.add(cart_item)

    db.commit()

    return {
        "message": "Product added to cart"
    }

@router.get(
    "/",
    response_model=list[CartItemResponse]
)
def get_cart(
    db: Session = Depends(get_db),
    customer: Customer = Depends(get_current_customer)
):

    return (
        db.query(CartItem)
        .filter(
            CartItem.customer_id == customer.id
        )
        .all()
    )

@router.put("/update/{cart_id}")
def update_cart(
    cart_id: int,
    item: CartItemUpdate,
    db: Session = Depends(get_db),
    customer: Customer = Depends(get_current_customer)
):

    cart = (
        db.query(CartItem)
        .filter(
            CartItem.id == cart_id,
            CartItem.customer_id == customer.id
        )
        .first()
    )

    if not cart:
        raise HTTPException(
            status_code=404,
            detail="Cart Item not found"
        )

    cart.quantity = item.quantity

    db.commit()

    db.refresh(cart)

    return {
        "message": "Quantity Updated"
    }

@router.delete("/remove/{cart_id}")
def remove_cart_item(
    cart_id: int,
    db: Session = Depends(get_db),
    customer: Customer = Depends(get_current_customer)
):

    cart = (
        db.query(CartItem)
        .filter(
            CartItem.id == cart_id,
            CartItem.customer_id == customer.id
        )
        .first()
    )

    if not cart:
        raise HTTPException(
            status_code=404,
            detail="Cart Item not found"
        )

    db.delete(cart)

    db.commit()

    return {
        "message": "Item Removed"
    }

@router.delete("/clear")
def clear_cart(
    db: Session = Depends(get_db),
    customer: Customer = Depends(get_current_customer)
):

    (
        db.query(CartItem)
        .filter(
            CartItem.customer_id == customer.id
        )
        .delete()
    )

    db.commit()

    return {
        "message": "Cart Cleared"
    }

