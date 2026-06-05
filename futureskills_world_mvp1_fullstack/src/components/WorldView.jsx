import { WEEKLY_CHALLENGES } from "../data/challenges";

function percent(value, max) {
  return Math.max(0, Math.min(100, Math.round((Number(value || 0) / Math.max(1, Number(max || 1))) * 100)));
}

function resourceLabel(key) {
  return key.replace("_", " ");
}

export default function WorldView({ districts, missions, progress, completedSet, onSelectDistrict, onSelectMission }) {
  function completedByDistrict(districtId) {
    return missions.filter((mission) => mission.district_id === districtId && completedSet.has(mission.id)).length;
  }

  const nextMission = missions.find((mission) => !completedSet.has(mission.id)) || missions[0];

  return (
    <section className="layout two-columns">
      <div className="card glass">
        <div className="split aligned-bottom">
          <div>
            <h2>Island map</h2>
            <p>Select a district, complete missions and upgrade your future society.</p>
          </div>
          {nextMission ? <button className="button primary" onClick={() => onSelectMission(nextMission.id)}>Next mission →</button> : null}
        </div>

        <div className="island">
          <div className="map-grid">
            {districts.map((district, index) => {
              const districtMissions = missions.filter((mission) => mission.district_id === district.id);
              const completed = completedByDistrict(district.id);
              const buildingLevel = Math.min(3, completed + 1);
              const building = district.buildings?.[buildingLevel - 1] || "Starter building";

              return (
                <button key={district.id} className={`district-tile ${district.color_class} ${index % 2 ? "offset" : ""}`} onClick={() => onSelectDistrict(district.id)}>
                  <div className="split">
                    <div className="big-emoji">{district.emoji}</div>
                    <span className="pill">Lvl {buildingLevel}</span>
                  </div>
                  <h3>{district.short_name}</h3>
                  <div className="building">{building}</div>
                  <div className="progress-box">
                    <div className="split tiny">
                      <b>District progress</b>
                      <b>{completed}/{districtMissions.length}</b>
                    </div>
                    <div className="progress"><div className="bar" style={{ width: `${percent(completed, districtMissions.length)}%` }} /></div>
                  </div>
                  <p className="strong-small">Tap to enter →</p>
                </button>
              );
            })}
          </div>
        </div>

        <div className="weekly-section">
          <h2>Weekly challenges</h2>
          <p>Focused challenge weeks create return motivation and help users practise one capability at a time.</p>
          <div className="challenge-grid">
            {WEEKLY_CHALLENGES.map((challenge) => (
              <div className="weekly-card" key={challenge.id}>
                <div className="big-emoji">{challenge.emoji}</div>
                <h3>{challenge.title}</h3>
                <p>{challenge.description}</p>
                <span className="pill info">{challenge.reward}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="side-grid">
        <div className="card glass">
          <h2>Daily missions</h2>
          <p>A simple daily loop creates long-term learning.</p>
          <div className="mission-list">
            {districts.map((district) => {
              const firstMission = missions.find((mission) => mission.district_id === district.id && !completedSet.has(mission.id)) || missions.find((mission) => mission.district_id === district.id);
              if (!firstMission) return null;
              return (
                <button key={district.id} className="mission-row" onClick={() => onSelectMission(firstMission.id)}>
                  <div className="row-left">
                    <span className="row-emoji">{district.emoji}</span>
                    <div>
                      <b>{firstMission.title}</b>
                      <div className="muted-small">{district.short_name} · {firstMission.duration_minutes} min</div>
                    </div>
                  </div>
                  <b>→</b>
                </button>
              );
            })}
          </div>
        </div>

        <div className="card glass">
          <h2>Next reward</h2>
          <p>Complete your next mission to unlock a badge, more resources and stronger district progress.</p>
          {nextMission ? (
            <button className="next-reward-card" onClick={() => onSelectMission(nextMission.id)}>
              <span className="pill warn">Badge</span>
              <h3>{nextMission.badge || "New badge"}</h3>
              <p>{nextMission.title}</p>
            </button>
          ) : <div className="empty-state">All current missions completed.</div>}
        </div>

        <div className="card glass">
          <h2>Resources</h2>
          <div className="resources">
            {Object.entries(progress.points || {}).map(([key, value]) => (
              <div className="resource" key={key}>
                <span>{resourceLabel(key)}</span>
                <strong>{Number(value || 0).toLocaleString()}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
