"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CloseIcon } from "./Icons";
import QuoteForm from "./QuoteForm";

/**
 * Site-wide quote pop-up. Any same-origin link to "#quote" (Book Now, Get a Free Quote, service CTAs…)
 * opens it; "?service=<slug>#quote" preselects that service.
 */
export default function QuoteModal() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const [preset, setPreset] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  const open = useCallback((service?: string | null) => {
    const d = dialogRef.current;
    if (!d) return;
    setPreset(service ?? null);
    setNonce((n) => n + 1);
    lastFocus.current = document.activeElement as HTMLElement | null;
    if (!d.open) d.showModal();
    document.documentElement.classList.add("modal-open");
  }, []);

  const close = useCallback(() => dialogRef.current?.close(), []);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const a = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!a) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.hash !== "#quote") return;
      // Capture phase on window runs before Next <Link>'s handler, so we can take over the click.
      e.preventDefault();
      e.stopPropagation();
      open(url.searchParams.get("service"));
    };
    window.addEventListener("click", onClick, true);
    if (location.hash === "#quote") {
      open(new URLSearchParams(location.search).get("service"));
      history.replaceState(null, "", location.pathname);
    }
    return () => window.removeEventListener("click", onClick, true);
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      id="quote"
      className="quote-modal"
      aria-label="Request your free quote"
      onClose={() => {
        document.documentElement.classList.remove("modal-open");
        lastFocus.current?.focus?.();
      }}
      onClick={(e) => {
        if (e.target === dialogRef.current) close();
      }}
    >
      <button type="button" className="quote-modal__close icon-btn icon-btn--sm" onClick={close} aria-label="Close quote form">
        <CloseIcon width={16} height={16} />
      </button>
      <QuoteForm preset={preset} nonce={nonce} onClose={close} />
    </dialog>
  );
}
