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

    model_config = ConfigDict(
        from_attributes=True
    )