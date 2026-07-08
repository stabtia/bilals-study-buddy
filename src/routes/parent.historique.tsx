import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useProgress } from "@/lib/storage";
import { subjectMeta } from "@/lib/data";
import type { Subject } from "@/lib/data";

export const Route = createFileRoute("/parent/historique")({
  component: Historique,
});

const PAGE = 20;

function Historique() {
  const p = useProgress();
  const [n, setN] = useState(PAGE);
  const shown = p.sessions.slice(0, n);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Historique des sessions</h1>
        <p className="text-slate-500 text-sm mt-1">{p.sessions.length} sessions enregistrées.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        {shown.length === 0 ? (
          <div className="p-6 text-sm text-slate-500">Aucune session pour le moment.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-4 py-2">Date</th>
                <th className="text-left px-4 py-2">Matière</th>
                <th className="text-right px-4 py-2">Durée</th>
                <th className="text-right px-4 py-2">✓</th>
                <th className="text-right px-4 py-2">✗</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {shown.map((s) => {
                const meta = subjectMeta[s.subject as Subject];
                return (
                  <tr key={s.id}>
                    <td className="px-4 py-2 text-slate-600">
                      {new Date(s.startedAt).toLocaleString("fr-FR", { dateStyle: "short", timeStyle: "short" })}
                    </td>
                    <td className="px-4 py-2 text-slate-800">{meta.emoji} {meta.label}</td>
                    <td className="px-4 py-2 text-right">{Math.round(s.durationSec / 60)} min</td>
                    <td className="px-4 py-2 text-right text-green-600">{s.correct}</td>
                    <td className="px-4 py-2 text-right text-red-600">{s.wrong}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {n < p.sessions.length && (
        <button onClick={() => setN((x) => x + PAGE)}
          className="px-4 py-2 rounded-lg border border-slate-300 text-sm">
          Afficher plus
        </button>
      )}
    </div>
  );
}
