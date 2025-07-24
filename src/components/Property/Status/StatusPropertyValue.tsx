import { useContext, useEffect, useState } from "react";
import { PropertyContext } from "@/contexts/PropertyContext";
import type { Property } from "@/types/property";
import { type ColorName } from "@/lib/colors";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { changePropertySettings } from "@/services/project";
import { StatusPropertyOptionsDropdown } from "@/components/Property/Status/StatusPropertyOptionsDropdown";
import { ColorBadge } from "@/components/ColorBadge";
import { useTranslation } from "react-i18next";

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

  const { t } = useTranslation();

  const [input, setInput] = useState<string>("");
  const [value, setValue] = useState<string>(property.value);
  const [open, setOpen] = useState<boolean>(false);

  const selectedOption = property.settings.options.find(
    (option) => option.value === value,
  );

  const color = selectedOption?.color || "gray";

  const showCreateNew = !!(
    input &&
    property.settings.options.findIndex((opt) => opt.value === input) === -1
  );

  const onSelect = (currentValue: string) => {
    setValue(currentValue === value ? "" : currentValue);
    setOpen(false);
  };

  const onNewOptionSelect = async () => {
    await onNewOptionAdded(property.id, input, "gray", property.settings);
    setInput("");
    onUpdate();
  };

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
          {value && <ColorBadge colorName={color}>{value}</ColorBadge>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput
            value={input}
            onValueChange={setInput}
            placeholder={t("property.status.options.search")}
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
                  <ColorBadge colorName={status.color}>
                    {status.value}
                  </ColorBadge>
                  <StatusPropertyOptionsDropdown status={status} />
                </CommandItem>
              ))}
            </CommandGroup>
            {showCreateNew && (
              <CommandGroup heading={"Create new"} forceMount>
                <CommandItem onSelect={onNewOptionSelect}>
                  <ColorBadge colorName={"gray"}>{input}</ColorBadge>
                </CommandItem>
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
