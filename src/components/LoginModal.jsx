const ROLES = [
  {
    id: "freelancer",
    emoji: "🧑‍💻",
    title: "ฟรีแลนซ์",
    desc: "เข้าสู่ระบบเพื่อลงประกาศรับงาน",
    subDesc: "ณัฐวุฒิ แสงทอง · Full Stack Developer",
    borderHover: "hover:border-blue-400 hover:bg-blue-50",
    border: "border-blue-100",
    iconBg: "bg-blue-100",
  },
  {
    id: "customer",
    emoji: "👔",
    title: "ลูกค้า (Customer)",
    desc: "เข้าสู่ระบบเพื่อค้นหาและว่าจ้างฟรีแลนซ์",
    subDesc: "สมศักดิ์ ธุรกิจดี · TechShop Co., Ltd.",
    borderHover: "hover:border-green-400 hover:bg-green-50",
    border: "border-green-100",
    iconBg: "bg-green-100",
  },
];

export default function LoginModal({ onClose, onSelectRole }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-gray-800">เข้าสู่ระบบ</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg leading-none">✕</button>
        </div>
        <p className="text-gray-400 text-sm mb-5">เลือกบทบาทเพื่อทดลองใช้งาน Demo</p>

        <div className="space-y-3">
          {ROLES.map(r => (
            <button
              key={r.id}
              onClick={() => onSelectRole(r.id)}
              className={`w-full group border-2 ${r.border} ${r.borderHover} rounded-2xl p-4 text-left transition-all hover:shadow-md`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 ${r.iconBg} rounded-xl flex items-center justify-center text-2xl flex-shrink-0 transition-colors`}>
                  {r.emoji}
                </div>
                <div>
                  <p className="font-bold text-gray-800">{r.title}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{r.desc}</p>
                  <p className="text-gray-400 text-xs mt-0.5 italic">{r.subDesc}</p>
                </div>
              </div>
            </button>
          ))}
        </div>

        <p className="text-center text-gray-300 text-xs mt-4">* Demo mode — ไม่ต้องใช้รหัสผ่าน</p>
      </div>
    </div>
  );
}
