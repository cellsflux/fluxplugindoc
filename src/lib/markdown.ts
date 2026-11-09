import { Marked } from "marked";
import hljs from "highlight.js/lib/core";
import bash from "highlight.js/lib/languages/bash";
import css from "highlight.js/lib/languages/css";
import diff from "highlight.js/lib/languages/diff";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import markdown from "highlight.js/lib/languages/markdown";
import typescript from "highlight.js/lib/languages/typescript";
import xml from "highlight.js/lib/languages/xml";
import yaml from "highlight.js/lib/languages/yaml";

hljs.registerLanguage("bash", bash);
hljs.registerLanguage("css", css);
hljs.registerLanguage("diff", diff);
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("json", json);
hljs.registerLanguage("markdown", markdown);
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("xml", xml);
hljs.registerLanguage("yaml", yaml);

const ALIAS: Record<string, string> = { sh: "bash", shell: "bash", zsh: "bash", ts: "typescript", tsx: "typescript", js: "javascript", jsx: "javascript", html: "xml", yml: "yaml", md: "markdown", jsonc: "json" };

export interface Heading {
  id: string;
  text: string;
  level: number;
}
export interface Rendered {
  html: string;
  headings: Heading[];
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const strip = (html: string) => html.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");
const slugify = (s: string) => strip(s).toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, "").trim().replace(/\s+/g, "-") || "section";

// Links between the original .md files become routes of the site.
const FILE_TO_SLUG: Record<string, string> = {
  ARCHITECTURE: "architecture", SECURITY: "security", RELEASE: "release", TROUBLESHOOTING: "troubleshooting", "PLUGIN-AUTHORS": "plugin-authors",
  CUSTOMIZING: "customizing", STORE: "plugin-stores", "DESKTOP-API": "desktop-api", UPDATES: "app-updates",
};

const CALLOUT = /^<p>\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*(?:<br\s*\/?>)?\s*/i;
const TITLES: Record<string, string> = { note: "Note", tip: "Tip", important: "Important", warning: "Warning", caution: "Caution" };

/** Markdown → HTML with highlighted code, copy buttons, anchors, callouts, wrapped tables and site-internal links. */
export function renderMarkdown(src: string, base: string): Rendered {
  const headings: Heading[] = [];
  const used = new Map<string, number>();
  const href = (h: string): string => {
    const m = /^(?:\.\/|\.\.\/|docs\/)*([A-Z][A-Z-]+)\.md(#.*)?$/.exec(h);
    if (m && FILE_TO_SLUG[m[1]!]) return `${base}${FILE_TO_SLUG[m[1]!]}${m[2] ?? ""}`;
    if (h.startsWith("/") && !h.startsWith("//")) return base + h.slice(1);
    return h;
  };
  const marked = new Marked({
    gfm: true,
    renderer: {
      heading(text, level) {
        const id0 = slugify(text);
        const n = used.get(id0) ?? 0;
        used.set(id0, n + 1);
        const id = n ? `${id0}-${n}` : id0;
        if (level >= 2 && level <= 3) headings.push({ id, text: strip(text), level });
        return `<h${level} id="${id}">${text}<a class="header-anchor" href="#${id}" aria-label="Link to this section">#</a></h${level}>`;
      },
      code(code, info) {
        const raw = (info ?? "").trim().split(/\s+/)[0] ?? "";
        const lang = ALIAS[raw] ?? raw;
        const label = raw || "text";
        let body: string;
        try {
          body = lang && hljs.getLanguage(lang) ? hljs.highlight(code, { language: lang }).value : esc(code);
        } catch {
          body = esc(code);
        }
        return `<div class="code-block"><div class="code-head"><span>${esc(label)}</span><button type="button" data-copy aria-label="Copy code">Copy</button></div><pre><code class="hljs language-${esc(lang)}">${body}</code></pre></div>`;
      },
      blockquote(quote) {
        const m = CALLOUT.exec(quote);
        if (!m) return `<blockquote>${quote}</blockquote>`;
        const kind = m[1]!.toLowerCase();
        const rest = quote.replace(CALLOUT, "<p>").replace(/^<p><\/p>\s*/, "");
        return `<div class="callout callout-${kind}" role="note"><div class="callout-title">${TITLES[kind]}</div>${rest}</div>`;
      },
      table(header, body) {
        return `<div class="table-wrap"><table><thead>${header}</thead><tbody>${body}</tbody></table></div>`;
      },
      link(h, title, text) {
        const url = href(h);
        const external = /^https?:\/\//.test(url);
        return `<a href="${esc(url)}"${title ? ` title="${esc(title)}"` : ""}${external ? ' target="_blank" rel="noopener noreferrer"' : ""}>${text}</a>`;
      },
      image(h, title, text) {
        return `<img src="${esc(href(h))}" alt="${esc(text)}"${title ? ` title="${esc(title)}"` : ""} loading="lazy" />`;
      },
    },
  });
  return { html: marked.parse(src, { async: false }) as string, headings };
}

export { strip };
