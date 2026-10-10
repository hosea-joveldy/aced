# AGENTS.md — Aced

Shared rules for the autonomous agent in this repo. Humans own this file and the role files; the agent never edits them.

**Mode: autonomous.** A single continuous session acts sequentially across roles by reading and executing each corresponding role file in `agent/roles/` (`planner.md`, `builder.md`, `qa.md`, and `reviewer.md`) until the MVP is completed or blocked.

## 1. Project
**Problem:** Students miss deadlines because teachers announce assignments inconsistently: some use Google Classroom but set no due date, some don't use it at all, others announce in chat groups or verbally. There is no single reliable place to see all deadlines.

**Idea:** Aced is a crowdsourced deadline board per class. Students join with a class code, see the class's subjects (with teacher and Google Classroom code), and any student can add or fix assignments and deadlines. Optionally, Google Classroom import fills in what teachers posted, with missing due dates flagged for classmates to complete.

**Users:** Students, mainly on phones. Class representatives help keep info accurate.

**Context:** A school assignment (theme: apps that solve school problems). Keep it simple enough to finish and demo: defined problem, target users, at least 3 features, clean UI, automated tests.

## 2. Constraints
- Any student in a class can edit shared info (intentional), so wrong edits must be easy to spot and undo.
- The core app must work with no `.env` and without the Google Classroom API. Classroom import is an add-on behind `VITE_FEATURE_CLASSROOM_IMPORT` (default OFF) and must never block the core.
- UI copy is English.
- All state lives in the files in §5. Do not rely on chat history memory across iterations.

## 3. Stack and decisions (fixed, do not change)
- Vite + React 19 + TypeScript (strict), Tailwind CSS, shadcn/ui (new-york style, neutral base, indigo primary, 0.5rem radius, Inter font), React Router with hash-based routing, Vitest + React Testing Library, Playwright (e2e). Backend: Supabase (Postgres, Auth, Realtime, RLS) behind a storage seam.
- Storage seam: All UI code depends only on an async `AcedRepository` interface and never imports `@supabase/supabase-js`. Two implementations: `LocalRepository` (localStorage under key `aced.db.v1` plus bundled seed data; used when Supabase env vars are missing) and `SupabaseRepository` (used when `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are both set). `createRepository()` in `src/lib/storage/index.ts` picks one.
- All env access goes through `src/lib/env.ts`, which never throws and exports `isSupabaseConfigured` and `classroomImportEnabled`.
- Dates are plain `'YYYY-MM-DD'` strings. "Today" comes from an injectable `getToday()` helper, never `new Date()` inside components.
- Identity & Auth: Students authenticate with email + display name + class code. Supports local simulated/mock email auth when running offline (no .env), and Supabase Auth when configured. Each class has one designated Class Leader (representative).
- Undo & Rollback: Every edit records field, before value, after value, and editor email/name. Only the designated Class Leader has permission to revert or rollback changes from the edit history. Regular students can view the history audit log but cannot perform rollbacks.
- Google Classroom sits behind a `ClassroomProvider` interface whose only implementation is a no-op. When the flag is off, the Classroom UI is absent from the DOM entirely.
- Seed data (local mode): one class (code `ACED2026`, name "Class of 2026 — Period 3"), exactly 6 subjects with teacher names and one or two Classroom codes, at least 9 assignments (at least 4 without a due date, 3 overdue, 2 due today or tomorrow, 1 done, spread over all 6 subjects) and at least 3 pre-existing edits so history and undo are demonstrable.

## 4. Autonomous Workflow & Roles
The agent executes the workflow sequentially in this single session, reading the role files for exact steps:

1. **Planning Step (Planner):**
   - Read `agent/roles/planner.md` and execute all planning instructions.
   - Create and check out the `dev` branch.
   - Draft `SPEC.md`, `DESIGN_SYSTEM.md`, and initial `TASKS.json`.
   - Commit the plan.

2. **Per-Task Execution Loop:**
   - Find the next task with `status: "todo"` in `TASKS.json`. Set its status to `ongoing`.
   - **Build Step (Builder):**
     - Read `agent/roles/builder.md` and implement the task's features in `src/`.
     - Make a git commit for each completed feature: `<feature id>: <title>`.
   - **QA Step (QA):**
     - Read `agent/roles/qa.md`.
     - Write and run unit/component tests in `tests/` and e2e tests in `e2e/`.
     - Run the gate commands in §6.
     - If checks fail: Switch back to `agent/roles/builder.md` instructions to fix implementation code in `src/` (do NOT weaken tests). Repeat up to 3 fix rounds. If still failing, write `.run/blocked.txt` and halt.
     - When all checks pass: Mark features `done: true` and the task `status: "finished"` in `TASKS.json`. Append at most 5 lines to `.run/progress.log`.

3. **Review Step (Reviewer):**
   - When all build tasks in `TASKS.json` are marked `finished`, read `agent/roles/reviewer.md`.
   - Run the final full-app test suite, audit code and contracts against `SPEC.md`, and write findings to `REVIEW.md`.

## 5. State files
- `SPEC.md`: Scope, technical decisions, out-of-scope items (written by Planner).
- `DESIGN_SYSTEM.md`: Tokens, palette, typography, layout rules (written by Planner).
- `TASKS.json`: Kanban tracking tasks and feature-level `done_when` criteria.
- `QA_REPORT.md` & `REVIEW.md`: Bug logs and post-build audit.
- `.run/progress.log`: Append-only task log.
- `.run/blocked.txt`: Escalations for human assistance. If created, the agent must halt.

## 6. Commands & Gate Checks
- Types: `npx tsc --noEmit`
- Unit/Component Tests: `npm test` (`vitest run --passWithNoTests`)
- Build: `npm run build`
- E2E Tests: `npx playwright test`
- All 4 commands must pass with exit code 0 before any task is marked `finished`.

## 7. Machine & Environment Safety
- Never read, create, or modify `.env` files.
- NixOS safety: Never run `npx playwright install`. Playwright must read `process.env.PLAYWRIGHT_LAUNCH_OPTIONS_EXECUTABLE_PATH`.
- No live Supabase/network calls during builds or tests.
- Allowed Git operations: `git status`, `git diff`, `git log`, `git add`, `git commit`, `git checkout -b dev`.
