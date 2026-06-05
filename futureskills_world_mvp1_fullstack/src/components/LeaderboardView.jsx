export default function LeaderboardView({ leaderboard, playerScore, playerLevel, playerBadge }) {
  const entries = [...leaderboard, { name: "You", level: playerLevel, score: playerScore, badge: playerBadge }].sort((a, b) => b.score - a.score);

  return (
    <section className="layout two-columns">
      <div className="card glass">
        <h2>Weekly leaderboard</h2>
        <p>MVP 1 uses simple asynchronous competition before adding heavier real-time gameplay.</p>
        <div className="leader-table">
          {entries.map((entry, i) => (
            <div key={entry.name} className={`leader-row ${entry.name === "You" ? "you" : ""}`}>
              <div className="rank">#{i + 1}</div>
              <div><b>{entry.name}</b><div className="muted-small">Level {entry.level} · {entry.badge}</div></div>
              <div className="score">{Number(entry.score).toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="card glass">
        <h2>Future Duel</h2>
        <p>The first multiplayer mode can be simple: two players answer five scenario questions. Quality counts more than speed.</p>
        <div className="dark-panel"><p>Coming next in MVP 1+</p><h2>Challenge another player</h2><span>Finance, Cyber, AI, Quantum and Sustainability rounds in one quick duel.</span><button className="button light muted-button">Prototype button</button></div>
      </div>
    </section>
  );
}
