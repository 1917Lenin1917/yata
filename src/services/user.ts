"use server";

import { db } from "@/db/drizzle";
import { and, eq } from "drizzle-orm";
import { users } from "@/db/schema";
import { auth } from "@/auth";
import { mapDtoToUser } from "@/services/mappers";

export const getUser = async (email: string, password: string) => {
  const user = await db.query.users.findFirst({
    where: and(eq(users.email, email), eq(users.password, password)),
  });

  return user ? mapDtoToUser(user) : null;
};

export async function getCurrentUser() {
  const session = await auth();
  if (!session?.user?.email) return null;

  const data = await db.query.users.findFirst({
    where: eq(users.email, session.user.email),
  });

  return data ? mapDtoToUser(data) : null;
}
