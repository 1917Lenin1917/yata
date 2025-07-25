import type { Property } from "@/types/property";
import {
  DisplayText,
  TextProperty,
} from "@/components/Property/Text/TextProperty";
import {
  DisplayStatus,
  StatusProperty,
} from "@/components/Property/Status/StatusProperty";
import { PropertyContext } from "@/contexts/PropertyContext";

interface Props {
  property: Property;
  onNameChange(newName: string, propertyId: number): void;
  onValueChange(newValue: string, propertyId: number): void;
  onVisibilityChange(newValue: boolean, propertyId: number): void;
  onDelete(propertyId: number): void;
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
  onVisibilityChange,
  onDelete,
}: Props) {
  const Component = propertyTypeToComponent[property.type];
  return (
    <PropertyContext
      value={{
        property,
        onUpdate,
        onNameChange,
        onValueChange,
        onVisibilityChange,
        onDelete,
      }}
    >
      <Component />
    </PropertyContext>
  );
}

export function DisplayProperty({ property }: { property: Property }) {
  if (property.type === "text") return <DisplayText property={property} />;
  if (property.type === "status") return <DisplayStatus property={property} />;
}
