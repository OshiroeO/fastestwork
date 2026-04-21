export default function Footer() {
  return (
    <footer style={{ width: "100%", display: "block", boxSizing: "border-box", background: "#1e3a5f", color: "#bfdbfe", padding: "3rem 1rem" }}>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-blue-700 font-black text-sm">FW</span>
              </div>
              <span className="text-white font-bold text-lg">Fastestwork</span>
            </div>
            <p className="text-blue-300 text-sm leading-relaxed">
              แพลตฟอร์มฟรีแลนซ์ที่เชื่อมต่อผู้จ้างงานกับฟรีแลนซ์คุณภาพสูงทั่วประเทศไทย
            </p>
          </div>

          {/* Links */}
          {[
            {
              title: "บริการ",
              links: ["กราฟิกและดีไซน์", "พัฒนาโปรแกรม", "การตลาดดิจิทัล", "เขียนและแปล"],
            },
            {
              title: "บริษัท",
              links: ["เกี่ยวกับเรา", "ข่าวสาร", "ร่วมงานกับเรา", "ติดต่อเรา"],
            },
            {
              title: "ช่วยเหลือ",
              links: ["ศูนย์ช่วยเหลือ", "ข้อกำหนดการใช้", "นโยบายความเป็นส่วนตัว", "ความปลอดภัย"],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-white font-semibold mb-4">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-blue-300 hover:text-white text-sm transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-blue-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-blue-400 text-sm">
            © 2026 Fastestwork. สงวนลิขสิทธิ์ทุกประการ
          </p>
          <div className="flex items-center gap-4">
            <span className="text-blue-400 text-sm">ติดตามเรา:</span>
            {["Facebook", "Instagram", "Twitter"].map((social) => (
              <a key={social} href="#" className="text-blue-300 hover:text-white text-sm transition-colors">
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
