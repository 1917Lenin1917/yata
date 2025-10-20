import {
  useRef,
  type RefObject,
  type PointerEvent as RPointerEvent,
  useEffect,
} from "react";
import { clamp } from "@/lib/utils";

interface Props {
  sidebarRef: RefObject<HTMLDivElement | null>;
  minWidth?: number;
  maxWidth?: number;
  onChange?: (width: number) => void;
  onDragStart?: (width: number) => void;
  onDragEnd?: (width: number) => void;
  saveToLocalStorage?: boolean;
  saveToCookie?: boolean;
}

export default function SidebarDrag({
  sidebarRef,
  minWidth = 160,
  maxWidth = 640,
  onChange,
  onDragStart,
  onDragEnd,
  saveToLocalStorage,
  saveToCookie,
}: Props) {
  const dragState = useRef<{ startX: number; startWidth: number } | null>(null);

  useEffect(() => {
    if (!saveToLocalStorage) return;

    const width = localStorage.getItem("yata-sidebar-width");
    if (!width || !sidebarRef.current) return;

    sidebarRef.current.style.setProperty("--sidebar-width", width);
  }, []);

  const endDrag = () => {
    if (!dragState.current || !sidebarRef.current) return;
    const finalWidth = sidebarRef.current
      .querySelector('[data-slot="sidebar"]')
      ?.getBoundingClientRect().width;

    dragState.current = null;
    document.removeEventListener("pointermove", onMove);
    document.removeEventListener("pointerup", endDrag);
    document.body.style.userSelect = "";
    document.body.style.cursor = "";
    onDragEnd?.(finalWidth || 0);

    if (saveToLocalStorage) {
      localStorage.setItem("yata-sidebar-width", `${finalWidth}px`);
    }
    if (saveToCookie) {
      document.cookie = `yata-sidebar-width=${finalWidth}px; path=/;`;
    }
  };

  const onMove = (event: PointerEvent) => {
    if (!dragState.current || !sidebarRef.current) return;
    const dx = event.clientX - dragState.current.startX;
    const next = clamp(dragState.current.startWidth + dx, minWidth, maxWidth);
    sidebarRef.current.style.setProperty("--sidebar-width", `${next}px`);

    onChange?.(next);
  };

  const startDrag = (e: RPointerEvent) => {
    if (!sidebarRef.current) return;
    const rect = sidebarRef.current
      .querySelector('[data-slot="sidebar"]')
      ?.getBoundingClientRect();

    if (!rect) return;

    dragState.current = { startX: e.clientX, startWidth: rect.width };
    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", endDrag);
    document.body.style.userSelect = "none";
    onDragStart?.(rect.width);
  };

  return (
    <div
      onPointerDown={startDrag}
      className="border-l-2 border-zinc-800 hover:border-zinc-500 w-2 cursor-col-resize select-none"
      style={{ touchAction: "none" }}
      role="separator"
      aria-orientation="vertical"
      aria-label="Resize sidebar"
    />
  );
}
