from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str
    APP_VERSION: str
    APP_DESCRIPTION: str
    DATABASE_URL: str

    class Config:
        env_file = ".env"


settings = Settings()