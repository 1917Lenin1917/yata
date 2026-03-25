"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import type { ProjectWithNodes } from "@/types/project";
import NewProject from "@/components/AppSidebar/NewProject";
import { useTranslation } from "react-i18next";
import ProjectsNavCollapsible from "@/components/AppSidebar/ProjectsNavCollapsible";

interface Props {
  groupLabel: string;
  projects: ProjectWithNodes[];
  showCreateNewProject?: boolean;
}

export default function ProjectsNav({
  groupLabel,
  projects,
  showCreateNewProject,
}: Props) {
  const { t } = useTranslation();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>{t(groupLabel)}</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <ProjectsNavCollapsible project={item} key={item.id} />
        ))}
        {showCreateNewProject && <NewProject />}
      </SidebarMenu>
    </SidebarGroup>
  );
}
