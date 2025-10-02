"use client";

import { type ComponentProps, forwardRef, useCallback, useState } from "react";

import { ChevronDownIcon } from "lucide-react";

import { useTiptapEditor } from "@/hooks/tiptap/useTiptapEditor";

import { HeadingButton } from "@/components/tiptap-ui/heading-button";
import {
  useHeadingDropdownMenu,
  type UseHeadingDropdownMenuConfig,
} from "@/hooks/tiptap/useHeadingDropdownMenu";

import { Button } from "@/components/ui/tiptap-button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

type ButtonProps = ComponentProps<typeof Button>;

export interface HeadingDropdownMenuProps
  extends Omit<ButtonProps, "type">,
    UseHeadingDropdownMenuConfig {
  portal?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
}

export const HeadingDropdownMenu = forwardRef<
  HTMLButtonElement,
  HeadingDropdownMenuProps
>(
  (
    {
      editor: providedEditor,
      levels = [1, 2, 3, 4, 5, 6],
      hideWhenUnavailable = false,
      onOpenChange,
      ...buttonProps
    },
    ref,
  ) => {
    const { editor } = useTiptapEditor(providedEditor);
    const [isOpen, setIsOpen] = useState(false);
    const { isVisible, isActive, canToggle, Icon } = useHeadingDropdownMenu({
      editor,
      levels,
      hideWhenUnavailable,
    });

    const handleOpenChange = useCallback(
      (open: boolean) => {
        if (!editor || !canToggle) return;
        setIsOpen(open);
        onOpenChange?.(open);
      },
      [canToggle, editor, onOpenChange],
    );

    if (!isVisible) {
      return null;
    }

    return (
      <DropdownMenu open={isOpen} onOpenChange={handleOpenChange}>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            data-style="ghost"
            data-active-state={isActive ? "on" : "off"}
            role="button"
            tabIndex={-1}
            disabled={!canToggle}
            data-disabled={!canToggle}
            aria-label="Format text as heading"
            aria-pressed={isActive}
            className={"gap-0"}
            {...buttonProps}
            ref={ref}
          >
            <Icon className="size-4" />
            <ChevronDownIcon className="size-3" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start">
          {levels.map((level) => (
            <DropdownMenuItem
              key={`heading-${level}`}
              asChild
              className={"w-full justify-start"}
            >
              <HeadingButton
                editor={editor}
                level={level}
                text={`Heading ${level}`}
                tooltip={false}
              />
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
);

HeadingDropdownMenu.displayName = "HeadingDropdownMenu";

export default HeadingDropdownMenu;
