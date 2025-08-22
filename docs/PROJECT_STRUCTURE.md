# Pharmacy Invoice Validation System - Project Structure

This document outlines the complete folder and file structure for the Pharmacy Invoice Validation System.

## Root Structure

```
pharmacy_invoices/
├── frontend/                 # React frontend application
├── backend/                  # Express.js backend API
├── shared/                   # Shared types and utilities
├── docs/                     # Project documentation
├── .github/                  # GitHub Actions workflows
├── .azure/                   # Azure DevOps pipelines
├── docker-compose.yml        # Docker development environment
├── package.json              # Root workspace configuration
├── .env.example             # Environment variables template
├── .env.local               # Local environment variables
├── .gitignore               # Git ignore rules
└── README.md                 # Project overview
```

## Frontend Structure

```
frontend/
├── public/                   # Static assets
│   ├── favicon.ico
│   └── index.html
├── src/
│   ├── components/           # React components following Atomic Design
│   │   ├── atoms/            # Basic building blocks
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Input/
│   │   │   │   ├── Input.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Card/
│   │   │   │   ├── Card.tsx
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   ├── molecules/        # Simple component combinations
│   │   │   ├── Navigation/
│   │   │   │   ├── Navigation.tsx
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   ├── organisms/        # Complex UI sections
│   │   │   ├── Header/
│   │   │   │   ├── Header.tsx
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   ├── templates/        # Page layouts
│   │   │   ├── Layout/
│   │   │   │   ├── Layout.tsx
│   │   │   │   └── index.ts
│   │   │   └── index.ts
│   │   └── pages/            # Complete pages
│   │       ├── HomePage/
│   │       │   ├── HomePage.tsx
│   │       │   └── index.ts
│   │       ├── ValidationPage/
│   │       │   ├── ValidationPage.tsx
│   │       │   └── index.ts
│   │       ├── HistoryPage/
│   │       │   ├── HistoryPage.tsx
│   │       │   └── index.ts
│   │       └── index.ts
│   ├── types/                # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/                # Utility functions
│   │   └── cn.ts
│   ├── App.tsx               # Main application component
│   ├── main.tsx              # Application entry point
│   └── index.css             # Global styles and Tailwind CSS
├── package.json              # Frontend dependencies
├── tsconfig.json             # TypeScript configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── postcss.config.js         # PostCSS configuration
└── vite.config.ts            # Vite build configuration
```

## Backend Structure

```
backend/
├── src/
│   ├── controllers/          # Request handlers
│   │   ├── validationController.ts
│   │   └── historyController.ts
│   ├── services/             # Business logic
│   │   ├── validationService.ts
│   │   ├── excelService.ts
│   │   └── databaseService.ts
│   ├── routes/               # API route definitions
│   │   ├── index.ts
│   │   ├── validation.ts
│   │   └── history.ts
│   ├── middleware/           # Express middleware
│   │   ├── errorHandler.ts
│   │   ├── validation.ts
│   │   └── rateLimiter.ts
│   ├── types/                # TypeScript type definitions
│   │   └── validation.ts
│   ├── utils/                # Utility functions
│   │   └── logger.ts
│   ├── config/               # Configuration files
│   │   └── index.ts
│   └── server.ts             # Application entry point
├── prisma/                   # Database schema and migrations
│   ├── schema.prisma         # Database schema definition
│   ├── migrations/           # Database migration files
│   └── seed.ts               # Database seeding script
├── package.json              # Backend dependencies
├── tsconfig.json             # TypeScript configuration
└── .env.example              # Environment variables template
```

## Shared Structure

```
shared/
├── types/                    # Shared TypeScript types
│   └── index.ts
├── constants/                # Shared constants
│   └── index.ts
└── utils/                    # Shared utility functions
    └── index.ts
```

## Documentation Structure

```
docs/
├── IMPLEMENTATION_PLAN.md     # 10-phase development plan
├── PROJECT_STRUCTURE.md       # This file
├── ATOMIC_DESIGN.md          # Frontend component architecture
├── API.md                    # API endpoint documentation
├── SETUP.md                  # Development environment setup
├── CONTRIBUTING.md           # Contribution guidelines
└── DEPLOYMENT.md             # Production deployment guide
```

## Key Files and Their Purpose

### **Root Configuration**
- **`package.json`**: Workspace configuration with scripts for both frontend and backend
- **`docker-compose.yml`**: PostgreSQL database setup for development
- **`.env.example`**: Template for environment variables
- **`.gitignore`**: Git ignore rules for the entire project

### **Frontend Configuration**
- **`vite.config.ts`**: Vite build tool configuration
- **`tailwind.config.js`**: Tailwind CSS configuration with custom design tokens
- **`tsconfig.json`**: TypeScript configuration with path aliases
- **`postcss.config.js`**: PostCSS configuration for Tailwind CSS

### **Backend Configuration**
- **`prisma/schema.prisma`**: Database schema definition using Prisma ORM
- **`tsconfig.json`**: TypeScript configuration for Node.js backend
- **`src/config/index.ts`**: Environment configuration and constants

### **Component Architecture**
- **`src/components/atoms/`**: Basic UI components (Button, Input, Card)
- **`src/components/molecules/`**: Simple component combinations (Navigation, FormField)
- **`src/components/organisms/`**: Complex UI sections (Header, Sidebar)
- **`src/components/templates/`**: Page layout structures (Layout, DashboardLayout)
- **`src/components/pages/`**: Complete page implementations (HomePage, ValidationPage)

## Development Workflow

### **1. Component Development**
- Start with atoms (basic components)
- Build molecules (simple combinations)
- Create organisms (complex sections)
- Design templates (page layouts)
- Implement pages (complete functionality)

### **2. File Organization**
- Each component has its own folder
- Include component file, tests, and index file
- Use consistent naming conventions
- Export components through index files

### **3. Type Safety**
- Define TypeScript interfaces for all components
- Use shared types for common data structures
- Maintain type consistency across atomic levels

## Build and Deployment

### **Development**
```bash
# Start both frontend and backend
npm run dev

# Start only frontend
npm run dev:frontend

# Start only backend
npm run dev:backend
```

### **Production Build**
```bash
# Build frontend
npm run build:frontend

# Build backend
npm run build:backend

# Build both
npm run build
```

### **Database Management**
```bash
# Run migrations
npm run db:migrate

# Seed database
npm run db:seed

# Reset database
npm run db:reset
```

## Technology Stack

### **Frontend**
- **React 18**: Modern React with hooks and concurrent features
- **TypeScript**: Type-safe JavaScript development
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/ui**: High-quality component library

### **Backend**
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **TypeScript**: Type-safe Node.js development
- **Prisma**: Modern database ORM
- **PostgreSQL**: Primary database (development)

### **Development Tools**
- **ESLint**: Code linting and quality
- **Prettier**: Code formatting
- **Docker**: Containerized development environment
- **Git**: Version control system

## Best Practices

### **File Naming**
- Use PascalCase for component files
- Use camelCase for utility files
- Use kebab-case for configuration files
- Include file extensions in imports

### **Component Structure**
- Keep components focused and single-purpose
- Use consistent prop interfaces
- Implement proper error handling
- Write comprehensive tests

### **Code Organization**
- Group related functionality together
- Use clear and descriptive names
- Maintain consistent patterns
- Document complex logic

This structure ensures a **scalable, maintainable, and organized** codebase that follows modern development best practices!
