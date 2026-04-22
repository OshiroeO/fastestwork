import { useState } from "react";

export default function Navbar({ activePage, onHomeClick, onRegisterClick, onMatchingClick, onLoginClick, onLogout, userRole }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const base = "text-blue-100 hover:text-white text-sm font-medium transition-colors";

  const roleLabel = userRole === "freelancer"
    ? { avatar: "NT", name: "ณัฐวุฒิ", bg: "bg-blue-500" }
    : userRole === "customer"
    ? { avatar: "สส", name: "สมศักดิ์", bg: "bg-green-500" }
    : null;

  return (
    <nav style={{ width: "100%", display: "block", boxSizing: "border-box", background: "#1d4ed8", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)", position: "sticky", top: 0, zIndex: 50 }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div
            className="cursor-pointer"
            onClick={onHomeClick}
            style={{ height: "64px", overflow: "hidden", display: "flex", alignItems: "center" }}
          >
            <img
              src="/logo.png"
              alt="Fastestwork"
              style={{
                height: "140px",
                width: "auto",
                mixBlendMode: "multiply",
                marginTop: "4px",
              }}
            />
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <button onClick={onHomeClick}
              className={`px-3 py-2 rounded-lg transition-colors ${activePage === "home" ? "bg-blue-600 text-white font-semibold text-sm" : base}`}>
              หน้าแรก
            </button>
            <button onClick={onHomeClick} className={`px-3 py-2 rounded-lg ${base}`}>
              หมวดหมู่
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

          {/* Auth area */}
          <div className="hidden md:flex items-center gap-2">
            {roleLabel ? (
              // Logged-in state
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 bg-blue-600/60 border border-blue-500 rounded-lg px-3 py-1.5">
                  <div className={`w-6 h-6 ${roleLabel.bg} rounded-full flex items-center justify-center text-white font-bold text-xs`}>
                    {roleLabel.avatar}
                  </div>
                  <span className="text-white text-sm font-medium">{roleLabel.name}</span>
                  <span className="text-blue-200 text-xs">·</span>
                  <span className="text-blue-200 text-xs">{userRole === "freelancer" ? "ฟรีแลนซ์" : "ลูกค้า"}</span>
                </div>
                <button
                  onClick={onLogout}
                  className="text-blue-200 hover:text-white border border-blue-500 hover:border-blue-300 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                >
                  ออกจากระบบ
                </button>
              </div>
            ) : (
              // Logged-out state
              <>
                <button
                  onClick={onLoginClick}
                  className="text-white border border-blue-400 hover:bg-blue-600 px-4 py-1.5 rounded-lg text-sm font-medium transition-colors"
                >
                  เข้าสู่ระบบ
                </button>
                <button
                  onClick={onRegisterClick}
                  className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-colors ${
                    activePage === "register" ? "bg-blue-300 text-blue-900" : "bg-white text-blue-700 hover:bg-blue-50"
                  }`}
                >
                  สมัครเป็นฟรีแลนซ์
                </button>
              </>
            )}
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
              { label: "🎯 AI Matching", action: onMatchingClick },
            ].map(({ label, action }) => (
              <button key={label} onClick={() => { action(); setMenuOpen(false); }}
                className="block w-full text-left text-blue-100 hover:text-white hover:bg-blue-600 px-3 py-2 rounded-lg text-sm transition-colors">
                {label}
              </button>
            ))}
            <div className="flex gap-2 pt-2">
              {roleLabel ? (
                <button onClick={() => { onLogout(); setMenuOpen(false); }}
                  className="flex-1 text-white border border-blue-400 px-3 py-1.5 rounded-lg text-sm">
                  ออกจากระบบ ({roleLabel.name})
                </button>
              ) : (
                <>
                  <button onClick={() => { onLoginClick(); setMenuOpen(false); }}
                    className="flex-1 text-white border border-blue-400 px-3 py-1.5 rounded-lg text-sm">
                    เข้าสู่ระบบ
                  </button>
                  <button onClick={() => { onRegisterClick(); setMenuOpen(false); }}
                    className="flex-1 bg-white text-blue-700 px-3 py-1.5 rounded-lg text-sm font-bold">
                    สมัครฟรีแลนซ์
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
