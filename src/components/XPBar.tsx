import { useProgress } from "@/lib/storage";
import { xpProgressInLevel } from "@/lib/gamification";
import { findReward } from "@/lib/rewards";

export function XPBar({ compact = false }: { compact?: boolean }) {
  const p = useProgress();
  const { level, pct, current, needed } = xpProgressInLevel(p.xp);
  const avatar = findReward(p.equipped.avatar ?? "av-fox")?.emoji ?? "🦊";

  return (
    <div className={compact ? "" : "card-soft p-4"}>
      <div className="flex items-center gap-3">
        {/* Avatar équipé + médaillon de niveau */}
        <div className="relative shrink-0">
          <div
            className="w-11 h-11 rounded-2xl grid place-items-center text-2xl"
            style={{
              background: "linear-gradient(135deg, var(--accent), var(--card))",
              border: "2px solid oklch(0.88 0.04 255)",
              boxShadow: "0 3px 0 -1px oklch(0.86 0.04 255)",
            }}
          >
            {avatar}
          </div>
          <div
            className="absolute -bottom-1.5 -right-1.5 min-w-5 h-5 px-1 rounded-full grid place-items-center text-[10px] font-black text-white"
            style={{
              background: "linear-gradient(135deg, var(--primary), var(--francais))",
              border: "2px solid white",
            }}
          >
            {level}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between text-xs">
            <span className="font-extrabold font-display">Niveau {level}</span>
            <span className="text-muted-foreground font-semibold">
              {current}/{needed} XP
            </span>
          </div>
          <div className="bar-track h-3 mt-1">
            <div
              className="bar-fill"
              style={{
                width: `${Math.max(4, pct * 100)}%`,
                background: "linear-gradient(90deg, var(--primary), var(--francais))",
              }}
            />
          </div>
        </div>

        <div className="game-chip shrink-0" style={{ color: "var(--foreground)" }}>
          <span className="text-base leading-none">🪙</span> {p.coins}
        </div>
      </div>
    </div>
  );
}
