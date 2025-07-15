"use client";

import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { Ticket } from "@/types/ticket";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatter, formatUser, getInitials } from "@/utils";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import TicketModal from "@/components/TicketModal";
import { useTicketStatus } from "@/hooks/useTicketStatus";
import { CSS } from "@dnd-kit/utilities";
import { useSortable } from "@dnd-kit/sortable";

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

  const [isOpen, setIsOpen] = useState(false);
  const badgeParams = useTicketStatus(ticket.status);
  const date = useMemo(
    () => formatter.format(new Date(ticket.publishedDate)),
    [ticket],
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
          className={cn("py-4 gap-2 w-[300px] h-[144px]", className)}
        >
          <CardHeader>
            <CardTitle
              className={cn(
                "mb-2",
                ticket.title ? "text-primary" : "text-muted-foreground",
              )}
            >
              {ticket.title || "No title"}
            </CardTitle>
            <div className={"flex gap-1 flex-wrap"}>
              <Badge className={badgeParams.className}>
                {badgeParams.icon} {badgeParams.text}
              </Badge>
              {/*<Badge className={"bg-purple-700 text-primary"}>WORK</Badge>*/}
              {/*<Badge className={"bg-red-400"}>HIGH</Badge>*/}
            </div>
          </CardHeader>
          <CardFooter className={"gap-1"}>
            <Avatar>
              <AvatarImage src={"https://cataas.com/cat"} />
              <AvatarFallback>{getInitials(ticket.author)}</AvatarFallback>
            </Avatar>
            {formatUser(ticket.author)} <br />
            at {date}
          </CardFooter>
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
