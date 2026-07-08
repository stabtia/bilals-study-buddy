// Catalogue de récompenses cosmétiques (aucune influence sur les exercices).

export type RewardCategory =
  | "avatar"
  | "accessoire"
  | "wallpaper"
  | "frame"
  | "animation"
  | "title"
  | "mascot"
  | "winSound";

export interface Reward {
  id: string;
  category: RewardCategory;
  name: string;
  emoji: string;
  price: number;
  rarity?: "common" | "rare" | "legendary";
}

export const catalog: Reward[] = [
  // Avatars
  {
    id: "av-fox",
    category: "avatar",
    name: "Renard rusé",
    emoji: "🦊",
    price: 0,
    rarity: "common",
  },
  { id: "av-panda", category: "avatar", name: "Panda zen", emoji: "🐼", price: 40 },
  {
    id: "av-dragon",
    category: "avatar",
    name: "Dragon flamme",
    emoji: "🐲",
    price: 120,
    rarity: "rare",
  },
  {
    id: "av-astro",
    category: "avatar",
    name: "Astronaute",
    emoji: "🧑‍🚀",
    price: 200,
    rarity: "rare",
  },
  {
    id: "av-wizard",
    category: "avatar",
    name: "Magicien",
    emoji: "🧙",
    price: 300,
    rarity: "legendary",
  },
  { id: "av-ninja", category: "avatar", name: "Ninja", emoji: "🥷", price: 250, rarity: "rare" },

  // Accessoires
  {
    id: "ac-crown",
    category: "accessoire",
    name: "Couronne d'or",
    emoji: "👑",
    price: 150,
    rarity: "rare",
  },
  { id: "ac-glasses", category: "accessoire", name: "Lunettes cool", emoji: "🕶️", price: 60 },
  { id: "ac-cap", category: "accessoire", name: "Casquette", emoji: "🧢", price: 40 },

  // Wallpapers
  { id: "wp-space", category: "wallpaper", name: "Cosmos", emoji: "🌌", price: 80 },
  { id: "wp-forest", category: "wallpaper", name: "Forêt magique", emoji: "🌲", price: 80 },
  { id: "wp-sunset", category: "wallpaper", name: "Coucher de soleil", emoji: "🌅", price: 80 },

  // Cadres
  { id: "fr-gold", category: "frame", name: "Cadre or", emoji: "🟨", price: 120, rarity: "rare" },
  { id: "fr-neon", category: "frame", name: "Cadre néon", emoji: "🟪", price: 90 },
  {
    id: "fr-fire",
    category: "frame",
    name: "Cadre flammes",
    emoji: "🔥",
    price: 200,
    rarity: "legendary",
  },

  // Animations
  { id: "an-sparkle", category: "animation", name: "Étincelles", emoji: "✨", price: 70 },
  { id: "an-confetti", category: "animation", name: "Pluie de confettis", emoji: "🎊", price: 130 },

  // Titres
  {
    id: "ti-legend",
    category: "title",
    name: "Titre : Légende du calcul",
    emoji: "🏆",
    price: 180,
    rarity: "rare",
  },
  { id: "ti-explorer", category: "title", name: "Titre : Explorateur", emoji: "🧭", price: 90 },
  {
    id: "ti-roblox",
    category: "title",
    name: "Titre : Roblox Master",
    emoji: "🎮",
    price: 250,
    rarity: "rare",
  },

  // Mascottes
  {
    id: "ma-owl",
    category: "mascot",
    name: "Chouette savante",
    emoji: "🦉",
    price: 160,
    rarity: "rare",
  },
  { id: "ma-cat", category: "mascot", name: "Chat porte-bonheur", emoji: "🐱", price: 80 },

  // Sons de victoire
  { id: "ws-fanfare", category: "winSound", name: "Fanfare", emoji: "🎺", price: 50 },
  { id: "ws-magic", category: "winSound", name: "Étoiles magiques", emoji: "🌟", price: 70 },
];

export const categoryLabels: Record<RewardCategory, string> = {
  avatar: "Avatars",
  accessoire: "Accessoires",
  wallpaper: "Fonds d'écran",
  frame: "Cadres de profil",
  animation: "Animations",
  title: "Titres spéciaux",
  mascot: "Mascottes",
  winSound: "Sons de victoire",
};

export function findReward(id: string) {
  return catalog.find((r) => r.id === id);
}
