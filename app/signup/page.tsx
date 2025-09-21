"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GoogleSignInButton } from "@/components/google-sign-in-button";
import { otpManager } from "@/lib/otp/client";
import { OtpRateLimiter } from "@/lib/otp/rate-limiter";
import { CountdownTimer } from "@/components/countdown-timer";

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [otp, setOtp] = useState("");
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  // Rate limiting and cooldown state
  const [canResendOtp, setCanResendOtp] = useState(true);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [attemptsLeft, setAttemptsLeft] = useState(3);

  // Clear OTP input when showing verification screen
  useEffect(() => {
    if (showOtpVerification) {
      setOtp("");

      // Check rate limit status when verification screen is shown
      const rateLimitStatus = OtpRateLimiter.canResendOtp(form.email);
      setCanResendOtp(rateLimitStatus.canResend);
      setResendCooldown(rateLimitStatus.cooldownRemaining);
      setAttemptsLeft(rateLimitStatus.attemptsLeft);
    }
  }, [showOtpVerification, form.email]);

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    otp: "",
  });

  const validatePassword = (password: string) => {
    const hasMinLength = password.length >= 8;
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasNoSpaces = !/\s/.test(password);

    // Store all validation failures to show them together
    const errors = [];

    if (!hasMinLength) errors.push("at least 8 characters");
    if (!hasLowerCase) errors.push("at least 1 lowercase letter");
    if (!hasUpperCase) errors.push("at least 1 uppercase letter");
    if (!hasNumber) errors.push("at least 1 number");
    if (!hasSpecialChar) errors.push("at least 1 special character");
    if (!hasNoSpaces) errors.push("no spaces");

    if (errors.length > 0) {
      return `Password must contain ${errors.join(", ")}`;
    }
    return "";
  };

  const validateEmail = (email: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return "Please enter a valid email address";
    }
    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Validate email
    if (name === "email") {
      const emailError = validateEmail(value);
      setErrors((prev) => ({ ...prev, email: emailError }));
    }

    // Validate password
    if (name === "password") {
      const passwordError = validatePassword(value);
      setErrors((prev) => ({ ...prev, password: passwordError }));

      // Check if confirm password matches
      if (form.confirmPassword && form.confirmPassword !== value) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: "Passwords do not match",
        }));
      } else {
        setErrors((prev) => ({ ...prev, confirmPassword: "" }));
      }
    }

    // Validate confirm password
    if (name === "confirmPassword") {
      if (value !== form.password) {
        setErrors((prev) => ({
          ...prev,
          confirmPassword: "Passwords do not match",
        }));
      } else {
        setErrors((prev) => ({ ...prev, confirmPassword: "" }));
      }
    }
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
    setErrors((prev) => ({ ...prev, otp: "" }));
  };

  const sendOtp = async () => {
    // Validate email before sending OTP
    const emailError = validateEmail(form.email);
    if (emailError) {
      setErrors((prev) => ({ ...prev, email: emailError }));
      return;
    }

    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsOtpSent(true);
        setShowOtpVerification(true);
        // Store the OTP in localStorage for verification but don't auto-fill
        if (data.otp) {
          // Store the OTP but don't set it in the UI
          otpManager.storeOtp(form.email, data.otp);
          console.log(`OTP stored in client: ${data.otp}`);

          // Clear any previous OTP value
          setOtp("");
        }
        setUserData({
          username: form.username,
          email: form.email,
          password: form.password,
        });
      } else {
        setErrors((prev) => ({
          ...prev,
          email: data.error || "Failed to send OTP",
        }));
      }
    } catch (error) {
      console.error("OTP send error:", error);
      setErrors((prev) => ({
        ...prev,
        email: "Error sending OTP. Please try again.",
      }));
    }
  };

  const verifyOtp = async () => {
    if (!otp) {
      setErrors((prev) => ({ ...prev, otp: "Please enter the OTP" }));
      return;
    }

    try {
      // First verify OTP client-side
      const isValid = otpManager.verifyOtp(form.email, otp);
      console.log(
        `Client-side OTP verification: ${isValid ? "valid" : "invalid"}`
      );

      if (!isValid) {
        setErrors((prev) => ({ ...prev, otp: "Invalid or expired OTP" }));
        return;
      }

      // If OTP is valid, create the user directly
      const payload = {
        username: form.username,
        email: form.email,
        password: form.password,
      };

      // Make a request to create the user
      const res = await fetch("/api/users/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        // Clear the OTP data since registration is complete
        otpManager.clearOtpData();

        // Reset rate limiter data for this email
        OtpRateLimiter.resetRateLimit(form.email);

        // Successful registration, redirect to signin page
        window.location.href = "/signin";
      } else {
        setErrors((prev) => ({
          ...prev,
          otp: data.error || "Failed to create account",
        }));
      }
    } catch (error) {
      console.error("User creation error:", error);
      setErrors((prev) => ({
        ...prev,
        otp: "Error creating account. Please try again.",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Don't proceed if OTP verification is already shown
    if (showOtpVerification) {
      return;
    }

    // Final validation before submission
    const emailError = validateEmail(form.email);
    const passwordError = validatePassword(form.password);

    if (emailError) {
      setErrors((prev) => ({ ...prev, email: emailError }));
      return;
    }

    if (passwordError) {
      setErrors((prev) => ({ ...prev, password: passwordError }));
      return;
    }

    if (form.password !== form.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: "Passwords do not match",
      }));
      return;
    }

    // If all validations pass, send OTP
    await sendOtp();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-black text-white pt-16">
      {!showOtpVerification ? (
        <div className="w-full max-w-sm space-y-8">
          {/* Logo Section */}
          <div className="text-center">
            <img 
              src="/Screenshot 2025-09-21 at 12.36.07 PM.svg" 
              alt="Rvidia Logo" 
              className="w-16 h-16 mx-auto mb-4"
            />
            <h1 className="text-xl font-medium text-gray-300 mb-8">Sign up to Rvidia</h1>
          </div>

          <form
            className="space-y-4"
            onSubmit={handleSubmit}
          >

            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  value={form.username}
                  onChange={handleChange}
                  className="w-full h-12 px-3 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                  required
                />
              </div>

              <div className="space-y-1">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={handleChange}
                  className={`w-full h-12 px-3 py-3 bg-white/5 backdrop-blur-sm border rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all ${
                    errors.email ? "border-red-500/50 ring-2 ring-red-500/50" : "border-white/10"
                  }`}
                  required
                />
                {errors.email && (
                  <p className="text-red-300 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              <div className="space-y-1">
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  className={`w-full h-12 px-3 py-3 bg-white/5 backdrop-blur-sm border rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all ${
                    errors.password ? "border-red-500/50 ring-2 ring-red-500/50" : "border-white/10"
                  }`}
                  required
                />
                {errors.password && (
                  <p className="text-red-300 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              <div className="space-y-1">
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  className={`w-full h-12 px-3 py-3 bg-white/5 backdrop-blur-sm border rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all ${
                    errors.confirmPassword ? "border-red-500/50 ring-2 ring-red-500/50" : "border-white/10"
                  }`}
                  required
                />
                {errors.confirmPassword && (
                  <p className="text-red-300 text-xs mt-1">{errors.confirmPassword}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500/50 transition-all font-medium text-white border-0 rounded-lg shadow-lg mt-6"
                disabled={
                  !!errors.email || !!errors.password || !!errors.confirmPassword
                }
              >
                Sign up
              </button>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-black px-3 text-white/50 font-medium">or</span>
              </div>
            </div>

            <GoogleSignInButton />

            <div className="text-center mt-6">
              <p className="text-white/60 text-sm">
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => router.push("/signin")}
                  className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                >
                  Sign in
                </button>
              </p>
            </div>
          </form>
        </div>
      ) : (
        <div className="w-full max-w-sm space-y-8">
          {/* Logo Section */}
          <div className="text-center">
            <img 
              src="/Screenshot 2025-09-21 at 12.36.07 PM.svg" 
              alt="Rvidia Logo" 
              className="w-16 h-16 mx-auto mb-4"
            />
            <h1 className="text-xl font-medium text-gray-300 mb-2">Email Verification</h1>
            <p className="text-gray-400 text-sm">
              We sent a verification code to{" "}
              <span className="font-semibold text-white">{form.email}</span>
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={handleOtpChange}
                className={`w-full h-12 px-3 py-3 bg-white/5 backdrop-blur-sm border rounded-lg text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all text-center text-2xl tracking-wider ${
                  errors.otp ? "border-red-500/50 ring-2 ring-red-500/50" : "border-white/10"
                }`}
                autoComplete="off"
                autoFocus
                maxLength={6}
                required
              />
              {errors.otp && (
                <p className={`text-xs text-center ${errors.otp.includes('sent') ? 'text-green-300' : 'text-red-300'}`}>
                  {errors.otp}
                </p>
              )}
            </div>

            <button
              onClick={verifyOtp}
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500/50 transition-all font-medium text-white border-0 rounded-lg shadow-lg"
            >
              Verify & Complete Signup
            </button>

            <p className="text-center text-xs text-white/60">
              Didn't receive the code?{" "}
              {resendCooldown > 0 ? (
                <span>
                  Resend available in{" "}
                  <CountdownTimer
                    seconds={resendCooldown}
                    onComplete={() => setCanResendOtp(true)}
                    className="font-medium text-white/80"
                  />
                </span>
              ) : attemptsLeft <= 0 ? (
                <span className="text-amber-300">
                  Maximum resend attempts reached
                </span>
              ) : (
                <button
                  type="button"
                  disabled={!canResendOtp}
                  onClick={async () => {
                    try {
                      // Apply rate limiting
                      const rateLimitResult = OtpRateLimiter.storeRateLimit(
                        form.email
                      );

                      if (!rateLimitResult.canResend) {
                        setErrors((prev) => ({
                          ...prev,
                          otp: "Maximum resend attempts reached",
                        }));
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
                        body: JSON.stringify({ email: form.email }),
                      });

                      const data = await res.json();

                      if (res.ok) {
                        // Store the new OTP but don't set it in the UI
                        if (data.otp) {
                          otpManager.storeOtp(form.email, data.otp);
                        }
                        // Clear the input field
                        setOtp("");
                        // Show a success message
                        setErrors((prev) => ({
                          ...prev,
                          otp: `New verification code sent! (${rateLimitResult.attemptsLeft} attempts left)`,
                        }));

                        // Remove the success message after 3 seconds
                        setTimeout(() => {
                          setErrors((prev) => ({ ...prev, otp: "" }));
                        }, 3000);
                      } else {
                        setErrors((prev) => ({
                          ...prev,
                          otp: data.error || "Failed to send verification code",
                        }));
                      }
                    } catch (error) {
                      console.error("OTP resend error:", error);
                      setErrors((prev) => ({
                        ...prev,
                        otp: "Error sending verification code. Please try again.",
                      }));
                    }
                  }}
                  className="text-blue-400 hover:text-blue-300 transition-colors hover:underline disabled:opacity-50 disabled:hover:no-underline"
                >
                  Resend OTP ({attemptsLeft} left)
                </button>
              )}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
