from pydantic import BaseModel


class CategoryResponse(BaseModel):
    id: int
    category_name: str
    category_image: str
    product_count: int

    class Config:
        from_attributes = True