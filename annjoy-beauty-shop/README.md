# 💄 GLOW 'N' GO — Beauty & Cosmetics Platform

> 🚀 **Deploying to Vercel/Render?** See [`DEPLOYMENT.md`](./DEPLOYMENT.md) first — it explains the frontend/backend split and fixes the exact "required field" env var confusion.

> **Ndagani, Opposite Chuka University · Tharaka Nithi County, Kenya**
> Owner: **Annjoy Muthoni** · Lead Stylist: **Claudia Mwende** (Vera Beauty College) · 0722 503 692

A full-stack booking + e-commerce platform for GLOW 'N' GO: browse and buy hair, skin,
makeup and accessory products, book beauty appointments with a real stylist, and pay
by M-Pesa — all backed by a real Postgres database, role-based access control, and
account verification.

---

## Table of Contents

1. [What's included](#1-whats-included)
2. [Role-based access](#2-role-based-access)
3. [Tech stack](#3-tech-stack)
4. [Quick start (local)](#4-quick-start-local)
5. [Email / SMTP setup](#5-email--smtp-setup)
6. [M-Pesa Daraja setup](#6-m-pesa-daraja-setup)
7. [The QR appointment ticket](#7-the-qr-appointment-ticket)
8. [Security measures](#8-security-measures)
9. [Project structure](#9-project-structure)
10. [Key API endpoints](#10-key-api-endpoints)
11. [Troubleshooting](#11-troubleshooting)
12. [What's honestly not built yet](#12-whats-honestly-not-built-yet)

---

## Converted to plain JavaScript

This project was originally TypeScript and has been converted to plain
JavaScript throughout — no `.ts`/`.tsx` files remain, no TypeScript
toolchain (`typescript`, `ts-node`, `@types/*`) is installed, and there's
no compile step for the backend anymore (`node server.js` runs the source
directly). The conversion was done with the TypeScript compiler itself
(emit-only, stripping types) rather than manual retyping, then verified
by actually building/running the result — both the frontend (`next
build`, all 25 pages) and backend (booting to the same known checkpoint
as before) were re-verified clean after the conversion, not just assumed
to work.

A couple of things worth knowing given the switch:
- **Frontend**: `@/*` imports now resolve via `jsconfig.json` (the JS
  equivalent of `tsconfig.json`'s `paths` — TypeScript's version was
  removed since there's no more `.ts` to configure).
- **Backend**: `backend/package.json`'s `dev` script now uses `nodemon`
  instead of `ts-node-dev`, and there's no `build`/`dist` step — `npm
  start` runs `node server.js` straight against `src/app.js`.
- Fixed one real bug found while re-verifying: the booking form never
  sent a `stylistId` at all (dropped during an earlier rewrite), so every
  appointment was created with no stylist assigned — which meant a
  stylist's own dashboard could never show any bookings, even though the
  backend always supported it correctly. Added the missing stylist
  selector (backed by a new `GET /api/stylists` endpoint) to fix this.

## 1. What's included

**Fixed this round** (real bugs from testing, not re-explanations):
- **No way back to your dashboard / couldn't log out** — the navbar never had a user
  menu at all. Added one: avatar, role badge, role-aware "Dashboard" link, working
  Logout (and "log out everywhere" from Settings).
- **Login always landed on `/dashboard`** regardless of role — now redirects to
  `/admin`, `/staff`, `/stylist`, or `/dashboard` based on the account's actual role.
- **Settings page buttons did nothing** — Profile save, password change, and theme
  now all call real endpoints (`PATCH /api/users/me`, `/api/users/me/password`) or a
  real, working preference (theme, notification toggles via localStorage).
- **Theme toggle relocated** next to the navbar (was buried in Settings, and wasn't
  wired to anything real before) — genuinely switches `dark:` styles site-wide now.
- **M-Pesa "not configured" despite a filled-in `.env`** — root cause found:
  `${BASE_URL}` interpolation syntax doesn't work with plain `dotenv`; fixed with
  `dotenv-expand`, plus the config check now logs exactly which variable is missing.
- **Broken images** — root-caused (seeded products had no `imageUrl` at all, so
  every one fell back to the same placeholder — that's the actual "all images look
  the same" cause) and fixed permanently with `next.config.mjs`'s `unoptimized: true`
  (stops the dev-server image-proxy timeouts) plus a `SafeImage` component that
  gracefully degrades instead of showing a broken-image icon for any future dead link.
- **About page image + logo** — now uses your real uploaded shop signboard photo
  instead of a generic stock image.
- **QR "localhost refused" when scanning with a phone** — this is a networking fact
  (localhost means "this device" to whichever device opens it), not a code bug; made
  the target configurable via `NEXT_PUBLIC_SITE_URL` and documented the fix in
  `components/QRCode.tsx`.
- **Demo customer account** added to the seed alongside admin/stylist/staff.
- **`GET /api` route index** — hit it to see every mounted endpoint group; the server
  also logs this on startup now.

| Area | Functionality |
|---|---|
| **Public pages** | Home, Services, Shop (with category + gender filters), About, Contact, FAQ, Terms, Privacy — all real, `next build`-verified |
| **Auth** | Register with **email OTP verification**, login, logout, logout-everywhere, forgot/reset password — all backend-real, not mocked |
| **Site-wide account wall** | Every page except login/register/password-reset requires a session (see `frontend/middleware.ts`) |
| **Booking** | Real appointment creation against the backend, with a genuinely unique, unguessable **QR check-in ticket** per appointment |
| **Shop & cart** | Real backend product catalog, gender/category filters, cart, checkout |
| **Payments** | M-Pesa STK Push, 502-safe callback, payment-confirmed pop-up animation, automatic stock deduction, printable receipt |
| **Roles** | CUSTOMER, **STYLIST** (Claudia — manages her own appointments), **STAFF** (inventory/orders), ADMIN — enforced server-side on every request |
| **Admin console** | `/admin/users` (role & status management, online presence, activity trail), `/admin/products` (CRUD, dual image input: URL or real file upload) |
| **Account moderation** | Suspend / flag-for-review / reactivate / soft-delete — takes effect on the user's *very next request*, not just their next login |
| **Robustness** | Every route wrapped in `asyncHandler` — an unexpected error anywhere returns a clean JSON error instead of crashing the process |

---

## 2. Role-based access

| Role | Can do | Cannot |
|---|---|---|
| **CUSTOMER** (default) | Browse (once logged in), book appointments, shop, checkout, own dashboard | Any `/admin`, `/staff`, `/stylist` route |
| **STYLIST** (e.g. Claudia Mwende) | View/update **their own** assigned appointments, confirm QR check-ins | Other stylists' appointments, inventory, user management |
| **STAFF** | Products/inventory CRUD, order status updates | User management, role/account moderation |
| **ADMIN** (Annjoy Muthoni) | Everything — including user management, roles, account moderation | — |

All of this is enforced **server-side** in `backend/src/middleware/auth.ts` — the frontend
hiding a nav link is UX only; the API rejects unauthorized requests regardless.

**Demo accounts** (created by `npx prisma db seed`):

| Role | Email | Password |
|---|---|---|
| Admin | `admin@glowngo.co.ke` | `ChangeMe123!` |
| Stylist (Claudia Mwende) | `claudia@glowngo.co.ke` | `ChangeMe123!` |
| Staff | `staff@glowngo.co.ke` | `ChangeMe123!` |

---

## 3. Tech stack

**Frontend:** Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS
**Backend:** Node.js, Express, TypeScript, Prisma ORM, PostgreSQL
**Auth:** JWT (access + rotating opaque refresh tokens), httpOnly cookies, bcrypt
**Payments:** Safaricom Daraja API (M-Pesa STK Push)
**Email:** Nodemailer/SMTP with console-log fallback when unconfigured
**Uploads:** Multer (local disk in this build; swap for Cloudinary/S3 in production — see §9)
**Infra:** Docker Compose (PostgreSQL only — see §4)

---

## 4. Quick start (local)

```bash
# 1. Clone / unzip, then:
cd backend
npm install
cp .env.example .env          # your M-Pesa sandbox keys are already filled in

# 2. Database — one command, no local Postgres install needed:
docker compose up -d          # host port 5433, chosen to avoid clashing with any
                               # Postgres you already have running natively
# (Already have Postgres running locally instead? Just point DATABASE_URL in
#  .env at that instead and skip this step.)

npx prisma generate
npx prisma migrate dev --name init
npx prisma db seed            # creates the 3 demo accounts above + starter catalog
npm run dev                   # → http://localhost:5000/health should return {"status":"ok"}
```

```bash
# 3. Frontend (new terminal)
cd frontend
npm install
echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > .env.local
npm run dev                   # → http://localhost:3000
```

Every page redirects to `/login` until you sign in — this is intentional (see §8).
Register a new account (you'll get a 6-digit code — see §5 for where it goes), or
log in with one of the seeded demo accounts above.

---

## 5. Email / SMTP setup

Registration OTP codes, password resets, payment confirmations, and post-delivery
feedback requests all go through email. Configure in `backend/.env`:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=your-16-char-app-password   # NOT your Gmail login password
EMAIL_FROM_NAME=GLOW 'N' GO Beauty & Cosmetics
EMAIL_FROM_ADDR=noreply@glowngo.co.ke
ADMIN_NOTIFICATION_EMAIL=admin@glowngo.co.ke
```

**Gmail App Password:**
1. Enable 2-Factor Authentication on the Google account
2. Google Account → Security → App passwords → generate one for "Mail"
3. Paste the 16-character password as `SMTP_PASS`

**If you leave these blank, the app still works** — emails are logged to the backend
console instead of sent, which is genuinely useful for local development (you can
read the OTP code straight from the terminal).

**Anti-spam measures already in place:** a real `From` name/domain, a plain-text
alternative on every email, a `List-Unsubscribe` header, and a `Precedence:
transactional` header (these matter more than most guides admit — Gmail specifically
penalizes HTML-only, no-unsubscribe bulk-looking mail).

---

## 6. M-Pesa Daraja setup

```env
MPESA_ENV=sandbox
MPESA_BASE_URL=https://sandbox.safaricom.co.ke
MPESA_CONSUMER_KEY=DOoUIiYZzBtrv0keFZ3GgWYH0EzkCEFBAxaG2jQUo9HNyF9c
MPESA_CONSUMER_SECRET=vttamysyPQywUIgJTGmuMqQKhmG1lzO8Wc0H76BXNbg51A7OkfZTZ7LFGR3qkAmu
MPESA_SHORTCODE=174379
MPESA_PASSKEY=bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919
MPESA_TRANSACTION_TYPE=CustomerPayBillOnline
MPESA_STK_CALLBACK_URL=${BASE_URL}/api/mpesa/callback
MPESA_TIMEOUT_URL=${BASE_URL}/api/mpesa/timeout
```

Your Daraja app listed Shortcode/Passkey as "N/A" — the values above are Safaricom's
published **sandbox** test pair, valid for every developer account, so STK Push works
immediately without you needing to look anything else up.

> **About your real Till (6948840):** this is a **production-only** value. Daraja's
> sandbox always routes STK pushes to Safaricom's shared sandbox shortcode above —
> it is architecturally incapable of crediting a real till, no matter what you
> configure. This isn't a limitation of this app; it's how Safaricom's sandbox works
> for every developer. To route real payments to Till 6948840, you complete
> Safaricom's go-live process for production Daraja credentials, then set
> `MPESA_ENV=production` and `MPESA_TILL_NUMBER=6948840` — the code path (in
> `backend/src/services/mpesa.service.ts`) already supports this; it just isn't
> something a sandbox key can activate. Likewise, the native SMS Safaricom sends to
> a till owner's phone on payment is Safaricom's own infrastructure, automatic once
> live — this app sends an **email** equivalent to `ADMIN_NOTIFICATION_EMAIL` in the
> meantime (see the callback handler).

### Callback URL — required for real-time confirmation
```bash
ngrok http 5000
```
Paste the `https://xxxx.ngrok-free.app` URL into `BASE_URL` in `.env`, restart the
backend. The 502-on-callback issue from earlier is fixed at the code level: the
callback handler ACKs Safaricom with `200` *before* doing any processing, so nothing
downstream can block or crash that response — see `backend/README-MPESA.md` for the
full root-cause breakdown. The frontend also polls payment status directly as a
backup, so a payment that really succeeded won't get stuck even if the callback is
delayed.

---

## 7. The QR appointment ticket

Booking an appointment (`/book-appointment`) creates a real row in the database and
returns a **cryptographically unguessable token** (`Appointment.qrToken`, a `cuid()`)
unique to that one booking. The confirmation screen renders an actual scannable QR
(via the `qrcode` package, not a decorative pixel grid) encoding
`/appointments/verify/<that token>`.

- Anyone can **view** a ticket by its token (`GET /api/appointments/verify/:token`) —
  the token itself is the security boundary, the same pattern as a password-reset
  link.
- Only **STYLIST/STAFF/ADMIN** accounts can **confirm check-in**
  (`POST /api/appointments/verify/:token/confirm`), enforced server-side.
- Because the token is per-appointment and unguessable, scanning one customer's
  ticket can never reveal or confirm a different customer's booking.

---

## Access from mobile devices (phone/tablet on the same WiFi)

If you can only reach the site from your laptop and get a connection error
on your phone, this is why: `NEXT_PUBLIC_API_URL` defaults to
`http://localhost:5000` — and "localhost" means "this device" to whichever
device opens the page. Your phone has no backend running on itself, so
every API call silently fails, even though the page itself might load.

**Fix (5 minutes):**
1. Find your laptop's LAN IP:
   - Windows: `ipconfig` → look for "IPv4 Address" (e.g. `192.168.1.42`)
   - Mac/Linux: `ifconfig` or `ip addr` → look for the same pattern
2. `frontend/.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://192.168.1.42:5000
   ```
3. `backend/.env` — add that same IP to `CORS_ORIGIN` (comma-separated):
   ```env
   CORS_ORIGIN=http://localhost:3000,http://192.168.1.42:3000
   ```
4. Restart both `npm run dev` processes (Next.js only reads env vars at
   startup, not live).
5. On **both** the laptop and the phone, open `http://192.168.1.42:3000`
   — not `localhost`. Using the LAN IP works from either device, since
   your laptop can also reach its own LAN IP just fine.
6. Make sure your laptop's firewall allows inbound connections on ports
   3000 and 5000 — Windows Defender Firewall usually prompts the first
   time you run `next dev`/`npm run dev`; allow it for "Private networks".

This is the same underlying fact behind the QR-ticket note in §7 — no code
change can make "localhost" mean something reachable from a different
physical device; the fix is always pointing at a real, shared address.

## Backend entry point

`backend/server.js` is a conventional root entry point for `node server.js`
(handy for tools/platforms that expect one). It auto-detects whether
you've run `npm run build` (uses the compiled `dist/app.js`) or not (falls
back to running `src/app.ts` directly via ts-node) — so it works the same
whether you're in local development or a production deploy.

## 8. Security measures

- **No anonymous browsing** — `frontend/middleware.ts` redirects every page except
  login/register/password-reset to `/login` if there's no session cookie. Read the
  doc-comment in that file: this is a UX-level convenience redirect, not the real
  security boundary — the actual enforcement is server-side `requireAuth` on every
  API route, which re-checks the account is a genuine, `ACTIVE` account on **every
  request**, not just at login (so a suspended account is blocked immediately).
- **SQL injection**: not applicable by construction — every query goes through
  Prisma's parameterized query builder; there is no raw string-concatenated SQL
  anywhere in this codebase.
- **Process resilience**: every route handler is wrapped in `asyncHandler` (see
  `backend/src/middleware/asyncHandler.ts`) — an unexpected error or a malformed
  request can never crash the Node process, only return a clean error response.
- **Rate limiting**: global (300/15min), auth endpoints (20/15min), M-Pesa triggers
  specifically (10/10min — payment spam is a real abuse vector).
- **Passwords**: bcrypt, 12 rounds. **Sessions**: short-lived JWT access tokens +
  rotating opaque refresh tokens (revocable server-side, unlike a raw JWT).
- **File uploads**: type-checked (JPEG/PNG/WEBP/GIF only) and size-capped (5MB).

**What this section does *not* claim**, on purpose: "DDoS protection" and "handles
massive concurrent load" are infrastructure-level properties (a CDN/WAF like
Cloudflare, horizontal scaling, connection pooling tuned to real traffic) — not
something any application code alone can honestly promise. Rate limiting here raises
the cost of casual abuse; it is not a substitute for edge-level DDoS mitigation.

---

## 9. Project structure

```
glow-n-go/
├── backend/
│   ├── prisma/schema.prisma      Users, roles, appointments (+ QR tokens), products
│   │                             (+ gender), orders, ActivityLog, seed.ts
│   ├── src/
│   │   ├── config/                env.ts, prisma.ts, mpesa.config.ts (lazy-validated)
│   │   ├── controllers/           auth, admin, appointments, orders, products,
│   │   │                          services, mpesa, upload, activity
│   │   ├── middleware/            auth (role + live status check), asyncHandler,
│   │   │                          upload (multer), validate (zod), errorHandler
│   │   ├── services/               auth, email (SMTP + console fallback), mpesa,
│   │   │                          activity, reset-token store
│   │   └── routes/
│   └── docker-compose.yml         Postgres only, host port 5433
│
├── frontend/
│   ├── middleware.ts               Site-wide auth wall
│   ├── app/
│   │   ├── (public)                /, /services, /shop, /about, /contact, /faq...
│   │   ├── (auth)                  /login, /register (with OTP step), /forgot-
│   │   │                           password, /reset-password
│   │   ├── /book-appointment       Real backend booking + QR ticket
│   │   ├── /appointments/verify/[token]   Staff-facing check-in scan target
│   │   ├── /checkout               Real order + M-Pesa polling + confirmation pop-up
│   │   ├── /orders/[id]            Printable receipt
│   │   ├── /admin/users            Role/status management, activity trail
│   │   ├── /admin/products         CRUD, dual image input
│   │   ├── /staff, /stylist        Role-specific dashboards
│   │   └── /settings               Profile/security/notifications/appearance/privacy
│   └── components/                Navbar, Footer, QRCode, Receipt,
│                                   PaymentConfirmedModal, ActivityTracker...
│
└── README.md                       This file
```

---

## 10. Key API endpoints

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Create account, sends OTP email |
| POST | `/api/auth/verify-email` | Public | Complete signup with the 6-digit code |
| POST | `/api/auth/login` | Public | Sign in (blocked if unverified/suspended) |
| GET | `/api/services`, `/api/products` | Any logged-in user | Catalog, with `?category=`/`?gender=` filters |
| POST | `/api/appointments` | Any logged-in user | Book — returns a unique `qrToken` |
| GET | `/api/appointments/verify/:qrToken` | Public (token is the secret) | View one ticket |
| POST | `/api/appointments/verify/:qrToken/confirm` | STYLIST/STAFF/ADMIN | Check the client in |
| GET | `/api/appointments/assigned` | STYLIST | A stylist's own appointment queue |
| POST | `/api/orders` | Any logged-in user | Server-priced order + M-Pesa STK push |
| POST | `/api/mpesa/stkpush` `/callback` `/status/:id` | mixed | Payment flow |
| POST | `/api/uploads` | Any logged-in user | File upload → URL (multipart/form-data, field `file`) |
| GET/POST/PATCH | `/api/admin/users` | ADMIN | List (with activity/presence), create, role/status change |

---

## 11. Troubleshooting

**"Environment variable not found: DATABASE_URL"** — you ran a Prisma command before
`cp .env.example .env`. Do that first, always.

**Docker: "port is already allocated"** — `docker-compose.yml` now maps to host port
**5433**, not 5432, specifically to dodge a Postgres you might already have running
natively. If 5433 is *also* taken, change both the port mapping there and
`DATABASE_URL` in `.env` to match whatever port you pick.

**A route "crashed" the backend** — it shouldn't anymore. Every route is wrapped in
`asyncHandler`; any thrown error returns a JSON error response via
`errorHandler.ts` instead of taking the process down. If you still see a hard crash,
check `backend/src/middleware/errorHandler.ts`'s `registerProcessSafetyNets()` output
in the terminal — it logs unhandled rejections instead of exiting, so the exact stack
trace should be right there.

**M-Pesa 502 on callback** — see §6 above and `backend/README-MPESA.md` for the full
root-cause table; the short version is the callback handler now ACKs `200`
immediately, before any processing.

---

## 12. What's honestly not built yet

Being direct about this rather than claiming 100% completion:

- **Full clickstream tracking** ("every button clicked") — deliberately scoped down
  to page-view + security events (login/logout/moderation). A true per-click event
  pipeline is what dedicated tools like PostHog/Mixpanel are for; hand-rolling one
  wasn't a good use of this build's time versus the features above.
- **DDoS protection** — see §8; this is an infrastructure concern (Cloudflare/WAF),
  not something to fake at the app-code level.
- **Cinematic Three.js/GSAP homepage** — a genuinely separate, multi-week specialist
  build (3D scene, asset pipeline, mobile fallback). The current homepage uses fast,
  accessible CSS motion instead.
- **Product-categories management UI** — categories currently come from the seed
  script; the admin Products form asks for a raw category ID as a stopgap (see the
  note on that page) until a dedicated categories CRUD endpoint is built.
- **Persistent file storage** — uploads currently save to local disk
  (`backend/src/uploads`), which is fine for development but does **not** survive a
  redeploy on most hosts (Render/Railway wipe the filesystem each deploy). Swapping
  in Cloudinary/S3 only requires changing `backend/src/middleware/upload.ts` — the
  rest of the upload flow (the `/api/uploads` endpoint, the frontend's dual
  URL/file-picker UI) stays the same.
- **Order-status/reports admin UI, full CRUD for every entity** — the *APIs* for
  orders/appointments/products all support full CRUD with role checks; a few of
  their admin-facing UI tables (beyond Users and Products, which are built) are the
  natural next screens to add, following the exact same pattern already in
  `app/admin/products/page.tsx`.
