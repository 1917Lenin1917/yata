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
import FavoritesNav from "@/components/AppSidebar/FavoritesNav";
import { getCurrentUser } from "@/services/user";
import { getCurrentUserProjects } from "@/services/project";
import LogOutButton from "@/components/AppSidebar/LogOutButton";

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
        <FavoritesNav projects={projects} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarGroup>
          <SidebarMenu>
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
