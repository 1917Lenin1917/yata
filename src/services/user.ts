"use server";

import { db } from "@/db/drizzle";
import { and, eq } from "drizzle-orm";
import { users } from "@/db/schema";
import { auth } from "@/auth";
import { mapDtoToUser } from "@/services/mappers";
import * as fs from "node:fs";
import { NGINX_FILES_PATH } from "@/constants/images";

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

export async function createUser(
  firstName: string,
  lastName: string,
  email: string,
  password: string,
) {
  await db.insert(users).values({
    firstName,
    lastName,
    email,
    password,
  });
}

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
