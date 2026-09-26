import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import { useApp } from "@/lib/app-context";
import { suggestEventOutfits, type EventSuggestions } from "@/lib/family.functions";
import { PROFILE_NAMES, type ProfileId } from "@/lib/i18n";
import { PROFILE_ORDER } from "@/lib/profile-icons";

export const Route = createFileRoute("/events")({
  head: () => ({
    meta: [
      { title: "Event Planner — AuraStyle AI" },
      { name: "description", content: "Track family celebrations and get outfit ideas, shopping suggestions and preparation steps ahead of time." },
      { property: "og:title", content: "Family Event Planner — AuraStyle AI" },
      { property: "og:description", content: "Celebrations tracked, outfits planned, shopping sorted." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Events,
});

export type FamilyEvent = {
  id: string;
  profile: string;
  title: string;
  event_type: string;
  event_date: string;
  notes: string;
  suggestions: EventSuggestions | null;
};

const TYPES = [
  ["wedding", "💍 Wedding"],
  ["eid", "🌙 Eid"],
  ["holiday", "✝️ Holiday / Timket"],
  ["birthday", "🎂 Birthday"],
  ["graduation", "🎓 Graduation"],
  ["celebration", "🎉 Celebration"],
  ["work", "💼 Work event"],
] as const;

export async function fetchEvents(): Promise<FamilyEvent[]> {
  const { data, error } = await supabase.from("family_events").select("*").order("event_date");
  if (error) throw error;
  return (data ?? []) as unknown as FamilyEvent[];
}

export function daysUntil(date: string) {
  const d = new Date(date + "T00:00:00");
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.round((d.getTime() - now.getTime()) / 86400000);
}

function Events() {
  const { profile } = useApp();
  const qc = useQueryClient();
  const { data: events = [], isLoading } = useQuery({ queryKey: ["events"], queryFn: fetchEvents });
  const [form, setForm] = useState({ title: "", event_type: "wedding", event_date: "", notes: "", profile: profile as string });
  const [open, setOpen] = useState(false);

  const add = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("family_events").insert(form);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Event saved");
      setOpen(false);
      setForm({ ...form, title: "", notes: "", event_date: "" });
      qc.invalidateQueries({ queryKey: ["events"] });
    },
    onError: (e) => toast.error(e.message),
  });

  const upcoming = events.filter((e) => daysUntil(e.event_date) >= 0);
  const past = events.filter((e) => daysUntil(e.event_date) < 0);

  return (
    <div className="space-y-4 px-4 py-4">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">Event Planner</h1>
          <p className="text-sm text-muted-foreground">Every celebration, dressed for in advance</p>
        </div>
        <button onClick={() => setOpen(!open)} className="rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-warm">
          {open ? "Close" : "+ Add"}
        </button>
      </div>

      {open && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            add.mutate();
          }}
          className="space-y-3 rounded-3xl border border-border bg-card p-4 shadow-warm"
        >
          <input required placeholder="e.g. Cousin Hanan's wedding" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-2xl border border-input bg-background px-4 py-2.5 text-sm" />
          <div className="grid grid-cols-2 gap-2">
            <select value={form.event_type} onChange={(e) => setForm({ ...form, event_type: e.target.value })} className="rounded-2xl border border-input bg-background px-3 py-2.5 text-sm">
              {TYPES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
            <input required type="date" value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} className="rounded-2xl border border-input bg-background px-3 py-2.5 text-sm" />
          </div>
          <select value={form.profile} onChange={(e) => setForm({ ...form, profile: e.target.value })} className="w-full rounded-2xl border border-input bg-background px-3 py-2.5 text-sm">
            {PROFILE_ORDER.map((p) => <option key={p} value={p}>For {PROFILE_NAMES.en[p as ProfileId]}</option>)}
          </select>
          <textarea placeholder="Dress code, colours, venue, budget…" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="w-full rounded-2xl border border-input bg-background px-4 py-2.5 text-sm" rows={2} />
          <button disabled={add.isPending} className="w-full rounded-full bg-primary py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60">
            {add.isPending ? "Saving…" : "Save event"}
          </button>
        </form>
      )}

      {isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
      {!isLoading && upcoming.length === 0 && (
        <p className="rounded-3xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
          No celebrations planned yet. Add a wedding, Eid or birthday and I'll help everyone get ready.
        </p>
      )}
      {upcoming.map((e) => <EventCard key={e.id} event={e} />)}
      {past.length > 0 && (
        <details className="text-sm">
          <summary className="cursor-pointer text-muted-foreground">Past events ({past.length})</summary>
          <div className="mt-3 space-y-3">{past.map((e) => <EventCard key={e.id} event={e} />)}</div>
        </details>
      )}
    </div>
  );
}

function EventCard({ event }: { event: FamilyEvent }) {
  const qc = useQueryClient();
  const suggest = useServerFn(suggestEventOutfits);
  const days = daysUntil(event.event_date);
  const ideas = useMutation({
    mutationFn: () => suggest({ data: { eventId: event.id } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["events"] }),
    onError: (e) => toast.error(e.message),
  });
  const remove = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("family_events").delete().eq("id", event.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["events"] }),
  });
  const s = event.suggestions;
  const soon = days >= 0 && days <= 14;

  return (
    <article className={`rounded-3xl border bg-card p-4 shadow-warm ${soon ? "border-primary/50" : "border-border"}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold tracking-widest text-primary uppercase">
            {TYPES.find((t) => t[0] === event.event_type)?.[1] ?? event.event_type} · {PROFILE_NAMES.en[event.profile as ProfileId] ?? event.profile}
          </p>
          <h3 className="mt-0.5 font-display text-lg font-semibold">{event.title}</h3>
          <p className="text-xs text-muted-foreground">
            {new Date(event.event_date + "T00:00:00").toDateString()} · {days === 0 ? "Today!" : days > 0 ? `in ${days} day${days === 1 ? "" : "s"}` : "passed"}
          </p>
        </div>
        <button onClick={() => remove.mutate()} className="text-xs text-muted-foreground" aria-label="Delete event">✕</button>
      </div>
      {event.notes && <p className="mt-2 text-xs">{event.notes}</p>}

      {soon && !s && <p className="mt-3 rounded-2xl bg-primary/10 p-3 text-xs">⏰ It's coming up soon — let me plan the outfits and shopping now.</p>}

      {s ? (
        <div className="mt-3 space-y-3">
          <div className="space-y-2">
            {s.outfits.map((o) => (
              <div key={o.title} className="rounded-2xl bg-secondary/60 p-3">
                <p className="text-sm font-semibold">👗 {o.title}</p>
                <p className="mt-1 text-xs">{o.pieces.join(" · ")}</p>
                <p className="mt-1 text-xs text-muted-foreground">{o.why}</p>
              </div>
            ))}
          </div>
          {s.shopping.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold tracking-widest text-primary uppercase">Shopping list</p>
              <ul className="mt-1 space-y-1">
                {s.shopping.map((i) => (
                  <li key={i.item} className="text-xs">🛍️ <b>{i.item}</b> — {i.why} <span className="text-muted-foreground">({i.budget})</span></li>
                ))}
              </ul>
            </div>
          )}
          {s.prep.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold tracking-widest text-primary uppercase">Get ready</p>
              <ul className="mt-1 space-y-1">{s.prep.map((p) => <li key={p} className="text-xs">✔️ {p}</li>)}</ul>
            </div>
          )}
          <button onClick={() => ideas.mutate()} disabled={ideas.isPending} className="text-xs font-medium text-primary">
            {ideas.isPending ? "Thinking…" : "↻ Fresh ideas"}
          </button>
        </div>
      ) : (
        <button onClick={() => ideas.mutate()} disabled={ideas.isPending} className="mt-3 w-full rounded-full bg-primary py-2 text-xs font-semibold text-primary-foreground disabled:opacity-60">
          {ideas.isPending ? "Aura is planning…" : "✨ Plan outfits & shopping"}
        </button>
      )}
    </article>
  );
}
