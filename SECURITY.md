# Security Policy

## Supported versions

`@dmaster/ui` is pre-1.0 and ships from the latest published minor. Security
fixes land on the most recent release; please upgrade to the latest version
before reporting.

| Version      | Supported          |
| ------------ | ------------------ |
| latest `0.x` | :white_check_mark: |
| older `0.x`  | :x:                |

## Reporting a vulnerability

**Please do not open a public issue for security problems.**

Report privately through GitHub's built-in flow:

1. Go to the repository's **Security** tab →
   [**Report a vulnerability**](https://github.com/diegomn98/dmaster-ui-workspace/security/advisories/new).
2. Describe the issue, the affected version, and a reproduction if you have one.

If you can't use GitHub Security Advisories, email
**diegomaestro192@gmail.com** with the details.

## What to expect

- **Acknowledgement** within 5 business days.
- An assessment and, if confirmed, a fix on a private branch.
- A coordinated release and a GitHub Security Advisory crediting you (unless you
  prefer to stay anonymous).

## Scope

This library ships client-side Angular components with no network or server
code of its own. The most relevant classes of issue are:

- XSS via untrusted input reaching the DOM. The library's **only** use of
  `DomSanitizer.bypassSecurityTrustHtml` is for SVG strings from the icon
  registry (trusted, developer-provided) — never for component inputs. A path
  where a component input reaches `innerHTML` unsanitised is in scope.
- Prototype pollution or ReDoS in the pure utilities.

Denial-of-service through obviously abusive inputs to a UI component (e.g. a
million rows) is generally out of scope.

Thank you for helping keep the project and its users safe.
