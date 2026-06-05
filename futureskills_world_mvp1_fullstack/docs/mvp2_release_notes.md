# MVP 2 Code Upgrade

This upgrade adds:

- guided onboarding flow
- analytics event tracking
- improved admin dashboard with filters, search, duplicate and preview
- weekly challenge section
- next reward preview
- badge wall and profile stats

## Events tracked

- app_opened
- onboarding_started
- onboarding_completed
- mission_started
- mission_answered
- mission_completed
- badge_earned
- admin_mission_saved
- admin_mission_duplicated

Analytics errors are ignored by design so the app still works even if the analytics table has not yet been created.
