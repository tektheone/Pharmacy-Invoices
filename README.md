# Pharmacy Invoice Validation System

A full-stack application for Pharmacy Data Solutions (PDS) that processes pharmacy invoices, validates them against reference data, and flags discrepancies.

## 🚀 Features

- **Excel File Upload**: Drag & drop Excel invoice files (up to 100MB)
- **Real-time Validation**: Instant discrepancy detection as you type
- **Discrepancy Types**: Unit Price, Formulation, Strength, and Payer validation
- **Validation History**: 3-month retention with search and filtering
- **Export Options**: PDF, Excel, and CSV export
- **Theme Support**: Light/Dark/System themes with smooth transitions
- **Responsive Design**: Modern, mobile-friendly interface

## 🛠️ Tech Stack

### Frontend
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS + Shadcn/ui
- Axios for API calls

### Backend
- Express.js + TypeScript
- Prisma ORM
- PostgreSQL (dev) → Azure SQL (prod)
- Zod for validation

### Infrastructure
- Docker for development
- GitHub Actions (CI)
- Azure DevOps (CD)
- Azure cloud services

## 📁 Project Structure

```
pharmacy-invoices/
├── frontend/          # React application
├── backend/           # Express API server
├── shared/            # Shared types & utilities
├── docs/              # Documentation
└── docker/            # Containerization
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+
- Docker
- npm

### Development Setup
```bash
# Clone repository
git clone <your-repo-url>
cd pharmacy-invoices

# Install dependencies
npm install

# Start development environment
npm run dev
```

### Database Setup
```bash
# Start PostgreSQL with Docker
docker-compose up -d

# Run database migrations
npm run setup:db
```

## 📋 Implementation Phases

See [IMPLEMENTATION_PLAN.md](./docs/IMPLEMENTATION_PLAN.md) for detailed phase breakdown.

## 🔧 Available Scripts

```bash
npm run dev              # Start both frontend and backend
npm run build            # Build both applications
npm run test             # Run all tests
npm run setup:dev        # Setup development environment
npm run setup:db         # Setup database
```

## 📚 Documentation

- [Implementation Plan](./docs/IMPLEMENTATION_PLAN.md)
- [Project Structure](./docs/PROJECT_STRUCTURE.md)
- [API Documentation](./docs/API.md)
- [Development Setup](./docs/SETUP.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)

## 🤝 Contributing

See [CONTRIBUTING.md](./docs/CONTRIBUTING.md) for contribution guidelines.

## 📄 License

This project is proprietary to Pharmacy Data Solutions.

## 📞 Support

For questions or support, contact the development team.
