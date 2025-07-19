"use client";
import { AuthContext } from "@/contexts/AuthContext";
import { type ReactNode } from "react";
import type { User } from "@/types/user";

export default function AuthProvider({
  user,
  children,
}: {
  user: User | null;
  children: ReactNode;
}) {
  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
}
