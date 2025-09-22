"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GoogleSignInButton } from "@/components/google-sign-in-button";
import { SessionManager } from "@/lib/client/session";
import Link from "next/link";
import { Loader2, ArrowLeft } from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier: form.identifier,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        console.log("Login successful, response data:", data);

        // Debug cookies immediately after successful login
        console.log("Post-login cookies:", document.cookie);

        // Wait a bit for cookies to be set properly
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Try to refresh the session to ensure cookies are working
        console.log("Attempting to refresh session...");
        const sessionUser = await SessionManager.refreshSession();

        if (sessionUser) {
          console.log("Session refreshed successfully:", sessionUser);

          // Redirect based on user role
          if (sessionUser.role?.toLowerCase() === "admin") {
            window.location.href = `${window.location.origin}/admin`;
          } else {
            window.location.href = `${window.location.origin}/dashboard`;
          }
        } else {
          console.warn(
            "Session refresh failed, but login was successful. Redirecting anyway..."
          );
          // Still redirect even if session refresh fails
          const userRole = data.user?.role?.toLowerCase();
          if (userRole === "admin") {
            window.location.href = `${window.location.origin}/admin`;
          } else {
            window.location.href = `${window.location.origin}/dashboard`;
          }
        }
      } else {
        setError(data.error || "Failed to sign in");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-start justify-center px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 relative overflow-hidden">
      {/* Back Button */}
      <Link
        href="/"
        className="fixed top-4 left-4 z-20 flex items-center gap-2 text-white/70 hover:text-white transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-medium" style={{ fontFamily: 'Lato, sans-serif' }}>Back to Home</span>
      </Link>

      <div className="w-full max-w-sm sm:max-w-md relative z-10 space-y-6">
        {/* Logo and Brand */}
        <div className="flex flex-col items-center space-y-4 mb-6 sm:mb-8">
          <div className="flex items-center justify-center">
            <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center">
              <img
                src="/Screenshot 2025-09-21 at 12.36.07 PM.svg"
                alt="Rvidia Logo"
                className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
              />
            </div>
          </div>
          <p className="text-white/70 text-lg sm:text-xl text-center">Sign in to Rvidia</p>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg backdrop-blur-sm">
            <span className="text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          <input
            id="identifier"
            name="identifier"
            type="text"
            value={form.identifier}
            onChange={handleChange}
            required
            disabled={isLoading}
            className="w-full h-11 sm:h-12 px-3 py-3 bg-white/5 backdrop-blur-sm text-white border border-white/10 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 rounded-lg transition-all text-sm sm:text-base"
            placeholder="Email or username"
          />

          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            disabled={isLoading}
            className="w-full h-11 sm:h-12 px-3 py-3 bg-white/5 backdrop-blur-sm text-white border border-white/10 placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 rounded-lg transition-all text-sm sm:text-base"
            placeholder="Password"
          />

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full gap-2 sm:gap-0">
            <Link
              href="/forgot-password"
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              Forgot password?
            </Link>
            <Link
              href="/auth-troubleshooter"
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              Login issues?
            </Link>
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={isLoading}
            className="w-full h-11 sm:h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500/50 transition-all font-medium text-white border-0 rounded-lg shadow-lg text-sm sm:text-base"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-black px-3 text-white/50 font-medium">or</span>
          </div>
        </div>

        <GoogleSignInButton />

        <div className="text-center">
          <p className="text-white/60 text-sm">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Create account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
