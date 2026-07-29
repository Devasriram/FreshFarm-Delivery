from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth import get_current_customer
from app.database import get_db

from app.models.cart import CartItem
from app.models.customer import Customer
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.product import Product

from app.schemas.order import (
    OrderCreate,
    OrderResponse,
)

router = APIRouter(
    prefix="/orders",
    tags=["Orders"]
)


@router.post(
    "/",
    response_model=OrderResponse
)
def place_order(
    order: OrderCreate,
    db: Session = Depends(get_db),
    customer: Customer = Depends(get_current_customer),
):

    cart_items = (
        db.query(CartItem)
        .filter(CartItem.customer_id == customer.id)
        .all()
    )

    if not cart_items:
        raise HTTPException(
            status_code=400,
            detail="Cart is empty."
        )

    subtotal = 0

    # Validate stock
    for cart in cart_items:

        product = (
            db.query(Product)
            .filter(Product.id == cart.product_id)
            .first()
        )

        if not product:
            raise HTTPException(
                status_code=404,
                detail=f"Product {cart.product_id} not found."
            )

        if product.stock < cart.quantity:
            raise HTTPException(
                status_code=400,
                detail=f"Insufficient stock for {product.product_name}"
            )

        subtotal += float(product.price) * cart.quantity

    delivery_charge = 0 if subtotal >= 500 else 50
    gst = round(subtotal * 0.05, 2)
    grand_total = subtotal + delivery_charge + gst

    order_number = (
        "ORD" + datetime.now().strftime("%Y%m%d%H%M%S")
    )

    new_order = Order(
        order_number=order_number,
        customer_id=customer.id,

        total_amount=subtotal,
        delivery_charge=delivery_charge,
        gst=gst,
        grand_total=grand_total,

        payment_method=order.payment_method,

        full_name=order.full_name,
        mobile_number=order.mobile_number,
        door_street=order.door_street,
        village=order.village,
        district=order.district,
        state=order.state,
        pincode=order.pincode,
        landmark=order.landmark,
    )

    db.add(new_order)
    db.flush()

    for cart in cart_items:

        product = (
            db.query(Product)
            .filter(Product.id == cart.product_id)
            .first()
        )

        order_item = OrderItem(
            order_id=new_order.id,
            product_id=product.id,
            quantity=cart.quantity,
            price=product.price,
            total=float(product.price) * cart.quantity,
        )

        db.add(order_item)

        product.stock -= cart.quantity

    (
        db.query(CartItem)
        .filter(CartItem.customer_id == customer.id)
        .delete()
    )

    db.commit()
    db.refresh(new_order)

    return new_order


@router.get(
    "/",
    response_model=list[OrderResponse]
)
def get_orders(
    db: Session = Depends(get_db),
    customer: Customer = Depends(get_current_customer),
):

    return (
        db.query(Order)
        .filter(Order.customer_id == customer.id)
        .order_by(Order.created_at.desc())
        .all()
    )


@router.get(
    "/{order_id}",
    response_model=OrderResponse
)
def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    customer: Customer = Depends(get_current_customer),
):

    order = (
        db.query(Order)
        .filter(
            Order.id == order_id,
            Order.customer_id == customer.id,
        )
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found."
        )

    return order