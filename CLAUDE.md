# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a NestJS TypeScript application called "hello-vector" - a standard NestJS starter project with a basic controller/service architecture.

## Development Commands

### Package Management
- `pnpm install` - Install dependencies
- Uses pnpm as the package manager

### Build and Run
- `pnpm run build` - Build the application using nest build
- `pnpm run start` - Start the application
- `pnpm run start:dev` - Start in development mode with watch
- `pnpm run start:debug` - Start in debug mode with watch
- `pnpm run start:prod` - Start production build

### Code Quality
- `pnpm run lint` - Run ESLint with auto-fix
- `pnpm run format` - Format code with Prettier

### Testing
- `pnpm run test` - Run unit tests with Jest
- `pnpm run test:watch` - Run tests in watch mode
- `pnpm run test:cov` - Run tests with coverage
- `pnpm run test:debug` - Run tests in debug mode
- `pnpm run test:e2e` - Run end-to-end tests

## Architecture

### Core Structure
- `src/main.ts` - Application entry point, bootstraps NestJS app on port 3000 (or PORT env var)
- `src/app.module.ts` - Root module that imports controllers and providers
- `src/app.controller.ts` - Main controller with basic GET route
- `src/app.service.ts` - Application service with business logic

### NestJS Patterns
- Uses standard NestJS decorators (@Controller, @Injectable, @Get, @Module)
- Follows dependency injection pattern with constructor injection
- Module-based architecture for organizing features

### Configuration
- ESLint configured with TypeScript and Prettier integration
- Custom rules: disables `@typescript-eslint/no-explicit-any`, warns on floating promises and unsafe arguments
- Jest configured for testing with ts-jest transformer
- Uses SWC for fast compilation

## Development Notes

- Application runs on port 3000 by default
- Tests are located in `test/` for e2e and alongside source files for unit tests
- Source root is `src/` as configured in nest-cli.json
- TypeScript configuration includes path mapping support

## Vector Recommendation Engine

This application implements a vector-based recommendation system using:

- **PostgreSQL + PGVector**: Vector storage and similarity search
- **OpenAI Embeddings**: Text-to-vector conversion using `text-embedding-3-small`
- **TypeORM**: Database ORM with custom vector column support
- **NestJS Modules**: Products, Orders, Recommendations, and Seed modules

### Key Components

- `src/entities/`: Database entities (Product, Order, User)
- `src/modules/products/`: Product management with auto-vectorization
- `src/modules/orders/`: Order tracking and user history
- `src/modules/recommendations/`: Recommendation algorithms (user-based, preference-based, hybrid)
- `src/modules/seed/`: Test data generation (1000 products, 100,000 orders)
- `src/services/openai.service.ts`: OpenAI API integration for embeddings

### Database Setup

- Use `docker-compose up -d` to start PostgreSQL with PGVector extension
- Requires `.env` file with `OPENAI_API_KEY` and database configuration
- Entity synchronization is enabled for development

### API Endpoints

- Products: CRUD operations with automatic vectorization
- Orders: User order tracking and history
- Recommendations: Vector similarity-based recommendations
- Seed: Bulk test data generation

### Recommendation Types

1. **User-based**: Analyzes order history to find similar products
2. **Preference-based**: Converts text preferences to vectors for matching
3. **Hybrid**: Combines both approaches with weighted scoring