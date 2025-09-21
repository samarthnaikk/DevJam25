import { NextResponse } from "next/server";
import { getUserByIdentifier } from "@/lib/user";
import {
  verifyPassword,
  generateJWT,
  createSecureCookieOptions,
} from "@/lib/auth-utils";

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

    // Set secure HTTP-only cookie
    response.cookies.set("auth-token", token, createSecureCookieOptions());

    return response;
  } catch (error) {
    console.error("Signin error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
