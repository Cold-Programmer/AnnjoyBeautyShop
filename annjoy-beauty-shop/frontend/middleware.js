import { NextResponse } from "next/server";
/**
 * Site-wide "no page without an account" gate, per explicit business
 * requirement. Redirects to /login if there's no accessToken cookie.
 *
 * Important honesty note: this is a UX gate, not the real security
 * boundary — it only checks that the cookie is PRESENT, not that it's a
 * valid, unexpired JWT (Next.js Edge middleware can't easily run the
 * same `jsonwebtoken` verification the backend uses). The actual
 * enforcement — verifying the token is genuine and the account is
 * ACTIVE — happens server-side on every API call via requireAuth (see
 * backend/src/middleware/auth.ts). A determined attacker forging a fake
 * cookie value would get past THIS check but be rejected by every real
 * API call, so no data is actually exposed by this gate being "just" a
 * presence check.
 */
const PUBLIC_PATHS = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/verify-email",
];
export function middleware(request) {
    const { pathname } = request.nextUrl;
    const isPublic = PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
    if (isPublic)
        return NextResponse.next();
    const hasSession = request.cookies.has("accessToken") || request.cookies.has("refreshToken");
    if (!hasSession) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("next", pathname);
        return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
}
export const config = {
    // Run on everything except Next's own internals and static files —
    // those aren't "pages" and gating them would just break the app.
    matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp|gif)$).*)"],
};
