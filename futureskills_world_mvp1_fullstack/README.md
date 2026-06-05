# FutureSkills World — MVP 2 Code Upgrade

FutureSkills World is a gamified learning app where players build their own future society by mastering financial literacy, cybersecurity, AI, quantum computing and sustainability.

This MVP 2 code upgrade includes:

- onboarding flow for first-time users
- analytics event tracking into Supabase
- improved admin dashboard
- mission filters and search
- duplicate mission function
- mission preview mode
- weekly challenge section
- better badge and progress display

## Deploy on Render

Use Static Site:

```text
Build Command: npm install && npm run build
Publish Directory: dist
Root Directory: empty, unless package.json is inside a subfolder
```

Set the same environment variables in Render:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

## Supabase analytics

Run this file in Supabase SQL Editor if not already done:

```text
supabase/mvp2_analytics_foundation.sql
```

## Important

Do not upload `.env.local` to GitHub.

Onboarding completion is stored in the browser for MVP 2 to keep the upgrade compatible with your existing database schema.
