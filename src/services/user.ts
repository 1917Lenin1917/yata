"use server";

import { db } from "@/db/drizzle";
import { eq } from "drizzle-orm";
import { users } from "@/db/schema";
import { auth } from "@/auth";
import { mapDtoToUser } from "@/services/mappers";
import * as fs from "node:fs";
import { NGINX_FILES_PATH } from "@/constants/images";
import type { User } from "@/types/user";
import { checkPassword, hashPassword } from "@/lib/password";

export const getUser = async (
  email: string,
  password: string,
): Promise<User | null> => {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user) return null;

  const samePassword = await checkPassword(password, user.password);

  return samePassword ? mapDtoToUser(user) : null;
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
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

type CreateUserPayload = {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
};
export const createUser = async (payload: CreateUserPayload): Promise<void> => {
  const hashedPassword = await hashPassword(payload.password);

  await db.insert(users).values({
    email: payload.email,
    firstName: payload.firstName,
    lastName: payload.lastName,
    password: hashedPassword,
  });
};

export async function updateUserName(
  userId: number,
  firstName: string,
  lastName: string,
) {
  await db
    .update(users)
    .set({
      firstName,
      lastName,
    })
    .where(eq(users.id, userId));
}

export async function updateUserAvatar(
  userId: number,
  filename: string,
  blob: Blob,
) {
  // todo: prob resize to 512x512 or even 128x128
  fs.writeFileSync(
    `${NGINX_FILES_PATH}/${filename}`,
    Buffer.from(await blob.arrayBuffer()),
  );

  await db
    .update(users)
    .set({
      avatarFilename: filename,
    })
    .where(eq(users.id, userId));
}
