"use client";

// OTP rate limiter to prevent abuse
export class OtpRateLimiter {
  private static readonly STORAGE_KEY = "otp_rate_limit";
  private static readonly MAX_RESENDS = 3; // Maximum number of resends allowed
  private static readonly INITIAL_COOLDOWN = 15; // Initial cooldown in seconds
  private static readonly SUBSEQUENT_COOLDOWN = 90; // Cooldown for subsequent resends in seconds

  // Store rate limit data for an email
  static storeRateLimit(email: string): {
    canResend: boolean;
    attemptsLeft: number;
    cooldownSeconds: number;
  } {
    try {
      // Get existing data
      const existingData = this.getRateLimitData(email);
      const now = Date.now();
      const isFirstAttempt = !existingData || existingData.attempts === 0;

      // Calculate cooldown period - first resend has shorter cooldown
      const cooldownSeconds = isFirstAttempt
        ? this.INITIAL_COOLDOWN
        : this.SUBSEQUENT_COOLDOWN;

      // Create new rate limit data
      const newData = {
        email,
        attempts: existingData ? existingData.attempts + 1 : 1,
        lastAttempt: now,
        nextAttemptTime: now + cooldownSeconds * 1000,
      };

      // Check if max resends reached
      if (newData.attempts > this.MAX_RESENDS) {
        return {
          canResend: false,
          attemptsLeft: 0,
          cooldownSeconds: 0,
        };
      }

      // Store in localStorage
      const allData = this.getAllRateLimitData();
      allData[email] = newData;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allData));

      return {
        canResend: true,
        attemptsLeft: this.MAX_RESENDS - newData.attempts,
        cooldownSeconds,
      };
    } catch (error) {
      console.error("Error storing rate limit data:", error);
      return {
        canResend: true,
        attemptsLeft: this.MAX_RESENDS - 1,
        cooldownSeconds: this.INITIAL_COOLDOWN,
      };
    }
  }

  // Check if user can resend OTP
  static canResendOtp(email: string): {
    canResend: boolean;
    attemptsLeft: number;
    cooldownRemaining: number;
    totalCooldown: number;
  } {
    try {
      const data = this.getRateLimitData(email);
      const now = Date.now();

      // If no data or first attempt, allow resend
      if (!data || data.attempts === 0) {
        return {
          canResend: true,
          attemptsLeft: this.MAX_RESENDS,
          cooldownRemaining: 0,
          totalCooldown: this.INITIAL_COOLDOWN,
        };
      }

      // Check if max resends reached
      if (data.attempts >= this.MAX_RESENDS) {
        return {
          canResend: false,
          attemptsLeft: 0,
          cooldownRemaining: 0,
          totalCooldown: 0,
        };
      }

      // Check if in cooldown period
      if (now < data.nextAttemptTime) {
        const cooldownRemaining = Math.ceil(
          (data.nextAttemptTime - now) / 1000
        );
        const totalCooldown =
          data.attempts === 1
            ? this.INITIAL_COOLDOWN
            : this.SUBSEQUENT_COOLDOWN;

        return {
          canResend: false,
          attemptsLeft: this.MAX_RESENDS - data.attempts,
          cooldownRemaining,
          totalCooldown,
        };
      }

      // Not in cooldown, can resend
      return {
        canResend: true,
        attemptsLeft: this.MAX_RESENDS - data.attempts,
        cooldownRemaining: 0,
        totalCooldown:
          data.attempts === 0
            ? this.INITIAL_COOLDOWN
            : this.SUBSEQUENT_COOLDOWN,
      };
    } catch (error) {
      console.error("Error checking rate limit:", error);
      // Default to allowing resend on error
      return {
        canResend: true,
        attemptsLeft: this.MAX_RESENDS,
        cooldownRemaining: 0,
        totalCooldown: this.INITIAL_COOLDOWN,
      };
    }
  }

  // Reset rate limit data for an email (e.g., after successful verification)
  static resetRateLimit(email: string): void {
    try {
      const allData = this.getAllRateLimitData();
      delete allData[email];
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allData));
    } catch (error) {
      console.error("Error resetting rate limit data:", error);
    }
  }

  // Get rate limit data for a specific email
  private static getRateLimitData(email: string): {
    email: string;
    attempts: number;
    lastAttempt: number;
    nextAttemptTime: number;
  } | null {
    const allData = this.getAllRateLimitData();
    return allData[email] || null;
  }

  // Get all rate limit data
  private static getAllRateLimitData(): Record<string, any> {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error("Error getting rate limit data:", error);
      return {};
    }
  }
}
