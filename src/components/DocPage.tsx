import { useEffect, useMemo, useRef } from "react";
import { SITE } from "../config";
import { neighbours, type Page } from "../lib/content";
import { renderMarkdown } from "../lib/markdown";
import { BASE, href } from "../lib/router";
import { Icon } from "./Icon";
import { Toc } from "./Toc";

export function DocPage({ page, hash }: { page: Page; hash: string }) {
  const rendered = useMemo(() => renderMarkdown(page.body, BASE), [page.body]);
  const ref = useRef<HTMLElement>(null);
  const { prev, next } = neighbours(page.slug);

  useEffect(() => {
    document.title = `${page.title} — ${SITE.name}`;
    if (hash)
      setTimeout(
        () => document.getElementById(hash)?.scrollIntoView({ block: "start" }),
        0,
      );
    else window.scrollTo({ top: 0 });
  }, [page.slug, hash, page.title]);

  const onClick = (e: React.MouseEvent) => {
    const btn = (e.target as HTMLElement).closest<HTMLButtonElement>(
      "[data-copy]",
    );
    if (!btn) return;
    const code =
      btn.closest(".code-block")?.querySelector("code")?.textContent ?? "";
    void navigator.clipboard?.writeText(code);
    btn.textContent = "Copied ✓";
    setTimeout(() => (btn.textContent = "Copy"), 1500);
  };

  return (
    <>
      <article
        ref={ref}
        className="min-w-0 flex-1 py-8 lg:px-10 lg:py-12"
        onClick={onClick}
      >
        <div className="mb-3 flex items-center gap-1.5 text-sm font-medium text-brand-600 dark:text-brand-300">
          <span>{page.group}</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl dark:text-white">
          {page.title}
        </h1>
        {page.description && (
          <p className="mt-3 text-lg text-slate-500 dark:text-slate-400">
            {page.description}
          </p>
        )}
        <div
          className="prose prose-slate mt-8 dark:prose-invert"
          data-testid="doc-content"
          dangerouslySetInnerHTML={{ __html: rendered.html }}
        />
        <div className="mt-14 grid gap-4 border-t border-slate-200 pt-8 sm:grid-cols-2 dark:border-slate-800">
          {prev ? (
            <a
              href={href(prev.slug)}
              className="group rounded-xl border border-slate-200 p-4 transition hover:border-brand-300 dark:border-slate-800 dark:hover:border-brand-500/50"
            >
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <Icon name="left" className="h-3.5 w-3.5" /> Previous
              </div>
              <div className="mt-1 font-medium text-slate-900 group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-300">
                {prev.title}
              </div>
            </a>
          ) : (
            <span />
          )}
          {next && (
            <a
              href={href(next.slug)}
              className="group rounded-xl border border-slate-200 p-4 text-right transition hover:border-brand-300 sm:col-start-2 dark:border-slate-800 dark:hover:border-brand-500/50"
            >
              <div className="flex items-center justify-end gap-1 text-xs text-slate-400">
                Next <Icon name="right" className="h-3.5 w-3.5" />
              </div>
              <div className="mt-1 font-medium text-slate-900 group-hover:text-brand-600 dark:text-white dark:group-hover:text-brand-300">
                {next.title}
              </div>
            </a>
          )}
        </div>
      </article>
      <Toc headings={rendered.headings} />
    </>
  );
}
