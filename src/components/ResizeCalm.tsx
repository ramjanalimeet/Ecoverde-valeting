"use client";

import { useEffect } from "react";

/**
 * While the window is being resized (rotating a phone, DevTools device mode, dragging the window),
 * add html.is-resizing so CSS transitions are switched off. Otherwise every element with a
 * `transition: all` animates to its new size/position, which looks broken for a moment.
 */
export default function ResizeCalm() {
  useEffect(() => {
    const root = document.documentElement;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const onResize = () => {
      root.classList.add("is-resizing");
      clearTimeout(timer);
      timer = setTimeout(() => root.classList.remove("is-resizing"), 250);
    };
    addEventListener("resize", onResize, { passive: true });
    return () => {
      removeEventListener("resize", onResize);
      clearTimeout(timer);
      root.classList.remove("is-resizing");
    };
  }, []);
  return null;
}
