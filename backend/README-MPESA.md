# M-Pesa STK Push — Annjoy Beauty Shop

Drop the `src/` folder into your existing Express/TypeScript backend
(matches the paths in your app already — adjust import paths if your
folder layout differs) and copy `.env.example` → `.env`.

## 1. Install dependencies
```bash
npm install express axios dotenv cors helmet
npm install -D typescript @types/express @types/node @types/cors
```

## 2. Fill in `.env`
Your Consumer Key/Secret are already filled in from what you shared.
Shortcode/Passkey were "N/A" — I used Safaricom's published sandbox
test pair (174379) so it works immediately. Get your app-specific ones
from https://developer.safaricom.co.ke → My Apps → your app →
"Lipa Na M-Pesa Sandbox" credentials, and swap them in if different.

## 3. Expose your local server publicly (required for the callback)
Safaricom's servers must be able to reach `MPESA_STK_CALLBACK_URL` over
the public internet — `localhost` will never work.

```bash
ngrok http 5000
```
Copy the `https://xxxx.ngrok-free.app` URL into `BASE_URL` in `.env`,
restart your server, and register that same URL as the callback URL
if your Daraja app requires whitelisting it in the portal.

## 4. Wire the routes (already done in `src/app.ts`)
```ts
app.use("/api/mpesa", mpesaRoutes);
```

## 5. Trigger a payment prompt (STK Push)
```bash
curl -X POST http://localhost:5000/api/mpesa/stkpush \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "0722503692",
    "amount": 1,
    "accountReference": "ORDER123",
    "transactionDesc": "Beauty order"
  }'
```
Sandbox note: amount `1` is standard for test transactions. The test
phone number that actually receives a simulated prompt in sandbox is
Safaricom's own test MSISDN — real phones don't get a real prompt in
sandbox mode, only in production (Go-Live).

Frontend flow:
1. Call `POST /api/mpesa/stkpush` → show "Check your phone and enter
   your M-Pesa PIN" using the returned message.
2. Poll `GET /api/mpesa/status/:checkoutRequestId` every 3–4s.
3. When `status` becomes `SUCCESS`, `FAILED`, or `CANCELLED`, redirect
   to the matching confirmation screen.

## Why you were getting 502 — and what's fixed here

A 502 on your callback route almost always comes from one of these:

| Cause | Fix applied in this code |
|---|---|
| Callback handler does slow DB/email work *before* responding, and Safaricom/your proxy times out waiting | `stkCallbackHandler` sends `res.status(200)` **first**, then does the real work afterward |
| An error inside the callback handler throws and crashes the process | All callback logic is wrapped in try/catch that can never bubble up after the response is sent |
| Callback URL isn't public HTTPS (still `localhost` or HTTP) | Use ngrok / your real domain in `BASE_URL`, HTTPS only |
| Missing `express.json()` so `req.body` is `undefined` and something downstream throws | Added in `app.ts` |
| Process crashes on an unrelated unhandled rejection elsewhere in the app, proxy then can't reach it → 502 | `registerProcessSafetyNets()` logs instead of crashing |
| Reverse proxy's timeout is shorter than Node's keep-alive, connection gets dropped mid-response | `server.keepAliveTimeout` / `headersTimeout` tuned in `app.ts` |

If you still see 502 after this, check:
- Your hosting platform's logs (Railway/Render/etc.) at the exact
  timestamp of the callback — that tells you if it's the app crashing
  vs. the proxy timing out vs. ngrok itself dying.
- That `/api/mpesa/callback` has **no auth/JWT middleware** in front of
  it — Safaricom can't log in, so an auth guard will reject it before
  it ever reaches your handler.

## Going to production later
- Replace `transaction.store.ts` with a real Prisma model (schema
  included as a comment in that file).
- Get your production Shortcode/Passkey and switch
  `MPESA_BASE_URL` to `https://api.safaricom.co.ke`.
- Move secrets into your host's secret manager (Railway/Vercel/Render
  env vars), not a committed `.env`.
