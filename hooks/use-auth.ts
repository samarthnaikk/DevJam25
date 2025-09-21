"use client"

import { useState, useEffect } from "react"
import { GoogleAuth, type User } from "@/lib/auth"

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [signingIn, setSigningIn] = useState(false)

  useEffect(() => {
    const auth = GoogleAuth.getInstance()
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user)
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const signIn = async () => {
    setSigningIn(true)
    try {
      const auth = GoogleAuth.getInstance()
      await auth.signIn()
    } catch (error) {
      console.error("Sign in failed:", error)
    } finally {
      setSigningIn(false)
    }
  }

  const signOut = async () => {
    const auth = GoogleAuth.getInstance()
    await auth.signOut()
  }

  return {
    user,
    loading,
    signingIn,
    signIn,
    signOut,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin",
  }
}
