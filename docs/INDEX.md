# NextUnicorn Project Tree

This repository keeps framework-required files at the root and groups independent material by nature.

## Root

- `app/` - Next.js App Router routes, components, metadata, robots and sitemap.
- `prisma/` - Prisma schema, migrations, generated client and local database file.
- `public/` - Public runtime assets served as-is.
- `scripts/` - Local maintenance scripts grouped by domain.
- `docs/` - Project documentation, audits, legacy notes and strategy documents.
- `package.json`, `next.config.ts`, `tsconfig.json`, `vercel.json`, `postcss.config.mjs`, `eslint.config.mjs` - tool and deployment configuration.
- `.env*` - local environment files.

## Scripts

- `scripts/seo/` - SEO validation and IndexNow submission.
- `scripts/db/` - database checks, seed and cleanup helpers.
- `scripts/ideas/` - idea generation and catalogue maintenance.
- `scripts/i18n/` - translation extraction and generation helpers.
- `scripts/ads/` - advertising slot and advertiser helpers.
- `scripts/reservations/` - reservation testing and local reservation utilities.
- `scripts/testing/` - test submission helpers.
- `scripts/dev/` - developer convenience helpers.

## Docs

- `docs/project/` - core project guides and legacy structure notes.
- `docs/deployment/` - deployment and cron documentation.
- `docs/seo/` - SEO audit notes and Ahrefs follow-up.
- `docs/strategy/` - marketing and pricing strategy.
- `docs/archive/` - reserved for historical files that should not live in active paths.

## Cleanup Rules

- Keep framework and tool config files at the root.
- Put every Markdown document under `docs/`.
- Put runnable maintenance scripts under the closest `scripts/<domain>/` folder.
- Do not keep generated artifacts in the repository root.
- Prefer `npm run ...` commands for recurring checks so paths stay centralized.
