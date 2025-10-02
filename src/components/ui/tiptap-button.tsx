"use client";

import * as React from "react";
import { Button as BaseButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type BaseButtonProps = React.ComponentProps<typeof BaseButton>;

export function Button({
  className,
  variant,
  size,
  ...props
}: BaseButtonProps) {
  return (
    <BaseButton
      variant={variant ?? "ghost"}
      size={size}
      className={cn(
        "data-[active-state=on]:bg-accent data-[active-state=on]:text-accent-foreground",
        "aria-pressed:bg-accent aria-pressed:text-accent-foreground",

        "[&_svg.tiptap-button-icon]:size-4 [&_.tiptap-button-icon]:size-4",
        "[&_.tiptap-button-text]:text-sm [&_.tiptap-button-text]:ml-1",
        "p-2! h-8!",
        className,
      )}
      {...props}
    />
  );
}

export type ButtonProps = React.ComponentProps<typeof Button>;
