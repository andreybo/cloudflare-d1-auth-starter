# Cloudflare D1 Auth Starter

This is a monorepo for a starter project utilizing Cloudflare D1 as a database with a robust authentication system. The project is split into a **server** (Cloudflare Workers) and a **client** (React with Vite). It provides a complete setup for managing users, tokens, and a database with Drizzle ORM.

---

## Features

- **Cloudflare D1 Database**: Local and production database support using Drizzle ORM.
- **Authentication**: JWT-based authentication for secure API access.
- **React Frontend**: A modern and fast frontend powered by Vite and Tailwind CSS.
- **Development Workflow**: Monorepo with `pnpm` workspaces for seamless development.
- **Built-in Linting**: ESLint is preconfigured for both client and server.
- **Scalable**: Easily extendable for more features and services.

---

## Project Structure

### Monorepo Setup
The repository uses a monorepo structure with `pnpm` workspaces:

- **`client/`**: React-based frontend using Vite and Tailwind CSS.
- **`server/`**: Backend built on Cloudflare Workers with Hono and Drizzle ORM.

### Scripts
The root package includes global scripts:
- **`dev`**: Starts both client and server in development mode.
- **`build`**: Builds both client and server for production.
- **`start`**: Runs the production server.
- **`lint`**: Lints all packages using ESLint.

---

## Server Setup

The server is built with Cloudflare Workers and uses the following stack:
- **Hono**: Lightweight web framework for Cloudflare Workers.
- **Drizzle ORM**: Modern and type-safe ORM for database management.
- **JWT**: Secure authentication using JSON Web Tokens.

### Key Features
- **Database Management**: Use Drizzle ORM to generate and push migrations.
- **Cloudflare D1**: Fully compatible with D1 for local and live databases.
- **Environment Variables**: Configuration for production and local development.

### Important Scripts
- **`dev`**: Starts Wrangler for development and Drizzle Studio.
- **`generate:migration`**: Generates a new migration file.
- **`push:migration`**: Pushes migrations to the local D1 database.

### Database Initialization
Run the following to create a local database and apply schema:
```bash
wrangler d1 execute d1-auth --file=schema.sql
