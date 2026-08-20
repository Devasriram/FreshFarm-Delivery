from sqlalchemy import inspect, text
from app.database import engine, Base
import app.models  # Ensure all models are registered with Base

def init_and_migrate_db():
    # 1. Create all missing tables (including order_tracking & delivery_history)
    Base.metadata.create_all(bind=engine)

    # 2. Inspect existing columns and add missing ones
    inspector = inspect(engine)
    existing_tables = inspector.get_table_names()

    with engine.begin() as conn:
        # Check delivery_partners table
        if "delivery_partners" in existing_tables:
            columns = [c["name"] for c in inspector.get_columns("delivery_partners")]
            if "partner_id" not in columns:
                conn.execute(text("ALTER TABLE delivery_partners ADD COLUMN partner_id VARCHAR(30) UNIQUE NULL"))
            if "password" not in columns:
                conn.execute(text("ALTER TABLE delivery_partners ADD COLUMN password VARCHAR(255) NULL"))
            if "vehicle_number" not in columns:
                conn.execute(text("ALTER TABLE delivery_partners ADD COLUMN vehicle_number VARCHAR(30) NULL"))
            if "status" not in columns:
                conn.execute(text("ALTER TABLE delivery_partners ADD COLUMN status BOOLEAN DEFAULT 1"))
            if "availability_status" not in columns:
                conn.execute(text("ALTER TABLE delivery_partners ADD COLUMN availability_status VARCHAR(30) DEFAULT 'Available'"))
        # Check delivery_assignments table
        if "delivery_assignments" in existing_tables:
            try:
                conn.execute(text("ALTER TABLE delivery_assignments MODIFY COLUMN delivery_status VARCHAR(50) DEFAULT 'Assigned'"))
            except Exception as e:
                print(f"delivery_assignments modify notice: {e}")

        # Check orders table
        if "orders" in existing_tables:
            columns = [c["name"] for c in inspector.get_columns("orders")]
            if "delivery_partner_id" not in columns:
                conn.execute(text("ALTER TABLE orders ADD COLUMN delivery_partner_id INT NULL"))
            if "estimated_delivery_time" not in columns:
                conn.execute(text("ALTER TABLE orders ADD COLUMN estimated_delivery_time VARCHAR(100) DEFAULT 'Today within 2-3 hours'"))

        # Check customers table
        if "customers" in existing_tables:
            columns = [c["name"] for c in inspector.get_columns("customers")]
            if "customer_id" not in columns:
                conn.execute(text("ALTER TABLE customers ADD COLUMN customer_id VARCHAR(30) UNIQUE NULL"))
            if "status" not in columns:
                conn.execute(text("ALTER TABLE customers ADD COLUMN status BOOLEAN DEFAULT 1"))

        # Check products table
        if "products" in existing_tables:
            columns = [c["name"] for c in inspector.get_columns("products")]
            if "freshness_info" not in columns:
                conn.execute(text("ALTER TABLE products ADD COLUMN freshness_info VARCHAR(255) DEFAULT 'Freshly harvested today'"))
            if "delivery_available" not in columns:
                conn.execute(text("ALTER TABLE products ADD COLUMN delivery_available BOOLEAN DEFAULT 1"))
            if "additional_images" not in columns:
                conn.execute(text("ALTER TABLE products ADD COLUMN additional_images TEXT NULL"))

    # 3. Ensure delivery partner records have valid partner_id and default password
    try:
        from app.database import SessionLocal
        from app.models.delivery import DeliveryPartner
        from app.models.order import Order
        from app.models.order_tracking import OrderTracking
        from app.models.delivery_history import DeliveryHistory
        from app.security import hash_password

        db = SessionLocal()
        partners = db.query(DeliveryPartner).all()
        for p in partners:
            if not p.partner_id:
                p.partner_id = f"DP{p.id:03d}"
            if p.partner_name:
                p.partner_name = p.partner_name.strip()
            if p.mobile_number:
                p.mobile_number = p.mobile_number.strip()
            if p.email:
                p.email = p.email.strip()
            if p.vehicle_number:
                p.vehicle_number = p.vehicle_number.strip()
            if not p.password or not p.password.strip():
                p.password = hash_password("123456")

        # Backfill initial tracking for any order without tracking history
        orders = db.query(Order).all()
        for ord in orders:
            if not ord.estimated_delivery_time:
                ord.estimated_delivery_time = "Today within 2-3 hours"
            tracking_count = db.query(OrderTracking).filter(OrderTracking.order_id == ord.id).count()
            if tracking_count == 0:
                # Add initial Order Placed entry
                db.add(OrderTracking(order_id=ord.id, status="Order Placed", updated_by="Customer", updated_at=ord.created_at))
                if ord.order_status and ord.order_status not in ["Pending", "Order Placed"]:
                    db.add(OrderTracking(order_id=ord.id, status=ord.order_status, updated_by="System", updated_at=ord.created_at))

            # Sync delivery history if partner assigned
            if ord.delivery_partner_id:
                dh_count = db.query(DeliveryHistory).filter(DeliveryHistory.order_id == ord.id).count()
                if dh_count == 0:
                    deliv_stat = "Delivered" if ord.order_status == "Delivered" else ("Out for Delivery" if ord.order_status == "Out for Delivery" else "Assigned")
                    db.add(DeliveryHistory(
                        order_id=ord.id,
                        delivery_partner_id=ord.delivery_partner_id,
                        delivery_status=deliv_stat,
                        delivered_at=ord.created_at if ord.order_status == "Delivered" else None,
                        assigned_at=ord.created_at
                    ))

        db.commit()
        db.close()
    except Exception as e:
        print(f"Post-migration initialization note: {e}")

    print("Database tables & schema verified and migrated successfully.")

if __name__ == "__main__":
    init_and_migrate_db()
