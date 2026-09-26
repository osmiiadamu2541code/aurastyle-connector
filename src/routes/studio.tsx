import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

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

function Studio() {
  const { profile } = useApp();
  const [tab, setTab] = useState<Tab>("hijab");
  const [face, setFace] = useState<FaceShape>("oval");
  useEffect(() => {
    setTab(profile === "usman" || profile === "kids" ? "grooming" : profile === "mother" ? "hair" : "hijab");
  }, [profile]);

  return (
    <div className="space-y-4 px-4 py-4">
      <div>
        <h1 className="font-display text-2xl font-semibold">Style Studio</h1>
        <p className="text-sm text-muted-foreground">Looking after hair, beard and hijab with love</p>
      </div>
      <div className="flex gap-1 rounded-full bg-secondary p-1">
        {([
          ["hijab", "🧕 Hijab"],
          ["grooming", "🧔 Grooming"],
          ["hair", "💇‍♀️ Hair & colour"],
        ] as const).map(([id, label]) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex-1 rounded-full py-2 text-xs font-semibold ${tab === id ? "bg-primary text-primary-foreground shadow-warm" : "text-secondary-foreground"}`}
          >
            {label}
          </button>
        ))}
      </div>

      <section className="rounded-3xl border border-border bg-card p-4 shadow-warm">
        <p className="text-[11px] font-semibold tracking-widest text-primary uppercase">Face shape</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {FACE_SHAPES.map((f) => (
            <button
              key={f}
              onClick={() => setFace(f)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium ${face === f ? "border-primary bg-primary/12 text-primary" : "border-border"}`}
            >
              {FACE_LABEL[f]}
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

function HijabTab({ face }: { face: FaceShape }) {
  const [fabric, setFabric] = useState<Fabric | "all">("all");
  const videos = HIJAB_VIDEOS.filter(
    (v) =>
      (v.faces.includes(face) || v.faces.includes("all")) &&
      (fabric === "all" || v.fabrics.includes(fabric) || v.fabrics.includes("any")),
  );
  return (
    <>
      <p className="rounded-2xl bg-accent/20 p-3 text-xs leading-relaxed">💛 {FACE_TIPS[face]}</p>
      <div className="flex flex-wrap gap-2">
        {(["all", ...FABRICS] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFabric(f)}
            className={`rounded-full border px-3 py-1.5 text-xs font-medium capitalize ${fabric === f ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"}`}
          >
            {f === "all" ? "All fabrics" : f}
          </button>
        ))}
      </div>
      {fabric !== "all" && <p className="text-xs text-muted-foreground">🧵 {FABRIC_TIPS[fabric]}</p>}
      <div className="space-y-4">
        {videos.map((v) => (
          <VideoCard key={v.id} id={v.id} title={v.title} />
        ))}
        {videos.length === 0 && <p className="text-sm text-muted-foreground">Try another fabric for this face shape.</p>}
      </div>
    </>
  );
}

function VideoCard({ id, title }: { id: string; title: string }) {
  const [play, setPlay] = useState(false);
  return (
    <article className="overflow-hidden rounded-3xl border border-border bg-card shadow-warm">
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
          <button onClick={() => setPlay(true)} className="absolute inset-0" aria-label={`Play ${title}`}>
            <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" className="h-full w-full object-cover" />
            <span className="absolute inset-0 grid place-items-center">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-primary text-xl text-primary-foreground shadow-warm-lg">▶</span>
            </span>
          </button>
        )}
      </div>
      <p className="p-3 text-sm font-semibold">{title}</p>
    </article>
  );
}

function GroomingTab({ face }: { face: FaceShape }) {
  return (
    <>
      <section className="rounded-3xl border border-border bg-card p-4 shadow-warm">
        <h2 className="font-display text-lg font-semibold">Beard styles for a {FACE_LABEL[face].toLowerCase()} face</h2>
        <div className="mt-3 space-y-3">
          {BEARD_STYLES[face].map((b) => (
            <div key={b.name} className="rounded-2xl bg-secondary/60 p-3">
              <p className="text-sm font-semibold">🧔 {b.name}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{b.how}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm font-semibold">💈 Haircut</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{HAIR_CUTS[face]}</p>
      </section>
      <Routine items={GROOMING_ROUTINE} />
    </>
  );
}

function HairTab() {
  return (
    <>
      <Routine items={HAIR_CARE} />
      <section className="rounded-3xl border border-border bg-card p-4 shadow-warm">
        <h2 className="font-display text-lg font-semibold">Colouring studio</h2>
        <div className="mt-3 grid gap-3">
          {HAIR_COLORS.map((c) => (
            <div key={c.name} className="flex gap-3 rounded-2xl bg-secondary/60 p-3">
              <span className="h-12 w-12 shrink-0 rounded-2xl shadow-warm" style={{ background: c.swatch }} />
              <div>
                <p className="text-sm font-semibold">{c.name}</p>
                <p className="text-xs text-muted-foreground">{c.suits}</p>
                <p className="mt-1 text-xs">🧴 {c.care}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-[11px] font-semibold tracking-widest text-primary uppercase">Safety first</p>
        <ul className="mt-2 space-y-1.5">
          {COLOR_SAFETY.map((s) => (
            <li key={s} className="text-xs leading-relaxed">🤍 {s}</li>
          ))}
        </ul>
      </section>
    </>
  );
}

function Routine({ items }: { items: { title: string; steps: string[] }[] }) {
  return (
    <section className="space-y-3">
      {items.map((r) => (
        <article key={r.title} className="rounded-3xl border border-border bg-card p-4 shadow-warm">
          <h3 className="font-display text-base font-semibold">{r.title}</h3>
          <ol className="mt-2 space-y-1.5">
            {r.steps.map((s, i) => (
              <li key={s} className="flex gap-2 text-xs leading-relaxed">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/15 text-[10px] font-bold text-primary">{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
        </article>
      ))}
    </section>
  );
}
