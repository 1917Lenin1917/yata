import type { Property } from "@/types/property";
import { DynamicIcon } from "lucide-react/dynamic";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

interface Props {
  property: Property & { type: "text" };
  onNameChange(newName: string, propertyId: number): void;
  onValueChange(newValue: string, propertyId: number): void;
}
export function TextProperty({ property, onNameChange, onValueChange }: Props) {
  const [name, setName] = useState<string>(property.name);
  const [value, setValue] = useState<string>(property.value);

  useEffect(() => {
    if (name === property.name) return;
    onNameChange(name, property.id);
  }, [name]);

  useEffect(() => {
    if (value === property.value) return;
    onValueChange(value, property.id);
  }, [value]);

  return (
    <>
      <div className={"flex gap-1 "}>
        <DynamicIcon className={"h-4 w-4 self-center"} name={property.icon} />
        {/*<span>{property.name}</span>*/}
        <Input
          className={
            "border-none bg-background! ring-0! text-[24px] h-[24px] p-0! shadow-none!"
          }
          value={name}
          onChange={(e) => setName(e.target.value)}
        ></Input>
      </div>
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
