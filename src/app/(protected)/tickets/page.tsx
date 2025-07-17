"use client";

import { getCurrentUserTickets } from "@/services/ticket";
import TicketCard from "@/components/TicketCard";
import {
  closestCorners,
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useEffect, useMemo } from "react";
import TicketStack from "@/components/TicketStack";
import { useTicketsPage } from "@/hooks/useTicketsPage";

export default function TicketList() {
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
    getCurrentUserTickets().then(setTickets);
  }, [setTickets]);

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
          activeTicket={activeTicket}
          onTicketUpdated={onTicketUpdated}
          tickets={sortedPending}
          status={"PENDING"}
        ></TicketStack>
        <TicketStack
          activeTicket={activeTicket}
          onTicketUpdated={onTicketUpdated}
          tickets={sortedActive}
          status={"IN_PROGRESS"}
        ></TicketStack>
        <TicketStack
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
