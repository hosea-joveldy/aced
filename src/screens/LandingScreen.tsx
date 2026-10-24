import { useState } from 'react';
import { InteractiveHeroCanvas } from '@/components/landing/InteractiveHeroCanvas';
import {
  Users,
  ShieldCheck,
  ArrowRight,
  ChevronDown,
  Layers,
  Clock,
} from 'lucide-react';

interface LandingScreenProps {
  onJoinClick: () => void;
  onCreateClick: () => void;
}

export function LandingScreen({ onJoinClick, onCreateClick }: LandingScreenProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq((prev) => (prev === index ? null : index));
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-[#141413] flex flex-col font-sans selection:bg-[#141413] selection:text-[#FAF9F5]">
      {/* 1. Header Navigation */}
      <header className="sticky top-0 z-40 w-full border-b border-[#E8E7E0]/80 bg-[#FAF9F5]/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <span className="flex items-center">
              <span className="h-4 w-4 rounded-full bg-[#141413] inline-block shadow-sm" />
              <span className="h-4 w-4 rounded-full border-2 border-[#141413] inline-block -ml-1.5 bg-[#FAF9F5]" />
            </span>
            <span className="text-xl font-serif font-bold tracking-tight text-[#141413]">
              Aced
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#52524E]">
            <a href="#features" className="hover:text-[#141413] transition">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-[#141413] transition">
              How it Works
            </a>
            <a href="#overview" className="hover:text-[#141413] transition">
              Overview
            </a>
            <a href="#faq" className="hover:text-[#141413] transition">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onJoinClick}
              className="inline-flex min-h-[40px] items-center gap-2 rounded-full border border-[#D5D4CC] bg-[#F2F1EB] px-4 py-2 text-xs font-semibold text-[#141413] hover:bg-[#EAE9E2] transition cursor-pointer"
            >
              <span>Join Class</span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#141413]" />
            </button>
            <button
              type="button"
              onClick={onCreateClick}
              className="inline-flex min-h-[40px] items-center gap-2 rounded-full bg-[#141413] px-5 py-2 text-xs font-semibold text-white hover:bg-black transition shadow-sm cursor-pointer"
            >
              <span>Create Class</span>
              <span className="h-1.5 w-1.5 rounded-full bg-[#D4F24D]" />
            </button>
          </div>
        </div>
      </header>

      {/* 2. Hero Section with Interactive Mouse Dots Canvas */}
      <section className="relative overflow-hidden min-h-[82vh] flex items-center justify-center border-b border-[#E8E7E0]">
        <InteractiveHeroCanvas />

        <div className="relative z-10 mx-auto max-w-4xl px-4 py-24 sm:py-32 text-center">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-serif font-normal text-[#141413] tracking-tight leading-[1.08] max-w-3xl mx-auto">
            Introducing Aced:
            <span className="block mt-2 font-serif italic">
              crowdsourced deadlines for your entire class
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-[#52524E] max-w-2xl mx-auto leading-relaxed">
            Never miss an unannounced deadline again. Classmates add verbal notices,
            chat updates, and coursework in one single shared board with instant rollback.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3.5">
            <button
              type="button"
              onClick={onCreateClick}
              className="inline-flex min-h-[46px] items-center gap-2.5 rounded-full bg-[#141413] px-7 py-3 text-sm font-semibold text-white hover:bg-black transition-all shadow-md cursor-pointer hover:scale-[1.02]"
            >
              <span>Create a class</span>
              <span className="h-2 w-2 rounded-full bg-[#D4F24D]" />
            </button>

            <button
              type="button"
              onClick={onJoinClick}
              className="inline-flex min-h-[46px] items-center gap-2.5 rounded-full border border-[#D5D4CC] bg-[#EAE9E2] px-7 py-3 text-sm font-semibold text-[#141413] hover:bg-[#E2E1DA] transition-all cursor-pointer"
            >
              <span>Join with code</span>
              <span className="h-2 w-2 rounded-full bg-[#141413]" />
            </button>
          </div>
        </div>
      </section>

      {/* 3. Bento Value Cards (Section 2 Reference) */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 border-b border-[#E8E7E0] bg-[#FAF9F5]">
        <div className="mx-auto max-w-6xl space-y-12">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-3xl border border-[#E2E1DA] bg-[#F2F1EB] p-8 sm:p-10 flex flex-col justify-between hover:border-[#D5D4CC] transition shadow-sm">
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#141413] shadow-sm mb-6">
                  <Users className="h-5 w-5" />
                </div>
                <h3 className="text-2xl font-serif font-semibold text-[#141413]">
                  Decentralized & Crowdsourced
                </h3>
                <p className="mt-3 text-sm sm:text-base text-[#52524E] leading-relaxed">
                  Teachers announce deadlines inconsistently—some verbally, some in chat groups,
                  and some without due dates. Any student can add or adjust deadlines so the whole
                  class stays synchronized.
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-[#E2E1DA] flex items-center gap-2 text-xs font-semibold text-[#141413]">
                <span>Open cohort collaboration</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </div>

            <div className="rounded-3xl border border-[#E2E1DA] bg-[#F2F1EB] p-8 sm:p-10 flex flex-col justify-between hover:border-[#D5D4CC] transition shadow-sm">
              <div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#141413] shadow-sm mb-6">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="text-2xl font-serif font-semibold text-[#141413]">
                  Role-Based Integrity & Rollback
                </h3>
                <p className="mt-3 text-sm sm:text-base text-[#52524E] leading-relaxed">
                  Every edit records what changed, who changed it, and when. The Class Leader has
                  exclusive one-tap rollback permissions to revert erroneous edits or griefing with
                  full transparency.
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-[#E2E1DA] flex items-center gap-2 text-xs font-semibold text-[#141413]">
                <span>Guaranteed audit trail</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </div>

          {/* Sub-Showcase: Organize with Aced */}
          <div className="rounded-3xl border border-[#E2E1DA] bg-[#F7F6F1] p-8 sm:p-12 flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="max-w-xl space-y-4">
              <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-[#141413] tracking-tight">
                Organize every subject in one clean, grouped board.
              </h2>

              <p className="text-sm sm:text-base text-[#52524E] leading-relaxed">
                Assignments are automatically sorted into <em>Needs a Date</em>, <em>Overdue</em>,{' '}
                <em>Due Today</em>, <em>This Week</em>, <em>Later</em>, and <em>Done</em>. Filter
                by subject with one click.
              </p>

              <div className="pt-2 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={onJoinClick}
                  className="inline-flex min-h-[42px] items-center gap-2 rounded-full bg-[#141413] px-6 py-2.5 text-xs font-semibold text-white hover:bg-black transition cursor-pointer"
                >
                  <span>Explore Demo Board</span>
                  <span className="h-1.5 w-1.5 rounded-full bg-[#D4F24D]" />
                </button>
              </div>
            </div>

            {/* Visual Widget Preview */}
            <div className="w-full lg:w-96 rounded-2xl border border-[#E2E1DA] bg-white p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-[#F0EFEB] pb-2 text-xs text-[#73726C]">
                <span className="font-semibold text-[#141413]">Timeline Preview</span>
                <span className="text-[11px] font-mono">Period 3</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between rounded-xl bg-red-50 border border-red-200 p-2.5 text-red-900 font-medium">
                  <span>Calculus Problem Set 4</span>
                  <span className="rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-800">
                    Overdue
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-emerald-50 border border-emerald-200 p-2.5 text-emerald-900 font-medium">
                  <span>History Chapter 14 Prep</span>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-800">
                    Due Today
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-amber-50 border border-amber-200 p-2.5 text-amber-900 font-medium">
                  <span>Art Portfolio Brainstorm</span>
                  <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-900">
                    Needs Date
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Dark Moss Showcase Section (Section 3 Reference) */}
      <section id="overview" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#FAF9F5]">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-3xl bg-[#162417] text-white p-8 sm:p-14 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-12 shadow-xl relative overflow-hidden">
            {/* Background subtle radial rings */}
            <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full border border-white/10 pointer-events-none" />
            <div className="absolute -right-40 -bottom-40 w-[30rem] h-[30rem] rounded-full border border-white/5 pointer-events-none" />

            <div className="max-w-xl space-y-6 relative z-10">
              <h2 className="text-3xl sm:text-5xl font-serif font-normal tracking-tight text-white leading-tight">
                Built for students who want zero surprises.
              </h2>

              <p className="text-base text-zinc-300 leading-relaxed">
                Eliminate the anxiety of homework buried in chat groups or classroom
                posts with missing due dates. Aced runs offline, takes zero config to try,
                and gives every student a single reliable source of truth.
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={onCreateClick}
                  className="inline-flex min-h-[46px] items-center gap-2.5 rounded-full bg-[#D4F24D] px-7 py-3 text-sm font-semibold text-black hover:bg-[#C2E03A] transition shadow-lg cursor-pointer"
                >
                  <span>Start your class board</span>
                  <span className="h-2 w-2 rounded-full bg-black" />
                </button>
              </div>
            </div>

            {/* Collage Orbs Graphic */}
            <div className="relative z-10 flex items-center justify-center gap-4 shrink-0">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-2 border-white/20 bg-emerald-950/60 backdrop-blur-md flex flex-col items-center justify-center text-center p-3">
                <Clock className="h-6 w-6 text-[#D4F24D] mb-1" />
                <span className="text-[11px] font-semibold text-white">Zero Missing</span>
              </div>
              <div className="w-32 h-32 sm:w-44 sm:h-44 rounded-full border-2 border-white/30 bg-[#233824] backdrop-blur-md flex flex-col items-center justify-center text-center p-4 shadow-2xl">
                <Layers className="h-8 w-8 text-[#D4F24D] mb-2" />
                <span className="text-sm font-serif font-bold text-white">6 Subjects</span>
                <span className="text-[10px] text-zinc-300">All in sync</span>
              </div>
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-2 border-white/20 bg-emerald-950/60 backdrop-blur-md flex flex-col items-center justify-center text-center p-3">
                <ShieldCheck className="h-6 w-6 text-[#D4F24D] mb-1" />
                <span className="text-[11px] font-semibold text-white">100% Audit</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. How It Works (3 Steps) */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[#E8E7E0] bg-[#FAF9F5]">
        <div className="mx-auto max-w-6xl space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#73726C]">
              Simple 3-Step Setup
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif font-semibold text-[#141413]">
              How your cohort stays in sync
            </h2>
            <p className="text-sm sm:text-base text-[#52524E]">
              From setup to everyday study sessions in less than a minute.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-[#E2E1DA] bg-white p-7 space-y-4">
              <span className="text-3xl font-serif font-bold text-[#141413]">01</span>
              <h3 className="text-lg font-serif font-semibold text-[#141413]">
                Create or Join with Code
              </h3>
              <p className="text-xs sm:text-sm text-[#52524E] leading-relaxed">
                Create a class to automatically become the Class Leader, or join an existing
                class using the short class code provided by your representative.
              </p>
            </div>

            <div className="rounded-3xl border border-[#E2E1DA] bg-white p-7 space-y-4">
              <span className="text-3xl font-serif font-bold text-[#141413]">02</span>
              <h3 className="text-lg font-serif font-semibold text-[#141413]">
                Crowdsource Deadlines
              </h3>
              <p className="text-xs sm:text-sm text-[#52524E] leading-relaxed">
                Any student can add upcoming exams, homework, and lab reports. If a date hasn’t
                been set yet, it lands in "Needs a Date" for classmates to complete.
              </p>
            </div>

            <div className="rounded-3xl border border-[#E2E1DA] bg-white p-7 space-y-4">
              <span className="text-3xl font-serif font-bold text-[#141413]">03</span>
              <h3 className="text-lg font-serif font-semibold text-[#141413]">
                Track & One-Tap Revert
              </h3>
              <p className="text-xs sm:text-sm text-[#52524E] leading-relaxed">
                Every edit is attributed by name and email. The designated Class Leader can undo
                accidental changes with a single click.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ Section */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 border-t border-[#E8E7E0] bg-[#FAF9F5]">
        <div className="mx-auto max-w-3xl space-y-8">
          <div className="text-center space-y-3">
            <h2 className="text-3xl font-serif font-semibold text-[#141413]">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-[#52524E]">
              Everything you need to know about Aced for your school or university cohort.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: 'Do teachers need to sign up or approve this?',
                a: 'No! Aced is 100% crowdsourced by students. Any student can create a class or add assignments the moment they hear about them.',
              },
              {
                q: 'What if someone enters a wrong date or trolls the board?',
                a: 'All changes are permanently attributed with the student’s name and email in the Edit History. Only the designated Class Leader can execute one-click rollbacks.',
              },
              {
                q: 'Can the Class Leader transfer their leadership?',
                a: 'Yes. The student who creates the class is automatically the Class Leader, but they can easily transfer leadership to any classmate at any time.',
              },
              {
                q: 'Does it work offline?',
                a: 'Yes! Aced works in zero-config offline mode storing data directly in your browser. It also seamlessly connects to Supabase when configured.',
              },
            ].map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="rounded-2xl border border-[#E2E1DA] bg-white transition overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="flex w-full items-center justify-between p-5 text-left text-sm font-semibold text-[#141413] hover:bg-[#FAF9F5] transition cursor-pointer"
                  >
                    <span>{item.q}</span>
                    <ChevronDown
                      className={`h-4 w-4 text-[#73726C] transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-[#52524E] leading-relaxed border-t border-[#F2F1EB]">
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="border-t border-[#E8E7E0] bg-[#FAF9F5] py-12 px-4 sm:px-6 lg:px-8 mt-auto">
        <div className="mx-auto flex max-w-6xl flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="flex items-center">
              <span className="h-3.5 w-3.5 rounded-full bg-[#141413] inline-block" />
              <span className="h-3.5 w-3.5 rounded-full border-2 border-[#141413] inline-block -ml-1 bg-[#FAF9F5]" />
            </span>
            <span className="text-base font-serif font-bold text-[#141413]">Aced</span>
            <span className="text-xs text-[#73726C] ml-2">
              © {new Date().getFullYear()} Aced School. All rights reserved.
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 px-3 py-1 text-[11px] font-semibold text-emerald-800">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
              All systems operational
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
