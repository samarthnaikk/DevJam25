import { NextResponse } from "next/server";
import { getUserByIdentifier } from "@/lib/user";

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

    // Password check (in a real app, you'd compare hashed passwords)
    if (user.password !== password) {
      return NextResponse.json(
        { error: "Invalid username/email or password" },
        { status: 401 }
      );
    }

    // Successful login
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        // Don't include password in the response
      },
    });
  } catch (error) {
    console.error("Signin error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
