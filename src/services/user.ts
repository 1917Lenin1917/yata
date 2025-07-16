"use server";

import { db } from "@/db/drizzle";
import { and, eq, type InferSelectModel } from "drizzle-orm";
import { users } from "@/db/schema";
import type { User } from "@/types/user";
import { auth } from "@/auth";

type DtoUser = InferSelectModel<typeof users>;

const mapDtoToUser = (dto: DtoUser): User => ({
  id: dto.id,
  email: dto.email || "",
  firstName: dto.firstName || "",
  lastName: dto.lastName || "",
});

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
