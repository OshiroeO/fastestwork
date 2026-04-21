import { useState, useRef, useEffect } from "react";

const CATEGORIES = [
  "กราฟิกและดีไซน์", "พัฒนาโปรแกรม", "เขียนและแปลภาษา",
  "วิดีโอและแอนิเมชัน", "การตลาดดิจิทัล", "ดนตรีและเสียง",
  "ธุรกิจและการเงิน", "การศึกษาและติวเตอร์",
];

const CHECK_ICONS = {
  identity: "🪪", face: "🤖", portfolio: "🖼️",
  social: "📱", behavior: "🧠", duplicate: "🔍",
};

const STATUS_CFG = {
  pass: { bg: "bg-green-50", border: "border-green-200", text: "text-green-700", badge: "bg-green-100 text-green-700", label: "ผ่าน" },
  warn: { bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-700", badge: "bg-yellow-100 text-yellow-700", label: "ต้องระวัง" },
  fail: { bg: "bg-red-50", border: "border-red-200", text: "text-red-700", badge: "bg-red-100 text-red-700", label: "ไม่ผ่าน" },
};

const PRESETS = [
  {
    id: 1,
    presetLabel: "ผู้สมัคร 1",
    presetDesc: "ข้อมูลครบถ้วน ถูกต้อง",
    tagText: "✓ พร้อมผ่านการตรวจสอบ",
    tagStyle: "bg-green-100 text-green-700",
    avatar: "SC",
    color: "#3b82f6",
    form: {
      name: "สมชาย ใจดี",
      title: "Graphic Designer",
      category: "กราฟิกและดีไซน์",
      email: "somchai.jaidee@gmail.com",
      phone: "081-234-5678",
      idCard: "1-1019-00123-45-6",
      portfolio: "behance.net/somchai_design",
      social: "@somchai_design",
      experience: "5",
    },
    checks: [
      { id: "identity",  label: "ตรวจสอบบัตรประชาชน", detail: "เลขบัตรถูกต้อง ไม่ซ้ำในระบบ",                    status: "pass", score: 98  },
      { id: "face",      label: "Face Authenticity",   detail: "ภาพจริง ไม่มีร่องรอย AI-generated",               status: "pass", score: 96  },
      { id: "portfolio", label: "ตรวจสอบ Portfolio",   detail: "ผลงานเป็นต้นฉบับ ไม่พบ stock match",             status: "pass", score: 91  },
      { id: "social",    label: "Social Presence",     detail: "บัญชีอายุ 4 ปี engagement สม่ำเสมอ",             status: "pass", score: 88  },
      { id: "behavior",  label: "Behavioral Pattern",  detail: "รูปแบบการกรอกเป็นธรรมชาติ ไม่ใช่ bot",           status: "pass", score: 95  },
      { id: "duplicate", label: "Duplicate Detection", detail: "ไม่พบบัญชีซ้ำ device fingerprint ใหม่",          status: "pass", score: 100 },
    ],
    verdict: "verified",
  },
  {
    id: 2,
    presetLabel: "ผู้สมัคร 2",
    presetDesc: "ข้อมูลน่าสงสัย (ต้องแก้ไข)",
    tagText: "✕ มีข้อมูลผิดปกติ",
    tagStyle: "bg-red-100 text-red-700",
    avatar: "JS",
    color: "#ef4444",
    form: {
      name: "John Smith",
      title: "Full Stack Developer",
      category: "พัฒนาโปรแกรม",
      email: "js_freelance2024@protonmail.com",
      phone: "095-999-0001",
      idCard: "1-1019-00123-45-6",
      portfolio: "drive.google.com/shared/portfolio_xyz",
      social: "@js_work2024",
      experience: "10",
    },
    checks: [
      { id: "identity",  label: "ตรวจสอบบัตรประชาชน", detail: "⚠ เลขบัตรซ้ำกับบัญชีที่มีอยู่แล้วในระบบ",                       status: "fail", score: 12 },
      { id: "face",      label: "Face Authenticity",   detail: "⚠ ตรวจพบ GAN artifacts — ภาพน่าจะเป็น AI-generated",            status: "fail", score: 8  },
      { id: "portfolio", label: "ตรวจสอบ Portfolio",   detail: "⚠ 7/10 ชิ้นงานตรงกับ stock photos บน Freepik/Shutterstock",    status: "fail", score: 15 },
      { id: "social",    label: "Social Presence",     detail: "⚠ บัญชีอายุ 3 เดือน — follower spike ผิดปกติ",                 status: "fail", score: 22 },
      { id: "behavior",  label: "Behavioral Pattern",  detail: "⚠ Copy-paste ทุก field ความเร็วผิดปกติ คาดเป็น automation",    status: "warn", score: 28 },
      { id: "duplicate", label: "Duplicate Detection", detail: "⚠ Device fingerprint ซ้ำกับ 3 บัญชีที่ถูก ban ก่อนหน้านี้",    status: "fail", score: 5  },
    ],
    verdict: "rejected",
    fixedFields: ["idCard", "email", "portfolio", "social"],
    fixedForm: {
      name: "John Smith",
      title: "Full Stack Developer",
      category: "พัฒนาโปรแกรม",
      email: "john.smith.dev@gmail.com",
      phone: "095-999-0001",
      idCard: "2-2019-00456-78-9",
      portfolio: "github.com/johnsmith-fullstack",
      social: "@johnsmith_dev",
      experience: "10",
    },
    fixedChecks: [
      { id: "identity",  label: "ตรวจสอบบัตรประชาชน", detail: "เลขบัตรถูกต้อง ไม่ซ้ำในระบบ (อัปเดตแล้ว)",             status: "pass", score: 94  },
      { id: "face",      label: "Face Authenticity",   detail: "ภาพจริง — ยืนยันผ่าน eKYC selfie สำเร็จ",               status: "pass", score: 92  },
      { id: "portfolio", label: "ตรวจสอบ Portfolio",   detail: "ผลงาน GitHub verified เป็นโค้ดต้นฉบับทั้งหมด",           status: "pass", score: 88  },
      { id: "social",    label: "Social Presence",     detail: "บัญชีใหม่ แต่ LinkedIn ยืนยันตัวตนและประสบการณ์ได้",     status: "pass", score: 75  },
      { id: "behavior",  label: "Behavioral Pattern",  detail: "รูปแบบการกรอกเป็นธรรมชาติ ไม่พบ automation",            status: "pass", score: 90  },
      { id: "duplicate", label: "Duplicate Detection", detail: "ไม่พบบัญชีซ้ำ อุปกรณ์และ IP ใหม่",                      status: "pass", score: 100 },
    ],
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function ScoreBar({ score }) {
  const color = score >= 80 ? "#22c55e" : score >= 50 ? "#f59e0b" : "#ef4444";
  return (
    <div className="flex items-center gap-2 mt-1">
      <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${score}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs font-bold w-7 text-right" style={{ color }}>{score}</span>
    </div>
  );
}

function CheckCard({ check, state }) {
  const cfg = state === "done" ? STATUS_CFG[check.status] : {};
  return (
    <div className={`rounded-xl border-2 p-3 transition-all duration-500 ${
      state === "idle"     ? "border-gray-100 bg-gray-50 opacity-40" :
      state === "scanning" ? "border-blue-300 bg-blue-50 shadow-md scale-[1.01]" :
      `${cfg.border} ${cfg.bg}`
    }`}>
      <div className="flex items-start gap-3">
        <span className="text-lg mt-0.5">{CHECK_ICONS[check.id]}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <p className={`font-semibold text-sm ${state === "done" ? cfg.text : "text-gray-600"}`}>
              {check.label}
            </p>
            {state === "scanning" && (
              <span className="flex items-center gap-1 text-xs text-blue-600 font-medium flex-shrink-0">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" />
                กำลังสแกน...
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
              <ScoreBar score={check.score} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function FreelancerRegisterPage({ onBack, onVerified }) {
  const [step, setStep] = useState("form");   // form | scanning | pass | fail | edit
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [formData, setFormData] = useState({
    name: "", title: "", category: "", email: "",
    phone: "", idCard: "", portfolio: "", social: "", experience: "",
  });
  const [isFixed, setIsFixed] = useState(false);
  const [checkStates, setCheckStates] = useState({});
  const timers = useRef([]);

  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };

  const selectPreset = (preset) => {
    setSelectedPreset(preset);
    setFormData(preset.form);
    setIsFixed(false);
    setCheckStates({});
  };

  const handleInput = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedPreset) return;
    runScan();
  };

  const runScan = () => {
    clearTimers();
    setCheckStates({});
    setStep("scanning");

    const checks =
      selectedPreset.id === 2 && isFixed
        ? selectedPreset.fixedChecks
        : selectedPreset.checks;

    checks.forEach((check, i) => {
      const t1 = setTimeout(() => setCheckStates(prev => ({ ...prev, [check.id]: "scanning" })), i * 1100);
      const t2 = setTimeout(() => setCheckStates(prev => ({ ...prev, [check.id]: "done" })),     i * 1100 + 800);
      timers.current.push(t1, t2);
    });

    const total = checks.length * 1100 + 800;
    timers.current.push(
      setTimeout(() => {
        const passed = selectedPreset.id === 1 || isFixed;
        if (passed) {
          onVerified({
            id: Date.now(),
            name: formData.name,
            avatar: selectedPreset.avatar,
            title: formData.title,
            rating: null,
            reviews: 0,
            price: null,
            tags: [formData.category, `${formData.experience} ปี`],
            category: formData.category,
            level: "New",
            avatarColor: selectedPreset.color,
            headerColor: selectedPreset.color,
          });
          setStep("pass");
        } else {
          setStep("fail");
        }
      }, total)
    );
  };

  const handleFix = () => {
    setIsFixed(true);
    setFormData(selectedPreset.fixedForm);
    setCheckStates({});
    setStep("edit");
  };

  useEffect(() => () => clearTimers(), []);

  const currentChecks = selectedPreset
    ? (selectedPreset.id === 2 && isFixed ? selectedPreset.fixedChecks : selectedPreset.checks)
    : [];

  const avgScore = currentChecks.length > 0
    ? Math.round(currentChecks.reduce((s, c) => s + c.score, 0) / currentChecks.length)
    : 0;

  const stepIndex = { form: 0, edit: 0, scanning: 1, pass: 2, fail: 2 }[step] ?? 0;

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div style={{ width: "100%", display: "block", minHeight: "100vh", background: "#f8fafc" }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #1e3a8a, #1d4ed8, #2563eb)", padding: "3rem 1rem 2rem" }}>
        <div className="max-w-4xl mx-auto">
          <button onClick={onBack} className="flex items-center gap-2 text-blue-200 hover:text-white mb-5 transition-colors text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            กลับหน้าหลัก
          </button>

          <div className="flex items-start gap-4 mb-6">
            <div className="w-14 h-14 bg-blue-500/30 border border-blue-400/40 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">🧑‍💼</div>
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="bg-blue-400/30 border border-blue-300/40 text-blue-100 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  สมัครเป็นฟรีแลนซ์
                </span>
                <span className="bg-green-400/20 border border-green-300/30 text-green-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                  🛡️ ตรวจสอบโดย AI
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">ลงทะเบียนฟรีแลนซ์</h1>
              <p className="text-blue-200 text-sm mt-1">กรอกข้อมูลและผ่านการตรวจสอบ AI เพื่อเริ่มรับงานบน Fastestwork</p>
            </div>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2">
            {[
              { label: "กรอกข้อมูล" },
              { label: "ตรวจสอบ AI" },
              { label: "ผลลัพธ์" },
            ].map(({ label }, i) => {
              const done    = i < stepIndex;
              const current = i === stepIndex;
              return (
                <div key={i} className="flex items-center gap-2">
                  <div className={`w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center transition-all ${
                    done    ? "bg-green-400 text-white" :
                    current ? "bg-white text-blue-700" :
                              "bg-blue-600/50 text-blue-300"
                  }`}>
                    {done ? "✓" : i + 1}
                  </div>
                  <span className={`text-sm hidden sm:inline ${
                    done ? "text-green-300" : current ? "text-white font-semibold" : "text-blue-400"
                  }`}>{label}</span>
                  {i < 2 && <div className="w-8 h-0.5 bg-blue-500/40 hidden sm:block mx-1" />}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* ── STEP: FORM ────────────────────────────────────────────────────── */}
        {(step === "form" || step === "edit") && (
          <div className="space-y-5">

            {/* Preset selector (only on first form) */}
            {step === "form" && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="font-bold text-gray-800 mb-1">เลือกข้อมูลผู้สมัครตัวอย่าง</h2>
                <p className="text-gray-400 text-sm mb-4">คลิกที่การ์ดเพื่อโหลดข้อมูลลงในฟอร์มด้านล่าง</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {PRESETS.map(p => (
                    <button key={p.id} onClick={() => selectPreset(p)}
                      className={`relative rounded-2xl border-2 p-4 text-left transition-all hover:shadow-md ${
                        selectedPreset?.id === p.id
                          ? "border-blue-500 bg-blue-50 shadow-md"
                          : "border-gray-100 hover:border-blue-200 bg-white"
                      }`}>
                      {selectedPreset?.id === p.id && (
                        <span className="absolute -top-2 -right-2 w-5 h-5 bg-blue-600 text-white rounded-full text-xs flex items-center justify-center font-bold shadow">✓</span>
                      )}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                          style={{ backgroundColor: p.color }}>{p.avatar}</div>
                        <div>
                          <p className="font-bold text-gray-800">{p.presetLabel}</p>
                          <p className="text-gray-500 text-xs">{p.form.name} · {p.form.title}</p>
                        </div>
                      </div>
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${p.tagStyle}`}>
                        {p.tagText}
                      </span>
                      <p className="text-gray-400 text-xs mt-1.5">{p.presetDesc}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Edit notice */}
            {step === "edit" && (
              <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 flex items-start gap-3">
                <span className="text-2xl">✏️</span>
                <div>
                  <p className="font-bold text-amber-800">แก้ไขข้อมูลที่มีปัญหาแล้ว</p>
                  <p className="text-amber-700 text-sm mt-0.5">
                    ฟิลด์ที่ถูกแก้ไขจะแสดงเป็นสีเขียว กรุณาตรวจสอบและกด <strong>"ยืนยันการสมัครอีกครั้ง"</strong>
                  </p>
                </div>
              </div>
            )}

            {/* Registration Form */}
            {selectedPreset ? (
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <h2 className="font-bold text-gray-800 mb-5">ข้อมูลการสมัคร</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { key: "name",       label: "ชื่อ-นามสกุล",        type: "text",   placeholder: "ชื่อ นามสกุล" },
                    { key: "title",      label: "ตำแหน่ง/อาชีพ",       type: "text",   placeholder: "เช่น Graphic Designer" },
                    { key: "email",      label: "อีเมล",                type: "email",  placeholder: "email@example.com" },
                    { key: "phone",      label: "เบอร์โทรศัพท์",        type: "text",   placeholder: "0XX-XXX-XXXX" },
                    { key: "idCard",     label: "เลขบัตรประชาชน",       type: "text",   placeholder: "X-XXXX-XXXXX-XX-X" },
                    { key: "portfolio",  label: "Portfolio URL",         type: "text",   placeholder: "portfolio.com/yourname" },
                    { key: "social",     label: "Social Media",          type: "text",   placeholder: "@username" },
                    { key: "experience", label: "ประสบการณ์ (ปี)",      type: "number", placeholder: "0" },
                  ].map(({ key, label, type, placeholder }) => {
                    const wasFixed = step === "edit" && selectedPreset?.fixedFields?.includes(key);
                    return (
                      <div key={key}>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                        <input
                          type={type}
                          value={formData[key]}
                          onChange={e => handleInput(key, e.target.value)}
                          placeholder={placeholder}
                          className={`w-full px-3 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 transition-all ${
                            wasFixed
                              ? "border-green-400 bg-green-50 focus:ring-green-300 text-green-800 font-medium"
                              : "border-gray-200 focus:ring-blue-300"
                          }`}
                        />
                        {wasFixed && (
                          <p className="text-xs text-green-600 mt-0.5 flex items-center gap-1">
                            ✓ แก้ไขแล้ว
                          </p>
                        )}
                      </div>
                    );
                  })}

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">หมวดหมู่บริการ</label>
                    <select
                      value={formData.category}
                      onChange={e => handleInput("category", e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
                    >
                      <option value="">เลือกหมวดหมู่</option>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <button type="submit"
                  className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                  🔍 {step === "edit" ? "ยืนยันการสมัครอีกครั้ง" : "ยืนยันการสมัคร — ตรวจสอบ AI"}
                </button>
              </form>
            ) : (
              <div className="text-center py-14 text-gray-400">
                <div className="text-5xl mb-3">👆</div>
                <p className="font-medium">เลือกข้อมูลผู้สมัครตัวอย่างด้านบนเพื่อเริ่มกรอกฟอร์ม</p>
              </div>
            )}
          </div>
        )}

        {/* ── STEP: SCANNING ────────────────────────────────────────────────── */}
        {step === "scanning" && selectedPreset && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

            {/* Profile card */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="h-14 bg-gradient-to-r from-blue-600 to-indigo-600" />
                <div className="px-5 pb-5 -mt-7">
                  <div className="w-14 h-14 rounded-full border-4 border-white flex items-center justify-center text-white font-bold text-lg shadow-md mb-2"
                    style={{ backgroundColor: selectedPreset.color }}>
                    {selectedPreset.avatar}
                  </div>
                  <h3 className="font-bold text-gray-800">{formData.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{formData.title}</p>
                  <p className="text-xs text-blue-600">{formData.category}</p>
                  <div className="mt-3 space-y-1 text-xs">
                    {[["อีเมล", formData.email], ["เลขบัตร", formData.idCard], ["Portfolio", formData.portfolio]].map(([k, v]) => (
                      <div key={k} className="flex gap-2">
                        <span className="text-gray-400 w-16 flex-shrink-0">{k}</span>
                        <span className="text-gray-600 font-medium truncate">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 border-2 border-blue-200 text-blue-700 font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 text-sm">
                <svg className="w-4 h-4 animate-spin flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                AI กำลังวิเคราะห์ {Object.values(checkStates).filter(s => s === "done").length}/{currentChecks.length}
              </div>
            </div>

            {/* Checks */}
            <div className="lg:col-span-3 space-y-3">
              <h3 className="font-bold text-gray-800 mb-1">การตรวจสอบ 6 ขั้นตอน</h3>
              {currentChecks.map(check => (
                <CheckCard key={check.id} check={check} state={checkStates[check.id] || "idle"} />
              ))}
            </div>
          </div>
        )}

        {/* ── STEP: PASS ────────────────────────────────────────────────────── */}
        {step === "pass" && selectedPreset && (
          <div className="space-y-6">
            <div className="bg-green-50 border-2 border-green-300 rounded-2xl p-8 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-green-700 mb-2">ยินดีต้อนรับสู่ Fastestwork!</h2>
              <p className="text-green-600 mb-4">
                <strong>{formData.name}</strong> ผ่านการตรวจสอบ AI ครบทุก 6 ขั้นตอนแล้ว<br />
                บัญชีของคุณพร้อมรับงานได้ทันที
              </p>
              <div className="flex justify-center gap-2 flex-wrap text-sm">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                  ✓ ผ่าน {currentChecks.filter(c => c.status === "pass").length}/6 ขั้นตอน
                </span>
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                  Trust Score: {avgScore}/100
                </span>
              </div>
            </div>

            {/* New freelancer profile card preview */}
            <div>
              <p className="text-center text-gray-500 text-sm mb-4 font-medium">โปรไฟล์ฟรีแลนซ์ของคุณ</p>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden max-w-xs mx-auto">
                <div className="h-20" style={{
                  background: `linear-gradient(135deg, ${selectedPreset.color}, ${selectedPreset.color}99)`
                }} />
                <div className="px-5 pb-5 -mt-7">
                  <div className="w-14 h-14 rounded-full border-4 border-white flex items-center justify-center text-white font-bold text-sm shadow-md mb-3"
                    style={{ backgroundColor: selectedPreset.color }}>
                    {selectedPreset.avatar}
                  </div>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm">{formData.name}</h4>
                      <p className="text-gray-500 text-xs mt-0.5">{formData.title}</p>
                    </div>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700 mt-0.5 flex-shrink-0 ml-2">
                      ✓ Verified
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{formData.category}</span>
                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{formData.experience} ปี</span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                    <span className="text-xs text-gray-400">เพิ่งลงทะเบียน</span>
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-semibold">New Member</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center space-y-2">
              <p className="text-gray-400 text-sm">โปรไฟล์ของคุณถูกเพิ่มในหน้า "ฟรีแลนซ์แนะนำ" แล้ว</p>
              <button onClick={onBack}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-10 py-3 rounded-xl transition-colors shadow-md">
                กลับหน้าหลัก
              </button>
            </div>
          </div>
        )}

        {/* ── STEP: FAIL ────────────────────────────────────────────────────── */}
        {step === "fail" && selectedPreset && (
          <div className="space-y-5">
            <div className="bg-red-50 border-2 border-red-300 rounded-2xl p-6 flex items-start gap-4">
              <div className="text-4xl flex-shrink-0">❌</div>
              <div>
                <h2 className="text-xl font-bold text-red-700 mb-1">ไม่ผ่านการตรวจสอบ</h2>
                <p className="text-red-600 text-sm mb-3">
                  พบความผิดปกติในข้อมูลที่ส่งมา กรุณาแก้ไขรายการที่มีปัญหาและสมัครใหม่อีกครั้ง
                </p>
                <div className="flex gap-2 flex-wrap text-xs">
                  <span className="bg-red-100 text-red-700 px-2.5 py-0.5 rounded-full font-medium">
                    ✕ ไม่ผ่าน {currentChecks.filter(c => c.status === "fail").length} รายการ
                  </span>
                  {currentChecks.filter(c => c.status === "warn").length > 0 && (
                    <span className="bg-yellow-100 text-yellow-700 px-2.5 py-0.5 rounded-full font-medium">
                      ! ต้องระวัง {currentChecks.filter(c => c.status === "warn").length} รายการ
                    </span>
                  )}
                  <span className="bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full font-medium">
                    Trust Score: {avgScore}/100
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
              <h3 className="font-bold text-gray-800 mb-1">ผลการตรวจสอบทั้งหมด</h3>
              {currentChecks.map(check => (
                <CheckCard key={check.id} check={check} state="done" />
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={handleFix}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                ✏️ แก้ไขข้อมูลและสมัครใหม่
              </button>
              <button onClick={onBack}
                className="px-6 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors text-sm">
                ยกเลิก
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
