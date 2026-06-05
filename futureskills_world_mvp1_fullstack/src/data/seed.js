export const POSITIONING =
  "FutureSkills World is a gamified learning app where players build their own future society by mastering financial literacy, cybersecurity, AI, quantum computing and sustainability. It turns future skills into daily missions, social challenges and long-term progress — making learning continuous, practical and motivating.";

export const DEFAULT_PROGRESS = {
  points: { knowledge: 0, capital: 0, trust: 0, innovation: 0, impact: 0, resilience: 0, logic: 0 },
  completed_missions: [],
  badges: [],
  active_district_id: "finance",
  selected_mission_id: "finance-budget"
};

export const DISTRICTS = [
  { id: "finance", name: "Finance District", short_name: "Finance", emoji: "🏦", color_class: "finance", resource: "Capital Points", purpose: "Learn budgeting, risk, inflation, saving, scams and responsible financial decisions.", buildings: ["Future Bank", "Savings Hub", "Investment Lab"], sort_order: 1 },
  { id: "cyber", name: "Cyber Shield Zone", short_name: "Cyber", emoji: "🛡️", color_class: "cyber", resource: "Trust Points", purpose: "Build everyday cybersecurity habits: passwords, MFA, phishing, data protection and safe behaviour.", buildings: ["Security Centre", "Password Vault", "Cyber Defence Tower"], sort_order: 2 },
  { id: "ai", name: "AI Lab", short_name: "AI", emoji: "🤖", color_class: "ai", resource: "Innovation Points", purpose: "Use AI productively and responsibly: prompting, verification, bias, human oversight and AI for good.", buildings: ["Prompt Studio", "AI Ethics Lab", "Automation Workshop"], sort_order: 3 },
  { id: "quantum", name: "Quantum Campus", short_name: "Quantum", emoji: "⚛️", color_class: "quantum", resource: "Logic Points", purpose: "Make quantum computing understandable: bits, qubits, superposition, quantum advantage and future security.", buildings: ["Qubit Lab", "Quantum Gate Workshop", "Security Observatory"], sort_order: 4 },
  { id: "sustainability", name: "Sustainability Valley", short_name: "Sustainability", emoji: "🌱", color_class: "sustainability", resource: "Impact Points", purpose: "Understand climate, circular economy, biodiversity, nature-based solutions, resilience and greenwashing.", buildings: ["Solar Field", "Circular Workshop", "Biodiversity Park"], sort_order: 5 }
];

export const MISSIONS = [
  {
    id: "finance-budget", district_id: "finance", title: "Build your first budget", level: 1, duration_minutes: 3,
    story: "Your island needs a safe way to manage resources. Build your first budget before expanding.",
    nugget: "A budget helps you decide how to use money before you spend it. It creates clarity between needs, savings and optional spending.",
    question: "Which budget choice is the most resilient?",
    options: ["Spend everything on entertainment to boost happiness today.", "Cover needs, save a portion, invest in learning and keep some room for fun.", "Put everything into one risky investment because it could grow faster."],
    correct_index: 1, feedback: "Correct. A resilient budget balances today’s needs with future flexibility.",
    rewards: { knowledge: 20, capital: 50, trust: 0, innovation: 0, impact: 0, resilience: 10, logic: 0 }, unlock: "Future Bank", badge: "Budget Builder", is_published: true, sort_order: 1
  },
  {
    id: "finance-risk", district_id: "finance", title: "Risk and return", level: 2, duration_minutes: 4,
    story: "A trader visits your island and promises very high returns with no risk.",
    nugget: "In finance, higher potential return usually comes with higher risk. A promise of high return without risk is a warning sign.",
    question: "What should you do first?",
    options: ["Invest quickly before the opportunity disappears.", "Ask for facts, understand the risk, compare alternatives and avoid pressure tactics.", "Borrow more money to maximise the opportunity."],
    correct_index: 1, feedback: "Correct. Pressure, secrecy and unrealistic promises are classic risk signals.",
    rewards: { knowledge: 25, capital: 40, trust: 10, innovation: 0, impact: 0, resilience: 15, logic: 0 }, unlock: "Savings Hub", badge: "Risk Spotter", is_published: true, sort_order: 2
  },
  {
    id: "cyber-mfa", district_id: "cyber", title: "Activate the second shield", level: 1, duration_minutes: 3,
    story: "Your island gate uses only one password. Attackers are getting closer.",
    nugget: "Multi-factor authentication adds another layer of protection. If a password is stolen, the account is still harder to access.",
    question: "Which option gives the strongest protection?",
    options: ["Use the same password everywhere so it is easy to remember.", "Use a strong unique password and enable multi-factor authentication.", "Write the password in a public team chat so everyone can help."],
    correct_index: 1, feedback: "Correct. Unique passwords plus MFA are a strong everyday cyber habit.",
    rewards: { knowledge: 20, capital: 0, trust: 60, innovation: 0, impact: 0, resilience: 20, logic: 0 }, unlock: "Password Vault", badge: "Second Shield", is_published: true, sort_order: 3
  },
  {
    id: "cyber-phishing", district_id: "cyber", title: "Stop the phishing attack", level: 2, duration_minutes: 4,
    story: "Three messages arrive. One tries to trick your citizens into clicking a dangerous link.",
    nugget: "Phishing often creates urgency, imitates trusted brands and hides suspicious links or sender addresses.",
    question: "Which message is most suspicious?",
    options: ["Your monthly statement is available in your secure account portal.", "URGENT: verify your account in 10 minutes or it will be deleted. Click this shortened link now.", "Your teacher shared a new course document in the official school platform."],
    correct_index: 1, feedback: "Correct. Urgency, fear and unclear links are strong phishing indicators.",
    rewards: { knowledge: 25, capital: 0, trust: 70, innovation: 0, impact: 0, resilience: 25, logic: 0 }, unlock: "Cyber Defence Tower", badge: "Phishing Defender", is_published: true, sort_order: 4
  },
  {
    id: "ai-prompt", district_id: "ai", title: "Upgrade your prompt", level: 1, duration_minutes: 3,
    story: "Your AI assistant gives weak answers because your instructions are too vague.",
    nugget: "A good prompt gives context, task, constraints and the desired output format. Clear input improves the usefulness of AI output.",
    question: "Which prompt is strongest?",
    options: ["Tell me about sustainability.", "Write something nice about the future.", "Explain three practical ways a small city can reduce emissions, with one benefit and one trade-off for each."],
    correct_index: 2, feedback: "Correct. The prompt defines context, structure and the expected result.",
    rewards: { knowledge: 20, capital: 0, trust: 10, innovation: 60, impact: 0, resilience: 0, logic: 0 }, unlock: "Prompt Studio", badge: "Prompt Pilot", is_published: true, sort_order: 5
  },
  {
    id: "ai-hallucination", district_id: "ai", title: "Spot the hallucination", level: 2, duration_minutes: 4,
    story: "Your AI assistant sounds confident, but one answer may be wrong.",
    nugget: "AI can produce wrong or invented answers while sounding convincing. Important outputs should be checked against reliable sources.",
    question: "What is the safest response to an important AI-generated claim?",
    options: ["Accept it if the wording sounds professional.", "Check the claim against reliable sources before using it.", "Share it immediately because AI is usually objective."],
    correct_index: 1, feedback: "Correct. Verification is essential, especially for important decisions.",
    rewards: { knowledge: 25, capital: 0, trust: 30, innovation: 45, impact: 0, resilience: 10, logic: 0 }, unlock: "AI Ethics Lab", badge: "Fact Checker", is_published: true, sort_order: 6
  },
  {
    id: "quantum-bit-qubit", district_id: "quantum", title: "Bit vs qubit", level: 1, duration_minutes: 3,
    story: "Your island opens a small quantum classroom. First, citizens must understand the difference between a bit and a qubit.",
    nugget: "A classical bit is either 0 or 1. A qubit can be described as a combination of states until it is measured.",
    question: "Which statement is the best simple explanation?",
    options: ["A qubit is just a smaller normal bit.", "A qubit is always both exactly 0 and exactly 1 in the same way as a normal bit.", "A qubit uses quantum properties and can represent a combination of states before measurement."],
    correct_index: 2, feedback: "Correct. Keep it simple: quantum information behaves differently from classical information.",
    rewards: { knowledge: 20, capital: 0, trust: 0, innovation: 30, impact: 0, resilience: 0, logic: 50 }, unlock: "Qubit Lab", badge: "Quantum Rookie", is_published: true, sort_order: 7
  },
  {
    id: "quantum-security", district_id: "quantum", title: "Quantum security alert", level: 3, duration_minutes: 5,
    story: "Your Cyber Shield Zone receives a future warning: some encryption methods may need quantum-safe upgrades.",
    nugget: "Quantum computing could threaten some current encryption methods in the future. Quantum-safe security prepares systems before the risk becomes practical.",
    question: "What is the best strategic response?",
    options: ["Ignore it because quantum computers are not useful for anything.", "Panic and shut down all digital services immediately.", "Start mapping critical systems and prepare a gradual transition to quantum-safe security."],
    correct_index: 2, feedback: "Correct. Future risks should be handled with preparation, not panic.",
    rewards: { knowledge: 30, capital: 0, trust: 40, innovation: 30, impact: 0, resilience: 30, logic: 40 }, unlock: "Security Observatory", badge: "Future Secured", is_published: true, sort_order: 8
  },
  {
    id: "sustainability-energy", district_id: "sustainability", title: "Power your island", level: 1, duration_minutes: 3,
    story: "Your island needs energy. The cheapest option is not always the most resilient one.",
    nugget: "Energy decisions involve trade-offs between cost, emissions, reliability, resilience and long-term impact.",
    question: "Which energy strategy is most balanced?",
    options: ["Use only the cheapest fossil fuel source and ignore future costs.", "Use a mix of renewable power, storage and efficiency measures while managing cost and reliability.", "Turn off all power permanently to avoid emissions."],
    correct_index: 1, feedback: "Correct. A credible transition balances emissions, reliability, affordability and resilience.",
    rewards: { knowledge: 20, capital: 0, trust: 0, innovation: 10, impact: 60, resilience: 20, logic: 0 }, unlock: "Solar Field", badge: "Clean Power Starter", is_published: true, sort_order: 9
  },
  {
    id: "sustainability-greenwashing", district_id: "sustainability", title: "Greenwashing alert", level: 2, duration_minutes: 4,
    story: "A supplier claims to be 100% sustainable but gives no evidence.",
    nugget: "Credible sustainability claims should be specific, evidence-based and transparent about boundaries and trade-offs.",
    question: "What should you ask for?",
    options: ["A nice slogan and green logo.", "Clear data, methodology, scope, assumptions and independent verification where relevant.", "A promise that everything is positive and nothing has trade-offs."],
    correct_index: 1, feedback: "Correct. Serious sustainability work requires evidence and transparency.",
    rewards: { knowledge: 25, capital: 0, trust: 20, innovation: 0, impact: 60, resilience: 15, logic: 0 }, unlock: "Circular Workshop", badge: "Greenwashing Spotter", is_published: true, sort_order: 10
  }
];

export const LEADERBOARD = [
  { name: "Mira", level: 7, score: 1280, badge: "Cyber Defender" },
  { name: "Leo", level: 6, score: 1120, badge: "Impact Builder" },
  { name: "Ava", level: 5, score: 980, badge: "AI Explorer" }
];
