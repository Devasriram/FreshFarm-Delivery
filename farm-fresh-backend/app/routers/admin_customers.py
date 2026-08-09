from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models.customer import Customer
from app.models.order import Order

router = APIRouter(
    prefix="/admin/customers",
    tags=["Admin Customers"]
)


@router.get("/")
def get_customers(db: Session = Depends(get_db)):
    customers = (
        db.query(Customer)
        .order_by(Customer.id.desc())
        .all()
    )

    result = []

    for customer in customers:
        total_orders = (
            db.query(func.count(Order.id))
            .filter(Order.customer_id == customer.id)
            .scalar()
        )

        result.append({
            "id": customer.id,
            "customer_name": customer.full_name,
            "mobile_number": customer.mobile_number,
            "email": customer.email,
            "village": customer.village,
            "status": customer.status,
            "total_orders": total_orders
        })

    return result


@router.patch("/{customer_id}/status")
def toggle_customer_status(
    customer_id: int,
    db: Session = Depends(get_db),
):
    customer = (
        db.query(Customer)
        .filter(Customer.id == customer_id)
        .first()
    )

    if not customer:
        raise HTTPException(
            status_code=404,
            detail="Customer not found"
        )

    customer.status = not customer.status

    db.commit()
    db.refresh(customer)

    return {
        "message": "Customer status updated successfully",
        "status": customer.status
    }