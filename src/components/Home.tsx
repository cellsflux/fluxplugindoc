import { useMemo } from "react";
import { SITE } from "../config";
import { renderMarkdown } from "../lib/markdown";
import { BASE, href } from "../lib/router";
import { Footer } from "./Footer";
import { Icon } from "./Icon";

const FEATURES: [string, string, string][] = [
  ["plug", "A real plugin runtime", "Lifecycle with timeouts and rollback, dependencies, lazy activation, hot reload — and crash isolation: a plugin that fails three times is disabled."],
  ["shield", "Permissions that are enforced", "Checked in the main process on every call. System plugins, locked permissions and per-plugin file capabilities — not just hidden buttons."],
  ["layout", "A desktop-grade UI kit", "Title bar, menus, command palette, notifications, themes, settings, collapsible sidebar and an app-store style plugin manager."],
  ["zap", "FluxAPI for the desktop", "Notifications, native file dialogs, camera, clipboard, tray, global shortcuts, printing and files opened by the OS."],
  ["grid", "Plugin stores", "GitHub, a JSON catalog or your own server. De-duplicated, paginated, with dependency plans and transactional installs."],
  ["download", "Progressive updates", "Applications update by downloading only the files that changed — signed, verified, with automatic rollback."],
  ["globe", "Made for every language", "System languages, plugin translations with automatic prefixes, and READMEs translated on demand."],
  ["box", "Plugins are real projects", "Their own package.json and libraries, bundled into dist/. Only runtime files ship — never src, .ts or sourcemaps."],
];

const HOST = `import { MainFramework, createElectronBackend } from "fluxplugin/main";

const fw = new MainFramework({
  pluginDirs: [bundledPlugins, userPlugins],
  systemPlugins: ["com.acme.core"],            // cannot be disabled or removed
  desktop: { backend: createElectronBackend(electron) },
  updates: { source: { type: "github", repo: "acme/app" }, /* … */ },
});
await fw.start();`;

const PLUGIN = `import { definePlugin } from "fluxplugin";
import { useFlux } from "fluxplugin/react";

function Notes() {
  const flux = useFlux("com.acme.notes");
  const save = async () => {
    const file = await flux.files.save({ defaultName: "note.md" });
    if (file) await flux.files.write(file, "# Hello");
  };
  return <button onClick={save}>Save note</button>;
}

export default definePlugin({
  routes: [{ path: "/notes", component: Notes, meta: { menu: { label: "Notes", icon: "file" } } }],
  commands: [{ id: "notes.new", title: "New note", keybinding: "Mod+N", execute: () => location.assign("#/notes") }],
});`;

function Code({ lang, src }: { lang: string; src: string }) {
  const html = useMemo(() => renderMarkdown("```" + lang + "\n" + src + "\n```", BASE).html, [lang, src]);
  return (
    <div
      onClick={(e) => {
        const b = (e.target as HTMLElement).closest<HTMLButtonElement>("[data-copy]");
        if (!b) return;
        void navigator.clipboard?.writeText(src);
        b.textContent = "Copied ✓";
        setTimeout(() => (b.textContent = "Copy"), 1500);
      }}
      className="text-left [&_.code-block]:my-0 [&_.code-block]:h-full" dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export function Home() {
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
          <div className="absolute left-1/2 top-[-12rem] h-[34rem] w-[60rem] -translate-x-1/2 rounded-full bg-gradient-to-tr from-brand-400/30 via-purple-400/25 to-sky-300/20 blur-3xl dark:from-brand-500/25 dark:via-purple-500/20 dark:to-sky-500/10" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(100,116,139,.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(100,116,139,.08)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        </div>
        <div className="mx-auto max-w-5xl px-4 pb-10 pt-20 text-center sm:px-6 sm:pt-28">
          <a href={href("app-updates")} className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/70 px-3.5 py-1.5 text-sm font-medium text-brand-700 shadow-sm backdrop-blur transition hover:border-brand-300 dark:border-brand-500/30 dark:bg-slate-900/60 dark:text-brand-300">
            <span className="rounded-full bg-brand-600 px-2 py-0.5 text-[11px] font-semibold text-white">New</span> Progressive, signed application updates <Icon name="right" className="h-3.5 w-3.5" />
          </a>
          <h1 className="mt-6 text-balance text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl dark:text-white">
            Build desktop apps that <span className="bg-gradient-to-r from-brand-600 via-purple-600 to-sky-500 bg-clip-text text-transparent">grow with plugins</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-balance text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            {SITE.name} is a plugin architecture for Electron, React and TypeScript: a real runtime, enforced permissions, stores, updates and a desktop UI kit — so your users can extend your app without you touching it.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <a href={href("quick-start")} className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-brand-600/25 transition hover:bg-brand-700">Get started <Icon name="right" className="h-4 w-4" /></a>
            <a href={href("introduction")} className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition hover:border-slate-400 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">Read the docs</a>
          </div>
          <div className="mx-auto mt-8 flex max-w-md items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-left font-mono text-sm shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/70">
            <span className="text-slate-700 dark:text-slate-200"><span className="select-none text-slate-400">$ </span>npm create fluxplugin@latest my-app</span>
            <button className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800" aria-label="Copy command"
              onClick={(e) => { void navigator.clipboard?.writeText("npm create fluxplugin@latest my-app"); const b = e.currentTarget; b.dataset["done"] = "1"; setTimeout(() => delete b.dataset["done"], 1500); }}>
              <Icon name="copy" className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-brand-900/10 dark:border-slate-800 dark:bg-slate-900 dark:shadow-black/40">
            <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
              <span className="h-3 w-3 rounded-full bg-red-400" /><span className="h-3 w-3 rounded-full bg-amber-400" /><span className="h-3 w-3 rounded-full bg-emerald-400" />
              <span className="ml-3 text-xs text-slate-400">The plugin manager of a generated app</span>
            </div>
            <img src={`${BASE}img/plugin-manager.png`} alt="Plugin manager with system plugins, status and switches" className="w-full" loading="eager" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Everything an extensible app needs</h2>
          <p className="mt-3 text-slate-500">Stop rebuilding the same plumbing. Start from a host that already behaves like a product.</p>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(([icon, title, text]) => (
            <div key={title} className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-lg hover:shadow-brand-600/5 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-brand-500/40">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-purple-500 text-white shadow-md shadow-brand-500/30"><Icon name={icon} /></div>
              <h3 className="mt-5 font-semibold text-slate-900 dark:text-white">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200 bg-slate-50/70 py-16 dark:border-slate-800 dark:bg-slate-900/30">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">One host, endless plugins</h2>
            <p className="mt-3 text-slate-500">You configure the host once. Plugins add pages, commands and menus — and reach the desktop through permission-checked APIs.</p>
          </div>
          <div className="mt-10 grid items-stretch gap-6 lg:grid-cols-2">
            <div><div className="mb-2 text-sm font-semibold text-slate-900 dark:text-white">The host <span className="font-normal text-slate-400">· main process</span></div><Code lang="ts" src={HOST} /></div>
            <div><div className="mb-2 text-sm font-semibold text-slate-900 dark:text-white">A plugin <span className="font-normal text-slate-400">· renderer</span></div><Code lang="tsx" src={PLUGIN} /></div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-center text-3xl font-bold tracking-tight text-slate-900 dark:text-white">See it in action</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[["plugin-store.png", "The plugin store", "Tiles, categories, free & paid, pagination."], ["system-plugin.png", "Protected system plugins", "No uninstall, locked permissions, with the reason."], ["settings-appearance.png", "Settings & appearance", "Themes, accent, fonts, density — all customizable."]].map(([img, t, d]) => (
            <figure key={img} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <img src={`${BASE}img/${img}`} alt={t} className="aspect-[4/3] w-full object-cover object-top" loading="lazy" />
              <figcaption className="p-4"><div className="font-semibold text-slate-900 dark:text-white">{t}</div><div className="mt-1 text-sm text-slate-500">{d}</div></figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-700 to-purple-700 px-8 py-14 text-center text-white shadow-xl shadow-brand-700/20">
          <h2 className="text-3xl font-bold tracking-tight">Ready to make your app extensible?</h2>
          <p className="mx-auto mt-3 max-w-xl text-brand-100">Create an app in one command and write your first plugin in minutes.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href={href("quick-start")} className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-brand-700 transition hover:bg-brand-50">Quick start</a>
            <a href={href("plugin-authors")} className="rounded-xl border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">Write a plugin</a>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
