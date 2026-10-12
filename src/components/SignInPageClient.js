"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthShell, { authInputClass, authLabelClass } from "@/components/AuthShell";
import { useAuth } from "@/context/AuthContext";

export default function SignInPageClient() {
  const router = useRouter();
  const { login, isAuthenticated, hydrated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (hydrated && isAuthenticated) router.replace("/profile");
  }, [hydrated, isAuthenticated, router]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Enter your email and password to continue.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);
    try {
      await login({ email: email.trim(), password });
      router.push("/profile");
    } catch (err) {
      setError(err.message || "Unable to sign in. Check your credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      mode="signin"
      headline="Welcome back to quieter nights."
      support="Sign in to track deliveries, manage your profile, and continue shopping where you left off."
    >
      <form onSubmit={onSubmit} className="space-y-5">
        <div>
          <label htmlFor="email" className={authLabelClass}>
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={authInputClass}
            placeholder="you@example.com"
          />
        </div>

        <div>
          <div className="flex items-center justify-between gap-3">
            <label htmlFor="password" className={authLabelClass}>
              Password
            </label>
            <button
              type="button"
              className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#2F7BFF] transition-colors hover:text-[#2569e0]"
            >
              Forgot?
            </button>
          </div>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`${authInputClass} pr-14`}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-0 top-1/2 -translate-y-1/2 text-[12px] font-semibold text-[#64748B] transition-colors hover:text-[#2F7BFF]"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {error ? (
          <p className="text-[13px] font-medium text-[#B91C1C]">{error}</p>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="mt-1 flex h-12 w-full items-center justify-center bg-[#2F7BFF] text-[12px] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#2569e0] disabled:opacity-60"
        >
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </AuthShell>
  );
}
