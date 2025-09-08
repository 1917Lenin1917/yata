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
import { useEffect, useState } from "react";
import TicketStack from "@/components/TicketStack";
import { useProjectsPage } from "@/hooks/useProjectsPage";
import type { ProjectWithTickets } from "@/types/project";
import { Separator } from "@/components/ui/separator";
import { ProjectContext } from "@/contexts/ProjectContext";
import TicketModal from "@/components/TicketModal";
import ProjectFilters from "@/components/ProjectFilters";

interface Props {
  project: ProjectWithTickets;
}

export default function ProjectPage({ project }: Props) {
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
    createNewTicket,
  } = useProjectsPage();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const [openTicketId, setOpenTicketId] = useState<number>();
  const openTicket = project.tickets.find(
    (ticket) => ticket.id === openTicketId,
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

  return (
    <ProjectContext value={project}>
      <div className={"w-full flex justify-between"}>
        <div></div>
        <div className={""}>
          <ProjectFilters
            project={project}
            groupBy={groupBy}
            setGroupBy={setGroupBy}
          />
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
          <div className={"p-8 flex flex-row gap-4 h-full"}>
            {Object.entries(groupedTickets).map(([value, arr]) => (
              <TicketStack
                openTicketId={openTicketId}
                setOpenTicket={setOpenTicketId}
                key={value}
                createNewTicket={(status) =>
                  createNewTicket(status, project.id)
                }
                activeTicket={activeTicket}
                onTicketUpdated={onTicketUpdated}
                tickets={arr}
                status={value}
              />
            ))}
          </div>

          <DragOverlay dropAnimation={null}>
            {activeTicket ? (
              <TicketCard ticket={activeTicket}></TicketCard>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
      {openTicket && (
        <TicketModal
          ticket={openTicket}
          isOpen={!!openTicket}
          setIsOpen={() => setOpenTicketId(undefined)}
          onTicketUpdated={onTicketUpdated}
        />
      )}
    </ProjectContext>
  );
}
