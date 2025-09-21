"use client";

// OtpManager: A client-side utility for handling OTP data
// This uses localStorage to store the OTP between API calls

interface OtpData {
  otp: string;
  email: string;
  timestamp: number;
  expires: number; // Expiration time in milliseconds
}

class OtpManager {
  private readonly STORAGE_KEY = "signup_otp_data";

  // Store OTP data in localStorage
  storeOtp(email: string, otp: string, expiresInMinutes = 15): void {
    const otpData: OtpData = {
      otp,
      email,
      timestamp: Date.now(),
      expires: Date.now() + expiresInMinutes * 60 * 1000,
    };

    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(otpData));
    console.log(`OTP stored for ${email}`);
  }

  // Get OTP data from localStorage
  getOtpData(): OtpData | null {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (!data) return null;

    try {
      const otpData = JSON.parse(data) as OtpData;

      // Check if OTP has expired
      if (Date.now() > otpData.expires) {
        console.log("OTP has expired");
        this.clearOtpData();
        return null;
      }

      return otpData;
    } catch (error) {
      console.error("Failed to parse OTP data", error);
      this.clearOtpData();
      return null;
    }
  }

  // Clear OTP data from localStorage
  clearOtpData(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // Verify if the provided OTP matches the stored OTP
  verifyOtp(email: string, otp: string): boolean {
    const data = this.getOtpData();

    // Check if we have OTP data and it's for the correct email
    if (!data || data.email !== email) {
      return false;
    }

    // Check if OTP matches
    return data.otp === otp;
  }
}

export const otpManager = new OtpManager();
