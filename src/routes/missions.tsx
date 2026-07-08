import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { useProgress, claimMission, openChest } from "@/lib/storage";
import { computeMissions } from "@/lib/missions";
import { currentStreak } from "@/lib/data";
import { Gift, Sparkles, Zap } from "lucide-react";

export const Route = createFileRoute("/missions")({
  component: Missions,
  head: () => ({ meta: [{ title: "Défis — Coach Bilal" }] }),
});

function Missions() {
  const p = useProgress();
  const missions = computeMissions(p);
  const streak = currentStreak(p.daysCompleted);
  const chestReady =
    streak >= 3 && !p.chestOpenedOn.includes(new Date().toISOString().slice(0, 10));

  const groups = {
    daily: missions.filter((m) => m.def.period === "daily"),
    weekly: missions.filter((m) => m.def.period === "weekly"),
    monthly: missions.filter((m) => m.def.period === "monthly"),
  };

  return (
    <AppLayout>
      <header className="pt-2 pb-4">
        <p className="text-sm font-semibold" style={{ color: "var(--primary)" }}>
          🎯 Défis
        </p>
        <h1 className="text-3xl font-bold">Tes missions</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Termine des défis pour gagner XP et pièces.
        </p>
      </header>

      {chestReady && (
        <div
          className="card-soft p-5 mb-6 relative overflow-hidden anim-glow"
          style={{
            background:
              "linear-gradient(135deg, var(--accent), color-mix(in oklab, var(--gold) 35%, white))",
            border: "2px solid color-mix(in oklab, var(--gold) 60%, white)",
          }}
        >
          <span className="absolute right-3 top-2 text-xl anim-float select-none" aria-hidden>
            ✨
          </span>
          <div className="flex items-center gap-4">
            <div className="text-5xl animate-bounce">🎁</div>
            <div className="flex-1">
              <div className="font-bold font-display text-lg">Coffre surprise débloqué !</div>
              <div className="text-sm text-muted-foreground font-semibold">
                3 jours d'affilée, bravo Bilal.
              </div>
            </div>
            <button
              onClick={() => openChest()}
              className="btn-big"
              style={{
                background: "linear-gradient(135deg, var(--gold), oklch(0.7 0.16 60))",
                color: "white",
              }}
            >
              Ouvrir
            </button>
          </div>
        </div>
      )}

      <Section title="Défis du jour" items={groups.daily} />
      <Section title="Défis de la semaine" items={groups.weekly} />
      <Section title="Défis du mois" items={groups.monthly} />
    </AppLayout>
  );
}

function Section({ title, items }: { title: string; items: ReturnType<typeof computeMissions> }) {
  return (
    <section className="mb-6">
      <h2 className="text-xl font-bold mb-3">{title}</h2>
      <div className="grid gap-3">
        {items.map((m) => {
          const pct = Math.min(100, (m.progress / m.def.goal) * 100);
          return (
            <div key={m.def.id} className="card-soft p-4">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-2xl grid place-items-center text-2xl shrink-0"
                  style={{ background: "var(--accent)" }}
                >
                  {m.def.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm">{m.def.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5 flex gap-3">
                    <span className="inline-flex items-center gap-1">
                      <Zap className="w-3 h-3" /> {m.def.xp} XP
                    </span>
                    <span>🪙 {m.def.coins}</span>
                    {m.def.rareBadge && <span>🏅 badge rare</span>}
                  </div>
                  <div className="bar-track h-3 mt-2">
                    <div
                      className="bar-fill"
                      style={{
                        width: `${Math.max(4, pct)}%`,
                        background: m.claimed
                          ? "linear-gradient(90deg, var(--success), oklch(0.6 0.17 165))"
                          : "linear-gradient(90deg, var(--primary), var(--francais))",
                      }}
                    />
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-1">
                    {Math.floor(m.progress)}/{m.def.goal}
                  </div>
                </div>
                <div className="shrink-0">
                  {m.claimed ? (
                    <span className="text-xs font-bold" style={{ color: "var(--success)" }}>
                      Récupéré ✓
                    </span>
                  ) : m.ready ? (
                    <button
                      onClick={() =>
                        claimMission(m.def.id, m.periodKey, m.def.xp, m.def.coins, m.def.rareBadge)
                      }
                      className="btn-big inline-flex items-center gap-1 py-2 px-3 text-sm"
                      style={{ background: "var(--primary)", color: "white" }}
                    >
                      <Gift className="w-4 h-4" /> Récupérer
                    </button>
                  ) : (
                    <span className="text-xs text-muted-foreground inline-flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> en cours
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
