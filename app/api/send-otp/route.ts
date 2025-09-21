import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendOtpEmail } from "@/lib/mailer";
import { otpStore } from "@/lib/otp/store";

export async function POST(request: Request) {
  const { email, purpose = "signup" } = await request.json();
  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    // Check if email already exists (only for signup)
    if (purpose === "signup") {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: "Email already registered" },
          { status: 400 }
        );
      }
    }
    // For password reset, we need to ensure the user exists
    else if (purpose === "password_reset") {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (!existingUser) {
        return NextResponse.json(
          { error: "No account found with this email" },
          { status: 404 }
        );
      }
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store just the email for now - we'll get the full user data during verification
    otpStore.setOtp(email, otp, { email, purpose }, 15); // 15 minutes expiration

    // Send the OTP via email with appropriate subject
    try {
      let subject = "Your Verification Code";
      if (purpose === "password_reset") {
        subject = "Password Reset Verification Code";
      }

      const emailInfo = await sendOtpEmail(email, otp, subject);
      console.log(`OTP for ${email} (${purpose}): ${otp}`);

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
