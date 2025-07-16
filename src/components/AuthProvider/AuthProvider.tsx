"use client";
import { AuthContext } from "@/contexts/AuthContext";
import { type ReactNode, useEffect, useState } from "react";
import { getCurrentUser } from "@/services/user";
import type { User } from "@/types/user";

export default function AuthProvider({ children }: { children: ReactNode }) {
  // const user =  getCurrentUser(); // fetched on the server
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    getCurrentUser().then(setUser);
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
}
