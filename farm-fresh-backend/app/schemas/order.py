from datetime import datetime
from pydantic import BaseModel, ConfigDict
from app.schemas.order_tracking import DeliveryPartnerSummary, OrderTrackingItemResponse, OrderTrackingResponse


# -----------------------------
# Delivery Address
# -----------------------------

class OrderAddress(BaseModel):
    full_name: str
    mobile_number: str
    door_street: str
    village: str
    district: str
    state: str
    pincode: str
    landmark: str | None = None


# -----------------------------
# Create Order
# -----------------------------

class OrderCreate(OrderAddress):
    payment_method: str


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

    model_config = ConfigDict(
        from_attributes=True
    )


# -----------------------------
# Order Item Response
# -----------------------------

class OrderItemResponse(BaseModel):
    id: int
    quantity: int
    price: float
    total: float
    product: OrderProductResponse

    model_config = ConfigDict(
        from_attributes=True
    )


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
    estimated_delivery_time: str | None = "Today within 2-3 hours"
    delivery_partner_id: int | None = None
    delivery_partner: DeliveryPartnerSummary | None = None

    created_at: datetime

    items: list[OrderItemResponse]

    model_config = ConfigDict(
        from_attributes=True
    )


# -----------------------------
# Cancel Order Response
# -----------------------------

class CancelOrderResponse(BaseModel):
    message: str
    order_status: str


# -----------------------------
# Reorder Response
# -----------------------------

class ReorderResponse(BaseModel):
    message: str
    new_order_id: int | None = None