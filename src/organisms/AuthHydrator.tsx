"use client";

import { useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useUserContext } from "@/src/contexts";
import { getSessionAction } from "@/app/actions/session";
import { setToken, getToken } from "@/lib/auth/tokens";
import { setTokenGetter } from "@/lib/api/client";

interface AuthHydratorProps {
  children: ReactNode;
}

export function AuthHydrator({ children }: AuthHydratorProps) {
  const router = useRouter();
  const { user, setUser, setSession } = useUserContext();
  const [isHydrating, setIsHydrating] = useState(!user);

  useEffect(() => {
    // If user is already in context, no need to hydrate
    if (user) {
      setIsHydrating(false);
      return;
    }

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

      // Set minimal user data from token claims
      setUser({
        firstName: "",
        lastName: "",
        documentType: "CC",
        documentNumber: result.data.documentNumber,
        email: "",
      });

      setSession({
        lastLogin: new Date(),
        currentLogin: new Date(),
        ipAddress: "",
      });

      setIsHydrating(false);
    }

    hydrateSession();

    return () => {
      cancelled = true;
    };
  }, [user, router, setUser, setSession]);

  if (isHydrating) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-brand-light-blue">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-navy" />
      </div>
    );
  }

  return <>{children}</>;
}
