import { useSyncExternalStore } from "react";
import type { ProgressState, Subject } from "./data";

const KEY = "bilal.progress.v1";

const initial: ProgressState = {
  daysCompleted: [],
  subjectCounts: { maths: 0, francais: 0, sciences: 0, anglais: 0 },
  correctAnswers: { maths: 0, francais: 0, sciences: 0, anglais: 0 },
  wrongAnswers: { maths: 0, francais: 0, sciences: 0, anglais: 0 },
  lastNotes: [],
};

function read(): ProgressState {
  if (typeof window === "undefined") return initial;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return initial;
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    return { ...initial, ...parsed,
      subjectCounts: { ...initial.subjectCounts, ...(parsed.subjectCounts ?? {}) },
      correctAnswers: { ...initial.correctAnswers, ...(parsed.correctAnswers ?? {}) },
      wrongAnswers: { ...initial.wrongAnswers, ...(parsed.wrongAnswers ?? {}) },
    };
  } catch {
    return initial;
  }
}

const listeners = new Set<() => void>();
function subscribe(cb: () => void) {
  listeners.add(cb);
  const onStorage = (e: StorageEvent) => { if (e.key === KEY) cb(); };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

function write(next: ProgressState) {
  localStorage.setItem(KEY, JSON.stringify(next));
  listeners.forEach((l) => l());
}

export function useProgress() {
  return useSyncExternalStore(subscribe, read, () => initial);
}

export function updateProgress(fn: (s: ProgressState) => ProgressState) {
  write(fn(read()));
}

export function markDayDone() {
  const iso = new Date().toISOString().slice(0, 10);
  updateProgress((s) => (s.daysCompleted.includes(iso)
    ? s
    : { ...s, daysCompleted: [...s.daysCompleted, iso] }));
}

export function recordAnswer(subject: Subject, correct: boolean, note?: string) {
  const iso = new Date().toISOString().slice(0, 10);
  updateProgress((s) => ({
    ...s,
    correctAnswers: { ...s.correctAnswers, [subject]: s.correctAnswers[subject] + (correct ? 1 : 0) },
    wrongAnswers: { ...s.wrongAnswers, [subject]: s.wrongAnswers[subject] + (correct ? 0 : 1) },
    lastNotes: note
      ? [{ date: iso, subject, note }, ...s.lastNotes].slice(0, 30)
      : s.lastNotes,
  }));
}

export function recordSubjectSession(subject: Subject) {
  updateProgress((s) => ({
    ...s,
    subjectCounts: { ...s.subjectCounts, [subject]: s.subjectCounts[subject] + 1 },
  }));
}

export function resetProgress() {
  write(initial);
}
