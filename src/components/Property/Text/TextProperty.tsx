import { useContext, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { PropertyContext } from "@/contexts/PropertyContext";
import { PropertyNameBlock } from "@/components/Property/NameBlock";
import type { Property } from "@/types/property";

export function TextProperty() {
  const { property, onValueChange } = useContext(PropertyContext);

  const [value, setValue] = useState<string>(property.value);

  useEffect(() => {
    if (value === property.value) return;
    onValueChange(value, property.id);
  }, [value]);

  return (
    <>
      <PropertyNameBlock />
      <Input
        className={
          "border-none bg-background! ring-0! text-[24px] h-[24px] p-0! shadow-none!"
        }
        value={value}
        onChange={(e) => setValue(e.target.value)}
      ></Input>
    </>
  );
}

interface TextProps {
  property: Property & { type: "text" };
}

export function DisplayText({ property }: TextProps) {
  return <div>{property.value}</div>;
}
