import bcrypt from "bcrypt";
import {
  generateJWT,
  verifyJWT,
  createSecureCookieOptions,
  type JWTPayload,
} from "./jwt-utils";

const SALT_ROUNDS = 12;

// Re-export JWT utilities for backward compatibility
export { generateJWT, verifyJWT, createSecureCookieOptions, type JWTPayload };

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
