from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.auth import get_current_customer

from app.models.customer import Customer
from app.models.address import CustomerAddress

from app.schemas.address import (
    AddressCreate,
    AddressUpdate,
    AddressResponse,
)

router = APIRouter(
    prefix="/addresses",
    tags=["Addresses"],
)


@router.post(
    "/",
    response_model=AddressResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_address(
    address: AddressCreate,
    db: Session = Depends(get_db),
    current_customer: Customer = Depends(get_current_customer),
):
    """
    Add a new delivery address.
    """

    # First address becomes default automatically
    address_count = (
        db.query(CustomerAddress)
        .filter(CustomerAddress.customer_id == current_customer.id)
        .count()
    )

    if address_count == 0:
        address.is_default = True

    # If user selected default, remove default from others
    if address.is_default:
        db.query(CustomerAddress).filter(
            CustomerAddress.customer_id == current_customer.id
        ).update(
            {
                CustomerAddress.is_default: False
            }
        )

    new_address = CustomerAddress(
        customer_id=current_customer.id,
        full_name=address.full_name,
        mobile_number=address.mobile_number,
        door_street=address.door_street,
        village=address.village,
        district=address.district,
        state=address.state,
        pincode=address.pincode,
        landmark=address.landmark,
        is_default=address.is_default,
    )

    db.add(new_address)
    db.commit()
    db.refresh(new_address)

    return new_address


@router.get(
    "/",
    response_model=list[AddressResponse],
)
def get_addresses(
    db: Session = Depends(get_db),
    current_customer: Customer = Depends(get_current_customer),
):
    """
    Get all customer addresses.
    """

    addresses = (
        db.query(CustomerAddress)
        .filter(
            CustomerAddress.customer_id == current_customer.id
        )
        .order_by(
            CustomerAddress.is_default.desc(),
            CustomerAddress.id.desc(),
        )
        .all()
    )

    return addresses


@router.get(
    "/{address_id}",
    response_model=AddressResponse,
)
def get_address(
    address_id: int,
    db: Session = Depends(get_db),
    current_customer: Customer = Depends(get_current_customer),
):
    """
    Get single address.
    """

    address = (
        db.query(CustomerAddress)
        .filter(
            CustomerAddress.id == address_id,
            CustomerAddress.customer_id == current_customer.id,
        )
        .first()
    )

    if not address:
        raise HTTPException(
            status_code=404,
            detail="Address not found",
        )

    return address


@router.put(
    "/{address_id}",
    response_model=AddressResponse,
)
def update_address(
    address_id: int,
    address: AddressUpdate,
    db: Session = Depends(get_db),
    current_customer: Customer = Depends(get_current_customer),
):
    """
    Update address.
    """

    existing = (
        db.query(CustomerAddress)
        .filter(
            CustomerAddress.id == address_id,
            CustomerAddress.customer_id == current_customer.id,
        )
        .first()
    )

    if not existing:
        raise HTTPException(
            status_code=404,
            detail="Address not found",
        )

    if address.is_default:
        db.query(CustomerAddress).filter(
            CustomerAddress.customer_id == current_customer.id
        ).update(
            {
                CustomerAddress.is_default: False
            }
        )

    existing.full_name = address.full_name
    existing.mobile_number = address.mobile_number
    existing.door_street = address.door_street
    existing.village = address.village
    existing.district = address.district
    existing.state = address.state
    existing.pincode = address.pincode
    existing.landmark = address.landmark
    existing.is_default = address.is_default

    db.commit()
    db.refresh(existing)

    return existing


@router.put("/default/{address_id}")
def set_default_address(
    address_id: int,
    db: Session = Depends(get_db),
    current_customer: Customer = Depends(get_current_customer),
):
    """
    Set default address.
    """

    address = (
        db.query(CustomerAddress)
        .filter(
            CustomerAddress.id == address_id,
            CustomerAddress.customer_id == current_customer.id,
        )
        .first()
    )

    if not address:
        raise HTTPException(
            status_code=404,
            detail="Address not found",
        )

    db.query(CustomerAddress).filter(
        CustomerAddress.customer_id == current_customer.id
    ).update(
        {
            CustomerAddress.is_default: False
        }
    )

    address.is_default = True

    db.commit()
    db.refresh(address)

    return {
        "message": "Default address updated successfully"
    }


@router.delete("/{address_id}")
def delete_address(
    address_id: int,
    db: Session = Depends(get_db),
    current_customer: Customer = Depends(get_current_customer),
):
    """
    Delete address.
    """

    address = (
        db.query(CustomerAddress)
        .filter(
            CustomerAddress.id == address_id,
            CustomerAddress.customer_id == current_customer.id,
        )
        .first()
    )

    if not address:
        raise HTTPException(
            status_code=404,
            detail="Address not found",
        )

    was_default = address.is_default

    db.delete(address)
    db.commit()

    if was_default:
        next_address = (
            db.query(CustomerAddress)
            .filter(
                CustomerAddress.customer_id == current_customer.id
            )
            .order_by(CustomerAddress.id.asc())
            .first()
        )

        if next_address:
            next_address.is_default = True
            db.commit()
            db.refresh(next_address)

    return {
        "message": "Address deleted successfully"
    }