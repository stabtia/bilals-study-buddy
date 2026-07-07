import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { useProgress, resetProgress } from "@/lib/storage";
import { currentStreak, daysThisWeek, subjectMeta, type Subject } from "@/lib/data";

export const Route = createFileRoute("/parent")({
  component: Parent,
  head: () => ({ meta: [{ title: "Espace parents — Coach Bilal" }] }),
});

function Parent() {
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

  const weakest = [...totals].sort((a, b) => (b.ko - b.ok) - (a.ko - a.ok))[0];
  const strongest = [...totals].sort((a, b) => (b.ok - b.ko) - (a.ok - a.ko))[0];

  return (
    <AppLayout>
      <header className="pt-2 pb-4">
        <p className="text-sm text-muted-foreground">Espace parents</p>
        <h1 className="text-3xl font-bold">Suivi hebdomadaire de Bilal</h1>
      </header>

      <div className="grid sm:grid-cols-3 gap-3 mb-6">
        <Stat label="Jours travaillés (semaine)" value={`${week} / 6`} />
        <Stat label="Régularité (série en cours)" value={`${streak} jour${streak > 1 ? "s" : ""}`} />
        <Stat label="Sessions totales" value={String(totals.reduce((n, t) => n + t.sessions, 0))} />
      </div>

      <section className="card-soft p-6 mb-6">
        <h2 className="text-xl font-bold mb-3">Résultats par matière</h2>
        <div className="grid gap-3">
          {totals.map(({ s, ok, ko, sessions }) => {
            const meta = subjectMeta[s];
            const total = ok + ko;
            const rate = total > 0 ? Math.round((ok / total) * 100) : 0;
            return (
              <div key={s} className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl grid place-items-center text-xl"
                  style={{ background: `color-mix(in oklab, ${meta.color} 20%, white)` }}>{meta.emoji}</div>
                <div className="flex-1">
                  <div className="flex justify-between items-baseline">
                    <div className="font-bold">{meta.label}</div>
                    <div className="text-sm text-muted-foreground">
                      {sessions} session{sessions > 1 ? "s" : ""} · {ok}/{total} bonnes réponses
                    </div>
                  </div>
                  <div className="mt-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${rate}%`, background: meta.color }} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="card-soft p-6 mb-6">
        <h2 className="text-xl font-bold mb-3">Résumé de la semaine</h2>
        <div className="grid sm:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="font-bold" style={{ color: "var(--success)" }}>✨ Point fort</div>
            <p className="mt-1">{strongest && strongest.ok > 0
              ? `${subjectMeta[strongest.s].label} : belle réussite.`
              : "À découvrir avec les premières sessions."}</p>
          </div>
          <div>
            <div className="font-bold" style={{ color: "var(--destructive)" }}>🎯 À revoir</div>
            <p className="mt-1">{weakest && weakest.ko > 0
              ? `${subjectMeta[weakest.s].label} : quelques hésitations.`
              : "Rien de notable, continuez comme ça."}</p>
          </div>
          <div>
            <div className="font-bold" style={{ color: "var(--primary)" }}>💡 Conseil</div>
            <p className="mt-1">Maintenir 20 min / jour, prioriser les maths, valoriser l'effort avant la note.</p>
          </div>
        </div>
      </section>

      <section className="card-soft p-6 mb-6">
        <h2 className="text-xl font-bold mb-3">Difficultés repérées récemment</h2>
        {p.lastNotes.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucune difficulté enregistrée pour le moment.</p>
        ) : (
          <ul className="text-sm space-y-2 max-h-64 overflow-auto">
            {p.lastNotes.map((n, i) => (
              <li key={i} className="flex justify-between gap-2 border-b border-border py-1">
                <span><b>{subjectMeta[n.subject].label}</b> — {n.note}</span>
                <span className="text-muted-foreground shrink-0">{n.date}</span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <button
        onClick={() => { if (confirm("Réinitialiser toutes les données ?")) resetProgress(); }}
        className="text-xs text-muted-foreground underline"
      >Réinitialiser la progression</button>
    </AppLayout>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card-soft p-4">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
    </div>
  );
}
