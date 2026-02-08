# Plants Manager Backend

FastAPI backend for the Plants Manager application.

## Setup

### Prerequisites
- Python 3.11+
- Poetry (or pip)
- PostgreSQL 15+

### Installation

1. Install dependencies:
```bash
# Using Poetry (recommended)
poetry install

# Or using pip
pip install -r requirements.txt  # You'll need to generate this from pyproject.toml
```

2. Set up environment variables:
```bash
cp ../.env.example .env
# Edit .env with your configuration
```

3. Start PostgreSQL:
```bash
# Using Docker Compose from project root
cd ..
docker-compose up -d postgres
```

4. Run database migrations:
```bash
poetry run alembic upgrade head
```

5. Start the development server:
```bash
poetry run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at http://localhost:8000

## API Documentation

Once the server is running:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
- Health check: http://localhost:8000/health

## Development

### Code Quality

Run linting:
```bash
poetry run ruff check .
```

Run tests:
```bash
poetry run pytest
```

### Database Migrations

Create a new migration:
```bash
poetry run alembic revision --autogenerate -m "description"
```

Apply migrations:
```bash
poetry run alembic upgrade head
```

Rollback migration:
```bash
poetry run alembic downgrade -1
```

## Project Structure

```
backend/
├── app/
│   ├── api/v1/           # API endpoints
│   ├── models/           # SQLAlchemy models
│   ├── schemas/          # Pydantic schemas
│   ├── services/         # Business logic
│   ├── repositories/     # Data access layer
│   ├── utils/            # Utility functions
│   ├── config.py         # Configuration
│   ├── database.py       # Database setup
│   └── main.py           # FastAPI app
├── alembic/              # Database migrations
├── tests/                # Tests
└── pyproject.toml        # Dependencies
```
