"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthShell, { authInputClass, authLabelClass } from "@/components/AuthShell";
import { useAuth } from "@/context/AuthContext";

export default function SignUpPageClient() {
  const router = useRouter();
  const { signup, isAuthenticated, hydrated } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (hydrated && isAuthenticated) router.replace("/profile");
  }, [hydrated, isAuthenticated, router]);

  const onChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name.trim() || !form.email.trim() || !form.password) {
      setError("Name, email, and password are required.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);
    try {
      await signup({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        password: form.password,
      });
      router.push("/profile");
    } catch (err) {
      setError(err.message || "Unable to create account.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthShell
      mode="signup"
      headline="Start sleeping better tonight."
      support="Create your CloudyNap account for faster checkout, delivery updates, and a home for your favorites."
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className={authLabelClass}>
            Full name
          </label>
          <input
            id="name"
            autoComplete="name"
            value={form.name}
            onChange={onChange("name")}
            className={authInputClass}
            placeholder="Your full name"
          />
        </div>

        <div>
          <label htmlFor="email" className={authLabelClass}>
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={onChange("email")}
            className={authInputClass}
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="phone" className={authLabelClass}>
            Phone{" "}
            <span className="font-normal normal-case tracking-normal text-[#94A3B8]">
              optional
            </span>
          </label>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            value={form.phone}
            onChange={onChange("phone")}
            className={authInputClass}
            placeholder="03XX XXXXXXX"
          />
        </div>

        <div>
          <div className="flex items-center justify-between gap-3">
            <label htmlFor="password" className={authLabelClass}>
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#2F7BFF] transition-colors hover:text-[#2569e0]"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            value={form.password}
            onChange={onChange("password")}
            className={authInputClass}
            placeholder="At least 6 characters"
          />
        </div>

        <div>
          <label htmlFor="confirm" className={authLabelClass}>
            Confirm password
          </label>
          <input
            id="confirm"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            value={form.confirm}
            onChange={onChange("confirm")}
            className={authInputClass}
            placeholder="Re-enter password"
          />
        </div>

        {error ? (
          <p className="text-[13px] font-medium text-[#B91C1C]">{error}</p>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className="mt-1 flex h-12 w-full items-center justify-center bg-[#2F7BFF] text-[12px] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#2569e0] disabled:opacity-60"
        >
          {submitting ? "Creating account…" : "Create account"}
        </button>
      </form>
    </AuthShell>
  );
}
