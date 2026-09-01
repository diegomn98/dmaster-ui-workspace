# ngx-dmaster — @dmaster/ui workspace

[![CI](https://img.shields.io/github/actions/workflow/status/diegomn98/dmaster-ui-workspace/ci.yml?branch=main&style=flat-square&label=CI)](https://github.com/diegomn98/dmaster-ui-workspace/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@dmaster/ui?color=006FEE&style=flat-square)](https://www.npmjs.com/package/@dmaster/ui)
[![WCAG 2.1 AA](https://img.shields.io/badge/a11y-WCAG_2.1_AA-0F6E56?style=flat-square)](projects/ngx-dmaster-ui/README.md#accessibility)
[![license](https://img.shields.io/badge/license-MIT-7EE7FC?style=flat-square)](LICENSE)

Angular workspace for **[@dmaster/ui](https://www.npmjs.com/package/@dmaster/ui)**, a modern, signals-based, zoneless-ready Angular component library — **45 components**, `input()`/`model()` throughout, no NgModules — and its living documentation site, **[dmasterui.com](https://dmasterui.com)**.

**Contributing:** see [CONTRIBUTING.md](CONTRIBUTING.md) · [Code of Conduct](CODE_OF_CONDUCT.md) · [Security policy](SECURITY.md).

## Quality gates

Every pull request has to clear four parallel CI jobs before it can merge — the bar is verified on CI, not asserted in a badge:

- **Build · test · lint · publint** — the library builds via ng-packagr, Vitest runs the unit suite, ESLint + Stylelint enforce the conventions, and [publint](https://publint.dev) validates the packaged output.
- **Consumer integration** — the built library is packed with `npm pack` and installed into an isolated Angular app (`examples/starter`) that builds against the **tarball**, catching packaging / exports / peer-dep / type-resolution breakage the monorepo (which resolves `@dmaster/ui` to source) never sees.
- **Accessibility** — [axe-core](https://github.com/dequelabs/axe-core) (WCAG 2.1 A + AA) scans every prerendered route in **light and dark**, plus every opened overlay. Zero violations required.
- **Visual regression** — every route is screenshotted in both themes and pixel-diffed against committed baselines, inside a **pinned Playwright container** so rendering is deterministic.

The docs site is fully statically prerendered on every build (a permanent SSR-safety smoke test), and releases publish to npm with **signed provenance** (Sigstore). Full detail in [Testing](#testing).

| Project        | Path                                                 | What it is                                                                                                                                                                  |
| -------------- | ---------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@dmaster/ui`  | [`projects/ngx-dmaster-ui`](projects/ngx-dmaster-ui) | The component library (published to npm from `dist/dmaster-ui`). See its [README](projects/ngx-dmaster-ui/README.md) and [CHANGELOG](projects/ngx-dmaster-ui/CHANGELOG.md). |
| `ngx-test-app` | `projects/ngx-test-app`                              | The docs dashboard: live playgrounds, API tables and a11y notes for every component, in English/Spanish/French. Deployed to Cloudflare (statically prerendered).            |

## Requirements

- Node `^20.19 || ^22.12 || >=24` (CI and Cloudflare use Node 24 — see `.node-version`)
- npm ≥ 10

## Development

```bash
npm ci               # install (lockfile-exact)
npm start            # serve the docs app at http://localhost:4200
```

## Scripts

| Script                                    | What it does                                                                                                                                          |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run build`                           | Build the library: ng-packagr → `dist/dmaster-ui`, plus precompiled CSS (`styles/dmaster-ui.css`) and the `ng add` schematics                         |
| `npm run build:app`                       | Build the docs app with full static prerender (`dist/ngx-test-app/browser`)                                                                           |
| `npm test` / `npm run test:app`           | Vitest unit tests (library / app)                                                                                                                     |
| `npm run test:coverage`                   | Library tests with coverage report                                                                                                                    |
| `npm run lint` / `npm run lint:styles`    | ESLint / Stylelint                                                                                                                                    |
| `npm run format` / `npm run format:check` | Prettier                                                                                                                                              |
| `npm run size`                            | Per-component tree-shaken bundle-size audit (requires `npm run build` first)                                                                          |
| `npm run verify:package`                  | Build + pack the library and build [`examples/starter`](examples/starter) against the tarball — validates the package as a real consumer would see it |
| `npm run test:a11y`                       | axe-core (WCAG 2.1 A + AA) over every prerendered route in light + dark, plus overlays (needs `npm run build:app` first)                              |
| `npm run test:visual`                     | Screenshot every route in both themes and pixel-diff against baselines (run inside the Playwright container — see below)                              |
| `npm run release:check`                   | Everything CI runs, locally                                                                                                                           |

## Testing

Unit tests run on **Vitest** through the `@angular/build:unit-test` builder (no Karma). The docs app uses `provideZonelessChangeDetection()`; the library never depends on zone.js.

**Accessibility gate.** `npm run test:a11y` runs [axe-core](https://github.com/dequelabs/axe-core) (WCAG 2.1 A + AA) against the prerendered docs build — every component and variant, in **light and dark**, plus every overlay opened. CI runs it on every PR (`a11y` job). See the [library README](projects/ngx-dmaster-ui/README.md#accessibility).

**Visual regression.** `npm run test:visual` screenshots every route in both themes and pixel-diffs against committed baselines. Because rendering (fonts, anti-aliasing) is environment-specific, baselines are both generated **and** compared **inside the official Playwright container** — never on your host — so the `visual` CI job is deterministic. Until the first baselines land, the `visual` job passes with a notice; it becomes a hard gate the moment they exist.

To create or refresh baselines after an intentional UI change, **the easy way** is one click: run the **“Update visual baselines”** workflow from the repo’s **Actions** tab (`.github/workflows/visual-baselines.yml`). It regenerates every route’s light + dark baseline in the container and commits them back automatically.

Or do it locally with the same image:

```bash
docker run --rm -v "$PWD:/work" -w /work mcr.microsoft.com/playwright:v1.62.1-noble \
  bash -c "npm ci && npm run build:app && npm run test:visual:update"
```

Then commit the updated `*-linux.png` files under `e2e/`. Only the container's Linux baselines are versioned; per-platform snapshots from a local `macOS`/`Windows` run are git-ignored.

**Consumer check.** [`examples/starter`](examples/starter) is a standalone, zoneless Angular app that lives outside the workspace and installs `@dmaster/ui` like any external project. `npm run verify:package` packs the freshly built library and builds the starter against that tarball, so packaging/exports/peer-dep/type-resolution regressions surface here — inside the monorepo, `@dmaster/ui` resolves to source and never exercises the real package. The same app is the [StackBlitz starter](https://stackblitz.com/github/diegomn98/dmaster-ui-workspace/tree/main/examples/starter) linked from the library README, and CI runs the check on every PR.

## Releasing

1. Bump `version` in `projects/ngx-dmaster-ui/package.json` and update the [CHANGELOG](projects/ngx-dmaster-ui/CHANGELOG.md). The docs-site version badge derives from this `package.json` at build time — there is nothing else to bump by hand.
2. Tag `vX.Y.Z` and push the tag. The library `package.json` `repository.url` must point at **this workspace repo** — npm's `--provenance` check rejects a mismatch against the build's attestation.
3. The [Release workflow](.github/workflows/release.yml) verifies the tag matches the package version, runs the full check suite, validates the package with publint, publishes to npm with **signed provenance**, and creates the GitHub Release.

## License

[MIT](LICENSE) © Diego Maestro Navarro
