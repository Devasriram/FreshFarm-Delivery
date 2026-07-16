from pydantic import BaseModel
from datetime import datetime


class CartItemCreate(BaseModel):

    product_id: int
    quantity: int = 1


class CartItemUpdate(BaseModel):

    quantity: int


class CartProductResponse(BaseModel):

    id: int
    product_name: str
    product_image: str
    price: float
    unit: str


class CartItemResponse(BaseModel):

    id: int
    quantity: int
    created_at: datetime

    product: CartProductResponse

    class Config:
        from_attributes = True