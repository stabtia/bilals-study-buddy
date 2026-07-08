import { useSyncExternalStore } from "react";
import type { ProgressState, Subject, SessionLog } from "./data";
import { isoDate, levelFromXp } from "./gamification";
import { emitCelebration } from "./celebration-bus";

const KEY = "bilal.progress.v1";

const initial: ProgressState = {
  daysCompleted: [],
  subjectCounts: { maths: 0, francais: 0, sciences: 0, anglais: 0 },
  correctAnswers: { maths: 0, francais: 0, sciences: 0, anglais: 0 },
  wrongAnswers: { maths: 0, francais: 0, sciences: 0, anglais: 0 },
  lastNotes: [],
  xp: 0,
  coins: 0,
  level: 1,
  sessions: [],
  dailyTime: {},
  weeklyGoal: { exercises: 20, minutes: 120 },
  unlockedRewards: ["av-fox"],
  equipped: { avatar: "av-fox" },
  missions: {},
  notifications: { dailyReminder: true, weeklyDigest: true, soundEnabled: true },
  parentPin: "1234",
  chestOpenedOn: [],
};

function read(): ProgressState {
  if (typeof window === "undefined") return initial;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return initial;
    const parsed = JSON.parse(raw) as Partial<ProgressState>;
    return {
      ...initial,
      ...parsed,
      subjectCounts: { ...initial.subjectCounts, ...(parsed.subjectCounts ?? {}) },
      correctAnswers: { ...initial.correctAnswers, ...(parsed.correctAnswers ?? {}) },
      wrongAnswers: { ...initial.wrongAnswers, ...(parsed.wrongAnswers ?? {}) },
      dailyTime: { ...(parsed.dailyTime ?? {}) },
      weeklyGoal: { ...initial.weeklyGoal, ...(parsed.weeklyGoal ?? {}) },
      equipped: { ...initial.equipped, ...(parsed.equipped ?? {}) },
      notifications: { ...initial.notifications, ...(parsed.notifications ?? {}) },
      unlockedRewards: parsed.unlockedRewards ?? initial.unlockedRewards,
      sessions: parsed.sessions ?? [],
      missions: parsed.missions ?? {},
      chestOpenedOn: parsed.chestOpenedOn ?? [],
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
  const iso = isoDate();
  updateProgress((s) => (s.daysCompleted.includes(iso)
    ? s
    : { ...s, daysCompleted: [...s.daysCompleted, iso] }));
}

export function recordAnswer(subject: Subject, correct: boolean, note?: string) {
  const iso = isoDate();
  updateProgress((s) => ({
    ...s,
    correctAnswers: { ...s.correctAnswers, [subject]: s.correctAnswers[subject] + (correct ? 1 : 0) },
    wrongAnswers: { ...s.wrongAnswers, [subject]: s.wrongAnswers[subject] + (correct ? 0 : 1) },
    lastNotes: note
      ? [{ date: iso, subject, note }, ...s.lastNotes].slice(0, 50)
      : s.lastNotes,
  }));
}

export function recordSubjectSession(subject: Subject) {
  updateProgress((s) => ({
    ...s,
    subjectCounts: { ...s.subjectCounts, [subject]: s.subjectCounts[subject] + 1 },
  }));
}

export function addDailyTime(seconds: number) {
  if (seconds <= 0) return;
  const iso = isoDate();
  updateProgress((s) => ({
    ...s,
    dailyTime: { ...s.dailyTime, [iso]: (s.dailyTime[iso] ?? 0) + seconds },
  }));
}

export function logSession(entry: Omit<SessionLog, "id" | "date">) {
  const iso = isoDate();
  const session: SessionLog = { ...entry, id: `${Date.now()}`, date: iso };
  updateProgress((s) => ({ ...s, sessions: [session, ...s.sessions].slice(0, 500) }));
  addDailyTime(entry.durationSec);
}

export function awardXP(amount: number) {
  updateProgress((s) => {
    const xp = s.xp + amount;
    const newLevel = levelFromXp(xp);
    return { ...s, xp, level: newLevel };
  });
}

export function awardCoins(amount: number) {
  updateProgress((s) => ({ ...s, coins: s.coins + amount }));
}

export function celebrate(opts: { title: string; xp: number; coins: number; badge?: string; message?: string }) {
  awardXP(opts.xp);
  awardCoins(opts.coins);
  emitCelebration({
    title: opts.title,
    xp: opts.xp,
    coins: opts.coins,
    badge: opts.badge,
    message: opts.message,
  });
}

export function buyReward(id: string, price: number): boolean {
  const s = read();
  if (s.unlockedRewards.includes(id)) return false;
  if (s.coins < price) return false;
  updateProgress((st) => ({
    ...st,
    coins: st.coins - price,
    unlockedRewards: [...st.unlockedRewards, id],
  }));
  return true;
}

export function equipReward(id: string, category: keyof ProgressState["equipped"]) {
  updateProgress((s) => ({ ...s, equipped: { ...s.equipped, [category]: id } }));
}

export function claimMission(id: string, periodKey: string, xp: number, coins: number, badge?: string) {
  updateProgress((s) => ({
    ...s,
    missions: { ...s.missions, [id]: { id, periodKey, progress: 0, claimed: true } },
  }));
  celebrate({ title: "Défi réussi !", xp, coins, badge, message: "Un défi bouclé, bravo Bilal !" });
}

export function setWeeklyGoal(goal: { exercises: number; minutes: number }) {
  updateProgress((s) => ({ ...s, weeklyGoal: goal }));
}

export function setNotifications(n: Partial<ProgressState["notifications"]>) {
  updateProgress((s) => ({ ...s, notifications: { ...s.notifications, ...n } }));
}

export function setParentPin(pin: string) {
  updateProgress((s) => ({ ...s, parentPin: pin }));
}

export function openChest() {
  const iso = isoDate();
  const s = read();
  if (s.chestOpenedOn.includes(iso)) return;
  const reward = Math.random() < 0.15 ? { xp: 100, coins: 100 } : { xp: 30, coins: 40 };
  updateProgress((st) => ({ ...st, chestOpenedOn: [...st.chestOpenedOn, iso] }));
  celebrate({ title: "Coffre surprise !", xp: reward.xp, coins: reward.coins, badge: "🎁",
    message: "Ta régularité paie, Bilal !" });
}

export function resetProgress() {
  write(initial);
}
