import { useState, type FormEvent } from 'react';
import { useSession } from '@/context/SessionContext';
import { ArrowRight, AlertCircle, Sparkles, GraduationCap, CheckCircle2 } from 'lucide-react';
import { ClassroomIllustration } from './ClassroomIllustration';

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
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-background">
      {/* Left Column: Full-height Educational Vector Artwork Pane (Desktop / Tablet) */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-7/12 p-4 xl:p-6 bg-muted/20">
        <ClassroomIllustration />
      </div>

      {/* Right Column: Full-height Clean Form Container */}
      <div className="flex flex-1 flex-col justify-center px-6 py-8 sm:px-12 lg:px-12 xl:px-16 min-h-screen">
        <div className="w-full max-w-lg mx-auto">
          {/* Mobile Educational Accent Banner */}
          <div className="mb-6 flex items-center gap-2.5 rounded-xl bg-indigo-50 px-3.5 py-2.5 text-xs font-semibold text-indigo-700 lg:hidden border border-indigo-100 shadow-sm">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GraduationCap className="h-4 w-4" />
            </div>
            <span>Crowdsourced Class Deadline Board</span>
          </div>

          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-2.5 mb-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm shadow-sm">
                A
              </span>
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-xs tracking-wider uppercase text-muted-foreground font-bold">
                  Aced Platform
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 rounded-full px-2 py-0.2">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                  Class of 2026
                </span>
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Join your class board
            </h2>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              Crowdsourced deadlines, missing date alerts, and synchronized assignments for your classmates.
            </p>
          </div>

          {/* Error Message */}
          {displayedError && (
            <div
              id="join-form-error"
              role="alert"
              className="mb-5 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 p-3.5 text-sm text-red-800"
            >
              <AlertCircle className="h-5 w-5 shrink-0 text-red-600 mt-0.5" />
              <span className="flex-1 font-medium">{displayedError}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5" noValidate>
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
                required
                aria-required="true"
                aria-invalid={displayedError ? true : undefined}
                aria-describedby={displayedError ? 'join-form-error' : undefined}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@school.edu"
                disabled={isSubmitting}
                className="w-full min-h-[44px] rounded-lg border border-input bg-card px-3.5 py-2.5 text-base text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition shadow-sm"
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
                required
                aria-required="true"
                aria-invalid={displayedError ? true : undefined}
                aria-describedby={displayedError ? 'join-form-error' : undefined}
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Alex Rivera"
                disabled={isSubmitting}
                className="w-full min-h-[44px] rounded-lg border border-input bg-card px-3.5 py-2.5 text-base text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition shadow-sm"
              />
            </div>

            {/* High-Contrast Class Code Input with Instant Demo Buttons */}
            <div className="rounded-xl border-2 border-indigo-200 bg-indigo-50/50 p-3.5 sm:p-4 transition focus-within:border-primary focus-within:bg-indigo-50/80">
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
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline min-h-[32px] px-1.5 rounded focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Sparkles className="h-3 w-3" />
                    Fill Demo Code
                  </button>
                  <span className="text-xs text-muted-foreground">·</span>
                  <button
                    type="button"
                    onClick={() => handleUseDemo(true)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-700 hover:underline min-h-[32px] px-1.5 rounded focus-visible:ring-2 focus-visible:ring-ring"
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
                className="w-full min-h-[48px] rounded-lg border border-indigo-200 bg-background px-4 py-2.5 text-lg font-mono font-bold tracking-widest uppercase text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring transition text-center sm:text-left shadow-inner"
              />
              <p className="mt-1.5 text-xs text-muted-foreground">
                Ask your teacher or class representative for your 8-character class code.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full min-h-[48px] items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-base font-semibold text-primary-foreground shadow-md hover:bg-primary/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 transition cursor-pointer"
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

          {/* Attribution Footnote */}
          <div className="mt-6 sm:mt-8 border-t border-border pt-4">
            <p className="text-xs text-muted-foreground text-center sm:text-left leading-relaxed">
              Every edit attributes your name and email to prevent griefing. Rollbacks are managed by the designated Class Leader.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
