"use server";

import { getAuthCookie, getUserProfileCookie } from "@/lib/auth/tokens";
import { parseTokenClaims, isTokenExpired } from "@/lib/auth/session";
import type { LoginResponse } from "@/types/api/auth";

interface SessionData {
  token: string;
  exp: number;
  userProfile: Omit<LoginResponse, "token"> | null;
}

interface SessionResult {
  success: boolean;
  data?: SessionData;
}

/**
 * Server Action: Get the current session from the auth cookie.
 * Returns the JWT token, parsed claims, and stored user profile for hydration.
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

  const profileData = await getUserProfileCookie();

  return {
    success: true,
    data: {
      token,
      exp: claims.exp || 0,
      userProfile: profileData as Omit<LoginResponse, "token"> | null,
    },
  };
}
