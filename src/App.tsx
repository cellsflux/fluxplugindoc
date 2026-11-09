import { useEffect, useState } from "react";
import { DocPage } from "./components/DocPage";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Home } from "./components/Home";
import { MobileNav, Sidebar } from "./components/Sidebar";
import { SearchDialog } from "./components/Search";
import { getPage } from "./lib/content";
import { href, installLinkInterception, useRoute } from "./lib/router";
import { useTheme } from "./lib/theme";

function NotFound() {
  return (
    <div className="flex-1 py-24 text-center">
      <p className="text-sm font-semibold text-brand-600">404</p>
      <h1 className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">Page not found</h1>
      <p className="mt-3 text-slate-500">This page does not exist (anymore). Try the search or go back to the start.</p>
      <a href={href("quick-start")} className="mt-6 inline-block rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">Quick start</a>
    </div>
  );
}

export default function App() {
  const [theme, cycleTheme] = useTheme();
  const { slug, hash } = useRoute();
  const [menu, setMenu] = useState(false);
  const [searching, setSearching] = useState(false);

  useEffect(() => installLinkInterception(), []);
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test((e.target as HTMLElement).tagName) || (e.target as HTMLElement).isContentEditable;
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) (e.preventDefault(), setSearching(true));
      else if (e.key === "Escape") (setSearching(false), setMenu(false));
    };
    window.addEventListener("keydown", on);
    return () => window.removeEventListener("keydown", on);
  }, []);
  useEffect(() => setMenu(false), [slug]);

  const page = slug ? getPage(slug) : undefined;
  useEffect(() => {
    if (!slug) {
      document.title = "fluxplugin — plugin architecture for Electron, React and TypeScript";
      if (!hash) window.scrollTo({ top: 0 });
    }
  }, [slug, hash]);

  return (
    <div className="min-h-screen">
      <a href="#content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-lg focus:bg-brand-600 focus:px-4 focus:py-2 focus:text-white">Skip to content</a>
      <Header theme={theme} onTheme={cycleTheme} onSearch={() => setSearching(true)} onMenu={() => setMenu(true)} />
      <MobileNav open={menu} active={slug} onClose={() => setMenu(false)} />
      <SearchDialog open={searching} onClose={() => setSearching(false)} />
      <main id="content">
        {!slug ? (
          <Home />
        ) : (
          <>
            <div className="mx-auto flex max-w-[90rem] px-4 sm:px-6">
              <Sidebar active={slug} />
              {page ? <DocPage page={page} hash={hash} /> : <NotFound />}
            </div>
            <Footer />
          </>
        )}
      </main>
    </div>
  );
}
