import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { username } = await request.json();

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    // Check if username already exists using raw query to avoid Prisma type issues
    try {
      const existingUsers = await prisma.$queryRaw`
        SELECT * FROM "User" WHERE LOWER(username) = LOWER(${username})
      `;

      if (Array.isArray(existingUsers) && existingUsers.length > 0) {
        return NextResponse.json(
          { error: "Username already taken" },
          { status: 400 }
        );
      }

      // If we get here, the username is available
      return NextResponse.json({ available: true });
    } catch (error) {
      console.error("Username check error:", error);
      return NextResponse.json(
        { error: "Error checking username availability" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Request error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
