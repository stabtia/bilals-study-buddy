# Plan — Espace Parent + Gamification

Périmètre volontairement livré en **v1 locale** (localStorage), architecturée pour un branchement Supabase ultérieur sans refonte. L'expérience enfant actuelle reste intacte : ajouts additifs (célébration, XP, pièces) via un module gamification opt-in appelé depuis les modules existants.

## 1. Séparation Parent / Enfant

- Nouveau "mode" appli stocké dans `localStorage` (`bilal.mode = "child" | "parent"`).
- Route `/parent/login` : code parent (PIN 4 chiffres, par défaut `1234`, modifiable). Pas de vraie auth — préparation à Supabase (interface `AuthProvider` isolée dans `src/lib/auth.ts` avec impl locale swappable).
- Toutes les routes `/parent/*` protégées par un guard client `RequireParent`.
- La barre de navigation enfant (AppLayout) **ne montre plus** l'onglet Parents ; accès via petit lien discret en bas ("Espace parents").
- Layout parent dédié `ParentLayout` : sobre, sidebar, palette neutre (garde tokens actuels mais variantes "pro").

## 2. Tableau de bord Parent (`/parent`)

Sections :

- Vue d'ensemble : streak, jours travaillés semaine, XP total, niveau, pièces.
- Statistiques par matière (déjà existant, enrichi avec temps passé + taux réussite).
- Temps passé jour/semaine (graphique barres, recharts déjà dispo ou simple SVG maison).
- Historique des sessions (liste paginée).
- Erreurs fréquentes (agrégation des `lastNotes` par matière/thème).
- Compétences acquises (badges + succès débloqués).
- Recommandations personnalisées (règles simples selon ratios erreurs/matière).

Sous-pages :

- `/parent/objectifs` : définir objectif hebdo (exos, minutes, niveaux).
- `/parent/notifications` : toggles (rappels quotidiens, résumé hebdo) — stockés localement.
- `/parent/rapport` : export PDF via `jspdf` (bundle safe côté client).
- `/parent/historique` : sessions détaillées.

## 3. Tracking étendu

Extension de `ProgressState` (migration douce, valeurs par défaut) :

- `xp`, `coins`, `level`
- `sessions: { date, subject, durationSec, correct, wrong }[]`
- `dailyTime: Record<isoDate, seconds>`
- `weeklyGoal: { exercises, minutes }`
- `unlockedRewards: string[]`, `equipped: {...}`
- `missions: { daily, weekly, monthly }` avec progression + reset
- `notifications: { dailyReminder, weeklyDigest }`
- `parentPin: string`

Helpers dans `storage.ts` : `startSession/endSession`, `awardXP`, `awardCoins`, `checkLevelUp`, `progressMission`.

## 4. Écran de célébration (enfant)

Composant `<Celebration/>` monté en portail depuis les modules maths/français/etc. quand un parcours/niveau se termine :

- Confettis (canvas-confetti, package léger).
- Son victoire (WebAudio simple, togglable via prefs enfant).
- Message perso : "Bravo Bilal 🎉"
- Badge + coins + XP animés.
- Barre progression niveau.
- Bouton "Voir ma récompense" → `/boutique`.

## 5. Boutique enfant (`/boutique`)

- Grille d'items cosmétiques (avatars, cadres, fonds, mascottes, sons victoire, titres).
- Catalogue statique dans `src/lib/rewards.ts`.
- Prix en pièces. Achat = ajoute à `unlockedRewards`.
- Page `/avatar` pour équiper (déjà partiellement via Mascot).
- 100% cosmétique — n'affecte pas les exercices.

## 6. Missions (`/missions` côté enfant)

- Défis générés :
  - Quotidien (ex : "5 exos maths", reset minuit).
  - Hebdo (ex : "30 min français").
  - Mensuel (ex : "Débloquer 3 badges").
- Récompenses XP/coins, parfois badge rare.
- Affichés aussi sur dashboard enfant.

## 7. Gamification (couche transverse)

`src/lib/gamification.ts` : niveaux (courbe XP simple `100*level`), calcul récompenses, coffre surprise après N jours de streak, calendrier réussites (heatmap simple).

## 8. Architecture prête Supabase

- Toute la persistance passe par `src/lib/repo.ts` avec interface `ProgressRepo` (getState, updateState, listSessions, etc.). Impl actuelle : `LocalRepo` (localStorage). Impl future `SupabaseRepo` sans changer les composants.
- Auth idem via `src/lib/auth.ts` (`LocalPinAuth` → futur `SupabaseAuth`).

## Détails techniques

- Packages ajoutés : `canvas-confetti`, `jspdf`. (Pas de recharts pour rester léger — graphiques SVG maison.)
- Nouveaux fichiers :
  - `src/lib/auth.ts`, `src/lib/repo.ts`, `src/lib/gamification.ts`, `src/lib/rewards.ts`, `src/lib/missions.ts`
  - `src/components/ParentLayout.tsx`, `src/components/RequireParent.tsx`, `src/components/Celebration.tsx`, `src/components/XPBar.tsx`, `src/components/RewardCard.tsx`
  - Routes : `src/routes/parent.login.tsx`, `src/routes/parent.index.tsx` (refonte), `src/routes/parent.objectifs.tsx`, `src/routes/parent.notifications.tsx`, `src/routes/parent.rapport.tsx`, `src/routes/parent.historique.tsx`, `src/routes/boutique.tsx`, `src/routes/missions.tsx`, `src/routes/avatar.tsx`
- Fichiers modifiés (additif) :
  - `storage.ts` : migration état + nouveaux helpers
  - `data.ts` : types étendus, catalogues
  - `AppLayout.tsx` : retire onglet Parent, ajoute onglet Missions + Boutique côté enfant, lien discret parent
  - Modules maths/français/sciences/anglais : ajout `startSession/endSession` + déclenchement `<Celebration/>` à la fin du parcours
  - `__root.tsx` : monte Celebration global

## Ce que je NE fais PAS

- Pas de vraie auth Supabase (préparé mais non branché).
- Pas d'objets Roblox réels (mention "titre spécial Roblox" en cosmétique factice).
- Pas de notifications push OS (toggles préparent la future intégration).

Je livre le tout en une seule passe.
