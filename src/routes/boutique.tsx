import { createFileRoute, Link } from "@tanstack/react-router";
import { AppLayout } from "@/components/AppLayout";
import { catalog, categoryLabels, type RewardCategory, type Reward } from "@/lib/rewards";
import { useProgress, buyReward, equipReward } from "@/lib/storage";
import { useState } from "react";
import { Check, Lock, Sparkles } from "lucide-react";

export const Route = createFileRoute("/boutique")({
  component: Boutique,
  head: () => ({ meta: [{ title: "Boutique — Coach Bilal" }] }),
});

const categories: RewardCategory[] = [
  "avatar",
  "accessoire",
  "wallpaper",
  "frame",
  "animation",
  "title",
  "mascot",
  "winSound",
];

const equipMap: Record<RewardCategory, keyof ReturnType<typeof useProgress>["equipped"]> = {
  avatar: "avatar",
  accessoire: "avatar",
  wallpaper: "wallpaper",
  frame: "frame",
  animation: "avatar",
  title: "title",
  mascot: "mascot",
  winSound: "winSound",
};

function Boutique() {
  const p = useProgress();
  const [cat, setCat] = useState<RewardCategory>("avatar");
  const items = catalog.filter((r) => r.category === cat);

  return (
    <AppLayout>
      <header className="pt-2 pb-4">
        <p className="text-sm font-semibold" style={{ color: "var(--primary)" }}>
          🛍️ Boutique
        </p>
        <h1 className="text-3xl font-bold">Dépense tes pièces</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Uniquement des récompenses cosmétiques — aucun avantage dans les exercices.
        </p>
      </header>

      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className="px-3 py-1.5 rounded-full text-sm font-semibold"
            style={{
              background: c === cat ? "var(--primary)" : "var(--muted)",
              color: c === cat ? "white" : "var(--muted-foreground)",
            }}
          >
            {categoryLabels[c]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {items.map((r) => (
          <RewardCard
            key={r.id}
            reward={r}
            owned={p.unlockedRewards.includes(r.id)}
            equipped={p.equipped[equipMap[r.category]] === r.id}
            coins={p.coins}
          />
        ))}
      </div>

      <p className="mt-8 text-xs text-muted-foreground text-center">
        💰 Astuce : gagne des pièces en finissant des{" "}
        <Link to="/missions" className="underline">
          défis
        </Link>{" "}
        !
      </p>
    </AppLayout>
  );
}

function RewardCard({
  reward,
  owned,
  equipped,
  coins,
}: {
  reward: Reward;
  owned: boolean;
  equipped: boolean;
  coins: number;
}) {
  const rarityColor =
    reward.rarity === "legendary"
      ? "linear-gradient(135deg,#fbbf24,#ef4444)"
      : reward.rarity === "rare"
        ? "linear-gradient(135deg,#a78bfa,#3b82f6)"
        : "var(--muted)";

  const canBuy = !owned && coins >= reward.price;

  function onBuy() {
    if (buyReward(reward.id, reward.price)) {
      // auto equip
      equipReward(reward.id, equipMap[reward.category]);
    }
  }

  return (
    <div className="card-soft p-4 flex flex-col items-center text-center relative overflow-hidden">
      {reward.rarity && (
        <div
          className="absolute top-1 right-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full text-white uppercase"
          style={{ background: rarityColor }}
        >
          {reward.rarity}
        </div>
      )}
      <div
        className="w-16 h-16 rounded-2xl grid place-items-center text-4xl"
        style={{ background: owned ? rarityColor : "var(--muted)" }}
      >
        {reward.emoji}
      </div>
      <div className="mt-2 font-bold text-sm">{reward.name}</div>
      <div className="text-xs text-muted-foreground">
        {reward.price === 0 ? "Offert" : `${reward.price} 🪙`}
      </div>

      <div className="mt-3 w-full">
        {equipped ? (
          <div
            className="text-xs font-bold py-2 rounded-lg inline-flex items-center justify-center gap-1 w-full"
            style={{
              background: "color-mix(in oklab, var(--success) 20%, white)",
              color: "var(--success)",
            }}
          >
            <Check className="w-3.5 h-3.5" /> Équipé
          </div>
        ) : owned ? (
          <button
            onClick={() => equipReward(reward.id, equipMap[reward.category])}
            className="text-xs font-bold py-2 rounded-lg w-full"
            style={{ background: "var(--primary)", color: "white" }}
          >
            Équiper
          </button>
        ) : canBuy ? (
          <button
            onClick={onBuy}
            className="text-xs font-bold py-2 rounded-lg w-full inline-flex items-center justify-center gap-1"
            style={{ background: "var(--accent)", color: "var(--accent-foreground)" }}
          >
            <Sparkles className="w-3.5 h-3.5" /> Débloquer
          </button>
        ) : (
          <div
            className="text-xs py-2 rounded-lg inline-flex items-center justify-center gap-1 w-full text-muted-foreground"
            style={{ background: "var(--muted)" }}
          >
            <Lock className="w-3.5 h-3.5" /> {reward.price - coins} 🪙 manquant
            {reward.price - coins > 1 ? "s" : ""}
          </div>
        )}
      </div>
    </div>
  );
}
