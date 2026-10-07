# Aced 🎯

> **Crowdsourced Deadline Board per Class**  
> A simple, mobile-first web app solving school homework tracking. Any classmate can add, update, or fix assignment deadlines, with transparent edit history and one-tap undo.

---

## 1. Problem & Solution

### The Problem
Students frequently miss deadlines because teachers announce homework haphazardly:
- Some post on Google Classroom without setting a due date.
- Some do not use Classroom at all, relying on verbal announcements or whiteboards.
- Others announce deadlines in ephemeral group chat messages.

### The Solution
**Aced** provides a single, reliable source of truth per class:
1. **Join Instantly**: Enter your name and class code (`ACED2026`). No passwords, emails, or Google OAuth logins.
2. **Crowdsourced Board**: See all assignments grouped by urgency (*Needs a date*, *Overdue*, *Due today*, *This week*, *Later*, and *Done*). Any student can add an assignment or fill in missing due dates.
3. **One-Tap Undo**: Every edit is recorded in an audit log with editor attribution. Mistakes or incorrect dates can be reverted with one tap.
4. **Subjects Directory**: Find course teachers and Google Classroom codes in one place.

---

## 2. Quickstart & Zero-Config Demo

Aced is designed to run completely offline with zero configuration out of the box:

```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser:
- On the join screen, enter your name and class code **`ACED2026`** (or click **"Fill Demo Code"**).
- You will immediately enter the bundled demo class (**"Class of 2026 — Period 3"**) with 6 subjects, 10 pre-loaded assignments, and demonstrable edit history.

---

## 3. Technology Stack & Architecture

- **Frontend**: React 19, TypeScript (strict mode), Vite, Tailwind CSS, Lucide icons, React Router (HashRouter).
- **Design System**: shadcn/ui (`new-york` style, neutral base, indigo primary, 0.5rem radius, Inter typography), mobile-first 375px responsive layout, 44px+ tap targets.
- **Storage Seam**: UI depends exclusively on the async `AcedRepository` interface:
  - `LocalRepository`: Local storage persistence under key `aced.db.v1` with bundled seed data (default).
  - `SupabaseRepository`: Optional Postgres/RLS backend when configured.
  - See [`data/README.md`](data/README.md) for database schema and setup.
- **Deterministic Dates**: All dates use strictly plain `'YYYY-MM-DD'` strings and an injectable `getToday()` helper.
- **Classroom Import**: Built behind `VITE_FEATURE_CLASSROOM_IMPORT` (default OFF) with an offline no-op provider. When disabled, the UI is completely omitted from the DOM.

---

## 4. Testing & Build Verification

Aced is covered by an automated test suite with 100% pass rates:

```bash
# Run unit & component tests (Vitest + React Testing Library)
npm test

# Run end-to-end browser tests (Playwright with system Chromium)
npx playwright test

# Check TypeScript types
npx tsc --noEmit

# Production build
npm run build
```

---

## 5. Documentation

Detailed project documentation is available in the [`docs/`](docs/) directory:
- [`docs/01-problem-and-users.md`](docs/01-problem-and-users.md): Problem breakdown and student personas.
- [`docs/02-features.md`](docs/02-features.md): Feature overview.
- [`docs/04-wireframes.md`](docs/04-wireframes.md): Mobile wireframes (375px).
- [`docs/05-test-results.md`](docs/05-test-results.md): Real test suite output and coverage.
- [`docs/06-bugs-and-fixes.md`](docs/06-bugs-and-fixes.md): Log of real bugs encountered and resolved.
- [`docs/07-ai-usage-log.md`](docs/07-ai-usage-log.md): AI usage disclosure and pipeline logs.
- [`data/README.md`](data/README.md): Database schema and optional Supabase instructions.
