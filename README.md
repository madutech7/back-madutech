# 🚀 MADU_TECH Backend API

Backend Node.js pour la gestion des emails de contact du site MADU_TECH.

## 📋 Prérequis

- Node.js (v14 ou supérieur)
- npm ou yarn
- Un compte Gmail avec un mot de passe d'application

## 🔧 Installation

1. **Installer les dépendances** :

```bash
cd backend
npm install
```

2. **Configurer les variables d'environnement** :
   - Copier `.env.example` vers `.env`
   - Remplir les informations dans `.env`

```bash
cp .env.example .env
```

3. **Éditer le fichier `.env`** avec vos informations :

```env
EMAIL_USER=votre-email@gmail.com
EMAIL_APP_PASSWORD=votre-mot-de-passe-application
PORT=3000
FRONTEND_URL=http://localhost:4200
```

## ▶️ Démarrage

### Mode production :

```bash
npm start
```

### Mode développement (avec rechargement automatique) :

```bash
npm run dev
```

Le serveur démarre sur `http://localhost:3000`

## 📡 API Endpoints

### `GET /`

Page d'accueil de l'API

- **Réponse** : Informations sur l'API

### `GET /health`

Vérification de l'état du serveur

- **Réponse** : Status, uptime, timestamp

### `POST /api/contact`

Envoi d'un email de contact

**Body (JSON)** :

```json
{
  "name": "Jean Dupont",
  "email": "jean@exemple.com",
  "budget": "vitrine",
  "message": "Bonjour, je souhaite créer un site web..."
}
```

**Réponse succès** :

```json
{
  "success": true,
  "message": "Votre message a bien été envoyé ! Nous vous répondrons sous 24h."
}
```

**Réponse erreur** :

```json
{
  "success": false,
  "message": "Une erreur est survenue..."
}
```

## 🔐 Sécurité

⚠️ **IMPORTANT** :

- Le fichier `.env` contient des informations sensibles
- Ne JAMAIS commiter le fichier `.env` dans Git
- Utiliser `.env.example` pour la documentation

## 📧 Configuration Gmail

Pour obtenir un mot de passe d'application Gmail :

1. Allez sur votre compte Google
2. Sécurité → Validation en deux étapes (activez-la si ce n'est pas fait)
3. Sécurité → Mots de passe des applications
4. Générez un nouveau mot de passe pour "Mail"
5. Copiez ce mot de passe dans votre fichier `.env`

## 🛠️ Technologies

- **Express** - Framework web
- **Nodemailer** - Envoi d'emails
- **CORS** - Gestion des requêtes cross-origin
- **dotenv** - Gestion des variables d'environnement
- **body-parser** - Parsing des requêtes HTTP

## 📝 Logs

Le serveur affiche des logs détaillés :

- ✅ Succès (envoi d'email réussi)
- ❌ Erreurs (problèmes de configuration ou d'envoi)
- 📧 Informations sur les emails envoyés

## 🐛 Debugging

Si les emails ne s'envoient pas :

1. Vérifier que le mot de passe d'application est correct
2. Vérifier que la validation en deux étapes est activée sur Gmail
3. Vérifier les logs du serveur pour les messages d'erreur
4. Tester la route `/health` pour vérifier que le serveur fonctionne

## 📞 Support

Pour toute question, contactez : madutech0@gmail.com
