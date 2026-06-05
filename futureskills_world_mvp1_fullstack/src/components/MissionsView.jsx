const rewards = (r) => Object.entries(r || {}).filter(([, v]) => Number(v) > 0);

export default function MissionsView({ districts, missions, activeDistrict, selectedMission, answers, completedSet, onSelectDistrict, onSelectMission, onAnswer, onComplete }) {
  const selectedAnswer = answers[selectedMission.id];
  const hasAnswered = selectedAnswer !== undefined;
  const isCorrect = selectedAnswer === selectedMission.correct_index;
  const isCompleted = completedSet.has(selectedMission.id);
  const districtMissions = missions.filter((m) => m.district_id === activeDistrict.id);

  return (
    <section className="layout mission-layout">
      <div className="card glass">
        <h2>District missions</h2>
        <p>Choose a pillar and complete fact-based learning challenges.</p>
        <div className="pillar-buttons">
          {districts.map((d) => <button key={d.id} className={activeDistrict.id === d.id ? "active" : ""} onClick={() => onSelectDistrict(d.id)}><span>{d.emoji}</span><b>{d.short_name}</b></button>)}
        </div>
        <div className={`district-preview ${activeDistrict.color_class}`}>
          <h3>{activeDistrict.name}</h3><p>{activeDistrict.purpose}</p>
        </div>
        <div className="mission-list">
          {districtMissions.map((m) => (
            <button key={m.id} className={`mission-card ${selectedMission.id === m.id ? "active" : ""}`} onClick={() => onSelectMission(m.id)}>
              <div className="split"><div><b>{m.title}</b><p>Level {m.level} · {m.duration_minutes} min</p></div><span className={`pill ${completedSet.has(m.id) ? "good" : ""}`}>{completedSet.has(m.id) ? "Done" : "Open"}</span></div>
            </button>
          ))}
        </div>
      </div>

      <div className="card glass">
        <div className={`mission-hero ${activeDistrict.color_class}`}>
          <span className="pill">{activeDistrict.short_name}</span><span className="pill">Level {selectedMission.level}</span><span className="pill">{selectedMission.duration_minutes} min</span>
          <div className="split hero-split"><div><h2>{selectedMission.title}</h2><p>{selectedMission.story}</p></div><div className="mission-emoji">{activeDistrict.emoji}</div></div>
        </div>

        <div className="learning-grid">
          <div className="nugget"><span className="label">Learning nugget</span><p className="nugget-text">{selectedMission.nugget}</p></div>
          <div className="challenge">
            <span className="label">Decision challenge</span><h3>{selectedMission.question}</h3>
            <div className="option-list">
              {(selectedMission.options || []).map((option, idx) => {
                let c = "option";
                if (hasAnswered && idx === selectedMission.correct_index) c += " correct";
                else if (hasAnswered && selectedAnswer === idx && !isCorrect) c += " wrong";
                else if (selectedAnswer === idx) c += " selected";
                return <button key={idx} className={c} onClick={() => onAnswer(selectedMission.id, idx)}><b>{String.fromCharCode(65 + idx)}.</b> {option}</button>;
              })}
            </div>
            {hasAnswered ? <div className={`feedback ${isCorrect ? "good" : "bad"}`}><b>{isCorrect ? "Good decision." : "Not yet."}</b><p>{isCorrect ? selectedMission.feedback : "Try again. Look for the option that creates resilience, evidence and long-term value."}</p></div> : null}
          </div>
        </div>

        <div className="reward-panel">
          <div><span className="label">Reward</span><div className="reward-pills">{rewards(selectedMission.rewards).map(([k, v]) => <span className="pill" key={k}>+{v} {k}</span>)}<span className="pill info">Unlock: {selectedMission.unlock}</span><span className="pill warn">Badge: {selectedMission.badge}</span></div></div>
          <button className="button primary" disabled={!isCorrect || isCompleted} onClick={() => onComplete(selectedMission)}>{isCompleted ? "Mission completed" : isCorrect ? "Claim reward" : "Answer correctly first"}</button>
        </div>
      </div>
    </section>
  );
}
