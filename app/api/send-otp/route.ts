import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendOtpEmail } from "@/lib/mailer";
import { otpStore } from "@/lib/otp/store";

export async function POST(request: Request) {
  const { email } = await request.json();
  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
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

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store just the email for now - we'll get the full user data during verification
    otpStore.setOtp(email, otp, { email }, 15); // 15 minutes expiration

    // Send the OTP via email
    try {
      const emailInfo = await sendOtpEmail(email, otp);
      console.log(`OTP for ${email}: ${otp}`);

      // Always return the OTP for our client-side verification
      return NextResponse.json({
        message: "OTP sent to email",
        otp: otp, // Always include the OTP
      });
    } catch (emailError) {
      console.error("Failed to send email:", emailError);
      // Even if email fails, we'll still return success
      return NextResponse.json({
        message: "OTP generated but email delivery failed",
        otp: otp, // Always include the OTP
      });
    }
  } catch (error) {
    console.error("OTP generation error:", error);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
