# Contributing to @dmaster/ui

Thanks for taking the time to contribute! This project is an Angular 20 workspace
with two parts: the publishable library (`projects/ngx-dmaster-ui`, published to
npm as [`@dmaster/ui`](https://www.npmjs.com/package/@dmaster/ui)) and its living
documentation site (`projects/ngx-test-app`, deployed at
[dmasterui.com](https://dmasterui.com)).

Every kind of contribution is welcome — bug reports, docs fixes, new components,
accessibility improvements, or just questions.

## Ground rules

- Be respectful. This project follows a [Code of Conduct](./CODE_OF_CONDUCT.md).
- Open an issue before a large change so we can agree on the approach.
- Keep pull requests focused: one logical change per PR.
- Documentation is part of the change, not a follow-up (see below).

## Getting started

```bash
git clone https://github.com/diegomn98/dmaster-ui-workspace.git
cd dmaster-ui-workspace
npm ci                 # install exactly what the lockfile pins
npm start              # serve the docs app at http://localhost:4200
```

Node is pinned by `.node-version` (24) and the `engines` field. Use the same
major to match CI.

## Project layout

| Path                      | What it is                                                          |
| ------------------------- | ------------------------------------------------------------------- |
| `projects/ngx-dmaster-ui` | The library. Components live under `src/lib/components/<category>`. |
| `projects/ngx-test-app`   | The docs dashboard (playgrounds, API tables, a11y notes, i18n).     |
| `examples/starter`        | A standalone consumer app — the packaging smoke test + StackBlitz.  |
| `e2e/`                    | Playwright: axe-core a11y gate + visual regression.                 |
| `CLAUDE.md`               | The full architecture guide and conventions. **Read it first.**     |

## The checks (run before every push)

```bash
npm run build          # library: ng-packagr + precompiled CSS + schematics
npm run build:app      # docs app: full static prerender (also the SSR smoke test)
npm test               # library unit tests (Vitest)
npm run test:app       # docs app tests
npm run lint           # ESLint (both projects)
npm run lint:styles    # Stylelint
npm run format:check   # Prettier
```

Or `npm run release:check` to run the whole suite the way CI does. On top of
that, CI runs two more gates you can reproduce locally:

- **Accessibility** — `npm run build:app && npm run test:a11y` runs axe-core
  (WCAG 2.1 A + AA) over every prerendered route in **light and dark**, plus
  overlays. It must be green (0 violations).
- **Package integrity** — `npm run verify:package` packs the built library and
  builds `examples/starter` against the tarball, catching exports/peer-dep/type
  regressions a monorepo hides.

## Coding conventions (the short version)

The long version is in [`CLAUDE.md`](./CLAUDE.md); the essentials:

- **Standalone components**, `input()` / `output()` / `model()` / `computed()`
  (never decorators), `ChangeDetectionStrategy.OnPush`, modern control flow
  (`@if` / `@for` / `@switch`).
- **Zoneless**: the library never depends on zone.js.
- **Selectors** are prefixed `dm-`; component classes are `DmXxxComponent`.
- **SCSS** consumes semantic tokens (`var(--dm-…)`) — never hard-coded colors —
  and only imports `@use 'mixins'`. BEM class names; variants as `[data-*]`.
- **Accessibility first**: ARIA on the host, `:focus-visible` rings, ≥44px touch
  targets, `prefers-reduced-motion`. Text on a tinted fill uses the AA
  `--dm-{color}-text` token, never the base color.
- **SSR-safe**: never touch `window` / `document` / `localStorage` as globals;
  use `inject(DOCUMENT)` with optional chaining.

## Adding or changing a component

Follow the "nuevo componente" checklist in `CLAUDE.md`. In short, a component is
never "done" until the docs reflect it in the same PR:

1. The component folder (8 files: `*.component.ts|html|scss|spec.ts`, `*.types.ts`,
   `*.tokens.ts`, `index.ts`, `README.md`) under its category. Use
   `components/primitives/skeleton/` as the template.
2. Export it from `src/public-api.ts`.
3. Tests (default render, each input, host a11y, injectable defaults).
4. A docs page under `pages/components/<name>-page/` with a playground, ~6
   realistic demos including a composition recipe, an API table and a11y notes.
5. Routes, sidebar, `COMPONENT_REGISTRY` (the single source of truth for the
   component count and Overview), the Overview tile, `sitemap.xml`, and i18n in
   **all three languages** (English, Spanish, French — the TypeScript compiler
   fails if a key is missing).
6. `README.md` (lib + root) "Components" section and `CHANGELOG.md`
   `[Unreleased]`.

## Commits & pull requests

- Conventional-commit style is appreciated: `feat(select): …`, `fix(a11y): …`,
  `docs: …`, `test: …`, `chore: …`.
- Fill in the pull-request template. Make sure the checklist passes.
- CI (build, tests, lint, publint, a11y, visual, package integrity) must be
  green before review.

## Reporting bugs & requesting features

Use the [issue templates](https://github.com/diegomn98/dmaster-ui-workspace/issues/new/choose).
A minimal reproduction (a StackBlitz forked from
[`examples/starter`](https://stackblitz.com/github/diegomn98/dmaster-ui-workspace/tree/main/examples/starter))
is the fastest path to a fix.

## License

By contributing, you agree that your contributions are licensed under the
project's [MIT License](./LICENSE).
