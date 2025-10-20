import NextAuth from "next-auth";
import { createUser, getUser, getUserByEmail } from "@/services/user";
import authConfig from "./auth.config";

async function getUserByEmailAction(email: string) {
  "use server";
  return await getUserByEmail(email);
}

async function getUserAction(email: string, password: string) {
  "use server";
  return await getUser(email, password);
}

async function createUserAction(
  email: string,
  firstName: string,
  lastName: string,
) {
  "use server";
  return await createUser({
    email,
    firstName,
    lastName,
    password: "google",
  });
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  callbacks: {
    async signIn({ user, account }) {
      // if (account?.provider !== "google") return true;
      if (!user.email) return false;

      if (account?.provider === "credentials") {
        if (!("password" in user)) return false;

        const existing = await getUserAction(
          user.email,
          user.password as string,
        );
        return !!existing;
      } else {
        const existing = await getUserByEmailAction(user.email);
        if (!existing) {
          const [firstName, lastName] = user.name?.split(" ") || "";
          await createUserAction(user.email, firstName || "", lastName || "");
        }
        return true;
      }
    },
  },
});
