import { useState, type FormEvent } from 'react';
import { useSession } from '@/context/SessionContext';
import { GraduationCap, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

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
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <GraduationCap className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Join Your Class Board
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Crowdsourced assignments and deadlines for your class.
          </p>
        </div>

        {displayedError && (
          <div
            role="alert"
            className="mb-4 flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800"
          >
            <AlertCircle className="h-5 w-5 shrink-0 text-red-600 mt-0.5" />
            <span className="flex-1 font-medium">{displayedError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="student-email"
              className="block text-sm font-medium text-foreground mb-1"
            >
              Email Address
            </label>
            <input
              id="student-email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. alex@school.edu"
              disabled={isSubmitting}
              className="w-full min-h-[44px] rounded-md border border-input bg-background px-3 py-2 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition"
            />
          </div>

          <div>
            <label
              htmlFor="student-name"
              className="block text-sm font-medium text-foreground mb-1"
            >
              Your Name
            </label>
            <input
              id="student-name"
              type="text"
              autoComplete="name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Alex Rivera"
              disabled={isSubmitting}
              className="w-full min-h-[44px] rounded-md border border-input bg-background px-3 py-2 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="class-code"
                className="block text-sm font-medium text-foreground"
              >
                Class Code
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleUseDemo(false)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline min-h-[32px] px-1"
                >
                  <Sparkles className="h-3 w-3" />
                  Fill Demo Code
                </button>
                <span className="text-xs text-muted-foreground">|</span>
                <button
                  type="button"
                  onClick={() => handleUseDemo(true)}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline min-h-[32px] px-1"
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
              className="w-full min-h-[44px] rounded-md border border-input bg-background px-3 py-2 text-base uppercase font-mono tracking-wider text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full min-h-[44px] items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-base font-semibold text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 transition shadow-sm"
          >
            {isSubmitting ? (
              <span>Joining...</span>
            ) : (
              <>
                <span>Enter Class</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 border-t border-border pt-4 text-center">
          <p className="text-xs text-muted-foreground">
            Sign in with email and class code. Edits are attributed to your email/name to prevent griefing.
          </p>
        </div>
      </div>
    </div>
  );
}
