"use client";

import type { ProjectWithTickets } from "@/types/project";
import { Separator } from "@/components/ui/separator";
import { ProjectContext } from "@/contexts/ProjectContext";
import DisplaySelectEmoji from "@/components/DisplaySelectEmoji";
import {
  favoriteProject,
  unfavoriteProject,
  updateProjectEmoji,
} from "@/services/project";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { StarIcon } from "lucide-react";

interface Props {
  project: ProjectWithTickets;
}

export default function ProjectPage({ project }: Props) {
  const { t } = useTranslation();
  const router = useRouter();

  const handleUpdateEmoji = async (newEmoji: string) => {
    await updateProjectEmoji(
      project.id,
      project.emoji === newEmoji ? "" : newEmoji,
    );
    router.refresh();
  };

  const onFavoriteClick = async () => {
    if (project.isFavorite) {
      await unfavoriteProject(project.id);
    } else {
      await favoriteProject(project.id);
    }
    router.refresh();
  };

  return (
    <ProjectContext value={project}>
      <div className={"px-16 text-4xl relative flex justify-between"}>
        <DisplaySelectEmoji
          className={"absolute left-[20px]"}
          currentEmoji={project.emoji}
          handleUpdateEmoji={handleUpdateEmoji}
        />
        <span>{project.name || t("project.empty")}</span>
        <StarIcon
          onClick={onFavoriteClick}
          fill={project.isFavorite ? "yellow" : undefined}
          strokeWidth={project.isFavorite ? 0 : undefined}
          className={"size-10 cursor-pointer"}
        />
      </div>
      <div className={"px-16 py-2 text-xl"}>{project.description}</div>

      <Separator />
    </ProjectContext>
  );
}
