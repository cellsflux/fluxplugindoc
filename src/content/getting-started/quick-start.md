---
title: Quick start
description: From zero to a running app with its first plugin in five minutes.
group: Getting started
order: 2
---

## Requirements

- **Node.js 20+** and npm or pnpm
- Windows, macOS or Linux

## 1. Create the app

```bash
npm create fluxplugin@latest my-app
cd my-app
npm install
```

Add `--tailwindcss` to scaffold the app with Tailwind CSS v4.

> [!TIP]
> If the Electron binary is blocked on your network, run `npx fluxplugin doctor`: it downloads it and fixes what it can.

## 2. Run it

```bash
npm run dev          # Electron, with plugin hot reload
npx fluxplugin dev --web   # or in a browser, no Electron needed
```

You get a title bar with menus and search, a collapsible sidebar, a command palette (`Ctrl/Cmd+K`), settings with **Appearance** and **Language** plugins, and the plugin manager.

![The command palette (Ctrl/Cmd+K) lists every command plugins register](/img/command-palette.png)

## 3. Write a plugin

```bash
npx fluxplugin plugin new hello -t dashboard
```

```tsx
// plugins/hello/src/renderer.tsx
import { definePlugin } from "fluxplugin";
import { Group, Row } from "fluxplugin/react";

function HelloPage() {
  return (
    <Group title="Hello">
      <Row title="It works" subtitle="This page comes from a plugin" />
    </Group>
  );
}

export default definePlugin({
  routes: [{ path: "/hello", component: HelloPage, meta: { title: "Hello", menu: { label: "Hello", icon: "star" } } }],
});
```

Save: the running app reloads the plugin and a **Hello** entry appears in the sidebar.

## 4. Ship it

```bash
npx fluxplugin package            # runtime-only .tgz (no src, no .ts, no sourcemaps)
npx fluxplugin publish            # GitHub release + topic, so it shows up in stores
npm run dist                      # installer for your app (Windows/macOS/Linux)
npm run release                   # publish an application update (changed files only)
```

## Next steps

- [Writing plugins](/plugin-authors) — the full authoring guide
- [The plugin manifest](/manifest) — every `plugin.json` field
- [Permissions](/permissions) — what plugins may ask for
- [Managing plugins](/plugin-management) — system plugins, updates, dependencies, licenses
