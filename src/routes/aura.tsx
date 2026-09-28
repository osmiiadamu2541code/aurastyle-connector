import { useChat } from "@ai-sdk/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { DefaultChatTransport, type UIMessage } from "ai";
import { memo, useMemo } from "react";
import { toast } from "sonner";

import auraMark from "@/assets/aura-mark.png";
import { Conversation, ConversationContent, ConversationScrollButton } from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import { PromptInput, PromptInputFooter, PromptInputSubmit, PromptInputTextarea } from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Tool, ToolContent, ToolHeader, ToolInput, ToolOutput } from "@/components/ai-elements/tool";
import { supabase } from "@/integrations/supabase/client";
import { useApp } from "@/lib/app-context";
import type { Lang, ProfileId } from "@/lib/i18n";
import { authHeaders } from "@/lib/session";

export const Route = createFileRoute("/aura")({
  head: () => ({
    meta: [
      { title: "Aura — Your family's caring AI stylist" },
      { name: "description", content: "Chat with Aura, a warm AI stylist who remembers each family member and learns how to help them better." },
      { property: "og:title", content: "Aura — Caring AI stylist" },
      { property: "og:description", content: "An AI companion with lasting memory for every family member." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuraPage,
});

async function loadHistory(profile: ProfileId): Promise<UIMessage[]> {
  const { data, error } = await supabase
    .from("aura_messages")
    .select("message_id, role, parts")
    .eq("profile", profile)
    .order("created_at")
    .limit(200);
  if (error) throw error;
  return (data ?? []).map((r) => ({ id: r.message_id, role: r.role as UIMessage["role"], parts: r.parts as UIMessage["parts"] }));
}

function AuraPage() {
  const { profile, profileName, tx, lang } = useApp();
  const { data, isLoading } = useQuery({ queryKey: ["aura-history", profile], queryFn: () => loadHistory(profile), staleTime: Infinity });
  return (
    <div className="flex h-[calc(100dvh-12rem)] flex-col px-4 pt-3">
      <div className="flex items-center gap-3">
        <img src={auraMark} alt="Aura" width={44} height={44} className="h-11 w-11 rounded-2xl bg-card shadow-warm" />
        <div>
          <h1 className="font-display text-xl font-semibold">Aura</h1>
          <p className="text-xs text-muted-foreground">{tx("Talking with {who} · remembers everything you share", { who: profileName() })}</p>
        </div>
      </div>
      <MemoryPanel profile={profile} />
      {isLoading || !data ? (
        <div className="flex-1 pt-6"><Shimmer>{tx("Opening your chat…")}</Shimmer></div>
      ) : (
        <ChatWindow key={profile} profile={profile} lang={lang} initial={data} />
      )}
    </div>
  );
}

const MemoryPanel = memo(function MemoryPanel({ profile }: { profile: ProfileId }) {
  const { tx } = useApp();
  const qc = useQueryClient();
  const { data } = useQuery({
    queryKey: ["aura-memory", profile],
    queryFn: async () => {
      const [m, g] = await Promise.all([
        supabase.from("aura_memories").select("id, category, content").eq("profile", profile).order("created_at", { ascending: false }),
        supabase.from("aura_guidelines").select("id, guideline").eq("profile", profile).order("created_at", { ascending: false }),
      ]);
      return { memories: m.data ?? [], guidelines: g.data ?? [] };
    },
  });
  const forget = async (table: "aura_memories" | "aura_guidelines", id: string) => {
    await supabase.from(table).delete().eq("id", id);
    void qc.invalidateQueries({ queryKey: ["aura-memory", profile] });
  };
  const count = (data?.memories.length ?? 0) + (data?.guidelines.length ?? 0);
  return (
    <details className="mt-2 rounded-2xl border border-border bg-card px-3 py-2 text-xs">
      <summary className="cursor-pointer font-medium">🧠 {tx("What Aura remembers ({n})", { n: count })}</summary>
      <div className="mt-2 max-h-40 space-y-1 overflow-y-auto">
        {data?.memories.map((m) => (
          <p key={m.id} className="flex justify-between gap-2"><span>• <b>{m.category}:</b> {m.content}</span><button onClick={() => forget("aura_memories", m.id)} className="text-muted-foreground" aria-label={tx("Forget this")}>✕</button></p>
        ))}
        {data?.guidelines.map((g) => (
          <p key={g.id} className="flex justify-between gap-2"><span>🌱 {g.guideline}</span><button onClick={() => forget("aura_guidelines", g.id)} className="text-muted-foreground" aria-label={tx("Forget this")}>✕</button></p>
        ))}
        {count === 0 && <p className="text-muted-foreground">{tx("Nothing yet — tell Aura what you love, and she'll remember.")}</p>}
      </div>
    </details>
  );
});

const STARTERS = ["What should I wear to a wedding this weekend?", "I prefer earthy colours and loose fits", "Help me plan a week of outfits"];

function ChatWindow({ profile, lang, initial }: { profile: ProfileId; lang: Lang; initial: UIMessage[] }) {
  const { tx } = useApp();
  const qc = useQueryClient();
  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/aura-chat", headers: authHeaders, body: { profile, lang } }),
    [profile, lang],
  );
  const { messages, sendMessage, status, stop } = useChat({
    id: `aura-${profile}`,
    messages: initial,
    transport,
    onError: (e) => {
      const msg = e.message || "";
      toast.error(msg.includes("402") ? tx("AI credits have run out.") : msg.includes("429") ? tx("Aura is busy — please try again in a moment.") : tx("Aura couldn't reply. Please try again."));
    },
    onFinish: () => qc.invalidateQueries({ queryKey: ["aura-memory", profile] }),
  });
  const busy = status === "submitted" || status === "streaming";

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <Conversation className="flex-1">
        <ConversationContent>
          {messages.length === 0 && (
            <div className="space-y-2 pt-4">
              <p className="text-sm text-muted-foreground">{tx("Hello my dear, what can I help you with today?")}</p>
              {STARTERS.map((s) => (
                <button key={s} onClick={() => sendMessage({ text: tx(s) })} className="block w-full rounded-2xl border border-border bg-card px-3 py-2 text-left text-xs">{tx(s)}</button>
              ))}
            </div>
          )}
          {messages.map((m) => <ChatMessage key={m.id} message={m} />)}
          {status === "submitted" && <Shimmer>{tx("Aura is thinking…")}</Shimmer>}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>
      <div className="pb-2">
        <PromptInput onSubmit={({ text }) => { if (text.trim() && !busy) sendMessage({ text }); }}>
          <PromptInputTextarea autoFocus placeholder={tx("Tell Aura anything…")} />
          <PromptInputFooter className="justify-end">
            <PromptInputSubmit status={status} onStop={stop} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}

const ChatMessage = memo(function ChatMessage({ message: m }: { message: UIMessage }) {
  return (
    <Message from={m.role}>
      <MessageContent className={m.role === "user" ? "bg-primary text-primary-foreground" : ""}>
        {m.parts.map((p, i) => {
          if (p.type === "text") return <MessageResponse key={i}>{p.text}</MessageResponse>;
          if (p.type.startsWith("tool-")) {
            const tp = p as Extract<UIMessage["parts"][number], { type: `tool-${string}` }> & { state: never; input?: unknown; output?: unknown; errorText?: string };
            return (
              <Tool key={i} defaultOpen={false}>
                <ToolHeader type={tp.type as never} state={tp.state} />
                <ToolContent>
                  <ToolInput input={tp.input} />
                  <ToolOutput output={tp.output as never} errorText={tp.errorText} />
                </ToolContent>
              </Tool>
            );
          }
          return null;
        })}
      </MessageContent>
    </Message>
  );
});
