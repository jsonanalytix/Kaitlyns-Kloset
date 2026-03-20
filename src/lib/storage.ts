import { supabase } from "./supabase";

type Bucket = "wardrobe-images" | "calendar-photos" | "avatars";

/**
 * Upload a file to a Supabase Storage bucket and return the public URL.
 * Path structure: `{userId}/{filename}` — enforced by RLS per-user prefix.
 */
async function upload(
  bucket: Bucket,
  path: string,
  file: File,
): Promise<string> {
  const { error } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true, contentType: file.type });

  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

function getUserId(): Promise<string> {
  return supabase.auth.getUser().then(({ data: { user } }) => {
    if (!user) throw new Error("Not authenticated");
    return user.id;
  });
}

export async function uploadWardrobeImage(file: File): Promise<string> {
  const userId = await getUserId();
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${userId}/${crypto.randomUUID()}.${ext}`;
  return upload("wardrobe-images", path, file);
}

export async function uploadCalendarPhoto(
  file: File,
  date: string,
): Promise<string> {
  const userId = await getUserId();
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${userId}/${date}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
  return upload("calendar-photos", path, file);
}

export async function uploadAvatar(file: File): Promise<string> {
  const userId = await getUserId();
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${userId}/avatar.${ext}`;
  return upload("avatars", path, file);
}
