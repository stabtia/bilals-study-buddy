import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { Mascot } from "@/components/Mascot";
import { subjectMeta, type Subject } from "@/lib/data";
import { useProgress } from "@/lib/storage";
import { Play, Sparkles, Target, Trophy } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

const worlds: Subject[] = ["maths", "francais", "sciences", "anglais"];

function Index() {
  const p = useProgress();

  return (
    <AppLayout>
      {/* Héros façon écran titre de jeu */}
      <section className="relative pt-6 pb-10 text-center overflow-hidden">
        {/* Décor flottant */}
        <span className="absolute left-[6%] top-2 text-3xl anim-float select-none" aria-hidden>
          ⭐
        </span>
        <span
          className="absolute right-[8%] top-8 text-4xl anim-float select-none"
          style={{ animationDelay: "0.6s" }}
          aria-hidden
        >
          🪙
        </span>
        <span
          className="absolute left-[14%] bottom-4 text-3xl anim-float select-none"
          style={{ animationDelay: "1.1s" }}
          aria-hidden
        >
          🚀
        </span>
        <span
          className="absolute right-[16%] bottom-0 text-2xl anim-float select-none"
          style={{ animationDelay: "1.6s" }}
          aria-hidden
        >
          💎
        </span>

        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-extrabold mb-4 anim-pop"
          style={{
            background: "var(--accent)",
            color: "var(--accent-foreground)",
            border: "2px solid oklch(0.86 0.08 85)",
            boxShadow: "0 3px 0 -1px oklch(0.84 0.06 85)",
          }}
        >
          <Sparkles className="w-3.5 h-3.5" /> Pour Bilal, direction la 5e
        </div>
        <h1 className="text-4xl sm:text-6xl font-bold leading-tight">
          Salut Bilal 👋
          <br />
          <span
            style={{
              background: "linear-gradient(90deg, var(--primary), var(--francais))",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            Prêt pour ta quête du jour ?
          </span>
        </h1>
        <p className="mt-4 text-muted-foreground max-w-lg mx-auto font-semibold">
          20 minutes par jour. Des exercices courts, des XP à gagner, des récompenses à débloquer.
        </p>
        <div className="mt-7 flex flex-wrap gap-3 justify-center">
          <Link
            to="/dashboard"
            className="btn-big inline-flex items-center gap-2 text-xl px-8 py-4"
            style={{
              background: "linear-gradient(135deg, var(--success), oklch(0.6 0.17 165))",
              color: "white",
            }}
          >
            <Play className="w-6 h-6 fill-current" /> JOUER
          </Link>
          <Link
            to="/coach"
            className="btn-big inline-flex items-center gap-2 bg-card"
            style={{ border: "2px solid var(--border)" }}
          >
            🦊 Parler au Coach
          </Link>
        </div>
      </section>

      <section className="mt-2">
        <Mascot
          message={
            <>
              Je suis <b>Coach Bilal</b> 🦊. Chaque exercice te rapporte des <b>XP</b> et des{" "}
              <b>pièces</b> 🪙. On y va ?
            </>
          }
        />
      </section>

      {/* Mondes à explorer */}
      <section className="mt-10">
        <h2 className="text-2xl font-bold mb-4">🗺️ Choisis ton monde</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {worlds.map((s, i) => {
            const meta = subjectMeta[s];
            const done = p.subjectCounts[s];
            return (
              <Link
                key={s}
                to={meta.route}
                className="card-soft p-4 text-center transition-all hover:-translate-y-1.5 hover:rotate-1 anim-pop"
                style={{ animationDelay: `${i * 0.07}s` }}
              >
                <div
                  className="mx-auto w-16 h-16 rounded-3xl grid place-items-center text-4xl"
                  style={{
                    background: `linear-gradient(135deg, color-mix(in oklab, ${meta.color} 30%, white), color-mix(in oklab, ${meta.color} 10%, white))`,
                    border: `2px solid color-mix(in oklab, ${meta.color} 40%, white)`,
                    boxShadow: `0 4px 0 -1px color-mix(in oklab, ${meta.color} 35%, white)`,
                  }}
                >
                  {meta.emoji}
                </div>
                <div className="mt-2 font-bold font-display">{meta.label}</div>
                <div className="text-[11px] font-semibold text-muted-foreground">
                  {done > 0 ? `${done} session${done > 1 ? "s" : ""} ✓` : "Nouveau !"}
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="grid sm:grid-cols-3 gap-4 mt-10">
        {[
          {
            icon: Target,
            title: "Une quête par jour",
            desc: "3 blocs simples, 20 à 30 min max.",
            color: "var(--primary)",
          },
          {
            icon: Sparkles,
            title: "XP et pièces",
            desc: "Chaque effort te fait monter de niveau.",
            color: "var(--francais)",
          },
          {
            icon: Trophy,
            title: "Badges et coffres",
            desc: "Régularité = récompenses surprises !",
            color: "var(--gold)",
          },
        ].map(({ icon: Icon, title, desc, color }, i) => (
          <div
            key={title}
            className="card-soft p-5 anim-pop"
            style={{ animationDelay: `${0.15 + i * 0.07}s` }}
          >
            <div
              className="w-11 h-11 rounded-2xl grid place-items-center text-white"
              style={{
                background: color,
                boxShadow: "inset 0 -3px 0 oklch(0 0 0 / 0.18), inset 0 2px 0 oklch(1 0 0 / 0.25)",
              }}
            >
              <Icon className="w-5 h-5" />
            </div>
            <h3 className="mt-3 font-bold">{title}</h3>
            <p className="mt-1 text-sm text-muted-foreground font-semibold">{desc}</p>
          </div>
        ))}
      </section>

      <section className="mt-10 card-soft p-6">
        <h2 className="text-xl font-bold">📅 Ton programme de la semaine</h2>
        <ul className="mt-3 grid sm:grid-cols-2 gap-2 text-sm font-semibold">
          <li>
            🗓️ <b>Lundi</b> — Maths + Lecture
          </li>
          <li>
            🗓️ <b>Mardi</b> — Maths + Anglais
          </li>
          <li>
            🗓️ <b>Mercredi</b> — Sciences + Français
          </li>
          <li>
            🗓️ <b>Jeudi</b> — Maths + Lecture
          </li>
          <li>
            🗓️ <b>Vendredi</b> — Anglais + Quiz
          </li>
          <li>
            🗓️ <b>Samedi</b> — Défi léger
          </li>
          <li>
            🗓️ <b>Dimanche</b> — Repos 💤
          </li>
        </ul>
      </section>
    </AppLayout>
  );
}
