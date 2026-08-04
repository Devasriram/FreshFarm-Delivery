from pydantic import BaseModel
from datetime import datetime


class OrderStatusHistoryResponse(BaseModel):

    status: str
    updated_at: datetime

    class Config:
        from_attributes = True