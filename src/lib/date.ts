let injectedToday: string | null = null;

/**
 * Returns today's date formatted strictly as 'YYYY-MM-DD'.
 * If an injected date is set (for testing or deterministic runs), it returns that value.
 */
export function getToday(): string {
  if (injectedToday) {
    return injectedToday;
  }
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Injects a deterministic today's date ('YYYY-MM-DD') or null to restore real-time clock.
 */
export function setToday(date: string | null): void {
  injectedToday = date;
}

/**
 * Validates whether a string matches 'YYYY-MM-DD' format.
 */
export function isValidDateString(dateStr: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  return (
    date.getFullYear() === y &&
    date.getMonth() === m - 1 &&
    date.getDate() === d
  );
}

/**
 * Categorizes an assignment's deadline relative to today.
 */
export type DeadlineGroup =
  | 'needs-date'
  | 'overdue'
  | 'today'
  | 'this-week'
  | 'later'
  | 'done';

export function getDeadlineGroup(
  dueDate: string | null,
  completed: boolean,
  today: string = getToday()
): DeadlineGroup {
  if (completed) return 'done';
  if (!dueDate) return 'needs-date';

  if (dueDate < today) return 'overdue';
  if (dueDate === today) return 'today';

  // Calculate day difference
  const [ty, tm, td] = today.split('-').map(Number);
  const [dy, dm, dd] = dueDate.split('-').map(Number);
  const todayTime = Date.UTC(ty, tm - 1, td);
  const dueDateTime = Date.UTC(dy, dm - 1, dd);
  const diffDays = Math.round((dueDateTime - todayTime) / (1000 * 60 * 60 * 24));

  if (diffDays <= 7) return 'this-week';
  return 'later';
}
