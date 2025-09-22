import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    // If we get here, the email is available
    return NextResponse.json({ available: true });
  } catch (error) {
    console.error("Email check error:", error);
    return NextResponse.json(
      { error: "Error checking email availability" },
      { status: 500 }
    );
  }
}
