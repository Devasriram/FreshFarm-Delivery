from sqlalchemy.orm import Session

from app.models.customer import Customer


def generate_customer_id(db: Session):

    last_customer = (
        db.query(Customer)
        .order_by(Customer.id.desc())
        .first()
    )

    if not last_customer:
        return "CUS001"

    last_number = int(
        last_customer.customer_id.replace("CUS", "")
    )

    new_number = last_number + 1

    return f"CUS{new_number:03d}"