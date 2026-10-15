import { useState, type FormEvent } from 'react';
import { useSession } from '@/context/SessionContext';
import { ArrowRight, AlertCircle, Sparkles, Orbit } from 'lucide-react';
import { SolarSystemIllustration } from './SolarSystemIllustration';

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
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-3 sm:p-6 lg:p-8">
      <div className="w-full max-w-5xl overflow-hidden rounded-2xl border border-border bg-card shadow-xl transition-all">
        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
          {/* Left Column: Celestial Solar System Artwork (Desktop / Tablet) */}
          <div className="hidden lg:col-span-6 lg:block p-3">
            <SolarSystemIllustration />
          </div>

          {/* Right Column: Clean Form Container (Wireframe Frame 1) */}
          <div className="flex flex-col justify-center p-6 sm:p-10 lg:col-span-6 lg:p-12">
            {/* Mobile Solar Orbit Accent Banner */}
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-2 text-xs font-medium text-indigo-700 lg:hidden border border-indigo-100">
              <Orbit className="h-4 w-4 shrink-0 text-indigo-600 animate-spin [animation-duration:8s]" />
              <span>Crowdsourced Class Deadline Board</span>
            </div>

            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm shadow-sm">
                  A
                </span>
                <span className="font-mono text-xs tracking-wider uppercase text-muted-foreground font-bold">
                  Aced Platform
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                Join your class board
              </h2>
              <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                Crowdsourced deadlines, missing date alerts, and synchronized assignments for your classmates.
              </p>
            </div>

            {/* Error Message */}
            {displayedError && (
              <div
                role="alert"
                className="mb-5 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3.5 text-sm text-red-800"
              >
                <AlertCircle className="h-5 w-5 shrink-0 text-red-600 mt-0.5" />
                <span className="flex-1 font-medium">{displayedError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="student-email"
                  className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5"
                >
                  Email address
                </label>
                <input
                  id="student-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@school.edu"
                  disabled={isSubmitting}
                  className="w-full min-h-[44px] rounded-lg border border-input bg-background px-3.5 py-2.5 text-base text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition shadow-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="student-name"
                  className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5"
                >
                  Your name
                </label>
                <input
                  id="student-name"
                  type="text"
                  autoComplete="name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  disabled={isSubmitting}
                  className="w-full min-h-[44px] rounded-lg border border-input bg-background px-3.5 py-2.5 text-base text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition shadow-sm"
                />
              </div>

              {/* Big Kahoot!-style Class Code Input */}
              <div className="rounded-xl border-2 border-indigo-200 bg-indigo-50/40 p-3.5 sm:p-4 transition focus-within:border-primary focus-within:bg-indigo-50/70">
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="class-code"
                    className="block text-xs font-bold uppercase tracking-wider text-indigo-900"
                  >
                    Class code
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleUseDemo(false)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline min-h-[32px] px-1.5 rounded"
                    >
                      <Sparkles className="h-3 w-3" />
                      Fill Demo Code
                    </button>
                    <span className="text-xs text-muted-foreground">·</span>
                    <button
                      type="button"
                      onClick={() => handleUseDemo(true)}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 hover:underline min-h-[32px] px-1.5 rounded"
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
                  value={classCode}
                  onChange={(e) => setClassCode(e.target.value.toUpperCase())}
                  placeholder="e.g. ACED2026"
                  disabled={isSubmitting}
                  className="w-full h-13 min-h-[48px] rounded-lg border border-indigo-200 bg-background px-4 py-2.5 text-lg font-mono font-bold tracking-widest uppercase text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring transition text-center sm:text-left shadow-inner"
                />
                <p className="mt-1.5 text-[11px] text-muted-foreground">
                  Ask your teacher or class rep for your 8-character class code.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full min-h-[48px] items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-base font-semibold text-primary-foreground shadow-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 transition cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Entering class orbit...</span>
                ) : (
                  <>
                    <span>Enter Class</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Attribution Footnote */}
            <div className="mt-6 border-t border-border pt-4">
              <p className="text-xs text-muted-foreground text-center sm:text-left">
                Every edit attributes your name and email to prevent griefing. Rollbacks are managed by the designated Class Leader.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
