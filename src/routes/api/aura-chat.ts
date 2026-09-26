import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, stepCountIs, streamText, tool, type UIMessage } from "ai";
import { z } from "zod";

import {
  CHAT_MODEL,
  PROFILES,
  createGateway,
  createRunIdFetch,
  responsesOptions,
  runIdFromRequest,
  userFromRequest,
  withRunIdHeader,
} from "@/lib/ai-gateway.server";

const NAMES: Record<string, string> = { usman: "Usman", wife: "Usman's wife", mother: "Usman's mother", kids: "the kids" };

export const Route = createFileRoute("/api/aura-chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const user = await userFromRequest(request);
        if (!user) return new Response("Please sign in first.", { status: 401 });
        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const body = (await request.json()) as { messages?: UIMessage[]; profile?: string };
        const profile = body.profile ?? "";
        const messages = Array.isArray(body.messages) ? body.messages : [];
        if (!(PROFILES as readonly string[]).includes(profile) || messages.length === 0) {
          return new Response("Invalid request", { status: 400 });
        }
        const { supabase, userId } = user;

        const [memRes, guideRes, fitRes, wardRes, eventRes] = await Promise.all([
          supabase.from("aura_memories").select("category, content").eq("profile", profile).order("created_at").limit(80),
          supabase.from("aura_guidelines").select("guideline").eq("profile", profile).order("created_at").limit(40),
          supabase.from("profile_measurements").select("*").eq("profile", profile).maybeSingle(),
          supabase.from("wardrobe_items").select("name, color, season, occasion").eq("profile", profile).limit(60),
          supabase
            .from("family_events")
            .select("title, event_type, event_date, profile")
            .gte("event_date", new Date().toISOString().slice(0, 10))
            .order("event_date")
            .limit(10),
        ]);

        const memories = (memRes.data ?? []).map((m) => `- [${m.category}] ${m.content}`).join("\n") || "- (nothing yet)";
        const guidelines = (guideRes.data ?? []).map((g) => `- ${g.guideline}`).join("\n") || "- (none yet)";
        const fit = fitRes.data;
        const wardrobe = (wardRes.data ?? []).map((w) => `${w.name} (${w.color}, ${w.season}, ${w.occasion})`).join("; ");
        const events = (eventRes.data ?? []).map((e) => `${e.event_date}: ${e.title} (${e.event_type}, for ${e.profile})`).join("; ");

        const system = `You are Aura, the warm, motherly personal stylist and wellbeing companion of an Ethiopian family (Usman, his wife, his mother, and the kids). You are talking with ${NAMES[profile]}.
Speak with gentle care, like a loving aunt who is also an expert stylist, groomer and fitness coach. Keep answers practical, specific and short (a few short paragraphs or a list). Respect modest dress, hijab styling for those who wear it, and each person's faith and culture. Reply in the language the user writes in (English, Amharic or Afaan Oromoo).

PERMANENT MEMORY about ${NAMES[profile]}:
${memories}

YOUR SELF-LEARNED GUIDELINES for talking with ${NAMES[profile]} (follow these closely):
${guidelines}

Size & fit: ${fit ? `height ${fit.height_cm ?? "?"}cm, weight ${fit.weight_kg ?? "?"}kg, goal weight ${fit.target_weight_kg ?? "not set"}kg, preferred fit ${fit.preferred_fit}, face shape ${fit.face_shape || "unknown"}, hair ${fit.hair_type || "unknown"}. Comfort: ${fit.comfort_needs}. Posture: ${fit.posture_notes}.` : "not recorded"}
Wardrobe: ${wardrobe || "empty"}
Upcoming family events: ${events || "none"}
Today is ${new Date().toISOString().slice(0, 10)}.

Memory rules: whenever you learn a lasting fact (preferences, sizes, colors they love or dislike, goals, health or comfort needs, important dates), call remember. Whenever the user corrects your tone, length, language or approach, or you notice what style of help works best for them, call improve_myself with a short rule for future chats. Never mention these tools by name; simply continue caringly.`;

        const runIdFetch = createRunIdFetch(runIdFromRequest(request));
        const gateway = createGateway(apiKey, runIdFetch);

        const result = streamText({
          model: gateway.responses(CHAT_MODEL),
          system,
          messages: await convertToModelMessages(messages.slice(-40)),
          abortSignal: request.signal,
          stopWhen: stepCountIs(50),
          providerOptions: responsesOptions,
          tools: {
            remember: tool({
              description: "Save a lasting fact about this family member to permanent memory.",
              inputSchema: z.object({
                category: z.string().describe("e.g. style, size, color, health, goal, date, family"),
                content: z.string().describe("One short sentence with the fact"),
              }),
              execute: async ({ category, content }) => {
                const { error } = await supabase
                  .from("aura_memories")
                  .insert({ user_id: userId, profile, category: category.slice(0, 40), content: content.slice(0, 500) });
                return error ? { saved: false } : { saved: true };
              },
            }),
            improve_myself: tool({
              description: "Save a rule that improves how you help this family member in all future conversations.",
              inputSchema: z.object({
                guideline: z.string().describe("A short instruction for your future self"),
                reason: z.string().describe("What prompted this"),
              }),
              execute: async ({ guideline, reason }) => {
                const { error } = await supabase
                  .from("aura_guidelines")
                  .insert({ user_id: userId, profile, guideline: guideline.slice(0, 400), reason: reason.slice(0, 400) });
                return error ? { saved: false } : { saved: true };
              },
            }),
          },
        });

        const response = result.toUIMessageStreamResponse({
          originalMessages: messages,
          sendReasoning: true,
          generateMessageId: () => crypto.randomUUID(),
          onFinish: async ({ responseMessage }) => {
            const lastUser = [...messages].reverse().find((m) => m.role === "user");
            const rows = [lastUser, responseMessage]
              .filter((m): m is UIMessage => !!m && m.parts.length > 0)
              .map((m) => ({
                user_id: userId,
                profile,
                message_id: m.id,
                role: m.role,
                parts: JSON.parse(JSON.stringify(m.parts)),
              }));
            const { error } = await supabase.from("aura_messages").upsert(rows, { onConflict: "user_id,profile,message_id" });
            if (error) console.error("Failed to save Aura messages", error);
          },
        });
        return withRunIdHeader(response, runIdFetch);
      },
    },
  },
});
