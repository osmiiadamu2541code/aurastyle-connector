import { createServerFn } from "@tanstack/react-start";
import { streamText } from "ai";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

/** Copies the starter wardrobes and size & fit notes into a brand-new family account. */
export const seedFamily = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.rpc("seed_family_data", { _uid: context.userId });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export type EventSuggestions = {
  outfits: { title: string; pieces: string[]; why: string }[];
  shopping: { item: string; why: string; budget: string }[];
  prep: string[];
};

export const suggestEventOutfits = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => z.object({ eventId: z.string().uuid() }).parse(d))
  .handler(async ({ data, context }) => {
    const { createGateway, createRunIdFetch, CHAT_MODEL, responsesOptions } = await import("./ai-gateway.server");
    const { supabase } = context;
    const { data: event, error } = await supabase.from("family_events").select("*").eq("id", data.eventId).single();
    if (error || !event) throw new Error("Event not found");
    const [{ data: items }, { data: fit }, { data: mems }] = await Promise.all([
      supabase.from("wardrobe_items").select("name, color, season, occasion").eq("profile", event.profile),
      supabase.from("profile_measurements").select("*").eq("profile", event.profile).maybeSingle(),
      supabase.from("aura_memories").select("content").eq("profile", event.profile).limit(30),
    ]);
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("AI is not configured");
    const gateway = createGateway(apiKey, createRunIdFetch());
    const prompt = `Plan outfits for an Ethiopian family member (${event.profile}) attending "${event.title}" (${event.event_type}) on ${event.event_date}. Notes: ${event.notes || "none"}.
Their wardrobe: ${(items ?? []).map((i) => `${i.name} (${i.color}, ${i.occasion})`).join("; ") || "empty"}.
Size & fit: ${fit ? `${fit.height_cm}cm, ${fit.weight_kg}kg, prefers ${fit.preferred_fit} fit` : "unknown"}. Known preferences: ${(mems ?? []).map((m) => m.content).join("; ") || "none"}.
Respect modest dress (hijab for wife where appropriate) and cultural celebration norms.
Return ONLY JSON: {"outfits":[{"title":"","pieces":["use wardrobe item names where possible"],"why":""}],"shopping":[{"item":"","why":"","budget":"price range in ETB"}],"prep":["preparation step days before"]}. Give 3 outfits, 2-4 shopping ideas, 3-5 prep steps.`;
    const result = streamText({ model: gateway.responses(CHAT_MODEL), prompt, providerOptions: responsesOptions });
    const text = await result.text;
    const match = text.match(/\{[\s\S]*\}/);
    let parsed: EventSuggestions = { outfits: [], shopping: [], prep: [] };
    try {
      const j = JSON.parse(match?.[0] ?? "{}");
      parsed = {
        outfits: Array.isArray(j.outfits) ? j.outfits.slice(0, 4) : [],
        shopping: Array.isArray(j.shopping) ? j.shopping.slice(0, 5) : [],
        prep: Array.isArray(j.prep) ? j.prep.slice(0, 6) : [],
      };
    } catch {
      throw new Error("Aura couldn't finish the ideas. Please try again.");
    }
    const { error: upErr } = await supabase.from("family_events").update({ suggestions: parsed }).eq("id", event.id);
    if (upErr) throw new Error(upErr.message);
    return parsed;
  });
