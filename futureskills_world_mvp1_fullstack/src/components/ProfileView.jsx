const titles = ["Future Citizen","Smart Starter","Cyber Defender","Sustainable Builder","AI Explorer","Quantum Rookie","Risk Manager","Impact Builder","Systems Thinker","Future Architect"];
const pct = (v, m) => Math.max(0, Math.min(100, Math.round((Number(v || 0) / m) * 100)));

export default function ProfileView({ user, profile, progress, level }) {
  const displayName = profile?.display_name || user?.user_metadata?.display_name || "Future Architect";
  return (
    <section className="layout two-columns">
      <div className="card glass">
        <div className="avatar">🧑‍🚀</div>
        <h2 className="profile-name">{displayName}</h2>
        <p>Level {level} · {titles[level - 1]}</p>
        <div className="progress"><div className="bar" style={{width: `${pct(progress.points?.knowledge, level * 70)}%`}} /></div>
        <p>Complete more missions to grow your island and unlock advanced mixed challenges.</p>
        <div className="notice">Role: <b>{profile?.role || "player"}</b></div>
      </div>
      <div className="card glass">
        <h2>Badges</h2>
        {!progress.badges?.length ? <div className="empty-state">No badges yet. Complete your first mission to earn one.</div> : (
          <div className="badges-grid">{progress.badges.map((badge) => <div className="badge-card" key={badge}><div className="badge-icon">🏅</div><b>{badge}</b><p>Earned through applied learning.</p></div>)}</div>
        )}
      </div>
    </section>
  );
}
