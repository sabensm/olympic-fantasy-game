# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Fantasy draft tracker for the 2026 Milan Cortina Winter Olympics. Teams draft countries and earn points based on those countries' medal wins. Medal data is scraped from Wikipedia automatically.

## Commands

- `npm run dev` — Start Vite dev server (port 8080)
- `npm run dev:backend` — Start Convex dev server (`npx convex dev`)
- `npm run build` — Production build
- `npm run lint` — ESLint

Both frontend and backend dev servers need to run simultaneously during development.

## Architecture

**Frontend:** React 18 + TypeScript + Vite, using React Router, Tailwind CSS, and shadcn/ui components (configured in `components.json`). Routes are lazy-loaded except Landing and NotFound.

**Backend:** Convex (serverless database + functions). The `convex/` directory contains all backend code:
- `schema.ts` — Three tables: `medals`, `teams`, `teamCountries`
- `scrape.ts` — Node.js action (`"use node"`) that scrapes Wikipedia medal table using cheerio, runs on a 30-min cron (only during Milan active hours 09:00-23:59 CET)
- `medals.ts` — Query/mutation for medal data (full replace on each scrape, with guards against empty/suspicious data)
- `teams.ts` — CRUD mutations and queries for teams with their country assignments (enforces unique country drafting per league)
- `validation.ts` — Input validation for team names, avatars, members, and country codes
- `crons.ts` — Cron job definitions

Convex auto-generates types in `convex/_generated/` — don't edit those files.

**Key data flow:** `useFantasyData` hook (in `src/hooks/`) is the central data layer. It queries Convex for teams and medals, then computes tier-based scoring client-side. All Convex queries are reactive (auto-update).

## Scoring System

Countries are assigned to tiers in `src/data/countryTiers.ts` with exponentially increasing point multipliers:
- **Tier 1** (13 nations: NOR, GER, USA, CAN, etc.): Gold=3, Silver=2, Bronze=1
- **Tier 2** (19 nations: FIN, JPN, GBR, etc.): Gold=30, Silver=20, Bronze=10
- **Tier 3** (all others): Gold=300, Silver=200, Bronze=100

Point calculation lives in `src/types/fantasy.ts` (`calculateCountryPoints`).

## Path Aliases

`@/` maps to `./src/` (configured in both `tsconfig.json` and `vite.config.ts`).

## Auth

Uses `@convex-dev/auth` with password-based authentication. `src/hooks/useAuth.tsx` wraps the Convex auth hooks. League mutations require authentication and check that the user is the league admin. League viewing (queries) is public so shared links work for non-authenticated users.

## Environment

Convex deployment config is in `.env.local` (CONVEX_DEPLOYMENT and VITE_CONVEX_URL).
