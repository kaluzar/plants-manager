# Architecture Document: Garden Plants Manager

## 1. System Overview

A full-stack web application with a Python/FastAPI backend, React frontend, and PostgreSQL database for managing garden plants and care schedules.

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                            │
│                  React + shadcn/ui + TanStack Query         │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ REST API (HTTPS)
                              │
┌─────────────────────────────────────────────────────────────┐
│                         Backend                             │
│                  FastAPI + Pydantic + PydanticAI            │
└─────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────┴─────────┐
                    │                   │
         ┌──────────▼────────┐  ┌──────▼──────────┐
         │    PostgreSQL     │  │  File Storage   │
         │    Database       │  │  (Images)       │
         └───────────────────┘  └─────────────────┘
```

## 2. Technology Stack

### 2.1 Frontend
- **Framework**: React 18+
- **UI Library**: shadcn/ui (Tailwind CSS + Radix UI)
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod validation
- **Date Handling**: date-fns
- **HTTP Client**: Axios
- **Build Tool**: Vite

### 2.2 Backend
- **Framework**: FastAPI 0.100+
- **Validation**: Pydantic v2
- **AI Framework**: PydanticAI (for future AI features)
- **ORM**: SQLAlchemy 2.0+ (async)
- **Migrations**: Alembic
- **Authentication**: JWT (python-jose)
- **Image Processing**: Pillow
- **Task Scheduling**: APScheduler (for notifications/reminders)

### 2.3 Database
- **Primary Database**: PostgreSQL 15+
  - **Rationale**:
    - Robust relational model for complex plant/schedule relationships
    - JSON/JSONB support for flexible metadata storage
    - Excellent performance for filtering and querying schedules
    - Future-proof: pgvector extension for AI/ML features (embeddings, similarity search)
    - Strong Python ecosystem integration (SQLAlchemy, asyncpg)
    - ACID compliance for data integrity
    - Array types for storing multiple values
    - Mature and reliable for production use

### 2.4 File Storage
- **Development**: Local filesystem
- **Production Options**:
  - Local filesystem with backup
  - MinIO (S3-compatible, self-hosted)
  - Cloud storage (S3, Azure Blob, etc.)

### 2.5 Development Tools
- **Python**: Poetry (dependency management)
- **Linting**: Ruff (Python), ESLint (JavaScript)
- **Formatting**: Ruff (Python), Prettier (JavaScript)
- **Testing**: Pytest (backend), Vitest + React Testing Library (frontend)

## 3. Backend Architecture

### 3.1 Project Structure
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI app initialization
│   ├── config.py               # Configuration management
│   ├── database.py             # Database connection
│   ├── dependencies.py         # FastAPI dependencies
│   │
│   ├── models/                 # SQLAlchemy models
│   │   ├── __init__.py
│   │   ├── plant.py
│   │   ├── location.py
│   │   ├── watering.py
│   │   ├── fertilization.py
│   │   ├── treatment.py
│   │   ├── growth_log.py
│   │   └── photo.py
│   │
│   ├── schemas/                # Pydantic schemas
│   │   ├── __init__.py
│   │   ├── plant.py
│   │   ├── location.py
│   │   ├── watering.py
│   │   ├── fertilization.py
│   │   ├── treatment.py
│   │   ├── growth_log.py
│   │   └── photo.py
│   │
│   ├── api/                    # API routes
│   │   ├── __init__.py
│   │   ├── deps.py
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── plants.py
│   │       ├── locations.py
│   │       ├── watering.py
│   │       ├── fertilization.py
│   │       ├── treatments.py
│   │       ├── growth.py
│   │       ├── photos.py
│   │       ├── dashboard.py
│   │       └── ai.py           # PydanticAI endpoints (future)
│   │
│   ├── services/               # Business logic
│   │   ├── __init__.py
│   │   ├── plant_service.py
│   │   ├── schedule_service.py
│   │   ├── notification_service.py
│   │   ├── photo_service.py
│   │   └── ai_service.py       # PydanticAI integration
│   │
│   ├── repositories/           # Data access layer
│   │   ├── __init__.py
│   │   ├── plant_repository.py
│   │   ├── watering_repository.py
│   │   └── ...
│   │
│   └── utils/
│       ├── __init__.py
│       ├── image_processor.py
│       ├── date_helpers.py
│       └── validators.py
│
├── alembic/                    # Database migrations
├── tests/
├── pyproject.toml
└── README.md
```

### 3.2 Database Schema

#### Core Tables

**plants**
- id (PK, UUID)
- name (VARCHAR)
- scientific_name (VARCHAR, nullable)
- type (ENUM: indoor, outdoor)
- category (ENUM: flower, tree, grass, other)
- species (VARCHAR)
- location_id (FK)
- acquisition_date (DATE, nullable)
- notes (TEXT)
- metadata (JSONB) - flexible storage for custom attributes
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)

**locations**
- id (PK, UUID)
- name (VARCHAR)
- type (ENUM: indoor, outdoor)
- description (TEXT)
- zone (VARCHAR) - e.g., "Front Garden", "Living Room"
- metadata (JSONB) - coordinates, visual layout info
- created_at (TIMESTAMP)

**watering_schedules**
- id (PK, UUID)
- plant_id (FK)
- frequency_days (INTEGER)
- amount (VARCHAR, nullable)
- season (ENUM: all, spring, summer, fall, winter)
- active (BOOLEAN)
- created_at (TIMESTAMP)

**watering_logs**
- id (PK, UUID)
- plant_id (FK)
- watered_at (TIMESTAMP)
- amount (VARCHAR, nullable)
- notes (TEXT)
- created_at (TIMESTAMP)

**fertilization_schedules**
- id (PK, UUID)
- plant_id (FK)
- frequency_days (INTEGER)
- fertilizer_type (VARCHAR)
- amount (VARCHAR)
- active (BOOLEAN)
- created_at (TIMESTAMP)

**fertilization_logs**
- id (PK, UUID)
- plant_id (FK)
- fertilized_at (TIMESTAMP)
- fertilizer_type (VARCHAR)
- amount (VARCHAR)
- notes (TEXT)
- created_at (TIMESTAMP)

**treatments**
- id (PK, UUID)
- plant_id (FK)
- type (ENUM: pest, disease, preventive)
- name (VARCHAR) - pest/disease name
- severity (ENUM: low, medium, high)
- discovered_at (DATE)
- resolved_at (DATE, nullable)
- status (ENUM: active, resolved, monitoring)
- notes (TEXT)
- created_at (TIMESTAMP)

**treatment_applications**
- id (PK, UUID)
- treatment_id (FK)
- product (VARCHAR)
- application_date (TIMESTAMP)
- next_application_date (DATE, nullable)
- effectiveness_notes (TEXT)
- created_at (TIMESTAMP)

**growth_logs**
- id (PK, UUID)
- plant_id (FK)
- log_date (DATE)
- log_type (ENUM: measurement, milestone, observation, pruning, repotting)
- height_cm (DECIMAL, nullable)
- width_cm (DECIMAL, nullable)
- notes (TEXT)
- created_at (TIMESTAMP)

**photos**
- id (PK, UUID)
- plant_id (FK)
- treatment_id (FK, nullable) - for treatment photos
- growth_log_id (FK, nullable) - for growth tracking
- file_path (VARCHAR)
- file_name (VARCHAR)
- file_size (INTEGER)
- mime_type (VARCHAR)
- caption (TEXT)
- taken_at (TIMESTAMP)
- created_at (TIMESTAMP)

#### Indexes
- plants: (type), (category), (location_id), (species)
- watering_logs: (plant_id, watered_at), (watered_at)
- fertilization_logs: (plant_id, fertilized_at), (fertilized_at)
- treatments: (plant_id, status), (status)
- growth_logs: (plant_id, log_date), (log_date)
- photos: (plant_id), (treatment_id), (growth_log_id)

### 3.3 API Design

**RESTful API Structure**

Base URL: `/api/v1`

#### Plants
- `GET /plants` - List plants (with filters, pagination)
- `POST /plants` - Create plant
- `GET /plants/{id}` - Get plant details
- `PUT /plants/{id}` - Update plant
- `DELETE /plants/{id}` - Delete plant
- `GET /plants/{id}/timeline` - Get complete plant timeline

#### Locations
- `GET /locations` - List locations
- `POST /locations` - Create location
- `GET /locations/{id}` - Get location details
- `PUT /locations/{id}` - Update location
- `DELETE /locations/{id}` - Delete location
- `GET /locations/{id}/plants` - Get plants in location

#### Watering
- `GET /plants/{id}/watering/schedule` - Get watering schedule
- `POST /plants/{id}/watering/schedule` - Create watering schedule
- `PUT /watering/schedules/{id}` - Update schedule
- `POST /plants/{id}/watering/log` - Log watering event
- `GET /plants/{id}/watering/logs` - Get watering history
- `GET /watering/due` - Get plants due for watering

#### Fertilization
- `GET /plants/{id}/fertilization/schedule` - Get fertilization schedule
- `POST /plants/{id}/fertilization/schedule` - Create schedule
- `PUT /fertilization/schedules/{id}` - Update schedule
- `POST /plants/{id}/fertilization/log` - Log fertilization
- `GET /plants/{id}/fertilization/logs` - Get history
- `GET /fertilization/due` - Get plants due for fertilization

#### Treatments
- `GET /plants/{id}/treatments` - List treatments
- `POST /plants/{id}/treatments` - Create treatment
- `GET /treatments/{id}` - Get treatment details
- `PUT /treatments/{id}` - Update treatment
- `POST /treatments/{id}/applications` - Log treatment application
- `GET /treatments/active` - Get all active treatments

#### Growth Tracking
- `GET /plants/{id}/growth` - Get growth history
- `POST /plants/{id}/growth` - Log growth entry
- `PUT /growth/{id}` - Update growth entry
- `DELETE /growth/{id}` - Delete growth entry

#### Photos
- `POST /plants/{id}/photos` - Upload photo
- `GET /photos/{id}` - Get photo
- `DELETE /photos/{id}` - Delete photo
- `GET /plants/{id}/photos` - Get plant photos

#### Dashboard
- `GET /dashboard/overview` - Dashboard stats
- `GET /dashboard/tasks` - Upcoming tasks (watering, fertilization)
- `GET /dashboard/calendar` - Calendar view data

#### AI (Future)
- `POST /ai/analyze-disease` - Analyze disease from photo
- `POST /ai/suggest-fertilization` - Suggest fertilization schedule
- `POST /ai/plant-recommendations` - Get care recommendations

### 3.4 PydanticAI Integration

**Future AI Features**
- **Disease Analysis**: Upload photo → identify disease → suggest treatment
- **Fertilization Suggestions**: Based on plant type, soil, season → recommend schedule
- **Care Recommendations**: Analyze plant history → provide personalized advice
- **Pest Identification**: Photo-based pest recognition

**Implementation Approach**
```python
from pydantic_ai import Agent
from pydantic_ai.models.openai import OpenAIModel

# Example: Disease analyzer
disease_agent = Agent(
    model=OpenAIModel('gpt-4o'),
    system_prompt="You are a plant disease expert..."
)

# Service layer
async def analyze_plant_disease(image_data: bytes, plant_info: dict):
    result = await disease_agent.run(
        user_prompt=f"Analyze this plant image for diseases. Plant type: {plant_info['species']}",
        images=[image_data]
    )
    return result
```

## 4. Frontend Architecture

### 4.1 Project Structure
```
frontend/
├── src/
│   ├── main.tsx                # Entry point
│   ├── App.tsx                 # Root component
│   ├── routes.tsx              # Route definitions
│   │
│   ├── components/             # Reusable components
│   │   ├── ui/                 # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── ...
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Layout.tsx
│   │   ├── plants/
│   │   │   ├── PlantCard.tsx
│   │   │   ├── PlantList.tsx
│   │   │   ├── PlantForm.tsx
│   │   │   └── PlantDetail.tsx
│   │   ├── schedule/
│   │   │   ├── WateringSchedule.tsx
│   │   │   ├── FertilizationSchedule.tsx
│   │   │   └── CalendarView.tsx
│   │   ├── treatments/
│   │   │   ├── TreatmentCard.tsx
│   │   │   └── TreatmentForm.tsx
│   │   ├── growth/
│   │   │   ├── GrowthTimeline.tsx
│   │   │   ├── GrowthChart.tsx
│   │   │   └── PhotoGallery.tsx
│   │   └── locations/
│   │       ├── LocationMap.tsx
│   │       └── LocationSelector.tsx
│   │
│   ├── pages/                  # Page components
│   │   ├── Dashboard.tsx
│   │   ├── PlantList.tsx
│   │   ├── PlantDetail.tsx
│   │   ├── Calendar.tsx
│   │   ├── Locations.tsx
│   │   └── Settings.tsx
│   │
│   ├── hooks/                  # Custom hooks
│   │   ├── usePlants.ts
│   │   ├── useWatering.ts
│   │   ├── useTreatments.ts
│   │   └── usePhotos.ts
│   │
│   ├── services/               # API services
│   │   ├── api.ts              # Axios setup
│   │   ├── plants.ts
│   │   ├── watering.ts
│   │   ├── fertilization.ts
│   │   ├── treatments.ts
│   │   └── photos.ts
│   │
│   ├── types/                  # TypeScript types
│   │   ├── plant.ts
│   │   ├── schedule.ts
│   │   └── treatment.ts
│   │
│   ├── lib/                    # Utilities
│   │   ├── utils.ts            # shadcn/ui utils
│   │   ├── dates.ts
│   │   └── validators.ts
│   │
│   └── styles/
│       └── globals.css         # Tailwind imports
│
├── public/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

### 4.2 Key Frontend Patterns

#### State Management
- **Server State**: TanStack Query for caching, invalidation, optimistic updates
- **UI State**: React useState/useReducer for local state
- **Forms**: React Hook Form with Zod schemas

#### Data Fetching Example
```typescript
// hooks/usePlants.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getPlants, createPlant } from '@/services/plants'

export function usePlants(filters?: PlantFilters) {
  return useQuery({
    queryKey: ['plants', filters],
    queryFn: () => getPlants(filters)
  })
}

export function useCreatePlant() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createPlant,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['plants'] })
    }
  })
}
```

#### Component Example with shadcn/ui
```typescript
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { usePlants } from '@/hooks/usePlants'

export function PlantList() {
  const { data: plants, isLoading } = usePlants()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {plants?.map(plant => (
        <Card key={plant.id}>
          <CardHeader>
            <CardTitle>{plant.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{plant.species}</p>
            <Button variant="outline">View Details</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
```

## 5. Deployment Architecture

### 5.1 Development Environment
```
Docker Compose:
- Backend (FastAPI) - localhost:8000
- Frontend (Vite dev server) - localhost:5173
- PostgreSQL - localhost:5432
- MinIO (optional) - localhost:9000
```

### 5.2 Production Options

**Option 1: Single Server (VPS)**
```
Nginx (reverse proxy)
├── /api → FastAPI (Gunicorn + Uvicorn workers)
├── / → React static files
└── PostgreSQL (local or managed)
```

**Option 2: Containerized (Docker)**
```
Docker Compose / Kubernetes:
- Frontend container (Nginx serving static files)
- Backend container (FastAPI)
- PostgreSQL container
- Shared volume for image storage
```

**Option 3: Cloud Platform**
- Frontend: Vercel / Netlify
- Backend: Railway / Render / AWS ECS
- Database: AWS RDS / Supabase / Neon
- Storage: S3 / Cloudflare R2

## 6. Security Considerations

- **Authentication**: JWT-based (future multi-user expansion)
- **API Security**: CORS configuration, rate limiting
- **File Upload**: Size limits, type validation, virus scanning
- **Database**: Parameterized queries (SQLAlchemy ORM)
- **Environment**: Secrets management (environment variables)
- **HTTPS**: TLS/SSL in production

## 7. Performance Optimization

### 7.1 Backend
- Async database operations (asyncpg + SQLAlchemy async)
- Database connection pooling
- Query optimization and proper indexing
- Image compression and thumbnails
- Caching (Redis optional for future)

### 7.2 Frontend
- Code splitting (React.lazy)
- Image lazy loading
- Virtual scrolling for long lists
- Debounced search inputs
- Optimistic UI updates

## 8. Development Workflow

### 8.1 Backend Setup
```bash
cd backend
poetry install
poetry run alembic upgrade head
poetry run uvicorn app.main:app --reload
```

### 8.2 Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### 8.3 Database Migrations
```bash
# Create migration
poetry run alembic revision --autogenerate -m "description"

# Apply migration
poetry run alembic upgrade head
```

## 9. Testing Strategy

### 9.1 Backend
- Unit tests: Service layer, utilities
- Integration tests: API endpoints, database operations
- Test database: Separate PostgreSQL instance

### 9.2 Frontend
- Unit tests: Utility functions, hooks
- Component tests: React Testing Library
- E2E tests (optional): Playwright

## 10. Monitoring & Logging

- **Backend**: Structured logging (loguru)
- **Frontend**: Error tracking (Sentry optional)
- **Database**: Query performance monitoring
- **API**: Request/response logging

## 11. Future Enhancements

### AI/ML Features (PydanticAI)
- Disease detection from photos
- Automated care recommendations
- Plant health predictions
- Natural language plant queries

### Technical Improvements
- Real-time notifications (WebSocket)
- Mobile PWA capabilities
- Offline support
- Export/import data
- Backup automation

### Feature Additions
- Weather integration
- Seasonal care templates
- Plant care knowledge base
- Cost tracking
