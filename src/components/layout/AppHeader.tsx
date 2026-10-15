import { useSession } from '@/context/SessionContext';
import { LogOut, GraduationCap, User } from 'lucide-react';

export function AppHeader() {
  const { session, leaveClass } = useSession();

  return (
    <header className="sticky top-0 z-30 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/75">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-foreground sm:text-lg">
              Aced
            </h1>
            {session && (
              <p className="text-xs text-muted-foreground truncate max-w-[150px] sm:max-w-xs font-medium">
                {session.className}
              </p>
            )}
          </div>
        </div>

        {session && (
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground border border-border">
              <User className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="font-semibold text-foreground">{session.displayName}</span>
              {session.isClassLeader && (
                <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-[10px] font-bold text-white">
                  Class Leader
                </span>
              )}
              <span className="text-muted-foreground hidden sm:inline">({session.classCode})</span>
            </div>

            <button
              type="button"
              onClick={leaveClass}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-input bg-background px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              title="Leave class"
              aria-label="Leave class"
            >
              <LogOut className="h-4 w-4 mr-1 sm:mr-1.5" />
              <span className="text-xs font-medium">Leave</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
