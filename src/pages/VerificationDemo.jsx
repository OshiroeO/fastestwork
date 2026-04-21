import { useState, useEffect, useRef } from "react";

// ─── Personas ────────────────────────────────────────────────────────────────

const PERSONAS = [
  {
    id: 1,
    avatar: "SC", name: "สมชาย ใจดี", color: "#3b82f6",
    title: "Graphic Designer", category: "กราฟิกและดีไซน์",
    email: "somchai.jaidee@gmail.com", phone: "081-234-5678",
    idCard: "1-1019-00123-45-6", portfolio: "behance.net/somchai_design",
    social: "@somchai_design", experience: "5 ปี",
    tags: ["สะอาด", "มีประวัติ"],
    checks: [
      { id: "identity", label: "ตรวจสอบบัตรประชาชน",   detail: "เลขบัตรถูกต้อง ไม่ซ้ำในระบบ", status: "pass", score: 98 },
      { id: "face",     label: "Face Authenticity",      detail: "ภาพจริง ไม่มีร่องรอย AI-generated", status: "pass", score: 96 },
      { id: "portfolio",label: "ตรวจสอบ Portfolio",      detail: "ผลงานเป็นต้นฉบับ ไม่พบ stock match", status: "pass", score: 91 },
      { id: "social",   label: "Social Presence",        detail: "บัญชีอายุ 4 ปี engagement สม่ำเสมอ", status: "pass", score: 88 },
      { id: "behavior", label: "Behavioral Pattern",     detail: "รูปแบบการกรอกเป็นธรรมชาติ ไม่ใช่ bot", status: "pass", score: 95 },
      { id: "duplicate",label: "Duplicate Detection",    detail: "ไม่พบบัญชีซ้ำ device fingerprint ใหม่", status: "pass", score: 100 },
    ],
    verdict: "verified",
  },
  {
    id: 2,
    avatar: "JS", name: "John Smith", color: "#ef4444",
    title: "Full Stack Developer", category: "พัฒนาโปรแกรม",
    email: "js_freelance_th2024@protonmail.com", phone: "095-999-0001",
    idCard: "1-1019-00123-45-6", portfolio: "drive.google.com/shared/portfolio",
    social: "@js_work2024", experience: "10 ปี",
    tags: ["น่าสงสัย", "ข้อมูลซ้ำ"],
    checks: [
      { id: "identity", label: "ตรวจสอบบัตรประชาชน",   detail: "⚠ เลขบัตรซ้ำกับบัญชี somchai.jaidee", status: "fail", score: 12 },
      { id: "face",     label: "Face Authenticity",      detail: "⚠ ตรวจพบ GAN artifacts น่าจะเป็น AI-generated", status: "fail", score: 8 },
      { id: "portfolio",label: "ตรวจสอบ Portfolio",      detail: "⚠ 7/10 ภาพตรงกับ Freepik / Shutterstock", status: "fail", score: 15 },
      { id: "social",   label: "Social Presence",        detail: "⚠ บัญชีอายุ 3 เดือน follower spike pattern", status: "fail", score: 22 },
      { id: "behavior", label: "Behavioral Pattern",     detail: "⚠ Copy-paste ทุก field ความเร็วผิดปกติ", status: "warn", score: 28 },
      { id: "duplicate",label: "Duplicate Detection",    detail: "⚠ Device fingerprint ตรงกับ 3 บัญชีที่ถูก ban", status: "fail", score: 5 },
    ],
    verdict: "rejected",
  },
  {
    id: 3,
    avatar: "NR", name: "นภา รักงาน", color: "#8b5cf6",
    title: "Content Writer & Translator", category: "เขียนและแปลภาษา",
    email: "napa.rakngaan@outlook.com", phone: "089-456-7890",
    idCard: "3-4012-01987-65-4", portfolio: "medium.com/@napa_writes",
    social: "@napa_writes", experience: "2 ปี",
    tags: ["มือใหม่", "ต้องติดตาม"],
    checks: [
      { id: "identity", label: "ตรวจสอบบัตรประชาชน",   detail: "เลขบัตรถูกต้อง ไม่ซ้ำ ยืนยันตัวตนได้", status: "pass", score: 97 },
      { id: "face",     label: "Face Authenticity",      detail: "ภาพดูเป็นของจริง confidence 89%", status: "pass", score: 89 },
      { id: "portfolio",label: "ตรวจสอบ Portfolio",      detail: "⚠ บทความน้อย ยืนยัน authorship ได้บางส่วน", status: "warn", score: 61 },
      { id: "social",   label: "Social Presence",        detail: "⚠ บัญชีอายุเพียง 8 เดือน ยังไม่มีประวัติมาก", status: "warn", score: 48 },
      { id: "behavior", label: "Behavioral Pattern",     detail: "รูปแบบการกรอกปกติ ไม่พบความผิดปกติ", status: "pass", score: 92 },
      { id: "duplicate",label: "Duplicate Detection",    detail: "ไม่พบบัญชีซ้ำ อุปกรณ์ใหม่ IP ปกติ", status: "pass", score: 100 },
    ],
    verdict: "review",
  },
  {
    id: 4,
    avatar: "MT", name: "ไมค์ ทันสมัย", color: "#f59e0b",
    title: "Digital Marketing Specialist", category: "การตลาดดิจิทัล",
    email: "mike.modern99@yahoo.com", phone: "062-111-2233",
    idCard: "5-7701-55432-10-2", portfolio: "linkedin.com/in/mike-modern",
    social: "@mike_mkt_pro", experience: "7 ปี",
    tags: ["VPN detected", "Bot pattern"],
    checks: [
      { id: "identity", label: "ตรวจสอบบัตรประชาชน",   detail: "เลขบัตรผ่าน แต่ที่อยู่ไม่ตรงกับ IP location", status: "warn", score: 55 },
      { id: "face",     label: "Face Authenticity",      detail: "⚠ ภาพอาจผ่าน face-swap เล็กน้อย confidence 61%", status: "warn", score: 44 },
      { id: "portfolio",label: "ตรวจสอบ Portfolio",      detail: "⚠ Case study ใช้ logo บริษัทโดยไม่ได้รับอนุญาต", status: "fail", score: 33 },
      { id: "social",   label: "Social Presence",        detail: "⚠ Follower เพิ่มขึ้นผิดปกติ 10K ใน 2 สัปดาห์", status: "fail", score: 19 },
      { id: "behavior", label: "Behavioral Pattern",     detail: "⚠ ตรวจพบ automated form-filling script", status: "fail", score: 11 },
      { id: "duplicate",label: "Duplicate Detection",    detail: "⚠ IP เป็น VPN / datacenter proxy ที่รู้จัก", status: "fail", score: 8 },
    ],
    verdict: "rejected",
  },
  {
    id: 5,
    avatar: "PT", name: "พรทิพย์ สุขใจ", color: "#10b981",
    title: "UI/UX Designer", category: "กราฟิกและดีไซน์",
    email: "porntip.s@gmail.com", phone: "083-789-0123",
    idCard: "2-5503-12345-67-8", portfolio: "figma.com/@porntip_ux",
    social: "@porntip_ux", experience: "6 ปี",
    tags: ["Verified Pro", "Top Rated"],
    checks: [
      { id: "identity", label: "ตรวจสอบบัตรประชาชน",   detail: "ผ่านการยืนยัน eKYC กับกรมการปกครองแล้ว", status: "pass", score: 100 },
      { id: "face",     label: "Face Authenticity",      detail: "ภาพตรงกับการ selfie ตอน eKYC confidence 99%", status: "pass", score: 99 },
      { id: "portfolio",label: "ตรวจสอบ Portfolio",      detail: "ผลงาน Figma original ยืนยัน ownership ได้ทั้งหมด", status: "pass", score: 97 },
      { id: "social",   label: "Social Presence",        detail: "บัญชีอายุ 5 ปี engagement organic สม่ำเสมอ", status: "pass", score: 94 },
      { id: "behavior", label: "Behavioral Pattern",     detail: "รูปแบบการกรอกเป็นมนุษย์ 100% ไม่พบ automation", status: "pass", score: 98 },
      { id: "duplicate",label: "Duplicate Detection",    detail: "ไม่พบซ้ำ เคยใช้แพลตฟอร์มมาก่อน ประวัติดี", status: "pass", score: 100 },
    ],
    verdict: "verified",
  },
  {
    id: 6,
    avatar: "WC", name: "วิชัย ช่างสงสัย", color: "#6366f1",
    title: "Video Editor & Motion Designer", category: "วิดีโอและแอนิเมชัน",
    email: "wichai.edit2023@hotmail.com", phone: "091-555-6677",
    idCard: "4-1108-67891-23-4", portfolio: "vimeo.com/wichai_edit",
    social: "@wichai_motion", experience: "4 ปี",
    tags: ["ข้อมูลบางส่วน", "ต้องยืนยัน"],
    checks: [
      { id: "identity", label: "ตรวจสอบบัตรประชาชน",   detail: "เลขบัตรผ่าน แต่ยังไม่ได้ทำ eKYC ขั้นสูง", status: "pass", score: 78 },
      { id: "face",     label: "Face Authenticity",      detail: "ภาพจริง แต่คุณภาพต่ำทำให้ความแม่นยำลดลง", status: "pass", score: 81 },
      { id: "portfolio",label: "ตรวจสอบ Portfolio",      detail: "⚠ 3/8 คลิปพบใน YouTube ไม่แน่ใจว่าเป็นของตัวเอง", status: "warn", score: 58 },
      { id: "social",   label: "Social Presence",        detail: "⚠ บัญชีอายุ 1 ปี กิจกรรมไม่สม่ำเสมอ", status: "warn", score: 52 },
      { id: "behavior", label: "Behavioral Pattern",     detail: "รูปแบบปกติ ไม่พบ automation", status: "pass", score: 90 },
      { id: "duplicate",label: "Duplicate Detection",    detail: "ไม่พบบัญชีซ้ำ แต่ IP ใช้ร่วมกับบัญชีอื่น", status: "warn", score: 64 },
    ],
    verdict: "review",
  },
];

// ─── Config ───────────────────────────────────────────────────────────────────

const CHECK_ICONS = { identity: "🪪", face: "🤖", portfolio: "🖼️", social: "📱", behavior: "🧠", duplicate: "🔍" };

const STATUS_CFG = {
  pass: { bg: "bg-green-50", border: "border-green-200", text: "text-green-700", badge: "bg-green-100 text-green-700", label: "ผ่าน" },
  warn: { bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-700", badge: "bg-yellow-100 text-yellow-700", label: "ต้องระวัง" },
  fail: { bg: "bg-red-50",    border: "border-red-200",    text: "text-red-700",    badge: "bg-red-100 text-red-700",    label: "ไม่ผ่าน" },
};

const VERDICT_CFG = {
  verified: { bg: "bg-green-50", border: "border-green-300", title: "text-green-700", badge: "bg-green-100 text-green-700", icon: "✓", label: "อนุมัติการเข้าร่วม", desc: "ผ่านการตรวจสอบทั้ง 6 ขั้นตอน บัญชีพร้อมรับงานได้ทันที" },
  review:   { bg: "bg-amber-50",  border: "border-amber-300",  title: "text-amber-700",  badge: "bg-amber-100 text-amber-700",  icon: "⚠", label: "ต้องตรวจสอบเพิ่มเติม", desc: "พบข้อมูลบางส่วนที่ยังไม่สมบูรณ์ ทีมงานจะติดต่อเพื่อยืนยันภายใน 24 ชม." },
  rejected: { bg: "bg-red-50",    border: "border-red-300",    title: "text-red-700",    badge: "bg-red-100 text-red-700",    icon: "✕", label: "ปฏิเสธการสมัคร", desc: "พบความผิดปกติหลายรายการ บัญชีถูกบล็อกและรายงานทีม Trust & Safety" },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function ScoreBar({ score, animate }) {
  const color = score >= 80 ? "#22c55e" : score >= 50 ? "#f59e0b" : "#ef4444";
  return (
    <div className="flex items-center gap-2 mt-1">
      <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-1000"
          style={{ width: animate ? `${score}%` : "0%", backgroundColor: color }} />
      </div>
      <span className="text-xs font-bold w-7 text-right" style={{ color }}>{score}</span>
    </div>
  );
}

function CheckCard({ check, state }) {
  const cfg = state === "done" ? STATUS_CFG[check.status] : {};
  return (
    <div className={`rounded-xl border-2 p-4 transition-all duration-500 ${
      state === "idle"     ? "border-gray-100 bg-gray-50 opacity-40" :
      state === "scanning" ? "border-blue-300 bg-blue-50 shadow-md scale-[1.01]" :
      `${cfg.border} ${cfg.bg}`
    }`}>
      <div className="flex items-start gap-3">
        <span className="text-xl mt-0.5">{CHECK_ICONS[check.id]}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <p className={`font-semibold text-sm ${state === "done" ? cfg.text : "text-gray-600"}`}>{check.label}</p>
            {state === "scanning" && (
              <span className="flex items-center gap-1 text-xs text-blue-600 font-medium flex-shrink-0">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />กำลังสแกน...
              </span>
            )}
            {state === "done" && (
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${cfg.badge}`}>
                {check.status === "pass" ? "✓" : check.status === "warn" ? "!" : "✕"} {cfg.label}
              </span>
            )}
          </div>
          {state === "done" && (
            <>
              <p className="text-xs text-gray-500">{check.detail}</p>
              <ScoreBar score={check.score} animate />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function RiskGauge({ score, verdict }) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf;
    const step = () => setV(prev => { if (prev >= score) return score; raf = requestAnimationFrame(step); return prev + Math.ceil((score - prev) / 8); });
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [score]);
  const r = 52, c = 2 * Math.PI * r;
  const color = score >= 80 ? "#22c55e" : score >= 55 ? "#f59e0b" : "#ef4444";
  return (
    <div className="flex flex-col items-center">
      <svg width="130" height="130" viewBox="0 0 130 130">
        <circle cx="65" cy="65" r={r} fill="none" stroke="#e5e7eb" strokeWidth="10" />
        <circle cx="65" cy="65" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={c} strokeDashoffset={c - (v / 100) * c}
          strokeLinecap="round" transform="rotate(-90 65 65)"
          style={{ transition: "stroke-dashoffset 0.05s" }} />
        <text x="65" y="60" textAnchor="middle" fontSize="26" fontWeight="bold" fill={color}>{v}</text>
        <text x="65" y="75" textAnchor="middle" fontSize="10" fill="#6b7280">/100 Trust Score</text>
      </svg>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function VerificationDemo({ onBack }) {
  const [selected, setSelected] = useState(null);
  const [phase, setPhase] = useState("idle");   // idle | scanning | result
  const [checkStates, setCheckStates] = useState({});
  const timers = useRef([]);

  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };

  const selectPersona = (p) => {
    clearTimers();
    setSelected(p);
    setPhase("idle");
    setCheckStates({});
  };

  const startScan = () => {
    if (!selected) return;
    clearTimers();
    setCheckStates({});
    setPhase("scanning");

    selected.checks.forEach((check, i) => {
      const t1 = setTimeout(() => setCheckStates(prev => ({ ...prev, [check.id]: "scanning" })), i * 1300);
      const t2 = setTimeout(() => setCheckStates(prev => ({ ...prev, [check.id]: "done" })), i * 1300 + 850);
      timers.current.push(t1, t2);
    });

    const t3 = setTimeout(() => setPhase("result"), selected.checks.length * 1300 + 850);
    timers.current.push(t3);
  };

  const reset = () => { clearTimers(); setPhase("idle"); setCheckStates({}); };

  useEffect(() => () => clearTimers(), []);

  const avgScore = selected
    ? Math.round(selected.checks.reduce((s, c) => s + c.score, 0) / selected.checks.length)
    : 0;

  const vcfg = selected ? VERDICT_CFG[selected.verdict] : null;

  return (
    <div style={{ width: "100%", display: "block", minHeight: "100vh", background: "#f8fafc" }}>

      {/* Header */}
      <div style={{ width: "100%", background: "linear-gradient(135deg, #1e3a8a, #1d4ed8, #2563eb)", padding: "3rem 1rem 2rem" }}>
        <div className="max-w-6xl mx-auto">
          <button onClick={onBack} className="flex items-center gap-2 text-blue-200 hover:text-white mb-5 transition-colors text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            กลับหน้าหลัก
          </button>
          <div className="flex items-start gap-4 mb-5">
            <div className="w-14 h-14 bg-blue-500/30 border border-blue-400/40 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">🛡️</div>
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="bg-blue-400/30 border border-blue-300/40 text-blue-100 text-xs font-semibold px-2.5 py-0.5 rounded-full">AI Feature</span>
                <span className="bg-green-400/20 border border-green-300/30 text-green-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">● Live Demo</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">AI Anti-Fraud & Freelancer Screening</h1>
              <p className="text-blue-200 text-sm mt-1 max-w-xl">เลือกผู้สมัครที่ต้องการตรวจสอบ แล้วดูว่า AI วิเคราะห์อะไร และผลลัพธ์เป็นอย่างไร</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[{ v: "99.3%", l: "ความแม่นยำ" }, { v: "<3 วิ", l: "เวลาตรวจสอบ" }, { v: "12K+", l: "บัญชีปลอมถูกบล็อก" }].map(s => (
              <div key={s.l} className="bg-white/10 border border-white/15 rounded-xl px-3 py-2.5 text-center">
                <div className="text-xl font-bold text-white">{s.v}</div>
                <div className="text-blue-200 text-xs">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">

        {/* Step 1: Persona Picker */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-6 h-6 bg-blue-600 text-white rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0">1</span>
            <h2 className="font-bold text-gray-800">เลือกผู้สมัครที่ต้องการตรวจสอบ</h2>
          </div>
          <p className="text-gray-400 text-xs mb-5 ml-8">คลิกที่การ์ดผู้สมัครเพื่อเลือก จากนั้นกดปุ่มเริ่มการตรวจสอบ</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {PERSONAS.map(p => (
              <button
                key={p.id}
                onClick={() => selectPersona(p)}
                className={`relative rounded-2xl border-2 p-4 text-center transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
                  selected?.id === p.id
                    ? "border-blue-500 bg-blue-50 shadow-md scale-[1.02]"
                    : "border-gray-100 bg-white hover:border-blue-200"
                }`}
              >
                {selected?.id === p.id && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-blue-600 text-white rounded-full text-xs flex items-center justify-center font-bold shadow">✓</span>
                )}
                <div className="w-12 h-12 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold text-sm shadow-sm"
                  style={{ backgroundColor: p.color }}>{p.avatar}</div>
                <p className="font-semibold text-gray-800 text-xs leading-tight mb-0.5">{p.name}</p>
                <p className="text-gray-400 text-[10px] mb-2 leading-tight">{p.title}</p>
                <div className="flex flex-wrap justify-center gap-1">
                  {p.tags.map(t => (
                    <span key={t} className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">{t}</span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Scan */}
        {selected && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

            {/* Profile + Action */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-6 h-6 bg-blue-600 text-white rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0">2</span>
                <h2 className="font-bold text-gray-800">ข้อมูลผู้สมัคร</h2>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="h-14 bg-gradient-to-r from-blue-600 to-indigo-600" />
                <div className="px-5 pb-5 -mt-7">
                  <div className="w-14 h-14 rounded-full border-4 border-white flex items-center justify-center text-white font-bold text-lg shadow-md mb-2"
                    style={{ backgroundColor: selected.color }}>{selected.avatar}</div>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-gray-800">{selected.name}</h3>
                      <p className="text-xs text-gray-500">{selected.title}</p>
                      <p className="text-xs text-blue-600">{selected.category}</p>
                    </div>
                    {phase === "result" && (
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${vcfg.badge}`}>
                        {vcfg.icon} {selected.verdict === "verified" ? "Verified" : selected.verdict === "review" ? "Review" : "Rejected"}
                      </span>
                    )}
                  </div>
                  <div className="space-y-1.5 text-xs">
                    {[
                      ["อีเมล", selected.email],
                      ["โทรศัพท์", selected.phone],
                      ["เลขบัตร ปชช.", selected.idCard],
                      ["Portfolio", selected.portfolio],
                      ["Social", selected.social],
                      ["ประสบการณ์", selected.experience],
                    ].map(([k, v]) => (
                      <div key={k} className="flex gap-2">
                        <span className="text-gray-400 w-24 flex-shrink-0">{k}</span>
                        <span className="text-gray-700 font-medium break-all">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {phase === "idle" && (
                <button onClick={startScan}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                  🔍 เริ่มการตรวจสอบ AI
                </button>
              )}
              {phase === "scanning" && (
                <div className="w-full bg-blue-50 border-2 border-blue-200 text-blue-700 font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm">
                  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  AI กำลังวิเคราะห์ {Object.values(checkStates).filter(s => s === "done").length}/{selected.checks.length}
                </div>
              )}
              {phase === "result" && (
                <button onClick={reset}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-colors text-sm">
                  ↺ สแกนใหม่
                </button>
              )}
            </div>

            {/* Checks + Result */}
            <div className="lg:col-span-3 space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-6 h-6 bg-blue-600 text-white rounded-full text-xs font-bold flex items-center justify-center flex-shrink-0">3</span>
                <h2 className="font-bold text-gray-800">ผลการตรวจสอบ 6 ขั้นตอน</h2>
              </div>

              {selected.checks.map(check => (
                <CheckCard key={check.id} check={check} state={checkStates[check.id] || "idle"} />
              ))}

              {/* Verdict */}
              {phase === "result" && (
                <div className={`rounded-2xl border-2 p-5 ${vcfg.bg} ${vcfg.border}`}>
                  <div className="flex flex-col sm:flex-row items-center gap-5">
                    <RiskGauge score={avgScore} verdict={selected.verdict} />
                    <div className="flex-1 text-center sm:text-left">
                      <h4 className={`font-bold text-lg mb-1 ${vcfg.title}`}>
                        {vcfg.icon} {vcfg.label}
                      </h4>
                      <p className="text-sm text-gray-600 mb-3">{vcfg.desc}</p>
                      <div className="flex flex-wrap gap-2 text-xs justify-center sm:justify-start">
                        <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                          ✓ {selected.checks.filter(c => c.status === "pass").length} ผ่าน
                        </span>
                        {selected.checks.filter(c => c.status === "warn").length > 0 && (
                          <span className="bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">
                            ! {selected.checks.filter(c => c.status === "warn").length} ต้องระวัง
                          </span>
                        )}
                        {selected.checks.filter(c => c.status === "fail").length > 0 && (
                          <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                            ✕ {selected.checks.filter(c => c.status === "fail").length} ไม่ผ่าน
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {!selected && (
          <div className="text-center py-12 text-gray-300">
            <div className="text-5xl mb-3">👆</div>
            <p className="font-medium text-gray-400">เลือกผู้สมัครด้านบนเพื่อเริ่มการตรวจสอบ</p>
          </div>
        )}

        {/* How It Works */}
        <div style={{ width: "100%", paddingTop: "1rem" }}>
          <h2 className="text-xl font-bold text-gray-800 mb-5 text-center">ระบบทำงานอย่างไร</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: "🪪", t: "Identity Verification", d: "ตรวจสอบเลขบัตรประชาชนกับฐานข้อมูลกรมการปกครอง และตรวจหาการใช้บัตรซ้ำ" },
              { icon: "🤖", t: "Deepfake Detection", d: "AI วิเคราะห์ภาพโปรไฟล์ว่าเป็นภาพจริงหรือ AI-generated ด้วย GAN artifact detection" },
              { icon: "🖼️", t: "Portfolio Screening", d: "Reverse image search เปรียบเทียบผลงานกับ stock photo databases และผลงานของผู้อื่น" },
              { icon: "📱", t: "Social Graph Analysis", d: "วิเคราะห์อายุบัญชี, engagement pattern และตรวจหาการซื้อ follower" },
              { icon: "🧠", t: "Behavioral Biometrics", d: "วิเคราะห์รูปแบบการพิมพ์, การเลื่อน mouse และตรวจจับ bot/automation" },
              { icon: "🔍", t: "Device Fingerprinting", d: "ตรวจสอบ device fingerprint, IP reputation และ VPN/Proxy detection" },
            ].map(item => (
              <div key={item.t} className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow">
                <div className="text-2xl mb-2">{item.icon}</div>
                <h4 className="font-bold text-gray-800 text-sm mb-1">{item.t}</h4>
                <p className="text-gray-500 text-xs leading-relaxed">{item.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
