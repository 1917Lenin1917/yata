"use client";

import {
  changeTicketStatus,
  createTicket,
  getTickets,
} from "@/services/ticket";
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
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default function TicketList() {
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const onTicketUpdated = useCallback(() => {
    getTickets().then(setTickets);
  }, []);

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
  const mapTickets = useCallback(
    (ticketList: Ticket[]) =>
      ticketList.map((ticket, idx) => (
        <TicketCard
          className={"cursor-pointer"}
          key={idx}
          ticket={ticket}
          onTicketUpdated={onTicketUpdated}
        ></TicketCard>
      )),
    [onTicketUpdated],
  );

  const pendingTickets = useMemo(
    () => mapTickets(ticketsGrouppedByStatus["PENDING"]),
    [ticketsGrouppedByStatus, mapTickets],
  );
  const activeTickets = useMemo(
    () => mapTickets(ticketsGrouppedByStatus["IN_PROGRESS"]),
    [ticketsGrouppedByStatus, mapTickets],
  );
  const doneTickets = useMemo(
    () => mapTickets(ticketsGrouppedByStatus["DONE"]),
    [ticketsGrouppedByStatus, mapTickets],
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

  const createNewTicket = useCallback(
    (status: Ticket["status"]) => {
      createTicket({
        authorId: 1, // TODO: add auth!
        title: "",
        date: new Date().toISOString(),
        desc: "",
        status,
      }).then(onTicketUpdated);
    },
    [onTicketUpdated],
  );

  return (
    <DndContext onDragEnd={handleDragOver} sensors={sensors}>
      <div className={"p-8 flex flex-row gap-4 h-full"}>
        <TicketStack status={"PENDING"}>
          {pendingTickets}
          <Button onClick={() => createNewTicket("PENDING")} className={"mt-4"}>
            <Plus /> Create a new ticket
          </Button>
        </TicketStack>
        <Separator orientation={"vertical"} />
        <TicketStack status={"IN_PROGRESS"}>
          {activeTickets}
          <Button
            onClick={() => createNewTicket("IN_PROGRESS")}
            className={"mt-4"}
          >
            <Plus /> Create a new ticket
          </Button>
        </TicketStack>
        <Separator orientation={"vertical"} />
        <TicketStack status={"DONE"}>
          {doneTickets}
          <Button onClick={() => createNewTicket("DONE")} className={"mt-4"}>
            <Plus /> Create a new ticket
          </Button>
        </TicketStack>
      </div>
    </DndContext>
  );
}
