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
import type { ProjectWithNodes } from "@/types/project";
import { createPage } from "@/services/pages";
import { moveNode } from "@/services/nodes";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import type { ProjectNode } from "@/types/node";

interface Props {
  project: ProjectWithNodes;
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
  const [draggedNodeId, setDraggedNodeId] = useState<number | null>(null);

  const onAddPageClick = async (projectId: number) => {
    await createPage({
      name: "",
      description: "",
      content: "",
      projectId,
    });
    router.refresh();
  };

  const onAddChildPageClick = async (parentId: number) => {
    await createPage({
      name: "",
      description: "",
      content: "",
      projectId: project.id,
      parentId,
    });
    router.refresh();
  };

  const allNodes = useMemo(() => {
    const out: ProjectNode[] = [];
    const walk = (nodes: ProjectNode[]) => {
      for (const node of nodes) {
        out.push(node);
        walk(node.children);
      }
    };
    walk(project.nodes);
    return out;
  }, [project.nodes]);

  const childrenCountByParent = useMemo(() => {
    const map = new Map<number | null, number>();
    allNodes.forEach((node) => {
      map.set(node.parentId, (map.get(node.parentId) ?? 0) + 1);
    });
    return map;
  }, [allNodes]);

  const handleDrop = async (parentId: number | null) => {
    if (!draggedNodeId) return;

    const sortOrder = childrenCountByParent.get(parentId) ?? 0;

    await moveNode({
      nodeId: draggedNodeId,
      parentId,
      sortOrder,
    });

    setDraggedNodeId(null);
    router.refresh();
  };

  const renderNode = (node: ProjectNode) => {
    const isActivePage = node.type === "page" && activePageId === node.pageId;
    const isTicketsNode =
      node.type === "ticket_table" &&
      pathname?.startsWith(`/projects/${project.id}/tickets`);

    return (
      <SidebarMenuSubItem
        key={`node-${node.id}`}
        className={"text-sm select-none"}
        draggable
        onDragStart={() => setDraggedNodeId(node.id)}
        onDragOver={(event) => event.preventDefault()}
        onDrop={async (event) => {
          event.preventDefault();
          await handleDrop(node.id);
        }}
      >
        <div className="flex items-center gap-1">
          <SidebarMenuSubButton isActive={isActivePage || isTicketsNode} asChild>
            {node.type === "ticket_table" ? (
              <Link href={`/projects/${project.id}/tickets`}>
                <TableIcon className="size-4" />
                <span className={cn(!node.title && "text-muted-foreground")}>
                  {node.title || t("sidebar.table")}
                </span>
              </Link>
            ) : (
              <Link href={`/pages/${node.pageId}`}>
                <FileIcon className={"size-4"} />
                <span className={cn(!node.title && "text-muted-foreground")}>
                  {node.title || t("page.empty")}
                </span>
              </Link>
            )}
          </SidebarMenuSubButton>
          <Button
            variant={"ghost"}
            className={"size-5 p-1"}
            onClick={() => onAddChildPageClick(node.id)}
            title={"Create child page"}
          >
            <PlusIcon className="size-3" />
          </Button>
        </div>

        {!!node.children.length && (
          <SidebarMenuSub className="ml-4">
            {node.children.map((child) => renderNode(child))}
          </SidebarMenuSub>
        )}
      </SidebarMenuSubItem>
    );
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
          <SidebarMenuSub
            onDragOver={(event) => event.preventDefault()}
            onDrop={async (event) => {
              event.preventDefault();
              await handleDrop(null);
            }}
          >
            {!project.nodes.length && (
              <SidebarMenuSubItem className={"text-muted-foreground text-sm"}>
                No pages
              </SidebarMenuSubItem>
            )}

            {project.nodes.map((node) => renderNode(node))}

            {!project.nodes.some((node) => node.type === "ticket_table") && (
              <SidebarMenuSubItem>
                <SidebarMenuSubButton isActive={isOnProjectTickets} asChild>
                  <Link href={`/projects/${project.id}/tickets`}>
                    <TableIcon className="size-4" />
                    <span>{t("sidebar.table")}</span>
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            )}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}
