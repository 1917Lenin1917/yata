import { useContext, useEffect, useState } from "react";
import { PropertyContext } from "@/contexts/PropertyContext";
import { DynamicIcon } from "lucide-react/dynamic";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

export function PropertyNameBlock() {
  const { property, onNameChange } = useContext(PropertyContext);

  const [name, setName] = useState<string>(property.name);

  useEffect(() => {
    if (name === property.name) return;
    onNameChange(name, property.id);
  }, [name]);

  return (
    <div className={"flex gap-1 pl-3"}>
      <DynamicIcon
        className={"h-[24px] aspect-square self-center"}
        name={property.icon}
      />
      <Input
        className={
          "border-none bg-background! ring-0! text-[24px] h-[24px] p-0! shadow-none!"
        }
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Button variant={"ghost"} className={"p-0 w-fit h-[24px]"}>
        <MoreHorizontal />
      </Button>
    </div>
  );
}
