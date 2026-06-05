const LEVEL_TITLES = [
  "Future Citizen",
  "Smart Starter",
  "Cyber Defender",
  "Sustainable Builder",
  "AI Explorer",
  "Quantum Rookie",
  "Risk Manager",
  "Impact Builder",
  "Systems Thinker",
  "Future Architect",
];

function levelTitle(level) {
  return LEVEL_TITLES[level - 1] || "Future Architect";
}

function percent(value, max) {
  return Math.max(0, Math.min(100, Math.round((Number(value || 0) / max) * 100)));
}

export default function ProfileView({ user, profile, progress, level, onRestartOnboarding }) {
  const displayName = profile?.display_name || user?.user_metadata?.display_name || "Future Architect";
  const totalScore = Object.values(progress.points || {}).reduce((sum, value) => sum + Number(value || 0), 0);

  return (
    <section className="layout two-columns">
      <div className="card glass">
        <div className="avatar">🧑‍🚀</div>
        <h2 className="profile-name">{displayName}</h2>
        <p>Level {level} · {levelTitle(level)}</p>
        <div className="progress"><div className="bar" style={{ width: `${percent(progress.points?.knowledge, level * 70)}%` }} /></div>
        <p>Complete more missions to grow your island and unlock advanced mixed challenges.</p>

        <div className="profile-stats">
          <div className="resource"><span>Total score</span><strong>{totalScore.toLocaleString()}</strong></div>
          <div className="resource"><span>Missions completed</span><strong>{progress.completed_missions?.length || 0}</strong></div>
          <div className="resource"><span>Badges earned</span><strong>{progress.badges?.length || 0}</strong></div>
        </div>

        <div className="notice">Role: <b>{profile?.role || "player"}</b></div>
        <button className="button secondary full" onClick={onRestartOnboarding}>Restart onboarding</button>
      </div>

      <div className="card glass">
        <h2>Badge wall</h2>
        {!progress.badges?.length ? (
          <div className="empty-state">No badges yet. Complete your first mission to earn one.</div>
        ) : (
          <div className="badges-grid">
            {progress.badges.map((badge) => (
              <div className="badge-card" key={badge}>
                <div className="badge-icon">🏅</div>
                <b>{badge}</b>
                <p>Earned through applied learning.</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
