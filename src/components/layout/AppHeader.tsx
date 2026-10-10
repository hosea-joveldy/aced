import { useSession } from '@/context/SessionContext';
import { LogOut, GraduationCap, User } from 'lucide-react';

export function AppHeader() {
  const { session, leaveClass } = useSession();

  return (
    <header className="sticky top-0 z-30 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/75">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-foreground sm:text-lg">
              Aced
            </h1>
            {session && (
              <p className="text-xs text-muted-foreground truncate max-w-[140px] sm:max-w-[200px]">
                {session.className}
              </p>
            )}
          </div>
        </div>

        {session && (
          <div className="flex items-center gap-2">
            <div className="hidden items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-xs font-medium text-secondary-foreground sm:flex">
              <User className="h-3.5 w-3.5" />
              <span>{session.displayName}</span>
              {session.isClassLeader && (
                <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                  Class Leader
                </span>
              )}
              <span className="text-muted-foreground">({session.classCode})</span>
            </div>

            <button
              type="button"
              onClick={leaveClass}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md border border-input bg-background p-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              title="Leave class"
              aria-label="Leave class"
            >
              <LogOut className="h-4 w-4 mr-1 sm:mr-1.5" />
              <span className="text-xs">Leave</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
