# SPEC.md — Aced Specification

## 1. Vision & Problem
High school and college students frequently miss deadlines because teachers announce homework and projects haphazardly across verbal announcements, group chats, or Google Classroom posts without due dates. Aced is a lightweight, mobile-first crowdsourced deadline board for a class. Any student in the class can join with a class code, see their class subjects and Classroom codes, and contribute or refine assignment deadlines.

## 2. Target Users & Environment
- **Target Users**: Students accessing the board primarily via mobile browsers (375px+ viewport). Class representatives assist by keeping subject info and dates accurate.
- **Identity Model**: Students authenticate with email + display name + class code. Supports local simulated/mock email auth offline (no .env needed) and Supabase Auth when configured. Each class has a designated Class Leader (representative).

## 3. Core Features (Scope)
1. **Class Join & Session Management**:
   - Join existing class by class code (`ACED2026` in demo seed), student email, and display name.
   - Designates Class Leader based on matching class leader email (`leader@aced.school` in demo class).
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
   - All edits track and attribute both student display name and student email to prevent and identify griefing.
5. **Edit History & Class Leader Rollback**:
   - Audit trail capturing field modified, previous value, updated value, editor display name, editor email, and timestamp.
   - Role-based rollback permission: Only the designated Class Leader can execute rollbacks/reverts. Regular students have view-only access to inspect the audit trail.
6. **Classroom Import Add-on (Feature Flagged)**:
   - Behind `VITE_FEATURE_CLASSROOM_IMPORT` (default OFF).
   - Decoupled `ClassroomProvider` interface with an offline no-op provider.
   - UI cleanly omitted from the DOM when disabled.

## 4. Architectural & Technical Decisions
- **Frontend Stack**: Vite, React 19, TypeScript (strict), Tailwind CSS, shadcn/ui (new-york style, neutral base, indigo primary, 0.5rem radius, Inter font), React Router (HashRouter for static hosting).
- **Storage Seam (`AcedRepository`)**: UI relies entirely on async repository abstraction:
   - `LocalRepository`: LocalStorage (`aced.db.v1`) seeded with class `ACED2026`, 6 subjects, 9 assignments (4 no date, 3 overdue, 2 today/tomorrow, 1 done), and 3 history logs with email attribution.
   - `SupabaseRepository`: Supabase Postgres/RLS backend when configured via environment.
   - Safe env reader (`src/lib/env.ts`) providing defaults without runtime exceptions.
- **Deterministic Dates**: Stored strictly as `'YYYY-MM-DD'`. "Today" determined via an injectable `getToday()` helper.
- **Database & Migration Contract**: Single re-runnable `supabase/schema.sql` with idempotent table definitions including `classes.leader_email` and `edit_history.editor_email`, and RLS policies. Documented in `data/README.md`.

## 5. Out of Scope
- Google OAuth logins or live external Google Classroom API calls.
- Hiding assignments automatically after their deadline passes.
- File uploads, binary attachments, push notifications, and background reminder jobs.
