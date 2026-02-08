# Plants Manager

A full-stack web application for managing ornamental plants in your garden. Track watering schedules, fertilization, pest treatments, growth progress, and organize plants by location.

## Features

- **Plant Registry**: Catalog your plants with photos and detailed information
- **Watering Management**: Schedule and track watering with reminders
- **Fertilization Tracking**: Manage fertilization schedules and logs
- **Pest & Disease Management**: Track treatments and their effectiveness
- **Growth Tracking**: Monitor plant growth with photos and measurements
- **Location Mapping**: Organize plants by indoor/outdoor locations
- **Dashboard**: Overview of care tasks and plant statistics
- **Calendar View**: Visual timeline of all scheduled activities

## Tech Stack

### Backend
- **Framework**: FastAPI
- **Database**: PostgreSQL 15+
- **ORM**: SQLAlchemy 2.0 (async)
- **Migrations**: Alembic
- **AI**: PydanticAI (for future features)
- **Python**: 3.11+

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Library**: shadcn/ui (Tailwind CSS)
- **State Management**: TanStack Query
- **Routing**: React Router v6

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 15+ (or use Docker Compose)
- Poetry (optional, for Python dependency management)

### 1. Clone the Repository
```bash
git clone git@github.com:kaluzar/plants-manager.git
cd plants-manager
```

### 2. Set Up Environment Variables
```bash
cp .env.example .env
# Edit .env with your configuration if needed
```

### 3. Start PostgreSQL
```bash
# Using Docker Compose (recommended for development)
docker-compose up -d postgres
```

### 4. Set Up Backend
```bash
cd backend

# Install dependencies
poetry install
# Or: pip install -r requirements.txt

# Run database migrations
poetry run alembic upgrade head

# Start the backend server
poetry run uvicorn app.main:app --reload
```

Backend will be available at http://localhost:8000
- API docs: http://localhost:8000/docs
- Health check: http://localhost:8000/health

### 5. Set Up Frontend
```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

Frontend will be available at http://localhost:5173

## Development

### Backend Development
See [backend/README.md](backend/README.md) for detailed backend documentation.

```bash
# Run tests
cd backend
poetry run pytest

# Lint code
poetry run ruff check .

# Create database migration
poetry run alembic revision --autogenerate -m "description"
```

### Frontend Development
See [frontend/README.md](frontend/README.md) for detailed frontend documentation.

```bash
# Run linting
cd frontend
npm run lint

# Build for production
npm run build
```

## Project Structure

```
plants-manager/
├── backend/              # FastAPI backend
│   ├── app/
│   │   ├── api/         # API routes
│   │   ├── models/      # Database models
│   │   ├── schemas/     # Pydantic schemas
│   │   ├── services/    # Business logic
│   │   └── ...
│   ├── alembic/         # Database migrations
│   └── tests/           # Backend tests
├── frontend/            # React frontend
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── pages/       # Page components
│   │   ├── hooks/       # Custom hooks
│   │   ├── services/    # API services
│   │   └── ...
│   └── public/          # Static assets
├── docker-compose.yml   # Docker services
├── .env.example         # Environment variables template
├── PRD.md              # Product Requirements Document
├── ARCHITECTURE.md     # Technical Architecture
└── IMPLEMENTATION_PLAN.md  # Development roadmap
```

## Documentation

- [Product Requirements Document](PRD.md) - Feature specifications and requirements
- [Architecture Document](ARCHITECTURE.md) - Technical architecture and design decisions
- [Implementation Plan](IMPLEMENTATION_PLAN.md) - 12-week development roadmap

## Development Status

✅ **Phase 1: Project Setup** (Current)
- [x] Project structure
- [x] Backend foundation (FastAPI + PostgreSQL)
- [x] Frontend foundation (React + shadcn/ui)
- [x] Docker Compose setup
- [x] Basic layout and navigation

🔜 **Next Steps** (Phase 2)
- [ ] Location management
- [ ] Plant registry (CRUD)
- [ ] Plant list and detail views

See [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) for the complete roadmap.

## Future Features

- 🤖 AI-powered disease detection (PydanticAI)
- 🌱 Automated care recommendations
- 📊 Advanced analytics and insights
- 📱 Mobile app
- 🌦️ Weather integration

## Contributing

This is a personal project, but feedback and suggestions are welcome!

## License

MIT
