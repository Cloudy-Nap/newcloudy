"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  HiStar,
  HiOutlineHeart,
  HiOutlineShoppingCart,
  HiOutlineTruck,
  HiOutlineShieldCheck,
  HiOutlineArrowLeft,
  HiOutlineArrowRight,
  HiOutlineCheck,
} from "react-icons/hi2";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/context/CartContext";
import {
  fetchStorefrontProducts,
  findVariantId,
  formatStorePrice,
  resolveVariantPrice,
} from "@/lib/storeApi";

function formatReviews(count) {
  return Number(count || 0).toLocaleString("en-US");
}

function normalizeSizes(raw) {
  if (!raw?.length) return [];
  return raw.map((size, index) => {
    if (typeof size === "string") {
      return {
        id: size.toLowerCase().replace(/\s+/g, "-"),
        label: size,
        dims: null,
      };
    }
    return {
      id: size.id || `size-${index}`,
      label: size.label || size.name || "Size",
      dims: size.dims || null,
    };
  });
}

function normalizeThicknesses(raw) {
  if (!raw?.length) return [];
  return raw.map((item, index) => ({
    id: item.id || `thickness-${index}`,
    label: item.label,
    available: item.available !== false,
  }));
}

function OptionLabel({ children, value }) {
  return (
    <div className="mb-2.5 flex items-baseline justify-between gap-3">
      <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#64748B]">
        {children}
      </p>
      {value ? (
        <p className="truncate text-[13px] font-semibold text-[#0B1F3A]">{value}</p>
      ) : null}
    </div>
  );
}

export default function ProductDetail({ product }) {
  const gallery = useMemo(
    () =>
      product.gallery?.length
        ? product.gallery
        : [product.image].filter(Boolean),
    [product]
  );
  const sizes = useMemo(() => normalizeSizes(product.sizes), [product.sizes]);
  const thicknesses = useMemo(
    () => normalizeThicknesses(product.thicknesses),
    [product.thicknesses]
  );
  const thicknessLabel =
    product.category === "Pillows" ? "Loft" : "Thickness";
  const highlights = product.highlights || [];
  const specs = product.specs || [];

  const firstAvailableThickness =
    thicknesses.find((t) => t.available) || thicknesses[0] || null;

  const [activeImage, setActiveImage] = useState(gallery[0]);
  const [selectedSizeId, setSelectedSizeId] = useState(sizes[0]?.id || null);
  const [selectedThicknessId, setSelectedThicknessId] = useState(
    firstAvailableThickness?.id || null
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [related, setRelated] = useState([]);
  const { addItem } = useCart();

  useEffect(() => {
    setActiveImage(gallery[0]);
    setSelectedSizeId(sizes[0]?.id || null);
    setSelectedThicknessId(
      (thicknesses.find((t) => t.available) || thicknesses[0])?.id || null
    );
  }, [product.slug]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let cancelled = false;
    const categoryKey =
      product.type === "bed"
        ? "mattresses"
        : product.type === "sofacumbed"
          ? "sofas"
          : product.type === "furniture"
            ? "furniture"
            : product.type === "accessory"
              ? product.category === "Accessories"
                ? "accessories"
                : "pillows"
              : "mattresses";

    fetchStorefrontProducts(categoryKey, { limit: 8 })
      .then((list) => {
        if (cancelled) return;
        setRelated(
          list.filter((p) => p.slug !== product.slug).slice(0, 4)
        );
      })
      .catch(() => {
        if (!cancelled) setRelated([]);
      });

    return () => {
      cancelled = true;
    };
  }, [product.slug, product.type, product.category]);

  const selectedSize = sizes.find((s) => s.id === selectedSizeId) || sizes[0];
  const selectedThickness =
    thicknesses.find((t) => t.id === selectedThicknessId) ||
    firstAvailableThickness;

  const livePriceValue = resolveVariantPrice(
    product,
    selectedSize?.id,
    selectedThickness?.id
  );
  const livePrice = formatStorePrice(livePriceValue);

  const sizeDisplay = selectedSize
    ? selectedSize.dims
      ? `${selectedSize.label} · ${selectedSize.dims}`
      : selectedSize.label
    : "";

  const handleAddToCart = () => {
    const variantId = findVariantId(
      product,
      selectedSize?.id,
      selectedThickness?.id
    );
    addItem(product, {
      quantity,
      size: sizeDisplay || selectedSize?.label,
      thickness: selectedThickness?.label,
      price: livePrice,
      variantId,
      productId: product.id,
      type: product.type,
    });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1600);
  };

  return (
    <main className="w-full bg-gradient-to-b from-[#EAF3FF] via-[#F5F9FF] to-white">
      <div className="mx-auto w-full max-w-[1400px] px-3 pb-12 pt-3 sm:px-6 sm:pb-14 sm:pt-4 lg:px-8">
        <nav className="mb-4 flex flex-wrap items-center gap-1.5 text-[12px] text-[#64748B] sm:mb-5 sm:text-[13px]">
          <Link
            href="/"
            className="inline-flex items-center gap-1 font-medium text-[#2F7BFF] transition-colors hover:text-[#2569e0]"
          >
            <HiOutlineArrowLeft className="h-3.5 w-3.5" />
            Home
          </Link>
          <span aria-hidden="true" className="text-[#CBD5E1]">
            /
          </span>
          <Link
            href={
              product.type === "accessory"
                ? product.category === "Accessories"
                  ? "/accessories"
                  : "/pillows"
                : product.type === "sofacumbed"
                  ? "/sofas"
                  : product.type === "furniture"
                    ? "/furniture"
                    : "/mattresses"
            }
            className="text-[#475569] transition-colors hover:text-[#2F7BFF]"
          >
            {product.category || "Products"}
          </Link>
          <span aria-hidden="true" className="text-[#CBD5E1]">
            /
          </span>
          <span className="font-medium text-[#0B1F3A]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-8">
          <div className="lg:sticky lg:top-5">
            <div className="overflow-hidden rounded-2xl bg-[#F1F6FC]">
              <div className="relative aspect-[5/4] w-full sm:aspect-[4/3]">
                <Image
                  src={activeImage}
                  alt={product.name}
                  fill
                  priority
                  className="object-contain object-center p-4"
                  sizes="(max-width: 1024px) 100vw, 55vw"
                />
                {product.badge ? (
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-md bg-[#0B1F3A]/88 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
                    <HiStar className="h-3 w-3 text-[#2F7BFF]" aria-hidden="true" />
                    {product.badge}
                  </span>
                ) : null}
              </div>
            </div>

            {gallery.length > 1 ? (
              <div className="mt-2.5 grid grid-cols-4 gap-2 sm:grid-cols-5">
                {gallery.map((src) => {
                  const selected = src === activeImage;
                  return (
                    <button
                      key={src}
                      type="button"
                      onClick={() => setActiveImage(src)}
                      className={`relative aspect-square overflow-hidden rounded-lg bg-[#F1F6FC] transition ${
                        selected
                          ? "ring-2 ring-[#2F7BFF] ring-offset-2 ring-offset-[#F5F9FF]"
                          : "opacity-80 hover:opacity-100"
                      }`}
                      aria-label="View product image"
                    >
                      <Image
                        src={src}
                        alt=""
                        fill
                        className="object-contain p-1"
                        sizes="96px"
                      />
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>

          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#2F7BFF]">
              {product.category || "CloudyNap"}
            </p>
            <h1 className="mt-1.5 font-serif text-[clamp(1.65rem,3.2vw,2.45rem)] font-medium leading-[1.12] tracking-[-0.02em] text-[#0B1F3A]">
              {product.name}
            </h1>

            <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1">
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-0.5" aria-hidden="true">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <HiStar
                      key={i}
                      className={`h-3.5 w-3.5 ${
                        i < Math.round(product.rating || 0)
                          ? "text-[#2F7BFF]"
                          : "text-[#D6E6F8]"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[13px] font-medium text-[#475569]">
                  {(product.rating || 0).toFixed(1)}
                </span>
              </div>
              {product.reviewCount ? (
                <span className="text-[13px] text-[#94A3B8]">
                  {formatReviews(product.reviewCount)} reviews
                </span>
              ) : null}
            </div>

            <div className="mt-4 flex flex-wrap items-baseline gap-2">
              <p className="text-[1.65rem] font-bold tracking-[-0.03em] text-[#0B1F3A] sm:text-[1.85rem]">
                {livePrice}
              </p>
              {product.oldPrice ? (
                <p className="text-[14px] text-[#94A3B8] line-through">
                  {product.oldPrice}
                </p>
              ) : null}
            </div>

            <p className="mt-3 text-[14px] leading-[1.55] text-[#64748B] sm:text-[15px]">
              {product.longDescription || product.description}
            </p>

            <div className="mt-6 space-y-5 border-t border-[#D6E6F8] pt-5">
              {sizes.length > 0 ? (
                <div>
                  <OptionLabel value={sizeDisplay}>Size</OptionLabel>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {sizes.map((size) => {
                      const active = size.id === selectedSize?.id;
                      return (
                        <button
                          key={size.id}
                          type="button"
                          onClick={() => setSelectedSizeId(size.id)}
                          className={`relative rounded-xl px-3.5 py-3 text-left transition ${
                            active
                              ? "bg-[#2F7BFF] text-white shadow-[0_8px_20px_rgba(47,123,255,0.22)]"
                              : "bg-[#F4F8FD] text-[#0B1F3A] hover:bg-[#EAF3FF]"
                          }`}
                        >
                          {active ? (
                            <span className="absolute right-2.5 top-2.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-white/20">
                              <HiOutlineCheck className="h-2.5 w-2.5" />
                            </span>
                          ) : null}
                          <span className="block text-[13px] font-semibold leading-tight">
                            {size.label}
                          </span>
                          {size.dims ? (
                            <span
                              className={`mt-0.5 block text-[11px] leading-tight ${
                                active ? "text-white/80" : "text-[#64748B]"
                              }`}
                            >
                              {size.dims}
                            </span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              {thicknesses.length > 0 ? (
                <div>
                  <OptionLabel value={selectedThickness?.label}>
                    {thicknessLabel}
                  </OptionLabel>
                  <div className="flex flex-wrap gap-2">
                    {thicknesses.map((option) => {
                      const active = option.id === selectedThickness?.id;
                      const disabled = !option.available;
                      return (
                        <button
                          key={option.id}
                          type="button"
                          disabled={disabled}
                          onClick={() => setSelectedThicknessId(option.id)}
                          className={`relative min-w-[5.5rem] overflow-hidden rounded-xl px-4 py-3 text-[13px] font-semibold transition ${
                            disabled
                              ? "cursor-not-allowed bg-[#F1F5F9] text-[#94A3B8]"
                              : active
                                ? "bg-[#2F7BFF] text-white shadow-[0_8px_20px_rgba(47,123,255,0.22)]"
                                : "bg-[#F4F8FD] text-[#0B1F3A] hover:bg-[#EAF3FF]"
                          }`}
                        >
                          {option.label}
                          {disabled ? (
                            <span
                              aria-hidden="true"
                              className="pointer-events-none absolute inset-x-2 top-1/2 h-px -translate-y-1/2 rotate-[-18deg] bg-[#94A3B8]/70"
                            />
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              <div>
                <OptionLabel>Quantity</OptionLabel>
                <div className="inline-flex items-center rounded-xl bg-[#F4F8FD]">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3.5 py-2.5 text-[16px] font-medium text-[#2F7BFF] transition hover:bg-[#EAF3FF]"
                  >
                    −
                  </button>
                  <span className="min-w-[2rem] text-center text-[14px] font-semibold text-[#0B1F3A]">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3.5 py-2.5 text-[16px] font-medium text-[#2F7BFF] transition hover:bg-[#EAF3FF]"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-5 flex gap-2.5">
              <button
                type="button"
                onClick={handleAddToCart}
                className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#2F7BFF] px-5 text-[14px] font-semibold text-white shadow-[0_8px_20px_rgba(47,123,255,0.28)] transition-colors hover:bg-[#2569e0]"
              >
                <HiOutlineShoppingCart className="h-5 w-5" />
                {added ? "Added to Cart" : "Add to Cart"}
              </button>
              <button
                type="button"
                aria-label="Add to wishlist"
                className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#C7DBF5] bg-white text-[#2F7BFF] transition-colors hover:bg-[#EEF5FF]"
              >
                <HiOutlineHeart className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 border-t border-[#D6E6F8] pt-4 text-[12px] text-[#64748B]">
              <span className="inline-flex items-center gap-1.5">
                <HiOutlineTruck className="h-4 w-4 text-[#2F7BFF]" />
                Free express delivery
              </span>
              <span className="inline-flex items-center gap-1.5">
                <HiOutlineShieldCheck className="h-4 w-4 text-[#2F7BFF]" />
                Warranty included
              </span>
            </div>
          </div>
        </div>

        {(highlights.length > 0 || specs.length > 0) && (
          <div className="mt-8 grid grid-cols-1 gap-5 border-t border-[#D6E6F8] pt-8 lg:grid-cols-2 lg:gap-10">
            {highlights.length > 0 ? (
              <section>
                <h2 className="text-[1.05rem] font-bold tracking-[-0.02em] text-[#0B1F3A]">
                  Why you&apos;ll love it
                </h2>
                <ul className="mt-3 space-y-2">
                  {highlights.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2.5 text-[14px] leading-snug text-[#475569]"
                    >
                      <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#EEF5FF] text-[#2F7BFF]">
                        <HiOutlineCheck className="h-2.5 w-2.5" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            {specs.length > 0 ? (
              <section>
                <h2 className="text-[1.05rem] font-bold tracking-[-0.02em] text-[#0B1F3A]">
                  Specifications
                </h2>
                <dl className="mt-3 divide-y divide-[#E8EEF4]">
                  {specs.map((row) => (
                    <div
                      key={row.label}
                      className="flex items-center justify-between gap-4 py-2.5"
                    >
                      <dt className="text-[13px] text-[#64748B]">{row.label}</dt>
                      <dd className="text-right text-[13px] font-semibold text-[#0B1F3A]">
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            ) : null}
          </div>
        )}

        {related.length > 0 ? (
          <section className="mt-10 border-t border-[#D6E6F8] pt-8 sm:mt-12">
            <div className="mb-4 flex items-end justify-between gap-3">
              <h2 className="text-[1.2rem] font-bold tracking-[-0.03em] text-[#0B1F3A] sm:text-[1.4rem]">
                Related products
              </h2>
              <Link
                href="/mattresses"
                className="inline-flex shrink-0 items-center gap-1 text-[12px] font-medium text-[#2F7BFF] transition-colors hover:text-[#2569e0] sm:text-[13px]"
              >
                View all
                <HiOutlineArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-2 md:gap-3 lg:grid-cols-4">
              {related.map((item) => (
                <div key={item.slug} className="min-w-0">
                  <ProductCard product={item} />
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </main>
  );
}
