"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/src/contexts";
import { getSessionAction } from "@/app/actions/session";
import {
  mapLoginResponseToUser,
  createSession,
} from "@/lib/mappers/auth.mapper";
import { setToken, getToken } from "@/lib/auth/tokens";
import { setTokenGetter } from "@/lib/api/client";

interface AuthHydratorProps {
  children: ReactNode;
}

export function AuthHydrator({ children }: AuthHydratorProps) {
  const router = useRouter();
  const { user, setUser, setSession } = useUserContext();
  const [hydrated, setHydrated] = useState(() => !!user);

  useEffect(() => {
    // If user is already in context (e.g. just logged in), no need to hydrate
    if (user) return;

    let cancelled = false;

    async function hydrateSession() {
      const result = await getSessionAction();

      if (cancelled) return;

      if (!result.success || !result.data) {
        router.replace("/login");
        return;
      }

      // Restore in-memory token for client-side API calls
      setToken(result.data.token);
      setTokenGetter(getToken);

      // Restore full user profile if available from cookie
      if (result.data.userProfile) {
        const mappedUser = mapLoginResponseToUser(result.data.userProfile);
        setUser(mappedUser);
        setSession(createSession());
      } else {
        // Profile cookie missing but token exists — inconsistent state.
        // Re-authenticate rather than creating a session with empty fields.
        router.replace("/login");
        return;
      }

      setHydrated(true);
    }

    hydrateSession();

    return () => {
      cancelled = true;
    };
  }, [user, router, setUser, setSession]);

  // Show loading spinner until user is available (either from login or hydration)
  if (!user && !hydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-brand-light-blue">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-navy" />
      </div>
    );
  }

  return <>{children}</>;
}
