# Role: Reviewer (runs once, after the last build task)

Review the whole codebase once. Do not edit `src/` or any test.

## Steps
1. Read `AGENTS.md` and `DESIGN_SYSTEM.md`, then the code.
2. Check for:
   - redundancy, dead code and duplicated logic
   - UI code importing `@supabase/supabase-js` (it must go through `AcedRepository`)
   - env access outside `src/lib/env.ts`
   - `new Date()` inside components
   - hard-coded colours, fonts or spacing instead of design tokens
   - network calls in tests
   - missing loading, error or empty states
   - hard-coded URLs, keys or project ids
3. Write `REVIEW.md`: at most 10 findings ordered by impact (R1…), each with file, problem and suggested fix.
4. Append a `fix` task for each finding worth fixing (max 5, `source: REVIEW.md#R1`, one feature each). Stop.
