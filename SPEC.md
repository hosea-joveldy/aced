# SPEC.md — Aced Specification

## 1. Vision & Problem
High school and college students frequently miss deadlines because teachers announce homework and projects haphazardly across verbal announcements, group chats, or Google Classroom posts without due dates. Aced is a crowdsourced deadline board per class. Any student in the class can create or join a class with a code, manage subjects, and contribute or refine assignment deadlines.

## 2. Target Users & Environment
- **Target Users**: Students accessing the board primarily via mobile and desktop browsers. Class representatives (Class Leaders) help maintain information accuracy with rollback controls.
- **Identity & Class Creation Model**:
  - Any student can create their own class (specifying Class Name, their Name, Email). The creator automatically becomes the designated **Class Leader**.
  - Class Leaders can transfer/reassign leadership to any classmate once they join.
  - Students join an existing class by entering the class code provided by their Class Leader, plus their name and email.
  - Supports local simulated/mock email auth offline (no .env needed) and Supabase backend when configured.

## 3. Core Features (Scope)
1. **Interactive Editorial Landing Page**:
   - Full landing page at the root route for unauthenticated visitors.
   - Interactive mouse-reactive hero canvas (orbital dots fluidly evading cursor).
   - High-contrast editorial typography, value bento cards, dark moss showcase banner, 3-step workflow, FAQ accordion, and dual CTAs ("Create a Class" and "Join with Code").
2. **Class Creation & Class Join**:
   - Create class with automatic unique class code generation and creator designated as Class Leader.
   - Join class by entering code, student email, and name.
   - Leadership reassignment feature allowing the current Class Leader to transfer the leader role to another student.
   - Persistent local session and leave class capability.
3. **Class Subjects Directory (Classroom Code Removed)**:
   - List subjects with assigned teacher names.
   - Add, edit, and delete subjects without requiring a classroom code (verified that Google Classroom API does not query coursework by classroom code).
4. **Crowdsourced Deadline Board**:
   - Grouped views: *Needs a date*, *Overdue*, *Due today*, *This week*, *Later*, and *Done*.
   - Minimalist bento summary metrics strip (overdue, today, missing date).
   - Filter by subject and completion state.
5. **Assignment Management**:
   - Add new assignment with title, subject, optional due date (`YYYY-MM-DD`), and notes.
   - Edit assignment details with change recording.
   - Toggle completion status.
   - All edits track and attribute student display name and email.
6. **Edit History & Class Leader Rollback**:
   - Audit trail capturing field modified, previous value, updated value, editor display name, editor email, and timestamp.
   - Role-based rollback: only the designated Class Leader can revert edits.
7. **Classroom Import Add-on (Feature Flagged)**:
   - Behind `VITE_FEATURE_CLASSROOM_IMPORT` (default OFF).
   - Coursework import by selecting enrolled Google Classroom course or using Quick Paste titles; classroom code auto-matching removed.

## 4. Architectural & Technical Decisions
- **Frontend Stack**: Vite, React 19, TypeScript (strict), Tailwind CSS, React Router (HashRouter).
- **Design System**: Warm stone aesthetic (`#FAF9F5`), high-contrast ink (`#141413`), dark moss contrast card (`#162417`), editorial serif headlines (`Playfair Display` / serif), Inter body, pill buttons with indicator dots.
- **Storage Seam (`AcedRepository`)**: UI relies entirely on async repository abstraction:
  - `LocalRepository`: LocalStorage (`aced.db.v1`) with seed class `ACED2026`, subjects, assignments, and edit history.
  - `SupabaseRepository`: Supabase Postgres/RLS backend.
  - Safe env reader (`src/lib/env.ts`).
- **Deterministic Dates**: Stored strictly as `'YYYY-MM-DD'`. "Today" determined via `getToday()`.

## 5. Out of Scope
- Google OAuth requirement for the core app (remains zero-config offline capable).
- Hiding assignments automatically after their deadline passes.
- File uploads, binary attachments, push notifications.
