# ngx-dmaster — @dmaster/ui workspace

Angular 20 workspace for **[@dmaster/ui](https://www.npmjs.com/package/@dmaster/ui)**, a premium, signals-based, zoneless-ready Angular component library — **34 components**, `input()`/`model()` throughout, no NgModules — and its living documentation site, **[dmasterui.com](https://dmasterui.com)**.

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

| Script                                    | What it does                                                                                                                  |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `npm run build`                           | Build the library: ng-packagr → `dist/dmaster-ui`, plus precompiled CSS (`styles/dmaster-ui.css`) and the `ng add` schematics |
| `npm run build:app`                       | Build the docs app with full static prerender (`dist/ngx-test-app/browser`)                                                   |
| `npm test` / `npm run test:app`           | Vitest unit tests (library / app)                                                                                             |
| `npm run test:coverage`                   | Library tests with coverage report                                                                                            |
| `npm run lint` / `npm run lint:styles`    | ESLint / Stylelint                                                                                                            |
| `npm run format` / `npm run format:check` | Prettier                                                                                                                      |
| `npm run size`                            | Per-component tree-shaken bundle-size audit (requires `npm run build` first)                                                  |
| `npm run release:check`                   | Everything CI runs, locally                                                                                                   |

## Testing

Unit tests run on **Vitest** through the `@angular/build:unit-test` builder (no Karma). The docs app uses `provideZonelessChangeDetection()`; the library never depends on zone.js.

## Releasing

1. Bump `version` in `projects/ngx-dmaster-ui/package.json` and update the [CHANGELOG](projects/ngx-dmaster-ui/CHANGELOG.md).
2. Tag `vX.Y.Z` and push the tag.
3. The [Release workflow](.github/workflows/release.yml) verifies the tag matches the package version, runs the full check suite, validates the package with publint, publishes to npm and creates the GitHub Release.

## License

[MIT](LICENSE) © Diego Maestro Navarro
