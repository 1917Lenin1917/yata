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
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";

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

  const { t } = useTranslation();

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
    <div className={"grow basis-0 shrink-0 min-w-[316px]"}>
      <SortableContext
        id={`stack-${status}`}
        items={tickets}
        strategy={verticalListSortingStrategy}
      >
        <div
          className={"flex flex-col p-2 gap-2 rounded-2xl bg-accent"}
          ref={setNodeRef}
        >
          <div className={"flex gap-2"}>
            <Badge variant={"outline"}>{params.text}</Badge> {tickets.length}
          </div>
          {mappedTickets}
          <Button
            variant={"outline"}
            onClick={() => createNewTicket(status)}
            className={"mt-4 cursor-pointer"}
          >
            <Plus /> {t("ticket.create")}
          </Button>
        </div>
      </SortableContext>
    </div>
  );
}
