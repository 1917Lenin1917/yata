"use client";

import { useCallback, useEffect, useState } from "react";
import type { Editor } from "@tiptap/react";
import { useWindowSize } from "@/hooks/useWindowSize";

export interface CursorVisibilityOptions {
  editor?: Editor | null;
  overlayHeight?: number;
}

export type RectState = Omit<DOMRect, "toJSON">;

export function useCursorVisibility({
  editor,
  overlayHeight = 0,
}: CursorVisibilityOptions) {
  const { height: windowHeight } = useWindowSize();
  const [rect, setRect] = useState<RectState>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  });

  const updateRect = useCallback(() => {
    const element = document.body;

    const DOMRect = element.getBoundingClientRect();
    setRect(DOMRect);
  }, []);

  useEffect(() => {
    const element = document.body;

    updateRect();

    const resizeObserver = new ResizeObserver(() => {
      window.requestAnimationFrame(updateRect);
    });

    resizeObserver.observe(element);
    window.addEventListener("scroll", updateRect, true);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("scroll", updateRect);
    };
  }, [updateRect]);

  useEffect(() => {
    const ensureCursorVisibility = () => {
      if (!editor) return;

      const { state, view } = editor;

      if (!view.hasFocus()) return;

      // Get current cursor position coordinates
      const { from } = state.selection;
      const cursorCoords = view.coordsAtPos(from);

      if (windowHeight < rect.height) {
        if (cursorCoords) {
          // Check if there's enough space between cursor and bottom of window
          const availableSpace = windowHeight - cursorCoords.top;

          // If not enough space, scroll to position cursor in the middle of viewport
          if (availableSpace < overlayHeight) {
            // Calculate target scroll position to center cursor in viewport
            // Account for overlay height to ensure cursor is not hidden
            const targetCursorY = Math.max(windowHeight / 2, overlayHeight);

            // Get current scroll position and cursor's absolute position
            const currentScrollY = window.scrollY;
            const cursorAbsoluteY = cursorCoords.top + currentScrollY;

            // Calculate new scroll position
            const newScrollY = cursorAbsoluteY - targetCursorY;

            window.scrollTo({
              top: Math.max(0, newScrollY),
              behavior: "smooth",
            });
          }
        }
      }
    };

    ensureCursorVisibility();
  }, [editor, overlayHeight, windowHeight, rect.height]);

  return rect;
}
