import { useContext, useState } from "react";
import { PropertyContext } from "@/contexts/PropertyContext";
import { DynamicIcon } from "lucide-react/dynamic";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, Eye, Settings2, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Input } from "@/components/ui/input";

export function PropertyNameBlock() {
  const { property, onNameChange, onVisibilityChange, onDelete } =
    useContext(PropertyContext);

  const { t } = useTranslation();

  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [name, setName] = useState<string>(property.name);

  const onDeleteClick = () => {
    onDelete(property.id);
  };

  return (
    <div className={"flex gap-1"}>
      <DropdownMenu onOpenChange={() => setShowSettings(false)}>
        <DropdownMenuTrigger asChild>
          <Button
            variant={"ghost"}
            className={"p-0 w-full h-[24px] justify-start"}
          >
            <DynamicIcon
              className={"h-[24px] aspect-square self-center"}
              name={property.icon}
            />
            {property.name}
          </Button>
        </DropdownMenuTrigger>
        {showSettings ? (
          <DropdownMenuContent
            className={"w-[var(--radix-dropdown-menu-trigger-width)]"}
          >
            <div className={"flex gap-2"}>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
              <Button
                onClick={() => onNameChange(name, property.id)}
                variant={"outline"}
              >
                <Check />
              </Button>
            </div>
          </DropdownMenuContent>
        ) : (
          <DropdownMenuContent
            className={"w-[var(--radix-dropdown-menu-trigger-width)]"}
          >
            <DropdownMenuItem
              onClick={(event) => {
                event.stopPropagation();
                event.preventDefault();
                setShowSettings(true);
              }}
            >
              <Settings2 className={"text-primary"} />
              {t("ticket.settings")}
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className={"gap-2"}>
                <Eye className={"w-4 h-4"} /> {t("ticket.visibility")}
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup
                  value={String(property.showOnCard)}
                  onValueChange={(value) =>
                    onVisibilityChange(value === "true", property.id)
                  }
                >
                  <DropdownMenuRadioItem value={"false"}>
                    {t("ticket.hide")}
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value={"true"}>
                    {t("ticket.show")}
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuItem
              className={"data-[highlighted]:text-red-400"}
              onClick={onDeleteClick}
            >
              <Trash2 className={"data-[highlighted]:text-red-400!"} />
              {t("ticket.delete_property")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        )}
      </DropdownMenu>
    </div>
  );
}
