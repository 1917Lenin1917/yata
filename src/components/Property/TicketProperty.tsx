import type { Property } from "@/types/property";
import { TextProperty } from "@/components/Property/Text/TextProperty";
import {
  DisplayStatus,
  StatusProperty,
} from "@/components/Property/Status/StatusProperty";
import { PropertyContext } from "@/contexts/PropertyContext";

interface Props {
  property: Property;
  onNameChange(newName: string, propertyId: number): void;
  onValueChange(newValue: string, propertyId: number): void;
  onUpdate(): void;
}

const propertyTypeToComponent = {
  text: TextProperty,
  status: StatusProperty,
  number: TextProperty,
  date: TextProperty,
  select: TextProperty,
  checkbox: TextProperty,
};

export function TicketProperty({
  property,
  onNameChange,
  onValueChange,
  onUpdate,
}: Props) {
  const Component = propertyTypeToComponent[property.type];
  return (
    <PropertyContext.Provider
      value={{ property, onUpdate, onNameChange, onValueChange }}
    >
      <Component />
    </PropertyContext.Provider>
  );
}

export function DisplayProperty({ property }: { property: Property }) {
  if (property.type === "status") return <DisplayStatus property={property} />;
}
