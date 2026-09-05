# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Personal portfolio for Tahmidul Bin Ferdous ("Kashfi") — CV/DL engineer. TanStack Start (SSR) + React 19 + Tailwind v4, deployed to Vercel at `tahmidkashfi.dev`. Originally scaffolded by Lovable and still synced with it.

## Commands

Package manager is **bun** (`bun.lock`, `bunfig.toml`); npm works as a fallback.

```
bun install
bun run dev        # vite dev
bun run build      # vite build -> .output/ (Nitro)
bun run start      # node scripts/serve.mjs — serves the built .output/ (SSR + range requests for video)
bun run preview    # vite preview
bun run lint       # eslint .
bun run format     # prettier --write .
```

No test suite and no test runner is installed. Verification is `bun run lint` + `bun run build`.

## Architecture

### Data flow — the central thing to understand

All page content (projects, experience, certifications, profile) is **data, not JSX**. It lives in three places with a fallback chain, all wired through [src/lib/portfolio-data.ts](src/lib/portfolio-data.ts):

1. **Supabase** (`projects`, `experience`, `certifications`, `profile` tables) — the source of truth when `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` are set.
2. **localStorage** cache (`portfolio_*_data` keys) — used when Supabase is absent or returns empty.
3. **`INITIAL_*` constants** in `portfolio-data.ts` — the hardcoded seed content, and what actually renders on a fresh deploy with no Supabase.

`getSupabase()` returns `null` when unconfigured, and every read/write path degrades to localStorage silently. `getPortfolioData()` falls back **per-table**: an empty `projects` table still yields `INITIAL_PROJECTS`. Writes (`saveProject`, `saveExperience`, …) go to Supabase _and_ localStorage.

Consequence: to change portfolio content, edit `INITIAL_*` in `portfolio-data.ts` (the committed default) — editing via `/admin` alone only touches Supabase/localStorage and will not survive a fresh browser or appear in git.

**Field-name mismatch is deliberate**: Supabase columns are snake_case (`student_status`, `portrait_url`, `resume_url`), TS types are camelCase. The mapping is hand-written in `getPortfolioData()` / `saveProfile()`. Adding a profile field means touching: `src/types/portfolio.ts`, the SQL in `supabase-schema.sql`, both mapping directions in `portfolio-data.ts`, the admin manager component, and `src/routes/index.tsx`.

### Routes

Only two: [src/routes/index.tsx](src/routes/index.tsx) (the whole single-page portfolio — Hero / Projects / About / Experience / Certifications / Contact, all local components in one 720-line file) and [src/routes/admin.tsx](src/routes/admin.tsx) (thin wrapper over `src/components/admin/AdminLayout.tsx`).

File-based routing conventions are documented in [src/routes/README.md](src/routes/README.md) — read it before adding a route. `routeTree.gen.ts` is generated; never hand-edit.

### Admin

`/admin` is client-side gated by a plain password compared against `VITE_ADMIN_PASSWORD` (see `AdminLayout.tsx`). This is a **client-side env var — it ships in the bundle**. It is a UI speed bump, not access control; the real gate is Supabase RLS, which allows public SELECT and authenticated-only writes. Anonymous writes from the admin panel therefore fail against a properly configured Supabase project.

Managers under `src/components/admin/` each own one table; `MediaUploader` pushes to the `portfolio-assets` storage bucket via `uploadPortfolioFile()` and returns a public URL (or a local blob URL when Supabase is unconfigured).

### Media

Videos/images/certs are served from `public/content/` and referenced by root-relative path (`/content/idcard_ai.mp4`). `scripts/serve.mjs` implements HTTP range requests specifically so `<video>` seeking works in production.

### Error handling (three layers, all custom)

- `src/server.ts` — wraps the SSR entry and unwraps h3's swallowed 500s (`{"unhandled":true,"message":"HTTPError"}`) back into a rendered error page.
- `src/start.ts` — request middleware catching non-HTTP throws.
- `src/routes/__root.tsx` — React `errorComponent` / `notFoundComponent`, reporting through `lib/lovable-error-reporting.ts`.

Don't replace these with defaults; they exist because h3 hides real stack traces.

## Constraints

- **Vite config**: `@lovable.dev/vite-tanstack-config` already bundles the TanStack Start, React, Tailwind, tsconfig-paths, Nitro and env plugins. Adding any of them manually to [vite.config.ts](vite.config.ts) breaks the build with duplicate plugins.
- **Lovable sync** ([AGENTS.md](AGENTS.md)): never force-push, rebase, amend, or squash already-pushed commits — it destroys project history on Lovable's side. Keep `main` working; every push auto-deploys to Vercel.
- **Dependency installs**: `bunfig.toml` sets `minimumReleaseAge = 86400` (blocks packages published in the last 24h). Confirm with the user before adding anything to `minimumReleaseAgeExcludes`.
- UI is shadcn/ui (`components.json`, 46 primitives in `src/components/ui/`) over Radix — reuse those rather than adding new UI dependencies.

## Deployment

See [DEPLOY.md](DEPLOY.md). Vercel auto-detects Nitro output; no `vercel.json`, no output directory override. `supabase-schema.sql` is run manually in the Supabase SQL editor to provision tables, RLS policies, and the storage bucket.
Git remote is `git@github.com:AI-human/portfolio.git` (connects via `ssh.github.com:443` if standard SSH port 22 is firewalled).
