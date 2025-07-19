"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import type { Project } from "@/types/project";
import NewProject from "@/components/AppSidebar/NewProject";
import { useTranslation } from "react-i18next";

interface Props {
  projects: Project[];
}

export default function ProjectsNav({ projects }: Props) {
  const { t } = useTranslation();
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>{t("sidebar.projects")}</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <Link href={`/projects/${item.id}`} title={item.name}>
                <span>{item.emoji}</span>
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
        <NewProject />
      </SidebarMenu>
    </SidebarGroup>
  );
}
