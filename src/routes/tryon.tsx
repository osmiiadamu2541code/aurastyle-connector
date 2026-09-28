import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { memo, useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

import { useApp } from "@/lib/app-context";
import { deleteImages, generateAndSave, listImages, type SavedImage } from "@/lib/images";
import { fetchMeasurements } from "@/lib/measurements";
import { fetchWardrobe, itemName, type WardrobeItem } from "@/lib/wardrobe";

export const Route = createFileRoute("/tryon")({
  head: () => ({
    meta: [
      { title: "360° Try-On — AuraStyle AI" },
      { name: "description", content: "See outfits from your wardrobe from the front, side and back with AI try-on images." },
      { property: "og:title", content: "360° Virtual Try-On — AuraStyle AI" },
      { property: "og:description", content: "Front, side and back views of your outfits before you get dressed." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: TryOn,
});

const VIEWS = [
  ["front", "Front", "facing the camera straight on"],
  ["side", "Side", "in a full side profile facing right"],
  ["back", "Back", "seen from directly behind"],
] as const;

const PERSON: Record<string, string> = {
  usman: "an Ethiopian man in his thirties",
  wife: "an Ethiopian Muslim woman in her thirties wearing a neatly wrapped hijab",
  mother: "a graceful Ethiopian grandmother in her sixties",
  kids: "a cheerful Ethiopian child around eight years old",
};

function TryOn() {
  const { profile, profileName, tx, lang } = useApp();
  const qc = useQueryClient();
  const { data: items = [] } = useQuery({ queryKey: ["wardrobe", profile], queryFn: () => fetchWardrobe(profile) });
  const { data: fit } = useQuery({ queryKey: ["measurements", profile], queryFn: () => fetchMeasurements(profile) });
  const { data: saved = [] } = useQuery({ queryKey: ["images", profile, "tryon"], queryFn: () => listImages(profile, "tryon") });
  const [picked, setPicked] = useState<string[]>([]);
  const [live, setLive] = useState<Record<string, { url: string; final: boolean }>>({});
  const [busy, setBusy] = useState(false);
  const who = profileName();

  const toggle = useCallback(
    (id: string) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : p.length >= 4 ? p : [...p, id])),
    [],
  );

  async function generate() {
    const chosen = items.filter((i) => picked.includes(i.id));
    if (chosen.length === 0) { toast.error(tx("Pick at least one piece")); return; }
    setBusy(true);
    setLive({});
    const label = chosen.map((c) => c.name).join(" + ");
    const body = fit?.height_cm ? `${fit.height_cm} cm tall, about ${fit.weight_kg} kg, ` : "";
    try {
      for (const [view, , angle] of VIEWS) {
        const prompt = `Full-body fashion catalogue photo of ${PERSON[profile]}, ${body}${angle}, wearing: ${chosen
          .map((c) => `${c.name} in ${c.color} tones`)
          .join(", ")}. Same person, same outfit and same lighting in every view. Plain warm cream studio backdrop, soft light, head to toe visible, modest and respectful, photorealistic.`;
        await generateAndSave({
          profile,
          kind: "tryon",
          view,
          label,
          prompt,
          onFrame: (url, final) => setLive((l) => ({ ...l, [view]: { url, final } })),
        });
      }
      toast.success(tx("Your 360° look is ready"));
      void qc.invalidateQueries({ queryKey: ["images", profile, "tryon"] });
    } catch (e) {
      toast.error(e instanceof Error && e.message.includes("402") ? tx("AI credits have run out.") : tx("Couldn't create the images. Please try again."));
    } finally {
      setBusy(false);
    }
  }

  const sets = useMemo(
    () =>
      Object.values(
        saved.reduce<Record<string, SavedImage[]>>((acc, img) => {
          const key = img.label + img.created_at.slice(0, 15);
          (acc[key] ??= []).push(img);
          return acc;
        }, {}),
      ),
    [saved],
  );

  const removeSet = useCallback(
    async (set: SavedImage[]) => {
      await deleteImages(set);
      void qc.invalidateQueries({ queryKey: ["images", profile, "tryon"] });
    },
    [qc, profile],
  );

  return (
    <div className="space-y-4 px-4 py-4">
      <div>
        <h1 className="font-display text-2xl font-semibold">{tx("360° Try-On")}</h1>
        <p className="text-sm text-muted-foreground">{tx("Pick up to 4 pieces for {who} and see every angle", { who })}</p>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {items.map((i) => (
          <PickTile key={i.id} item={i} name={itemName(i, lang)} selected={picked.includes(i.id)} onToggle={toggle} />
        ))}
      </div>
      <button onClick={generate} disabled={busy || picked.length === 0} className="w-full rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground shadow-warm disabled:opacity-60">
        {busy ? tx("Creating front, side & back…") : `✨ ${tx("Create 360° views")}`}
      </button>
      <p className="text-center text-[11px] text-muted-foreground">{tx("Uses AI credits · pictures are saved privately for {who}", { who })}</p>

      {Object.keys(live).length > 0 && (
        <div className="grid grid-cols-3 gap-2" aria-live="polite">
          {VIEWS.map(([v, label]) => (
            <figure key={v} className="overflow-hidden rounded-2xl bg-muted">
              {live[v] ? <img src={live[v].url} alt={tx(label)} className={`aspect-[2/3] w-full object-cover transition-[filter] ${live[v].final ? "blur-0" : "blur-2xl"}`} /> : <div className="aspect-[2/3]" />}
              <figcaption className="py-1 text-center text-[11px]">{tx(label)}</figcaption>
            </figure>
          ))}
        </div>
      )}

      {sets.length > 0 && <h2 className="pt-2 font-display text-lg font-semibold">{tx("Saved looks")}</h2>}
      {sets.map((set) => (
        <SavedSet key={set[0]!.id} set={set} onDelete={removeSet} />
      ))}
    </div>
  );
}

const PickTile = memo(function PickTile({ item, name, selected, onToggle }: { item: WardrobeItem; name: string; selected: boolean; onToggle: (id: string) => void }) {
  return (
    <button
      onClick={() => onToggle(item.id)}
      aria-pressed={selected}
      className={`rounded-2xl border p-2 text-left ${selected ? "border-primary bg-primary/10" : "border-border bg-card"}`}
    >
      {item.photo_url ? (
        <img src={item.photo_url} alt="" loading="lazy" decoding="async" className="aspect-square w-full rounded-xl object-cover" />
      ) : (
        <span className="block text-2xl" aria-hidden>{item.icon}</span>
      )}
      <span className="mt-1 block truncate text-[11px] font-medium">{name}</span>
    </button>
  );
});

const SavedSet = memo(function SavedSet({ set, onDelete }: { set: SavedImage[]; onDelete: (set: SavedImage[]) => void }) {
  const { t, tx } = useApp();
  return (
    <article className="rounded-3xl border border-border bg-card p-3 shadow-warm [content-visibility:auto] [contain-intrinsic-size:auto_260px]">
      <div className="flex justify-between gap-2">
        <p className="text-xs font-semibold">{set[0]!.label}</p>
        <button onClick={() => onDelete(set)} className="text-xs text-muted-foreground">{t("delete")}</button>
      </div>
      <div className="mt-2 flex snap-x gap-2 overflow-x-auto">
        {VIEWS.map(([v, label]) => {
          const img = set.find((s) => s.view === v);
          return img?.url ? (
            <figure key={v} className="w-1/3 shrink-0 snap-center">
              <img src={img.url} alt={tx(label)} loading="lazy" decoding="async" className="aspect-[2/3] w-full rounded-xl object-cover" />
              <figcaption className="text-center text-[11px]">{tx(label)}</figcaption>
            </figure>
          ) : null;
        })}
      </div>
    </article>
  );
});
