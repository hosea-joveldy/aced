import { NavLink } from 'react-router-dom';
import { useSession } from '@/context/SessionContext';
import { CalendarDays, BookOpen, History, LogOut, ShieldCheck, Copy, Check } from 'lucide-react';
import { useState, type ComponentType } from 'react';

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
  const [copied, setCopied] = useState(false);

  if (!session) return null;

  const initials = session.displayName
    ? session.displayName
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : 'ST';

  const handleCopyCode = async () => {
    if (!session.classCode) return;
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(session.classCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      // Fallback
    }
  };

  return (
    <aside
      aria-label="Main Navigation"
      className="hidden md:flex h-screen w-64 flex-col justify-between border-r border-[#E8E7E0] bg-[#FAF9F5] p-5 shrink-0 sticky top-0"
    >
      <div className="space-y-6">
        {/* Brand Header */}
        <div className="flex items-center gap-2.5 px-2 pt-1">
          <span className="flex items-center">
            <span className="h-4 w-4 rounded-full bg-[#141413] inline-block shadow-sm" />
            <span className="h-4 w-4 rounded-full border-2 border-[#141413] inline-block -ml-1.5 bg-[#FAF9F5]" />
          </span>
          <span className="text-xl font-serif font-bold tracking-tight text-[#141413]">
            Aced
          </span>
        </div>

        {/* Current Class Pill */}
        <div className="rounded-2xl border border-[#E2E1DA] bg-white p-3 space-y-1 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#73726C]">
              Current Class
            </span>
            {session.isClassLeader && (
              <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-800">
                <ShieldCheck className="h-3 w-3 text-emerald-700" />
                Leader
              </span>
            )}
          </div>
          <p className="text-xs font-semibold text-[#141413] truncate" title={session.className}>
            {session.className}
          </p>
          <div className="flex items-center justify-between pt-1 border-t border-[#F2F1EB]">
            <span className="text-[11px] text-[#73726C]">Code:</span>
            <button
              type="button"
              onClick={handleCopyCode}
              className="inline-flex items-center gap-1 font-mono font-bold text-xs text-[#141413] hover:underline cursor-pointer"
              title="Copy Class Code"
            >
              <span>{session.classCode}</span>
              {copied ? (
                <Check className="h-3 w-3 text-emerald-600" />
              ) : (
                <Copy className="h-3 w-3 text-[#73726C]" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1.5">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-full px-4 py-2.5 text-sm transition-all ${
                    isActive
                      ? 'bg-[#141413] text-white font-medium shadow-sm'
                      : 'text-[#52524E] hover:bg-[#F2F1EB] hover:text-[#141413]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`h-4 w-4 ${
                        isActive ? 'text-white' : 'text-[#73726C]'
                      }`}
                    />
                    <span className="flex-1 font-medium">{item.label}</span>
                    {isActive && (
                      <span className="h-1.5 w-1.5 rounded-full bg-[#D4F24D]" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* User "Me" Card */}
      <div className="rounded-2xl border border-[#E2E1DA] bg-white p-3.5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#141413] font-bold text-xs text-white">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-[#141413]">
              {session.displayName}
            </p>
            <p className="truncate text-[11px] text-[#73726C]">
              {session.email}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={leaveClass}
          className="mt-3 flex w-full min-h-[36px] items-center justify-center gap-1.5 rounded-full border border-[#D5D4CC] bg-[#FAF9F5] px-3 py-1.5 text-xs font-semibold text-[#52524E] hover:bg-[#F2F1EB] hover:text-[#141413] transition cursor-pointer"
          aria-label="Leave class"
        >
          <LogOut className="h-3.5 w-3.5" />
          <span>Leave Class</span>
        </button>
      </div>
    </aside>
  );
}
