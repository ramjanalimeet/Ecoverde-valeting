"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  AREA_BASES,
  NAV,
  PRIMARY_PHONE,
  SERVICE_CATEGORIES,
  SERVICE_GROUPS,
  areaHref,
  quoteHref,
  serviceHref,
  slugify,
} from "@/data/site";
import { ArrowRight, ChevronDown, CloseIcon, Logo, MenuIcon, PhoneIcon } from "./Icons";

function ServicesMenu({ onNavigate }: { onNavigate: () => void }) {
  return (
    <>
      <p className="mega__title">
        Eco-friendly car care, <em>your way</em>
      </p>
      <p className="mega__sub">In the UK, a &ldquo;valet&rdquo; means a thorough deep clean — here&apos;s the full range, all fully mobile.</p>
      <ul className="mega__cards">
        {SERVICE_CATEGORIES.map((c) => (
          <li key={c.slug}>
            <Link href={serviceHref(c.slug)} className="mega__card" onClick={onNavigate}>
              <span className="mega__card-img">
                <Image src={c.image} alt="" fill sizes="200px" />
              </span>
              <strong>{c.label}</strong>
              <span>{c.blurb}</span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="mega__groups">
        {SERVICE_GROUPS.map((g) => (
          <div key={g.title}>
            <p className="mega__group-title">{g.title}</p>
            <ul>
              {g.items.map((s) => (
                <li key={s.slug}>
                  <Link href={serviceHref(s.slug)} onClick={onNavigate}>
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mega__foot">
        <span>Not sure which you need? Tell us about your car and we&apos;ll advise.</span>
        <Link className="btn btn--primary btn--sm" href={quoteHref()} onClick={onNavigate}>
          Get a Free Quote
        </Link>
      </div>
    </>
  );
}

function AreasMenu({ onNavigate }: { onNavigate: () => void }) {
  return (
    <>
      <p className="mega__title">
        Mobile car valeting <em>across West London</em>
      </p>
      <p className="mega__sub">Fully mobile — choose your area and we&apos;ll come to you, 7 days a week.</p>
      <div className="mega__bases">
        {AREA_BASES.map((b) => (
          <div key={b.slug}>
            <Link href={areaHref(b.slug)} className="mega__base" onClick={onNavigate}>
              {b.name} ({b.postcode}) <ArrowRight width={16} height={16} />
            </Link>
            <ul className="mega__areas">
              {b.areas.map((a) => (
                <li key={a}>
                  <Link href={areaHref(slugify(a))} onClick={onNavigate}>
                    {a}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}

export default function Header() {
  const [open, setOpen] = useState<string | null>(null);
  const [drawer, setDrawer] = useState(false);
  const [drawerGroup, setDrawerGroup] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setOpen(null);
    setDrawer(false);
  }, [pathname]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpen(null);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(null);
      if (drawer) {
        setDrawer(false);
        menuBtnRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [drawer]);

  useEffect(() => {
    document.body.style.overflow = drawer ? "hidden" : "";
    if (drawer) drawerRef.current?.querySelector<HTMLElement>("a,button")?.focus();
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawer]);

  // Hover intent: a short delay before closing so moving the cursor into a menu never drops it.
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openNow = (label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(label);
  };
  const closeSoon = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(null), 250);
  };
  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  const close = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(null);
    setDrawer(false);
  };

  const isActive = (href: string) => href !== "/" && pathname.startsWith(href);

  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="header__inner" ref={navRef}>
        <Link href="/" className="header__logo" aria-label="Ecoverde Valeting — home" onClick={close}>
          <Logo />
        </Link>

        <nav className="nav" aria-label="Main">
          <ul className="nav__list">
            {NAV.map((item) => {
              if ("href" in item && item.href) {
                return (
                  <li key={item.label}>
                    <Link
                      className={`nav__link${isActive(item.href) ? " is-active" : ""}`}
                      href={item.href}
                      onClick={close}
                      aria-current={pathname === item.href ? "page" : undefined}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              }
              const id = `menu-${item.label.toLowerCase().replace(/\s+/g, "-")}`;
              const isOpen = open === item.label;
              const mega = "mega" in item ? item.mega : null;
              const sectionActive =
                (mega === "services" && pathname.startsWith("/services")) ||
                (mega === "areas" && pathname.startsWith("/areas")) ||
                (!mega && item.children?.some((c) => pathname === c.href));
              return (
                <li
                  key={item.label}
                  className={`nav__item${mega ? " nav__item--mega" : ""}`}
                  onMouseEnter={() => openNow(item.label)}
                  onMouseLeave={closeSoon}
                >
                  <button
                    type="button"
                    className={`nav__link nav__trigger${isOpen || sectionActive ? " is-active" : ""}`}
                    aria-expanded={isOpen}
                    aria-controls={id}
                    onClick={() => setOpen(isOpen ? null : item.label)}
                  >
                    {item.label}
                    <ChevronDown width={14} height={14} />
                  </button>
                  {mega ? (
                    <div id={id} className={`mega mega--${mega}`} hidden={!isOpen}>
                      <div className="mega__scroll">
                        {mega === "services" ? <ServicesMenu onNavigate={close} /> : <AreasMenu onNavigate={close} />}
                      </div>
                    </div>
                  ) : (
                    <ul id={id} className="dropdown" hidden={!isOpen}>
                      {item.children?.map((c) => (
                        <li key={c.label}>
                          <Link href={c.href} onClick={close}>
                            {c.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="header__actions">
          <a className="header__phone" href={`tel:${PRIMARY_PHONE.tel}`}>
            <PhoneIcon width={16} height={16} />
            <span>{PRIMARY_PHONE.display}</span>
          </a>
          <Link className="btn btn--sm header__book" href={quoteHref()} onClick={close}>
            Book Now
          </Link>
          <a className="icon-btn header__call-mobile" href={`tel:${PRIMARY_PHONE.tel}`} aria-label={`Call ${PRIMARY_PHONE.display}`}>
            <PhoneIcon />
          </a>
          <button
            ref={menuBtnRef}
            type="button"
            className="icon-btn header__menu"
            aria-label={drawer ? "Close menu" : "Open menu"}
            aria-expanded={drawer}
            aria-controls="mobile-drawer"
            onClick={() => setDrawer((d) => !d)}
          >
            {drawer ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>

      <div id="mobile-drawer" ref={drawerRef} className="drawer" hidden={!drawer} role="dialog" aria-modal="true" aria-label="Menu">
        <nav aria-label="Mobile">
          <ul className="drawer__list">
            {NAV.map((item) => {
              if ("href" in item && item.href) {
                return (
                  <li key={item.label}>
                    <Link className="drawer__link" href={item.href} onClick={close}>
                      {item.label}
                    </Link>
                  </li>
                );
              }
              const isOpen = drawerGroup === item.label;
              const pid = `drawer-${item.label.toLowerCase().replace(/[^a-z]+/g, "-")}`;
              const mega = "mega" in item ? item.mega : null;
              return (
                <li key={item.label}>
                  <button
                    type="button"
                    className="drawer__link drawer__toggle"
                    aria-expanded={isOpen}
                    aria-controls={pid}
                    onClick={() => setDrawerGroup(isOpen ? null : item.label)}
                  >
                    {item.label}
                    <ChevronDown width={18} height={18} />
                  </button>
                  <div id={pid} className="drawer__sub" hidden={!isOpen}>
                    {mega === "services" && (
                      <>
                        <ul>
                          {SERVICE_CATEGORIES.map((c) => (
                            <li key={c.slug}>
                              <Link className="drawer__strong" href={serviceHref(c.slug)} onClick={close}>
                                {c.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                        {SERVICE_GROUPS.map((g) => (
                          <div key={g.title}>
                            <p className="drawer__heading">{g.title}</p>
                            <ul>
                              {g.items.map((s) => (
                                <li key={s.slug}>
                                  <Link href={serviceHref(s.slug)} onClick={close}>
                                    {s.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </>
                    )}
                    {mega === "areas" &&
                      AREA_BASES.map((b) => (
                        <div key={b.slug}>
                          <Link className="drawer__strong" href={areaHref(b.slug)} onClick={close}>
                            {b.name} ({b.postcode}) →
                          </Link>
                          <ul className="drawer__cols">
                            {b.areas.map((a) => (
                              <li key={a}>
                                <Link href={areaHref(slugify(a))} onClick={close}>
                                  {a}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    {!mega && (
                      <ul>
                        {item.children?.map((c) => (
                          <li key={c.label}>
                            <Link href={c.href} onClick={close}>
                              {c.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="drawer__cta">
          <Link className="btn btn--primary btn--block" href={quoteHref()} onClick={close}>
            Get a Free Quote
          </Link>
          <a className="btn btn--outline btn--block" href={`tel:${PRIMARY_PHONE.tel}`}>
            <PhoneIcon width={18} height={18} /> Call {PRIMARY_PHONE.display}
          </a>
        </div>
      </div>
    </header>
  );
}
