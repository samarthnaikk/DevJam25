// JWT utilities for Edge Runtime (middleware compatible)
// Separated from auth-utils to avoid bcrypt dependency in middleware

import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-key";

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
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload &
      JWTPayload;
    return {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
      username: decoded.username,
      name: decoded.name,
    };
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}

// Cookie utilities
export function createSecureCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/",
  };
}
