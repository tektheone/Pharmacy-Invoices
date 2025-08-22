# Pharmacy Invoice Validation System

A comprehensive full-stack application for validating pharmacy invoices against reference drug data with automated discrepancy detection.

## Features

- **File Upload**: Support for Excel files (.xlsx, .xls) up to 100MB
- **Automated Validation**: Comprehensive validation against reference drug data
- **Discrepancy Detection**: Identifies price, formulation, strength, and payer mismatches
- **Fuzzy Matching**: Advanced drug name matching with Levenshtein distance
- **Validation History**: 3-month storage with search and pagination
- **Export Functionality**: Multiple export formats (PDF, Excel, CSV)
- **Responsive Design**: Modern UI built with Tailwind CSS and Shadcn/ui
- **Real-time Processing**: Immediate validation feedback
- **Performance Optimized**: Streaming Excel processing and caching

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + Shadcn/ui
- **Backend**: Node.js + Express + TypeScript + Prisma ORM
- **Database**: PostgreSQL (dev) / Azure SQL (prod)
- **Validation**: Zod schemas
- **Excel Processing**: xlsx library
- **Testing**: Jest + React Testing Library
- **CI/CD**: GitHub Actions + Azure DevOps

## Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pharmacy_invoices
   ```

2. **Install dependencies**
   ```bash
   npm install
   cd backend && npm install
   cd ../frontend && npm install
   ```

3. **Set up environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your database credentials
   ```

4. **Start the database**
   ```bash
   docker-compose up -d
   ```

5. **Run database migrations**
   ```bash
   cd backend
   npm run db:migrate
   npm run db:seed
   ```

6. **Start development servers**
   ```bash
   # Terminal 1 - Backend
   npm run dev:backend
   
   # Terminal 2 - Frontend
   npm run dev:frontend
   ```

7. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

## Development

- **Phase-based Development**: Follows strict 10-phase implementation plan
- **Atomic Design**: Frontend components follow Atomic Design principles
- **Type Safety**: Full TypeScript coverage
- **Code Quality**: ESLint + Prettier configuration
- **Testing**: Comprehensive test coverage with Jest

## Contributing

Please read [CONTRIBUTING.md](docs/CONTRIBUTING.md) for details on our development workflow and contribution guidelines.

## License

This project is licensed under the MIT License.
