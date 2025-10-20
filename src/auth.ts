import NextAuth from "next-auth";
import {
  createUser,
  getUser,
  getUserByEmail,
  updateUserAvatar,
} from "@/services/user";
import authConfig from "./auth.config";
import { pickExtensionFromContentType } from "@/lib/extensionFromContentType";

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
  avatarLink?: string,
) {
  "use server";

  const user = await createUser({
    email,
    firstName,
    lastName,
    password: "oauth",
    isOAuth: true,
  });

  if (avatarLink) {
    const response = await fetch(avatarLink, { cache: "no-store" });
    const avatarBlob = await response.blob();
    const contentType =
      response.headers.get("content-type") ||
      avatarBlob.type ||
      "application/octet-stream";
    const extension = pickExtensionFromContentType(contentType);

    await updateUserAvatar(
      user.id,
      `${user.id}-oauth-avatar.${extension}`,
      avatarBlob,
    );
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  callbacks: {
    async signIn({ user, account }) {
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
          await createUserAction(
            user.email,
            firstName || "",
            lastName || "",
            user.image ?? undefined,
          );
        }
        return true;
      }
    },
  },
});
