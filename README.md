# Hydra

<div align="center">
  <!-- Logo or screenshot placeholder -->
  <h3>Easy-to-use Desktop Issue Manager</h3>
</div>

## Overview

Hydra is a lightweight, offline-first desktop application for project and issue management. Built with Electron, it connects directly to your own PostgreSQL database — no cloud dependency, full data ownership.

### Key Features

- Offline-first project/issue tracking
- Multi-workspace support (connect to multiple databases)
- Cross-platform desktop application (Windows, macOS, Linux)
- Invite system for team collaboration
- Role-based member management via PostgreSQL roles

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | Electron + React 19 + TypeScript |
| UI | shadcn/ui + Tailwind CSS v4 |
| State | Zustand v5 |
| ORM / DB | Drizzle ORM + PostgreSQL |
| Routing | React Router v7 |
| Table / Form | TanStack Table + TanStack Form |
| Charts | Recharts |
| Icons | lucide-react |
| Linter | Biome |
| Build | electron-vite + Electron Forge |

## Screenshots

<!-- Add 3-4 screenshots of key features here -->

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v22+
- [pnpm](https://pnpm.io/) v10+
- [Docker](https://www.docker.com/) (for local PostgreSQL)

### Installation

```bash
# Clone the repository
git clone https://github.com/jujoycode/hydra.git
cd hydra

# Install dependencies
pnpm install

# Start PostgreSQL via Docker
pnpm docker:up

# Push database schema
pnpm db:push

# Run in development mode (with hot reload)
pnpm hot
```

### Environment Variables

Copy `.env.example` to `.env` and adjust as needed:

```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=hydra
```

### Common Commands

| Task | Command |
|------|---------|
| Dev (hot reload) | `pnpm hot` |
| Dev (no hot reload) | `pnpm dev` |
| Build | `pnpm build` |
| Typecheck | `pnpm typecheck` |
| Lint | `pnpm lint` |
| Format | `pnpm format` |
| Package | `pnpm package` |
| Make installer | `pnpm make` |
| Start PostgreSQL | `pnpm docker:up` |
| Stop PostgreSQL | `pnpm docker:down` |
| Push DB schema | `pnpm db:push` |

## Documentation

- [Project Kick-off](docs/kick-off.md)
- [Database Conventions](docs/convention-db.md)
- [Database Schema (ERD)](docs/table-erd.md)

## Contributors

- Project Lead & Full-stack Developer: [@jujoycode](https://github.com/jujoycode)
- Backend Developer: [@abruption](https://github.com/abruption)

## License

This project is open-sourced under the MIT License.
