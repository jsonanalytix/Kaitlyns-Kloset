import { createClient } from "@supabase/supabase-js";

// Fallbacks allow the static export build to complete without real credentials.
// At runtime in the browser the real env values (baked in at build time) are used.
const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function getOAuthRedirectUrl() {
  if (typeof window === "undefined") return "";
  const isNative = !!(window as unknown as Record<string, unknown>).Capacitor;
  return isNative
    ? "com.kaitlynskloset.app://login"
    : `${window.location.origin}/login`;
}
