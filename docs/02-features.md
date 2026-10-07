# 02 — Features

Aced delivers a cohesive set of features that address crowdsourced deadline tracking without external API dependencies:

---

## 1. Class Join & Student Session
- Students enter a display name and class code (`ACED2026`) to join their class board.
- Instant demo code autofill button (`Fill Demo Code`) speeds up evaluation.
- Local session persists across app reloads.
- Students can leave or switch classes anytime.

---

## 2. Crowdsourced Deadline Board
- **Grouped Views**: Automatically partitions assignments into six intuitive status buckets:
  1. *Needs a date* (assignments announced without a confirmed deadline)
  2. *Overdue* (past deadlines)
  3. *Due today* (critical tasks due today)
  4. *This week* (upcoming within 7 days)
  5. *Later* (future assignments)
  6. *Done* (completed tasks)
- **Summary Metrics Strip**: Highlights key counts for Overdue, Due Today, and Needs Date with dedicated icons and badges.
- **Subject Filtering**: Quick filter pills to view assignments for specific subjects, with quick reset to show all.
- **Completion Checkbox**: 44px+ tap target to mark an assignment complete/incomplete, moving it to/from the Done group immediately.

---

## 3. Assignment Creation & Editing
- Accessible modal dialog for adding assignments.
- Supports title (required), subject selection, optional `YYYY-MM-DD` date, and notes/instructions.
- Inline validation prevents invalid date formats.
- Editing an assignment updates details and automatically logs an audit trail.

---

## 4. Class Subjects Directory
- Lists all registered class subjects with assigned teacher name and optional Google Classroom code.
- Add and edit subject modal dialog with form validation.

---

## 5. Edit Attribution & One-Tap Undo
- Complete audit history recording modified field, previous value, updated value, editor student name, and timestamp.
- One-tap revert action opens a confirmation dialog showing before/after diffs.
- Confirming revert restores prior state and attributes the undo action in history.

---

## 6. Classroom Import Seam (Feature Flagged)
- Built behind `VITE_FEATURE_CLASSROOM_IMPORT` (default OFF).
- Decoupled `ClassroomProvider` interface with offline `NoopClassroomProvider`.
- Completely absent from the DOM when disabled.
