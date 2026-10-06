from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.sensors import router as sensor_router
from app.api.hives import router as hive_router
from app.api.users import router as user_router
from app.api.batches import router as batch_router

# Import models without overwriting the FastAPI app variable
from app.models import user
from app.models import hive
from app.models import sensor
from app.models import batch


app = FastAPI(
    title="HoneyChain API",
    description="Blockchain-backed honey traceability and IoT hive monitoring platform.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Existing routes
app.include_router(sensor_router)
app.include_router(hive_router)
app.include_router(user_router)

# Honey Batch routes
app.include_router(batch_router)


@app.get("/")
def root():
    return {
        "name": "HoneyChain API",
        "status": "online",
        "version": "1.0.0",
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}