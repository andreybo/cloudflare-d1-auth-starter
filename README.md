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

## Setup Instructions

### 1. Install Dependencies

Ensure you have `pnpm` installed. If not, you can install it globally:

```bash
npm install -g pnpm
```

Once installed, run the following command in the project root to install all dependencies for both client and server:

```bash
pnpm install
```

### 2. Create Environment Files

Both the server and client require `.env` files for configuration. Create the following `.env` files:

#### Server `.env`
```env
JWT_SECRET=your_secret_key
D1_DATABASE=d1_database_name
REFRESH_SECRET=your_refresh_secret_key
CLOUDFLARE_D1_TOKEN=your_d1_token
CLOUDFLARE_DATABASE_ID=your_database_id
CLOUDFLARE_ACCOUNT_ID=your_account_id
NODE_ENV=development
DATABASE_URL=.wrangler/state/v3/d1/miniflare-D1DatabaseObject/YOUR_DB.sqlite
```

#### Client `.env`
```env
VITE_APP_NAME="App"
VITE_APP_API_BASE_URL=http://localhost:8787
```

You can also create `.env.development` and `.env.production` files for environment-specific configurations.

### 3. Update Wrangler Configuration

In `wrangler.toml`, update the following variables:

```toml
name = "auth-server"
main = "src/index.js"
compatibility_date = "2024-11-06"
compatibility_flags = ["nodejs_compat"]
account_id = "YOUR-ACCOUNT-ID"

[[d1_databases]]
binding = "AUTH_DB"
database_name = "d1-auth"
database_id = "YOUR-DATABASE-ID"
migrations_dir = "drizzle/migrations"

[vars]
JWT_SECRET = "my_super_secret_key_123!"
REFRESH_SECRET = "YOUR-REFRESH-SECRET-KEY-HERE"
```

Make sure the values align with your `.env` file.

### 4. Add GitHub Repository Secrets

To automate builds on Cloudflare, add the following secrets to your GitHub repository:

- **`CF_API_TOKEN`**: Your Cloudflare API Token.
- **`CF_ACCOUNT_ID`**: Your Cloudflare Account ID.
- **`CF_PROJECT_ID`**: Your Cloudflare Pages project ID (if using Pages).
- **`VITE_APP_NAME`**: Your apps name.
- **`secrets.VITE_APP_API_BASE_URL`**: API url.

#### Steps to Add Secrets
1. Navigate to your GitHub repository.
2. Go to **Settings** > **Secrets and variables** > **Actions**.
3. Add the secrets with the appropriate names and values.

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
```

To create the database schema in the remote D1 environment, run:

```bash
wrangler d1 execute d1-auth --file=schema.sql --remote
```

---

## Development Workflow

### Start Development

Run the following command to start both the client and server in development mode:

```bash
pnpm dev
```

### Build for Production

To build the client and server:

```bash
pnpm build
```

### Deploy

To deploy the project to Cloudflare Workers:

```bash
pnpm deploy
```
