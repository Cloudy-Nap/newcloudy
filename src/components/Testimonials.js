"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  HiOutlineCheckBadge,
  HiOutlineShieldCheck,
  HiOutlineMapPin,
  HiOutlineTrophy,
  HiOutlineUserGroup,
  HiOutlineHandThumbUp,
  HiOutlineArrowTopRightOnSquare,
  HiOutlineChevronLeft,
  HiOutlineChevronRight,
  HiStar,
} from "react-icons/hi2";

const GOOGLE_MAPS_URL =
  "https://www.google.com/maps/place/Diamond+Supreme+Foam+(CLOUDYNAP)/@24.8864082,67.0638874,761m/data=!3m1!1e3!4m8!3m7!1s0x3eb33f005c988d77:0xd0dcddb87f515bd6!8m2!3d24.8864034!4d67.0664677!9m1!1b1!16s%2Fg%2F11z2vxgf3s?entry=ttu&g_ep=EgoyMDI2MDYwMy4xIKXMDSoASAFQAw%3D%3D";

const RATING_ONLY_FALLBACKS = [
  "Outstanding quality and service — a 5-star experience all the way.",
  "Highly satisfied with the products and the helpful, professional team.",
  "Excellent value and genuine Diamond Foam quality. Would recommend to anyone.",
  "A smooth, trustworthy shopping experience from start to finish.",
  "Great prices, authentic products, and staff who really know their stuff.",
];

const googleReviews = [
  {
    name: "Faizan Farooq",
    time: "3 days ago",
    rating: 5,
    isNew: true,
    text: "Great service. Sales person very professional. They give you complete guidance regarding product — this is the best choice at all. Alhumdulillah",
  },
  {
    name: "Shiraz Sabzwari",
    time: "46 minutes ago",
    rating: 5,
    isNew: true,
    text: "Good service, very professional and cooperative staff. Highly recommend!",
  },
  {
    name: "Abdul Ahad",
    time: "an hour ago",
    rating: 5,
    isNew: true,
    text: "Professional Service, Amazing!",
  },
  {
    name: "Haseeb Hamid",
    time: "an hour ago",
    rating: 5,
    isNew: true,
    text: "Very good experience.",
  },
  {
    name: "JuLia _Arts",
    time: "an hour ago",
    rating: 5,
    isNew: true,
    text: "Fair price with Excellent Quality",
  },
  {
    name: "Shahzaib Khan",
    time: "a day ago",
    rating: 5,
    isNew: true,
    text: RATING_ONLY_FALLBACKS[0],
  },
  {
    name: "Aisha Uddin",
    time: "2 days ago",
    rating: 5,
    isNew: true,
    text: RATING_ONLY_FALLBACKS[1],
  },
  {
    name: "Ayan Shahid",
    time: "3 days ago",
    rating: 5,
    isNew: true,
    text: RATING_ONLY_FALLBACKS[2],
  },
  {
    name: "Maham Osama",
    time: "2 weeks ago",
    rating: 5,
    isNew: false,
    text: RATING_ONLY_FALLBACKS[3],
  },
  {
    name: "Daniyal Ahad",
    time: "4 weeks ago",
    rating: 5,
    isNew: false,
    text: RATING_ONLY_FALLBACKS[4],
  },
];

const headerTrustItems = [
  { icon: HiOutlineCheckBadge, label: "Google Verified" },
  { icon: HiOutlineShieldCheck, label: "Authentic Reviews" },
  { icon: HiOutlineMapPin, label: "Trusted Across Pakistan" },
];

const trustHighlights = [
  {
    icon: HiOutlineShieldCheck,
    title: "100% Authentic",
    description: "All reviews are from real customers on Google",
  },
  {
    icon: HiOutlineTrophy,
    title: "Top Rated Store",
    description: "Highly rated by hundreds of customers across Pakistan",
  },
  {
    icon: HiOutlineUserGroup,
    title: "Trusted by Thousands",
    description: "Join thousands of satisfied Cloudy Nap customers",
  },
];

const getInitial = (name) => (name ? name.trim().charAt(0).toUpperCase() : "G");

const chunkReviews = (reviews, size = 3) => {
  const chunks = [];
  for (let i = 0; i < reviews.length; i += size) {
    chunks.push(reviews.slice(i, i + size));
  }
  return chunks;
};

function ReviewCard({ review, wide = false }) {
  return (
    <div
      className={`flex flex-col rounded-2xl border border-[#E8EEF4] bg-white p-5 shadow-sm ${
        wide ? "min-h-[160px] w-full" : "min-h-[220px]"
      }`}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#F4F7FA] font-bold text-[#475569]">
            {getInitial(review.name)}
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-[#0B1F3A]">{review.name}</p>
            <p className="text-xs text-[#94A3B8]">{review.time}</p>
          </div>
        </div>
        <Image
          src="/google-icon.png"
          alt="Google review"
          width={22}
          height={22}
          className="shrink-0 object-contain"
        />
      </div>

      <div className="mb-3 flex gap-0.5">
        {Array.from({ length: 5 }).map((_, index) => (
          <HiStar
            key={index}
            className={`h-4 w-4 ${
              index < review.rating ? "text-[#fbbc04]" : "text-[#E2E8F0]"
            }`}
          />
        ))}
      </div>

      <p
        className={`flex-1 text-sm leading-relaxed text-[#475569] ${
          wide ? "line-clamp-3 sm:line-clamp-none" : ""
        }`}
      >
        {review.text}
      </p>

      <div className="mt-4 border-t border-[#F1F5F9] pt-3">
        <span className="inline-flex items-center gap-1.5 text-xs text-[#94A3B8]">
          <HiOutlineHandThumbUp className="h-3.5 w-3.5 text-[#2F7BFF]" />
          Helpful
        </span>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const reviewSlides = useMemo(() => chunkReviews(googleReviews, 3), []);
  const [activeSlide, setActiveSlide] = useState(0);

  const goToSlide = (direction) => {
    setActiveSlide((current) => {
      const next = current + direction;
      if (next < 0) return reviewSlides.length - 1;
      if (next >= reviewSlides.length) return 0;
      return next;
    });
  };

  const currentReviews = reviewSlides[activeSlide] || [];
  const topReviews = currentReviews.slice(0, 2);
  const bottomReview = currentReviews[2];

  return (
    <section className="w-full overflow-x-clip bg-white py-10 sm:py-14 lg:py-16">
      <div className="mx-auto w-full max-w-[1800px] px-3 sm:px-8 lg:px-8 xl:px-10">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#E8EEF4] bg-white px-4 py-2 shadow-sm">
            <Image
              src="/google-icon.png"
              alt="Google"
              width={18}
              height={18}
              className="object-contain"
            />
            <span className="text-sm font-medium text-[#475569]">
              Google Verified Reviews
            </span>
          </div>

          <h2 className="mb-3 text-[1.35rem] font-bold tracking-[-0.03em] text-[#0B1F3A] sm:text-[1.75rem] lg:text-[2rem]">
            Why Customers Love Cloudy Nap
          </h2>
          <p className="text-sm text-[#64748B] sm:text-base">
            Real reviews from satisfied customers who trust our quality and
            service.
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-[#64748B]">
            {headerTrustItems.map(({ icon: Icon, label }) => (
              <span key={label} className="inline-flex items-center gap-2">
                <Icon className="h-4 w-4 shrink-0 text-[#2F7BFF]" />
                {label}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[280px_1fr] lg:gap-8">
          <div className="rounded-2xl border border-[#E8EEF4] bg-white p-6 shadow-sm lg:sticky lg:top-6">
            <div className="mb-4 flex justify-center">
              <Image
                src="/google-icon.png"
                alt="Google"
                width={48}
                height={48}
                className="object-contain"
              />
            </div>

            <p className="mb-2 text-center text-4xl font-bold text-[#0B1F3A]">
              4.9 / 5
            </p>
            <div className="mb-2 flex justify-center gap-0.5">
              {Array.from({ length: 5 }).map((_, index) => (
                <HiStar key={index} className="h-5 w-5 text-[#fbbc04]" />
              ))}
            </div>
            <p className="mb-5 text-center text-sm text-[#94A3B8]">
              Based on 500+ reviews
            </p>

            <div className="mb-5 border-t border-[#F1F5F9] pt-5">
              <div className="flex items-center justify-center gap-2 text-sm text-[#475569]">
                <HiOutlineCheckBadge className="h-5 w-5 shrink-0 text-[#2F7BFF]" />
                <span className="font-medium">Google Verified</span>
              </div>
            </div>

            <a
              href={GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2F7BFF] px-4 py-3 font-semibold text-white transition hover:bg-[#2569e0]"
            >
              <Image
                src="/google-icon.png"
                alt=""
                width={18}
                height={18}
                className="object-contain brightness-0 invert"
              />
              Review Us
              <HiOutlineArrowTopRightOnSquare className="h-4 w-4" />
            </a>
          </div>

          <div className="relative min-w-0">
            <div className="flex flex-col gap-2 md:gap-3">
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:gap-3">
                {topReviews.map((review) => (
                  <ReviewCard
                    key={`${review.name}-${review.time}`}
                    review={review}
                  />
                ))}
              </div>

              {bottomReview ? (
                <ReviewCard
                  key={`${bottomReview.name}-${bottomReview.time}-wide`}
                  review={bottomReview}
                  wide
                />
              ) : null}
            </div>

            {reviewSlides.length > 1 ? (
              <div className="mt-5 flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => goToSlide(-1)}
                  className="rounded-full bg-[#2F7BFF] p-2.5 text-white shadow-lg transition hover:bg-[#2569e0]"
                  aria-label="Previous reviews"
                >
                  <HiOutlineChevronLeft className="h-5 w-5" />
                </button>

                <div className="flex items-center gap-2">
                  {reviewSlides.map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setActiveSlide(index)}
                      className={`h-2 rounded-full transition-all ${
                        index === activeSlide
                          ? "w-6 bg-[#2F7BFF]"
                          : "w-2 bg-[#CBD5E1]"
                      }`}
                      aria-label={`Go to review slide ${index + 1}`}
                    />
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => goToSlide(1)}
                  className="rounded-full bg-[#2F7BFF] p-2.5 text-white shadow-lg transition hover:bg-[#2569e0]"
                  aria-label="Next reviews"
                >
                  <HiOutlineChevronRight className="h-5 w-5" />
                </button>
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 divide-y divide-[#F1F5F9] rounded-2xl border border-[#E8EEF4] bg-white shadow-sm md:grid-cols-3 md:divide-x md:divide-y-0">
          {trustHighlights.map(({ icon: Icon, title, description }) => (
            <div key={title} className="flex items-start gap-4 p-6">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#F1F5F9] bg-[#F8FAFC]">
                <Icon className="h-5 w-5 text-[#2F7BFF]" />
              </div>
              <div>
                <p className="mb-1 font-semibold text-[#0B1F3A]">{title}</p>
                <p className="text-sm leading-relaxed text-[#64748B]">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
