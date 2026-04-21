import { useState } from "react";

export default function Navbar({ activePage, onHomeClick, onVerificationClick, onMatchingClick }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const base = "text-blue-100 hover:text-white text-sm font-medium transition-colors";
  const active = "text-white font-semibold text-sm border-b-2 border-blue-300 pb-0.5";

  return (
    <nav style={{ width: "100%", display: "block", boxSizing: "border-box", background: "#1d4ed8", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)", position: "sticky", top: 0, zIndex: 50 }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={onHomeClick}>
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <span className="text-blue-700 font-black text-sm">FW</span>
            </div>
            <span className="text-white font-bold text-xl tracking-tight">
              Fastest<span className="text-blue-200">work</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <button onClick={onHomeClick} className={`px-3 py-2 rounded-lg transition-colors ${activePage === "home" ? "bg-blue-600 text-white font-semibold text-sm" : base}`}>
              หน้าแรก
            </button>
            <button onClick={onHomeClick} className={`px-3 py-2 rounded-lg ${base}`}>
              หมวดหมู่
            </button>
            <button
              onClick={onVerificationClick}
              className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${activePage === "verification" ? "bg-blue-600 text-white font-semibold text-sm" : base}`}
            >
              🛡️ AI Screening
              {activePage !== "verification" && (
                <span className="bg-blue-500/60 text-blue-100 text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">NEW</span>
              )}
            </button>
            <button
              onClick={onMatchingClick}
              className={`px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors ${activePage === "matching" ? "bg-blue-600 text-white font-semibold text-sm" : base}`}
            >
              🎯 AI Matching
              {activePage !== "matching" && (
                <span className="bg-indigo-400/60 text-blue-100 text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">NEW</span>
              )}
            </button>
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-2">
            <button className="text-white border border-blue-400 hover:bg-blue-600 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors">
              เข้าสู่ระบบ
            </button>
            <button className="bg-white text-blue-700 hover:bg-blue-50 px-4 py-1.5 rounded-lg text-sm font-bold transition-colors">
              สมัครสมาชิก
            </button>
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-1 border-t border-blue-600 pt-3">
            {[
              { label: "หน้าแรก", action: onHomeClick },
              { label: "🛡️ AI Screening", action: onVerificationClick },
              { label: "🎯 AI Matching", action: onMatchingClick },
            ].map(({ label, action }) => (
              <button key={label} onClick={() => { action(); setMenuOpen(false); }}
                className="block w-full text-left text-blue-100 hover:text-white hover:bg-blue-600 px-3 py-2 rounded-lg text-sm transition-colors">
                {label}
              </button>
            ))}
            <div className="flex gap-2 pt-2">
              <button className="flex-1 text-white border border-blue-400 px-3 py-1.5 rounded-lg text-sm">เข้าสู่ระบบ</button>
              <button className="flex-1 bg-white text-blue-700 px-3 py-1.5 rounded-lg text-sm font-bold">สมัครสมาชิก</button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
