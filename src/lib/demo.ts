import { supabase } from "@/lib/supabase";

let _isDemo = false;

export function setDemoStatus(isDemo: boolean) {
  _isDemo = isDemo;
}

export function isDemoUser(): boolean {
  return _isDemo;
}

export class DemoAccountError extends Error {
  constructor() {
    super("Sign up for your own account to save changes!");
    this.name = "DemoAccountError";
  }
}

/**
 * Throws DemoAccountError if the current user is the demo account.
 * Call at the top of any mutation function.
 */
export function assertNotDemo(): void {
  if (_isDemo) throw new DemoAccountError();
}

export async function fetchDemoStatus(): Promise<boolean> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from("profiles")
    .select("is_demo")
    .eq("id", user.id)
    .single();

  return data?.is_demo ?? false;
}
