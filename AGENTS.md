# AGENTS.md — Aced

Shared rules for every agent in this repo. Read this fully, then read only your own role file in `agent/roles/`. Humans own this file and the role files; agents never edit them.

**Mode: manual.** A human starts each session and the Builder commits. When a loop script exists, switch to **Mode: scripted**: the script starts sessions and owns commits and task `status`, and agents stop committing.

## 1. Project
**Problem:** Students miss deadlines because teachers announce assignments inconsistently: some use Google Classroom but set no due date, some don't use it at all, others announce in chat groups or verbally. There is no single reliable place to see all deadlines.

**Idea:** Aced is a crowdsourced deadline board per class. Students join with a class code, see the class's subjects (with teacher and Google Classroom code), and any student can add or fix assignments and deadlines. Optionally, Google Classroom import fills in what teachers posted, with missing due dates flagged for classmates to complete.

**Users:** Students, mainly on phones. Class representatives help keep info accurate.

**Context:** a school assignment (theme: apps that solve school problems). It must show a defined problem, target users, at least 3 features, a simple UI, AI-assisted building, testing and bug fixing. Keep it simple enough to finish and demo.

## 2. Constraints
- Any student in a class can edit shared info (intentional), so wrong edits must be easy to spot and undo.
- The core app must work with no `.env` and without the Google Classroom API. Classroom import is an add-on behind `VITE_FEATURE_CLASSROOM_IMPORT` (default OFF) and must never block the core.
- UI copy is English.
- Harness-neutral: nothing here depends on one tool. The files in §5 are the contract between sessions and between harnesses.

## 3. Stack and decisions (fixed, do not change)
- Vite + React 19 + TypeScript (strict), Tailwind CSS, shadcn/ui (new-york style, neutral base, indigo primary, 0.5rem radius, Inter font), React Router with hash-based routing (works on static hosting), Vitest + React Testing Library, Playwright (e2e). Backend: Supabase (Postgres, Auth, Realtime, RLS) behind a storage seam.
- Storage seam: all UI code depends only on an async `AcedRepository` interface and never imports `@supabase/supabase-js`. Two implementations: `LocalRepository` (localStorage under key `aced.db.v1` plus bundled seed data; used when Supabase env vars are missing) and `SupabaseRepository` (used when `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are both set). `createRepository()` in `src/lib/storage/index.ts` picks one.
- All env access goes through `src/lib/env.ts`, which never throws and exports `isSupabaseConfigured` and `classroomImportEnabled`.
- Dates are plain `'YYYY-MM-DD'` strings. "Today" comes from an injectable `getToday()` helper, never `new Date()` inside components.
- Identity is a display name + class code, stored locally. No OAuth, no email/password.
- Undo is first-class edit history: every edit records field, before value, after value and editor; a one-tap revert restores the before value and marks that edit as undone.
- Google Classroom sits behind a `ClassroomProvider` interface whose only implementation is a no-op. When the flag is off, the Classroom UI is absent from the DOM entirely.
- Seed data (local mode): one class (code `ACED2026`, name "Class of 2026 — Period 3"), exactly 6 subjects with teacher names and one or two Classroom codes, at least 9 assignments (at least 4 without a due date, 3 overdue, 2 due today or tomorrow, 1 done, spread over all 6 subjects) and at least 3 pre-existing edits so history and undo are demonstrable.

## 4. Workflow
- Roles: **Planner** (once), **Builder** (per task), **QA** (verifies each build task), **Reviewer** (once, at the end). Steps are in `agent/roles/<role>.md`.
- One task per fresh session, then stop. Memory lives in the files in §5, never in chat history.
- Flow: Planner writes the plan and stops for human approval. Then per task: Builder → gate → QA → fix loop → commit. After the last build task: Reviewer.
- Fix loop: QA reports, Builder fixes. Max 3 rounds per task, then write `.run/blocked.txt` and stop.
- Task types: `build` (has features, one commit per feature), `qa` (no features, no commit: whole-app test pass), `fix` (from `QA_REPORT.md` or `REVIEW.md`; goes straight to the Builder, never back to the Planner), `docs`.
- Gate = plain commands, no AI needed, same result every run: `npx tsc --noEmit`, `npm test`, `npm run build`, `npx playwright test`. All four must pass before QA signs off.
- Keep context small: read only your task, the files it touches, and `DESIGN_SYSTEM.md` for UI work. Do not re-read the whole repo.

## 5. State files (the contract)
- `SPEC.md`: scope, decisions, out of scope (Planner).
- `DESIGN_SYSTEM.md`: written by the Planner before any code; the Builder implements it as tokens in `src/index.css`; QA checks UI against it.
- `TASKS.json`: the kanban, below.
- `QA_REPORT.md`: QA findings with ids (B1, B2…). `REVIEW.md`: Reviewer findings (R1, R2…).
- `.run/progress.log`: append-only, at most 5 lines per session (task id, what was done, gotchas). Committed.
- `.run/blocked.txt`: a question for the human. Write it, then stop. `.run/screenshots/`: browser evidence. Both gitignored.

```json
{"tasks":[
 {"id":"T1","title":"Scaffold","type":"build","status":"todo",
  "features":[{"id":"T1.1","title":"…","done":false,"done_when":["npm run build passes"]}]},
 {"id":"T8","title":"Full-app QA pass","type":"qa","status":"todo","features":[]},
 {"id":"T9","title":"Fix B1","type":"fix","status":"todo","source":"QA_REPORT.md#B1","features":[]}
]}
```
- `status` is `todo`, `ongoing` or `finished`. Only one task is `ongoing`. Set `finished` only after the gate and QA pass.
- Agents may change only `status` and a feature's `done`. QA and the Reviewer may append `fix` tasks (with one feature each). Never rename tasks or edit `done_when`. In scripted mode the script owns `status`.

## 6. Commands
- Install: `npm install` (use `npm ci` when a lockfile exists).
- Unit/component tests: `npm test`, which must be `vitest run --passWithNoTests`, never watch mode. Never run bare `vitest`.
- E2E: `npx playwright test`. Build: `npm run build`. Types: `npx tsc --noEmit`.
- App command: `npm run build && npx vite preview --host 127.0.0.1 --port 3000 --strictPort`. The built app is served at http://localhost:3000.
- Only QA may start the app command, when port 3000 does not answer, in the background for browser checks, and must stop it afterwards. Playwright's `webServer` starts its own copy for e2e. The Builder never starts servers (`npm run dev`, `vite`).
- Add new dependencies only if the feature needs them, and say why in your final message.

## 7. Environment, Supabase and secrets
- `.env` belongs to the human. Never read, create or edit any `.env` file. Every variable the app needs is listed in `.env.example` with empty or placeholder values, read through `src/lib/env.ts`, with safe defaults. Keep `.env`, `.env.*` (except `.env.example`), `node_modules`, `dist`, `coverage`, `test-results`, `playwright-report`, `.run/screenshots` and `.run/blocked.txt` in `.gitignore`.
- Never run anything against Supabase and never make network calls to it. All SQL lives in one re-runnable file, `supabase/schema.sql` (tables, RLS policies, triggers; use `drop policy if exists`, `create or replace function`, `create extension if not exists`). Update it whenever the domain model changes. `data/README.md` explains the manual steps and states that the SQL has not been run against a live project.
- Never hard-code URLs, keys or project ids.
- This machine is NixOS: Chromium comes from the system. Never run `npx playwright install`. `playwright.config.ts` sets Chromium's `executablePath` from env `PLAYWRIGHT_LAUNCH_OPTIONS_EXECUTABLE_PATH` when it is set, and uses Playwright's default otherwise.

## 8. Tests
- QA alone writes tests. The Builder never creates or edits files in `tests/`, `e2e/` or any `*.test.*` / `*.spec.*` file. QA never edits `src/`: if a test needs a hook such as `data-testid`, QA lists it in `QA_REPORT.md` and the Builder adds it.
- Vitest: `tests/`, mirroring `src/` (for example `tests/lib/storage/local.test.ts`), importing app code through the `@/` alias. Shared helpers go in `tests/helpers/`.
- Playwright: `e2e/`, one spec per UI feature, Chromium only, headless. Find elements with `getByRole`, `getByLabel`, `getByText`; use `data-testid` only when none fits. Join the demo class through the UI (code `ACED2026`). No fixed sleeps.
- The Builder owns the tooling: `vitest.config.ts` (jsdom, globals, `@/` alias, `setupFiles: ['./src/test/setup.ts']`, include `tests/**/*.test.{ts,tsx}` only), `src/test/setup.ts` (jest-dom matchers, clear localStorage before each test, report Supabase as not configured, make any `fetch` call fail the test) and `playwright.config.ts` (`testDir: 'e2e'`, the app command as `webServer` with `reuseExistingServer`).
- Tests are offline and deterministic: cleared localStorage, pinned today, zero network calls.

## 9. Browser verification (QA)
- The first time a UI feature is verified, QA uses the harness's browser tool at 375px and 1280px (plus the Chrome DevTools tool for console or network errors when something looks wrong), saves screenshots to `.run/screenshots/`, then turns what it checked into an e2e spec.
- Do not re-drive the browser for regression: `npx playwright test` does that for free. Use the browser tool again only for new UI, visual checks against `DESIGN_SYSTEM.md`, or when the human asks.

## 10. Design
- `DESIGN_SYSTEM.md` is the source of truth. Its tokens live in `src/index.css` and the shadcn components: define colors, fonts, radii and spacing there once. Do not hard-code one-off values.
- Mobile-first: usable at 375px with no horizontal scroll, single column, tap targets at least 44px, bottom tab bar.
- Never use colour alone for state (overdue, needs-date, undone): add a label or icon.
- Every screen has loading, error and empty states. Destructive actions ask for confirmation.
- The ui-ux-pro-max skill is optional, for the Planner only, only within the tokens in §3. Builder and QA read the file and do not load the skill.

## 11. Git
- All work happens on branch `dev` (the Planner creates it). Never touch other branches.
- Manual mode: the Builder commits once per feature after its checks pass, message `<feature id>: <title>`. A `qa` task makes no commit.
- Allowed: `git status`, `diff`, `log`, `add`, `commit`. Never `reset`, `rebase`, `commit --amend`, `merge`, `push`, `stash` or any force option. Never commit `.env`, `node_modules` or build output.
- Scripted mode: agents do not commit.

## 12. Definition of done (per feature)
- [ ] Every `done_when` check in `TASKS.json` is verified.
- [ ] `npx tsc --noEmit`, `npm test`, `npm run build` and `npx playwright test` pass.
- [ ] Features already finished still work.
- [ ] UI features checked at 375px and 1280px against `DESIGN_SYSTEM.md`.
- [ ] `.run/progress.log` updated.

## 13. Rules for all agents
- Stay in your role and your task. Note unrelated problems in your final message instead of fixing them.
- If something is ambiguous or needs a human decision, write the question to `.run/blocked.txt` and stop. Do not guess.
- Never claim something works without running it. Never mark a task `finished` on your own say-so: the gate and QA decide.
- Do not edit `AGENTS.md`, role files, or another role's outputs.
