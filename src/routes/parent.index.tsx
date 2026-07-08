import { createFileRoute, Link } from "@tanstack/react-router";
import { useProgress } from "@/lib/storage";
import { currentStreak, daysThisWeek, subjectMeta, type Subject, badges } from "@/lib/data";
import { frequentErrors, recommendations, isoDate } from "@/lib/gamification";
import { useMemo } from "react";

export const Route = createFileRoute("/parent/")({
  component: ParentDashboard,
});

function ParentDashboard() {
  const p = useProgress();
  const streak = currentStreak(p.daysCompleted);
  const week = daysThisWeek(p.daysCompleted);
  const subjects: Subject[] = ["maths", "francais", "sciences", "anglais"];

  const totals = subjects.map((s) => ({
    s,
    ok: p.correctAnswers[s],
    ko: p.wrongAnswers[s],
    sessions: p.subjectCounts[s],
  }));

  const weekMinutes = useMemo(() => {
    return Object.entries(p.dailyTime).reduce((n, [d, sec]) => {
      const days = (Date.now() - new Date(d).getTime()) / 86400000;
      return days < 7 ? n + sec / 60 : n;
    }, 0);
  }, [p.dailyTime]);

  const last7 = useMemo(() => {
    const arr: { date: string; label: string; minutes: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const iso = isoDate(d);
      arr.push({
        date: iso,
        label: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"][d.getDay()],
        minutes: Math.round((p.dailyTime[iso] ?? 0) / 60),
      });
    }
    return arr;
  }, [p.dailyTime]);

  const maxMin = Math.max(1, ...last7.map((d) => d.minutes));
  const recs = recommendations(p);
  const errors = frequentErrors(p);
  const unlockedBadges = badges.filter((b) => b.check(p));

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <KPI label="Niveau" value={String(p.level)} sub={`${p.xp} XP total`} />
        <KPI label="Régularité" value={`${streak} j`} sub={`Cette semaine : ${week}/6`} />
        <KPI
          label="Temps hebdo"
          value={`${Math.round(weekMinutes)} min`}
          sub={`Objectif : ${p.weeklyGoal.minutes} min`}
        />
        <KPI label="Pièces" value={String(p.coins)} sub="Récompenses cosmétiques" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card title="Temps passé (7 derniers jours)">
          <div className="flex items-end gap-2 h-40 mt-2">
            {last7.map((d) => (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t-md transition-all"
                  style={{
                    height: `${(d.minutes / maxMin) * 100}%`,
                    minHeight: 4,
                    background: d.minutes > 0 ? "rgb(37 99 235)" : "rgb(226 232 240)",
                  }}
                  title={`${d.minutes} min`}
                />
                <div className="text-[10px] text-slate-500">{d.label}</div>
                <div className="text-[10px] font-medium text-slate-700">{d.minutes}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Résultats par matière">
          <div className="space-y-3">
            {totals.map(({ s, ok, ko, sessions }) => {
              const meta = subjectMeta[s];
              const total = ok + ko;
              const rate = total > 0 ? Math.round((ok / total) * 100) : 0;
              return (
                <div key={s}>
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-slate-800">
                      {meta.emoji} {meta.label}
                    </span>
                    <span className="text-slate-500">
                      {sessions} sessions · {ok}/{total} bonnes · {rate}%
                    </span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden mt-1">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${rate}%`, background: "rgb(37 99 235)" }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card title="Recommandations">
          <ul className="space-y-2">
            {recs.map((r, i) => (
              <li
                key={i}
                className="p-3 rounded-lg border"
                style={{
                  background:
                    r.tone === "warn"
                      ? "rgb(254 242 242)"
                      : r.tone === "good"
                        ? "rgb(240 253 244)"
                        : "rgb(248 250 252)",
                  borderColor:
                    r.tone === "warn"
                      ? "rgb(252 165 165)"
                      : r.tone === "good"
                        ? "rgb(134 239 172)"
                        : "rgb(226 232 240)",
                }}
              >
                <div className="font-semibold text-sm text-slate-800">{r.title}</div>
                <div className="text-sm text-slate-600 mt-0.5">{r.body}</div>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Erreurs fréquentes">
          {errors.length === 0 ? (
            <p className="text-sm text-slate-500">Rien à signaler pour le moment.</p>
          ) : (
            <ul className="text-sm space-y-1.5">
              {errors.map((e, i) => (
                <li key={i} className="flex justify-between">
                  <span className="text-slate-700">{e.label}</span>
                  <span className="text-slate-500">×{e.count}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card title="Compétences acquises">
        <div className="flex flex-wrap gap-2">
          {unlockedBadges.length === 0 && (
            <span className="text-sm text-slate-500">Aucun badge pour l'instant.</span>
          )}
          {unlockedBadges.map((b) => (
            <span
              key={b.id}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-sm"
            >
              <span>{b.emoji}</span> <span className="text-slate-700">{b.label}</span>
            </span>
          ))}
        </div>
        <div className="mt-4 text-sm text-slate-500">
          <Link to="/parent/historique" className="underline">
            Voir l'historique complet des sessions →
          </Link>
        </div>
      </Card>
    </div>
  );
}

function KPI({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl bg-white border border-slate-200 p-4">
      <div className="text-xs text-slate-500 uppercase tracking-wide">{label}</div>
      <div className="text-3xl font-bold text-slate-900 mt-1">{value}</div>
      {sub && <div className="text-xs text-slate-500 mt-1">{sub}</div>}
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl bg-white border border-slate-200 p-5">
      <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wide mb-3">{title}</h3>
      {children}
    </section>
  );
}
