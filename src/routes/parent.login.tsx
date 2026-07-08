import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { parentAuth, useParentMode } from "@/lib/auth";
import { useProgress, setParentPin } from "@/lib/storage";
import { Lock } from "lucide-react";

export const Route = createFileRoute("/parent/login")({
  component: ParentLogin,
});

function ParentLogin() {
  const p = useProgress();
  const isParent = useParentMode();
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);
  const [changing, setChanging] = useState(false);
  const [newPin, setNewPin] = useState("");

  if (isParent) {
    return (
      <div className="min-h-screen bg-slate-50 grid place-items-center px-4">
        <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-sm w-full text-center">
          <p className="text-slate-700">Vous êtes déjà connecté.</p>
          <button onClick={() => router.navigate({ to: "/parent" })}
            className="mt-4 w-full py-2.5 rounded-lg bg-slate-900 text-white font-semibold">
            Aller au tableau de bord
          </button>
        </div>
      </div>
    );
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (parentAuth.signIn(pin, p.parentPin)) {
      router.navigate({ to: "/parent" });
    } else {
      setError(true);
    }
  }

  function changePin(e: React.FormEvent) {
    e.preventDefault();
    if (newPin.length < 4) return;
    setParentPin(newPin);
    setChanging(false);
    setNewPin("");
    alert("Nouveau code enregistré.");
  }

  return (
    <div className="min-h-screen bg-slate-50 grid place-items-center px-4">
      <div className="bg-white rounded-xl border border-slate-200 p-6 max-w-sm w-full">
        <div className="w-12 h-12 rounded-full bg-slate-900 grid place-items-center text-white mb-3">
          <Lock className="w-5 h-5" />
        </div>
        <h1 className="text-xl font-bold text-slate-900">Espace parents</h1>
        <p className="text-sm text-slate-500 mt-1">
          Espace réservé. Entrez le code parent pour accéder au suivi de Bilal.
        </p>

        <form onSubmit={submit} className="mt-5 space-y-3">
          <input
            type="password"
            inputMode="numeric"
            value={pin}
            onChange={(e) => { setPin(e.target.value); setError(false); }}
            placeholder="Code parent"
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:border-slate-900 focus:outline-none"
            autoFocus
          />
          {error && <div className="text-sm text-red-600">Code incorrect.</div>}
          <button type="submit" className="w-full py-2.5 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800">
            Se connecter
          </button>
        </form>

        <div className="mt-5 text-xs text-slate-500">
          <div>Code par défaut : <b>1234</b> (à changer)</div>
          <button onClick={() => setChanging((c) => !c)} className="underline mt-1">
            {changing ? "Annuler" : "Modifier le code"}
          </button>
        </div>

        {changing && (
          <form onSubmit={changePin} className="mt-3 space-y-2">
            <input
              type="password"
              value={newPin}
              onChange={(e) => setNewPin(e.target.value)}
              placeholder="Nouveau code (≥ 4 chiffres)"
              className="w-full px-3 py-2 rounded-lg border border-slate-300 text-sm"
            />
            <button className="w-full py-2 rounded-lg bg-slate-100 text-sm font-semibold">
              Enregistrer
            </button>
          </form>
        )}

        <div className="mt-6 text-xs text-slate-400">
          Version locale — connexion sécurisée Supabase à venir.
        </div>
      </div>
    </div>
  );
}
