# Prompt de Reproduction d'Application Web

Ce document contient toutes les informations nécessaires pour reproduire l'application web "St Loub Ping" à l'identique.

## 1. Contexte Général de l'Application

L'application est un site vitrine pour un club de tennis de table, axé sur l'information du club, les compétitions, les adhésions, et l'inscription à un tournoi.

## 2. Stack Technique

*   **Framework:** React
*   **Langage:** TypeScript
*   **Routing:** React Router DOM (Routes définies dans `src/App.tsx`)
*   **Styling:** Tailwind CSS (avec configuration personnalisée pour les couleurs du club)
*   **Composants UI:** shadcn/ui (tous les composants sont disponibles et utilisés)
*   **Gestion d'état/API:** React Query (pour la gestion des données asynchrones)
*   **Base de données/Backend:** Supabase (utilisé pour la gestion des inscriptions au tournoi).
*   **Notifications:** Sonner (pour les toasts).
*   **Fonctionnalité Spécifique:** Système de Lightbox/Modal pour l'agrandissement des images et l'affichage des vidéos YouTube.

## 3. Configuration Tailwind CSS (Couleurs du Club)

Les couleurs suivantes sont définies dans `src/globals.css` et `tailwind.config.ts` et doivent être respectées pour le thème visuel :

| Variable CSS | Description | Couleur (Light Mode) | Couleur (Dark Mode) |
| :--- | :--- | :--- | :--- |
| `--club-primary` | Rouge vif (Accents, boutons) | `0 84.2% 60.2%` | `0 84.2% 70.2%` |
| `--club-dark` | Gris très foncé/Noir (Header, Footer, Titres) | `0 0% 10%` | `0 0% 15%` |
| `--club-light` | Blanc (Fonds de page/carte) | `0 0% 100%` | `0 0% 5%` |
| `--club-section-background` | Gris très clair (Fonds de sections/cartes secondaires) | `0 0% 97%` | `0 0% 12%` |

## 4. Structure des Routes (Définies dans `src/App.tsx`)

| Chemin | Composant de Page | Description |
| :--- | :--- | :--- |
| `/` | `Accueil` | Page d'accueil avec actualités, événements et vidéos. |
| `/le-club` | `LeClub` | Informations sur l'histoire, les valeurs et les infrastructures. |
| `/competitions-equipes` | `CompetitionsEquipes` | Détails des équipes et résultats. |
| `/classement-joueurs` | `ClassementJoueurs` | Classement des joueurs du club. |
| `/adhesions` | `Adhesions` | Informations sur les licences et le planning. |
| `/boutique` | `Boutique` | Produits dérivés du club. |
| `/partenaires` | `Partenaires` | Liste des sponsors et plans de partenariat. |
| `/tournoi-inscription` | `TournamentRegistration` | Formulaire d'inscription au tournoi (utilise Supabase). |
| `/tournoi-inscriptions-liste` | `TournamentRegistrationsList` | Liste des inscriptions (page d'administration, utilise Supabase). |
| `/videos/wtt` | `WTTVideos` | Vidéos du circuit WTT. |
| `/videos/tutos` | `Tutos` | Tutoriels de tennis de table. |
| `/videos/les-legendes` | `LesLegendes` | Vidéos des joueurs légendaires. |
| `*` | `NotFound` | Page 404. |

## 5. Intégration Supabase (Tournoi)

L'application utilise Supabase pour gérer les inscriptions au tournoi.

### 5.1. Configuration Client

Le client Supabase est configuré dans `src/integrations/supabase/client.ts` en utilisant les variables d'environnement (ou les valeurs par défaut si non définies) :

*   **URL du projet:** `https://svwsqioytvvpqbxpekwm.supabase.co`
*   **Anon Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN2d3NxaW95dHZ2cHFieHBla3dtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEzMTk2MzEsImV4cCI6MjA3Njg5NTYzMX0.JTl37y_D_tr3bnPlCQyPZxOZqVzJHC79rFYYxT3ZXHg`

### 5.2. Schéma de Base de Données

La table `tournament_registrations` est essentielle pour le fonctionnement des pages `/tournoi-inscription` et `/tournoi-inscriptions-liste`.

**Table: `public.tournament_registrations`**

| Colonne | Type | Nullable | Description |
| :--- | :--- | :--- | :--- |
| `id` | `uuid` | NO | Clé primaire (générée) |
| `created_at` | `timestamp with time zone` | YES | Date d'inscription (par défaut NOW()) |
| `first_name` | `text` | NO | Prénom |
| `last_name` | `text` | NO | Nom |
| `email` | `text` | NO | Email |
| `phone` | `text` | NO | Téléphone |
| `licence_number` | `text` | NO | Numéro de licence FFTT |
| `club` | `text` | NO | Club du joueur |
| `selected_tableaux` | `text[]` (Array) | NO | Tableaux sélectionnés (ex: ['t1', 'd1']) |
| `doubles_partner` | `text` | YES | Nom du partenaire de double |
| `consent` | `boolean` | NO | Consentement aux conditions |

**Politiques RLS (Row Level Security):**

*   `SELECT`: Autorisé pour `anonymous` (`USING (true)`)
*   `INSERT`: Autorisé pour `anonymous` (`WITH CHECK (true)`)

## 6. Composants Clés et Fonctionnalités Uniques

1.  **`Navbar` / `Footer`:** Utilisation des couleurs `clubDark` et `clubPrimary` pour le branding. La navigation est responsive avec un `Sheet` pour mobile et des `DropdownMenu` pour desktop.
2.  **`HeroSection`:** Composant réutilisable pour les bannières de page, intégrant la fonction `openLightbox`.
3.  **`Lightbox` / `LightboxContext`:** Système global pour afficher des images ou des vidéos YouTube en plein écran (modal).
4.  **`VideoCard`:** Composant pour afficher les vignettes YouTube et ouvrir la vidéo dans la Lightbox.
5.  **`TournamentRegistration`:** Formulaire complexe utilisant `react-hook-form` et `zod` pour la validation, avec une logique de calcul de prix dégressif pour les tableaux.
6.  **`TournamentRegistrationsList`:** Page d'administration affichant les données Supabase et permettant l'export CSV.

## 7. Données Statiques

Les données suivantes sont codées en dur dans l'application et doivent être reproduites :

*   **`src/data/videos.ts`:** Contient la liste complète des objets `VideoItem` (WTT, Tutos, Légendes) avec leurs `youtubeId`.
*   **`src/pages/Accueil.tsx`:** Contient les listes `newsItems` et `eventItems`.
*   **`src/pages/ClassementJoueurs.tsx`:** Contient le tableau `playersRankings` (48 joueurs).
*   **`src/pages/CompetitionsEquipes.tsx`:** Contient les listes `teams`, `matchCalendar`, et `recentMatchResults`.
*   **`src/pages/LeClub.tsx`:** Contient la liste détaillée de l'équipe dirigeante (14 membres).
*   **`src/components/TrainingSchedule.tsx`:** Contient le tableau `scheduleData` pour le planning d'entraînement.

---
**Instruction pour le LLM:**

Veuillez recréer l'intégralité de l'application en respectant la structure de fichiers (pages dans `src/pages`, composants dans `src/components`), la stack technique (React/TS, Tailwind, shadcn/ui, React Router), et en intégrant les données statiques et la configuration Supabase/RLS comme spécifié. Assurez-vous que le système de Lightbox fonctionne pour toutes les images et vidéos cliquables.