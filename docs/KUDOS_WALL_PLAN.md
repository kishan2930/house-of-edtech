# Kudos Wall — Implementation Plan

Status: **not started**. This file is the tracker. Check a box only when that step is done and verified. Do not start the next phase until the current phase’s “Done when” checks pass.

Do not implement roles, departments, managers, comments, notifications, admin, invitations, or AI. Those are future scope.

---

## Phase tracker

- [x] Phase 1 — Authentication
- [ ] Phase 2 — Dashboard shell
- [ ] Phase 3 — Create Kudos
- [ ] Phase 4 — Reactions
- [ ] Phase 5 — Profile pages
- [ ] Phase 6 — Polish and critical tests

---

## How to use this file

1. Read the locked decisions, database, API, and design sections before writing code.
2. Inspect the existing file before editing it. Extend the current Next.js, Auth.js, Mongoose, and shadcn setup. Do not replace the stack.
3. Implement one phase at a time. Frontend and backend steps in a phase land together.
4. Tick the step checkbox, then the phase checkbox, then stop for review if asked.

---

## Skills to follow while implementing

These skills live in `.agents/skills/`. The visual source of truth is `flip7-card-game-DESIGN.md`. Where that file specifies a color, radius, shadow, or component treatment, follow it. Product behavior still comes from this plan.

### frontend-design

- Kudos Wall is an employee recognition wall. The memorable element is the Kudos card (message first, colored left accent, glow on the active template). Everything else stays quiet.
- Use the Flip7 palette, pill buttons, cream inputs, and ribbon wordmark. Do not fall back to a generic neutral shadcn theme or a cream-and-terracotta template.
- One type family: the system stack in the design file. Headlines are extra-bold. Do not accent a single word in a headline, do not use all-caps labels, and do not append arrows to buttons.
- Copy is sentence case and says what the control does: “Create Kudos”, “Sign up”, “Sign in”, “Sign out”.
- Empty states tell the user what to do next. Errors name the problem and the fix.
- Motion answers an action. Button press is `scale(0.95)` and stays under 500ms. Do not run infinite crown-bounce, BOOM pulse, or confetti on the wall. The design file’s long victory loops belong to the Flip7 game, not this product.

### shadcn

- Project style is `base-nova` (`components.json`). Primitives are Base UI (`@base-ui/react`). Use the `render` prop for custom triggers. Do not use Radix `asChild`.
- Add missing components with `npx shadcn@latest add`. Installed today: `button`, `dropdown-menu`.
- Add when a phase needs them: `input`, `textarea`, `field`, `card`, `dialog`, `select`, `avatar`, `badge`, `empty`, `skeleton`, `separator`, `spinner`, `toggle-group`.
- Compose. Do not restyle component colors from `className`. Layout classes (`flex`, `gap-*`, `w-*`) are fine.
- Forms use `FieldGroup` + `Field` + `FieldLabel`. Put `data-invalid` on `Field` and `aria-invalid` on the control.
- The two templates are a `ToggleGroup`, not two manually toggled buttons.
- Dialogs include `DialogTitle`. Cards use `CardHeader`, `CardTitle`, `CardContent`, and `CardFooter`.
- Empty states use `Empty`. Loading uses `Skeleton`. Dividers use `Separator`. Status chips use `Badge`.
- Buttons have no `isLoading` prop. Disable the button and show `Spinner` with `data-icon="inline-start"`.
- Icons are `lucide-react` components, passed as objects. Inside `Button`, set `data-icon` and do not add size classes on the icon.
- Use `gap-*`, not `space-y-*` or `space-x-*`. Use `size-*` when width and height match.
- Use `cn()` from `@/lib/utils` (it re-exports the `cn` package).
- Toasts, if a phase needs one, use the Base UI `toast` component. Do not add Sonner.

### tailwind-v4-shadcn

- This app is Next.js with Tailwind v4 via PostCSS (`@tailwindcss/postcss`). Do not switch it to Vite or `@tailwindcss/vite`. Do not add `tailwind.config.ts`.
- `components.json` already has `"tailwind.config": ""`. Leave it empty.
- Theme tokens live only in `app/globals.css`. The file already has `:root`, `.dark`, and `@theme inline`.
- This repo’s shadcn theme uses color values directly (oklch today). When applying Flip7, set the hex values from the design file as the CSS variables. Do not wrap them in `hsl()`. Do not write `hsl(var(--primary))`. `@theme inline` keeps mapping `--color-*` to `var(--*)`.
- Use semantic utilities (`bg-primary`, `bg-card`, `text-muted-foreground`) after the variables point at Flip7 colors. Do not sprinkle raw hex classes through components.
- `@apply` is already used in the existing `@layer base` block. Do not expand that pattern into new component CSS.

### vercel-react-best-practices

- First paint of the wall loads Kudos on the server. The create dialog and reaction buttons are client components that update from the mutation response.
- Every route handler calls `requireUser()` before any database work, except signup and the health checks.
- Do not pass Mongoose documents or `passwordHash` to client components. Pass the API shapes in this plan.
- When a handler needs the user and a Kudos document, start independent queries together with `Promise.all`.
- Do not add a barrel `index.ts` that re-exports features.
- Do not add SWR or React Query. The wall does not need a data library.

---

## Product scope

Employees sign up, sign in, and land on the Kudos Wall. They publish a Kudos to another employee, pick one of two templates, see a live preview, and other employees react.

Anyone can sign up. Anyone can sign in. Any authenticated user can give Kudos to any other user. There is no role, department, manager, or approval.

### Must have

- Sign up, sign in, sign out, server session
- Kudos Wall and Kudos cards
- Header with Create Kudos and profile menu
- My Profile, My Kudos (given and received), Terms & Conditions
- Create flow: recipient select, message, template, live preview, publish
- Reactions: several types, counts, toggle on and off

### Out of scope

Senior, Junior, CTO, departments, manager hierarchy, role permissions, invitations, admin, employee management, comments, notifications, email, Slack, Teams, AI, awards, analytics, profile editing.

---

## What already exists

| Piece                                               | Where                                                   | Use it                                             |
| --------------------------------------------------- | ------------------------------------------------------- | -------------------------------------------------- |
| Next.js 16 App Router, React 19, TypeScript         | `package.json`                                          | Keep                                               |
| Tailwind 4 + shadcn base-nova                       | `app/globals.css`, `components.json`                    | Retheme, do not replace                            |
| Mongoose connection                                 | `lib/db.ts`                                             | Keep                                               |
| Env validation                                      | `lib/env.ts`                                            | Keep the three keys below                          |
| Auth.js v5 Credentials, JWT                         | `auth.ts`, `app/api/auth/[...nextauth]/route.ts`        | Replace the placeholder user. Keep the route       |
| Session provider                                    | `components/providers/session-provider.tsx`             | Keep                                               |
| Middleware scaffold                                 | `middleware.ts`                                         | Make it actually protect routes                    |
| Button, dropdown menu, theme toggle, header, footer | `components/`                                           | Restyle header. Keep footer and theme toggle       |
| Health checks                                       | `app/api/health/route.ts`, `app/api/health/db/route.ts` | Keep. DB health still uses `models/Placeholder.ts` |
| Vitest + Playwright + CI                            | `vitest.config.ts`, `playwright.config.ts`              | Add critical tests in Phase 6                      |

Nothing product-specific exists yet. `auth.ts` accepts only `test@example.com` / `password`. `middleware.ts` does not block anyone. `app/page.tsx` is the Next.js starter.

---

## Locked decisions

1. Password hashing is Node `crypto.scrypt`. No new hashing package.
2. Password rules: required, 8–128 characters, at least one letter and one number. Confirm password must match.
3. Name: required, trimmed, 2–80 characters. Email: valid format, stored lowercase, unique.
4. Message: required, trimmed, 10–500 characters.
5. After signup, send the user to Sign in. The session starts only after sign-in.
6. Routes: `/sign-up`, `/sign-in`, `/` (Kudos Wall), `/profile`, `/my-kudos`, `/terms`.
7. A user cannot give Kudos to themselves.
8. Templates are the strings `celebration` and `achievement`. They are not a collection.
9. Reaction types are `heart`, `clap`, `fire`, `party`, `rocket`. The UI shows the emoji. Unique per user, per Kudos, per type.
10. The wall returns the newest 50 Kudos. No pagination UI.
11. The server sets the sender from the session. The client never sends `senderId`.
12. Sign-in and sign-out use Auth.js. The only new auth route is `POST /api/auth/signup`.
13. Default theme is light, using the Flip7 palette. A `.dark` mapping is included so the existing toggle stays readable. It reuses Flip7 colors only.
14. Footer assignment placeholders stay until a later request supplies name and profile URLs.
15. `models/Placeholder.ts` stays for the database health check. Product data does not use it.

---

## Environment keys

Defined in `.env.example`, validated by `lib/env.ts`. Never commit `.env.local`. Never read these in client components.

| Key           | Required | Rule                                                            | Local example           |
| ------------- | -------- | --------------------------------------------------------------- | ----------------------- |
| `MONGODB_URI` | Yes      | Starts with `mongodb://` or `mongodb+srv://`                    | Atlas connection string |
| `AUTH_SECRET` | Yes      | At least 32 characters. Generate with `openssl rand -base64 32` | Session signing secret  |
| `AUTH_URL`    | Yes      | Absolute URL                                                    | `http://localhost:3000` |

No new environment variables for the MVP.

Playwright’s config already supplies fallbacks when these are missing: a 32+ character `AUTH_SECRET`, `AUTH_URL=http://localhost:3000`, and `MONGODB_URI=mongodb://127.0.0.1:27017/house-of-edtech-test`.

---

## Database

MongoDB via the existing `connectDB()` in `lib/db.ts`. Three product collections. Mongoose models live in `models/`.

Reuse the hot-reload guard already used by `Placeholder`:

```ts
export const User = models.User ?? model('User', userSchema);
```

API ids are `doc._id.toString()`. Responses use `id`, never a raw Mongoose document.

### Collection `users` — `models/User.ts`

| Field          | Type     | Rules                                             |
| -------------- | -------- | ------------------------------------------------- |
| `_id`          | ObjectId | Assigned by MongoDB. Exposed as `id`              |
| `name`         | String   | Required, trim, min 2, max 80                     |
| `email`        | String   | Required, trim, lowercase, unique                 |
| `passwordHash` | String   | Required. `select: false` so normal finds omit it |
| `createdAt`    | Date     | Default `Date.now`                                |

Do not add `role`, `department`, `manager`, or `updatedAt`.

Indexes:

- Unique index on `email`

`passwordHash` format (scrypt):

```
scrypt$<saltHex>$<hashHex>
```

- Salt: 16 random bytes from `crypto.randomBytes`, hex-encoded
- Hash: `crypto.scrypt` with `N=16384`, `r=8`, `p=1`, `keylen=64`, hex-encoded
- Compare with `crypto.timingSafeEqual` on equal-length buffers
- Sign-in lookup: `User.findOne({ email }).select('+passwordHash')`

### Collection `kudos` — `models/Kudos.ts`

| Field         | Type     | Rules                                           |
| ------------- | -------- | ----------------------------------------------- |
| `_id`         | ObjectId | Exposed as `id`                                 |
| `senderId`    | ObjectId | Required, ref `User`. Set only on the server    |
| `recipientId` | ObjectId | Required, ref `User`. Must not equal `senderId` |
| `message`     | String   | Required, trim, min 10, max 500                 |
| `template`    | String   | Required enum: `celebration`, `achievement`     |
| `createdAt`   | Date     | Default `Date.now`                              |

Do not embed user objects. Do not store reactions on this document.

Indexes:

- `{ createdAt: -1 }`
- `{ senderId: 1, createdAt: -1 }`
- `{ recipientId: 1, createdAt: -1 }`

### Collection `reactions` — `models/Reaction.ts`

| Field       | Type     | Rules                                                     |
| ----------- | -------- | --------------------------------------------------------- |
| `_id`       | ObjectId | Exposed as `id`                                           |
| `kudosId`   | ObjectId | Required, ref `Kudos`                                     |
| `userId`    | ObjectId | Required, ref `User`. Set only on the server              |
| `type`      | String   | Required enum: `heart`, `clap`, `fire`, `party`, `rocket` |
| `createdAt` | Date     | Default `Date.now`                                        |

Indexes:

- Unique `{ kudosId: 1, userId: 1, type: 1 }`

The same user may store `heart`, `clap`, and `fire` on one Kudos. A second `heart` from that user is rejected by the unique index.

### Reads

- List users for the recipient dropdown: `{ _id, name }` where `_id` is not the session user, sorted by `name`. Never select `passwordHash` or `email`.
- List Kudos: newest 50. Then one `Reaction.find({ kudosId: { $in: ids } })` and group counts in memory. No per-card query.
- Sender and recipient names: one `User.find({ _id: { $in: peopleIds } }).select('name')` for the ids on that page.

---

## Shared constants

`lib/kudos/templates.ts`

| Key           | Label       | Emoji | Card treatment                                 |
| ------------- | ----------- | ----- | ---------------------------------------------- |
| `celebration` | Celebration | 🎉    | Gold left bar, gold tint, `shadow-accent-glow` |
| `achievement` | Achievement | 🏆    | Teal left bar, teal tint, `shadow-teal-glow`   |

`lib/kudos/reactions.ts`

| Key      | Emoji | Accessible name |
| -------- | ----- | --------------- |
| `heart`  | ❤️    | Love            |
| `clap`   | 👏    | Clap            |
| `fire`   | 🔥    | Fire            |
| `party`  | 🎉    | Celebrate       |
| `rocket` | 🚀    | Rocket          |

Both modules are imported by server validation and by client UI. They contain no secrets and no database access.

---

## Validation

Zod 4, shared by client forms and route handlers.

`lib/validators/auth.ts`

- `name`: string, trim, 2–80
- `email`: email, trim, lowercase
- `password`: 8–128, must match `/[A-Za-z]/` and `/\d/`
- `confirmPassword`: must equal `password` on signup

`lib/validators/kudos.ts`

- `recipientId`: 24-hex ObjectId string
- `message`: trim, 10–500
- `template`: enum `celebration` | `achievement`
- Reject a body that includes `senderId` (strip it, do not trust it)

`lib/validators/reaction.ts`

- `type`: enum of the five keys

`lib/api/errors.ts`

```ts
type ApiError = {
  error: string;
  fieldErrors?: Record<string, string>;
};
```

- Validation failure: `400` and `fieldErrors`
- Missing or invalid session: `401` and `{ error: "Sign in to continue." }`
- Missing document: `404` and `{ error: "Not found." }`
- Duplicate email: `409` and `{ error: "An account with this email already exists.", fieldErrors: { email: "..." } }`
- Unexpected failure: `500` and `{ error: "Something went wrong. Try again." }`
- Log the real error on the server with `console.error`. Never send Mongo or stack text to the client.

---

## API

All product routes except signup require a session. Handlers call `connectDB()` then `requireUser()`.

JSON only. `Content-Type: application/json`.

### Auth.js routes already provided

Do not recreate these.

| Method        | Path                             | Who calls it                                             |
| ------------- | -------------------------------- | -------------------------------------------------------- |
| `GET`, `POST` | `/api/auth/*`                    | Auth.js handler in `app/api/auth/[...nextauth]/route.ts` |
| `POST`        | `/api/auth/callback/credentials` | `signIn('credentials')` from `next-auth/react`           |
| `POST`        | `/api/auth/signout`              | `signOut()` from `next-auth/react`                       |
| `GET`         | `/api/auth/session`              | `SessionProvider`                                        |
| `GET`         | `/api/auth/csrf`                 | Auth.js                                                  |
| `GET`         | `/api/auth/providers`            | Auth.js                                                  |

Credentials fields sent by the client: `email`, `password`. `authorize()` returns `{ id, name, email }` or `null`.

### `POST /api/auth/signup`

Auth: public.

Request:

```json
{
  "name": "Kishan",
  "email": "kishan@example.com",
  "password": "kudos1234",
  "confirmPassword": "kudos1234"
}
```

Success `201`:

```json
{
  "user": {
    "id": "66f0c3c0e1b2a3d4e5f60718",
    "name": "Kishan",
    "email": "kishan@example.com"
  }
}
```

Errors: `400` validation, `409` duplicate email, `500` safe message.

Does not create a session.

### `GET /api/users`

Auth: required.

Success `200`:

```json
{
  "users": [{ "id": "66f0c3c0e1b2a3d4e5f60718", "name": "Rahul" }]
}
```

Omits the current user, email, and password hash. Sorted by name ascending.

### `GET /api/users/me`

Auth: required. Static route `app/api/users/me/route.ts` so it is not captured by `[id]`.

Success `200`:

```json
{
  "user": {
    "id": "66f0c3c0e1b2a3d4e5f60718",
    "name": "Kishan",
    "email": "kishan@example.com",
    "createdAt": "2026-09-26T12:00:00.000Z"
  }
}
```

### `GET /api/users/:id`

Auth: required. File: `app/api/users/[id]/route.ts`.

Success `200`:

```json
{
  "user": { "id": "66f0c3c0e1b2a3d4e5f60718", "name": "Rahul" }
}
```

Errors: `400` if `id` is not an ObjectId, `404` if no user. Response has no email and no password hash.

### `GET /api/kudos`

Auth: required.

Query:

| Param  | Values                      | Default |
| ------ | --------------------------- | ------- |
| `view` | `wall`, `given`, `received` | `wall`  |

- `wall`: every Kudos, newest 50
- `given`: `senderId` is the session user, newest 50
- `received`: `recipientId` is the session user, newest 50

Success `200`:

```json
{
  "kudos": [
    {
      "id": "66f0c3c0e1b2a3d4e5f60719",
      "message": "Amazing work on the latest release. Your contribution made a huge difference.",
      "template": "achievement",
      "createdAt": "2026-09-26T12:30:00.000Z",
      "sender": { "id": "66f0c3c0e1b2a3d4e5f60710", "name": "Amit" },
      "recipient": { "id": "66f0c3c0e1b2a3d4e5f60711", "name": "Priya" },
      "reactions": {
        "counts": {
          "heart": 12,
          "clap": 8,
          "fire": 4,
          "party": 6,
          "rocket": 1
        },
        "mine": ["heart", "clap"]
      }
    }
  ]
}
```

Before Phase 4, `counts` are all `0` and `mine` is `[]`. The shape does not change later.

Unknown `view`: `400`.

### `POST /api/kudos`

Auth: required.

Request:

```json
{
  "recipientId": "66f0c3c0e1b2a3d4e5f60711",
  "message": "Amazing work on the latest release. Your contribution made a huge difference.",
  "template": "achievement"
}
```

Server sets `senderId` from the session. If the body contains `senderId`, ignore it.

Checks, in order:

1. Session
2. Body schema
3. `recipientId` is an ObjectId and is not the sender
4. Recipient user exists
5. Insert

Success `201`: one Kudos object, same shape as an item in the list. Initial reaction counts are zero.

Errors:

- `400` validation, self-recipient (`fieldErrors.recipientId`: “Choose someone else.”), or unknown template
- `404` recipient does not exist
- `401` no session

### `GET /api/kudos/:id`

Auth: required. File: `app/api/kudos/[id]/route.ts`.

Success `200`: `{ "kudos": { ... } }` with the same item shape.

Errors: `400` bad id, `404` missing.

### `POST /api/kudos/:id/reactions`

Auth: required. File: `app/api/kudos/[id]/reactions/route.ts`.

Request:

```json
{ "type": "heart" }
```

Behavior:

- Kudos must exist
- `type` must be a known key
- `userId` comes from the session
- If that user already has this type on this Kudos, return the current summary (`200`)
- Otherwise insert and return the summary (`201`)
- A duplicate-key error from the unique index is treated as success and returns `200`

Success body:

```json
{
  "reactions": {
    "counts": { "heart": 13, "clap": 8, "fire": 4, "party": 6, "rocket": 1 },
    "mine": ["heart", "clap"]
  }
}
```

### `DELETE /api/kudos/:id/reactions/:type`

Auth: required. File: `app/api/kudos/[id]/reactions/[type]/route.ts`.

Deletes the session user’s reaction of that type on that Kudos. Deleting a reaction that is already gone still returns `200` and the current summary.

Errors: `400` bad id or bad type, `404` missing Kudos, `401` no session.

### Health (unchanged)

| Method | Path             | Success                             |
| ------ | ---------------- | ----------------------------------- |
| `GET`  | `/api/health`    | `{ "ok": true }`                    |
| `GET`  | `/api/health/db` | `{ "connected": true, "count": 0 }` |

---

## Auth and session

`auth.ts`:

- Provider: Credentials
- `session.strategy`: `'jwt'` (already set)
- `pages.signIn`: `'/sign-in'`
- `secret`: `getServerEnv().AUTH_SECRET` (already set)

`authorize(credentials)`:

1. Parse email and password with the sign-in schema (email + password only)
2. `connectDB()`
3. Find user by lowercase email with `passwordHash` selected
4. Verify scrypt hash
5. Return `{ id: user._id.toString(), name: user.name, email: user.email }` or `null`

Callbacks:

- `jwt`: set `token.sub` to the user id on sign-in
- `session`: set `session.user.id` from `token.sub`

Add a small module augmentation so `session.user.id` is typed as `string`.

`lib/auth/session.ts`:

```ts
requireUser(): Promise<{ id: string; name: string; email: string }>
```

Uses `auth()` from `@/auth`. Throws or returns a result the route handler turns into `401`. No database round-trip here. The id is the Mongo id stored on the JWT.

Cookie: Auth.js session cookie (`authjs.session-token`, `__Secure-authjs.session-token` in production). HttpOnly. The app does not read it manually.

`middleware.ts`:

- Keep the matcher that skips `api`, `_next/static`, `_next/image`, and `favicon.ico`
- API auth is enforced inside each route handler, not by this matcher
- Logged-out visitors to `/`, `/profile`, `/my-kudos`, and `/terms` redirect to `/sign-in`
- Logged-in visitors to `/sign-in` and `/sign-up` redirect to `/`

Sign-out uses `signOut({ callbackUrl: '/sign-in' })`. That invalidates the JWT session cookie.

---

## Security checklist

- Sender and reaction user come from the session
- Passwords stored only as scrypt hashes
- `passwordHash` excluded from every response and from default queries
- Zod on the server for every body and id
- ObjectId checked before queries
- Duplicate email returns `409`, not a Mongo dump
- `MONGODB_URI` and `AUTH_SECRET` stay in `getServerEnv()` on the server
- No role checks, because the MVP has no roles

---

## Design system

Source: `flip7-card-game-DESIGN.md`. Apply the visual language to Kudos Wall. The product name stays **Kudos Wall**. Do not render the word Flip7 in the UI.

The design file uses WeChat `rpx` on a 750-wide screen (1rpx = 0.5px). Convert with `px = rpx / 2`. Interactive targets use at least 44px, which is above the design’s 72rpx (36px) minimum and meets web tap size.

### Color tokens

Set these in `:root` inside `app/globals.css`, then map any new ones in `@theme inline`.

| Token         | Hex       | Role in Kudos Wall                                | Tailwind            |
| ------------- | --------- | ------------------------------------------------- | ------------------- |
| Primary Teal  | `#2BA8A2` | `--primary`, avatars, header mark                 | `bg-primary`        |
| Primary Light | `#3CC4BD` | `--primary-light`, hover                          | `bg-primary-light`  |
| Primary Dark  | `#1E8C86` | `--primary-dark`, text on cream, ribbon text      | `text-primary-dark` |
| Primary BG    | `#E8F6F5` | Teal tint behind highlighted areas                | `bg-primary-bg`     |
| Accent Gold   | `#FFD23F` | `--accent` and gold CTA                           | `bg-accent`         |
| Accent Light  | `#FFE47A` | Active gold tint                                  | `bg-accent-light`   |
| Accent Dark   | `#E6B800` | Gold hover and depth                              | `bg-accent-dark`    |
| Coral         | `#EF6C4A` | `--destructive`, error, warning energy            | `bg-destructive`    |
| Coral Light   | `#FF8A6A` | Soft error tint                                   | `bg-coral-light`    |
| Coral Dark    | `#D45233` | Error hover                                       | `bg-coral-dark`     |
| Cream         | `#FFF8E7` | `--input` and input surfaces                      | `bg-input`          |
| Sky Blue      | `#5DADE2` | Info only                                         | `bg-sky`            |
| Surface Base  | `#EFF8F7` | `--background` page                               | `bg-background`     |
| Surface Card  | `#FFFFFF` | `--card`                                          | `bg-card`           |
| Success       | `#27AE60` | Success text                                      | `text-success`      |
| Error         | `#E74C3C` | Inline error text if coral is not enough contrast | `text-error`        |

Foreground on gold buttons is Primary Dark `#1E8C86`, not white. Foreground on teal buttons is white `#FFFFFF`.

shadcn semantic mapping for `:root`:

| Variable                 | Value     |
| ------------------------ | --------- |
| `--background`           | `#EFF8F7` |
| `--foreground`           | `#1E8C86` |
| `--card`                 | `#FFFFFF` |
| `--card-foreground`      | `#1E8C86` |
| `--popover`              | `#FFFFFF` |
| `--popover-foreground`   | `#1E8C86` |
| `--primary`              | `#2BA8A2` |
| `--primary-foreground`   | `#FFFFFF` |
| `--secondary`            | `#E8F6F5` |
| `--secondary-foreground` | `#1E8C86` |
| `--muted`                | `#E8F6F5` |
| `--muted-foreground`     | `#1E8C86` |
| `--accent`               | `#FFD23F` |
| `--accent-foreground`    | `#1E8C86` |
| `--destructive`          | `#EF6C4A` |
| `--border`               | `#3CC4BD` |
| `--input`                | `#FFF8E7` |
| `--ring`                 | `#2BA8A2` |
| `--radius`               | `16px`    |

`.dark` reuses Flip7 colors only, so the existing theme toggle stays readable without a second palette:

| Variable                 | Value                     |
| ------------------------ | ------------------------- |
| `--background`           | `#1E8C86` (Primary Dark)  |
| `--foreground`           | `#FFF8E7` (Cream)         |
| `--card`                 | `#2BA8A2` (Primary Teal)  |
| `--card-foreground`      | `#FFF8E7`                 |
| `--popover`              | `#2BA8A2`                 |
| `--popover-foreground`   | `#FFF8E7`                 |
| `--primary`              | `#3CC4BD` (Primary Light) |
| `--primary-foreground`   | `#1E8C86`                 |
| `--secondary`            | `#1E8C86`                 |
| `--secondary-foreground` | `#FFF8E7`                 |
| `--muted`                | `#1E8C86`                 |
| `--muted-foreground`     | `#E8F6F5`                 |
| `--accent`               | `#FFD23F`                 |
| `--accent-foreground`    | `#1E8C86`                 |
| `--destructive`          | `#EF6C4A`                 |
| `--border`               | `#3CC4BD`                 |
| `--input`                | `#FFF8E7`                 |
| `--ring`                 | `#FFD23F`                 |

Gold CTA colors stay `#FFE47A` → `#FFD23F` with Primary Dark text in both themes. Inputs stay cream.

### Typography

Font family, set as `--font-sans`:

```css
-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif
```

Stop using Geist as the product face. One family only. Headlines are weight 800.

| Design step | rpx | Web size | Use                                                                |
| ----------- | --- | -------- | ------------------------------------------------------------------ |
| Display     | 72  | 36px     | Auth wordmark only                                                 |
| h1          | 48  | 24px     | Page titles                                                        |
| h2          | 36  | 18px     | Section titles                                                     |
| h3          | 32  | 16px     | Card names                                                         |
| body        | 28  | 16px     | Message text (bumped from 14px so the appreciation stays readable) |
| sm          | 24  | 14px     | Meta, dates, helper text                                           |
| xs          | 20  | 12px     | Badges only                                                        |

Headline letter-spacing: 0.04em. Ribbon letter-spacing: 0.08em. Body line length stays under 80 characters; the Kudos message column maxes out around 42rem.

### Spacing, radius, elevation

Base unit 4px (8rpx).

| Name | px  | Use             |
| ---- | --- | --------------- |
| xs   | 4   | Tight icon gaps |
| sm   | 8   | Inline padding  |
| md   | 12  | Form field gaps |
| lg   | 16  | Card padding    |
| xl   | 24  | Section gaps    |

| Radius | px  | Use                             |
| ------ | --- | ------------------------------- |
| sm     | 4   | Tiny tags                       |
| md     | 8   | Inputs that are not pills       |
| lg     | 12  | Panels                          |
| xl     | 16  | Dialogs and hero cards          |
| round  | 999 | Buttons, badges, reaction chips |

Shadows, as CSS variables:

| Name                   | Value                              | Use                                           |
| ---------------------- | ---------------------------------- | --------------------------------------------- |
| `--shadow-sm`          | `0 1px 4px rgb(0 0 0 / 8%)`        | Resting meta                                  |
| `--shadow-md`          | `0 2px 8px rgb(0 0 0 / 12%)`       | Menus                                         |
| `--shadow-lg`          | `0 4px 16px rgb(0 0 0 / 16%)`      | Dialog                                        |
| `--shadow-card`        | `0 2px 10px rgb(43 168 162 / 10%)` | Kudos cards                                   |
| `--shadow-coral-glow`  | `0 2px 10px rgb(239 108 74 / 35%)` | Error emphasis                                |
| `--shadow-teal-glow`   | `0 2px 10px rgb(43 168 162 / 30%)` | Achievement card                              |
| `--shadow-accent-glow` | `0 2px 10px rgb(255 210 63 / 40%)` | Gold CTA and Celebration card                 |
| `--shadow-sky-glow`    | `0 2px 8px rgb(93 173 226 / 30%)`  | Unused in MVP except if an info alert appears |
| `--shadow-focus`       | `0 0 0 2px rgb(43 168 162 / 15%)`  | Keyboard focus, plus the existing ring        |

Interactive elements use a colored glow, not a plain black drop shadow.

### Components in this product

**Wordmark (auth pages and header)**

- A cream parallelogram (skew about -6deg) with a 1.5px Primary Dark border
- Text “Kudos Wall”, extra-bold, Primary Dark, slight -3deg rotation on the group
- A short cream ribbon under it on the auth pages only, extra-bold, letter-spacing 0.08em, text such as “Recognize someone”
- Five small fanned rectangles behind the auth wordmark only, rotations -24, -12, 0, 12, 24 degrees, colors teal, gold, coral, sky, cream. Decorative, `aria-hidden`
- Header on the wall uses the wordmark without the fan, so the wall stays about the messages

**Buttons**

- Pill radius, min height 44px
- Primary action (Sign up, Sign in, Create Kudos, publish): gold gradient from `#FFE47A` to `#FFD23F`, text Primary Dark, gloss is a CSS highlight, shadow `--shadow-accent-glow`, active `scale(0.95)`
- Secondary: teal outline on cream, no black shadow
- Press transition under 200ms
- Respect `prefers-reduced-motion`

**Inputs**

- Surface cream `#FFF8E7`
- Radius 8px for fields, not full pill (pills are for buttons)
- Focus ring `--shadow-focus`
- Error border coral, error text under the field

**Kudos card**

- White surface, 12px radius, `--shadow-card`, 3px left accent
- Celebration: gold accent and gold glow
- Achievement: teal accent and teal glow
- Order inside the card: template badge, “Sender → Recipient”, message as the largest text, date, reaction row
- Message is the visual focus

**Section titles**

- Emoji in its own span for alignment, then the title
- 1.5px dashed bottom border in Primary Light

**Reaction chips**

- Pill, min 44px tall, count next to the emoji
- Unselected: cream surface, teal text
- Selected: teal fill, white text, `--shadow-teal-glow`
- Toggle is the micro-interaction

**Dialog**

- Radius 16px, page-surface border, `--shadow-lg`
- Desktop: preview left, form right, two columns
- Under 768px: one column, preview first, form second, dialog scrolls inside the viewport

**Profile menu**

- Existing `DropdownMenu`, cream panel, teal text, gold hover tint

### Screen wireframes

Auth, centered, max 24rem:

```
        [ fanned cards ]
        [ Kudos Wall  ]
        [ ribbon      ]

        Create your account
        Name
        Email
        Password
        Confirm password
        [ Sign up ]

        Already have an account? Sign in
```

Sign in is the same shell. Title “Welcome back”. Link “Don’t have an account? Sign up”.

Wall:

```
[ Kudos Wall ]     [ Create Kudos ]     [ Kishan ]

🎉 Achievement
Amit → Priya
"Amazing work on the latest release."
Sep 26, 2026
[ ❤️ 12 ] [ 👏 8 ] [ 🔥 4 ] [ 🎉 6 ] [ 🚀 1 ]
```

Empty wall: dashed section, one sentence, gold Create Kudos button.

Create dialog:

```
Create Kudos

[ live preview card ]    Give Kudos to
                         [ Select employee ]

                         Message
                         [ textarea ]

                         Template
                         [ Celebration | Achievement ]

                         [ Create Kudos ]
```

Preview starts as a card that reads “Select a teammate” and “Write a message”. It updates as the form changes. Publishing is the only save.

My Kudos: two stacked sections, “Kudos given” and “Kudos received”, same card, dashed titles.

My Profile: one card, name and email, no edit controls.

Terms: one column of static sections, dashed titles, no CMS.

### Copy

| Moment                      | Text                                            |
| --------------------------- | ----------------------------------------------- |
| Sign up title               | Create your account                             |
| Sign up button              | Sign up                                         |
| Sign in title               | Welcome back                                    |
| Sign in button              | Sign in                                         |
| Sign in link                | Don’t have an account? Sign up                  |
| Sign up link                | Already have an account? Sign in                |
| Wall empty                  | No Kudos yet. Recognize a teammate.             |
| Create button               | Create Kudos                                    |
| Publish button              | Create Kudos                                    |
| Recipient label             | Give Kudos to                                   |
| Recipient empty             | No other teammates yet. Invite them to sign up. |
| Self recipient              | Choose someone else.                            |
| Preview name placeholder    | Select a teammate                               |
| Preview message placeholder | Write a message                                 |
| Given empty                 | You have not given Kudos yet.                   |
| Received empty              | You have not received Kudos yet.                |
| Sign out                    | Sign out                                        |
| Generic error               | Something went wrong. Try again.                |
| Bad sign in                 | Email or password is incorrect.                 |

---

## File map

### Modify

- `auth.ts` — database authorize, JWT callbacks, sign-in page
- `middleware.ts` — redirect rules above
- `app/globals.css` — Flip7 tokens, shadows, font stack
- `app/layout.tsx` — metadata title `Kudos Wall`, drop Geist as the primary face, keep providers and footer
- `app/page.tsx` — Kudos Wall
- `components/layout/header.tsx` — wordmark, Create Kudos, profile menu
- `tests/e2e/homepage.spec.ts` — expect Kudos Wall instead of the starter (Phase 6, or as soon as the homepage changes)

### Leave in place

- `lib/db.ts`, `lib/env.ts`, `lib/utils.ts`
- `app/api/health/route.ts`, `app/api/health/db/route.ts`
- `models/Placeholder.ts`
- `components/layout/footer.tsx`, `components/theme-toggle.tsx`, `components/theme-provider.tsx`
- `components/providers/session-provider.tsx`
- CI, Husky, Prettier, ESLint

### Create

```
models/User.ts
models/Kudos.ts
models/Reaction.ts

lib/auth/password.ts
lib/auth/session.ts
lib/validators/auth.ts
lib/validators/kudos.ts
lib/validators/reaction.ts
lib/kudos/templates.ts
lib/kudos/reactions.ts
lib/kudos/serialize.ts
lib/api/errors.ts

types/next-auth.d.ts

app/sign-in/page.tsx
app/sign-up/page.tsx
app/profile/page.tsx
app/my-kudos/page.tsx
app/terms/page.tsx

app/api/auth/signup/route.ts
app/api/users/route.ts
app/api/users/me/route.ts
app/api/users/[id]/route.ts
app/api/kudos/route.ts
app/api/kudos/[id]/route.ts
app/api/kudos/[id]/reactions/route.ts
app/api/kudos/[id]/reactions/[type]/route.ts

components/auth/sign-in-form.tsx
components/auth/sign-up-form.tsx
components/auth/auth-shell.tsx
components/kudos/kudos-wall.tsx
components/kudos/kudos-card.tsx
components/kudos/kudos-preview.tsx
components/kudos/create-kudos-dialog.tsx
components/kudos/reaction-bar.tsx
components/layout/profile-menu.tsx
components/layout/wordmark.tsx

tests/unit/validators.test.ts
tests/unit/password.test.ts
```

`lib/kudos/serialize.ts` turns documents into the JSON shapes in this plan. Route handlers use it so responses stay consistent.

UI components added with the shadcn CLI, not hand-copied from memory: `input`, `textarea`, `field`, `card`, `dialog`, `select`, `avatar`, `badge`, `empty`, `skeleton`, `separator`, `spinner`, `toggle-group`.

---

## Phase 1 — Authentication

### Backend

- [x] `models/User.ts` with the fields, unique email index, and `passwordHash` select false
- [x] `lib/auth/password.ts` hash and verify using the scrypt format above
- [x] `lib/validators/auth.ts` signup and sign-in schemas
- [x] `lib/api/errors.ts`
- [x] `POST /api/auth/signup` returns `201` and the public user, `409` on duplicate email
- [x] `auth.ts` `authorize()` loads the user and checks the hash. Wrong password returns `null`
- [x] JWT and session callbacks expose `session.user.id`
- [x] `types/next-auth.d.ts` types `session.user.id`
- [x] `lib/auth/session.ts` `requireUser()`
- [x] `middleware.ts` protects `/`, `/profile`, `/my-kudos`, `/terms` and bounces signed-in users away from the auth pages

### Frontend

- [x] Apply Flip7 tokens in `app/globals.css` and the font stack, so auth screens are not the default neutral theme
- [x] `components/layout/wordmark.tsx` and `components/auth/auth-shell.tsx` (fan, parallelogram, ribbon)
- [x] Add shadcn `input`, `field`, `button` variants only if the gold pill cannot be a `className` layout wrapper. Prefer a `variant` if we extend the existing button; otherwise a dedicated gold class in the shell that still uses `Button`
- [x] `/sign-up` form: name, email, password, confirm password, Sign up
- [x] Client validation with the shared Zod schema, `data-invalid` / `aria-invalid`, spinner while submitting
- [x] Success goes to `/sign-in`
- [x] `/sign-in` form: email, password, Sign in, link to sign up
- [x] `signIn('credentials', { redirect: false })`. Success goes to `/`. Failure shows “Email or password is incorrect.”
- [x] `/` for this phase is a protected placeholder that shows the session user’s name, so the session is proven before the wall UI exists
- [x] Metadata title becomes Kudos Wall

### Done when

- [x] New account is stored with a scrypt hash, not a plain password
- [x] The same email cannot register twice, and the UI shows the duplicate message
- [x] Valid sign-in opens a session and reaches `/`
- [x] Invalid sign-in stays on the form with the safe message
- [x] Signed-out visit to `/` redirects to `/sign-in`
- [x] Sign-out clears access to `/`

---

## Phase 2 — Dashboard shell

### Backend

- [ ] `GET /api/users/me`
- [ ] `GET /api/kudos` returns `{ kudos: [] }` until Phase 3 writes rows, already in the final JSON shape

### Frontend

- [ ] Replace `app/page.tsx` with the wall page. Server component loads the session and the initial list
- [ ] Header: wordmark, gold Create Kudos button (rendered, disabled until Phase 3), profile control with name and avatar fallback
- [ ] Profile menu: My Profile, My Kudos, Terms & Conditions, Sign out
- [ ] `/profile`, `/my-kudos`, and `/terms` exist as simple titled pages so the links resolve
- [ ] Wall states: `Skeleton` while loading, error message with retry, `Empty` state “No Kudos yet. Recognize a teammate.”
- [ ] Header wraps cleanly under 768px. Menu remains usable
- [ ] Theme toggle stays in the header

### Done when

- [ ] Signed-in user sees the empty wall, their name, and can open the menu
- [ ] Sign out returns to `/sign-in` and `/` is blocked

---

## Phase 3 — Create Kudos

### Backend

- [ ] `models/Kudos.ts` and indexes
- [ ] `lib/kudos/templates.ts`, `lib/validators/kudos.ts`, `lib/kudos/serialize.ts`
- [ ] `GET /api/users` for the dropdown
- [ ] `GET /api/users/[id]`
- [ ] `POST /api/kudos` with server-side sender, self-recipient rejection, and recipient existence check
- [ ] `GET /api/kudos` returns the newest 50 for `wall`, `given`, and `received`
- [ ] `GET /api/kudos/[id]`
- [ ] Reaction block on each item is zeros and an empty `mine` array

### Frontend

- [ ] Enable Create Kudos. It opens a `Dialog` with `DialogTitle` “Create Kudos”
- [ ] Desktop two columns. Under 768px, preview then form, scroll locked to the dialog
- [ ] Recipient `Select` populated from `GET /api/users`. No free-text name
- [ ] Message `Textarea`
- [ ] Template `ToggleGroup` with Celebration and Achievement
- [ ] Live preview uses `kudos-preview.tsx` and the same card visuals as the wall
- [ ] Submit validates, disables the button, shows `Spinner`, then closes and resets
- [ ] Wall shows the new card without a manual browser refresh
- [ ] Card shows template, sender → recipient, message, and date. Reaction row can render disabled until Phase 4

### Done when

- [ ] Signed-in user can select someone else, write a message, pick a template, watch the preview, publish, and see the card on the wall
- [ ] Logged-out `POST /api/kudos` returns `401`
- [ ] Self-recipient and unknown template are rejected
- [ ] A document in `kudos` has `senderId`, `recipientId`, `message`, `template`, `createdAt`

---

## Phase 4 — Reactions

### Backend

- [ ] `models/Reaction.ts` and the unique index
- [ ] `lib/kudos/reactions.ts` and `lib/validators/reaction.ts`
- [ ] `POST /api/kudos/[id]/reactions`
- [ ] `DELETE /api/kudos/[id]/reactions/[type]`
- [ ] List and detail responses fill `reactions.counts` and `reactions.mine` from one reaction query per page

### Frontend

- [ ] `reaction-bar.tsx` on each card: five chips, emoji, count, accessible name
- [ ] Click adds. Click again removes. Other types on that card stay
- [ ] Selected style follows `mine`
- [ ] Chip disables while its own request is in flight
- [ ] Counts update from the response

### Done when

- [ ] One user can add heart, clap, and fire on the same Kudos
- [ ] Removing heart decreases that count only
- [ ] A second identical heart does not increase the count
- [ ] Logged-out reaction calls return `401`

---

## Phase 5 — Profile pages

### Backend

- [ ] No new collections. My Profile uses `GET /api/users/me`
- [ ] My Kudos uses `GET /api/kudos?view=given` and `view=received`

### Frontend

- [ ] My Profile shows name and email only
- [ ] My Kudos has two dashed sections and reuses `kudos-card.tsx`, including reactions
- [ ] Each list has its own empty copy from the table above
- [ ] Terms is static copy: a short acceptance-of-use page for Kudos Wall (be kind, no harassment, the company may remove Kudos that break that standard). No editor
- [ ] Menu links land on these pages

### Done when

- [ ] Menu reaches My Profile, My Kudos, Terms, and Sign out
- [ ] Given and received are separate
- [ ] Profile has no edit form

---

## Phase 6 — Polish and critical tests

### Backend

- [ ] Every authenticated handler uses `requireUser()` before queries
- [ ] No response includes `passwordHash` or a raw Mongo error
- [ ] Create Kudos cannot be aimed at another sender

### Frontend

- [ ] Loading, empty, and error states checked on the wall, dialog, profile, and My Kudos
- [ ] Dialog, select, menu, and reaction chips work from the keyboard
- [ ] Focus rings use `--shadow-focus`
- [ ] Layout checked at desktop width and at 375px wide
- [ ] `prefers-reduced-motion` disables the button scale
- [ ] Gold text on gold, and cream text on teal, meet contrast for body copy

### Tests

Unit, no database:

- [ ] `tests/unit/password.test.ts` — hash verifies, wrong password fails, stored value is not the plain password
- [ ] `tests/unit/validators.test.ts` — email, short password, missing number, confirm mismatch, message length, template, reaction type, ObjectId

Route or integration checks if MongoDB from `.env.local` or the local fallback is reachable. Skip the suite with a clear message if it is not. Do not add `mongodb-memory-server`.

- [ ] Signup valid, duplicate email, bad email
- [ ] Sign-in valid and invalid
- [ ] Authenticated create, unauthenticated create rejected, recipient must exist, self rejected, bad template rejected
- [ ] Add two reaction types, toggle one off, duplicate identical reaction stays at count 1

Playwright, one path, update `tests/e2e/homepage.spec.ts`:

- [ ] Signed-out `/` redirects to sign in
- [ ] Sign up, sign in, empty wall is visible

Do not build a large end-to-end matrix in this phase.

### Done when

- [ ] The success flow below works
- [ ] `npm run typecheck` and `npm run test:unit` pass
- [ ] Phase checkboxes above are ticked

---

## Definition of success

```
Sign up
  → account created (password hashed)
  → Sign in
  → Kudos Wall

Create Kudos
  → select employee
  → write message
  → select template
  → live preview
  → Create Kudos
  → saved in MongoDB collection kudos
  → card appears on the wall

Second user
  → sees the Kudos
  → reacts with heart
  → reacts with clap
  → counts update
  → toggling heart removes it

Profile menu
  → My Profile
  → My Kudos (given and received)
  → Terms & Conditions
  → Sign out
```

---

## Implementation order reminder

Phase 1 → review → Phase 2 → review → Phase 3 → review → Phase 4 → review → Phase 5 → review → Phase 6.

Do not build later phases early. A disabled Create Kudos button in Phase 2 is intentional. Zero reaction counts before Phase 4 are intentional.
