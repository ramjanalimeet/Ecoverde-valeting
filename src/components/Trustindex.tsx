"use client";

import { useEffect, useRef } from "react";

/** Mounts the Trustindex review carousel in place (their loader renders next to its own <script> tag). */
export default function Trustindex({ id }: { id: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || el.childElementCount) return;
    const s = document.createElement("script");
    s.src = `https://cdn.trustindex.io/loader.js?${id}`;
    s.defer = true;
    s.async = true;
    el.appendChild(s);
  }, [id]);
  return <div ref={ref} className="trustindex" />;
}
