"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { signOut } from "./actions";
import { DashIcons } from "./ui";

const NAV = [
  { href: "/login", label: "Overview", icon: "overview" },
  { href: "/login/bookings", label: "Bookings", icon: "bookings", badge: "newBookings" },
  { href: "/login/messages", label: "Messages", icon: "messages", badge: "unread" },
  { href: "/login/emails", label: "Emails", icon: "emails" },
  { href: "/login/blog", label: "Blog", icon: "blog" },
  { href: "/login/analytics", label: "Analytics", icon: "analytics" },
  { href: "/login/settings", label: "Settings", icon: "settings" },
  { href: "/login/support", label: "Support", icon: "support" },
] as const;

export default function Shell({ children, counts }: { children: ReactNode; counts: { newBookings: number; unread: number } }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  const active = (href: string) => (href === "/login" ? pathname === href : pathname.startsWith(href));

  return (
    <div className={`dash${open ? " is-open" : ""}`}>
      <aside className="side" aria-label="Dashboard">
        <Link href="/login" className="side__brand">
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
          <a href="/" target="_blank" rel="noopener" className="side__site">
            View website ↗
          </a>
        </p>
      </aside>
      {open && <button type="button" className="dash-scrim" aria-label="Close menu" onClick={() => setOpen(false)} />}
      <div className="main">
        <header className="mtop">
          <Link href="/login" className="mtop__brand">
            <span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/logo.png" alt="" />
            </span>
            <strong>ecoverde</strong>
          </Link>
          <button type="button" className="mtop__menu" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen((o) => !o)}>
            <DashIcons.menu /> Menu
          </button>
        </header>
        <div className="main__body">{children}</div>
      </div>
    </div>
  );
}
