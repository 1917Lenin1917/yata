import { getCurrentUser } from "@/services/user";
import {
  getCurrentUserFavoriteProjects,
  getCurrentUserProjects,
} from "@/services/project";
import AppSidebarInner from "@/components/AppSidebar/AppSidebarInner";

export default async function AppSidebar() {
  const user = await getCurrentUser();
  const favorites = await getCurrentUserFavoriteProjects();
  const projects = await getCurrentUserProjects();

  return (
    <AppSidebarInner user={user} favorites={favorites} projects={projects} />
  );
}
