import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { Mascot } from "@/components/Mascot";
import { readings } from "@/lib/data";
import { recordAnswer, recordSubjectSession } from "@/lib/storage";
import { useMemo, useState } from "react";
import { Check } from "lucide-react";

export const Route = createFileRoute("/francais")({
  component: Francais,
  head: () => ({ meta: [{ title: "Français — Coach Bilal" }] }),
});

function Francais() {
  const [idx, setIdx] = useState(0);
  const reading = readings[idx % readings.length];
  const [answers, setAnswers] = useState<string[]>(() => reading.questions.map(() => ""));
  const [checked, setChecked] = useState(false);
  const [writing, setWriting] = useState("");
  const [done, setDone] = useState(false);

  const results = useMemo(
    () => reading.questions.map((q, i) =>
      answers[i]?.toLowerCase().trim().includes(q.a.toLowerCase().trim())),
    [answers, reading],
  );

  function submit() {
    setChecked(true);
    reading.questions.forEach((_, i) => recordAnswer("francais", !!results[i]));
    recordSubjectSession("francais");
  }

  function finish() {
    setDone(true);
    // conseils simples selon la longueur
  }

  function reset() {
    setIdx((n) => n + 1);
    setAnswers(readings[(idx + 1) % readings.length].questions.map(() => ""));
    setChecked(false);
    setWriting("");
    setDone(false);
  }

  const wc = writing.trim().split(/\s+/).filter(Boolean).length;
  const lc = writing.split(/\n/).filter((l) => l.trim().length > 0).length;

  return (
    <AppLayout>
      <header className="pt-2 pb-4">
        <p className="text-sm font-semibold" style={{ color: "var(--francais)" }}>📖 Français</p>
        <h1 className="text-3xl font-bold">Lecture & écriture</h1>
      </header>

      <article className="card-soft p-6">
        <h2 className="text-xl font-bold">{reading.title}</h2>
        <p className="mt-3 leading-relaxed text-[15px]">{reading.text}</p>
      </article>

      <section className="mt-6">
        <h3 className="font-bold mb-2">Questions de compréhension</h3>
        <div className="grid gap-3">
          {reading.questions.map((q, i) => (
            <div key={i} className="card-soft p-4">
              <label className="font-semibold text-sm">{q.q}</label>
              <input
                value={answers[i] ?? ""}
                onChange={(e) => setAnswers((a) => a.map((x, k) => (k === i ? e.target.value : x)))}
                className="mt-2 w-full px-3 py-2 rounded-lg border-2 border-input bg-background focus:outline-none focus:border-primary"
                placeholder="Ta réponse"
                disabled={checked}
              />
              {checked && (
                <div className="mt-2 text-sm" style={{ color: results[i] ? "var(--success)" : "var(--destructive)" }}>
                  {results[i] ? "✅ Bien vu !" : `Réponse attendue : ${q.a}`}
                </div>
              )}
            </div>
          ))}
        </div>
        {!checked ? (
          <button onClick={submit} className="btn-big mt-4" style={{ background: "var(--francais)", color: "white" }}>
            Vérifier mes réponses
          </button>
        ) : null}
      </section>

      <section className="mt-8">
        <h3 className="font-bold mb-2">✍️ Exercice d'écriture</h3>
        <p className="text-sm text-muted-foreground mb-2">{reading.writingPrompt}</p>
        <textarea
          value={writing}
          onChange={(e) => setWriting(e.target.value)}
          rows={6}
          className="w-full px-4 py-3 rounded-xl border-2 border-input bg-background focus:outline-none focus:border-primary leading-relaxed"
          placeholder="Écris ici, en soignant ta présentation…"
          disabled={done}
        />
        <div className="text-xs text-muted-foreground mt-1">
          {wc} mot{wc > 1 ? "s" : ""} · {lc} ligne{lc > 1 ? "s" : ""}
        </div>

        {!done ? (
          <button onClick={finish} className="btn-big mt-3 inline-flex items-center gap-2"
            style={{ background: "var(--primary)", color: "white" }}>
            <Check className="w-4 h-4" /> J'ai terminé
          </button>
        ) : (
          <div className="mt-4 card-soft p-4">
            <p className="font-bold">Bravo Bilal ! 🌟</p>
            <ul className="mt-2 text-sm space-y-1 list-disc pl-5">
              {lc >= 5 ? <li>Tu as bien atteint 5 lignes, c'est parfait.</li>
                : <li>Essaie d'atteindre 5 lignes la prochaine fois.</li>}
              <li>Relis ton texte à voix basse pour repérer les fautes.</li>
              <li>Utilise une majuscule au début et un point à la fin.</li>
              <li>Aère ton texte : une idée = une phrase.</li>
            </ul>
            <button onClick={reset} className="btn-big mt-4" style={{ background: "var(--francais)", color: "white" }}>
              Nouvelle lecture
            </button>
          </div>
        )}
      </section>

      <div className="mt-8">
        <Mascot message="Lis doucement, mot par mot. Comprendre, c'est mieux que lire vite !" />
      </div>
    </AppLayout>
  );
}
