import { useState } from "react";

// ─── Static Data ──────────────────────────────────────────────────────────────

const INITIAL_JOBS = [
  {
    id: 1,
    title: "พัฒนา E-commerce Platform (React + Node.js)",
    client: "คุณสมศักดิ์ ธุรกิจดี",
    clientAvatar: "สส",
    clientColor: "#10b981",
    package: "Standard Package",
    price: 15000,
    dueDate: "14 วัน",
    status: "new_order",
    statusLabel: "รอยืนยันรับงาน",
    statusColor: "bg-orange-100 text-orange-700",
    progress: 0,
    paidAt: "เมื่อ 5 นาทีที่แล้ว",
  },
  {
    id: 2,
    title: "REST API สำหรับ HealthApp",
    client: "คุณนภา รักงาน",
    clientAvatar: "นภ",
    clientColor: "#8b5cf6",
    package: "Basic Package",
    price: 8000,
    dueDate: "7 วัน",
    status: "waiting_review",
    statusLabel: "รอลูกค้ายืนยันรับงาน",
    statusColor: "bg-purple-100 text-purple-700",
    progress: 100,
    paidAt: null,
  },
  {
    id: 3,
    title: "E-commerce Platform – ThaiShop",
    client: "คุณพิชัย ว.",
    clientAvatar: "พช",
    clientColor: "#3b82f6",
    package: "Premium Package",
    price: 35000,
    dueDate: "30 วัน",
    status: "in_progress",
    statusLabel: "กำลังดำเนินการ",
    statusColor: "bg-blue-100 text-blue-700",
    progress: 65,
  },
  {
    id: 4,
    title: "Admin Dashboard – StartupX",
    client: "StartupX Co.",
    clientAvatar: "SX",
    clientColor: "#f59e0b",
    package: "Standard Package",
    price: 12000,
    dueDate: "14 วัน",
    status: "review",
    statusLabel: "รอรีวิว",
    statusColor: "bg-yellow-100 text-yellow-700",
    progress: 95,
  },
];

const INITIAL_TRANSACTIONS = [
  { label: "E-commerce Platform – ThaiShop",   amount: 35000, date: "3 วันที่แล้ว",   type: "escrow" },
  { label: "Admin Dashboard – StartupX",        amount: 12000, date: "1 สัปดาห์ที่แล้ว", type: "received" },
  { label: "Business Dashboard – FinanceApp",   amount: 8000,  date: "2 สัปดาห์ที่แล้ว", type: "received" },
];

// Chat messages for Job 2 — last message = customer confirms delivery
const JOB2_CHAT = [
  { id: 1, from: "freelancer", text: "สวัสดีครับ คุณนภา ผมเสร็จงานแล้วครับ ส่ง REST API ให้ตรวจสอบได้เลยนะครับ", time: "09:10" },
  { id: 2, from: "customer",   text: "โอเคครับ ขอเวลาตรวจสอบหน่อยนะครับ",                                              time: "09:15" },
  { id: 3, from: "freelancer", text: "ได้เลยครับ ส่ง Postman collection และ documentation ไปใน email แล้วนะครับ ทดสอบได้เลยครับ", time: "09:16" },
  { id: 4, from: "customer",   text: "ได้รับแล้วครับ กำลัง test อยู่นะครับ",                                           time: "09:42" },
  { id: 5, from: "customer",   text: "API response เร็วมากเลยครับ รองรับ 5,000 req/s ได้สบาย performance ดีกว่าที่คาดไว้ด้วย", time: "09:45" },
  { id: 6, from: "customer",   text: "unit test ผ่านหมดเลยครับ documentation ครบถ้วนมากๆ ชอบมากๆ เลยครับ",              time: "09:47" },
  { id: 7, from: "freelancer", text: "ขอบคุณครับ ถ้ามีอะไรต้องแก้ไขบอกได้เลยครับ มี support ให้ 1 เดือนครับ",           time: "09:48" },
  { id: 8, from: "customer",   text: "เรียบร้อยแล้วครับ ✅ ยืนยันรับงานเรียบร้อย ขอบคุณมากๆ เลยครับ จ้างใหม่แน่นอน!", time: "09:50" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function WalletToast({ toast }) {
  if (!toast) return null;
  const isPayment = toast.type === "payment";
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[300] animate-bounce-once">
      <div className={`flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl text-white font-bold text-sm ${
        isPayment ? "bg-green-500" : "bg-blue-600"
      }`}>
        <span className="text-xl">{isPayment ? "💰" : "✅"}</span>
        <span>{toast.message}</span>
      </div>
    </div>
  );
}

function JobChatModal({ job, onClose }) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)", zIndex: 200 }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full flex flex-col overflow-hidden" style={{ maxWidth: 440, maxHeight: "90vh" }}>

        {/* Header */}
        <div className="bg-purple-700 px-4 py-3 flex items-center gap-3 flex-shrink-0">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
            style={{ backgroundColor: job.clientColor }}>
            {job.clientAvatar}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm truncate">{job.client}</p>
            <p className="text-purple-200 text-xs">เกี่ยวกับ: {job.title}</p>
          </div>
          <button
            onClick={onClose}
            className="text-purple-200 hover:text-white text-lg leading-none flex-shrink-0"
          >✕</button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50">
          {JOB2_CHAT.map((msg) => {
            const isFreelancer = msg.from === "freelancer";
            return (
              <div key={msg.id} className={`flex ${isFreelancer ? "justify-end" : "justify-start"} items-end gap-2`}>
                {!isFreelancer && (
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0 mb-0.5"
                    style={{ backgroundColor: job.clientColor }}>
                    {job.clientAvatar}
                  </div>
                )}
                <div className="max-w-[75%]">
                  <div className={`px-3.5 py-2 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    isFreelancer
                      ? "bg-purple-600 text-white rounded-br-sm"
                      : msg.id === 8
                        ? "bg-green-100 text-green-800 rounded-bl-sm border-2 border-green-300 font-semibold"
                        : "bg-white text-gray-700 rounded-bl-sm border border-gray-100"
                  }`}>
                    {msg.text}
                  </div>
                  <p className={`text-xs text-gray-400 mt-0.5 ${isFreelancer ? "text-right" : "text-left"}`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Confirmation banner */}
        <div className="flex-shrink-0 bg-green-50 border-t-2 border-green-200 px-4 py-3">
          <div className="flex items-center gap-2 mb-2.5">
            <span className="text-lg">✅</span>
            <div>
              <p className="font-bold text-green-700 text-sm">ลูกค้ายืนยันรับงานแล้ว!</p>
              <p className="text-green-600 text-xs">เงินถูก lock ไว้ใน Escrow พร้อมโอนให้คุณ</p>
            </div>
            <span className="ml-auto font-black text-green-700 text-lg">฿{job.price.toLocaleString()}</span>
          </div>
          <button
            onClick={onClose}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
          >
            <span>💰</span> ปิดแชทและรับเงิน ฿{job.price.toLocaleString()}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Post Job Page ────────────────────────────────────────────────────────────

const PREFILLED = {
  title: "พัฒนาเว็บไซต์และแอปพลิเคชัน Full-Stack (React + Node.js)",
  category: "พัฒนาโปรแกรม",
  description:
    "รับพัฒนาเว็บไซต์และแอปพลิเคชันแบบครบวงจร ตั้งแต่ออกแบบ UI/UX ไปจนถึง deployment บน Cloud ครับ\n\nมีประสบการณ์กว่า 5 ปีในการพัฒนา:\n• E-commerce platforms (custom cart, payment gateway)\n• Business dashboards & analytics\n• REST API & microservices\n• Real-time applications (chat, notifications)\n\nทุกโปรเจกต์มาพร้อม clean code, documentation ครบถ้วน และ support หลัง delivery ครับ",
  tags: "React, Node.js, MongoDB, TypeScript, AWS",
  packages: [
    { name: "Basic",    price: "5,000",  days: 7,  desc: "Landing page หรือเว็บไซต์ static 5 หน้า",      features: ["Responsive design","5 หน้า","Contact form","2 revisions"] },
    { name: "Standard", price: "15,000", days: 14, desc: "เว็บไซต์พร้อม backend + database + admin panel", features: ["ทุกอย่างใน Basic","Backend API","Database","Admin panel","Auth system"], highlight: true },
    { name: "Premium",  price: "40,000", days: 30, desc: "Full-stack app + CI/CD + AWS + support 3 เดือน", features: ["ทุกอย่างใน Standard","CI/CD pipeline","AWS deployment","Support 3 เดือน","Unlimited revisions"] },
  ],
};

function PostJobPage({ onPost, postedJob }) {
  const [form, setForm] = useState(PREFILLED);
  const [submitted, setSubmitted] = useState(!!postedJob);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    onPost({ ...form, freelancerId: 1, postedAt: new Date() });
  };

  if (submitted) {
    const job = postedJob || form;
    return (
      <div style={{ padding: "2rem 1rem" }}>
        <div className="max-w-3xl mx-auto space-y-5">
          <div className="bg-green-50 border-2 border-green-300 rounded-2xl p-6 text-center">
            <div className="text-5xl mb-3">🎉</div>
            <h2 className="text-xl font-bold text-green-700 mb-1">งานถูกโพสต์แล้ว!</h2>
            <p className="text-green-600 text-sm">ลูกค้าสามารถมองเห็นบริการของคุณได้แล้ว ลองเปลี่ยนมุมมองเป็น "ลูกค้า" เพื่อดูผล</p>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-bold text-gray-800 mb-4">📋 ตัวอย่างบริการที่โพสต์</h3>
            <h4 className="font-bold text-lg text-gray-800 mb-1">{job.title}</h4>
            <p className="text-blue-600 text-sm mb-3">{job.category}</p>
            <p className="text-gray-500 text-sm whitespace-pre-line mb-4">{job.description}</p>
            <div className="flex flex-wrap gap-1.5 mb-5">
              {job.tags.split(",").map(t => (
                <span key={t} className="text-xs bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-full">{t.trim()}</span>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {job.packages.map(pkg => (
                <div key={pkg.name} className={`rounded-xl border-2 p-3 ${pkg.highlight ? "border-blue-400 bg-blue-50" : "border-gray-100"}`}>
                  {pkg.highlight && <div className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full inline-block mb-1">แนะนำ</div>}
                  <p className="font-bold text-gray-800 text-sm">{pkg.name}</p>
                  <p className="text-blue-700 font-bold text-lg">฿{pkg.price}</p>
                  <p className="text-gray-400 text-xs">{pkg.days} วัน</p>
                </div>
              ))}
            </div>
          </div>
          <div className="text-center">
            <button onClick={() => setSubmitted(false)} className="text-blue-600 hover:text-blue-700 text-sm underline">แก้ไขบริการ</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem 1rem" }}>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800">ลงประกาศรับงาน</h2>
          <p className="text-gray-500 text-sm mt-1">ข้อมูลถูกกรอกไว้แล้ว กรุณาตรวจสอบแล้วกด Submit เพื่อเผยแพร่</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">ชื่อบริการ</label>
            <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">หมวดหมู่</label>
              <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-300">
                {["พัฒนาโปรแกรม","กราฟิกและดีไซน์","การตลาดดิจิทัล","เขียนและแปลภาษา","วิดีโอและแอนิเมชัน"].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">ทักษะ / Tags</label>
              <input type="text" value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <label className="block text-sm font-semibold text-gray-700 mb-2">คำอธิบายบริการ</label>
            <textarea rows={6} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none" />
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-semibold text-gray-700 mb-4">แพ็กเกจบริการ</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {form.packages.map((pkg, i) => (
                <div key={pkg.name} className={`rounded-xl border-2 p-4 ${pkg.highlight ? "border-blue-300 bg-blue-50/50" : "border-gray-100"}`}>
                  {pkg.highlight && <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full font-semibold mb-2 inline-block">⭐ แนะนำ</span>}
                  <p className="font-bold text-gray-800 mb-2">{pkg.name}</p>
                  <div className="mb-2">
                    <label className="text-xs text-gray-400">ราคา (฿)</label>
                    <input type="text" value={pkg.price}
                      onChange={e => setForm(f => ({ ...f, packages: f.packages.map((p, j) => j === i ? { ...p, price: e.target.value } : p) }))}
                      className="w-full mt-0.5 px-2 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-blue-300" />
                  </div>
                  <div>
                    <label className="text-xs text-gray-400">ระยะเวลา (วัน)</label>
                    <input type="number" value={pkg.days}
                      onChange={e => setForm(f => ({ ...f, packages: f.packages.map((p, j) => j === i ? { ...p, days: e.target.value } : p) }))}
                      className="w-full mt-0.5 px-2 py-1.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-1 focus:ring-blue-300" />
                  </div>
                  <ul className="mt-2 space-y-0.5">
                    {pkg.features.map(f => (
                      <li key={f} className="text-xs text-gray-500 flex items-center gap-1"><span className="text-green-500">✓</span> {f}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-md hover:shadow-lg text-base flex items-center justify-center gap-2">
            🚀 เผยแพร่บริการ (Submit)
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── My Jobs Page ─────────────────────────────────────────────────────────────

function MyJobsPage({ jobs, walletBalance, onConfirmJob, onOpenChat }) {
  return (
    <div style={{ padding: "2rem 1rem" }}>
      <div className="max-w-3xl mx-auto space-y-5">

        {/* Wallet mini card */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-700 rounded-2xl px-5 py-4 flex items-center justify-between text-white">
          <div>
            <p className="text-blue-200 text-xs">กระเป๋าเงิน</p>
            <p className="font-black text-2xl">฿{walletBalance.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-blue-200 text-xs">{jobs.length} งานทั้งหมด</p>
            <p className="text-blue-100 text-sm font-semibold">
              {jobs.filter(j => j.status === "new_order").length > 0
                ? `🔔 ${jobs.filter(j => j.status === "new_order").length} งานรอยืนยัน`
                : "ไม่มีการแจ้งเตือนใหม่"}
            </p>
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-800">งานของฉัน</h2>

        {jobs.map(job => {
          // ── NEW ORDER card ──────────────────────────────────────────────────
          if (job.status === "new_order") return (
            <div key={job.id} className="bg-white rounded-2xl border-2 border-orange-300 shadow-sm overflow-hidden">
              <div className="bg-orange-50 px-5 py-2.5 flex items-center gap-2 border-b border-orange-200">
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                <span className="text-orange-700 font-bold text-sm">💳 ลูกค้าชำระเงินแล้ว — รอการยืนยันรับงาน</span>
                <span className="ml-auto text-orange-500 text-xs">{job.paidAt}</span>
              </div>
              <div className="px-5 py-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                      style={{ backgroundColor: job.clientColor }}>{job.clientAvatar}</div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm">{job.title}</h4>
                      <p className="text-gray-400 text-xs mt-0.5">{job.client} · {job.package}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-black text-green-700 text-lg">฿{job.price.toLocaleString()}</p>
                    <p className="text-gray-400 text-xs">ส่งมอบใน {job.dueDate}</p>
                  </div>
                </div>

                <div className="bg-orange-50 rounded-xl px-4 py-3 text-sm text-orange-700 mb-4 flex items-start gap-2">
                  <span className="text-base flex-shrink-0">ℹ️</span>
                  <p>เงินถูก lock ใน Escrow แล้ว — กดยืนยันรับงานเพื่อเริ่มทำงาน หากปฏิเสธเงินจะคืนลูกค้าโดยอัตโนมัติ</p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => onConfirmJob(job.id)}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
                  >
                    ✅ ยืนยันรับงาน
                  </button>
                  <button className="px-5 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-3 rounded-xl transition-colors text-sm">
                    ปฏิเสธ
                  </button>
                </div>
              </div>
            </div>
          );

          // ── WAITING REVIEW card ─────────────────────────────────────────────
          if (job.status === "waiting_review") return (
            <div key={job.id} className="bg-white rounded-2xl border-2 border-purple-300 shadow-sm overflow-hidden">
              <div className="bg-purple-50 px-5 py-2.5 flex items-center gap-2 border-b border-purple-200">
                <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
                <span className="text-purple-700 font-bold text-sm">📤 ส่งงานแล้ว — รอลูกค้ายืนยันรับงาน</span>
              </div>
              <div className="px-5 py-4">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                      style={{ backgroundColor: job.clientColor }}>{job.clientAvatar}</div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm">{job.title}</h4>
                      <p className="text-gray-400 text-xs mt-0.5">{job.client} · {job.package}</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-black text-purple-700 text-lg">฿{job.price.toLocaleString()}</p>
                    <span className="text-xs bg-purple-100 text-purple-600 px-2 py-0.5 rounded-full font-medium">รอยืนยัน</span>
                  </div>
                </div>

                {/* Progress */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>ความคืบหน้า</span>
                    <span className="font-semibold text-green-600">เสร็จ 100%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: "100%" }} />
                  </div>
                </div>

                <div className="bg-purple-50 rounded-xl px-4 py-3 text-sm text-purple-700 mb-4 flex items-start gap-2">
                  <span className="text-base flex-shrink-0">💬</span>
                  <p>ลูกค้าอยู่ระหว่างตรวจสอบงาน — ดูแชทล่าสุดเพื่อติดตามสถานะ เงินจะโอนทันทีเมื่อลูกค้ายืนยัน</p>
                </div>

                <button
                  onClick={() => onOpenChat(job.id)}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
                >
                  💬 ดูแชทกับลูกค้า
                </button>
              </div>
            </div>
          );

          // ── DONE card ───────────────────────────────────────────────────────
          if (job.status === "done") return (
            <div key={job.id} className="bg-white rounded-2xl border-2 border-green-200 shadow-sm overflow-hidden">
              <div className="bg-green-50 px-5 py-2.5 flex items-center gap-2 border-b border-green-200">
                <span className="text-green-600 font-bold text-sm">✅ เสร็จสิ้น — รับเงินแล้ว ฿{job.price.toLocaleString()}</span>
              </div>
              <div className="px-5 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                    style={{ backgroundColor: job.clientColor }}>{job.clientAvatar}</div>
                  <div>
                    <p className="font-bold text-gray-700 text-sm">{job.title}</p>
                    <p className="text-gray-400 text-xs">{job.client}</p>
                  </div>
                </div>
                <span className="font-black text-green-600 text-base">฿{job.price.toLocaleString()}</span>
              </div>
            </div>
          );

          // ── DEFAULT cards (in_progress / review) ────────────────────────────
          return (
            <div key={job.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0"
                    style={{ backgroundColor: job.clientColor }}>{job.clientAvatar}</div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-sm">{job.title}</h4>
                    <p className="text-gray-400 text-xs mt-0.5">{job.client} · {job.package}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-bold text-blue-700">{`฿${job.price.toLocaleString()}`}</p>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mt-1 inline-block ${job.statusColor}`}>
                    {job.statusLabel}
                  </span>
                </div>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full transition-all duration-700" style={{ width: `${job.progress}%` }} />
              </div>
              <p className="text-xs text-gray-400 mt-1 text-right">{job.progress}%</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Income Page ──────────────────────────────────────────────────────────────

function IncomePage({ walletBalance, transactions }) {
  const stats = [
    { label: "กระเป๋าเงิน",        value: `฿${walletBalance.toLocaleString()}`, sub: "พร้อมถอน",               color: "text-green-600" },
    { label: "รายได้เดือนนี้",      value: "฿55,000",                            sub: "+12% จากเดือนที่แล้ว",  color: "text-blue-600"  },
    { label: "งานเสร็จสิ้น",        value: "128",                                sub: "โปรเจกต์ทั้งหมด",        color: "text-indigo-600"},
    { label: "คะแนนเฉลี่ย",         value: "4.9 ★",                              sub: "จาก 94 รีวิว",           color: "text-yellow-600"},
  ];
  return (
    <div style={{ padding: "2rem 1rem" }}>
      <div className="max-w-3xl mx-auto space-y-5">
        <h2 className="text-2xl font-bold text-gray-800">ภาพรวมรายได้</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
              <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              <p className="font-semibold text-gray-700 text-sm mt-1">{s.label}</p>
              <p className="text-gray-400 text-xs mt-0.5">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Recent transactions */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-bold text-gray-700 mb-4">รายการล่าสุด</h3>
          <div className="space-y-3">
            {transactions.map((tx, i) => (
              <div key={i} className={`flex items-center justify-between py-2.5 border-b border-gray-50 last:border-0 ${i === 0 && tx.date === "ตอนนี้" ? "bg-green-50 -mx-3 px-3 rounded-xl" : ""}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    tx.type === "received" || tx.date === "ตอนนี้" ? "bg-green-100 text-green-600" : "bg-blue-100 text-blue-600"
                  }`}>
                    {tx.date === "ตอนนี้" ? "💰" : tx.type === "received" ? "✓" : "⏳"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">{tx.label}</p>
                    <p className="text-xs text-gray-400">{tx.date}</p>
                  </div>
                </div>
                <span className={`font-bold text-sm ${tx.date === "ตอนนี้" ? "text-green-600" : "text-gray-700"}`}>
                  +฿{tx.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Profile Page ─────────────────────────────────────────────────────────────

function ProfilePage() {
  return (
    <div style={{ padding: "2rem 1rem" }}>
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-600" />
          <div className="px-6 pb-6 -mt-10">
            <div className="w-16 h-16 rounded-full border-4 border-white bg-blue-500 flex items-center justify-center text-white font-black text-lg shadow-md mb-3">NT</div>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-black text-xl text-gray-800">ณัฐวุฒิ แสงทอง</h3>
                <p className="text-gray-500 text-sm">Full Stack Developer · 5 ปีประสบการณ์</p>
                <p className="text-blue-600 text-sm mt-0.5">somchai.nathawut@gmail.com</p>
              </div>
              <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2.5 py-1 rounded-full">Pro</span>
            </div>
            <div className="flex gap-2 flex-wrap mt-3">
              {["React","Node.js","MongoDB","TypeScript","AWS"].map(t => (
                <span key={t} className="text-xs bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-full">{t}</span>
              ))}
            </div>
            <div className="grid grid-cols-3 gap-4 mt-5 pt-5 border-t border-gray-50 text-center">
              {[["128","โปรเจกต์"],["4.9 ★","คะแนน"],["94","รีวิว"]].map(([v,l]) => (
                <div key={l}><p className="font-black text-gray-800 text-lg">{v}</p><p className="text-gray-400 text-xs">{l}</p></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────

export default function FreelancerDashboard({ subPage, onPostJob, postedJob }) {
  const [walletBalance, setWalletBalance] = useState(55000);
  const [jobs, setJobs]                   = useState(INITIAL_JOBS);
  const [chatJobId, setChatJobId]         = useState(null);
  const [toast, setToast]                 = useState(null);
  const [transactions, setTransactions]   = useState(INITIAL_TRANSACTIONS);

  const showToast = (t) => {
    setToast(t);
    setTimeout(() => setToast(null), 4000);
  };

  const handleConfirmJob = (jobId) => {
    setJobs(prev => prev.map(j =>
      j.id === jobId
        ? { ...j, status: "in_progress", statusLabel: "กำลังดำเนินการ", statusColor: "bg-blue-100 text-blue-700", progress: 5 }
        : j
    ));
    showToast({ type: "accept", message: "✅ ยืนยันรับงานสำเร็จ! เริ่มงานได้เลยครับ" });
  };

  const handleChatClose = () => {
    const job = jobs.find(j => j.id === chatJobId);
    if (job) {
      setJobs(prev => prev.map(j =>
        j.id === chatJobId
          ? { ...j, status: "done", statusLabel: "เสร็จสิ้น ✓", statusColor: "bg-green-100 text-green-700", progress: 100 }
          : j
      ));
      setWalletBalance(prev => prev + job.price);
      setTransactions(prev => [
        { label: job.title, amount: job.price, date: "ตอนนี้", type: "received" },
        ...prev,
      ]);
      showToast({ type: "payment", message: `💰 +฿${job.price.toLocaleString()} เข้ากระเป๋าเงินแล้ว! 🎉` });
    }
    setChatJobId(null);
  };

  const chatJob = jobs.find(j => j.id === chatJobId) ?? null;

  return (
    <>
      {/* Toast notification */}
      <WalletToast toast={toast} />

      {/* Chat modal */}
      {chatJob && (
        <JobChatModal job={chatJob} onClose={handleChatClose} />
      )}

      {/* Sub-pages */}
      {subPage === "my-jobs" && (
        <MyJobsPage
          jobs={jobs}
          walletBalance={walletBalance}
          onConfirmJob={handleConfirmJob}
          onOpenChat={setChatJobId}
        />
      )}
      {subPage === "income" && (
        <IncomePage walletBalance={walletBalance} transactions={transactions} />
      )}
      {subPage === "profile" && <ProfilePage />}
      {(subPage === "post-job" || !subPage) && (
        <PostJobPage onPost={onPostJob} postedJob={postedJob} />
      )}
    </>
  );
}
