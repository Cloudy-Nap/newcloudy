"use client";

import Image from "next/image";
import Link from "next/link";

export const authInputClass =
  "mt-2 w-full rounded-none border-0 border-b border-[#D6E6F8] bg-transparent px-0 py-3.5 text-[15px] text-[#0B1F3A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#2F7BFF]";

export const authLabelClass =
  "text-[11px] font-semibold uppercase tracking-[0.16em] text-[#64748B]";

export default function AuthShell({
  mode = "signin",
  headline,
  support,
  children,
}) {
  const isSignIn = mode === "signin";

  return (
    <div className="relative min-h-dvh overflow-hidden font-sans text-slate-900">
      {/* Atmosphere — no product photos */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[#EAF3FF]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 80% 60% at 10% 10%, rgba(47,123,255,0.28), transparent 55%),
            radial-gradient(ellipse 70% 50% at 90% 0%, rgba(255,255,255,0.9), transparent 45%),
            radial-gradient(ellipse 60% 45% at 70% 100%, rgba(47,123,255,0.18), transparent 50%),
            linear-gradient(160deg, #F8FBFF 0%, #EAF3FF 45%, #D6E8FF 100%)
          `,
        }}
      />
      <div
        aria-hidden="true"
        className="auth-grain pointer-events-none absolute inset-0 opacity-[0.35]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-1/4 h-[28rem] w-[28rem] rounded-full bg-[#2F7BFF]/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 bottom-0 h-[22rem] w-[22rem] rounded-full bg-white/70 blur-3xl"
      />

      <div className="relative z-10 mx-auto flex min-h-dvh w-full max-w-[1200px] flex-col px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
        <header className="auth-fade-up flex items-center justify-between gap-4">
          <Link href="/" className="inline-flex items-center" aria-label="CloudyNap home">
            <Image
              src="/cloudynap1.png"
              alt="CloudyNap"
              width={2172}
              height={724}
              className="h-9 w-auto max-w-[156px] object-contain sm:h-10 sm:max-w-[180px]"
              priority
            />
          </Link>
          <Link
            href="/"
            className="text-[13px] font-medium text-[#475569] transition-colors hover:text-[#2F7BFF]"
          >
            Back to shop
          </Link>
        </header>

        <div className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-6">
          {/* Brand story — typography as the visual */}
          <div className="max-w-xl">
            <p className="auth-fade-up text-[11px] font-semibold uppercase tracking-[0.2em] text-[#2F7BFF]">
              CloudyNap
            </p>
            <h1 className="auth-fade-up auth-fade-up-delay-1 mt-4 font-serif text-[clamp(2.4rem,5.5vw,4.4rem)] font-medium leading-[1.02] tracking-[-0.03em] text-[#0B1F3A]">
              {headline}
            </h1>
            <p className="auth-fade-up auth-fade-up-delay-2 mt-5 max-w-md text-[15px] leading-[1.65] text-[#475569] sm:text-[16px]">
              {support}
            </p>
          </div>

          {/* Form — soft surface, not a heavy card */}
          <div className="auth-fade-up auth-fade-up-delay-1 relative">
            <div
              aria-hidden="true"
              className="absolute -inset-4 rounded-[2rem] bg-white/50 blur-xl sm:-inset-6"
            />
            <div className="relative rounded-[1.5rem] border border-white/80 bg-white/70 px-5 py-7 shadow-[0_20px_60px_rgba(15,55,120,0.08)] backdrop-blur-xl sm:px-8 sm:py-9">
              <div className="flex items-end justify-between gap-3">
                <div>
                  <h2 className="font-serif text-[1.75rem] font-medium tracking-[-0.02em] text-[#0B1F3A] sm:text-[2rem]">
                    {isSignIn ? "Sign in" : "Create account"}
                  </h2>
                  <p className="mt-1.5 text-[13px] text-[#64748B]">
                    {isSignIn
                      ? "Pick up your orders, cart, and profile."
                      : "Faster checkout and delivery updates."}
                  </p>
                </div>
              </div>

              <div className="mt-7">{children}</div>

              <p className="mt-7 text-center text-[13px] text-[#64748B]">
                {isSignIn ? (
                  <>
                    New here?{" "}
                    <Link
                      href="/signup"
                      className="font-semibold text-[#2F7BFF] transition-colors hover:text-[#2569e0]"
                    >
                      Create an account
                    </Link>
                  </>
                ) : (
                  <>
                    Already with us?{" "}
                    <Link
                      href="/signin"
                      className="font-semibold text-[#2F7BFF] transition-colors hover:text-[#2569e0]"
                    >
                      Sign in
                    </Link>
                  </>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
