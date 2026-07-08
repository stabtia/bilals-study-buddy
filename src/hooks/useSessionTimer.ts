import { useEffect, useRef } from "react";
import type { Subject } from "@/lib/data";
import { logSession } from "@/lib/storage";

// Suit le temps passé sur une matière et permet d'incrémenter les compteurs à la sortie.
export function useSessionTimer(subject: Subject) {
  const started = useRef<number>(Date.now());
  const correct = useRef(0);
  const wrong = useRef(0);
  const logged = useRef(false);

  useEffect(() => {
    started.current = Date.now();
    logged.current = false;
    return () => {
      if (logged.current) return;
      const durationSec = Math.round((Date.now() - started.current) / 1000);
      if (durationSec < 5 && correct.current === 0 && wrong.current === 0) return;
      logged.current = true;
      logSession({
        startedAt: started.current,
        durationSec,
        subject,
        correct: correct.current,
        wrong: wrong.current,
      });
    };
  }, [subject]);

  return {
    onCorrect: () => { correct.current++; },
    onWrong: () => { wrong.current++; },
    flush: () => {
      if (logged.current) return;
      const durationSec = Math.round((Date.now() - started.current) / 1000);
      logged.current = true;
      logSession({
        startedAt: started.current,
        durationSec,
        subject,
        correct: correct.current,
        wrong: wrong.current,
      });
      started.current = Date.now();
      correct.current = 0;
      wrong.current = 0;
      logged.current = false;
    },
  };
}
