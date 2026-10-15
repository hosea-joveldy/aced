export function SolarSystemIllustration() {
  return (
    <div
      className="relative flex h-full w-full flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-8 text-white shadow-2xl"
      aria-hidden="true"
    >
      {/* Background Starfield */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute top-[10%] left-[15%] h-1 w-1 rounded-full bg-white shadow-[0_0_6px_#fff]" />
        <div className="absolute top-[25%] left-[75%] h-1.5 w-1.5 rounded-full bg-indigo-200 shadow-[0_0_8px_#818cf8]" />
        <div className="absolute top-[40%] left-[20%] h-1 w-1 rounded-full bg-white shadow-[0_0_6px_#fff]" />
        <div className="absolute top-[65%] left-[80%] h-1 w-1 rounded-full bg-amber-200 shadow-[0_0_6px_#fde68a]" />
        <div className="absolute top-[80%] left-[30%] h-1.5 w-1.5 rounded-full bg-indigo-300 shadow-[0_0_8px_#c7d2fe]" />
        <div className="absolute top-[18%] left-[45%] h-0.5 w-0.5 rounded-full bg-white" />
        <div className="absolute top-[55%] left-[10%] h-0.5 w-0.5 rounded-full bg-white" />
        <div className="absolute top-[72%] left-[60%] h-0.5 w-0.5 rounded-full bg-white" />
        <div className="absolute top-[88%] left-[85%] h-1 w-1 rounded-full bg-white shadow-[0_0_6px_#fff]" />
      </div>

      {/* Top Brand Pill */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-950/60 px-3 py-1 text-xs font-semibold text-indigo-300 backdrop-blur-md">
          <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
          <span>Aced Orbital System</span>
        </div>
        <span className="text-xs font-mono text-indigo-300/60">Class Orbit v1.0</span>
      </div>

      {/* Center Interactive Celestial Canvas (SVG Orbital System) */}
      <div className="relative my-auto flex h-[360px] w-full items-center justify-center">
        {/* Ambient Glows */}
        <div className="absolute h-64 w-64 rounded-full bg-indigo-600/20 blur-3xl" />
        <div className="absolute h-32 w-32 rounded-full bg-amber-500/15 blur-2xl" />

        {/* Orbit Path 1 (Inner) */}
        <div className="absolute h-[120px] w-[120px] rounded-full border border-indigo-400/20" />
        {/* Planet 1 - Math */}
        <div
          className="absolute flex items-center justify-center"
          style={{ transform: 'rotate(45deg) translate(60px) rotate(-45deg)' }}
        >
          <div className="relative group cursor-default">
            <div className="h-4 w-4 rounded-full bg-gradient-to-tr from-amber-600 to-amber-300 shadow-[0_0_12px_#f59e0b]" />
            <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-slate-900/90 px-1.5 py-0.5 text-[10px] font-medium text-amber-200 border border-amber-500/30">
              Math
            </span>
          </div>
        </div>

        {/* Orbit Path 2 */}
        <div className="absolute h-[190px] w-[190px] rounded-full border border-indigo-400/25 border-dashed" />
        {/* Planet 2 - Biology */}
        <div
          className="absolute flex items-center justify-center"
          style={{ transform: 'rotate(190deg) translate(95px) rotate(-190deg)' }}
        >
          <div className="relative group cursor-default">
            <div className="h-5 w-5 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-300 shadow-[0_0_14px_#10b981]" />
            <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-slate-900/90 px-1.5 py-0.5 text-[10px] font-medium text-emerald-200 border border-emerald-500/30">
              Biology
            </span>
          </div>
        </div>

        {/* Orbit Path 3 */}
        <div className="absolute h-[260px] w-[260px] rounded-full border border-indigo-400/20" />
        {/* Planet 3 - Literature with ring */}
        <div
          className="absolute flex items-center justify-center"
          style={{ transform: 'rotate(310deg) translate(130px) rotate(-310deg)' }}
        >
          <div className="relative flex items-center justify-center">
            <div className="absolute h-7 w-7 rounded-full border border-indigo-300/40 -rotate-45" />
            <div className="h-5 w-5 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-400 shadow-[0_0_14px_#818cf8]" />
            <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-slate-900/90 px-1.5 py-0.5 text-[10px] font-medium text-indigo-200 border border-indigo-500/30">
              English
            </span>
          </div>
        </div>

        {/* Orbit Path 4 (Outer) */}
        <div className="absolute h-[330px] w-[330px] rounded-full border border-indigo-400/15" />
        {/* Planet 4 - Physics */}
        <div
          className="absolute flex items-center justify-center"
          style={{ transform: 'rotate(120deg) translate(165px) rotate(-120deg)' }}
        >
          <div className="relative group cursor-default">
            <div className="h-4 w-4 rounded-full bg-gradient-to-tr from-rose-500 to-amber-300 shadow-[0_0_12px_#f43f5e]" />
            <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-slate-900/90 px-1.5 py-0.5 text-[10px] font-medium text-rose-200 border border-rose-500/30">
              Physics
            </span>
          </div>
        </div>

        {/* Central Sun / Star - ACED Core */}
        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-400 via-indigo-600 to-purple-700 shadow-[0_0_40px_rgba(99,102,241,0.6)]">
          <div className="absolute h-20 w-20 rounded-full border border-indigo-400/30 animate-ping opacity-30" />
          <span className="text-sm font-extrabold tracking-wider text-white">ACED</span>
        </div>

        {/* Floating Deadline Orbit Badges */}
        <div className="absolute top-4 left-6 flex items-center gap-2 rounded-lg border border-red-500/30 bg-slate-900/80 p-2 text-xs backdrop-blur-md shadow-lg animate-bounce [animation-duration:3s]">
          <span className="h-2 w-2 rounded-full bg-red-400" />
          <div className="text-left">
            <p className="font-semibold text-white">Calculus P-Set 4</p>
            <p className="text-[10px] text-red-300">Overdue • Oct 10</p>
          </div>
        </div>

        <div className="absolute bottom-6 right-6 flex items-center gap-2 rounded-lg border border-amber-500/30 bg-slate-900/80 p-2 text-xs backdrop-blur-md shadow-lg">
          <span className="h-2 w-2 rounded-full bg-amber-400" />
          <div className="text-left">
            <p className="font-semibold text-white">Hamlet Essay Outline</p>
            <p className="text-[10px] text-amber-300">Needs Date • Classmate Help</p>
          </div>
        </div>

        <div className="absolute bottom-16 left-8 flex items-center gap-2 rounded-lg border border-indigo-500/30 bg-slate-900/80 p-2 text-xs backdrop-blur-md shadow-lg">
          <span className="h-2 w-2 rounded-full bg-indigo-400" />
          <div className="text-left">
            <p className="font-semibold text-white">Physics Lab Report</p>
            <p className="text-[10px] text-indigo-300">Due Today</p>
          </div>
        </div>
      </div>

      {/* Bottom Mission / Tagline */}
      <div className="relative z-10 border-t border-indigo-900/50 pt-4">
        <h3 className="text-lg font-bold tracking-tight text-white">
          Keep your class in orbit.
        </h3>
        <p className="mt-1 text-xs text-indigo-200/80">
          Crowdsourced assignments, missing date alerts, and one-tap rollbacks. Never let a deadline drift away.
        </p>
      </div>
    </div>
  );
}
