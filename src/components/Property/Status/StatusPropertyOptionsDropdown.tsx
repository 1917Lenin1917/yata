import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { type ColorName, colors } from "@/lib/colors";
import type { Property, SelectOption } from "@/types/property";
import { changePropertySettings } from "@/services/project";
import { useContext, useEffect, useState } from "react";
import { PropertyContext } from "@/contexts/PropertyContext";
import { useTranslation } from "react-i18next";
import { ColorBadge } from "@/components/ColorBadge";

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

  const { t } = useTranslation();

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

  const onOpenChange = (open: boolean) => {
    if (!open) return;
    setStatusValue(status.value);
  };

  const onSelect = (event: Event, newColorName: ColorName) => {
    onColorChange(
      property.id,
      status.value,
      newColorName,
      property.settings,
    ).then(onUpdate);
    event.stopPropagation();
    event.preventDefault();
  };

  const onDeleteClick = async () => {
    await onValueDelete(property.id, status.value, property.settings);
    onUpdate();
  };

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
          <DropdownMenuLabel>
            {t("property.status.options.color")}
          </DropdownMenuLabel>
          {Object.keys(colors).map((colorName, idx) => (
            <DropdownMenuItem
              key={idx}
              onSelect={(event) => onSelect(event, colorName as ColorName)}
            >
              <ColorBadge colorName={colorName as ColorName}>
                {t(`color.${colorName}`)}
              </ColorBadge>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuItem
            className={"data-[highlighted]:text-red-400"}
            onClick={onDeleteClick}
          >
            <Trash2 className={"data-[highlighted]:text-red-400!"} />
            {t("property.status.options.delete")}
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
