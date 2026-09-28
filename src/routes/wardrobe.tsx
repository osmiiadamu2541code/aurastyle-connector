import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { lazy, memo, Suspense, useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

import { useApp } from "@/lib/app-context";
import type { Lang } from "@/lib/i18n";
import { fetchMeasurements, fitLabelKey } from "@/lib/measurements";
import {
  addWardrobeItems,
  deleteWardrobeItem,
  fetchWardrobe,
  itemName,
  OCCASIONS,
  SEASONS,
  TILE_COLORS,
  type NewItem,
  type WardrobeItem,
} from "@/lib/wardrobe";

const UploadModal = lazy(() => import("@/components/UploadModal").then((m) => ({ default: m.UploadModal })));

export const Route = createFileRoute("/wardrobe")({
  head: () => ({
    meta: [
      { title: "Smart Wardrobe — AuraStyle AI" },
      {
        name: "description",
        content:
          "Every family member's closet in one place: snap photos and let AI fill in each piece, bulk-add from your gallery, and filter by season and occasion.",
      },
      { property: "og:title", content: "Smart Wardrobe — AuraStyle AI" },
      {
        property: "og:description",
        content: "AI auto-detects clothing from photos, bulk upload from your gallery, and keeps every closet tidy.",
      },
    ],
  }),
  component: Wardrobe,
});

function Wardrobe() {
  const { t, tx, lang, profile, profileName } = useApp();
  const qc = useQueryClient();
  const [season, setSeason] = useState<string>("all");
  const [occasion, setOccasion] = useState<string>("all");
  const [modalOpen, setModalOpen] = useState(false);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ["wardrobe", profile],
    queryFn: () => fetchWardrobe(profile),
  });

  const { data: fit } = useQuery({
    queryKey: ["measurements", profile],
    queryFn: () => fetchMeasurements(profile),
  });
  const fitText = t(fitLabelKey(fit?.preferred_fit ?? "regular"));

  const add = useMutation({
    mutationFn: (list: NewItem[]) => addWardrobeItems(list),
    onSuccess: (saved, list) => {
      for (const p of new Set(list.map((i) => i.profile))) void qc.invalidateQueries({ queryKey: ["wardrobe", p] });
      toast.success(saved.length > 1 ? tx("{n} items added with care", { n: saved.length }) : t("added"));
    },
    onError: () => toast.error(t("somethingWrong")),
  });

  const remove = useMutation({
    mutationFn: ({ id, path }: { id: string; path?: string }) => deleteWardrobeItem(id, path),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["wardrobe", profile] });
      toast.success(t("deleted"));
    },
    onError: () => toast.error(t("somethingWrong")),
  });

  const onDelete = useCallback(
    (item: WardrobeItem) => remove.mutate({ id: item.id, ...(item.image_url ? { path: item.image_url } : {}) }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [remove.mutate],
  );

  const filtered = useMemo(
    () => items.filter((i) => (season === "all" || i.season === season) && (occasion === "all" || i.occasion === occasion)),
    [items, season, occasion],
  );

  const closeModal = useCallback(() => setModalOpen(false), []);
  const saveItems = useCallback(async (list: NewItem[]) => { await add.mutateAsync(list); }, [add]);
  const who = profileName();

  return (
    <div className="px-4 py-4">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <div className="min-w-0">
          <h1 className="truncate font-display text-2xl font-semibold">{t("wardrobeTitle")}</h1>
          <p className="truncate text-sm text-muted-foreground">
            {who} · {filtered.length} {t("itemsCount")}
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          onPointerEnter={() => void import("@/components/UploadModal")}
          className="shrink-0 rounded-full bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-warm"
        >
          📷 {t("addItem")}
        </button>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">{t("wardrobeSub")}</p>

      <FilterRow label={t("filterSeason")} options={SEASON_OPTS} value={season} onChange={setSeason} t={t} />
      <FilterRow label={t("filterOccasion")} options={OCCASION_OPTS} value={occasion} onChange={setOccasion} t={t} />

      {isLoading ? (
        <p className="py-10 text-center text-sm text-muted-foreground">{t("loading")}</p>
      ) : filtered.length === 0 ? (
        <p className="mt-6 rounded-3xl border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground">
          {t("emptyFiltered")}
        </p>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-3">
          {filtered.map((item) => (
            <ItemCard key={item.id} item={item} lang={lang} t={t} who={who} fitText={fitText} onDelete={onDelete} />
          ))}
        </div>
      )}

      {modalOpen && (
        <Suspense fallback={null}>
          <UploadModal onClose={closeModal} onSave={saveItems} />
        </Suspense>
      )}
    </div>
  );
}

const SEASON_OPTS = ["all", ...SEASONS] as const;
const OCCASION_OPTS = ["all", ...OCCASIONS] as const;

const ItemCard = memo(function ItemCard({
  item,
  lang,
  t,
  who,
  fitText,
  onDelete,
}: {
  item: WardrobeItem;
  lang: Lang;
  t: (k: string) => string;
  who: string;
  fitText: string;
  onDelete: (item: WardrobeItem) => void;
}) {
  const name = itemName(item, lang);
  return (
    <article className="overflow-hidden rounded-3xl border border-border bg-card shadow-warm [content-visibility:auto] [contain-intrinsic-size:auto_320px]">
      {item.photo_url ? (
        <img src={item.photo_url} alt={name} loading="lazy" decoding="async" className="h-28 w-full object-cover" />
      ) : (
        <div className={`grid h-28 place-items-center bg-linear-to-br ${TILE_COLORS[item.color] ?? TILE_COLORS["sand"]} text-5xl`} aria-hidden>
          {item.icon}
        </div>
      )}

      <div className="p-3">
        <h3 className="text-sm leading-snug font-semibold">{name}</h3>
        <div className="mt-1.5 flex flex-wrap gap-1">
          <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">{t(item.season)}</span>
          <span className="rounded-full bg-accent/25 px-2 py-0.5 text-[10px] font-medium text-accent-foreground">{t(item.occasion)}</span>
        </div>
        <p className="mt-1.5 text-[11px] leading-relaxed text-primary">
          <span className="font-semibold">{t("suggestedFitFor")} {who}: </span>
          {fitText}
        </p>
        {item.fit_note ? (
          <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
            <span className="font-semibold">{t("fitNote")}: </span>
            {item.fit_note}
          </p>
        ) : null}
        {item.fabric_care ? (
          <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
            <span className="font-semibold">{t("care")}: </span>
            {item.fabric_care}
          </p>
        ) : null}
        <button
          onClick={() => onDelete(item)}
          className="mt-2.5 w-full rounded-xl border border-destructive/30 px-2 py-1.5 text-[11px] font-medium text-destructive"
        >
          🗑 {t("delete")}
        </button>
      </div>
    </article>
  );
});

const FilterRow = memo(function FilterRow({
  label,
  options,
  value,
  onChange,
  t,
}: {
  label: string;
  options: readonly string[];
  value: string;
  onChange: (v: string) => void;
  t: (k: string) => string;
}) {
  return (
    <div className="mt-3" role="group" aria-label={label}>
      <p className="mb-1.5 text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">{label}</p>
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => onChange(o)}
            aria-pressed={value === o}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              value === o ? "border-primary bg-primary/12 text-primary" : "border-border bg-card text-muted-foreground"
            }`}
          >
            {t(o)}
          </button>
        ))}
      </div>
    </div>
  );
});
