import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import {
  hashPassword,
  generateJWT,
  setTokenCookie,
  createSecureCookieOptions,
} from "@/lib/auth-utils";

export async function POST(request: Request) {
  const { username, email, password, role } = await request.json();
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

    // Hash the password before storing
    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        name: username,
        role: role || "USER",
      },
    });

    // Generate JWT token
    const token = generateJWT({
      userId: user.id,
      email: user.email,
      role: user.role,
      username: user.username || "",
      name: user.name || user.username || "",
    });

    // Create response with secure cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        name: user.name,
        role: user.role,
      },
    });

    // Set secure HTTP-only cookie using our utility function
    setTokenCookie(response, token);

    // Also set legacy cookie for backward compatibility
    response.cookies.set("auth-token", token, createSecureCookieOptions());

    console.log("API /signup: Set auth cookies for new user:", user.email);

    return response;
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
