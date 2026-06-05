const pct = (v, m) => Math.max(0, Math.min(100, Math.round((Number(v || 0) / m) * 100)));

export default function WorldView({ districts, missions, progress, completedSet, onSelectDistrict, onSelectMission }) {
  const completedByDistrict = (id) => missions.filter((m) => m.district_id === id && completedSet.has(m.id)).length;

  return (
    <section className="layout two-columns">
      <div className="card glass">
        <h2>Island map</h2>
        <p>Select a district, complete missions and upgrade your future society.</p>
        <div className="island">
          <div className="map-grid">
            {districts.map((d, i) => {
              const done = completedByDistrict(d.id);
              const buildingLevel = Math.min(3, done + 1);
              return (
                <button key={d.id} className={`district-tile ${d.color_class} ${i % 2 ? "offset" : ""}`} onClick={() => onSelectDistrict(d.id)}>
                  <div className="split"><div className="big-emoji">{d.emoji}</div><span className="pill">Lvl {buildingLevel}</span></div>
                  <h3>{d.short_name}</h3>
                  <div className="building">{d.buildings?.[buildingLevel - 1]}</div>
                  <div className="progress-box">
                    <div className="split tiny"><b>District progress</b><b>{done}/2</b></div>
                    <div className="progress"><div className="bar" style={{width: `${pct(done, 2)}%`}} /></div>
                  </div>
                  <p className="strong-small">Tap to enter →</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="side-grid">
        <div className="card glass">
          <h2>Daily missions</h2>
          <p>A simple daily loop creates long-term learning.</p>
          <div className="mission-list">
            {districts.map((d) => {
              const first = missions.find((m) => m.district_id === d.id && !completedSet.has(m.id)) || missions.find((m) => m.district_id === d.id);
              if (!first) return null;
              return (
                <button key={d.id} className="mission-row" onClick={() => onSelectMission(first.id)}>
                  <div className="row-left"><span className="row-emoji">{d.emoji}</span><div><b>{first.title}</b><div className="muted-small">{d.short_name} · {first.duration_minutes} min</div></div></div><b>→</b>
                </button>
              );
            })}
          </div>
        </div>
        <div className="card glass">
          <h2>Resources</h2>
          <div className="resources">
            {Object.entries(progress.points || {}).map(([k, v]) => <div className="resource" key={k}><span>{k}</span><strong>{Number(v || 0).toLocaleString()}</strong></div>)}
          </div>
        </div>
      </div>
    </section>
  );
}
