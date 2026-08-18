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
    DeliveryAssignment,
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
from app.routers import delivery_partner

import os
if not os.path.exists("uploads"):
    os.makedirs("uploads", exist_ok=True)

from app.db_init import init_and_migrate_db
from fastapi import Request
from fastapi.responses import JSONResponse
import logging

try:
    init_and_migrate_db()
except Exception as e:
    print(f"Error during schema migration: {e}")

app = FastAPI(
    title="Farm Fresh Delivery API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ],
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logging.exception(f"Unhandled error processing request: {exc}")
    origin = request.headers.get("origin", "*")
    response = JSONResponse(
        status_code=500,
        content={"detail": "Internal Server Error", "error": str(exc)},
    )
    response.headers["Access-Control-Allow-Origin"] = origin
    response.headers["Access-Control-Allow-Credentials"] = "true"
    response.headers["Access-Control-Allow-Headers"] = "*"
    response.headers["Access-Control-Allow-Methods"] = "*"
    return response

app.mount(
    "/uploads",
    StaticFiles(directory="uploads"),
    name="uploads"
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
app.include_router(delivery_partner.router)



@app.get("/")
def home():
    return {
        "message": "Farm Fresh Delivery API Running Successfully"
    }
