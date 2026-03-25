"use server";

import { db } from "@/db/drizzle";
import { pages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { mapDtoToPageWithContent } from "@/services/mappers";
import { createNode } from "@/services/nodes";

interface CreatePageParams {
  projectId: number;
  parentId?: number | null;
  name: string;
  description: string;
  content: string;
}
export const createPage = async (payload: CreatePageParams) => {
  const node = await createNode({
    projectId: payload.projectId,
    parentId: payload.parentId ?? null,
    type: "page",
    title: payload.name,
  });

  if (!node) return;

  await db
    .update(pages)
    .set({
      description: payload.description,
      text: payload.content,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(pages.nodeId, node.id));
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
