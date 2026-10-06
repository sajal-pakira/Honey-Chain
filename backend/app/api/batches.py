import hashlib
import secrets
from datetime import datetime, timezone
from uuid import UUID
from app.services.blockchain import (
    register_batch_on_chain,
    verify_batch_on_chain,
)
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload

from app.core.database import get_db
from app.models.batch import (
    HoneyBatch,
    SupplyChainEvent,
    BatchStatus,
    SupplyChainEventType,
)
from app.models.hive import Hive
from app.models.user import User
from app.schemas.batch import (
    HoneyBatchCreate,
    HoneyBatchResponse,
    SupplyChainEventCreate,
    SupplyChainEventResponse,
)

router = APIRouter(
    prefix="/api/batches",
    tags=["Honey Batches"],
)


def make_batch_code(db: Session) -> str:
    year = datetime.now(timezone.utc).year
    count = db.query(HoneyBatch).count() + 1
    return f"HC-{year}-{count:04d}"


def make_proof(
    batch_code: str,
    hive_id: UUID,
    beekeeper_id: UUID,
    harvest_date: datetime,
    weight: float,
) -> str:
    payload = (
        f"{batch_code}|"
        f"{hive_id}|"
        f"{beekeeper_id}|"
        f"{harvest_date.isoformat()}|"
        f"{weight:.3f}"
    )

    return hashlib.sha256(
        payload.encode("utf-8")
    ).hexdigest()


# ============================================================
# CREATE BATCH
# ============================================================

@router.post(
    "",
    response_model=HoneyBatchResponse,
)
def create_batch(
    data: HoneyBatchCreate,
    db: Session = Depends(get_db),
):
    # Check hive
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

    # Check beekeeper
    beekeeper = (
        db.query(User)
        .filter(User.id == data.beekeeper_id)
        .first()
    )

    if not beekeeper:
        raise HTTPException(
            status_code=404,
            detail="Beekeeper not found",
        )

    # Generate batch information
    batch_code = make_batch_code(db)
    qr_token = secrets.token_urlsafe(24)

    proof = make_proof(
        batch_code,
        data.hive_id,
        data.beekeeper_id,
        data.harvest_date,
        data.harvested_weight_kg,
    )

    # Create honey batch
    batch = HoneyBatch(
        batch_code=batch_code,
        hive_id=data.hive_id,
        beekeeper_id=data.beekeeper_id,
        harvest_date=data.harvest_date,
        harvested_weight_kg=data.harvested_weight_kg,
        honey_type=data.honey_type,
        floral_source=data.floral_source,
        status=BatchStatus.harvested,
        blockchain_hash=proof,
        qr_token=qr_token,
    )

    db.add(batch)
    db.flush()

    # Create initial harvest event
    #
    # IMPORTANT:
    # The existing database uses:
    # actor_id
    # location_name
    # created_at
    #
    # NOT:
    # actor_name
    # location
    # occurred_at

    event = SupplyChainEvent(
        batch_id=batch.id,
        event_type=SupplyChainEventType.harvest,
        actor_id=beekeeper.id,
        location_name=None,
        latitude=None,
        longitude=None,
        quantity_kg=data.harvested_weight_kg,
        notes="Honey batch created from hive harvest.",
        created_at=data.harvest_date,
    )

    db.add(event)

    db.commit()
    db.refresh(batch)

    # ============================================================
    # REGISTER BATCH ON ETHEREUM SEPOLIA
    # ============================================================

    try:
        tx_hash = register_batch_on_chain(
            batch_code=batch.batch_code,
            proof=batch.blockchain_hash,
            hive_id=str(batch.hive_id),
            harvest_timestamp=int(
            batch.harvest_date.timestamp()
        ),
        harvested_weight_kg=batch.harvested_weight_kg,
    )

        batch.blockchain_tx_hash = tx_hash

        db.commit()
        db.refresh(batch)

    except Exception as exc:
        print(
            f"WARNING: Batch created in PostgreSQL "
            f"but blockchain registration failed: {exc}"
        )

    return batch


# ============================================================
# LIST BATCHES
# ============================================================

@router.get(
    "",
    response_model=list[HoneyBatchResponse],
)
def list_batches(
    db: Session = Depends(get_db),
):
    return (
        db.query(HoneyBatch)
        .order_by(HoneyBatch.created_at.desc())
        .all()
    )


# ============================================================
# GET SINGLE BATCH
# ============================================================
# ============================================================
# VERIFY BATCH ON BLOCKCHAIN
# ============================================================

@router.get("/{batch_id}/verify")
def verify_batch(
    batch_id: UUID,
    db: Session = Depends(get_db),
):
    batch = (
        db.query(HoneyBatch)
        .filter(HoneyBatch.id == batch_id)
        .first()
    )

    if not batch:
        raise HTTPException(
            status_code=404,
            detail="Batch not found",
        )

    if not batch.blockchain_hash:
        return {
            "batch_id": str(batch.id),
            "batch_code": batch.batch_code,
            "verified": False,
            "reason": "No blockchain proof recorded",
            "blockchain_tx_hash": batch.blockchain_tx_hash,
        }

    try:
        verified = verify_batch_on_chain(
            batch_code=batch.batch_code,
            proof=batch.blockchain_hash,
        )

        return {
            "batch_id": str(batch.id),
            "batch_code": batch.batch_code,
            "verified": verified,
            "reason": (
                "Blockchain proof matches"
                if verified
                else "Blockchain proof does not match"
            ),
            "blockchain_tx_hash": batch.blockchain_tx_hash,
        }

    except Exception as exc:
        print(
            f"Blockchain verification failed: {exc}"
        )

        return {
            "batch_id": str(batch.id),
            "batch_code": batch.batch_code,
            "verified": False,
            "reason": "Unable to verify against blockchain",
            "blockchain_tx_hash": batch.blockchain_tx_hash,
        }


# ============================================================
# GET SINGLE BATCH
# ============================================================

@router.get(
    "/{batch_id}",
    response_model=HoneyBatchResponse,
)
def get_batch(
    batch_id: UUID,
    db: Session = Depends(get_db),
):
    batch = (
        db.query(HoneyBatch)
        .filter(HoneyBatch.id == batch_id)
        .first()
    )

    if not batch:
        raise HTTPException(
            status_code=404,
            detail="Honey batch not found",
        )

    # --------------------------------------------------------
    # Load hive
    # --------------------------------------------------------

    hive = None

    if batch.hive_id:
        hive = (
            db.query(Hive)
            .filter(Hive.id == batch.hive_id)
            .first()
        )

    # --------------------------------------------------------
    # Load beekeeper
    # --------------------------------------------------------

    beekeeper = None

    if batch.beekeeper_id:
        beekeeper = (
            db.query(User)
            .filter(User.id == batch.beekeeper_id)
            .first()
        )

    # --------------------------------------------------------
    # Load supply-chain events
    # --------------------------------------------------------

    events = (
        db.query(SupplyChainEvent)
        .filter(
            SupplyChainEvent.batch_id == batch.id
        )
        .order_by(
            SupplyChainEvent.created_at.asc()
        )
        .all()
    )

    # --------------------------------------------------------
    # Return complete batch
    # --------------------------------------------------------

    return {
        "id": str(batch.id),

        "batch_code": batch.batch_code,

        "hive_id": (
            str(batch.hive_id)
            if batch.hive_id
            else None
        ),

        "beekeeper_id": (
            str(batch.beekeeper_id)
            if batch.beekeeper_id
            else None
        ),

        "harvest_date": batch.harvest_date,

        "harvested_weight_kg":
            batch.harvested_weight_kg,

        "honey_type": batch.honey_type,

        "floral_source": batch.floral_source,

        "status": (
            batch.status.value
            if hasattr(batch.status, "value")
            else batch.status
        ),

        "blockchain_hash":
            batch.blockchain_hash,

        "blockchain_tx_hash":
            batch.blockchain_tx_hash,

        "qr_token":
            batch.qr_token,

        "created_at":
            batch.created_at,

        # ----------------------------------------------------
        # Hive
        # ----------------------------------------------------

        "hive": (
            {
                "id": str(hive.id),
                "hive_code": hive.hive_code,
                "esp32_device_id": hive.esp32_device_id,
                "apiary_id": str(hive.apiary_id),
            }
            if hive
            else None
        ),

        # ----------------------------------------------------
        # Beekeeper
        # ----------------------------------------------------

        "beekeeper": (
            {
                "id": str(beekeeper.id),
                "name": beekeeper.name,
                "organization": beekeeper.organization,
            }
            if beekeeper
            else None
        ),

        # ----------------------------------------------------
        # Supply-chain events
        # ----------------------------------------------------

        "events": [
            SupplyChainEventResponse
            .model_validate(event)
            .model_dump(mode="json")
            for event in events
        ],
    }


# ============================================================
# ADD SUPPLY CHAIN EVENT
# ============================================================

@router.post(
    "/{batch_id}/events",
    response_model=SupplyChainEventResponse,
)
def add_event(
    batch_id: UUID,
    data: SupplyChainEventCreate,
    db: Session = Depends(get_db),
):
    batch = (
        db.query(HoneyBatch)
        .filter(HoneyBatch.id == batch_id)
        .first()
    )

    if not batch:
        raise HTTPException(
            status_code=404,
            detail="Honey batch not found",
        )

    try:
        event_type = SupplyChainEventType(
            data.event_type.lower()
        )
    except ValueError:
        raise HTTPException(
            status_code=400,
            detail=(
                "event_type must be "
                "harvest, processing, packaging, "
                "shipment, or delivery"
            ),
        )

    # If an actor was supplied, verify the user exists.
    if data.actor_id:

        actor = (
            db.query(User)
            .filter(User.id == data.actor_id)
            .first()
        )

        if not actor:
            raise HTTPException(
                status_code=404,
                detail="Actor user not found",
            )

    event = SupplyChainEvent(
        batch_id=batch.id,
        event_type=event_type,

        # Existing DB column
        actor_id=data.actor_id,

        # Existing DB column
        location_name=data.location,

        latitude=data.latitude,
        longitude=data.longitude,
        quantity_kg=data.quantity_kg,
        notes=data.notes,

        # Existing DB column
        created_at=(
            data.occurred_at
            or datetime.now(timezone.utc)
        ),
    )

    db.add(event)

    status_map = {
        SupplyChainEventType.harvest:
            BatchStatus.harvested,

        SupplyChainEventType.processing:
            BatchStatus.processing,

        SupplyChainEventType.packaging:
            BatchStatus.packaged,

        SupplyChainEventType.shipment:
            BatchStatus.shipped,

        SupplyChainEventType.delivery:
            BatchStatus.delivered,
    }

    batch.status = status_map[event_type]

    db.commit()
    db.refresh(event)

    return event