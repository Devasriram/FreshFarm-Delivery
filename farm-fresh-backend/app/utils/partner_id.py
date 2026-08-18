from sqlalchemy.orm import Session

from app.models.delivery import DeliveryPartner


def generate_partner_id(db: Session) -> str:
    last_partner = (
        db.query(DeliveryPartner)
        .filter(DeliveryPartner.partner_id.isnot(None))
        .order_by(DeliveryPartner.id.desc())
        .first()
    )

    if not last_partner or not last_partner.partner_id:
        return "DP001"

    try:
        last_number = int(
            last_partner.partner_id.replace("DP", "")
        )
        new_number = last_number + 1
        return f"DP{new_number:03d}"
    except Exception:
        count = db.query(DeliveryPartner).count()
        return f"DP{count + 1:03d}"
