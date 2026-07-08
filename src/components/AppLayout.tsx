import { Link, useRouterState } from "@tanstack/react-router";
import {
  Home,
  LayoutDashboard,
  Calculator,
  BookOpen,
  FlaskConical,
  Languages,
  Sparkles,
  Trophy,
  ShoppingBag,
} from "lucide-react";
import type { ReactNode } from "react";
import { XPBar } from "./XPBar";

const nav = [
  { to: "/", label: "Accueil", icon: Home, color: "var(--primary)" },
  { to: "/dashboard", label: "Ma journée", icon: LayoutDashboard, color: "var(--primary)" },
  { to: "/missions", label: "Défis", icon: Trophy, color: "var(--gold)" },
  { to: "/maths", label: "Maths", icon: Calculator, color: "var(--maths)" },
  { to: "/francais", label: "Français", icon: BookOpen, color: "var(--francais)" },
  { to: "/sciences", label: "Sciences", icon: FlaskConical, color: "var(--sciences)" },
  { to: "/anglais", label: "Anglais", icon: Languages, color: "var(--anglais)" },
  { to: "/coach", label: "Coach", icon: Sparkles, color: "var(--francais)" },
  { to: "/boutique", label: "Boutique", icon: ShoppingBag, color: "var(--anglais)" },
] as const;

export function AppLayout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 backdrop-blur-md bg-background/70 border-b-2 border-border">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg group">
            <span
              className="w-10 h-10 rounded-2xl grid place-items-center text-2xl transition-transform group-hover:scale-110 group-hover:rotate-6"
              style={{
                background: "linear-gradient(135deg, var(--accent), oklch(0.92 0.08 60))",
                border: "2px solid oklch(0.88 0.06 85)",
                boxShadow: "0 3px 0 -1px oklch(0.84 0.06 85)",
              }}
            >
              🦊
            </span>
            <span>Coach Bilal</span>
          </Link>
          <div className="ml-auto hidden sm:block w-72">
            <XPBar compact />
          </div>
        </div>
        <div className="sm:hidden px-4 pb-3">
          <XPBar compact />
        </div>
      </header>

      {/* key={pathname} relance l'animation d'entrée à chaque changement d'écran */}
      <main key={pathname} className="max-w-5xl mx-auto px-4 py-6 pb-32 page-enter">
        {children}
        <div className="mt-16 text-center">
          <Link
            to="/parent/login"
            className="text-xs text-muted-foreground/60 hover:text-muted-foreground underline"
          >
            Espace parents
          </Link>
        </div>
      </main>

      {/* Dock de navigation façon jeu */}
      <nav className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 max-w-[calc(100%-1rem)]">
        <div className="card-soft flex items-center gap-1 px-2 py-2 overflow-x-auto">
          {nav.map(({ to, label, icon: Icon, color }) => {
            const active = pathname === to || (to !== "/" && pathname.startsWith(to));
            return (
              <Link
                key={to}
                to={to}
                className="flex flex-col items-center justify-center gap-0.5 px-3 py-1.5 rounded-xl text-[11px] font-bold min-w-[60px] transition-all hover:-translate-y-0.5"
                style={{
                  background: active ? color : "transparent",
                  color: active ? "white" : "var(--muted-foreground)",
                  boxShadow: active
                    ? "inset 0 -3px 0 oklch(0 0 0 / 0.2), inset 0 2px 0 oklch(1 0 0 / 0.25)"
                    : "none",
                  transform: active ? "translateY(-2px)" : undefined,
                }}
              >
                <Icon className={`w-5 h-5 ${active ? "anim-wiggle" : ""}`} />
                <span>{label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
