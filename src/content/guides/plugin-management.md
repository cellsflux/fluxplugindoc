---
title: Managing plugins
description: System plugins, permissions, features, capabilities, dependencies, updates and licenses.
group: Guides
order: 2
---

The plugin manager is the screen where users install, update, configure and remove plugins — and where the rules below are applied. Every rule is enforced **in the main process**, so hiding a button is never the only protection.

## System plugins

A system plugin cannot be disabled or uninstalled, and its required permissions cannot be turned off.

![A system plugin page: no uninstall, no disable switch, and a locked permission that explains why](/img/system-plugin.png)

```ts
new MainFramework({
  systemPlugins: ["com.fluxplugin.appearance", "com.fluxplugin.language"],
  // or: systemKeys: ["<base64 ed25519 public key>"]   — plugins signed by your key
});
```

```json
{ "id": "com.fluxplugin.language", "isSystem": true, "requiredPermissions": ["ui"], "provides": ["language"] }
```

> [!WARNING]
> `isSystem` in a manifest is only a **claim**. A plugin is trusted as a system plugin only if the host lists its id (or it is signed by a key the host trusts) **and** it claims it. A plugin downloaded from a store can never promote itself.

## Permissions

Each permission is granted per plugin, checked on every call, and shown to the user with a plain-language title, what it allows and what happens when it is off. A permission **cannot be revoked** while it is:

| Lock | Why |
| --- | --- |
| `system` | protected: the plugin cannot work without it |
| `required` | listed in `requiredPermissions` — disable the plugin instead |
| `feature` | used by an enabled feature (the UI says which one) |
| `permission` | needed by another granted permission (e.g. `filesystem.write` needs `filesystem.read`) |

```json
{
  "permissions": ["network", "filesystem.read"],
  "features": [
    { "id": "sync", "title": "Cloud sync", "requires": ["network"] },
    { "id": "export", "title": "Export", "requires": ["filesystem.write"], "default": false }
  ]
}
```

Turn the `sync` feature off and `network` can be revoked. Turning a feature on requires its permissions. Contributions can be gated: `{ point: "settings", feature: "sync", contribution: … }`.

## Similar plugins (capabilities)

Two plugins can offer the same thing — say, a language switcher. They are not interchangeable, so exactly **one owns each capability**:

```json
{ "provides": ["language"] }
```
```ts
extensions: [{ point: "i18n", capability: "language", contribution: { … } }]   // active only for the owner
```

The user picks the owner on the plugin's page. Default: the user's choice, else a system provider, else the first enabled one. Declare incompatible plugins with `"conflicts": ["other.plugin"]`.

## Dependencies

```json
{ "dependencies": { "com.acme.core": "^2.0.0" } }
```

When the user clicks **Get**, the server builds a **plan**: transitive dependencies, version ranges (every constraint must hold at once), cycles, declared conflicts, unavailable plugins. Compatible installed dependencies are never reinstalled. The plan is shown in a dialog; everything is then installed as **one transaction** — dependencies first, all downloaded and verified before any file is replaced, and everything restored if one step fails. Shared dependencies are never removed automatically; uninstalling a plugin that others depend on is refused.

## Updates

The store compares the installed plugin with the catalog by **version, per-file hashes, permissions, dependencies and metadata**:

| Result | Meaning |
| --- | --- |
| `update` | newer version → **Update** button; a dialog lists new permissions, dependency changes and the release notes |
| `up-to-date` | same version and same files → nothing offered |
| `inconsistent` | same version but different files → reported, never replaced silently |
| `downgrade` | older version → not offered |

Release notes live in the plugin: `updates/<version>.md`. `fluxplugin notes` (also run by `package`) creates the file from the detected changes; your own text above the `auto` block is never overwritten.

## The catalog

One entry per plugin **id**: the first store in your list is the reference, other versions are kept, and contradicting metadata from two stores is reported rather than merged. The Store screen filters (search, category, free/paid) **before** paging and offers 5, 10, 20 or 50 items per page.

## Free and paid plugins

```json
{ "pricing": { "model": "paid", "amount": 9.99, "currency": "EUR", "purchaseUrl": "https://shop.example/p", "publicKey": "<base64 SPKI>" } }
```

A paid plugin needs a license token signed by the author for that plugin (and not expired). Issue one with `createLicense(privateKey, { plugin, holder, expires })` from `fluxplugin/main`; the user enters it in the install dialog and it is remembered.
