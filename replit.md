# Backend API Server

## Overview

This is a comprehensive backend API server built with modern TypeScript technologies. The project provides a robust foundation for building scalable web applications with authentication, CRUD operations, and comprehensive middleware support. It features a well-structured architecture with clear separation of concerns, focusing on security, performance, and developer experience.

## User Preferences

Preferred communication style: Simple, everyday language.

## Current Status

✅ **Production Ready** - The backend server is fully functional and ready for use.

### Features Implemented:
- 🚀 **Bun Runtime** - Fast JavaScript runtime with built-in TypeScript support
- ⚡ **Fastify Framework** - High-performance web framework with excellent TypeScript support
- 🔐 **JWT Authentication** - Secure token-based authentication system
- 🗄️ **PostgreSQL + Drizzle ORM** - Type-safe database operations with schema management
- 📚 **Swagger Documentation** - Interactive API documentation at `/docs`
- 🛡️ **Security Middleware** - CORS, Helmet, Rate limiting, and compression
- 📝 **Comprehensive Logging** - Winston-based structured logging system
- ✅ **Validation** - Zod schemas for request/response validation
- 🏗️ **Clean Architecture** - Organized codebase with separation of concerns
- 🔧 **VSCode Integration** - Full development environment setup

### API Endpoints:
- `GET /health` - Health check endpoint
- `GET /docs` - Interactive API documentation
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)
- `GET /api/posts` - Get all posts (with pagination)
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create post (protected)
- `PUT /api/posts/:id` - Update post (protected)
- `DELETE /api/posts/:id` - Delete post (protected)

## System Architecture

### Core Framework and Runtime
- **Fastify**: High-performance web framework chosen for its speed and TypeScript support
- **Bun**: Modern JavaScript runtime used for development and build processes, providing faster startup times and built-in TypeScript support
- **TypeScript**: Strongly typed development with strict compiler settings for better code quality

### Database Architecture
- **PostgreSQL**: Primary database using the `postgres` driver for connection
- **Drizzle ORM**: Type-safe database interactions with schema-first approach
- **Schema Design**: Relational structure with users, posts, and comments tables with proper foreign key relationships
- **Migration System**: Database versioning through Drizzle Kit with dedicated migration files

### Authentication and Security
- **JWT Authentication**: Token-based authentication using Fastify's JWT plugin
- **Password Security**: Bun's built-in password hashing for secure credential storage
- **Security Middleware**: Helmet for security headers, CORS for cross-origin requests
- **Rate Limiting**: Request throttling to prevent abuse
- **Validation**: Zod schemas for runtime type validation and API contract enforcement

### API Design
- **RESTful Architecture**: Standard HTTP methods and status codes
- **OpenAPI Documentation**: Swagger integration for automatic API documentation
- **Middleware Pipeline**: Modular middleware for authentication, validation, and error handling
- **Path Aliases**: TypeScript path mapping for clean imports and better organization

### Code Organization
- **Controller Pattern**: Business logic separated into dedicated controller functions
- **Schema Validation**: Centralized Zod schemas for request/response validation
- **Route Organization**: Modular route definitions with proper middleware composition
- **Error Handling**: Centralized error processing with structured error responses
- **Logging**: Winston-based structured logging with configurable levels

### Development Experience
- **Environment Configuration**: Zod-validated environment variables with defaults
- **ESLint Configuration**: TypeScript-specific linting rules for code quality
- **VS Code Integration**: Optimized workspace settings with recommended extensions
- **Hot Reload**: Development server with automatic restart on file changes

## External Dependencies

### Database Services
- **PostgreSQL**: Primary database system (configured via `DATABASE_URL`)
- **Redis**: Optional caching layer (configurable via `REDIS_URL`)

### Development Tools
- **Drizzle Kit**: Database migration and schema management
- **ESLint**: Code linting with TypeScript-specific rules
- **Winston**: Structured logging framework

### Security and Middleware
- **@fastify/jwt**: JWT token handling
- **@fastify/helmet**: Security headers
- **@fastify/cors**: Cross-origin resource sharing
- **@fastify/rate-limit**: Request rate limiting
- **@fastify/compress**: Response compression

### Validation and Documentation
- **Zod**: Runtime schema validation
- **@fastify/swagger**: OpenAPI specification generation
- **@fastify/swagger-ui**: Interactive API documentation interface

## Getting Started

### 1. Environment Setup
The server is already configured and running. Environment variables are automatically provided by Replit.

### 2. API Documentation
Visit `http://localhost:3000/docs` to view the interactive API documentation with Swagger UI.

### 3. Database Management
- Use `bun run db:push` to update the database schema
- Use `bun run db:studio` to open Drizzle Studio for database management

### 4. Development Commands
- `bun run dev` - Start development server with hot reload
- `bun run build` - Build for production
- `bun run lint` - Run ESLint
- `bun run db:generate` - Generate database migrations
- `bun run db:migrate` - Run database migrations

## Project Structure

```
src/
├── config/          # Configuration files
│   ├── constants.ts  # Application constants
│   └── env.ts       # Environment validation
├── controllers/     # Business logic controllers
│   ├── authController.ts
│   └── postsController.ts
├── db/             # Database configuration
│   ├── connection.ts
│   └── schema.ts
├── middleware/     # Custom middleware
│   ├── auth.ts
│   └── errorHandler.ts
├── routes/         # Route definitions
│   ├── auth.ts
│   └── posts.ts
├── schemas/        # Zod validation schemas
│   ├── auth.ts
│   └── posts.ts
├── utils/          # Utility functions
│   ├── auth.ts
│   └── logger.ts
└── index.ts        # Application entry point
```

## Recent Changes

**2025-09-09**: 
- ✅ Complete backend API server implementation
- ✅ Full authentication system with JWT
- ✅ CRUD operations for posts with proper authorization
- ✅ Comprehensive middleware stack (security, validation, logging)
- ✅ Interactive API documentation with Swagger
- ✅ VSCode development environment setup
- ✅ PostgreSQL database with Drizzle ORM
- ✅ Production-ready server configuration