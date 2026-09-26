# House of Edtech — Kudos Wall

Kudos Wall is an employee recognition wall. Teammates sign in, write a short note for someone else, and the rest of the company can see it and react. There are no roles, managers, or approval steps. Anyone with an account can recognize anyone else.

This is the House of Edtech full-stack assignment. The app started from the course boilerplate (Next.js, Auth.js, MongoDB, shadcn, tests, and CI) and grew into the product described below.

## What a Kudos is

A Kudos is one public note from one person to one other person. It has a message, a template, a date, and reactions.

- The message is 10 to 500 characters. The create and edit boxes show how many characters are written and how many are left.
- The sender is always the signed-in user. The browser never chooses the sender.
- You cannot send a Kudos to yourself.
- The wall shows the newest 50 notes.

### Templates

Each note uses one template. The template sets the sticker and the card colors.

| Template    | Sticker      |
| ----------- | ------------ |
| Celebration | Party popper |
| Achievement | Trophy       |
| Teamwork    | Handshake    |
| Gratitude   | Folded hands |
| Innovation  | Light bulb   |
| Leadership  | Star         |
| Kindness    | Yellow heart |
| Welcome     | Waving hand  |

Stickers are Microsoft Fluent Emoji images, so they look the same on every device.

### Cards

A card shows who gave the note and who received it, with round initials (there are no profile photos). The message sits between quotation marks on a tinted background. The date sits at the bottom right. A large sticker fades out toward the left side of the card.

On a wide screen the wall is three cards across. It drops to two, then one, as the screen gets narrower.

### Edit and delete

Only the sender can change a note.

- For 30 minutes after it is sent, the sender can edit the message. The template and the recipient stay as they were.
- After 30 minutes the message locks. The sender can still delete the note.
- Delete asks for confirmation, then removes the note and its reactions.

### Reactions

Anyone signed in can react. Each person can turn a reaction on or off. The five reactions are heart, clap, fire, party, and rocket. The card shows the count for each.

### Filter

The Filter button sits on the right of the Kudos Wall title.

- **Types** shows notes for one template.
- **Users** shows every note that person gave and every note they received.
- **All** clears the filter.

While a list is loading, the page shows skeleton cards instead of an empty wall.

## Pages

| Route       | What it is                                                     |
| ----------- | -------------------------------------------------------------- |
| `/sign-up`  | Create an account. After signup you go to sign in.             |
| `/sign-in`  | Sign in. This is where the session starts.                     |
| `/`         | Kudos Wall. Create a note, filter, react, and manage your own. |
| `/my-kudos` | Notes you gave and notes you received.                         |
| `/profile`  | Your name and email.                                           |
| `/terms`    | Terms and conditions.                                          |

The header has Create Kudos and the profile menu (My Profile, My Kudos, Terms & Conditions, Sign out). The footer names Kishan Ambaliya and links to GitHub and LinkedIn. Light and dark mode both use the same Flip7 palette (teal, gold, coral, and sky).

## What this project leaves out

No departments, job titles, manager hierarchy, invitations, admin tools, comments, notifications, email, Slack, or AI. Profile details cannot be edited. The wall does not paginate past the newest 50 notes.

## How this project was built

Work followed a written plan before the feature code. The tracker is [docs/KUDOS_WALL_PLAN.md](docs/KUDOS_WALL_PLAN.md). Visual rules come from the Flip7 palette in the design notes, applied through the skills in `.agents/skills/` (frontend design, shadcn, Tailwind v4, and the Vercel React performance guide).

The procedure was:

1. **Keep the boilerplate.** Next.js 16 App Router, TypeScript, Tailwind CSS v4, shadcn (`base-nova` / Base UI), Mongoose, Auth.js, Vitest, Playwright, Husky, and GitHub Actions were already in the repo. Product code extends that setup. Theme colors live in `app/globals.css`. There is no `tailwind.config.ts`.
2. **Lock the rules first.** The plan records the data model, the API, password rules, and what is out of scope. Passwords use Node `crypto.scrypt`. The server checks the session before it touches the database. Clients receive plain objects, never Mongoose documents or password hashes.
3. **Build one phase at a time.** Frontend and backend for a phase land together. Each phase is checked before the next one starts.
   - Phase 1 — Sign up, sign in, sign out, and a protected session.
   - Phase 2 — Header, footer, Kudos Wall shell, and empty state.
   - Phase 3 — Create Kudos: pick a teammate, write a message, choose a template, see a live preview, publish.
   - Phase 4 — Reactions with counts and a toggle.
   - Phase 5 — My Profile, My Kudos, and Terms.
4. **Shape the wall from use.** After those phases, the cards, templates, and actions were refined: eight templates, Fluent stickers, a visible message limit, a 30-minute edit window, delete, a type and user filter, and skeleton loading while lists load.
5. **Check it, then commit.** UI changes are exercised in the browser. Pre-commit runs ESLint and Prettier on staged files. Pushing to `main` runs CI: lint, format, typecheck, unit tests, and a production build.

## Tech stack

- **Framework:** Next.js 16 (App Router) and React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 and shadcn/ui
- **Database:** MongoDB and Mongoose
- **Auth:** Auth.js v5 (credentials, JWT session)
- **Validation:** Zod
- **Testing:** Vitest and Playwright
- **CI:** GitHub Actions

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`. Server variables are checked at runtime in `lib/env.ts`. Do not commit `.env.local`.

| Variable      | Required | Description                                                        |
| ------------- | -------- | ------------------------------------------------------------------ |
| `MONGODB_URI` | Yes      | MongoDB connection string (`mongodb://` or `mongodb+srv://`)       |
| `AUTH_SECRET` | Yes      | Session secret, at least 32 characters (`openssl rand -base64 32`) |
| `AUTH_URL`    | Yes      | App URL (`http://localhost:3000` locally)                          |

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sign up, then sign in. You need at least one other account before you can send a Kudos.

### 4. Check the database

```bash
curl http://localhost:3000/api/health/db
```

A healthy response includes `"connected": true`.

## Scripts

| Command                | Description                     |
| ---------------------- | ------------------------------- |
| `npm run dev`          | Start the development server    |
| `npm run build`        | Production build                |
| `npm run lint`         | Run ESLint                      |
| `npm run format`       | Format with Prettier            |
| `npm run format:check` | Check Prettier formatting       |
| `npm run typecheck`    | Run the TypeScript check        |
| `npm run test:unit`    | Run Vitest unit tests           |
| `npm run test:e2e`     | Run Playwright tests            |
| `npm run test`         | Run unit tests, then Playwright |

## Project structure

```
app/
  api/                 # Route handlers (auth, kudos, users, health)
  page.tsx             # Kudos Wall
  my-kudos/            # Notes given and received
  profile/             # Signed-in user
  sign-in/ sign-up/    # Auth pages
components/
  kudos/               # Cards, create dialog, filter, reactions
  layout/              # Header, footer, profile menu
  ui/                  # shadcn components
lib/
  auth/                # Session and password hashing
  kudos/               # Templates, stickers, list, edit window
  validators/          # Zod schemas
models/                # Mongoose models (User, Kudos, Reaction)
docs/KUDOS_WALL_PLAN.md
tests/unit/            # Vitest
```

## API

Signed-in routes call `requireUser()` before any database work. Signup is the exception.

| Method   | Path                             | What it does                                  |
| -------- | -------------------------------- | --------------------------------------------- |
| `POST`   | `/api/auth/signup`               | Create an account                             |
| `GET`    | `/api/users`                     | Teammates you can recognize                   |
| `POST`   | `/api/kudos`                     | Publish a Kudos                               |
| `GET`    | `/api/kudos`                     | List wall, given, or received notes           |
| `PATCH`  | `/api/kudos/:id`                 | Edit your message during the 30-minute window |
| `DELETE` | `/api/kudos/:id`                 | Delete a Kudos you sent                       |
| `POST`   | `/api/kudos/:id/reactions`       | Add a reaction (`{ "type": "clap" }`)         |
| `DELETE` | `/api/kudos/:id/reactions/:type` | Remove that reaction                          |

## Deployment (Vercel)

1. Push this repo to GitHub.
2. Import it in Vercel. Next.js is detected automatically.
3. Add `MONGODB_URI`, `AUTH_SECRET`, and `AUTH_URL` (your deployed URL, such as `https://your-app.vercel.app`).
4. Deploy. Pushes to `main` redeploy.

## CI

GitHub Actions runs on every push and pull request to `main`: ESLint, Prettier, TypeScript, unit tests, and a production build. See [.github/workflows/ci.yml](.github/workflows/ci.yml).

Husky and lint-staged run ESLint and Prettier on staged files before a commit. CI runs the full checks.
