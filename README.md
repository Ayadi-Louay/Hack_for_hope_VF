# 🛡️ SOS Villages d'Enfants - Système de Signalement d'Incidents

## 📋 Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture du projet](#architecture-du-projet)
3. [Composants principaux](#composants-principaux)
4. [Installation et configuration](#installation-et-configuration)
5. [Utilisation](#utilisation)
6. [Fonctionnalités détaillées](#fonctionnalités-détaillées)
7. [Technologies utilisées](#technologies-utilisées)
8. [Structure des données](#structure-des-données)
9. [Déploiement](#déploiement)
10. [Contribution](#contribution)

---

## 🎯 Vue d'ensemble

### Contexte
Application développée pour **SOS Villages d'Enfants** dans le cadre d'un hackathon. Le système permet de signaler et suivre les incidents concernant la protection des enfants en Tunisie.

### Objectifs
- ✅ Faciliter le signalement d'incidents (anonyme ou identifié)
- ✅ Permettre aux tuteurs de suivre l'évolution des dossiers
- ✅ Assurer la confidentialité et la sécurité des données
- ✅ Fournir une interface rassurante et accessible sur mobile

### Public cible
1. **Déclarants** : Personnes signalant un incident (employés, famille, témoins)
2. **Tuteurs/Famille** : Parents ou tuteurs légaux suivant les dossiers
3. **Équipe SOS** : Assistantes sociales, psychologues, coordinateurs

---

## 🏗️ Architecture du projet

```
sos-villages/
│
├── src/
│   ├── components/
│   │   ├── IncidentReportingPlatform.jsx    # Formulaire de signalement
│   │   └── GuardianDashboard.jsx            # Tableau de bord tuteur
│   │
│   ├── App.jsx                               # Composant principal
│   └── index.js                              # Point d'entrée
│
├── public/
│   └── index.html
│
├── package.json
└── README.md
```

---

## 🧩 Composants principaux

### 1. `IncidentReportingPlatform.jsx`
**Formulaire de déclaration d'incident**

#### Fonctionnalités clés :
- 📝 **Signalement anonyme** (toggle on/off)
- 🎤 **Dictée vocale en temps réel** (multilingue : français, arabe, tunisien)
- 📊 **Détection automatique du niveau d'urgence** par IA
- 📎 **Upload de fichiers** (images, audio, vidéo)
- 🎙️ **Transcription audio automatique**
- 🔐 **Authentification conditionnelle** (si non-anonyme)

#### Champs du formulaire :
| Champ | Type | Obligatoire | Description |
|-------|------|-------------|-------------|
| Signalement anonyme | Toggle | Non | Active/désactive l'anonymat |
| Programme/Village | Select | Non | Sélection du lieu |
| Nom de l'enfant | Text | Non* | *Seulement si non-anonyme |
| Personne signalée | Text | Non | Nom de la personne concernée |
| Type d'incident | Buttons | Non | Santé, Comportement, Violence, Maltraitance, Autre |
| **Description** | Textarea | **OUI** | Min. 20 caractères, avec dictée vocale |
| Image | File | Non | JPG, PNG, GIF |
| Audio | File | Non | MP3, WAV avec transcription auto |
| Vidéo | File | Non | MP4, AVI |

#### Niveaux d'urgence (détection IA) :
1. 🟢 **Faible** : Situation standard
2. 🟡 **Moyen** : Nécessite attention
3. 🟠 **Élevé** : Intervention rapide requise
4. 🔴 **Critique** : Danger immédiat

**Algorithme de détection :**
```javascript
// Mots-clés critiques
- "danger immédiat", "urgence", "viol", "mort", "arme"...
→ Niveau : CRITIQUE

// Mots-clés élevés
- "violence", "maltraitance", "blessure", "sang"...
→ Niveau : ÉLEVÉ

// Mots-clés moyens
- "comportement inquiétant", "peur", "anxiété"...
→ Niveau : MOYEN

// Par défaut
→ Niveau : FAIBLE
```

#### Authentification :
- **Si anonyme** : Aucune connexion requise
- **Si non-anonyme** : Modal de connexion obligatoire
  - Email + Mot de passe
  - Validation avant soumission

---

### 2. `GuardianDashboard.jsx`
**Tableau de bord pour les tuteurs/famille**

#### Vue d'ensemble :
Interface permettant aux tuteurs de suivre l'évolution des signalements concernant les enfants dont ils ont la charge.

#### Sections :

##### 📌 Header
- Logo SOS Villages d'Enfants
- Titre "Espace Famille"
- Icône de notifications (avec badge de compteur)

##### 👋 Message de bienvenue
- Personnalisé avec le nom du tuteur
- Compteur de signalements actifs
- Design rassurant avec icône cœur

##### 📊 Cartes de signalement (liste)
Chaque signalement affiche :

**En-tête :**
- Nom de l'enfant
- Numéro de dossier (format : `2024-TN-XXXX`)
- Date de création

**Ligne de statut** (4 états possibles) :
| État | Icône | Couleur | Description |
|------|-------|---------|-------------|
| En attente | 🕐 | Bleu clair | Dossier reçu, pas encore ouvert |
| En cours | ▶️ | Bleu moyen | Équipe travaille activement |
| Fausse alerte | ❌ | Bleu foncé | Vérifié, tout va bien |
| Terminé | 🛡️ | Bleu très foncé | Intervention terminée |

**Messages :**
- Liste des communications de l'équipe
- Affichage de l'auteur (assistante sociale, psychologue...)
- Badge "Nouveau" pour les messages non lus
- Date et heure

##### 🛡️ Footer
- Message de confidentialité
- Icône de sécurité

#### Palette de couleurs :
- **Fond** : Gradient bleu clair → blanc
- **Header** : Bleu foncé (`#2563EB`)
- **Cartes** : Blanc avec bordures bleues
- **Accents** : Différentes nuances de bleu

---

## 🚀 Installation et configuration

### Prérequis
```bash
Node.js >= 16.x
npm >= 8.x
```

### Installation

1. **Cloner le repository**
```bash
git clone https://github.com/votre-org/sos-villages.git
cd sos-villages
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Dépendances principales**
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.294.0"
  },
  "devDependencies": {
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

4. **Configuration Tailwind CSS**

Créer `tailwind.config.js` :
```javascript
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'sos-blue': {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        }
      }
    },
  },
  plugins: [],
}
```

5. **Lancer en développement**
```bash
npm start
```

L'application sera accessible sur `http://localhost:3000`

---

## 📱 Utilisation

### Scénario 1 : Créer un signalement anonyme

1. Accéder au formulaire de signalement
2. Cocher "Signalement Anonyme"
3. Remplir la description (min. 20 caractères)
   - Option : Utiliser le bouton "Dicter" pour la saisie vocale
4. (Optionnel) Ajouter des pièces jointes
5. Cliquer sur "Soumettre le Signalement"
6. Message de confirmation s'affiche

### Scénario 2 : Créer un signalement identifié

1. Accéder au formulaire de signalement
2. **Ne pas** cocher "Signalement Anonyme"
3. Cliquer sur "Se connecter" dans la sidebar
4. Entrer email et mot de passe
5. Remplir les champs (nom de l'enfant devient visible)
6. Remplir la description
7. Soumettre le signalement

### Scénario 3 : Utiliser la dictée vocale

1. Dans le champ "Description", cliquer sur "Dicter"
2. Autoriser l'accès au microphone (si demandé)
3. Parler clairement en français, arabe ou tunisien
4. Le texte s'affiche en temps réel
5. Cliquer sur "Arrêter" pour terminer
6. Le texte peut être édité manuellement après

### Scénario 4 : Suivre un dossier (Tuteur)

1. Se connecter à l'Espace Famille
2. Voir la liste des signalements
3. Chaque carte affiche :
   - L'état actuel (En attente, En cours, Fausse alerte, Terminé)
   - Les messages de l'équipe
4. Consulter les messages pour les mises à jour

---

## ⚙️ Fonctionnalités détaillées

### 🎤 Reconnaissance vocale

**Technologies :**
- API Web Speech Recognition (navigateur)
- Support multilingue : `ar-TN` (tunisien), `fr-FR`, `ar-SA`

**Configuration :**
```javascript
const recognition = new SpeechRecognition();
recognition.continuous = true;      // Continue d'écouter
recognition.interimResults = true;  // Résultats en temps réel
recognition.lang = 'ar-TN';        // Langue tunisienne
```

**Limitations :**
- Nécessite Chrome, Edge ou Safari
- Firefox non supporté (API non implémentée)

**Pour production :**
Remplacer par une API backend :
- Google Cloud Speech-to-Text
- Azure Speech Services
- Whisper API (OpenAI)

### 🤖 Détection d'urgence par IA

**Méthode :**
Analyse sémantique du texte de description avec algorithme de scoring.

**Critères :**
1. Mots-clés critiques (poids : 3)
2. Mots-clés élevés (poids : 2)
3. Mots-clés moyens (poids : 1)
4. Patterns linguistiques (exclamations, majuscules, mots urgents)

**Seuils de classification :**
```
Score >= 3 → CRITIQUE
Score >= 2 → ÉLEVÉ
Score >= 1 → MOYEN
Score < 1  → FAIBLE
```

### 🎙️ Transcription audio

**Fonctionnement :**
1. Upload d'un fichier audio (MP3, WAV, M4A)
2. Envoi vers API de transcription
3. Analyse multilingue
4. Affichage du texte transcrit
5. Option de copie vers la description

**API recommandées :**
```javascript
// Exemple avec API externe
const formData = new FormData();
formData.append('audio', audioFile);
formData.append('language', 'ar-TN');

const response = await fetch('API_ENDPOINT', {
  method: 'POST',
  body: formData
});

const { transcription } = await response.json();
```

### 🔐 Authentification

**Système actuel :**
- Simulation côté client (démo)
- Modal de connexion
- Stockage en state React

**Pour production :**
```javascript
// Intégration backend
const handleLogin = async (credentials) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  
  const { token, user } = await response.json();
  
  // Stocker le token (localStorage ou cookie sécurisé)
  localStorage.setItem('authToken', token);
  setUserInfo(user);
};
```

**Sécurité recommandée :**
- JWT (JSON Web Tokens)
- HTTPS obligatoire
- Refresh tokens
- Rate limiting
- Protection CSRF

---

## 🛠️ Technologies utilisées

### Frontend
| Technologie | Version | Usage |
|-------------|---------|-------|
| React | 18.2.0 | Framework UI |
| Tailwind CSS | 3.4.0 | Styling |
| Lucide React | 0.294.0 | Icônes |
| Web Speech API | - | Reconnaissance vocale |

### Bibliothèques recommandées pour production

**Upload de fichiers :**
```bash
npm install react-dropzone
```

**Gestion d'état :**
```bash
npm install zustand
# ou
npm install @reduxjs/toolkit react-redux
```

**Requêtes API :**
```bash
npm install axios
# ou
npm install @tanstack/react-query
```

**Validation de formulaires :**
```bash
npm install react-hook-form zod
```

**Notifications :**
```bash
npm install react-hot-toast
```

---

## 📊 Structure des données

### Modèle de signalement

```typescript
interface Report {
  id: string;                    // UUID
  fileNumber: string;            // Format: "2024-TN-XXXX"
  isAnonymous: boolean;
  
  // Données du déclarant
  reporterInfo?: {
    name: string;
    email: string;
    userId: string;
  };
  
  // Informations incident
  program?: string;              // Village/Programme
  childName?: string;
  reportedPersonName?: string;
  incidentType?: 'sante' | 'comportement' | 'violence' | 'maltraitance' | 'autre';
  
  description: string;           // Obligatoire, min 20 chars
  urgencyLevel: 'faible' | 'moyen' | 'eleve' | 'critique';
  
  // Statut
  status: 'en-attente' | 'en-cours' | 'fausse-alerte' | 'termine';
  
  // Fichiers
  attachments: Array<{
    id: string;
    type: 'image' | 'audio' | 'video';
    url: string;
    filename: string;
    size: number;
  }>;
  
  audioTranscription?: string;
  
  // Métadonnées
  createdAt: Date;
  updatedAt: Date;
  assignedTo?: string[];         // IDs des membres d'équipe
}
```

### Modèle de message

```typescript
interface Message {
  id: string;
  reportId: string;              // Référence au signalement
  author: string;
  authorRole: string;            // 'Assistante sociale', 'Psychologue', etc.
  message: string;
  date: Date;
  isRead: boolean;
}
```

### Modèle utilisateur

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: 'declarant' | 'tuteur' | 'equipe';
  organization?: string;
  childrenIds?: string[];        // Pour les tuteurs
  createdAt: Date;
}
```

---

## 🚀 Déploiement

### Option 1 : Vercel (Recommandé)

1. **Créer un compte Vercel**
2. **Connecter le repository GitHub**
3. **Configurer le projet :**
```bash
Framework Preset: Create React App
Build Command: npm run build
Output Directory: build
```
4. **Déployer**

### Option 2 : Netlify

1. **Build local**
```bash
npm run build
```

2. **Déployer**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=build
```

### Option 3 : Serveur personnel

1. **Build**
```bash
npm run build
```

2. **Servir avec nginx**
```nginx
server {
    listen 80;
    server_name votre-domaine.com;
    
    root /var/www/sos-villages/build;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Variables d'environnement

Créer `.env` :
```bash
REACT_APP_API_URL=https://api.sos-villages.org
REACT_APP_TRANSCRIPTION_API_KEY=votre_cle
REACT_APP_ENV=production
```

---

## 🔒 Sécurité et conformité

### RGPD / Protection des données

**Mesures implémentées :**
- ✅ Option de signalement anonyme
- ✅ Cryptage des données (mentionné dans l'UI)
- ✅ Accès restreint (authentification)
- ✅ Traçabilité complète

**À implémenter en production :**
- [ ] Cryptage AES-256 côté serveur
- [ ] Authentification à deux facteurs (2FA)
- [ ] Audit logs
- [ ] Politique de rétention des données
- [ ] Droit à l'oubli (suppression des données)
- [ ] Consentement explicite

### Recommandations de sécurité

```javascript
// 1. Sanitization des inputs
import DOMPurify from 'dompurify';
const cleanDescription = DOMPurify.sanitize(userInput);

// 2. Rate limiting
// Limiter les soumissions à 5 par heure

// 3. Validation côté serveur
// Ne jamais faire confiance aux données client

// 4. Protection XSS
// React protège automatiquement, mais attention aux dangerouslySetInnerHTML

// 5. HTTPS obligatoire
// Toutes les communications doivent être chiffrées
```

---

## 🧪 Tests

### Tests unitaires (à implémenter)

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

```javascript
// IncidentReportingPlatform.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import IncidentReportingPlatform from './IncidentReportingPlatform';

test('affiche erreur si description < 20 caractères', () => {
  render(<IncidentReportingPlatform />);
  
  const textarea = screen.getByPlaceholderText(/Décrivez l'incident/);
  fireEvent.change(textarea, { target: { value: 'Court' } });
  
  const submitButton = screen.getByText(/Soumettre/);
  fireEvent.click(submitButton);
  
  expect(screen.getByText(/au moins 20 caractères/)).toBeInTheDocument();
});
```

### Tests E2E (à implémenter)

```bash
npm install --save-dev cypress
```

```javascript
// cypress/e2e/report-flow.cy.js
describe('Flux de signalement complet', () => {
  it('permet de créer un signalement anonyme', () => {
    cy.visit('/');
    cy.get('[data-cy=anonymous-toggle]').click();
    cy.get('[data-cy=description]').type('Ceci est une description de test avec plus de 20 caractères');
    cy.get('[data-cy=submit-button]').click();
    cy.get('[data-cy=success-message]').should('be.visible');
  });
});
```

---

## 📈 Améliorations futures

### Court terme
- [ ] Intégration API backend
- [ ] Base de données (PostgreSQL)
- [ ] Upload réel de fichiers (AWS S3 / Cloudinary)
- [ ] Notifications push
- [ ] Export PDF des signalements

### Moyen terme
- [ ] Application mobile (React Native)
- [ ] Tableau de bord admin
- [ ] Statistiques et rapports
- [ ] Chat en temps réel (Socket.io)
- [ ] Système de tickets

### Long terme
- [ ] IA pour détection automatique de patterns
- [ ] Analyse prédictive
- [ ] Intégration avec services sociaux gouvernementaux
- [ ] Multilangue complet (interface)
- [ ] Accessibilité WCAG 2.1 AA

---

## 🤝 Contribution

### Comment contribuer

1. **Fork le projet**
2. **Créer une branche**
```bash
git checkout -b feature/ma-fonctionnalite
```

3. **Commiter les changements**
```bash
git commit -m "Ajout de ma fonctionnalité"
```

4. **Pousser vers la branche**
```bash
git push origin feature/ma-fonctionnalite
```

5. **Ouvrir une Pull Request**

### Standards de code

- **ESLint** : Respecter les règles définies
- **Prettier** : Formater le code
- **Commits** : Messages clairs en français
- **Tests** : Ajouter des tests pour les nouvelles fonctionnalités

### Structure des commits

```
type(scope): description courte

Description détaillée si nécessaire

Fixes #123
```

Types : `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

---

## 📞 Support et contact

### Équipe de développement
- **Email** : dev@sos-villages-tn.org
- **Slack** : #hackathon-sos-villages

### Signaler un bug
Ouvrir une issue GitHub avec :
- Description du problème
- Steps to reproduce
- Comportement attendu vs obtenu
- Screenshots si applicable
- Environnement (navigateur, OS)

### Documentation supplémentaire
- [SOS Villages d'Enfants - Site officiel](https://www.sos-villages-enfants.org)
- [Politique de confidentialité](lien)
- [Guide utilisateur](lien)

---

## 📄 Licence

Ce projet est développé pour **SOS Villages d'Enfants Tunisie**.

© 2024 SOS Villages d'Enfants. Tous droits réservés.

---

## 🙏 Remerciements

- **SOS Villages d'Enfants Tunisie** pour l'opportunité
- **Équipe du hackathon** pour leur collaboration
- **Communauté React** pour les ressources
- **Lucide** pour les icônes
- **Tailwind CSS** pour le framework de styling

---

## 📝 Changelog

### Version 1.0.0 (Février 2024)
- ✨ Formulaire de signalement avec dictée vocale
- ✨ Détection automatique d'urgence par IA
- ✨ Tableau de bord tuteur
- ✨ Upload de fichiers (image, audio, vidéo)
- ✨ Transcription audio
- ✨ Authentification conditionnelle
- ✨ Design responsive mobile-first
- ✨ Palette de couleurs bleu/blanc

---

**Développé avec ❤️ pour la protection des enfants**
