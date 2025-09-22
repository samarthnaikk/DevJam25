// This file creates a singleton OTP store that can be shared between API routes
// In a production application, this would use a database instead of in-memory storage

// Type definition for OTP store
interface OtpStoreData {
  otp: string;
  userData: any;
  expires: number;
}

// In-memory OTP store
class OtpStoreManager {
  private static instance: OtpStoreManager;
  private store: { [key: string]: OtpStoreData } = {};

  private constructor() {}

  public static getInstance(): OtpStoreManager {
    if (!OtpStoreManager.instance) {
      OtpStoreManager.instance = new OtpStoreManager();
    }
    return OtpStoreManager.instance;
  }

  // Store an OTP
  public setOtp(
    email: string,
    otp: string,
    userData: any,
    expiresInMinutes: number = 15
  ): void {
    this.store[email] = {
      otp,
      userData,
      expires: Date.now() + expiresInMinutes * 60 * 1000,
    };
    console.log(`OTP stored for ${email}: ${otp}`);
    console.log(`Active OTPs: ${Object.keys(this.store).join(", ")}`);
  }

  // Get OTP data
  public getOtp(email: string): OtpStoreData | null {
    const data = this.store[email];
    console.log(`Looking for OTP for ${email}`);
    console.log(
      `Currently stored emails: ${Object.keys(this.store).join(", ")}`
    );

    if (!data) {
      console.log(`No OTP found for ${email}`);
      return null;
    }

    // Check if expired
    if (Date.now() > data.expires) {
      console.log(`OTP for ${email} has expired`);
      delete this.store[email];
      return null;
    }

    console.log(`Found valid OTP for ${email}`);
    return data;
  }

  // Remove OTP
  public removeOtp(email: string): void {
    delete this.store[email];
    console.log(`OTP removed for ${email}`);
  }

  // Debug: Get all stored emails (no sensitive data)
  public getStoredEmails(): string[] {
    return Object.keys(this.store);
  }
}

// Export a singleton instance
export const otpStore = OtpStoreManager.getInstance();
