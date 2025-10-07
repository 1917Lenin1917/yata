"use client";

import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import type { Project } from "@/types/project";
import NewProject from "@/components/AppSidebar/NewProject";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ChevronRightIcon, FolderIcon, PlusIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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
          <Collapsible className="group/icon" key={item.id}>
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton asChild>
                  <Link href={`/projects/${item.id}`} title={item.name}>
                    <div
                      className={
                        "size-4 shrink-0 flex items-center justify-center"
                      }
                    >
                      <span className={"group-hover/icon:opacity-0 absolute"}>
                        {item.emoji || <FolderIcon className={"size-4"} />}
                      </span>
                      <ChevronRightIcon
                        className={
                          "opacity-0 group-hover/icon:opacity-100 absolute size-4 transition-transform duration-200 group-data-[state=open]/icon:rotate-90"
                        }
                      />
                    </div>
                    <span
                      className={
                        "whitespace-nowrap overflow-hidden text-ellipsis"
                      }
                    >
                      {item.name || t("project.empty")}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <Button variant={"ghost"} className={"size-5 p-1"} asChild>
                <SidebarMenuAction showOnHover>
                  <PlusIcon />
                </SidebarMenuAction>
              </Button>
              <CollapsibleContent>
                <SidebarMenuSub>
                  <SidebarMenuSubItem
                    className={"text-muted-foreground text-sm"}
                  >
                    No pages
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ))}
        <NewProject />
      </SidebarMenu>
    </SidebarGroup>
  );
}
