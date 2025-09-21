import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  const { username, email, password } = await request.json();
  if (!username || !email || !password) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }
  try {
    const user = await prisma.user.create({
      data: {
        email,
        password,
        name: username,
      },
    });
    return NextResponse.json({ success: true, user });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "User creation failed" },
      { status: 500 }
    );
  }
}
