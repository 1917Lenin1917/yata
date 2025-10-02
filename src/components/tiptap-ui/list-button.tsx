"use client";

import {
  type ComponentProps,
  type MouseEvent,
  forwardRef,
  useCallback,
} from "react";

import { parseShortcutKeys } from "@/lib/tiptap-utils";

import { useTiptapEditor } from "@/hooks/tiptap/useTiptapEditor";

import { Button } from "@/components/ui/tiptap-button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
type ButtonProps = ComponentProps<typeof Button>;

import {
  type ListType,
  type UseListConfig,
  LIST_SHORTCUT_KEYS,
  useList,
} from "@/hooks/tiptap/useList";

export interface ListButtonProps
  extends Omit<ButtonProps, "type">,
    UseListConfig {
  text?: string;
  showShortcut?: boolean;
  tooltip?: false;
}

export function ListShortcutBadge({
  type,
  shortcutKeys = LIST_SHORTCUT_KEYS[type],
}: {
  type: ListType;
  shortcutKeys?: string;
}) {
  return <Badge>{parseShortcutKeys({ shortcutKeys })}</Badge>;
}

export const ListButton = forwardRef<HTMLButtonElement, ListButtonProps>(
  (
    {
      editor: providedEditor,
      type,
      text,
      hideWhenUnavailable = false,
      onToggled,
      showShortcut = false,
      onClick,
      children,
      tooltip = true,
      ...buttonProps
    },
    ref,
  ) => {
    const { editor } = useTiptapEditor(providedEditor);
    const {
      isVisible,
      canToggle,
      isActive,
      handleToggle,
      label,
      shortcutKeys,
      Icon,
    } = useList({
      editor,
      type,
      hideWhenUnavailable,
      onToggled,
    });

    const handleClick = useCallback(
      (event: MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        handleToggle();
      },
      [handleToggle, onClick],
    );

    if (!isVisible) {
      return null;
    }

    const ButtonElement = (
      <Button
        type="button"
        data-style="ghost"
        data-active-state={isActive ? "on" : "off"}
        role="button"
        tabIndex={-1}
        disabled={!canToggle}
        data-disabled={!canToggle}
        aria-label={label}
        aria-pressed={isActive}
        onClick={handleClick}
        {...buttonProps}
        ref={ref}
      >
        {children ?? (
          <>
            <Icon className="tiptap-button-icon" />
            {text && <span className="tiptap-button-text">{text}</span>}
            {showShortcut && (
              <ListShortcutBadge type={type} shortcutKeys={shortcutKeys} />
            )}
          </>
        )}
      </Button>
    );

    return tooltip ? (
      <Tooltip>
        <TooltipTrigger asChild>{ButtonElement}</TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
    ) : (
      ButtonElement
    );
  },
);

ListButton.displayName = "ListButton";
