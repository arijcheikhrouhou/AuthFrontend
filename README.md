# AuthFrontend — Secure Authentication UI (Angular)

Interface Angular du module d'authentification sécurisé. Elle consomme l'API [AuthService](https://github.com/arijcheikhrouhou/AuthService) (Spring Boot, JWT, MFA/TOTP, Redis, Wazuh).

![Angular](https://img.shields.io/badge/Angular-22-DD0031) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6)

## Fonctionnalités

- **Inscription et connexion** avec gestion du JWT
- **Intercepteur HTTP** qui ajoute automatiquement le token `Authorization: Bearer` à chaque requête
- **MFA / TOTP** : activation de la double authentification (QR code) et vérification du code à la connexion
- **Guards de routes** : `authGuard` (utilisateur connecté) et `adminGuard` (rôle ADMIN)
- **Espace administrateur** : liste des utilisateurs, modification des rôles, activation ou désactivation et suppression des comptes
- **Déconnexion** avec révocation du token côté serveur

## Routes

| Route | Accès |
|---|---|
| `/login` | public |
| `/register` | public |
| `/dashboard` | utilisateur connecté |
| `/admin` | ADMIN |

## Structure

```
src/app/auth/
├── auth.ts               service d'authentification (login, signup, logout, me)
├── mfa.service.ts        configuration MFA / TOTP
├── admin.service.ts      gestion des utilisateurs
├── auth-interceptor.ts   injection du JWT
├── auth-guard.ts / admin-guard.ts
└── login/ register/ dashboard/ admin/   composants
```

## Lancer le projet

```bash
npm install
ng serve          # http://localhost:4200
```

Le back-end [AuthService](https://github.com/arijcheikhrouhou/AuthService) doit tourner sur `http://localhost:8080`.

## Auteur

**Arij Cheikhrouhou** — [GitHub](https://github.com/arijcheikhrouhou)
