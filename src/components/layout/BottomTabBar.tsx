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
      className="fixed bottom-0 inset-x-0 bg-background/95 backdrop-blur border-t border-border z-40 shadow-lg supports-[backdrop-filter]:bg-background/80"
    >
      <div className="mx-auto flex h-16 max-w-3xl items-center justify-around px-2">
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
                    ? 'text-primary font-semibold'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
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
