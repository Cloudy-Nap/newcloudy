"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { formatPrice, parsePrice, useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { createOrder } from "@/lib/storeApi";

const inputClass =
  "mt-1.5 w-full rounded-xl border border-[#C7DBF5] bg-[#F8FBFF] px-3.5 py-2.5 text-[14px] text-[#0B1F3A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#2F7BFF] focus:bg-white focus:ring-1 focus:ring-[#2F7BFF]/30";

const labelClass =
  "text-[12px] font-semibold uppercase tracking-[0.08em] text-[#2F7BFF]";

export default function CheckoutPageClient() {
  const router = useRouter();
  const { user } = useAuth();
  const { items, hydrated, itemCount, subtotal, clearCart } = useCart();
  const [payment, setPayment] = useState("cod");
  const [submitting, setSubmitting] = useState(false);
  const [placed, setPlaced] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postal: "",
    notes: "",
  });

  useEffect(() => {
    if (!user) return;
    setForm((prev) => ({
      ...prev,
      fullName: prev.fullName || user.name || "",
      email: prev.email || user.email || "",
      phone: prev.phone || user.phone || "",
      address: prev.address || user.address?.line1 || "",
      city: prev.city || user.address?.city || "",
      postal: prev.postal || user.address?.postal || "",
    }));
  }, [user]);

  const total = subtotal;
  const tax = Math.round(subtotal * 0.02);

  const canSubmit = useMemo(() => {
    return (
      items.length > 0 &&
      form.fullName.trim() &&
      form.email.trim() &&
      form.phone.trim() &&
      form.address.trim() &&
      form.city.trim()
    );
  }, [items.length, form]);

  const onChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    setError("");

    const nameParts = form.fullName.trim().split(/\s+/).filter(Boolean);
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";

    const shippingAddress = {
      name: form.fullName.trim(),
      line1: form.address.trim(),
      city: form.city.trim(),
      postal_code: form.postal.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      country: "Pakistan",
    };

    try {
      const payload = {
        userId: user?.id || null,
        status: "pending",
        totals: {
          subtotal,
          tax,
          shipping: 0,
          total: subtotal + tax,
          discount: 0,
        },
        shippingAddress,
        billingAddress: shippingAddress,
        paymentMethod: payment === "cod" ? "Cash on Delivery" : "Card / Bank Transfer",
        items: items.map((item) => ({
          productId: item.productId || item.id,
          id: item.productId || item.id,
          name: item.name,
          price: parsePrice(item.price),
          quantity: item.quantity,
          metadata: {
            type: item.type,
            size: item.size,
            thickness: item.thickness,
            variantId: item.variantId,
            image: item.image,
            slug: item.slug,
          },
        })),
        customer: {
          firstName,
          lastName,
          email: form.email.trim(),
          phone: form.phone.trim(),
        },
        orderNotes: form.notes.trim(),
      };

      const result = await createOrder(payload);
      const tracking =
        result?.order?.tracking_number ||
        result?.tracking_number ||
        result?.order?.id ||
        "Placed";
      setOrderId(String(tracking));
      setPlaced(true);
      clearCart();
    } catch (err) {
      setError(err.message || "Failed to place order. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-full bg-gradient-to-b from-[#EAF3FF] via-[#F5F9FF] to-white font-sans text-slate-900">
      <Navbar variant="solid" />

      <main className="w-full">
        <div className="mx-auto w-full max-w-[1800px] px-3 pb-12 pt-4 sm:px-8 sm:pb-16 sm:pt-6 lg:px-8 xl:px-10">
          <header className="mb-6 max-w-3xl sm:mb-8 lg:mb-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#2F7BFF]">
              Checkout
            </p>
            <h1 className="mt-2 font-serif text-[clamp(1.85rem,4vw,3rem)] font-medium leading-[1.1] tracking-[-0.02em] text-[#0B1F3A]">
              {placed ? "Order Confirmed" : "Complete Your Order"}
            </h1>
            <p className="mt-3 max-w-2xl text-[14px] leading-[1.6] text-[#475569] sm:mt-4 sm:text-[16px]">
              {placed
                ? "Thanks for shopping with CloudyNap — we’ll be in touch shortly."
                : "Enter your delivery details and preferred payment method to place your order."}
            </p>
          </header>

          {!hydrated ? (
            <div className="rounded-2xl border border-[#C7DBF5] bg-white px-6 py-16 text-center shadow-[0_8px_28px_rgba(47,123,255,0.06)]">
              <p className="text-[14px] text-[#64748B]">Loading checkout…</p>
            </div>
          ) : placed ? (
            <div className="rounded-2xl border border-[#C7DBF5] bg-white px-6 py-14 text-center shadow-[0_8px_28px_rgba(47,123,255,0.06)] sm:px-10">
              <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#2F7BFF]">
                Order {orderId}
              </p>
              <p className="mt-3 text-[1.15rem] font-semibold text-[#0B1F3A]">
                Your order has been placed successfully
              </p>
              <p className="mx-auto mt-2 max-w-md text-[14px] text-[#64748B]">
                A confirmation will be sent to your email. Free express delivery
                applies across Pakistan.
              </p>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
                <Link
                  href="/"
                  className="inline-flex rounded-full bg-[#2F7BFF] px-5 py-2.5 text-[13px] font-semibold text-white shadow-[0_6px_16px_rgba(47,123,255,0.25)] transition-colors hover:bg-[#2569e0]"
                >
                  Back to Home
                </Link>
                <Link
                  href="/mattresses"
                  className="inline-flex rounded-full border border-[#C7DBF5] bg-[#F8FBFF] px-5 py-2.5 text-[13px] font-semibold text-[#0B1F3A] transition-colors hover:border-[#2F7BFF] hover:text-[#2F7BFF]"
                >
                  Keep Shopping
                </Link>
              </div>
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-2xl border border-[#C7DBF5] bg-white px-6 py-16 text-center shadow-[0_8px_28px_rgba(47,123,255,0.06)]">
              <p className="text-[1.05rem] font-semibold text-[#0B1F3A]">
                Nothing to checkout
              </p>
              <p className="mt-2 text-[14px] text-[#64748B]">
                Add products to your cart before completing an order.
              </p>
              <button
                type="button"
                onClick={() => router.push("/cart")}
                className="mt-5 inline-flex rounded-full bg-[#2F7BFF] px-5 py-2.5 text-[13px] font-semibold text-white shadow-[0_6px_16px_rgba(47,123,255,0.25)] transition-colors hover:bg-[#2569e0]"
              >
                Go to Cart
              </button>
            </div>
          ) : (
            <form
              onSubmit={onSubmit}
              className="flex flex-col gap-2 md:gap-3 lg:flex-row lg:items-start"
            >
              <div className="min-w-0 flex-1 space-y-2 md:space-y-3">
                <section className="rounded-2xl border border-[#C7DBF5] bg-white p-4 shadow-[0_8px_28px_rgba(47,123,255,0.06)] sm:p-5">
                  <h2 className="text-[1.05rem] font-bold tracking-[-0.02em] text-[#0B1F3A]">
                    Contact Details
                  </h2>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label htmlFor="fullName" className={labelClass}>
                        Full name
                      </label>
                      <input
                        id="fullName"
                        name="fullName"
                        required
                        autoComplete="name"
                        value={form.fullName}
                        onChange={onChange("fullName")}
                        className={inputClass}
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className={labelClass}>
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        value={form.email}
                        onChange={onChange("email")}
                        className={inputClass}
                        placeholder="you@example.com"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className={labelClass}>
                        Phone
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        required
                        autoComplete="tel"
                        value={form.phone}
                        onChange={onChange("phone")}
                        className={inputClass}
                        placeholder="03XX XXXXXXX"
                      />
                    </div>
                  </div>
                </section>

                <section className="rounded-2xl border border-[#C7DBF5] bg-white p-4 shadow-[0_8px_28px_rgba(47,123,255,0.06)] sm:p-5">
                  <h2 className="text-[1.05rem] font-bold tracking-[-0.02em] text-[#0B1F3A]">
                    Delivery Address
                  </h2>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="sm:col-span-2">
                      <label htmlFor="address" className={labelClass}>
                        Street address
                      </label>
                      <input
                        id="address"
                        name="address"
                        required
                        autoComplete="street-address"
                        value={form.address}
                        onChange={onChange("address")}
                        className={inputClass}
                        placeholder="House / street / area"
                      />
                    </div>
                    <div>
                      <label htmlFor="city" className={labelClass}>
                        City
                      </label>
                      <input
                        id="city"
                        name="city"
                        required
                        autoComplete="address-level2"
                        value={form.city}
                        onChange={onChange("city")}
                        className={inputClass}
                        placeholder="Karachi"
                      />
                    </div>
                    <div>
                      <label htmlFor="postal" className={labelClass}>
                        Postal code
                      </label>
                      <input
                        id="postal"
                        name="postal"
                        autoComplete="postal-code"
                        value={form.postal}
                        onChange={onChange("postal")}
                        className={inputClass}
                        placeholder="Optional"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor="notes" className={labelClass}>
                        Order notes
                      </label>
                      <textarea
                        id="notes"
                        name="notes"
                        rows={3}
                        value={form.notes}
                        onChange={onChange("notes")}
                        className={`${inputClass} resize-y`}
                        placeholder="Delivery instructions (optional)"
                      />
                    </div>
                  </div>
                </section>

                <section className="rounded-2xl border border-[#C7DBF5] bg-white p-4 shadow-[0_8px_28px_rgba(47,123,255,0.06)] sm:p-5">
                  <h2 className="text-[1.05rem] font-bold tracking-[-0.02em] text-[#0B1F3A]">
                    Payment Method
                  </h2>
                  <div className="mt-4 space-y-2.5">
                    {[
                      {
                        id: "cod",
                        label: "Cash on Delivery",
                        hint: "Pay when your order arrives",
                      },
                      {
                        id: "card",
                        label: "Card / Bank Transfer",
                        hint: "We’ll confirm payment details by email",
                      },
                    ].map((option) => {
                      const active = payment === option.id;
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => setPayment(option.id)}
                          className={`flex w-full items-start justify-between rounded-xl border px-4 py-3 text-left transition ${
                            active
                              ? "border-[#2F7BFF] bg-[#EEF5FF] shadow-[0_4px_14px_rgba(47,123,255,0.12)]"
                              : "border-[#C7DBF5] bg-[#F8FBFF] hover:border-[#2F7BFF]/50"
                          }`}
                        >
                          <span>
                            <span className="block text-[14px] font-semibold text-[#0B1F3A]">
                              {option.label}
                            </span>
                            <span className="mt-0.5 block text-[12px] text-[#64748B]">
                              {option.hint}
                            </span>
                          </span>
                          <span
                            className={`mt-1 h-4 w-4 shrink-0 rounded-full border-2 ${
                              active
                                ? "border-[#2F7BFF] bg-[#2F7BFF] shadow-[inset_0_0_0_2px_white]"
                                : "border-[#94A3B8] bg-white"
                            }`}
                            aria-hidden="true"
                          />
                        </button>
                      );
                    })}
                  </div>
                </section>
              </div>

              <aside className="w-full shrink-0 rounded-2xl border border-[#C7DBF5] bg-white p-5 shadow-[0_8px_28px_rgba(47,123,255,0.06)] lg:sticky lg:top-6 lg:w-[360px]">
                <h2 className="text-[1.05rem] font-bold tracking-[-0.02em] text-[#0B1F3A]">
                  Order Summary
                </h2>
                <p className="mt-1 text-[13px] text-[#64748B]">
                  {itemCount} {itemCount === 1 ? "item" : "items"}
                </p>

                <ul className="mt-4 max-h-56 space-y-3 overflow-y-auto border-b border-[#D6E6F8] pb-4">
                  {items.map((item) => (
                    <li key={item.key} className="flex gap-3">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-[#F4F7FA]">
                        <Image
                          src={item.image}
                          alt=""
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13px] font-semibold text-[#0B1F3A]">
                          {item.name}
                        </p>
                        <p className="mt-0.5 text-[12px] text-[#64748B]">
                          Qty {item.quantity}
                          {item.size ? ` · ${item.size}` : ""}
                          {item.thickness ? ` · ${item.thickness}` : ""}
                        </p>
                      </div>
                      <p className="shrink-0 text-[13px] font-semibold text-[#0B1F3A]">
                        {item.price}
                      </p>
                    </li>
                  ))}
                </ul>

                <dl className="mt-4 space-y-3 text-[14px]">
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-[#64748B]">Subtotal</dt>
                    <dd className="font-semibold text-[#0B1F3A]">
                      {formatPrice(subtotal)}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-[#64748B]">Tax (2%)</dt>
                    <dd className="font-semibold text-[#0B1F3A]">
                      {formatPrice(tax)}
                    </dd>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <dt className="text-[#64748B]">Shipping</dt>
                    <dd className="font-semibold text-[#2F7BFF]">Free</dd>
                  </div>
                  <div className="flex items-center justify-between gap-3 border-t border-[#D6E6F8] pt-3">
                    <dt className="text-[15px] font-bold text-[#0B1F3A]">Total</dt>
                    <dd className="text-[1.15rem] font-bold text-[#0B1F3A]">
                      {formatPrice(total + tax)}
                    </dd>
                  </div>
                </dl>

                {error ? (
                  <p className="mt-3 text-[13px] font-medium text-[#B91C1C]">{error}</p>
                ) : null}

                <button
                  type="submit"
                  disabled={!canSubmit || submitting}
                  className="mt-6 flex h-12 w-full items-center justify-center rounded-full bg-[#2F7BFF] text-[14px] font-semibold text-white shadow-[0_6px_16px_rgba(47,123,255,0.25)] transition-colors hover:bg-[#2569e0] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? "Placing order…" : "Place Order"}
                </button>
                <Link
                  href="/cart"
                  className="mt-2.5 flex h-11 w-full items-center justify-center rounded-full border border-[#C7DBF5] bg-[#F8FBFF] text-[13px] font-semibold text-[#0B1F3A] transition-colors hover:border-[#2F7BFF] hover:text-[#2F7BFF]"
                >
                  Back to Cart
                </Link>
              </aside>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
