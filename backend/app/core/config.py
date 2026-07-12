from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # App
    APP_NAME: str
    APP_VERSION: str
    APP_DESCRIPTION: str

    # Database
    DATABASE_URL: str

    # Gemini API
    GOOGLE_API_KEY: str

    # Storage
    UPLOAD_FOLDER: str = "uploads"
    VECTOR_STORE_PATH: str = "vectorstore"

    class Config:
        env_file = ".env"


settings = Settings()