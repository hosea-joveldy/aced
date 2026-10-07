# SPEC.md — Aced Specification

## 1. Vision & Problem
High school and college students frequently miss deadlines because teachers announce homework and projects haphazardly across verbal announcements, group chats, or Google Classroom posts without due dates. Aced is a lightweight, mobile-first crowdsourced deadline board for a class. Any student in the class can join with a class code, see their class subjects and Classroom codes, and contribute or refine assignment deadlines.

## 2. Target Users & Environment
- **Target Users**: Students accessing the board primarily via mobile browsers (375px+ viewport). Class representatives assist by keeping subject info and dates accurate.
- **Identity Model**: Zero passwords or OAuth. Local identity consisting of a display name and class code stored in client storage.

## 3. Core Features (Scope)
1. **Class Join & Session Management**:
   - Join existing class by class code (`ACED2026` in demo seed) and student display name.
   - Switch or leave class; persistent local session.
2. **Class Subjects Directory**:
   - List subjects with assigned teacher name and Google Classroom code.
   - Add and update subject details.
3. **Crowdsourced Deadline Board**:
   - Grouped views: *Needs a date*, *Overdue*, *Due today*, *This week*, *Later*, and *Done*.
   - Quick summary metrics strip (e.g. counts for overdue, today, missing date).
   - Filter by subject and completion state.
4. **Assignment Management**:
   - Add new assignment with title, subject, optional due date (`YYYY-MM-DD`), and notes.
   - Edit assignment details inline or via modal. Mark assignments complete/incomplete.
5. **Edit History & One-Tap Undo**:
   - Audit trail capturing field modified, previous value, updated value, editor name, and timestamp.
   - One-tap revert functionality that restores prior values and records the revert action.
6. **Classroom Import Add-on (Feature Flagged)**:
   - Behind `VITE_FEATURE_CLASSROOM_IMPORT` (default OFF).
   - Decoupled `ClassroomProvider` interface with an offline no-op provider.
   - UI cleanly omitted from the DOM when disabled.

## 4. Architectural & Technical Decisions
- **Frontend Stack**: Vite, React 19, TypeScript (strict), Tailwind CSS, shadcn/ui (new-york style, neutral base, indigo primary, 0.5rem radius, Inter font), React Router (HashRouter for static hosting).
- **Storage Seam (`AcedRepository`)**: UI relies entirely on async repository abstraction:
  - `LocalRepository`: LocalStorage (`aced.db.v1`) seeded with class `ACED2026`, 6 subjects, 9 assignments (4 no date, 3 overdue, 2 today/tomorrow, 1 done), and 3 history logs.
  - `SupabaseRepository`: Supabase Postgres/RLS backend when configured via environment.
  - Safe env reader (`src/lib/env.ts`) providing defaults without runtime exceptions.
- **Deterministic Dates**: Stored strictly as `'YYYY-MM-DD'`. "Today" determined via an injectable `getToday()` helper.
- **Database & Migration Contract**: Single re-runnable `supabase/schema.sql` with idempotent table definitions and RLS policies. Documented in `data/README.md`.

## 5. Out of Scope
- Privileged class representative roles or role-based permission locks.
- Google OAuth logins or live external Google Classroom API calls.
- Hiding assignments automatically after their deadline passes.
- File uploads, binary attachments, push notifications, and background reminder jobs.
