import { useEffect, useMemo, useRef, useState } from "react";
import { search } from "../lib/content";
import { href, navigate } from "../lib/router";
import { Icon } from "./Icon";

const mark = (text: string, q: string) => {
  const terms = q
    .toLowerCase()
    .split(/\s+/)
    .filter((t) => t.length > 1);
  if (!terms.length) return text;
  const re = new RegExp(
    `(${terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`,
    "ig",
  );
  return text
    .split(re)
    .map((part, i) => (i % 2 ? <mark key={i}>{part}</mark> : part));
};

export function SearchDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [q, setQ] = useState("");
  const [i, setI] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const results = useMemo(() => search(q), [q]);
  useEffect(() => {
    if (open) {
      setQ("");
      setI(0);
      setTimeout(() => input.current?.focus(), 0);
    }
  }, [open]);
  useEffect(() => setI(0), [q]);
  if (!open) return null;
  const go = (n: number) => {
    const r = results[n];
    if (!r) return;
    onClose();
    navigate(`/${r.s.slug}${r.s.id ? "#" + r.s.id : ""}`);
  };
  return (
    <div
      className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[12vh]"
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      <div
        className="absolute inset-0 bg-slate-900/10 backdrop-blur-xs"
        onClick={onClose}
      />
      <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-3 border-b border-slate-200 px-4 dark:border-slate-800">
          <Icon name="search" className="h-5 w-5 text-slate-400" />
          <input
            ref={input}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search the documentation…"
            data-testid="search-input"
            onKeyDown={(e) => {
              if (e.key === "ArrowDown")
                (e.preventDefault(),
                  setI((x) => Math.min(x + 1, results.length - 1)));
              else if (e.key === "ArrowUp")
                (e.preventDefault(), setI((x) => Math.max(x - 1, 0)));
              else if (e.key === "Enter") go(i);
              else if (e.key === "Escape") onClose();
            }}
            className="h-14 flex-1 bg-transparent text-base text-slate-900 outline-none placeholder:text-slate-400 dark:text-white"
          />
          <kbd className="rounded-md border border-slate-200 px-1.5 py-0.5 text-[11px] text-slate-400 dark:border-slate-700">
            esc
          </kbd>
        </div>
        <ul className="max-h-[50vh] overflow-y-auto p-2" role="listbox">
          {q && results.length === 0 && (
            <li className="px-4 py-10 text-center text-sm text-slate-500">
              No results for “{q}”
            </li>
          )}
          {!q && (
            <li className="px-4 py-10 text-center text-sm text-slate-500">
              Type to search pages and sections.
            </li>
          )}
          {results.map((r, n) => (
            <li key={r.s.slug + r.s.id} role="option" aria-selected={n === i}>
              <a
                href={href(r.s.slug, r.s.id)}
                onClick={(e) => (e.preventDefault(), go(n))}
                onMouseEnter={() => setI(n)}
                className={
                  "block rounded-xl px-4 py-2.5 " +
                  (n === i ? "bg-brand-50 dark:bg-brand-500/15" : "")
                }
                data-testid="search-result"
              >
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <span>{r.s.group}</span>
                  <Icon name="chevron" className="h-3 w-3" />
                  <span>{r.s.page}</span>
                </div>
                <div className="text-sm font-medium text-slate-900 dark:text-white">
                  {mark(r.s.heading, q)}
                </div>
                {r.snippet && (
                  <div className="mt-0.5 line-clamp-2 text-xs text-slate-500">
                    {mark(r.snippet, q)}
                  </div>
                )}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
