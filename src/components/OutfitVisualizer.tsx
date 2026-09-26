import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";

import { useApp } from "@/lib/app-context";
import { itemName, type WardrobeItem } from "@/lib/wardrobe";

type Slot = "outer" | "top" | "bottom" | "shoes" | "accessory";

const SLOTS: Slot[] = ["outer", "top", "bottom", "shoes", "accessory"];

const SLOT_LABEL_KEY: Record<Slot, string> = {
  outer: "layerOuter",
  top: "layerTop",
  bottom: "layerBottom",
  shoes: "layerShoes",
  accessory: "layerAccessory",
};

const SLOT_ICONS: Record<Slot, string[]> = {
  outer: ["🧥", "🧣", "🥼"],
  top: ["👕", "👔", "👗", "👚", "🧶"],
  bottom: ["👖", "🩳"],
  shoes: ["👞", "👟", "👠"],
  accessory: ["🧢", "👒", "🧤"],
};

const SLOT_FALLBACK: Record<Slot, string> = {
  outer: "🧥",
  top: "👕",
  bottom: "👖",
  shoes: "👟",
  accessory: "🧢",
};

/** Warm tile gradients so every layer reads as part of one composition. */
const SLOT_TINT: Record<Slot, string> = {
  outer: "from-clay/45 to-honey/25",
  top: "from-coral/40 to-honey/25",
  bottom: "from-dusk/35 to-sand/45",
  shoes: "from-stone/45 to-sand/40",
  accessory: "from-honey/45 to-cream/50",
};

function slotOf(icon: string): Slot | null {
  for (const s of SLOTS) if (SLOT_ICONS[s].includes(icon)) return s;
  return null;
}

const words = (s: string) =>
  s.toLowerCase().replace(/[^\p{L}\s]/gu, " ").split(/\s+/).filter((w) => w.length > 3);

type Layer = {
  slot: Slot;
  options: { key: string; label: string; photo: string | null; icon: string; fromCloset: boolean }[];
};

export function OutfitVisualizer({
  pieces,
  items,
  avatarUrl,
}: {
  pieces: string[];
  items: WardrobeItem[];
  avatarUrl: string | null;
}) {
  const { t, lang, profile, profileName } = useApp();
  const [index, setIndex] = useState<Record<string, number>>({});
  const [hidden, setHidden] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setIndex({});
    setHidden({});
  }, [profile, pieces.join("|")]);

  const layers = useMemo<Layer[]>(() => {
    const closet = items ?? [];
    const build = (slot: Slot): Layer["options"] => {
      const own = closet
        .filter((i) => slotOf(i.icon) === slot)
        .map((i) => ({
          key: i.id,
          label: itemName(i, lang),
          photo: i.photo_url ?? null,
          icon: i.icon,
          fromCloset: true,
        }));
      // The piece the stylist recommended today, matched against the closet by wording.
      const suggested = pieces
        .map((piece) => {
          const pw = words(piece);
          let best: WardrobeItem | null = null;
          let score = 0;
          for (const i of closet) {
            if (slotOf(i.icon) !== slot) continue;
            const iw = words(`${i.name} ${i.name_am ?? ""} ${i.name_om ?? ""}`);
            const s = iw.filter((w) => pw.includes(w)).length;
            if (s > score) {
              score = s;
              best = i;
            }
          }
          return score > 0 && best
            ? null
            : { piece, hint: pw };
        })
        .filter(Boolean) as { piece: string }[];

      const generic = suggested
        .slice(0, 1)
        .map((s) => ({
          key: `sug-${slot}-${s.piece}`,
          label: s.piece,
          photo: null,
          icon: SLOT_FALLBACK[slot],
          fromCloset: false,
        }));
      return own.length > 0 ? own : generic;
    };

    return SLOTS.map((slot) => ({ slot, options: build(slot) })).filter((l) => l.options.length > 0);
  }, [items, pieces, lang]);

  const pick = (l: Layer) => l.options[(index[l.slot] ?? 0) % l.options.length]!;
  const advance = (l: Layer) =>
    setIndex((prev) => ({ ...prev, [l.slot]: ((prev[l.slot] ?? 0) + 1) % l.options.length }));

  return (
    <section className="rounded-3xl border border-primary/25 bg-linear-to-br from-honey/25 via-cream to-sand/40 p-5 shadow-warm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="font-display text-lg font-semibold">{t("visualizerTitle")}</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">{t("visualizerHint")}</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setIndex({});
            setHidden({});
          }}
          className="shrink-0 rounded-full border border-primary/30 bg-primary/8 px-3 py-1 text-[11px] font-medium text-primary"
        >
          ↺ {t("resetLook")}
        </button>
      </div>

      <div className="mt-4 grid grid-cols-[minmax(0,140px)_minmax(0,1fr)] gap-3">
        {/* Layered figure */}
        <div className="relative overflow-hidden rounded-3xl border border-primary/25 bg-linear-to-b from-cream to-sand/50 p-3">
          <div className="flex flex-col items-center gap-1.5">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={profileName()}
                className="h-16 w-16 rounded-full border-2 border-primary/50 object-cover shadow-warm"
              />
            ) : (
              <span
                aria-label={t("visualizerSilhouette")}
                className="grid h-16 w-16 place-items-center rounded-full border-2 border-dashed border-primary/40 bg-card text-2xl"
              >
                🧍
              </span>
            )}

            <div className="flex w-full flex-col items-center gap-1">
              {layers.map((l) => {
                const opt = pick(l);
                const isHidden = hidden[l.slot];
                const width =
                  l.slot === "accessory" ? "w-12" : l.slot === "shoes" ? "w-16" : l.slot === "bottom" ? "w-20" : "w-full";
                return (
                  <button
                    key={l.slot}
                    type="button"
                    onClick={() => advance(l)}
                    aria-label={`${t(SLOT_LABEL_KEY[l.slot])} — ${t("swapLayer")}`}
                    title={t("tapToSwap")}
                    className={`${width} overflow-hidden rounded-2xl border border-border bg-linear-to-br ${SLOT_TINT[l.slot]} transition-opacity ${
                      isHidden ? "opacity-25" : "opacity-100"
                    } ${l.slot === "shoes" || l.slot === "accessory" ? "h-10" : "h-14"}`}
                  >
                    {opt.photo && !isHidden ? (
                      <img src={opt.photo} alt={opt.label} className="h-full w-full object-cover" />
                    ) : (
                      <span className="grid h-full w-full place-items-center text-xl">{opt.icon}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {!avatarUrl ? (
            <Link
              to="/measurements"
              className="mt-3 flex items-center justify-center rounded-2xl bg-primary px-2 py-2 text-center text-[11px] font-semibold text-primary-foreground shadow-warm"
            >
              📷 {t("visualizerAddPhoto")}
            </Link>
          ) : null}
        </div>

        {/* Layer controls */}
        <div className="min-w-0 space-y-2">
          {!avatarUrl ? (
            <p className="rounded-2xl border border-dashed border-primary/35 bg-primary/8 px-3 py-2 text-[11px] leading-relaxed text-primary">
              {t("visualizerEmpty")}
            </p>
          ) : null}

          {layers.length === 0 ? (
            <p className="rounded-2xl bg-secondary px-3 py-2.5 text-xs text-muted-foreground">{t("noPieceYet")}</p>
          ) : (
            layers.map((l) => {
              const opt = pick(l);
              const isHidden = hidden[l.slot];
              return (
                <div
                  key={l.slot}
                  className="rounded-2xl border border-border bg-card px-3 py-2"
                >
                  <button type="button" onClick={() => advance(l)} className="w-full min-w-0 text-left">
                    <p className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
                      {t(SLOT_LABEL_KEY[l.slot])}
                    </p>
                    <p className="truncate text-sm font-medium text-foreground">
                      {opt.icon} {opt.label}
                    </p>
                    <p className="truncate text-[10px] text-primary">
                      {isHidden ? t("layerHidden") : opt.fromCloset ? t("fromCloset") : t("suggestedPiece")}
                    </p>
                  </button>
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {l.options.length > 1 ? (
                      <button
                        type="button"
                        onClick={() => advance(l)}
                        aria-label={t("swapLayer")}
                        className="rounded-full border border-primary/30 bg-primary/8 px-2.5 py-1 text-[11px] font-medium text-primary"
                      >
                        ⇄ {t("swapLayer")}
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => setHidden((p) => ({ ...p, [l.slot]: !p[l.slot] }))}
                      aria-label={isHidden ? t("showLayer") : t("hideLayer")}
                      className="rounded-full border border-border bg-secondary px-2.5 py-1 text-[11px] font-medium text-secondary-foreground"
                    >
                      {isHidden ? `👁 ${t("showLayer")}` : `🚫 ${t("hideLayer")}`}
                    </button>
                  </div>
                </div>
              );
            })
          )}
          <p className="text-[10px] text-muted-foreground">{t("tapToSwap")}</p>
        </div>
      </div>
    </section>
  );
}
