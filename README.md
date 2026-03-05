# MatchStone

## Stack technique

- **Vite** — Build tool & dev server
- **React 18** + **TypeScript**
- **Tailwind CSS** — Styling utilitaire
- **shadcn/ui** — Composants UI (Radix UI)
- **Framer Motion** — Animations
- **React Router DOM** — Routing client-side
- **Supabase** — Backend-as-a-Service

## Démarrage rapide

```sh
# Cloner le dépôt
git clone <URL_DU_DEPOT>
cd matchy-ui-kit

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Le site sera accessible sur **http://localhost:8080/**.

## Scripts disponibles

| Commande          | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Serveur de développement (Vite HMR)  |
| `npm run build`   | Build de production                  |
| `npm run preview` | Prévisualiser le build de production |
| `npm run lint`    | Linter ESLint                        |
| `npm run test`    | Lancer les tests (Vitest)            |

## Structure du projet

```
src/
├── components/   # Composants réutilisables (UI, layout)
├── pages/        # Pages de l'application
├── hooks/        # Hooks React custom
├── lib/          # Utilitaires et configuration
└── integrations/ # Intégrations externes (Supabase)
```
