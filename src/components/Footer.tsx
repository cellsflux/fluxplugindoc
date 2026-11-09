import { SITE } from "../config";
import { href } from "../lib/router";
import { Logo } from "./Icon";

export function Footer() {
  const cols: [string, [string, string][]][] = [
    ["Start", [["Introduction", "introduction"], ["Quick start", "quick-start"], ["Project structure", "project-structure"]]],
    ["Build", [["Writing plugins", "plugin-authors"], ["The manifest", "manifest"], ["Permissions", "permissions"], ["FluxAPI", "desktop-api"]]],
    ["Ship", [["Plugin stores", "plugin-stores"], ["Application updates", "app-updates"], ["CLI reference", "cli"], ["Security", "security"]]],
  ];
  return (
    <footer className="border-t border-slate-200 bg-slate-50/60 dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto grid max-w-[90rem] gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.5fr_repeat(3,1fr)]">
        <div>
          <div className="flex items-center gap-2.5 font-semibold text-slate-900 dark:text-white"><Logo className="h-7 w-7" /> {SITE.name}</div>
          <p className="mt-3 max-w-xs text-sm text-slate-500">{SITE.tagline} Runtime, permissions, stores, updates and a desktop UI kit for Electron + React.</p>
        </div>
        {cols.map(([title, links]) => (
          <div key={title}>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</h4>
            <ul className="mt-3 space-y-2 text-sm">
              {links.map(([label, slug]) => <li key={slug}><a className="text-slate-600 hover:text-brand-600 dark:text-slate-400 dark:hover:text-brand-300" href={href(slug)}>{label}</a></li>)}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-slate-200 py-5 text-center text-xs text-slate-400 dark:border-slate-800">MIT licensed · Built with Vite, React and Tailwind CSS</div>
    </footer>
  );
}
