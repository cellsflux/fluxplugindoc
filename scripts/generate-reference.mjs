// Regenerates src/content/reference/{manifest,permissions}.md from the real library.
// Usage: FLUXPLUGIN_DIST=../flux/dist/node/index.js node scripts/generate-reference.mjs
import { writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import path from "node:path";
const dist = path.resolve(process.env.FLUXPLUGIN_DIST ?? "../flux/dist/node/index.js");
const m = await import(pathToFileURL(dist).href);
const fm = (title, description, order, body) => `---\ntitle: ${title}\ndescription: ${description}\ngroup: Reference\norder: ${order}\n---\n\n${body.trim()}\n`;

const DESC = {
  id: "Unique reverse-DNS id, e.g. `com.acme.notes`. Never changes.", name: "Display name.", version: "Semantic version (`1.2.3`).", description: "One-line summary shown in lists.",
  author: "A name, or `{ name, email, url }`.", homepage: "Project website (https).", repository: "Source repository (string or `{ type, url }`).", license: "SPDX license id.",
  icon: "Path to the icon inside the plugin (SVG/PNG). Shown in the store and the plugin page.", banner: "Wide image for the top of the plugin page.",
  screenshots: "Images for the preview carousel — local paths, URLs or data URIs.", language: "Language of `README.md` (BCP-47, e.g. `en`). Lets the host translate it automatically when the interface language differs.",
  readme: "Path to the Markdown README shown as the plugin's page.", video: "A YouTube, Vimeo, Dailymotion, Loom or Streamable URL, or an `https` / local `.mp4`/`.webm` file.",
  categories: "Store categories.", keywords: "Search keywords.", links: "Labelled https links (`{ \"Docs\": \"https://…\" }`).",
  main: "Main-process entry (runs in Node).", preload: "Preload entry.", renderer: "Renderer entry (runs in the page).", styles: "CSS files to load. `dist/renderer.css` is added automatically when your renderer imports CSS.",
  tailwind: "Tailwind options: `content` globs, `safelist`, or a `precompiled` CSS file.", activationEvents: "When to load: `onStartup`, `onCommand:id`, `onRoute:/x`, `onService:x`, `onSlot:x`, `onIPC:x`, `onEvent:x`.",
  deactivationEvents: "When to unload.", permissions: "Every permission the plugin uses (see [Permissions](/permissions)).", dependencies: "Other plugins that must be installed: `{ \"com.acme.core\": \"^2.0.0\" }`.",
  optionalDependencies: "Plugins used if present.", peerDependencies: "Plugins that must be provided by the host app.", engines: "Compatibility: `{ \"fluxplugin\": \"^1.0.0\" }`.",
  contributes: "Static metadata mirroring the code-level registrations, so the host can display a plugin without activating it.", isSystem: "A **claim** to be a system plugin. Ignored unless the host trusts the plugin (`systemPlugins` / `systemKeys`).",
  requiredPermissions: "Permissions the plugin cannot work without; they cannot be revoked.", features: "Independently switchable features `{ id, title, description?, requires: [permissions], default }`.",
  provides: "Capabilities offered (`language`, `theme`…). One plugin owns each capability.", conflicts: "Ids of plugins that cannot run together with this one.",
  pricing: "`{ model: free|paid|subscription, amount, currency, purchaseUrl, trialDays, publicKey }` — see *Managing plugins*.", integrity: "sha256 of the bundles, written by `package`. Verified before load.",
  signature: "ed25519 signature `{ algorithm, publicKey, value }`, written by `package --sign-key`.",
};
const d = m.manifestSchema.describe();
const rows = Object.entries(d.properties).map(([k, v]) => {
  const type = v.type === "custom" ? "string" : v.type === "union" ? "string \\| object" : v.type;
  const req = (d.required ?? []).includes(k) ? "**required**" : v.default !== undefined ? `\`${JSON.stringify(v.default)}\`` : "—";
  return `| \`${k}\` | ${type} | ${req} | ${DESC[k] ?? ""} |`;
});
writeFileSync("src/content/reference/manifest.md", fm("The plugin manifest", "Every field of plugin.json.", 3, `
Every plugin has a \`plugin.json\` at its root. It is validated when the plugin is discovered, installed and packaged (\`fluxplugin validate\`).

\`\`\`json
{
  "id": "com.acme.notes",
  "name": "Notes",
  "version": "1.0.0",
  "description": "Quick notes in the sidebar.",
  "main": "./dist/main.mjs",
  "renderer": "./dist/renderer.js",
  "permissions": ["ui", "ipc", "storage"],
  "engines": { "fluxplugin": "^1.0.0" }
}
\`\`\`

| Field | Type | Default | Description |
| --- | --- | --- | --- |
${rows.join("\n")}

> [!TIP]
> Run \`npx fluxplugin validate\` for precise error messages and warnings (for example when \`engines.fluxplugin\` is missing).
`));

const perms = Object.entries(m.PERMISSION_CATALOG).map(([k, v]) => `| \`${k}\` | ${v.title} | ${v.description} | ${v.consequence.replace(/^Off: /, "")} | ${v.sensitive ? "⚠️ sensitive" : ""}${v.requires?.length ? ` needs \`${v.requires.join("`, `")}\`` : ""} |`);
writeFileSync("src/content/reference/permissions.md", fm("Permissions", "The permission catalog, generated from the library.", 4, `
A plugin can only use what it declares in \`plugin.json\`, and the user can switch most permissions on or off. Calls are checked in the **main process** on every use.

| Permission | Title | What it allows | When it is off | Notes |
| --- | --- | --- | --- | --- |
${perms.join("\n")}

## Custom permissions

Hosts can define their own with the \`x.\` prefix (\`x.billing\`, \`x.export\`) and check them with \`ctx.permissions.assert("x.billing")\`.

## Locked permissions

A permission can be **locked** so it cannot be revoked: protected by the system, listed in \`requiredPermissions\`, used by an enabled feature, or needed by another permission. The plugin page shows the reason. See [Managing plugins](/plugin-management).

## Per-plugin file access

\`filesystem.read\` and \`filesystem.write\` do not give raw paths. Plugins get **file references** from native dialogs, usable only by the plugin they were granted to. See [FluxAPI](/desktop-api).
`));
console.log("generated manifest.md and permissions.md");
