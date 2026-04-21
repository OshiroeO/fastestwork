import { useState, useEffect, useRef } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────

const JOB = {
  title: "Full-Stack Developer – E-commerce Platform",
  company: "TechShop Co., Ltd.",
  budget: { min: 80000, max: 120000, label: "฿80,000 – ฿120,000" },
  timeline: "3 เดือน",
  level: "ระดับกลาง–สูง",
  description:
    "ต้องการนักพัฒนา Full-Stack สร้าง e-commerce platform รองรับผู้ใช้ 100,000+ คน พร้อม real-time inventory, payment gateway integration และ admin dashboard ที่ใช้งานง่าย",
  required: ["React", "Node.js", "PostgreSQL", "REST API", "Git"],
  preferred: ["TypeScript", "AWS", "Redis", "Docker", "CI/CD"],
};

const FREELANCERS = [
  {
    id: 1, avatar: "NT", name: "ณัฐวุฒิ แสงทอง", title: "Full Stack Developer",
    color: "#3b82f6", rate: 95000, timeline: "2.5 เดือน", rating: 4.9, jobs: 128,
    skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS", "Docker", "Redis", "Git"],
    semanticGroup: "Full-Stack Web",
    scores: { skill: 98, semantic: 96, budget: 94, timeline: 100, reputation: 97 },
    matchScore: 97,
    badge: "Best Match",
    note: "ทักษะตรงทุกข้อ, เคยทำ e-commerce มาก่อน 3 โปรเจกต์",
  },
  {
    id: 2, avatar: "PP", name: "ปรีชา พัฒนา", title: "Backend Engineer",
    color: "#6366f1", rate: 85000, timeline: "3 เดือน", rating: 4.7, jobs: 94,
    skills: ["Node.js", "Python", "PostgreSQL", "MongoDB", "Docker", "AWS", "REST API"],
    semanticGroup: "Backend / API",
    scores: { skill: 82, semantic: 88, budget: 98, timeline: 95, reputation: 90 },
    matchScore: 90,
    badge: "Budget Fit",
    note: "Backend แข็งมาก, ขาด React แต่ semantic ใกล้เคียง Frontend framework",
  },
  {
    id: 3, avatar: "KN", name: "กนกพร นิรันดร์", title: "React Frontend Developer",
    color: "#0ea5e9", rate: 75000, timeline: "2 เดือน", rating: 4.8, jobs: 67,
    skills: ["React", "TypeScript", "Next.js", "Tailwind", "Git", "GraphQL"],
    semanticGroup: "Frontend / UI",
    scores: { skill: 74, semantic: 85, budget: 100, timeline: 100, reputation: 88 },
    matchScore: 89,
    badge: "Fast Delivery",
    note: "Frontend ดีมาก, ขาด backend skills แต่ทำงานร่วมกับ API ได้ดี",
  },
  {
    id: 4, avatar: "SP", name: "สมพร วิทยา", title: "DevOps + Full Stack",
    color: "#8b5cf6", rate: 115000, timeline: "3.5 เดือน", rating: 4.6, jobs: 52,
    skills: ["React", "Node.js", "Kubernetes", "CI/CD", "AWS", "Terraform", "PostgreSQL"],
    semanticGroup: "Full-Stack + Cloud",
    scores: { skill: 88, semantic: 92, budget: 72, timeline: 80, reputation: 85 },
    matchScore: 83,
    badge: "Cloud Expert",
    note: "ทักษะ cloud/DevOps เกินความต้องการ, ราคาสูงกว่า budget เล็กน้อย",
  },
  {
    id: 5, avatar: "WT", name: "วิทยา ทองดี", title: "Mobile & Web Developer",
    color: "#f59e0b", rate: 70000, timeline: "4 เดือน", rating: 4.4, jobs: 38,
    skills: ["React Native", "React", "JavaScript", "Firebase", "Node.js"],
    semanticGroup: "Mobile / Cross-platform",
    scores: { skill: 62, semantic: 74, budget: 100, timeline: 68, reputation: 76 },
    matchScore: 76,
    badge: null,
    note: "ประสบการณ์ mobile มากกว่า web, timeline ยาวกว่าที่ต้องการ",
  },
];

const SEMANTIC_PAIRS = [
  { a: "React", b: "Vue.js", sim: 0.88 },
  { a: "React", b: "Next.js", sim: 0.95 },
  { a: "Node.js", b: "Express.js", sim: 0.96 },
  { a: "Node.js", b: "Deno", sim: 0.82 },
  { a: "PostgreSQL", b: "MySQL", sim: 0.91 },
  { a: "PostgreSQL", b: "MongoDB", sim: 0.74 },
  { a: "REST API", b: "GraphQL", sim: 0.79 },
  { a: "Docker", b: "Kubernetes", sim: 0.85 },
  { a: "TypeScript", b: "JavaScript", sim: 0.93 },
  { a: "AWS", b: "GCP", sim: 0.87 },
];

const PHASES = ["idle", "extracting", "semantic", "scoring", "done"];
const PHASE_LABEL = {
  extracting: "กำลัง Extract ทักษะจาก Job Description...",
  semantic: "กำลัง Map Semantic Relationships...",
  scoring: "กำลัง Score ผู้สมัครทุกคน...",
  done: "จับคู่สำเร็จ",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function useCount(target, active, duration = 800) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) { setVal(0); return; }
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(Math.round(p * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [active, target, duration]);
  return val;
}

function RadarChart({ scores, size = 120, active }) {
  const dims = ["skill", "semantic", "budget", "timeline", "reputation"];
  const labels = ["Skill", "Semantic", "Budget", "Time", "Rep."];
  const cx = size / 2, cy = size / 2, r = size * 0.38;
  const angle = (i) => (Math.PI * 2 * i) / dims.length - Math.PI / 2;
  const pt = (i, pct) => {
    const a = angle(i), v = (pct / 100) * r;
    return [cx + v * Math.cos(a), cy + v * Math.sin(a)];
  };
  const [displayed, setDisplayed] = useState(dims.map(() => 0));
  useEffect(() => {
    if (!active) { setDisplayed(dims.map(() => 0)); return; }
    let frame;
    const target = dims.map(d => scores[d]);
    let progress = 0;
    const step = () => {
      progress = Math.min(progress + 3, 100);
      setDisplayed(target.map(t => Math.round((progress / 100) * t)));
      if (progress < 100) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [active]);

  const polygon = displayed.map((v, i) => pt(i, v).join(",")).join(" ");
  const gridLevels = [25, 50, 75, 100];

  return (
    <svg width={size} height={size}>
      {gridLevels.map(lvl => (
        <polygon
          key={lvl}
          points={dims.map((_, i) => pt(i, lvl).join(",")).join(" ")}
          fill="none" stroke="#e5e7eb" strokeWidth="0.5"
        />
      ))}
      {dims.map((_, i) => {
        const [x, y] = pt(i, 100);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#e5e7eb" strokeWidth="0.5" />;
      })}
      <polygon points={polygon} fill="#3b82f620" stroke="#3b82f6" strokeWidth="1.5" />
      {dims.map((_, i) => {
        const [x, y] = pt(i, displayed[i]);
        return <circle key={i} cx={x} cy={y} r="2.5" fill="#3b82f6" />;
      })}
      {dims.map((d, i) => {
        const [x, y] = pt(i, 115);
        return <text key={d} x={x} y={y} textAnchor="middle" fontSize="7.5" fill="#6b7280" dominantBaseline="middle">{labels[i]}</text>;
      })}
    </svg>
  );
}

function ScoreDimension({ label, score, color, active }) {
  const v = useCount(score, active, 700);
  return (
    <div>
      <div className="flex justify-between text-xs mb-0.5">
        <span className="text-gray-500">{label}</span>
        <span className="font-bold" style={{ color }}>{v}</span>
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: active ? `${score}%` : "0%", backgroundColor: color }} />
      </div>
    </div>
  );
}

function FreelancerCard({ f, rank, active, delay }) {
  const [show, setShow] = useState(false);
  const ms = useCount(f.matchScore, show, 900);
  useEffect(() => {
    if (!active) { setShow(false); return; }
    const t = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(t);
  }, [active, delay]);

  const scoreColor = ms >= 90 ? "#22c55e" : ms >= 80 ? "#3b82f6" : ms >= 70 ? "#f59e0b" : "#9ca3af";
  const dimColor = (s) => s >= 90 ? "#22c55e" : s >= 75 ? "#3b82f6" : s >= 60 ? "#f59e0b" : "#ef4444";

  if (!show) return (
    <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-4 h-36 flex items-center justify-center opacity-40">
      <span className="text-gray-300 text-2xl">#{rank}</span>
    </div>
  );

  return (
    <div className="bg-white border-2 border-gray-100 hover:border-blue-200 rounded-2xl p-4 transition-all duration-300 hover:shadow-md">
      <div className="flex gap-3">
        {/* Radar */}
        <div className="flex-shrink-0">
          <RadarChart scores={f.scores} size={110} active={show} />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-1 mb-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                style={{ backgroundColor: f.color }}>{f.avatar}</div>
              <div>
                <p className="font-bold text-gray-800 text-sm leading-tight">{f.name}</p>
                <p className="text-gray-400 text-xs">{f.title}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1 flex-shrink-0">
              <div className="text-2xl font-black leading-none" style={{ color: scoreColor }}>{ms}%</div>
              <div className="text-xs text-gray-400">match</div>
            </div>
          </div>

          {/* Scores */}
          <div className="space-y-1 mb-2">
            {[
              { label: "Skill Match", key: "skill" },
              { label: "Semantic", key: "semantic" },
              { label: "Budget", key: "budget" },
            ].map(({ label, key }) => (
              <ScoreDimension key={key} label={label} score={f.scores[key]} color={dimColor(f.scores[key])} active={show} />
            ))}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-1 flex-wrap">
              {f.skills.slice(0, 3).map(s => (
                <span key={s} className={`text-xs px-1.5 py-0.5 rounded-full ${JOB.required.includes(s) ? "bg-blue-100 text-blue-700 font-semibold" : "bg-gray-100 text-gray-500"}`}>{s}</span>
              ))}
              {f.skills.length > 3 && <span className="text-xs text-gray-400">+{f.skills.length - 3}</span>}
            </div>
            {f.badge && (
              <span className="text-xs bg-amber-50 border border-amber-200 text-amber-700 font-semibold px-2 py-0.5 rounded-full flex-shrink-0">
                ★ {f.badge}
              </span>
            )}
          </div>
        </div>
      </div>

      {show && (
        <div className="mt-2 pt-2 border-t border-gray-50">
          <p className="text-xs text-gray-500 italic">💡 {f.note}</p>
        </div>
      )}
    </div>
  );
}

// ─── Skill Extraction Panel ───────────────────────────────────────────────────

const EXTRACTED_SKILLS = [
  { skill: "React", conf: 99, type: "required", delay: 200 },
  { skill: "Node.js", conf: 97, type: "required", delay: 400 },
  { skill: "PostgreSQL", conf: 95, type: "required", delay: 600 },
  { skill: "REST API", conf: 92, type: "required", delay: 800 },
  { skill: "E-commerce", conf: 89, type: "domain", delay: 1000 },
  { skill: "Payment Integration", conf: 85, type: "domain", delay: 1200 },
  { skill: "Real-time Systems", conf: 81, type: "inferred", delay: 1400 },
  { skill: "Scalability", conf: 78, type: "inferred", delay: 1600 },
  { skill: "Admin Dashboard", conf: 75, type: "inferred", delay: 1800 },
  { skill: "TypeScript", conf: 70, type: "preferred", delay: 2000 },
];

function SkillExtractionPanel() {
  const [running, setRunning] = useState(false);
  const [visible, setVisible] = useState([]);
  const timers = useRef([]);

  const run = () => {
    timers.current.forEach(clearTimeout);
    setVisible([]);
    setRunning(true);
    EXTRACTED_SKILLS.forEach((s, i) => {
      const t = setTimeout(() => setVisible(prev => [...prev, i]), s.delay);
      timers.current.push(t);
    });
    const done = setTimeout(() => setRunning(false), 2200);
    timers.current.push(done);
  };

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const typeStyle = {
    required: "bg-blue-100 text-blue-700 border border-blue-200",
    domain: "bg-purple-100 text-purple-700 border border-purple-200",
    inferred: "bg-teal-100 text-teal-700 border border-teal-200",
    preferred: "bg-amber-100 text-amber-700 border border-amber-200",
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h3 className="font-bold text-gray-800 mb-1">🔬 Skill Extraction Demo</h3>
      <p className="text-xs text-gray-500 mb-4">AI อ่านประกาศงานและ extract ทักษะอัตโนมัติ ทั้งที่ระบุชัดเจนและที่ infer จาก context</p>

      <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 mb-4 leading-relaxed border border-gray-100">
        <span className="text-xs font-semibold text-gray-400 block mb-2">📄 Job Description Input</span>
        {JOB.description} ต้องใช้{" "}
        <span className="bg-blue-100 text-blue-700 px-1 rounded font-medium">React</span> +{" "}
        <span className="bg-blue-100 text-blue-700 px-1 rounded font-medium">Node.js</span> backend พร้อม{" "}
        <span className="bg-blue-100 text-blue-700 px-1 rounded font-medium">PostgreSQL</span> database
        และ <span className="bg-blue-100 text-blue-700 px-1 rounded font-medium">REST API</span>
      </div>

      <button
        onClick={run}
        disabled={running}
        className={`w-full py-2.5 rounded-xl font-semibold text-sm mb-4 transition-all ${running ? "bg-blue-50 text-blue-400 border border-blue-200" : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"}`}
      >
        {running ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            กำลัง Extract...
          </span>
        ) : "⚡ Extract Skills from JD"}
      </button>

      <div className="flex flex-wrap gap-2 min-h-16">
        {EXTRACTED_SKILLS.map((s, i) => (
          visible.includes(i) ? (
            <div key={s.skill} className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all duration-300 ${typeStyle[s.type]}`}>
              {s.skill}
              <span className="opacity-60 font-normal">{s.conf}%</span>
            </div>
          ) : null
        ))}
        {visible.length === 0 && <p className="text-xs text-gray-300 my-auto">กด Extract เพื่อดูผล</p>}
      </div>

      {visible.length > 0 && (
        <div className="flex gap-3 flex-wrap mt-3 pt-3 border-t border-gray-50">
          {[
            { type: "required", label: "Required (ชัดเจน)" },
            { type: "domain", label: "Domain (บริบท)" },
            { type: "inferred", label: "Inferred (อนุมาน)" },
            { type: "preferred", label: "Preferred (ควรมี)" },
          ].map(({ type, label }) => (
            <div key={type} className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${typeStyle[type]}`}>
              {label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Semantic Map ─────────────────────────────────────────────────────────────

function SemanticPanel() {
  const [selected, setSelected] = useState("React");
  const related = SEMANTIC_PAIRS.filter(p => p.a === selected || p.b === selected)
    .map(p => ({ skill: p.a === selected ? p.b : p.a, sim: p.sim }))
    .sort((a, b) => b.sim - a.sim);

  const allSkills = [...new Set(SEMANTIC_PAIRS.flatMap(p => [p.a, p.b]))];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h3 className="font-bold text-gray-800 mb-1">🕸️ Semantic Skill Map</h3>
      <p className="text-xs text-gray-500 mb-4">AI ไม่ได้จับคู่แค่ keyword ตรงๆ แต่เข้าใจว่าทักษะไหน "ใกล้เคียงกัน" เชิงความหมาย เลือกทักษะเพื่อดู semantic neighbors</p>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {allSkills.map(s => (
          <button
            key={s}
            onClick={() => setSelected(s)}
            className={`text-xs px-2.5 py-1 rounded-full font-medium transition-all ${selected === s ? "bg-blue-600 text-white shadow-sm" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">{selected}</span>
          <span className="text-gray-400 text-xs">→ Semantic Neighbors</span>
        </div>
        <div className="space-y-2">
          {related.map(({ skill, sim }) => {
            const color = sim >= 0.9 ? "#22c55e" : sim >= 0.8 ? "#3b82f6" : "#f59e0b";
            return (
              <div key={skill} className="flex items-center gap-3">
                <span className="text-xs text-gray-600 w-28 font-medium">{skill}</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${sim * 100}%`, backgroundColor: color }} />
                </div>
                <span className="text-xs font-bold w-10 text-right" style={{ color }}>{Math.round(sim * 100)}%</span>
                <span className="text-xs text-gray-300 w-16">{sim >= 0.9 ? "Very Close" : sim >= 0.8 ? "Related" : "Somewhat"}</span>
              </div>
            );
          })}
          {related.length === 0 && <p className="text-xs text-gray-400">ไม่มีข้อมูล semantic pair สำหรับทักษะนี้</p>}
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MatchingEngineDemo({ onBack }) {
  const [phase, setPhase] = useState("idle");
  const [phaseText, setPhaseText] = useState("");
  const [showResults, setShowResults] = useState(false);
  const timers = useRef([]);

  const clearAll = () => { timers.current.forEach(clearTimeout); };

  const startMatching = () => {
    clearAll();
    setShowResults(false);
    setPhase("extracting");

    const seq = [
      [0, "extracting"],
      [1200, "semantic"],
      [2400, "scoring"],
      [4000, "done"],
    ];

    seq.forEach(([delay, p]) => {
      const t = setTimeout(() => {
        setPhase(p);
        if (p === "scoring") setShowResults(true);
      }, delay);
      timers.current.push(t);
    });
  };

  const reset = () => {
    clearAll();
    setPhase("idle");
    setShowResults(false);
  };

  useEffect(() => () => clearAll(), []);

  const sorted = [...FREELANCERS].sort((a, b) => b.matchScore - a.matchScore);

  return (
    <div style={{ width: "100%", display: "block", minHeight: "100vh", background: "#f8fafc" }}>

      {/* Header */}
      <div style={{ width: "100%", background: "linear-gradient(135deg, #1e1b4b, #3730a3, #4f46e5)", padding: "3rem 1rem 2rem" }}>
        <div className="max-w-6xl mx-auto">
          <button onClick={onBack} className="flex items-center gap-2 text-indigo-300 hover:text-white mb-5 transition-colors text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            กลับหน้าหลัก
          </button>

          <div className="flex items-start gap-4 mb-5">
            <div className="w-14 h-14 bg-indigo-500/30 border border-indigo-400/40 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0">🎯</div>
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="bg-indigo-400/30 border border-indigo-300/40 text-indigo-100 text-xs font-semibold px-2.5 py-0.5 rounded-full">AI Feature</span>
                <span className="bg-green-400/20 border border-green-300/30 text-green-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">● Live Demo</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">AI Matching Engine</h1>
              <p className="text-indigo-200 text-sm mt-1 max-w-2xl">
                จับคู่ Freelancer กับงานอัตโนมัติด้วย Semantic Analysis, Skill Graph และ Learning จาก past matches
                — ไม่ใช่แค่ keyword search แต่เข้าใจ context และ compatibility จริงๆ
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { v: "94%", l: "Match Accuracy" },
              { v: "0.8 วิ", l: "Matching Speed" },
              { v: "50K+", l: "Skill Vectors" },
              { v: "3x", l: "Success Rate vs Manual" },
            ].map(s => (
              <div key={s.l} className="bg-white/10 border border-white/15 rounded-xl px-3 py-2.5 text-center">
                <div className="text-xl font-bold text-white">{s.v}</div>
                <div className="text-indigo-200 text-xs">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">

        {/* Main Demo: Job + Results */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

          {/* Job Card */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-blue-600 px-5 py-4">
                <p className="text-indigo-200 text-xs mb-0.5">📋 Job Posting</p>
                <h3 className="text-white font-bold text-base">{JOB.title}</h3>
                <p className="text-indigo-200 text-xs mt-0.5">{JOB.company}</p>
              </div>
              <div className="p-5">
                <p className="text-gray-600 text-sm mb-4 leading-relaxed">{JOB.description}</p>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">งบประมาณ</span>
                    <span className="font-semibold text-green-700">{JOB.budget.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">ระยะเวลา</span>
                    <span className="font-semibold text-gray-700">{JOB.timeline}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">ระดับ</span>
                    <span className="font-semibold text-gray-700">{JOB.level}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-xs text-gray-400 mb-2">Required Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {JOB.required.map(s => (
                      <span key={s} className="text-xs bg-indigo-100 text-indigo-700 font-semibold px-2.5 py-1 rounded-full">{s}</span>
                    ))}
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-xs text-gray-400 mb-2">Preferred Skills</p>
                  <div className="flex flex-wrap gap-1.5">
                    {JOB.preferred.map(s => (
                      <span key={s} className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">{s}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Button */}
            {phase === "idle" && (
              <button onClick={startMatching} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 text-sm">
                🎯 เริ่ม AI Matching
              </button>
            )}
            {phase !== "idle" && phase !== "done" && (
              <div className="w-full bg-indigo-50 border-2 border-indigo-200 rounded-xl p-4">
                <div className="flex items-center gap-2 text-indigo-700 font-semibold text-sm mb-3">
                  <svg className="w-4 h-4 animate-spin flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  {PHASE_LABEL[phase]}
                </div>
                <div className="space-y-1.5">
                  {PHASES.slice(1, -1).map((p, i) => {
                    const phaseIdx = PHASES.indexOf(phase);
                    const done = i + 1 < phaseIdx;
                    const active = p === phase;
                    return (
                      <div key={p} className={`flex items-center gap-2 text-xs ${done ? "text-green-600" : active ? "text-indigo-600 font-semibold" : "text-gray-300"}`}>
                        <span>{done ? "✓" : active ? "●" : "○"}</span>
                        {PHASE_LABEL[p]}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {phase === "done" && (
              <button onClick={reset} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 rounded-xl transition-colors text-sm">
                ↺ รีเซ็ต Demo
              </button>
            )}
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-gray-700 text-sm">
                ผลการจับคู่ <span className="text-gray-400 font-normal">({sorted.length} Freelancers วิเคราะห์)</span>
              </h3>
              {phase === "done" && (
                <span className="text-xs bg-green-100 text-green-700 font-semibold px-3 py-1 rounded-full">✓ เสร็จสิ้น</span>
              )}
            </div>
            <div className="space-y-3">
              {sorted.map((f, i) => (
                <FreelancerCard key={f.id} f={f} rank={i + 1} active={showResults} delay={i * 500} />
              ))}
            </div>
          </div>
        </div>

        {/* Skill Extraction + Semantic Map */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <SkillExtractionPanel />
          <SemanticPanel />
        </div>

        {/* How It Works */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-5 text-center">สถาปัตยกรรม AI Matching Engine</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: "🧬", step: "01", title: "Skill Graph Construction", desc: "สร้าง knowledge graph ของทักษะ 50,000+ nodes เชื่อมโยงด้วย semantic similarity จาก job postings จริง 2M+", color: "from-blue-500 to-blue-600" },
              { icon: "🔤", step: "02", title: "NLP Skill Extraction", desc: "ใช้ NLP model (fine-tuned BERT) extract ทักษะจาก JD และ portfolio ทั้ง explicit และ implicit skills", color: "from-indigo-500 to-indigo-600" },
              { icon: "📐", step: "03", title: "Multi-dimensional Scoring", desc: "คำนวณ match score 5 มิติ: Skill, Semantic, Budget, Timeline, Reputation พร้อม weight ที่ปรับตาม context", color: "from-violet-500 to-violet-600" },
              { icon: "🔄", step: "04", title: "Continuous Learning", desc: "Model เรียนรู้จาก feedback ว่าการจับคู่ไหนสำเร็จ ปรับ weight และ recommendations แบบ online learning", color: "from-purple-500 to-purple-600" },
            ].map(item => (
              <div key={item.step} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-xl mb-3 shadow-sm`}>{item.icon}</div>
                <div className="text-xs font-bold text-gray-300 mb-1">{item.step}</div>
                <h4 className="font-bold text-gray-800 text-sm mb-2">{item.title}</h4>
                <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Learning Signal */}
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl p-6">
          <h3 className="font-bold text-gray-800 mb-4">📈 Learning from Successful Matches</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Job Complete ✓", desc: "เมื่องานเสร็จสมบูรณ์ → เพิ่ม weight ให้ skill combination นั้น", icon: "🎯", color: "text-green-600" },
              { label: "Early Termination ✗", desc: "เมื่องานยกเลิกกลางคัน → ลด score สำหรับ pattern ที่คล้ายกัน", icon: "⚠️", color: "text-red-500" },
              { label: "5-Star Review ⭐", desc: "รีวิวดีมาก → boost freelancer ใน category นั้นและงานที่คล้ายกัน", icon: "⭐", color: "text-amber-500" },
            ].map(s => (
              <div key={s.label} className="bg-white rounded-xl p-4 border border-white shadow-sm">
                <div className="text-2xl mb-2">{s.icon}</div>
                <p className={`font-bold text-sm mb-1 ${s.color}`}>{s.label}</p>
                <p className="text-gray-500 text-xs leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
