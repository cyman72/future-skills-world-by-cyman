import { useState } from "react";

const defaultRewards = { knowledge: 20, capital: 0, trust: 0, innovation: 0, impact: 0, resilience: 0, logic: 0 };
const blank = (districtId) => ({
  id: `mission-${Date.now()}`, district_id: districtId, title: "New mission", level: 1, duration_minutes: 3,
  story: "Write the story context here.", nugget: "Write the learning nugget here.", question: "Write the decision challenge here.",
  options: ["Option A", "Option B", "Option C"], correct_index: 0, feedback: "Write the feedback here.",
  rewards: defaultRewards, unlock: "New building upgrade", badge: "New Badge", is_published: false, sort_order: 999
});

export default function AdminDashboard({ districts, missions, onSaveMission }) {
  const [draft, setDraft] = useState(missions[0] || blank(districts[0]?.id || "finance"));
  const selectedId = draft.id;
  const update = (field, value) => setDraft((d) => ({ ...d, [field]: value }));
  const updateReward = (field, value) => setDraft((d) => ({ ...d, rewards: { ...defaultRewards, ...(d.rewards || {}), [field]: Number(value || 0) }}));

  function save() {
    onSaveMission({
      ...draft,
      level: Number(draft.level || 1),
      duration_minutes: Number(draft.duration_minutes || 3),
      correct_index: Number(draft.correct_index || 0),
      sort_order: Number(draft.sort_order || 999),
      options: Array.isArray(draft.options) ? draft.options : draft.options.split("\n").map((x) => x.trim()).filter(Boolean),
      rewards: { ...defaultRewards, ...(draft.rewards || {}) }
    });
  }

  return (
    <section className="layout admin-layout">
      <div className="card glass">
        <div className="split aligned-bottom"><div><h2>Admin dashboard</h2><p>Manage missions, learning nuggets, answers, rewards and publication status.</p></div><button className="button primary" onClick={() => setDraft(blank(districts[0]?.id || "finance"))}>New mission</button></div>
        <div className="mission-list">
          {missions.map((m) => {
            const d = districts.find((x) => x.id === m.district_id);
            return <button key={m.id} className={`mission-card ${selectedId === m.id ? "active" : ""}`} onClick={() => setDraft(m)}><div className="split"><div><b>{m.title}</b><p>{d?.emoji} {d?.short_name} · Level {m.level}</p></div><span className={`pill ${m.is_published ? "good" : "warn"}`}>{m.is_published ? "Published" : "Draft"}</span></div></button>;
          })}
        </div>
      </div>

      <div className="card glass">
        <h2>Mission editor</h2>
        <div className="form two">
          <label>ID<input value={draft.id || ""} onChange={(e) => update("id", e.target.value)} /></label>
          <label>District<select value={draft.district_id || ""} onChange={(e) => update("district_id", e.target.value)}>{districts.map((d) => <option key={d.id} value={d.id}>{d.emoji} {d.name}</option>)}</select></label>
          <label>Title<input value={draft.title || ""} onChange={(e) => update("title", e.target.value)} /></label>
          <label>Badge<input value={draft.badge || ""} onChange={(e) => update("badge", e.target.value)} /></label>
          <label>Level<input type="number" value={draft.level || 1} onChange={(e) => update("level", e.target.value)} /></label>
          <label>Duration<input type="number" value={draft.duration_minutes || 3} onChange={(e) => update("duration_minutes", e.target.value)} /></label>
          <label>Unlock<input value={draft.unlock || ""} onChange={(e) => update("unlock", e.target.value)} /></label>
          <label>Sort order<input type="number" value={draft.sort_order || 999} onChange={(e) => update("sort_order", e.target.value)} /></label>
        </div>
        <div className="form">
          <label>Story<textarea value={draft.story || ""} onChange={(e) => update("story", e.target.value)} /></label>
          <label>Learning nugget<textarea value={draft.nugget || ""} onChange={(e) => update("nugget", e.target.value)} /></label>
          <label>Question<textarea value={draft.question || ""} onChange={(e) => update("question", e.target.value)} /></label>
          <label>Options, one per line<textarea value={Array.isArray(draft.options) ? draft.options.join("\n") : draft.options || ""} onChange={(e) => update("options", e.target.value)} /></label>
          <label>Correct option index, starting at 0<input type="number" value={draft.correct_index || 0} onChange={(e) => update("correct_index", e.target.value)} /></label>
          <label>Feedback<textarea value={draft.feedback || ""} onChange={(e) => update("feedback", e.target.value)} /></label>
        </div>
        <h3>Rewards</h3>
        <div className="form rewards-grid">{Object.entries({ ...defaultRewards, ...(draft.rewards || {}) }).map(([k, v]) => <label key={k}>{k}<input type="number" value={v} onChange={(e) => updateReward(k, e.target.value)} /></label>)}</div>
        <label className="checkbox-row"><input type="checkbox" checked={Boolean(draft.is_published)} onChange={(e) => update("is_published", e.target.checked)} /> Published</label>
        <button className="button primary full" onClick={save}>Save mission</button>
      </div>
    </section>
  );
}
