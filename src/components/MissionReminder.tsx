import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useProgress } from "@/lib/storage";
import { computeMissions } from "@/lib/missions";
import { isoDate } from "@/lib/gamification";
import { X } from "lucide-react";

const DISMISS_KEY = "bilal.missionReminder.dismissed";

export function MissionReminder() {
  const p = useProgress();
  const [mounted, setMounted] = useState(false);
  const [dismissedOn, setDismissedOn] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    try {
      setDismissedOn(localStorage.getItem(DISMISS_KEY));
    } catch {
      /* noop */
    }
  }, []);

  if (!mounted) return null;

  const today = isoDate();
  if (dismissedOn === today) return null;

  const dailyMissions = computeMissions(p).filter((m) => m.def.period === "daily");
  if (dailyMissions.length === 0) return null;

  const anyProgress = dailyMissions.some((m) => m.progress > 0);
  const allClaimed = dailyMissions.every((m) => m.claimed);
  if (allClaimed) return null;

  // Ne rappelle qu'après 16h si Bilal n'a encore rien commencé,
  // ou dès qu'il y a des défis en attente non récupérés en fin d'après-midi.
  const hour = new Date().getHours();
  if (hour < 16) return null;
  if (anyProgress && dailyMissions.every((m) => !m.ready)) {
    // travail déjà commencé mais rien à récupérer -> pas besoin de rappel
    return null;
  }

  const dismiss = () => {
    try {
      localStorage.setItem(DISMISS_KEY, today);
    } catch {
      /* noop */
    }
    setDismissedOn(today);
  };

  const remaining = dailyMissions.filter((m) => !m.claimed);

  return (
    <div
      className="fixed inset-0 z-[90] grid place-items-center bg-black/50 backdrop-blur-sm animate-in fade-in"
      onClick={dismiss}
    >
      <div
        className="card-soft p-6 max-w-sm mx-4 text-center relative animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
        style={{
          background:
            "linear-gradient(160deg, color-mix(in oklab, var(--primary) 12%, white), white 60%)",
          border: "2px solid color-mix(in oklab, var(--primary) 40%, white)",
        }}
      >
        <button
          onClick={dismiss}
          aria-label="Fermer"
          className="absolute top-2 right-2 w-8 h-8 rounded-full grid place-items-center text-muted-foreground hover:bg-muted"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-6xl anim-float inline-block">🦊</div>
        <h2 className="mt-2 text-2xl font-bold" style={{ color: "var(--primary)" }}>
          Hey Bilal !
        </h2>
        <p className="mt-2 text-sm font-semibold">
          {anyProgress
            ? "Tu as commencé, ne lâche pas ! Tes défis du jour t'attendent 💪"
            : "Tu n'as pas encore fait tes défis du jour. On y va ? 🚀"}
        </p>

        <div className="mt-4 text-left grid gap-2">
          {remaining.slice(0, 3).map((m) => (
            <div
              key={m.def.id}
              className="flex items-center gap-2 rounded-xl p-2"
              style={{ background: "var(--accent)" }}
            >
              <div className="text-xl">{m.def.emoji}</div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold truncate">{m.def.title}</div>
                <div className="text-[10px] text-muted-foreground">
                  {Math.floor(m.progress)}/{m.def.goal} · +{m.def.xp} XP · +{m.def.coins} 🪙
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 flex gap-2">
          <Link
            to="/missions"
            onClick={dismiss}
            className="btn-big flex-1"
            style={{ background: "var(--primary)", color: "white" }}
          >
            Voir mes défis
          </Link>
          <button
            onClick={dismiss}
            className="btn-big"
            style={{ background: "var(--muted)", color: "var(--foreground)" }}
          >
            Plus tard
          </button>
        </div>
      </div>
    </div>
  );
}
