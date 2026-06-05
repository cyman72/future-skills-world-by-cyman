import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";

export async function logEvent(user, eventType, payload = {}) {
  if (!isSupabaseConfigured || !user || user.id === "local-demo-user") return;

  try {
    await supabase.from("analytics_events").insert({
      user_id: user.id,
      event_type: eventType,
      event_payload: payload,
    });
  } catch {
    // Analytics must never break the learning experience.
  }
}
