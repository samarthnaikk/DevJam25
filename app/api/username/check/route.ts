import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { username } = await request.json();

    // Validate input
    if (!username || typeof username !== "string") {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    // Basic username validation
    const trimmedUsername = username.trim();
    if (trimmedUsername.length < 3) {
      return NextResponse.json(
        {
          available: false,
          error: "Username must be at least 3 characters long",
        },
        { status: 200 }
      );
    }

    if (trimmedUsername.length > 20) {
      return NextResponse.json(
        { available: false, error: "Username must be less than 20 characters" },
        { status: 200 }
      );
    }

    // Check for valid characters (alphanumeric and underscore only)
    const validUsernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!validUsernameRegex.test(trimmedUsername)) {
      return NextResponse.json(
        {
          available: false,
          error: "Username can only contain letters, numbers, and underscores",
        },
        { status: 200 }
      );
    }

    // Check if username already exists (case-insensitive)
    try {
      const existingUsers = (await prisma.$queryRaw`
        SELECT username FROM "User" WHERE LOWER(username) = LOWER(${trimmedUsername})
      `) as any[];

      const isAvailable =
        !Array.isArray(existingUsers) || existingUsers.length === 0;

      return NextResponse.json({
        available: isAvailable,
        username: trimmedUsername,
        message: isAvailable
          ? "Username is available"
          : "Username is already taken",
      });
    } catch (dbError) {
      console.error("Database error checking username:", dbError);
      // If DB query fails, assume username might be available but warn user
      return NextResponse.json({
        available: true,
        username: trimmedUsername,
        warning: "Could not verify username availability. Please try again.",
      });
    }
  } catch (error) {
    console.error("Username check error:", error);
    return NextResponse.json(
      { error: "Failed to check username availability" },
      { status: 500 }
    );
  }
}
