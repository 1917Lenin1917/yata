"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Ticket } from "@/types/ticket";
import { useEffect, useState } from "react";
import { DialogBody } from "next/dist/client/components/react-dev-overlay/ui/components/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useDebounce } from "@/hooks/useDebounce";
import { changeTicketTitle } from "@/services/ticket";
import { BadgeAlert } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface Props {
  ticket: Ticket;
  isOpen: boolean;
  setIsOpen(value: boolean): void;
  onTicketUpdated(): void;
}

const onTitleChange = async (ticketId: number, newTitle: string) => {
  await changeTicketTitle(ticketId, newTitle);
};

export default function TicketModal({
  ticket,
  isOpen,
  setIsOpen,
  onTicketUpdated,
}: Props) {
  const [title, setTitle] = useState<string | undefined>(ticket?.title);
  const [description, setDescription] = useState<string | undefined>(
    ticket?.description,
  );

  const debouncedTitle = useDebounce(title, 500);

  useEffect(() => {
    onTitleChange(ticket.id, debouncedTitle ?? "").then(onTicketUpdated);
  }, [debouncedTitle, title, onTicketUpdated, ticket.id]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle></DialogTitle>
        </DialogHeader>
        <DialogBody className={"min-h-[300px] flex flex-col gap-8"}>
          <Input
            className={"border-none bg-background! ring-0! text-3xl! h-10!"}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={"No title"}
          ></Input>

          <div className={"flex gap-2 px-4"}>
            <div className={"flex gap-1 text-xl justify-center items-center"}>
              <BadgeAlert className={"h-5 w-5"} /> Status:
            </div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder={"Select a status"}></SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={"pending"}>
                  <Badge className={"bg-blue-400"}>PENDING</Badge>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Textarea
            className={"bg-background! ring-0! text-xl! min-h-40"}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={"No description"}
          ></Textarea>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
