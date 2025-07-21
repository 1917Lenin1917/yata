"use server";

import { db } from "@/db/drizzle";
import { getCurrentUser } from "@/services/user";
import { eq } from "drizzle-orm";
import { projects, users } from "@/db/schema";
import {
  mapDtoToProject,
  mapDtoToProjectWithTickets,
} from "@/services/mappers";

export const getCurrentUserProjects = async () => {
  const user = await getCurrentUser();
  if (!user) return [];

  const data = await db.query.users.findFirst({
    where: eq(users.id, user.id),
    with: {
      projects: true,
    },
  });

  return data?.projects?.map(mapDtoToProject) || [];
};

export const getProjectWithTickets = async (projectId: number) => {
  try {
    const data = await db.query.projects.findFirst({
      with: {
        tickets: {
          with: {
            author: true,
            properties: {
              with: {
                property: true,
              },
            },
          },
        },
      },
      where: eq(projects.id, projectId),
    });

    return data ? mapDtoToProjectWithTickets(data) : null;
  } catch {
    return null;
  }
};

interface CreateNewProjectPayload {
  name: string;
  description: string;
  emoji: string;
}

export const createNewProject = async (payload: CreateNewProjectPayload) => {
  const author = await getCurrentUser();

  if (!author) return;

  await db.insert(projects).values({
    name: payload.name,
    description: payload.description,
    emoji: payload.description,
    authorId: author.id,
  });
};
