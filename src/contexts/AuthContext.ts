"use client";

import { createContext } from "react";
import type { User } from "@/types/user";

export const AuthContext = createContext<{
  user: User | null;
}>({
  user: null,
});
