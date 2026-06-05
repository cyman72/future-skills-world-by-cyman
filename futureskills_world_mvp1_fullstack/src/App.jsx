import { useEffect, useMemo, useState } from "react";
import { isSupabaseConfigured, supabase } from "./lib/supabaseClient";
import { DEFAULT_PROGRESS, LEADERBOARD } from "./data/seed";
import { getInitialGameState, saveMission, saveProgress } from "./services/gameService";
import { logEvent } from "./services/analyticsService";
import AuthGate from "./components/AuthGate";
import Layout from "./components/Layout";
import Onboarding from "./components/Onboarding";
import WorldView from "./components/WorldView";
import MissionsView from "./components/MissionsView";
import LeaderboardView from "./components/LeaderboardView";
import ProfileView from "./components/ProfileView";
import AdminDashboard from "./components/AdminDashboard";

const onboardingKey = "futureskills-world-onboarding-completed";
const localUser = (displayName = "Future Architect") => ({ id: "local-demo-user", email: "demo@local", user_metadata: { display_name: displayName } });
const sumPoints = (points) => Object.values(points || {}).reduce((s, v) => s + Number(v || 0), 0);
const getLevel = (knowledge) => Math.max(1, Math.min(10, Math.floor(Number(knowledge || 0) / 70) + 1));

export default function App() {
  const [authLoading, setAuthLoading] = useState(isSupabaseConfigured);
  const [gameLoading, setGameLoading] = useState(false);
  const [user, setUser] = useState(isSupabaseConfigured ? null : localUser());
  const [profile, setProfile] = useState(null);
  const [districts, setDistricts] = useState([]);
  const [missions, setMissions] = useState([]);
  const [progress, setProgress] = useState(DEFAULT_PROGRESS);
  const [answers, setAnswers] = useState({});
  const [view, setView] = useState("world");
  const [error, setError] = useState("");
  const [showOnboarding, setShowOnboarding] = useState(() => {
    try { return localStorage.getItem(onboardingKey) !== "true"; }
    catch { return true; }
  });

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setAuthLoading(false);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user || null);
      setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user || null));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    async function load() {
      setGameLoading(true);
      setError("");
      try {
        const data = await getInitialGameState(user);
        setProfile(data.profile);
        setDistricts(data.districts);
        setMissions(data.missions);
        setProgress(data.progress);
        logEvent(user, "app_opened", { mode: isSupabaseConfigured ? "supabase" : "local" });
      } catch (err) {
        setError(err.message || "Could not load game data.");
      } finally {
        setGameLoading(false);
      }
    }
    load();
  }, [user]);

  const completedSet = useMemo(() => new Set(progress.completed_missions || []), [progress.completed_missions]);
  const activeDistrict = districts.find((d) => d.id === progress.active_district_id) || districts[0];
  const selectedMission = missions.find((m) => m.id === progress.selected_mission_id) || missions[0];
  const score = sumPoints(progress.points);
  const level = getLevel(progress.points?.knowledge);
  const isAdmin = profile?.role === "admin" || user?.id === "local-demo-user";

  async function persist(nextProgress) {
    setProgress(nextProgress);
    try {
      const saved = await saveProgress(user, profile, districts, missions, nextProgress);
      setProgress(saved);
    } catch (err) {
      setError(err.message || "Could not save progress.");
    }
  }

  async function signOut() {
    if (isSupabaseConfigured && user?.id !== "local-demo-user") await supabase.auth.signOut();
    else {
      setUser(null);
      setProfile(null);
    }
  }

  function enterLocalDemo(displayName) {
    setUser(localUser(displayName));
  }

  async function completeOnboarding(preferredDistrictId) {
    try { localStorage.setItem(onboardingKey, "true"); } catch {}
    setShowOnboarding(false);
    await logEvent(user, "onboarding_completed", { preferredDistrictId });
    if (preferredDistrictId) selectDistrict(preferredDistrictId);
  }

  function restartOnboarding() {
    try { localStorage.removeItem(onboardingKey); } catch {}
    setShowOnboarding(true);
    logEvent(user, "onboarding_started", { source: "profile" });
  }

  function selectDistrict(districtId) {
    const first = missions.find((m) => m.district_id === districtId && !completedSet.has(m.id)) || missions.find((m) => m.district_id === districtId);
    persist({ ...progress, active_district_id: districtId, selected_mission_id: first?.id || progress.selected_mission_id });
    setView("missions");
  }

  function selectMission(missionId) {
    const mission = missions.find((m) => m.id === missionId);
    persist({ ...progress, active_district_id: mission?.district_id || progress.active_district_id, selected_mission_id: missionId });
    setView("missions");
    logEvent(user, "mission_started", { missionId, districtId: mission?.district_id });
  }

  function answerMission(missionId, index) {
    setAnswers((a) => ({ ...a, [missionId]: index }));
    const mission = missions.find((m) => m.id === missionId);
    logEvent(user, "mission_answered", { missionId, answerIndex: index, correct: mission?.correct_index === index });
  }

  async function completeMission(mission) {
    if (!mission || completedSet.has(mission.id)) return;
    const r = mission.rewards || {};
    const alreadyHadBadge = progress.badges?.includes(mission.badge);
    const next = {
      ...progress,
      completed_missions: [...(progress.completed_missions || []), mission.id],
      badges: alreadyHadBadge ? progress.badges : [mission.badge, ...(progress.badges || [])],
      points: {
        knowledge: Number(progress.points?.knowledge || 0) + Number(r.knowledge || 0),
        capital: Number(progress.points?.capital || 0) + Number(r.capital || 0),
        trust: Number(progress.points?.trust || 0) + Number(r.trust || 0),
        innovation: Number(progress.points?.innovation || 0) + Number(r.innovation || 0),
        impact: Number(progress.points?.impact || 0) + Number(r.impact || 0),
        resilience: Number(progress.points?.resilience || 0) + Number(r.resilience || 0),
        logic: Number(progress.points?.logic || 0) + Number(r.logic || 0)
      }
    };
    await persist(next);
    await logEvent(user, "mission_completed", { missionId: mission.id, districtId: mission.district_id, badge: mission.badge, rewards: r });
    if (!alreadyHadBadge) await logEvent(user, "badge_earned", { badge: mission.badge, missionId: mission.id });
    setView("world");
  }

  async function handleSaveMission(mission) {
    setError("");
    try {
      const saved = await saveMission(user, profile, districts, missions, mission, progress);
      setMissions((current) => current.some((m) => m.id === saved.id)
        ? current.map((m) => (m.id === saved.id ? saved : m))
        : [...current, saved].sort((a, b) => Number(a.sort_order || 0) - Number(b.sort_order || 0))
      );
      await logEvent(user, "admin_mission_saved", { missionId: saved.id, districtId: saved.district_id, published: saved.is_published });
      return saved;
    } catch (err) {
      setError(err.message || "Could not save mission.");
    }
  }

  async function handleDuplicateMission(sourceMission) {
    const duplicate = {
      ...sourceMission,
      id: `${sourceMission.id}-copy-${Date.now()}`,
      title: `${sourceMission.title} copy`,
      is_published: false,
      sort_order: Number(sourceMission.sort_order || 999) + 1,
    };
    const saved = await handleSaveMission(duplicate);
    await logEvent(user, "admin_mission_duplicated", { sourceMissionId: sourceMission.id, newMissionId: duplicate.id });
    return saved || duplicate;
  }

  if (authLoading) return <div className="center-screen">Loading authentication…</div>;
  if (!user) return <AuthGate onLocalDemo={enterLocalDemo} />;
  if (gameLoading || !activeDistrict || !selectedMission) return <div className="center-screen">Loading FutureSkills World…</div>;
  if (showOnboarding) return <Onboarding districts={districts} onComplete={completeOnboarding} onSkip={() => completeOnboarding()} />;

  const screens = {
    world: <WorldView districts={districts} missions={missions} progress={progress} completedSet={completedSet} onSelectDistrict={selectDistrict} onSelectMission={selectMission} />,
    missions: <MissionsView districts={districts} missions={missions} activeDistrict={activeDistrict} selectedMission={selectedMission} answers={answers} completedSet={completedSet} onSelectDistrict={selectDistrict} onSelectMission={selectMission} onAnswer={answerMission} onComplete={completeMission} />,
    leaderboard: <LeaderboardView leaderboard={LEADERBOARD} playerScore={score} playerLevel={level} playerBadge={progress.badges?.[0] || "New Architect"} />,
    profile: <ProfileView user={user} profile={profile} progress={progress} level={level} onRestartOnboarding={restartOnboarding} />,
    admin: isAdmin ? <AdminDashboard districts={districts} missions={missions} onSaveMission={handleSaveMission} onDuplicateMission={handleDuplicateMission} /> : null
  };

  return (
    <Layout user={user} profile={profile} progress={progress} level={level} score={score} view={view} setView={setView} onSignOut={signOut} isAdmin={isAdmin} mode={isSupabaseConfigured ? "Supabase" : "Local demo"} error={error}>
      {screens[view] || screens.world}
    </Layout>
  );
}
