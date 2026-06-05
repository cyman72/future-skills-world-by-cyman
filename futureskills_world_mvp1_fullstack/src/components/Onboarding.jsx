import { useState } from "react";
import { POSITIONING } from "../data/seed";

const steps = [
  {
    title: "Welcome to FutureSkills World",
    emoji: "🌍",
    text:
      "You are about to build your own Future Island. Every building you unlock represents a future skill: financial literacy, cybersecurity, AI, quantum computing and sustainability.",
  },
  {
    title: "Learn the future by building it",
    emoji: "🏗️",
    text:
      "The future will reward people who understand money, digital risks, AI, new technologies and sustainability. FutureSkills World helps you learn these skills step by step through missions, decisions and rewards.",
  },
  {
    title: "Complete missions, earn rewards",
    emoji: "🎯",
    text:
      "Each mission has a learning nugget, a decision challenge and feedback. Good decisions earn Knowledge Points, Trust Points, Innovation Points, Impact Points and more.",
  },
  {
    title: "Return and grow over time",
    emoji: "⚡",
    text:
      "Daily missions, badges and weekly challenges help you build future skills continuously. The more you learn, the stronger your island becomes.",
  },
];

export default function Onboarding({ districts, onComplete, onSkip }) {
  const [step, setStep] = useState(0);
  const [selectedDistrict, setSelectedDistrict] = useState(districts?.[0]?.id || "finance");
  const choosing = step === steps.length;

  return (
    <main className="onboarding-page">
      <section className="card glass onboarding-card">
        <div className="pill-row">
          <span className="pill dark">FutureSkills World</span>
          <span className="pill good">MVP 2 onboarding</span>
        </div>

        {!choosing ? (
          <>
            <div className="onboarding-emoji">{steps[step].emoji}</div>
            <h1>{steps[step].title}</h1>
            <p className="positioning">{steps[step].text}</p>
            {step === 0 ? <p className="small-positioning">{POSITIONING}</p> : null}

            <div className="onboarding-actions">
              <button className="button secondary" onClick={onSkip}>Skip intro</button>
              <button className="button primary" onClick={() => setStep(step + 1)}>
                {step === steps.length - 1 ? "Choose first district" : "Continue"}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="onboarding-emoji">🧭</div>
            <h1>Choose your first district</h1>
            <p className="positioning">Start where you want. The app will guide you from one mission to the next.</p>

            <div className="district-choice-grid">
              {districts.map((district) => (
                <button
                  key={district.id}
                  className={`district-choice ${district.color_class} ${selectedDistrict === district.id ? "selected" : ""}`}
                  onClick={() => setSelectedDistrict(district.id)}
                >
                  <div className="big-emoji">{district.emoji}</div>
                  <h3>{district.short_name}</h3>
                  <p>{district.purpose}</p>
                </button>
              ))}
            </div>

            <div className="onboarding-actions">
              <button className="button secondary" onClick={() => setStep(step - 1)}>Back</button>
              <button className="button primary" onClick={() => onComplete(selectedDistrict)}>Enter Future Island</button>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
