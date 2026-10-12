"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { HiOutlineArrowRight } from "react-icons/hi2";
import ProductCard from "@/components/ProductCard";
import { fetchStorefrontProducts } from "@/lib/storeApi";

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetchStorefrontProducts("mattresses", { limit: 6 })
      .then((list) => {
        if (!cancelled) setProducts(list.slice(0, 6));
      })
      .catch(() => {
        if (!cancelled) setProducts([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="w-full overflow-x-clip bg-white">
      <div className="mx-auto w-full max-w-[1800px] px-3 py-5 sm:px-8 sm:py-12 lg:px-8 lg:py-14">
        <div className="mb-3 flex items-end justify-between gap-3 sm:mb-8 lg:mb-9">
          <h2 className="text-[1.15rem] font-bold tracking-[-0.03em] text-[#0B1F3A] sm:text-[1.6rem] lg:text-[1.75rem]">
            Featured Products
          </h2>
          <Link
            href="/mattresses"
            className="inline-flex shrink-0 items-center gap-1 text-[11px] font-medium text-[#2F7BFF] transition-colors hover:text-[#2569e0] sm:text-[14px]"
          >
            View all products
            <HiOutlineArrowRight
              className="h-3.5 w-3.5 sm:h-4 sm:w-4"
              aria-hidden="true"
            />
          </Link>
        </div>

        <div className="flex items-stretch gap-2 md:gap-3">
          <aside className="relative hidden w-[240px] shrink-0 self-stretch overflow-hidden rounded-2xl md:block lg:w-[300px] xl:w-[340px]">
            <Image
              src="/left-banner-03.png"
              alt="Exchange your old mattress and get 10% off"
              fill
              quality={95}
              className="object-cover object-top"
              sizes="(min-width: 1280px) 680px, 520px"
            />
          </aside>

          <div className="min-w-0 flex-1">
            {loading ? (
              <div className="grid grid-cols-2 gap-2 md:gap-3 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="aspect-[4/5] animate-pulse rounded-2xl bg-[#EAF3FF]"
                  />
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-2 gap-2 md:gap-3 lg:grid-cols-3">
                {products.map((product) => (
                  <div key={product.slug} className="min-w-0 w-full">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-10 text-center text-[14px] text-[#64748B]">
                Products will appear here once the catalog loads.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
