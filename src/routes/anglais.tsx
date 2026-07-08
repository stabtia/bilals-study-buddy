import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { Mascot } from "@/components/Mascot";
import { englishLessons } from "@/lib/data";
import { recordAnswer, recordSubjectSession, awardXP, awardCoins, celebrate } from "@/lib/storage";
import { useSessionTimer } from "@/hooks/useSessionTimer";
import { useEffect, useState } from "react";
import { Volume2 } from "lucide-react";

export const Route = createFileRoute("/anglais")({
  component: Anglais,
  head: () => ({ meta: [{ title: "Anglais — Coach Bilal" }] }),
});

function speak(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "en-US";
  u.rate = 0.9;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}

function Anglais() {
  const timer = useSessionTimer("anglais");
  const [idx, setIdx] = useState(0);
  const lesson = englishLessons[idx % englishLessons.length];
  const [answers, setAnswers] = useState<(number | null)[]>(() => lesson.quiz.map(() => null));
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setAnswers(lesson.quiz.map(() => null));
    setChecked(false);
  }, [idx, lesson]);

  function submit() {
    setChecked(true);
    let ok = 0;
    answers.forEach((a, i) => {
      const r = a === lesson.quiz[i].answer;
      recordAnswer("anglais", r);
      if (r) { ok++; timer.onCorrect(); } else timer.onWrong();
    });
    recordSubjectSession("anglais");
    awardXP(ok * 10);
    awardCoins(ok * 3);
    if (ok === lesson.quiz.length) {
      celebrate({ title: `Lesson « ${lesson.theme} » done!`, xp: 25, coins: 10, badge: "🇬🇧",
        message: "Awesome job, Bilal!" });
    }
  }

  return (
    <AppLayout>
      <header className="pt-2 pb-4">
        <p className="text-sm font-semibold" style={{ color: "var(--anglais)" }}>🇬🇧 English confidence</p>
        <h1 className="text-3xl font-bold">{lesson.theme}</h1>
        <p className="text-sm text-muted-foreground">Tu as super progressé, continue comme ça 🚀</p>
      </header>

      <section className="card-soft p-6">
        <h3 className="font-bold mb-3">Lis et répète</h3>
        <ul className="grid gap-3">
          {lesson.phrases.map((p, i) => (
            <li key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "color-mix(in oklab, var(--anglais) 12%, white)" }}>
              <button onClick={() => speak(p.en)} className="w-10 h-10 rounded-full grid place-items-center shrink-0"
                style={{ background: "var(--anglais)", color: "white" }} aria-label="Écouter">
                <Volume2 className="w-5 h-5" />
              </button>
              <div>
                <div className="font-bold">{p.en}</div>
                <div className="text-xs text-muted-foreground">{p.fr}</div>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-6">
        <h3 className="font-bold mb-3">Mini quiz</h3>
        <div className="grid gap-3">
          {lesson.quiz.map((q, i) => (
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
                      onClick={() => !checked && setAnswers((a) => a.map((x, j) => (j === i ? k : x)))}
                      disabled={checked}
                      className="text-left px-4 py-3 rounded-xl border-2 font-medium"
                      style={{
                        borderColor: right ? "var(--success)" : wrong ? "var(--destructive)" : active ? "var(--primary)" : "var(--border)",
                        background: right ? "color-mix(in oklab, var(--success) 15%, white)"
                          : wrong ? "color-mix(in oklab, var(--destructive) 10%, white)"
                          : active ? "color-mix(in oklab, var(--primary) 10%, white)" : "var(--card)",
                      }}
                    >{c}</button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {!checked ? (
          <button
            onClick={submit}
            disabled={answers.some((a) => a === null)}
            className="btn-big mt-4 disabled:opacity-50"
            style={{ background: "var(--anglais)", color: "black" }}
          >Check my answers</button>
        ) : (
          <button onClick={() => setIdx((n) => n + 1)} className="btn-big mt-4" style={{ background: "var(--primary)", color: "white" }}>
            Next lesson
          </button>
        )}
      </section>

      <div className="mt-8">
        <Mascot mood="cheer" message="You can do it, Bilal! Speak out loud, don't be shy 😄" />
      </div>
    </AppLayout>
  );
}
