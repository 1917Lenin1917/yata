import { useCallback, useMemo, useState } from "react";
import type { Ticket } from "@/types/ticket";
import type {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import { changeTicketStatus, getCurrentUserTickets } from "@/services/ticket";

export const useTicketsPage = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [activeTicket, setActiveTicket] = useState<Ticket>();

  const reorderTickets = (
    list: Ticket[],
    ticketId: number,
    targetStatus: Ticket["status"],
    targetPriority: number,
  ): Ticket[] => {
    const out = list.map((t) => ({ ...t }));

    const moved = out.find((t) => t.id === ticketId);
    if (!moved) return list;

    const { status: srcStatus, priority: srcPriority } = moved;

    if (srcStatus !== targetStatus) {
      out.forEach((t) => {
        if (t.status === srcStatus && t.priority > srcPriority) t.priority -= 1;
      });
    }

    if (srcStatus === targetStatus) {
      if (targetPriority < srcPriority) {
        out.forEach((t) => {
          if (
            t.status === srcStatus &&
            t.priority >= targetPriority &&
            t.priority < srcPriority &&
            t.id !== ticketId
          )
            t.priority += 1;
        });
      } else if (targetPriority > srcPriority) {
        out.forEach((t) => {
          if (
            t.status === srcStatus &&
            t.priority <= targetPriority &&
            t.priority > srcPriority &&
            t.id !== ticketId
          )
            t.priority -= 1;
        });
      }
    } else {
      out.forEach((t) => {
        if (t.status === targetStatus && t.priority >= targetPriority) {
          t.priority += 1;
        }
      });
    }

    moved.status = targetStatus;
    moved.priority = targetPriority;

    return out.sort((a, b) =>
      a.status === b.status
        ? a.priority - b.priority
        : a.status.localeCompare(b.status),
    );
  };

  const groupedTickets = useMemo(
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

  const onTicketUpdated = useCallback(() => {
    getCurrentUserTickets().then(setTickets);
  }, []);

  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      const ticketId = event.active.data?.current?.id;
      setActiveTicket(tickets.find((ticket) => ticket.id === ticketId));
    },
    [setActiveTicket, tickets],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      setActiveTicket(undefined);

      const ticketId = event.active.data?.current?.id as number | undefined;
      const overTicketId = event.over?.data?.current?.id as number | undefined;
      const overStatus = event.over?.data?.current?.status as
        | Ticket["status"]
        | undefined;

      if (!ticketId || (!overTicketId && !overStatus)) return;

      // Where are we dropping?
      const overTicket = tickets.find((t) => t.id === overTicketId);
      const targetStatus = overTicket?.status ?? overStatus!;
      const targetPriority = overTicket
        ? overTicket.priority // before the hovered card
        : Math.max(
            0,
            ...tickets
              .filter((t) => t.status === targetStatus)
              .map((t) => t.priority),
          ) + 1; // bottom of the column

      // ---- optimistic state update ----
      const optimistic = reorderTickets(
        tickets,
        ticketId,
        targetStatus,
        targetPriority,
      );
      setTickets(optimistic);

      // ---- server sync ----
      changeTicketStatus(ticketId, targetStatus, targetPriority)
        .then(onTicketUpdated) // refresh from back‑end
        .catch(() => setTickets(tickets)); // revert on error
    },
    [tickets, onTicketUpdated],
  );

  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      const ticketId = event.active.data.current?.id;
      const overId = event.over?.data.current?.id;
      const overStatus =
        event.over?.data.current?.status ??
        tickets.find((t) => t.id === overId)?.status;

      if (!ticketId || !overStatus) return;

      setTimeout(
        () =>
          setTickets((prev) => {
            const i = prev.findIndex((t) => t.id === ticketId);
            if (i === -1 || prev[i].status === overStatus) return prev; // nothing changed ➜ no update
            const next = [...prev];
            next[i] = { ...next[i], status: overStatus };
            return next;
          }),
        0,
      );
    },
    [tickets],
  );

  return {
    tickets,
    setTickets,

    activeTicket,
    setActiveTicket,

    groupedTickets,

    reorderTickets,

    onTicketUpdated,

    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
};
