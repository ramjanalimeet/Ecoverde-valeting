"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { NAV, PRIMARY_PHONE, SERVICE_MENU, quoteHref } from "@/data/site";
import { ChevronDown, CloseIcon, Logo, MenuIcon, PhoneIcon } from "./Icons";

export default function Header() {
  const [open, setOpen] = useState<string | null>(null);
  const [drawer, setDrawer] = useState(false);
  const [drawerGroup, setDrawerGroup] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close desktop dropdowns on outside click / Escape
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

  // Lock scroll + focus the drawer when open
  useEffect(() => {
    document.body.style.overflow = drawer ? "hidden" : "";
    if (drawer) drawerRef.current?.querySelector<HTMLElement>("a,button")?.focus();
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawer]);

  const close = () => {
    setOpen(null);
    setDrawer(false);
  };

  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <div className="container header__inner">
        <Link href="/" className="header__logo" aria-label="Ecoverde Valeting — home" onClick={close}>
          <Logo />
        </Link>

        <nav ref={navRef} className="nav" aria-label="Main">
          <ul className="nav__list">
            {NAV.map((item) => {
              if ("href" in item && item.href) {
                return (
                  <li key={item.label}>
                    <Link className="nav__link" href={item.href} onClick={close}>
                      {item.label}
                    </Link>
                  </li>
                );
              }
              const id = `menu-${item.label.toLowerCase().replace(/\s+/g, "-")}`;
              const isOpen = open === item.label;
              return (
                <li
                  key={item.label}
                  className={`nav__item${"mega" in item ? " nav__item--mega" : ""}`}
                  onMouseEnter={() => setOpen(item.label)}
                  onMouseLeave={() => setOpen(null)}
                >
                  <button
                    type="button"
                    className="nav__link nav__trigger"
                    aria-expanded={isOpen}
                    aria-controls={id}
                    onClick={() => setOpen(isOpen ? null : item.label)}
                  >
                    {item.label}
                    <ChevronDown width={16} height={16} />
                  </button>
                  {"mega" in item ? (
                    <div id={id} className={`mega${isOpen ? " is-open" : ""}`} hidden={!isOpen}>
                      <div className="mega__grid">
                        {SERVICE_MENU.map((g) => (
                          <div key={g.slug} className="mega__col">
                            <p className="mega__title">{g.title}</p>
                            <ul>
                              {g.items.map((s) => (
                                <li key={s.slug}>
                                  <Link href={quoteHref(s.slug)} onClick={close}>
                                    {s.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                      <div className="mega__foot">
                        <span>Every quote is free and tailored to your car.</span>
                        <Link className="btn btn--primary btn--sm" href={quoteHref()} onClick={close}>
                          Get a Free Quote
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <ul id={id} className={`dropdown${isOpen ? " is-open" : ""}`} hidden={!isOpen}>
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
            <PhoneIcon width={18} height={18} />
            <span>{PRIMARY_PHONE.display}</span>
          </a>
          <Link className="btn btn--primary btn--sm header__book" href={quoteHref()} onClick={close}>
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

      <div
        id="mobile-drawer"
        ref={drawerRef}
        className={`drawer${drawer ? " is-open" : ""}`}
        hidden={!drawer}
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
      >
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
              const groups =
                "mega" in item
                  ? SERVICE_MENU.map((g) => ({ key: g.title, links: g.items.map((s) => ({ label: s.label, href: quoteHref(s.slug) })) }))
                  : [{ key: item.label, links: item.children ?? [] }];
              return groups.map((g) => {
                const isOpen = drawerGroup === g.key;
                const pid = `drawer-${g.key.toLowerCase().replace(/[^a-z]+/g, "-")}`;
                return (
                  <li key={g.key}>
                    <button
                      type="button"
                      className="drawer__link drawer__toggle"
                      aria-expanded={isOpen}
                      aria-controls={pid}
                      onClick={() => setDrawerGroup(isOpen ? null : g.key)}
                    >
                      {g.key}
                      <ChevronDown width={18} height={18} />
                    </button>
                    <ul id={pid} className="drawer__sub" hidden={!isOpen}>
                      {g.links.map((l) => (
                        <li key={l.label}>
                          <Link href={l.href} onClick={close}>
                            {l.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              });
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
