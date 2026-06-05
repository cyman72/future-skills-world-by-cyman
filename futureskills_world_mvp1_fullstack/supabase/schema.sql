-- FutureSkills World MVP 1
-- Run this file in the Supabase SQL editor.

create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  role text not null default 'player' check (role in ('player', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.districts (
  id text primary key,
  name text not null,
  short_name text not null,
  emoji text not null,
  color_class text not null,
  resource text not null,
  purpose text not null,
  buildings jsonb not null default '[]'::jsonb,
  sort_order int not null default 999,
  created_at timestamptz not null default now()
);

create table if not exists public.missions (
  id text primary key,
  district_id text not null references public.districts(id) on delete cascade,
  title text not null,
  level int not null default 1,
  duration_minutes int not null default 3,
  story text not null,
  nugget text not null,
  question text not null,
  options jsonb not null default '[]'::jsonb,
  correct_index int not null default 0,
  feedback text not null,
  rewards jsonb not null default '{}'::jsonb,
  unlock text,
  badge text,
  is_published boolean not null default false,
  sort_order int not null default 999,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.user_progress (
  user_id uuid primary key references auth.users(id) on delete cascade,
  points jsonb not null default '{"knowledge":0,"capital":0,"trust":0,"innovation":0,"impact":0,"resilience":0,"logic":0}'::jsonb,
  completed_missions text[] not null default array[]::text[],
  badges text[] not null default array[]::text[],
  active_district_id text not null default 'finance',
  selected_mission_id text not null default 'finance-budget',
  updated_at timestamptz not null default now()
);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)))
  on conflict (id) do nothing;

  insert into public.user_progress (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists missions_set_updated_at on public.missions;
create trigger missions_set_updated_at
before update on public.missions
for each row execute function public.set_updated_at();

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (select 1 from public.profiles where id = auth.uid() and role = 'admin');
$$;

alter table public.profiles enable row level security;
alter table public.districts enable row level security;
alter table public.missions enable row level security;
alter table public.user_progress enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles for select using (id = auth.uid());

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles for update using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists "districts_read_authenticated" on public.districts;
create policy "districts_read_authenticated" on public.districts for select to authenticated using (true);

drop policy if exists "districts_admin_write" on public.districts;
create policy "districts_admin_write" on public.districts for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "missions_read_published_or_admin" on public.missions;
create policy "missions_read_published_or_admin" on public.missions for select to authenticated using (is_published = true or public.is_admin());

drop policy if exists "missions_admin_write" on public.missions;
create policy "missions_admin_write" on public.missions for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "progress_select_own" on public.user_progress;
create policy "progress_select_own" on public.user_progress for select using (user_id = auth.uid());

drop policy if exists "progress_insert_own" on public.user_progress;
create policy "progress_insert_own" on public.user_progress for insert with check (user_id = auth.uid());

drop policy if exists "progress_update_own" on public.user_progress;
create policy "progress_update_own" on public.user_progress for update using (user_id = auth.uid()) with check (user_id = auth.uid());

insert into public.districts (id, name, short_name, emoji, color_class, resource, purpose, buildings, sort_order)
values
  ('finance','Finance District','Finance','🏦','finance','Capital Points','Learn budgeting, risk, inflation, saving, scams and responsible financial decisions.','["Future Bank","Savings Hub","Investment Lab"]'::jsonb,1),
  ('cyber','Cyber Shield Zone','Cyber','🛡️','cyber','Trust Points','Build everyday cybersecurity habits: passwords, MFA, phishing, data protection and safe behaviour.','["Security Centre","Password Vault","Cyber Defence Tower"]'::jsonb,2),
  ('ai','AI Lab','AI','🤖','ai','Innovation Points','Use AI productively and responsibly: prompting, verification, bias, human oversight and AI for good.','["Prompt Studio","AI Ethics Lab","Automation Workshop"]'::jsonb,3),
  ('quantum','Quantum Campus','Quantum','⚛️','quantum','Logic Points','Make quantum computing understandable: bits, qubits, superposition, quantum advantage and future security.','["Qubit Lab","Quantum Gate Workshop","Security Observatory"]'::jsonb,4),
  ('sustainability','Sustainability Valley','Sustainability','🌱','sustainability','Impact Points','Understand climate, circular economy, biodiversity, nature-based solutions, resilience and greenwashing.','["Solar Field","Circular Workshop","Biodiversity Park"]'::jsonb,5)
on conflict (id) do update set
  name=excluded.name, short_name=excluded.short_name, emoji=excluded.emoji, color_class=excluded.color_class,
  resource=excluded.resource, purpose=excluded.purpose, buildings=excluded.buildings, sort_order=excluded.sort_order;

insert into public.missions (id, district_id, title, level, duration_minutes, story, nugget, question, options, correct_index, feedback, rewards, unlock, badge, is_published, sort_order)
values
('finance-budget','finance','Build your first budget',1,3,'Your island needs a safe way to manage resources. Build your first budget before expanding.','A budget helps you decide how to use money before you spend it. It creates clarity between needs, savings and optional spending.','Which budget choice is the most resilient?','["Spend everything on entertainment to boost happiness today.","Cover needs, save a portion, invest in learning and keep some room for fun.","Put everything into one risky investment because it could grow faster."]'::jsonb,1,'Correct. A resilient budget balances today’s needs with future flexibility.','{"knowledge":20,"capital":50,"trust":0,"innovation":0,"impact":0,"resilience":10,"logic":0}'::jsonb,'Future Bank','Budget Builder',true,1),
('finance-risk','finance','Risk and return',2,4,'A trader visits your island and promises very high returns with no risk.','In finance, higher potential return usually comes with higher risk. A promise of high return without risk is a warning sign.','What should you do first?','["Invest quickly before the opportunity disappears.","Ask for facts, understand the risk, compare alternatives and avoid pressure tactics.","Borrow more money to maximise the opportunity."]'::jsonb,1,'Correct. Pressure, secrecy and unrealistic promises are classic risk signals.','{"knowledge":25,"capital":40,"trust":10,"innovation":0,"impact":0,"resilience":15,"logic":0}'::jsonb,'Savings Hub','Risk Spotter',true,2),
('cyber-mfa','cyber','Activate the second shield',1,3,'Your island gate uses only one password. Attackers are getting closer.','Multi-factor authentication adds another layer of protection. If a password is stolen, the account is still harder to access.','Which option gives the strongest protection?','["Use the same password everywhere so it is easy to remember.","Use a strong unique password and enable multi-factor authentication.","Write the password in a public team chat so everyone can help."]'::jsonb,1,'Correct. Unique passwords plus MFA are a strong everyday cyber habit.','{"knowledge":20,"capital":0,"trust":60,"innovation":0,"impact":0,"resilience":20,"logic":0}'::jsonb,'Password Vault','Second Shield',true,3),
('cyber-phishing','cyber','Stop the phishing attack',2,4,'Three messages arrive. One tries to trick your citizens into clicking a dangerous link.','Phishing often creates urgency, imitates trusted brands and hides suspicious links or sender addresses.','Which message is most suspicious?','["Your monthly statement is available in your secure account portal.","URGENT: verify your account in 10 minutes or it will be deleted. Click this shortened link now.","Your teacher shared a new course document in the official school platform."]'::jsonb,1,'Correct. Urgency, fear and unclear links are strong phishing indicators.','{"knowledge":25,"capital":0,"trust":70,"innovation":0,"impact":0,"resilience":25,"logic":0}'::jsonb,'Cyber Defence Tower','Phishing Defender',true,4),
('ai-prompt','ai','Upgrade your prompt',1,3,'Your AI assistant gives weak answers because your instructions are too vague.','A good prompt gives context, task, constraints and the desired output format. Clear input improves the usefulness of AI output.','Which prompt is strongest?','["Tell me about sustainability.","Write something nice about the future.","Explain three practical ways a small city can reduce emissions, with one benefit and one trade-off for each."]'::jsonb,2,'Correct. The prompt defines context, structure and the expected result.','{"knowledge":20,"capital":0,"trust":10,"innovation":60,"impact":0,"resilience":0,"logic":0}'::jsonb,'Prompt Studio','Prompt Pilot',true,5),
('ai-hallucination','ai','Spot the hallucination',2,4,'Your AI assistant sounds confident, but one answer may be wrong.','AI can produce wrong or invented answers while sounding convincing. Important outputs should be checked against reliable sources.','What is the safest response to an important AI-generated claim?','["Accept it if the wording sounds professional.","Check the claim against reliable sources before using it.","Share it immediately because AI is usually objective."]'::jsonb,1,'Correct. Verification is essential, especially for important decisions.','{"knowledge":25,"capital":0,"trust":30,"innovation":45,"impact":0,"resilience":10,"logic":0}'::jsonb,'AI Ethics Lab','Fact Checker',true,6),
('quantum-bit-qubit','quantum','Bit vs qubit',1,3,'Your island opens a small quantum classroom. First, citizens must understand the difference between a bit and a qubit.','A classical bit is either 0 or 1. A qubit can be described as a combination of states until it is measured.','Which statement is the best simple explanation?','["A qubit is just a smaller normal bit.","A qubit is always both exactly 0 and exactly 1 in the same way as a normal bit.","A qubit uses quantum properties and can represent a combination of states before measurement."]'::jsonb,2,'Correct. Keep it simple: quantum information behaves differently from classical information.','{"knowledge":20,"capital":0,"trust":0,"innovation":30,"impact":0,"resilience":0,"logic":50}'::jsonb,'Qubit Lab','Quantum Rookie',true,7),
('quantum-security','quantum','Quantum security alert',3,5,'Your Cyber Shield Zone receives a future warning: some encryption methods may need quantum-safe upgrades.','Quantum computing could threaten some current encryption methods in the future. Quantum-safe security prepares systems before the risk becomes practical.','What is the best strategic response?','["Ignore it because quantum computers are not useful for anything.","Panic and shut down all digital services immediately.","Start mapping critical systems and prepare a gradual transition to quantum-safe security."]'::jsonb,2,'Correct. Future risks should be handled with preparation, not panic.','{"knowledge":30,"capital":0,"trust":40,"innovation":30,"impact":0,"resilience":30,"logic":40}'::jsonb,'Security Observatory','Future Secured',true,8),
('sustainability-energy','sustainability','Power your island',1,3,'Your island needs energy. The cheapest option is not always the most resilient one.','Energy decisions involve trade-offs between cost, emissions, reliability, resilience and long-term impact.','Which energy strategy is most balanced?','["Use only the cheapest fossil fuel source and ignore future costs.","Use a mix of renewable power, storage and efficiency measures while managing cost and reliability.","Turn off all power permanently to avoid emissions."]'::jsonb,1,'Correct. A credible transition balances emissions, reliability, affordability and resilience.','{"knowledge":20,"capital":0,"trust":0,"innovation":10,"impact":60,"resilience":20,"logic":0}'::jsonb,'Solar Field','Clean Power Starter',true,9),
('sustainability-greenwashing','sustainability','Greenwashing alert',2,4,'A supplier claims to be 100% sustainable but gives no evidence.','Credible sustainability claims should be specific, evidence-based and transparent about boundaries and trade-offs.','What should you ask for?','["A nice slogan and green logo.","Clear data, methodology, scope, assumptions and independent verification where relevant.","A promise that everything is positive and nothing has trade-offs."]'::jsonb,1,'Correct. Serious sustainability work requires evidence and transparency.','{"knowledge":25,"capital":0,"trust":20,"innovation":0,"impact":60,"resilience":15,"logic":0}'::jsonb,'Circular Workshop','Greenwashing Spotter',true,10)
on conflict (id) do update set
district_id=excluded.district_id,title=excluded.title,level=excluded.level,duration_minutes=excluded.duration_minutes,story=excluded.story,nugget=excluded.nugget,question=excluded.question,options=excluded.options,correct_index=excluded.correct_index,feedback=excluded.feedback,rewards=excluded.rewards,unlock=excluded.unlock,badge=excluded.badge,is_published=excluded.is_published,sort_order=excluded.sort_order;
