"""
Application configuration.
Reads settings from environment variables (see .env.example).
"""
import os
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = os.path.abspath(os.path.dirname(__file__))


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev-secret-key")
    FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

    DB_HOST = os.getenv("DB_HOST", "localhost")
    DB_PORT = os.getenv("DB_PORT", "3306")
    DB_NAME = os.getenv("DB_NAME", "steel_waste_management")
    DB_USER = os.getenv("DB_USER", "root")
    DB_PASSWORD = os.getenv("DB_PASSWORD", "")

    # Prototype implementation assumption: if USE_SQLITE=true, the app falls
    # back to a local SQLite file instead of MySQL. This is only provided so
    # the project can be demonstrated instantly without a MySQL server
    # installed. Production/academic deployment should use MySQL as
    # specified in the project document's software requirements.
    USE_SQLITE = os.getenv("USE_SQLITE", "false").lower() == "true"

    if USE_SQLITE:
        SQLALCHEMY_DATABASE_URI = f"sqlite:///{os.path.join(BASE_DIR, 'steel_waste_dev.db')}"
    else:
        SQLALCHEMY_DATABASE_URI = (
            f"mysql+mysqlconnector://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
        )

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    ML_MODEL_PATH = os.path.join(BASE_DIR, "saved_models", "lda_model.pkl")
    DATASET_PATH = os.path.join(BASE_DIR, "dataset", "steel_waste_dataset.csv")
