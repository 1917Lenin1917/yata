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
import { getCurrentUserProjects } from "@/services/project";
import LogOutButton from "@/components/AppSidebar/LogOutButton";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import LangSwitcher from "@/components/LangSwitcher";

export default async function AppSidebar() {
  const user = await getCurrentUser();
  const projects = await getCurrentUserProjects();

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenuButton className="h-fit font-semibold text-sm">
          <div>Placeholder App Name</div>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <ProjectsNav projects={projects} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarGroup>
          <SidebarMenu className={"gap-4"}>
            <SidebarMenuItem className={"flex justify-between"}>
              <LangSwitcher />
              <ThemeSwitcher />
            </SidebarMenuItem>
            <SidebarMenuItem className="flex justify-between">
              <Avatar>
                <AvatarImage src={"https://cataas.com/cat"} />
                <AvatarFallback delayMs={500}>
                  {user ? getInitials(user) : null}
                </AvatarFallback>
              </Avatar>
              <div className="text-sm font-semibold text-center h-fit self-center">
                {user ? formatUser(user) : null}
              </div>

              <LogOutButton />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}
