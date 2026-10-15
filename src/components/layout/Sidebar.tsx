import { NavLink } from 'react-router-dom';
import { useSession } from '@/context/SessionContext';
import { CalendarDays, BookOpen, History, LogOut, ShieldCheck } from 'lucide-react';
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
      className="hidden md:flex h-screen w-60 flex-col justify-between border-r border-zinc-800/80 bg-[#09090b] p-4 shrink-0 sticky top-0"
    >
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3 px-2 pt-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-950 font-bold text-sm shadow-sm">
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 fill-current"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-semibold tracking-tight text-zinc-100">
                Aced
              </span>
            </div>
            <p className="text-xs text-zinc-400 truncate max-w-[140px]">
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
                  `flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? 'bg-zinc-800/80 text-zinc-100 font-medium'
                      : 'text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`h-4 w-4 ${
                        isActive ? 'text-zinc-100' : 'text-zinc-400'
                      }`}
                    />
                    <span className="flex-1">{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User "Me" Card */}
      <div className="rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-800 font-medium text-xs text-zinc-200 border border-zinc-700/60">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-zinc-200">
              {session.displayName}
            </p>
            <div className="flex items-center gap-1 text-[11px] text-zinc-400">
              {session.isClassLeader ? (
                <span className="inline-flex items-center gap-0.5 text-zinc-300 font-medium">
                  <ShieldCheck className="h-3 w-3 text-emerald-400" />
                  Leader
                </span>
              ) : (
                <span>Student</span>
              )}
              <span>·</span>
              <span className="font-mono text-[10px]">{session.classCode}</span>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={leaveClass}
          className="mt-3 flex w-full min-h-[32px] items-center justify-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-950 px-2 py-1.5 text-xs text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 hover:border-zinc-700 transition cursor-pointer"
          aria-label="Leave class"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Leave Class</span>
        </button>
      </div>
    </aside>
  );
}
