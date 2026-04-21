const steps = [
  {
    step: "01",
    title: "ค้นหาบริการ",
    desc: "ค้นหาบริการจากหมวดหมู่ต่างๆ หรือพิมพ์งานที่ต้องการ",
    icon: "🔍",
  },
  {
    step: "02",
    title: "เลือกฟรีแลนซ์",
    desc: "เปรียบเทียบโปรไฟล์ ผลงาน และราคา เพื่อหาคนที่เหมาะสม",
    icon: "👤",
  },
  {
    step: "03",
    title: "สั่งงานและชำระ",
    desc: "สั่งงานและชำระเงินปลอดภัยผ่านระบบ Escrow ของเรา",
    icon: "💳",
  },
  {
    step: "04",
    title: "รับงานและรีวิว",
    desc: "รับงานสำเร็จและรีวิวเพื่อช่วยฟรีแลนซ์คนอื่นในอนาคต",
    icon: "⭐",
  },
];

export default function HowItWorks() {
  return (
    <section style={{ width: "100%", display: "block", boxSizing: "border-box", background: "white", padding: "4rem 1rem" }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">วิธีการใช้งาน</h2>
          <p className="text-gray-500">เริ่มจ้างงานได้ง่ายๆ ใน 4 ขั้นตอน</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, i) => (
            <div key={s.step} className="relative text-center">
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-1/2 w-full h-0.5 bg-gradient-to-r from-blue-200 to-blue-100 z-0"></div>
              )}

              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg">
                  {s.icon}
                </div>
                <div className="text-xs font-bold text-blue-400 mb-1">{s.step}</div>
                <h3 className="font-bold text-gray-800 mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
            เริ่มใช้งานฟรี
          </button>
          <p className="text-gray-400 text-sm mt-3">ไม่มีค่าธรรมเนียมการสมัคร</p>
        </div>
      </div>
    </section>
  );
}
