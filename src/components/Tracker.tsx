"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/** Cookieless page-view, time-on-page and WhatsApp-click tracking (data stays in our own database). */
export default function Tracker() {
  const pathname = usePathname();
  const current = useRef<{ id: number | null; start: number; sent: boolean }>({ id: null, start: 0, sent: false });

  const send = (data: object, beacon = false) => {
    const body = JSON.stringify(data);
    if (beacon && navigator.sendBeacon) return navigator.sendBeacon("/api/track", new Blob([body], { type: "application/json" }));
    return fetch("/api/track", { method: "POST", body, keepalive: true, headers: { "Content-Type": "application/json" } });
  };

  const end = () => {
    const c = current.current;
    if (c.id && !c.sent) {
      c.sent = true;
      send({ t: "end", id: c.id, d: Date.now() - c.start }, true);
    }
  };

  // Page view on every route change; close the previous page's timer first
  useEffect(() => {
    if (navigator.doNotTrack === "1") return;
    end();
    current.current = { id: null, start: Date.now(), sent: false };
    const ref = current.current;
    (send({ t: "pv", p: pathname, r: document.referrer }) as Promise<Response>)
      .then((r) => (r.ok ? r.json() : null))
      .then((j: { id?: number } | null) => {
        if (j?.id) ref.id = j.id;
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (navigator.doNotTrack === "1") return;
    const onHide = () => {
      if (document.visibilityState === "hidden") end();
    };
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element | null)?.closest?.('a[href*="wa.me"]');
      if (a) send({ t: "wa", p: location.pathname }, true);
    };
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", end);
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", end);
      document.removeEventListener("click", onClick, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
