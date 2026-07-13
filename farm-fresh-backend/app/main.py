from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine

from app.models import Customer

from app.routers.customers import router as customer_router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Farm Fresh Delivery API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(customer_router)


@app.get("/")
def home():
    return {
        "message": "Farm Fresh Delivery API Running Successfully"
    }