# Backend API Server

A backend API server built with [Fastify](https://www.fastify.io/), [Bun](https://bun.sh/), PostgreSQL, and comprehensive middleware including JWT authentication, CORS, rate limiting, and more.

## Features

- Fastify framework for high performance
- JWT-based authentication
- CORS, Helmet, and rate limiting for security
- Zod-powered schema validation
- Swagger/OpenAPI documentation
- PostgreSQL with Drizzle ORM
- Bun runtime for fast development and execution

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/)
- [PostgreSQL](https://www.postgresql.org/)
- [Podman](https://podman.io/) or Docker (for local DB via `podman-compose`)

### Installation

```sh
bun install
```

### Environment

Copy and edit your environment variables as needed:

```sh
cp .env.example .env
```

### Database

Start the database (if using Podman):

```sh
bun run db:up
```

Run migrations:

```sh
bun run db:migrate
```

### Development

Start the server with hot reload and inspector enabled:

```sh
bun run dev
```

### Production Build

```sh
bun run build
bun run start
```

### Linting & Type Checking

```sh
bun run lint
bun run type-check
```

## API Documentation

Swagger UI is available at `/docs` when the server is running.

## Debugging

To debug with VS Code:
1. Start the server with inspector:  
   `bun run dev`
2. Use the "Attach to Bun" configuration in `.vscode/launch.json`.

## Scripts

See `package.json` for all available scripts.

## License

MIT

---

> If you see a bug, don't worry—it's just a feature in disguise. 🐞
