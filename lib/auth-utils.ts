import bcrypt from "bcrypt";
import {
  generateJWT,
  verifyJWT,
  createSecureCookieOptions,
  type JWTPayload,
} from "./jwt-utils";
import { NextResponse } from "next/server";

const SALT_ROUNDS = 12;
const AUTH_COOKIE_NAME = "auth_token";

// Re-export JWT utilities for backward compatibility
export { generateJWT, verifyJWT, createSecureCookieOptions, type JWTPayload };

// Cookie management for authentication
export function setTokenCookie(response: NextResponse, token: string): void {
  const cookieOptions = createSecureCookieOptions();
  response.cookies.set(AUTH_COOKIE_NAME, token, cookieOptions);
}

export function clearTokenCookie(response: NextResponse): void {
  response.cookies.set(AUTH_COOKIE_NAME, "", {
    ...createSecureCookieOptions(),
    maxAge: 0,
  });
}

// Password hashing utilities (bcrypt-dependent, not usable in middleware)
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}
