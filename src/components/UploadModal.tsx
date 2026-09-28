import { useServerFn } from "@tanstack/react-start";
import { memo, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { useApp } from "@/lib/app-context";
import type { ProfileId } from "@/lib/i18n";
import { COLOR_CHOICES, ICON_CHOICES, OCCASIONS, SEASONS, TILE_COLORS, type NewItem } from "@/lib/wardrobe";
import { analyzeClothingPhoto, type DetectedItem } from "@/lib/wardrobe-ai.functions";

type Props = {
  open: boolean;
  onClose: () => void;
  onSave: (items: NewItem[]) => Promise<void>;
};

const MAX_PHOTO_BYTES = 10 * 1024 * 1024;
const MAX_BULK = 20;

const CATEGORY_ICON: Record<string, string> = {
  shirt: "👔", tshirt: "👕", dress: "👗", blouse: "👚", jacket: "🧥", trousers: "👖", shorts: "🩳",
  scarf: "🧣", hijab: "🧣", shoes: "👞", sneakers: "👟", heels: "👠", cap: "🧢", hat: "👒", knitwear: "🧶", traditional: "🥼",
};

type Draft = {
  name: string; name_am: string; name_om: string; icon: string; color: string;
  season: string; occasion: string; fabric_care: string; fit_note: string;
};

type Entry = { key: string; file: File; preview: string; status: "analyzing" | "ready" | "error"; draft: Draft };

const emptyDraft = (): Draft => ({
  name: "", name_am: "", name_om: "", icon: ICON_CHOICES[0]!, color: COLOR_CHOICES[0]!,
  season: "allseason", occasion: "casual", fabric_care: "", fit_note: "",
});

/** Shrinks a photo to a small JPEG data URL so the AI check is fast on mobile data. */
async function toSmallDataUrl(file: File, max = 768): Promise<string> {
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bmp.width * scale);
  canvas.height = Math.round(bmp.height * scale);
  canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  bmp.close();
  return canvas.toDataURL("image/jpeg", 0.8);
}

function fromDetected(d: DetectedItem): Draft {
  return {
    name: d.name, name_am: d.name_am, name_om: d.name_om,
    icon: CATEGORY_ICON[d.category] ?? ICON_CHOICES[0]!, color: d.color,
    season: d.season, occasion: d.occasion, fabric_care: d.fabric_care, fit_note: d.fit_note,
  };
}

export function UploadModal({ open, onClose, onSave }: Props) {
  const { t, tx, profile, profileName } = useApp();
  const analyze = useServerFn(analyzeClothingPhoto);
  const [manual, setManual] = useState<Draft>(emptyDraft);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [saving, setSaving] = useState(false);
  const [askWhose, setAskWhose] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const cameraRef = useRef<HTMLInputElement>(null);
  const entriesRef = useRef(entries);
  entriesRef.current = entries;

  useEffect(() => () => entriesRef.current.forEach((e) => URL.revokeObjectURL(e.preview)), []);

  if (!open) return null;

  const patch = (key: string, p: Partial<Entry>) => setEntries((list) => list.map((e) => (e.key === key ? { ...e, ...p } : e)));
  const patchDraft = (key: string, d: Partial<Draft>) =>
    setEntries((list) => list.map((e) => (e.key === key ? { ...e, draft: { ...e.draft, ...d } } : e)));

  const runAnalysis = async (list: Entry[]) => {
    // Two at a time keeps the phone responsive and avoids rate limits.
    const queue = [...list];
    const worker = async () => {
      for (let e = queue.shift(); e; e = queue.shift()) {
        try {
          const image = await toSmallDataUrl(e.file);
          const d = await analyze({ data: { image, profile } });
          patch(e.key, { status: "ready", draft: fromDetected(d) });
        } catch (err) {
          const msg = err instanceof Error ? err.message : "";
          if (msg.includes("402")) toast.error(tx("AI credits have run out."));
          patch(e.key, { status: "error" });
        }
      }
    };
    await Promise.all([worker(), worker()]);
  };

  const onPickFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
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
      status: "analyzing",
      draft: { ...emptyDraft(), name: "" },
    }));
    setEntries((l) => [...l, ...added]);
    void runAnalysis(added);
  };

  const removeEntry = (key: string) =>
    setEntries((l) => {
      const hit = l.find((x) => x.key === key);
      if (hit) URL.revokeObjectURL(hit.preview);
      return l.filter((x) => x.key !== key);
    });

  const reset = () => {
    entries.forEach((e) => URL.revokeObjectURL(e.preview));
    setEntries([]);
    setManual(emptyDraft());
    setAskWhose(false);
    setSaving(false);
  };

  const close = () => { reset(); onClose(); };

  const commit = async (target: ProfileId) => {
    setSaving(true);
    try {
      const items: NewItem[] =
        entries.length > 0
          ? entries.map((e) => ({ ...e.draft, name: e.draft.name.trim() || tx("Clothing item"), profile: target, photoFile: e.file }))
          : [{ ...manual, name: manual.name.trim(), profile: target, photoFile: null }];
      await onSave(items);
      close();
    } finally {
      setSaving(false);
    }
  };

  const analyzing = entries.some((e) => e.status === "analyzing");
  const canSave = entries.length > 0 ? !analyzing : !!manual.name.trim();

  const submit = () => {
    if (!canSave) return;
    if (profile === "usman") { setAskWhose(true); return; }
    void commit(profile);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-foreground/40 px-0 backdrop-blur-sm sm:items-center sm:px-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-card p-5 shadow-warm-lg sm:rounded-3xl">
        {askWhose ? (
          <div className="text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary/12 text-2xl">🤍</div>
            <h2 className="mt-3 font-display text-xl font-semibold">{t("askWhose")}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t("askWhoseBody")}</p>
            <div className="mt-5 flex flex-col gap-2">
              <button disabled={saving} onClick={() => void commit("wife")} className="rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-warm disabled:opacity-60">{t("forWife")}</button>
              <button disabled={saving} onClick={() => void commit("mother")} className="rounded-2xl bg-accent px-4 py-3 text-sm font-semibold text-accent-foreground disabled:opacity-60">{t("forMother")}</button>
              <button disabled={saving} onClick={() => void commit("usman")} className="rounded-2xl border border-border px-4 py-3 text-sm font-medium disabled:opacity-60">{t("keepMine")}</button>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="font-display text-xl font-semibold">{t("newItem")}</h2>
              <button onClick={close} className="rounded-full bg-secondary px-3 py-1 text-xs">{t("cancel")}</button>
            </div>

            <div className="mb-4 rounded-2xl bg-primary/8 p-3">
              <p className="text-sm font-semibold">✨ {tx("AI auto-detect")}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {tx("Snap or choose photos — Aura fills in the name, season, occasion, care and fit for you. Pick many at once to add them all.")}
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                <button type="button" onClick={() => cameraRef.current?.click()} className="rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-warm">📷 {tx("Take photo")}</button>
                <button type="button" onClick={() => fileRef.current?.click()} className="rounded-full border border-primary/40 bg-card px-3 py-1.5 text-xs font-semibold text-primary">🖼️ {tx("Choose from gallery (many)")}</button>
              </div>
              <input ref={cameraRef} type="file" accept="image/*" capture="environment" aria-label={tx("Take photo")} onChange={onPickFiles} className="hidden" />
              <input ref={fileRef} type="file" accept="image/*" multiple aria-label={tx("Choose from gallery (many)")} onChange={onPickFiles} className="hidden" />
            </div>

            {entries.length > 0 ? (
              <div className="space-y-3">
                {entries.map((e) => (
                  <EntryCard key={e.key} entry={e} onChange={patchDraft} onRemove={removeEntry} />
                ))}
              </div>
            ) : (
              <ManualForm draft={manual} onChange={(d) => setManual((m) => ({ ...m, ...d }))} />
            )}

            <button onClick={submit} disabled={!canSave || saving} className="mt-4 w-full rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-warm disabled:opacity-50">
              {saving
                ? t("saving")
                : analyzing
                  ? tx("Aura is looking at your photos…")
                  : entries.length > 1
                    ? tx("Save all {n} · {who}", { n: entries.length, who: profileName() })
                    : `${t("save")} · ${profileName()}`}
            </button>
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

const EntryCard = memo(function EntryCard({ entry, onChange, onRemove }: { entry: Entry; onChange: (key: string, d: Partial<Draft>) => void; onRemove: (key: string) => void }) {
  const { t, tx } = useApp();
  const { draft, status } = entry;
  const set = (d: Partial<Draft>) => onChange(entry.key, d);
  return (
    <article className="rounded-2xl border border-border bg-background p-3">
      <div className="flex gap-3">
        <img src={entry.preview} alt={draft.name || t("photo")} className="h-20 w-20 shrink-0 rounded-xl object-cover" />
        <div className="min-w-0 flex-1 space-y-2">
          {status === "analyzing" ? (
            <p className="animate-pulse text-xs font-medium text-primary">✨ {tx("Recognising this piece…")}</p>
          ) : status === "error" ? (
            <p className="text-xs text-destructive">{tx("Couldn't recognise it — please fill in the name.")}</p>
          ) : (
            <p className="text-[11px] font-medium text-primary">✓ {tx("Filled in by AI — edit anything")}</p>
          )}
          <input value={draft.name} onChange={(e) => set({ name: e.target.value, name_am: "", name_om: "" })} placeholder={t("namePlaceholder")} disabled={status === "analyzing"} className="w-full rounded-xl border border-border bg-card px-2.5 py-1.5 text-sm outline-none focus:border-primary" />
        </div>
        <button onClick={() => onRemove(entry.key)} aria-label={t("removePhoto")} className="self-start text-xs text-muted-foreground">✕</button>
      </div>
      {status !== "analyzing" && (
        <div className="mt-2 space-y-2">
          <Selects season={draft.season} occasion={draft.occasion} onChange={set} />
          <textarea value={draft.fabric_care} onChange={(e) => set({ fabric_care: e.target.value })} placeholder={t("carePlaceholder")} rows={2} className="w-full rounded-xl border border-border bg-card px-2.5 py-1.5 text-xs outline-none focus:border-primary" />
          <input value={draft.fit_note} onChange={(e) => set({ fit_note: e.target.value })} placeholder={t("fitNotePlaceholder")} className="w-full rounded-xl border border-border bg-card px-2.5 py-1.5 text-xs outline-none focus:border-primary" />
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
      <label className="mb-1.5 block text-xs font-medium text-muted-foreground">{t("pickIcon")}</label>
      <div className="mb-3 flex flex-wrap gap-1.5">
        {ICON_CHOICES.map((i) => (
          <button key={i} onClick={() => onChange({ icon: i })} className={`grid h-10 w-10 place-items-center rounded-xl border text-lg ${draft.icon === i ? "border-primary bg-primary/12" : "border-border bg-secondary"}`}>{i}</button>
        ))}
      </div>
      <div className="mb-4 flex flex-wrap gap-2">
        {COLOR_CHOICES.map((c) => (
          <button key={c} onClick={() => onChange({ color: c })} className={`h-8 w-8 rounded-full bg-linear-to-br ${TILE_COLORS[c]} border-2 ${draft.color === c ? "border-primary" : "border-transparent"}`} aria-label={c} />
        ))}
      </div>
      <label className="mb-1 block text-xs font-medium text-muted-foreground">{t("name")}</label>
      <input value={draft.name} onChange={(e) => onChange({ name: e.target.value })} placeholder={t("namePlaceholder")} className="mb-3 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" />
      <div className="mb-3"><Selects season={draft.season} occasion={draft.occasion} onChange={onChange} /></div>
      <label className="mb-1 block text-xs font-medium text-muted-foreground">{t("care")}</label>
      <textarea value={draft.fabric_care} onChange={(e) => onChange({ fabric_care: e.target.value })} placeholder={t("carePlaceholder")} rows={3} className="mb-3 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" />
      <label className="mb-1 block text-xs font-medium text-muted-foreground">{t("fitNoteLabel")} <span className="text-[10px] opacity-70">({t("optional")})</span></label>
      <input value={draft.fit_note} onChange={(e) => onChange({ fit_note: e.target.value })} placeholder={t("fitNotePlaceholder")} className="w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary" />
    </>
  );
}
