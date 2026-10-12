"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  HiOutlineUser,
  HiOutlineClipboardDocumentList,
  HiOutlineMapPin,
  HiOutlineShoppingCart,
  HiOutlineCog6Tooth,
  HiOutlineArrowRightOnRectangle,
  HiOutlineTruck,
  HiOutlineCheckCircle,
  HiOutlineClock,
} from "react-icons/hi2";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { formatPrice, useCart } from "@/context/CartContext";
import {
  demoRecentlyViewed,
} from "@/data/profile";
import { useAuth } from "@/context/AuthContext";
import {
  fetchOrders,
  trackOrder,
} from "@/lib/storeApi";
import {
  formatCurrency,
  formatOrderDate,
  getOrderStatusMeta,
  normalizeTrackingNumberInput,
  sanitizeOrderDetailData,
} from "@/app/lib/orderTracking";

const TABS = [
  { id: "overview", label: "Profile", icon: HiOutlineUser },
  { id: "orders", label: "Order History", icon: HiOutlineClipboardDocumentList },
  { id: "track", label: "Track Order", icon: HiOutlineMapPin },
  { id: "cart", label: "Cart", icon: HiOutlineShoppingCart },
  { id: "settings", label: "Settings", icon: HiOutlineCog6Tooth },
  { id: "logout", label: "Log Out", icon: HiOutlineArrowRightOnRectangle },
];

const inputClass =
  "mt-1.5 w-full rounded-xl border border-[#C7DBF5] bg-[#F8FBFF] px-3.5 py-2.5 text-[14px] text-[#0B1F3A] outline-none transition placeholder:text-[#94A3B8] focus:border-[#2F7BFF] focus:bg-white focus:ring-1 focus:ring-[#2F7BFF]/30";

const labelClass =
  "text-[12px] font-semibold uppercase tracking-[0.08em] text-[#2F7BFF]";

function statusClasses(tone) {
  if (tone === "success") return "bg-[#E8F8EF] text-[#15803D]";
  if (tone === "progress") return "bg-[#EEF5FF] text-[#2F7BFF]";
  return "bg-[#F1F5F9] text-[#64748B]";
}

function StatusBadge({ status, tone }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusClasses(tone)}`}
    >
      {status}
    </span>
  );
}

function Panel({ children, className = "" }) {
  return (
    <div
      className={`rounded-2xl border border-[#C7DBF5] bg-white p-4 shadow-[0_8px_28px_rgba(47,123,255,0.06)] sm:p-5 ${className}`}
    >
      {children}
    </div>
  );
}

function SectionTitle({ eyebrow, title, action }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-3">
      <div>
        {eyebrow ? (
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#2F7BFF]">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="mt-0.5 text-[1.05rem] font-bold tracking-[-0.02em] text-[#0B1F3A] sm:text-[1.15rem]">
          {title}
        </h2>
      </div>
      {action || null}
    </div>
  );
}

function toDisplayOrder(raw) {
  const sanitized = sanitizeOrderDetailData(raw);
  if (!sanitized) return null;
  const meta = getOrderStatusMeta(raw.status);
  const tone =
    sanitized.status === "delivered"
      ? "success"
      : sanitized.status === "in_transit"
        ? "progress"
        : "default";

  return {
    id: sanitized.trackingNumber || String(sanitized.number || sanitized.id),
    rawId: sanitized.id,
    trackingNumber: sanitized.trackingNumber,
    date: formatOrderDate(sanitized.placedAt, false),
    status: meta.badge || sanitized.statusBadge || sanitized.status,
    statusTone: tone,
    total: formatCurrency(sanitized.total),
    items: (sanitized.items || []).map((item) => ({
      name: item.name,
      image: item.image || "/mattress.png",
      qty: item.quantity,
    })),
    detail: sanitized,
  };
}

function OrderRow({ order, compact = false }) {
  const image = order.items?.[0]?.image || "/mattress.png";
  return (
    <article className="flex flex-col gap-3 rounded-xl border border-[#E8EEF4] bg-[#F8FBFF] p-3.5 sm:flex-row sm:items-center sm:gap-4">
      <div className="flex min-w-0 flex-1 gap-3">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-white">
          <Image src={image} alt="" fill className="object-cover" sizes="64px" />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-[13px] font-semibold text-[#0B1F3A]">{order.id}</p>
            <StatusBadge status={order.status} tone={order.statusTone} />
          </div>
          <p className="mt-0.5 truncate text-[13px] text-[#64748B]">
            {(order.items || []).map((item) => item.name).join(", ") || "Order items"}
          </p>
          {!compact ? (
            <p className="mt-1 text-[12px] text-[#94A3B8]">{order.date}</p>
          ) : null}
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 sm:flex-col sm:items-end sm:justify-center">
        {compact ? (
          <p className="text-[12px] text-[#94A3B8]">{order.date}</p>
        ) : null}
        <p className="text-[14px] font-bold text-[#0B1F3A]">{order.total}</p>
      </div>
    </article>
  );
}

function OverviewTab({ user, onOpenTab, orders }) {
  const recentOrders = (orders || []).slice(0, 2);
  const address = user.address || {};
  const addressLine = [address.line1, address.line2, address.city, address.postal]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="space-y-3 md:space-y-4">
      <Panel>
        <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2F7BFF] to-[#1D5ED9] text-[1.35rem] font-bold text-white shadow-[0_10px_24px_rgba(47,123,255,0.28)]">
            {user.avatarInitials || "CN"}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-[1.35rem] font-bold tracking-[-0.02em] text-[#0B1F3A]">
                  {user.name}
                </h2>
                <p className="mt-1 text-[14px] text-[#64748B]">{user.email}</p>
                {user.phone ? (
                  <p className="mt-0.5 text-[14px] text-[#64748B]">{user.phone}</p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => onOpenTab("settings")}
                className="rounded-full border border-[#C7DBF5] bg-[#F8FBFF] px-3.5 py-1.5 text-[12px] font-semibold text-[#0B1F3A] transition hover:border-[#2F7BFF] hover:text-[#2F7BFF]"
              >
                Edit profile
              </button>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl bg-[#EEF5FF] px-3.5 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#2F7BFF]">
                  Member since
                </p>
                <p className="mt-1 text-[14px] font-semibold text-[#0B1F3A]">
                  {user.memberSince || "—"}
                </p>
              </div>
              <div className="rounded-xl bg-[#EEF5FF] px-3.5 py-3 sm:col-span-2">
                <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#2F7BFF]">
                  Default address
                </p>
                <p className="mt-1 text-[14px] font-semibold text-[#0B1F3A]">
                  {addressLine || "Add an address in Settings"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Panel>

      <div className="grid gap-3 md:gap-4 lg:grid-cols-2">
        <Panel>
          <SectionTitle
            eyebrow="Activity"
            title="Recent orders"
            action={
              <button
                type="button"
                onClick={() => onOpenTab("orders")}
                className="text-[12px] font-semibold text-[#2F7BFF] transition hover:text-[#2569e0]"
              >
                View all
              </button>
            }
          />
          <div className="space-y-2.5">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <OrderRow key={order.id} order={order} compact />
              ))
            ) : (
              <p className="text-[13px] text-[#64748B]">No orders yet.</p>
            )}
          </div>
        </Panel>

        <Panel>
          <SectionTitle eyebrow="Browsing" title="Recently viewed" />
          <div className="grid grid-cols-2 gap-2.5">
            {demoRecentlyViewed.map((item) => (
              <Link
                key={item.slug}
                href={`/product/${item.slug}`}
                className="group overflow-hidden rounded-xl border border-[#E8EEF4] bg-[#F8FBFF] transition hover:border-[#2F7BFF]/40"
              >
                <div className="relative aspect-[4/3] bg-white">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover transition duration-300 group-hover:scale-[1.03]"
                    sizes="160px"
                  />
                </div>
                <div className="p-2.5">
                  <p className="truncate text-[12px] font-semibold text-[#0B1F3A]">
                    {item.name}
                  </p>
                  <p className="mt-0.5 text-[12px] font-bold text-[#2F7BFF]">
                    {item.price}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function OrdersTab({ onTrack, orders, loading }) {
  return (
    <Panel>
      <SectionTitle eyebrow="Purchases" title="Order history" />
      {loading ? (
        <p className="text-[13px] text-[#64748B]">Loading orders…</p>
      ) : (
        <div className="space-y-3">
          {orders.length > 0 ? (
            orders.map((order) => (
              <div key={order.id} className="space-y-2">
                <OrderRow order={order} />
                <div className="flex flex-wrap gap-2 pl-1">
                  <button
                    type="button"
                    onClick={() =>
                      onTrack(order.trackingNumber || order.id)
                    }
                    className="rounded-full bg-[#EEF5FF] px-3 py-1.5 text-[12px] font-semibold text-[#2F7BFF] transition hover:bg-[#2F7BFF] hover:text-white"
                  >
                    Track order
                  </button>
                  <Link
                    href="/mattresses"
                    className="rounded-full border border-[#C7DBF5] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#0B1F3A] transition hover:border-[#2F7BFF] hover:text-[#2F7BFF]"
                  >
                    Buy again
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p className="text-[13px] text-[#64748B]">
              You haven&apos;t placed any orders yet.
            </p>
          )}
        </div>
      )}
    </Panel>
  );
}

function TrackTab({ initialOrderId, knownOrders = [] }) {
  const [query, setQuery] = useState(initialOrderId || "");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadTracking = async (value) => {
    const normalized = normalizeTrackingNumberInput(value) || String(value || "").trim();
    if (!normalized) return;
    setLoading(true);
    setError("");
    try {
      const raw = await trackOrder(normalized);
      const display = toDisplayOrder(raw);
      setOrder(display);
      if (!display) setError("No order found");
    } catch (err) {
      setOrder(null);
      setError(err.message || "No order found");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderId) {
      setQuery(initialOrderId);
      loadTracking(initialOrderId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialOrderId]);

  const onSearch = (e) => {
    e.preventDefault();
    loadTracking(query);
  };

  const detail = order?.detail;
  const timeline = detail
    ? [
        { id: "placed", label: "Order placed", done: true },
        {
          id: "processing",
          label: "Packaging",
          done: ["processing", "in_transit", "delivered"].includes(detail.status),
        },
        {
          id: "in_transit",
          label: "On the road",
          done: ["in_transit", "delivered"].includes(detail.status),
        },
        {
          id: "delivered",
          label: "Delivered",
          done: detail.status === "delivered",
        },
      ]
    : [];

  return (
    <div className="space-y-3 md:space-y-4">
      <Panel>
        <SectionTitle eyebrow="Shipping" title="Track an order" />
        <form onSubmit={onSearch} className="flex flex-col gap-2.5 sm:flex-row">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter tracking number (e.g. CN-A7K9X2M4)"
            className={`${inputClass} mt-0 sm:flex-1`}
            aria-label="Tracking number"
          />
          <button
            type="submit"
            className="h-[46px] rounded-xl bg-[#2F7BFF] px-5 text-[13px] font-semibold text-white shadow-[0_6px_16px_rgba(47,123,255,0.25)] transition hover:bg-[#2569e0]"
          >
            {loading ? "Tracking…" : "Track"}
          </button>
        </form>
        {knownOrders.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {knownOrders.slice(0, 6).map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setQuery(item.trackingNumber || item.id);
                  loadTracking(item.trackingNumber || item.id);
                }}
                className="rounded-full bg-[#F4F8FD] px-3 py-1.5 text-[11px] font-semibold text-[#475569] transition hover:bg-[#EEF5FF]"
              >
                {item.trackingNumber || item.id}
              </button>
            ))}
          </div>
        ) : null}
      </Panel>

      {order ? (
        <Panel>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[13px] font-semibold text-[#0B1F3A]">{order.id}</p>
              <p className="mt-1 text-[13px] text-[#64748B]">
                Placed {order.date}
              </p>
            </div>
            <StatusBadge status={order.status} tone={order.statusTone} />
          </div>

          <ol className="mt-6 space-y-0">
            {timeline.map((step, index) => {
              const isLast = index === timeline.length - 1;
              return (
                <li key={step.id} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <span
                      className={`inline-flex h-7 w-7 items-center justify-center rounded-full ${
                        step.done
                          ? "bg-[#2F7BFF] text-white"
                          : "border border-[#C7DBF5] bg-[#F8FBFF] text-[#94A3B8]"
                      }`}
                    >
                      {step.done ? (
                        <HiOutlineCheckCircle className="h-4 w-4" />
                      ) : (
                        <HiOutlineClock className="h-3.5 w-3.5" />
                      )}
                    </span>
                    {!isLast ? (
                      <span
                        className={`my-1 min-h-6 w-px flex-1 ${
                          step.done ? "bg-[#2F7BFF]/40" : "bg-[#D6E6F8]"
                        }`}
                      />
                    ) : null}
                  </div>
                  <div className={`min-w-0 pb-5 ${isLast ? "pb-0" : ""}`}>
                    <p
                      className={`text-[14px] font-semibold ${
                        step.done ? "text-[#0B1F3A]" : "text-[#94A3B8]"
                      }`}
                    >
                      {step.label}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="mt-5 space-y-2 border-t border-[#E8EEF4] pt-4">
            {(order.items || []).map((item) => (
              <div key={`${order.id}-${item.name}`} className="flex items-center gap-3">
                <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-[#F4F7FA]">
                  <Image
                    src={item.image || "/mattress.png"}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-semibold text-[#0B1F3A]">
                    {item.name}
                  </p>
                  <p className="text-[12px] text-[#64748B]">Qty {item.qty}</p>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      ) : (
        <Panel className="py-12 text-center">
          <HiOutlineTruck className="mx-auto h-8 w-8 text-[#94A3B8]" />
          <p className="mt-3 text-[15px] font-semibold text-[#0B1F3A]">
            {error || "Enter a tracking number"}
          </p>
          <p className="mt-1 text-[13px] text-[#64748B]">
            Use your CN- tracking code from checkout confirmation.
          </p>
        </Panel>
      )}
    </div>
  );
}

function CartTab() {
  const { items, hydrated, itemCount, subtotal, updateQuantity, removeItem } =
    useCart();

  if (!hydrated) {
    return (
      <Panel className="py-12 text-center">
        <p className="text-[14px] text-[#64748B]">Loading cart…</p>
      </Panel>
    );
  }

  if (items.length === 0) {
    return (
      <Panel className="py-12 text-center">
        <HiOutlineShoppingCart className="mx-auto h-8 w-8 text-[#94A3B8]" />
        <p className="mt-3 text-[15px] font-semibold text-[#0B1F3A]">
          Your cart is empty
        </p>
        <p className="mt-1 text-[13px] text-[#64748B]">
          Save favorites from the shop and they&apos;ll show up here.
        </p>
        <Link
          href="/mattresses"
          className="mt-5 inline-flex rounded-full bg-[#2F7BFF] px-5 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#2569e0]"
        >
          Browse products
        </Link>
      </Panel>
    );
  }

  return (
    <div className="space-y-3 md:space-y-4">
      <Panel>
        <SectionTitle
          eyebrow="Saved for later checkout"
          title={`${itemCount} ${itemCount === 1 ? "item" : "items"} in cart`}
          action={
            <Link
              href="/cart"
              className="text-[12px] font-semibold text-[#2F7BFF] transition hover:text-[#2569e0]"
            >
              Open full cart
            </Link>
          }
        />
        <div className="space-y-2.5">
          {items.map((item) => {
            const href = item.slug ? `/product/${item.slug}` : "#";
            return (
              <article
                key={item.key}
                className="flex gap-3 rounded-xl border border-[#E8EEF4] bg-[#F8FBFF] p-3"
              >
                <Link
                  href={href}
                  className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-white"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </Link>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <Link
                        href={href}
                        className="block truncate text-[14px] font-semibold text-[#0B1F3A] hover:text-[#2F7BFF]"
                      >
                        {item.name}
                      </Link>
                      <p className="mt-0.5 text-[12px] text-[#64748B]">
                        {[item.size, item.thickness].filter(Boolean).join(" · ")}
                      </p>
                      <p className="mt-1 text-[13px] font-bold text-[#0B1F3A]">
                        {item.price}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.key)}
                      className="text-[11px] font-medium text-[#64748B] hover:text-[#2F7BFF]"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="mt-2 inline-flex items-center rounded-lg bg-white">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.key, item.quantity - 1)}
                      className="px-2.5 py-1.5 text-[#2F7BFF]"
                    >
                      −
                    </button>
                    <span className="min-w-[1.5rem] text-center text-[12px] font-semibold">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.key, item.quantity + 1)}
                      className="px-2.5 py-1.5 text-[#2F7BFF]"
                    >
                      +
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </Panel>

      <Panel>
        <div className="flex items-center justify-between gap-3">
          <p className="text-[14px] text-[#64748B]">Subtotal</p>
          <p className="text-[1.1rem] font-bold text-[#0B1F3A]">
            {formatPrice(subtotal)}
          </p>
        </div>
        <Link
          href="/checkout"
          className="mt-4 flex h-11 items-center justify-center rounded-xl bg-[#2F7BFF] text-[13px] font-semibold text-white transition hover:bg-[#2569e0]"
        >
          Proceed to checkout
        </Link>
      </Panel>
    </div>
  );
}

function SettingsTab({ user, onSaveUser }) {
  const [form, setForm] = useState({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    line1: user.address?.line1 || "",
    line2: user.address?.line2 || "",
    city: user.address?.city || "",
    postal: user.address?.postal || "",
    emailOffers: user.preferences?.emailOffers ?? true,
    smsUpdates: user.preferences?.smsUpdates ?? false,
    orderAlerts: user.preferences?.orderAlerts ?? true,
  });
  const [saved, setSaved] = useState(false);

  const onChange = (field) => (e) => {
    const value =
      e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const onSave = async (e) => {
    e.preventDefault();
    try {
      await onSaveUser({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        address: {
          line1: form.line1.trim(),
          line2: form.line2.trim(),
          city: form.city.trim(),
          postal: form.postal.trim(),
        },
        preferences: {
          emailOffers: form.emailOffers,
          smsUpdates: form.smsUpdates,
          orderAlerts: form.orderAlerts,
        },
      });
      setSaved(true);
    } catch (err) {
      console.error(err);
      setSaved(false);
    }
  };

  return (
    <form onSubmit={onSave} className="space-y-3 md:space-y-4">
      <Panel>
        <SectionTitle eyebrow="Account" title="Personal details" />
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="name" className={labelClass}>
              Full name
            </label>
            <input
              id="name"
              className={inputClass}
              value={form.name}
              onChange={onChange("name")}
            />
          </div>
          <div>
            <label htmlFor="email" className={labelClass}>
              Email
            </label>
            <input
              id="email"
              type="email"
              className={inputClass}
              value={form.email}
              onChange={onChange("email")}
            />
          </div>
          <div>
            <label htmlFor="phone" className={labelClass}>
              Phone
            </label>
            <input
              id="phone"
              className={inputClass}
              value={form.phone}
              onChange={onChange("phone")}
            />
          </div>
        </div>
      </Panel>

      <Panel>
        <SectionTitle eyebrow="Delivery" title="Default address" />
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label htmlFor="line1" className={labelClass}>
              Address line 1
            </label>
            <input
              id="line1"
              className={inputClass}
              value={form.line1}
              onChange={onChange("line1")}
            />
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="line2" className={labelClass}>
              Address line 2
            </label>
            <input
              id="line2"
              className={inputClass}
              value={form.line2}
              onChange={onChange("line2")}
            />
          </div>
          <div>
            <label htmlFor="city" className={labelClass}>
              City
            </label>
            <input
              id="city"
              className={inputClass}
              value={form.city}
              onChange={onChange("city")}
            />
          </div>
          <div>
            <label htmlFor="postal" className={labelClass}>
              Postal code
            </label>
            <input
              id="postal"
              className={inputClass}
              value={form.postal}
              onChange={onChange("postal")}
            />
          </div>
        </div>
      </Panel>

      <Panel>
        <SectionTitle eyebrow="Preferences" title="Notifications" />
        <div className="space-y-3">
          {[
            { key: "emailOffers", label: "Email offers & launches" },
            { key: "smsUpdates", label: "SMS delivery updates" },
            { key: "orderAlerts", label: "Order status alerts" },
          ].map((pref) => (
            <label
              key={pref.key}
              className="flex cursor-pointer items-center justify-between gap-3 rounded-xl bg-[#F8FBFF] px-3.5 py-3"
            >
              <span className="text-[14px] font-medium text-[#0B1F3A]">
                {pref.label}
              </span>
              <input
                type="checkbox"
                checked={form[pref.key]}
                onChange={onChange(pref.key)}
                className="h-4 w-4 accent-[#2F7BFF]"
              />
            </label>
          ))}
        </div>
      </Panel>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          className="rounded-xl bg-[#2F7BFF] px-5 py-2.5 text-[13px] font-semibold text-white shadow-[0_6px_16px_rgba(47,123,255,0.25)] transition hover:bg-[#2569e0]"
        >
          Save changes
        </button>
        {saved ? (
          <p className="text-[13px] font-medium text-[#15803D]">
            Settings saved
          </p>
        ) : null}
      </div>
    </form>
  );
}

function LogoutTab({ onCancel, onConfirm }) {
  return (
    <Panel className="py-10 text-center sm:py-14">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEF5FF] text-[#2F7BFF]">
        <HiOutlineArrowRightOnRectangle className="h-7 w-7" />
      </div>
      <h2 className="mt-4 text-[1.2rem] font-bold text-[#0B1F3A]">
        Log out of CloudyNap?
      </h2>
      <p className="mx-auto mt-2 max-w-md text-[14px] text-[#64748B]">
        You can sign back in anytime. Your cart items stay saved on this device.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5">
        <button
          type="button"
          onClick={onConfirm}
          className="rounded-xl bg-[#2F7BFF] px-5 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#2569e0]"
        >
          Log out
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl border border-[#C7DBF5] bg-[#F8FBFF] px-5 py-2.5 text-[13px] font-semibold text-[#0B1F3A] transition hover:border-[#2F7BFF] hover:text-[#2F7BFF]"
        >
          Stay signed in
        </button>
      </div>
    </Panel>
  );
}

export default function ProfilePageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, hydrated, isAuthenticated, logout, updateUser } = useAuth();
  const tabFromUrl = searchParams.get("tab");
  const orderFromUrl = searchParams.get("order");

  const initialTab = useMemo(() => {
    const match = TABS.find((tab) => tab.id === tabFromUrl);
    return match?.id || "overview";
  }, [tabFromUrl]);

  const [activeTab, setActiveTab] = useState(initialTab);
  const [trackOrderId, setTrackOrderId] = useState(orderFromUrl || "");
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    if (hydrated && !isAuthenticated) {
      router.replace("/signin");
    }
  }, [hydrated, isAuthenticated, router]);

  useEffect(() => {
    if (!user?.id) {
      setOrders([]);
      return;
    }
    let cancelled = false;
    setOrdersLoading(true);
    fetchOrders({ userId: user.id })
      .then((list) => {
        if (cancelled) return;
        setOrders(
          (Array.isArray(list) ? list : [])
            .map(toDisplayOrder)
            .filter(Boolean)
        );
      })
      .catch(() => {
        if (!cancelled) setOrders([]);
      })
      .finally(() => {
        if (!cancelled) setOrdersLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (orderFromUrl) setTrackOrderId(orderFromUrl);
  }, [orderFromUrl]);

  const openTab = useCallback(
    (tabId, orderId) => {
      setActiveTab(tabId);
      if (orderId) setTrackOrderId(orderId);
      const params = new URLSearchParams();
      if (tabId !== "overview") params.set("tab", tabId);
      if (orderId) params.set("order", orderId);
      const qs = params.toString();
      router.replace(qs ? `/profile?${qs}` : "/profile", { scroll: false });
    },
    [router]
  );

  const handleLogout = () => {
    logout();
    router.push("/signin");
  };

  const titleMap = {
    overview: "Your profile",
    orders: "Order history",
    track: "Track order",
    cart: "Your cart",
    settings: "Account settings",
    logout: "Log out",
  };

  if (!hydrated || !user) {
    return (
      <div className="relative min-h-full bg-gradient-to-b from-[#EAF3FF] via-[#F5F9FF] to-white font-sans text-slate-900">
        <Navbar variant="solid" />
        <main className="px-3 py-16 text-center text-[14px] text-[#64748B]">
          Loading account…
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="relative min-h-full bg-gradient-to-b from-[#EAF3FF] via-[#F5F9FF] to-white font-sans text-slate-900">
      <Navbar variant="solid" />

      <main className="w-full">
        <div className="mx-auto w-full max-w-[1400px] px-3 pb-12 pt-4 sm:px-6 sm:pb-16 sm:pt-5 lg:px-8">
          <header className="mb-5 sm:mb-7">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#2F7BFF]">
              Account
            </p>
            <h1 className="mt-1.5 font-serif text-[clamp(1.75rem,3.5vw,2.6rem)] font-medium leading-[1.1] tracking-[-0.02em] text-[#0B1F3A]">
              {titleMap[activeTab] || "Your profile"}
            </h1>
          </header>

          <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:gap-5">
            <aside className="w-full shrink-0 lg:sticky lg:top-5 lg:w-[240px]">
              <nav
                aria-label="Account sections"
                className="flex gap-1.5 overflow-x-auto rounded-2xl border border-[#C7DBF5] bg-white p-2 shadow-[0_8px_28px_rgba(47,123,255,0.06)] lg:flex-col lg:overflow-visible"
              >
                {TABS.map((tab) => {
                  const Icon = tab.icon;
                  const active = activeTab === tab.id;
                  const isLogout = tab.id === "logout";
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => openTab(tab.id)}
                      className={`inline-flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-left text-[13px] font-semibold transition ${
                        active
                          ? isLogout
                            ? "bg-[#FEE2E2] text-[#B91C1C]"
                            : "bg-[#2F7BFF] text-white shadow-[0_6px_16px_rgba(47,123,255,0.22)]"
                          : isLogout
                            ? "text-[#B91C1C] hover:bg-[#FEF2F2]"
                            : "text-[#475569] hover:bg-[#F4F8FD] hover:text-[#0B1F3A]"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </aside>

            <div className="min-w-0 flex-1">
              {activeTab === "overview" ? (
                <OverviewTab user={user} onOpenTab={openTab} orders={orders} />
              ) : null}
              {activeTab === "orders" ? (
                <OrdersTab
                  orders={orders}
                  loading={ordersLoading}
                  onTrack={(orderId) => openTab("track", orderId)}
                />
              ) : null}
              {activeTab === "track" ? (
                <TrackTab
                  initialOrderId={trackOrderId}
                  knownOrders={orders}
                />
              ) : null}
              {activeTab === "cart" ? <CartTab /> : null}
              {activeTab === "settings" ? (
                <SettingsTab user={user} onSaveUser={updateUser} />
              ) : null}
              {activeTab === "logout" ? (
                <LogoutTab
                  onCancel={() => openTab("overview")}
                  onConfirm={handleLogout}
                />
              ) : null}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
