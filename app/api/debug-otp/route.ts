import { NextResponse } from "next/server";
import { otpStore } from "@/lib/otp/store";

// This is a debug-only route that should be disabled in production
export async function GET() {
  // Only allow in development
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Not available in production" },
      { status: 403 }
    );
  }

  // Get emails with active OTPs
  const emails = otpStore.getStoredEmails();

  return NextResponse.json({
    activeOtps: emails.length,
    emails: emails,
  });
}
