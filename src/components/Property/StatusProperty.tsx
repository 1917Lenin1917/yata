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
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type ColorName, colors } from "@/lib/colors";
import { Input } from "@/components/ui/input";
import { changePropertySettings } from "@/services/project";
import { useDebounce } from "@/hooks/useDebounce";

interface Props {
  property: Property & { type: "status" };
  onNameChange(newName: string, propertyId: number): void;
  onValueChange(newValue: string, propertyId: number): void;
  onUpdate(): void;
}

async function onNewOptionAdded(
  propertyId: number,
  optionName: string,
  optionColor: ColorName,
  settings: (Property & { type: "status" })["settings"],
) {
  await changePropertySettings(propertyId, {
    ...settings,
    options: [...settings.options, { value: optionName, color: optionColor }],
  });
}

async function onColorChange(
  propertyId: number,
  optionName: string,
  optionColor: ColorName,
  settings: (Property & { type: "status" })["settings"],
) {
  const changedProperty = settings.options.findIndex(
    (opt) => opt.value === optionName,
  );
  await changePropertySettings(propertyId, {
    ...settings,
    options: [
      ...settings.options.with(changedProperty, {
        value: optionName,
        color: optionColor,
      }),
    ],
  });
}

async function onValueNameChange(
  propertyId: number,
  oldName: string,
  newName: string,
  settings: (Property & { type: "status" })["settings"],
) {
  const changedProperty = settings.options.findIndex(
    (opt) => opt.value === oldName,
  );
  await changePropertySettings(propertyId, {
    ...settings,
    options: [
      ...settings.options.with(changedProperty, {
        value: newName,
        color: settings.options[changedProperty].color,
      }),
    ],
  });
}

export function StatusProperty({
  property,
  onValueChange,
  onNameChange,
  onUpdate,
}: Props) {
  const [input, setInput] = useState<string>("");
  const [name, setName] = useState<string>(property.name);
  const [value, setValue] = useState<string>(property.value);
  const [oldValueName, setOldValueName] = useState<string>("");
  const [valueName, setValueName] = useState<string>("");

  const [open, setOpen] = useState(false);

  const debouncedValueName = useDebounce(valueName, 500);

  useEffect(() => {
    if (name === property.name) return;
    onNameChange(name, property.id);
  }, [name]);

  useEffect(() => {
    if (value === property.value) return;
    onValueChange(value, property.id);
  }, [value]);

  useEffect(() => {
    if (!debouncedValueName) return;

    onValueNameChange(
      property.id,
      oldValueName,
      debouncedValueName,
      property.settings,
    ).then(onUpdate);
  }, [debouncedValueName]);

  const color =
    colors[
      property.settings.options.find((v) => v.value === value)?.color ?? "blue"
    ];
  return (
    <>
      <div className={"flex gap-1 pl-3"}>
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
              <Badge style={{ backgroundColor: color.primary }}>{value}</Badge>
            ) : (
              ""
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput
              value={input}
              onValueChange={setInput}
              placeholder="Search status..."
              className="h-9"
            />
            <CommandList>
              <CommandEmpty>No status found...</CommandEmpty>
              <CommandGroup>
                {property.settings.options.map((status) => (
                  <CommandItem
                    className={
                      "justify-between has-[button:hover]:!bg-transparent has-[button[data-state=open]]:!bg-transparent"
                    }
                    key={status.value}
                    value={status.value}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue);
                      setOpen(false);
                    }}
                  >
                    <Badge
                      style={{ backgroundColor: colors[status.color].primary }}
                    >
                      {status.value}
                    </Badge>
                    <DropdownMenu
                      onOpenChange={(op) => {
                        if (op) {
                          setValueName(status.value);
                          setOldValueName(status.value);
                        }
                      }}
                    >
                      <DropdownMenuTrigger asChild>
                        <Button variant={"ghost"} className={"p-0 w-fit h-fit"}>
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        side={"right"}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Input
                          value={valueName}
                          onChange={(e) => setValueName(e.target.value)}
                        />
                        <DropdownMenuGroup>
                          <DropdownMenuLabel>Color</DropdownMenuLabel>
                          {Object.entries(colors).map(([key, value]) => (
                            <DropdownMenuItem
                              key={key}
                              onSelect={(e) => {
                                onColorChange(
                                  property.id,
                                  status.value,
                                  key as ColorName,
                                  property.settings,
                                ).then(onUpdate);
                                e.stopPropagation();
                                e.preventDefault();
                              }}
                            >
                              <Badge style={{ backgroundColor: value.primary }}>
                                {key}
                              </Badge>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </CommandItem>
                ))}
                {input ? (
                  <>
                    <div>Or create new...</div>
                    <CommandItem
                      onSelect={async () => {
                        await onNewOptionAdded(
                          property.id,
                          input,
                          "gray",
                          property.settings,
                        );
                        setInput("");
                        onUpdate();
                      }}
                    >
                      <Badge
                        style={{ backgroundColor: colors["gray"].primary }}
                      >
                        {input}
                      </Badge>
                    </CommandItem>
                  </>
                ) : null}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
}

interface StatusProps {
  property: Property & { type: "status" };
}

export function DisplayStatus({ property }: StatusProps) {
  const color =
    colors[
      property.settings.options.find((v) => v.value === property.value)
        ?.color ?? "gray"
    ];
  return property.value ? (
    <Badge style={{ backgroundColor: color.primary }}>{property.value}</Badge>
  ) : null;
}
