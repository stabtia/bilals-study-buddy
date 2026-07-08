import { createFileRoute } from "@tanstack/react-router";
import { useProgress } from "@/lib/storage";
import { currentStreak, daysThisWeek, subjectMeta, badges, type Subject } from "@/lib/data";
import { recommendations } from "@/lib/gamification";
import { FileDown } from "lucide-react";

export const Route = createFileRoute("/parent/rapport")({
  component: Rapport,
});

function Rapport() {
  const p = useProgress();

  async function exportPdf() {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const now = new Date().toLocaleDateString("fr-FR");
    let y = 40;

    doc.setFontSize(18);
    doc.text("Rapport de progression — Bilal", 40, y);
    y += 22;
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Généré le ${now}`, 40, y);
    y += 24;
    doc.setTextColor(0);

    doc.setFontSize(13);
    doc.text("Vue d'ensemble", 40, y);
    y += 18;
    doc.setFontSize(11);
    const streak = currentStreak(p.daysCompleted);
    const week = daysThisWeek(p.daysCompleted);
    const weekMin = Math.round(
      Object.entries(p.dailyTime).reduce((n, [d, s]) => {
        const days = (Date.now() - new Date(d).getTime()) / 86400000;
        return days < 7 ? n + s / 60 : n;
      }, 0),
    );
    const lines = [
      `Niveau : ${p.level}   XP total : ${p.xp}   Pièces : ${p.coins}`,
      `Régularité : ${streak} jour(s) consécutifs`,
      `Semaine : ${week}/6 jours travaillés — ${weekMin} min (objectif ${p.weeklyGoal.minutes} min)`,
      `Sessions totales : ${p.sessions.length}`,
    ];
    lines.forEach((l) => {
      doc.text(l, 40, y);
      y += 16;
    });
    y += 8;

    doc.setFontSize(13);
    doc.text("Résultats par matière", 40, y);
    y += 18;
    doc.setFontSize(11);
    (["maths", "francais", "sciences", "anglais"] as Subject[]).forEach((s) => {
      const meta = subjectMeta[s];
      const ok = p.correctAnswers[s];
      const ko = p.wrongAnswers[s];
      const total = ok + ko;
      const rate = total > 0 ? Math.round((ok / total) * 100) : 0;
      doc.text(
        `- ${meta.label} : ${p.subjectCounts[s]} sessions, ${ok}/${total} bonnes réponses (${rate}%)`,
        50,
        y,
      );
      y += 16;
    });
    y += 8;

    doc.setFontSize(13);
    doc.text("Compétences acquises", 40, y);
    y += 18;
    doc.setFontSize(11);
    const got = badges.filter((b) => b.check(p));
    if (got.length === 0) {
      doc.text("Aucun badge débloqué pour le moment.", 50, y);
      y += 16;
    } else {
      got.forEach((b) => {
        doc.text(`- ${b.label} — ${b.description}`, 50, y);
        y += 16;
      });
    }
    y += 8;

    doc.setFontSize(13);
    doc.text("Recommandations", 40, y);
    y += 18;
    doc.setFontSize(11);
    recommendations(p).forEach((r) => {
      doc.setFont("helvetica", "bold");
      doc.text(`- ${r.title}`, 50, y);
      y += 14;
      doc.setFont("helvetica", "normal");
      const wrap = doc.splitTextToSize(r.body, 500);
      doc.text(wrap, 60, y);
      y += wrap.length * 14 + 4;
      if (y > 780) {
        doc.addPage();
        y = 40;
      }
    });

    doc.save(`rapport-bilal-${new Date().toISOString().slice(0, 10)}.pdf`);
  }

  return (
    <div className="space-y-6 max-w-lg">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Rapport PDF</h1>
        <p className="text-slate-500 text-sm mt-1">
          Exporter un rapport complet de progression : statistiques, badges, recommandations.
        </p>
      </div>
      <button
        onClick={exportPdf}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800"
      >
        <FileDown className="w-4 h-4" /> Télécharger le rapport
      </button>
      <p className="text-xs text-slate-400">
        Le rapport est généré localement à partir des données actuelles.
      </p>
    </div>
  );
}
