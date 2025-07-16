import NextAuth from "next-auth";
import Credentials from "@auth/core/providers/credentials";
import { getUser } from "@/services/user";
import authConfig from "./auth.config";

async function getUserAction(email, password) {
  "use server";
  console.log(email, password);
  return await getUser(email, password);
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  // real credential check that hits the DB
  providers: [
    {
      ...authConfig.providers[0],
      authorize: async (credentials) => {
        const user = await getUserAction(
          credentials.email,
          credentials.password,
        );

        console.log("from auth.ts", user);

        return user;
      },
    },
  ],
});
