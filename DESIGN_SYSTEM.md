# DESIGN_SYSTEM.md — Aced Design System (Warm Stone & Editorial Minimalist)

## 1. Stack & System Foundations
- **UI Aesthetic**: Warm stone, editorial minimalist aesthetic derived from the Reflection landing page references and Liquid layout:
  - Background: Warm bone/cream stone (`#FAF9F5` base, `#F3F2EC` surface cards, `#E8E7E0` subtle borders).
  - High-Contrast Dark Accent: Deep forest moss (`#162417` / `#1D2F1F`) with vibrant chartreuse pill accent (`#D4F24D` / `#C8E640`).
  - Ink Foreground: Deep charcoal/near-black (`#141413`) for primary headings, `#4A4A46` for secondary copy, `#7E7D77` for muted labels.
  - Interactive Accents: Pill buttons with tactile dots (`Try it now •`, `Create a Class •`, `Enter Class •`).
- **Typography**:
  - Headings & Editorial Display: Serif font (`'Playfair Display', Georgia, Cambria, serif`) with elegant tracking and italic emphasis options.
  - Body & UI Controls: Inter (`font-sans`), clean modern sans-serif with base size 16px for input fields and body text.
  - Codes & Monospace: Monospace (`font-mono font-medium`) for Class Codes and identifiers.
- **Button & Component Geometry**:
  - Pill Radii (`rounded-full`): All action buttons, filter chips, and status badges use pill geometry.
  - Card Radii (`rounded-2xl` to `rounded-3xl`): Bento containers, modal dialogs, and feature cards use generous rounded corners with subtle 1px border.
- **Form Factors**:
  - Mobile-first (minimum width: 375px) with bottom tab bar.
  - Desktop shell (>= 768px / 1024px) with persistent left sidebar or clean top nav.

## 2. Token Definitions (`src/index.css`)
```css
:root {
  /* Warm Stone Palette */
  --background: 45 25% 97%;             /* #FAF9F5 Warm Cream / Bone */
  --foreground: 40 4% 8%;               /* #141413 Deep Charcoal Ink */
  --card: 45 20% 95%;                   /* #F3F2EC Stone Card Surface */
  --card-foreground: 40 4% 8%;
  --popover: 45 20% 98%;
  --popover-foreground: 40 4% 8%;

  /* High-Contrast Primary & Pill Actions */
  --primary: 40 4% 8%;                  /* Deep Near-Black #141413 */
  --primary-foreground: 45 25% 97%;     /* Warm Cream #FAF9F5 */
  --secondary: 45 15% 90%;              /* #E9E8E1 Soft Stone */
  --secondary-foreground: 40 4% 8%;
  --muted: 45 15% 92%;                  /* #ECEBE4 */
  --muted-foreground: 40 3% 45%;        /* #73726C Muted Slate */
  --accent: 45 15% 90%;
  --accent-foreground: 40 4% 8%;
  --border: 45 10% 88%;                 /* #E2E1DA Subtle Stone Border */
  --input: 45 10% 88%;
  --ring: 40 4% 20%;
  --radius: 0.75rem;

  /* Dark Moss Contrast Banner (Landing Section 3) */
  --moss-dark: #162417;
  --moss-card: #1D2F1F;
  --moss-chartreuse: #D4F24D;
  --moss-text: #F3F4EE;

  /* Domain Semantic State Tokens */
  --state-overdue: 350 78% 46%;         /* Crimson Rose #DE1B3A */
  --state-needs-date: 36 90% 46%;       /* Warm Amber #E27909 */
  --state-today: 142 58% 34%;           /* Forest Emerald #23854E */
  --state-done: 40 3% 55%;              /* Muted Stone Gray #8D8B84 */
  --state-undone: 215 16% 47%;          /* Slate */
}
```

## 3. Semantic States & Non-Color Discrimination
Colour is never used alone to convey state. Every status badge pairs color with both an icon and a text label:
- **Overdue**: Crimson dot/pill (`text-red-700 bg-red-100/80 border-red-200`) + AlertCircle icon + text label `"Overdue"`.
- **Needs Due Date**: Amber dot/pill (`text-amber-800 bg-amber-100/80 border-amber-200`) + HelpCircle icon + text label `"Needs date"`.
- **Due Today**: Olive/emerald dot/pill (`text-emerald-800 bg-emerald-100/80 border-emerald-200`) + Calendar icon + text label `"Due today"`.
- **This Week**: Stone dot/pill (`text-stone-700 bg-stone-200/80 border-stone-300`) + Clock icon + text label `"This week"`.
- **Completed**: Muted dot/pill (`text-stone-500 bg-stone-100 border-stone-200`) + CheckCircle icon + text label `"Done"`.
- **Reverted**: Slate pill (`text-slate-700 bg-slate-100 border-slate-300`) + RotateCcw icon + text label `"Reverted"`.

## 4. Typography Scale & Spacing
- **Display Hero**: `text-4xl sm:text-6xl lg:text-7xl font-serif text-[#141413] tracking-tight leading-[1.08]`.
- **Section Heading**: `text-2xl sm:text-3xl font-serif text-[#141413] tracking-tight`.
- **Card Titles**: `text-lg font-semibold text-[#141413]`.
- **Body Text**: `text-base text-[#4A4A46] leading-relaxed`.
- **Micro-copy & Badges**: `text-xs font-medium text-[#7E7D77]`.
- **Pill Buttons**: `h-11 px-6 rounded-full inline-flex items-center justify-center gap-2 text-sm font-medium transition-all shadow-sm`.
- **Touch Targets**: Minimum 44px × 44px on interactive elements for mobile accessibility.

## 5. Screen & Component Architecture

### 5.1 Landing Page (`#/`)
- **Interactive Hero**:
  - Full-width canvas background with orbital dots that smoothly evade cursor proximity with spring physics (60fps, GPU-accelerated, disabled for `prefers-reduced-motion`).
  - Reflection-style header: Dual-circle brand logo mark, navigation links, and pill CTA.
  - Serif headline: "Introducing Aced: The crowdsourced deadline board for your class."
  - Dual pill CTAs: "Create a class •" and "Join with code •".
- **Bento Value Cards**:
  - Clean stone cards with subtle borders highlighting "Decentralized & Crowdsourced" and "Role-Based Integrity".
  - Middle showcase with grouped deadline previews.
- **Dark Moss Feature Banner**:
  - Deep green card with chartreuse CTA button ("Get started now •").
- **3-Step Workflow & FAQ**:
  - Visual steps (Create or join, Add deadlines, Sync & rollback).
  - Clean FAQ accordion.

### 5.2 Join & Create Class Screen (`#/auth` or Auth Mode)
- **Visual Reference**: Layout inspired by `login-reference.png`, styled with the warm stone / editorial aesthetic.
- **Left Column**:
  - Aced logo mark.
  - Editorial serif headline: "Organize coursework as a cohort."
  - Value summary list with checkmarks.
- **Right Column (Card Surface)**:
  - Clean card surface (`bg-[#F7F6F1] border border-[#E2E1DA] rounded-3xl p-6 sm:p-8`).
  - Toggle / Tabs: "Join Class" and "Create Class".
  - Input fields with visible labels and 16px font to prevent mobile zoom.
  - Primary pill button: "Enter Class •" or "Create Class •".
  - Quick demo class shortcut pill for effortless demo testing (`Demo Class ACED2026`).
  - No "Class of 2026 Live sync" or footer text.

### 5.3 App Shell (Board, Subjects, History)
- **Header**: Warm stone top bar with class name pill, class code with one-click copy button, student avatar, and role badge (Class Leader / Student).
- **Sidebar (Desktop)** & **Bottom Tab Bar (Mobile)**:
  - Nav items: Board, Subjects, History.
  - Sleek active pill states.
- **Board Screen**:
  - Apple Reminders / Linear-inspired minimalist bento summary metrics (Overdue, Due today, Needs a date).
  - Horizontal subject filter pill list with "All" and individual subjects.
  - Grouped cards with clean checkbox toggles and edit modals.
- **Subjects Screen**:
  - Clean course cards with teacher name, assignment count, and edit/delete actions.
  - No classroom code field anywhere!
- **History Screen & Leadership Management**:
  - Audit timeline with before/after diffs and attribution.
  - Revert action with confirmation dialog for Class Leaders.
  - Leadership Transfer button allowing the Class Leader to reassign leadership to a classmate's email.
- **Modals**:
  - Minimalist warm stone dialog with `rounded-2xl`, serif modal headings, and pill action buttons.
