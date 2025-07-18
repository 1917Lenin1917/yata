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
import { useCallback, useEffect, useMemo } from "react";
import TicketStack from "@/components/TicketStack";
import { useTicketsPage } from "@/hooks/useTicketsPage";
import type { ProjectWithTickets } from "@/types/project";
import type { Ticket } from "@/types/ticket";
import { createTicket } from "@/services/ticket";

interface Props {
  project: ProjectWithTickets;
}

export default function ProjectPage({ project }: Props) {
  const {
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

  const sortedPending = useMemo(
    () => groupedTickets["PENDING"].sort((a, b) => a.priority - b.priority),
    [groupedTickets],
  );
  const sortedActive = useMemo(
    () => groupedTickets["IN_PROGRESS"].sort((a, b) => a.priority - b.priority),
    [groupedTickets],
  );
  const sortedDone = useMemo(
    () => groupedTickets["DONE"].sort((a, b) => a.priority - b.priority),
    [groupedTickets],
  );

  const createNewTicket = useCallback(
    (status: Ticket["status"]) => {
      createTicket({
        title: "",
        date: new Date().toISOString(),
        desc: "",
        projectId: project.id,
        status,
      }).then(onTicketUpdated);
    },
    [onTicketUpdated, project],
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className={"p-8 flex flex-row gap-4 h-full"}>
        <TicketStack
          createNewTicket={createNewTicket}
          activeTicket={activeTicket}
          onTicketUpdated={onTicketUpdated}
          tickets={sortedPending}
          status={"PENDING"}
        ></TicketStack>
        <TicketStack
          createNewTicket={createNewTicket}
          activeTicket={activeTicket}
          onTicketUpdated={onTicketUpdated}
          tickets={sortedActive}
          status={"IN_PROGRESS"}
        ></TicketStack>
        <TicketStack
          createNewTicket={createNewTicket}
          activeTicket={activeTicket}
          onTicketUpdated={onTicketUpdated}
          tickets={sortedDone}
          status={"DONE"}
        ></TicketStack>
      </div>

      <DragOverlay dropAnimation={null}>
        {activeTicket ? <TicketCard ticket={activeTicket}></TicketCard> : null}
      </DragOverlay>
    </DndContext>
  );
}
