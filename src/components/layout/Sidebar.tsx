import { NavLink } from 'react-router-dom';
import { useSession } from '@/context/SessionContext';
import { CalendarDays, BookOpen, History, LogOut, ShieldCheck, Orbit } from 'lucide-react';
import type { ComponentType } from 'react';

interface NavItem {
  to: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
}

const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Board', icon: CalendarDays },
  { to: '/subjects', label: 'Subjects', icon: BookOpen },
  { to: '/history', label: 'History', icon: History },
];

export function Sidebar() {
  const { session, leaveClass } = useSession();

  if (!session) return null;

  // Extract initials
  const initials = session.displayName
    ? session.displayName
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'ST';

  return (
    <aside
      aria-label="Main Navigation"
      className="hidden md:flex h-screen w-64 flex-col justify-between border-r border-border bg-card/90 p-4 shrink-0 sticky top-0"
    >
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 pt-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md shadow-primary/20">
            <Orbit className="h-5 w-5 animate-spin [animation-duration:14s]" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-extrabold tracking-tight text-foreground">
                Aced
              </span>
              <span className="rounded bg-indigo-100 px-1.5 py-0.2 text-[10px] font-bold text-indigo-700">
                PRO
              </span>
            </div>
            <p className="text-xs text-muted-foreground truncate max-w-[150px]">
              {session.className}
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-secondary text-foreground shadow-sm font-bold'
                      : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`h-4 w-4 ${
                        isActive ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    />
                    <span className="flex-1">{item.label}</span>
                    {isActive && (
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User "Me" Card matching wireframe Frame 2 */}
      <div className="rounded-xl border border-border bg-background/80 p-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-bold text-sm text-indigo-700 border border-indigo-200">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <p className="truncate text-xs font-bold text-foreground">
                {session.displayName}
              </p>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
              {session.isClassLeader ? (
                <span className="inline-flex items-center gap-0.5 text-indigo-600 font-semibold">
                  <ShieldCheck className="h-3 w-3" />
                  Leader
                </span>
              ) : (
                <span>Student</span>
              )}
              <span>·</span>
              <span className="font-mono">{session.classCode}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={leaveClass}
          className="mt-3 flex w-full min-h-[36px] items-center justify-center gap-1.5 rounded-md border border-input bg-card px-2 py-1.5 text-xs font-medium text-muted-foreground hover:bg-destructive/10 hover:border-destructive/30 hover:text-destructive transition"
          aria-label="Leave class"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Leave Class</span>
        </button>
      </div>
    </aside>
  );
}
