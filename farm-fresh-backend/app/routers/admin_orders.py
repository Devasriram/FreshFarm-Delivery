from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from sqlalchemy.sql import func

from app.database import get_db

from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.customer import Customer
from app.models.product import Product
from app.models.delivery import DeliveryPartner
from app.models.delivery_assignment import DeliveryAssignment
from app.models.order_status_history import OrderStatusHistory
from app.models.order_tracking import OrderTracking
from app.models.delivery_history import DeliveryHistory

router = APIRouter(
    prefix="/admin/orders",
    tags=["Admin Orders"]
)


# --------------------------------------------------
# Get All Orders (with Delivery Partner & Products)
# --------------------------------------------------

@router.get("")
@router.get("/")
def get_orders(
    db: Session = Depends(get_db)
):
    orders = (
        db.query(Order)
        .order_by(Order.id.desc())
        .all()
    )

    result = []

    for order in orders:
        customer = (
            db.query(Customer)
            .filter(Customer.id == order.customer_id)
            .first()
        )

        delivery_partner = None
        if order.delivery_partner_id:
            dp = (
                db.query(DeliveryPartner)
                .filter(DeliveryPartner.id == order.delivery_partner_id)
                .first()
            )
            if dp:
                delivery_partner = {
                    "id": dp.id,
                    "partner_id": dp.partner_id or f"DP{dp.id:03d}",
                    "partner_name": dp.partner_name,
                    "mobile_number": dp.mobile_number,
                    "vehicle_number": dp.vehicle_number,
                }

        items = (
            db.query(OrderItem)
            .filter(OrderItem.order_id == order.id)
            .all()
        )

        products_list = []
        for item in items:
            p = db.query(Product).filter(Product.id == item.product_id).first()
            products_list.append({
                "id": item.id,
                "product_name": p.product_name if p else "Product",
                "quantity": item.quantity,
                "price": float(item.price),
                "total": float(item.total),
            })

        result.append({
            "id": order.id,
            "order_number": order.order_number,
            "customer_name": customer.full_name if customer else order.full_name,
            "mobile_number": order.mobile_number,
            "delivery_partner": delivery_partner,
            "delivery_partner_id": order.delivery_partner_id,
            "products": products_list,
            "item_count": len(products_list),
            "payment_method": order.payment_method,
            "payment_status": order.payment_status,
            "order_status": order.order_status,
            "estimated_delivery_time": order.estimated_delivery_time or "Today within 2-3 hours",
            "total_amount": float(order.grand_total),
            "created_at": order.created_at,
        })

    return result


# --------------------------------------------------
# Get Order Details
# --------------------------------------------------

@router.get("/{order_id}")
def get_order_details(
    order_id: int,
    db: Session = Depends(get_db)
):
    order = (
        db.query(Order)
        .filter(Order.id == order_id)
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    customer = (
        db.query(Customer)
        .filter(Customer.id == order.customer_id)
        .first()
    )

    items = (
        db.query(OrderItem)
        .filter(OrderItem.order_id == order.id)
        .all()
    )

    order_items = []
    for item in items:
        product = (
            db.query(Product)
            .filter(Product.id == item.product_id)
            .first()
        )

        order_items.append({
            "id": item.id,
            "product_name": product.product_name if product else "",
            "product_image": product.product_image if product else None,
            "unit": product.unit if product else "",
            "price": float(item.price),
            "quantity": item.quantity,
            "total": float(item.total),
        })

    delivery_partner = None
    if order.delivery_partner_id:
        dp = (
            db.query(DeliveryPartner)
            .filter(DeliveryPartner.id == order.delivery_partner_id)
            .first()
        )
        if dp:
            delivery_partner = {
                "id": dp.id,
                "partner_id": dp.partner_id or f"DP{dp.id:03d}",
                "partner_name": dp.partner_name,
                "mobile_number": dp.mobile_number,
                "vehicle_number": dp.vehicle_number,
                "email": dp.email,
            }

    # Tracking timeline
    tracking_records = (
        db.query(OrderTracking)
        .filter(OrderTracking.order_id == order.id)
        .order_by(OrderTracking.updated_at.asc())
        .all()
    )

    timeline = [
        {
            "id": t.id,
            "status": t.status,
            "updated_by": t.updated_by or "System",
            "updated_at": t.updated_at,
        }
        for t in tracking_records
    ]

    return {
        "id": order.id,
        "order_number": order.order_number,
        "customer_id": order.customer_id,
        "customer_name": customer.full_name if customer else order.full_name,
        "mobile_number": order.mobile_number,
        "email": customer.email if customer else None,
        "door_street": order.door_street,
        "village": order.village,
        "district": order.district,
        "state": order.state,
        "pincode": order.pincode,
        "landmark": order.landmark,
        "payment_method": order.payment_method,
        "payment_status": order.payment_status,
        "order_status": order.order_status,
        "estimated_delivery_time": order.estimated_delivery_time or "Today within 2-3 hours",
        "subtotal": float(order.total_amount),
        "delivery_charge": float(order.delivery_charge),
        "gst": float(order.gst),
        "grand_total": float(order.grand_total),
        "delivery_partner_id": order.delivery_partner_id,
        "delivery_partner": delivery_partner,
        "created_at": order.created_at,
        "items": order_items,
        "timeline": timeline,
    }


# --------------------------------------------------
# Update Order Status (Admin)
# --------------------------------------------------

@router.patch("/{order_id}/status")
@router.put("/{order_id}/status")
def update_status(
    order_id: int,
    body: dict = Body(...),
    db: Session = Depends(get_db)
):
    order = (
        db.query(Order)
        .filter(Order.id == order_id)
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    new_status = body.get("status")
    if not new_status:
        raise HTTPException(status_code=400, detail="Status is required")

    order.order_status = new_status

    if "estimated_delivery_time" in body and body["estimated_delivery_time"]:
        order.estimated_delivery_time = body["estimated_delivery_time"]

    if new_status == "Delivered":
        if order.payment_method.lower() in ["cod", "cash on delivery"]:
            order.payment_status = "Paid"

    # Add to order_tracking
    db.add(
        OrderTracking(
            order_id=order.id,
            status=new_status,
            updated_by="Admin"
        )
    )

    # Legacy table sync
    db.add(
        OrderStatusHistory(
            order_id=order.id,
            status=new_status
        )
    )

    # Update delivery_history / assignments if exists
    if order.delivery_partner_id:
        dh = (
            db.query(DeliveryHistory)
            .filter(DeliveryHistory.order_id == order.id)
            .first()
        )
        if dh:
            dh.delivery_status = new_status
            if new_status == "Delivered":
                dh.delivered_at = func.now()

        da = (
            db.query(DeliveryAssignment)
            .filter(DeliveryAssignment.order_id == order.id)
            .first()
        )
        if da:
            da.delivery_status = new_status
            if new_status == "Delivered":
                da.delivered_at = func.now()

    db.commit()
    db.refresh(order)

    return {
        "message": "Order status updated successfully",
        "status": order.order_status,
        "estimated_delivery_time": order.estimated_delivery_time,
    }


# --------------------------------------------------
# Assign Delivery Partner (Admin)
# --------------------------------------------------

@router.patch("/{order_id}/assign")
@router.post("/{order_id}/assign")
def assign_partner(
    order_id: int,
    body: dict = Body(...),
    db: Session = Depends(get_db)
):
    order = (
        db.query(Order)
        .filter(Order.id == order_id)
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    partner_id = body.get("delivery_partner_id")
    if not partner_id:
        raise HTTPException(status_code=400, detail="delivery_partner_id is required")

    partner = (
        db.query(DeliveryPartner)
        .filter(DeliveryPartner.id == partner_id)
        .first()
    )

    if not partner:
        raise HTTPException(
            status_code=404,
            detail="Delivery Partner not found"
        )

    order.delivery_partner_id = partner.id

    # If pending, update status to Confirmed
    if order.order_status == "Pending":
        order.order_status = "Confirmed"

    if "estimated_delivery_time" in body and body["estimated_delivery_time"]:
        order.estimated_delivery_time = body["estimated_delivery_time"]

    # Log to order_tracking
    db.add(
        OrderTracking(
            order_id=order.id,
            status=f"Assigned to {partner.partner_name} ({partner.partner_id or partner.id})",
            updated_by="Admin"
        )
    )

    # Record in delivery_history table
    dh = (
        db.query(DeliveryHistory)
        .filter(DeliveryHistory.order_id == order.id)
        .first()
    )
    if dh:
        dh.delivery_partner_id = partner.id
        dh.delivery_status = "Assigned"
        dh.assigned_at = func.now()
    else:
        db.add(
            DeliveryHistory(
                order_id=order.id,
                delivery_partner_id=partner.id,
                delivery_status="Assigned",
                assigned_at=func.now()
            )
        )

    # Sync legacy DeliveryAssignment table
    da = (
        db.query(DeliveryAssignment)
        .filter(DeliveryAssignment.order_id == order.id)
        .first()
    )
    if da:
        da.delivery_partner_id = partner.id
        da.delivery_status = "Assigned"
        da.assigned_at = func.now()
    else:
        db.add(
            DeliveryAssignment(
                order_id=order.id,
                delivery_partner_id=partner.id,
                delivery_status="Assigned"
            )
        )

    db.commit()
    db.refresh(order)

    return {
        "message": f"Order #{order.order_number} successfully assigned to {partner.partner_name}",
        "order_id": order.id,
        "delivery_partner_id": partner.id,
        "delivery_partner_name": partner.partner_name,
        "order_status": order.order_status,
    }


# --------------------------------------------------
# Get Delivery Timeline (Admin)
# --------------------------------------------------

@router.get("/{order_id}/timeline")
def get_order_timeline(
    order_id: int,
    db: Session = Depends(get_db)
):
    order = (
        db.query(Order)
        .filter(Order.id == order_id)
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    tracking_rows = (
        db.query(OrderTracking)
        .filter(OrderTracking.order_id == order.id)
        .order_by(OrderTracking.updated_at.asc())
        .all()
    )

    partner = None
    if order.delivery_partner_id:
        partner = (
            db.query(DeliveryPartner)
            .filter(DeliveryPartner.id == order.delivery_partner_id)
            .first()
        )

    timeline = [
        {
            "id": t.id,
            "status": t.status,
            "updated_by": t.updated_by or "System",
            "updated_at": t.updated_at,
        }
        for t in tracking_rows
    ]

    return {
        "order_id": order.id,
        "order_number": order.order_number,
        "current_status": order.order_status,
        "estimated_delivery_time": order.estimated_delivery_time,
        "created_at": order.created_at,
        "delivery_partner": {
            "id": partner.id,
            "partner_name": partner.partner_name,
            "partner_id": partner.partner_id,
            "mobile_number": partner.mobile_number,
        } if partner else None,
        "timeline": timeline,
    }


# --------------------------------------------------
# Cancel Order (Admin)
# --------------------------------------------------

@router.put("/{order_id}/cancel")
@router.patch("/{order_id}/cancel")
def cancel_order_admin(
    order_id: int,
    body: dict = Body(default={}),
    db: Session = Depends(get_db)
):
    order = (
        db.query(Order)
        .filter(Order.id == order_id)
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found"
        )

    if order.order_status == "Delivered":
        raise HTTPException(
            status_code=400,
            detail="Delivered orders cannot be cancelled."
        )

    order.order_status = "Cancelled"

    reason = body.get("reason", "Cancelled by Admin")

    # Add to order_tracking
    db.add(
        OrderTracking(
            order_id=order.id,
            status=f"Cancelled ({reason})",
            updated_by="Admin"
        )
    )

    # Restock products
    items = db.query(OrderItem).filter(OrderItem.order_id == order.id).all()
    for item in items:
        p = db.query(Product).filter(Product.id == item.product_id).first()
        if p:
            p.stock += item.quantity

    db.commit()
    db.refresh(order)

    return {
        "message": f"Order #{order.order_number} cancelled successfully.",
        "order_status": order.order_status,
    }
