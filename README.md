# 📚 SwapPages

**SwapPages** est une plateforme web dédiée aux passionnés de lecture et aux amateurs de découvertes littéraires. Elle offre un espace unique où chaque lecteur peut échanger les livres qu’il ne lit plus contre de nouvelles histoires à explorer, favorisant ainsi le partage, l'économie circulaire et l’amour des livres.

---

## 🚀 Fonctionnalités principales

- 🔍 Visualiser la liste des échanges de livres disponibles  
- ➕ Créer un nouvel échange de livres  
- 📬 Proposer un livre pour un échange existant  
- 👤 Créer un compte utilisateur avec système d’authentification  
- 📦 Voir les échanges proposés par un utilisateur  
- 🔒 Protéger l’accès : seuls les créateurs d’un échange peuvent consulter les propositions liées à celui-ci

> 🛑 **Fonctionnalités non prises en charge dans cette version** :
> - Gestion du transport ou de la livraison des livres  
> - Acceptation ou refus des propositions  

---

## 🛠️ Technologies utilisées

- HTML / CSS / JavaScript  
- [Node.js](https://nodejs.org/)  
- [Express](https://expressjs.com/)  
- [express-session](https://www.npmjs.com/package/express-session)  
- [memorystore](https://www.npmjs.com/package/memorystore)  
- [passport](https://www.npmjs.com/package/passport)  
- [passport-local](https://www.npmjs.com/package/passport-local)  
- [bcrypt](https://www.npmjs.com/package/bcrypt)  
- [Google Books API](https://developers.google.com/books/docs/v1/using)  
- [Handlebars (hbs)](https://www.npmjs.com/package/hbs)  
- [SQLite](https://www.sqlite.org/index.html)

---

## ⚙️ Installation et configuration

### 1. Cloner le dépôt

```bash
git clone https://github.com/EliasOus/SwapPages.git
cd SwapPages
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Créer un fichier `.env`

Crée un fichier `.env` à la racine du projet avec les variables suivantes :

```env
SESSION_SECRET=ton_secret
DB_FILE=livre.db
PORT=3000
NODE_ENV=development
```

**SESSION_SECRET** : Clé secrète utilisée pour chiffrer les sessions utilisateur.  
Il s'agit d'une chaîne aléatoire longue et complexe qui garantit la sécurité des sessions d'authentification.  
👉 Exemple : `3fdsfsd45gf4g21d245sdf44dsgds2fs45g45dg4sg2d1s142g4dfs4gf45`  

> ⚠️ Important : ne partagez jamais cette clé publiquement et ne la laissez pas avec une valeur simple comme `secret` ou `12345`.

### 4. (Optionnel mais recommandé) Mode développement en HTTPS

Pour tester l'application en HTTPS (utile pour certaines fonctionnalités), crée un dossier `security` à la racine du projet et ajoute deux fichiers :
- `localhost.cert`
- `localhost.key`

Ces certificats peuvent être générés avec OpenSSL (voir documentation officielle).

### 5. Lancer le serveur

```bash
npm start
```

> L'application sera accessible sur :
> - http://localhost:3000 (mode normal)
> - https://localhost:3000 (si les certificats sont présents)

---

## 👨‍💻 Auteur

- **Nom** : Elias Ousameur  
- **Pseudonyme** : EliasOus  
- 🔗 [GitHub : EliasOus](https://github.com/EliasOus)

---

## 📝 Licence

Ce projet est libre d’utilisation à des fins éducatives et personnelles. Pour une utilisation commerciale, merci de contacter l’auteur.
