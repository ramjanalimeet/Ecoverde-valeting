"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { CloseIcon } from "./Icons";
import dynamic from "next/dynamic";

// The form (validation, photo upload…) is kept out of the first page load, then fetched in the
// background once the page is idle — or as soon as a quote button is touched/hovered — so the
// pop-up opens instantly.
const loadQuoteForm = () => import("./QuoteForm");
const QuoteForm = dynamic(loadQuoteForm, { ssr: false });

/**
 * Site-wide quote pop-up. Any same-origin link to "#quote" (Book Now, Get a Free Quote, service CTAs…)
 * opens it; "?service=<slug>#quote" preselects that service.
 */
export default function QuoteModal() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const [preset, setPreset] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);
  // true once the form code has been preloaded: the form is then rendered (hidden) inside the closed
  // dialog, so opening it is instant.
  const [formReady, setFormReady] = useState(false);
  // cancels a closing animation that is still running (e.g. the button is clicked again quickly)
  const cancelClosing = useRef<(() => void) | null>(null);

  const open = useCallback((service?: string | null) => {
    const d = dialogRef.current;
    if (!d) return;
    setPreset(service ?? null);
    setNonce((n) => n + 1);
    lastFocus.current = document.activeElement as HTMLElement | null;
    cancelClosing.current?.();
    if (!d.open) d.showModal();
    document.documentElement.classList.add("modal-open");
  }, []);

  // Close with the reverse animation, then actually close the dialog.
  const close = useCallback(() => {
    const d = dialogRef.current;
    if (!d?.open || d.classList.contains("is-closing")) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      d.close();
      return;
    }
    d.classList.add("is-closing");
    const cleanup = () => {
      d.removeEventListener("animationend", onEnd);
      clearTimeout(fallback);
      d.classList.remove("is-closing");
      cancelClosing.current = null;
    };
    const done = () => {
      cleanup();
      d.close();
    };
    const onEnd = (e: AnimationEvent) => {
      if (e.target === d) done();
    };
    d.addEventListener("animationend", onEnd);
    const fallback = setTimeout(done, 400);
    cancelClosing.current = cleanup;
  }, []);

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

    // Preload the form: when the browser is idle after load, or on first intent (touch / hover / focus
    // on any quote button), whichever comes first.
    let preloaded = false;
    const preload = () => {
      if (preloaded) return;
      preloaded = true;
      loadQuoteForm()
        .then(() => setFormReady(true))
        .catch(() => {
          preloaded = false;
        });
    };
    const onIntent = (e: Event) => {
      const t = e.target as Element | null;
      if (t?.closest?.('a[href*="#quote"], [data-book]')) preload();
    };
    for (const type of ["pointerdown", "touchstart", "mouseover", "focusin"]) {
      window.addEventListener(type, onIntent, { passive: true, capture: true });
    }
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 1500));
    const scheduleIdle = () => idle(preload);
    if (document.readyState === "complete") scheduleIdle();
    else window.addEventListener("load", scheduleIdle, { once: true });
    if (location.hash === "#quote") {
      open(new URLSearchParams(location.search).get("service"));
      history.replaceState(null, "", location.pathname);
    }
    return () => {
      window.removeEventListener("click", onClick, true);
      window.removeEventListener("load", scheduleIdle);
      for (const type of ["pointerdown", "touchstart", "mouseover", "focusin"]) {
        window.removeEventListener(type, onIntent, { capture: true });
      }
    };
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
      onCancel={(e) => {
        // Escape key: play the closing animation instead of closing instantly
        e.preventDefault();
        close();
      }}
      onClick={(e) => {
        if (e.target === dialogRef.current) close();
      }}
    >
      {/* sticky bar so the close button never sits on top of the form fields while scrolling */}
      <div className="quote-modal__bar">
        <button type="button" className="quote-modal__close icon-btn icon-btn--sm" onClick={close} aria-label="Close quote form">
          <CloseIcon width={16} height={16} />
        </button>
      </div>
      {(formReady || nonce > 0) && <QuoteForm preset={preset} nonce={nonce} onClose={close} />}
    </dialog>
  );
}
