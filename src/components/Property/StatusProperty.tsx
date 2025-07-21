import type { Property } from "@/types/property";
import { DynamicIcon } from "lucide-react/dynamic";
import { useEffect, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { Button } from "../ui/button";
import { MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { colors } from "@/lib/colors";
import { Input } from "@/components/ui/input";

interface Props {
  property: Property & { type: "status" };
  onNameChange(newName: string, propertyId: number): void;
  onValueChange(newValue: string, propertyId: number): void;
}
export function StatusProperty({
  property,
  onValueChange,
  onNameChange,
}: Props) {
  const [name, setName] = useState<string>(property.name);
  const [value, setValue] = useState<string>(property.value);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (name === property.name) return;
    onNameChange(name, property.id);
  }, [name]);

  useEffect(() => {
    if (value === property.value) return;
    onValueChange(value, property.id);
  }, [value]);

  const color =
    colors[
      property.settings.options.find((v) => v.value === value)?.color ?? "blue"
    ];
  return (
    <>
      <div className={"flex gap-1 "}>
        <DynamicIcon className={"h-4 w-4 self-center"} name={property.icon} />
        <Input
          className={
            "border-none bg-background! ring-0! text-[24px] h-[24px] p-0! shadow-none!"
          }
          value={name}
          onChange={(e) => setName(e.target.value)}
        ></Input>
      </div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] h-[24px] justify-start p-0"
          >
            {value ? (
              <Badge className={`bg-${color.primary}`}>{value}</Badge>
            ) : (
              ""
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search status..." className="h-9" />
            <CommandList>
              <CommandEmpty>No status found...</CommandEmpty>
              <CommandGroup>
                {property.settings.options.map((status) => (
                  <CommandItem
                    className={"justify-between"}
                    key={status.value}
                    value={status.value}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    <Badge className={`bg-${colors[status.color].primary}`}>
                      {status.value}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <MoreHorizontal />
                      </DropdownMenuTrigger>
                    </DropdownMenu>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
}
