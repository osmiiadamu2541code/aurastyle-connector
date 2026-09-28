import { createServerFn } from "@tanstack/react-start";
import { streamText } from "ai";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const CATEGORIES = ["shirt", "tshirt", "dress", "blouse", "jacket", "trousers", "shorts", "scarf", "hijab", "shoes", "sneakers", "heels", "cap", "hat", "knitwear", "traditional"] as const;

export type DetectedItem = {
  name: string;
  name_am: string;
  name_om: string;
  category: string;
  color: string;
  season: string;
  occasion: string;
  fabric_care: string;
  fit_note: string;
};

const TILE_COLORS = ["coral", "honey", "sand", "clay", "dusk", "sky", "stone", "cream"];

export const analyzeClothingPhoto = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) =>
    z
      .object({
        image: z.string().startsWith("data:image/").max(3_000_000),
        profile: z.string().max(20),
        lang: z.string().max(10).optional(),
      })
      .parse(d),
  )
  .handler(async ({ data }): Promise<DetectedItem> => {
    const { createGateway, createRunIdFetch, CHAT_MODEL } = await import("./ai-gateway.server");
    const { isLang, langInfo } = await import("./i18n");
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) throw new Error("AI is not configured");
    const gateway = createGateway(apiKey, createRunIdFetch());
    const language = langInfo(isLang(data.lang) ? data.lang : "en").englishName;
    const prompt = `You are a wardrobe assistant for an Ethiopian family. Look at this clothing photo (for the "${data.profile}" profile) and identify the single main item.
Write "fabric_care" and "fit_note" in ${language}. Keep the enum values exactly as listed (in English).
Return ONLY JSON with these keys:
{"name":"short English item name, e.g. 'Navy linen shirt'","name_am":"same name in Amharic","name_om":"same name in Afaan Oromoo","category":one of ${JSON.stringify(CATEGORIES)},"color":closest of ${JSON.stringify(TILE_COLORS)},"season":one of ["summer","winter","rainy","allseason"],"occasion":one of ["casual","work","formal","event"],"fabric_care":"1-2 short sentences of washing/ironing care based on the visible fabric","fit_note":"one short sentence on how it fits or how to wear it"}`;
    const result = streamText({
      model: gateway.responses(CHAT_MODEL),
      messages: [{ role: "user", content: [{ type: "text", text: prompt }, { type: "image", image: new URL(data.image) }] }],
      providerOptions: {
        openai: {
          forceReasoning: true,
          reasoningEffort: "low",
          reasoningSummary: "auto",
          store: false,
          include: ["reasoning.encrypted_content"],
        },
      },
    });
    const text = await result.text;
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Couldn't recognise this item");
    const raw = JSON.parse(match[0]) as Partial<DetectedItem>;
    const pick = (v: unknown, list: readonly string[], fallback: string) =>
      typeof v === "string" && list.includes(v) ? v : fallback;
    const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
    return {
      name: str(raw.name, 80) || "Clothing item",
      name_am: str(raw.name_am, 80),
      name_om: str(raw.name_om, 80),
      category: pick(raw.category, CATEGORIES, "shirt"),
      color: pick(raw.color, TILE_COLORS, "sand"),
      season: pick(raw.season, ["summer", "winter", "rainy", "allseason"], "allseason"),
      occasion: pick(raw.occasion, ["casual", "work", "formal", "event"], "casual"),
      fabric_care: str(raw.fabric_care, 400),
      fit_note: str(raw.fit_note, 200),
    };
  });
