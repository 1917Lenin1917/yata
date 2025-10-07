"use client";

import { useState } from "react";
import type { ProjectWithTickets } from "@/types/project";
import { Separator } from "@/components/ui/separator";
import { ProjectContext } from "@/contexts/ProjectContext";
import DisplaySelectEmoji from "@/components/DisplaySelectEmoji";
import { updateProjectEmoji } from "@/services/project";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { StarIcon } from "lucide-react";

interface Props {
  project: ProjectWithTickets;
}

export default function ProjectPage({ project }: Props) {
  const [isStarred, setIsStarred] = useState(false);
  const { t } = useTranslation();
  const router = useRouter();

  const handleUpdateEmoji = async (newEmoji: string) => {
    await updateProjectEmoji(
      project.id,
      project.emoji === newEmoji ? "" : newEmoji,
    );
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
        {isStarred && (
          <StarIcon
            onClick={() => setIsStarred(false)}
            fill={"yellow"}
            strokeWidth={0}
            className={"size-10"}
          />
        )}
        {!isStarred && (
          <StarIcon onClick={() => setIsStarred(true)} className={"size-10"} />
        )}
      </div>
      <div className={"px-16 py-2 text-xl"}>{project.description}</div>

      <Separator />
    </ProjectContext>
  );
}
