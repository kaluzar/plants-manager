# Product Requirements Document: Garden Plants Manager

## 1. Product Overview

A web application for managing ornamental plants in a private garden, enabling efficient tracking of plant care activities, health monitoring, and location organization.

## 2. Problem Statement

Managing ~100 ornamental plants (flowers and trees) across indoor and outdoor locations requires systematic tracking of watering schedules, fertilization, pest/disease treatments, and growth progress. Without a centralized system, it's difficult to maintain optimal care routines and monitor plant health over time.

## 3. Goals

- Provide a centralized system for tracking all plant care activities
- Prevent missed watering and fertilization schedules through reminders
- Enable early detection and treatment of pest/disease issues
- Track plant growth and health over time
- Organize plants by location for efficient garden management

## 4. Target User

**Primary User**: Individual homeowner managing a private garden
- Manages ~100 plants (mix of outdoor and indoor)
- Plant types: ornamental flowers (roses, wisterias) and trees (magnolias), grass, etc.
- Single user (no collaboration needed)
- Needs systematic approach to plant care

## 5. Core Features

### 5.1 Plant Registry
- Add/edit/delete plant records
- Plant attributes:
  - Name (common and scientific)
  - Type: Indoor/Outdoor
  - Category: Flower, Tree, Grass, Other
  - Species (e.g., rose, wisteria, magnolia)
  - Location (reference to location map)
  - Acquisition date
  - Photo gallery
  - Notes

### 5.2 Watering Management
- Define watering schedules per plant
  - Frequency (daily, every X days, weekly, etc.)
  - Amount (optional)
  - Season-specific schedules (summer vs winter)
- Log watering events (date, time, amount)
- View upcoming watering schedule
- Dashboard view of plants needing water

### 5.3 Growth Tracking
- Timeline view of plant history
- Log growth milestones:
  - Height/size measurements
  - Progress photos with dates
  - Flowering/blooming dates
  - Significant events (pruning, repotting, etc.)
- Compare photos over time
- Notes on growth observations

### 5.4 Pest & Disease Management
- Record pest/disease occurrences:
  - Type of pest/disease
  - Severity level
  - Discovery date
  - Photos for reference
- Treatment tracking:
  - Treatment type/product used
  - Application schedule (date and frequency)
  - Treatment dates log
  - Effectiveness notes
- Preventive treatment schedules
- Dashboard view of active treatments

### 5.5 Fertilization Tracking
- Define fertilization schedules per plant:
  - Frequency (monthly, seasonal, etc.)
  - Fertilizer type
  - Amount
- Log fertilization events
- View upcoming fertilization schedule
- Dashboard view of plants needing fertilization

### 5.6 Location Mapping
- Create location zones/areas:
  - Indoor: rooms or areas
  - Outdoor: garden beds, zones, sections
- Assign plants to locations
- Visual map or grid view showing plant distribution
- Filter/view plants by location

## 6. User Interface Requirements

### 6.1 Dashboard
- Overview of care tasks due today/this week
- Quick stats (total plants, by type, by location)
- Recent activities
- Alerts for overdue tasks

### 6.2 Plant List View
- Searchable and filterable list
- Filters: location, type (indoor/outdoor), category, species
- Sort options: name, last watered, next care date
- Quick actions from list

### 6.3 Plant Detail View
- All plant information
- Tabbed sections: Overview, Care Schedule, Growth History, Treatments, Photos
- Action buttons for common tasks (log watering, add photo, etc.)

### 6.4 Calendar View
- All scheduled care activities
- Daily/weekly/monthly views
- Click to complete or reschedule

### 6.5 Location View
- Map or grid of garden locations
- Plants shown in their locations
- Quick status indicators

## 7. Non-Functional Requirements

### 7.1 Performance
- Page load time < 2 seconds
- Support for up to 500 plants (5x current need)
- Image upload and display optimization

### 7.2 Usability
- Mobile-responsive design for in-garden use
- Intuitive navigation
- Minimal clicks to log common activities

### 7.3 Data Management
- Data persistence and backup
- Export functionality (CSV/JSON)
- Photo storage and management

### 7.4 Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers

## 8. Success Metrics

- All plants catalogued with complete information
- 90%+ adherence to watering schedules
- Reduction in plant health issues through proactive care
- Time saved on garden management planning

## 9. Out of Scope (Initial Version)

- Multi-user support and sharing
- Mobile native apps (web-responsive only)
- Weather integration
- E-commerce/shopping features
- Community features or social sharing
- Advanced analytics and AI recommendations
- Integration with smart watering systems
- Seed/propagation tracking

## 10. Future Considerations

- Weather-based watering adjustments
- Mobile app (iOS/Android)
- Plant care recommendations based on species
- Integration with garden sensors
- Expense tracking for supplies
- Harvest tracking (if vegetables added later)

## 11. Technical Considerations

- Web-based application accessible from desktop and mobile browsers
- Photo storage solution for growth tracking
- Notification system for schedules and reminders
- Date/time handling for scheduling
- Search and filtering capabilities

## 12. Open Questions

- Notification delivery method (email, browser notifications, or in-app only)?
- Photo storage limits per plant?
- Historical data retention period?
- Backup and export frequency preferences?
