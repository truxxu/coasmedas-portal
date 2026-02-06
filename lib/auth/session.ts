import { getAuthCookie } from './tokens';

/**
 * Check if the user has a valid auth session (server-side).
 * Only checks cookie existence - does not validate the JWT.
 */
export async function hasSession(): Promise<boolean> {
  const token = await getAuthCookie();
  return !!token;
}

/**
 * Parse basic claims from a JWT without verification.
 * Useful for reading `sub` (document number) and `exp` (expiry).
 *
 * WARNING: This does NOT verify the signature. Only use for UI hints,
 * never for authorization decisions.
 */
export function parseTokenClaims(token: string): {
  iss?: string;
  sub?: string;
  exp?: number;
} | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch {
    return null;
  }
}

/**
 * Check if a JWT has expired based on its `exp` claim.
 */
export function isTokenExpired(token: string): boolean {
  const claims = parseTokenClaims(token);
  if (!claims?.exp) return true;
  return Date.now() >= claims.exp * 1000;
}
