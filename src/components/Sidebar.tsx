import { nav } from "../lib/content";
import { href } from "../lib/router";

export function SidebarNav({ active, onPick }: { active: string; onPick?: () => void }) {
  return (
    <nav aria-label="Documentation" className="space-y-7 text-sm">
      {nav.map((g) => (
        <div key={g.group}>
          <h4 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">{g.group}</h4>
          <ul className="space-y-0.5">
            {g.pages.map((p) => {
              const on = p.slug === active;
              return (
                <li key={p.slug}>
                  <a href={href(p.slug)} onClick={onPick} aria-current={on ? "page" : undefined}
                    className={"flex items-center rounded-lg px-3 py-1.5 transition " + (on ? "bg-brand-50 font-medium text-brand-700 dark:bg-brand-500/15 dark:text-brand-300" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-white")}>
                    {p.title}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

export function Sidebar({ active }: { active: string }) {
  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 overflow-y-auto py-8 pr-4 lg:block no-scrollbar">
      <SidebarNav active={active} />
    </aside>
  );
}

export function MobileNav({ open, active, onClose }: { open: boolean; active: string; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute inset-y-0 left-0 w-72 overflow-y-auto bg-white p-5 shadow-2xl dark:bg-slate-950">
        <SidebarNav active={active} onPick={onClose} />
      </div>
    </div>
  );
}
