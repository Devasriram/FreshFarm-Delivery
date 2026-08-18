import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "mysql+pymysql://root:root@localhost:3306/farm_fresh_db"
)

SECRET_KEY = os.getenv(
    "SECRET_KEY",
    "village_fresh_farm_delivery_super_secret_jwt_key_2026"
)

ALGORITHM = os.getenv("ALGORITHM", "HS256")

ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv(
        "ACCESS_TOKEN_EXPIRE_MINUTES",
        "1440",
    )
)