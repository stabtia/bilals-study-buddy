import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { Mascot } from "@/components/Mascot";
import { useProgress, markDayDone } from "@/lib/storage";
import {
  weeklyPlan,
  subjectMeta,
  currentStreak,
  daysThisWeek,
  badges,
  motivationalMessages,
} from "@/lib/data";
import { CheckCircle2, Clock, Flame, Play } from "lucide-react";
import { useMemo } from "react";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
  head: () => ({ meta: [{ title: "Ma journée — Coach Bilal" }] }),
});

function Dashboard() {
  const progress = useProgress();
  const today = new Date();
  const todayISO = today.toISOString().slice(0, 10);
  const day = today.getDay();
  const plan = weeklyPlan[day];
  const doneToday = progress.daysCompleted.includes(todayISO);
  const streak = currentStreak(progress.daysCompleted);
  const thisWeek = daysThisWeek(progress.daysCompleted);
  const message = useMemo(
    () => motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)],
    [],
  );
  const unlocked = badges.filter((b) => b.check(progress));

  return (
    <AppLayout>
      <div className="pt-2 pb-4">
        <p className="text-sm text-muted-foreground font-semibold">Bonjour Bilal 👋</p>
        <h1 className="text-3xl font-bold">⚔️ Ta quête — {plan.label}</h1>
      </div>

      <div className="grid sm:grid-cols-3 gap-3 mb-6">
        <Stat
          icon={<Flame className="w-5 h-5" />}
          label="Série de jours"
          value={`${streak} 🔥`}
          accent="var(--maths)"
        />
        <Stat
          icon={<CheckCircle2 className="w-5 h-5" />}
          label="Cette semaine"
          value={`${thisWeek} / 6`}
          accent="var(--sciences)"
        />
        <Stat
          icon={<Clock className="w-5 h-5" />}
          label="Temps conseillé"
          value="20-30 min"
          accent="var(--primary)"
        />
      </div>

      <Mascot message={message} mood="cheer" />

      <section className="mt-6">
        <h2 className="text-xl font-bold mb-3">🗺️ Les étapes du jour</h2>
        {plan.blocks.length === 0 ? (
          <div className="card-soft p-6 text-center">
            <div className="text-5xl anim-float inline-block">💤</div>
            <p className="mt-2 font-bold">Aujourd'hui, c'est repos !</p>
            <p className="text-sm text-muted-foreground font-semibold">
              Profites-en pour te détendre.
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {plan.blocks.map((s, i) => {
              const meta = subjectMeta[s];
              return (
                <Link
                  key={s}
                  to={meta.route}
                  className="card-soft p-4 flex items-center gap-4 transition-all hover:-translate-y-1 hover:rotate-[0.4deg] anim-pop group"
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  {/* Numéro d'étape façon niveau de jeu */}
                  <div
                    className="w-9 h-9 rounded-full grid place-items-center font-black text-white text-sm shrink-0"
                    style={{
                      background: `linear-gradient(135deg, ${meta.color}, color-mix(in oklab, ${meta.color} 70%, black))`,
                      boxShadow:
                        "inset 0 -3px 0 oklch(0 0 0 / 0.25), inset 0 2px 0 oklch(1 0 0 / 0.3), 0 3px 6px -2px oklch(0 0 0 / 0.3)",
                      border: "2px solid white",
                    }}
                  >
                    {i + 1}
                  </div>
                  <div
                    className="w-16 h-16 rounded-3xl grid place-items-center text-4xl shrink-0 transition-transform group-hover:scale-110"
                    style={{
                      background: `linear-gradient(135deg, color-mix(in oklab, ${meta.color} 30%, white), color-mix(in oklab, ${meta.color} 8%, white))`,
                      border: `2px solid color-mix(in oklab, ${meta.color} 40%, white)`,
                      boxShadow: `0 4px 0 -1px color-mix(in oklab, ${meta.color} 35%, white)`,
                    }}
                  >
                    {meta.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-lg font-display">{meta.label}</div>
                    <div className="text-xs font-semibold text-muted-foreground">
                      ~ 10 min · +XP · +🪙
                    </div>
                  </div>
                  <div
                    className="w-11 h-11 rounded-2xl grid place-items-center text-white shrink-0 transition-transform group-hover:scale-110"
                    style={{
                      background: meta.color,
                      boxShadow:
                        "inset 0 -3px 0 oklch(0 0 0 / 0.2), inset 0 2px 0 oklch(1 0 0 / 0.25)",
                    }}
                  >
                    <Play className="w-5 h-5 fill-current" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <button
          onClick={() => markDayDone()}
          disabled={doneToday}
          className="btn-big w-full mt-6 disabled:opacity-70 text-lg"
          style={{
            background: doneToday
              ? "linear-gradient(135deg, var(--success), oklch(0.6 0.17 165))"
              : "linear-gradient(135deg, var(--primary), oklch(0.55 0.2 265))",
            color: "white",
          }}
        >
          {doneToday ? "✅ Quête du jour terminée, bravo !" : "🏁 J'ai terminé ma quête du jour"}
        </button>
      </section>

      <section className="mt-10">
        <h2 className="text-xl font-bold mb-3">🏅 Mes badges</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {badges.map((b, i) => {
            const got = unlocked.some((u) => u.id === b.id);
            return (
              <div
                key={b.id}
                className="card-soft p-3 text-center anim-pop relative overflow-hidden"
                style={{
                  animationDelay: `${i * 0.05}s`,
                  ...(got
                    ? {
                        border: "2px solid color-mix(in oklab, var(--gold) 60%, white)",
                        boxShadow:
                          "0 5px 0 -1px color-mix(in oklab, var(--gold) 50%, white), 0 14px 30px -18px oklch(0.7 0.14 85 / 0.6)",
                        background:
                          "linear-gradient(160deg, color-mix(in oklab, var(--gold) 14%, white), white 60%)",
                      }
                    : { opacity: 0.55, filter: "grayscale(0.7)" }),
                }}
              >
                <div className={`text-3xl ${got ? "anim-float inline-block" : ""}`}>
                  {got ? b.emoji : "🔒"}
                </div>
                <div className="text-sm font-bold mt-1">{b.label}</div>
                <div className="text-[11px] text-muted-foreground font-semibold">
                  {b.description}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </AppLayout>
  );
}

function Stat({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="card-soft p-4 flex items-center gap-3">
      <div
        className="w-11 h-11 rounded-2xl grid place-items-center text-white shrink-0"
        style={{
          background: accent,
          boxShadow: "inset 0 -3px 0 oklch(0 0 0 / 0.18), inset 0 2px 0 oklch(1 0 0 / 0.25)",
        }}
      >
        {icon}
      </div>
      <div>
        <div className="text-xs text-muted-foreground font-semibold">{label}</div>
        <div className="font-bold text-lg font-display">{value}</div>
      </div>
    </div>
  );
}
