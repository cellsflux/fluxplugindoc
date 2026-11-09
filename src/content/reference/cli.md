---
title: CLI reference
description: Every fluxplugin command.
group: Reference
order: 2
---

```bash
npx fluxplugin <command> [options]
```

## App

| Command | What it does |
| --- | --- |
| `init [dir] [--tailwindcss] [--store …]` | Create a new Electron + React app that supports plugins. `--store github:owner/repo` or a JSON URL sets the default store |
| `doctor` | Check Node, Electron, esbuild and Tailwind, and fix what it can (downloads the Electron binary if it was blocked) |
| `dev [--web]` | Run the app with plugin hot reload — in Electron, or in a browser with `--web` |
| `build` | Bundle the app (in an app folder) or a plugin (in a plugin folder) |
| `start [--web]` | Run the built app |
| `dist [--win\|--mac\|--linux] [--unpacked]` | Build an installer / executable with electron-builder. Plugins are bundled as runtime files only |
| `export [--out website]` | Extract the app as a static website (renderer + plugin files + `bootstrap.json`) |
| `publish --production` | Publish an **application update** (see below) |

## Plugins

| Command | What it does |
| --- | --- |
| `plugin new <name> [-t basic\|dashboard\|backend] [--tailwindcss] [--standalone]` | Scaffold a plugin. Outside an app (or with `--standalone`) it is its own project |
| `dev --host <app>` | In a plugin project: rebuild on save and sync into a host app that hot-reloads it |
| `validate [dir]` | Check manifest, entries and integrity |
| `notes [dir]` | Create or refresh `updates/<version>.md` from the detected changes |
| `package [dir] [--out d] [--sign-key file]` | Build + integrity (+ signature) + `.tgz` of runtime files |
| `package --all [--out release/plugins]` | Package every plugin of the app |
| `publish [dir] [--repo o/r] [--dry-run]` | Publish a plugin to a store (GitHub release + topic) |
| `keygen [--out name]` | Create an ed25519 key pair (plugin signing, system plugins, update signing) |
| `tailwind [--dir plugins] [--out file]` | Generate `@source` lines for Tailwind v4 |

## Stores and installation

| Command | What it does |
| --- | --- |
| `search [query]` | Search the configured stores |
| `install <id[@version]\|dir\|.tgz>` | Install from a store, a folder or a package |
| `uninstall <id>` · `enable <id>` · `disable <id>` · `list` | Manage installed plugins |
| `store init <dir>` | Create your own store (`index.json`) |
| `store add <pkg.tgz> [--dir d] [--base-url url]` | Add a package to your store |
| `store build [dir] [--out index.json]` | Build the catalog JSON from plugin folders (repository layout) |

## Application updates

```bash
FLUXPLUGIN_UPDATE_KEY=<private key> npx fluxplugin publish --production \
  --bump minor --github you/app --min-host 1.4.0
```

| Option | Meaning |
| --- | --- |
| `--bump patch\|minor\|major\|none` | New version in `package.json` (default `patch`) |
| `--out dir` | Folder that becomes your update server (default `release-server`) |
| `--base-url url` | Where that folder will be served |
| `--github owner/repo` | Create the release and upload the files (needs `GITHUB_TOKEN`) |
| `--update-key k` | Private key used to sign `latest.json` (or `FLUXPLUGIN_UPDATE_KEY`) |
| `--min-host v` | Oldest installed application that can load this update |
| `--dry-run` | Show what would be published |

It writes `releases/<version>.md` (your text is kept; changes are detected automatically), `latest.json`, `releases.json` and only the **new** files. See [Application updates](/app-updates).
