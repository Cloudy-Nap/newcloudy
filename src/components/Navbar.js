"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
  { label: "Mattresses", href: "/mattresses" },
  { label: "Sofas", href: "/sofas", hasChevron: true },
  { label: "Furniture", href: "/furniture" },
  { label: "Accessories", href: "/accessories" },
  { label: "Pillows", href: "/pillows" },
  { label: "Offers", href: "/mattresses" },
];

function SearchIcon({ className = "h-4 w-4" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function UserIcon({ className = "h-[18px] w-[18px]" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="8" r="3.25" />
      <path d="M5.5 19.25c1.6-3.1 4-4.75 6.5-4.75s4.9 1.65 6.5 4.75" />
    </svg>
  );
}

function CartIcon({ className = "h-[18px] w-[18px]" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3.5 5h1.6l1.3 11.2a1.5 1.5 0 0 0 1.5 1.3h9.4a1.5 1.5 0 0 0 1.5-1.25L20.5 8H7" />
      <circle cx="9.5" cy="20" r="1.25" />
      <circle cx="17" cy="20" r="1.25" />
    </svg>
  );
}

function ChevronDownIcon({ className = "h-3 w-3" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function MenuIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  );
}

function CloseIcon({ className = "h-5 w-5" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

function SearchField({ className = "" }) {
  return (
    <div className={`relative flex min-w-0 items-center ${className}`}>
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
        <SearchIcon />
      </span>
      <input
        type="search"
        placeholder="Search for products"
        aria-label="Search for products"
        className="h-9 w-full rounded-full border border-white/50 bg-white/70 py-1.5 pl-9 pr-4 text-[13px] font-normal text-slate-700 outline-none backdrop-blur-md placeholder:font-normal placeholder:text-slate-500 focus:border-white/80 focus:bg-white/85 focus:ring-1 focus:ring-white/50"
      />
    </div>
  );
}

export default function Navbar({ variant = "overlay" }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const isSolid = variant === "solid";
  const { itemCount } = useCart();
  const { isAuthenticated, hydrated } = useAuth();
  const cartCountLabel = itemCount > 99 ? "99+" : String(itemCount);
  const accountHref = !hydrated || isAuthenticated ? "/profile" : "/signin";

  return (
    <header
      className={
        isSolid
          ? "relative z-50 w-full bg-[#F5F7FA] px-3 pt-2 max-md:px-3 max-md:pt-2 sm:px-6 sm:pt-4 lg:px-8 lg:pt-5 xl:px-10"
          : "pointer-events-none absolute inset-x-0 top-0 z-50 w-full px-3 pt-2 max-md:px-3 max-md:pt-2 sm:px-6 sm:pt-4 lg:px-8 lg:pt-5 xl:px-10"
      }
    >
      <div
        className={
          isSolid
            ? "relative mx-auto w-full max-w-[1800px]"
            : "pointer-events-auto relative mx-auto w-full max-w-[1800px]"
        }
      >
        <div
          className={
            isSolid
              ? "relative rounded-[0.95rem] border border-[#E5EAF0] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04)] sm:rounded-[1.05rem]"
              : "relative rounded-[0.95rem] border border-white/70 bg-white/75 shadow-[0_8px_32px_rgba(15,23,42,0.08)] backdrop-blur-2xl backdrop-saturate-150 sm:rounded-[1.05rem]"
          }
        >
          <div className="relative z-[51] flex items-center gap-2.5 px-3 py-2 max-md:gap-2 sm:gap-4 sm:px-5 sm:py-2.5 lg:gap-5 lg:px-6 lg:py-2.5">
            <button
              type="button"
              className="inline-flex shrink-0 items-center justify-center text-[#0B1F3A] transition-colors hover:text-slate-700 md:hidden"
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen((open) => !open)}
            >
              {mobileOpen ? <CloseIcon /> : <MenuIcon />}
            </button>

            <Link
              href="/"
              className="flex shrink-0 items-center"
              aria-label="CloudyNap home"
            >
              <Image
                src="/cloudynap1.png"
                alt="CloudyNap"
                width={2172}
                height={724}
                className="h-8 w-auto max-w-[132px] object-contain sm:h-10 sm:max-w-[172px] max-md:h-8 max-md:max-w-[128px]"
                priority
              />
            </Link>

            <nav
              className="ml-1 hidden min-w-0 items-center gap-5 xl:gap-6 lg:flex"
              aria-label="Primary"
            >
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="inline-flex items-center gap-0.5 whitespace-nowrap text-[13px] font-medium tracking-[-0.01em] text-[#0B1F3A] transition-colors hover:text-slate-700"
                >
                  {link.label}
                  {link.hasChevron ? (
                    <ChevronDownIcon className="mt-px text-[#475569]" />
                  ) : null}
                </Link>
              ))}
            </nav>

            <div className="min-w-2 flex-1" />

            <button
              type="button"
              className="inline-flex shrink-0 items-center justify-center text-[#0B1F3A] transition-colors hover:text-slate-700 md:hidden"
              aria-label="Search"
            >
              <SearchIcon className="h-[18px] w-[18px]" />
            </button>

            <SearchField className="hidden w-full max-w-[260px] md:flex lg:max-w-[230px] xl:max-w-[260px]" />

            <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
              <Link
                href={accountHref}
                className="inline-flex items-center justify-center text-[#0B1F3A] transition-colors hover:text-slate-700"
                aria-label={isAuthenticated ? "Account" : "Sign in"}
              >
                <UserIcon />
              </Link>

              <Link
                href="/cart"
                className="relative inline-flex items-center justify-center text-[#0B1F3A] transition-colors hover:text-slate-700"
                aria-label={`Shopping cart, ${itemCount} ${itemCount === 1 ? "item" : "items"}`}
              >
                <CartIcon />
                <span className="absolute -right-1.5 -top-1.5 flex h-[14px] min-w-[14px] items-center justify-center rounded-full bg-[#2F7BFF] px-[3px] text-[9px] font-medium leading-none text-white">
                  {cartCountLabel}
                </span>
              </Link>

              <button
                type="button"
                className="hidden items-center justify-center text-[#0B1F3A] transition-colors hover:text-slate-700 md:inline-flex lg:hidden"
                aria-expanded={mobileOpen}
                aria-controls="mobile-nav"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                onClick={() => setMobileOpen((open) => !open)}
              >
                {mobileOpen ? <CloseIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>

          {mobileOpen ? (
            <>
              <button
                type="button"
                aria-label="Close menu"
                className="fixed inset-0 z-40 bg-black/10 lg:hidden"
                onClick={() => setMobileOpen(false)}
              />
              <div
                id="mobile-nav"
                className="absolute left-0 right-0 top-full z-50 mt-1.5 rounded-[0.95rem] border border-white/60 bg-white/80 px-4 pb-4 pt-3 shadow-[0_12px_32px_rgba(15,23,42,0.12)] backdrop-blur-2xl sm:rounded-[1.05rem] lg:hidden"
              >
                <nav className="flex flex-col gap-0.5" aria-label="Mobile">
                  {navLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className="inline-flex items-center justify-between rounded-xl px-3 py-2.5 text-[14px] font-normal text-[#475569] transition-colors hover:bg-white/70"
                      onClick={() => setMobileOpen(false)}
                    >
                      <span>{link.label}</span>
                      {link.hasChevron ? <ChevronDownIcon /> : null}
                    </Link>
                  ))}
                </nav>
              </div>
            </>
          ) : null}
        </div>
      </div>
    </header>
  );
}
