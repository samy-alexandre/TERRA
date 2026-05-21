# 🌱 TERRA — Guide complet

## Le projet contient (12 fichiers + 1 dossier lib)

```
terra/
├── README.md
├── package.json
├── package-lock.json
├── server.js
└── public/
    ├── index.html
    └── lib/
        ├── three.min.js          (624 KB)
        ├── EffectComposer.js
        ├── RenderPass.js
        ├── ShaderPass.js
        ├── UnrealBloomPass.js
        ├── CopyShader.js
        ├── LuminosityHighPassShader.js
        ├── Sky.js
        ├── simplex-noise.js
        └── Tone.js               (350 KB)
```

**Si UN SEUL fichier du dossier `lib/` manque, le jeu plante avec "éveil du monde…" infini.**

---

## ⚡ DÉPLOIEMENT — étape par étape

### Étape 1 : Test local (1 minute)

Avant de redéployer, vérifie que ça marche sur ton PC :

```bash
unzip TERRA_COMPLET.zip
cd terra
npm install
npm start
```

Ouvre `http://localhost:3000`. Si tu vois l'écran TERRA → **le code est bon à 100%**.
Si après ça marche pas sur Render → c'est forcément un problème d'upload GitHub.

### Étape 2 : Pousser sur GitHub — LA MÉTHODE QUI MARCHE

⚠️ **L'interface web de GitHub foire les uploads de dossiers complets.**

#### Option A — Via Git ligne de commande (le plus fiable)

```bash
cd terra
git init
git add .
git commit -m "TERRA complet avec libs locales"
git branch -M main
git remote add origin https://github.com/TON-USERNAME/terra.git
git push -u origin main --force
```

#### Option B — Via GitHub Desktop (sans ligne de commande)

1. Installe GitHub Desktop : https://desktop.github.com
2. Clone ton repo terra
3. Dans le dossier cloné, **supprime tout sauf le dossier `.git`**
4. Copie-colle **tout le contenu** du dossier `terra/` du ZIP
5. GitHub Desktop voit tous les changements → Commit → Push

#### Option C — Interface web GitHub (à éviter mais possible)

1. Supprime tous les fichiers existants du repo
2. Add file → Upload files
3. Sélectionne TOUT le contenu de `terra/` (Ctrl+A) et drag-drop
4. **VÉRIFIE** avant commit que tu vois bien les 10 fichiers de `public/lib/`
5. Si un manque, recommence

### Étape 3 : Vérifier le redéploiement

1. dashboard.render.com → ton service → onglet **Events**
2. Tu dois voir `Deploy started` puis `Deploy live` (2-5 min)

### Étape 4 : Tester en navigation privée

Ouvre l'URL en Ctrl+Shift+N (navigation privée) — garantit aucun cache.

---

## 🔍 DIAGNOSTIC SI ÇA MARCHE PAS

Test : ouvre ces URLs une par une dans ton navigateur :

```
https://ton-url.onrender.com/lib/three.min.js
https://ton-url.onrender.com/lib/EffectComposer.js
https://ton-url.onrender.com/lib/UnrealBloomPass.js
https://ton-url.onrender.com/lib/Sky.js
https://ton-url.onrender.com/lib/simplex-noise.js
https://ton-url.onrender.com/lib/Tone.js
https://ton-url.onrender.com/lib/RenderPass.js
https://ton-url.onrender.com/lib/ShaderPass.js
https://ton-url.onrender.com/lib/CopyShader.js
https://ton-url.onrender.com/lib/LuminosityHighPassShader.js
```

- Chaque URL doit te montrer **du code JavaScript**
- Si UNE URL te dit "Cannot GET" ou 404 → ce fichier manque sur GitHub
- Va voir ton repo GitHub dans `public/lib/` — tu dois avoir les 10 fichiers

---

## 🎮 COMMENT JOUER

1. Ouvre ton URL TERRA
2. Tape ton nom → "éveiller un monde"
3. Tu obtiens un code à 4 lettres
4. Partage avec tes potes — ils ouvrent la même URL et entrent le code

**Contrôles** :
- Bouger : ZQSD / WASD / flèches / glisser au doigt
- **Chanter** : ESPACE / toucher l'écran maintenu

**Le moment magique** :
- Approche d'un autre joueur (< 7 unités)
- Maintenez ESPACE tous les deux en même temps
- Une floraison explose : arbres, fleurs, lumière, musique
- Plus vous êtes synchronisés, plus c'est puissant
- Quand la barre "vie du monde" atteint 100% → climax 🌅
