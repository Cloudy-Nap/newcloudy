"use client";

import Image from "next/image";
import Link from "next/link";
import { HiStar, HiOutlineHeart, HiOutlineShoppingCart } from "react-icons/hi2";
import { useCart } from "@/context/CartContext";

export default function ProductCard({ product }) {
  const href = product.slug ? `/product/${product.slug}` : "#";
  const { addItem } = useCart();

  return (
    <article className="group flex h-full w-full min-w-0 flex-col overflow-hidden rounded-lg border border-[#E8EEF4] bg-white shadow-[0_2px_8px_rgba(15,23,42,0.04)] transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(15,23,42,0.1)] md:rounded-2xl md:border-0 md:shadow-[0_4px_18px_rgba(15,23,42,0.06)]">
      <Link href={href} className="relative block aspect-[4/3] w-full min-h-0 overflow-hidden bg-[#F4F7FA]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover object-center transition-transform duration-300 ease-out group-hover:scale-[1.02]"
          sizes="(max-width: 1024px) 50vw, 25vw"
        />
        {product.badge ? (
          <span className="absolute left-2 top-2 inline-flex max-w-[calc(100%-8px)] items-center gap-0.5 truncate rounded-full bg-[#2F7BFF] px-1.5 py-0.5 text-[6px] font-medium leading-none text-white shadow-sm md:left-3 md:top-3 md:max-w-none md:gap-1 md:px-2.5 md:py-1 md:text-[11px]">
            <HiStar className="h-1.5 w-1.5 shrink-0 md:h-3 md:w-3" aria-hidden="true" />
            <span className="truncate">{product.badge}</span>
          </span>
        ) : null}
      </Link>

      <div className="flex min-w-0 items-start justify-between gap-2 p-2.5 md:gap-3 md:p-4">
        <Link href={href} className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-[11px] font-semibold leading-tight tracking-[-0.01em] text-[#0B1F3A] transition-colors group-hover:text-[#2F7BFF] md:text-[15px]">
            {product.name}
          </h3>

          <p className="mt-0.5 truncate text-[11px] font-bold tracking-[-0.02em] text-[#0B1F3A] md:mt-1.5 md:text-[1.05rem]">
            {product.price}
          </p>
        </Link>

        <div className="flex shrink-0 items-center gap-1.5 md:gap-2">
          <button
            type="button"
            aria-label={`Add ${product.name} to wishlist`}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-[#C7DBF5] bg-white text-[#2F7BFF] transition-colors hover:bg-[#F0F7FF] md:h-8 md:w-8 md:rounded-lg"
          >
            <HiOutlineHeart className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </button>
          <button
            type="button"
            aria-label={`Add ${product.name} to cart`}
            onClick={() => addItem(product, { quantity: 1 })}
            className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[#2F7BFF] text-white shadow-[0_2px_8px_rgba(47,123,255,0.28)] transition-colors hover:bg-[#2569e0] md:h-8 md:w-8 md:rounded-lg"
          >
            <HiOutlineShoppingCart className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </button>
        </div>
      </div>
    </article>
  );
}
