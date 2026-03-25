"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
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
  PencilIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ProjectWithNodes } from "@/types/project";
import { createPage } from "@/services/pages";
import { createNode, moveNode, updateNodeTitle } from "@/services/nodes";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import type { ProjectNode } from "@/types/node";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { updateProjectName } from "@/services/project";

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
  const [editingProject, setEditingProject] = useState<boolean>(false);
  const [projectName, setProjectName] = useState<string>(project.name);
  const [editingNodeId, setEditingNodeId] = useState<number | null>(null);
  const [nodeTitleDraft, setNodeTitleDraft] = useState<string>("");

  const createPageNode = async (projectId: number, parentId?: number | null) => {
    await createPage({
      name: "",
      description: "",
      content: "",
      projectId,
      parentId: parentId ?? null,
    });
    router.refresh();
  };

  const createTableNode = async (parentId?: number | null) => {
    await createNode({
      projectId: project.id,
      parentId: parentId ?? null,
      type: "ticket_table",
      title: t("sidebar.table"),
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

  const saveProjectTitle = async () => {
    await updateProjectName(project.id, projectName);
    setEditingProject(false);
    router.refresh();
  };

  const saveNodeTitle = async (nodeId: number) => {
    await updateNodeTitle(nodeId, nodeTitleDraft);
    setEditingNodeId(null);
    setNodeTitleDraft("");
    router.refresh();
  };

  const renderNode = (node: ProjectNode, level = 0) => {
    const isActivePage = node.type === "page" && activePageId === node.pageId;
    const isTicketsNode =
      node.type === "ticket_table" &&
      pathname?.startsWith(`/projects/${project.id}/tickets`);

    const isEditing = editingNodeId === node.id;

    return (
      <SidebarMenuSubItem
        key={`node-${node.id}`}
        className={"select-none"}
        draggable
        onDragStart={() => setDraggedNodeId(node.id)}
        onDragOver={(event) => event.preventDefault()}
        onDrop={async (event) => {
          event.preventDefault();
          await handleDrop(node.id);
        }}
        style={{ marginLeft: `${level * 8}px` }}
      >
        <div className="flex items-center gap-1 py-0.5">
          {isEditing ? (
            <input
              autoFocus
              value={nodeTitleDraft}
              onChange={(event) => setNodeTitleDraft(event.target.value)}
              onBlur={() => saveNodeTitle(node.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter") void saveNodeTitle(node.id);
                if (event.key === "Escape") {
                  setEditingNodeId(null);
                  setNodeTitleDraft("");
                }
              }}
              className="h-8 w-full rounded border bg-background px-2 text-sm"
            />
          ) : (
            <SidebarMenuSubButton
              isActive={isActivePage || isTicketsNode}
              asChild
              className="h-8 flex-1"
            >
              {node.type === "ticket_table" ? (
                <Link href={`/projects/${project.id}/tickets`} title={node.title}>
                  <TableIcon className="size-4" />
                  <span className={cn("truncate", !node.title && "text-muted-foreground")}>
                    {node.title || t("sidebar.table")}
                  </span>
                </Link>
              ) : (
                <Link href={`/pages/${node.pageId}`} title={node.title}>
                  <FileIcon className={"size-4"} />
                  <span className={cn("truncate", !node.title && "text-muted-foreground")}>
                    {node.title || t("page.empty")}
                  </span>
                </Link>
              )}
            </SidebarMenuSubButton>
          )}

          {!isEditing && (
            <>
              <Button
                variant={"ghost"}
                className={"size-7 p-1"}
                title={"Rename"}
                onClick={() => {
                  setEditingNodeId(node.id);
                  setNodeTitleDraft(node.title || "");
                }}
              >
                <PencilIcon className="size-3.5" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={"ghost"} className={"size-7 p-1"} title={"Create"}>
                    <PlusIcon className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => createPageNode(project.id, node.id)}
                  >
                    <FileIcon className="size-4" />
                    {t("page.empty")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => createTableNode(node.id)}>
                    <TableIcon className="size-4" />
                    {t("sidebar.table")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>

        {!!node.children.length && node.children.map((child) => renderNode(child, level + 1))}
      </SidebarMenuSubItem>
    );
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className="group/icon">
      <SidebarMenuItem>
        <div className="flex items-center gap-1 pr-1">
          <CollapsibleTrigger className="flex-1 min-w-0" asChild>
            <SidebarMenuButton isActive={isOnProjectRoot} asChild className="h-9 pr-1">
              <div className="flex w-full min-w-0 items-center gap-2">
                <div className="relative size-4 shrink-0">
                  <span className={"group-hover/icon:opacity-0 absolute inset-0 flex items-center justify-center"}>
                    {project.emoji || <FolderIcon className={"size-4"} />}
                  </span>
                  <ChevronRightIcon
                    className={
                      "opacity-0 group-hover/icon:opacity-100 absolute inset-0 m-auto size-4 transition-transform duration-200 group-data-[state=open]/icon:rotate-90"
                    }
                  />
                </div>

                {editingProject ? (
                  <input
                    autoFocus
                    value={projectName}
                    onChange={(event) => setProjectName(event.target.value)}
                    onBlur={saveProjectTitle}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") void saveProjectTitle();
                      if (event.key === "Escape") {
                        setProjectName(project.name);
                        setEditingProject(false);
                      }
                    }}
                    className="h-8 w-full rounded border bg-background px-2 text-sm"
                  />
                ) : (
                  <Link
                    href={`/projects/${project.id}`}
                    className={"min-w-0 flex-1"}
                    title={project.name}
                  >
                    <span
                      className={cn(
                        "block truncate",
                        !project.name && "text-muted-foreground",
                      )}
                    >
                      {project.name || t("project.empty")}
                    </span>
                  </Link>
                )}
              </div>
            </SidebarMenuButton>
          </CollapsibleTrigger>

          {!editingProject && (
            <>
              <Button
                variant={"ghost"}
                className={"size-7 p-1"}
                title={"Rename project"}
                onClick={() => setEditingProject(true)}
              >
                <PencilIcon className="size-3.5" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant={"ghost"} className={"size-7 p-1"} title={"Create"}>
                    <PlusIcon className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => createPageNode(project.id)}>
                    <FileIcon className="size-4" />
                    {t("page.empty")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => createTableNode(null)}>
                    <TableIcon className="size-4" />
                    {t("sidebar.table")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </div>

        <CollapsibleContent>
          <SidebarMenuSub
            className="mt-1"
            onDragOver={(event) => event.preventDefault()}
            onDrop={async (event) => {
              event.preventDefault();
              await handleDrop(null);
            }}
          >
            {!project.nodes.length && (
              <SidebarMenuSubItem className={"text-muted-foreground text-sm py-1"}>
                No pages
              </SidebarMenuSubItem>
            )}

            {project.nodes.map((node) => renderNode(node))}

            {!project.nodes.some((node) => node.type === "ticket_table") && (
              <SidebarMenuSubItem>
                <SidebarMenuSubButton isActive={isOnProjectTickets} asChild className="h-8">
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
