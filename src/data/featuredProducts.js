/**
 * Featured Products data.
 * `slug` powers /product/[slug] pages.
 */
export const featuredProducts = [
  {
    id: 1,
    slug: "folding-mattress",
    name: "Folding Mattress",
    image: "/folding.png",
    gallery: ["/folding.png", "/mattress3.png", "/mattress2.png"],
    description: "Space-saving comfort that folds away when you need room.",
    longDescription:
      "Designed for modern living, the Folding Mattress delivers full-size comfort that packs down when you need the floor space. Soft cushioning on top, supportive foam underneath — built for guest rooms, studios, and everyday flexibility.",
    price: "Rs. 24,999",
    rating: 4.8,
    reviewCount: 1245,
    badge: "Bestseller",
    category: "Mattresses",
    sizes: [
      { id: "single", label: "Single", dims: "78 × 42" },
      { id: "queen-1", label: "Queen 1", dims: "78 × 60" },
      { id: "queen-2", label: "Queen 2", dims: "78 × 66" },
      { id: "king", label: "King", dims: "78 × 72" },
    ],
    thicknesses: [
      { id: "6", label: "6 inches", available: true },
      { id: "8", label: "8 inches", available: true },
      { id: "10", label: "10 inches", available: false },
    ],
    highlights: [
      "Folds flat for easy storage",
      "Medium-soft comfort feel",
      "Removable, washable cover",
      "Free express delivery across Pakistan",
    ],
    specs: [
      { label: "Feel", value: "Medium Soft" },
      { label: "Thickness", value: "6–8 inches" },
      { label: "Cover", value: "Removable & Washable" },
      { label: "Trial", value: "100 Nights" },
      { label: "Warranty", value: "10 Years" },
    ],
  },
  {
    id: 2,
    slug: "dreamer-1000-standard",
    name: "Dreamer 1000 Standard",
    image: "/dreamer.png",
    gallery: ["/dreamer.png", "/dvseries.png", "/mattress.png"],
    description: "Balanced support for deeper, more restorative sleep.",
    longDescription:
      "The Dreamer 1000 Standard blends balanced support with a plush top feel — engineered for sleepers who want alignment without sacrificing softness.",
    price: "Rs. 18,999",
    rating: 4.7,
    reviewCount: 892,
    badge: "New Arrival",
    category: "Mattresses",
    sizes: [
      { id: "single", label: "Single", dims: "78 × 42" },
      { id: "queen-1", label: "Queen 1", dims: "78 × 60" },
      { id: "queen-2", label: "Queen 2", dims: "78 × 66" },
      { id: "king", label: "King", dims: "78 × 72" },
    ],
    thicknesses: [
      { id: "6", label: "6 inches", available: true },
      { id: "8", label: "8 inches", available: true },
      { id: "10", label: "10 inches", available: true },
    ],
    highlights: [
      "Balanced medium feel",
      "Pressure-relieving top layer",
      "Breathable quilted surface",
      "10-year warranty included",
    ],
    specs: [
      { label: "Feel", value: "Medium" },
      { label: "Thickness", value: "6–10 inches" },
      { label: "Cover", value: "Quilted Knit" },
      { label: "Trial", value: "100 Nights" },
      { label: "Warranty", value: "10 Years" },
    ],
  },
  {
    id: 3,
    slug: "beauty-sleep-pillow",
    name: "Beauty Sleep Pillow",
    image: "/sleep.png",
    gallery: ["/sleep.png", "/pillows.png"],
    description: "Plush cushioning designed for neck comfort all night.",
    longDescription:
      "The Beauty Sleep Pillow cradles your neck with soft, resilient fill — shaped for side and back sleepers who want cloud-like comfort without morning stiffness.",
    price: "Rs. 3,499",
    rating: 4.9,
    reviewCount: 2104,
    badge: "Top Rated",
    category: "Pillows",
    sizes: [
      { id: "standard", label: "Standard", dims: "20 × 26" },
      { id: "queen", label: "Queen", dims: "20 × 30" },
      { id: "king", label: "King", dims: "20 × 36" },
    ],
    thicknesses: [
      { id: "low", label: "Low loft", available: true },
      { id: "medium", label: "Medium loft", available: true },
      { id: "high", label: "High loft", available: true },
    ],
    highlights: [
      "Neck-friendly loft",
      "Soft, breathable cover",
      "Machine-washable",
      "Pairs perfectly with Dolce Vita mattresses",
    ],
    specs: [
      { label: "Fill", value: "Premium Polyester" },
      { label: "Loft", value: "Medium" },
      { label: "Cover", value: "Soft Knit" },
      { label: "Care", value: "Machine Washable" },
    ],
  },
  {
    id: 4,
    slug: "supreme-silk",
    name: "Supreme Silk",
    image: "/silk.png",
    gallery: ["/silk.png", "/sseries.png"],
    description: "Smooth silk finish for cooler, more luxurious rest.",
    longDescription:
      "Supreme Silk brings a cool, smooth sleep surface with supportive depth underneath — a refined pick for hot sleepers who still want structure.",
    price: "Rs. 12,999",
    rating: 4.6,
    reviewCount: 678,
    badge: "Popular",
    category: "Mattresses",
    sizes: [
      { id: "single", label: "Single", dims: "78 × 42" },
      { id: "queen-1", label: "Queen 1", dims: "78 × 60" },
      { id: "queen-2", label: "Queen 2", dims: "78 × 66" },
      { id: "king", label: "King", dims: "78 × 72" },
    ],
    thicknesses: [
      { id: "6", label: "6 inches", available: true },
      { id: "8", label: "8 inches", available: true },
      { id: "10", label: "10 inches", available: false },
    ],
    highlights: [
      "Cool-touch silk-feel cover",
      "Supportive foam core",
      "Elegant quilted finish",
      "Free express delivery",
    ],
    specs: [
      { label: "Feel", value: "Medium Firm" },
      { label: "Thickness", value: "6–8 inches" },
      { label: "Cover", value: "Silk-Feel Knit" },
      { label: "Trial", value: "100 Nights" },
      { label: "Warranty", value: "10 Years" },
    ],
  },
  // Temporary duplicates — replace later
  {
    id: 5,
    slug: "folding-mattress",
    name: "Folding Mattress",
    image: "/folding.png",
    description: "Space-saving comfort that folds away when you need room.",
    price: "Rs. 24,999",
    rating: 4.8,
    reviewCount: 1245,
    badge: "Bestseller",
  },
  {
    id: 6,
    slug: "dreamer-1000-standard",
    name: "Dreamer 1000 Standard",
    image: "/dreamer.png",
    description: "Balanced support for deeper, more restorative sleep.",
    price: "Rs. 18,999",
    rating: 4.7,
    reviewCount: 892,
    badge: "New Arrival",
  },
  {
    id: 7,
    slug: "beauty-sleep-pillow",
    name: "Beauty Sleep Pillow",
    image: "/sleep.png",
    description: "Plush cushioning designed for neck comfort all night.",
    price: "Rs. 3,499",
    rating: 4.9,
    reviewCount: 2104,
    badge: "Top Rated",
  },
  {
    id: 8,
    slug: "supreme-silk",
    name: "Supreme Silk",
    image: "/silk.png",
    description: "Smooth silk finish for cooler, more luxurious rest.",
    price: "Rs. 12,999",
    rating: 4.6,
    reviewCount: 678,
    badge: "Popular",
  },
];

export function getProductBySlug(slug) {
  return featuredProducts.find((p) => p.slug === slug && p.longDescription)
    || featuredProducts.find((p) => p.slug === slug)
    || null;
}

export function getUniqueProductSlugs() {
  return [...new Set(featuredProducts.map((p) => p.slug))];
}
