"use client";

import { useState } from "react";
import { GoogleSignInButton } from "@/components/google-sign-in-button";
import { SessionManager } from "@/lib/client/session";
import { useRouter } from "next/navigation";
import { navigateToAdmin } from "@/lib/client/routing";

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
    // Clear error when user types
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
        // Store user session with role for testing
        const userWithRole = {
          ...data.user,
          role: "admin", // For testing, add admin role
        };
        SessionManager.storeSession(userWithRole);

        // Successful login - redirect to admin
        console.log("Login successful, redirecting to admin...");
        console.log("User data with role:", userWithRole);

        // Use dynamic origin for proper deployment in any environment
        window.location.href = `${window.location.origin}/admin`;
      } else {
        // Handle error
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-700 p-4">
      <div className="w-full max-w-sm">
        <form
          className="bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 shadow-2xl p-8 space-y-6"
          onSubmit={handleSubmit}
        >
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Sign In</h2>
            <p className="text-white/70 text-sm">Access your GPU task management dashboard</p>
          </div>

          {error && (
            <div
              className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg relative backdrop-blur-sm"
              role="alert"
            >
              <span className="block sm:inline text-sm">{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <input
                type="text"
                name="identifier"
                placeholder="Username or Email"
                value={form.identifier}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                disabled={isLoading}
                required
              />
            </div>

            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                disabled={isLoading}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 flex items-center justify-center shadow-lg"
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
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-gradient-to-br from-slate-900 to-slate-700 px-4 text-white/70">or</span>
            </div>
          </div>

          <GoogleSignInButton />

          <div className="text-center">
            <p className="text-white/70 text-sm">
              Don't have an account?{" "}
              <button
                type="button"
                onClick={() => router.push("/signup")}
                className="text-blue-400 hover:text-blue-300 transition-colors font-medium"
              >
                Sign up
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
