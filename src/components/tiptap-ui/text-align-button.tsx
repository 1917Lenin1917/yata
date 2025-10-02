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
  type TextAlign,
  type UseTextAlignConfig,
  TEXT_ALIGN_SHORTCUT_KEYS,
  useTextAlign,
} from "@/hooks/tiptap/useTextAlign";

// --- UI ---
import { Button } from "@/components/ui/tiptap-button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type ButtonProps = ComponentProps<typeof Button>;

export interface TextAlignButtonProps
  extends Omit<ButtonProps, "type">,
    UseTextAlignConfig {
  text?: string;
  showShortcut?: boolean;
}

export function TextAlignShortcutBadge({
  align,
  shortcutKeys = TEXT_ALIGN_SHORTCUT_KEYS[align],
}: {
  align: TextAlign;
  shortcutKeys?: string;
}) {
  return <Badge>{parseShortcutKeys({ shortcutKeys })}</Badge>;
}

export const TextAlignButton = forwardRef<
  HTMLButtonElement,
  TextAlignButtonProps
>(
  (
    {
      editor: providedEditor,
      align,
      text,
      hideWhenUnavailable = false,
      onAligned,
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
      handleTextAlign,
      label,
      canAlign,
      isActive,
      Icon,
      shortcutKeys,
    } = useTextAlign({
      editor,
      align,
      hideWhenUnavailable,
      onAligned,
    });

    const handleClick = useCallback(
      (event: MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        if (event.defaultPrevented) return;
        handleTextAlign();
      },
      [handleTextAlign, onClick],
    );

    if (!isVisible) {
      return null;
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            disabled={!canAlign}
            data-style="ghost"
            data-active-state={isActive ? "on" : "off"}
            data-disabled={!canAlign}
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
                  <TextAlignShortcutBadge
                    align={align}
                    shortcutKeys={shortcutKeys}
                  />
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

TextAlignButton.displayName = "TextAlignButton";
