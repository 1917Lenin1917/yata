import NextAuth from "next-auth";
import { getUser } from "@/services/user";
import authConfig from "./auth.config";

async function getUserAction(email: string, password: string) {
  "use server";
  return await getUser(email, password);
}

export const { handlers, auth } = NextAuth({
  ...authConfig,
  // real credential check that hits the DB
  providers: [
    {
      ...authConfig.providers[0],
      authorize: async (credentials) => {
        const user = await getUserAction(
          (credentials.email as string) || "",
          (credentials.password as string) || "",
        );

        return user;
      },
    },
  ],
});
