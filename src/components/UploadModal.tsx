import { useServerFn } from "@tanstack/react-start";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { useApp } from "@/lib/app-context";
import type { ProfileId } from "@/lib/i18n";
import { toSmallDataUrl } from "@/lib/image-resize";
import { COLOR_CHOICES, ICON_CHOICES, OCCASIONS, SEASONS, TILE_COLORS, type NewItem } from "@/lib/wardrobe";
import { analyzeClothingPhoto, type DetectedItem } from "@/lib/wardrobe-ai.functions";

type Props = {
  onClose: () => void;
  onSave: (items: NewItem[]) => Promise<void>;
};

const MAX_PHOTO_BYTES = 10 * 1024 * 1024;
const MAX_BULK = 20;

const CATEGORIES: { id: string; icon: string; label: string }[] = [
  { id: "shirt", icon: "👔", label: "Shirt" },
  { id: "tshirt", icon: "👕", label: "T-shirt" },
  { id: "dress", icon: "👗", label: "Dress" },
  { id: "blouse", icon: "👚", label: "Blouse" },
  { id: "jacket", icon: "🧥", label: "Jacket" },
  { id: "trousers", icon: "👖", label: "Trousers" },
  { id: "shorts", icon: "🩳", label: "Shorts" },
  { id: "scarf", icon: "🧣", label: "Scarf" },
  { id: "hijab", icon: "🧕", label: "Hijab" },
  { id: "shoes", icon: "👞", label: "Shoes" },
  { id: "sneakers", icon: "👟", label: "Sneakers" },
  { id: "heels", icon: "👠", label: "Heels" },
  { id: "cap", icon: "🧢", label: "Cap" },
  { id: "hat", icon: "👒", label: "Hat" },
  { id: "knitwear", icon: "🧶", label: "Knitwear" },
  { id: "traditional", icon: "🥼", label: "Traditional wear" },
];
const iconFor = (category: string) => CATEGORIES.find((c) => c.id === category)?.icon ?? ICON_CHOICES[0]!;

type Draft = {
  name: string; name_am: string; name_om: string; category: string; icon: string; color: string;
  season: string; occasion: string; fabric_care: string; fit_note: string;
};

type Entry = {
  key: string; file: File; preview: string; selected: boolean;
  status: "analyzing" | "ready" | "error"; draft: Draft;
};

const emptyDraft = (): Draft => ({
  name: "", name_am: "", name_om: "", category: "shirt", icon: ICON_CHOICES[0]!, color: COLOR_CHOICES[0]!,
  season: "allseason", occasion: "casual", fabric_care: "", fit_note: "",
});

function fromDetected(d: DetectedItem): Draft {
  return {
    name: d.name, name_am: d.name_am, name_om: d.name_om, category: d.category, icon: iconFor(d.category),
    color: d.color, season: d.season, occasion: d.occasion, fabric_care: d.fabric_care, fit_note: d.fit_note,
  };
}

export function UploadModal({ onClose, onSave }: Props) {
  const { t, tx, lang, profile, profileName } = useApp();
  const analyze = useServerFn(analyzeClothingPhoto);
  const [manual, setManual] = useState<Draft>(emptyDraft);
  const [showManual, setShowManual] = useState(false);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [saving, setSaving] = useState(false);
  const [askWhose, setAskWhose] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const entriesRef = useRef(entries);
  entriesRef.current = entries;

  useEffect(() => () => entriesRef.current.forEach((e) => URL.revokeObjectURL(e.preview)), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape" && !saving) onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, saving]);

  const patch = useCallback((key: string, p: Partial<Entry>) =>
    setEntries((list) => list.map((e) => (e.key === key ? { ...e, ...p } : e))), []);
  const patchDraft = useCallback((key: string, d: Partial<Draft>) =>
    setEntries((list) => list.map((e) => (e.key === key ? { ...e, draft: { ...e.draft, ...d } } : e))), []);
  const toggle = useCallback((key: string) =>
    setEntries((list) => list.map((e) => (e.key === key ? { ...e, selected: !e.selected } : e))), []);

  const runAnalysis = useCallback(async (list: Entry[]) => {
    // Two at a time keeps the phone responsive and avoids rate limits.
    const queue = [...list];
    let creditsWarned = false;
    const worker = async () => {
      for (let e = queue.shift(); e; e = queue.shift()) {
        try {
          const image = await toSmallDataUrl(e.file);
          const d = await analyze({ data: { image, profile, lang } });
          patch(e.key, { status: "ready", draft: fromDetected(d) });
        } catch (err) {
          const msg = err instanceof Error ? err.message : "";
          if (msg.includes("402") && !creditsWarned) { creditsWarned = true; toast.error(tx("AI credits have run out.")); }
          patch(e.key, { status: "error" });
        }
      }
    };
    await Promise.all([worker(), worker()]);
  }, [analyze, lang, patch, profile, tx]);

  const retry = useCallback((key: string) => {
    const hit = entriesRef.current.find((e) => e.key === key);
    if (!hit) return;
    patch(key, { status: "analyzing" });
    void runAnalysis([hit]);
  }, [patch, runAnalysis]);

  const onPickFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).filter((f) => f.type.startsWith("image/") || f.type === "");
    e.target.value = "";
    if (files.length === 0) return;
    const ok = files.filter((f) => f.size <= MAX_PHOTO_BYTES);
    if (ok.length < files.length) toast.error(t("photoTooBig"));
    const room = MAX_BULK - entries.length;
    if (ok.length > room) toast(tx("Up to {n} photos at a time.", { n: MAX_BULK }));
    const added: Entry[] = ok.slice(0, Math.max(0, room)).map((file) => ({
      key: crypto.randomUUID(),
      file,
      preview: URL.createObjectURL(file),
      selected: true,
      status: "analyzing",
      draft: emptyDraft(),
    }));
    setEntries((l) => [...l, ...added]);
    void runAnalysis(added);
  };

  const removeEntry = useCallback((key: string) =>
    setEntries((l) => {
      const hit = l.find((x) => x.key === key);
      if (hit) URL.revokeObjectURL(hit.preview);
      return l.filter((x) => x.key !== key);
    }), []);

  const chosen = entries.filter((e) => e.selected);
  const allSelected = entries.length > 0 && chosen.length === entries.length;
  const analyzing = chosen.some((e) => e.status === "analyzing");
  const usingPhotos = entries.length > 0;

  const commit = async (target: ProfileId) => {
    setSaving(true);
    try {
      const items: NewItem[] = usingPhotos
        ? chosen.map(({ draft: { category: _c, ...d }, file }) => ({
            ...d, name: d.name.trim() || tx("Clothing item"), profile: target, photoFile: file,
          }))
        : [{ ...(({ category: _c, ...d }) => d)(manual), name: manual.name.trim(), profile: target, photoFile: null }];
      await onSave(items);
      onClose();
    } catch {
      setAskWhose(false);
    } finally {
      setSaving(false);
    }
  };

  const canSave = usingPhotos ? chosen.length > 0 && !analyzing : !!manual.name.trim();

  const submit = () => {
    if (!canSave) return;
    if (profile === "usman") { setAskWhose(true); return; }
    void commit(profile);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="upload-title"
      className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 px-0 backdrop-blur-sm sm:items-center sm:px-4"
    >
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto overscroll-contain rounded-t-3xl bg-card p-5 shadow-warm-lg sm:rounded-3xl">
        {askWhose ? (
          <div className="text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary/12 text-2xl" aria-hidden>🤍</div>
            <h2 id="upload-title" className="mt-3 font-display text-xl font-semibold">{t("askWhose")}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t("askWhoseBody")}</p>
            <div className="mt-5 flex flex-col gap-2">
              <button disabled={saving} onClick={() => void commit("wife")} className="rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-warm disabled:opacity-60">{t("forWife")}</button>
              <button disabled={saving} onClick={() => void commit("mother")} className="rounded-2xl bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground disabled:opacity-60">{t("forMother")}</button>
              <button disabled={saving} onClick={() => void commit("usman")} className="rounded-2xl border border-border px-4 py-3 text-sm font-medium disabled:opacity-60">{t("keepMine")}</button>
            </div>
            {saving && <p className="mt-3 text-xs text-muted-foreground" aria-live="polite">{t("saving")}</p>}
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 id="upload-title" className="font-display text-xl font-semibold">{t("newItem")}</h2>
              <button onClick={onClose} className="rounded-full bg-secondary px-3 py-1 text-xs">{t("cancel")}</button>
            </div>

            <div className="mb-4 rounded-2xl bg-primary/8 p-3">
              <p className="text-sm font-semibold">✨ {tx("AI auto-detect")}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {tx("Snap or choose photos — Aura fills in the name, category, season, occasion, care and fit for you. Pick many at once to add them all.")}
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button type="button" onClick={() => cameraRef.current?.click()} className="rounded-2xl bg-primary px-3 py-2.5 text-xs font-semibold text-primary-foreground shadow-warm">📷 {tx("Take photo")}</button>
                <button type="button" onClick={() => fileRef.current?.click()} className="rounded-2xl border border-primary/40 bg-card px-3 py-2.5 text-xs font-semibold text-primary">🖼️ {tx("Choose from gallery (many)")}</button>
              </div>
              <input ref={cameraRef} type="file" accept="image/*" capture="environment" aria-label={tx("Take photo")} onChange={onPickFiles} className="hidden" />
              <input ref={fileRef} type="file" accept="image/*" multiple aria-label={tx("Choose from gallery (many)")} onChange={onPickFiles} className="hidden" />
            </div>

            {usingPhotos ? (
              <>
                <div className="mb-2 flex items-center justify-between gap-2">
                  <p className="text-xs text-muted-foreground" aria-live="polite">
                    {tx("{n} of {total} selected", { n: chosen.length, total: entries.length })}
                  </p>
                  <button
                    type="button"
                    onClick={() => setEntries((l) => l.map((e) => ({ ...e, selected: !allSelected })))}
                    className="rounded-full border border-border px-3 py-1 text-[11px] font-medium"
                  >
                    {allSelected ? tx("Clear selection") : tx("Select all")}
                  </button>
                </div>
                <ul className="space-y-3">
                  {entries.map((e) => (
                    <li key={e.key}>
                      <EntryCard entry={e} onChange={patchDraft} onRemove={removeEntry} onToggle={toggle} onRetry={retry} />
                    </li>
                  ))}
                </ul>
              </>
            ) : showManual ? (
              <ManualForm draft={manual} onChange={(d) => setManual((m) => ({ ...m, ...d }))} />
            ) : (
              <button type="button" onClick={() => setShowManual(true)} className="w-full text-center text-xs font-medium text-muted-foreground underline underline-offset-4">
                {tx("No photo? Add by hand instead")}
              </button>
            )}

            {(usingPhotos || showManual) && (
              <button onClick={submit} disabled={!canSave || saving} className="mt-4 w-full rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-warm disabled:opacity-50">
                {saving
                  ? t("saving")
                  : analyzing
                    ? tx("Aura is looking at your photos…")
                    : chosen.length > 1
                      ? tx("Save {n} items · {who}", { n: chosen.length, who: profileName() })
                      : `${t("save")} · ${profileName()}`}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

const Selects = memo(function Selects({ season, occasion, onChange }: { season: string; occasion: string; onChange: (d: Partial<Draft>) => void }) {
  const { t } = useApp();
  return (
    <div className="grid grid-cols-2 gap-2">
      <select aria-label={t("filterSeason")} value={season} onChange={(e) => onChange({ season: e.target.value })} className="w-full rounded-xl border border-border bg-background px-2 py-2 text-xs">
        {SEASONS.map((s) => <option key={s} value={s}>{t(s)}</option>)}
      </select>
      <select aria-label={t("filterOccasion")} value={occasion} onChange={(e) => onChange({ occasion: e.target.value })} className="w-full rounded-xl border border-border bg-background px-2 py-2 text-xs">
        {OCCASIONS.map((o) => <option key={o} value={o}>{t(o)}</option>)}
      </select>
    </div>
  );
});

type EntryProps = {
  entry: Entry;
  onChange: (key: string, d: Partial<Draft>) => void;
  onRemove: (key: string) => void;
  onToggle: (key: string) => void;
  onRetry: (key: string) => void;
};

const EntryCard = memo(function EntryCard({ entry, onChange, onRemove, onToggle, onRetry }: EntryProps) {
  const { t, tx } = useApp();
  const { draft, status, selected } = entry;
  const set = (d: Partial<Draft>) => onChange(entry.key, d);
  const busy = status === "analyzing";
  return (
    <article className={`rounded-2xl border bg-background p-3 transition-opacity ${selected ? "border-primary/50" : "border-border opacity-60"}`}>
      <div className="flex gap-3">
        <label className="relative shrink-0 cursor-pointer">
          <img src={entry.preview} alt={draft.name || t("photo")} className="h-20 w-20 rounded-xl object-cover" />
          <input
            type="checkbox"
            checked={selected}
            onChange={() => onToggle(entry.key)}
            aria-label={tx("Include this photo")}
            className="absolute top-1.5 left-1.5 h-4 w-4 accent-primary"
          />
        </label>
        <div className="min-w-0 flex-1 space-y-2">
          {busy ? (
            <p className="animate-pulse text-xs font-medium text-primary" aria-live="polite">✨ {tx("Recognising this piece…")}</p>
          ) : status === "error" ? (
            <p className="text-xs text-destructive">
              {tx("Couldn't recognise it — please fill in the name.")}{" "}
              <button type="button" onClick={() => onRetry(entry.key)} className="font-semibold underline">{t("tryAgain")}</button>
            </p>
          ) : (
            <p className="text-[11px] font-medium text-primary">✓ {tx("Filled in by AI — edit anything")}</p>
          )}
          <input
            aria-label={t("name")}
            value={draft.name}
            onChange={(e) => set({ name: e.target.value, name_am: "", name_om: "" })}
            placeholder={t("namePlaceholder")}
            disabled={busy}
            className="w-full rounded-xl border border-border bg-card px-2.5 py-1.5 text-sm outline-none focus:border-primary"
          />
          {!busy && (
            <select
              aria-label={tx("Category")}
              value={draft.category}
              onChange={(e) => set({ category: e.target.value, icon: iconFor(e.target.value) })}
              className="w-full rounded-xl border border-border bg-card px-2 py-1.5 text-xs"
            >
              {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.icon} {tx(c.label)}</option>)}
            </select>
          )}
        </div>
        <button onClick={() => onRemove(entry.key)} aria-label={t("removePhoto")} className="self-start px-1 text-xs text-muted-foreground">✕</button>
      </div>
      {!busy && (
        <div className="mt-2 space-y-2">
          <Selects season={draft.season} occasion={draft.occasion} onChange={set} />
          <textarea aria-label={t("care")} value={draft.fabric_care} onChange={(e) => set({ fabric_care: e.target.value })} placeholder={t("carePlaceholder")} rows={2} className="w-full rounded-xl border border-border bg-card px-2.5 py-1.5 text-xs outline-none focus:border-primary" />
          <input aria-label={t("fitNoteLabel")} value={draft.fit_note} onChange={(e) => set({ fit_note: e.target.value })} placeholder={t("fitNotePlaceholder")} className="w-full rounded-xl border border-border bg-card px-2.5 py-1.5 text-xs outline-none focus:border-primary" />
        </div>
      )}
    </article>
  );
});

function ManualForm({ draft, onChange }: { draft: Draft; onChange: (d: Partial<Draft>) => void }) {
  const { t, tx } = useApp();
  return (
    <>
      <p className="mb-2 text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">{tx("Or add by hand")}</p>
      <p className="mb-1.5 block text-xs font-medium text-muted-foreground">{t("pickIcon")}</p>
      <div className="mb-3 flex flex-wrap gap-1.5">
        {ICON_CHOICES.map((i) => (
          <button key={i} onClick={() => onChange({ icon: i })} aria-pressed={draft.icon === i} className={`grid h-10 w-10 place-items-center rounded-xl border text-lg ${draft.icon === i ? "border-primary bg-primary/12" : "border-border bg-secondary"}`}>{i}</button>
        ))}
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        {COLOR_CHOICES.map((c) => (
          <button key={c} onClick={() => onChange({ color: c })} aria-pressed={draft.color === c} className={`h-8 w-8 rounded-full bg-linear-to-br ${TILE_COLORS[c]} border-2 ${draft.color === c ? "border-primary" : "border-transparent"}`} aria-label={c} />
        ))}
      </div>
      <label className="mb-1 block text-xs font-medium text-muted-foreground">
        {t("name")}
        <input value={draft.name} onChange={(e) => onChange({ name: e.target.value })} placeholder={t("namePlaceholder")} className="mt-1 mb-3 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary" />
      </label>
      <div className="mb-3"><Selects season={draft.season} occasion={draft.occasion} onChange={onChange} /></div>
      <label className="mb-1 block text-xs font-medium text-muted-foreground">
        {t("care")}
        <textarea value={draft.fabric_care} onChange={(e) => onChange({ fabric_care: e.target.value })} placeholder={t("carePlaceholder")} rows={3} className="mt-1 mb-3 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary" />
      </label>
      <label className="mb-1 block text-xs font-medium text-muted-foreground">
        {t("fitNoteLabel")} <span className="text-[10px] opacity-70">({t("optional")})</span>
        <input value={draft.fit_note} onChange={(e) => onChange({ fit_note: e.target.value })} placeholder={t("fitNotePlaceholder")} className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary" />
      </label>
    </>
  );
}
