// JWT utilities for Edge Runtime (middleware compatible)
// Separated from auth-utils to avoid bcrypt dependency in middleware

import jwt from "jsonwebtoken";

// Get JWT secret from environment variable, with fallback
const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key";

// For debugging, but ensure we don't log the full secret
const secretLength = JWT_SECRET?.length || 0;
console.log(
  `JWT_SECRET (length: ${secretLength}, first 5 chars: ${
    JWT_SECRET?.substring(0, 5) || "not set"
  })`
);

// Legacy secret for backward compatibility (if tokens were signed with a different secret)
// This helps with migration without forcing all users to log in again
const LEGACY_JWT_SECRET = "k93DiT8TYYgCdkSotb2pIvKR8MTjKYEEoJLjfEcek2I=";

export interface JWTPayload {
  userId: string | number;
  email: string;
  role: string;
  username?: string;
  name?: string;
}

export function generateJWT(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "7d",
    issuer: "gpu-task-manager",
    subject: payload.userId.toString(),
  });
}

export function verifyJWT(token: string): JWTPayload | null {
  try {
    // First try with current secret
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload &
        JWTPayload;
      return {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
        username: decoded.username,
        name: decoded.name,
      };
    } catch (primaryError) {
      // If verification fails with current secret, try with legacy secret
      if (
        primaryError instanceof jwt.JsonWebTokenError &&
        primaryError.message === "invalid signature"
      ) {
        console.log(
          "JWT verification failed with primary secret, trying legacy secret"
        );

        try {
          const decoded = jwt.verify(
            token,
            LEGACY_JWT_SECRET
          ) as jwt.JwtPayload & JWTPayload;
          console.log("JWT verified successfully with legacy secret");
          return {
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role,
            username: decoded.username,
            name: decoded.name,
          };
        } catch (legacyError) {
          console.error(
            "JWT verification failed with legacy secret too:",
            legacyError
          );
          throw primaryError; // Rethrow the original error
        }
      }

      // If it's not a signature error or legacy verification failed, rethrow
      throw primaryError;
    }
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}

// Cookie utilities
export function createSecureCookieOptions() {
  const isProduction = process.env.NODE_ENV === "production";

  return {
    httpOnly: true,
    secure: isProduction, // Only require HTTPS in production
    sameSite: isProduction ? ("strict" as const) : ("lax" as const), // More lenient in development
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/",
    domain: isProduction ? undefined : undefined, // Let browser handle domain in dev
  };
}
