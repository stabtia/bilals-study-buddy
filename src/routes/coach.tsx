import { createFileRoute } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { useServerFn } from "@tanstack/react-start";
import { askCoach } from "@/lib/coach.functions";
import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";

export const Route = createFileRoute("/coach")({
  component: Coach,
  head: () => ({ meta: [{ title: "Coach Bilal — Assistant IA" }] }),
});

type Msg = { role: "user" | "assistant"; content: string };

function Coach() {
  const ask = useServerFn(askCoach);
  const [messages, setMessages] = useState<Msg[]>([
    { role: "assistant", content: "Salut Bilal 🦊 Je suis ton coach ! Dis-moi ce que tu ne comprends pas, ou demande-moi un exercice. Je suis là pour t'aider !" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setErr(null);
    setLoading(true);
    try {
      const res = await ask({ data: { messages: next } });
      setMessages((m) => [...m, { role: "assistant", content: res.content }]);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }

  const suggestions = [
    "Explique-moi les fractions",
    "Je bloque sur les multiplications",
    "Donne-moi un problème facile",
    "Aide-moi pour un mot en anglais",
  ];

  return (
    <AppLayout>
      <header className="pt-2 pb-4">
        <p className="text-sm text-muted-foreground">Assistant IA</p>
        <h1 className="text-3xl font-bold">Coach Bilal 🦊</h1>
      </header>

      <div className="card-soft p-4 min-h-[50vh] flex flex-col gap-3">
        <div className="flex-1 space-y-3 overflow-auto max-h-[60vh] pr-1">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className="max-w-[85%] px-4 py-2.5 rounded-2xl text-sm whitespace-pre-wrap leading-relaxed"
                style={{
                  background: m.role === "user" ? "var(--primary)" : "var(--secondary)",
                  color: m.role === "user" ? "white" : "var(--foreground)",
                }}
              >{m.content}</div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="px-4 py-2.5 rounded-2xl bg-secondary text-sm">Coach écrit… ✍️</div>
            </div>
          )}
          {err && <div className="text-sm text-destructive">{err}</div>}
          <div ref={bottomRef} />
        </div>

        {messages.length <= 1 && (
          <div className="flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button key={s} onClick={() => setInput(s)}
                className="text-xs px-3 py-1.5 rounded-full border border-input bg-background hover:bg-muted">
                {s}
              </button>
            ))}
          </div>
        )}

        <div className="flex gap-2 pt-2 border-t border-border">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Pose ta question à Coach Bilal…"
            className="flex-1 px-4 py-3 rounded-xl border-2 border-input bg-background focus:outline-none focus:border-primary"
            disabled={loading}
          />
          <button onClick={send} disabled={loading || !input.trim()}
            className="btn-big inline-flex items-center gap-1 disabled:opacity-50"
            style={{ background: "var(--primary)", color: "white" }}>
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      <p className="text-xs text-muted-foreground mt-3">
        Coach Bilal ne donne jamais la réponse directement : il t'explique pour que tu comprennes 💡
      </p>
    </AppLayout>
  );
}
