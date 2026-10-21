import { useState, type FormEvent } from 'react';
import { useSession } from '@/context/SessionContext';
import { ArrowRight, AlertCircle, Sparkles, Check, ArrowLeft, PlusCircle, LogIn } from 'lucide-react';

interface JoinClassFormProps {
  initialMode?: 'join' | 'create';
  onBackToLanding?: () => void;
}

export function JoinClassForm({ initialMode = 'join', onBackToLanding }: JoinClassFormProps) {
  const { joinClass, createClass, error } = useSession();
  const [mode, setMode] = useState<'join' | 'create'>(initialMode);

  // Form Fields
  const [email, setEmail] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [classCode, setClassCode] = useState('');
  const [className, setClassName] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localValidation, setLocalValidation] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalValidation(null);

    const trimmedEmail = email.trim();
    const trimmedName = displayName.trim();
    const trimmedCode = classCode.trim();
    const trimmedClassName = className.trim();

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

    if (mode === 'join') {
      if (!trimmedCode) {
        setLocalValidation('Please enter a class code.');
        return;
      }
      setIsSubmitting(true);
      const success = await joinClass(trimmedEmail, trimmedName, trimmedCode);
      setIsSubmitting(false);
      if (success && typeof window !== 'undefined') {
        window.location.hash = '#/';
      }
    } else {
      if (!trimmedClassName) {
        setLocalValidation('Please enter a class name.');
        return;
      }
      setIsSubmitting(true);
      const success = await createClass(trimmedClassName, trimmedName, trimmedEmail, trimmedCode || undefined);
      setIsSubmitting(false);
      if (success && typeof window !== 'undefined') {
        window.location.hash = '#/';
      }
    }
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
    <div className="min-h-screen w-full bg-[#FAF9F5] text-[#141413] flex flex-col justify-between selection:bg-[#141413] selection:text-[#FAF9F5]">
      {/* Top Navbar */}
      <header className="w-full px-6 py-5 sm:px-10 lg:px-14 flex items-center justify-between border-b border-[#E8E7E0]">
        <div className="flex items-center gap-2.5">
          <span className="flex items-center">
            <span className="h-4 w-4 rounded-full bg-[#141413] inline-block" />
            <span className="h-4 w-4 rounded-full border-2 border-[#141413] inline-block -ml-1.5 bg-[#FAF9F5]" />
          </span>
          <span className="text-xl font-serif font-bold tracking-tight text-[#141413]">
            Aced
          </span>
        </div>

        {onBackToLanding && (
          <button
            type="button"
            onClick={onBackToLanding}
            className="inline-flex min-h-[36px] items-center gap-1.5 rounded-full border border-[#D5D4CC] bg-white px-3.5 py-1 text-xs font-semibold text-[#52524E] hover:text-[#141413] hover:bg-[#F2F1EB] transition cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Landing Page</span>
          </button>
        )}
      </header>

      {/* Main Split Layout (Layout inspired by login-reference.png) */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-10 sm:px-10 lg:px-14 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
        {/* Left Editorial Branding Hero */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center max-w-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D5D4CC] bg-[#F2F1EB] px-3.5 py-1 text-xs font-medium text-[#52524E] mb-4 w-fit">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
            <span>Crowdsourced Deadline Board</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl tracking-tight text-[#141413] font-serif font-normal leading-[1.1]">
            <span className="italic">Ace</span> with Aced.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-[#52524E] font-normal leading-relaxed">
            One crowdsourced board where classmates synchronize assignments, resolve missing due dates,
            and stay ahead of unannounced homework.
          </p>

          {/* Minimalist Feature Bullet List */}
          <div className="mt-8 space-y-3.5 border-t border-[#E8E7E0] pt-6">
            <div className="flex items-center gap-3 text-sm text-[#4A4A46]">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#EFEFE9] text-[#141413]">
                <Check className="h-3 w-3" />
              </div>
              <span>One unified board for all subjects, teachers, and assignments</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-[#4A4A46]">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#EFEFE9] text-[#141413]">
                <Check className="h-3 w-3" />
              </div>
              <span>Missing due date alerts crowdsourced and completed by classmates</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-[#4A4A46]">
              <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#EFEFE9] text-[#141413]">
                <Check className="h-3 w-3" />
              </div>
              <span>Transparent edit history with one-tap Class Leader rollback</span>
            </div>
          </div>
        </div>

        {/* Right Floating Minimalist Card (Layout inspired by login-reference.png) */}
        <div className="w-full lg:w-auto flex justify-center lg:justify-end">
          <div className="w-full max-w-[440px] rounded-3xl bg-white border border-[#E2E1DA] p-7 sm:p-9 shadow-xl">
            {/* Mode Switcher Tabs */}
            <div className="flex rounded-full bg-[#F2F1EB] p-1 mb-6 border border-[#E2E1DA]">
              <button
                type="button"
                onClick={() => {
                  setMode('join');
                  setLocalValidation(null);
                }}
                className={`flex-1 py-1.5 px-3 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  mode === 'join'
                    ? 'bg-[#141413] text-white shadow-sm'
                    : 'text-[#73726C] hover:text-[#141413]'
                }`}
              >
                <LogIn className="h-3.5 w-3.5" />
                <span>Join Class</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('create');
                  setLocalValidation(null);
                }}
                className={`flex-1 py-1.5 px-3 rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  mode === 'create'
                    ? 'bg-[#141413] text-white shadow-sm'
                    : 'text-[#73726C] hover:text-[#141413]'
                }`}
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>Create Class</span>
              </button>
            </div>

            <div className="mb-6 text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-serif font-semibold tracking-tight text-[#141413]">
                {mode === 'join' ? 'Join your class board' : 'Create a new class'}
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm text-[#73726C]">
                {mode === 'join'
                  ? 'Enter your class code and student profile to continue'
                  : 'Start a new cohort. You will automatically become the Class Leader'}
              </p>
            </div>

            {/* Error Banner */}
            {displayedError && (
              <div
                id="join-form-error"
                role="alert"
                className="mb-5 flex items-start gap-2.5 rounded-2xl border border-red-200 bg-red-50 p-3 text-xs text-red-900"
              >
                <AlertCircle className="h-4 w-4 shrink-0 text-red-600 mt-0.5" />
                <span className="flex-1 font-medium">{displayedError}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {mode === 'create' && (
                <div>
                  <label
                    htmlFor="class-name"
                    className="block text-xs font-semibold uppercase tracking-wider text-[#73726C] mb-1.5"
                  >
                    Class name
                  </label>
                  <input
                    id="class-name"
                    type="text"
                    required
                    value={className}
                    onChange={(e) => setClassName(e.target.value)}
                    placeholder="e.g. Class of 2027 — Period 2"
                    disabled={isSubmitting}
                    className="w-full min-h-[44px] rounded-xl border border-[#DCDAD2] bg-[#FAF9F5] px-3.5 py-2.5 text-base sm:text-sm text-[#141413] placeholder:text-[#9A9890] focus:outline-none focus:border-[#141413] focus:ring-1 focus:ring-[#141413] transition"
                  />
                </div>
              )}

              <div>
                <label
                  htmlFor="student-email"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#73726C] mb-1.5"
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
                  className="w-full min-h-[44px] rounded-xl border border-[#DCDAD2] bg-[#FAF9F5] px-3.5 py-2.5 text-base sm:text-sm text-[#141413] placeholder:text-[#9A9890] focus:outline-none focus:border-[#141413] focus:ring-1 focus:ring-[#141413] transition"
                />
              </div>

              <div>
                <label
                  htmlFor="student-name"
                  className="block text-xs font-semibold uppercase tracking-wider text-[#73726C] mb-1.5"
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
                  className="w-full min-h-[44px] rounded-xl border border-[#DCDAD2] bg-[#FAF9F5] px-3.5 py-2.5 text-base sm:text-sm text-[#141413] placeholder:text-[#9A9890] focus:outline-none focus:border-[#141413] focus:ring-1 focus:ring-[#141413] transition"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label
                    htmlFor="class-code"
                    className="block text-xs font-semibold uppercase tracking-wider text-[#73726C]"
                  >
                    {mode === 'join' ? 'Class code' : 'Custom Class Code (optional)'}
                  </label>
                  {mode === 'join' && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleUseDemo(false)}
                        className="inline-flex items-center gap-1 text-xs text-[#73726C] hover:text-[#141413] transition min-h-[28px] px-1 rounded cursor-pointer"
                      >
                        <Sparkles className="h-3 w-3 text-amber-600" />
                        Fill Demo Code
                      </button>
                      <span className="text-[#D5D4CC]">·</span>
                      <button
                        type="button"
                        onClick={() => handleUseDemo(true)}
                        className="text-xs text-[#73726C] hover:text-[#141413] transition min-h-[28px] px-1 rounded cursor-pointer"
                        title="Fill demo as class leader"
                      >
                        Demo Leader
                      </button>
                    </div>
                  )}
                </div>
                <input
                  id="class-code"
                  type="text"
                  autoCapitalize="characters"
                  autoCorrect="off"
                  required={mode === 'join'}
                  aria-required={mode === 'join' ? 'true' : 'false'}
                  aria-invalid={displayedError ? true : undefined}
                  aria-describedby={displayedError ? 'join-form-error' : undefined}
                  value={classCode}
                  onChange={(e) => setClassCode(e.target.value.toUpperCase())}
                  placeholder={mode === 'join' ? 'e.g. ACED2026' : 'Leave blank for auto code'}
                  disabled={isSubmitting}
                  className="w-full min-h-[44px] rounded-xl border border-[#DCDAD2] bg-[#FAF9F5] px-3.5 py-2.5 text-base sm:text-sm font-mono font-bold tracking-widest uppercase text-[#141413] placeholder:text-[#9A9890] focus:outline-none focus:border-[#141413] focus:ring-1 focus:ring-[#141413] transition text-center sm:text-left"
                />
              </div>

              {/* High-Contrast Pill Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-3 flex w-full min-h-[46px] items-center justify-center gap-2 rounded-full bg-[#141413] px-5 py-3 text-sm font-semibold text-white hover:bg-black focus:outline-none focus-visible:ring-2 focus-visible:ring-[#141413] disabled:opacity-50 transition cursor-pointer shadow-md"
              >
                {isSubmitting ? (
                  <span>Processing...</span>
                ) : mode === 'join' ? (
                  <>
                    <span>Enter Class</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    <span>Create Class & Become Leader</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            {/* Attribution note */}
            <div className="mt-5 border-t border-[#E8E7E0] pt-4 text-center">
              <p className="text-[11px] text-[#73726C] leading-relaxed">
                {mode === 'join'
                  ? 'All edits are attributed by name and email. Only the designated Class Leader can execute rollbacks.'
                  : 'As creator, you will be the Class Leader with full rollback privileges, and you can transfer leadership anytime.'}
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Clean Minimalist Bottom Footer without old text */}
      <footer className="w-full px-6 py-4 sm:px-10 lg:px-14 border-t border-[#E8E7E0] flex items-center justify-between text-xs text-[#73726C]">
        <div className="flex items-center gap-2">
          <span>Aced Cohort Workspace</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 inline-block" />
          <span>Active</span>
        </div>
      </footer>
    </div>
  );
}
