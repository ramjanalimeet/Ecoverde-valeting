import type { ReactNode } from "react";
import { altFor } from "@/data/images";

/**
 * Safe Markdown-style formatter for blog posts (never renders raw HTML).
 *
 *   ## Heading / ### Sub-heading      blank line = new paragraph
 *   - bullet / 1. numbered            **bold**, *italic*, [link](https://… or /path)
 *   | table | rows |  (2nd row = |---|)
 *   ![alt text](/images/x.webp "Caption")
 *   > **Tip:** call-out box
 *   ## Frequently asked questions     → every following "### Question" + answer becomes a FAQ accordion
 */

export type Faq = { q: string; a: string };
export type Heading = { id: string; text: string };

const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/\*|\[|\]|\(.*?\)/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);

const strip = (s: string) => s.replace(/\*\*(.+?)\*\*/g, "$1").replace(/\*(.+?)\*/g, "$1").replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

function inline(text: string, keyBase = 0): ReactNode[] {
  const out: ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|\*(.+?)\*|\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]*)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = keyBase;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1]) out.push(<strong key={i++}>{inline(m[1], i * 100)}</strong>);
    else if (m[2]) out.push(<em key={i++}>{m[2]}</em>);
    else {
      const ext = m[4].startsWith("http");
      out.push(
        <a key={i++} href={m[4]} {...(ext ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
          {m[3]}
        </a>
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

const isFaqHeading = (t: string) => /^(frequently asked questions|faqs?|questions (&|and) answers)\b/i.test(t.trim());

type Block = string;
function blocks(text: string): Block[] {
  return text
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);
}

/** Extract FAQ pairs (for FAQPage structured data) and H2 headings (for the table of contents). */
export function analyse(text: string): { faqs: Faq[]; headings: Heading[]; words: number } {
  const faqs: Faq[] = [];
  const headings: Heading[] = [];
  let inFaq = false;
  let cur: Faq | null = null;
  for (const b of blocks(text)) {
    if (b.startsWith("## ")) {
      const t = b.slice(3).trim();
      headings.push({ id: slug(strip(t)), text: strip(t) });
      if (cur) faqs.push(cur), (cur = null);
      inFaq = isFaqHeading(t);
      continue;
    }
    if (inFaq && b.startsWith("### ")) {
      if (cur) faqs.push(cur);
      const [first, ...rest] = b.split("\n");
      cur = { q: strip(first.slice(4).trim()), a: strip(rest.join(" ").trim()) };
      continue;
    }
    if (inFaq && cur) cur.a = `${cur.a} ${strip(b.replace(/\n/g, " "))}`.trim();
  }
  if (cur) faqs.push(cur);
  const words = strip(text).split(/\s+/).filter(Boolean).length;
  return { faqs, headings, words };
}

function Table({ lines }: { lines: string[] }) {
  const cells = (l: string) =>
    l
      .trim()
      .replace(/^\||\|$/g, "")
      .split("|")
      .map((c) => c.trim());
  const head = cells(lines[0]);
  const body = lines.slice(2).map(cells);
  return (
    <div className="rt-table">
      <table>
        <thead>
          <tr>
            {head.map((h, i) => (
              <th key={i} scope="col">
                {inline(h)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((r, ri) => (
            <tr key={ri}>
              {r.map((c, ci) =>
                ci === 0 ? (
                  <th key={ci} scope="row">
                    {inline(c)}
                  </th>
                ) : (
                  <td key={ci}>{inline(c)}</td>
                )
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function RichText({ text }: { text: string }) {
  const out: ReactNode[] = [];
  let inFaq = false;
  let faqItems: { q: string; body: ReactNode[] }[] = [];

  const flushFaq = () => {
    if (!faqItems.length) return;
    out.push(
      <div className="rt-faq" key={`faq-${out.length}`}>
        {faqItems.map((f, i) => (
          <details key={i} className="acc">
            <summary>
              {f.q}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </summary>
            <div className="rt-faq__a">{f.body}</div>
          </details>
        ))}
      </div>
    );
    faqItems = [];
  };

  const render = (b: string, k: string): ReactNode => {
    if (b.startsWith("### ")) return <h3 key={k}>{inline(b.slice(4))}</h3>;
    const lines = b.split("\n");
    // image
    const img = b.match(/^!\[([^\]]*)\]\((\S+?)(?:\s+"([^"]*)")?\)$/);
    if (img) {
      const [, alt, src, caption] = img;
      return (
        <figure key={k} className="rt-figure">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={alt || altFor(src)} loading="lazy" decoding="async" />
          {caption && <figcaption>{caption}</figcaption>}
        </figure>
      );
    }
    // table
    if (lines.length >= 2 && lines.every((l) => l.trim().startsWith("|")) && /^\|?\s*:?-{2,}/.test(lines[1].trim().replace(/^\|/, ""))) {
      return <Table key={k} lines={lines} />;
    }
    // call-out
    if (lines.every((l) => l.startsWith(">"))) {
      return (
        <aside key={k} className="rt-callout">
          {lines.map((l, i) => (
            <p key={i}>{inline(l.replace(/^>\s?/, ""))}</p>
          ))}
        </aside>
      );
    }
    // lists
    if (lines.every((l) => /^\s*[-*] /.test(l)))
      return (
        <ul key={k}>
          {lines.map((l, i) => (
            <li key={i}>{inline(l.replace(/^\s*[-*] /, ""))}</li>
          ))}
        </ul>
      );
    if (lines.every((l) => /^\s*\d+[.)] /.test(l)))
      return (
        <ol key={k}>
          {lines.map((l, i) => (
            <li key={i}>{inline(l.replace(/^\s*\d+[.)] /, ""))}</li>
          ))}
        </ol>
      );
    return (
      <p key={k}>
        {lines.map((l, i) => (
          <span key={i}>
            {i > 0 && <br />}
            {inline(l)}
          </span>
        ))}
      </p>
    );
  };

  blocks(text).forEach((b, bi) => {
    const k = `b${bi}`;
    if (b.startsWith("## ")) {
      flushFaq();
      const t = b.slice(3).trim();
      inFaq = isFaqHeading(t);
      out.push(
        <h2 key={k} id={slug(strip(t))}>
          {inline(t)}
        </h2>
      );
      return;
    }
    if (inFaq && b.startsWith("### ")) {
      const [first, ...rest] = b.split("\n");
      faqItems.push({ q: strip(first.slice(4).trim()), body: rest.length ? [render(rest.join("\n"), `${k}a`)] : [] });
      return;
    }
    if (inFaq && faqItems.length) {
      faqItems[faqItems.length - 1].body.push(render(b, k));
      return;
    }
    out.push(render(b, k));
  });
  flushFaq();
  return <>{out}</>;
}
