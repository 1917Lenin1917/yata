"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import type { ProjectWithPages } from "@/types/project";
import NewProject from "@/components/AppSidebar/NewProject";
import { useTranslation } from "react-i18next";
import ProjectsNavCollapsible from "@/components/AppSidebar/ProjectsNavCollapsible";

interface Props {
  projects: ProjectWithPages[];
}

export default function ProjectsNav({ projects }: Props) {
  const { t } = useTranslation();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>{t("sidebar.projects")}</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <ProjectsNavCollapsible project={item} key={item.id} />
        ))}
        <NewProject />
      </SidebarMenu>
    </SidebarGroup>
  );
}
