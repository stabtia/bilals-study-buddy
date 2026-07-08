import { Link, useRouter, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Target, Bell, FileText, History, LogOut, ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { parentAuth } from "@/lib/auth";

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean };
const nav: NavItem[] = [
  { to: "/parent", label: "Vue d'ensemble", icon: LayoutDashboard, exact: true },
  { to: "/parent/objectifs", label: "Objectifs", icon: Target },
  { to: "/parent/historique", label: "Historique", icon: History },
  { to: "/parent/notifications", label: "Notifications", icon: Bell },
  { to: "/parent/rapport", label: "Rapport PDF", icon: FileText },
];

export function ParentLayout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const router = useRouter();

  function signOut() {
    parentAuth.signOut();
    router.navigate({ to: "/" });
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-4">
          <Link
            to="/"
            className="text-sm text-slate-500 hover:text-slate-800 inline-flex items-center gap-1"
          >
            <ArrowLeft className="w-4 h-4" /> App
          </Link>
          <div className="font-semibold text-slate-800">Espace parents · Bilal</div>
          <button
            onClick={signOut}
            className="ml-auto text-sm text-slate-500 hover:text-slate-800 inline-flex items-center gap-1"
          >
            <LogOut className="w-4 h-4" /> Déconnexion
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-6 grid md:grid-cols-[220px_1fr] gap-6">
        <aside className="md:sticky md:top-4 self-start">
          <nav className="flex md:flex-col gap-1 overflow-x-auto">
            {nav.map(({ to, label, icon: Icon, exact }) => {
              const active = exact ? pathname === to : pathname.startsWith(to);
              return (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap"
                  style={{
                    background: active ? "rgb(15 23 42)" : "transparent",
                    color: active ? "white" : "rgb(51 65 85)",
                  }}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>
        <main className="min-w-0">{children}</main>
      </div>
    </div>
  );
}
