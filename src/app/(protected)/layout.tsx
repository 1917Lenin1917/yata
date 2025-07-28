import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function ProtectedLayout({ children }: Props) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main
        className={"w-[calc(100vw-var(--sidebar-width))] justify-items-center"}
      >
        {children}
      </main>
    </SidebarProvider>
  );
}
