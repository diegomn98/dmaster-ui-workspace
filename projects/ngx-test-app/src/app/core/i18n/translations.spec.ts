import { EN } from './translations.en';
import { ES } from './translations.es';
import { FR } from './translations.fr';
import { DashboardTranslations } from './translations.types';

/**
 * Some dictionary sections are rendered with `{{ }}` (plain text), not `[innerHTML]`:
 * the blog (index + article pages), the roadmap and the API tables (`pages.*.api`).
 * Markup written there shows up literally in production — the v0.9/v0.10 blog leads
 * shipped `<code>…</code>` as visible text. A lone placeholder such as `<name>` or
 * `<svg>` is fine (it reads as the element name, on purpose); paired tags, `<code>`,
 * `<br>` and HTML entities are not.
 */
const LEAKED_MARKUP = /<code\b|<br\b|<\/[a-z][\w-]*>|&(?:[a-z]+|#\d+);/i;

function textBoundStrings(dict: DashboardTranslations): [string, string][] {
  const out: [string, string][] = [];
  const walk = (node: unknown, path: string): void => {
    if (typeof node === 'string') out.push([path, node]);
    else if (node && typeof node === 'object') {
      for (const [key, value] of Object.entries(node)) walk(value, `${path}.${key}`);
    }
  };
  walk(dict.blog, 'blog');
  walk(dict.roadmap, 'roadmap');
  for (const [page, value] of Object.entries(dict.pages)) {
    const api = (value as { api?: unknown }).api;
    if (api) walk(api, `pages.${page}.api`);
  }
  return out;
}

describe('dictionaries: text-bound strings carry no markup', () => {
  for (const [lang, dict] of [
    ['en', EN],
    ['es', ES],
    ['fr', FR],
  ] as const) {
    it(`${lang}: blog, roadmap and API descriptions are plain text`, () => {
      const strings = textBoundStrings(dict);
      expect(strings.length).toBeGreaterThan(100);
      const leaked = strings.filter(([, text]) => LEAKED_MARKUP.test(text)).map(([path]) => path);
      expect(leaked).toEqual([]);
    });
  }
});
