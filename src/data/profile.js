/**
 * Demo account data for the profile page.
 * Replace with real auth/API later.
 */

export const demoUser = {
  id: "usr_cloudynap_01",
  name: "Haseeb Specter",
  email: "haseeb@cloudynap.com",
  phone: "0300 1234567",
  memberSince: "March 2025",
  avatarInitials: "HS",
  address: {
    line1: "House 42, Block 5",
    line2: "Clifton",
    city: "Karachi",
    postal: "75600",
  },
  preferences: {
    emailOffers: true,
    smsUpdates: true,
    orderAlerts: true,
  },
};

export const demoOrders = [
  {
    id: "CN-48291033",
    date: "12 Sep 2026",
    status: "Delivered",
    statusTone: "success",
    total: "Rs. 24,999",
    items: [
      {
        name: "Folding Mattress",
        image: "/folding.png",
        qty: 1,
        size: "Queen 1 · 78 × 60",
        thickness: "6 inches",
      },
    ],
    tracking: {
      carrier: "CloudyNap Express",
      eta: "Delivered 12 Sep",
      steps: [
        { label: "Order placed", done: true, at: "8 Sep" },
        { label: "Processing", done: true, at: "9 Sep" },
        { label: "Shipped", done: true, at: "10 Sep" },
        { label: "Out for delivery", done: true, at: "12 Sep" },
        { label: "Delivered", done: true, at: "12 Sep" },
      ],
    },
  },
  {
    id: "CN-48290118",
    date: "28 Aug 2026",
    status: "In transit",
    statusTone: "progress",
    total: "Rs. 16,498",
    items: [
      {
        name: "Supreme Silk",
        image: "/silk.png",
        qty: 1,
        size: "King · 78 × 72",
        thickness: "8 inches",
      },
      {
        name: "Beauty Sleep Pillow",
        image: "/sleep.png",
        qty: 1,
        size: "Queen · 20 × 30",
        thickness: "Medium loft",
      },
    ],
    tracking: {
      carrier: "CloudyNap Express",
      eta: "Arriving 17 Sep",
      steps: [
        { label: "Order placed", done: true, at: "28 Aug" },
        { label: "Processing", done: true, at: "29 Aug" },
        { label: "Shipped", done: true, at: "1 Sep" },
        { label: "Out for delivery", done: false, at: null },
        { label: "Delivered", done: false, at: null },
      ],
    },
  },
  {
    id: "CN-48288742",
    date: "4 Jul 2026",
    status: "Delivered",
    statusTone: "success",
    total: "Rs. 18,999",
    items: [
      {
        name: "Dreamer 1000 Standard",
        image: "/dreamer.png",
        qty: 1,
        size: "Single · 78 × 42",
        thickness: "8 inches",
      },
    ],
    tracking: {
      carrier: "CloudyNap Express",
      eta: "Delivered 9 Jul",
      steps: [
        { label: "Order placed", done: true, at: "4 Jul" },
        { label: "Processing", done: true, at: "5 Jul" },
        { label: "Shipped", done: true, at: "6 Jul" },
        { label: "Out for delivery", done: true, at: "9 Jul" },
        { label: "Delivered", done: true, at: "9 Jul" },
      ],
    },
  },
];

export const demoRecentlyViewed = [
  {
    slug: "folding-mattress",
    name: "Folding Mattress",
    image: "/folding.png",
    price: "Rs. 24,999",
  },
  {
    slug: "supreme-silk",
    name: "Supreme Silk",
    image: "/silk.png",
    price: "Rs. 12,999",
  },
  {
    slug: "dreamer-1000-standard",
    name: "Dreamer 1000 Standard",
    image: "/dreamer.png",
    price: "Rs. 18,999",
  },
  {
    slug: "beauty-sleep-pillow",
    name: "Beauty Sleep Pillow",
    image: "/sleep.png",
    price: "Rs. 3,499",
  },
];

export function getOrderById(orderId) {
  return demoOrders.find((order) => order.id === orderId) || null;
}
