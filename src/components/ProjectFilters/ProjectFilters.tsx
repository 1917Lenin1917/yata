import type { GroupByProperty, Project } from "@/types/project";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Funnel, FunnelX, Group } from "lucide-react";
import { useTranslation } from "react-i18next";

interface Props {
  project: Project;
  groupBy?: GroupByProperty;
  setGroupBy(value: GroupByProperty | undefined): void;
}

export default function ProjectFilters({
  project,
  groupBy,
  setGroupBy,
}: Props) {
  const { t } = useTranslation();

  const onSelect = (property: GroupByProperty) => {
    setGroupBy(groupBy?.id === property.id ? undefined : property);
    if (groupBy?.id === property.id) localStorage.removeItem("groupBy");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} className={"cursor-pointer"}>
          {groupBy ? <FunnelX /> : <Funnel />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className={"p-0"}>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <Group className={"w-5 h-5 mr-1"} /> {t("project.group_by")}
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {project.properties
              .filter((pr) => pr.type === "status")
              .map((property, key) => (
                <DropdownMenuCheckboxItem
                  checked={groupBy?.id === property.id}
                  key={key}
                  onSelect={() => onSelect(property)}
                >
                  <span>{property.name}</span>
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
