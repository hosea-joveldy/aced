# 05 — Test Results

Automated test verification was executed with 100% pass rates across unit, component, and full-browser end-to-end suites.

---

## 1. Unit & Component Tests (`npm test`)

Runner: Vitest v3.2.7 (React Testing Library, jsdom environment)
Total Test Files: 10 passed
Total Tests: 29 passed

```text
 ✓ tests/lib/env.test.ts (2 tests)
 ✓ tests/lib/date.test.ts (3 tests)
 ✓ tests/lib/storage/factory.test.ts (2 tests)
 ✓ tests/lib/storage/local.test.ts (3 tests)
 ✓ tests/components/classroom.test.tsx (2 tests)
 ✓ tests/components/join.test.tsx (4 tests)
 ✓ tests/components/subjects.test.tsx (3 tests)
 ✓ tests/components/board.test.tsx (4 tests)
 ✓ tests/components/assignment-modal.test.tsx (4 tests)
 ✓ tests/components/history.test.tsx (2 tests)

 Test Files  10 passed (10)
      Tests  29 passed (29)
   Duration  2.16s
```

---

## 2. End-to-End Tests (`npx playwright test`)

Runner: Playwright v1.50.1 (Chromium headless, 375px mobile and 1280px desktop viewports)
Total Spec Files: 6 passed (8 specs executed)

```text
Running 8 tests using 6 workers, shard 1 of 1

  ✓ [chromium] › e2e/classroom.spec.ts:4:3 › Classroom Import Feature Flag Gating › ensures Classroom Import UI is completely absent from DOM when flag is off (3.7s)
  ✓ [chromium] › e2e/app-shell.spec.ts:52:3 › App Shell and Identity Flow › adapts layout cleanly on desktop viewport (1280px) (3.7s)
  ✓ [chromium] › e2e/app-shell.spec.ts:4:3 › App Shell and Identity Flow › allows student to join class and navigate on mobile viewport (375px) (4.7s)
  ✓ [chromium] › e2e/assignment-flow.spec.ts:4:3 › Assignment Creation and Editing Flow › creates new assignment, renders in correct group, and edits assignment (4.8s)
  ✓ [chromium] › e2e/board.spec.ts:4:3 › Deadline Board Flow › displays grouped assignments, filters by subject, and toggles completion (4.4s)
  ✓ [chromium] › e2e/full-app-walkthrough.spec.ts:4:3 › Full-App QA Comprehensive Walkthrough (375px mobile) › completes full student journey: join, board, add, edit, complete, subjects, history, revert, and leave (5.8s)
  ✓ [chromium] › e2e/history.spec.ts:4:3 › Edit Attribution and Undo Flow › lists edit history, opens confirmation dialog, and reverts an edit (2.4s)
  ✓ [chromium] › e2e/subjects.spec.ts:4:3 › Subjects Management Flow › lists subjects, adds a new subject, and edits an existing subject (2.3s)

  8 passed (17.3s)
```

---

## 3. TypeScript Typecheck & Production Build

- Types: `npx tsc --noEmit` exited with code 0.
- Production Build: `npm run build` completed successfully without errors.
