# ADR 0001 — Forms strategy: keep CVA for v1.0, add Signal Forms as an additive follow-up

- **Status:** Accepted
- **Date:** 2026-08-19
- **Context version:** Angular 20.3 (library peer range `^20.0.0`)

## Context

Every form control in `@dmaster/ui` — `dm-switch`, `dm-checkbox`, `dm-radio-group`,
`dm-select`, `dm-autocomplete`, `dm-search-field`, `dm-date-picker`,
`dm-color-picker`, `dm-slider`, and `dm-form-field` + `dmInput` — integrates with
Angular forms through **`ControlValueAccessor` (CVA)**. That's the long-standing,
stable bridge that works with template-driven forms **and** Reactive Forms.

Angular is introducing **Signal Forms** (`@angular/forms/signals`, `form()`,
field trees, the `[control]` directive) — a model-first, signals-native forms
system. As of the library's Angular 20 baseline it is **experimental** and not
part of a stable `@angular/forms` surface; it stabilises in a later major.

The open question, driven by the run-up to a v1.0 semver commitment: **does
shipping v1.0 with only CVA risk a breaking change when Signal Forms lands?**

## Decision

**Ship v1.0 on CVA. Do not block v1.0 on Signal Forms. Add Signal Forms support
later as a purely additive feature.**

Rationale:

1. **CVA is not going away.** Angular keeps CVA as a first-class integration
   point; Signal Forms is designed to be _additive_ to the existing forms story,
   not a replacement that deprecates CVA.
2. **CVA controls are forward-compatible with Signal Forms by design.** Signal
   Forms interoperates with existing CVA-implementing controls, so our controls
   are expected to work under Signal Forms with little or no change — the way
   they already work under both template-driven and Reactive Forms today.
3. **Adopting Signal Forms early would be a liability, not an asset.** It is
   experimental (API churn) and would drag the library's peer range forward to a
   newer Angular major, shrinking the addressable audience right when we want
   adoption.
4. **Therefore there is no v1.0 blocker here.** Adding a Signal Forms adapter
   after v1.0 is a _new capability_ (a minor release), not a breaking change to
   the CVA API — provided the CVA input/output surface stays stable, which the
   semver commitment already guarantees.

## Consequences

- **For v1.0:** nothing changes. The forms API is the CVA surface we already ship
  and test. The "Signal Forms decision" is no longer an open blocker.
- **Stability contract:** the CVA surface of every form control (its
  `[(value)]` / `[(checked)]` / value model, `[formControl]` / `formControlName`
  compatibility) is part of the v1.0 semver promise and won't break.
- **Post-1.0 follow-up (tracked, not scheduled):** once Signal Forms is stable,
  (a) add an integration test that binds our controls with `[control]`, and
  (b) if any control needs glue, add it behind a new, additive API. Ship it as a
  minor version with a docs page showing both Reactive Forms and Signal Forms
  side by side.

## Revisit if

- Signal Forms ships in a way that does **not** interoperate with CVA controls
  out of the box (would require earlier, more invasive work).
- The library's minimum Angular peer range moves to the Signal-Forms-stable major
  for other reasons.
