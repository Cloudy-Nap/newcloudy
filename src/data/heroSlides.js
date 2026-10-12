/**
 * Homepage hero slides — edit copy/images per slide here.
 * Each slide keeps its own `image` + image composition so assets/sizing can be tuned independently.
 */

/** Readable hold before the next transition begins */
export const HERO_SLIDE_HOLD_MS = 3800;

/** Slide 1 baseline — full image zone (do not change lightly) */
const heroImageFull = {
  imageWidth: 1535,
  imageHeight: 1024,
  imageWrapperClassName: "relative h-full w-full",
  imageClassName: "h-full w-full object-contain object-center",
  imageEdgeFadeClassName: "",
};

/**
 * Promo artwork (slides 2–3):
 * Mobile: fill right hero column (substantial visual).
 * md+: keep approved desktop right-biased contain sizing.
 */
const heroImagePromo = {
  imageWidth: 1536,
  imageHeight: 1024,
  imageWrapperClassName:
    "relative flex h-full w-full items-center justify-end pl-0.5 pr-0 md:pl-8 md:pr-1 lg:pl-12 lg:pr-3",
  imageClassName:
    "h-auto w-full max-h-[96%] object-contain object-center md:w-[90%] md:max-h-[86%] lg:w-[82%] lg:max-h-[82%]",
  imageEdgeFadeClassName: "hero-promo-img-fade",
};

/** Delivery graphic — slightly tighter on desktop; full mobile column fill */
const heroImagePromoCompact = {
  imageWidth: 1448,
  imageHeight: 1086,
  imageWrapperClassName:
    "relative flex h-full w-full items-center justify-end pl-0.5 pr-0 md:pl-10 md:pr-1 lg:pl-14 lg:pr-3",
  imageClassName:
    "h-auto w-full max-h-[94%] object-contain object-center md:w-[86%] md:max-h-[82%] lg:w-[78%] lg:max-h-[78%]",
  imageEdgeFadeClassName: "hero-promo-img-fade",
};

export const heroSlides = [
  {
    id: "sleep-better",
    eyebrow: "Perfect Sleep Begins Here",
    titleLine1: "Sleep Better.",
    titleLine2: "Wake Better.",
    titleLine2Accent: true,
    supportLine: null,
    description:
      "Experience unmatched comfort and support with mattresses designed for the way you sleep.",
    primaryCta: { label: "Shop Mattresses →", href: "#" },
    secondaryCta: { label: "Book a Free Trial", href: "#" },
    showSocialProof: true,
    secondaryNote: null,
    image: "/heroimg1.png",
    imageAlt: "CloudyNap mattress in a bright modern bedroom",
    ...heroImageFull,
  },
  {
    id: "pillows-bundle",
    eyebrow: "Special Bundle Offer",
    titleLine1: "Buy a New",
    titleLine2: "Mattress",
    titleLine2Accent: true,
    supportLine: "And Get 2 Pillows For Free!",
    description:
      "Upgrade your sleep setup and enjoy two free pillows with your new mattress purchase.",
    primaryCta: { label: "Shop This Offer →", href: "#" },
    secondaryCta: { label: "Learn More", href: "#" },
    showSocialProof: false,
    secondaryNote: null,
    image: "/2pillows.png",
    imageAlt: "CloudyNap mattress bundle offer",
    ...heroImagePromo,
  },
  {
    id: "exchange-offer",
    eyebrow: "Exchange Offer",
    titleLine1: "Exchange Your Old Mattress",
    titleLine2: "For a Brand New One!",
    titleLine2Accent: true,
    supportLine: null,
    description:
      "Trade in your old mattress and get up to 30% off on a new one.",
    primaryCta: { label: "Explore Exchange Offer →", href: "#" },
    secondaryCta: { label: "See How It Works", href: "#" },
    showSocialProof: false,
    secondaryNote: null,
    image: "/30.png",
    imageAlt: "CloudyNap mattress exchange offer",
    ...heroImagePromo,
  },
  {
    id: "free-delivery",
    eyebrow: "Hassle-Free Delivery",
    titleLine1: "Free Delivery",
    titleLine2: "In Karachi",
    titleLine2Accent: true,
    supportLine: null,
    description:
      "We deliver comfort right to your doorstep across Karachi.",
    primaryCta: { label: "Order Now →", href: "#" },
    secondaryCta: { label: "Delivery Details", href: "#" },
    showSocialProof: false,
    secondaryNote: "*Terms & Conditions Apply",
    image: "/free.png",
    imageAlt: "CloudyNap free delivery across the U.S.",
    ...heroImagePromoCompact,
  },
];
