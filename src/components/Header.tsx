import { SITE } from "../config";
import { href } from "../lib/router";
import type { Theme } from "../lib/theme";
import { Icon, Logo } from "./Icon";

export function Header({ theme, onTheme, onSearch, onMenu }: { theme: Theme; onTheme: () => void; onSearch: () => void; onMenu: () => void }) {
  const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-950/80">
      <div className="mx-auto flex h-16 max-w-[90rem] items-center gap-3 px-4 sm:px-6">
        <button onClick={onMenu} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden dark:hover:bg-slate-800" aria-label="Open navigation">
          <Icon name="menu" />
        </button>
        <a href={href("")} className="flex items-center gap-2.5 font-semibold text-slate-900 dark:text-white">
          <Logo />
          <span className="text-lg tracking-tight">{SITE.name}</span>
          <span className="hidden rounded-full bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700 sm:inline dark:bg-brand-500/15 dark:text-brand-300">v{SITE.version}</span>
        </a>
        <nav className="ml-6 hidden items-center gap-1 text-sm font-medium md:flex">
          {[["Guides", "quick-start"], ["Plugins", "plugin-authors"], ["Reference", "cli"]].map(([label, slug]) => (
            <a key={label} href={href(slug!)} className="rounded-lg px-3 py-2 text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-white">{label}</a>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <button onClick={onSearch} className="group flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500 transition hover:border-slate-300 hover:bg-white sm:w-64 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700" aria-label="Search the documentation">
            <Icon name="search" className="h-4 w-4" />
            <span className="hidden flex-1 text-left sm:inline">Search docs…</span>
            <kbd className="hidden rounded-md border border-slate-200 bg-white px-1.5 py-0.5 font-sans text-[11px] font-medium text-slate-500 sm:inline dark:border-slate-700 dark:bg-slate-800">{isMac ? "⌘" : "Ctrl"} K</kbd>
          </button>
          <button onClick={onTheme} className="rounded-lg p-2.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white" aria-label={`Theme: ${theme}`} title={`Theme: ${theme} (click to change)`} data-testid="theme-toggle">
            <Icon name={theme === "dark" ? "moon" : theme === "light" ? "sun" : "monitor"} />
          </button>
          <a href={SITE.repo} target="_blank" rel="noopener noreferrer" className="rounded-lg p-2.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white" aria-label="GitHub">
            <Icon name="github" />
          </a>
        </div>
      </div>
    </header>
  );
}
