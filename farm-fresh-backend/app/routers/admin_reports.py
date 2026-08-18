from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db
from app.models.order import Order
from app.models.customer import Customer
from app.models.product import Product

router = APIRouter(
    prefix="/admin/reports",
    tags=["Admin Reports"]
)
@router.get("/summary")
def dashboard_summary(db: Session = Depends(get_db)):
    total_customers = db.query(Customer).count()

    total_products = db.query(Product).count()

    total_orders = db.query(Order).count()

    total_revenue = (
        db.query(func.sum(Order.grand_total))
        .scalar()
        or 0
    )

    pending_orders = (
        db.query(Order)
        .filter(Order.order_status == "Pending")
        .count()
    )

    delivered_orders = (
        db.query(Order)
        .filter(Order.order_status == "Delivered")
        .count()
    )

    return {
        "customers": total_customers,
        "products": total_products,
        "orders": total_orders,
        "pending_orders": pending_orders,
        "delivered_orders": delivered_orders,
        "revenue": float(total_revenue),
    }
@router.get("/monthly-sales")
def monthly_sales(db: Session = Depends(get_db)):

    data = (
        db.query(
            func.extract("month", Order.created_at).label("month"),
            func.sum(Order.grand_total).label("revenue")
        )
        .group_by(func.extract("month", Order.created_at))
        .all()
    )

    return [
        {
            "month": int(row.month) if row.month is not None else 0,
            "revenue": float(row.revenue or 0),
        }
        for row in data
    ]