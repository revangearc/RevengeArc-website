import { useEffect, useLayoutEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";

/**
 * PortalPopover — renders a floating panel anchored to a trigger element,
 * positioned via fixed coordinates so it cannot be clipped by ancestors.
 *
 * Usage:
 *   const triggerRef = useRef(null);
 *   const [open, setOpen] = useState(false);
 *   <button ref={triggerRef} onClick={() => setOpen(o => !o)}>...</button>
 *   <PortalPopover triggerRef={triggerRef} open={open} onClose={() => setOpen(false)}>
 *     ...panel content...
 *   </PortalPopover>
 */
export default function PortalPopover({
  triggerRef,
  open,
  onClose,
  align = "start",     // "start" | "end" — horizontal alignment to trigger
  side = "bottom",     // "bottom" | "top"
  offset = 6,
  matchWidth = false,
  className = "",
  style = {},
  zIndex = 100000,
  children,
}) {
  const [coords, setCoords] = useState(null);
  const panelRef = useRef(null);

  const recompute = useCallback(() => {
    const el = triggerRef?.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setCoords({
      top: side === "bottom" ? r.bottom + offset : null,
      bottomFromTop: side === "top" ? window.innerHeight - r.top + offset : null,
      left: align === "start" ? r.left : null,
      right: align === "end" ? window.innerWidth - r.right : null,
      width: r.width,
    });
  }, [triggerRef, side, align, offset]);

  useLayoutEffect(() => {
    if (open) recompute();
  }, [open, recompute]);

  useEffect(() => {
    if (!open) return;
    const handler = () => recompute();
    window.addEventListener("scroll", handler, true);
    window.addEventListener("resize", handler);
    return () => {
      window.removeEventListener("scroll", handler, true);
      window.removeEventListener("resize", handler);
    };
  }, [open, recompute]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (panelRef.current?.contains(e.target)) return;
      if (triggerRef?.current?.contains(e.target)) return;
      onClose?.();
    };
    const esc = (e) => { if (e.key === "Escape") onClose?.(); };
    document.addEventListener("mousedown", handler);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("keydown", esc);
    };
  }, [open, onClose, triggerRef]);

  if (!open || !coords) return null;

  const positionStyle = {
    position: "fixed",
    zIndex,
    ...(coords.top != null ? { top: coords.top } : {}),
    ...(coords.bottomFromTop != null ? { bottom: coords.bottomFromTop } : {}),
    ...(coords.left != null ? { left: coords.left } : {}),
    ...(coords.right != null ? { right: coords.right } : {}),
    ...(matchWidth ? { width: coords.width } : {}),
    ...style,
  };

  return createPortal(
    <div ref={panelRef} style={positionStyle} className={className}>
      {children}
    </div>,
    document.body
  );
}
