"use client";

import type { ReactNode } from "react";
import { useDroppable } from "@dnd-kit/core";
import type { Ticket } from "@/types/ticket";

interface Props {
  status: Ticket["status"];
  children?: ReactNode;
}

export default function TicketStack({ status, children }: Props) {
  const { setNodeRef } = useDroppable({
    id: `stack-${status}`,
    data: { status },
  });

  return (
    <div className={"grow basis-0 shrink-0 h-full max-w-[400px]"}>
      <h1 className={"mb-2"}>{status} tickets</h1>
      <div className={"flex flex-col gap-2 h-full"} ref={setNodeRef}>
        {children}
      </div>
    </div>
  );
}
