/**
 * Storefront API helpers — mirrors live CMS fetch patterns.
 */
import { API_BASE, createApiUrl } from "@/app/lib/apiBase";
import { getCategoryPlaceholderImage } from "@/app/lib/categoryPlaceholders";
import {
  discountsArrayToMap,
  mergeListProductDiscount,
} from "@/app/lib/categoryDiscounts";

export { API_BASE, createApiUrl };

async function apiFetch(path, options = {}) {
  const url =
    typeof path === "string" && path.startsWith("http")
      ? path
      : createApiUrl(path).toString();

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  let data = null;
  const text = await res.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!res.ok) {
    const message =
      (data && typeof data === "object" && (data.error || data.message)) ||
      `Request failed (${res.status})`;
    const err = new Error(message);
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

/** FE route key → API products subcategory */
export const CATEGORY_API = {
  mattresses: { subcategory: "matteress", type: "bed", label: "Mattresses" },
  pillows: {
    subcategory: "accessories",
    type: "accessory",
    label: "Pillows",
    /** Same accessories table as /accessories — keep only pillow-named items. */
    includePillows: true,
  },
  accessories: {
    subcategory: "accessories",
    type: "accessory",
    label: "Accessories",
    /** Same accessories table as /pillows — exclude pillow-named items. */
    includePillows: false,
  },
  sofas: { subcategory: "sofa-cum-bed", type: "sofacumbed", label: "Sofas" },
  furniture: { subcategory: "furniture", type: "furniture", label: "Furniture" },
};

/** Accessories table holds both pillows and non-pillow items — split by name. */
export function isPillowAccessory(item) {
  const name = String(item?.name || "").toLowerCase();
  return /\bpillow\b/.test(name);
}

export function formatStorePrice(amount) {
  const n = Number(amount);
  if (!Number.isFinite(n) || n <= 0) return "Price on request";
  return `Rs. ${Math.round(n).toLocaleString("en-PK")}`;
}

export function parseStorePrice(price) {
  if (typeof price === "number") return price;
  if (typeof price !== "string") return 0;
  return Number(price.replace(/[^\d]/g, "")) || 0;
}

function extractImages(item) {
  if (!item) return [];
  let urls = [];
  if (Array.isArray(item.image_urls)) urls = item.image_urls;
  else if (Array.isArray(item.imageUrls)) urls = item.imageUrls;
  else if (Array.isArray(item.images)) urls = item.images;

  const normalized = urls
    .filter((u) => typeof u === "string" && u.trim())
    .map((u) => u.trim());

  const cover =
    typeof item.image === "string" && item.image.trim() ? item.image.trim() : "";

  if (!normalized.length && cover) return [cover];
  if (cover && !normalized.includes(cover)) return [cover, ...normalized];
  return normalized;
}

function slugifyName(name) {
  return String(name || "product")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 60);
}

/** Stable storefront slug: bed-2, accessory-15, … */
export function productSlug(type, id) {
  return `${type}-${id}`;
}

export function parseProductSlug(slug) {
  if (!slug || typeof slug !== "string") return null;
  const match = slug.match(
    /^(bed|accessory|furniture|sofacumbed|deal)-(.+)$/i
  );
  if (!match) return null;
  return { type: match[1].toLowerCase(), id: match[2] };
}

/**
 * Infer mattress size bucket from width.
 * Single ≈ 42, Queen ≈ 60, Queen 2 ≈ 66, King ≥ 72.
 */
function inferBedSizeName(length, width) {
  const w = Number(width);
  if (!Number.isFinite(w) || w <= 0) return null;
  if (w >= 72) return "King";
  if (w >= 64) return "Queen 2";
  if (w >= 54) return "Queen";
  return "Single";
}

function resolveBedSizeName(variant) {
  const explicit = String(variant?.size_name || variant?.sizeName || "").trim();
  if (explicit) {
    const lower = explicit.toLowerCase();
    if (lower.includes("king")) return "King";
    if (lower.includes("queen 2") || lower.includes("queen2")) return "Queen 2";
    if (lower.includes("queen")) return "Queen";
    if (lower.includes("single") || lower.includes("twin")) return "Single";
    return explicit;
  }
  return inferBedSizeName(variant?.length, variant?.width);
}

/** Canonical L×W targets for each of the 4 storefront sizes. */
const BED_SIZE_TARGETS = [
  { name: "Single", length: 78, width: 42 },
  { name: "Queen", length: 78, width: 60 },
  { name: "Queen 2", length: 78, width: 66 },
  { name: "King", length: 78, width: 72 },
];

function bedSizeDistance(length, width, target) {
  return (
    Math.abs(Number(width) - target.width) * 10 +
    Math.abs(Number(length) - target.length)
  );
}

/**
 * Collapse all bed variants into at most 4 sizes: Single, Queen, Queen 2, King.
 * Picks the available L×W closest to each target (78×42 / 60 / 66 / 72).
 */
function bedSizeOptions(variants = []) {
  const byName = new Map();

  for (const v of variants) {
    const w = Number(v.width);
    const l = Number(v.length);
    if (!Number.isFinite(w) || !Number.isFinite(l)) continue;
    const sizeName = resolveBedSizeName(v);
    if (!sizeName) continue;

    const dimKey = `${w}x${l}`;
    if (!byName.has(sizeName)) byName.set(sizeName, new Map());
    const dims = byName.get(sizeName);
    if (!dims.has(dimKey)) {
      dims.set(dimKey, { width: w, length: l });
    }
  }

  const options = [];
  for (const target of BED_SIZE_TARGETS) {
    const dims = byName.get(target.name);
    if (!dims?.size) continue;

    let best = null;
    let bestScore = Infinity;
    for (const candidate of dims.values()) {
      const score = bedSizeDistance(candidate.length, candidate.width, target);
      if (score < bestScore) {
        bestScore = score;
        best = candidate;
      }
    }
    if (!best) continue;

    const dimsLabel = `${best.length}x${best.width}`;
    options.push({
      id: `${best.width}x${best.length}`,
      label: `${target.name}-${dimsLabel}`,
      dims: null,
      width: best.width,
      length: best.length,
      sizeName: target.name,
    });
  }

  return options;
}

const BED_THICKNESS_INCHES = [4, 5, 6, 8];

function bedThicknessOptions(variants = []) {
  const available = new Set(
    variants
      .map((v) => Number(v.height))
      .filter((h) => Number.isFinite(h) && BED_THICKNESS_INCHES.includes(h))
  );

  return BED_THICKNESS_INCHES.filter((h) => available.has(h)).map((h) => ({
    id: String(h),
    label: `${h} inches`,
    available: true,
    height: h,
  }));
}

function findBedVariant(variants, sizeId, thicknessId) {
  if (!variants?.length) return null;
  const [w, l] = String(sizeId || "").split("x").map(Number);
  const height = thicknessId != null ? Number(thicknessId) : null;

  return (
    variants.find((v) => {
      const sizeOk =
        !Number.isFinite(w) ||
        !Number.isFinite(l) ||
        (Number(v.width) === w && Number(v.length) === l);
      const thickOk =
        height == null || Number.isNaN(height) || Number(v.height) === height;
      return sizeOk && thickOk;
    }) || variants[0]
  );
}

/**
 * Map API product → UI product shape used by ProductCard / ProductDetail / cart.
 */
export function mapApiProduct(item, discountMap = null) {
  if (!item) return null;
  const type = String(item.type || "bed").toLowerCase();
  const id = item.id;
  const images = extractImages(item);
  const image =
    images[0] || getCategoryPlaceholderImage(type);

  let price = Number(item.price) || 0;
  const variants = Array.isArray(item.variants) ? item.variants : [];

  if ((!price || price <= 0) && variants.length) {
    price = Math.min(...variants.map((v) => Number(v.price) || Infinity));
    if (!Number.isFinite(price)) price = 0;
  }

  let discounted = null;
  if (discountMap) {
    discounted = mergeListProductDiscount(
      { ...item, type, price },
      discountMap
    );
    if (discounted?.price && discounted.price !== price) {
      price = discounted.price;
    }
  }

  const sizes =
    type === "bed"
      ? bedSizeOptions(variants)
      : type === "sofacumbed" || type === "furniture"
        ? variants.map((v, i) => ({
            id: String(v.id || i),
            label: v.option_name || v.fabric || `Option ${i + 1}`,
            dims: null,
            variantId: v.id,
            price: Number(v.price) || 0,
          }))
        : [];

  const thicknesses = type === "bed" ? bedThicknessOptions(variants) : [];

  const highlights = [
    item.features,
    item.benefits,
    item.fabric,
    item.warranty ? `${item.warranty} warranty` : null,
  ].filter(Boolean);

  const specs = [
    item.firmness ? { label: "Feel", value: item.firmness } : null,
    item.brand ? { label: "Brand", value: item.brand } : null,
    item.series ? { label: "Series", value: item.series } : null,
    item.fabric ? { label: "Cover", value: item.fabric } : null,
    item.warranty ? { label: "Warranty", value: item.warranty } : null,
  ].filter(Boolean);

  const slug = productSlug(type, id);

  return {
    id,
    catalogKey: slug,
    type,
    slug,
    name: item.name || "Untitled product",
    image,
    gallery: images.length ? images : [image],
    description: item.description || item.series || "",
    longDescription: item.description || item.benefits || item.features || "",
    price: formatStorePrice(price),
    priceValue: price,
    oldPrice:
      discounted?.oldPriceNumeric != null
        ? formatStorePrice(discounted.oldPriceNumeric)
        : null,
    rating: Number(item.rating) || 4.6,
    reviewCount: Number(item.reviewCount || item.review_count) || 0,
    badge: discounted?.label?.text || item.badge || item.brand || null,
    category:
      type === "bed"
        ? "Mattresses"
        : type === "accessory"
          ? isPillowAccessory(item)
            ? "Pillows"
            : "Accessories"
          : type === "sofacumbed"
            ? "Sofas"
            : type === "furniture"
              ? "Furniture"
              : "Products",
    sizes,
    thicknesses,
    variants,
    highlights,
    specs,
    brand: item.brand || item.series || "CloudyNap",
    firmness: item.firmness || "",
    raw: item,
  };
}

export function resolveVariantPrice(product, sizeId, thicknessId) {
  if (!product) return product?.priceValue || 0;
  if (product.type === "bed") {
    const v = findBedVariant(product.variants, sizeId, thicknessId);
    return Number(v?.price) || product.priceValue || 0;
  }
  if (product.sizes?.length) {
    const size = product.sizes.find((s) => s.id === sizeId);
    if (size?.price) return Number(size.price);
    if (size?.variantId) {
      const v = product.variants?.find((x) => String(x.id) === String(size.variantId));
      if (v) return Number(v.price) || 0;
    }
  }
  return product.priceValue || 0;
}

export function findVariantId(product, sizeId, thicknessId) {
  if (!product) return null;
  if (product.type === "bed") {
    return findBedVariant(product.variants, sizeId, thicknessId)?.id ?? null;
  }
  const size = product.sizes?.find((s) => s.id === sizeId);
  return size?.variantId || size?.id || product.variants?.[0]?.id || null;
}

/* ---------------- endpoints ---------------- */

export async function fetchProducts({ subcategory, limit, sort } = {}) {
  const url = createApiUrl("/api/products");
  if (subcategory) url.searchParams.set("subcategory", subcategory);
  if (limit) url.searchParams.set("limit", String(limit));
  if (sort) url.searchParams.set("sort", sort);
  const data = await apiFetch(url.toString());
  return Array.isArray(data) ? data : [];
}

export async function fetchProductDetail(type, id) {
  return apiFetch(`/api/catalog/${encodeURIComponent(type)}/${encodeURIComponent(id)}`);
}

export async function fetchDiscountsMap() {
  try {
    const data = await apiFetch("/api/discounts");
    return discountsArrayToMap(data?.discounts || data || []);
  } catch {
    return {};
  }
}

export async function fetchStorefrontProducts(categoryKey, { limit } = {}) {
  const cfg = CATEGORY_API[categoryKey];
  const subcategory = cfg?.subcategory;
  const [raw, discountMap] = await Promise.all([
    fetchProducts({ subcategory }),
    fetchDiscountsMap(),
  ]);

  let items = Array.isArray(raw) ? raw : [];
  if (cfg && typeof cfg.includePillows === "boolean") {
    items = items.filter((item) =>
      cfg.includePillows ? isPillowAccessory(item) : !isPillowAccessory(item)
    );
  }
  if (limit) items = items.slice(0, Number(limit));

  return items.map((item) => mapApiProduct(item, discountMap)).filter(Boolean);
}

export async function fetchStorefrontProductBySlug(slug) {
  const parsed = parseProductSlug(slug);
  if (!parsed) return null;
  const [raw, discountMap] = await Promise.all([
    fetchProductDetail(parsed.type, parsed.id),
    fetchDiscountsMap(),
  ]);
  if (!raw) return null;
  if (!raw.type) raw.type = parsed.type;
  return mapApiProduct(raw, discountMap);
}

export async function loginRequest({ email, password }) {
  return apiFetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function registerRequest({
  email,
  password,
  first_name,
  last_name,
  skipOTP = true,
}) {
  return apiFetch("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
      first_name,
      last_name,
      skipOTP,
    }),
  });
}

export async function fetchUser(userId) {
  return apiFetch(`/api/users/${encodeURIComponent(userId)}`);
}

export async function updateUserRequest(userId, patch) {
  return apiFetch(`/api/users/${encodeURIComponent(userId)}`, {
    method: "PUT",
    body: JSON.stringify(patch),
  });
}

export async function updateShippingRequest(userId, shipping) {
  return apiFetch(`/api/users/${encodeURIComponent(userId)}/shipping`, {
    method: "PUT",
    body: JSON.stringify(shipping),
  });
}

export async function fetchOrders({ userId } = {}) {
  const url = createApiUrl("/api/orders");
  if (userId) url.searchParams.set("userId", String(userId));
  const data = await apiFetch(url.toString());
  return Array.isArray(data) ? data : [];
}

export async function fetchOrder(orderId) {
  return apiFetch(`/api/orders/${encodeURIComponent(orderId)}`);
}

export async function trackOrder(trackingNumber) {
  return apiFetch(
    `/api/orders/track/${encodeURIComponent(trackingNumber)}`
  );
}

export async function validateVoucher({ code, subtotal }) {
  return apiFetch("/api/vouchers/validate", {
    method: "POST",
    body: JSON.stringify({ code, subtotal }),
  });
}

export async function createOrder(payload) {
  return apiFetch("/api/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function mapAuthUser(userData = {}, session = null) {
  const first = userData.first_name || "";
  const last = userData.last_name || "";
  const name =
    [first, last].filter(Boolean).join(" ") ||
    userData.full_name ||
    userData.name ||
    userData.email ||
    "CloudyNap User";

  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() || "")
    .join("");

  return {
    id: userData.id,
    email: userData.email,
    name,
    first_name: first,
    last_name: last,
    phone: userData.phone || userData.phone_number || "",
    memberSince: userData.created_at
      ? new Date(userData.created_at).toLocaleString("en-US", {
          month: "long",
          year: "numeric",
        })
      : "",
    avatarInitials: initials || "CN",
    address: {
      line1: userData.address || userData.shipment_address || "",
      line2: "",
      city: userData.city || "",
      postal: userData.postal || userData.postal_code || "",
      province: userData.province || "",
    },
    preferences: {
      emailOffers: true,
      smsUpdates: false,
      orderAlerts: true,
    },
    session,
    raw: userData,
  };
}

// silence unused import warning if slugify unused
void slugifyName;
