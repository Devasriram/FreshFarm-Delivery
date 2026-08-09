from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.delivery import DeliveryPartner

router = APIRouter(
    prefix="/admin/delivery",
    tags=["Admin Delivery"]
)


@router.get("/")
def get_delivery_partners(
    db: Session = Depends(get_db)
):
    return (
        db.query(DeliveryPartner)
        .order_by(DeliveryPartner.id.desc())
        .all()
    )


@router.post("/")
def create_delivery_partner(
    partner: dict,
    db: Session = Depends(get_db),
):

    new_partner = DeliveryPartner(
        partner_name=partner["partner_name"],
        mobile_number=partner["mobile_number"],
        vehicle_number=partner.get("vehicle_number"),
    )

    db.add(new_partner)
    db.commit()
    db.refresh(new_partner)

    return new_partner


@router.patch("/{partner_id}/status")
def toggle_partner_status(
    partner_id: int,
    db: Session = Depends(get_db),
):

    partner = (
        db.query(DeliveryPartner)
        .filter(DeliveryPartner.id == partner_id)
        .first()
    )

    if not partner:
        raise HTTPException(
            status_code=404,
            detail="Delivery partner not found"
        )

    partner.status = not partner.status

    db.commit()
    db.refresh(partner)

    return {
        "message": "Status updated successfully",
        "status": partner.status
    }