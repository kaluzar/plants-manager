# Plants Manager Frontend

React + TypeScript frontend for the Plants Manager application.

## Setup

### Prerequisites
- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The app will be available at http://localhost:5173

## Development

### Code Quality

Run linting:
```bash
npm run lint
```

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Library**: shadcn/ui (Tailwind CSS + Radix UI)
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Icons**: Lucide React

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ui/           # shadcn/ui components
│   │   ├── layout/       # Layout components
│   │   ├── plants/       # Plant-specific components
│   │   └── ...           # Feature-specific components
│   ├── pages/            # Page components
│   ├── hooks/            # Custom React hooks
│   ├── services/         # API services
│   ├── types/            # TypeScript types
│   ├── lib/              # Utilities
│   ├── styles/           # Global styles
│   ├── App.tsx           # Root component
│   └── main.tsx          # Entry point
├── public/               # Static assets
└── index.html            # HTML template
```

## Available Routes

- `/` - Dashboard
- `/plants` - Plant list (coming soon)
- `/locations` - Location management (coming soon)
- `/calendar` - Calendar view (coming soon)
- `/settings` - Settings (coming soon)
