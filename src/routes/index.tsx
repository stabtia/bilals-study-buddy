import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { Mascot } from "@/components/Mascot";
import { ArrowRight, Sparkles, Target, Trophy } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <AppLayout>
      <section className="pt-4 pb-8 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4"
          style={{ background: "var(--accent)", color: "var(--accent-foreground)" }}>
          <Sparkles className="w-3.5 h-3.5" /> Pour Bilal, direction la 5e
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
          Salut Bilal 👋<br />
          <span style={{ color: "var(--primary)" }}>20 minutes par jour</span>, et tu progresses.
        </h1>
        <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
          Une petite routine tous les jours. Des exercices courts, des explications claires,
          et ton coach pour t'encourager.
        </p>
        <div className="mt-6 flex flex-wrap gap-3 justify-center">
          <Link to="/dashboard" className="btn-big inline-flex items-center gap-2 bg-primary text-primary-foreground">
            Commencer ma journée <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/coach" className="btn-big inline-flex items-center gap-2 border border-input bg-card">
            Parler à Coach Bilal
          </Link>
        </div>
      </section>

      <section className="mt-6">
        <Mascot message={<>Je suis <b>Coach Bilal</b> 🦊. Je t'accompagne chaque jour. On y va pas à pas, tranquille !</>} />
      </section>

      <section className="grid sm:grid-cols-3 gap-4 mt-8">
        {[
          { icon: Target, title: "Une mission par jour", desc: "3 blocs simples, 20 à 30 min max." },
          { icon: Sparkles, title: "Explications douces", desc: "Si tu te trompes, on recommence calmement." },
          { icon: Trophy, title: "Des badges à gagner", desc: "Régularité, maths, lecture, anglais…" },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="card-soft p-5">
            <Icon className="w-6 h-6" style={{ color: "var(--primary)" }} />
            <h3 className="mt-3 font-bold">{title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
          </div>
        ))}
      </section>

      <section className="mt-8 card-soft p-6">
        <h2 className="text-xl font-bold">Ton programme de la semaine</h2>
        <ul className="mt-3 grid sm:grid-cols-2 gap-2 text-sm">
          <li>🗓️ <b>Lundi</b> — Maths + Lecture</li>
          <li>🗓️ <b>Mardi</b> — Maths + Anglais</li>
          <li>🗓️ <b>Mercredi</b> — Sciences + Français</li>
          <li>🗓️ <b>Jeudi</b> — Maths + Lecture</li>
          <li>🗓️ <b>Vendredi</b> — Anglais + Quiz</li>
          <li>🗓️ <b>Samedi</b> — Défi léger</li>
          <li>🗓️ <b>Dimanche</b> — Repos 💤</li>
        </ul>
      </section>
    </AppLayout>
  );
}
