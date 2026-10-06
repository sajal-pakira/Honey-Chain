from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.sensor import SensorReading
from app.models.hive import Hive
from app.schemas.sensor import SensorDataCreate, SensorDataResponse

router = APIRouter(
    prefix="/api/sensors",
    tags=["Sensors"],
)


@router.post("/data", response_model=SensorDataResponse)
def receive_sensor_data(
    data: SensorDataCreate,
    db: Session = Depends(get_db),
):
    # Check that the hive exists
    hive = (
        db.query(Hive)
        .filter(Hive.id == data.hive_id)
        .first()
    )

    if not hive:
        raise HTTPException(
            status_code=404,
            detail="Hive not found",
        )

    # Create sensor reading
    reading = SensorReading(
        hive_id=data.hive_id,
        temperature_c=data.temperature_c,
        humidity_percent=data.humidity_percent,
        hive_weight_kg=data.hive_weight_kg,
        sound_level=data.sound_level,
        latitude=data.latitude,
        longitude=data.longitude,
        recorded_at=data.recorded_at,
    )

    db.add(reading)
    db.commit()
    db.refresh(reading)

    return reading