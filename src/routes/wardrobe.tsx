import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { UploadModal } from "@/components/UploadModal";
import { useApp } from "@/lib/app-context";
import { fetchMeasurements, fitLabelKey } from "@/lib/measurements";
import {
  addWardrobeItem,
  deleteWardrobeItem,
  fetchWardrobe,
  itemName,
  OCCASIONS,
  SEASONS,
  TILE_COLORS,
  type NewItem,
} from "@/lib/wardrobe";

export const Route = createFileRoute("/wardrobe")({
  head: () => ({
    meta: [
      { title: "Smart Wardrobe — AuraStyle AI" },
      {
        name: "description",
        content:
          "Every family member's closet in one place: filter by season and occasion, add new pieces with fabric care notes, and keep track of what everyone owns.",
      },
      { property: "og:title", content: "Smart Wardrobe — AuraStyle AI" },
      {
        property: "og:description",
        content: "Filter by season and occasion, add items with fabric care notes, and keep every closet tidy.",
      },
    ],
  }),
  component: Wardrobe,
});

function Wardrobe() {
  const { t, lang, profile, profileName } = useApp();
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
  const fitKey = fitLabelKey(fit?.preferred_fit ?? "regular");

  const add = useMutation({
    mutationFn: (item: NewItem) => addWardrobeItem(item),
    onSuccess: (_data, item) => {
      void qc.invalidateQueries({ queryKey: ["wardrobe", item.profile] });
      toast.success(t("added"));
    },
    onError: () => toast.error("Something went wrong, let's try again."),
  });

  const remove = useMutation({
    mutationFn: ({ id, path }: { id: string; path?: string }) => deleteWardrobeItem(id, path),

    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["wardrobe", profile] });
      toast.success(t("deleted"));
    },
  });

  const filtered = items.filter(
    (i) => (season === "all" || i.season === season) && (occasion === "all" || i.occasion === occasion),
  );

  return (
    <div className="px-4 py-4">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <div className="min-w-0">
          <h1 className="truncate font-display text-2xl font-semibold">{t("wardrobeTitle")}</h1>
          <p className="truncate text-sm text-muted-foreground">
            {profileName()} · {filtered.length} {t("itemsCount")}
          </p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="shrink-0 rounded-full bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-warm"
        >
          + {t("addItem")}
        </button>
      </div>

      <p className="mt-3 text-xs text-muted-foreground">{t("wardrobeSub")}</p>

      <FilterRow
        label={t("filterSeason")}
        options={["all", ...SEASONS]}
        value={season}
        onChange={setSeason}
        t={t}
      />
      <FilterRow
        label={t("filterOccasion")}
        options={["all", ...OCCASIONS]}
        value={occasion}
        onChange={setOccasion}
        t={t}
      />

      {isLoading ? (
        <p className="py-10 text-center text-sm text-muted-foreground">{t("loading")}</p>
      ) : filtered.length === 0 ? (
        <p className="mt-6 rounded-3xl border border-dashed border-border bg-card p-6 text-center text-sm text-muted-foreground">
          {t("emptyFiltered")}
        </p>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-3">
          {filtered.map((item) => (
            <article key={item.id} className="overflow-hidden rounded-3xl border border-border bg-card shadow-warm">
              {item.photo_url ? (
                <img
                  src={item.photo_url}
                  alt={itemName(item, lang)}
                  loading="lazy"
                  className="h-28 w-full object-cover"
                />
              ) : (
                <div
                  className={`grid h-28 place-items-center bg-linear-to-br ${TILE_COLORS[item.color] ?? TILE_COLORS['sand']} text-5xl`}
                >
                  {item.icon}
                </div>
              )}

              <div className="p-3">
                <h3 className="text-sm leading-snug font-semibold">{itemName(item, lang)}</h3>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-secondary-foreground">
                    {t(item.season)}
                  </span>
                  <span className="rounded-full bg-accent/25 px-2 py-0.5 text-[10px] font-medium text-accent-foreground">
                    {t(item.occasion)}
                  </span>
                </div>
                <p className="mt-1.5 text-[11px] leading-relaxed text-primary">
                  <span className="font-semibold">{t("suggestedFitFor")} {profileName()}: </span>
                  {t(fitKey)}
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
                  onClick={() => remove.mutate({ id: item.id, ...(item.image_url ? { path: item.image_url } : {}) })}
                  className="mt-2.5 w-full rounded-xl border border-destructive/30 px-2 py-1.5 text-[11px] font-medium text-destructive"
                >
                  🗑 {t("delete")}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      <UploadModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={async (item) => {
          await add.mutateAsync(item);
        }}
      />
    </div>
  );
}

function FilterRow({
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
    <div className="mt-3">
      <p className="mb-1.5 text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">{label}</p>
      <div className="flex gap-1.5 overflow-x-auto pb-1">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => onChange(o)}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
              value === o ? "border-primary bg-primary/12 text-primary" : "border-border bg-card text-muted-foreground"
            }`}
          >
            {o === "all" ? t("all") : t(o)}
          </button>
        ))}
      </div>
    </div>
  );
}
