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

const MODEL = "google/gemini-2.5-flash";

export const askCoach = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Coach indisponible : LOVABLE_API_KEY manquante.");

    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...data.messages,
    ];

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": key,
      },
      body: JSON.stringify({
        model: MODEL,
        messages,
        temperature: 0.7,
      }),
    });

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      if (res.status === 429)
        throw new Error("Trop de messages d'un coup, réessaie dans un instant.");
      if (res.status === 402)
        throw new Error("Crédits IA épuisés. Un parent doit recharger l'espace de travail Lovable.");
      throw new Error(`Coach indisponible (${res.status}): ${body.slice(0, 200)}`);
    }

    const json = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content =
      json.choices?.[0]?.message?.content?.trim() ||
      "Je n'ai pas compris, peux-tu reformuler ?";
    return { content };
  });
