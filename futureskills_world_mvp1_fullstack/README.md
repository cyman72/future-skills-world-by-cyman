# FutureSkills World — MVP 1 Full-Stack Starter

**FutureSkills World is a gamified learning app where players build their own future society by mastering financial literacy, cybersecurity, AI, quantum computing and sustainability. It turns future skills into daily missions, social challenges and long-term progress — making learning continuous, practical and motivating.**

This is the next development step after the static HTML MVP.

## Included

- Vite + React app
- Cleaner project structure with separate files
- Supabase authentication
- Supabase database persistence
- Local demo mode when Supabase is not configured
- Player progress persistence
- Admin dashboard for content management
- Five learning districts:
  - Finance
  - Cybersecurity
  - AI
  - Quantum
  - Sustainability

## Run locally in demo mode

```bash
npm install
npm run dev
```

This works even without Supabase. Progress and admin content are saved in localStorage.

## Connect Supabase

1. Create a Supabase project.
2. Open the Supabase SQL editor.
3. Run `supabase/schema.sql`.
4. Copy `.env.example` to `.env.local`.
5. Add your Supabase project URL and anon key.
6. Restart the dev server.

```bash
npm run dev
```

7. Register a user in the app.
8. Make the user an admin:

```sql
update public.profiles
set role = 'admin'
where email = 'your-email@example.com';
```

## Structure

```text
src/
  components/
    AdminDashboard.jsx
    AuthGate.jsx
    Layout.jsx
    LeaderboardView.jsx
    MissionsView.jsx
    ProfileView.jsx
    WorldView.jsx
  data/
    seed.js
  lib/
    supabaseClient.js
  services/
    gameService.js
  App.jsx
  main.jsx
  styles.css
supabase/
  schema.sql
docs/
  architecture.md
```

## Suggested next product steps

1. Add React Router.
2. Add institutional spaces for schools, banks, associations and companies.
3. Add real multiplayer duels.
4. Add analytics and learning outcome tracking.
5. Add content review workflow.
6. Add AI tutor connected only to approved content.
