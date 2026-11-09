import { useCallback, useEffect, useState } from "react";

export type Theme = "light" | "dark" | "system";
const KEY = "fluxdocs.theme";

const apply = (t: Theme) =>
  document.documentElement.classList.toggle(
    "dark",
    t === "dark" ||
      (t === "system" && matchMedia("(prefers-color-scheme: dark)").matches),
  );

export function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem(KEY) as Theme) || "system",
  );
  useEffect(() => {
    apply(theme);
    if (theme !== "system") return;
    const mq = matchMedia("(prefers-color-scheme: dark)");
    const l = () => apply("system");
    mq.addEventListener("change", l);
    return () => mq.removeEventListener("change", l);
  }, [theme]);
  const cycle = useCallback(
    () =>
      setTheme((t) => {
        const n: Theme =
          t === "system" ? "light" : t === "light" ? "dark" : "system";
        localStorage.setItem(KEY, n);
        return n;
      }),
    [],
  );
  return [theme, cycle];
}
