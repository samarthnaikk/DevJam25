import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function POST(request: Request) {
  const { username, email, password } = await request.json();
  if (!username || !email || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  try {
    // Check if username already exists
    const existingUserByUsername = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUserByUsername) {
      return NextResponse.json(
        { error: "Username already taken" },
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

    const user = await prisma.user.create({
      data: {
        email,
        username,
        password,
        name: username,
      },
    });
    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Signup error:", error);

    // Handle specific Prisma errors
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Unique constraint violation has code P2002
      if (error.code === "P2002") {
        const field = error.meta?.target as string[];
        if (field.includes("username")) {
          return NextResponse.json(
            { error: "Username already taken" },
            { status: 400 }
          );
        } else if (field.includes("email")) {
          return NextResponse.json(
            { error: "Email already registered" },
            { status: 400 }
          );
        }
      }
    }

    return NextResponse.json(
      { error: "User creation failed" },
      { status: 500 }
    );
  }
}
