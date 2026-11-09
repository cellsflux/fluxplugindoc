import { Marked } from "marked";

export interface Page {
  slug: string;
  title: string;
  description: string;
  group: string;
  order: number;
  body: string;
}
export interface Section {
  slug: string;
  page: string;
  group: string;
  heading: string;
  id: string;
  text: string;
}

const files = import.meta.glob("../content/**/*.md", { query: "?raw", import: "default", eager: true }) as Record<string, string>;

function parse(path: string, raw: string): Page {
  const m = /^---\n([\s\S]*?)\n---\n?/.exec(raw);
  const meta: Record<string, string> = {};
  for (const line of (m?.[1] ?? "").split("\n")) {
    const i = line.indexOf(":");
    if (i > 0) meta[line.slice(0, i).trim()] = line.slice(i + 1).trim();
  }
  const slug = path.split("/").pop()!.replace(/\.md$/, "");
  return { slug, title: meta["title"] ?? slug, description: meta["description"] ?? "", group: meta["group"] ?? "Docs", order: Number(meta["order"] ?? 99), body: raw.slice(m?.[0].length ?? 0) };
}

export const GROUPS = ["Getting started", "Guides", "Reference"];

export const pages: Page[] = Object.entries(files)
  .map(([p, raw]) => parse(p, raw))
  .sort((a, b) => GROUPS.indexOf(a.group) - GROUPS.indexOf(b.group) || a.order - b.order || a.title.localeCompare(b.title));

export const nav = GROUPS.map((g) => ({ group: g, pages: pages.filter((p) => p.group === g) })).filter((g) => g.pages.length);
export const getPage = (slug: string): Page | undefined => pages.find((p) => p.slug === slug);

export function neighbours(slug: string): { prev?: Page; next?: Page } {
  const i = pages.findIndex((p) => p.slug === slug);
  return { prev: i > 0 ? pages[i - 1] : undefined, next: i >= 0 && i < pages.length - 1 ? pages[i + 1] : undefined };
}

const plain = (md: string) => md.replace(/```[\s\S]*?```/g, (c) => c.replace(/```\w*\n?/g, "")).replace(/!\[[^\]]*\]\([^)]*\)/g, "").replace(/\[([^\]]+)\]\([^)]*\)/g, "$1").replace(/[`*_>|#]/g, " ").replace(/\s+/g, " ").trim();
const idOf = (s: string) => plain(s).toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, "").trim().replace(/\s+/g, "-");

/** One searchable record per page section (split at h2/h3). */
export const sections: Section[] = pages.flatMap((p) => {
  const out: Section[] = [];
  let cur: Section = { slug: p.slug, page: p.title, group: p.group, heading: p.title, id: "", text: p.description };
  const seen = new Map<string, number>();
  for (const t of new Marked().lexer(p.body)) {
    if (t.type === "heading" && (t.depth === 2 || t.depth === 3)) {
      out.push(cur);
      const base = idOf(t.text);
      const n = seen.get(base) ?? 0;
      seen.set(base, n + 1);
      cur = { slug: p.slug, page: p.title, group: p.group, heading: plain(t.text), id: n ? `${base}-${n}` : base, text: "" };
    } else cur.text += " " + plain(t.raw);
  }
  out.push(cur);
  return out;
});

export function search(query: string, limit = 12): { s: Section; score: number; snippet: string }[] {
  const terms = query.toLowerCase().split(/\s+/).filter((t) => t.length > 1);
  if (!terms.length) return [];
  const res: { s: Section; score: number; snippet: string }[] = [];
  for (const s of sections) {
    const h = s.heading.toLowerCase();
    const body = s.text.toLowerCase();
    let score = 0;
    let all = true;
    for (const t of terms) {
      const inH = h.includes(t);
      const inB = body.includes(t);
      const inP = s.page.toLowerCase().includes(t);
      if (!inH && !inB && !inP) all = false;
      score += (inH ? 10 : 0) + (inP ? 3 : 0) + (inB ? 1 + Math.min(3, body.split(t).length - 1) * 0.3 : 0);
    }
    if (!all) continue;
    if (s.id === "") score += 2; // page-level hits first
    const first = terms.map((t) => body.indexOf(t)).filter((i) => i >= 0).sort((a, b) => a - b)[0] ?? 0;
    const start = Math.max(0, first - 40);
    res.push({ s, score, snippet: (start > 0 ? "…" : "") + s.text.slice(start, start + 130).trim() });
  }
  return res.sort((a, b) => b.score - a.score).slice(0, limit);
}
