import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { type ColorName, colors } from "@/lib/colors";
import { Badge } from "@/components/ui/badge";
import type { Property, SelectOption } from "@/types/property";
import { changePropertySettings } from "@/services/project";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { PropertyContext } from "@/contexts/PropertyContext";

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

async function onValueDelete(
  propertyId: number,
  name: string,
  settings: (Property & { type: "status" })["settings"],
) {
  await changePropertySettings(propertyId, {
    ...settings,
    options: settings.options.filter((opt) => opt.value !== name),
  });
}

interface Props {
  status: SelectOption;
}

export function StatusPropertyOptionsDropdown({ status }: Props) {
  const { onUpdate, ...ctx } = useContext(PropertyContext);
  const property = ctx.property as Property & { type: "status" };

  const [statusValue, setStatusValue] = useState<string>(status.value);

  useEffect(() => {
    if (statusValue === status.value) return;

    onValueNameChange(
      property.id,
      status.value,
      statusValue,
      property.settings,
    ).then(onUpdate);
  }, [statusValue]);

  const onOpenChange = useCallback(
    (open: boolean) => {
      if (!open) return;
      setStatusValue(status.value);
    },
    [status.value],
  );

  const onSelect = useCallback(
    (event: Event, newColorName: ColorName) => {
      onColorChange(
        property.id,
        status.value,
        newColorName,
        property.settings,
      ).then(onUpdate);
      event.stopPropagation();
      event.preventDefault();
    },
    [onUpdate, property.id, property.settings, status.value],
  );

  const onDeleteClick = useCallback(async () => {
    await onValueDelete(property.id, status.value, property.settings);
    onUpdate();
  }, [onUpdate, property.id, property.settings, status.value]);

  const colorOptions = useMemo(
    () =>
      Object.entries(colors).map(([colorName, colorValue], idx) => (
        <DropdownMenuItem
          key={idx}
          onSelect={(event) => onSelect(event, colorName as ColorName)}
        >
          <Badge style={{ backgroundColor: colorValue.primary }}>
            {colorName}
          </Badge>
        </DropdownMenuItem>
      )),
    [onSelect],
  );

  return (
    <DropdownMenu onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} className={"p-0 w-fit h-fit"}>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side={"right"} onClick={(e) => e.stopPropagation()}>
        <Input
          value={statusValue}
          onChange={(e) => setStatusValue(e.target.value)}
        />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Color</DropdownMenuLabel>
          {colorOptions}
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <Button
            variant={"destructive"}
            className={"w-full cursor-pointer"}
            onClick={onDeleteClick}
          >
            Delete
          </Button>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
