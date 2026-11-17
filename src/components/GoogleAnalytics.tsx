"use client";

import { useEffect } from "react";

/**
 * The live site's Google Analytics 4 tag (G-61XV0XK8SJ) and its key-event names, which must match
 * the GA4 configuration exactly. Only loads on ecoverdevaleting.co.uk so preview/staging traffic
 * (e.g. *.workers.dev) never pollutes the live property.
 */
const GA_ID = "G-61XV0XK8SJ";
const LIVE_HOST = /(^|\.)ecoverdevaleting\.co\.uk$/i;

type Gtag = (...args: unknown[]) => void;
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }
}

export default function GoogleAnalytics() {
  useEffect(() => {
    if (!LIVE_HOST.test(location.hostname)) return;
    if (!window.gtag) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag() {
        // eslint-disable-next-line prefer-rest-params
        window.dataLayer!.push(arguments);
      };
      window.gtag("js", new Date());
      window.gtag("config", GA_ID);
      const s = document.createElement("script");
      s.async = true;
      s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
      document.head.appendChild(s);
    }

    const track = (name: string) => {
      try {
        window.gtag?.("event", name, { transport_type: "beacon" });
      } catch {
        /* tracking must never block the click */
      }
    };
    const onClick = (e: MouseEvent) => {
      const t = e.target as Element | null;
      if (!t?.closest) return;
      const a = t.closest("a[href]");
      const href = a?.getAttribute("href") || "";
      if (t.closest("[data-book]") || /#quote$/.test(href)) track("Get_In_Touch");
      if (!a) return;
      if (/^https:\/\/wa\.me\//i.test(href)) track("WhatsApp_Click");
      else if (/^tel:/i.test(href)) track("Phone_Click");
      else if (/^mailto:[^?]/i.test(href)) track("Email_Click");
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);
  return null;
}
