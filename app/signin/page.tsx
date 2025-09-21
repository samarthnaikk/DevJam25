"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { GoogleSignInButton } from "@/components/google-sign-in-button"
import { SessionManager } from "@/lib/client/session"
import Link from "next/link"
import { Loader2 } from "lucide-react"

export default function SignInPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    identifier: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (error) setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

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
      })

      const data = await res.json()

      if (res.ok) {
        // Store user session with role for testing
        const userWithRole = {
          ...data.user,
          role: "admin", // For testing, add admin role
        }
        SessionManager.storeSession(userWithRole)

        console.log("Login successful, redirecting to admin...")
        window.location.href = `${window.location.origin}/admin`
      } else {
        setError(data.error || "Failed to sign in")
      }
    } catch (err) {
      console.error("Login error:", err)
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-start justify-center p-4 pt-16 relative overflow-hidden">
      <div className="w-full max-w-sm relative z-10 space-y-6">
        {/* Logo and Brand */}
        <div className="flex flex-col items-center space-y-4 mb-8">
          <div className="flex items-center justify-center">
            <div className="w-12 h-12 flex items-center justify-center">
              <img 
                src="/Screenshot 2025-09-21 at 12.36.07 PM.svg" 
                alt="Rvidia Logo" 
                className="w-12 h-12 object-contain"
              />
            </div>
          </div>
          <p className="text-white/70 text-lg">Sign in to Rvidia</p>
        </div>

        <GoogleSignInButton />
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-black px-3 text-white/50 font-medium">Or continue with email</span>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg backdrop-blur-sm">
            <span className="text-sm">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            id="identifier"
            name="identifier"
            type="text"
            value={form.identifier}
            onChange={handleChange}
            required
            disabled={isLoading}
            className="h-12 bg-white/5 backdrop-blur-sm text-white border-white/10 placeholder:text-white/40 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 rounded-lg transition-all"
            placeholder="Email or username"
          />
          
          <Input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            disabled={isLoading}
            className="h-12 bg-white/5 backdrop-blur-sm text-white border-white/10 placeholder:text-white/40 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 rounded-lg transition-all"
            placeholder="Password"
          />

          <div className="flex items-center justify-center">
            <Link 
              href="/forgot-password" 
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={isLoading}
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500/50 transition-all font-medium text-white border-0 rounded-lg shadow-lg"
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
  )
}
