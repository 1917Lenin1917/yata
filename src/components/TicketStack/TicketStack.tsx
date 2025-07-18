"use client";

import { useMemo } from "react";
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
import { useI18n } from "@/hooks/useI18n";

interface Props {
  status: Ticket["status"];
  tickets: Ticket[];
  activeTicket: Ticket | undefined;
  onTicketUpdated(): void;
  createNewTicket(status: Ticket["status"]): void;
}

export default function TicketStack({
  status,
  tickets,
  activeTicket,
  onTicketUpdated,
  createNewTicket,
}: Props) {
  const params = useTicketStatus(status);
  const { setNodeRef } = useDroppable({
    id: `stack-${status}`,
    data: { status },
  });

  const { t } = useI18n();

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

  return (
    <div
      className={
        "grow basis-0 shrink-0 min-w-[332px] max-w-[calc(300px+16px*2)]"
      }
    >
      <h1 className={"mb-4 text-center text-4xl font-semibold"}>
        {params.text}
      </h1>
      <SortableContext
        id={`stack-${status}`}
        items={tickets}
        strategy={verticalListSortingStrategy}
      >
        <div
          className={"flex flex-col p-4 gap-2 rounded-2xl bg-zinc-800"}
          ref={setNodeRef}
        >
          {mappedTickets}
          <Button onClick={() => createNewTicket(status)} className={"mt-4"}>
            <Plus /> {t("ticket.create")}
          </Button>
        </div>
      </SortableContext>
    </div>
  );
}
