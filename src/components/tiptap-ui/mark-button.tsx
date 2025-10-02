"use client";

import {
  type ComponentProps,
  type MouseEvent,
  forwardRef,
  useCallback,
} from "react";

import { parseShortcutKeys } from "@/lib/tiptap-utils";

import { useTiptapEditor } from "@/hooks/tiptap/useTiptapEditor";

import {
  type Mark,
  type UseMarkConfig,
  MARK_SHORTCUT_KEYS,
  useMark,
} from "@/hooks/tiptap/useMark";

import { Button } from "@/components/ui/tiptap-button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type ButtonProps = ComponentProps<typeof Button>;

export interface MarkButtonProps
  extends Omit<ButtonProps, "type">,
    UseMarkConfig {
  text?: string;
  showShortcut?: boolean;
}

export function MarkShortcutBadge({
  type,
  shortcutKeys = MARK_SHORTCUT_KEYS[type],
}: {
  type: Mark;
  shortcutKeys?: string;
}) {
  return <Badge>{parseShortcutKeys({ shortcutKeys })}</Badge>;
}

export const MarkButton = forwardRef<HTMLButtonElement, MarkButtonProps>(
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
      ...buttonProps
    },
    ref,
  ) => {
    const { editor } = useTiptapEditor(providedEditor);
    const {
      isVisible,
      handleMark,
      label,
      canToggle,
      isActive,
      Icon,
      shortcutKeys,
    } = useMark({
      editor,
      type,
      hideWhenUnavailable,
      onToggled,
    });

    const handleClick = useCallback(
      (event: MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        handleMark();
      },
      [handleMark, onClick],
    );

    if (!isVisible) {
      return null;
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            disabled={!canToggle}
            data-style="ghost"
            data-active-state={isActive ? "on" : "off"}
            data-disabled={!canToggle}
            role="button"
            tabIndex={-1}
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
                  <MarkShortcutBadge type={type} shortcutKeys={shortcutKeys} />
                )}
              </>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>{label}</TooltipContent>
      </Tooltip>
    );
  },
);

MarkButton.displayName = "MarkButton";
