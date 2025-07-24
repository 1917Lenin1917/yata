import { createContext } from "react";
import type { Property } from "@/types/property";

export const PropertyContext = createContext<{
  property: Property;
  onNameChange(newName: string, propertyId: number): void;
  onValueChange(newValue: string, propertyId: number): void;
  onUpdate(): void;
}>({
  property: null as unknown as Property,
  onNameChange() {},
  onValueChange() {},
  onUpdate() {},
});
