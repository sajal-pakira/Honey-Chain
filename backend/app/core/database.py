import os

from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from dotenv import load_dotenv


# Load environment variables from .env
load_dotenv()


# ------------------------------------------------------------
# DATABASE URL
# ------------------------------------------------------------

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise RuntimeError(
        "DATABASE_URL is not set. "
        "Add it to backend/.env"
    )


# ------------------------------------------------------------
# SQLAlchemy Engine
# ------------------------------------------------------------

engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,
)


# ------------------------------------------------------------
# Database Session
# ------------------------------------------------------------

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)


# ------------------------------------------------------------
# Base class for SQLAlchemy models
# ------------------------------------------------------------

Base = declarative_base()


# ------------------------------------------------------------
# FastAPI Database Dependency
# ------------------------------------------------------------

def get_db():
    """
    Creates a database session for a request
    and closes it after the request is completed.
    """

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()