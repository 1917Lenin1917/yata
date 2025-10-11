"use client";

import type { ProjectWithPages } from "@/types/project";
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

import DocumentCard from "@/components/DocumentCard";

interface Props {
  project: ProjectWithPages;
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
      <div className={"m-container flex flex-col gap-8"}>
        <div>
          <div className={"text-4xl relative flex justify-between"}>
            <DisplaySelectEmoji
              className={"absolute -translate-x-[100%]"}
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
          <div className={"text-xl"}>{project.description}</div>

          <Separator className={"mt-2"} />
        </div>

        <div className={"flex flex-col gap-4"}>
          {project.pages.map((page) => (
            <DocumentCard page={page} key={page.id} />
          ))}
        </div>
      </div>
    </ProjectContext>
  );
}
