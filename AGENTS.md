# AGENTS.md

SvelteKit 2 (Svelte 5) + Tailwind CSS 4 + Drizzle ORM / Postgres. No test runner, no CI.

## Commands

```sh
npm run dev          # dev server
npm run check        # typecheck (svelte-check) — run after changes
npm run lint         # prettier --check . (lint is formatting only)
npm run format       # prettier --write .
npm run build        # production build
```

Order: `check` then `lint` (or just `format` and `check`). There is no test suite.

## Database

- Postgres runs via Docker: `npm run db:start` (creds root/mysecretpassword, db `local`, port 5432).
- `DATABASE_URL` must exist in `.env` (see `.env.example`) or the app and drizzle scripts throw at startup.
- Schema: `src/lib/server/db/schema.ts`; client: `src/lib/server/db/index.ts` (server-only, uses `$env/dynamic/private`).
- Dev workflow: `npm run db:push` after editing the schema. For real migrations: `npm run db:generate` then `npm run db:migrate`. Inspect data with `npm run db:studio`.

## Conventions

- Runes mode is enforced project-wide via `vite.config.ts` — write components with `$state`/`$derived`, not legacy stores.
- Prettier: tabs, single quotes, no trailing commas, 100 width, svelte + tailwindcss plugins. Run `format` before committing.
- `prettier.config.js` points `tailwindStylesheet` at `./src/routes/page.css` — keep it in sync if the stylesheet moves.
- `adapter-auto` is used; switch adapter when targeting a specific deploy environment.
