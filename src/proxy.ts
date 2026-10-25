import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "tracklet_session";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Static assets and API routes handled separately or allowed
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/api/auth/login") ||
    pathname.startsWith("/api/auth/logout")
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get(COOKIE_NAME)?.value;
  const secretKey = process.env.SESSION_SECRET
    ? new TextEncoder().encode(process.env.SESSION_SECRET)
    : null;

  let isAuthenticated = false;

  if (token && secretKey) {
    try {
      await jwtVerify(token, secretKey, { algorithms: ["HS256"] });
      isAuthenticated = true;
    } catch {
      isAuthenticated = false;
    }
  }

  // Redirect to dashboard if logged-in user visits /login
  if (pathname === "/login") {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // Protect protected dashboard pages
  if (pathname === "/" || pathname.startsWith("/accounts") || pathname.startsWith("/analytics")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect API routes
  if (pathname.startsWith("/api/accounts") || pathname.startsWith("/api/usage") || pathname.startsWith("/api/analytics")) {
    if (!isAuthenticated) {
      return NextResponse.json(
        { success: false, error: "Unauthorized access" },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
