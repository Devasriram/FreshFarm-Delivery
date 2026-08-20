from datetime import datetime, date
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func, or_

from app.database import get_db
from app.models.delivery import DeliveryPartner
from app.models.delivery_assignment import DeliveryAssignment
from app.models.order import Order
from app.models.order_item import OrderItem
from app.models.product import Product
from app.models.customer import Customer
from app.models.order_status_history import OrderStatusHistory
from app.models.order_tracking import OrderTracking
from app.models.delivery_history import DeliveryHistory
from app.security import verify_password, hash_password, create_access_token
from app.auth import get_current_delivery_partner
from app.schemas.delivery import (
    DeliveryPartnerLogin,
    DeliveryPartnerLoginResponse,
    DeliveryPartnerResponse,
    DeliveryDashboardSummary,
    AssignedOrderResponse,
    AssignedOrderItemResponse,
    DeliveryStatusUpdateRequest,
    DeliveryAvailabilityUpdateRequest,
)

router = APIRouter(
    prefix="/delivery",
    tags=["Delivery Partner"]
)


# --------------------------------------------------
# Delivery Partner Login
# --------------------------------------------------
@router.post("/auth/login", response_model=DeliveryPartnerLoginResponse)
def delivery_partner_login(
    credentials: DeliveryPartnerLogin,
    db: Session = Depends(get_db),
):
    raw_input = credentials.login_id.strip()
    clean_id = raw_input.lower().replace("-", "").replace(" ", "").replace("_", "")

    # Build potential partner_id variants (e.g. "dp001" -> "DP001", "1" -> "DP001", "dp1" -> "DP001")
    possible_partner_ids = [raw_input, clean_id.upper(), raw_input.upper()]
    if clean_id.startswith("dp"):
        digits_part = clean_id[2:]
        if digits_part.isdigit():
            possible_partner_ids.append(f"DP{int(digits_part):03d}")
    elif clean_id.isdigit() and len(clean_id) <= 4:
        possible_partner_ids.append(f"DP{int(clean_id):03d}")

    # Build filters
    filters = [
        func.lower(func.trim(DeliveryPartner.partner_id)).in_([p.lower() for p in possible_partner_ids]),
        func.lower(func.trim(DeliveryPartner.mobile_number)) == clean_id,
        func.lower(func.trim(DeliveryPartner.email)) == raw_input.lower(),
        DeliveryPartner.partner_id.in_(possible_partner_ids),
        DeliveryPartner.mobile_number == raw_input,
    ]
    if clean_id.isdigit() and len(clean_id) <= 4:
        filters.append(DeliveryPartner.id == int(clean_id))

    partner = db.query(DeliveryPartner).filter(or_(*filters)).first()

    if not partner:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"No delivery partner account found for '{credentials.login_id}'. (Try ID: DP001 or Mobile: 9876543210)",
        )

    if not partner.status:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your delivery partner account is currently disabled. Please contact admin.",
        )

    # Password check: verify hash or accept standard default passwords
    is_valid = False
    if partner.password and partner.password.strip():
        is_valid = verify_password(credentials.password, partner.password)

    if not is_valid and credentials.password.strip() in ["123456", "password", "password123", "admin"]:
        is_valid = True
        partner.password = hash_password(credentials.password.strip())
        db.commit()

    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect password. Default password for registered partners is '123456'.",
        )

    # Make sure partner_id is populated
    if not partner.partner_id:
        partner.partner_id = f"DP{partner.id:03d}"
        db.commit()
        db.refresh(partner)

    access_token = create_access_token(
        {
            "sub": partner.partner_id or partner.mobile_number,
            "role": "delivery_partner",
        }
    )

    assigned_count = (
        db.query(func.count(Order.id))
        .filter(
            Order.delivery_partner_id == partner.id,
            Order.order_status.notin_(["Delivered", "Cancelled"])
        )
        .scalar()
    ) or 0

    partner_response = DeliveryPartnerResponse(
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

    return DeliveryPartnerLoginResponse(
        access_token=access_token,
        token_type="bearer",
        partner=partner_response,
    )


# --------------------------------------------------
# Get Delivery Partner Profile
# --------------------------------------------------
@router.get("/profile", response_model=DeliveryPartnerResponse)
def get_profile(
    current_partner: DeliveryPartner = Depends(get_current_delivery_partner),
    db: Session = Depends(get_db),
):
    assigned_count = (
        db.query(func.count(Order.id))
        .filter(
            Order.delivery_partner_id == current_partner.id,
            Order.order_status.notin_(["Delivered", "Cancelled"])
        )
        .scalar()
    ) or 0

    return DeliveryPartnerResponse(
        id=current_partner.id,
        partner_id=current_partner.partner_id,
        partner_name=current_partner.partner_name,
        mobile_number=current_partner.mobile_number,
        email=current_partner.email,
        vehicle_number=current_partner.vehicle_number,
        status=current_partner.status,
        availability_status=current_partner.availability_status or "Available",
        assigned_orders_count=assigned_count,
    )


# --------------------------------------------------
# Delivery Partner Dashboard Statistics
# --------------------------------------------------
@router.get("/dashboard", response_model=DeliveryDashboardSummary)
def get_dashboard_metrics(
    current_partner: DeliveryPartner = Depends(get_current_delivery_partner),
    db: Session = Depends(get_db),
):
    today = date.today()

    # Today's Deliveries (assigned or updated today)
    today_deliveries = (
        db.query(func.count(DeliveryAssignment.id))
        .filter(
            DeliveryAssignment.delivery_partner_id == current_partner.id,
            func.date(DeliveryAssignment.assigned_at) == today
        )
        .scalar()
    ) or 0

    # Pending Deliveries (active, not delivered or cancelled)
    pending_deliveries = (
        db.query(func.count(Order.id))
        .filter(
            Order.delivery_partner_id == current_partner.id,
            Order.order_status.notin_(["Delivered", "Cancelled"])
        )
        .scalar()
    ) or 0

    # Completed Deliveries
    completed_deliveries = (
        db.query(func.count(Order.id))
        .filter(
            Order.delivery_partner_id == current_partner.id,
            Order.order_status == "Delivered"
        )
        .scalar()
    ) or 0

    # Total Earnings / Amount Delivered
    total_earnings = (
        db.query(func.sum(Order.grand_total))
        .filter(
            Order.delivery_partner_id == current_partner.id,
            Order.order_status == "Delivered"
        )
        .scalar()
    ) or 0.0

    return DeliveryDashboardSummary(
        today_deliveries=today_deliveries,
        pending_deliveries=pending_deliveries,
        completed_deliveries=completed_deliveries,
        total_earnings=float(total_earnings),
    )


# --------------------------------------------------
# Get Assigned Orders (Active)
# --------------------------------------------------
@router.get("/orders/assigned", response_model=list[AssignedOrderResponse])
def get_assigned_orders(
    current_partner: DeliveryPartner = Depends(get_current_delivery_partner),
    db: Session = Depends(get_db),
):
    orders = (
        db.query(Order)
        .filter(
            Order.delivery_partner_id == current_partner.id,
            Order.order_status.notin_(["Delivered", "Cancelled"])
        )
        .order_by(Order.id.desc())
        .all()
    )

    result = []
    for order in orders:
        assignment = (
            db.query(DeliveryAssignment)
            .filter(
                DeliveryAssignment.order_id == order.id,
                DeliveryAssignment.delivery_partner_id == current_partner.id
            )
            .first()
        )

        customer = (
            db.query(Customer)
            .filter(Customer.id == order.customer_id)
            .first()
        )

        # Fetch items
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
            order_items.append(
                AssignedOrderItemResponse(
                    product_name=product.product_name if product else "Product",
                    quantity=item.quantity,
                    price=float(item.price),
                    total=float(item.total),
                    unit=product.unit if product else "",
                )
            )

        full_addr = f"{order.door_street}, {order.village}, {order.district} - {order.pincode}"
        if order.landmark:
            full_addr += f" (Near: {order.landmark})"

        result.append(
            AssignedOrderResponse(
                assignment_id=assignment.id if assignment else None,
                order_id=order.id,
                order_number=order.order_number,
                customer_name=customer.full_name if customer else order.full_name,
                mobile_number=order.mobile_number,
                full_address=full_addr,
                door_street=order.door_street,
                village=order.village,
                district=order.district,
                pincode=order.pincode,
                landmark=order.landmark,
                total_amount=float(order.total_amount),
                grand_total=float(order.grand_total),
                payment_method=order.payment_method,
                payment_status=order.payment_status,
                order_status=order.order_status,
                delivery_status=assignment.delivery_status if assignment else "Assigned",
                assigned_at=assignment.assigned_at if assignment else order.created_at,
                delivered_at=assignment.delivered_at if assignment else None,
                created_at=order.created_at,
                items=order_items,
            )
        )

    return result


# --------------------------------------------------
# Update Delivery Status
# --------------------------------------------------
@router.patch("/orders/{order_id}/status")
def update_delivery_status(
    order_id: int,
    payload: DeliveryStatusUpdateRequest,
    current_partner: DeliveryPartner = Depends(get_current_delivery_partner),
    db: Session = Depends(get_db),
):
    valid_statuses = ["Assigned", "Accepted", "Picked Up", "Out for Delivery", "Delivered"]
    if payload.status not in valid_statuses:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid delivery status. Must be one of: {', '.join(valid_statuses)}",
        )

    order = (
        db.query(Order)
        .filter(
            Order.id == order_id,
            Order.delivery_partner_id == current_partner.id
        )
        .first()
    )

    if not order:
        raise HTTPException(
            status_code=404,
            detail="Order not found or not assigned to you.",
        )

    assignment = (
        db.query(DeliveryAssignment)
        .filter(
            DeliveryAssignment.order_id == order.id,
            DeliveryAssignment.delivery_partner_id == current_partner.id
        )
        .first()
    )

    if not assignment:
        assignment = DeliveryAssignment(
            order_id=order.id,
            delivery_partner_id=current_partner.id,
            delivery_status=payload.status
        )
        db.add(assignment)
    else:
        assignment.delivery_status = payload.status

    # Update or insert into DeliveryHistory table
    dh = (
        db.query(DeliveryHistory)
        .filter(
            DeliveryHistory.order_id == order.id,
            DeliveryHistory.delivery_partner_id == current_partner.id
        )
        .first()
    )
    if not dh:
        dh = DeliveryHistory(
            order_id=order.id,
            delivery_partner_id=current_partner.id,
            delivery_status=payload.status,
            delivered_at=func.now() if payload.status == "Delivered" else None
        )
        db.add(dh)
    else:
        dh.delivery_status = payload.status
        if payload.status == "Delivered":
            dh.delivered_at = func.now()

    # Add to order_tracking table
    tracking_label = payload.status
    if payload.status == "Accepted":
        tracking_label = "Order Confirmed"
        order.order_status = "Confirmed"
    elif payload.status == "Picked Up":
        tracking_label = "Picked Up"
        order.order_status = "Preparing"
    elif payload.status == "Out for Delivery":
        tracking_label = "Out for Delivery"
        order.order_status = "Out for Delivery"
    elif payload.status == "Delivered":
        tracking_label = "Delivered"
        order.order_status = "Delivered"
        assignment.delivered_at = func.now()
        if order.payment_method.lower() in ["cash on delivery", "cod"]:
            order.payment_status = "Paid"

    db.add(
        OrderTracking(
            order_id=order.id,
            status=tracking_label,
            updated_by=f"Delivery Partner - {current_partner.partner_name} ({current_partner.partner_id or current_partner.id})"
        )
    )

    # Add tracking record to legacy table
    db.add(
        OrderStatusHistory(
            order_id=order.id,
            status=order.order_status
        )
    )

    db.commit()
    db.refresh(order)

    return {
        "message": f"Order #{order.order_number} delivery status updated to {payload.status}",
        "order_id": order.id,
        "delivery_status": payload.status,
        "order_status": order.order_status,
    }


# --------------------------------------------------
# Get Delivery History (Delivered Orders)
# --------------------------------------------------
@router.get("/history", response_model=list[AssignedOrderResponse])
def get_delivery_history(
    current_partner: DeliveryPartner = Depends(get_current_delivery_partner),
    db: Session = Depends(get_db),
):
    orders = (
        db.query(Order)
        .filter(
            Order.delivery_partner_id == current_partner.id,
            Order.order_status == "Delivered"
        )
        .order_by(Order.id.desc())
        .all()
    )

    result = []
    for order in orders:
        assignment = (
            db.query(DeliveryAssignment)
            .filter(
                DeliveryAssignment.order_id == order.id,
                DeliveryAssignment.delivery_partner_id == current_partner.id
            )
            .first()
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
            order_items.append(
                AssignedOrderItemResponse(
                    product_name=product.product_name if product else "Product",
                    quantity=item.quantity,
                    price=float(item.price),
                    total=float(item.total),
                    unit=product.unit if product else "",
                )
            )

        full_addr = f"{order.door_street}, {order.village}, {order.district} - {order.pincode}"

        result.append(
            AssignedOrderResponse(
                assignment_id=assignment.id if assignment else None,
                order_id=order.id,
                order_number=order.order_number,
                customer_name=customer.full_name if customer else order.full_name,
                mobile_number=order.mobile_number,
                full_address=full_addr,
                door_street=order.door_street,
                village=order.village,
                district=order.district,
                pincode=order.pincode,
                landmark=order.landmark,
                total_amount=float(order.total_amount),
                grand_total=float(order.grand_total),
                payment_method=order.payment_method,
                payment_status=order.payment_status,
                order_status=order.order_status,
                delivery_status=assignment.delivery_status if assignment else "Delivered",
                assigned_at=assignment.assigned_at if assignment else order.created_at,
                delivered_at=assignment.delivered_at if assignment else order.created_at,
                created_at=order.created_at,
                items=order_items,
            )
        )

    return result


# --------------------------------------------------
# Update Availability Status
# --------------------------------------------------
@router.patch("/availability")
def update_availability(
    payload: DeliveryAvailabilityUpdateRequest,
    current_partner: DeliveryPartner = Depends(get_current_delivery_partner),
    db: Session = Depends(get_db),
):
    valid_statuses = ["Available", "Busy", "Offline"]
    if payload.availability_status not in valid_statuses:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid status. Must be one of: {', '.join(valid_statuses)}",
        )

    current_partner.availability_status = payload.availability_status
    db.commit()
    db.refresh(current_partner)

    return {
        "message": f"Availability updated to {payload.availability_status}",
        "availability_status": current_partner.availability_status,
    }
