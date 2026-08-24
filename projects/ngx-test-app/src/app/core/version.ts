import { version } from '../../../../ngx-dmaster-ui/package.json';

/**
 * Published version of `@dmaster/ui`, shown in the home hero badge.
 *
 * Derived at build time from the library's own `package.json` — the single
 * source of truth for the shipped version. There is nothing to bump by hand
 * here, so the badge can never drift from the actually-published version
 * (which is exactly how it went stale for several releases in a row).
 */
export const LIB_VERSION: string = version;
