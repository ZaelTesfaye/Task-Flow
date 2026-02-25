import { NextRequest, NextResponse } from "next/server";
import { authMiddleware } from "./middlewares/auth.middleware";

export function middleware(request: NextRequest) {
  const authResponse = authMiddleware(request);
  if (authResponse) return authResponse;

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
