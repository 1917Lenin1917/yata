import type { Property } from "@/types/property";
import { Badge } from "@/components/ui/badge";
import { colors } from "@/lib/colors";
import { PropertyNameBlock } from "@/components/Property/NameBlock";
import { StatusPropertyValue } from "@/components/Property/Status/StatusPropertyValue";

export function StatusProperty() {
  return (
    <>
      <PropertyNameBlock />
      <StatusPropertyValue />
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
