---
title: Introduction
description: What fluxplugin is, what you get, and how it is organised.
group: Getting started
order: 1
---

**fluxplugin** is a plugin architecture for **Electron + React + TypeScript** apps. You build the host once; anyone — you, your team, the community — extends it with plugins that can add pages, commands, menus, themes, languages, settings, background logic and more, **without touching the host code**.

![The plugin manager: an app-store style list with system plugins, switches and status](/img/plugin-manager.png)

## What you get

- **A real plugin runtime.** Lifecycle with timeouts and rollback, dependencies, lazy activation, hot reload, crash isolation (a plugin that crashes three times is disabled).
- **Permissions that are enforced**, not decorative: checked in the main process on every call, with locks for system and required permissions.
- **A desktop-grade UI kit.** Title bar, menus, command palette, notifications, themes, settings, collapsible sidebar, macOS-style alerts, an app-store style plugin manager.
- **FluxAPI.** Notifications, native file dialogs, camera, clipboard, tray, global shortcuts, printing and files opened by the OS — all permission-checked per plugin.
- **Stores.** Install plugins from GitHub, a JSON catalog or your own server, with de-duplication, pagination, dependency resolution and transactional installs.
- **Updates.** Plugin updates with change detection, and **progressive application updates** that download only the files that changed.
- **A CLI.** `init`, `dev`, `build`, `dist`, `export`, `package`, `publish`, `store build`, and more.

![A plugin page like an app-store listing: description, permissions, settings and release notes](/img/plugin-details.png)

## How it is organised

| Layer | What it is | You write |
| --- | --- | --- |
| **Core** (`fluxplugin`) | Runtime-agnostic plugin manager: registries, hooks, events, IPC, permissions, schemas | nothing |
| **Host** (`fluxplugin/main`, `/preload`, `/react`) | Adapters and UI components for Electron and React | the app shell (generated for you) |
| **Plugins** | Folders with a `plugin.json` and a bundle; installed at runtime | the features |

```text
your-app/
  src/app/{shared,main,preload,renderer}   ← the host, layered
  plugins/<id>/                            ← bundled plugins (runtime files only in production)
  fluxplugin.config.json                   ← stores, updates, translation
```

> [!NOTE]
> Plugins run in the same JavaScript realm as the app. Permissions are a strong guard rail for honest plugins and for mistakes, not a sandbox against hostile code. Read the [security model](/security) before you open your app to third-party plugins.

## Status

The library typechecks and is covered by 228 automated tests, plus real runs in a browser and in Electron (Linux). Not yet verified: Windows and macOS, publishing to real GitHub, and the newest desktop features in a packaged Electron app. The package is not published on npm yet — see [Publishing to npm](/release).
