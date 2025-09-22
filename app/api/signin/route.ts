import { NextResponse } from "next/server";
import { getUserByIdentifier } from "@/lib/user";
import {
  verifyPassword,
  generateJWT,
  createSecureCookieOptions,
  setTokenCookie,
} from "@/lib/auth-utils";

const AUTH_COOKIE_NAME = "auth_token";

export async function POST(request: Request) {
  try {
    // Parse request body
    const { identifier, password } = await request.json();

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Email/username and password are required" },
        { status: 400 }
      );
    }

    // Try to find the user by email or username
    const user = await getUserByIdentifier(identifier);

    // User not found
    if (!user) {
      return NextResponse.json(
        { error: "Invalid username/email or password" },
        { status: 401 }
      );
    }

    // Verify password using bcrypt
    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid username/email or password" },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = generateJWT({
      userId: user.id,
      email: user.email,
      role: user.role,
      username: user.username || "",
      name: user.name || user.username || "",
    });

    // Create response with user data
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        username: user.username,
        // Don't include password in the response
      },
    });

    // Set secure HTTP-only cookie using our utility function
    console.log("API /signin: Setting auth_token cookie...");
    setTokenCookie(response, token);

    // Also set legacy cookie for backward compatibility
    console.log("API /signin: Setting auth-token cookie...");
    const cookieOptions = createSecureCookieOptions();
    console.log("API /signin: Cookie options:", cookieOptions);
    response.cookies.set("auth-token", token, cookieOptions);

    console.log("API /signin: Set auth cookies for user:", user.email);
    console.log("API /signin: Token length:", token.length);
    console.log("API /signin: Token preview:", token.substring(0, 20) + "...");

    return response;
  } catch (error) {
    console.error("Signin error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
