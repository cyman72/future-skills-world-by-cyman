import { POSITIONING } from "../data/seed";

const titles = ["Future Citizen","Smart Starter","Cyber Defender","Sustainable Builder","AI Explorer","Quantum Rookie","Risk Manager","Impact Builder","Systems Thinker","Future Architect"];
const pct = (v, m) => Math.max(0, Math.min(100, Math.round((Number(v || 0) / m) * 100)));

export default function Layout({ user, profile, progress, level, score, view, setView, onSignOut, isAdmin, mode, error, children }) {
  const displayName = profile?.display_name || user?.user_metadata?.display_name || user?.email || "Future Architect";
  const nav = [["world","🌍 World"],["missions","🎯 Missions"],["leaderboard","🏆 Leaderboard"],["profile","👤 Profile"]];
  if (isAdmin) nav.push(["admin","🛠️ Admin"]);

  return (
    <main className="app-shell">
      <header className="topbar card glass">
        <div>
          <span className="pill dark">FutureSkills World</span>
          <span className="pill info">{titles[level - 1]}</span>
          <span className="pill">Level {level}</span>
          <span className="pill">{mode}</span>
          <h1>Your Future Island</h1>
          <p className="positioning">{POSITIONING}</p>
        </div>
        <div className="score-panel">
          <div className="split"><span>Next level</span><b>{progress.points?.knowledge || 0}/{level * 70} KP</b></div>
          <div className="progress"><div className="bar cyan" style={{width: `${pct(progress.points?.knowledge, level * 70)}%`}} /></div>
          <div className="meta">{displayName} · Total score: <b>{score.toLocaleString()}</b></div>
          <button className="button light full" onClick={onSignOut}>Sign out</button>
        </div>
      </header>

      {error ? <div className="error-box">{error}</div> : null}

      <nav className="nav">
        {nav.map(([id, label]) => <button key={id} className={view === id ? "active" : ""} onClick={() => setView(id)}>{label}</button>)}
      </nav>

      {children}
    </main>
  );
}
