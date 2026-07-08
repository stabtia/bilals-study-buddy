import { createFileRoute } from "@tanstack/react-router";
import { useProgress, setNotifications } from "@/lib/storage";

export const Route = createFileRoute("/parent/notifications")({
  component: Notifications,
});

function Notifications() {
  const p = useProgress();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
        <p className="text-slate-500 text-sm mt-1">Activez ou désactivez les rappels et résumés.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 max-w-lg">
        <Toggle
          label="Rappel quotidien"
          desc="Un petit rappel pour Bilal en fin de journée."
          value={p.notifications.dailyReminder}
          onChange={(v) => setNotifications({ dailyReminder: v })}
        />
        <Toggle
          label="Résumé hebdomadaire"
          desc="Un email récapitulatif chaque dimanche (à venir avec Supabase)."
          value={p.notifications.weeklyDigest}
          onChange={(v) => setNotifications({ weeklyDigest: v })}
        />
        <Toggle
          label="Sons dans l'app (enfant)"
          desc="Sons de victoire lors des célébrations."
          value={p.notifications.soundEnabled}
          onChange={(v) => setNotifications({ soundEnabled: v })}
        />
      </div>

      <p className="text-xs text-slate-400 max-w-lg">
        Les notifications push par email/SMS seront activées lors du branchement à Supabase.
      </p>
    </div>
  );
}

function Toggle({ label, desc, value, onChange }: {
  label: string; desc: string; value: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className="p-4 flex items-start gap-3">
      <div className="flex-1">
        <div className="font-medium text-slate-800">{label}</div>
        <div className="text-sm text-slate-500 mt-0.5">{desc}</div>
      </div>
      <button
        onClick={() => onChange(!value)}
        className="w-11 h-6 rounded-full transition-colors relative"
        style={{ background: value ? "rgb(15 23 42)" : "rgb(203 213 225)" }}
      >
        <span className="absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all"
          style={{ left: value ? "22px" : "2px" }} />
      </button>
    </div>
  );
}
