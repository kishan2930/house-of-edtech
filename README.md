# House of Edtech — Full-Stack Assignment Boilerplate

Next.js 16 full-stack boilerplate for the House of Edtech assignment. Includes TypeScript, Tailwind CSS, MongoDB (Mongoose), shadcn/ui, testing, and CI/CD.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Database:** MongoDB Atlas + Mongoose
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

Fill in your MongoDB Atlas connection string. See [docs/MONGODB_SETUP.md](docs/MONGODB_SETUP.md) for a step-by-step guide.

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

| Command             | Description              |
| ------------------- | ------------------------ |
| `npm run dev`       | Start development server |
| `npm run build`     | Production build         |
| `npm run lint`      | Run ESLint               |
| `npm run typecheck` | Run TypeScript check     |
| `npm run format`    | Format with Prettier     |
| `npm run test:unit` | Run Vitest unit tests    |
| `npm run test:e2e`  | Run Playwright e2e tests |
| `npm run test`      | Run all tests            |

## Project Structure

```
app/
  api/              # Route Handlers (backend)
  (routes)/         # Future pages
components/
  ui/               # shadcn/ui components
  layout/           # Header, footer
lib/
  db.ts             # MongoDB connection singleton
  validators/       # Zod schemas
models/             # Mongoose models
tests/
  unit/             # Vitest tests
  e2e/              # Playwright tests
```

## Environment Variables

| Variable          | Required | Description                                       |
| ----------------- | -------- | ------------------------------------------------- |
| `MONGODB_URI`     | Yes      | MongoDB Atlas connection string                   |
| `NEXTAUTH_SECRET` | Phase 7  | Random secret for session encryption              |
| `NEXTAUTH_URL`    | Phase 7  | Deployed URL (e.g. `https://your-app.vercel.app`) |

## Deployment (Vercel)

1. Push this repo to your personal GitHub account.
2. Sign in to [vercel.com](https://vercel.com) with GitHub.
3. Click **Add New Project** → import this repository.
4. Vercel auto-detects Next.js — no extra config needed.
5. Add environment variables in **Settings → Environment Variables**:
   - `MONGODB_URI` — your Atlas connection string (use `0.0.0.0/0` in Atlas Network Access for Vercel)
6. Click **Deploy**. Future merges to `main` auto-redeploy.

## CI

GitHub Actions runs on every push/PR to `main`:

- Lint
- Typecheck
- Unit tests
- Production build

See [.github/workflows/ci.yml](.github/workflows/ci.yml).
