# DESIGN_SYSTEM.md — Aced Design System

## 1. Stack & System Foundations
- **UI Framework**: shadcn/ui (`new-york` style, `neutral` base).
- **Typography**: Inter (`font-sans`), system font fallback. Base body size: 16px for form inputs and body readability.
- **Primary Theme Color**: Indigo (`hsl(243, 75%, 59%)`).
- **Base Border Radius**: `0.5rem` (`8px`).
- **Target Form Factor**: Mobile-first (minimum width: 375px), single-column fluid layout with responsive desktop expansion (1280px).

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
Colour is never used alone to convey state. Every status badge or alert must pair color with both an icon and a text label:
- **Overdue**: Crimson border/text (`text-red-700 bg-red-50 border-red-200`) + AlertCircle icon + text label `"Overdue"`.
- **Needs Due Date**: Amber border/text (`text-amber-800 bg-amber-50 border-amber-200`) + Clock / HelpCircle icon + text label `"Needs date"`.
- **Due Today**: Indigo border/text (`text-indigo-700 bg-indigo-50 border-indigo-200`) + Calendar icon + text label `"Due today"`.
- **Completed**: Emerald border/text (`text-emerald-700 bg-emerald-50 border-emerald-200`) + CheckCircle icon + text label `"Done"`.
- **Reverted / Undone**: Slate border/text (`text-slate-600 bg-slate-100 border-slate-300`) + RotateCcw icon + text label `"Reverted"`.

## 4. Typography Scale & Spacing
- **Typography Scale**:
  - `text-xs`: 12px / line-height 16px (metadata, badges).
  - `text-sm`: 14px / line-height 20px (helper text, secondary attributes, tab bar labels).
  - `text-base`: 16px / line-height 24px (body, input text to prevent mobile iOS auto-zoom).
  - `text-lg`: 18px / line-height 28px (subheaders, card titles).
  - `text-xl`: 20px / line-height 28px (modal titles, section headers).
  - `text-2xl`: 24px / line-height 32px (main screen headers).
- **Spacing Scale**: 4px base (`p-2` = 8px, `p-3` = 12px, `p-4` = 16px, `p-6` = 24px). Gap scale: `gap-2` (8px), `gap-3` (12px), `gap-4` (16px).
- **Border Radii**: Container cards `rounded-lg` (8px), controls/inputs `rounded-md` (6px), pills/badges `rounded-full`.

## 5. Mobile & Responsive Layout Rules
- **Viewport**: 375px minimum supported mobile width with zero horizontal overflow (`max-w-full overflow-x-hidden`).
- **Touch Targets**: All interactive elements (buttons, tab items, dropdown triggers, checkboxes) must have a touch target of at least 44px × 44px (`min-h-[44px] min-w-[44px]`).
- **Safe Padding**: Main scroll containers must include bottom padding (`pb-20` on mobile) so content is never obscured by the bottom tab bar.
- **Desktop Adaptation**: On screen sizes >= 768px (`md:`), content centers inside a responsive container (`max-w-3xl mx-auto`), and navigation switches to a clean top header or persistent navigation bar.

## 6. Component Rules
- **Cards**: Surface with `bg-card`, `border border-border`, `rounded-lg`, `p-4`, subtle shadow `shadow-sm`.
- **Buttons**:
  - Primary: `bg-primary text-primary-foreground hover:bg-primary/90 min-h-[44px] rounded-md font-medium px-4`.
  - Secondary/Outline: `border border-input bg-background hover:bg-muted min-h-[44px] rounded-md font-medium px-4`.
  - Destructive: `bg-destructive text-destructive-foreground hover:bg-destructive/90 min-h-[44px] rounded-md px-4`.
- **Form Controls**:
  - Every form input must have an explicit `<label>` connected with `htmlFor`/`id`.
  - Field errors rendered immediately below the invalid control in `text-destructive text-sm font-medium`.
  - Correct `inputmode` and `type` attributes (e.g., `type="text"`, `type="date"`).
- **Bottom Tab Bar**:
  - Fixed at screen bottom (`fixed bottom-0 inset-x-0 bg-background border-t border-border z-40`).
  - Contains exactly 3 primary tabs: **Board** (calendar/list icon), **Subjects** (book-open icon), **History** (history/undo icon).
  - Each tab target is at least 44px high with stacked icon and 12px label.
- **Screen States**:
  - **Loading**: Skeleton placeholder cards matching card layout with `aria-busy="true"` and an accessible `"Loading..."` description.
  - **Error**: High-visibility card with destructive icon, plain English error message, and a `"Retry"` button.
  - **Empty**: Centered icon, concise message explaining why it's empty, and an actionable CTA button (e.g., `"Add an assignment"`).
- **Confirmation Dialog**:
  - Accessible modal dialog for destructive or irreversible actions (e.g., Reverting edits).
  - Contains descriptive heading, explanation of the change, `"Cancel"` button and distinct action confirmation button.
