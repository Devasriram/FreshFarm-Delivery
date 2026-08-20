from datetime import datetime
from pydantic import BaseModel, ConfigDict


class DeliveryPartnerSummary(BaseModel):
    id: int
    partner_id: str | None = None
    partner_name: str
    mobile_number: str
    vehicle_number: str | None = None
    email: str | None = None

    model_config = ConfigDict(from_attributes=True)


class OrderTrackingItemResponse(BaseModel):
    id: int | None = None
    status: str
    updated_by: str | None = "System"
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class OrderTrackingResponse(BaseModel):
    order_id: int
    order_number: str | None = None
    current_status: str
    estimated_delivery_time: str | None = "Today within 2-3 hours"
    delivery_partner: DeliveryPartnerSummary | None = None
    history: list[OrderTrackingItemResponse]
    created_at: datetime | None = None

    model_config = ConfigDict(from_attributes=True)