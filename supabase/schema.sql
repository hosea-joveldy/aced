-- Aced Supabase Schema
-- Re-runnable / Idempotent database schema, RLS policies, and triggers

-- Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

-- 1. Classes
create table if not exists classes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  leader_email text not null default 'leader@aced.school',
  created_at timestamptz not null default now()
);

-- 2. Subjects
create table if not exists subjects (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references classes(id) on delete cascade,
  name text not null,
  teacher_name text not null,
  created_at timestamptz not null default now()
);

-- 3. Assignments
create table if not exists assignments (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references classes(id) on delete cascade,
  subject_id uuid not null references subjects(id) on delete cascade,
  title text not null,
  due_date text, -- 'YYYY-MM-DD' formatted date string
  notes text,
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4. Edit History
create table if not exists edit_history (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references classes(id) on delete cascade,
  assignment_id uuid references assignments(id) on delete set null,
  assignment_title text not null,
  field text not null,
  before_value text,
  after_value text,
  editor_name text not null,
  editor_email text,
  timestamp timestamptz not null default now(),
  reverted boolean not null default false,
  reverted_by text,
  reverted_at timestamptz
);

-- Indices for performance
create index if not exists idx_classes_code on classes(code);
create index if not exists idx_subjects_class on subjects(class_id);
create index if not exists idx_assignments_class on assignments(class_id);
create index if not exists idx_assignments_due_date on assignments(due_date);
create index if not exists idx_edit_history_class on edit_history(class_id);

-- Updated_at trigger helper
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_assignments_updated_at on assignments;
create trigger set_assignments_updated_at
  before update on assignments
  for each row
  execute function update_updated_at_column();

-- Row Level Security (RLS)
alter table classes enable row level security;
alter table subjects enable row level security;
alter table assignments enable row level security;
alter table edit_history enable row level security;

-- Open policies for crowdsourced student access (no authentication required)
drop policy if exists "Allow public select on classes" on classes;
create policy "Allow public select on classes" on classes for select using (true);

drop policy if exists "Allow public insert on classes" on classes;
create policy "Allow public insert on classes" on classes for insert with check (true);

drop policy if exists "Allow public select on subjects" on subjects;
create policy "Allow public select on subjects" on subjects for select using (true);

drop policy if exists "Allow public insert on subjects" on subjects;
create policy "Allow public insert on subjects" on subjects for insert with check (true);

drop policy if exists "Allow public update on subjects" on subjects;
create policy "Allow public update on subjects" on subjects for update using (true);

drop policy if exists "Allow public delete on subjects" on subjects;
create policy "Allow public delete on subjects" on subjects for delete using (true);

drop policy if exists "Allow public select on assignments" on assignments;
create policy "Allow public select on assignments" on assignments for select using (true);

drop policy if exists "Allow public insert on assignments" on assignments;
create policy "Allow public insert on assignments" on assignments for insert with check (true);

drop policy if exists "Allow public update on assignments" on assignments;
create policy "Allow public update on assignments" on assignments for update using (true);

drop policy if exists "Allow public delete on assignments" on assignments;
create policy "Allow public delete on assignments" on assignments for delete using (true);

drop policy if exists "Allow public select on edit_history" on edit_history;
create policy "Allow public select on edit_history" on edit_history for select using (true);

drop policy if exists "Allow public insert on edit_history" on edit_history;
create policy "Allow public insert on edit_history" on edit_history for insert with check (true);

drop policy if exists "Allow public update on edit_history" on edit_history;
create policy "Allow public update on edit_history" on edit_history for update using (true);

-- Demo Seed Data (Idempotent insertion for ACED2026)
insert into classes (id, code, name, leader_email)
values ('00000000-0000-0000-0000-000000002026', 'ACED2026', 'Class of 2026 — Period 3', 'leader@aced.school')
on conflict (code) do nothing;
