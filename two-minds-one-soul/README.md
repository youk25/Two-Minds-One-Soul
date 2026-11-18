# Two Minds One Soul

Jeu de réflexion 2D (HTML / CSS / JavaScript, sans dépendance).
Un seul esprit, deux personnages : **LIGHT** (espoir) et **DARK** (peurs).

## Lancer le jeu
Double-cliquer sur `game.html` (ou ouvrir dans un navigateur). Aucune installation.

## Contrôles (modifiables dans « Réglages »)
| Action | Touche |
|---|---|
| Se déplacer (vue de dessus, case par case) | Flèches ← ↑ → ↓ |
| Changer de personnage | Espace |
| Recommencer le niveau | R ou bouton « Recommencer » |
Réglages : rebind des touches + délai de répétition (sensibilité) + son on/off.

## Règles
- LIGHT ne peut pas traverser les **cactus** et DARK ne peut pas traverser les **piques**.
- Une **plaque** ouvre sa **porte** (même couleur) tant qu'un personnage ou une caisse est dessus.
- Les **caisses** se poussent (jamais tirées).
- Les **coins ◆** remplissent la réserve partagée (max 3). Marcher contre une **barrière** coûte 1 éclat ; impossible si la réserve est vide.
- Le niveau se termine quand LIGHT ou DARK atteint la sortie.
- Chaque changement de personnage conserve positions et états.
- Un mouvement impossible déclenche un tremblement de l'écran + un bip.

## Remplacer les formes par des images
1. Mets tes `.png` dans `assets/`.
2. Dans `js/config.js`, décommente / ajoute dans `ASSETS` : `nom: 'assets/fichier.png'`.
3. Noms : `floor wall thorns void box plate plate_on door door_open crystal barrier exit light DARK`.
   Ajoute `_light` ou `_dark` pour une version propre à un monde (ex. `wall_dark`). Les images sont dessinées en 56×56.
Ce qui n'a pas d'image reste dessiné en formes.

## Modifier / ajouter des niveaux
Tout est dans `js/levels.js` (cartes en texte, légende en haut du fichier).

## Structure
`game.html` · `css/style.css` · `js/config.js` (constantes, images) · `js/levels.js` · `js/game.js` (logique) · `js/input.js` · `js/render.js` · `js/audio.js` · `js/main.js` (interface + boucle)

## Crédits
Code, formes et sons (bips générés par WebAudio) : créés par l'équipe. Aucun asset externe. Police : Georgia (système).
