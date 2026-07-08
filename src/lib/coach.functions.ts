import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const MessageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.string(),
});

const InputSchema = z.object({
  messages: z.array(MessageSchema).min(1),
});

const SYSTEM_PROMPT = `Tu es « Coach Bilal », un tuteur bienveillant pour Bilal, 12 ans, élève de 6e qui entre en 5e.

Profil de Bilal :
- Bon en arts, EPS, musique.
- Progresse en anglais.
- En difficulté en mathématiques.
- Fragile en physique-chimie et SVT.
- Français correct mais à renforcer.
- Besoin : travailler peu mais régulièrement, gagner en confiance.

Règles ABSOLUES :
- Parle en français, simplement, comme à un enfant de 12 ans.
- Sois toujours bienveillant, encourageant, calme, jamais moqueur.
- Ne donne JAMAIS la réponse directement à un exercice sans expliquer étape par étape.
- Si Bilal se trompe, rassure-le et propose un exercice plus simple ou une explication différente.
- Utilise des exemples concrets du quotidien.
- Fais des phrases courtes. Une idée à la fois.
- Valorise l'effort avant la note.
- Si Bilal semble fatigué, propose une pause.
- Réponses courtes (5-10 lignes max), sauf demande d'explication détaillée.`;

// Modèle Claude utilisé (surchargeable via la variable d'env CLAUDE_MODEL).
// Claude Haiku est rapide et économique — idéal pour un tuteur enfant.
const CLAUDE_MODEL = process.env.CLAUDE_MODEL || "claude-haiku-4-5-20251001";

export const askCoach = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }) => {
    const key = process.env.ANTHROPIC_API_KEY;
    if (!key)
      throw new Error(
        "Clé Claude manquante : ajoute ANTHROPIC_API_KEY dans le fichier .env (voir README).",
      );

    // L'API Claude attend le prompt système dans un champ dédié et une
    // conversation qui commence par un message "user" (rôles user/assistant).
    const messages = data.messages.filter((m) => m.role !== "system");
    while (messages.length > 0 && messages[0].role !== "user") messages.shift();

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": key,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: CLAUDE_MODEL,
        max_tokens: 800,
        temperature: 0.7,
        system: SYSTEM_PROMPT,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      if (res.status === 429)
        throw new Error("Trop de messages d'un coup, réessaie dans un instant.");
      if (res.status === 401)
        throw new Error("Clé Claude invalide. Vérifie ANTHROPIC_API_KEY dans le fichier .env.");
      if (res.status === 400 && body.includes("credit"))
        throw new Error("Crédit Claude épuisé. Un parent doit recharger le compte Anthropic.");
      throw new Error(`Coach indisponible (${res.status}): ${body.slice(0, 200)}`);
    }

    const json = (await res.json()) as {
      content?: Array<{ type?: string; text?: string }>;
    };
    const content =
      json.content
        ?.filter((b) => b.type === "text")
        .map((b) => b.text ?? "")
        .join("") || "Je n'ai pas compris, peux-tu reformuler ?";
    return { content };
  });
