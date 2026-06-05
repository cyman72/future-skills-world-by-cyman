import { useEffect, useMemo, useState } from "react";
import { isSupabaseConfigured, supabase } from "./lib/supabaseClient";
import { DEFAULT_PROGRESS, LEADERBOARD } from "./data/seed";
import { getInitialGameState, saveMission, saveProgress } from "./services/gameService";
import AuthGate from "./components/AuthGate";
import Layout from "./components/Layout";
import WorldView from "./components/WorldView";
import MissionsView from "./components/MissionsView";
import LeaderboardView from "./components/LeaderboardView";
import ProfileView from "./components/ProfileView";
import AdminDashboard from "./components/AdminDashboard";

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

  function selectDistrict(districtId) {
    const first = missions.find((m) => m.district_id === districtId && !completedSet.has(m.id)) || missions.find((m) => m.district_id === districtId);
    persist({ ...progress, active_district_id: districtId, selected_mission_id: first?.id || progress.selected_mission_id });
    setView("missions");
  }

  function selectMission(missionId) {
    const mission = missions.find((m) => m.id === missionId);
    persist({ ...progress, active_district_id: mission?.district_id || progress.active_district_id, selected_mission_id: missionId });
    setView("missions");
  }

  function answerMission(missionId, index) {
    setAnswers((a) => ({ ...a, [missionId]: index }));
  }

  async function completeMission(mission) {
    if (!mission || completedSet.has(mission.id)) return;
    const r = mission.rewards || {};
    const next = {
      ...progress,
      completed_missions: [...(progress.completed_missions || []), mission.id],
      badges: progress.badges?.includes(mission.badge) ? progress.badges : [mission.badge, ...(progress.badges || [])],
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
    } catch (err) {
      setError(err.message || "Could not save mission.");
    }
  }

  if (authLoading) return <div className="center-screen">Loading authentication…</div>;
  if (!user) return <AuthGate onLocalDemo={enterLocalDemo} />;
  if (gameLoading || !activeDistrict || !selectedMission) return <div className="center-screen">Loading FutureSkills World…</div>;

  const screens = {
    world: <WorldView districts={districts} missions={missions} progress={progress} completedSet={completedSet} onSelectDistrict={selectDistrict} onSelectMission={selectMission} />,
    missions: <MissionsView districts={districts} missions={missions} activeDistrict={activeDistrict} selectedMission={selectedMission} answers={answers} completedSet={completedSet} onSelectDistrict={selectDistrict} onSelectMission={selectMission} onAnswer={answerMission} onComplete={completeMission} />,
    leaderboard: <LeaderboardView leaderboard={LEADERBOARD} playerScore={score} playerLevel={level} playerBadge={progress.badges?.[0] || "New Architect"} />,
    profile: <ProfileView user={user} profile={profile} progress={progress} level={level} />,
    admin: isAdmin ? <AdminDashboard districts={districts} missions={missions} onSaveMission={handleSaveMission} /> : null
  };

  return (
    <Layout user={user} profile={profile} progress={progress} level={level} score={score} view={view} setView={setView} onSignOut={signOut} isAdmin={isAdmin} mode={isSupabaseConfigured ? "Supabase" : "Local demo"} error={error}>
      {screens[view] || screens.world}
    </Layout>
  );
}
