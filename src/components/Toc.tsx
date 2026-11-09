import { useEffect, useState } from "react";
import type { Heading } from "../lib/markdown";

export function Toc({ headings }: { headings: Heading[] }) {
  const [active, setActive] = useState("");
  useEffect(() => {
    setActive(headings[0]?.id ?? "");
    const els = headings.map((h) => document.getElementById(h.id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (vis) setActive(vis.target.id);
      },
      { rootMargin: "-80px 0px -70% 0px" },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [headings]);
  if (headings.length < 2) return null;
  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-56 shrink-0 overflow-y-auto py-8 pl-4 xl:block no-scrollbar">
      <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">On this page</h4>
      <ul className="space-y-1.5 border-l border-slate-200 text-[13px] dark:border-slate-800">
        {headings.map((h) => (
          <li key={h.id}>
            <a href={`#${h.id}`} className={"-ml-px block border-l py-0.5 transition " + (h.level === 3 ? "pl-6 " : "pl-3 ") + (active === h.id ? "border-brand-500 font-medium text-brand-700 dark:text-brand-300" : "border-transparent text-slate-500 hover:border-slate-400 hover:text-slate-900 dark:hover:text-white")}>
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </aside>
  );
}
