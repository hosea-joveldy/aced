export function ClassroomIllustration() {
  return (
    <div
      className="relative flex h-full w-full flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 p-8 text-white shadow-2xl"
      aria-hidden="true"
    >
      {/* Background Grid Pattern & Ambient Glows */}
      <div className="pointer-events-none absolute inset-0 opacity-10">
        <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="aced-grid-pattern" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="0.75" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#aced-grid-pattern)" />
        </svg>
      </div>

      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-blue-600/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 left-1/3 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-500/10 blur-2xl" />

      {/* Top Header Badge */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-700/60 bg-slate-800/80 px-3.5 py-1.5 text-xs font-semibold text-slate-200 backdrop-blur-md shadow-sm">
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Live Class Deadline Board</span>
        </div>
        <span className="text-xs font-mono font-medium text-slate-400">
          Sync • Crowdsource • Ace
        </span>
      </div>

      {/* Central Interactive Educational Vector Graphic Scene */}
      <div className="relative my-auto flex w-full items-center justify-center py-6">
        <svg
          viewBox="0 0 540 400"
          className="w-full max-w-[480px] drop-shadow-2xl transition-transform duration-500"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="cardGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0f172a" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#020617" stopOpacity="0.98" />
            </linearGradient>
            <linearGradient id="cardGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#0f172a" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="amberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
            <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </linearGradient>
            <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <filter id="cardShadow" x="-10%" y="-10%" width="125%" height="125%">
              <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#000" floodOpacity="0.4" />
            </filter>
            <filter id="badgeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#2563eb" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* Background Board Frame (School Slate Surface) */}
          <rect
            x="30"
            y="25"
            width="480"
            height="350"
            rx="18"
            fill="#020617"
            stroke="#334155"
            strokeWidth="1.5"
            strokeDasharray="6 4"
            opacity="0.9"
          />

          {/* Board Grid Lines */}
          <line x1="30" y1="95" x2="510" y2="95" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="30" y1="190" x2="510" y2="190" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="30" y1="285" x2="510" y2="285" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="190" y1="25" x2="190" y2="375" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="350" y1="25" x2="350" y2="375" stroke="#1e293b" strokeWidth="1" strokeDasharray="3 3" />

          {/* Calendar Widget in Top-Left */}
          <g transform="translate(50, 42)">
            <rect x="0" y="0" width="115" height="110" rx="12" fill="url(#cardGrad1)" stroke="#334155" strokeWidth="1.2" filter="url(#cardShadow)" />
            {/* Calendar Header Bar */}
            <path d="M 0 12 Q 0 0 12 0 L 103 0 Q 115 0 115 12 L 115 28 L 0 28 Z" fill="#2563eb" />
            <circle cx="20" cy="14" r="2.5" fill="#dbeafe" />
            <circle cx="95" cy="14" r="2.5" fill="#dbeafe" />
            <text x="57" y="18" fill="#ffffff" fontSize="9" fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle" letterSpacing="0.5">
              OCTOBER 2026
            </text>
            {/* Big Date Number */}
            <text x="57" y="70" fill="#ffffff" fontSize="34" fontWeight="800" fontFamily="system-ui, sans-serif" textAnchor="middle">
              15
            </text>
            <rect x="15" y="82" width="85" height="18" rx="6" fill="#1e293b" stroke="#3b82f6" strokeWidth="0.8" />
            <text x="57" y="94" fill="#93c5fd" fontSize="8" fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle">
              TODAY • 3 DEADLINES
            </text>
          </g>

          {/* Collaborative Connection Sync Lines between Cards */}
          <path
            d="M 165 95 C 230 95, 220 150, 270 150"
            stroke="#3b82f6"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            opacity="0.6"
          />
          <circle cx="218" cy="122" r="3" fill="#60a5fa" />

          <path
            d="M 370 215 C 410 215, 390 280, 420 280"
            stroke="#10b981"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            opacity="0.6"
          />

          {/* Floating Assignment Card 1: Missing Due Date (Crowdsource Core Value) */}
          <g transform="translate(190, 50)" filter="url(#cardShadow)">
            <rect x="0" y="0" width="280" height="92" rx="12" fill="url(#cardGrad1)" stroke="#d97706" strokeWidth="1.2" strokeOpacity="0.8" />
            {/* Subject pill */}
            <rect x="14" y="12" width="70" height="18" rx="5" fill="#451a03" stroke="#b45309" strokeWidth="0.8" />
            <text x="49" y="24" fill="#fde68a" fontSize="8.5" fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle">
              AP CALCULUS
            </text>
            {/* Needs Date Alert Tag */}
            <rect x="90" y="12" width="84" height="18" rx="5" fill="#78350f" stroke="#f59e0b" strokeWidth="0.8" />
            <circle cx="98" cy="21" r="3" fill="#f59e0b" />
            <text x="136" y="24" fill="#fef3c7" fontSize="8" fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle">
              NEEDS DATE
            </text>

            {/* Assignment Title */}
            <text x="14" y="47" fill="#f8fafc" fontSize="12" fontWeight="700" fontFamily="system-ui, sans-serif">
              Problem Set #4: Implicit Differentiation
            </text>

            {/* Classmate Solution Marker */}
            <rect x="14" y="58" width="252" height="22" rx="6" fill="#0f172a" stroke="#334155" strokeWidth="0.8" />
            <circle cx="26" cy="69" r="6" fill="#2563eb" />
            <text x="26" y="72" fill="#ffffff" fontSize="7" fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle">
              AR
            </text>
            <text x="38" y="72" fill="#cbd5e1" fontSize="8.5" fontFamily="system-ui, sans-serif">
              Alex R. set due date: <tspan fill="#fde68a" fontWeight="bold">Tomorrow, 11:59 PM</tspan>
            </text>
            <path d="M 248 66 L 252 70 L 258 64" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </g>

          {/* Floating Assignment Card 2: Due Today (Urgent / Active) */}
          <g transform="translate(60, 168)" filter="url(#cardShadow)">
            <rect x="0" y="0" width="275" height="88" rx="12" fill="url(#cardGrad1)" stroke="#2563eb" strokeWidth="1.2" />
            {/* Subject pill */}
            <rect x="14" y="12" width="60" height="18" rx="5" fill="#1e3a8a" stroke="#2563eb" strokeWidth="0.8" />
            <text x="44" y="24" fill="#bfdbfe" fontSize="8.5" fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle">
              BIOLOGY
            </text>
            {/* Due Today Badge */}
            <rect x="80" y="12" width="76" height="18" rx="5" fill="#1d4ed8" stroke="#3b82f6" strokeWidth="0.8" />
            <circle cx="89" cy="21" r="3" fill="#93c5fd" />
            <text x="122" y="24" fill="#eff6ff" fontSize="8" fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle">
              DUE TODAY
            </text>

            <text x="14" y="47" fill="#ffffff" fontSize="12" fontWeight="700" fontFamily="system-ui, sans-serif">
              Photosynthesis Lab Report &amp; Data
            </text>

            <text x="14" y="68" fill="#94a3b8" fontSize="8.5" fontFamily="system-ui, sans-serif">
              Submit on Google Classroom (Code: <tspan fill="#e2e8f0" fontFamily="monospace" fontWeight="bold">bio-402</tspan>)
            </text>
          </g>

          {/* Floating Assignment Card 3: Completed Assignment (Done state) */}
          <g transform="translate(210, 272)" filter="url(#cardShadow)">
            <rect x="0" y="0" width="270" height="82" rx="12" fill="url(#cardGrad2)" stroke="#059669" strokeWidth="1.2" strokeOpacity="0.8" />
            {/* Subject pill */}
            <rect x="14" y="12" width="58" height="18" rx="5" fill="#064e3b" stroke="#047857" strokeWidth="0.8" />
            <text x="43" y="24" fill="#a7f3d0" fontSize="8.5" fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle">
              ENGLISH
            </text>
            {/* Done Badge */}
            <rect x="78" y="12" width="58" height="18" rx="5" fill="#064e3b" stroke="#10b981" strokeWidth="0.8" />
            <path d="M 86 21 L 89 24 L 95 18" stroke="#34d399" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <text x="115" y="24" fill="#ecfdf5" fontSize="8" fontWeight="bold" fontFamily="system-ui, sans-serif" textAnchor="middle">
              DONE
            </text>

            <text x="14" y="46" fill="#cbd5e1" fontSize="11.5" fontWeight="600" textDecoration="line-through" fontFamily="system-ui, sans-serif">
              Hamlet Act III Soliloquy Analysis
            </text>

            <text x="14" y="66" fill="#64748b" fontSize="8.5" fontFamily="system-ui, sans-serif">
              Verified &amp; turned in by 28 classmates
            </text>
          </g>

          {/* Floating Academic Badge (Graduation Cap & Notebook Badge) */}
          <g transform="translate(390, 160)" filter="url(#badgeGlow)">
            <circle cx="36" cy="36" r="32" fill="#0f172a" stroke="#3b82f6" strokeWidth="1.5" />
            {/* Graduation Cap Vector Icon */}
            <path
              d="M 36 22 L 52 29 L 36 36 L 20 29 Z"
              fill="#93c5fd"
            />
            <path
              d="M 25 32 L 25 42 C 25 46 47 46 47 42 L 47 32"
              fill="none"
              stroke="#93c5fd"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M 52 29 L 52 44"
              stroke="#fbbf24"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <circle cx="52" cy="45" r="1.5" fill="#fbbf24" />
          </g>

          {/* Floating Classmate Avatar Sync Group */}
          <g transform="translate(65, 275)" filter="url(#cardShadow)">
            <rect x="0" y="0" width="130" height="52" rx="10" fill="#0f172a" stroke="#334155" strokeWidth="1" />
            <text x="12" y="18" fill="#94a3b8" fontSize="8" fontWeight="bold" fontFamily="system-ui, sans-serif">
              CLASS REPS ACTIVE
            </text>
            {/* Overlapping Avatars */}
            <circle cx="24" cy="34" r="11" fill="#2563eb" stroke="#0f172a" strokeWidth="2" />
            <text x="24" y="37" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="system-ui, sans-serif">A</text>

            <circle cx="42" cy="34" r="11" fill="#059669" stroke="#0f172a" strokeWidth="2" />
            <text x="42" y="37" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="system-ui, sans-serif">B</text>

            <circle cx="60" cy="34" r="11" fill="#d97706" stroke="#0f172a" strokeWidth="2" />
            <text x="60" y="37" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="system-ui, sans-serif">C</text>

            <circle cx="78" cy="34" r="11" fill="#0284c7" stroke="#0f172a" strokeWidth="2" />
            <text x="78" y="37" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="system-ui, sans-serif">+6</text>

            <path d="M 98 34 L 114 34 M 109 29 L 114 34 L 109 39" stroke="#60a5fa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        </svg>
      </div>

      {/* Bottom Value Props Banner */}
      <div className="relative z-10 border-t border-slate-800 pt-5">
        <h3 className="text-lg font-bold tracking-tight text-white">
          Never miss an unannounced deadline again.
        </h3>
        <p className="mt-1 text-xs text-slate-400 leading-relaxed max-w-lg">
          Crowdsource assignment dates, fill in missing deadlines together, and keep your class synchronized — with full transparent edit attribution.
        </p>
      </div>
    </div>
  );
}
