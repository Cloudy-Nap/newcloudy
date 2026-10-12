"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { formatPrice, useCart } from "@/context/CartContext";

export default function CartPageClient() {
  const {
    items,
    hydrated,
    itemCount,
    subtotal,
    updateQuantity,
    removeItem,
  } = useCart();

  const shipping = itemCount > 0 ? 0 : 0;
  const total = subtotal + shipping;

  return (
    <div className="relative min-h-full bg-gradient-to-b from-[#EAF3FF] via-[#F5F9FF] to-white font-sans text-slate-900">
      <Navbar variant="solid" />

      <main className="w-full">
        <div className="mx-auto w-full max-w-[1800px] px-3 pb-12 pt-4 sm:px-8 sm:pb-16 sm:pt-6 lg:px-8 xl:px-10">
          <header className="mb-6 max-w-3xl sm:mb-8 lg:mb-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#2F7BFF]">
              Your Cart
            </p>
            <h1 className="mt-2 font-serif text-[clamp(1.85rem,4vw,3rem)] font-medium leading-[1.1] tracking-[-0.02em] text-[#0B1F3A]">
              Shopping Cart
            </h1>
            <p className="mt-3 max-w-2xl text-[14px] leading-[1.6] text-[#475569] sm:mt-4 sm:text-[16px]">
              Review your items, update quantities, and continue to checkout when
              you&apos;re ready.
            </p>
          </header>

          {!hydrated ? (
            <div className="rounded-2xl border border-[#C7DBF5] bg-white px-6 py-16 text-center shadow-[0_8px_28px_rgba(47,123,255,0.06)]">
              <p className="text-[14px] text-[#64748B]">Loading your cart…</p>
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-2xl border border-[#C7DBF5] bg-white px-6 py-16 text-center shadow-[0_8px_28px_rgba(47,123,255,0.06)]">
              <p className="text-[1.05rem] font-semibold text-[#0B1F3A]">
                Your cart is empty
              </p>
              <p className="mt-2 text-[14px] text-[#64748B]">
                Browse mattresses, sofas, and more — then add your favorites here.
              </p>
              <Link
                href="/mattresses"
                className="mt-5 inline-flex rounded-full bg-[#2F7BFF] px-5 py-2.5 text-[13px] font-semibold text-white shadow-[0_6px_16px_rgba(47,123,255,0.25)] transition-colors hover:bg-[#2569e0]"
              >
                Shop Mattresses
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-2 md:gap-3 lg:flex-row lg:items-start">
              <div className="min-w-0 flex-1 space-y-2 md:space-y-3">
                {items.map((item) => {
                  const href = item.slug ? `/product/${item.slug}` : "#";
                  const lineTotal =
                    Number(String(item.price).replace(/[^\d]/g, "") || 0) *
                    item.quantity;

                  return (
                    <article
                      key={item.key}
                      className="flex flex-col gap-4 rounded-2xl border border-[#C7DBF5] bg-white p-3.5 shadow-[0_8px_28px_rgba(47,123,255,0.06)] sm:flex-row sm:items-center sm:gap-5 sm:p-4"
                    >
                      <Link
                        href={href}
                        className="relative h-28 w-full shrink-0 overflow-hidden rounded-xl bg-[#F4F7FA] sm:h-28 sm:w-36"
                      >
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover object-center"
                          sizes="144px"
                        />
                      </Link>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <Link
                              href={href}
                              className="block truncate text-[15px] font-semibold tracking-[-0.01em] text-[#0B1F3A] transition-colors hover:text-[#2F7BFF]"
                            >
                              {item.name}
                            </Link>
                            {item.size ? (
                              <p className="mt-1 text-[13px] text-[#64748B]">
                                Size:{" "}
                                <span className="font-medium text-[#0B1F3A]">
                                  {item.size}
                                </span>
                              </p>
                            ) : null}
                            {item.thickness ? (
                              <p className="mt-0.5 text-[13px] text-[#64748B]">
                                Thickness:{" "}
                                <span className="font-medium text-[#0B1F3A]">
                                  {item.thickness}
                                </span>
                              </p>
                            ) : null}
                            <p className="mt-1.5 text-[14px] font-bold text-[#0B1F3A]">
                              {item.price}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeItem(item.key)}
                            className="shrink-0 text-[12px] font-medium text-[#64748B] transition-colors hover:text-[#2F7BFF]"
                          >
                            Remove
                          </button>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                          <div className="inline-flex items-center overflow-hidden rounded-full border border-[#C7DBF5] bg-[#F8FBFF]">
                            <button
                              type="button"
                              aria-label={`Decrease quantity of ${item.name}`}
                              onClick={() =>
                                updateQuantity(item.key, item.quantity - 1)
                              }
                              className="px-3.5 py-2 text-[15px] font-medium text-[#2F7BFF] transition hover:bg-[#EEF5FF]"
                            >
                              −
                            </button>
                            <span className="min-w-[2rem] text-center text-[13px] font-semibold text-[#0B1F3A]">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              aria-label={`Increase quantity of ${item.name}`}
                              onClick={() =>
                                updateQuantity(item.key, item.quantity + 1)
                              }
                              className="px-3.5 py-2 text-[15px] font-medium text-[#2F7BFF] transition hover:bg-[#EEF5FF]"
                            >
                              +
                            </button>
                          </div>
                          <p className="text-[14px] font-bold text-[#0B1F3A]">
                            {formatPrice(lineTotal)}
                          </p>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              <aside className="w-full shrink-0 rounded-2xl border border-[#C7DBF5] bg-white p-5 shadow-[0_8px_28px_rgba(47,123,255,0.06)] lg:sticky lg:top-6 lg:w-[340px]">
                <h2 className="text-[1.05rem] font-bold tracking-[-0.02em] text-[#0B1F3A]">
                  Order Summary
                </h2>
                <p className="mt-1 text-[13px] text-[#64748B]">
                  {itemCount} {itemCount === 1 ? "item" : "items"}
                </p>

                <dl className="mt-5 space-y-3 border-b border-[#D6E6F8] pb-5 text-[14px]">
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-[#64748B]">Subtotal</dt>
                    <dd className="font-semibold text-[#0B1F3A]">
                      {formatPrice(subtotal)}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-[#64748B]">Shipping</dt>
                    <dd className="font-semibold text-[#2F7BFF]">Free</dd>
                  </div>
                </dl>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <p className="text-[15px] font-bold text-[#0B1F3A]">Total</p>
                  <p className="text-[1.15rem] font-bold text-[#0B1F3A]">
                    {formatPrice(total)}
                  </p>
                </div>

                <Link
                  href="/checkout"
                  className="mt-6 flex h-12 w-full items-center justify-center rounded-full bg-[#2F7BFF] text-[14px] font-semibold text-white shadow-[0_6px_16px_rgba(47,123,255,0.25)] transition-colors hover:bg-[#2569e0]"
                >
                  Proceed to Checkout
                </Link>
                <Link
                  href="/mattresses"
                  className="mt-2.5 flex h-11 w-full items-center justify-center rounded-full border border-[#C7DBF5] bg-[#F8FBFF] text-[13px] font-semibold text-[#0B1F3A] transition-colors hover:border-[#2F7BFF] hover:text-[#2F7BFF]"
                >
                  Continue Shopping
                </Link>
              </aside>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
