import { useState, type FormEvent } from 'react';
import { useSession } from '@/context/SessionContext';
import { ArrowRight, AlertCircle, Sparkles, Check } from 'lucide-react';

export function JoinClassForm() {
  const { joinClass, error } = useSession();
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [classCode, setClassCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localValidation, setLocalValidation] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalValidation(null);

    const trimmedEmail = email.trim();
    const trimmedName = displayName.trim();
    const trimmedCode = classCode.trim();

    if (!trimmedEmail) {
      setLocalValidation('Please enter your email address.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setLocalValidation('Please enter a valid email address.');
      return;
    }

    if (!trimmedName) {
      setLocalValidation('Please enter your name.');
      return;
    }
    if (!trimmedCode) {
      setLocalValidation('Please enter a class code.');
      return;
    }

    setIsSubmitting(true);
    await joinClass(trimmedEmail, displayName, classCode);
    setIsSubmitting(false);
  };

  const handleUseDemo = (asLeader = false) => {
    setClassCode('ACED2026');
    if (asLeader) {
      setEmail('leader@aced.school');
      setDisplayName('Alex (Class Leader)');
    } else {
      if (!email) setEmail('student@aced.school');
      if (!displayName) setDisplayName('Alex Rivera');
    }
    setLocalValidation(null);
  };

  const displayedError = localValidation || error;

  return (
    <div className="min-h-screen w-full bg-[#09090b] text-zinc-100 flex flex-col justify-between selection:bg-zinc-800 selection:text-white">
      {/* Top Navbar: Clean Logo */}
      <header className="w-full px-6 py-6 sm:px-10 lg:px-14 flex items-center justify-between border-b border-zinc-900/80">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-100 text-zinc-950 font-bold text-sm shadow-sm">
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 fill-current"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <span className="font-semibold text-base tracking-tight text-zinc-100">
            Aced
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-400">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span>Class of 2026 · Live sync</span>
        </div>
      </header>

      {/* Main Split Layout */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-10 sm:px-10 lg:px-14 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
        {/* Left Editorial Branding Hero */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center max-w-xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl tracking-tight text-zinc-100 font-normal leading-[1.1]">
            <span className="font-serif italic text-zinc-100 font-normal">Ace</span> with Aced.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-zinc-400 font-normal leading-relaxed">
            Crowdsourced class deadline board. Synchronize assignments, resolve missing due dates together, and never miss an announcement.
          </p>

          {/* Minimalist Feature Bullet List */}
          <div className="mt-8 space-y-3.5 border-t border-zinc-900 pt-6">
            <div className="flex items-center gap-3 text-sm text-zinc-300">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300">
                <Check className="h-3 w-3" />
              </div>
              <span>One unified board for all subjects, teachers, and Classroom codes</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-zinc-300">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300">
                <Check className="h-3 w-3" />
              </div>
              <span>Missing due date alerts crowdsourced and completed by classmates</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-zinc-300">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300">
                <Check className="h-3 w-3" />
              </div>
              <span>Transparent edit history with one-tap Class Leader rollback</span>
            </div>
          </div>
        </div>

        {/* Right Floating Minimal Dark Card (Matches login-reference.png) */}
        <div className="w-full lg:w-auto flex justify-center lg:justify-end">
          <div className="w-full max-w-[420px] rounded-2xl bg-zinc-900/60 border border-zinc-800/80 p-7 sm:p-8 backdrop-blur-xl shadow-2xl">
            <div className="mb-6 text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-zinc-100">
                Join your class board
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm text-zinc-400">
                Welcome back! Please enter your details to continue
              </p>
            </div>

            {/* Error Banner */}
            {displayedError && (
              <div
                id="join-form-error"
                role="alert"
                className="mb-5 flex items-start gap-2.5 rounded-lg border border-red-900/50 bg-red-950/40 p-3 text-xs text-red-200"
              >
                <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
                <span className="flex-1 font-medium">{displayedError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div>
                <label
                  htmlFor="student-email"
                  className="block text-xs font-medium text-zinc-300 mb-1.5"
                >
                  Email address
                </label>
                <input
                  id="student-email"
                  type="email"
                  autoComplete="email"
                  required
                  aria-required="true"
                  aria-invalid={displayedError ? true : undefined}
                  aria-describedby={displayedError ? 'join-form-error' : undefined}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@school.edu"
                  disabled={isSubmitting}
                  className="w-full min-h-[44px] rounded-lg border border-zinc-800 bg-zinc-950/80 px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition shadow-inner"
                />
              </div>

              <div>
                <label
                  htmlFor="student-name"
                  className="block text-xs font-medium text-zinc-300 mb-1.5"
                >
                  Your name
                </label>
                <input
                  id="student-name"
                  type="text"
                  autoComplete="name"
                  required
                  aria-required="true"
                  aria-invalid={displayedError ? true : undefined}
                  aria-describedby={displayedError ? 'join-form-error' : undefined}
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  disabled={isSubmitting}
                  className="w-full min-h-[44px] rounded-lg border border-zinc-800 bg-zinc-950/80 px-3.5 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition shadow-inner"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="class-code"
                    className="block text-xs font-medium text-zinc-300"
                  >
                    Class code
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleUseDemo(false)}
                      className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-100 transition min-h-[28px] px-1 rounded cursor-pointer"
                    >
                      <Sparkles className="h-3 w-3" />
                      Fill Demo Code
                    </button>
                    <span className="text-zinc-700">·</span>
                    <button
                      type="button"
                      onClick={() => handleUseDemo(true)}
                      className="text-xs text-zinc-500 hover:text-zinc-300 transition min-h-[28px] px-1 rounded cursor-pointer"
                      title="Fill demo as class leader"
                    >
                      Demo Leader
                    </button>
                  </div>
                </div>
                <input
                  id="class-code"
                  type="text"
                  autoCapitalize="characters"
                  autoCorrect="off"
                  required
                  aria-required="true"
                  aria-invalid={displayedError ? true : undefined}
                  aria-describedby={displayedError ? 'join-form-error' : undefined}
                  value={classCode}
                  onChange={(e) => setClassCode(e.target.value.toUpperCase())}
                  placeholder="e.g. ACED2026"
                  disabled={isSubmitting}
                  className="w-full min-h-[44px] rounded-lg border border-zinc-800 bg-zinc-950/80 px-3.5 py-2.5 text-sm font-mono font-bold tracking-widest uppercase text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition shadow-inner text-center sm:text-left"
                />
              </div>

              {/* High-Contrast White Submit Button (Inspired by reference) */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-2 flex w-full min-h-[44px] items-center justify-center gap-2 rounded-lg bg-zinc-100 px-4 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-zinc-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 disabled:opacity-50 transition cursor-pointer shadow-sm"
              >
                {isSubmitting ? (
                  <span>Entering class...</span>
                ) : (
                  <>
                    <span>Enter Class</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Attribution note */}
            <div className="mt-5 border-t border-zinc-800/80 pt-4 text-center">
              <p className="text-[11px] text-zinc-500 leading-relaxed">
                Every edit attributes your name and email. Rollbacks are managed by the designated Class Leader.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Footer */}
      <footer className="w-full px-6 py-4 sm:px-10 lg:px-14 border-t border-zinc-900/80 flex items-center justify-between text-xs text-zinc-500">
        <span>Aced Crowdsourced Board</span>
        <span>Zero-config offline mode enabled</span>
      </footer>
    </div>
  );
}
