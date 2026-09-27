import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { useApp } from "@/lib/app-context";
import { generateAndSave, listImages } from "@/lib/images";
import { fetchMeasurements } from "@/lib/measurements";

const PHASES = [
  {
    name: "Phase 1 · Foundation",
    share: 0.3,
    weeks: "Weeks 1–8",
    focus: "Build the habit and protect the joints.",
    workouts: ["Brisk walk 30 min, 5×/week", "Wall push-ups 3×12", "Chair squats 3×15", "Glute bridges 3×15", "Dead bug core 3×10"],
    food: "Swap soft drinks for water; half the plate vegetables at lunch and dinner; injera portion the size of your palm.",
  },
  {
    name: "Phase 2 · Burn",
    share: 0.4,
    weeks: "Weeks 9–20",
    focus: "Raise the heart rate and add strength.",
    workouts: ["Interval walk/jog 25 min, 4×/week", "Goblet squats 4×12", "Knee push-ups 4×12", "Reverse lunges 3×10 each leg", "Plank 3×40 s", "Stair climbs 10 min"],
    food: "Protein at every meal (eggs, lentils, shiro, fish, chicken); stop eating 3 hours before sleep.",
  },
  {
    name: "Phase 3 · Sculpt",
    share: 0.3,
    weeks: "Weeks 21–32",
    focus: "Tone, posture and keeping the results.",
    workouts: ["Jog or cycle 35 min, 4×/week", "Full push-ups 4×10", "Bulgarian split squats 3×10", "Mountain climbers 4×30 s", "Superman back raises 3×12", "Side plank 3×30 s each"],
    food: "Keep the portions; one relaxed family meal a week; weigh yourself weekly, same day and time.",
  },
];

function Silhouette({ kg, tint }: { kg: number; tint: string }) {
  const w = 0.55 + (kg - 50) / 80; // wider at higher weight
  return (
    <svg viewBox="0 0 100 200" className="h-40 w-20">
      <circle cx="50" cy="22" r="13" className={tint} />
      <g transform={`translate(50 0) scale(${w} 1) translate(-50 0)`}>
        <path d="M30 42 Q50 36 70 42 L76 100 Q72 118 66 120 L34 120 Q28 118 24 100 Z" className={tint} />
        <rect x="34" y="118" width="13" height="72" rx="6" className={tint} />
        <rect x="53" y="118" width="13" height="72" rx="6" className={tint} />
        <rect x="14" y="46" width="11" height="60" rx="5" className={tint} />
        <rect x="75" y="46" width="11" height="60" rx="5" className={tint} />
      </g>
    </svg>
  );
}

export function WeightGoal() {
  const { profile, profileName } = useApp();
  const qc = useQueryClient();
  const { data: fit } = useQuery({ queryKey: ["measurements", profile], queryFn: () => fetchMeasurements(profile) });
  const { data: previews = [] } = useQuery({ queryKey: ["images", profile, "weight"], queryFn: () => listImages(profile, "weight") });
  const extra = fit as (typeof fit & { target_weight_kg?: number | null }) | null | undefined;
  const [start, setStart] = useState(80);
  const [goal, setGoal] = useState(60);
  const [stage, setStage] = useState(80);
  const [busy, setBusy] = useState(false);
  const [live, setLive] = useState<{ url: string; final: boolean } | null>(null);

  useEffect(() => {
    const s = Number(extra?.weight_kg) || 80;
    const g = Number(extra?.target_weight_kg) || Math.max(45, s - 20);
    setStart(s);
    setGoal(g);
    setStage(s);
  }, [extra?.weight_kg, extra?.target_weight_kg]);

  const lose = Math.max(0, start - goal);
  const lost = Math.max(0, start - stage);
  let acc = 0;
  const phaseIdx = PHASES.findIndex((p) => {
    acc += p.share * lose;
    return lost <= acc + 0.001;
  });
  const phase = PHASES[phaseIdx < 0 ? 2 : phaseIdx];
  const weeks = Math.ceil(lose / 0.6);

  async function saveGoal() {
    const { error } = await supabase.from("profile_measurements").upsert({ profile, weight_kg: start, target_weight_kg: goal }, { onConflict: "user_id,profile" });
    if (error) return toast.error(error.message);
    toast.success("Goal saved");
    qc.invalidateQueries({ queryKey: ["measurements", profile] });
  }

  async function aiPreview() {
    setBusy(true);
    try {
      const who = profile === "wife" ? "an Ethiopian woman in modest athletic wear and a sport hijab" : profile === "mother" ? "an Ethiopian woman in her sixties in modest comfortable activewear" : "an Ethiopian man in his thirties in a fitted t-shirt and track pants";
      await generateAndSave({
        profile,
        kind: "weight",
        view: String(stage),
        label: `${stage} kg`,
        prompt: `Healthy, encouraging full-body photo of ${who}${fit?.height_cm ? `, ${fit.height_cm} cm tall` : ""}, at a healthy body weight of about ${stage} kg, standing confidently and smiling, warm cream studio background, soft natural light, realistic proportions, respectful and motivating.`,
        onFrame: (url, final) => setLive({ url, final }),
      });
      qc.invalidateQueries({ queryKey: ["images", profile, "weight"] });
    } catch (e) {
      toast.error(e instanceof Error && e.message.includes("402") ? "AI credits have run out." : "Couldn't create the preview.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="rounded-3xl border border-border bg-card p-5 shadow-warm">
      <p className="text-[11px] font-semibold tracking-widest text-primary uppercase">Weight goal preview</p>
      <h2 className="mt-1 font-display text-xl font-semibold">{profileName()}'s journey: {start} → {goal} kg</h2>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <label>Now (kg)<input type="number" value={start} onChange={(e) => { setStart(+e.target.value); setStage(+e.target.value); }} className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2" /></label>
        <label>Goal (kg)<input type="number" value={goal} onChange={(e) => setGoal(+e.target.value)} className="mt-1 w-full rounded-xl border border-input bg-background px-3 py-2" /></label>
      </div>

      <div className="mt-4 flex items-end justify-around rounded-2xl bg-secondary/50 py-3">
        <div className="text-center"><Silhouette kg={start} tint="fill-muted-foreground/40" /><p className="text-[11px]">{start} kg</p></div>
        <div className="text-center"><Silhouette kg={stage} tint="fill-primary" /><p className="text-xs font-bold text-primary">{stage} kg</p></div>
        <div className="text-center"><Silhouette kg={goal} tint="fill-accent" /><p className="text-[11px]">{goal} kg</p></div>
      </div>
      <input type="range" min={Math.min(goal, start)} max={Math.max(goal, start)} step={1} value={stage} onChange={(e) => setStage(+e.target.value)} className="mt-3 w-full accent-primary" aria-label="Preview weight" />
      <p className="text-center text-xs text-muted-foreground">Slide to see each stage · about {weeks} weeks at a healthy 0.5–0.7 kg per week</p>

      <div className="mt-4 rounded-2xl bg-primary/8 p-4">
        <p className="text-sm font-semibold">{phase.name} <span className="font-normal text-muted-foreground">· {phase.weeks}</span></p>
        <p className="mt-1 text-xs">{phase.focus}</p>
        <ul className="mt-2 space-y-1">{phase.workouts.map((w) => <li key={w} className="text-xs">💪 {w}</li>)}</ul>
        <p className="mt-2 text-xs">🥗 {phase.food}</p>
      </div>

      <div className="mt-4 flex gap-2">
        <button onClick={saveGoal} className="flex-1 rounded-full border border-primary/40 py-2 text-xs font-semibold text-primary">Save goal</button>
        <button onClick={aiPreview} disabled={busy} className="flex-1 rounded-full bg-primary py-2 text-xs font-semibold text-primary-foreground disabled:opacity-60">{busy ? "Creating…" : `✨ AI preview at ${stage} kg`}</button>
      </div>
      {live && <img src={live.url} alt="AI preview" className={`mt-3 aspect-[2/3] w-full rounded-2xl object-cover transition-[filter] ${live.final ? "blur-0" : "blur-2xl"}`} />}
      {previews.length > 0 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {previews.map((p) => p.url && (
            <figure key={p.id} className="w-24 shrink-0"><img src={p.url} alt={p.label} loading="lazy" className="aspect-[2/3] w-full rounded-xl object-cover" /><figcaption className="text-center text-[11px]">{p.label}</figcaption></figure>
          ))}
        </div>
      )}
      <p className="mt-2 text-[11px] text-muted-foreground">Check with a doctor before starting, especially with health conditions.</p>
    </section>
  );
}
