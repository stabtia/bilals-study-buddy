// Bus événementiel pour déclencher l'écran de célébration depuis n'importe où.
import { useSyncExternalStore } from "react";

export interface CelebrationPayload {
  title: string;
  xp: number;
  coins: number;
  badge?: string;
  message?: string;
  id?: number;
}

let current: CelebrationPayload | null = null;
const listeners = new Set<() => void>();

export function emitCelebration(p: CelebrationPayload) {
  current = { ...p, id: Date.now() };
  listeners.forEach((l) => l());
}

export function clearCelebration() {
  current = null;
  listeners.forEach((l) => l());
}

export function useCelebration() {
  return useSyncExternalStore(
    (cb) => { listeners.add(cb); return () => listeners.delete(cb); },
    () => current,
    () => null,
  );
}
