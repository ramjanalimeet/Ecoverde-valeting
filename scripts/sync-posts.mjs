// Writes migrations-free SQL that updates seeded posts from content/blog, but only
// rows never edited in the dashboard (updated_at still equals published_at).
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
const q = (s) => `'${String(s).replace(/'/g, "''")}'`;
const out = readdirSync("content/blog").filter((f) => f.endsWith(".md")).map((f) => {
  const m = readFileSync(`content/blog/${f}`, "utf8").match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  const meta = Object.fromEntries(m[1].split("\n").map((l) => [l.slice(0, l.indexOf(":")).trim(), l.slice(l.indexOf(":") + 1).trim().replace(/^"(.*)"$/, "$1")]));
  return `UPDATE posts SET title=${q(meta.title)}, excerpt=${q(meta.excerpt)}, body=${q(m[2].trim())}, cover=${q(meta.cover)} WHERE slug=${q(meta.slug)} AND updated_at = published_at;`;
});
writeFileSync(process.argv[2], out.join("\n") + "\n");
console.log(`Wrote ${out.length} updates`);
