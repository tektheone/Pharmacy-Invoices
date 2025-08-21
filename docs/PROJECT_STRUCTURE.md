# Project Structure

## Overview
This document outlines the complete folder and file structure for the Pharmacy Invoice Validation System.

## Root Directory Structure
```
pharmacy-invoices/
├── .github/                          # GitHub Actions workflows
├── .azure/                           # Azure DevOps pipelines
├── frontend/                         # React application
├── backend/                          # Express API server
├── shared/                           # Shared types & utilities
├── docs/                             # Documentation
├── docker/                           # Containerization
├── .env.example                      # Environment variables template
├── .gitignore                        # Git ignore rules
├── package.json                      # Root package.json (workspace)
├── README.md                         # Project main README
└── docker-compose.yml                # Root docker-compose for development
```

## Detailed Structure

### .github/ (GitHub Actions)
```
.github/
└── workflows/
    ├── ci.yml                        # Continuous Integration pipeline
    └── security.yml                  # Security scanning pipeline
```

### .azure/ (Azure DevOps)
```
.azure/
├── build.yml                         # Build pipeline
└── deploy.yml                        # Deployment pipeline
```

### frontend/ (React Application)
```
frontend/
├── public/                           # Static assets (.gitkeep until assets exist)
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── components/                   # Atomic Design component library (scaffolded with .gitkeep)
│   │   ├── atoms/                    # Basic building blocks
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Label.tsx
│   │   │   ├── Icon.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Spinner.tsx
│   │   │   └── index.ts
│   │   ├── molecules/                # Simple component combinations
│   │   │   ├── SearchInput.tsx
│   │   │   ├── FormField.tsx
│   │   │   ├── StatusBadge.tsx
│   │   │   ├── LoadingState.tsx
│   │   │   ├── ErrorMessage.tsx
│   │   │   └── index.ts
│   │   ├── organisms/                # Complex component combinations
│   │   │   ├── FileUpload.tsx
│   │   │   ├── ValidationForm.tsx
│   │   │   ├── DiscrepancyCard.tsx
│   │   │   ├── ValidationTable.tsx
│   │   │   ├── HistoryView.tsx
│   │   │   ├── SettingsPanel.tsx
│   │   │   └── index.ts
│   │   ├── templates/                # Page layouts
│   │   │   ├── DashboardLayout.tsx
│   │   │   ├── ValidationLayout.tsx
│   │   │   ├── HistoryLayout.tsx
│   │   │   ├── SettingsLayout.tsx
│   │   │   └── index.ts
│   │   └── pages/                    # Complete pages
│   │       ├── Dashboard.tsx
│   │       ├── Validation.tsx
│   │       ├── History.tsx
│   │       ├── Settings.tsx
│   │       └── Analytics.tsx
│   ├── pages/                        # Page components (scaffolded)
│   │   ├── Dashboard.tsx
│   │   ├── Validation.tsx
│   │   ├── History.tsx
│   │   ├── Settings.tsx
│   │   └── Analytics.tsx
│   ├── hooks/                        # Custom React hooks
│   │   ├── useTheme.ts
│   │   ├── useValidation.ts
│   │   ├── useFileUpload.ts
│   │   └── useLocalStorage.ts
│   ├── contexts/                     # React contexts
│   │   ├── ThemeContext.tsx
│   │   ├── ValidationContext.tsx
│   │   └── SettingsContext.tsx
│   ├── services/                     # API service functions
│   │   ├── api.ts                    # Base API configuration
│   │   ├── validationService.ts
│   │   ├── historyService.ts
│   │   └── exportService.ts
│   ├── types/                        # TypeScript interfaces
│   │   ├── validation.ts
│   │   ├── drug.ts
│   │   ├── theme.ts
│   │   └── api.ts
│   ├── utils/                        # Utility functions
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   ├── constants.ts
│   │   └── helpers.ts
│   ├── styles/                       # CSS and styling
│   │   ├── globals.css               # Tailwind CSS imports
│   │   ├── theme.css                 # Theme-specific CSS variables
│   │   └── components.css            # Component-specific styles
│   ├── App.tsx                       # Main app component
│   ├── main.tsx                      # App entry point
│   └── vite-env.d.ts                 # Vite type definitions
├── package.json                      # Frontend dependencies (to be added in Phase 5)
├── tsconfig.json                     # TypeScript configuration
├── vite.config.ts                    # Vite configuration
├── tailwind.config.js                # Tailwind CSS configuration
├── postcss.config.js                 # PostCSS configuration
└── .eslintrc.js                      # ESLint configuration (added later)
```

### backend/ (Express API Server)
```
backend/
├── src/
│   ├── controllers/                  # Route handlers (scaffolded)
│   │   ├── validationController.ts
│   │   ├── historyController.ts
│   │   ├── settingsController.ts
│   │   └── exportController.ts
│   ├── services/                     # Business logic (scaffolded)
│   │   ├── validationService.ts
│   │   ├── excelService.ts
│   │   ├── drugMatchingService.ts
│   │   ├── discrepancyService.ts
│   │   ├── cacheService.ts
│   │   └── exportService.ts
│   ├── middleware/                   # Express middleware (scaffolded)
│   │   ├── errorHandler.ts
│   │   ├── validation.ts
│   │   ├── cors.ts
│   │   ├── rateLimiter.ts
│   │   └── logger.ts
│   ├── models/                       # Prisma models (scaffolded)
│   │   ├── index.ts                  # Prisma client export
│   │   └── prisma.ts                 # Prisma configuration
│   ├── routes/                       # API routes (scaffolded)
│   │   ├── index.ts                  # Main router
│   │   ├── validation.ts
│   │   ├── history.ts
│   │   ├── settings.ts
│   │   └── export.ts
│   ├── types/                        # TypeScript interfaces (scaffolded)
│   │   ├── validation.ts
│   │   ├── drug.ts
│   │   ├── excel.ts
│   │   └── api.ts
│   ├── utils/                        # Utility functions (scaffolded)
│   │   ├── constants.ts
│   │   ├── helpers.ts
│   │   ├── formatters.ts
│   │   └── validators.ts
│   ├── config/                       # Configuration files (scaffolded)
│   │   ├── database.ts
│   │   ├── server.ts
│   │   └── environment.ts
│   ├── app.ts                        # Express app setup
│   ├── server.ts                     # Server entry point
│   └── index.ts                      # Main entry point
├── prisma/                           # Prisma configuration (scaffolded)
│   ├── schema.prisma                 # Database schema
│   ├── migrations/                   # Database migrations
│   └── seed.ts                       # Seed data script
├── package.json                      # Backend dependencies (to be added in Phase 3)
├── tsconfig.json                     # TypeScript configuration
├── .eslintrc.js                      # ESLint configuration
└── nodemon.json                      # Development server configuration
```

### shared/ (Shared Types & Utilities)
```
shared/
├── types/                            # Common TypeScript interfaces (scaffolded)
│   ├── drug.ts
│   ├── validation.ts
│   ├── theme.ts
│   └── common.ts
├── constants/                        # Shared constants (scaffolded)
│   ├── validation.ts
│   ├── theme.ts
│   └── api.ts
└── utils/                            # Shared utility functions (scaffolded)
    ├── formatters.ts
    ├── validators.ts
    └── helpers.ts
```

### docs/ (Documentation)
```
docs/
├── IMPLEMENTATION_PLAN.md             # Detailed implementation phases
├── PROJECT_STRUCTURE.md               # This file
├── API.md                             # API documentation
├── SETUP.md                           # Development setup guide
├── DEPLOYMENT.md                      # Deployment guide
└── CONTRIBUTING.md                    # Contribution guidelines
```

### docker/ (Containerization)
```
docker/
├── Dockerfile.frontend                # Frontend Docker image
├── Dockerfile.backend                 # Backend Docker image
├── docker-compose.yml                 # Development environment
└── docker-compose.prod.yml            # Production environment
```

## Key Design Principles

### 1. Atomic Design Architecture
- **Atoms**: Basic building blocks (Button, Input, Label, Icon, Badge, Spinner)
- **Molecules**: Simple combinations (SearchInput, FormField, StatusBadge, LoadingState, ErrorMessage)
- **Organisms**: Complex combinations (FileUpload, ValidationForm, DiscrepancyCard, ValidationTable, HistoryView, SettingsPanel)
- **Templates**: Page layouts (DashboardLayout, ValidationLayout, HistoryLayout, SettingsLayout)
- **Pages**: Complete pages (Dashboard, Validation, History, Settings, Analytics)

### 2. Separation of Concerns
- **Frontend**: React components and UI logic
- **Backend**: API endpoints and business logic
- **Shared**: Common types and utilities
- **Docs**: Project documentation

### 2. Modular Architecture
- **Components**: Reusable UI components
- **Services**: Business logic services
- **Controllers**: Route handlers
- **Middleware**: Express middleware functions

### 3. Type Safety
- **TypeScript**: Throughout the entire project
- **Shared Types**: Common interfaces in shared folder
- **Zod Schemas**: Runtime validation schemas

### 4. Configuration Management
- **Environment Variables**: .env files for configuration
- **TypeScript Config**: Separate configs for frontend/backend
- **Build Tools**: Vite for frontend, nodemon for backend

## File Naming Conventions

### Components
- **PascalCase**: React components (e.g., `FileUpload.tsx`)
- **index.ts**: Barrel exports for component folders

### Utilities
- **camelCase**: Functions and variables (e.g., `formatters.ts`)
- **kebab-case**: CSS files (e.g., `globals.css`)

### Configuration
- **kebab-case**: Config files (e.g., `tailwind.config.js`)
- **dot-prefix**: Hidden files (e.g., `.env.example`)

## Dependencies Organization

### Root Level
- **Workspace configuration**: npm workspaces
- **Common scripts**: Development and build commands
- **Docker setup**: Development environment

### Frontend
- **React ecosystem**: React, TypeScript, Vite
- **UI framework**: Tailwind CSS, Shadcn/ui
- **HTTP client**: Axios for API calls

### Backend
- **Server framework**: Express.js, TypeScript
- **Database**: Prisma ORM
- **Validation**: Zod schemas
- **File processing**: xlsx library

### Shared
- **Type definitions**: Common interfaces
- **Constants**: Shared configuration values
- **Utilities**: Common helper functions
