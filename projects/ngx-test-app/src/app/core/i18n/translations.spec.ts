import { EN } from './translations.en';
import { ES } from './translations.es';
import { FR } from './translations.fr';
import { DashboardTranslations } from './translations.types';

/**
 * Some dictionary sections are rendered with `{{ }}` (plain text), not `[innerHTML]`:
 * the blog (titles, bullets, labels), the roadmap and the API tables (`pages.*.api`).
 * Markup written there shows up literally in production. A lone placeholder such as
 * `<name>` or `<svg>` is fine (it reads as the element name, on purpose); paired tags,
 * `<code>`, `<br>` and HTML entities are not.
 *
 * The exception is the release-article lead (`blog.articles.*.lead`): the blog index
 * cards and the article page bind it with `[innerHTML]` (sanitized), so it may carry
 * inline `<code>`, `<strong>` and `<em>` — and nothing else, since any other `<tag>`
 * would be parsed as an element and vanish. A literal angle bracket there is `&lt;`.
 */
const LEAKED_MARKUP = /<code\b|<br\b|<\/[a-z][\w-]*>|&(?:[a-z]+|#\d+);/i;

/** Inline tags an HTML-bound lead may use. */
const LEAD_TAGS = new Set(['code', 'strong', 'em']);

const isLead = (path: string): boolean => /^blog\.articles\.[^.]+\.lead$/.test(path);

function walkStrings(node: unknown, path: string, out: [string, string][]): void {
  if (typeof node === 'string') out.push([path, node]);
  else if (node && typeof node === 'object') {
    for (const [key, value] of Object.entries(node)) walkStrings(value, `${path}.${key}`, out);
  }
}

function textBoundStrings(dict: DashboardTranslations): [string, string][] {
  const out: [string, string][] = [];
  walkStrings(dict.blog, 'blog', out);
  walkStrings(dict.roadmap, 'roadmap', out);
  for (const [page, value] of Object.entries(dict.pages)) {
    const api = (value as { api?: unknown }).api;
    if (api) walkStrings(api, `pages.${page}.api`, out);
  }
  return out.filter(([path]) => !isLead(path));
}

function leadStrings(dict: DashboardTranslations): [string, string][] {
  const out: [string, string][] = [];
  walkStrings(dict.blog.articles, 'blog.articles', out);
  return out.filter(([path]) => isLead(path));
}

/** Problems in an HTML-bound lead: unknown tags or unbalanced inline tags. */
function leadMarkupProblems(html: string): string[] {
  const problems: string[] = [];
  const stack: string[] = [];
  for (const [, closing, name] of html.matchAll(/<(\/?)([a-z][\w-]*)[^>]*>/gi)) {
    const tag = name.toLowerCase();
    if (!LEAD_TAGS.has(tag)) {
      problems.push(`<${closing}${tag}>`);
    } else if (!closing) {
      stack.push(tag);
    } else if (stack.pop() !== tag) {
      problems.push(`unbalanced </${tag}>`);
    }
  }
  if (stack.length) problems.push(`unclosed <${stack.join('>, <')}>`);
  return problems;
}

describe('dictionaries: markup only where it renders', () => {
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

    it(`${lang}: release leads use balanced inline code/strong/em only`, () => {
      const leads = leadStrings(dict);
      expect(leads.length).toBe(Object.keys(dict.blog.articles).length);
      const bad = leads
        .map(([path, text]) => [path, leadMarkupProblems(text)] as const)
        .filter(([, problems]) => problems.length > 0)
        .map(([path, problems]) => `${path}: ${problems.join(', ')}`);
      expect(bad).toEqual([]);
    });
  }

  it('flags a tag a lead cannot render and an unclosed code', () => {
    expect(leadMarkupProblems('uses <dm-icon> here')).toEqual(['<dm-icon>']);
    expect(leadMarkupProblems('a <code>b')).toEqual(['unclosed <code>']);
    expect(leadMarkupProblems('a <code>b</code> &lt;svg&gt; <em>c</em>')).toEqual([]);
  });
});
