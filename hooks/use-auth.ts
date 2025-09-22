"use client";

import { useState, useEffect } from "react";
import { GoogleAuth, type User } from "@/lib/auth";
import { SessionManager } from "@/lib/client/session";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [signingIn, setSigningIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check for JWT session first (new secure method)
        const sessionUser = await SessionManager.getSession();
        if (sessionUser) {
          setUser({
            id: sessionUser.id?.toString() || "",
            email: sessionUser.email,
            name: sessionUser.name || "",
            image: "/placeholder.svg?height=40&width=40",
            role:
              (sessionUser.role?.toUpperCase() as "ADMIN" | "USER") || "USER",
            username: sessionUser.username,
          });
          setLoading(false);
          return;
        }

        // Fallback to Google Auth for existing sessions
        const auth = GoogleAuth.getInstance();
        const googleUser = auth.getCurrentUser();
        if (googleUser) {
          setUser(googleUser);
        }

        setLoading(false);
      } catch (error) {
        console.error("Auth check failed:", error);
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signIn = async () => {
    setSigningIn(true);
    try {
      const auth = GoogleAuth.getInstance();
      console.log("Initiating Google sign-in");
      await auth.signIn();
      // After Google signin, check for updated session
      const sessionUser = await SessionManager.getSession();
      console.log("Google sign-in successful");
      if (sessionUser) {
        setUser({
          id: sessionUser.id?.toString() || "",
          email: sessionUser.email,
          name: sessionUser.name || "",
          image: "/placeholder.svg?height=40&width=40",
          role: (sessionUser.role?.toUpperCase() as "ADMIN" | "USER") || "USER",
          username: sessionUser.username,
        });
      }
    } catch (error) {
      console.error("Sign in failed:", error);
    } finally {
      setSigningIn(false);
    }
  };

  const signOut = async () => {
    try {
      // Clear JWT session
      await SessionManager.signOut();
      // Clear Google auth
      const auth = GoogleAuth.getInstance();
      await auth.signOut();
      setUser(null);

      // Redirect to home page
      window.location.href = "/";
    } catch (error) {
      console.error("Sign out failed:", error);
    }
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
