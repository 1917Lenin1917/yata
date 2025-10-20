import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Page() {
  return (
    <header className={"h-[44px] w-full p-2 sticky top-0 bg-background z-50"}>
      <SidebarTrigger />
    </header>
  );
}
