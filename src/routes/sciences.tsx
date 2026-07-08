import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { Mascot } from "@/components/Mascot";
import { sciences } from "@/lib/data";
import { recordAnswer, recordSubjectSession, awardXP, awardCoins, celebrate } from "@/lib/storage";
import { useSessionTimer } from "@/hooks/useSessionTimer";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/sciences")({
  component: Sciences,
  head: () => ({ meta: [{ title: "Sciences — Coach Bilal" }] }),
});

function Sciences() {
  const timer = useSessionTimer("sciences");
  const [idx, setIdx] = useState(0);
  const fact = sciences[idx % sciences.length];
  const [answers, setAnswers] = useState<(number | null)[]>(() => fact.quiz.map(() => null));
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setAnswers(fact.quiz.map(() => null));
    setChecked(false);
  }, [idx, fact]);

  function submit() {
    setChecked(true);
    let ok = 0;
    answers.forEach((a, i) => {
      const r = a === fact.quiz[i].answer;
      recordAnswer("sciences", r);
      if (r) {
        ok++;
        timer.onCorrect();
      } else timer.onWrong();
    });
    recordSubjectSession("sciences");
    awardXP(ok * 10);
    awardCoins(ok * 3);
    if (ok === fact.quiz.length) {
      celebrate({
        title: `Fiche « ${fact.title} » maîtrisée !`,
        xp: 25,
        coins: 10,
        badge: "🔬",
        message: "Toutes les bonnes réponses !",
      });
    }
  }

  return (
    <AppLayout>
      <header className="pt-2 pb-4">
        <p className="text-sm font-semibold" style={{ color: "var(--sciences)" }}>
          🔬 Sciences
        </p>
        <h1 className="text-3xl font-bold">{fact.subject}</h1>
      </header>

      <article className="card-soft p-6">
        <h2 className="text-xl font-bold">{fact.title}</h2>
        <p className="mt-3 leading-relaxed">{fact.content}</p>
        <div
          className="mt-4 p-4 rounded-xl text-sm"
          style={{ background: "color-mix(in oklab, var(--sciences) 15%, white)" }}
        >
          <b>Exemple du quotidien : </b>
          {fact.example}
        </div>
      </article>

      <section className="mt-6">
        <h3 className="font-bold mb-3">Petit quiz</h3>
        <div className="grid gap-3">
          {fact.quiz.map((q, i) => (
            <div key={i} className="card-soft p-4">
              <div className="font-semibold">{q.q}</div>
              <div className="mt-2 grid gap-2">
                {q.choices.map((c, k) => {
                  const active = answers[i] === k;
                  const right = checked && k === q.answer;
                  const wrong = checked && active && k !== q.answer;
                  return (
                    <button
                      key={k}
                      onClick={() =>
                        !checked && setAnswers((a) => a.map((x, j) => (j === i ? k : x)))
                      }
                      disabled={checked}
                      className="text-left px-4 py-3 rounded-xl border-2 font-medium"
                      style={{
                        borderColor: right
                          ? "var(--success)"
                          : wrong
                            ? "var(--destructive)"
                            : active
                              ? "var(--primary)"
                              : "var(--border)",
                        background: right
                          ? "color-mix(in oklab, var(--success) 15%, white)"
                          : wrong
                            ? "color-mix(in oklab, var(--destructive) 10%, white)"
                            : active
                              ? "color-mix(in oklab, var(--primary) 10%, white)"
                              : "var(--card)",
                      }}
                    >
                      {c}
                    </button>
                  );
                })}
              </div>
              {checked && (
                <div className="mt-2 text-sm text-muted-foreground">💡 {q.explanation}</div>
              )}
            </div>
          ))}
        </div>

        {!checked ? (
          <button
            onClick={submit}
            disabled={answers.some((a) => a === null)}
            className="btn-big mt-4 disabled:opacity-50"
            style={{ background: "var(--sciences)", color: "white" }}
          >
            Valider
          </button>
        ) : (
          <button
            onClick={() => setIdx((n) => n + 1)}
            className="btn-big mt-4"
            style={{ background: "var(--primary)", color: "white" }}
          >
            Fiche suivante
          </button>
        )}
      </section>

      <div className="mt-8">
        <Mascot message="Les sciences, c'est comprendre le monde autour de toi. Une petite fiche à la fois !" />
      </div>
    </AppLayout>
  );
}
