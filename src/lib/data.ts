// Données d'exemple: exercices, planning, badges, récompenses, missions

export type Subject = "maths" | "francais" | "sciences" | "anglais";

export type Difficulty = "facile" | "moyen" | "difficile";

export interface MathExercise {
  id: string;
  category: "calcul" | "fractions" | "problemes" | "geometrie";
  difficulty: Difficulty;
  question: string;
  answer: string;
  explanation: string;
  hint?: string;
}

export const mathExercises: MathExercise[] = [
  { id: "m1", category: "calcul", difficulty: "facile", question: "Calcule : 7 × 8", answer: "56",
    explanation: "7 × 8 = 56. Astuce : 7 × 8 = 7 × 10 − 7 × 2 = 70 − 14 = 56.",
    hint: "Pense à la table de 7." },
  { id: "m2", category: "calcul", difficulty: "facile", question: "Calcule : 45 + 38", answer: "83",
    explanation: "45 + 38 = 45 + 30 + 8 = 75 + 8 = 83.", hint: "Ajoute d'abord les dizaines." },
  { id: "m3", category: "calcul", difficulty: "moyen", question: "Calcule : 12 × 15", answer: "180",
    explanation: "12 × 15 = 12 × 10 + 12 × 5 = 120 + 60 = 180.", hint: "Sépare 15 = 10 + 5." },
  { id: "m4", category: "fractions", difficulty: "facile", question: "Simplifie la fraction 6/8", answer: "3/4",
    explanation: "On divise numérateur et dénominateur par 2 : 6÷2 = 3 et 8÷2 = 4. Donc 6/8 = 3/4.",
    hint: "Cherche un diviseur commun." },
  { id: "m5", category: "fractions", difficulty: "moyen", question: "Calcule 1/2 + 1/4 (sous forme de fraction)", answer: "3/4",
    explanation: "1/2 = 2/4. Donc 2/4 + 1/4 = 3/4.", hint: "Mets au même dénominateur." },
  { id: "m6", category: "problemes", difficulty: "facile",
    question: "Léa achète 3 cahiers à 2,50 € l'un. Combien paie-t-elle ?", answer: "7.50",
    explanation: "3 × 2,50 € = 7,50 €.", hint: "Multiplie le prix par la quantité." },
  { id: "m7", category: "problemes", difficulty: "moyen",
    question: "Un train part à 14h20 et roule 1h45. À quelle heure arrive-t-il ? (format HH:MM)", answer: "16:05",
    explanation: "14h20 + 1h = 15h20. Puis 15h20 + 45 min = 16h05.",
    hint: "Ajoute d'abord les heures, puis les minutes." },
  { id: "m8", category: "geometrie", difficulty: "facile",
    question: "Combien de côtés a un hexagone ?", answer: "6",
    explanation: "Un hexagone a 6 côtés. « hex- » veut dire six en grec.",
    hint: "Hex... = 6." },
  { id: "m9", category: "geometrie", difficulty: "moyen",
    question: "Périmètre d'un rectangle de longueur 8 cm et largeur 3 cm ? (en cm)", answer: "22",
    explanation: "P = 2 × (L + l) = 2 × (8 + 3) = 2 × 11 = 22 cm.",
    hint: "Formule : 2 × (Longueur + largeur)." },
  { id: "m10", category: "calcul", difficulty: "difficile", question: "Calcule : 144 ÷ 12", answer: "12",
    explanation: "12 × 12 = 144, donc 144 ÷ 12 = 12.", hint: "Cherche : quel nombre × 12 = 144 ?" },
];

export interface Reading {
  id: string;
  title: string;
  text: string;
  questions: { q: string; a: string; hint?: string }[];
  writingPrompt: string;
}

export const readings: Reading[] = [
  {
    id: "r1",
    title: "Le petit renard",
    text: `Dans la forêt d'automne, un petit renard roux observait les feuilles tomber. Chaque matin, il descendait jusqu'à la rivière pour boire, puis remontait vers son terrier caché sous un vieux chêne. Ce jour-là, il aperçut un écureuil affairé à cacher ses noisettes. Curieux, il s'approcha doucement, sans bruit, pour ne pas l'effrayer.`,
    questions: [
      { q: "Quelle est la saison dans le texte ?", a: "automne", hint: "Regarde le premier mot après « forêt »." },
      { q: "Où le renard boit-il ?", a: "rivière", hint: "Relis la deuxième phrase." },
      { q: "Que fait l'écureuil ?", a: "cacher ses noisettes", hint: "Regarde la troisième phrase." },
    ],
    writingPrompt: "Raconte en 5 lignes une promenade dans une forêt. Que vois-tu ? Que ressens-tu ?",
  },
  {
    id: "r2",
    title: "La bibliothèque secrète",
    text: `Sami poussa la lourde porte de bois. À l'intérieur, des milliers de livres s'alignaient sur des étagères qui montaient jusqu'au plafond. Une odeur de vieux papier flottait dans l'air. Il choisit un livre au hasard, s'installa dans un fauteuil confortable et commença à lire. Le temps sembla s'arrêter.`,
    questions: [
      { q: "Qui entre dans la bibliothèque ?", a: "Sami" },
      { q: "Quelle odeur y a-t-il ?", a: "vieux papier", hint: "Cherche « une odeur de... »" },
      { q: "Où s'installe Sami ?", a: "fauteuil", hint: "Un meuble confortable." },
    ],
    writingPrompt: "Décris en 5 lignes ton livre préféré ou un endroit où tu aimes lire.",
  },
];

export interface SciFact {
  id: string;
  subject: "SVT" | "Physique-Chimie";
  title: string;
  content: string;
  example: string;
  quiz: { q: string; choices: string[]; answer: number; explanation: string }[];
}

export const sciences: SciFact[] = [
  {
    id: "s1",
    subject: "SVT",
    title: "La photosynthèse",
    content: "Les plantes utilisent la lumière du soleil, l'eau et le dioxyde de carbone (CO₂) pour fabriquer leur nourriture (sucre) et rejeter de l'oxygène (O₂).",
    example: "C'est comme une petite cuisine dans chaque feuille : soleil + eau + CO₂ → sucre + O₂ que nous respirons.",
    quiz: [
      { q: "De quoi la plante a-t-elle besoin ?", choices: ["Lumière et eau", "Sable", "Sel"], answer: 0,
        explanation: "La plante a besoin de lumière, d'eau et de CO₂." },
      { q: "Que rejette la plante ?", choices: ["Azote", "Oxygène", "Fumée"], answer: 1,
        explanation: "Elle rejette de l'oxygène, celui qu'on respire !" },
    ],
  },
  {
    id: "s2",
    subject: "Physique-Chimie",
    title: "Les états de l'eau",
    content: "L'eau existe sous 3 états : solide (glace), liquide (eau), et gazeux (vapeur). Elle change d'état selon la température.",
    example: "Un glaçon (solide) qui fond dans un verre devient liquide, et si on chauffe l'eau, elle s'évapore en vapeur.",
    quiz: [
      { q: "Combien d'états a l'eau ?", choices: ["2", "3", "4"], answer: 1,
        explanation: "Trois : solide, liquide, gazeux." },
      { q: "Comment s'appelle le passage liquide → gaz ?", choices: ["Fusion", "Évaporation", "Solidification"], answer: 1,
        explanation: "C'est l'évaporation (ou vaporisation)." },
    ],
  },
  {
    id: "s3",
    subject: "SVT",
    title: "La chaîne alimentaire",
    content: "Dans la nature, les êtres vivants se nourrissent les uns des autres. Les plantes sont mangées par des herbivores, eux-mêmes mangés par des carnivores.",
    example: "Herbe → lapin → renard. Le renard mange le lapin, qui mange l'herbe.",
    quiz: [
      { q: "Qui mange les plantes ?", choices: ["Carnivores", "Herbivores", "Roches"], answer: 1,
        explanation: "Les herbivores mangent des plantes." },
    ],
  },
];

export interface EnglishLesson {
  id: string;
  theme: string;
  phrases: { en: string; fr: string }[];
  quiz: { q: string; choices: string[]; answer: number }[];
}

export const englishLessons: EnglishLesson[] = [
  {
    id: "e1",
    theme: "Se présenter",
    phrases: [
      { en: "Hello, my name is Bilal.", fr: "Bonjour, je m'appelle Bilal." },
      { en: "I am 12 years old.", fr: "J'ai 12 ans." },
      { en: "I live in France.", fr: "J'habite en France." },
      { en: "Nice to meet you!", fr: "Ravi de te rencontrer !" },
    ],
    quiz: [
      { q: "Comment dit-on « J'ai 12 ans » ?", choices: ["I have 12 years", "I am 12 years old", "I am 12 year"], answer: 1 },
      { q: "« Ravi de te rencontrer » se dit :", choices: ["Nice to meet you", "See you soon", "Good night"], answer: 0 },
    ],
  },
  {
    id: "e2",
    theme: "À l'école",
    phrases: [
      { en: "What's your favorite subject?", fr: "Quelle est ta matière préférée ?" },
      { en: "I like art and PE.", fr: "J'aime les arts plastiques et l'EPS." },
      { en: "Math is difficult but I try.", fr: "Les maths sont difficiles mais j'essaie." },
    ],
    quiz: [
      { q: "« Matière préférée » se dit :", choices: ["favorite subject", "favorite school", "best matter"], answer: 0 },
    ],
  },
];

// Planning hebdomadaire
export const weeklyPlan: Record<number, { label: string; blocks: Subject[] }> = {
  1: { label: "Lundi", blocks: ["maths", "francais"] },
  2: { label: "Mardi", blocks: ["maths", "anglais"] },
  3: { label: "Mercredi", blocks: ["sciences", "francais"] },
  4: { label: "Jeudi", blocks: ["maths", "francais"] },
  5: { label: "Vendredi", blocks: ["anglais", "sciences"] },
  6: { label: "Samedi", blocks: ["maths"] },
  0: { label: "Dimanche", blocks: [] },
};

export const subjectMeta: Record<Subject, { label: string; emoji: string; color: string; route: string }> = {
  maths: { label: "Mathématiques", emoji: "🧮", color: "var(--maths)", route: "/maths" },
  francais: { label: "Français", emoji: "📖", color: "var(--francais)", route: "/francais" },
  sciences: { label: "Sciences", emoji: "🔬", color: "var(--sciences)", route: "/sciences" },
  anglais: { label: "Anglais", emoji: "🇬🇧", color: "var(--anglais)", route: "/anglais" },
};

export interface Badge {
  id: string;
  label: string;
  emoji: string;
  description: string;
  check: (s: ProgressState) => boolean;
}

export interface SessionLog {
  id: string;
  date: string; // ISO date
  startedAt: number; // epoch ms
  durationSec: number;
  subject: Subject;
  correct: number;
  wrong: number;
}

export interface MissionProgress {
  id: string;
  progress: number;
  claimed: boolean;
  periodKey: string; // YYYY-MM-DD or YYYY-Www or YYYY-MM
}

export interface WeeklyGoal {
  exercises: number;
  minutes: number;
}

export interface ProgressState {
  daysCompleted: string[]; // ISO dates (YYYY-MM-DD)
  subjectCounts: Record<Subject, number>;
  correctAnswers: Record<Subject, number>;
  wrongAnswers: Record<Subject, number>;
  lastNotes: { date: string; subject: Subject; note: string }[];
  // Gamification
  xp: number;
  coins: number;
  level: number;
  sessions: SessionLog[];
  dailyTime: Record<string, number>; // isoDate -> seconds
  weeklyGoal: WeeklyGoal;
  unlockedRewards: string[];
  equipped: { avatar?: string; frame?: string; wallpaper?: string; title?: string; mascot?: string; winSound?: string };
  missions: Record<string, MissionProgress>;
  notifications: { dailyReminder: boolean; weeklyDigest: boolean; soundEnabled: boolean };
  parentPin: string;
  chestOpenedOn: string[]; // ISO dates chest was opened
}

export const badges: Badge[] = [
  { id: "streak3", label: "3 jours réguliers", emoji: "🔥",
    description: "Travailler 3 jours d'affilée",
    check: (s) => currentStreak(s.daysCompleted) >= 3 },
  { id: "week1", label: "Semaine complète", emoji: "🏅",
    description: "6 jours travaillés cette semaine",
    check: (s) => daysThisWeek(s.daysCompleted) >= 6 },
  { id: "math", label: "Champion des maths", emoji: "🧮",
    description: "10 exercices de maths réussis",
    check: (s) => (s.correctAnswers.maths ?? 0) >= 10 },
  { id: "read", label: "Roi de la lecture", emoji: "👑",
    description: "5 lectures terminées",
    check: (s) => (s.subjectCounts.francais ?? 0) >= 5 },
  { id: "english", label: "Progression en anglais", emoji: "🚀",
    description: "3 sessions d'anglais",
    check: (s) => (s.subjectCounts.anglais ?? 0) >= 3 },
  { id: "level5", label: "Niveau 5", emoji: "⭐",
    description: "Atteindre le niveau 5",
    check: (s) => (s.level ?? 1) >= 5 },
  { id: "coins100", label: "Petit trésor", emoji: "💰",
    description: "Amasser 100 pièces",
    check: (s) => (s.coins ?? 0) >= 100 },
];

export function currentStreak(days: string[]): number {
  if (days.length === 0) return 0;
  const set = new Set(days);
  let streak = 0;
  const d = new Date();
  for (;;) {
    const iso = d.toISOString().slice(0, 10);
    if (set.has(iso)) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else break;
  }
  return streak;
}

export function daysThisWeek(days: string[]): number {
  const now = new Date();
  const day = now.getDay(); // 0 dim
  const monday = new Date(now);
  const diff = day === 0 ? -6 : 1 - day;
  monday.setDate(now.getDate() + diff);
  monday.setHours(0, 0, 0, 0);
  return days.filter((d) => new Date(d) >= monday).length;
}

export const motivationalMessages = [
  "Bravo Bilal, chaque effort compte 💪",
  "Tu progresses, même quand c'est difficile 🌱",
  "Encore un pas de plus vers la 5e 🚀",
  "Ta régularité est ta meilleure amie ⭐",
  "Fier de toi ! Continue comme ça 🎉",
];
