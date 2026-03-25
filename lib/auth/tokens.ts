const AUTH_TOKEN_KEY = "auth-token";
const AUTH_TOKEN_MAX_AGE = 60 * 60; // 1 hour (matches backend JWT expiry)

/**
 * Client-side token storage using an in-memory variable.
 * Cookies are set server-side via Server Actions for HttpOnly security.
 * This in-memory store is used by the Axios client interceptor.
 */
let inMemoryToken: string | null = null;

export function getToken(): string | null {
  return inMemoryToken;
}

export function setToken(token: string | null): void {
  inMemoryToken = token;
}

export function clearToken(): void {
  inMemoryToken = null;
}

/**
 * Cookie operations for server-side use (Server Actions).
 * These create HttpOnly, Secure cookies for the auth token.
 */
export async function setAuthCookie(token: string): Promise<void> {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  cookieStore.set(AUTH_TOKEN_KEY, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: AUTH_TOKEN_MAX_AGE,
    path: "/",
  });
}

export async function getAuthCookie(): Promise<string | undefined> {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_TOKEN_KEY)?.value;
}

export async function clearAuthCookie(): Promise<void> {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_TOKEN_KEY);
  cookieStore.delete(USER_PROFILE_KEY);
}

/**
 * Store user profile data in a cookie for session hydration.
 * This is NOT HttpOnly since it's not sensitive auth data — it's display info
 * like name, email, etc. Stored as base64-encoded JSON.
 */
const USER_PROFILE_KEY = "user-profile";

export async function setUserProfileCookie(
  profile: Record<string, unknown>,
): Promise<void> {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const encoded = Buffer.from(JSON.stringify(profile)).toString("base64");
  cookieStore.set(USER_PROFILE_KEY, encoded, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: AUTH_TOKEN_MAX_AGE,
    path: "/",
  });
}

export async function getUserProfileCookie(): Promise<Record<
  string,
  unknown
> | null> {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const value = cookieStore.get(USER_PROFILE_KEY)?.value;
  if (!value) return null;
  try {
    return JSON.parse(Buffer.from(value, "base64").toString("utf-8"));
  } catch {
    return null;
  }
}

export { AUTH_TOKEN_KEY, AUTH_TOKEN_MAX_AGE };
