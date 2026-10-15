# DESIGN_SYSTEM.md — Aced Design System (Revised UI)

## 1. Stack & System Foundations
- **UI Framework**: shadcn/ui (`new-york` style, `neutral` base).
- **Typography**: Inter (`font-sans`), system font fallback. Base body size: 16px for form inputs and body readability.
- **Primary Theme Color**: Indigo (`hsl(243, 75%, 59%)`).
- **Base Border Radius**: `0.5rem` (`8px`).
- **Target Form Factor**: Mobile-first (minimum width: 375px), fluid single-column mobile layout, transitioning to a desktop shell (>= 768px / 1024px) featuring a persistent sidebar and multi-column grids.

## 2. Token Definitions (`src/index.css`)
All tokens defined as HSL channel values in `:root`:

```css
:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 9%;
  --card: 0 0% 100%;
  --card-foreground: 0 0% 9%;
  --popover: 0 0% 100%;
  --popover-foreground: 0 0% 9%;
  --primary: 243 75% 59%;          /* Indigo 600 */
  --primary-foreground: 0 0% 100%;
  --secondary: 0 0% 96%;
  --secondary-foreground: 0 0% 9%;
  --muted: 0 0% 96%;
  --muted-foreground: 0 0% 45%;
  --accent: 243 100% 97%;
  --accent-foreground: 243 75% 59%;
  --destructive: 0 84% 60%;
  --destructive-foreground: 0 0% 98%;
  --border: 0 0% 90%;
  --input: 0 0% 90%;
  --ring: 243 75% 59%;
  --radius: 0.5rem;

  /* Domain Semantic State Tokens */
  --state-overdue: 0 84% 60%;          /* Crimson / Red */
  --state-overdue-bg: 0 100% 97%;
  --state-needs-date: 38 92% 50%;      /* Amber / Orange */
  --state-needs-date-bg: 48 100% 96%;
  --state-today: 243 75% 59%;           /* Indigo */
  --state-today-bg: 243 100% 97%;
  --state-done: 142 71% 45%;           /* Emerald */
  --state-done-bg: 142 76% 96%;
  --state-undone: 215 16% 47%;         /* Slate */
  --state-undone-bg: 210 40% 96%;
}
```

## 3. Semantic States & Non-Color Discrimination
Colour is never used alone to convey state. Every status badge or alert pairs color with both an icon and a text label:
- **Overdue**: Crimson border/text (`text-red-700 bg-red-50 border-red-200`) + AlertCircle icon + text label `"Overdue"`.
- **Needs Due Date**: Amber border/text (`text-amber-800 bg-amber-50 border-amber-200`) + HelpCircle / Clock icon + text label `"Needs date"`.
- **Due Today**: Indigo border/text (`text-indigo-700 bg-indigo-50 border-indigo-200`) + Calendar icon + text label `"Due today"`.
- **Completed**: Emerald border/text (`text-emerald-700 bg-emerald-50 border-emerald-200`) + CheckCircle icon + text label `"Done"`.
- **Reverted / Undone**: Slate border/text (`text-slate-600 bg-slate-100 border-slate-300`) + RotateCcw icon + text label `"Reverted"`.

## 4. Typography Scale & Spacing
- **Typography Scale**:
  - `text-xs`: 12px / line-height 16px (metadata, badges, pill tags).
  - `text-sm`: 14px / line-height 20px (helper text, secondary attributes, tab bar labels).
  - `text-base`: 16px / line-height 24px (body, input text to prevent mobile iOS auto-zoom).
  - `text-lg`: 18px / line-height 28px (subheaders, card titles).
  - `text-xl`: 20px / line-height 28px (modal titles, section headers).
  - `text-2xl`: 24px / line-height 32px (main screen headers).
- **Spacing Scale**: 4px base (`p-2` = 8px, `p-3` = 12px, `p-4` = 16px, `p-6` = 24px). Gap scale: `gap-2` (8px), `gap-3` (12px), `gap-4` (16px).
- **Border Radii**: Container cards `rounded-lg` (8px), controls/inputs `rounded-md` (6px), chips/pills `rounded-full`.

## 5. Wireframe UI Architecture & Layout Rules

### 5.1 Responsive App Shell
- **Desktop (>= 768px / 1024px)**:
  - Persistent left sidebar (`width: 220px-240px`) containing:
    - Bold "Aced" logo with orbital accent icon.
    - Navigation menu: **Board**, **Subjects**, **History** with active pill indicator.
    - User "Me" footer card: Circular avatar with user initials, user display name, class code, Class Leader badge, and leave button.
  - Main scrollable content pane with clean top header, search/actions bar, and responsive grid layout.
- **Mobile (< 768px)**:
  - Sticky top header (`AppHeader`) with logo, active class name, and user actions.
  - Fixed bottom tab bar (`BottomTabBar`) with minimum 44px × 44px touch targets.
  - `pb-24` padding to ensure content is never obscured by the tab bar.

### 5.2 Join Class Screen (Login)
- **Fullscreen Responsive Layout**:
  - **Full Viewport Edge-to-Edge**: The login page spans the entire viewport (`min-h-screen w-full`) without constrained container margins or redundant top headers.
  - **Left Artwork Pane (Desktop / Tablet lg+)**: Educational vector illustration (`ClassroomIllustration`) depicting a live classroom deadline board: weekly calendar grid, crowdsourced assignment cards ("Needs date" resolved by classmates, "Due today", "Done"), active class rep avatars, and academic achievement badges.
  - **Right Form Pane**: High-contrast, focused form with email, display name, Kahoot!-inspired large monospace class code input, instant demo autofill buttons (Student & Class Leader), accessible validation feedback, and transparent attribution footnote.
  - **Mobile (< lg)**: Fluid edge-to-edge layout with top educational badge, full-width inputs, and accessible 44px+ touch targets.

### 5.3 Board Screen
- **Header & Search**: Main title with live keyword search input (`Search assignments`) and `+ Add assignment` primary button.
- **Metric Summary Strip**: Apple Reminders-style 3-card grid: Overdue, Due today, Needs a date with large count figures and colored icons.
- **Filter Chips**: Horizontal pill chips for subject filtering ("All subjects", "Math", "Biology", etc.).
- **Grouped Sections**: Needs a date (with CTA note), Overdue, Due today, This week, Later, and Done, each with count pills.
- **Assignment Cards**: Horizontal cards with checkbox, subject tag, title, notes, and status pill tag (`Needs date`, `Today`, `Due YYYY-MM-DD`).

### 5.4 Subjects Screen
- **Classroom Cards**: 3-column desktop grid (1-column mobile) Google Classroom-style cards with:
  - 70px colored subject banner gradient.
  - Subject name, teacher name.
  - Classroom code badge with one-click copy button.
  - Assignment status pill ("X active · Y missing date") and quick add assignment button.

### 5.5 History Screen
- **Role Privilege Banner**: Distinct visual alert informing Class Leaders of rollback permissions and regular students of view-only access.
- **Filter Chips**: Filter by "All edits", "Due dates", "Titles", "Status".
- **Activity Feed**: Linear-style chronological feed with user avatar circle, change narrative, `[before] → [after]` diff comparison pills, and one-tap Revert button.

### 5.6 Modals & Confirmation Dialogs
- Accessible modal dialogs with backdrop scrim, explicit labels, keyboard focus trapping, inline validation, and clear confirm/cancel actions.
