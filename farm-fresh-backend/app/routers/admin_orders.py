from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db

from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.customer import Customer
from app.models.product import Product
from app.models.delivery import DeliveryPartner

router = APIRouter(
    prefix="/admin/orders",
    tags=["Admin Orders"]
)


# --------------------------------------------------
# Get All Orders
# --------------------------------------------------

@router.get("")
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

        result.append({
            "id": order.id,
            "order_number": order.order_number,
            "customer_name": customer.full_name if customer else "",
            "payment_method": order.payment_method,
            "payment_status": order.payment_status,
            "order_status": order.order_status,
            "total_amount": order.grand_total,
            "created_at": order.created_at
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

            "product_name":
                product.product_name if product else "",

            "price": item.price,

            "quantity": item.quantity,

            "total": item.total

        })

    return {

        "id": order.id,

        "order_number": order.order_number,

        "customer_name": customer.full_name,

        "mobile_number": customer.mobile_number,

        "email": customer.email,

        "village": customer.village,

        "payment_method": order.payment_method,

        "payment_status": order.payment_status,

        "order_status": order.order_status,

        "grand_total": order.grand_total,

        "delivery_partner_id": order.delivery_partner_id,

        "created_at": order.created_at,

        "items": order_items

    }


# --------------------------------------------------
# Update Order Status
# --------------------------------------------------

@router.patch("/{order_id}/status")
def update_status(
    order_id: int,
    body: dict,
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

    order.order_status = body["status"]

    db.commit()
    db.refresh(order)

    return {
    "message": "Order status updated",
    "status": order.order_status
    }

# --------------------------------------------------
# Assign Delivery Partner
# --------------------------------------------------

@router.patch("/{order_id}/assign")
def assign_partner(
    order_id: int,
    body: dict,
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

    partner = (
        db.query(DeliveryPartner)
        .filter(
            DeliveryPartner.id ==
            body["delivery_partner_id"]
        )
        .first()
    )

    if not partner:
        raise HTTPException(
            status_code=404,
            detail="Delivery Partner not found"
        )

    order.delivery_partner_id = partner.id

    db.commit()

    return {
        "message": "Delivery Partner Assigned"
    }
