"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Ticket } from "@/types/ticket";
import { useContext, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useDebounce } from "@/hooks/useDebounce";
import {
  changeTicketDescription,
  changeTicketPropertyName,
  changeTicketPropertyValue,
  changeTicketTitle,
} from "@/services/ticket";
import { TicketProperty } from "@/components/Property";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Command, CommandItem } from "@/components/ui/command";
import { ProjectContext } from "@/contexts/ProjectContext";
import { PROPERTIES } from "@/constants/properties";
import { DynamicIcon, type IconName } from "lucide-react/dynamic";
import { useTranslation } from "react-i18next";
import { createProjectProperty } from "@/services/project";

interface Props {
  ticket: Ticket;
  isOpen: boolean;
  setIsOpen(value: boolean): void;
  onTicketUpdated(): void;
}

const onTitleChange = async (ticketId: number, newTitle: string) => {
  await changeTicketTitle(ticketId, newTitle);
};

const onDescriptionChange = async (
  ticketId: number,
  newDescription: string,
) => {
  await changeTicketDescription(ticketId, newDescription);
};

const onNameChange = async (newName: string, propertyId: number) => {
  await changeTicketPropertyName(propertyId, newName);
};
const onValueChange = async (
  newValue: string,
  propertyId: number,
  ticketId: number,
) => {
  await changeTicketPropertyValue(ticketId, propertyId, newValue);
};

const onPropertyCreate = async (
  iconName: IconName,
  propertyType: string,
  projectId: number,
  settings: string,
) => {
  await createProjectProperty(iconName, propertyType, projectId, settings);
};

export default function TicketModal({
  ticket,
  isOpen,
  setIsOpen,
  onTicketUpdated,
}: Props) {
  const { t } = useTranslation();
  const project = useContext(ProjectContext);

  const [title, setTitle] = useState<string | undefined>(ticket?.title);
  const [description, setDescription] = useState<string | undefined>(
    ticket?.description,
  );

  const debouncedTitle = useDebounce(title, 500);
  const debouncedDescription = useDebounce(description, 500);

  useEffect(() => {
    if (debouncedTitle === ticket.title) return;
    onTitleChange(ticket.id, debouncedTitle ?? "").then(onTicketUpdated);
  }, [debouncedTitle, onTicketUpdated, ticket.id, ticket.title]);

  useEffect(() => {
    if (debouncedDescription === ticket.description) return;
    onDescriptionChange(ticket.id, debouncedDescription ?? "").then(
      onTicketUpdated,
    );
  }, [debouncedDescription, onTicketUpdated, ticket.description, ticket.id]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className={"lg:max-w-[800px] px-8"}>
        <DialogHeader>
          <DialogTitle></DialogTitle>
        </DialogHeader>
        <div className={"min-h-[300px] flex flex-col gap-8"}>
          <Input
            className={
              "border-none bg-background! ring-0! text-3xl! h-10! p-0! shadow-none!"
            }
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={"No title"}
          ></Input>

          <div className={"grid grid-cols-[160px_1fr] gap-1"}>
            {ticket.properties.map((property, index) => (
              <TicketProperty
                onNameChange={(newName, propertyId) =>
                  onNameChange(newName, propertyId).then(onTicketUpdated)
                }
                onValueChange={(newValue, propertyId) =>
                  onValueChange(newValue, propertyId, ticket.id).then(
                    onTicketUpdated,
                  )
                }
                onUpdate={onTicketUpdated}
                key={index}
                property={property}
              />
            ))}
            <Popover>
              <PopoverTrigger asChild>
                <Button className={"h-[24px] justify-start"} variant={"ghost"}>
                  <Plus /> Add property
                </Button>
              </PopoverTrigger>
              <PopoverContent className={"w-[160px] p-0"}>
                <Command>
                  {PROPERTIES.map((property) => (
                    <CommandItem
                      onSelect={() =>
                        onPropertyCreate(
                          property.icon,
                          property.type,
                          project?.id,
                          property.settings,
                        ).then(onTicketUpdated)
                      }
                      key={property.type}
                    >
                      <DynamicIcon name={property.icon} />
                      {t(`property.${property.type}`)}
                    </CommandItem>
                  ))}
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <Textarea
            className={"bg-background! ring-0! text-xl! min-h-40"}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={"No description"}
          ></Textarea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
