import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { Mascot } from "@/components/Mascot";
import { useProgress, markDayDone } from "@/lib/storage";
import { weeklyPlan, subjectMeta, currentStreak, daysThisWeek, badges, motivationalMessages } from "@/lib/data";
import { CheckCircle2, Clock, Flame } from "lucide-react";
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
  const message = useMemo(() => motivationalMessages[Math.floor(Math.random() * motivationalMessages.length)], []);
  const unlocked = badges.filter((b) => b.check(progress));

  return (
    <AppLayout>
      <div className="pt-2 pb-4">
        <p className="text-sm text-muted-foreground">Bonjour Bilal 👋</p>
        <h1 className="text-3xl font-bold">Ma journée — {plan.label}</h1>
      </div>

      <div className="grid sm:grid-cols-3 gap-3 mb-6">
        <Stat icon={<Flame className="w-5 h-5" />} label="Régularité" value={`${streak} jour${streak > 1 ? "s" : ""}`} accent="var(--maths)" />
        <Stat icon={<CheckCircle2 className="w-5 h-5" />} label="Cette semaine" value={`${thisWeek} / 6`} accent="var(--sciences)" />
        <Stat icon={<Clock className="w-5 h-5" />} label="Temps conseillé" value="20-30 min" accent="var(--primary)" />
      </div>

      <Mascot message={message} mood="cheer" />

      <section className="mt-6">
        <h2 className="text-xl font-bold mb-3">Ta mission du jour</h2>
        {plan.blocks.length === 0 ? (
          <div className="card-soft p-6 text-center">
            <div className="text-4xl">💤</div>
            <p className="mt-2 font-semibold">Aujourd'hui, c'est repos !</p>
            <p className="text-sm text-muted-foreground">Profites-en pour te détendre.</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {plan.blocks.map((s, i) => {
              const meta = subjectMeta[s];
              return (
                <Link
                  key={s}
                  to={meta.route}
                  className="card-soft p-4 flex items-center gap-4 hover:scale-[1.01] transition-transform"
                >
                  <div className="w-14 h-14 rounded-2xl grid place-items-center text-3xl"
                    style={{ background: `color-mix(in oklab, ${meta.color} 22%, white)` }}>
                    {meta.emoji}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground">Bloc {i + 1}</div>
                    <div className="font-bold text-lg">{meta.label}</div>
                    <div className="text-xs text-muted-foreground">~ 10 min</div>
                  </div>
                  <div className="text-2xl" style={{ color: meta.color }}>→</div>
                </Link>
              );
            })}
          </div>
        )}

        <button
          onClick={() => markDayDone()}
          disabled={doneToday}
          className="btn-big w-full mt-6 disabled:opacity-60"
          style={{ background: doneToday ? "var(--success)" : "var(--primary)", color: "white" }}
        >
          {doneToday ? "✅ Journée terminée, bravo !" : "J'ai terminé ma journée"}
        </button>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-bold mb-3">Mes badges</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {badges.map((b) => {
            const got = unlocked.some((u) => u.id === b.id);
            return (
              <div key={b.id} className="card-soft p-3 text-center"
                style={{ opacity: got ? 1 : 0.5 }}>
                <div className="text-3xl">{got ? b.emoji : "🔒"}</div>
                <div className="text-sm font-semibold mt-1">{b.label}</div>
                <div className="text-[11px] text-muted-foreground">{b.description}</div>
              </div>
            );
          })}
        </div>
      </section>
    </AppLayout>
  );
}

function Stat({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent: string }) {
  return (
    <div className="card-soft p-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-xl grid place-items-center text-white" style={{ background: accent }}>{icon}</div>
      <div>
        <div className="text-xs text-muted-foreground">{label}</div>
        <div className="font-bold text-lg">{value}</div>
      </div>
    </div>
  );
}
