import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { PropertyContext } from "@/contexts/PropertyContext";
import type { Property, SelectOption } from "@/types/property";
import { type Color, type ColorName, colors } from "@/lib/colors";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { changePropertySettings } from "@/services/project";
import { StatusPropertyOptionsDropdown } from "@/components/Property/Status/StatusPropertyOptionsDropdown";

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

export function StatusPropertyValue() {
  const { onUpdate, onValueChange, ...ctx } = useContext(PropertyContext);
  const property = ctx.property as Property & { type: "status" };

  const [input, setInput] = useState<string>("");
  const [value, setValue] = useState<string>(property.value);
  const [open, setOpen] = useState<boolean>(false);

  const selectedOption = useMemo<SelectOption | undefined>(
    () => property.settings.options.find((option) => option.value === value),
    [property, value],
  );

  const color = useMemo<Color>(
    () => colors[selectedOption?.color || "gray"],
    [selectedOption],
  );

  const showCreateNew = useMemo<boolean>(
    () =>
      !!(
        input &&
        property.settings.options.findIndex((opt) => opt.value === input) === -1
      ),
    [input, property.settings.options],
  );

  const onSelect = useCallback(
    (currentValue: string) => {
      setValue(currentValue === value ? "" : currentValue);
      setOpen(false);
    },
    [value],
  );

  const onNewOptionSelect = useCallback(async () => {
    await onNewOptionAdded(property.id, input, "gray", property.settings);
    setInput("");
    onUpdate();
  }, [input, onUpdate, property.id, property.settings]);

  useEffect(() => {
    if (value === property.value) return;
    onValueChange(value, property.id);
  }, [value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] h-[24px] justify-start p-0"
        >
          {value && (
            <Badge style={{ backgroundColor: color.primary }}>{value}</Badge>
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
            <CommandGroup>
              {property.settings.options.map((status, key) => (
                <CommandItem
                  className={
                    "justify-between has-[button:hover]:!bg-transparent has-[button[data-state=open]]:!bg-transparent"
                  }
                  key={key}
                  value={status.value}
                  onSelect={onSelect}
                >
                  <Badge
                    style={{ backgroundColor: colors[status.color].primary }}
                  >
                    {status.value}
                  </Badge>
                  <StatusPropertyOptionsDropdown status={status} />
                </CommandItem>
              ))}
            </CommandGroup>
            {showCreateNew && (
              <CommandGroup heading={"Create new"} forceMount>
                <CommandItem onSelect={onNewOptionSelect}>
                  <Badge style={{ backgroundColor: colors["gray"].primary }}>
                    {input}
                  </Badge>
                </CommandItem>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
