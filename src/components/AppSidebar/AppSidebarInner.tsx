"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import ProjectsNav from "@/components/AppSidebar/ProjectsNav";
import LangSwitcher from "@/components/LangSwitcher";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IMAGES_URL } from "@/constants/images";
import { formatUser, getInitials } from "@/utils";
import LogOutButton from "@/components/AppSidebar/LogOutButton";
import SidebarDrag from "@/components/AppSidebar/SidebarDrag";
import type { User } from "@/types/user";
import type { ProjectWithPages } from "@/types/project";

interface Props {
  user: User | null;
  favorites: ProjectWithPages[];
  projects: ProjectWithPages[];
}
export default function AppSidebarInner({ user, favorites, projects }: Props) {
  const { ref } = useSidebar();

  return (
    <>
      <Sidebar>
        <SidebarHeader>
          <SidebarMenuButton className="h-fit flex-col items-start gap-0">
            <div className={"font-semibold text-sm"}>YATA</div>
            <div className={"font-medium text-xs text-muted-foreground"}>
              Yet Another Todo App
            </div>
          </SidebarMenuButton>
        </SidebarHeader>
        <SidebarContent>
          {!!favorites.length && (
            <ProjectsNav
              groupLabel={"sidebar.favorites"}
              projects={favorites}
            />
          )}
          <ProjectsNav
            groupLabel={"sidebar.projects"}
            projects={projects}
            showCreateNewProject
          />
        </SidebarContent>
        <SidebarFooter>
          <SidebarGroup>
            <SidebarMenu className={"gap-4"}>
              <SidebarMenuItem className={"flex justify-between"}>
                <LangSwitcher />
                <ThemeSwitcher />
              </SidebarMenuItem>
              <SidebarMenuItem className="flex justify-between">
                <SidebarMenuButton asChild>
                  <Link href={"/settings"}>
                    <Avatar>
                      <AvatarImage src={`${IMAGES_URL}/${user?.avatar}`} />
                      <AvatarFallback delayMs={500}>
                        {user ? getInitials(user) : null}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-sm font-semibold text-center h-fit self-center">
                      {user ? formatUser(user) : null}
                    </div>
                  </Link>
                </SidebarMenuButton>

                <LogOutButton />
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarFooter>
      </Sidebar>
      <SidebarDrag
        minWidth={260}
        maxWidth={500}
        sidebarRef={ref}
        saveToCookie
      />
    </>
  );
}
