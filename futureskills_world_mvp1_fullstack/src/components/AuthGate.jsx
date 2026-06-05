import { useState } from "react";
import { isSupabaseConfigured, supabase } from "../lib/supabaseClient";
import { POSITIONING } from "../data/seed";

export default function AuthGate({ onLocalDemo }) {
  const [mode, setMode] = useState("sign-in");
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("Future Architect");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  async function submit(event) {
    event.preventDefault();
    setStatus("");

    if (!isSupabaseConfigured) {
      onLocalDemo(displayName);
      return;
    }

    const result = mode === "sign-up"
      ? await supabase.auth.signUp({ email, password, options: { data: { display_name: displayName } } })
      : await supabase.auth.signInWithPassword({ email, password });

    if (result.error) setStatus(result.error.message);
    else if (mode === "sign-up") setStatus("Account created. Confirm your email if your Supabase settings require it.");
  }

  return (
    <main className="auth-page">
      <section className="card glass hero">
        <span className="pill dark">MVP 1 Full-Stack</span>
        <span className="pill">{isSupabaseConfigured ? "Supabase mode" : "Local demo mode"}</span>
        <h1>Build your own future society.</h1>
        <p className="positioning">{POSITIONING}</p>
        <div className="feature-grid">
          <div className="mini-card"><div className="big-emoji">🎮</div><b>Play</b><p>Complete short missions.</p></div>
          <div className="mini-card"><div className="big-emoji">🏗️</div><b>Build</b><p>Unlock districts and badges.</p></div>
          <div className="mini-card"><div className="big-emoji">🔐</div><b>Persist</b><p>Use real accounts and saved progress.</p></div>
        </div>
      </section>

      <section className="card glass auth-box">
        <h2>{mode === "sign-in" ? "Sign in" : "Create account"}</h2>
        <p>{isSupabaseConfigured ? "Use email and password authentication." : "Supabase is not configured yet. Demo mode is available."}</p>
        <form className="form" onSubmit={submit}>
          {mode === "sign-up" || !isSupabaseConfigured ? (
            <label>Display name<input value={displayName} onChange={(e) => setDisplayName(e.target.value)} /></label>
          ) : null}

          {isSupabaseConfigured ? (
            <>
              <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} /></label>
              <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></label>
            </>
          ) : null}

          <button className="button primary" type="submit">{isSupabaseConfigured ? (mode === "sign-in" ? "Sign in" : "Create account") : "Enter local demo"}</button>
        </form>
        {isSupabaseConfigured ? (
          <button className="link-button" onClick={() => setMode(mode === "sign-in" ? "sign-up" : "sign-in")}>{mode === "sign-in" ? "Need an account? Register." : "Already registered? Sign in."}</button>
        ) : <div className="notice">Add Supabase variables to `.env.local` to activate real auth.</div>}
        {status ? <div className="notice">{status}</div> : null}
      </section>
    </main>
  );
}
