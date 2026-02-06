"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { User, Session } from "@/src/types";
import type { LoginResponse } from "@/types/api/auth";
import { mapLoginResponseToUser, createSession } from "@/lib/mappers/auth.mapper";
import { setToken, clearToken, getToken } from "@/lib/auth/tokens";
import { setTokenGetter } from "@/lib/api/client";
import { logoutAction } from "@/app/actions/auth";

interface UserContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  login: (userData: Omit<LoginResponse, "token">, token: string) => void;
  logout: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  const login = useCallback(
    (userData: Omit<LoginResponse, "token">, token: string) => {
      const mappedUser = mapLoginResponseToUser(userData);
      setToken(token);
      setTokenGetter(getToken);
      setUser(mappedUser);
      setSession(createSession());
    },
    [],
  );

  const logout = useCallback(async () => {
    await logoutAction();
    clearToken();
    setUser(null);
    setSession(null);
  }, []);

  const isAuthenticated = !!user;

  return (
    <UserContext.Provider
      value={{ user, session, isAuthenticated, setUser, setSession, login, logout }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUserContext() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUserContext must be used within UserProvider");
  }
  return context;
}
