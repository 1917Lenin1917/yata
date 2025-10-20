import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import type { ReactNode } from "react";
import { cookies } from "next/headers";

interface Props {
  children: ReactNode;
}

export default async function ProtectedLayout({ children }: Props) {
  const sidebarWidth = (await cookies()).get("yata-sidebar-width");

  return (
    <SidebarProvider defaultWidth={sidebarWidth?.value}>
      <AppSidebar />
      <main
        className={"w-[calc(100vw-var(--sidebar-width))] justify-items-center"}
      >
        {children}
      </main>
    </SidebarProvider>
  );
}
