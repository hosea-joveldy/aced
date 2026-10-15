# DESIGN_SYSTEM.md — Aced Design System (Minimalist Dark Redesign)

## 1. Stack & System Foundations
- **UI Aesthetic**: High-contrast, minimalist dark interface inspired by `login-reference.png` (deep zinc `#09090b` canvas, `#18181b` card surfaces, subtle `#27272a` borders, pure white primary actions, and elegant editorial typography).
- **UI Framework**: shadcn/ui (`new-york` style, `neutral` dark base).
- **Typography**:
  - Headings / Editorial Accents: Serif Italic (`font-serif italic font-normal`) paired with clean Sans-serif (`font-sans font-medium` / `font-semibold`).
  - Body & UI: Inter (`font-sans`), system fallback. Base size: 16px for input fields and body text.
  - Codes / Identifiers: Monospace (`font-mono font-medium`).
- **Primary Action Color**: Crisp White (`#fafafa` / `hsl(0, 0%, 98%)`) with dark label (`#09090b`), hover: `bg-zinc-200`. No purple, violet, or heavy saturated gradients.
- **Base Border Radius**: `0.5rem` (`8px`) for cards and inputs, `rounded-full` for chips and pills, `rounded-2xl` for floating hero containers.
- **Form Factors**: Mobile-first (minimum width: 375px) with bottom tab bar; desktop shell (>= 768px / 1024px) with persistent left sidebar.

## 2. Token Definitions (`src/index.css`)
```css
:root {
  --background: 240 10% 3.9%;          /* Zinc 950 #09090b */
  --foreground: 0 0% 98%;               /* Zinc 50 #fafafa */
  --card: 240 10% 5.9%;                 /* Zinc 900 #121215 */
  --card-foreground: 0 0% 98%;
  --popover: 240 10% 5.9%;
  --popover-foreground: 0 0% 98%;
  --primary: 0 0% 98%;                  /* Crisp White */
  --primary-foreground: 240 5.9% 10%;   /* Dark text on white */
  --secondary: 240 3.7% 15.9%;          /* Zinc 800 #27272a */
  --secondary-foreground: 0 0% 98%;
  --muted: 240 3.7% 15.9%;              /* Zinc 800 */
  --muted-foreground: 240 5% 64.9%;     /* Zinc 400 #a1a1aa */
  --accent: 240 3.7% 15.9%;
  --accent-foreground: 0 0% 98%;
  --destructive: 0 72% 51%;             /* Red #ef4444 */
  --destructive-foreground: 0 0% 98%;
  --border: 240 3.7% 15.9%;             /* Zinc 800 #27272a */
  --input: 240 3.7% 15.9%;
  --ring: 240 4.9% 83.9%;               /* Zinc 300 #d4d4d8 */
  --radius: 0.5rem;

  /* Domain Semantic State Tokens */
  --state-overdue: 0 72% 51%;          /* Crimson / Red */
  --state-needs-date: 38 92% 50%;      /* Amber / Orange */
  --state-today: 217 91% 60%;          /* Blue */
  --state-done: 142 71% 45%;           /* Emerald */
  --state-undone: 215 16% 47%;         /* Slate */
}
```

## 3. Semantic States & Non-Color Discrimination
Colour is never used alone to convey state. Every status badge or alert pairs color with both an icon and a text label:
- **Overdue**: Red dot/badge (`text-red-400 bg-red-950/40 border-red-900/60`) + AlertCircle icon + text label `"Overdue"`.
- **Needs Due Date**: Amber dot/badge (`text-amber-400 bg-amber-950/40 border-amber-900/60`) + HelpCircle / Clock icon + text label `"Needs date"`.
- **Due Today**: Blue dot/badge (`text-blue-400 bg-blue-950/40 border-blue-900/60`) + Calendar icon + text label `"Due today"`.
- **This Week**: Zinc/teal badge (`text-zinc-300 bg-zinc-800/80 border-zinc-700`) + Clock icon + text label `"This week"`.
- **Completed**: Emerald dot/badge (`text-emerald-400 bg-emerald-950/40 border-emerald-900/60`) + CheckCircle icon + text label `"Done"`.
- **Reverted / Undone**: Slate badge (`text-zinc-400 bg-zinc-800/50 border-zinc-700`) + RotateCcw icon + text label `"Reverted"`.

## 4. Typography Scale & Spacing
- **Editorial Headline**: `text-4xl sm:text-5xl lg:text-6xl`, pairing italic serif with bold sans-serif (`*Ace* with Aced.`).
- **Headings**: `text-2xl` / `text-xl` font-semibold text-zinc-100 tracking-tight.
- **Body & Inputs**: `text-base` (16px) for form inputs; `text-sm` for helper texts and card details.
- **Labels & Micro-copy**: `text-xs` font-medium text-zinc-400 uppercase tracking-wider.
- **Spacing Scale**: 4px base (`p-2` = 8px, `p-3` = 12px, `p-4` = 16px, `p-6` = 24px, `p-8` = 32px).
- **Controls & Touch Targets**: Minimum 44px × 44px on mobile interactive elements (buttons, inputs, tab items).

## 5. Screen & Component Architecture

### 5.1 Join Class Screen (Login)
- **Visual Reference**: Matches `login-reference.png`.
- **Left Pane (Editorial Branding)**:
  - Minimal Aced logo mark (geometric diamond/prism + "Aced" wordmark).
  - Editorial headline: `*Ace* with Aced.` with serif italic accent word.
  - Subtitle: "Crowdsourced class deadlines, missing date alerts, and synchronized assignments for your cohort."
  - Minimal feature check-items.
- **Right Pane (Floating Minimalist Card)**:
  - Deep dark container: `bg-zinc-900/70 border border-zinc-800 rounded-2xl p-8 backdrop-blur-xl shadow-2xl max-w-md w-full`.
  - Heading: `Join your class board`, subtitle: `Welcome! Enter your details to get started.`
  - Accessible inputs: `Email address`, `Your name`, `Class code` with quick demo code pills (`Fill Demo Code` / `Demo Leader`).
  - High-contrast primary CTA: Solid white button (`bg-zinc-100 text-zinc-950 hover:bg-zinc-200`) with text `Enter Class` and arrow icon.
  - Transparent attribution footnote.

### 5.2 Responsive App Shell
- **Desktop (>= 768px / 1024px)**: Persistent left sidebar (`w-60 bg-zinc-950 border-r border-zinc-800/60`) with brand logo, monochrome nav links (`Board`, `Subjects`, `History`), and subtle user profile card with `Leave class` action.
- **Mobile (< 768px)**: Sticky top header (`AppHeader`) and bottom tab bar (`BottomTabBar`) with 48px touch targets and `pb-24` main content clearance.

### 5.3 Board Screen
- Minimalist top bar with period banner (`Class of 2026 — Period 3`), search input (`Search assignments`), and `+ Add assignment` button.
- Apple Reminders / Linear-style metric tiles with colored indicator dots (Overdue, Due today, Needs a date).
- Sleek filter pill chips (All subjects + individual subjects).
- Minimalist dark assignment cards with clean checkboxes, subject tags, and status pills.

### 5.4 Subjects Screen
- Minimalist course cards (clean dark zinc, no rainbow gradients).
- Course title, teacher name, and monospace Google Classroom code badge with one-click copy.
- Assignment stats and quick-add action.

### 5.5 History Screen
- Activity feed with clean user initials avatar, change description, and diff badges (`before → after`).
- Role banner for Class Leader privileges and one-tap Revert action.

### 5.6 Modals
- Clean dark modal scrim (`bg-black/70 backdrop-blur-sm`).
- Modal surfaces in `bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-2xl p-6`.
- High-contrast primary button (`bg-zinc-100 text-zinc-950 hover:bg-zinc-200`) and outline secondary button.

