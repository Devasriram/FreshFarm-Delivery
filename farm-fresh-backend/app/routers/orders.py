from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth import get_current_customer
from app.database import get_db

from app.models.cart import CartItem
from app.models.customer import Customer
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.order_status_history import OrderStatusHistory
from app.models.order_tracking import OrderTracking
from app.models.delivery import DeliveryPartner
from app.models.delivery_history import DeliveryHistory
from app.models.product import Product

from app.schemas.order import (
    OrderCreate,
    OrderResponse,
    OrderTrackingResponse,
    CancelOrderResponse,
    ReorderResponse,
)
from app.schemas.order_tracking import DeliveryPartnerSummary, OrderTrackingItemResponse

router = APIRouter(
    prefix="/orders",
    tags=["Orders"]
)


# ======================================================
# PLACE ORDER
# ======================================================

@router.post(
    "",
    response_model=OrderResponse,
    status_code=status.HTTP_201_CREATED
)
@router.post(
    "/",
    response_model=OrderResponse,
    status_code=status.HTTP_201_CREATED
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
                detail=f"Insufficient stock for {product.product_name} (Only {product.stock} available)"
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
        estimated_delivery_time="Today within 2-3 hours",
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

    # Save initial tracking status into order_tracking
    db.add(
        OrderTracking(
            order_id=new_order.id,
            status="Order Placed",
            updated_by="Customer"
        )
    )

    # Legacy table sync
    db.add(
        OrderStatusHistory(
            order_id=new_order.id,
            status="Pending"
        )
    )

    # Create order items and reduce stock
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

    # Clear customer cart
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

    # Fetch from order_tracking table
    tracking_rows = (
        db.query(OrderTracking)
        .filter(OrderTracking.order_id == order.id)
        .order_by(OrderTracking.updated_at.asc())
        .all()
    )

    # Fallback to OrderStatusHistory if order_tracking is empty
    if not tracking_rows:
        legacy_rows = (
            db.query(OrderStatusHistory)
            .filter(OrderStatusHistory.order_id == order.id)
            .order_by(OrderStatusHistory.updated_at.asc())
            .all()
        )
        history = [
            OrderTrackingItemResponse(
                id=h.id,
                status=h.status,
                updated_by="System",
                updated_at=h.updated_at
            )
            for h in legacy_rows
        ]
    else:
        history = [
            OrderTrackingItemResponse(
                id=h.id,
                status=h.status,
                updated_by=h.updated_by or "System",
                updated_at=h.updated_at
            )
            for h in tracking_rows
        ]

    # Check delivery partner info
    partner_summary = None
    if order.delivery_partner_id:
        partner = (
            db.query(DeliveryPartner)
            .filter(DeliveryPartner.id == order.delivery_partner_id)
            .first()
        )
        if partner:
            partner_summary = DeliveryPartnerSummary(
                id=partner.id,
                partner_id=partner.partner_id or f"DP{partner.id:03d}",
                partner_name=partner.partner_name,
                mobile_number=partner.mobile_number,
                vehicle_number=partner.vehicle_number,
                email=partner.email,
            )

    return {
        "order_id": order.id,
        "order_number": order.order_number,
        "current_status": order.order_status,
        "estimated_delivery_time": order.estimated_delivery_time or "Today within 2-3 hours",
        "delivery_partner": partner_summary,
        "history": history,
        "created_at": order.created_at,
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

    if order.order_status not in ["Pending", "Order Placed", "Confirmed"]:
        raise HTTPException(
            status_code=400,
            detail=f"Order cannot be cancelled in '{order.order_status}' status. Please contact support."
        )

    order.order_status = "Cancelled"

    # Log to order_tracking
    db.add(
        OrderTracking(
            order_id=order.id,
            status="Cancelled",
            updated_by=f"Customer ({customer.full_name})"
        )
    )

    # Legacy table sync
    db.add(
        OrderStatusHistory(
            order_id=order.id,
            status="Cancelled"
        )
    )

    # Restock products
    items = db.query(OrderItem).filter(OrderItem.order_id == order.id).all()
    for item in items:
        prod = db.query(Product).filter(Product.id == item.product_id).first()
        if prod:
            prod.stock += item.quantity

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

    added_count = 0
    for item in order_items:
        product = (
            db.query(Product)
            .filter(Product.id == item.product_id)
            .first()
        )

        if not product or product.stock <= 0:
            continue

        cart_item = (
            db.query(CartItem)
            .filter(
                CartItem.customer_id == customer.id,
                CartItem.product_id == product.id,
            )
            .first()
        )

        qty_to_add = min(item.quantity, product.stock)
        if cart_item:
            cart_item.quantity += qty_to_add
        else:
            db.add(
                CartItem(
                    customer_id=customer.id,
                    product_id=product.id,
                    quantity=qty_to_add,
                )
            )
        added_count += 1

    if added_count == 0:
        raise HTTPException(
            status_code=400,
            detail="All products from this order are currently out of stock."
        )

    db.commit()

    return {
        "message": f"{added_count} product(s) added to cart successfully.",
        "new_order_id": None,
    }