import { NavLink } from 'react-router-dom';
import { CalendarDays, BookOpen, History } from 'lucide-react';
import type { ComponentType } from 'react';

interface TabItem {
  to: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
}

const TABS: TabItem[] = [
  { to: '/', label: 'Board', icon: CalendarDays },
  { to: '/subjects', label: 'Subjects', icon: BookOpen },
  { to: '/history', label: 'History', icon: History },
];

export function BottomTabBar() {
  return (
    <nav
      aria-label="Main Navigation"
      className="md:hidden fixed bottom-0 inset-x-0 bg-[#09090b]/95 backdrop-blur-md border-t border-zinc-800/80 z-40 shadow-xl"
    >
      <div className="mx-auto flex h-16 max-w-md items-center justify-around px-2">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.to === '/'}
              className={({ isActive }) =>
                `flex flex-1 min-h-[48px] min-w-[48px] flex-col items-center justify-center rounded-lg px-2 py-1 text-xs font-medium transition-colors ${
                  isActive
                    ? 'text-zinc-100 font-semibold'
                    : 'text-zinc-500 hover:text-zinc-300'
                }`
              }
            >
              <Icon className="h-5 w-5 mb-1" />
              <span>{tab.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
