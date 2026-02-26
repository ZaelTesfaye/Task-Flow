import { NextRequest, NextResponse } from "next/server";

const publicRoutes = ["/", "/login", "/verify-email"];
const protectedRoutes = ["/dashboard", "/project", "/invitations"];

export function authMiddleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  const needsAuthCheck =
    publicRoutes.includes(pathname) ||
    protectedRoutes.some((route) => pathname.startsWith(route));

  if (!needsAuthCheck) {
    return null;
  }

  const isAuthenticated =
    request.cookies.has("better-auth.session_token") ||
    request.headers.get("authorization");

  // On login/verify routes and authenticated → redirect to dashboard
  if (publicRoutes.includes(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // On protected routes and NOT authenticated → redirect to login
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );
  if (isProtected && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return null;
}
