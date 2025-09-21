"use client";

// Simple client-side session management using localStorage
// In a production app, you'd want to use cookies with HTTP-Only flag and server-side session management

interface UserSession {
  id: number | string;
  email: string;
  name?: string;
  role?: string;
}

export class SessionManager {
  private static readonly SESSION_KEY = "user_session";

  // Store user session
  static storeSession(userData: UserSession): void {
    localStorage.setItem(
      this.SESSION_KEY,
      JSON.stringify({
        ...userData,
        timestamp: Date.now(),
      })
    );
  }

  // Get current session
  static getSession(): UserSession | null {
    try {
      const sessionData = localStorage.getItem(this.SESSION_KEY);
      if (!sessionData) return null;
      return JSON.parse(sessionData);
    } catch (error) {
      console.error("Failed to parse session data:", error);
      return null;
    }
  }

  // Clear session (logout)
  static clearSession(): void {
    localStorage.removeItem(this.SESSION_KEY);
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return !!this.getSession();
  }
}
