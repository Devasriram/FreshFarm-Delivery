from pydantic import BaseModel, ConfigDict


class AddressBase(BaseModel):
    full_name: str
    mobile_number: str
    door_street: str
    village: str
    district: str
    state: str
    pincode: str
    landmark: str | None = None
    is_default: bool = False


class AddressCreate(AddressBase):
    pass


class AddressUpdate(AddressBase):
    pass


class AddressResponse(AddressBase):
    id: int

    model_config = ConfigDict(
        from_attributes=True
    )