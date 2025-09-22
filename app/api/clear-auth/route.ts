import { NextRequest, NextResponse } from "next/server";

/**
 * This route is a utility to clear all authentication cookies
 * Useful when debugging authentication issues or if a user is stuck
 * with an invalid token.
 */
export async function GET(request: NextRequest) {
  console.log("Clearing all auth cookies");

  const response = NextResponse.json({
    success: true,
    message: "All authentication cookies cleared",
  });

  // Clear all possible auth cookies
  response.cookies.set("auth_token", "", {
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

  console.log("Redirecting to signin page");

  // Add a client-side redirect to the signin page
  return NextResponse.redirect(new URL("/signin", request.url));
}
