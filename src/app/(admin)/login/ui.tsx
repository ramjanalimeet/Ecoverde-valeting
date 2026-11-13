import Link from "next/link";
import { statusLabel, type Booking } from "@/lib/db";
import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement>;
const s = (p: P) => ({
  width: 15,
  height: 15,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
  ...p,
});

export const DashIcons = {
  overview: (p: P) => (
    <svg {...s(p)}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
  bookings: (p: P) => (
    <svg {...s(p)}>
      <rect x="5" y="4" width="14" height="17" rx="2" />
      <path d="M9 4V3h6v1M9 10h6M9 14h6M9 18h3" />
    </svg>
  ),
  messages: (p: P) => (
    <svg {...s(p)}>
      <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z" />
    </svg>
  ),
  emails: (p: P) => (
    <svg {...s(p)}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  ),
  blog: (p: P) => (
    <svg {...s(p)}>
      <path d="M4 20h4L19 9l-4-4L4 16v4zM14 6l4 4" />
    </svg>
  ),
  analytics: (p: P) => (
    <svg {...s(p)}>
      <path d="M4 20V4M4 20h16M8 16v-5M12 16V8M16 16v-3" />
    </svg>
  ),
  settings: (p: P) => (
    <svg {...s(p)}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
    </svg>
  ),
  support: (p: P) => (
    <svg {...s(p)}>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="4" />
      <path d="m5.6 5.6 3.6 3.6M14.8 14.8l3.6 3.6M18.4 5.6l-3.6 3.6M9.2 14.8l-3.6 3.6" />
    </svg>
  ),
  signout: (p: P) => (
    <svg {...s(p)}>
      <path d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 17l5-5-5-5M15 12H3" />
    </svg>
  ),
  menu: (p: P) => (
    <svg {...s(p)}>
      <path d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  ),
};

const fmt = (iso: string, opts: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/London", ...opts }).format(new Date(iso));

/** "10 Nov 2026" */
export const fmtDate = (iso: string) => fmt(iso, { day: "numeric", month: "short", year: "numeric" });
/** "7:55am" */
export const fmtTime = (iso: string) => fmt(iso, { hour: "numeric", minute: "2-digit", hour12: true }).replace(" ", "").toLowerCase();
export const fmtDateTime = (iso: string) => `${fmtDate(iso)} · ${fmtTime(iso)}`;

export function StatusPill({ status, label }: { status: string; label?: string }) {
  return <span className={`pill pill--${status}`}>{label ?? status.charAt(0).toUpperCase() + status.slice(1)}</span>;
}

export function DbMissing() {
  return (
    <div className="panel">
      <div className="empty-state">
        The database isn&apos;t connected. Make sure the <code>DB</code> D1 binding in <code>wrangler.jsonc</code> is deployed.
      </div>
    </div>
  );
}

export function RequestRows({ items }: { items: Booking[] }) {
  if (!items.length) return <div className="empty-state">No requests yet — they&apos;ll appear here as soon as someone uses the quote form.</div>;
  return (
    <ul className="rows">
      {items.map((b) => (
        <li key={b.id}>
          <Link href={`/login/bookings/${b.id}`} className="row">
            <span className="row__date">
              {fmtDate(b.created_at)} ·
              <br />
              {fmtTime(b.created_at)}
            </span>
            <span className="row__main">
              <strong>{b.name}</strong>
              {b.car} · {b.service_label}
            </span>
            <StatusPill status={b.status} label={statusLabel(b.status)} />
          </Link>
        </li>
      ))}
    </ul>
  );
}


export { default as ConfirmSubmit } from "./ConfirmSubmit";
