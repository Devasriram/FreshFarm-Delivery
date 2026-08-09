from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database import get_db

from app.models.customer import Customer
from app.models.category import Category
from app.models.product import Product
from app.models.order import Order

router = APIRouter(
    prefix="/admin",
    tags=["Admin Dashboard"]
)


@router.get("/dashboard")
def dashboard_summary(db: Session = Depends(get_db)):

    total_customers = db.query(Customer).count()

    total_categories = db.query(Category).count()

    total_products = db.query(Product).count()

    total_orders = db.query(Order).count()

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

    total_revenue = (
        db.query(func.sum(Order.grand_total))
        .filter(Order.order_status == "Delivered")
        .scalar()
    ) or 0

    return {
        "total_customers": total_customers,
        "total_categories": total_categories,
        "total_products": total_products,
        "total_orders": total_orders,
        "pending_orders": pending_orders,
        "delivered_orders": delivered_orders,
        "total_revenue": float(total_revenue),
    }