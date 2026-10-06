from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.hive import Hive, Apiary
from app.models.sensor import SensorReading
from app.models.user import User
from app.schemas.hive import ApiaryCreate, ApiaryResponse, HiveCreate, HiveResponse

router = APIRouter(
    prefix="/api/hives",
    tags=["Hives"]
)


# ---------------------------------------------------------
# CREATE APIARY
# ---------------------------------------------------------

@router.post("/apiaries", response_model=ApiaryResponse)
def create_apiary(
    data: ApiaryCreate,
    db: Session = Depends(get_db)
):
    beekeeper = db.query(User).filter(
        User.id == data.beekeeper_id
    ).first()

    if not beekeeper:
        raise HTTPException(
            status_code=404,
            detail="Beekeeper not found"
        )

    apiary = Apiary(
        name=data.name,
        location=data.location,
        beekeeper_id=data.beekeeper_id,
    )

    db.add(apiary)
    db.commit()
    db.refresh(apiary)

    return apiary


# ---------------------------------------------------------
# CREATE HIVE
# ---------------------------------------------------------

@router.post("", response_model=HiveResponse)
def create_hive(
    data: HiveCreate,
    db: Session = Depends(get_db)
):
    apiary = db.query(Apiary).filter(
        Apiary.id == data.apiary_id
    ).first()

    if not apiary:
        raise HTTPException(
            status_code=404,
            detail="Apiary not found"
        )

    existing_hive = db.query(Hive).filter(
        Hive.hive_code == data.hive_code
    ).first()

    if existing_hive:
        raise HTTPException(
            status_code=400,
            detail="Hive code already exists"
        )

    if data.esp32_device_id:
        existing_device = db.query(Hive).filter(
            Hive.esp32_device_id == data.esp32_device_id
        ).first()

        if existing_device:
            raise HTTPException(
                status_code=400,
                detail="ESP32 device already assigned"
            )

    hive = Hive(
        hive_code=data.hive_code,
        apiary_id=data.apiary_id,
        esp32_device_id=data.esp32_device_id,
        status=data.status,
    )

    db.add(hive)
    db.commit()
    db.refresh(hive)

    return hive


# ---------------------------------------------------------
# GET ALL HIVES
# ---------------------------------------------------------

@router.get("")
def get_all_hives(
    db: Session = Depends(get_db)
):
    hives = db.query(Hive).all()

    return [
        {
            "id": str(hive.id),
            "hive_code": hive.hive_code,
            "apiary_id": str(hive.apiary_id),
            "esp32_device_id": hive.esp32_device_id,
            "status": hive.status,
        }
        for hive in hives
    ]


# ---------------------------------------------------------
# GET SINGLE HIVE
# ---------------------------------------------------------

@router.get("/{hive_id}", response_model=HiveResponse)
def get_hive(
    hive_id: str,
    db: Session = Depends(get_db)
):
    hive = db.query(Hive).filter(
        Hive.id == hive_id
    ).first()

    if not hive:
        raise HTTPException(
            status_code=404,
            detail="Hive not found"
        )

    return hive


# ---------------------------------------------------------
# GET HIVE SENSOR READINGS
# ---------------------------------------------------------

@router.get("/{hive_id}/readings")
def get_hive_readings(
    hive_id: str,
    db: Session = Depends(get_db)
):
    hive = db.query(Hive).filter(
        Hive.id == hive_id
    ).first()

    if not hive:
        raise HTTPException(
            status_code=404,
            detail="Hive not found"
        )

    readings = (
        db.query(SensorReading)
        .filter(SensorReading.hive_id == hive_id)
        .order_by(SensorReading.recorded_at.desc())
        .limit(50)
        .all()
    )

    return [
        {
            "id": reading.id,
            "hive_id": str(reading.hive_id),
            "temperature_c": reading.temperature_c,
            "humidity_percent": reading.humidity_percent,
            "hive_weight_kg": reading.hive_weight_kg,
            "sound_level": reading.sound_level,
            "latitude": reading.latitude,
            "longitude": reading.longitude,
            "recorded_at": reading.recorded_at,
        }
        for reading in readings
    ]