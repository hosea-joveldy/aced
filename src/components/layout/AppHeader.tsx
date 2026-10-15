import { useSession } from '@/context/SessionContext';
import { LogOut } from 'lucide-react';

export function AppHeader() {
  const { session, leaveClass } = useSession();

  return (
    <header className="sticky top-0 z-30 w-full border-b border-zinc-800/80 bg-[#09090b]/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex md:hidden h-7 w-7 items-center justify-center rounded-lg bg-zinc-100 text-zinc-950 font-bold text-xs shadow-sm">
            <svg
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5 fill-current"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-tight text-zinc-100 sm:text-base">
              Aced
            </h1>
            {session && (
              <p className="text-xs text-zinc-400 truncate max-w-[180px] sm:max-w-xs font-normal">
                {session.className}
              </p>
            )}
          </div>
        </div>

        {session && (
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Leave button */}
            <button
              type="button"
              onClick={leaveClass}
              className="flex md:hidden min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-zinc-800 bg-zinc-900/80 px-2.5 py-1.5 text-xs font-medium text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
              title="Leave class"
              aria-label="Leave class"
            >
              <LogOut className="h-4 w-4 mr-1.5" />
              <span>Leave</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
