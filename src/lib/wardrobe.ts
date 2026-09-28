import { supabase } from "@/integrations/supabase/client";
import type { Lang, ProfileId } from "./i18n";
import { requireUid } from "./session";

export type WardrobeItem = {
  id: string;
  profile: string;
  name: string;
  name_am: string | null;
  name_om: string | null;
  icon: string;
  color: string;
  season: string;
  occasion: string;
  fabric_care: string;
  fit_note: string;
  image_url: string;
  photo_url?: string | null;
  created_at: string;
};

export type NewItem = {
  profile: ProfileId;
  name: string;
  name_am?: string | null;
  name_om?: string | null;
  icon: string;
  color: string;
  season: string;
  occasion: string;
  fabric_care: string;
  fit_note: string;
  image_url?: string;
  photoFile?: File | null;
};


export const SEASONS = ["summer", "winter", "rainy", "allseason"] as const;
export const OCCASIONS = ["casual", "work", "formal", "event"] as const;

export const ICON_CHOICES = ["👕", "👔", "👗", "👚", "🧥", "👖", "🩳", "🧣", "🧤", "👞", "👟", "👠", "🧢", "👒", "🧶", "🥼"];

export const TILE_COLORS: Record<string, string> = {
  coral: "from-coral/45 to-honey/25",
  honey: "from-honey/50 to-cream/40",
  sand: "from-sand/60 to-cream/40",
  clay: "from-clay/45 to-honey/25",
  dusk: "from-dusk/40 to-clay/25",
  sky: "from-sky/45 to-cream/40",
  stone: "from-stone/45 to-sand/35",
  cream: "from-cream/70 to-sand/40",
};

export const COLOR_CHOICES = Object.keys(TILE_COLORS);

export function itemName(item: WardrobeItem, lang: Lang) {
  if (lang === "am") return item.name_am || item.name;
  if (lang === "om") return item.name_om || item.name;
  return item.name;
}

export const PHOTO_BUCKET = "wardrobe-photos";

/** A photo only belongs to an item when it lives inside that item's own profile folder. */
function ownsPhoto(item: WardrobeItem): boolean {
  return !!item.image_url && item.image_url.includes(`/${item.profile}/`);
}

async function withPhotoUrls(items: WardrobeItem[]): Promise<WardrobeItem[]> {
  const paths = items.filter(ownsPhoto).map((i) => i.image_url);
  if (paths.length === 0) return items.map((i) => ({ ...i, photo_url: null }));
  const { data } = await supabase.storage.from(PHOTO_BUCKET).createSignedUrls(paths, 60 * 60 * 24 * 7);
  const map = new Map((data ?? []).map((d) => [d.path, d.signedUrl]));
  return items.map((i) => ({ ...i, photo_url: ownsPhoto(i) ? (map.get(i.image_url) ?? null) : null }));
}

export async function fetchWardrobe(profile: ProfileId): Promise<WardrobeItem[]> {
  const { data, error } = await supabase
    .from("wardrobe_items")
    .select("*")
    .eq("profile", profile)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return withPhotoUrls((data ?? []) as WardrobeItem[]);
}

export async function uploadWardrobePhoto(profile: ProfileId, file: File): Promise<string> {
  const ext = (file.name.split(".").pop() ?? "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
  const path = `${await requireUid()}/${profile}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage
    .from(PHOTO_BUCKET)
    .upload(path, file, { contentType: file.type || "image/jpeg", upsert: false });
  if (error) throw error;
  return path;
}

/** Uploads photos (resized, 3 at a time) and inserts every item in one database call. */
export async function addWardrobeItems(items: NewItem[]): Promise<WardrobeItem[]> {
  if (items.length === 0) return [];
  const { toUploadFile } = await import("./image-resize");
  const paths: string[] = new Array(items.length).fill("");
  const uploaded: string[] = [];
  let next = 0;
  const worker = async () => {
    for (let i = next++; i < items.length; i = next++) {
      const item = items[i]!;
      if (!item.photoFile) { paths[i] = item.image_url ?? ""; continue; }
      paths[i] = await uploadWardrobePhoto(item.profile, await toUploadFile(item.photoFile));
      uploaded.push(paths[i]!);
    }
  };
  try {
    await Promise.all([worker(), worker(), worker()]);
    const rows = items.map(({ photoFile: _f, ...rest }, i) => ({
      ...rest,
      name_am: rest.name_am || null,
      name_om: rest.name_om || null,
      image_url: paths[i]!,
    }));
    const { data, error } = await supabase.from("wardrobe_items").insert(rows).select();
    if (error) throw error;
    return (data ?? []) as WardrobeItem[];
  } catch (err) {
    if (uploaded.length) await supabase.storage.from(PHOTO_BUCKET).remove(uploaded);
    throw err;
  }
}

export async function addWardrobeItem(item: NewItem): Promise<WardrobeItem> {
  const [saved] = await addWardrobeItems([item]);
  return saved!;
}

export async function deleteWardrobeItem(id: string, imagePath?: string): Promise<void> {
  const { error } = await supabase.from("wardrobe_items").delete().eq("id", id);
  if (error) throw error;
  if (imagePath) await supabase.storage.from(PHOTO_BUCKET).remove([imagePath]);
}

