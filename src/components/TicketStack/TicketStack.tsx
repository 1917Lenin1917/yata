"use client";

import { useCallback, useMemo } from "react";
import { useDroppable } from "@dnd-kit/core";
import type { Ticket } from "@/types/ticket";
import { useTicketStatus } from "@/hooks/useTicketStatus";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import TicketCard from "@/components/TicketCard";
import { createTicket } from "@/services/ticket";

interface Props {
  status: Ticket["status"];
  tickets: Ticket[];
  activeTicket: Ticket | undefined;
  onTicketUpdated(): void;
}

export default function TicketStack({
  status,
  tickets,
  activeTicket,
  onTicketUpdated,
}: Props) {
  const params = useTicketStatus(status);
  const { setNodeRef } = useDroppable({
    id: `stack-${status}`,
    data: { status },
  });

  const mappedTickets = useMemo(
    () =>
      tickets.map((ticket, idx) => (
        <TicketCard
          isActive={ticket.id === activeTicket?.id}
          className={"cursor-pointer"}
          key={idx}
          ticket={ticket}
          onTicketUpdated={onTicketUpdated}
        ></TicketCard>
      )),
    [onTicketUpdated, tickets, activeTicket],
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
    <div className={"grow basis-0 shrink-0 h-full max-w-[calc(300px+16px*2)]"}>
      <h1 className={"mb-4 text-center text-4xl font-semibold"}>
        {params.text}
      </h1>
      <SortableContext
        id={`stack-${status}`}
        items={tickets}
        strategy={verticalListSortingStrategy}
      >
        <div className={"h-full"}>
          <div
            className={"flex flex-col p-4 gap-2 rounded-2xl bg-zinc-800"}
            ref={setNodeRef}
          >
            {mappedTickets}
            <Button onClick={() => createNewTicket(status)} className={"mt-4"}>
              <Plus /> Create a new ticket
            </Button>
          </div>
        </div>
      </SortableContext>
    </div>
  );
}
