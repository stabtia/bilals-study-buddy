import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useProgress, setWeeklyGoal } from "@/lib/storage";

export const Route = createFileRoute("/parent/objectifs")({
  component: Objectifs,
});

function Objectifs() {
  const p = useProgress();
  const [ex, setEx] = useState(p.weeklyGoal.exercises);
  const [min, setMin] = useState(p.weeklyGoal.minutes);
  const [saved, setSaved] = useState(false);

  function save(e: React.FormEvent) {
    e.preventDefault();
    setWeeklyGoal({ exercises: ex, minutes: min });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Objectifs hebdomadaires</h1>
        <p className="text-slate-500 text-sm mt-1">Ajustez l'ambition selon la semaine (vacances, examens...).</p>
      </div>

      <form onSubmit={save} className="bg-white rounded-xl border border-slate-200 p-6 space-y-5 max-w-lg">
        <Field label="Nombre d'exercices" value={ex} min={5} max={100} step={1} onChange={setEx} suffix="exos" />
        <Field label="Temps de travail" value={min} min={30} max={600} step={10} onChange={setMin} suffix="min" />
        <Field label="Niveaux à terminer (indicatif)" value={Math.round(min / 30)} disabled suffix="niveaux" />

        <button className="px-5 py-2.5 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800">
          Enregistrer
        </button>
        {saved && <span className="ml-3 text-sm text-green-600">✓ Enregistré</span>}
      </form>
    </div>
  );
}

function Field({ label, value, min, max, step, onChange, suffix, disabled }: {
  label: string; value: number; min?: number; max?: number; step?: number;
  onChange?: (n: number) => void; suffix?: string; disabled?: boolean;
}) {
  return (
    <div>
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <div className="mt-1 flex items-center gap-3">
        <input
          type="range" min={min} max={max} step={step} value={value} disabled={disabled}
          onChange={(e) => onChange?.(Number(e.target.value))}
          className="flex-1"
        />
        <div className="w-24 text-right text-sm font-semibold text-slate-800">
          {value} {suffix}
        </div>
      </div>
    </div>
  );
}
