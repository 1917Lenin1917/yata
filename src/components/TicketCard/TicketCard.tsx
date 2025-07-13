"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Ticket } from "@/types/ticket";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatter, formatUser, getInitials } from "@/utils";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useMemo, useState } from "react";
import TicketModal from "@/components/TicketModal";
import { useDraggable } from "@dnd-kit/core";

interface Props {
  ticket: Ticket;
  className?: string;
  onTicketUpdated(): void;
}

export default function TicketCard({ ticket, className, ...props }: Props) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `draggable-${ticket.id}`,
    data: { id: ticket.id },
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  const [isOpen, setIsOpen] = useState(false);

  const date = useMemo(
    () => formatter.format(new Date(ticket.publishedDate)),
    [ticket],
  );
  return (
    <>
      <Card
        onClick={() => setIsOpen(true)}
        className={cn("py-4 gap-2 max-w-[400px]", className)}
        ref={setNodeRef}
        style={style}
        {...listeners}
        {...attributes}
      >
        <CardHeader>
          <CardTitle>{ticket.title}</CardTitle>
          <div className={"flex gap-1"}>
            <Badge className={"bg-blue-400"}>PENDING</Badge>
            <Badge className={"bg-purple-700 text-primary"}>WORK</Badge>
            <Badge className={"bg-red-400"}>HIGH</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className={"truncate"}>{ticket.description}</div>
        </CardContent>
        <CardFooter className={"gap-1"}>
          <Avatar>
            <AvatarImage src={"https://cataas.com/cat"} />
            <AvatarFallback>{getInitials(ticket.author)}</AvatarFallback>
          </Avatar>
          {formatUser(ticket.author)} <br />
          at {date}
        </CardFooter>
      </Card>

      {isOpen && (
        <TicketModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          ticket={ticket}
          onTicketUpdated={props.onTicketUpdated}
        ></TicketModal>
      )}
    </>
  );
}
