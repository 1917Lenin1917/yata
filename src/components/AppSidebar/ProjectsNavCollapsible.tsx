import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { ChevronRightIcon, FileIcon, FolderIcon, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ProjectWithPages } from "@/types/project";
import { createPage } from "@/services/pages";
import { useParams, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useState } from "react";

interface Props {
  project: ProjectWithPages;
}
export default function ProjectsNavCollapsible({ project }: Props) {
  const router = useRouter();
  const params = useParams();
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onAddPageClick = async (projectId: number) => {
    await createPage({
      name: "",
      description: "",
      content: "",
      projectId,
    });
    router.refresh();
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="group/icon">
      <SidebarMenuItem>
        <CollapsibleTrigger
          className={"has-[button:hover]:!bg-transparent"}
          asChild
        >
          <SidebarMenuButton
            isActive={Number(params?.projectId) === project.id}
            asChild
          >
            <div>
              <Button className={"p-0 size-5"} variant={"ghost"}>
                <div
                  className={"size-4 shrink-0 flex items-center justify-center"}
                >
                  <span className={"group-hover/icon:opacity-0 absolute"}>
                    {project.emoji || <FolderIcon className={"size-4"} />}
                  </span>
                  <ChevronRightIcon
                    className={
                      "opacity-0 group-hover/icon:opacity-100 absolute size-4 transition-transform duration-200 group-data-[state=open]/icon:rotate-90"
                    }
                  />
                </div>
              </Button>
              <Link
                href={`/projects/${project.id}`}
                className={"w-full"}
                title={project.name}
              >
                <span
                  className={
                    "block w-[80%] whitespace-nowrap overflow-hidden text-ellipsis"
                  }
                >
                  {project.name || t("project.empty")}
                </span>
              </Link>
            </div>
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <Button variant={"ghost"} className={"size-5 p-1"} asChild>
          <SidebarMenuAction
            showOnHover
            onClick={() => onAddPageClick(project.id)}
          >
            <PlusIcon />
          </SidebarMenuAction>
        </Button>
        <CollapsibleContent>
          <SidebarMenuSub>
            {!project.pages.length && (
              <SidebarMenuSubItem className={"text-muted-foreground text-sm"}>
                No pages
              </SidebarMenuSubItem>
            )}
            {project.pages.map((page) => (
              <SidebarMenuSubItem
                key={`page-${page.id}`}
                className={"text-sm select-none"}
              >
                <SidebarMenuSubButton asChild>
                  <Link href={`/pages/${page.id}`}>
                    <FileIcon className={"size-4"} />
                    <span>{page.name || t("page.empty")}</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}
