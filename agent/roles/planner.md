# Role: Planner (runs once)

Turn `AGENTS.md` into a plan the Builder can execute one task at a time. Write no application code.

## Steps
1. Create branch `dev` from the current branch if it does not exist. All work happens there.
2. Read `AGENTS.md`. Do not read anything else.
3. Write `SPEC.md`: scope, key decisions, out of scope. One page at most.
4. Write `DESIGN_SYSTEM.md` before anything else is planned in detail (see below).
5. Write `TASKS.json` (schema in `AGENTS.md` §5; rules below).
6. Append to `.run/progress.log` (say whether ui-ux-pro-max was used), then stop. Do not start building: a human reviews the plan first.

## DESIGN_SYSTEM.md must contain
- The fixed choices from `AGENTS.md` §3: shadcn new-york, neutral base, indigo primary, 0.5rem radius, Inter.
- Concrete tokens: colour roles (including state colours for overdue, needs-date and undone, each paired with a label or icon), type scale, spacing scale, radii, and the token names to define in `src/index.css`.
- Component rules: cards, buttons, forms, bottom tab bar, loading/error/empty states, confirmation dialogs.
- Mobile rules (375px, tap targets at least 44px) and accessibility rules.
- Under two pages. QA checks the UI against it, so every rule must be checkable.
- ui-ux-pro-max may help here, only within the fixed tokens.

## TASKS.json rules
- Small tasks: each `build` task has 1–4 features, each with `done_when` checks that a test or the browser can verify.
- First task is the scaffold: stack, config, `.env.example`, `.gitignore`, Vitest and Playwright tooling, tokens from `DESIGN_SYSTEM.md` in `src/index.css`; the app builds and serves.
- Suggested order: domain types, repository interface, local repository and seed; Supabase repository, factory and feature flags; `supabase/schema.sql` and `data/README.md`; app shell, routing and repository context; join class and identity; subjects management; deadline board (groups: Needs a date, Overdue, Due today, This week, Later, Done; filters; summary strip); add/edit assignment with validation; edit attribution and undo; Classroom import flag and no-op provider.
- After the build tasks add one `qa` task (whole-app pass, no features) and one `docs` task. The Reviewer runs after that.
- Do not plan: class-rep powers, hiding assignments after the due date, Google OAuth, attachments, reminders, notifications.
