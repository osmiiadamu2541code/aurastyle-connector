import { supabase } from "@/integrations/supabase/client";
import type { ProfileId } from "./i18n";
import { authHeaders, requireUid } from "./session";
import { streamImage } from "./stream-image";

export const AI_BUCKET = "ai-images";

export type SavedImage = { id: string; kind: string; view: string; label: string; path: string; url: string | null; created_at: string };

/** Streams an AI image, shows previews, then saves the final picture privately for this family member. */
export async function generateAndSave(opts: {
  profile: ProfileId;
  kind: "tryon" | "weight";
  view: string;
  label: string;
  prompt: string;
  onFrame: (url: string, final: boolean) => void;
}): Promise<void> {
  let finalUrl = "";
  await streamImage(
    "/api/generate-image",
    { prompt: opts.prompt },
    (url, fin) => {
      opts.onFrame(url, fin);
      if (fin) finalUrl = url;
    },
    undefined,
    await authHeaders(),
  );
  if (!finalUrl) throw new Error("No image was produced");
  const blob = await (await fetch(finalUrl)).blob();
  const uid = await requireUid();
  const path = `${uid}/${opts.profile}/${opts.kind}-${opts.view}-${crypto.randomUUID()}.png`;
  const { error } = await supabase.storage.from(AI_BUCKET).upload(path, blob, { contentType: "image/png" });
  if (error) throw error;
  const { error: dbErr } = await supabase
    .from("generated_images")
    .insert({ profile: opts.profile, kind: opts.kind, view: opts.view, label: opts.label, path });
  if (dbErr) throw dbErr;
}

export async function listImages(profile: ProfileId, kind: string): Promise<SavedImage[]> {
  const { data, error } = await supabase
    .from("generated_images")
    .select("*")
    .eq("profile", profile)
    .eq("kind", kind)
    .order("created_at", { ascending: false })
    .limit(30);
  if (error) throw error;
  const rows = data ?? [];
  if (rows.length === 0) return [];
  const { data: signed } = await supabase.storage.from(AI_BUCKET).createSignedUrls(rows.map((r) => r.path), 60 * 60 * 24);
  const map = new Map((signed ?? []).map((s) => [s.path, s.signedUrl]));
  return rows.map((r) => ({ ...r, url: map.get(r.path) ?? null }));
}

export async function deleteImages(images: SavedImage[]) {
  if (images.length === 0) return;
  await supabase.storage.from(AI_BUCKET).remove(images.map((i) => i.path));
  const { error } = await supabase.from("generated_images").delete().in("id", images.map((i) => i.id));
  if (error) throw error;
}
