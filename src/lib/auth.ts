// Auth abstraction — impl locale par PIN. Interface prête pour Supabase.
import { useSyncExternalStore } from "react";

const MODE_KEY = "bilal.parentMode.v1";

export interface ParentAuth {
  isParent(): boolean;
  signIn(pin: string, expectedPin: string): boolean;
  signOut(): void;
}

const listeners = new Set<() => void>();
function emit() { listeners.forEach((l) => l()); }

function read(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(MODE_KEY) === "1";
}

export const parentAuth: ParentAuth = {
  isParent: read,
  signIn(pin, expectedPin) {
    if (pin === expectedPin) {
      localStorage.setItem(MODE_KEY, "1");
      emit();
      return true;
    }
    return false;
  },
  signOut() {
    localStorage.removeItem(MODE_KEY);
    emit();
  },
};

export function useParentMode(): boolean {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      const onStorage = (e: StorageEvent) => { if (e.key === MODE_KEY) cb(); };
      window.addEventListener("storage", onStorage);
      return () => { listeners.delete(cb); window.removeEventListener("storage", onStorage); };
    },
    read,
    () => false,
  );
}
