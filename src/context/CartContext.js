"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const CartContext = createContext(null);
const STORAGE_KEY = "cloudynap-cart";

export function parsePrice(price) {
  if (typeof price === "number") return price;
  if (typeof price !== "string") return 0;
  return Number(price.replace(/[^\d]/g, "")) || 0;
}

export function formatPrice(amount) {
  return `Rs. ${Math.max(0, Math.round(amount)).toLocaleString("en-PK")}`;
}

function lineKey(product, size, thickness, variantId) {
  const id =
    product.catalogKey || product.slug || product.id || product.name;
  return [id, variantId, size, thickness].filter(Boolean).join("__");
}

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setItems(parsed);
      }
    } catch {
      // ignore
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items, hydrated]);

  const addItem = useCallback(
    (
      product,
      {
        quantity = 1,
        size,
        thickness,
        price,
        variantId,
        productId,
        type,
      } = {}
    ) => {
      if (!product) return;
      const key = lineKey(product, size, thickness, variantId);
      const qty = Math.max(1, quantity);
      const linePrice = price || product.price;

      setItems((prev) => {
        const existing = prev.find((item) => item.key === key);
        if (existing) {
          return prev.map((item) =>
            item.key === key
              ? { ...item, quantity: item.quantity + qty }
              : item
          );
        }

        return [
          ...prev,
          {
            key,
            id: productId || product.id,
            productId: productId || product.id,
            type: type || product.type || null,
            variantId: variantId || null,
            slug: product.slug || null,
            name: product.name,
            image: product.image,
            price: linePrice,
            size: size || null,
            thickness: thickness || null,
            quantity: qty,
          },
        ];
      });
    },
    []
  );

  const removeItem = useCallback((key) => {
    setItems((prev) => prev.filter((item) => item.key !== key));
  }, []);

  const updateQuantity = useCallback((key, quantity) => {
    const next = Math.max(1, quantity);
    setItems((prev) =>
      prev.map((item) => (item.key === key ? { ...item, quantity: next } : item))
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () =>
      items.reduce(
        (sum, item) => sum + parsePrice(item.price) * item.quantity,
        0
      ),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      hydrated,
      itemCount,
      subtotal,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }),
    [
      items,
      hydrated,
      itemCount,
      subtotal,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    ]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
