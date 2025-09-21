"use client";

// Enhanced session management using HTTP-only cookies with JWT tokens
// Provides secure authentication with server-side verification

interface UserSession {
  id: number | string;
  email: string;
  name?: string;
  role?: string;
  username?: string;
}

export class SessionManager {
  // Get current session from server
  static async getSession(): Promise<UserSession | null> {
    try {
      const response = await fetch("/api/auth", {
        method: "GET",
        credentials: "include", // Include cookies
      });

      if (response.ok) {
        const data = await response.json();
        // Handle the success/user format from auth endpoint
        if (data.success && data.user) {
          return data.user;
        }
        return data.user || null;
      }

      return null;
    } catch (error) {
      console.error("Failed to get session:", error);
      return null;
    }
  }

  // Check if user is authenticated (async now)
  static async isAuthenticated(): Promise<boolean> {
    const session = await this.getSession();
    return !!session;
  }

  // Sign out (clears server-side cookie)
  static async signOut(): Promise<void> {
    try {
      await fetch("/api/auth", {
        method: "DELETE",
        credentials: "include",
      });
    } catch (error) {
      console.error("Failed to sign out:", error);
    }
  }

  // Legacy methods for backward compatibility
  // These now work with the new cookie-based system

  // Store user session (now handled by API)
  static storeSession(userData: UserSession): void {
    // This is now handled by the signin/signup APIs
    // Keep this method for compatibility but it doesn't do anything
    console.warn(
      "storeSession is deprecated - sessions are now managed via HTTP-only cookies"
    );
  }

  // Clear session (calls the new signOut method)
  static clearSession(): void {
    this.signOut();
  }
}
