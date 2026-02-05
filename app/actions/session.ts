'use server';

import { getAuthCookie } from '@/lib/auth/tokens';
import { parseTokenClaims, isTokenExpired } from '@/lib/auth/session';

interface SessionData {
  documentNumber: string;
  token: string;
  exp: number;
}

interface SessionResult {
  success: boolean;
  data?: SessionData;
}

/**
 * Server Action: Get the current session from the auth cookie.
 * Returns the JWT token and parsed claims for client-side hydration.
 */
export async function getSessionAction(): Promise<SessionResult> {
  const token = await getAuthCookie();

  if (!token) {
    return { success: false };
  }

  if (isTokenExpired(token)) {
    return { success: false };
  }

  const claims = parseTokenClaims(token);
  if (!claims) {
    return { success: false };
  }

  return {
    success: true,
    data: {
      documentNumber: claims.sub || '',
      token,
      exp: claims.exp || 0,
    },
  };
}
