# 06 — Bugs Found and Fixed

During the autonomous workflow execution across Builder and QA steps, several concrete issues were identified during gate checks and resolved:

---

### Bug 1: Unused React Type Declarations under Strict TypeScript
- **Discovered During**: T3 / T4 Type Check Gate (`npx tsc --noEmit`).
- **Symptom**: TypeScript reported `TS6133: 'React' is declared but its value is never read` and `TS6133: 'FC' is declared but its value is never read` across multiple components due to `noUnusedLocals: true`.
- **Root Cause**: React 19 JSX transform does not require importing `React` in `.tsx` files, and unused type aliases trigger compiler failures under strict settings.
- **Fix**: Removed redundant `React` default imports and converted components to standard named function exports (`export function AppHeader()`).

---

### Bug 2: NixOS Chromium Headless Binary Resolution
- **Discovered During**: T4 Playwright Test Gate (`npx playwright test`).
- **Symptom**: `browserType.launch: Executable doesn't exist at /home/lumi/.cache/ms-playwright/chromium_headless_shell-1243/...`.
- **Root Cause**: On NixOS, precompiled Playwright browser binaries cannot be dynamically downloaded via `npx playwright install`. Chromium is provided by the system Nix environment at `/etc/profiles/per-user/lumi/bin/chromium`.
- **Fix**: Updated `playwright.config.ts` to inspect `PLAYWRIGHT_LAUNCH_OPTIONS_EXECUTABLE_PATH` and automatically fall back to existing system Chromium paths via `fs.existsSync`.

---

### Bug 3: Strict Mode Multi-Element Collisions in Playwright & RTL
- **Discovered During**: T4, T5, and T6 component & e2e test execution.
- **Symptom**:
  - `strict mode violation: getByText('Class of 2026 — Period 3') resolved to 2 elements`.
  - `Found multiple elements with the role "button" and name "/add subject/i"` (page header button vs. modal dialog submit button).
  - `Found multiple elements with the text: Overdue` (metrics strip card vs. board group heading).
- **Root Cause**: Identical visible text and role names were present on both top-level navigation / metrics and section headers or modal dialogs.
- **Fix**: Scoped queries appropriately using `within(dialog)`, `within(summary)`, and `page.getByRole('dialog')` to ensure unambiguous selection.

---

### Bug 4: HTML5 Date Input Value Rejection in jsdom
- **Discovered During**: T7 Component Testing (`tests/components/assignment-modal.test.tsx`).
- **Symptom**: Setting an invalid test date string (e.g. `'2026-99-99'`) resulted in an empty string in jsdom rather than testing our application-level format validator.
- **Root Cause**: jsdom strictly enforces `<input type="date">` and resets invalid values to `""` before event handlers receive the input.
- **Fix**: Configured the due date input as `type="text" placeholder="YYYY-MM-DD"`, allowing arbitrary user inputs to be validated by our `isValidDateString` helper with accessible inline error messages.
