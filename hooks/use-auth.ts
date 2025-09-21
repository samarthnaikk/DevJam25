"use client";

import { useState, useEffect } from "react";
import { GoogleAuth, type User } from "@/lib/auth";
import { SessionManager } from "@/lib/client/session";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    const auth = GoogleAuth.getInstance();

    // Check SessionManager first for regular login
    const sessionUser = SessionManager.getSession();
    if (sessionUser) {
      setUser({
        id: sessionUser.id?.toString() || "",
        email: sessionUser.email,
        name: sessionUser.name || "",
        image: "/placeholder.svg?height=40&width=40",
        role: (sessionUser.role?.toUpperCase() as "ADMIN" | "USER") || "USER",
      });
      setLoading(false);
      return;
    }

    // Then check Google Auth
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async () => {
    setSigningIn(true);
    try {
      const auth = GoogleAuth.getInstance();
      await auth.signIn();
    } catch (error) {
      console.error("Sign in failed:", error);
    } finally {
      setSigningIn(false);
    }
  };

  const signOut = async () => {
    // Clear both authentication systems
    SessionManager.clearSession();
    const auth = GoogleAuth.getInstance();
    await auth.signOut();
    setUser(null);
  };

  return {
    user,
    loading,
    signingIn,
    signIn,
    signOut,
    isAuthenticated: !!user,
    isAdmin: user?.role === "admin" || user?.role === "ADMIN",
  };
}
