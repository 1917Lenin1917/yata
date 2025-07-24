import type { Property } from "@/types/property";
import { PropertyNameBlock } from "@/components/Property/NameBlock";
import { StatusPropertyValue } from "@/components/Property/Status/StatusPropertyValue";
import { ColorBadge } from "@/components/ColorBadge";

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
    property.settings.options.find((v) => v.value === property.value)?.color ??
    "gray";
  return property.value ? (
    <ColorBadge colorName={color}>{property.value}</ColorBadge>
  ) : null;
}
