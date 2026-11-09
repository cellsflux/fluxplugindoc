import { useEffect, useState } from "react";

export const BASE = import.meta.env.BASE_URL; // "/" or "/repo/"

const read = () => ({
  slug: decodeURIComponent(location.pathname.slice(BASE.length)).replace(
    /\/$/,
    "",
  ),
  hash: location.hash.slice(1),
});

export function useRoute() {
  const [route, setRoute] = useState(read);
  useEffect(() => {
    const on = () => setRoute(read());
    window.addEventListener("popstate", on);
    window.addEventListener("flux:navigate", on);
    return () => (
      window.removeEventListener("popstate", on),
      window.removeEventListener("flux:navigate", on)
    );
  }, []);
  return route;
}

/** `to` is a site path such as "/quick-start#install". */
export function navigate(to: string): void {
  const url = to.startsWith(BASE) ? to : BASE + to.replace(/^\//, "");
  if (url !== location.pathname + location.hash)
    history.pushState(null, "", url);
  window.dispatchEvent(new Event("flux:navigate"));
}

export const href = (slug: string, id?: string) =>
  `${BASE}${slug}${id ? "#" + id : ""}`;

/** Keeps the site a single-page app: internal links never reload the page. */
export function installLinkInterception(): () => void {
  const h = (e: MouseEvent) => {
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey
    )
      return;
    const a = (e.target as HTMLElement).closest?.("a");
    if (
      !a ||
      a.target ||
      a.hasAttribute("download") ||
      a.origin !== location.origin ||
      !a.pathname.startsWith(BASE)
    )
      return;
    e.preventDefault();
    navigate(a.pathname + a.hash);
  };
  document.addEventListener("click", h);
  return () => document.removeEventListener("click", h);
}
