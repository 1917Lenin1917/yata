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
import {
  changeVisibility,
  createProjectProperty,
  deleteProperty,
} from "@/services/project";
import type { Property } from "@/types/property";
import { type EditorEvents } from "@tiptap/react";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";

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
  propertyType: Property["type"],
  projectId: number,
  settings: string,
) => {
  await createProjectProperty(iconName, propertyType, projectId, settings);
};

const onVisibilityChange = async (newValue: boolean, propertyId: number) => {
  await changeVisibility(propertyId, newValue);
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
  const [desc, setDesc] = useState<string | undefined>(ticket.description);

  const debouncedTitle = useDebounce(title, 500);
  const debouncedDesc = useDebounce(desc, 500);

  const onDescriptionUpdate = ({ editor }: EditorEvents["update"]) => {
    const description = editor.getJSON();
    setDesc(JSON.stringify(description));
  };

  useEffect(() => {
    if (debouncedTitle === ticket.title) return;
    onTitleChange(ticket.id, debouncedTitle ?? "").then(onTicketUpdated);
  }, [debouncedTitle, onTicketUpdated, ticket.id, ticket.title]);

  useEffect(() => {
    if (debouncedDesc === ticket.description) return;
    onDescriptionChange(ticket.id, debouncedDesc ?? "").then(onTicketUpdated);
  }, [debouncedDesc, onTicketUpdated, ticket.description, ticket.id]);

  if (!project) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className={"lg:max-w-[840px] px-8"}>
        <DialogHeader>
          <DialogTitle></DialogTitle>
        </DialogHeader>
        <div className={"min-h-[300px] flex flex-col gap-8"}>
          <Input
            className={
              "border-none bg-background! ring-0! text-3xl! h-10! p-0! px-3! shadow-none!"
            }
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={t("ticket.no_title")}
          ></Input>

          <div className={"grid grid-cols-[200px_1fr] gap-1"}>
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
                onDelete={(propertyId) =>
                  deleteProperty(propertyId).then(onTicketUpdated)
                }
                onVisibilityChange={(newValue, propertyId) =>
                  onVisibilityChange(newValue, propertyId).then(onTicketUpdated)
                }
                onUpdate={onTicketUpdated}
                key={index}
                property={property}
              />
            ))}
            <Popover>
              <PopoverTrigger asChild>
                <Button className={"h-[24px] justify-start"} variant={"ghost"}>
                  <Plus /> {t("ticket.add_property")}
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
                          project.id,
                          property.settings as never,
                        ).then(onTicketUpdated)
                      }
                      key={property.type}
                    >
                      <DynamicIcon name={property.icon} />
                      {t(`property.${property.type}.name`)}
                    </CommandItem>
                  ))}
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <SimpleEditor
            content={desc ? JSON.parse(desc) : undefined}
            onUpdate={onDescriptionUpdate}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
