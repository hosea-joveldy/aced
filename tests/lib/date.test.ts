import { describe, it, expect, beforeEach } from 'vitest';
import {
  getToday,
  setToday,
  isValidDateString,
  getDeadlineGroup,
} from '@/lib/date';

describe('Date Utilities', () => {
  beforeEach(() => {
    setToday(null);
  });

  it('returns valid YYYY-MM-DD for default getToday()', () => {
    const today = getToday();
    expect(isValidDateString(today)).toBe(true);
  });

  it('supports deterministic today injection', () => {
    setToday('2026-10-15');
    expect(getToday()).toBe('2026-10-15');
    setToday(null);
  });

  it('correctly categorizes deadline groups', () => {
    const base = '2026-10-10';
    setToday(base);

    // Done takes precedence
    expect(getDeadlineGroup('2026-10-01', true, base)).toBe('done');
    expect(getDeadlineGroup(null, true, base)).toBe('done');

    // Needs date
    expect(getDeadlineGroup(null, false, base)).toBe('needs-date');

    // Overdue
    expect(getDeadlineGroup('2026-10-08', false, base)).toBe('overdue');

    // Today
    expect(getDeadlineGroup('2026-10-10', false, base)).toBe('today');

    // This week (within 7 days)
    expect(getDeadlineGroup('2026-10-14', false, base)).toBe('this-week');

    // Later (> 7 days)
    expect(getDeadlineGroup('2026-10-25', false, base)).toBe('later');
  });
});
