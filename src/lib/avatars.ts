import { supabase } from "@/integrations/supabase/client";
import type { ProfileId } from "./i18n";

export const AVATAR_BUCKET = "profile-avatars";

export type ProfileAvatar = {
  profile: ProfileId;
  path: string;
  url: string | null;
};

/** Signed URL for one profile's avatar, or null when they haven't added one yet. */
export async function fetchAvatar(profile: ProfileId): Promise<ProfileAvatar | null> {
  const { data, error } = await supabase
    .from("profile_measurements")
    .select("profile, avatar_url")
    .eq("profile", profile)
    .maybeSingle();
  if (error) throw error;
  const path = (data as { avatar_url?: string } | null)?.avatar_url ?? "";
  if (!path) return null;
  // Only ever resolve a photo that lives inside this profile's own folder.
  if (!path.startsWith(`${profile}/`)) return null;
  const { data: signed } = await supabase.storage.from(AVATAR_BUCKET).createSignedUrl(path, 60 * 60 * 24 * 7);
  return { profile, path, url: signed?.signedUrl ?? null };
}

export async function fetchAllAvatars(): Promise<Record<string, string>> {
  const { data, error } = await supabase.from("profile_measurements").select("profile, avatar_url");
  if (error) throw error;
  const rows = ((data ?? []) as { profile: string; avatar_url: string | null }[]).filter(
    (r) => r.avatar_url && r.avatar_url.startsWith(`${r.profile}/`),
  );
  if (rows.length === 0) return {};
  const { data: signed } = await supabase.storage
    .from(AVATAR_BUCKET)
    .createSignedUrls(rows.map((r) => r.avatar_url as string), 60 * 60 * 24 * 7);
  const byPath = new Map((signed ?? []).map((s) => [s.path, s.signedUrl]));
  const out: Record<string, string> = {};
  for (const r of rows) {
    const url = byPath.get(r.avatar_url as string);
    if (url) out[r.profile] = url;
  }
  return out;
}

export async function uploadAvatar(profile: ProfileId, file: File): Promise<string> {
  const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const path = `${profile}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from(AVATAR_BUCKET)
    .upload(path, file, { contentType: file.type || "image/jpeg", upsert: false });
  if (error) throw error;

  const previous = await currentAvatarPath(profile);
  const { error: dbError } = await supabase
    .from("profile_measurements")
    .upsert({ profile, avatar_url: path }, { onConflict: "profile" });
  if (dbError) throw dbError;
  if (previous && previous !== path) await supabase.storage.from(AVATAR_BUCKET).remove([previous]);
  return path;
}

export async function removeAvatar(profile: ProfileId): Promise<void> {
  const previous = await currentAvatarPath(profile);
  const { error } = await supabase
    .from("profile_measurements")
    .upsert({ profile, avatar_url: "" }, { onConflict: "profile" });
  if (error) throw error;
  if (previous) await supabase.storage.from(AVATAR_BUCKET).remove([previous]);
}

async function currentAvatarPath(profile: ProfileId): Promise<string | null> {
  const { data } = await supabase
    .from("profile_measurements")
    .select("avatar_url")
    .eq("profile", profile)
    .maybeSingle();
  const path = (data as { avatar_url?: string } | null)?.avatar_url ?? "";
  return path && path.startsWith(`${profile}/`) ? path : null;
}
