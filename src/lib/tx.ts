import type { Lang } from "./i18n";

/**
 * Phrase-keyed translations: the English text is the key, so screens stay readable
 * and untranslated phrases fall back to English automatically.
 *
 * Every `tx-<lang>.json` file in this folder is discovered and bundled eagerly
 * (pre-cached), so switching language is a synchronous lookup — no network, no loading.
 */
const modules = import.meta.glob<Record<string, string>>("./tx-*.json", { eager: true, import: "default" });

const DICTS: Partial<Record<Lang, Record<string, string>>> = {};
for (const [path, dict] of Object.entries(modules)) {
  const code = path.match(/tx-([\w-]+)\.json$/)?.[1];
  if (code) DICTS[code as Lang] = dict;
}

export type Tx = (text: string, vars?: Record<string, string | number>) => string;

const cache = new Map<Lang, Tx>();

export function txFor(lang: Lang): Tx {
  const hit = cache.get(lang);
  if (hit) return hit;
  const dict = lang === "en" ? undefined : DICTS[lang];
  const fn: Tx = (text, vars) => {
    let out = dict?.[text] || text;
    if (vars) for (const [k, v] of Object.entries(vars)) out = out.split(`{${k}}`).join(String(v));
    return out;
  };
  cache.set(lang, fn);
  return fn;
}
