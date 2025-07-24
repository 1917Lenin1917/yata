import { useState } from "react";
import type { Ticket } from "@/types/ticket";
import type {
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import { changeTicketPropertyValue } from "@/services/ticket";
import { useRouter } from "next/navigation";
import type { GroupByProperty } from "@/types/project";
import type { Property } from "@/types/property";

export const useTicketsPage = () => {
  const router = useRouter();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [activeTicket, setActiveTicket] = useState<Ticket>();
  const [groupBy, setGroupBy] = useState<GroupByProperty>();

  const getPropValue = (ticket: Ticket, propId: Property["id"] | undefined) =>
    ticket.properties.find((p) => p.id === propId)?.value ?? "";

  const setPropValue = (
    ticket: Ticket,
    propId: Property["id"] | undefined,
    value: string,
  ) => {
    if (!propId) return;

    const idx = ticket.properties.findIndex((p) => p.id === propId);
    if (idx === -1) {
      return;
    }
    ticket.properties[idx] = { ...ticket.properties[idx], value };
  };

  const reorderTickets = (
    list: Ticket[],
    ticketId: number,
    targetValue: string,
    targetPriority: number,
  ): Ticket[] => {
    if (!groupBy) return list; // nothing to do if we are not grouping
    const propId = groupBy.id;

    // shallow‑copy tickets + properties to keep things immutable
    const out = list.map((t) => ({ ...t, properties: [...t.properties] }));

    const moved = out.find((t) => t.id === ticketId);
    if (!moved) return list;

    const srcValue = getPropValue(moved, propId);
    const srcPriority = moved.priority;

    // ─── priority bookkeeping ─────────────────────────────────────────────
    if (srcValue !== targetValue) {
      // leaving its old column ➜ close gap there
      out.forEach((t) => {
        if (getPropValue(t, propId) === srcValue && t.priority > srcPriority)
          t.priority -= 1;
      });
    }

    if (srcValue === targetValue) {
      // re‑ordering inside same column
      if (targetPriority < srcPriority) {
        out.forEach((t) => {
          const pv = getPropValue(t, propId);
          if (
            pv === srcValue &&
            t.priority >= targetPriority &&
            t.priority < srcPriority &&
            t.id !== ticketId
          )
            t.priority += 1;
        });
      } else if (targetPriority > srcPriority) {
        out.forEach((t) => {
          const pv = getPropValue(t, propId);
          if (
            pv === srcValue &&
            t.priority <= targetPriority &&
            t.priority > srcPriority &&
            t.id !== ticketId
          )
            t.priority -= 1;
        });
      }
    } else {
      // dropping into a different column ➜ make room there
      out.forEach((t) => {
        if (
          getPropValue(t, propId) === targetValue &&
          t.priority >= targetPriority
        )
          t.priority += 1;
      });
    }

    // update moved ticket
    setPropValue(moved, propId, targetValue);
    moved.priority = targetPriority;

    // stable sort: first by column value, then by priority
    return out.sort((a, b) => {
      const av = getPropValue(a, propId);
      const bv = getPropValue(b, propId);
      return av === bv ? a.priority - b.priority : av.localeCompare(bv);
    });
  };

  const options = [
    { value: "" },
    ...((groupBy as Property & { type: "status" })?.settings?.options || []),
  ];

  const groupedTickets = tickets.reduce<Record<string, Ticket[]>>(
    (accumulator, ticket) => {
      const property = ticket.properties.find((pr) => pr.id === groupBy?.id);

      (accumulator[property?.value ?? ""] =
        accumulator[property?.value ?? ""] || []).push(ticket);

      return accumulator;
    },
    Object.fromEntries(options.map((option) => [option.value, []])),
  );

  const onTicketUpdated = () => {
    router.refresh();
  };

  const handleDragStart = (event: DragStartEvent) => {
    const ticketId = event.active.data?.current?.id;
    setActiveTicket(tickets.find((ticket) => ticket.id === ticketId));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTicket(undefined);

    const ticketId = event.active.data?.current?.id as number | undefined;
    if (!ticketId) return;

    const overTicketId = event.over?.data?.current?.id as number | undefined;
    const overValue = event.over?.data?.current?.status as string | undefined; // column’s property value

    // ---------------- figure out drop target ----------------
    let targetValue: string | undefined;
    let targetPriority: number | undefined;

    const overTicket = tickets.find((t) => t.id === overTicketId);
    if (overTicket) {
      targetValue = getPropValue(overTicket, groupBy?.id);
      targetPriority = overTicket.priority; // insert just above hovered card
    } else if (overValue !== undefined) {
      targetValue = overValue;
      // bottom of the column
      targetPriority =
        Math.max(
          0,
          ...tickets
            .filter((t) => getPropValue(t, groupBy?.id) === targetValue)
            .map((t) => t.priority),
        ) + 1;
    }

    if (targetValue === undefined || targetPriority === undefined) return;

    // ---------------- optimistic UI ----------------
    const optimistic = reorderTickets(
      tickets,
      ticketId,
      targetValue,
      targetPriority,
    );
    setTickets(optimistic);

    // ---------------- server sync ------------------
    if (!groupBy) return;
    changeTicketPropertyValue(ticketId, groupBy?.id, targetValue)
      .then(onTicketUpdated) // refresh from back‑end
      .catch(() => setTickets(tickets)); // revert on error
  };

  const handleDragOver = (event: DragOverEvent) => {
    const ticketId = event.active.data?.current?.id as number | undefined;
    if (!ticketId) return; // nothing to move

    const overId = event.over?.data?.current?.id as number | undefined;
    const columnValue =
      (event.over?.data?.current?.status as string | undefined) ?? // column registered its value on `data`
      (() => {
        const overTicket = tickets.find((t) => t.id === overId);
        return overTicket ? getPropValue(overTicket, groupBy?.id) : undefined;
      })();

    if (columnValue === undefined) return; // we’re over something that isn’t a column we care about

    /* ── optimistic column swap so the card “snaps” while hovering ───────── */
    setTimeout(() => {
      setTickets((prev) => {
        const idx = prev.findIndex((t) => t.id === ticketId);
        if (idx === -1) return prev; // ticket disappeared?

        const currentValue = getPropValue(prev[idx], groupBy?.id);
        if (currentValue === columnValue) return prev; // already in that column

        const next = [...prev];
        next[idx] = { ...next[idx], properties: [...next[idx].properties] };
        setPropValue(next[idx], groupBy?.id, columnValue);

        return next;
      });
    }, 0);
  };

  return {
    tickets,
    setTickets,

    activeTicket,
    setActiveTicket,

    groupBy,
    setGroupBy,

    groupedTickets,

    reorderTickets,

    onTicketUpdated,

    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
};
