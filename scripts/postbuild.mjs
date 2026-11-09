// Static hosts (GitHub Pages, Netlify drag-and-drop…) need a fallback so deep links like /quick-start work.
import { copyFileSync } from "node:fs";
copyFileSync("dist/index.html", "dist/404.html");
console.log("dist/404.html created (SPA fallback)");
