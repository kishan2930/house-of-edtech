# House of Edtech — Full-Stack Assignment Boilerplate

Next.js 16 full-stack boilerplate for the House of Edtech assignment. Includes TypeScript, Tailwind CSS, MongoDB (Mongoose), Auth.js scaffold, shadcn/ui, testing, and CI/CD.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Database:** MongoDB Atlas + Mongoose
- **Auth:** Auth.js v5 (NextAuth) — scaffold only, no login UI yet
- **Testing:** Vitest (unit) + Playwright (e2e)
- **CI/CD:** GitHub Actions + Vercel

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in all values in `.env.local`. Server env vars are validated at runtime via Zod in `lib/env.ts`.

| Variable      | Required | Description                                                         |
| ------------- | -------- | ------------------------------------------------------------------- |
| `MONGODB_URI` | Yes      | MongoDB Atlas connection string                                     |
| `AUTH_SECRET` | Yes      | Session encryption secret (min 32 chars; `openssl rand -base64 32`) |
| `AUTH_URL`    | Yes      | App URL (`http://localhost:3000` locally)                           |

See [docs/MONGODB_SETUP.md](docs/MONGODB_SETUP.md) for Atlas setup steps.

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Verify database connection

```bash
curl http://localhost:3000/api/health/db
```

Expected: `{ "connected": true, "count": 0 }`

## Scripts

| Command                | Description               |
| ---------------------- | ------------------------- |
| `npm run dev`          | Start development server  |
| `npm run build`        | Production build          |
| `npm run lint`         | Run ESLint                |
| `npm run format`       | Format with Prettier      |
| `npm run format:check` | Check Prettier formatting |
| `npm run typecheck`    | Run TypeScript check      |
| `npm run test:unit`    | Run Vitest unit tests     |
| `npm run test:e2e`     | Run Playwright e2e tests  |
| `npm run test`         | Run all tests             |

## Project Structure

```
app/
  api/              # Route Handlers (backend)
  (routes)/         # Future pages
components/
  ui/               # shadcn/ui components
  layout/           # Header, footer
hooks/              # Custom React hooks (shadcn alias)
lib/
  db.ts             # MongoDB connection singleton
  env.ts            # Zod server env validation
  validators/       # Zod schemas for future features
models/             # Mongoose models
tests/
  unit/             # Vitest tests
  e2e/              # Playwright tests
```

## Footer (assignment requirement)

Before submission, update `components/layout/footer.tsx` with your name, GitHub profile URL, and LinkedIn profile URL.

## Deployment (Vercel)

1. Push this repo to your personal GitHub account.
2. Sign in to [vercel.com](https://vercel.com) with GitHub.
3. Click **Add New Project** → import this repository.
4. Vercel auto-detects Next.js — no extra config needed.
5. Add environment variables in **Settings → Environment Variables**:
   - `MONGODB_URI` — your Atlas connection string
   - `AUTH_SECRET` — production secret (`openssl rand -base64 32`)
   - `AUTH_URL` — your deployed URL (e.g. `https://your-app.vercel.app`)
6. Click **Deploy**. Future merges to `main` auto-redeploy.

## CI

GitHub Actions runs on every push/PR to `main`:

- ESLint
- Prettier format check
- TypeScript typecheck
- Unit tests
- Production build

See [.github/workflows/ci.yml](.github/workflows/ci.yml).

Pre-commit (Husky + lint-staged) runs ESLint and Prettier on **staged files only** — full validation happens in CI.
