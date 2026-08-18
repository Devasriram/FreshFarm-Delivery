from datetime import datetime
from pydantic import BaseModel, ConfigDict


class DeliveryPartnerBase(BaseModel):
    partner_name: str
    mobile_number: str
    email: str | None = None
    vehicle_number: str | None = None
    status: bool = True
    availability_status: str = "Available"


class DeliveryPartnerCreate(BaseModel):
    partner_name: str
    mobile_number: str
    email: str | None = None
    password: str | None = "123456"
    vehicle_number: str | None = None
    availability_status: str = "Available"


class DeliveryPartnerUpdate(BaseModel):
    partner_name: str | None = None
    mobile_number: str | None = None
    email: str | None = None
    password: str | None = None
    vehicle_number: str | None = None
    status: bool | None = None
    availability_status: str | None = None


class DeliveryPartnerResponse(DeliveryPartnerBase):
    id: int
    partner_id: str | None = None
    assigned_orders_count: int = 0

    model_config = ConfigDict(from_attributes=True)


class DeliveryPartnerLogin(BaseModel):
    login_id: str  # Can be mobile_number, partner_id, or email
    password: str


class DeliveryPartnerLoginResponse(BaseModel):
    access_token: str
    token_type: str
    partner: DeliveryPartnerResponse


class AssignOrderRequest(BaseModel):
    order_id: int
    delivery_partner_id: int


class DeliveryStatusUpdateRequest(BaseModel):
    status: str  # Accepted, Picked Up, Out for Delivery, Delivered


class DeliveryAvailabilityUpdateRequest(BaseModel):
    availability_status: str  # Available, Busy, Offline


class DeliveryDashboardSummary(BaseModel):
    today_deliveries: int
    pending_deliveries: int
    completed_deliveries: int
    total_earnings: float


class AssignedOrderItemResponse(BaseModel):
    product_name: str
    quantity: int
    price: float
    total: float
    unit: str | None = None


class AssignedOrderResponse(BaseModel):
    assignment_id: int | None = None
    order_id: int
    order_number: str
    customer_name: str
    mobile_number: str
    full_address: str
    door_street: str
    village: str
    district: str
    pincode: str
    landmark: str | None = None
    total_amount: float
    grand_total: float
    payment_method: str
    payment_status: str
    order_status: str
    delivery_status: str
    assigned_at: datetime | None = None
    delivered_at: datetime | None = None
    created_at: datetime
    items: list[AssignedOrderItemResponse] = []

    model_config = ConfigDict(from_attributes=True)
