from fastapi import APIRouter, Depends, HTTPException
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


# --------------------------------
# Add Product To Cart
# --------------------------------
@router.post("/add")
def add_to_cart(
    item: CartItemCreate,
    db: Session = Depends(get_db),
    customer: Customer = Depends(get_current_customer)
):

    if item.quantity <= 0:
        raise HTTPException(
            status_code=400,
            detail="Quantity must be greater than zero"
        )

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

    if product.stock < item.quantity:
        raise HTTPException(
            status_code=400,
            detail="Insufficient stock"
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

        new_quantity = cart_item.quantity + item.quantity

        if new_quantity > product.stock:
            raise HTTPException(
                status_code=400,
                detail="Quantity exceeds available stock"
            )

        cart_item.quantity = new_quantity

    else:

        cart_item = CartItem(
            customer_id=customer.id,
            product_id=item.product_id,
            quantity=item.quantity
        )

        db.add(cart_item)

    db.commit()
    db.refresh(cart_item)

    return {
        "message": "Product added to cart successfully"
    }


# --------------------------------
# Get Cart Items
# --------------------------------
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


# --------------------------------
# Update Cart Quantity
# --------------------------------
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

    if item.quantity <= 0:
        raise HTTPException(
            status_code=400,
            detail="Quantity must be greater than zero"
        )

    product = (
        db.query(Product)
        .filter(Product.id == cart.product_id)
        .first()
    )

    if item.quantity > product.stock:
        raise HTTPException(
            status_code=400,
            detail="Insufficient stock"
        )

    cart.quantity = item.quantity

    db.commit()
    db.refresh(cart)

    return {
        "message": "Quantity Updated Successfully"
    }


# --------------------------------
# Remove Cart Item
# --------------------------------
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
        "message": "Item Removed Successfully"
    }


# --------------------------------
# Clear Cart
# --------------------------------
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
        "message": "Cart Cleared Successfully"
    }


# --------------------------------
# Cart Summary
# --------------------------------
@router.get("/summary")
def cart_summary(
    db: Session = Depends(get_db),
    customer: Customer = Depends(get_current_customer)
):

    cart_items = (
        db.query(CartItem)
        .filter(
            CartItem.customer_id == customer.id
        )
        .all()
    )

    total_items = 0
    subtotal = 0

    for item in cart_items:
        total_items += item.quantity
        subtotal += item.product.price * item.quantity

    delivery_charge = 0 if subtotal >= 500 else 50

    grand_total = subtotal + delivery_charge

    return {
        "total_items": total_items,
        "subtotal": subtotal,
        "delivery_charge": delivery_charge,
        "grand_total": grand_total
    }