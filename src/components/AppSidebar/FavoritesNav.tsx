import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { MoreHorizontal } from "lucide-react";
import type { Project } from "@/types/project";

interface Props {
  projects: Project[];
}

export default function FavoritesNav({ projects }: Props) {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Favorites</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild>
              <Link href={`/projects/${item.id}`} title={item.name}>
                <span>{item.emoji}</span>
                <span>{item.name}</span>
              </Link>
            </SidebarMenuButton>
            {/*<DropdownMenu>*/}
            {/*  <DropdownMenuTrigger asChild>*/}
            {/*    <SidebarMenuAction showOnHover>*/}
            {/*      <MoreHorizontal />*/}
            {/*      <span className="sr-only">More</span>*/}
            {/*    </SidebarMenuAction>*/}
            {/*  </DropdownMenuTrigger>*/}
            {/*  <DropdownMenuContent*/}
            {/*    className="w-56 rounded-lg"*/}
            {/*    side={isMobile ? "bottom" : "right"}*/}
            {/*    align={isMobile ? "end" : "start"}*/}
            {/*  >*/}
            {/*    <DropdownMenuItem>*/}
            {/*      <StarOff className="text-muted-foreground" />*/}
            {/*      <span>Remove from Favorites</span>*/}
            {/*    </DropdownMenuItem>*/}
            {/*    <DropdownMenuSeparator />*/}
            {/*    <DropdownMenuItem>*/}
            {/*      <Link className="text-muted-foreground" />*/}
            {/*      <span>Copy Link</span>*/}
            {/*    </DropdownMenuItem>*/}
            {/*    <DropdownMenuItem>*/}
            {/*      <ArrowUpRight className="text-muted-foreground" />*/}
            {/*      <span>Open in New Tab</span>*/}
            {/*    </DropdownMenuItem>*/}
            {/*    <DropdownMenuSeparator />*/}
            {/*    <DropdownMenuItem>*/}
            {/*      <Trash2 className="text-muted-foreground" />*/}
            {/*      <span>Delete</span>*/}
            {/*    </DropdownMenuItem>*/}
            {/*  </DropdownMenuContent>*/}
            {/*</DropdownMenu>*/}
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <MoreHorizontal />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}
