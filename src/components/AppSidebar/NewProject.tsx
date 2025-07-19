"use client";

import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { Plus } from "lucide-react";
import { useState, type KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { createNewProject } from "@/services/project";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

export default function NewProject() {
  const { t } = useTranslation();
  const [showInput, setShowInput] = useState<boolean>(false);
  const router = useRouter();

  async function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      await createNewProject({
        name: event.currentTarget.value,
        emoji: "",
        description: "",
      });

      router.refresh();
    }
  }

  if (showInput)
    return (
      <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <Input
            autoFocus
            onBlur={() => setShowInput(false)}
            onKeyDown={handleKeyDown}
          />
        </SidebarMenuButton>
      </SidebarMenuItem>
    );

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        onClick={() => setShowInput(true)}
        className={"cursor-pointer"}
      >
        <Plus /> {t("sidebar.create_project")}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
