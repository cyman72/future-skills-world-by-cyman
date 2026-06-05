# FutureSkills World — MVP 1 Architecture

## Product idea

Players build a Future Island by completing short missions across five learning districts: finance, cyber, AI, quantum and sustainability.

Each mission has:

1. Story context
2. Learning nugget
3. Decision challenge
4. Feedback
5. Reward

## Frontend

- Vite
- React
- CSS design system
- Component structure

## Backend

Supabase provides:

- user registration,
- authentication,
- Postgres persistence,
- row-level security,
- mission content storage,
- player progress storage.

## MVP entities

- `profiles`
- `districts`
- `missions`
- `user_progress`

## Admin

A user is an admin when `profiles.role = 'admin'`.

Admins can create and edit missions.
