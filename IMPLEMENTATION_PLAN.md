# Implementation Plan: Garden Plants Manager

## Overview
This document provides a step-by-step plan for implementing the Garden Plants Manager application from scratch to production-ready deployment.

---

## Phase 1: Project Setup & Infrastructure (Week 1)

### Step 1.1: Repository & Development Environment Setup
- [ ] Initialize Git repository
- [ ] Create `.gitignore` for Python and Node.js
- [ ] Set up project directory structure (backend/, frontend/)
- [ ] Create development Docker Compose file (PostgreSQL, MinIO optional)
- [ ] Document setup instructions in README.md

### Step 1.2: Backend Foundation
- [ ] Initialize FastAPI project structure
- [ ] Set up Poetry for dependency management
- [ ] Install core dependencies:
  - fastapi
  - uvicorn[standard]
  - sqlalchemy[asyncio]
  - asyncpg
  - alembic
  - pydantic
  - pydantic-settings
  - python-jose[cryptography]
  - python-multipart
  - pillow
- [ ] Create `config.py` with environment-based settings
- [ ] Set up database connection (database.py)
- [ ] Configure CORS middleware
- [ ] Create basic health check endpoint

### Step 1.3: Database Setup
- [ ] Start PostgreSQL container/instance
- [ ] Initialize Alembic for migrations
- [ ] Create initial database structure (empty migration)
- [ ] Test database connection

### Step 1.4: Frontend Foundation
- [ ] Initialize Vite + React + TypeScript project
- [ ] Install core dependencies:
  - react-router-dom
  - @tanstack/react-query
  - axios
  - react-hook-form
  - zod
  - date-fns
- [ ] Set up shadcn/ui:
  - Install Tailwind CSS
  - Initialize shadcn/ui
  - Install base components (button, card, input, form, dialog, etc.)
- [ ] Configure Axios with base URL
- [ ] Set up React Query provider
- [ ] Create basic routing structure
- [ ] Create basic layout (Header, Sidebar, main content area)

### Step 1.5: Development Workflow
- [ ] Set up linting (Ruff for Python, ESLint for JS)
- [ ] Set up formatting (Ruff for Python, Prettier for JS)
- [ ] Create npm/poetry scripts for common tasks
- [ ] Test hot-reload for both backend and frontend

---

## Phase 2: Core Domain Models & API (Week 2-3)

### Step 2.1: Location Management
**Backend:**
- [ ] Create `Location` SQLAlchemy model
- [ ] Create Pydantic schemas (LocationCreate, LocationUpdate, LocationResponse)
- [ ] Create location repository (CRUD operations)
- [ ] Create location service (business logic)
- [ ] Implement location API endpoints:
  - GET /api/v1/locations
  - POST /api/v1/locations
  - GET /api/v1/locations/{id}
  - PUT /api/v1/locations/{id}
  - DELETE /api/v1/locations/{id}
- [ ] Create and run Alembic migration
- [ ] Write tests for location endpoints

**Frontend:**
- [ ] Create TypeScript types for Location
- [ ] Create location API service
- [ ] Create `useLocations` hook (React Query)
- [ ] Create LocationForm component
- [ ] Create LocationCard component
- [ ] Create Locations page
- [ ] Test location CRUD operations

### Step 2.2: Plant Management
**Backend:**
- [ ] Create `Plant` SQLAlchemy model (with location relationship)
- [ ] Create Pydantic schemas (PlantCreate, PlantUpdate, PlantResponse)
- [ ] Create plant repository
- [ ] Create plant service (with filters: type, category, location, species)
- [ ] Implement plant API endpoints:
  - GET /api/v1/plants (with filtering and pagination)
  - POST /api/v1/plants
  - GET /api/v1/plants/{id}
  - PUT /api/v1/plants/{id}
  - DELETE /api/v1/plants/{id}
  - GET /api/v1/locations/{id}/plants
- [ ] Create and run Alembic migration
- [ ] Write tests for plant endpoints

**Frontend:**
- [ ] Create TypeScript types for Plant
- [ ] Create plant API service
- [ ] Create `usePlants` and `usePlant` hooks
- [ ] Create PlantForm component (with location selector)
- [ ] Create PlantCard component
- [ ] Create PlantList component (with filters)
- [ ] Create PlantDetail page (basic info)
- [ ] Create Plants page
- [ ] Test plant CRUD operations

---

## Phase 3: Watering & Fertilization (Week 4-5)

### Step 3.1: Watering System
**Backend:**
- [ ] Create `WateringSchedule` and `WateringLog` models
- [ ] Create Pydantic schemas for schedules and logs
- [ ] Create watering repository
- [ ] Create watering service:
  - Schedule management
  - Calculate next watering date
  - Get plants due for watering
- [ ] Implement watering API endpoints:
  - GET /api/v1/plants/{id}/watering/schedule
  - POST /api/v1/plants/{id}/watering/schedule
  - PUT /api/v1/watering/schedules/{id}
  - POST /api/v1/plants/{id}/watering/log
  - GET /api/v1/plants/{id}/watering/logs
  - GET /api/v1/watering/due
- [ ] Create and run Alembic migration
- [ ] Write tests

**Frontend:**
- [ ] Create TypeScript types for watering
- [ ] Create watering API service
- [ ] Create `useWatering` hooks
- [ ] Create WateringScheduleForm component
- [ ] Create WateringLogForm component (quick log)
- [ ] Create WateringHistory component
- [ ] Add watering section to PlantDetail page
- [ ] Test watering functionality

### Step 3.2: Fertilization System
**Backend:**
- [ ] Create `FertilizationSchedule` and `FertilizationLog` models
- [ ] Create Pydantic schemas
- [ ] Create fertilization repository
- [ ] Create fertilization service (similar to watering)
- [ ] Implement fertilization API endpoints:
  - GET /api/v1/plants/{id}/fertilization/schedule
  - POST /api/v1/plants/{id}/fertilization/schedule
  - PUT /api/v1/fertilization/schedules/{id}
  - POST /api/v1/plants/{id}/fertilization/log
  - GET /api/v1/plants/{id}/fertilization/logs
  - GET /api/v1/fertilization/due
- [ ] Create and run Alembic migration
- [ ] Write tests

**Frontend:**
- [ ] Create TypeScript types for fertilization
- [ ] Create fertilization API service
- [ ] Create `useFertilization` hooks
- [ ] Create FertilizationScheduleForm component
- [ ] Create FertilizationLogForm component
- [ ] Create FertilizationHistory component
- [ ] Add fertilization section to PlantDetail page
- [ ] Test fertilization functionality

---

## Phase 4: Pest/Disease Treatment (Week 6)

### Step 4.1: Treatment Management
**Backend:**
- [ ] Create `Treatment` and `TreatmentApplication` models
- [ ] Create Pydantic schemas
- [ ] Create treatment repository
- [ ] Create treatment service:
  - Treatment lifecycle management
  - Active treatments tracking
  - Application scheduling
- [ ] Implement treatment API endpoints:
  - GET /api/v1/plants/{id}/treatments
  - POST /api/v1/plants/{id}/treatments
  - GET /api/v1/treatments/{id}
  - PUT /api/v1/treatments/{id}
  - POST /api/v1/treatments/{id}/applications
  - GET /api/v1/treatments/active
- [ ] Create and run Alembic migration
- [ ] Write tests

**Frontend:**
- [ ] Create TypeScript types for treatments
- [ ] Create treatment API service
- [ ] Create `useTreatments` hooks
- [ ] Create TreatmentForm component
- [ ] Create TreatmentCard component (with status badges)
- [ ] Create TreatmentApplicationForm component
- [ ] Create TreatmentList component
- [ ] Add treatments section to PlantDetail page
- [ ] Test treatment functionality

---

## Phase 5: Growth Tracking & Photos (Week 7)

### Step 5.1: Photo Upload & Management
**Backend:**
- [ ] Create `Photo` model
- [ ] Create Pydantic schemas
- [ ] Implement photo service:
  - File upload handling
  - Image compression/thumbnails (Pillow)
  - File storage (local or MinIO)
  - File deletion
- [ ] Create photo repository
- [ ] Implement photo API endpoints:
  - POST /api/v1/plants/{id}/photos (multipart/form-data)
  - GET /api/v1/photos/{id}
  - DELETE /api/v1/photos/{id}
  - GET /api/v1/plants/{id}/photos
- [ ] Create and run Alembic migration
- [ ] Write tests

**Frontend:**
- [ ] Create TypeScript types for photos
- [ ] Create photo API service
- [ ] Create `usePhotos` hooks
- [ ] Create PhotoUpload component (drag & drop)
- [ ] Create PhotoGallery component (grid view)
- [ ] Create PhotoViewer component (lightbox)
- [ ] Add photo gallery to PlantDetail page
- [ ] Test photo upload/delete

### Step 5.2: Growth Tracking
**Backend:**
- [ ] Create `GrowthLog` model (with photo relationship)
- [ ] Create Pydantic schemas
- [ ] Create growth log repository
- [ ] Create growth log service
- [ ] Implement growth API endpoints:
  - GET /api/v1/plants/{id}/growth
  - POST /api/v1/plants/{id}/growth
  - PUT /api/v1/growth/{id}
  - DELETE /api/v1/growth/{id}
- [ ] Create and run Alembic migration
- [ ] Write tests

**Frontend:**
- [ ] Create TypeScript types for growth logs
- [ ] Create growth API service
- [ ] Create `useGrowth` hooks
- [ ] Create GrowthLogForm component
- [ ] Create GrowthTimeline component
- [ ] Create GrowthChart component (measurements over time)
- [ ] Add growth section to PlantDetail page
- [ ] Test growth tracking

---

## Phase 6: Dashboard & Calendar (Week 8)

### Step 6.1: Dashboard
**Backend:**
- [ ] Create dashboard service:
  - Aggregate statistics (total plants, by type, by location)
  - Due tasks (watering, fertilization)
  - Active treatments
  - Recent activities
- [ ] Implement dashboard API endpoints:
  - GET /api/v1/dashboard/overview
  - GET /api/v1/dashboard/tasks
- [ ] Write tests

**Frontend:**
- [ ] Create dashboard API service
- [ ] Create `useDashboard` hook
- [ ] Create DashboardStats component (cards)
- [ ] Create TaskList component (due watering/fertilization)
- [ ] Create ActiveTreatments component
- [ ] Create RecentActivities component
- [ ] Create Dashboard page
- [ ] Test dashboard display

### Step 6.2: Calendar View
**Backend:**
- [ ] Create calendar service:
  - Aggregate all scheduled activities
  - Filter by date range
- [ ] Implement calendar API endpoint:
  - GET /api/v1/dashboard/calendar?start_date=&end_date=
- [ ] Write tests

**Frontend:**
- [ ] Install calendar library (e.g., react-big-calendar or build custom)
- [ ] Create calendar API service
- [ ] Create `useCalendar` hook
- [ ] Create CalendarView component
- [ ] Create Calendar page
- [ ] Test calendar functionality

---

## Phase 7: Plant Timeline & Enhanced UI (Week 9)

### Step 7.1: Plant Timeline
**Backend:**
- [ ] Create timeline service:
  - Aggregate all plant activities (watering, fertilization, treatments, growth)
  - Sort chronologically
- [ ] Implement timeline API endpoint:
  - GET /api/v1/plants/{id}/timeline
- [ ] Write tests

**Frontend:**
- [ ] Create timeline API service
- [ ] Create `usePlantTimeline` hook
- [ ] Create TimelineItem component
- [ ] Create PlantTimeline component
- [ ] Add timeline tab to PlantDetail page
- [ ] Test timeline display

### Step 7.2: Location Map/Grid View
**Frontend:**
- [ ] Design location visualization approach
- [ ] Create LocationMap component (grid or visual layout)
- [ ] Add plant status indicators (needs water, has treatment, etc.)
- [ ] Create interactive location view
- [ ] Test location visualization

### Step 7.3: UI Enhancements
**Frontend:**
- [ ] Add search functionality to plant list
- [ ] Add sorting options
- [ ] Add filter panel (type, location, category)
- [ ] Add pagination
- [ ] Improve mobile responsiveness
- [ ] Add loading states and skeletons
- [ ] Add empty states
- [ ] Improve error handling and messages

---

## Phase 8: Notifications & Reminders (Week 10)

### Step 8.1: Notification System
**Backend:**
- [ ] Install and configure APScheduler
- [ ] Create notification service:
  - Check daily for due tasks
  - Check for overdue tasks
- [ ] Create background job scheduler
- [ ] Implement notification endpoints:
  - GET /api/v1/notifications (in-app notifications)
  - POST /api/v1/notifications/{id}/read
- [ ] Decide on notification delivery:
  - In-app only (initial)
  - Email (optional)
  - Browser push (optional)
- [ ] Write tests

**Frontend:**
- [ ] Create notification API service
- [ ] Create `useNotifications` hook
- [ ] Create NotificationBell component (header)
- [ ] Create NotificationList component
- [ ] Add notification indicators
- [ ] Test notifications

---

## Phase 9: Testing & Polish (Week 11)

### Step 9.1: Backend Testing
- [ ] Achieve >80% test coverage for services
- [ ] Test all API endpoints (happy path + errors)
- [ ] Test database operations and migrations
- [ ] Test file upload and storage
- [ ] Performance testing (query optimization)
- [ ] Load testing (if applicable)

### Step 9.2: Frontend Testing
- [ ] Write unit tests for utilities and hooks
- [ ] Write component tests for key components
- [ ] Test form validations
- [ ] Test error scenarios
- [ ] Manual cross-browser testing
- [ ] Mobile responsiveness testing

### Step 9.3: UI/UX Polish
- [ ] Consistent spacing and typography
- [ ] Color scheme refinement
- [ ] Icon consistency
- [ ] Animation and transitions
- [ ] Accessibility improvements (ARIA labels, keyboard navigation)
- [ ] User feedback (toasts, confirmations)

### Step 9.4: Documentation
- [ ] API documentation (OpenAPI/Swagger)
- [ ] User guide (if needed)
- [ ] Developer documentation (setup, architecture)
- [ ] Code comments for complex logic

---

## Phase 10: Deployment Preparation (Week 12)

### Step 10.1: Production Configuration
**Backend:**
- [ ] Environment variable validation
- [ ] Production logging setup
- [ ] Error tracking setup (optional: Sentry)
- [ ] Security review:
  - CORS configuration
  - Rate limiting
  - Input validation
  - SQL injection prevention (ORM handles this)
- [ ] Database backup strategy
- [ ] Image storage configuration (local/S3/MinIO)

**Frontend:**
- [ ] Environment variable setup
- [ ] Build optimization
- [ ] Production API endpoint configuration
- [ ] Error tracking setup
- [ ] Performance optimization (code splitting, lazy loading)

### Step 10.2: Docker Configuration
- [ ] Create production Dockerfile for backend
- [ ] Create production Dockerfile for frontend (Nginx)
- [ ] Create docker-compose.yml for production
- [ ] Create .dockerignore files
- [ ] Test Docker build and run locally

### Step 10.3: Deployment
- [ ] Choose deployment platform (VPS, cloud, etc.)
- [ ] Set up PostgreSQL (managed or self-hosted)
- [ ] Configure domain and SSL certificate
- [ ] Set up CI/CD pipeline (optional: GitHub Actions)
- [ ] Deploy backend
- [ ] Deploy frontend
- [ ] Configure reverse proxy (Nginx)
- [ ] Test production deployment

### Step 10.4: Monitoring
- [ ] Set up application monitoring
- [ ] Set up database monitoring
- [ ] Set up log aggregation
- [ ] Set up automated backups
- [ ] Create runbook for common issues

---

## Phase 11: PydanticAI Integration (Week 13-14) - Optional/Future

### Step 11.1: PydanticAI Setup
- [ ] Install pydantic-ai and dependencies
- [ ] Configure AI model (OpenAI API key)
- [ ] Create AI service structure
- [ ] Set up prompt templates

### Step 11.2: Disease Analysis Feature
- [ ] Create disease analysis agent
- [ ] Implement photo analysis endpoint
- [ ] Test with sample plant disease images
- [ ] Create frontend UI for disease analysis
- [ ] Integrate with treatment creation

### Step 11.3: Fertilization Recommendations
- [ ] Create fertilization recommendation agent
- [ ] Implement recommendation endpoint
- [ ] Test with various plant types
- [ ] Create frontend UI for recommendations
- [ ] Integrate with fertilization schedule creation

### Step 11.4: General Plant Care Advisor
- [ ] Create general care agent
- [ ] Implement chat/query endpoint
- [ ] Test with various questions
- [ ] Create frontend chat interface
- [ ] Add to plant detail page

---

## Milestone Summary

| Phase | Duration | Key Deliverables |
|-------|----------|------------------|
| 1 | Week 1 | Project setup, dev environment, basic frontend/backend structure |
| 2 | Week 2-3 | Location and Plant management (full CRUD) |
| 3 | Week 4-5 | Watering and Fertilization systems |
| 4 | Week 6 | Pest/Disease treatment management |
| 5 | Week 7 | Growth tracking and photo management |
| 6 | Week 8 | Dashboard and calendar views |
| 7 | Week 9 | Timeline, location visualization, UI enhancements |
| 8 | Week 10 | Notifications and reminders |
| 9 | Week 11 | Testing and polish |
| 10 | Week 12 | Deployment preparation and launch |
| 11 | Week 13-14 | PydanticAI features (optional) |

**Total Estimated Timeline**: 12-14 weeks for full MVP with optional AI features

---

## Development Best Practices

### During Implementation:
1. **Work vertically**: Complete full stack for each feature before moving to next
2. **Test as you go**: Write tests alongside feature development
3. **Commit frequently**: Small, focused commits with clear messages
4. **Document decisions**: Keep notes on architectural choices
5. **Review regularly**: Test the entire flow after each phase

### Code Quality:
- Follow Python PEP 8 and TypeScript best practices
- Use type hints consistently
- Write clear docstrings and comments
- Keep functions small and focused
- Use meaningful variable names

### Database:
- Always create migrations for schema changes
- Test migrations on sample data
- Never modify migrations after they're committed
- Keep database queries efficient (use EXPLAIN when needed)

---

## Notes

- Phases can overlap if desired (e.g., start frontend while backend is in progress)
- Timeline is estimated for one developer working part-time; adjust accordingly
- Some features can be simplified for MVP and enhanced later
- PydanticAI features can be added post-launch as enhancements
- Consider user feedback after Phase 10 before investing in AI features
