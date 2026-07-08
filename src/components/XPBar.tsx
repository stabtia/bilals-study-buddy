import { useProgress } from "@/lib/storage";
import { xpProgressInLevel } from "@/lib/gamification";

export function XPBar({ compact = false }: { compact?: boolean }) {
  const p = useProgress();
  const { level, pct, current, needed } = xpProgressInLevel(p.xp);
  return (
    <div className={compact ? "" : "card-soft p-4"}>
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-2xl grid place-items-center text-white font-bold text-lg shrink-0"
          style={{ background: "linear-gradient(135deg,var(--primary),var(--sciences))" }}>
          {level}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between text-xs">
            <span className="font-semibold">Niveau {level}</span>
            <span className="text-muted-foreground">{current}/{needed} XP</span>
          </div>
          <div className="h-2.5 mt-1 bg-muted rounded-full overflow-hidden">
            <div className="h-full transition-all duration-500"
              style={{ width: `${pct * 100}%`, background: "linear-gradient(90deg,var(--primary),var(--sciences))" }} />
          </div>
        </div>
        <div className="flex flex-col items-end shrink-0">
          <div className="text-sm font-bold">{p.coins} 🪙</div>
          <div className="text-[11px] text-muted-foreground">{p.xp} XP</div>
        </div>
      </div>
    </div>
  );
}
