"use client";

import { useState, useEffect } from "react";
import { otpManager } from "@/lib/otp/client";
import { OtpRateLimiter } from "@/lib/otp/rate-limiter";
import { CountdownTimer } from "@/components/countdown-timer";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"email" | "otp">("email");

  // Rate limiting and cooldown state
  const [canResendOtp, setCanResendOtp] = useState(true);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [otpSent, setOtpSent] = useState(false);

  // Reset errors when changing steps
  useEffect(() => {
    setErrors({});

    // Check rate limit status when moving to OTP step
    if (step === "otp" && email) {
      const rateLimitStatus = OtpRateLimiter.canResendOtp(email);
      setCanResendOtp(rateLimitStatus.canResend);
      setResendCooldown(rateLimitStatus.cooldownRemaining);
      setAttemptsLeft(rateLimitStatus.attemptsLeft);
    }
  }, [step, email]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!email) {
      setErrors({ email: "Email is required" });
      return;
    }

    if (!validateEmail(email)) {
      setErrors({ email: "Please enter a valid email address" });
      return;
    }

    setIsLoading(true);

    try {
      // Check if user exists with this email
      const checkRes = await fetch("/api/users/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const checkData = await checkRes.json();

      if (!checkRes.ok) {
        setErrors({ email: checkData.error || "An error occurred" });
        setIsLoading(false);
        return;
      }

      if (!checkData.exists) {
        setErrors({ email: "No account found with this email address" });
        setIsLoading(false);
        return;
      }

      // Send OTP to the email
      const otpRes = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, purpose: "password_reset" }),
      });

      const otpData = await otpRes.json();

      if (!otpRes.ok) {
        setErrors({
          email: otpData.error || "Failed to send verification code",
        });
        setIsLoading(false);
        return;
      }

      // Store OTP in client-side manager
      if (otpData.otp) {
        otpManager.storeOtp(email, otpData.otp);
      }

      // Apply rate limiting for first send
      OtpRateLimiter.storeRateLimit(email);

      // Move to OTP verification step
      setStep("otp");
      setOtpSent(true);
    } catch (error) {
      console.error("Error requesting password reset:", error);
      setErrors({ email: "An error occurred. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!otp) {
      setErrors({ otp: "Please enter the verification code" });
      return;
    }

    setIsLoading(true);

    try {
      // Verify OTP client-side
      const isValid = otpManager.verifyOtp(email, otp);

      if (!isValid) {
        setErrors({ otp: "Invalid or expired verification code" });
        setIsLoading(false);
        return;
      }

      // If valid, create a reset token and redirect to reset page
      const tokenRes = await fetch("/api/password-reset/create-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const tokenData = await tokenRes.json();

      if (!tokenRes.ok) {
        setErrors({ otp: tokenData.error || "Failed to create reset token" });
        setIsLoading(false);
        return;
      }

      // Reset rate limiter for this email
      OtpRateLimiter.resetRateLimit(email);

      // Redirect to the reset password page with the token
      window.location.href = `/reset-password?token=${tokenData.token}`;
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setErrors({ otp: "An error occurred. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      {/* Back Button */}
      <Link
        href="/"
        className="fixed top-2 left-4 z-20 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium" style={{ fontFamily: 'Lato, sans-serif' }}>Back to Home</span>
      </Link>

      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center">
          {step === "email" ? "Forgot Password" : "Verify Email"}
        </h2>

        {step === "email" ? (
          <form onSubmit={handleRequestReset} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full px-4 py-2 border rounded"
                disabled={isLoading}
                required
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white py-2 rounded font-semibold hover:bg-primary/90 transition flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Sending...
                </>
              ) : (
                "Send Verification Code"
              )}
            </button>

            <div className="text-center">
              <Link
                href="/signin"
                className="text-sm text-primary hover:underline"
              >
                Back to Sign In
              </Link>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-6">
            {otpSent && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative">
                <span className="block sm:inline">
                  Verification code sent to {email}
                </span>
              </div>
            )}

            <div>
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Verification Code
              </label>
              <input
                type="text"
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter verification code"
                className="w-full px-4 py-2 border rounded"
                disabled={isLoading}
                required
              />
              {errors.otp && (
                <p className="mt-1 text-sm text-red-600">{errors.otp}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white py-2 rounded font-semibold hover:bg-primary/90 transition flex items-center justify-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Verifying...
                </>
              ) : (
                "Verify & Continue"
              )}
            </button>

            <p className="text-center text-xs text-gray-500">
              Didn't receive the code?{" "}
              {resendCooldown > 0 ? (
                <span>
                  Resend available in{" "}
                  <CountdownTimer
                    seconds={resendCooldown}
                    onComplete={() => setCanResendOtp(true)}
                    className="font-medium"
                  />
                </span>
              ) : attemptsLeft <= 0 ? (
                <span className="text-amber-600">
                  Maximum resend attempts reached
                </span>
              ) : (
                <button
                  type="button"
                  disabled={!canResendOtp}
                  onClick={async () => {
                    try {
                      // Apply rate limiting
                      const rateLimitResult =
                        OtpRateLimiter.storeRateLimit(email);

                      if (!rateLimitResult.canResend) {
                        setErrors({ otp: "Maximum resend attempts reached" });
                        setCanResendOtp(false);
                        setAttemptsLeft(0);
                        return;
                      }

                      // Update resend state
                      setCanResendOtp(false);
                      setResendCooldown(rateLimitResult.cooldownSeconds);
                      setAttemptsLeft(rateLimitResult.attemptsLeft);

                      // Make the API request
                      const res = await fetch("/api/send-otp", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          email,
                          purpose: "password_reset",
                        }),
                      });

                      const data = await res.json();

                      if (res.ok) {
                        // Store the new OTP but don't set it in the UI
                        if (data.otp) {
                          otpManager.storeOtp(email, data.otp);
                        }
                        // Clear the input field
                        setOtp("");
                        // Show a success message
                        setErrors({
                          otp: `New verification code sent! (${rateLimitResult.attemptsLeft} attempts left)`,
                        });

                        // Remove the success message after 3 seconds
                        setTimeout(() => {
                          setErrors({});
                        }, 3000);
                      } else {
                        setErrors({
                          otp: data.error || "Failed to send verification code",
                        });
                      }
                    } catch (error) {
                      console.error("OTP resend error:", error);
                      setErrors({
                        otp: "Error sending verification code. Please try again.",
                      });
                    }
                  }}
                  className="text-primary hover:underline disabled:opacity-50 disabled:hover:no-underline"
                >
                  Resend OTP ({attemptsLeft} left)
                </button>
              )}
            </p>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setStep("email")}
                className="text-sm text-primary hover:underline"
              >
                Use a different email
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
