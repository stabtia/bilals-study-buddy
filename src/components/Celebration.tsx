import { useEffect } from "react";
import confetti from "canvas-confetti";
import { Link } from "@tanstack/react-router";
import { useCelebration, clearCelebration } from "@/lib/celebration-bus";
import { useProgress } from "@/lib/storage";
import { xpProgressInLevel } from "@/lib/gamification";

const CHILD_NAME = "Bilal";

function playWinSound(enabled: boolean) {
  if (!enabled || typeof window === "undefined") return;
  try {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AC();
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, i) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "triangle";
      o.frequency.value = freq;
      g.gain.setValueAtTime(0, ctx.currentTime + i * 0.12);
      g.gain.linearRampToValueAtTime(0.15, ctx.currentTime + i * 0.12 + 0.02);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.25);
      o.connect(g).connect(ctx.destination);
      o.start(ctx.currentTime + i * 0.12);
      o.stop(ctx.currentTime + i * 0.12 + 0.3);
    });
    setTimeout(() => ctx.close(), 1500);
  } catch {
    /* noop */
  }
}

export function Celebration() {
  const payload = useCelebration();
  const progress = useProgress();

  useEffect(() => {
    if (!payload) return;
    const duration = 1500;
    const end = Date.now() + duration;
    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: ["#ff6b6b", "#ffd93d", "#6bcB77", "#4d96ff", "#c780ff"],
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: ["#ff6b6b", "#ffd93d", "#6bcB77", "#4d96ff", "#c780ff"],
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
    playWinSound(progress.notifications.soundEnabled);
  }, [payload, progress.notifications.soundEnabled]);

  if (!payload) return null;
  const { level, pct, current, needed } = xpProgressInLevel(progress.xp);

  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-black/50 backdrop-blur-sm animate-in fade-in"
      onClick={clearCelebration}
    >
      <div
        className="card-soft p-6 sm:p-8 max-w-sm mx-4 text-center animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-6xl animate-bounce">{payload.badge ?? "🏆"}</div>
        <h2 className="mt-3 text-2xl font-bold" style={{ color: "var(--primary)" }}>
          Bravo {CHILD_NAME} !
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{payload.title}</p>
        {payload.message && <p className="mt-3 text-sm">{payload.message}</p>}

        <div className="mt-5 grid grid-cols-2 gap-3">
          <div
            className="rounded-2xl p-3"
            style={{ background: "color-mix(in oklab, var(--primary) 12%, white)" }}
          >
            <div className="text-xs text-muted-foreground">XP gagnés</div>
            <div className="text-2xl font-bold">+{payload.xp} ⚡</div>
          </div>
          <div
            className="rounded-2xl p-3"
            style={{ background: "color-mix(in oklab, var(--anglais) 20%, white)" }}
          >
            <div className="text-xs text-muted-foreground">Pièces</div>
            <div className="text-2xl font-bold">+{payload.coins} 🪙</div>
          </div>
        </div>

        <div className="mt-5 text-left">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Niveau {level}</span>
            <span>
              {current} / {needed} XP
            </span>
          </div>
          <div className="bar-track h-4 mt-1">
            <div
              className="bar-fill"
              style={{
                width: `${Math.max(4, pct * 100)}%`,
                background: "linear-gradient(90deg, var(--primary), var(--francais))",
              }}
            />
          </div>
        </div>

        <div className="mt-6 flex gap-2">
          <Link
            to="/boutique"
            onClick={clearCelebration}
            className="btn-big flex-1"
            style={{ background: "var(--primary)", color: "white" }}
          >
            Voir ma récompense
          </Link>
          <button
            onClick={clearCelebration}
            className="btn-big"
            style={{ background: "var(--muted)", color: "var(--foreground)" }}
          >
            Continuer
          </button>
        </div>
      </div>
    </div>
  );
}
