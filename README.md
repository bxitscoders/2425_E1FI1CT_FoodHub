# FoodHub 🍽️

Eine Plattform zum Bewerten und Teilen von Kantinen-Essen.

## Projektbeschreibung

FoodHub ermöglicht es Nutzern, Bilder von Kantinen-Gerichten hochzuladen, diese zu bewerten und mit Tags zu versehen. Andere Nutzer können die Beiträge bewerten und kommentieren. Die Plattform richtet sich an Studierende und Mitarbeiter, die ihre Erfahrungen mit dem Essen in Mensen und Kantinen teilen möchten.

**Hauptfunktionen:**
- Bilder von Gerichten hochladen
- Bewertungssystem mit Sternen
- Tag-System für Kategorisierung (vegetarisch, vegan, etc.)
- Kommentarfunktion
- Nutzerprofile

## Tech Stack

**Backend:**
- ASP.NET Core (C#)
- Entity Framework Core
- JWT Authentication

**Frontend:**
- SvelteKit
- TypeScript
- Vite
- Bun (Package Manager)

**Development:**
- Docker Support
- Swagger/OpenAPI Documentation

## Development Aufsetzen
1. `.env.example` kopieren und `.env` benennen.
2. https://github.com/settings/developers oauth application erstellen und client id und secret eintragen in der `.env`
2. `npm install` ausführen.
3. `docker compose up -d` um Datenbanken zu starten, danach `npm run db:migrate`.
4. Projekt mit `npm run dev` starten und dann sollte es auf localhost:5173 laufen