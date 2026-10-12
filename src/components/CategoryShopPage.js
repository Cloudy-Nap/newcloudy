import { Suspense } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CategoryCatalog from "@/components/CategoryCatalog";
import { getCategoryConfig } from "@/data/categoryCatalogs";

export function buildCategoryMetadata(categoryKey) {
  const config = getCategoryConfig(categoryKey);
  return {
    title: config?.metaTitle || "Shop | CloudyNap",
    description: config?.metaDescription || "Shop CloudyNap collections.",
  };
}

export default function CategoryShopPage({ categoryKey }) {
  const config = getCategoryConfig(categoryKey);

  if (!config) return null;

  return (
    <div className="relative min-h-full bg-gradient-to-b from-[#EAF3FF] via-[#F5F9FF] to-white font-sans text-slate-900">
      <Navbar variant="solid" />

      <main className="w-full">
        <div className="mx-auto w-full max-w-[1800px] px-3 pb-12 pt-4 sm:px-8 sm:pb-16 sm:pt-6 lg:px-8 xl:px-10">
          <header className="mb-6 max-w-3xl sm:mb-8 lg:mb-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#2F7BFF]">
              {config.eyebrow}
            </p>
            <h1 className="mt-2 font-serif text-[clamp(1.85rem,4vw,3rem)] font-medium leading-[1.1] tracking-[-0.02em] text-[#0B1F3A]">
              {config.title}
            </h1>
            <p className="mt-3 max-w-2xl text-[14px] leading-[1.6] text-[#475569] sm:mt-4 sm:text-[16px]">
              {config.tagline}
            </p>
          </header>

          <Suspense
            fallback={
              <div className="grid grid-cols-2 gap-2 md:gap-3 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-[3/4] animate-pulse rounded-2xl bg-[#EAF3FF]"
                  />
                ))}
              </div>
            }
          >
            <CategoryCatalog categoryKey={categoryKey} />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}
