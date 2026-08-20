# @dmaster/ui — starter

A minimal, **zoneless** Angular 20 app built with [`@dmaster/ui`](https://www.npmjs.com/package/@dmaster/ui). One small page — an “invite a teammate” form + team list — that wires up nine components, theming, icons and Reactive Forms end to end.

It exists for two reasons:

1. **Try the library in seconds** — open it on StackBlitz, no local setup.
2. **A real starting point** — clone it and start building; every file is production-shaped, not a toy.

## Try it on StackBlitz

[**▶ Open in StackBlitz**](https://stackblitz.com/github/diegomn98/dmaster-ui-workspace/tree/main/examples/starter)

StackBlitz installs `@dmaster/ui` straight from npm and runs the app in the browser.

## Run it locally

```bash
cd examples/starter
npm install
npm start          # → http://localhost:4200
```

## What it shows

- **Setup** — `provideDmasterUI()`, `provideDmasterIcons(DM_ICONS)` and `provideZonelessChangeDetection()` in `src/main.ts`; the theme CSS + CDK overlay styles wired in `angular.json`.
- **Components** — `dm-card`, `dm-form-field` + `dmInput`, `dm-error`, `dm-select`, `dm-button` (with its loading → success state), `dm-avatar`, `dm-badge` and `dm-icon`.
- **Theming** — a light/dark toggle driven by `ThemeService`; every style in the app is a `--dm-*` token, so switching themes needs zero extra work.
- **Forms** — Reactive Forms with per-error `<dm-error>` validation messages.

The whole thing is ~3 files under `src/app`. Start there.
