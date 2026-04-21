import { useState } from "react";

export default function Hero({ onSearch }) {
  const [query, setQuery] = useState("");

  const suggestions = ["โลโก้", "เว็บไซต์", "แปลภาษา", "ตัดต่อวิดีโอ", "SEO"];

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <section style={{ width: "100%", display: "block", boxSizing: "border-box", background: "linear-gradient(to bottom right, #1d4ed8, #2563eb, #4f46e5)", color: "white", padding: "5rem 1rem" }}>
      <div className="max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-blue-500/40 border border-blue-400/50 rounded-full px-4 py-1.5 text-sm mb-6">
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          ฟรีแลนซ์กว่า 10,000 คนพร้อมรับงาน
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
          จ้างงานได้เร็วขึ้น
          <br />
          <span className="text-blue-200">กับ Fastestwork</span>
        </h1>
        <p className="text-blue-100 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
          แพลตฟอร์มเชื่อมต่อระหว่างผู้ว่าจ้างและฟรีแลนซ์คุณภาพสูง
          ครอบคลุมทุกหมวดหมู่งาน
        </p>

        {/* Search box */}
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto mb-6">
          <div className="relative flex-1">
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ค้นหาบริการ เช่น ออกแบบโลโก้, เว็บไซต์..."
              className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-800 text-base focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-lg"
            />
          </div>
          <button
            type="submit"
            className="bg-blue-400 hover:bg-blue-300 text-blue-900 font-bold px-8 py-4 rounded-xl transition-colors shadow-lg whitespace-nowrap"
          >
            ค้นหา
          </button>
        </form>

        {/* Quick suggestions */}
        <div className="flex flex-wrap justify-center gap-2">
          <span className="text-blue-200 text-sm">แนะนำ:</span>
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => onSearch(s)}
              className="text-sm bg-white/10 hover:bg-white/20 border border-white/20 text-white px-3 py-1 rounded-full transition-colors"
            >
              {s}
            </button>
          ))}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto mt-14">
          {[
            { value: "10K+", label: "ฟรีแลนซ์" },
            { value: "50K+", label: "โปรเจกต์สำเร็จ" },
            { value: "4.9★", label: "คะแนนเฉลี่ย" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
              <div className="text-blue-200 text-sm mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
