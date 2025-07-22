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
      <main className={"mx-auto max-w-[calc(100%-256px)]"}>{children}</main>
    </SidebarProvider>
  );
}
