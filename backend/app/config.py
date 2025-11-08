import os
from datetime import timedelta

BASE_DIR = os.path.abspath(os.path.dirname(__file__))


class Config:
    """Application configuration"""
    # Security
    SECRET_KEY = os.environ.get("SECRET_KEY") or os.urandom(32).hex()
    JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY") or os.urandom(32).hex()
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    
    # Database
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL",
        "sqlite:///" + os.path.join(BASE_DIR, "..", "hackutd.db")
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = os.environ.get("SQLALCHEMY_ECHO", "False").lower() == "true"
    
    # CORS
    CORS_ORIGINS = os.environ.get("CORS_ORIGINS", "*")
    
    # Environment
    ENV = os.environ.get("FLASK_ENV", "development")
    DEBUG = os.environ.get("FLASK_DEBUG", "True").lower() == "true"
    
    # Logging
    LOG_LEVEL = os.environ.get("LOG_LEVEL", "INFO")
