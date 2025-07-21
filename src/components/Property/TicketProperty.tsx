import type { Property } from "@/types/property";
import { TextProperty } from "@/components/Property/TextProperty";
import {
  DisplayStatus,
  StatusProperty,
} from "@/components/Property/StatusProperty";

interface Props {
  property: Property;
  onNameChange(newName: string, propertyId: number): void;
  onValueChange(newValue: string, propertyId: number): void;
  onUpdate(): void;
}

export function TicketProperty({
  property,
  onNameChange,
  onValueChange,
  onUpdate,
}: Props) {
  if (property.type === "text")
    return (
      <TextProperty
        property={property}
        onNameChange={onNameChange}
        onValueChange={onValueChange}
      />
    );
  if (property.type === "status")
    return (
      <StatusProperty
        property={property}
        onNameChange={onNameChange}
        onValueChange={onValueChange}
        onUpdate={onUpdate}
      />
    );
}

export function DisplayProperty({ property }: { property: Property }) {
  if (property.type === "status") return <DisplayStatus property={property} />;
}
