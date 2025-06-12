# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Package Management:**
- Always use `bun` to install packages and run the app

**Primary Development:**
- `bun run dev` - Start development server with hot reload (React + Hono API)
- `bun run build` - Build for production
- `bun run deploy` - Build and deploy to Cloudflare Workers

**Code Quality:**
- `bun run lint` - Lint and auto-fix with Biome
- `bun run check` - Full type check and dry-run deploy

**Database:**
- `bun run db:generate` - Generate migrations from schema changes
- `bun run db:migrate` - Apply migrations locally
- `bun run db:migrate:remote` - Apply migrations to Cloudflare D1
- `bun run db:studio` - Open Drizzle Studio

**Type Generation:**
- `bun run cf-typegen` - Generate Cloudflare Worker types

## Architecture Overview

This is a full-stack SaaS starter built for **Cloudflare Workers** with these key architectural decisions:

### Monorepo Structure
- `src/client/` - React frontend with Vite, TanStack Router/Query/Form
- `src/worker/` - Hono backend API for Cloudflare Workers
- `src/shared/` - Shared Zod schemas and utilities
- Path aliases: `@client/*`, `@worker/*`, `@shared/*`

### Authentication System
- **Better Auth** with Google OAuth and email/password
- Sessions stored in Cloudflare D1 database
- Protected routes use `_authenticated/` directory pattern
- Auth middleware in `src/worker/middleware/`
- **React Components**: Use `useSessionQuery` hook for auth
- **Router/Loader**: Use `QueryClient` in TanStack Router Context for auth
- **Hono API Routes**: Use `requireAuth()` middleware for protected endpoints

### Database Architecture
- **Drizzle ORM** with **Cloudflare D1** (SQLite)
- Schema defined in `src/worker/db/schema.ts`
- Migrations in `src/worker/db/migrations/` directory
- Local development uses file-based SQLite

### API Architecture
- **Hono** framework with type-safe routing
- Routes in `src/worker/routes/`
- Middleware for authentication and session handling
- Full TypeScript integration with client
- Use **Hono RPC** with **TanStack React Query** for backend requests

### Frontend Architecture
- **TanStack Router** with file-based routing in `src/client/routes/`
- **TanStack Query** for server state management
- **TanStack Form** with Zod validation for all forms
- **Shadcn/ui** components in `src/client/components/ui/`

## Code Standards

### File Naming
- Use **kebab-case** for all files (enforced by Biome)
- React components end with `.tsx`
- API routes follow REST conventions

### Code Style (Biome)
- Tab indentation (2 spaces)
- Double quotes for strings
- Trailing commas always
- 80 character line width
- Unused imports/variables are errors

### Type Safety
- All API routes must be fully typed
- Shared Zod schemas between client/server
- Database operations through Drizzle ORM only

## Environment Setup

**Required Environment Variables (.dev.vars for local):**
```
BETTER_AUTH_SECRET="random-secret-key"
BETTER_AUTH_URL="http://localhost:5173"
GOOGLE_CLIENT_ID="google-oauth-client-id"
GOOGLE_CLIENT_SECRET="google-oauth-client-secret"
```

## Deployment Context

- Built specifically for **Cloudflare Workers** edge computing
- Single-page application with API on same domain
- Database is **Cloudflare D1** (serverless SQLite)
- Static assets served from Cloudflare Workers
- Uses `@cloudflare/vite-plugin` for seamless integration

## Authentication Notes

Email/password auth may fail with `503 cpuExceeded` error on Cloudflare free plan due to resource limits. Google OAuth is more reliable for development.

## Key Patterns

1. **Type-safe full-stack** - Shared types from database to frontend
2. **Edge-first architecture** - Optimized for global distribution
3. **File-based routing** - Both API routes and frontend routes
4. **Middleware pattern** - Hono middleware for cross-cutting concerns
5. **Schema-first validation** - Zod schemas shared between layers
