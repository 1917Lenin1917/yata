"use server";

import { db } from "@/db/drizzle";
import { getCurrentUser } from "@/services/user";
import { and, eq } from "drizzle-orm";
import {
  projects,
  properties,
  propertyInstances,
  tickets,
  userFavoriteProjects,
  users,
} from "@/db/schema";
import {
  mapDtoToProjectWithPages,
  mapDtoToProjectWithTickets,
} from "@/services/mappers";
import type { Property } from "@/types/property";

export const getCurrentUserFavoriteProjects = async () => {
  const user = await getCurrentUser();
  if (!user) return [];

  const data = await db.query.userFavoriteProjects.findMany({
    where: eq(userFavoriteProjects.userId, user.id),
    with: {
      project: {
        with: {
          pages: {
            with: {
              author: true,
            },
          },
          userFavoriteProjects: {
            where: eq(userFavoriteProjects.userId, user.id),
          },
        },
      },
    },
  });

  return (
    data?.map((fav) =>
      mapDtoToProjectWithPages({
        ...fav.project,
        isFavorite: fav.project.userFavoriteProjects.length > 0,
      }),
    ) || []
  );
};

export const getCurrentUserProjects = async () => {
  const user = await getCurrentUser();
  if (!user) return [];

  const data = await db.query.users.findFirst({
    where: eq(users.id, user.id),
    with: {
      projects: {
        with: {
          pages: {
            with: {
              author: true,
            },
          },
          userFavoriteProjects: {
            where: eq(userFavoriteProjects.userId, user.id),
          },
        },
      },
    },
  });

  return (
    data?.projects?.map((project) =>
      mapDtoToProjectWithPages({
        ...project,
        isFavorite: project.userFavoriteProjects.length > 0,
      }),
    ) || []
  );
};

export const getProjectWithTickets = async (projectId: number) => {
  const author = await getCurrentUser();
  if (!author) return;

  try {
    const data = await db.query.projects.findFirst({
      with: {
        properties: true,
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
        userFavoriteProjects: {
          where: eq(userFavoriteProjects.userId, author.id),
        },
      },
      where: eq(projects.id, projectId),
    });

    return data
      ? mapDtoToProjectWithTickets({
          ...data,
          isFavorite: data.userFavoriteProjects.length > 0,
        })
      : null;
  } catch (e) {
    console.error(e);
    return null;
  }
};

// export const getProjectWithPages = async (projectId: number) => {
//   try {
//     const data = await db.query.projects.findFirst({
//       with: {
//         properties: true,
//         pages: {
//           with: {
//             author: true,
//           },
//         },
//         userFavoriteProjects: {
//           where: eq(userFavoriteProjects.userId, currentUs.id),
//         },
//       },
//       where: eq(projects.id, projectId),
//     });
//
//     return data ? mapDtoToProjectWithPages(data) : null;
//   } catch (e) {
//     console.error(e);
//     return null;
//   }
// };

interface CreateNewProjectPayload {
  name: string;
  description: string;
  emoji: string;
}

export const updateProjectEmoji = async (
  projectId: number,
  newEmoji: string,
) => {
  await db
    .update(projects)
    .set({
      emoji: newEmoji,
    })
    .where(eq(projects.id, projectId));
};

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

export const createProjectProperty = async (
  iconName: string,
  propertyType: Property["type"],
  projectId: number,
  settings: string,
) => {
  const property = (
    await db
      .insert(properties)
      .values({
        icon: iconName,
        type: propertyType,
        projectId: projectId,
        name: "",
        showOnTicketCard: false,
        settings: settings,
      })
      .returning()
  )[0];

  const projectTickets = await db.query.tickets.findMany({
    where: eq(tickets.projectId, projectId),
  });

  await db.insert(propertyInstances).values(
    projectTickets.map((ticket) => ({
      ticketId: ticket.id,
      propertyId: property.id,
      value: "",
    })),
  );
};

export const changePropertySettings = async (
  propertyId: number,
  newSettings: object,
) => {
  await db
    .update(properties)
    .set({
      settings: newSettings,
    })
    .where(eq(properties.id, propertyId));
};

export const changeStatusValue = async (
  propertyId: number,
  oldValue: string,
  newValue: string,
  newSettings: object,
) => {
  await changePropertySettings(propertyId, newSettings);
  await db
    .update(propertyInstances)
    .set({
      value: newValue,
    })
    .where(eq(propertyInstances.value, oldValue));
};

export const deleteProperty = async (propertyId: number) => {
  await db.transaction(async (tx) => {
    await tx
      .delete(propertyInstances)
      .where(eq(propertyInstances.propertyId, propertyId));

    await tx.delete(properties).where(eq(properties.id, propertyId));
  });
};

export const changeVisibility = async (
  propertyId: number,
  newValue: boolean,
) => {
  await db
    .update(properties)
    .set({
      showOnTicketCard: newValue,
    })
    .where(eq(properties.id, propertyId));
};

export const favoriteProject = async (projectId: number) => {
  const user = await getCurrentUser();
  if (!user) return;

  await db.insert(userFavoriteProjects).values({
    userId: user.id,
    projectId: projectId,
  });
};

export const unfavoriteProject = async (projectId: number) => {
  const user = await getCurrentUser();
  if (!user) return;

  await db
    .delete(userFavoriteProjects)
    .where(
      and(
        eq(userFavoriteProjects.userId, user.id),
        eq(userFavoriteProjects.projectId, projectId),
      ),
    );
};
