// auth.config.ts  ––––– Edge‑safe
import Credentials from "@auth/core/providers/credentials";
import type { NextAuthConfig } from "next-auth";

export default {
  providers: [
    Credentials({
      credentials: { email: {}, password: {} },
    }),
  ],
} satisfies NextAuthConfig;
