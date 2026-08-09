from pydantic import BaseModel, ConfigDict

class CategoryBase(BaseModel):
    category_name: str
    category_image: str | None = None
    status: bool = True


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(CategoryBase):
    pass


class CategoryResponse(CategoryBase):
    id: int

    model_config = ConfigDict(
        from_attributes=True
    )