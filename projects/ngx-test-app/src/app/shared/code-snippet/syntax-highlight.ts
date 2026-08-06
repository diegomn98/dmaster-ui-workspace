/**
 * Syntax highlight ultra-ligero (regex, cero dependencias).
 *
 * Estrategia: cada token procesado se sustituye por un marcador numérico
 * ‹\uE000N\uE000› cuyo contenido se almacena en una tabla privada por
 * invocación. Así los regex posteriores no pueden re-tokenizar contenido ya
 * envuelto ni corromper el nombre de clase del marcador (antes, la clase
 * "string" dentro del marcador era capturada de nuevo por el regex de
 * keywords, dando símbolos PUA visibles en pantalla).
 */

const escapeHtml = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const MARK = '\uE000';

function makeWrapper(): {
  wrap: (cls: string, html: string) => string;
  finalize: (s: string) => string;
} {
  const store: string[] = [];

  const wrap = (cls: string, html: string): string => {
    const id = store.length;
    store.push(`<span class="tok-${cls}">${html}</span>`);
    return `${MARK}${id}${MARK}`;
  };

  const finalize = (s: string): string =>
    s.replace(new RegExp(`${MARK}(\\d+)${MARK}`, 'g'), (_, id: string) => store[+id]);

  return { wrap, finalize };
}

// ── HTML / Angular template ───────────────────────────────────────────────────

const highlightHtml = (src: string): string => {
  const { wrap, finalize } = makeWrapper();
  let s = escapeHtml(src);

  // Comentarios <!-- ... -->
  s = s.replace(/&lt;!--([\s\S]*?)--&gt;/g, (m) => wrap('comment', m));

  // Tags: <name attrs>, </name>
  s = s.replace(
    /(&lt;\/?)([a-zA-Z][\w-]*)(\s[^&]*?)?(\s?\/?&gt;)/g,
    (_, o: string, name: string, attrs: string | undefined, c: string) => {
      let attrHtml = '';
      if (attrs) {
        // Atributos con valor: key="val"
        attrHtml = attrs.replace(
          /(\s+)([\w:\-@[\]()*.]+)(=)("[^"]*"|'[^']*')/g,
          (_m, ws: string, k: string, eq: string, v: string) =>
            `${ws}${wrap('attr', k)}${wrap('punc', eq)}${wrap('string', v)}`,
        );
        // Atributos booleanos sin valor
        attrHtml = attrHtml.replace(
          /(\s+)([\w:\-@[\]()*.]+)(?=[\s/&])/g,
          (_m, ws: string, k: string) => `${ws}${wrap('attr', k)}`,
        );
      }
      return `${wrap('punc', o)}${wrap('tag', name)}${attrHtml}${wrap('punc', c)}`;
    },
  );

  return finalize(s);
};

// ── TypeScript / JavaScript ───────────────────────────────────────────────────

const TS_KEYWORDS = new Set([
  'import',
  'export',
  'from',
  'const',
  'let',
  'var',
  'function',
  'class',
  'extends',
  'implements',
  'return',
  'if',
  'else',
  'for',
  'while',
  'do',
  'switch',
  'case',
  'break',
  'continue',
  'default',
  'new',
  'this',
  'super',
  'typeof',
  'instanceof',
  'in',
  'of',
  'async',
  'await',
  'try',
  'catch',
  'finally',
  'throw',
  'as',
  'interface',
  'type',
  'enum',
  'namespace',
  'public',
  'private',
  'protected',
  'readonly',
  'static',
  'true',
  'false',
  'null',
  'undefined',
  'void',
  'never',
  'any',
  'unknown',
  'string',
  'number',
  'boolean',
  'yield',
  'declare',
  'abstract',
]);

const highlightTs = (src: string): string => {
  const { wrap, finalize } = makeWrapper();
  let s = escapeHtml(src);

  // Comentarios de bloque /* ... */
  s = s.replace(/\/\*[\s\S]*?\*\//g, (m) => wrap('comment', m));

  // Comentarios de línea // (evita :// de URLs con [^:])
  s = s.replace(
    /(^|[^:])\/\/[^\n]*/gm,
    (_m, pre: string) => `${pre}${wrap('comment', _m.slice(pre.length))}`,
  );

  // Strings: comillas simples, dobles y template literals (backtick).
  // [^`] en clase negada SÍ captura saltos de línea, a diferencia de `.`.
  s = s.replace(/(`[^`]*`|'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")/g, (m) => wrap('string', m));

  // Keywords — los marcadores numéricos \uE000N\uE000 no contienen letras,
  // así que este regex no puede volver a envolver contenido ya procesado.
  s = s.replace(/\b([a-zA-Z_$][\w$]*)\b/g, (m) => (TS_KEYWORDS.has(m) ? wrap('keyword', m) : m));

  return finalize(s);
};

// ── Bash / Shell ──────────────────────────────────────────────────────────────

const highlightBash = (src: string): string => {
  const { wrap, finalize } = makeWrapper();
  let s = escapeHtml(src);

  // Comentarios #
  s = s.replace(/(^|\s)(#[^\n]*)/gm, (_m, pre: string, c: string) => `${pre}${wrap('comment', c)}`);

  // Strings entre comillas
  s = s.replace(/(['"])((?:\\.|(?!\1).)*)\1/g, (m) => wrap('string', m));

  // Flags: --xxx, -x
  s = s.replace(/(\s)(--?[\w-]+)/g, (_m, ws: string, flag: string) => `${ws}${wrap('attr', flag)}`);

  return finalize(s);
};

// ── Punto de entrada ──────────────────────────────────────────────────────────

export const highlight = (code: string, language: string): string => {
  const lang = language.toLowerCase();
  if (lang === 'html' || lang === 'xml' || lang === 'svg' || lang === 'ng-html') {
    return highlightHtml(code);
  }
  if (lang === 'ts' || lang === 'typescript' || lang === 'js' || lang === 'javascript') {
    return highlightTs(code);
  }
  if (lang === 'bash' || lang === 'sh' || lang === 'shell') {
    return highlightBash(code);
  }
  return escapeHtml(code);
};
