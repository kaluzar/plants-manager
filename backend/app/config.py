"""Application configuration using Pydantic Settings."""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # Database
    database_url: str = "postgresql+asyncpg://plants_user:plants_password@localhost:5432/plants_manager"

    # Security
    secret_key: str = "your-secret-key-change-in-production"
    environment: str = "development"

    # CORS
    cors_origins: list[str] = ["http://localhost:5173", "http://localhost:3000"]

    # File Upload
    upload_dir: str = "./uploads"
    max_upload_size_mb: int = 10

    # Optional: MinIO
    minio_endpoint: str | None = None
    minio_access_key: str | None = None
    minio_secret_key: str | None = None
    minio_bucket: str = "plants-manager"

    # Optional: OpenAI for PydanticAI
    openai_api_key: str | None = None

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
    )


settings = Settings()
