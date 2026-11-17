import Link from "next/link";

export type Crumb = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="crumbs">
      <ol>
        {items.map((c, i) =>
          c.href && i < items.length - 1 ? (
            <li key={c.label}>
              <Link href={c.href}>{c.label}</Link>
            </li>
          ) : (
            <li key={c.label} aria-current="page">
              {c.label}
            </li>
          )
        )}
      </ol>
    </nav>
  );
}
