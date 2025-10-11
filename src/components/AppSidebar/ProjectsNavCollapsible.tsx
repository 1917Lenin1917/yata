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
import {
  ChevronRightIcon,
  FileIcon,
  FolderIcon,
  PlusIcon,
  TableIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ProjectWithPages } from "@/types/project";
import { createPage } from "@/services/pages";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Props {
  project: ProjectWithPages;
}

export default function ProjectsNavCollapsible({ project }: Props) {
  const router = useRouter();
  const params = useParams();
  const pathname = usePathname();
  const { t } = useTranslation();

  const activePageId = Number(params?.pageId);

  const isOnProjectRoot = pathname === `/projects/${project.id}`;
  const isOnProjectTickets =
    pathname?.startsWith(`/projects/${project.id}/tickets`) ?? false;

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
          <SidebarMenuButton isActive={isOnProjectRoot} asChild>
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
                  className={cn(
                    "block w-[80%] whitespace-nowrap overflow-hidden text-ellipsis",
                    !project.name && "text-muted-foreground",
                  )}
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
            <SidebarMenuSubItem>
              <SidebarMenuSubButton isActive={isOnProjectTickets} asChild>
                <Link href={`/projects/${project.id}/tickets`}>
                  <TableIcon className="size-4" />
                  <span>{t("sidebar.table")}</span>
                </Link>
              </SidebarMenuSubButton>
            </SidebarMenuSubItem>

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
                <SidebarMenuSubButton
                  isActive={activePageId === page.id}
                  asChild
                >
                  <Link href={`/pages/${page.id}`}>
                    <FileIcon className={"size-4"} />
                    <span className={cn(!page.name && "text-muted-foreground")}>
                      {page.name || t("page.empty")}
                    </span>
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
