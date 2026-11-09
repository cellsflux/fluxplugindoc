---
title: Project structure
description: What the generator creates and where each thing lives.
group: Getting started
order: 3
---

## The app

```text
my-app/
├─ package.json                 scripts: dev, build, start, dist, export:web, release
├─ fluxplugin.config.json       stores, updates (progressive), translate (README translation)
├─ electron-builder.yml         installer config (NSIS removes user plugins on uninstall)
├─ plugins/                     plugins shipped with the app
│  ├─ appearance/               themes, accent, fonts, density…   (system plugin)
│  ├─ language/                 en · fr · es · de                 (system plugin)
│  └─ hello/                    a sample you can delete
└─ src/app/
   ├─ shared/                   constants and types used by both sides
   ├─ main/                     Electron main process: framework, window, paths, boot
   ├─ preload/                  the bridge exposed to the page (contextBridge)
   └─ renderer/                 React: shell, pages, providers, settings, routes
```

### Layers

| Folder | Runs in | Rule |
| --- | --- | --- |
| `shared` | both | no Electron, no DOM |
| `main` | Electron main | the only place that talks to the OS |
| `preload` | isolated preload | exposes a small, typed bridge |
| `renderer` | the page | React only; reaches the OS through the bridge |

## A plugin

```text
my-plugin/
├─ plugin.json          manifest (id, version, permissions, entries…)
├─ README.md            the plugin's page in the store
├─ assets/icon.svg
├─ updates/1.0.1.md     release notes per version (generated, you complete them)
├─ src/                 TypeScript / React — development only
└─ dist/                what ships: main.mjs, renderer.js, renderer.css
```

> [!IMPORTANT]
> In production a plugin never contains `src/`, `.ts` files or sourcemaps. `fluxplugin package` and `fluxplugin dist` copy **runtime files only**.

A plugin can be its own project with its own `package.json` and libraries (`npm create fluxplugin-plugin my-plugin`). Its dependencies are bundled into `dist/`, so the host app needs none of them. Only `react`, `react-dom`, `fluxplugin` and `fluxplugin/react` are shared with the host.
