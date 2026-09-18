"use client";

import { Suspense } from "react";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push(redirect);
    router.refresh();
  };

  return (
    <div className="w-full max-w-sm">
      {/* Branding */}
      <div className="text-center mb-8">
        <h1 className="font-heading text-3xl font-bold text-deep-green mb-1">
          TapDine
        </h1>
        <p className="text-warm-gray text-sm font-body">
          Restaurant Dashboard
        </p>
      </div>

      {/* Login Card */}
      <div className="bg-warm-white rounded-2xl shadow-lg border border-border-light p-8">
        <h2 className="font-heading text-xl font-semibold text-charcoal text-center mb-6">
          Sign in to your dashboard
        </h2>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-medium text-charcoal-light mb-1.5 font-body"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-border-light bg-ivory text-charcoal text-sm font-body focus:outline-none focus:ring-2 focus:ring-deep-green/30 focus:border-deep-green transition-colors"
              placeholder="you@restaurant.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-xs font-medium text-charcoal-light mb-1.5 font-body"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl border border-border-light bg-ivory text-charcoal text-sm font-body focus:outline-none focus:ring-2 focus:ring-deep-green/30 focus:border-deep-green transition-colors"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-600 text-xs text-center font-body bg-red-50 rounded-lg p-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-deep-green hover:bg-deep-green-light text-white font-semibold text-sm font-body transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>

      <p className="text-warm-gray/60 text-[10px] text-center mt-6 font-body">
        Powered by TapDine
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-dvh bg-ivory flex items-center justify-center px-5">
      <Suspense fallback={<div className="text-warm-gray text-sm font-body">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
