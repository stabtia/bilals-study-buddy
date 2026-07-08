import type { ReactNode } from "react";

interface Props {
  message?: ReactNode;
  mood?: "happy" | "cheer" | "think";
}

export function Mascot({ message, mood = "happy" }: Props) {
  const face = mood === "cheer" ? "🎉" : mood === "think" ? "🤔" : "🦊";
  return (
    <div className="flex items-start gap-3">
      <div
        className="shrink-0 w-14 h-14 rounded-2xl grid place-items-center text-3xl anim-float"
        style={{
          background: "linear-gradient(135deg, var(--accent), oklch(0.92 0.09 60))",
          border: "2px solid oklch(0.86 0.08 85)",
          boxShadow: "0 4px 0 -1px oklch(0.84 0.06 85), 0 12px 24px -14px oklch(0.6 0.12 85 / 0.6)",
        }}
        aria-hidden
      >
        {face}
      </div>
      {message && (
        <div className="card-soft px-4 py-3 text-sm leading-relaxed relative font-semibold anim-pop">
          <span
            className="absolute -left-2 top-4 w-3.5 h-3.5 rotate-45"
            style={{
              background: "var(--card)",
              borderLeft: "2px solid oklch(0.9 0.03 255)",
              borderBottom: "2px solid oklch(0.9 0.03 255)",
            }}
          />
          {message}
        </div>
      )}
    </div>
  );
}
