"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  fetchUser,
  loginRequest,
  mapAuthUser,
  registerRequest,
  updateShippingRequest,
  updateUserRequest,
} from "@/lib/storeApi";

const AuthContext = createContext(null);
const STORAGE_KEY = "cloudynap-auth";

function readStoredAuth() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.user?.id || parsed?.user?.email) return parsed;
  } catch {
    // ignore
  }
  return null;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  const persist = useCallback((nextUser, nextSession = null) => {
    setUser(nextUser);
    setSession(nextSession);
    try {
      if (nextUser) {
        window.localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ user: nextUser, session: nextSession })
        );
      } else {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    const stored = readStoredAuth();
    if (stored?.user) {
      setUser(stored.user);
      setSession(stored.session || null);
      if (stored.user.id) {
        fetchUser(stored.user.id)
          .then((fresh) => {
            if (fresh) {
              persist(mapAuthUser(fresh, stored.session), stored.session);
            }
          })
          .catch(() => {});
      }
    }
    setHydrated(true);
  }, [persist]);

  const login = useCallback(
    async ({ email, password }) => {
      const payload = await loginRequest({ email, password });
      const mapped = mapAuthUser(
        payload.userData || payload.user,
        payload.session
      );
      persist(mapped, payload.session || null);
      return mapped;
    },
    [persist]
  );

  const signup = useCallback(
    async ({ name, email, password, phone }) => {
      const parts = String(name || "")
        .trim()
        .split(/\s+/)
        .filter(Boolean);
      const first_name = parts[0] || "";
      const last_name = parts.slice(1).join(" ") || "";

      const payload = await registerRequest({
        email,
        password,
        first_name,
        last_name,
        skipOTP: true,
      });

      let mapped = mapAuthUser(
        payload.userData || payload.user,
        payload.session
      );

      if (phone && mapped.id) {
        try {
          await updateShippingRequest(mapped.id, {
            phone,
            shipment_address: mapped.address?.line1 || "",
            province: mapped.address?.province || "",
            city: mapped.address?.city || "",
            address: mapped.address?.line1 || "",
          });
          mapped = { ...mapped, phone };
        } catch {
          mapped = { ...mapped, phone };
        }
      }

      persist(mapped, payload.session || null);
      return mapped;
    },
    [persist]
  );

  const logout = useCallback(() => {
    persist(null, null);
  }, [persist]);

  const updateUser = useCallback(
    async (patch) => {
      if (!user?.id) {
        const next = { ...user, ...patch };
        persist(next, session);
        return next;
      }

      const body = {
        first_name: patch.first_name ?? user.first_name,
        last_name: patch.last_name ?? user.last_name,
        email: patch.email ?? user.email,
        phone: patch.phone ?? user.phone,
      };

      if (patch.name) {
        const parts = patch.name.trim().split(/\s+/).filter(Boolean);
        body.first_name = parts[0] || "";
        body.last_name = parts.slice(1).join(" ") || "";
      }

      await updateUserRequest(user.id, body);

      if (patch.address) {
        await updateShippingRequest(user.id, {
          phone: patch.phone ?? user.phone,
          shipment_address: patch.address.line1 || "",
          province: patch.address.province || "",
          city: patch.address.city || "",
          address: patch.address.line1 || "",
        });
      }

      const fresh = await fetchUser(user.id);
      const mapped = mapAuthUser(fresh, session);
      if (patch.preferences) {
        mapped.preferences = patch.preferences;
      }
      persist(mapped, session);
      return mapped;
    },
    [user, session, persist]
  );

  const value = useMemo(
    () => ({
      user,
      session,
      hydrated,
      isAuthenticated: Boolean(user?.id || user?.email),
      login,
      signup,
      logout,
      updateUser,
    }),
    [user, session, hydrated, login, signup, logout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
