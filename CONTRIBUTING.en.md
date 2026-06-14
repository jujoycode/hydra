# Contributing to Hydra

> English · **[한국어](./CONTRIBUTING.md)**

Thanks for contributing to Hydra! This document summarizes the dev environment, workflow, and code conventions.

## Development environment

```bash
pnpm install          # install dependencies
cp .env.example .env  # for the drizzle CLI only (separate from app runtime connection)
pnpm docker:up        # (optional) local PostgreSQL
pnpm hot              # Electron app in dev mode (hot reload)
```

See [`README.en.md`](./README.en.md) and [`wiki/Getting-Started.md`](./wiki/Getting-Started.md) for the full getting-started guide.

## Local gates (before opening a PR)

```bash
pnpm typecheck   # type-check (node + web)
pnpm lint        # Biome lint (autofix)
pnpm test        # Vitest
pnpm build       # full build
```

For UI components, also check stories with `pnpm storybook`.

## Workflow (GitHub Flow)

- The base branch is **`main`** (always releasable, protected).
- Branch off the latest `main` with a **short-lived branch** and merge **only via PR** (CI green + 1 approval; no self-approve).
- Branch naming by intent: `feature/*`, `bugfix/*`, `hotfix/*`, `docs/*`, `chore/*`, `refactor/*`, `test/*`.
- Default merge is **squash**; delete the branch after merge.
- Details: [`docs/adr/0001-adopt-github-flow.md`](./docs/adr/0001-adopt-github-flow.md).

## Code conventions

- **Biome**: single quotes, no semicolons, 120 cols, 2-space indent, LF.
- **Naming**: PascalCase (components/classes), camelCase (functions/variables), UPPER_SNAKE_CASE (constants), `handle` prefix (event handlers).
- **DB access from the main process only** (renderer uses IPC `window.callApi`).
- **Renderer data fetching**: domain hooks + `useApiQuery`/`useApiMutation` ([`docs/adr/0002`](./docs/adr/0002-renderer-data-fetching.md)).
- **Component folder structure**: `atoms/Button/{ index.ts, Button.tsx, Button.stories.tsx, Button.test.tsx }`.
- **Tests**: layered (unit / integration(DB) / flow / UI) ([`docs/adr/0003`](./docs/adr/0003-test-architecture.md)).
- Commit prefixes: `feat`/`fix`/`docs`/`test`/`ci`/`refactor`/`style`/`chore`.

## PR guidelines

- Keep each PR to a single logical change.
- Describe the change and your verification results.
- CI (typecheck/lint/test/build) must be green to merge.

## Code of Conduct

All participants follow the [Code of Conduct](./CODE_OF_CONDUCT.en.md).
