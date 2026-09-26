import { createOpenAI } from "@ai-sdk/openai";
import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/integrations/supabase/types";

export const GATEWAY_URL = "https://ai.gateway.lovable.dev";
export const CHAT_MODEL = "openai/gpt-6-astra";
export const IMAGE_MODEL = "openai/gpt-image-2.5-sunburst";
export const PROFILES = ["usman", "wife", "mother", "kids"] as const;

const RUN_ID_HEADER = "X-Lovable-AIG-Run-ID";

export function createRunIdFetch(initialRunId?: string) {
  let runId = initialRunId?.trim() || undefined;
  let resolved = false;
  let resolve: (v: string | undefined) => void = () => {};
  const ready = new Promise<string | undefined>((r) => (resolve = r));
  const publish = (v?: string) => {
    if (!runId && v?.trim()) runId = v.trim();
    if (!resolved) {
      resolved = true;
      resolve(runId);
    }
  };
  if (runId) publish(runId);
  return {
    fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
      const headers = new Headers(init?.headers);
      if (runId && !headers.has(RUN_ID_HEADER)) headers.set(RUN_ID_HEADER, runId);
      try {
        const res = await fetch(input, { ...init, headers });
        publish(res.headers.get(RUN_ID_HEADER) ?? undefined);
        return res;
      } catch (e) {
        publish(undefined);
        throw e;
      }
    },
    getRunId: () => runId,
    waitForRunId: () => (runId ? Promise.resolve(runId) : ready),
  };
}

export function createGateway(apiKey: string, runIdFetch: ReturnType<typeof createRunIdFetch>) {
  return createOpenAI({
    baseURL: `${GATEWAY_URL}/v1`,
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });
}

export const responsesOptions = {
  openai: {
    forceReasoning: true,
    reasoningEffort: "medium",
    reasoningSummary: "auto",
    store: false,
    include: ["reasoning.encrypted_content"],
  },
} as const;

/** Adds the gateway run id header to a streaming response once it is known. */
export async function withRunIdHeader(response: Response, gw: ReturnType<typeof createRunIdFetch>) {
  if (!response.body) return response;
  const reader = response.body.getReader();
  const first = reader.read();
  const runId = await gw.waitForRunId();
  const headers = new Headers(response.headers);
  if (runId) {
    headers.set(RUN_ID_HEADER, runId);
    headers.set("Access-Control-Expose-Headers", RUN_ID_HEADER);
  }
  const body = new ReadableStream({
    async start(controller) {
      try {
        const f = await first;
        if (f.done) return controller.close();
        controller.enqueue(f.value);
        while (true) {
          const c = await reader.read();
          if (c.done) break;
          controller.enqueue(c.value);
        }
        controller.close();
      } catch (e) {
        controller.error(e);
      }
    },
    cancel: (r) => reader.cancel(r),
  });
  return new Response(body, { status: response.status, statusText: response.statusText, headers });
}

export function runIdFromRequest(request: Request) {
  return request.headers.get(RUN_ID_HEADER)?.trim() || undefined;
}

/** Verifies the family account bearer token and returns a database client acting as that account. */
export async function userFromRequest(request: Request) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (!token) return null;
  const supabase = createClient<Database>(process.env["SUPABASE_URL"]!, process.env["SUPABASE_PUBLISHABLE_KEY"]!, {
    global: { headers: { Authorization: `Bearer ${token}` } },
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return null;
  return { supabase, userId: data.user.id };
}
