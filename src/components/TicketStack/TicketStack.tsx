"use client";

import type { ReactNode } from "react";
import { useDroppable } from "@dnd-kit/core";
import type { Ticket } from "@/types/ticket";
import { useTicketStatus } from "@/hooks/useTicketStatus";

interface Props {
  status: Ticket["status"];
  children?: ReactNode;
}

export default function TicketStack({ status, children }: Props) {
  const params = useTicketStatus(status);
  const { setNodeRef } = useDroppable({
    id: `stack-${status}`,
    data: { status },
  });

  return (
    <div className={"grow basis-0 shrink-0 h-full max-w-[250px]"}>
      <h1 className={"mb-4 text-center text-4xl font-semibold"}>
        {params.text}
      </h1>
      <div className={"flex flex-col gap-2 h-full"} ref={setNodeRef}>
        {children}
      </div>
    </div>
  );
}
