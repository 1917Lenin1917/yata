"use client";

import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Plus } from "lucide-react";
import { createNewProject } from "@/services/project";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function NewProject() {
  const router = useRouter();
  const { t } = useTranslation();

  const onCreateProjectClick = async () => {
    await createNewProject({
      name: "",
      emoji: "",
      description: "",
    });
    router.refresh();
  };

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        onClick={onCreateProjectClick}
        className={"cursor-pointer"}
      >
        <Plus /> {t("sidebar.create_project")}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
