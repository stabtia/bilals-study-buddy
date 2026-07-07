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
        className="shrink-0 w-14 h-14 rounded-2xl grid place-items-center text-3xl shadow-sm"
        style={{ background: "var(--accent)" }}
        aria-hidden
      >
        {face}
      </div>
      {message && (
        <div className="card-soft px-4 py-3 text-sm leading-relaxed relative">
          <span
            className="absolute -left-1.5 top-4 w-3 h-3 rotate-45"
            style={{ background: "var(--card)", borderLeft: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}
          />
          {message}
        </div>
      )}
    </div>
  );
}
