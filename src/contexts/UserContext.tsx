"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { User, Session } from "@/src/types";

interface UserContextType {
  user: User | null;
  session: Session | null;
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Mock data for development
const mockUser: User = {
  firstName: "Camilo",
  lastName: "Castellanos",
  documentType: "CC",
  documentNumber: "1234567890",
  email: "camilo@example.com",
};

const mockSession: Session = {
  lastLogin: new Date("2026-08-25T08:34:00"),
  currentLogin: new Date("2026-10-25T08:34:00"),
  ipAddress: "192.168.0.1",
};

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(mockUser);
  const [session, setSession] = useState<Session | null>(mockSession);

  const logout = () => {
    setUser(null);
    setSession(null);
    // TODO: Clear JWT, redirect to login
  };

  return (
    <UserContext.Provider
      value={{ user, session, setUser, setSession, logout }}
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
