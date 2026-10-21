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
      className="md:hidden fixed bottom-0 inset-x-0 bg-[#FAF9F5]/95 backdrop-blur-md border-t border-[#E8E7E0] z-40 shadow-lg"
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
                `flex flex-1 min-h-[48px] min-w-[48px] flex-col items-center justify-center rounded-full px-2 py-1 text-xs font-medium transition-colors ${
                  isActive
                    ? 'text-[#141413] font-bold'
                    : 'text-[#73726C] hover:text-[#141413]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className="h-5 w-5 mb-0.5" />
                  <span>{tab.label}</span>
                  {isActive && (
                    <span className="h-1 w-1 rounded-full bg-[#141413] mt-0.5" />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
