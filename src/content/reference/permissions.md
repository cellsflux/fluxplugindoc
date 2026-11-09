---
title: Permissions
description: The permission catalog, generated from the library.
group: Reference
order: 4
---

A plugin can only use what it declares in `plugin.json`, and the user can switch most permissions on or off. Calls are checked in the **main process** on every use.

| Permission | Title | What it allows | When it is off | Notes |
| --- | --- | --- | --- | --- |
| `ipc` | Talk to the app's background process | Call and answer background tasks. | its features that need the background process stop working. |  |
| `services` | Share and use services | Offer features to other plugins and use theirs. | it cannot use or provide shared services. |  |
| `events` | Send and receive events | React to what happens in the app. | it no longer reacts to app events. |  |
| `hooks` | Change how the app behaves | Intercept, validate or modify operations. | its rules no longer apply to operations. | ⚠️ sensitive |
| `commands` | Add commands | Appear in the command palette and menus, with shortcuts. | its commands disappear. |  |
| `routes` | Add pages | Create its own screens in the app. | its pages are removed. |  |
| `menus` | Add menu entries | Appear in the menu bar and sidebar. | its menu entries disappear. |  |
| `ui` | Add interface elements | Place widgets, buttons, settings sections and themes in the app. | its interface additions disappear. |  |
| `styles` | Style the interface | Add its own look. | it can no longer restyle the app. |  |
| `storage` | Save its own data | Keep settings and data on this device. | it cannot save anything. |  |
| `notifications` | Show notifications | Alert you inside the app. | no more notifications from it. |  |
| `network` | Use the network | Connect to the internet. | no internet access for it. | ⚠️ sensitive |
| `filesystem.read` | Read files | Open files on your computer. | it cannot read your files. | ⚠️ sensitive |
| `filesystem.write` | Write files | Create or change files on your computer. | it cannot change your files. | ⚠️ sensitive needs `filesystem.read` |
| `database` | Use the database | Read and write the app's data. | no access to the app's data. | ⚠️ sensitive |
| `window` | Control windows | Open, move or resize windows. | it cannot manage windows. | ⚠️ sensitive |
| `clipboard` | Use the clipboard | Copy and paste for you. | no clipboard access. | ⚠️ sensitive |
| `camera` | Use the camera | Take pictures and record video. | it cannot use the camera. | ⚠️ sensitive |
| `shortcuts` | Global keyboard shortcuts | React to key combinations even when the app is in the background. | its global shortcuts stop working. | ⚠️ sensitive |
| `shell` | Run system commands | Launch programs on your computer. | it cannot launch programs. | ⚠️ sensitive |

## Custom permissions

Hosts can define their own with the `x.` prefix (`x.billing`, `x.export`) and check them with `ctx.permissions.assert("x.billing")`.

## Locked permissions

A permission can be **locked** so it cannot be revoked: protected by the system, listed in `requiredPermissions`, used by an enabled feature, or needed by another permission. The plugin page shows the reason. See [Managing plugins](/plugin-management).

## Per-plugin file access

`filesystem.read` and `filesystem.write` do not give raw paths. Plugins get **file references** from native dialogs, usable only by the plugin they were granted to. See [FluxAPI](/desktop-api).
