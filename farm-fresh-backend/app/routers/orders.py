from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth import get_current_customer
from app.database import get_db

from app.models.cart import CartItem
from app.models.customer import Customer
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.order_status_history import OrderStatusHistory
from app.models.product import Product

from app.schemas.order import (
    OrderCreate,
    OrderResponse,
    OrderTrackingResponse,
    CancelOrderResponse,
    ReorderResponse,
)

router = APIRouter(
    prefix="/orders",
    tags=["Orders"]
)


# ======================================================
# PLACE ORDER
# ======================================================

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

    order_number = "ORD" + datetime.now().strftime("%Y%m%d%H%M%S")

    new_order = Order(
        order_number=order_number,
        customer_id=customer.id,

        total_amount=subtotal,
        delivery_charge=delivery_charge,
        gst=gst,
        grand_total=grand_total,

        payment_method=order.payment_method,

        payment_status="Pending",
        order_status="Pending",

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

    # Save initial tracking status
    db.add(
        OrderStatusHistory(
            order_id=new_order.id,
            status="Pending"
        )
    )

    # Create order items
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


# ======================================================
# GET MY ORDERS
# ======================================================

@router.get(
    "/my-orders",
    response_model=list[OrderResponse]
)
def get_orders(
    db: Session = Depends(get_db),
    customer: Customer = Depends(get_current_customer),
):

    orders = (
        db.query(Order)
        .filter(Order.customer_id == customer.id)
        .order_by(Order.created_at.desc())
        .all()
    )

    return orders


# ======================================================
# GET ORDER DETAILS
# ======================================================

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
# ======================================================
# ORDER TRACKING
# ======================================================

@router.get(
    "/{order_id}/tracking",
    response_model=OrderTrackingResponse
)
def track_order(
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

    history = (
        db.query(OrderStatusHistory)
        .filter(
            OrderStatusHistory.order_id == order.id
        )
        .order_by(OrderStatusHistory.updated_at.asc())
        .all()
    )

    return {
        "order_id": order.id,
        "current_status": order.order_status,
        "history": history,
    }


# ======================================================
# CANCEL ORDER
# ======================================================

@router.put(
    "/{order_id}/cancel",
    response_model=CancelOrderResponse
)
def cancel_order(
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

    if order.order_status != "Pending":
        raise HTTPException(
            status_code=400,
            detail="Only pending orders can be cancelled."
        )

    order.order_status = "Cancelled"

    db.add(
        OrderStatusHistory(
            order_id=order.id,
            status="Cancelled"
        )
    )

    db.commit()
    db.refresh(order)

    return {
        "message": "Order cancelled successfully.",
        "order_status": order.order_status,
    }


# ======================================================
# REORDER
# ======================================================

@router.post(
    "/{order_id}/reorder",
    response_model=ReorderResponse
)
def reorder_order(
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

    if order.order_status != "Delivered":
        raise HTTPException(
            status_code=400,
            detail="Only delivered orders can be reordered."
        )

    order_items = (
        db.query(OrderItem)
        .filter(OrderItem.order_id == order.id)
        .all()
    )

    if not order_items:
        raise HTTPException(
            status_code=400,
            detail="No products found in this order."
        )

    for item in order_items:

        product = (
            db.query(Product)
            .filter(Product.id == item.product_id)
            .first()
        )

        if not product:
            continue

        if product.stock <= 0:
            continue

        cart_item = (
            db.query(CartItem)
            .filter(
                CartItem.customer_id == customer.id,
                CartItem.product_id == product.id,
            )
            .first()
        )

        if cart_item:
            cart_item.quantity += item.quantity
        else:
            db.add(
                CartItem(
                    customer_id=customer.id,
                    product_id=product.id,
                    quantity=item.quantity,
                )
            )

    db.commit()

    return {
        "message": "Products added to cart successfully.",
        "new_order_id": None,
    }