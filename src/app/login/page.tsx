"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, AlertCircle, Sparkles } from "lucide-react";
import { supabase, getOAuthRedirectUrl } from "@/lib/supabase";
import { useAuth } from "@/components/AuthProvider";

export default function LoginPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  useEffect(() => {
    if (!authLoading && user) {
      router.replace("/");
    }
  }, [user, authLoading, router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setSubmitting(false);
    }
  }

  async function handleOAuth(provider: "google" | "apple") {
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: getOAuthRedirectUrl() },
    });
    if (error) setError(error.message);
  }

  async function handleDemoLogin() {
    setError(null);
    setDemoLoading(true);

    const demoEmail = process.env.NEXT_PUBLIC_DEMO_EMAIL ?? "demo@kaitlynskloset.app";
    const demoPassword = process.env.NEXT_PUBLIC_DEMO_PASSWORD;

    if (!demoPassword) {
      setError("Demo login is not configured. Set NEXT_PUBLIC_DEMO_PASSWORD in your environment.");
      setDemoLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: demoEmail,
      password: demoPassword,
    });

    if (error) {
      setError(error.message);
      setDemoLoading(false);
    }
  }

  if (authLoading || user) {
    return (
      <div className="flex min-h-full items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-warm-200 border-t-blush-500" />
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-col items-center justify-center bg-background px-4 py-12">
      {/* Brand */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blush-300 to-blush-500 shadow-lg shadow-blush-200/50">
          <svg
            className="h-8 w-8 text-white"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 6 8 2l4 4" />
            <path d="M12 6l4-4 4 4" />
            <path d="M4 6v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6" />
            <line x1="12" y1="6" x2="12" y2="14" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-warm-900">
          Kaitlyn&rsquo;s Kloset
        </h1>
        <p className="mt-1 text-sm text-warm-400">
          Your AI-powered wardrobe assistant
        </p>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm rounded-2xl bg-surface p-6 shadow-sm ring-1 ring-warm-200/60">
        <h2 className="text-lg font-semibold text-warm-900">Welcome back</h2>
        <p className="mt-0.5 text-sm text-warm-400">
          Sign in to your account
        </p>

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-warm-700"
            >
              Email
            </label>
            <div className="relative mt-1.5">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-warm-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="w-full rounded-xl border border-warm-200 bg-surface py-2.5 pl-10 pr-4 text-sm text-warm-900 placeholder:text-warm-300 focus:border-blush-300 focus:outline-none focus:ring-2 focus:ring-blush-100"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-warm-700"
            >
              Password
            </label>
            <div className="relative mt-1.5">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-warm-400" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;&#8226;"
                required
                autoComplete="current-password"
                className="w-full rounded-xl border border-warm-200 bg-surface py-2.5 pl-10 pr-10 text-sm text-warm-900 placeholder:text-warm-300 focus:border-blush-300 focus:outline-none focus:ring-2 focus:ring-blush-100"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-warm-400 hover:text-warm-600"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-start gap-2 rounded-xl bg-red-50 px-3 py-2.5">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-blush-500 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blush-600 disabled:opacity-50 active:scale-[0.98]"
          >
            {submitting ? "Signing in\u2026" : "Sign in"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-warm-200" />
          <span className="text-xs text-warm-400">or continue with</span>
          <div className="h-px flex-1 bg-warm-200" />
        </div>

        {/* OAuth */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleOAuth("google")}
            className="flex items-center justify-center gap-2 rounded-xl border border-warm-200 bg-surface py-2.5 text-sm font-medium text-warm-700 transition-colors hover:bg-warm-50 active:scale-[0.98]"
          >
            <svg className="h-[18px] w-[18px]" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google
          </button>
          <button
            type="button"
            onClick={() => handleOAuth("apple")}
            className="flex items-center justify-center gap-2 rounded-xl border border-warm-200 bg-surface py-2.5 text-sm font-medium text-warm-700 transition-colors hover:bg-warm-50 active:scale-[0.98]"
          >
            <svg
              className="h-[18px] w-[18px]"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
            </svg>
            Apple
          </button>
        </div>

        {/* Demo divider */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-warm-200" />
          <span className="text-xs text-warm-400">or explore the app</span>
          <div className="h-px flex-1 bg-warm-200" />
        </div>

        {/* Try Demo */}
        <button
          type="button"
          onClick={handleDemoLogin}
          disabled={demoLoading}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-blush-200 bg-blush-50 py-2.5 text-sm font-semibold text-blush-600 transition-all hover:bg-blush-100 disabled:opacity-50 active:scale-[0.98]"
        >
          <Sparkles className="h-4 w-4" />
          {demoLoading ? "Loading demo\u2026" : "Try Demo"}
        </button>
      </div>

      {/* Footer link */}
      <p className="mt-6 text-sm text-warm-400">
        Don&rsquo;t have an account?{" "}
        <Link
          href="/signup"
          className="font-medium text-blush-500 hover:text-blush-600"
        >
          Create one
        </Link>
      </p>
    </div>
  );
}
