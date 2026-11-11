"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { signOut } from "./actions";
import { DashIcons } from "./ui";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: "overview" },
  { href: "/dashboard/bookings", label: "Bookings", icon: "bookings", badge: "newBookings" },
  { href: "/dashboard/messages", label: "Messages", icon: "messages", badge: "unread" },
  { href: "/dashboard/emails", label: "Emails", icon: "emails" },
  { href: "/dashboard/blog", label: "Blog", icon: "blog" },
  { href: "/dashboard/analytics", label: "Analytics", icon: "analytics" },
  { href: "/dashboard/settings", label: "Settings", icon: "settings" },
  { href: "/dashboard/support", label: "Support", icon: "support" },
] as const;

export default function Shell({ children, counts }: { children: ReactNode; counts: { newBookings: number; unread: number } }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  const active = (href: string) => (href === "/dashboard" ? pathname === href : pathname.startsWith(href));

  return (
    <div className={`dash${open ? " is-open" : ""}`}>
      <aside className="side" aria-label="Dashboard">
        <Link href="/dashboard" className="side__brand">
          <span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/logo.png" alt="" />
          </span>
          <strong>ecoverde</strong>
        </Link>
        <nav>
          <ul>
            {NAV.map((n) => {
              const Icon = DashIcons[n.icon];
              const badge = "badge" in n ? counts[n.badge] : 0;
              return (
                <li key={n.href}>
                  <Link href={n.href} aria-current={active(n.href) ? "page" : undefined}>
                    <Icon /> {n.label}
                    {badge > 0 && <span className="side__badge">{badge}</span>}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="side__sep" />
        <form action={signOut}>
          <button type="submit">
            <DashIcons.signout /> Sign out
          </button>
        </form>
        <p className="side__foot">
          <a href="/" target="_blank" rel="noopener">
            View website ↗
          </a>
        </p>
      </aside>
      <div className="main">
        <button type="button" className="dash-menu" aria-label="Open menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          <DashIcons.menu />
        </button>
        {children}
      </div>
    </div>
  );
}
