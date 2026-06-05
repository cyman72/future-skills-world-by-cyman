import { useMemo, useState } from "react";

const defaultRewards = {
  knowledge: 20,
  capital: 0,
  trust: 0,
  innovation: 0,
  impact: 0,
  resilience: 0,
  logic: 0,
};

function createEmptyMission(districtId, sortOrder = 999) {
  return {
    id: `mission-${Date.now()}`,
    district_id: districtId,
    title: "New mission",
    level: 1,
    duration_minutes: 3,
    story: "Write the story context here.",
    nugget: "Write the learning nugget here.",
    question: "Write the decision challenge here.",
    options: ["Option A", "Option B", "Option C"],
    correct_index: 0,
    feedback: "Write the feedback here.",
    rewards: defaultRewards,
    unlock: "New building upgrade",
    badge: "New Badge",
    is_published: false,
    sort_order: sortOrder,
  };
}

function MissionPreview({ mission, district }) {
  return (
    <div className="preview-panel">
      <div className={`mission-hero ${district?.color_class || ""}`}>
        <span className="pill">{district?.short_name || "District"}</span>
        <span className="pill">Level {mission.level}</span>
        <span className="pill">{mission.duration_minutes} min</span>
        <div className="split hero-split">
          <div>
            <h2>{mission.title}</h2>
            <p>{mission.story}</p>
          </div>
          <div className="mission-emoji">{district?.emoji || "🎯"}</div>
        </div>
      </div>
      <div className="learning-grid single-preview">
        <div className="nugget">
          <span className="label">Learning nugget</span>
          <p className="nugget-text">{mission.nugget}</p>
        </div>
        <div className="challenge">
          <span className="label">Decision challenge</span>
          <h3>{mission.question}</h3>
          {(mission.options || []).map((option, index) => (
            <div key={index} className={`option ${index === Number(mission.correct_index) ? "correct" : ""}`}>
              <b>{String.fromCharCode(65 + index)}.</b> {option}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard({ districts, missions, onSaveMission, onDuplicateMission }) {
  const [selectedId, setSelectedId] = useState(missions[0]?.id || "");
  const [districtFilter, setDistrictFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const selectedMission = useMemo(() => missions.find((mission) => mission.id === selectedId) || missions[0], [missions, selectedId]);
  const [draft, setDraft] = useState(selectedMission || createEmptyMission(districts[0]?.id));

  const filteredMissions = useMemo(() => {
    return missions.filter((mission) => {
      const matchesDistrict = districtFilter === "all" || mission.district_id === districtFilter;
      const matchesStatus = statusFilter === "all" || (statusFilter === "published" && mission.is_published) || (statusFilter === "draft" && !mission.is_published);
      const matchesQuery = !query.trim() || mission.title.toLowerCase().includes(query.toLowerCase()) || mission.id.toLowerCase().includes(query.toLowerCase());
      return matchesDistrict && matchesStatus && matchesQuery;
    });
  }, [missions, districtFilter, statusFilter, query]);

  const previewDistrict = districts.find((district) => district.id === draft?.district_id);

  function selectMission(id) {
    const mission = missions.find((item) => item.id === id);
    setSelectedId(id);
    if (mission) setDraft({ ...mission });
    setShowPreview(false);
  }

  function startNewMission() {
    const mission = createEmptyMission(districts[0]?.id || "finance", missions.length + 1);
    setSelectedId(mission.id);
    setDraft(mission);
    setShowPreview(false);
  }

  async function duplicateCurrentMission() {
    const duplicated = await onDuplicateMission(draft);
    setSelectedId(duplicated.id);
    setDraft(duplicated);
    setShowPreview(false);
  }

  function updateField(field, value) {
    setDraft((current) => ({ ...current, [field]: value }));
  }

  function updateReward(field, value) {
    setDraft((current) => ({
      ...current,
      rewards: { ...defaultRewards, ...(current.rewards || {}), [field]: Number(value || 0) },
    }));
  }

  function save() {
    const normalised = {
      ...draft,
      level: Number(draft.level || 1),
      duration_minutes: Number(draft.duration_minutes || 3),
      correct_index: Number(draft.correct_index || 0),
      sort_order: Number(draft.sort_order || 999),
      options: typeof draft.options === "string" ? draft.options.split("\n").map((item) => item.trim()).filter(Boolean) : draft.options,
      rewards: { ...defaultRewards, ...(draft.rewards || {}) },
    };
    onSaveMission(normalised);
    setSelectedId(normalised.id);
  }

  const optionsText = Array.isArray(draft?.options) ? draft.options.join("\n") : draft?.options || "";

  return (
    <section className="layout admin-layout">
      <div className="card glass">
        <div className="split aligned-bottom">
          <div>
            <h2>Admin dashboard</h2>
            <p>Manage missions, learning nuggets, answers, rewards and publication status.</p>
          </div>
          <button className="button primary" onClick={startNewMission}>New mission</button>
        </div>

        <div className="admin-filters">
          <label>
            Search
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search title or ID" />
          </label>
          <label>
            District
            <select value={districtFilter} onChange={(event) => setDistrictFilter(event.target.value)}>
              <option value="all">All districts</option>
              {districts.map((district) => <option key={district.id} value={district.id}>{district.emoji} {district.short_name}</option>)}
            </select>
          </label>
          <label>
            Status
            <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
              <option value="all">All</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </label>
        </div>

        <div className="mission-list">
          {filteredMissions.map((mission) => {
            const district = districts.find((item) => item.id === mission.district_id);
            return (
              <button key={mission.id} className={`mission-card ${selectedId === mission.id ? "active" : ""}`} onClick={() => selectMission(mission.id)}>
                <div className="split">
                  <div>
                    <b>{mission.title}</b>
                    <p>{district?.emoji} {district?.short_name} · Level {mission.level}</p>
                  </div>
                  <span className={`pill ${mission.is_published ? "good" : "warn"}`}>{mission.is_published ? "Published" : "Draft"}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="card glass">
        <div className="split aligned-bottom">
          <div>
            <h2>Mission editor</h2>
            <p>Edit the content, then preview and save.</p>
          </div>
          <div className="button-row">
            <button className="button secondary" onClick={() => setShowPreview(!showPreview)}>{showPreview ? "Edit" : "Preview"}</button>
            <button className="button secondary" onClick={duplicateCurrentMission}>Duplicate</button>
          </div>
        </div>

        {showPreview ? <MissionPreview mission={draft} district={previewDistrict} /> : (
          <>
            <div className="form two">
              <label>ID<input value={draft.id || ""} onChange={(event) => updateField("id", event.target.value)} /></label>
              <label>District<select value={draft.district_id || ""} onChange={(event) => updateField("district_id", event.target.value)}>{districts.map((district) => <option key={district.id} value={district.id}>{district.emoji} {district.name}</option>)}</select></label>
              <label>Title<input value={draft.title || ""} onChange={(event) => updateField("title", event.target.value)} /></label>
              <label>Badge<input value={draft.badge || ""} onChange={(event) => updateField("badge", event.target.value)} /></label>
              <label>Level<input type="number" value={draft.level || 1} onChange={(event) => updateField("level", event.target.value)} /></label>
              <label>Duration minutes<input type="number" value={draft.duration_minutes || 3} onChange={(event) => updateField("duration_minutes", event.target.value)} /></label>
              <label>Unlock<input value={draft.unlock || ""} onChange={(event) => updateField("unlock", event.target.value)} /></label>
              <label>Sort order<input type="number" value={draft.sort_order || 999} onChange={(event) => updateField("sort_order", event.target.value)} /></label>
            </div>

            <div className="form">
              <label>Story<textarea value={draft.story || ""} onChange={(event) => updateField("story", event.target.value)} /></label>
              <label>Learning nugget<textarea value={draft.nugget || ""} onChange={(event) => updateField("nugget", event.target.value)} /></label>
              <label>Question<textarea value={draft.question || ""} onChange={(event) => updateField("question", event.target.value)} /></label>
              <label>Options, one per line<textarea value={optionsText} onChange={(event) => updateField("options", event.target.value)} /></label>
              <label>Correct option index, starting at 0<input type="number" value={draft.correct_index || 0} onChange={(event) => updateField("correct_index", event.target.value)} /></label>
              <label>Feedback<textarea value={draft.feedback || ""} onChange={(event) => updateField("feedback", event.target.value)} /></label>
            </div>

            <h3>Rewards</h3>
            <div className="form rewards-grid">
              {Object.entries({ ...defaultRewards, ...(draft.rewards || {}) }).map(([key, value]) => (
                <label key={key}>{key}<input type="number" value={value} onChange={(event) => updateReward(key, event.target.value)} /></label>
              ))}
            </div>

            <label className="checkbox-row"><input type="checkbox" checked={Boolean(draft.is_published)} onChange={(event) => updateField("is_published", event.target.checked)} />Published</label>
            <button className="button primary full" onClick={save}>Save mission</button>
          </>
        )}
      </div>
    </section>
  );
}
