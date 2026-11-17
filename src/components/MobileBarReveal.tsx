"use client";

import { useEffect } from "react";

/** Shows the sticky contact bar (phones & tablets) only after the visitor scrolls down. */
export default function MobileBarReveal() {
  useEffect(() => {
    const root = document.documentElement;
    let ticking = false;
    const update = () => {
      ticking = false;
      root.classList.toggle("mbar-on", scrollY > Math.min(320, innerHeight * 0.4));
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    addEventListener("scroll", onScroll, { passive: true });
    return () => {
      removeEventListener("scroll", onScroll);
      root.classList.remove("mbar-on");
    };
  }, []);
  return null;
}
