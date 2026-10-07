# Database Schema & Supabase Setup

This directory and `supabase/schema.sql` define the database structure for the optional Supabase backend.

> **Notice**: As specified in project constraints, this SQL file has **not** been run against a live Supabase project during development, build, or automated testing. The primary app runs zero-config offline using `LocalRepository` (`aced.db.v1`).

---

## 1. Schema Structure

The PostgreSQL schema (`supabase/schema.sql`) contains four primary relational tables:

1. **`classes`**:
   - `id` (UUID PK): Unique class identifier.
   - `code` (TEXT UNIQUE): Human-readable class join code (e.g., `ACED2026`).
   - `name` (TEXT): Descriptive class name (e.g., `"Class of 2026 — Period 3"`).
   - `created_at` (TIMESTAMPTZ): Class creation timestamp.

2. **`subjects`**:
   - `id` (UUID PK): Unique subject identifier.
   - `class_id` (UUID FK): References `classes.id` (cascading delete).
   - `name` (TEXT): Subject title (e.g., `"AP Calculus BC"`).
   - `teacher_name` (TEXT): Name of the teacher instructing the course.
   - `classroom_code` (TEXT, Nullable): Optional Google Classroom code.
   - `created_at` (TIMESTAMPTZ).

3. **`assignments`**:
   - `id` (UUID PK): Unique assignment identifier.
   - `class_id` (UUID FK): References `classes.id` (cascading delete).
   - `subject_id` (UUID FK): References `subjects.id` (cascading delete).
   - `title` (TEXT): Title of the assignment.
   - `due_date` (TEXT, Nullable): Plain `'YYYY-MM-DD'` date string.
   - `notes` (TEXT, Nullable): Optional student notes or instructions.
   - `completed` (BOOLEAN): Completion status.
   - `created_at` / `updated_at` (TIMESTAMPTZ): Tracked automatically via PostgreSQL trigger.

4. **`edit_history`**:
   - `id` (UUID PK): Audit log identifier.
   - `class_id` (UUID FK): References `classes.id`.
   - `assignment_id` (UUID FK): References `assignments.id` (`ON DELETE SET NULL`).
   - `assignment_title` (TEXT): Preserved title of the modified assignment.
   - `field` (TEXT): Field that was modified (`dueDate`, `notes`, `title`, `completed`, etc.).
   - `before_value` / `after_value` (TEXT, Nullable): State diff.
   - `editor_name` (TEXT): Student display name who made the edit.
   - `timestamp` (TIMESTAMPTZ): Edit timestamp.
   - `reverted` (BOOLEAN): Tracks whether the edit has been undone.
   - `reverted_by` / `reverted_at` (TEXT / TIMESTAMPTZ, Nullable): Attributed revert tracking.

---

## 2. Row Level Security (RLS) & Triggers

- **RLS Enabled**: All tables enforce Row Level Security.
- **Student Policies**: Open read/write policies allow anonymous student collaboration based on the shared class code without requiring user account sign-ups or OAuth credentials.
- **Triggers**: `update_updated_at_column()` automatically maintains `assignments.updated_at`.

---

## 3. Manual Steps to Deploy on Supabase

To connect a live Supabase project:

1. Create a project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in the Supabase Dashboard.
3. Paste the contents of `supabase/schema.sql` and run the script.
4. Obtain your Project URL and Anon Public Key from **Project Settings > API**.
5. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in your environment (or `.env` file).
6. Start the development server (`npm run dev`). The app factory in `src/lib/storage/index.ts` will automatically detect the credentials and switch to `SupabaseRepository`.
