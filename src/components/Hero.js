"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const SLIDES = [
  {
    id: "slide-1",
    src: "/main-slider-images-003--Image---1.png",
    alt: "CloudyNap Dolce Vita Urban Collezione mattress",
    variant: "dolce",
    headline: ["Sleep in Supreme", "Comfort"],
    description: [
      "Luxury craftsmanship for deeper rest",
      "and timeless style.",
    ],
    cta: { label: "Shop the Collection", href: "/mattresses?brand=Dolce%20Vita" },
  },
  {
    id: "slide-2",
    src: "/main-slider-images-003--Image---2.png",
    alt: "CloudyNap Supreme Foam mattress",
    variant: "supreme-foam",
    brand: "SupremeFoam®",
    tagline: "Comfort You Can Count On",
    description: [
      "Premium foam support, long-lasting comfort,",
      "and a restful night's sleep.",
    ],
    cta: { label: "Shop Now", href: "/mattresses?brand=SupremeFoam" },
  },
  {
    id: "slide-3",
    src: "/main-slider-images-003--Image---3.png",
    alt: "CloudyNap Supreme Ortica mattress",
    variant: "ortica",
    eyebrow: "Supreme ORTICA",
    headline: ["Support That Sleeps", "With You"],
    description: [
      "Engineered comfort with balanced support for a",
      "restful, refreshing night's sleep.",
    ],
    features: "Orthopedic Support | Premium Comfort | Lasting Durability",
    cta: { label: "Shop Now", href: "/mattresses?brand=Ortica" },
  },
];

const HOLD_MS = 5500;

function SlideCopy({ slide }) {
  if (slide.variant === "dolce") {
    return (
      <div className="flex max-w-[34rem] flex-col items-start text-left text-[#F4F1EC]">
        <h1 className="font-serif text-[clamp(2.1rem,5vw,4.25rem)] font-medium leading-[1.08] tracking-[-0.02em]">
          {slide.headline.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </h1>
        <p className="mt-5 max-w-[22rem] text-[14px] font-normal leading-[1.55] text-white/90 sm:mt-6 sm:text-[16px] lg:text-[17px]">
          {slide.description.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>
        <Link
          href={slide.cta.href}
          className="mt-7 inline-flex items-center gap-2 border border-[#C4A37A] px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.14em] text-[#F4F1EC] transition-colors hover:bg-[#C4A37A]/15 sm:mt-8 sm:px-6 sm:py-3 sm:text-[12px]"
        >
          {slide.cta.label}
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    );
  }

  if (slide.variant === "supreme-foam") {
    return (
      <div className="flex max-w-[36rem] flex-col items-start text-left text-white">
        <p className="text-[clamp(2rem,4.6vw,3.75rem)] font-bold italic leading-[1.05] tracking-[-0.02em]">
          {slide.brand}
        </p>
        <div className="mt-4 sm:mt-5">
          <p className="text-[clamp(1.15rem,2.2vw,1.75rem)] font-medium leading-snug tracking-[-0.01em]">
            {slide.tagline}
          </p>
          <span
            aria-hidden="true"
            className="mt-2 block h-px w-16 bg-[#7DD3FC] sm:w-20"
          />
        </div>
        <p className="mt-5 max-w-[26rem] text-[14px] font-normal leading-[1.55] text-white/90 sm:mt-6 sm:text-[16px]">
          {slide.description.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>
        <Link
          href={slide.cta.href}
          className="mt-7 inline-flex items-center gap-2 rounded-full border border-white px-6 py-2.5 text-[11px] font-medium uppercase tracking-[0.12em] text-white transition-colors hover:bg-white/10 sm:mt-8 sm:px-7 sm:py-3 sm:text-[12px]"
        >
          {slide.cta.label}
          <span aria-hidden="true">&gt;</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex max-w-[36rem] flex-col items-start text-left text-[#F7F3EE]">
      <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-white/90 sm:text-[12px]">
        {slide.eyebrow}
      </p>
      <h1 className="mt-3 font-serif text-[clamp(2.1rem,5vw,4.1rem)] font-medium leading-[1.08] tracking-[-0.02em] sm:mt-4">
        {slide.headline.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </h1>
      <p className="mt-5 max-w-[28rem] text-[14px] font-normal leading-[1.55] text-white/90 sm:mt-6 sm:text-[16px]">
        {slide.description.map((line) => (
          <span key={line} className="block">
            {line}
          </span>
        ))}
      </p>
      <p className="mt-4 text-[10px] font-medium uppercase tracking-[0.12em] text-white/85 sm:mt-5 sm:text-[11px]">
        {slide.features}
      </p>
      <Link
        href={slide.cta.href}
        className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#E2C6A9] px-6 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#3A2A1E] transition-colors hover:bg-[#EBD2B8] sm:mt-8 sm:px-7 sm:py-3 sm:text-[12px]"
      >
        {slide.cta.label}
        <span aria-hidden="true">&gt;</span>
      </Link>
    </div>
  );
}

export default function Hero() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const goTo = useCallback((index) => {
    setActiveIndex(((index % SLIDES.length) + SLIDES.length) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (paused) return undefined;
    const id = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % SLIDES.length);
    }, HOLD_MS);
    return () => window.clearInterval(id);
  }, [paused]);

  return (
    <section
      className="relative w-full overflow-hidden bg-[#0B1F3A]"
      aria-roledescription="carousel"
      aria-label="Featured mattresses"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative min-h-[85vh] w-full sm:min-h-[92vh] lg:min-h-[100vh]">
        {SLIDES.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-out ${
              index === activeIndex
                ? "pointer-events-auto opacity-100"
                : "pointer-events-none opacity-0"
            }`}
            aria-hidden={index !== activeIndex}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={index === 0}
              quality={95}
              className="object-cover object-center"
              sizes="100vw"
            />

            <div className="absolute inset-0 z-[1] flex items-center">
              <div className="mx-auto w-full max-w-[1800px] px-4 pt-16 sm:px-8 sm:pt-20 lg:px-10 lg:pt-10">
                <SlideCopy slide={slide} />
              </div>
            </div>
          </div>
        ))}

        <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 sm:bottom-8">
          {SLIDES.map((slide, index) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === activeIndex}
              onClick={() => goTo(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === activeIndex
                  ? "w-7 bg-white"
                  : "w-2 bg-white/45 hover:bg-white/70"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
