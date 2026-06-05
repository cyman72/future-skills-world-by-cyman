import { supabase, isSupabaseConfigured } from "../lib/supabaseClient";
import { DEFAULT_PROGRESS, DISTRICTS, MISSIONS } from "../data/seed";

const localKey = "futureskills-world-fullstack-local";

const clone = (value) => JSON.parse(JSON.stringify(value));

function normaliseProgress(row) {
  if (!row) return clone(DEFAULT_PROGRESS);
  return {
    ...clone(DEFAULT_PROGRESS),
    ...row,
    points: { ...DEFAULT_PROGRESS.points, ...(row.points || {}) },
    completed_missions: row.completed_missions || [],
    badges: row.badges || []
  };
}

function readLocal() {
  try {
    const saved = localStorage.getItem(localKey);
    if (saved) return JSON.parse(saved);
  } catch {}
  return {
    profile: { id: "local-demo-user", email: "demo@local", display_name: "Future Architect", role: "admin" },
    districts: clone(DISTRICTS),
    missions: clone(MISSIONS),
    progress: clone(DEFAULT_PROGRESS)
  };
}

function writeLocal(data) {
  localStorage.setItem(localKey, JSON.stringify(data));
}

export async function getInitialGameState(user) {
  if (!isSupabaseConfigured || user.id === "local-demo-user") {
    const local = readLocal();
    return { ...local, progress: normaliseProgress(local.progress) };
  }

  const profileResult = await supabase.from("profiles").select("*").eq("id", user.id).single();
  if (profileResult.error) throw profileResult.error;
  const profile = profileResult.data;
  const isAdmin = profile.role === "admin";

  const districtResult = await supabase.from("districts").select("*").order("sort_order");
  if (districtResult.error) throw districtResult.error;

  let missionQuery = supabase.from("missions").select("*").order("sort_order");
  if (!isAdmin) missionQuery = missionQuery.eq("is_published", true);
  const missionResult = await missionQuery;
  if (missionResult.error) throw missionResult.error;

  let progressResult = await supabase.from("user_progress").select("*").eq("user_id", user.id).maybeSingle();
  if (progressResult.error) throw progressResult.error;

  let progress = progressResult.data;
  if (!progress) {
    const insertResult = await supabase
      .from("user_progress")
      .insert({ user_id: user.id, ...DEFAULT_PROGRESS })
      .select("*")
      .single();
    if (insertResult.error) throw insertResult.error;
    progress = insertResult.data;
  }

  return {
    profile,
    districts: districtResult.data,
    missions: missionResult.data,
    progress: normaliseProgress(progress)
  };
}

export async function saveProgress(user, profile, districts, missions, progress) {
  if (!isSupabaseConfigured || user.id === "local-demo-user") {
    writeLocal({ profile, districts, missions, progress });
    return progress;
  }

  const payload = {
    user_id: user.id,
    points: progress.points,
    completed_missions: progress.completed_missions,
    badges: progress.badges,
    active_district_id: progress.active_district_id,
    selected_mission_id: progress.selected_mission_id,
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase.from("user_progress").upsert(payload, { onConflict: "user_id" }).select("*").single();
  if (error) throw error;
  return normaliseProgress(data);
}

export async function saveMission(user, profile, districts, missions, mission, progress) {
  if (!isSupabaseConfigured || user.id === "local-demo-user") {
    const nextMissions = missions.some((m) => m.id === mission.id)
      ? missions.map((m) => (m.id === mission.id ? mission : m))
      : [...missions, mission];
    writeLocal({ profile, districts, missions: nextMissions, progress });
    return mission;
  }

  if (profile?.role !== "admin") throw new Error("Only admins can save missions.");

  const { data, error } = await supabase.from("missions").upsert(mission, { onConflict: "id" }).select("*").single();
  if (error) throw error;
  return data;
}
