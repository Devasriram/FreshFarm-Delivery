from pydantic import BaseModel, ConfigDict

class ProductBase(BaseModel):
    category_id: int
    product_name: str
    description: str | None = None
    product_image: str | None = None
    price: float
    stock: int
    unit: str
    is_featured: bool = False
    status: bool = True
    freshness_info: str | None = "Freshly harvested today"
    delivery_available: bool = True
    additional_images: str | None = None


class ProductCreate(ProductBase):
    pass


class ProductUpdate(ProductBase):
    pass


class ProductResponse(ProductBase):
    id: int

    model_config = ConfigDict(
        from_attributes=True
    )