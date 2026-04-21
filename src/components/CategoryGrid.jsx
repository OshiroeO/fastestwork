import { categories } from "../data/categories";

export default function CategoryGrid({ onSelect }) {
  return (
    <section id="categories" style={{ width: "100%", display: "block", boxSizing: "border-box", background: "white", padding: "4rem 1rem" }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">หมวดหมู่บริการ</h2>
          <p className="text-gray-500 text-base max-w-xl mx-auto">
            ค้นหาฟรีแลนซ์ที่ตรงกับความต้องการของคุณจากหมวดหมู่งานที่หลากหลาย
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelect(cat)}
              className="group bg-white border-2 border-gray-100 hover:border-blue-300 rounded-2xl p-5 text-left transition-all duration-200 hover:shadow-lg hover:-translate-y-1"
            >
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mb-4 shadow-sm group-hover:scale-110 transition-transform"
                style={{
                  background: `linear-gradient(135deg, ${cat.gradientFrom}, ${cat.gradientTo})`,
                }}
              >
                {cat.icon}
              </div>

              <h3 className="font-bold text-gray-800 text-sm mb-0.5 group-hover:text-blue-700 transition-colors">
                {cat.name}
              </h3>
              <p className="text-gray-400 text-xs mb-3">{cat.nameEn}</p>

              <div className="flex items-center justify-between">
                <span className="text-xs text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-full">
                  {cat.count.toLocaleString()} บริการ
                </span>
                <svg
                  className="w-4 h-4 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
