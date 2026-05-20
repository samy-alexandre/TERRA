[README.md](https://github.com/user-attachments/files/28071468/README.md)
# TERRA

Une expérience coopérative de renaissance d'un monde.

## Lancer le jeu

```bash
npm install
npm start
```

Puis ouvre `http://localhost:3000` dans ton navigateur.

## Jouer

- **Toi** : tu cliques sur "éveiller un monde" → tu obtiens un code à 4 lettres
- **Tes potes** : ils ouvrent la même URL et entrent le code

### Contrôles

- **Bouger** : ZQSD / WASD / flèches / glisser le doigt (mobile)
- **Chanter** : ESPACE / toucher maintenu

### Comment ça marche

Vous êtes des présences de lumière sur un monde gris et endormi.
**Seul, vous ne pouvez presque rien.**

Approchez-vous d'un autre voyageur et chantez ensemble. Une floraison
explosera de vie : arbres, fleurs, lumière, couleur. Le ciel se réchauffera.
La musique se construira note par note, ensemble.

Plus vous êtes nombreux à chanter ensemble, plus la floraison est puissante.
Quand le monde atteint 100% de vie : le climax.

À la fin, vous gardez la graine de votre monde. Il était unique.
Vous l'avez fait ensemble.

## Déployer en ligne (pour jouer avec des potes à distance)

### Render.com (gratuit, simple)

1. Push ce dossier sur un repo GitHub
2. Sur render.com → New → Web Service → relie ton repo
3. Build: `npm install` · Start: `npm start`
4. Tu obtiens une URL publique en HTTPS — partage-la

### Tech

- Three.js r0.149 + UnrealBloomPass (le glow AAA)
- Tone.js (musique générative)
- simplex-noise (terrain organique)
- Socket.IO (multijoueur)
- Monde déterministe par seed → bande passante minimale, scale à beaucoup de joueurs

Tout est chargé via CDN (jsdelivr). Aucune installation d'asset à faire.
