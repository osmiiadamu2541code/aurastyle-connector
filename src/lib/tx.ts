import type { Lang } from "./i18n";
import am from "./tx-am.json";
import om from "./tx-om.json";

/**
 * Phrase-keyed translations for newer screens. Dictionaries are bundled
 * (pre-cached), so switching language is a synchronous lookup — no loading.
 */
const DICTS: Record<Exclude<Lang, "en">, Record<string, string>> = { am, om };

export type Tx = (text: string, vars?: Record<string, string | number>) => string;

const cache = new Map<Lang, Tx>();

export function txFor(lang: Lang): Tx {
  const hit = cache.get(lang);
  if (hit) return hit;
  const dict = lang === "en" ? null : DICTS[lang];
  const fn: Tx = (text, vars) => {
    let out = (dict && dict[text]) || text;
    if (vars) for (const [k, v] of Object.entries(vars)) out = out.split(`{${k}}`).join(String(v));
    return out;
  };
  cache.set(lang, fn);
  return fn;
}
