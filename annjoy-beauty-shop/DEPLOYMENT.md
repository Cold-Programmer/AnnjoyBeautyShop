# Deploying GLOW 'N' GO

## The one thing to get right first: two separate deployments

This is a **monorepo with two independent apps** — they deploy to two
different platforms, not one:

| | What it is | Where it goes | Root directory to set |
|---|---|---|---|
| `frontend/` | Next.js (static + server-rendered pages) | **Vercel** | `frontend` |
| `backend/` | Express + Prisma + Postgres (long-running server) | **Render** (or Railway) | `backend` |

**What went wrong in your Vercel import**: it auto-detected "Next.js" and
offered to import the whole repo, but the env var list you were asked to
fill in (`SMTP_USER`, `MPESA_CONSUMER_KEY`, `DATABASE_URL`, etc.) is
entirely **backend** configuration — a Next.js frontend has no use for
any of it. That happened because either the repo's root directory wasn't
set to `frontend`, or a full backend `.env` got pasted into Vercel's
"paste .env contents" box. Vercel's serverless functions also aren't a
good fit for this backend anyway — it holds a persistent Postgres
connection pool and per-request session/activity logging, which wants a
normal long-running Node process (Render/Railway), not a cold-started
serverless function.

**Fix**: do these as two separate, independent deployments.

---

## 1. Backend → Render

1. **New → Web Service** → connect the `Cold-Programmer/GLOW-N-GO-Beauty-Shop` repo
2. **Root Directory**: `backend`
3. **Build Command**: `npm install && npx prisma generate`
   *(the backend is plain JavaScript now — no compile step. `prisma
   generate` still needs to run once so `@prisma/client` matches your
   schema; Render's build step is the right place for that.)*
4. **Start Command**: `npm start` (runs `node server.js`)
5. **Add a PostgreSQL database**: Render → New → PostgreSQL (free tier is
   fine to start) → copy its **Internal Database URL** into `DATABASE_URL`
   below
6. After the first deploy succeeds, open the Render **Shell** tab for
   this service and run once:
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```
   (`migrate deploy`, not `migrate dev` — that's the non-interactive,
   production-safe command that just applies existing migrations.)

### Backend environment variables (Render)

Every one of these belongs **only** on Render, never on Vercel:

```env
NODE_ENV=production
PORT=5000
DATABASE_URL=<Render Postgres Internal Database URL>
CORS_ORIGIN=https://your-frontend.vercel.app
BASE_URL=https://your-backend.onrender.com
JWT_ACCESS_SECRET=<generate a long random string>
JWT_REFRESH_SECRET=<a DIFFERENT long random string>
ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_TTL_DAYS=30

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=<see note below — this is what blocked your Vercel import>
SMTP_PASS=<see note below>
EMAIL_FROM_NAME=GLOW 'N' GO Beauty & Cosmetics
EMAIL_FROM_ADDR=noreply@yourdomain.com
ADMIN_NOTIFICATION_EMAIL=admin@yourdomain.com

MPESA_ENV=sandbox
MPESA_BASE_URL=https://sandbox.safaricom.co.ke
MPESA_CONSUMER_KEY=DOoUIiYZzBtrv0keFZ3GgWYH0EzkCEFBAxaG2jQUo9HNyF9c
MPESA_CONSUMER_SECRET=vttamysyPQywUIgJTGmuMqQKhmG1lzO8Wc0H76BXNbg51A7OkfZTZ7LFGR3qkAmu
MPESA_SHORTCODE=174379
MPESA_PASSKEY=bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919
MPESA_TRANSACTION_TYPE=CustomerPayBillOnline
MPESA_STK_CALLBACK_URL=https://your-backend.onrender.com/api/mpesa/callback
MPESA_TIMEOUT_URL=https://your-backend.onrender.com/api/mpesa/timeout
```

### About the SMTP_USER / SMTP_PASS "required field" block

The app code treats these as genuinely optional (`backend/src/services/
email.service.ts` falls back to logging emails to the console if they're
unset) — but Render's/Vercel's environment-variable form doesn't know
that, and rejects an empty value for a key you've declared. Two ways
forward, both safe:

- **Best**: set up a real Gmail App Password now (2 minutes) — Google
  Account → Security → App passwords → generate one for "Mail" — and use
  that. Emails (OTP codes, receipts, feedback requests) start working
  immediately.
- **Unblock now, fix later**: enter any non-empty placeholder (e.g.
  `SMTP_USER=placeholder@example.com`, `SMTP_PASS=placeholder`). This is
  genuinely safe — `sendEmail()` wraps the actual send in a try/catch, so
  a bad SMTP login just logs an error on the backend and the request that
  triggered it (register, checkout, etc.) still succeeds. Swap in real
  credentials whenever you're ready; nothing else needs to change.

---

## 2. Frontend → Vercel

1. **New Project** → same repo
2. **Root Directory**: `frontend` ← the field you need to set explicitly;
   this is what was missing before
3. Framework preset: Next.js (auto-detected correctly once the root
   directory is right)
4. Build/Install/Output commands: leave as Next.js defaults

### Frontend environment variables (Vercel)

Just **one** variable — everything else on that long list you saw
belongs to the backend, not here:

```env
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

---

## 3. Wire them together

Once both are deployed:
1. Copy your Vercel URL (e.g. `https://glow-n-go-beauty-shop-h12l.vercel.app`)
   into the backend's `CORS_ORIGIN` on Render, redeploy the backend.
2. Copy your Render URL into `NEXT_PUBLIC_API_URL` on Vercel, redeploy the
   frontend (Vercel doesn't hot-reload env vars either — it needs a
   redeploy to pick up the change).
3. Update `MPESA_STK_CALLBACK_URL`/`MPESA_TIMEOUT_URL` on Render to point
   at the real `https://your-backend.onrender.com/...` — no ngrok needed
   in production, since Render already gives you a public HTTPS URL.

Test end to end: open the Vercel URL, register an account, check the
Render service logs for the OTP code (if SMTP isn't configured yet), log
in, and confirm `https://your-backend.onrender.com/health` returns
`{"status":"ok"}`.
