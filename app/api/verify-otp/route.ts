import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { otpStore } from "@/lib/otp/store";

export async function POST(request: Request) {
  const { email, otp, userData } = await request.json();

  if (!email || !otp) {
    return NextResponse.json(
      { error: "Email and OTP are required" },
      { status: 400 }
    );
  }

  try {
    // Check if we have a stored OTP for this email
    const storedData = otpStore.getOtp(email);

    if (!storedData) {
      return NextResponse.json(
        { error: "No OTP requested for this email or it has expired" },
        { status: 400 }
      );
    }

    // Check if OTP matches
    if (storedData.otp !== otp) {
      return NextResponse.json({ error: "Invalid OTP" }, { status: 400 });
    }

    // OTP verified successfully, create the user
    const { username, email: userEmail, password } = userData;

    const user = await prisma.user.create({
      data: {
        email: userEmail,
        password,
        name: username,
      },
    });

    // Clean up the OTP store
    otpStore.removeOtp(email);

    return NextResponse.json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
