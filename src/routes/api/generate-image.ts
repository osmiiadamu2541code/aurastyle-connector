import { createFileRoute } from "@tanstack/react-router";

import { GATEWAY_URL, IMAGE_MODEL, userFromRequest } from "@/lib/ai-gateway.server";

export const Route = createFileRoute("/api/generate-image")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const user = await userFromRequest(request);
        if (!user) return new Response("Please sign in first.", { status: 401 });
        const apiKey = process.env["LOVABLE_API_KEY"];
        if (!apiKey) return new Response("Missing LOVABLE_API_KEY", { status: 500 });
        const { prompt, stream = true } = (await request.json()) as { prompt?: string; stream?: boolean };
        if (!prompt || typeof prompt !== "string" || prompt.length > 4000) {
          return new Response("A description is required.", { status: 400 });
        }
        const upstream = await fetch(`${GATEWAY_URL}/v1/images/generations`, {
          method: "POST",
          headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            model: IMAGE_MODEL,
            prompt,
            ...(stream ? { stream: true, partial_images: 1 } : {}),
          }),
        });
        return new Response(upstream.body, {
          status: upstream.status,
          headers: {
            "Content-Type": upstream.headers.get("Content-Type") ?? "application/json",
            "Cache-Control": "no-cache",
          },
        });
      },
    },
  },
});
