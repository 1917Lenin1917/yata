import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { formatUser, getInitials } from "@/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ProjectsNav from "@/components/AppSidebar/ProjectsNav";
import { getCurrentUser } from "@/services/user";
import {
  getCurrentUserFavoriteProjects,
  getCurrentUserProjects,
} from "@/services/project";
import LogOutButton from "@/components/AppSidebar/LogOutButton";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import LangSwitcher from "@/components/LangSwitcher";
import Link from "next/link";
import { IMAGES_URL } from "@/constants/images";

export default async function AppSidebar() {
  const user = await getCurrentUser();
  const favorites = await getCurrentUserFavoriteProjects();
  const projects = await getCurrentUserProjects();

  return (
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
          <ProjectsNav groupLabel={"sidebar.favorites"} projects={favorites} />
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
  );
}
