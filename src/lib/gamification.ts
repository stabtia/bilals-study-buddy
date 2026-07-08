import type { ProgressState } from "./data";

export function xpForLevel(level: number): number {
  // Cumul XP nécessaire pour atteindre `level`
  return (100 * level * (level - 1)) / 2 + 100 * (level - 1);
}

export function levelFromXp(xp: number): number {
  let lvl = 1;
  while (xpForLevel(lvl + 1) <= xp) lvl++;
  return lvl;
}

export function xpProgressInLevel(xp: number) {
  const lvl = levelFromXp(xp);
  const base = xpForLevel(lvl);
  const next = xpForLevel(lvl + 1);
  const pct = Math.max(0, Math.min(1, (xp - base) / (next - base)));
  return { level: lvl, base, next, pct, current: xp - base, needed: next - base };
}

export function isoDate(d: Date = new Date()): string {
  return d.toISOString().slice(0, 10);
}

export function isoWeek(d: Date = new Date()): string {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

export function isoMonth(d: Date = new Date()): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function recommendations(
  s: ProgressState,
): { title: string; body: string; tone: "info" | "warn" | "good" }[] {
  const recs: { title: string; body: string; tone: "info" | "warn" | "good" }[] = [];
  const subjects = ["maths", "francais", "sciences", "anglais"] as const;
  for (const sub of subjects) {
    const ok = s.correctAnswers[sub] ?? 0;
    const ko = s.wrongAnswers[sub] ?? 0;
    const total = ok + ko;
    if (total >= 3 && ko / total > 0.5) {
      recs.push({
        title: `Renforcer ${sub}`,
        body: `Taux de réussite bas (${Math.round((ok / total) * 100)}%). Proposer des sessions plus courtes et niveau facile.`,
        tone: "warn",
      });
    } else if (total >= 5 && ko / total < 0.2) {
      recs.push({
        title: `Excellent en ${sub}`,
        body: `Bilal maîtrise. Il peut passer au niveau supérieur.`,
        tone: "good",
      });
    }
  }
  const weekMinutes = Math.round(
    Object.entries(s.dailyTime).reduce((n, [d, sec]) => {
      const date = new Date(d);
      const now = new Date();
      const diff = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
      return diff < 7 ? n + sec / 60 : n;
    }, 0),
  );
  if (weekMinutes < s.weeklyGoal.minutes * 0.5) {
    recs.push({
      title: "Régularité à renforcer",
      body: `${weekMinutes} min cette semaine sur un objectif de ${s.weeklyGoal.minutes} min. Envisager un créneau fixe (ex : 18h30 après le goûter).`,
      tone: "warn",
    });
  } else if (weekMinutes >= s.weeklyGoal.minutes) {
    recs.push({
      title: "Objectif hebdo atteint 🎉",
      body: "Continuer sur cette dynamique.",
      tone: "good",
    });
  }
  if (recs.length === 0) {
    recs.push({
      title: "Continuer comme ça",
      body: "Rien à signaler, la routine tient.",
      tone: "info",
    });
  }
  return recs;
}

export function frequentErrors(s: ProgressState): { label: string; count: number }[] {
  const map = new Map<string, number>();
  for (const n of s.lastNotes) {
    const k = `${n.subject} · ${n.note}`;
    map.set(k, (map.get(k) ?? 0) + 1);
  }
  return [...map.entries()]
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}
