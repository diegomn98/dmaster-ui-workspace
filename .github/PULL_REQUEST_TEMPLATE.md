<!-- Thanks for contributing! Keep PRs focused: one logical change each. -->

## What & why

<!-- What does this change and what problem does it solve? Link any related issue: "Closes #123". -->

## Type of change

- [ ] Bug fix
- [ ] New component / feature
- [ ] Accessibility improvement
- [ ] Docs only
- [ ] Refactor / chore

## Checklist

- [ ] `npm run release:check` passes locally (build, tests, lint, format).
- [ ] `npm run test:a11y` is green (0 axe violations, light + dark) if UI changed.
- [ ] Docs are updated **in this PR** where relevant: component README, the docs
      page + `COMPONENT_REGISTRY`, i18n in **all three languages** (en/es/fr),
      `sitemap.xml`, the README "Components" section, and `CHANGELOG.md`
      `[Unreleased]`.
- [ ] New/changed behavior is covered by tests.
- [ ] SCSS uses semantic `--dm-*` tokens (no hard-coded colors); text on a tint
      uses `--dm-{color}-text`.
- [ ] The change is SSR-safe (no `window`/`document`/`localStorage` globals).

## Screenshots / notes

<!-- For visual changes, add before/after screenshots (light + dark if relevant). -->
