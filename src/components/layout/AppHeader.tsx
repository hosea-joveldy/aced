import { useState } from 'react';
import { useSession } from '@/context/SessionContext';
import { LogOut, Copy, Check, ShieldCheck } from 'lucide-react';

export function AppHeader() {
  const { session, leaveClass } = useSession();
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    if (!session?.classCode) return;
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
    <header className="sticky top-0 z-30 w-full border-b border-[#E8E7E0] bg-[#FAF9F5]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex md:hidden items-center">
            <span className="h-3.5 w-3.5 rounded-full bg-[#141413] inline-block" />
            <span className="h-3.5 w-3.5 rounded-full border-2 border-[#141413] inline-block -ml-1.5 bg-[#FAF9F5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-serif font-bold tracking-tight text-[#141413]">
                {session?.className || 'Aced'}
              </h1>
              {session?.isClassLeader && (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 border border-emerald-200 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-900">
                  <ShieldCheck className="h-3 w-3 text-emerald-700" />
                  Leader
                </span>
              )}
            </div>
            {session && (
              <div className="flex items-center gap-2 text-xs text-[#73726C]">
                <span>Class Code:</span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="inline-flex items-center gap-1 font-mono font-semibold text-[#141413] hover:underline cursor-pointer"
                  title="Click to copy class code"
                >
                  <span>{session.classCode}</span>
                  {copied ? (
                    <Check className="h-3 w-3 text-emerald-600" />
                  ) : (
                    <Copy className="h-3 w-3 text-[#73726C]" />
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

        {session && (
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Leave button */}
            <button
              type="button"
              onClick={leaveClass}
              className="flex md:hidden min-h-[44px] items-center justify-center gap-1.5 rounded-full border border-[#D5D4CC] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#52524E] hover:bg-[#F2F1EB] hover:text-[#141413] transition cursor-pointer"
              title="Leave class"
              aria-label="Leave class"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Leave</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
