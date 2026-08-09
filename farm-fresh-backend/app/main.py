from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine

from app.models import (
    Customer,
    Category,
    Product,
    CartItem,
    Order,
    OrderItem,
    CustomerAddress,
    DeliveryPartner,
)
from app.routers import address
from app.routers.customers import router as customer_router
from app.routers.categories import router as category_router
from app.routers.products import router as product_router
from app.routers.cart import router as cart_router
from app.routers.orders import router as order_router
from app.routers import admin_dashboard
from app.routers import admin_categories
from app.routers import admin_products
from app.routers import upload
from fastapi.staticfiles import StaticFiles
from app.routers import admin_customers
from app.routers import admin_orders
from app.routers import admin_delivery
from app.routers import admin_reports





Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Farm Fresh Delivery API",
    version="1.0.0",
)

app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(customer_router)
app.include_router(category_router)
app.include_router(product_router)
app.include_router(cart_router)
app.include_router(order_router)
app.include_router(address.router)
app.include_router(admin_dashboard.router)
app.include_router(admin_categories.router)
app.include_router(admin_products.router)
app.include_router(upload.router)
app.include_router(admin_customers.router)
app.include_router(admin_orders.router)
app.include_router(admin_delivery.router)
app.include_router(admin_reports.router)


@app.get("/")
def home():
    return {
        "message": "Farm Fresh Delivery API Running Successfully"
    }
