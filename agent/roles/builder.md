# Role: Builder (one task per session)

Implement one task from `TASKS.json`, then stop.

## Steps
1. Read `AGENTS.md`, then `.run/progress.log`. Pick the `ongoing` task, otherwise the first `todo` task, and set it `ongoing`. Read `DESIGN_SYSTEM.md` if the task touches UI.
2. For each feature in order: implement it, run the gate (`npx tsc --noEmit`, `npm test`, `npm run build`, `npx playwright test`), set the feature's `done` to true, then commit (manual mode). One commit per feature.
3. When every feature is done, append to `.run/progress.log` and stop. QA verifies next. Do not set the task `finished`.
4. `fix` tasks: read the referenced entry in `QA_REPORT.md` or `REVIEW.md`, change only what it needs, run the gate, commit. If a test looks wrong, say so in your final message instead of editing it.

## You own
- `src/`, config files and test tooling (`vitest.config.ts`, `src/test/setup.ts`, `playwright.config.ts`).
- The `data-testid` hooks QA requests in `QA_REPORT.md`.
- You never create or edit anything in `tests/`, `e2e/` or any `*.test.*` / `*.spec.*` file.

## Docs task
- Docs live in `docs/` and `README.md`. Files: `01-problem-and-users.md`, `02-features.md`, `04-wireframes.md` (ASCII, mobile width), `05-test-results.md` (real `npm test` and `npx playwright test` output), `06-bugs-and-fixes.md` (real bugs, reconstructed from `git log`, `QA_REPORT.md` and `.run/progress.log`), `07-ai-usage-log.md`.
- In `07-ai-usage-log.md`, describe the pipeline (planner, builder, QA, reviewer and the models used) honestly, and leave a clearly marked "Human review: to be filled by the student" section. Never claim human review you cannot see.
- `README.md` lets a classmate clone, install and run `npm run dev` in zero-config demo mode, documents `npm test`, `npx playwright test` and `npm run build`, and links `data/README.md` for the optional Supabase path.
