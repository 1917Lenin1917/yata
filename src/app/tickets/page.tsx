"use client";

import { changeTicketStatus, getTickets } from "@/services/ticket";
import TicketCard from "@/components/TicketCard";
import {
  DndContext,
  type DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Ticket } from "@/types/ticket";
import TicketStack from "@/components/TicketStack";

export const dynamic = "force-dynamic";

export default function TicketList() {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const onTicketUpdated = useCallback(() => {
    getTickets().then(setTickets);
  }, [setTickets]);

  useEffect(() => {
    getTickets().then(setTickets);
  }, []);

  const ticketsGrouppedByStatus = useMemo(
    () =>
      tickets.reduce<Record<Ticket["status"], Ticket[]>>(
        (accumulator, ticket) => {
          accumulator[ticket.status].push(ticket);
          return accumulator;
        },
        { DONE: [], IN_PROGRESS: [], PENDING: [] },
      ),
    [tickets],
  );
  const pendingTickets = useMemo(
    () =>
      ticketsGrouppedByStatus["PENDING"].map((ticket, idx) => (
        <TicketCard
          className={"cursor-pointer"}
          key={idx}
          ticket={ticket}
          onTicketUpdated={onTicketUpdated}
        ></TicketCard>
      )),
    [ticketsGrouppedByStatus, onTicketUpdated],
  );
  const activeTickets = useMemo(
    () =>
      ticketsGrouppedByStatus["IN_PROGRESS"].map((ticket, idx) => (
        <TicketCard
          className={"cursor-pointer"}
          key={idx}
          ticket={ticket}
          onTicketUpdated={onTicketUpdated}
        ></TicketCard>
      )),
    [ticketsGrouppedByStatus, onTicketUpdated],
  );
  const doneTickets = useMemo(
    () =>
      ticketsGrouppedByStatus["DONE"].map((ticket, idx) => (
        <TicketCard
          className={"cursor-pointer"}
          key={idx}
          ticket={ticket}
          onTicketUpdated={onTicketUpdated}
        ></TicketCard>
      )),
    [ticketsGrouppedByStatus, onTicketUpdated],
  );

  const handleDragOver = useCallback(
    (event: DragEndEvent) => {
      const ticketId = event.active.data?.current?.id;
      const newStatus = event.over?.data?.current?.status;

      if (ticketId && newStatus) {
        const idx = tickets.findIndex((ticket) => ticket.id === ticketId);
        const updatedTicket: Ticket = { ...tickets[idx], status: newStatus };
        setTickets(tickets.with(idx, updatedTicket));

        changeTicketStatus(ticketId, newStatus).then(onTicketUpdated);
      }
    },
    [onTicketUpdated, tickets, setTickets],
  );

  return (
    <DndContext onDragEnd={handleDragOver} sensors={sensors}>
      <div className={"p-8 flex flex-row gap-4 h-full"}>
        <TicketStack status={"PENDING"}>{pendingTickets}</TicketStack>
        <TicketStack status={"IN_PROGRESS"}>{activeTickets}</TicketStack>
        <TicketStack status={"DONE"}>{doneTickets}</TicketStack>
      </div>
    </DndContext>
  );
}
