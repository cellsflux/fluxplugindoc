---
title: The plugin manifest
description: Every field of plugin.json.
group: Reference
order: 3
---

Every plugin has a `plugin.json` at its root. It is validated when the plugin is discovered, installed and packaged (`fluxplugin validate`).

```json
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
```

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | string | **required** | Unique reverse-DNS id, e.g. `com.acme.notes`. Never changes. |
| `name` | string | **required** | Display name. |
| `version` | string | **required** | Semantic version (`1.2.3`). |
| `description` | string | — | One-line summary shown in lists. |
| `author` | string \| object | — | A name, or `{ name, email, url }`. |
| `homepage` | string | — | Project website (https). |
| `repository` | string \| object | — | Source repository (string or `{ type, url }`). |
| `license` | string | — | SPDX license id. |
| `icon` | string | — | Path to the icon inside the plugin (SVG/PNG). Shown in the store and the plugin page. |
| `banner` | string | — | Wide image for the top of the plugin page. |
| `screenshots` | array | `[]` | Images for the preview carousel — local paths, URLs or data URIs. |
| `language` | string | — | Language of `README.md` (BCP-47, e.g. `en`). Lets the host translate it automatically when the interface language differs. |
| `readme` | string | — | Path to the Markdown README shown as the plugin's page. |
| `video` | string | — | A YouTube, Vimeo, Dailymotion, Loom or Streamable URL, or an `https` / local `.mp4`/`.webm` file. |
| `categories` | array | `[]` | Store categories. |
| `keywords` | array | `[]` | Search keywords. |
| `links` | record | `{}` | Labelled https links (`{ "Docs": "https://…" }`). |
| `main` | string | — | Main-process entry (runs in Node). |
| `preload` | string | — | Preload entry. |
| `renderer` | string | — | Renderer entry (runs in the page). |
| `styles` | array | — | CSS files to load. `dist/renderer.css` is added automatically when your renderer imports CSS. |
| `tailwind` | object | — | Tailwind options: `content` globs, `safelist`, or a `precompiled` CSS file. |
| `activationEvents` | array | `[]` | When to load: `onStartup`, `onCommand:id`, `onRoute:/x`, `onService:x`, `onSlot:x`, `onIPC:x`, `onEvent:x`. |
| `deactivationEvents` | array | `[]` | When to unload. |
| `permissions` | array | `[]` | Every permission the plugin uses (see [Permissions](/permissions)). |
| `dependencies` | record | `{}` | Other plugins that must be installed: `{ "com.acme.core": "^2.0.0" }`. |
| `optionalDependencies` | record | `{}` | Plugins used if present. |
| `peerDependencies` | record | `{}` | Plugins that must be provided by the host app. |
| `engines` | record | `{}` | Compatibility: `{ "fluxplugin": "^1.0.0" }`. |
| `contributes` | object | `{}` | Static metadata mirroring the code-level registrations, so the host can display a plugin without activating it. |
| `isSystem` | boolean | `false` | A **claim** to be a system plugin. Ignored unless the host trusts the plugin (`systemPlugins` / `systemKeys`). |
| `requiredPermissions` | array | `[]` | Permissions the plugin cannot work without; they cannot be revoked. |
| `features` | array | `[]` | Independently switchable features `{ id, title, description?, requires: [permissions], default }`. |
| `provides` | array | `[]` | Capabilities offered (`language`, `theme`…). One plugin owns each capability. |
| `conflicts` | array | `[]` | Ids of plugins that cannot run together with this one. |
| `pricing` | object | — | `{ model: free|paid|subscription, amount, currency, purchaseUrl, trialDays, publicKey }` — see *Managing plugins*. |
| `integrity` | record | — | sha256 of the bundles, written by `package`. Verified before load. |
| `signature` | object | — | ed25519 signature `{ algorithm, publicKey, value }`, written by `package --sign-key`. |

> [!TIP]
> Run `npx fluxplugin validate` for precise error messages and warnings (for example when `engines.fluxplugin` is missing).
