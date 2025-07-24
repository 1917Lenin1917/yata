"use client";

import TicketCard from "@/components/TicketCard";
import {
  closestCorners,
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useEffect } from "react";
import TicketStack from "@/components/TicketStack";
import { useTicketsPage } from "@/hooks/useTicketsPage";
import type { ProjectWithTickets } from "@/types/project";
import { Separator } from "@/components/ui/separator";
import { Check, Funnel, FunnelX } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { createTicket } from "@/services/ticket";
import { ProjectContext } from "@/contexts/ProjectContext";
import { Badge } from "@/components/ui/badge";

interface Props {
  project: ProjectWithTickets;
}

export default function ProjectPage({ project }: Props) {
  const { t } = useTranslation();
  const {
    groupBy,
    setGroupBy,
    setTickets,
    activeTicket,
    groupedTickets,
    onTicketUpdated,
    handleDragEnd,
    handleDragOver,
    handleDragStart,
  } = useTicketsPage();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  useEffect(() => {
    setTickets(project.tickets);
  }, [project, setTickets]);

  useEffect(() => {
    if (!groupBy) {
      const localId = Number(localStorage.getItem("groupBy")) || undefined;
      setGroupBy(project.properties.find((pr) => pr.id === localId));
      return;
    }
    localStorage.setItem("groupBy", `${groupBy.id}`);
  }, [groupBy, project.properties, setGroupBy]);

  const createNewTicket = (status: string) => {
    createTicket({
      title: "",
      desc: "",
      projectId: project.id,
      property: groupBy
        ? {
            id: groupBy.id,
            value: status,
          }
        : undefined,
    }).then(onTicketUpdated);
  };

  const stacks = Object.entries(groupedTickets).map(([value, arr]) => (
    <TicketStack
      key={value}
      createNewTicket={createNewTicket}
      activeTicket={activeTicket}
      onTicketUpdated={onTicketUpdated}
      tickets={arr}
      status={value}
    />
  ));

  return (
    <ProjectContext.Provider value={project}>
      <div className={"w-full flex justify-between"}>
        <div></div>
        <div className={""}>
          {groupBy && <Badge className={"my-auto"}> {groupBy.name}</Badge>}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant={"ghost"} className={"cursor-pointer"}>
                {groupBy ? <FunnelX /> : <Funnel />}
              </Button>
            </PopoverTrigger>
            <PopoverContent className={"p-0"}>
              <Command>
                <CommandGroup heading={t("project.group_by")}>
                  {project.properties
                    .filter((pr) => pr.type === "status")
                    .map((property, key) => (
                      <CommandItem
                        key={key}
                        onSelect={() => {
                          setGroupBy(
                            groupBy?.id === property.id ? undefined : property,
                          );
                          if (groupBy?.id === property.id)
                            localStorage.removeItem("groupBy");
                        }}
                      >
                        <span>{property.name}</span>
                        <Check
                          className={cn(
                            "ml-auto",
                            groupBy?.id === property.id
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                      </CommandItem>
                    ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>
      <Separator />
      <div className={"overflow-x-auto"}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className={"p-8 flex flex-row gap-4 h-full"}>{stacks}</div>

          <DragOverlay dropAnimation={null}>
            {activeTicket ? (
              <TicketCard ticket={activeTicket}></TicketCard>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </ProjectContext.Provider>
  );
}
