"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { getCategoryConfig } from "@/data/categoryCatalogs";
import {
  fetchStorefrontProducts,
  parseStorePrice,
} from "@/lib/storeApi";

const PAGE_SIZE = 12;

const PRICE_OPTIONS = [
  { id: "all", label: "All prices" },
  { id: "under-10k", label: "Under Rs. 10,000" },
  { id: "10k-20k", label: "Rs. 10,000 – 20,000" },
  { id: "20k-50k", label: "Rs. 20,000 – 50,000" },
  { id: "over-50k", label: "Over Rs. 50,000" },
];

/** Preferred mattress brand lines — matched against brand / series / name. */
const MATTRESS_BRAND_LINES = [
  { id: "dolce-vita", label: "Dolce Vita", match: /dolce\s*vita/i },
  { id: "supremefoam", label: "SupremeFoam", match: /supreme/i },
  { id: "ortica", label: "Ortica", match: /ortic/i },
  { id: "dreamer", label: "Dreamer", match: /dreamer/i },
  { id: "diamond", label: "Diamond", match: /diamond/i },
];

const selectClassName =
  "w-full appearance-none rounded-xl border border-[#C7DBF5] bg-[#F8FBFF] bg-[length:12px] bg-[right_12px_center] bg-no-repeat px-3 py-2.5 pr-9 text-[13px] text-[#0B1F3A] outline-none transition hover:border-[#2F7BFF]/40 focus:border-[#2F7BFF] focus:ring-2 focus:ring-[#2F7BFF]/20";

const selectChevron =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%232F7BFF'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E\")";

function FilterGroup({ title, children }) {
  return (
    <div className="border-b border-[#D6E6F8] pb-5 last:border-b-0 last:pb-0">
      <p className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#2F7BFF]">
        {title}
      </p>
      <div className="mt-3 space-y-2.5">{children}</div>
    </div>
  );
}

function FilterOption({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-[13px] transition ${
        active
          ? "bg-[#2F7BFF] font-semibold text-white shadow-[0_4px_14px_rgba(47,123,255,0.22)]"
          : "bg-[#F8FBFF] text-[#475569] hover:bg-[#EEF5FF] hover:text-[#0B1F3A]"
      }`}
    >
      <span>{label}</span>
      {active ? <span className="text-[11px] opacity-90">✓</span> : null}
    </button>
  );
}

function FilterSelect({ value, onChange, options, ariaLabel }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={ariaLabel}
      className={selectClassName}
      style={{ backgroundImage: selectChevron }}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

function resolveProductBrand(product, categoryKey) {
  const brand = product.brand || "";
  const series = product.raw?.series || "";
  const name = product.name || "";
  const hay = `${brand} ${series} ${name}`;

  if (categoryKey === "mattresses") {
    for (const line of MATTRESS_BRAND_LINES) {
      if (line.match.test(hay)) return line.label;
    }
  }

  if (/dolce\s*vita/i.test(brand) || brand === "DolceVita") return "Dolce Vita";
  if (brand) return brand;
  if (series) return series.replace(/\s+Series\.?$/i, "").trim();
  return "Other";
}

export default function CategoryCatalog({ categoryKey }) {
  const config = useMemo(() => getCategoryConfig(categoryKey), [categoryKey]);
  const searchParams = useSearchParams();
  const brandFromUrl = searchParams.get("brand")?.trim() || "";
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [brand, setBrand] = useState(brandFromUrl || "All");
  const [size, setSize] = useState("All");
  const [priceId, setPriceId] = useState("all");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setBrand(brandFromUrl || "All");
  }, [brandFromUrl, categoryKey]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const list = await fetchStorefrontProducts(categoryKey);
        if (!cancelled) setProducts(list);
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Failed to load products.");
          setProducts([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [categoryKey]);

  const productsWithBrand = useMemo(
    () =>
      products.map((product) => ({
        ...product,
        filterBrand: resolveProductBrand(product, categoryKey),
      })),
    [products, categoryKey]
  );

  const brandOptions = useMemo(() => {
    const present = new Set(
      productsWithBrand.map((p) => p.filterBrand).filter(Boolean)
    );

    if (categoryKey === "mattresses") {
      const ordered = MATTRESS_BRAND_LINES.map((line) => line.label).filter(
        (label) => present.has(label)
      );
      const extras = [...present]
        .filter((label) => !ordered.includes(label))
        .sort((a, b) => a.localeCompare(b));
      return [
        { value: "All", label: "All brands" },
        ...[...ordered, ...extras].map((label) => ({
          value: label,
          label,
        })),
      ];
    }

    return [
      { value: "All", label: "All brands" },
      ...[...present]
        .sort((a, b) => a.localeCompare(b))
        .map((label) => ({ value: label, label })),
    ];
  }, [productsWithBrand, categoryKey]);

  const sizeOptions = useMemo(() => {
    const set = new Set();
    products.forEach((p) => {
      (p.sizes || []).forEach((s) => set.add(s.label));
    });
    return [
      { value: "All", label: "All sizes" },
      ...[...set].map((label) => ({ value: label, label })),
    ];
  }, [products]);

  const filtered = useMemo(() => {
    return productsWithBrand.filter((product) => {
      if (brand !== "All" && product.filterBrand !== brand) return false;

      if (size !== "All") {
        const labels = (product.sizes || []).map((s) => s.label);
        if (!labels.includes(size)) return false;
      }

      const amount = product.priceValue || parseStorePrice(product.price);
      if (priceId === "under-10k" && amount >= 10000) return false;
      if (priceId === "10k-20k" && (amount < 10000 || amount > 20000))
        return false;
      if (priceId === "20k-50k" && (amount < 20000 || amount > 50000))
        return false;
      if (priceId === "over-50k" && amount <= 50000) return false;

      return true;
    });
  }, [productsWithBrand, brand, size, priceId]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));

  useEffect(() => {
    setPage(1);
  }, [brand, size, priceId, categoryKey]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const rangeStart = filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = Math.min(page * PAGE_SIZE, filtered.length);
  const itemLabel = config?.itemLabel || "products";
  const emptyLabel = config?.emptyLabel || "products";
  const sizeFilter = config?.sizeFilter;

  const resetFilters = () => {
    setBrand("All");
    setSize("All");
    setPriceId("all");
    setPage(1);
  };

  if (!config) return null;

  return (
    <div className="flex flex-col gap-2 md:gap-3 lg:flex-row lg:items-start">
      <aside className="w-full shrink-0 rounded-2xl border border-[#C7DBF5] bg-white p-4 shadow-[0_8px_28px_rgba(47,123,255,0.06)] sm:p-5 lg:sticky lg:top-6 lg:w-[280px]">
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="text-[1.05rem] font-bold tracking-[-0.02em] text-[#0B1F3A]">
            Filters
          </h2>
          <button
            type="button"
            onClick={resetFilters}
            className="text-[12px] font-medium text-[#2F7BFF] transition-colors hover:text-[#2569e0]"
          >
            Reset
          </button>
        </div>

        <div className="space-y-5">
          {brandOptions.length > 1 ? (
            <FilterGroup title="Brand">
              <FilterSelect
                value={brand}
                onChange={setBrand}
                options={brandOptions}
                ariaLabel="Filter by brand"
              />
            </FilterGroup>
          ) : null}

          {sizeOptions.length > 1 ? (
            <FilterGroup title={sizeFilter?.title || "Size"}>
              <FilterSelect
                value={size}
                onChange={setSize}
                options={sizeOptions}
                ariaLabel="Filter by size"
              />
            </FilterGroup>
          ) : null}

          <FilterGroup title="Price">
            {PRICE_OPTIONS.map((option) => (
              <FilterOption
                key={option.id}
                label={option.label}
                active={priceId === option.id}
                onClick={() => setPriceId(option.id)}
              />
            ))}
          </FilterGroup>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <div className="mb-3 flex items-center justify-between gap-3 sm:mb-4">
          <p className="text-[13px] text-[#64748B]">
            {loading ? (
              "Loading products…"
            ) : filtered.length > 0 ? (
              <>
                Showing{" "}
                <span className="font-semibold text-[#0B1F3A]">
                  {rangeStart}–{rangeEnd}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-[#0B1F3A]">
                  {filtered.length}
                </span>{" "}
                {itemLabel}
              </>
            ) : (
              <>
                Showing <span className="font-semibold text-[#0B1F3A]">0</span>{" "}
                {itemLabel}
              </>
            )}
          </p>
        </div>

        {error ? (
          <div className="rounded-2xl border border-[#FECACA] bg-[#FEF2F2] px-6 py-10 text-center">
            <p className="text-[15px] font-semibold text-[#B91C1C]">{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 rounded-full bg-[#2F7BFF] px-5 py-2.5 text-[13px] font-semibold text-white"
            >
              Retry
            </button>
          </div>
        ) : loading ? (
          <div className="grid grid-cols-2 gap-2 md:gap-3 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] animate-pulse rounded-2xl bg-[#EAF3FF]"
              />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <>
            <div className="grid grid-cols-2 gap-2 md:gap-3 lg:grid-cols-3">
              {pageItems.map((product) => (
                <div
                  key={product.catalogKey || product.slug}
                  className="min-w-0"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>

            {totalPages > 1 ? (
              <nav
                className="mt-6 flex flex-wrap items-center justify-center gap-2 sm:mt-8"
                aria-label="Product pagination"
              >
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="rounded-full border border-[#C7DBF5] bg-white px-4 py-2 text-[13px] font-semibold text-[#0B1F3A] transition enabled:hover:border-[#2F7BFF] enabled:hover:text-[#2F7BFF] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => setPage(pageNum)}
                      aria-current={page === pageNum ? "page" : undefined}
                      className={`min-w-10 rounded-full px-3.5 py-2 text-[13px] font-semibold transition ${
                        page === pageNum
                          ? "bg-[#2F7BFF] text-white shadow-[0_4px_14px_rgba(47,123,255,0.22)]"
                          : "border border-[#C7DBF5] bg-white text-[#0B1F3A] hover:border-[#2F7BFF] hover:text-[#2F7BFF]"
                      }`}
                    >
                      {pageNum}
                    </button>
                  )
                )}
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page >= totalPages}
                  className="rounded-full border border-[#C7DBF5] bg-white px-4 py-2 text-[13px] font-semibold text-[#0B1F3A] transition enabled:hover:border-[#2F7BFF] enabled:hover:text-[#2F7BFF] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </nav>
            ) : null}
          </>
        ) : (
          <div className="rounded-2xl border border-[#C7DBF5] bg-white px-6 py-16 text-center shadow-[0_8px_28px_rgba(47,123,255,0.06)]">
            <p className="text-[1.05rem] font-semibold text-[#0B1F3A]">
              No {emptyLabel} match these filters
            </p>
            <p className="mt-2 text-[14px] text-[#64748B]">
              Try resetting or choosing a broader brand, size, or price range.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="mt-5 inline-flex rounded-full bg-[#2F7BFF] px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#2569e0]"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
