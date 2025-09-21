"use client";

import { useState } from "react";
import { GoogleSignInButton } from "@/components/google-sign-in-button";
import { SessionManager } from "@/lib/client/session";
import { useRouter } from "next/navigation";
import Link from "next/link";

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
      <form
        className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 space-y-6"
        onSubmit={handleSubmit}
      >
        <h2 className="text-2xl font-bold text-center">Sign In</h2>

        {error && (
          <div
            className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <div>
          <input
            type="text"
            name="identifier"
            placeholder="Username or Email ID"
            value={form.identifier}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded"
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
            className="w-full px-4 py-2 border rounded"
            disabled={isLoading}
            required
          />
          <div className="mt-1 flex justify-end">
            <Link
              href="/forgot-password"
              className="text-xs text-primary hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
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
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </button>
        <div className="flex flex-col items-center gap-2">
          <span className="text-gray-500">or</span>
          <GoogleSignInButton />
        </div>
      </form>
    </div>
  );
}
