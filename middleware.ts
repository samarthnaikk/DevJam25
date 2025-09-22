import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJWT } from "@/lib/jwt-utils";

const AUTH_COOKIE_NAME = "auth_token";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/signin",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/auth-troubleshooter",
    "/auth-debug",
    "/api/auth",
    "/api/signin",
    "/api/signup",
    "/api/send-otp",
    "/api/verify-otp",
    "/api/password-reset",
    "/api/debug-otp",
    "/api/clear-auth",
  ];

  // Add Google OAuth routes to public routes
  if (pathname.startsWith("/api/auth/google")) {
    return NextResponse.next();
  }

  // Check if the current path is public
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route)
  );

  // Allow access to public routes and static files
  if (
    isPublicRoute ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  // Get auth token from cookies - check both new and legacy names
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;
  const legacyToken = request.cookies.get("auth-token")?.value;

  const finalToken = token || legacyToken;

  // If no token, redirect to signin
  if (!finalToken) {
    console.log("Middleware: No auth token found for path:", pathname);
    console.log(
      "Middleware: Cookies:",
      Object.fromEntries(
        request.cookies.getAll().map((c) => [c.name, "present"])
      )
    );
    const url = request.nextUrl.clone();
    url.pathname = "/signin";
    return NextResponse.redirect(url);
  }

  // Verify the JWT token
  const decoded = verifyJWT(finalToken);

  if (!decoded) {
    // Invalid token, redirect to signin
    console.log("Middleware: Invalid token for path:", pathname);
    const url = request.nextUrl.clone();
    url.pathname = "/signin";
    const response = NextResponse.redirect(url);

    // Clear both cookie types
    response.cookies.set(AUTH_COOKIE_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
      path: "/",
    });

    response.cookies.set("auth-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
      path: "/",
    });

    return response;
  }

  // Check role-based access
  if (pathname.startsWith("/admin")) {
    const userRole = decoded.role?.toLowerCase();
    if (userRole !== "admin") {
      // Non-admin trying to access admin routes, redirect to dashboard
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }
  }

  // Allow access to protected routes
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
