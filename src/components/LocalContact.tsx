"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { PRIMARY_PHONE, SITE, locationPhone, whatsappLink, type Phone } from "@/data/site";
import { PhoneIcon } from "./Icons";

/** The location page's own number, or null off location pages. */
export function useLocationPhone(): Phone | null {
  return locationPhone(usePathname());
}

/** The number to call / WhatsApp on this page: the location's own, else the main line. */
export function useContactPhone(): Phone {
  return useLocationPhone() ?? PRIMARY_PHONE;
}

type LinkProps = { className?: string; children?: ReactNode; "aria-label"?: string };

/** tel: link for this page's number. With no children it reads "Call 07… …". */
export function CallLink({ className, children, "aria-label": label }: LinkProps) {
  const p = useContactPhone();
  return (
    <a className={className} href={`tel:${p.tel}`} aria-label={label}>
      {children ?? `Call ${p.display}`}
    </a>
  );
}

/** WhatsApp link to this page's number. */
export function WhatsAppLink({ className, children, message, "aria-label": label }: LinkProps & { message?: string }) {
  const p = useContactPhone();
  return (
    <a className={className} href={whatsappLink(message, p)} target="_blank" rel="noopener noreferrer" aria-label={label}>
      {children}
    </a>
  );
}

/**
 * Footer phone list: just the location's number on a location page; elsewhere both bases,
 * each labelled with its area ("Ladbroke Grove (W10): 07871 553827") and linked to its location page.
 */
export function FooterPhones() {
  const local = useLocationPhone();
  if (local) {
    return (
      <li>
        <span className="ft__icon">
          <PhoneIcon width={15} height={15} />
        </span>
        <span>
          <a href={`tel:${local.tel}`}>{local.display}</a>
          <small>{local.label}</small>
        </span>
      </li>
    );
  }
  return (
    <>
      {[...SITE.phones].reverse().map((p) => (
        <li key={p.tel}>
          <span className="ft__icon">
            <PhoneIcon width={15} height={15} />
          </span>
          <span>
            <span className="ft__area">
              <Link href={p.page}>{p.area}</Link>:{" "}
            </span>
            <a href={`tel:${p.tel}`}>{p.display}</a>
            <small>Call or WhatsApp</small>
          </span>
        </li>
      ))}
    </>
  );
}

/** © line: on location pages, that base's exact Google Business Profile name. */
export function FooterBusinessName() {
  const local = useLocationPhone();
  return <>{local?.googleName ?? SITE.name}</>;
}
