"use client";

import {
  Card,
  CardAction,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Ticket } from "@/types/ticket";
import { formatter } from "@/utils";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useCallback, useMemo, useState } from "react";
import TicketModal from "@/components/TicketModal";
import { useTicketStatus } from "@/hooks/useTicketStatus";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteTicket } from "@/services/ticket";
import { useTranslation } from "react-i18next";

interface Props {
  isActive?: boolean;
  ticket: Ticket;
  hideSource?: boolean;
  className?: string;
  onTicketUpdated?(): void;
}

export default function TicketCard({
  isActive,
  ticket,
  className,
  onTicketUpdated = () => {},
}: Props) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: ticket.id, data: { id: ticket.id } });

  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);
  const badgeParams = useTicketStatus(ticket.status);
  const date = useMemo(
    () => formatter.format(new Date(ticket.createdAt)), // todo replace with property deadline
    [ticket],
  );
  const handleDeleteTicket = useCallback(
    (ticketId: number) => {
      deleteTicket(ticketId).then(onTicketUpdated);
    },
    [onTicketUpdated],
  );

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} {...listeners} {...attributes} style={style}>
      {isActive ? (
        <div
          className={"border-5 rounded-2xl border-amber-300 border-dashed h-20"}
        ></div>
      ) : (
        <Card
          onClick={() => setIsOpen(true)}
          className={cn("py-4 gap-2 w-[300px]", className)}
        >
          <CardHeader>
            <CardTitle
              className={cn(
                "mb-2",
                ticket.title ? "text-primary" : "text-muted-foreground",
              )}
            >
              {ticket.title || t("ticket.no_title")}
            </CardTitle>
            <div className={"flex gap-1 flex-wrap"}>
              <Badge className={badgeParams.className}>
                {badgeParams.icon} {badgeParams.text}
              </Badge>
            </div>
            <CardAction>
              <Button
                onClick={(event) => {
                  event.stopPropagation();
                  handleDeleteTicket(ticket.id);
                }}
                variant={"ghost"}
                className={"h-6 w-6"}
              >
                <Trash2 className={"h-4 w-4"} />
              </Button>
            </CardAction>
          </CardHeader>
          <CardFooter>{date}</CardFooter>
        </Card>
      )}

      {isOpen && (
        <TicketModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          ticket={ticket}
          onTicketUpdated={onTicketUpdated}
        ></TicketModal>
      )}
    </div>
  );
}
