import { createFileRoute } from "@tanstack/react-router";
import { memo, useEffect, useMemo, useState } from "react";

import { useApp } from "@/lib/app-context";
import {
  BEARD_STYLES,
  COLOR_SAFETY,
  FABRICS,
  FABRIC_TIPS,
  FACE_LABEL,
  FACE_SHAPES,
  FACE_TIPS,
  GROOMING_ROUTINE,
  HAIR_CARE,
  HAIR_COLORS,
  HAIR_CUTS,
  HIJAB_VIDEOS,
  type Fabric,
  type FaceShape,
} from "@/lib/studio-content";

export const Route = createFileRoute("/studio")({
  head: () => ({
    meta: [
      { title: "Style Studio — Hijab tutorials, grooming & hair care" },
      { name: "description", content: "Hijab video tutorials by face shape and fabric, men's beard and hair grooming, and women's hair care and colouring guides." },
      { property: "og:title", content: "Style Studio — AuraStyle AI" },
      { property: "og:description", content: "Hijab tutorials, beard and hair grooming, and hair colouring guides for the whole family." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Studio,
});

type Tab = "hijab" | "grooming" | "hair";

const TABS = [
  ["hijab", "🧕", "Hijab"],
  ["grooming", "🧔", "Grooming"],
  ["hair", "💇‍♀️", "Hair & colour"],
] as const;

const FABRIC_LABEL: Record<Fabric, string> = { chiffon: "Chiffon", jersey: "Jersey", satin: "Satin", cotton: "Cotton" };

function Studio() {
  const { profile, tx } = useApp();
  const [tab, setTab] = useState<Tab>("hijab");
  const [face, setFace] = useState<FaceShape>("oval");
  useEffect(() => {
    setTab(profile === "usman" || profile === "kids" ? "grooming" : profile === "mother" ? "hair" : "hijab");
  }, [profile]);

  return (
    <div className="space-y-4 px-4 py-4">
      <div>
        <h1 className="font-display text-2xl font-semibold">{tx("Style Studio")}</h1>
        <p className="text-sm text-muted-foreground">{tx("Looking after hair, beard and hijab with love")}</p>
      </div>
      <div className="flex gap-1 rounded-full bg-secondary p-1" role="tablist">
        {TABS.map(([id, icon, label]) => (
          <button
            key={id}
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
            className={`flex-1 rounded-full py-2 text-xs font-semibold ${tab === id ? "bg-primary text-primary-foreground shadow-warm" : "text-secondary-foreground"}`}
          >
            <span aria-hidden>{icon}</span> {tx(label)}
          </button>
        ))}
      </div>

      <section className="rounded-3xl border border-border bg-card p-4 shadow-warm">
        <p className="text-[11px] font-semibold tracking-widest text-primary uppercase">{tx("Face shape")}</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {FACE_SHAPES.map((f) => (
            <button
              key={f}
              onClick={() => setFace(f)}
              aria-pressed={face === f}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium ${face === f ? "border-primary bg-primary/12 text-primary" : "border-border"}`}
            >
              {tx(FACE_LABEL[f])}
            </button>
          ))}
        </div>
      </section>

      {tab === "hijab" && <HijabTab face={face} />}
      {tab === "grooming" && <GroomingTab face={face} />}
      {tab === "hair" && <HairTab />}
    </div>
  );
}

const HijabTab = memo(function HijabTab({ face }: { face: FaceShape }) {
  const { tx } = useApp();
  const [fabric, setFabric] = useState<Fabric | "all">("all");
  const videos = useMemo(
    () =>
      HIJAB_VIDEOS.filter(
        (v) =>
          (v.faces.includes(face) || v.faces.includes("all")) &&
          (fabric === "all" || v.fabrics.includes(fabric) || v.fabrics.includes("any")),
      ),
    [face, fabric],
  );
  return (
    <>
      <p className="rounded-2xl bg-accent/20 p-3 text-xs leading-relaxed">💛 {tx(FACE_TIPS[face])}</p>
      <div className="flex flex-wrap gap-2">
        {(["all", ...FABRICS] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFabric(f)}
            aria-pressed={fabric === f}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium ${fabric === f ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"}`}
          >
            {f === "all" ? tx("All fabrics") : tx(FABRIC_LABEL[f])}
          </button>
        ))}
      </div>
      {fabric !== "all" && <p className="text-xs text-muted-foreground">🧵 {tx(FABRIC_TIPS[fabric])}</p>}
      <div className="space-y-4">
        {videos.map((v) => (
          <VideoCard key={v.id} id={v.id} title={tx(v.title)} playLabel={tx("Play {title}", { title: tx(v.title) })} />
        ))}
        {videos.length === 0 && <p className="text-sm text-muted-foreground">{tx("Try another fabric for this face shape.")}</p>}
      </div>
    </>
  );
});

const VideoCard = memo(function VideoCard({ id, title, playLabel }: { id: string; title: string; playLabel: string }) {
  const [play, setPlay] = useState(false);
  return (
    <article className="overflow-hidden rounded-3xl border border-border bg-card shadow-warm [content-visibility:auto] [contain-intrinsic-size:auto_280px]">
      <div className="relative aspect-video bg-muted">
        {play ? (
          <iframe
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
            title={title}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button onClick={() => setPlay(true)} className="absolute inset-0" aria-label={playLabel}>
            <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover" />
            <span className="absolute inset-0 grid place-items-center">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-primary text-xl text-primary-foreground shadow-warm-lg">▶</span>
            </span>
          </button>
        )}
      </div>
      <p className="p-3 text-sm font-semibold">{title}</p>
    </article>
  );
});

const GroomingTab = memo(function GroomingTab({ face }: { face: FaceShape }) {
  const { tx } = useApp();
  return (
    <>
      <section className="rounded-3xl border border-border bg-card p-4 shadow-warm">
        <h2 className="font-display text-lg font-semibold">{tx("Beard styles for your face shape")} · {tx(FACE_LABEL[face])}</h2>
        <div className="mt-3 space-y-3">
          {BEARD_STYLES[face].map((b) => (
            <div key={b.name} className="rounded-2xl bg-secondary/60 p-3">
              <p className="text-sm font-semibold">🧔 {tx(b.name)}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{tx(b.how)}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm font-semibold">💈 {tx("Haircut")}</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{tx(HAIR_CUTS[face])}</p>
      </section>
      <Routine items={GROOMING_ROUTINE} />
    </>
  );
});

const HairTab = memo(function HairTab() {
  const { tx } = useApp();
  return (
    <>
      <Routine items={HAIR_CARE} />
      <section className="rounded-3xl border border-border bg-card p-4 shadow-warm">
        <h2 className="font-display text-lg font-semibold">{tx("Colouring studio")}</h2>
        <div className="mt-3 grid gap-3">
          {HAIR_COLORS.map((c) => (
            <div key={c.name} className="flex gap-3 rounded-2xl bg-secondary/60 p-3">
              <span className="h-12 w-12 shrink-0 rounded-2xl shadow-warm" style={{ background: c.swatch }} aria-hidden />
              <div>
                <p className="text-sm font-semibold">{tx(c.name)}</p>
                <p className="text-xs text-muted-foreground">{tx(c.suits)}</p>
                <p className="mt-1 text-xs">🧴 {tx(c.care)}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[11px] font-semibold tracking-widest text-primary uppercase">{tx("Safety first")}</p>
        <ul className="mt-2 space-y-1.5">
          {COLOR_SAFETY.map((s) => (
            <li key={s} className="text-xs leading-relaxed">🤍 {tx(s)}</li>
          ))}
        </ul>
      </section>
    </>
  );
});

const Routine = memo(function Routine({ items }: { items: { title: string; steps: string[] }[] }) {
  const { tx } = useApp();
  return (
    <section className="space-y-3">
      {items.map((r) => (
        <article key={r.title} className="rounded-3xl border border-border bg-card p-4 shadow-warm">
          <h3 className="font-display text-base font-semibold">{tx(r.title)}</h3>
          <ol className="mt-2 space-y-1.5">
            {r.steps.map((s, i) => (
              <li key={s} className="flex gap-2 text-xs leading-relaxed">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/15 text-[10px] font-bold text-primary">{i + 1}</span>
                {tx(s)}
              </li>
            ))}
          </ol>
        </article>
      ))}
    </section>
  );
});
