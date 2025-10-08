"use server";

import { db } from "@/db/drizzle";
import { pages } from "@/db/schema";
import { getCurrentUser } from "@/services/user";
import { eq } from "drizzle-orm";
import { mapDtoToPageWithContent } from "@/services/mappers";

interface CreatePageParams {
  projectId: number;
  name: string;
  description: string;
  content: string;
}
export const createPage = async (payload: CreatePageParams) => {
  const author = await getCurrentUser();
  if (!author) return; // TODO: throw err

  await db.insert(pages).values({
    projectId: payload.projectId,
    authorId: author.id,
    name: payload.name,
    description: payload.description,
    text: payload.content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
};

export const getPage = async (pageId: number) => {
  const data = await db.query.pages.findFirst({
    with: {
      author: true,
    },
    where: eq(pages.id, pageId),
  });
  return data ? mapDtoToPageWithContent(data) : null;
};

export const updatePageName = async (pageId: number, newName: string) => {
  await db
    .update(pages)
    .set({
      name: newName,
    })
    .where(eq(pages.id, pageId));
};

export const updatePageContent = async (pageId: number, newContent: string) => {
  await db
    .update(pages)
    .set({
      text: newContent,
    })
    .where(eq(pages.id, pageId));
};
