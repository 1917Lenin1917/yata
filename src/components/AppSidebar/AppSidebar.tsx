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
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useContext } from "react";
import { AuthContext } from "@/contexts/AuthContext";
import { formatUser, getInitials } from "@/utils";
import { signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const handleLogout = async () => {
  signOut();
};

export default function AppSidebar() {
  const { user } = useContext(AuthContext);

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenuButton className="h-fit font-semibold text-sm">
          <div>My todo app!</div>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent></SidebarContent>
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
              <Button onClick={handleLogout} variant="ghost">
                <LogOut className="ml-auto stroke-destructive w-[16px] h-[16px]" />
              </Button>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}
