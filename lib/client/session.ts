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
      console.log("SessionManager: Fetching session from /api/auth");

      // Log all cookies that the browser currently has
      console.log("SessionManager: Document cookies:", document.cookie);

      const response = await fetch("/api/auth", {
        method: "GET",
        credentials: "include", // Include cookies
        headers: {
          "Cache-Control": "no-cache", // Ensure fresh request
        },
      });

      console.log("SessionManager: Auth response status:", response.status);

      if (response.ok) {
        const data = await response.json();
        console.log("SessionManager: Auth response data:", data);
        // Handle the success/user format from auth endpoint
        if (data.success && data.user) {
          return data.user;
        }
        return data.user || null;
      } else {
        // Log the error response
        try {
          const errorData = await response.json();
          console.error("SessionManager: Auth error response:", errorData);

          // If token is invalid, try to sign out to clear the token
          if (response.status === 401) {
            console.log(
              "SessionManager: Invalid token detected, clearing session"
            );
            await this.signOut();
          }
        } catch (e) {
          console.error("SessionManager: Could not parse error response");
        }
      }

      return null;
    } catch (error) {
      console.error("SessionManager: Failed to get session:", error);
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

  // Add a method to refresh the session (useful after login)
  static async refreshSession(): Promise<UserSession | null> {
    // Force a fresh session check
    return await this.getSession();
  }

  // Add a debugging method to check cookie state
  static debugCookies(): void {
    console.log("SessionManager Debug - Document cookies:", document.cookie);
    console.log("SessionManager Debug - All available cookies:");
    document.cookie.split(";").forEach((cookie) => {
      const [name, value] = cookie.trim().split("=");
      console.log(`  ${name}: ${value ? "present" : "empty"}`);
    });
  }
}
