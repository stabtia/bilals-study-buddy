import type { ProgressState, Subject } from "./data";
import { isoDate, isoMonth, isoWeek } from "./gamification";

export type MissionPeriod = "daily" | "weekly" | "monthly";

export interface MissionDef {
  id: string;
  period: MissionPeriod;
  title: string;
  emoji: string;
  goal: number;
  xp: number;
  coins: number;
  rareBadge?: string;
  metric: (s: ProgressState, periodKey: string) => number;
}

function sessionsInPeriod(s: ProgressState, period: MissionPeriod, key: string, subject?: Subject) {
  return s.sessions.filter((se) => {
    if (subject && se.subject !== subject) return false;
    if (period === "daily") return se.date === key;
    if (period === "weekly") {
      const d = new Date(se.date);
      return isoWeek(d) === key;
    }
    if (period === "monthly") return se.date.startsWith(key);
    return false;
  });
}

function minutesInPeriod(s: ProgressState, period: MissionPeriod, key: string, subject?: Subject) {
  return sessionsInPeriod(s, period, key, subject).reduce((n, se) => n + se.durationSec / 60, 0);
}

function correctInPeriod(s: ProgressState, period: MissionPeriod, key: string, subject?: Subject) {
  return sessionsInPeriod(s, period, key, subject).reduce((n, se) => n + se.correct, 0);
}

export const missionCatalog: MissionDef[] = [
  {
    id: "d-maths-5", period: "daily", title: "5 exercices de maths aujourd'hui",
    emoji: "🧮", goal: 5, xp: 30, coins: 15,
    metric: (s, k) => correctInPeriod(s, "daily", k, "maths"),
  },
  {
    id: "d-any-10min", period: "daily", title: "10 min de travail",
    emoji: "⏱️", goal: 10, xp: 20, coins: 10,
    metric: (s, k) => minutesInPeriod(s, "daily", k),
  },
  {
    id: "w-3-subjects", period: "weekly", title: "Toucher 3 matières différentes",
    emoji: "🎯", goal: 3, xp: 60, coins: 30,
    metric: (s, k) => new Set(sessionsInPeriod(s, "weekly", k).map((x) => x.subject)).size,
  },
  {
    id: "w-30min-francais", period: "weekly", title: "30 min de français cette semaine",
    emoji: "📖", goal: 30, xp: 70, coins: 35,
    metric: (s, k) => minutesInPeriod(s, "weekly", k, "francais"),
  },
  {
    id: "m-20-sessions", period: "monthly", title: "20 sessions ce mois-ci",
    emoji: "🏆", goal: 20, xp: 200, coins: 100, rareBadge: "🎖️",
    metric: (s, k) => sessionsInPeriod(s, "monthly", k).length,
  },
  {
    id: "m-anglais-5", period: "monthly", title: "5 leçons d'anglais",
    emoji: "🇬🇧", goal: 5, xp: 120, coins: 60,
    metric: (s, k) => sessionsInPeriod(s, "monthly", k, "anglais").length,
  },
];

export function periodKeyFor(period: MissionPeriod, d = new Date()) {
  return period === "daily" ? isoDate(d) : period === "weekly" ? isoWeek(d) : isoMonth(d);
}

export interface ComputedMission {
  def: MissionDef;
  progress: number;
  claimed: boolean;
  periodKey: string;
  ready: boolean;
}

export function computeMissions(s: ProgressState): ComputedMission[] {
  return missionCatalog.map((def) => {
    const periodKey = periodKeyFor(def.period);
    const stored = s.missions[def.id];
    const claimed = stored?.periodKey === periodKey && stored.claimed;
    const progress = Math.min(def.goal, def.metric(s, periodKey));
    return { def, progress, claimed, periodKey, ready: progress >= def.goal && !claimed };
  });
}
