import type { Ticket } from "@/types/ticket";
import { type ReactNode, useMemo } from "react";

interface Params {
  className: string;
  text: string;
  icon?: ReactNode;
}

const STATUS_MAP: Record<Ticket["status"], Params> = {
  PENDING: {
    className: "bg-blue-400",
    text: "PENDING",
  },
  IN_PROGRESS: {
    className: "bg-amber-200",
    text: "IN PROGRESS",
  },
  DONE: {
    className: "bg-green-300",
    text: "DONE",
  },
} as const;

export const useTicketStatus = (ticketStatus: Ticket["status"]) => {
  return useMemo(() => STATUS_MAP[ticketStatus], [ticketStatus]);
};
