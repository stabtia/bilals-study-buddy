import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { Mascot } from "@/components/Mascot";
import { mathExercises, type Difficulty } from "@/lib/data";
import { recordAnswer, recordSubjectSession, awardXP, awardCoins, celebrate } from "@/lib/storage";
import { useSessionTimer } from "@/hooks/useSessionTimer";
import { useMemo, useState } from "react";
import { Check, X, RefreshCw, Lightbulb } from "lucide-react";

export const Route = createFileRoute("/maths")({
  component: Maths,
  head: () => ({ meta: [{ title: "Maths — Coach Bilal" }] }),
});

function normalize(s: string) {
  return s.trim().toLowerCase().replace(",", ".").replace(/\s+/g, "").replace("€", "");
}

const GOAL = 5;

function Maths() {
  const timer = useSessionTimer("maths");
  const [difficulty, setDifficulty] = useState<Difficulty>("facile");
  const [i, setI] = useState(0);
  const [input, setInput] = useState("");
  const [state, setState] = useState<"idle" | "ok" | "ko">("idle");
  const [showHint, setShowHint] = useState(false);
  const [sessionCounted, setSessionCounted] = useState(false);
  const [streak, setStreak] = useState(0);

  const pool = useMemo(
    () => mathExercises.filter((e) => e.difficulty === difficulty),
    [difficulty],
  );
  const ex = pool[i % pool.length];

  function check() {
    if (!input.trim()) return;
    const correct = normalize(input) === normalize(ex.answer);
    setState(correct ? "ok" : "ko");
    recordAnswer("maths", correct, correct ? undefined : `${ex.category} — difficulté ${difficulty}`);
    if (correct) {
      timer.onCorrect();
      awardXP(10);
      awardCoins(2);
      const s = streak + 1;
      setStreak(s);
      if (s === GOAL) {
        celebrate({ title: `${GOAL} bonnes réponses d'affilée !`, xp: 40, coins: 20, badge: "🧮",
          message: "Ta série de maths est impressionnante." });
      }
    } else {
      timer.onWrong();
      setStreak(0);
    }
    if (!sessionCounted) {
      recordSubjectSession("maths");
      setSessionCounted(true);
    }
  }

  function next(easier = false) {
    if (easier && difficulty !== "facile") {
      setDifficulty(difficulty === "difficile" ? "moyen" : "facile");
    }
    setI((n) => n + 1);
    setInput("");
    setState("idle");
    setShowHint(false);
  }

  return (
    <AppLayout>
      <header className="pt-2 pb-4">
        <p className="text-sm font-semibold" style={{ color: "var(--maths)" }}>🧮 Mathématiques</p>
        <h1 className="text-3xl font-bold">Un exercice à la fois</h1>
        <div className="text-xs text-muted-foreground mt-1">Série en cours : {streak} / {GOAL} 🔥</div>
      </header>

      <div className="flex gap-2 mb-4">
        {(["facile", "moyen", "difficile"] as Difficulty[]).map((d) => (
          <button
            key={d}
            onClick={() => { setDifficulty(d); setI(0); setInput(""); setState("idle"); setShowHint(false); setStreak(0); }}
            className="px-4 py-2 rounded-full text-sm font-semibold capitalize"
            style={{
              background: d === difficulty ? "var(--maths)" : "var(--muted)",
              color: d === difficulty ? "white" : "var(--muted-foreground)",
            }}
          >{d}</button>
        ))}
      </div>

      <div className="card-soft p-6">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">{ex.category}</div>
        <p className="mt-2 text-2xl font-bold leading-snug">{ex.question}</p>

        <div className="mt-5 flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && state === "idle" && check()}
            placeholder="Ta réponse"
            className="flex-1 px-4 py-3 rounded-xl border-2 border-input bg-background text-lg font-semibold focus:outline-none focus:border-primary"
            disabled={state !== "idle"}
          />
          {state === "idle" ? (
            <button onClick={check} className="btn-big" style={{ background: "var(--maths)", color: "white" }}>Vérifier</button>
          ) : (
            <button onClick={() => next(state === "ko")} className="btn-big inline-flex items-center gap-2" style={{ background: "var(--primary)", color: "white" }}>
              <RefreshCw className="w-4 h-4" /> Suivant
            </button>
          )}
        </div>

        {state === "idle" && ex.hint && (
          <button
            onClick={() => setShowHint(true)}
            className="mt-3 text-sm inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
          >
            <Lightbulb className="w-4 h-4" /> Besoin d'un indice ?
          </button>
        )}
        {showHint && state === "idle" && (
          <div className="mt-2 text-sm p-3 rounded-lg" style={{ background: "var(--accent)" }}>💡 {ex.hint}</div>
        )}

        {state === "ok" && (
          <div className="mt-4 p-4 rounded-xl flex gap-3" style={{ background: "color-mix(in oklab, var(--success) 15%, white)" }}>
            <Check className="w-6 h-6 shrink-0" style={{ color: "var(--success)" }} />
            <div>
              <div className="font-bold">Bravo, c'est juste ! 🎉 <span className="text-xs font-normal text-muted-foreground">+10 XP · +2 🪙</span></div>
              <div className="text-sm mt-1">{ex.explanation}</div>
            </div>
          </div>
        )}
        {state === "ko" && (
          <div className="mt-4 p-4 rounded-xl flex gap-3" style={{ background: "color-mix(in oklab, var(--destructive) 12%, white)" }}>
            <X className="w-6 h-6 shrink-0" style={{ color: "var(--destructive)" }} />
            <div>
              <div className="font-bold">Pas grave, on regarde ensemble 💪</div>
              <div className="text-sm mt-1">La bonne réponse était <b>{ex.answer}</b>.</div>
              <div className="text-sm mt-1">{ex.explanation}</div>
              <div className="text-xs text-muted-foreground mt-2">Je te propose un exercice plus simple pour reprendre confiance.</div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6">
        <Mascot mood={state === "ok" ? "cheer" : "happy"}
          message={state === "ok"
            ? "Excellent ! Tu vois, tu es capable 💪"
            : state === "ko"
            ? "Une erreur, c'est normal. On apprend en essayant."
            : "Prends ton temps. Lis bien l'énoncé. Tu peux le faire !"} />
      </div>
    </AppLayout>
  );
}
