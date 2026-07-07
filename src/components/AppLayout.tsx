import { Link, useRouterState } from "@tanstack/react-router";
import { Home, LayoutDashboard, Calculator, BookOpen, FlaskConical, Languages, Users, Sparkles } from "lucide-react";
import type { ReactNode } from "react";

const nav = [
  { to: "/", label: "Accueil", icon: Home },
  { to: "/dashboard", label: "Ma journée", icon: LayoutDashboard },
  { to: "/maths", label: "Maths", icon: Calculator },
  { to: "/francais", label: "Français", icon: BookOpen },
  { to: "/sciences", label: "Sciences", icon: FlaskConical },
  { to: "/anglais", label: "Anglais", icon: Languages },
  { to: "/coach", label: "Coach Bilal", icon: Sparkles },
  { to: "/parent", label: "Parents", icon: Users },
] as const;

export function AppLayout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 backdrop-blur-md bg-background/70 border-b border-border">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg">
            <span className="w-9 h-9 rounded-full grid place-items-center text-xl" style={{ background: "var(--accent)" }}>🦊</span>
            <span>Coach Bilal</span>
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 pb-28">
        {children}
      </main>

      <nav className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 max-w-[calc(100%-1rem)]">
        <div className="card-soft flex items-center gap-1 px-2 py-2 overflow-x-auto">
          {nav.map(({ to, label, icon: Icon }) => {
            const active = pathname === to || (to !== "/" && pathname.startsWith(to));
            return (
              <Link
                key={to}
                to={to}
                className="flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold min-w-[60px] transition-colors"
                style={{
                  background: active ? "var(--primary)" : "transparent",
                  color: active ? "var(--primary-foreground)" : "var(--muted-foreground)",
                }}
              >
                <Icon className="w-5 h-5" />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
