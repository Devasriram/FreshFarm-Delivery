from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models.delivery import DeliveryPartner
from app.models.delivery_assignment import DeliveryAssignment
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.product import Product
from app.models.customer import Customer
from app.models.order_status_history import OrderStatusHistory
from app.security import hash_password
from app.utils.partner_id import generate_partner_id
from app.schemas.delivery import (
    DeliveryPartnerCreate,
    DeliveryPartnerUpdate,
    DeliveryPartnerResponse,
    AssignOrderRequest,
)

router = APIRouter(
    prefix="/admin/delivery",
    tags=["Admin Delivery"]
)


# --------------------------------------------------
# Get All Delivery Partners with Assigned Counts
# --------------------------------------------------
@router.get("", response_model=list[DeliveryPartnerResponse])
@router.get("/", response_model=list[DeliveryPartnerResponse])
def get_delivery_partners(db: Session = Depends(get_db)):
    partners = (
        db.query(DeliveryPartner)
        .order_by(DeliveryPartner.id.desc())
        .all()
    )

    result = []
    for partner in partners:
        # Auto-assign partner_id if legacy record didn't have one
        if not partner.partner_id:
            partner.partner_id = f"DP{partner.id:03d}"
            db.commit()
            db.refresh(partner)

        assigned_count = (
            db.query(func.count(Order.id))
            .filter(
                Order.delivery_partner_id == partner.id,
                Order.order_status.notin_(["Delivered", "Cancelled"])
            )
            .scalar()
        ) or 0

        result.append(
            DeliveryPartnerResponse(
                id=partner.id,
                partner_id=partner.partner_id,
                partner_name=partner.partner_name,
                mobile_number=partner.mobile_number,
                email=partner.email,
                vehicle_number=partner.vehicle_number,
                status=partner.status,
                availability_status=partner.availability_status or "Available",
                assigned_orders_count=assigned_count,
            )
        )

    return result


# --------------------------------------------------
# Create Delivery Partner
# --------------------------------------------------
@router.post("", response_model=DeliveryPartnerResponse, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=DeliveryPartnerResponse, status_code=status.HTTP_201_CREATED)
def create_delivery_partner(
    partner_data: DeliveryPartnerCreate,
    db: Session = Depends(get_db),
):
    existing_mobile = (
        db.query(DeliveryPartner)
        .filter(DeliveryPartner.mobile_number == partner_data.mobile_number)
        .first()
    )
    if existing_mobile:
        raise HTTPException(
            status_code=400,
            detail="Mobile number already registered for a delivery partner",
        )

    if partner_data.email:
        existing_email = (
            db.query(DeliveryPartner)
            .filter(DeliveryPartner.email == partner_data.email)
            .first()
        )
        if existing_email:
            raise HTTPException(
                status_code=400,
                detail="Email address already registered for a delivery partner",
            )

    password_raw = partner_data.password if partner_data.password else "123456"
    new_partner_id = generate_partner_id(db)

    new_partner = DeliveryPartner(
        partner_id=new_partner_id,
        partner_name=partner_data.partner_name,
        mobile_number=partner_data.mobile_number,
        email=partner_data.email,
        password=hash_password(password_raw),
        vehicle_number=partner_data.vehicle_number,
        status=True,
        availability_status=partner_data.availability_status or "Available",
    )

    db.add(new_partner)
    db.commit()
    db.refresh(new_partner)

    return DeliveryPartnerResponse(
        id=new_partner.id,
        partner_id=new_partner.partner_id,
        partner_name=new_partner.partner_name,
        mobile_number=new_partner.mobile_number,
        email=new_partner.email,
        vehicle_number=new_partner.vehicle_number,
        status=new_partner.status,
        availability_status=new_partner.availability_status,
        assigned_orders_count=0,
    )


# --------------------------------------------------
# Update Delivery Partner Details
# --------------------------------------------------
@router.put("/{partner_id}", response_model=DeliveryPartnerResponse)
def update_delivery_partner(
    partner_id: int,
    partner_data: DeliveryPartnerUpdate,
    db: Session = Depends(get_db),
):
    partner = (
        db.query(DeliveryPartner)
        .filter(DeliveryPartner.id == partner_id)
        .first()
    )

    if not partner:
        raise HTTPException(
            status_code=404,
            detail="Delivery partner not found",
        )

    if partner_data.partner_name is not None:
        partner.partner_name = partner_data.partner_name
    if partner_data.mobile_number is not None:
        partner.mobile_number = partner_data.mobile_number
    if partner_data.email is not None:
        partner.email = partner_data.email
    if partner_data.vehicle_number is not None:
        partner.vehicle_number = partner_data.vehicle_number
    if partner_data.status is not None:
        partner.status = partner_data.status
    if partner_data.availability_status is not None:
        partner.availability_status = partner_data.availability_status
    if partner_data.password:
        partner.password = hash_password(partner_data.password)

    db.commit()
    db.refresh(partner)

    assigned_count = (
        db.query(func.count(Order.id))
        .filter(
            Order.delivery_partner_id == partner.id,
            Order.order_status.notin_(["Delivered", "Cancelled"])
        )
        .scalar()
    ) or 0

    return DeliveryPartnerResponse(
        id=partner.id,
        partner_id=partner.partner_id,
        partner_name=partner.partner_name,
        mobile_number=partner.mobile_number,
        email=partner.email,
        vehicle_number=partner.vehicle_number,
        status=partner.status,
        availability_status=partner.availability_status or "Available",
        assigned_orders_count=assigned_count,
    )


# --------------------------------------------------
# Toggle Delivery Partner Status
# --------------------------------------------------
@router.patch("/{partner_id}/status")
def toggle_partner_status(
    partner_id: int,
    db: Session = Depends(get_db),
):
    partner = (
        db.query(DeliveryPartner)
        .filter(DeliveryPartner.id == partner_id)
        .first()
    )

    if not partner:
        raise HTTPException(
            status_code=404,
            detail="Delivery partner not found"
        )

    partner.status = not partner.status
    db.commit()
    db.refresh(partner)

    return {
        "message": "Status updated successfully",
        "status": partner.status
    }


# --------------------------------------------------
# Get Orders Assigned to a Specific Partner
# --------------------------------------------------
@router.get("/{partner_id}/orders")
def get_partner_assigned_orders(
    partner_id: int,
    db: Session = Depends(get_db),
):
    partner = (
        db.query(DeliveryPartner)
        .filter(DeliveryPartner.id == partner_id)
        .first()
    )

    if not partner:
        raise HTTPException(
            status_code=404,
            detail="Delivery partner not found"
        )

    orders = (
        db.query(Order)
        .filter(Order.delivery_partner_id == partner.id)
        .order_by(Order.id.desc())
        .all()
    )

    result = []
    for order in orders:
        assignment = (
            db.query(DeliveryAssignment)
            .filter(
                DeliveryAssignment.order_id == order.id,
                DeliveryAssignment.delivery_partner_id == partner.id
            )
            .first()
        )

        customer = (
            db.query(Customer)
            .filter(Customer.id == order.customer_id)
            .first()
        )

        result.append({
            "order_id": order.id,
            "order_number": order.order_number,
            "customer_name": customer.full_name if customer else order.full_name,
            "mobile_number": order.mobile_number,
            "address": f"{order.door_street}, {order.village}, {order.district} - {order.pincode}",
            "grand_total": float(order.grand_total),
            "payment_method": order.payment_method,
            "order_status": order.order_status,
            "delivery_status": assignment.delivery_status if assignment else "Assigned",
            "assigned_at": assignment.assigned_at if assignment else order.created_at,
            "delivered_at": assignment.delivered_at if assignment else None,
        })

    return result


# --------------------------------------------------
# Assign Order to Delivery Partner (Admin)
# --------------------------------------------------
@router.post("/assign")
def assign_order_to_partner(
    payload: AssignOrderRequest,
    db: Session = Depends(get_db),
):
    order = (
        db.query(Order)
        .filter(Order.id == payload.order_id)
        .first()
    )
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    partner = (
        db.query(DeliveryPartner)
        .filter(DeliveryPartner.id == payload.delivery_partner_id)
        .first()
    )
    if not partner:
        raise HTTPException(status_code=404, detail="Delivery Partner not found")

    # Update order
    order.delivery_partner_id = partner.id
    if order.order_status == "Pending":
        order.order_status = "Confirmed"
        db.add(OrderStatusHistory(order_id=order.id, status="Confirmed"))

    # Upsert delivery assignment
    assignment = (
        db.query(DeliveryAssignment)
        .filter(DeliveryAssignment.order_id == order.id)
        .first()
    )

    if assignment:
        assignment.delivery_partner_id = partner.id
        assignment.delivery_status = "Assigned"
    else:
        assignment = DeliveryAssignment(
            order_id=order.id,
            delivery_partner_id=partner.id,
            delivery_status="Assigned"
        )
        db.add(assignment)

    db.commit()

    return {
        "message": f"Order #{order.order_number} successfully assigned to {partner.partner_name} ({partner.partner_id or partner.id})",
        "order_id": order.id,
        "partner_id": partner.id,
        "delivery_status": assignment.delivery_status,
    }


# --------------------------------------------------
# Delete Delivery Partner
# --------------------------------------------------
@router.delete("/{partner_id}")
def delete_delivery_partner(
    partner_id: int,
    db: Session = Depends(get_db),
):
    partner = (
        db.query(DeliveryPartner)
        .filter(DeliveryPartner.id == partner_id)
        .first()
    )
    if not partner:
        raise HTTPException(status_code=404, detail="Delivery partner not found")

    db.delete(partner)
    db.commit()

    return {"message": "Delivery partner deleted successfully"}