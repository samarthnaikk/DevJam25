import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { hashPassword } from "@/lib/auth-utils";

export async function POST(request: Request) {
  try {
    const { username, email, password, role = "USER" } = await request.json();

    // Validate required fields
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "Username, email, and password are required" },
        { status: 400 }
      );
    }

    // Validate role
    if (role && !["USER", "ADMIN"].includes(role.toUpperCase())) {
      return NextResponse.json(
        { error: "Invalid role. Must be USER or ADMIN" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUserByEmail) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // Check if username already exists
    try {
      // Due to schema issues, use a raw query to check for username
      const existingUsers = (await prisma.$queryRaw`
        SELECT * FROM "User" WHERE LOWER(username) = LOWER(${username})
      `) as any[];

      if (Array.isArray(existingUsers) && existingUsers.length > 0) {
        return NextResponse.json(
          { error: "Username already taken" },
          { status: 400 }
        );
      }
    } catch (error) {
      console.error("Username check error:", error);
      // Continue with user creation even if username check fails
    }

    // Hash the password before storing
    const hashedPassword = await hashPassword(password);

    // Create the user
    try {
      // Using raw SQL since the Prisma types are not updated
      const userRole = role ? role.toUpperCase() : "USER";
      await prisma.$executeRaw`
        INSERT INTO "User" (email, username, password, name, role, "createdAt")
        VALUES (${email}, ${username}, ${hashedPassword}, ${username}, ${userRole}, datetime('now'))
      `;

      // Return success without sending sensitive user data
      return NextResponse.json({
        success: true,
        message: "User registered successfully",
      });
    } catch (error) {
      console.error("User creation error:", error);

      // Check if this is a unique constraint error
      if (
        error instanceof Error &&
        error.message.includes("UNIQUE constraint failed")
      ) {
        if (error.message.includes("User_username_key")) {
          return NextResponse.json(
            { error: "Username already taken" },
            { status: 400 }
          );
        } else if (error.message.includes("User_email_key")) {
          return NextResponse.json(
            { error: "Email already registered" },
            { status: 400 }
          );
        }
      }

      return NextResponse.json(
        { error: "Failed to create user account" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Overall error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
