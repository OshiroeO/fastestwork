import { useState } from "react";
import PaymentModal from "./PaymentModal";

const REVIEWS = [
  { name: "คุณพิชัย ว.",  avatar: "พช", rating: 5, text: "งานเสร็จตรงเวลา โค้ดสะอาดมาก communicate ดีตลอด แนะนำเลยครับ!", date: "2 สัปดาห์ที่แล้ว" },
  { name: "StartupX",     avatar: "SX", rating: 5, text: "ทำ dashboard ได้ตรงตามความต้องการ และยังแนะนำ best practice เพิ่มเติมด้วย ประทับใจมาก", date: "1 เดือนที่แล้ว" },
  { name: "คุณนภา ร.",    avatar: "นภ", rating: 5, text: "API performance ดีมาก ทดสอบแล้วรองรับ 10K req/s ได้สบาย ขอบคุณครับ", date: "2 เดือนที่แล้ว" },
];

export default function FreelancerProfileModal({ freelancer, postedJob, onClose, onChat }) {
  const [hired, setHired] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState(1);
  const [showPayment, setShowPayment] = useState(false);

  const defaultPackages = [
    { name: "Basic",    price: "5,000",  days: 7,  desc: "Landing page / Static website (5 หน้า)",          features: ["Responsive design","5 หน้า","Contact form","2 revisions"] },
    { name: "Standard", price: "15,000", days: 14, desc: "Full-stack website + backend + admin panel",       features: ["ทุกอย่างใน Basic","Backend API","Database","Admin panel","Auth system"], highlight: true },
    { name: "Premium",  price: "40,000", days: 30, desc: "Full-stack app + CI/CD + AWS + support 3 เดือน",  features: ["ทุกอย่างใน Standard","CI/CD pipeline","AWS deployment","Support 3 เดือน","Unlimited revisions"] },
  ];

  const packages = postedJob?.packages ?? defaultPackages;
  const jobTitle = postedJob?.title ?? "พัฒนาเว็บไซต์และแอปพลิเคชัน Full-Stack";
  const jobDesc  = postedJob?.description ?? "รับพัฒนาเว็บไซต์และแอปพลิเคชันแบบครบวงจร ตั้งแต่ UI/UX design ไปจนถึง cloud deployment พร้อมประสบการณ์ 5 ปีในการทำ e-commerce, dashboard และ SaaS ครับ";
  const jobTags  = postedJob?.tags ?? "React, Node.js, MongoDB, TypeScript, AWS";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full overflow-hidden flex flex-col"
        style={{ maxWidth: 720, maxHeight: "90vh" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative flex-shrink-0" style={{ background: `linear-gradient(135deg, ${freelancer.headerColor ?? "#2563eb"}, ${freelancer.avatarColor ?? "#3b82f6"})` }}>
          <button onClick={onClose} className="absolute top-3 right-3 text-white/70 hover:text-white text-lg leading-none z-10">✕</button>
          <div className="h-24" />
          <div className="px-6 pb-4 -mt-9 flex items-end gap-4">
            <div
              className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center text-white font-black text-base shadow-lg flex-shrink-0"
              style={{ backgroundColor: freelancer.avatarColor ?? "#3b82f6" }}
            >
              {freelancer.avatar}
            </div>
            <div className="pb-1">
              <h2 className="text-white font-black text-lg leading-tight">{freelancer.name}</h2>
              <p className="text-white/80 text-sm">{freelancer.title}</p>
            </div>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1">
          <div className="px-6 py-5 space-y-5">

            {/* Stats row */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="text-yellow-400 text-sm">★</span>
                <span className="font-bold text-gray-800">{freelancer.rating ?? "5.0"}</span>
                <span className="text-gray-400 text-sm">({freelancer.reviews ?? 128} รีวิว)</span>
              </div>
              <span className="bg-yellow-100 text-yellow-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {freelancer.level ?? "Pro"}
              </span>
              <span className="text-gray-400 text-sm">· ตอบกลับภายใน 1 ชม.</span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {jobTags.split(",").map(t => (
                <span key={t} className="text-xs bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-full">{t.trim()}</span>
              ))}
            </div>

            {/* Posted job title */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">บริการที่เปิดรับ</span>
                {postedJob && <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">● เพิ่งอัปเดต</span>}
              </div>
              <h3 className="font-bold text-gray-800 mb-2">{jobTitle}</h3>
              <p className="text-gray-500 text-sm leading-relaxed line-clamp-3 whitespace-pre-line">{jobDesc}</p>
            </div>

            {/* Packages */}
            <div>
              <h4 className="font-bold text-gray-700 mb-3">เลือกแพ็กเกจ</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {packages.map((pkg, i) => (
                  <button
                    key={pkg.name}
                    onClick={() => setSelectedPkg(i)}
                    className={`rounded-xl border-2 p-3 text-left transition-all ${
                      selectedPkg === i
                        ? "border-blue-500 bg-blue-50 shadow-sm"
                        : pkg.highlight
                          ? "border-blue-200 bg-blue-50/40 hover:border-blue-400"
                          : "border-gray-100 hover:border-blue-200"
                    }`}
                  >
                    {pkg.highlight && (
                      <span className="text-xs bg-blue-600 text-white px-1.5 py-0.5 rounded font-semibold mb-1 inline-block">แนะนำ</span>
                    )}
                    {selectedPkg === i && !pkg.highlight && (
                      <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded font-semibold mb-1 inline-block">เลือกอยู่</span>
                    )}
                    <p className="font-bold text-gray-800 text-sm">{pkg.name}</p>
                    <p className="text-blue-700 font-black text-lg">฿{pkg.price}</p>
                    <p className="text-gray-400 text-xs mb-1">ส่งงานใน {pkg.days} วัน</p>
                    <p className="text-gray-500 text-xs">{pkg.desc}</p>
                    {pkg.features && (
                      <ul className="mt-2 space-y-0.5">
                        {pkg.features.slice(0, 3).map(f => (
                          <li key={f} className="text-xs text-gray-500 flex items-center gap-1">
                            <span className="text-green-500">✓</span> {f}
                          </li>
                        ))}
                      </ul>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Hire success */}
            {hired && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
                <p className="text-green-700 font-semibold text-sm">🎉 ชำระเงินและว่าจ้างสำเร็จ!</p>
                <p className="text-green-600 text-xs mt-0.5">ฟรีแลนซ์จะเริ่มงานและติดต่อกลับภายใน 24 ชั่วโมง</p>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => !hired && setShowPayment(true)}
                className={`flex-1 font-bold py-3 rounded-xl transition-colors shadow-md hover:shadow-lg text-sm ${
                  hired
                    ? "bg-green-100 text-green-700 cursor-default"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                {hired
                  ? "✓ ชำระเงินแล้ว"
                  : `ว่าจ้าง — ฿${packages[selectedPkg]?.price ?? "15,000"}`}
              </button>
              <button
                onClick={onChat}
                title="เปิดแชท"
                className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold px-5 py-3 rounded-xl transition-colors text-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                แชท
              </button>
            </div>

            {/* Payment Modal */}
            {showPayment && (
              <PaymentModal
                amount={packages[selectedPkg]?.price ?? "15,000"}
                packageName={`${packages[selectedPkg]?.name ?? "Standard"} Package`}
                freelancerName={freelancer.name}
                onClose={() => setShowPayment(false)}
                onSuccess={() => setHired(true)}
              />
            )}

            {/* Reviews */}
            <div>
              <h4 className="font-bold text-gray-700 mb-3">รีวิวล่าสุด</h4>
              <div className="space-y-3">
                {REVIEWS.map(r => (
                  <div key={r.name} className="bg-gray-50 rounded-xl p-3 border border-gray-100">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                        {r.avatar}
                      </div>
                      <span className="font-semibold text-gray-700 text-sm">{r.name}</span>
                      <span className="text-yellow-400 text-xs">{"★".repeat(r.rating)}</span>
                      <span className="text-gray-400 text-xs ml-auto">{r.date}</span>
                    </div>
                    <p className="text-gray-500 text-sm">{r.text}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
