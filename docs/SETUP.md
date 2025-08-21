# Development Setup Guide

## Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js** 18+ LTS
- **npm** (comes with Node.js)
- **Docker** and Docker Compose
- **Git**

## Initial Setup

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd pharmacy-invoices
```

### 2. Install Dependencies
```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install

# Return to root
cd ..
```

### 3. Environment Configuration
```bash
# Copy environment template
cp .env.example .env.local

# Edit environment variables
nano .env.local
```

#### Required Environment Variables
```env
# Database
DATABASE_URL="postgresql://admin:password@localhost:5432/pharmacy_invoices"

# API Configuration
PORT=3001
NODE_ENV=development

# MockAPI
MOCKAPI_URL="https://685daed17b57aebd2af6da54.mockapi.io/api/v1/drugs"

# File Upload
MAX_FILE_SIZE=104857600  # 100MB in bytes
```

### 4. Database Setup
```bash
# Start PostgreSQL with Docker
docker-compose up -d

# Wait for database to be ready (about 10 seconds)
sleep 10

# Run database migrations
npm run setup:db

# Seed database with initial data
cd backend
npx prisma db seed
cd ..
```

### 5. Verify Setup
```bash
# Check if database is running
docker ps

# Test database connection
cd backend
npx prisma studio
# This should open Prisma Studio in your browser
cd ..
```

## Development Workflow

### Starting Development Servers
```bash
# Start both frontend and backend
npm run dev

# Or start them separately:
npm run dev:frontend    # Frontend on http://localhost:3000
npm run dev:backend     # Backend on http://localhost:3001
```

### Available Scripts
```bash
# Development
npm run dev              # Start both servers
npm run dev:frontend     # Start frontend only
npm run dev:backend      # Start backend only

# Building
npm run build            # Build both applications
npm run build:frontend   # Build frontend only
npm run build:backend    # Build backend only

# Testing
npm run test             # Run all tests
npm run test:frontend    # Test frontend only
npm run test:backend     # Test backend only

# Database
npm run setup:db         # Setup database
npm run db:reset         # Reset database
npm run db:seed          # Seed database

# Code Quality
npm run lint             # Lint all code
npm run format           # Format all code
```

## Project Structure

### Key Directories
- **`frontend/`**: React application with Vite
- **`backend/`**: Express API server
- **`shared/`**: Common types and utilities
- **`docs/`**: Project documentation
- **`docker/`**: Containerization files

### Important Files
- **`docker-compose.yml`**: Development database setup
- **`.env.local`**: Local environment variables
- **`package.json`**: Root workspace configuration

## Database Management

### Prisma Commands
```bash
cd backend

# Generate Prisma client
npx prisma generate

# Create new migration
npx prisma migrate dev --name <migration-name>

# Reset database
npx prisma migrate reset

# View database in browser
npx prisma studio

# Seed database
npx prisma db seed
```

### Database Schema
The database includes these main tables:
- **`validations`**: Validation sessions
- **`validation_results`**: Individual discrepancy results
- **`reference_drugs_cache`**: Cached reference drug data
- **`settings`**: Application settings

## Troubleshooting

### Common Issues

#### Database Connection Failed
```bash
# Check if Docker is running
docker ps

# Restart database
docker-compose down
docker-compose up -d

# Check database logs
docker-compose logs postgres
```

#### Port Already in Use
```bash
# Check what's using the port
lsof -i :3000
lsof -i :3001

# Kill the process or change ports in .env.local
```

#### Dependencies Issues
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### Prisma Issues
```bash
# Reset Prisma
cd backend
npx prisma generate
npx prisma migrate reset
npx prisma db seed
```

### Getting Help
- Check the logs in your terminal
- Verify environment variables are set correctly
- Ensure Docker is running
- Check if ports are available

## Next Steps

After successful setup:
1. **Verify frontend** loads at http://localhost:3000
2. **Verify backend** responds at http://localhost:3001
3. **Check database** connection in Prisma Studio
4. **Start development** on Phase 1 of the implementation plan

## Development Tips

- **Use VS Code** with TypeScript and ESLint extensions
- **Check console logs** in browser and terminal
- **Use Prisma Studio** to inspect database data
- **Follow the implementation plan** strictly to avoid over-engineering
- **Commit after each phase** with descriptive messages
