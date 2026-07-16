from pydantic import BaseModel
from typing import List
from datetime import datetime


# -----------------------------
# Delivery Address
# -----------------------------

class OrderAddress(BaseModel):

    full_name: str
    mobile: str
    email: str

    house_no: str
    street: str
    village: str

    city: str
    district: str
    state: str
    pincode: str


# -----------------------------
# Create Order
# -----------------------------

class OrderItemCreate(BaseModel):

    product_id: int
    quantity: int


class OrderCreate(OrderAddress):

    payment_method: str

    items: List[OrderItemCreate]


# -----------------------------
# Product Response
# -----------------------------

class OrderProductResponse(BaseModel):

    id: int

    product_name: str

    description: str | None = None

    product_image: str | None = None

    unit: str | None = None

    price: float

    class Config:
        from_attributes = True


# -----------------------------
# Order Item Response
# -----------------------------

class OrderItemResponse(BaseModel):

    id: int

    quantity: int

    price: float

    total: float

    product: OrderProductResponse

    class Config:
        from_attributes = True


# -----------------------------
# Order Response
# -----------------------------

class OrderResponse(OrderAddress):

    id: int

    order_number: str

    total_amount: float

    delivery_charge: float

    gst: float

    grand_total: float

    payment_method: str

    payment_status: str

    order_status: str

    created_at: datetime

    items: List[OrderItemResponse]

    class Config:
        from_attributes = True