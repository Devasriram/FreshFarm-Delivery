from pydantic import BaseModel
from pydantic import ConfigDict


class ProductResponse(BaseModel):

    id: int

    category_id: int

    product_name: str

    description: str | None = None

    product_image: str | None = None

    price: float

    stock: int

    unit: str

    is_featured: bool

    status: bool

    freshness_info: str | None = None

    delivery_available: bool = True

    additional_images: str | None = None

    model_config = ConfigDict(
        from_attributes=True
    )