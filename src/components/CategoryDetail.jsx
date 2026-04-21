import { featuredFreelancers } from "../data/categories";

function FreelancerCard({ freelancer }) {
  const levelColors = {
    "Pro": "bg-yellow-100 text-yellow-700",
    "Top Rated": "bg-green-100 text-green-700",
    "Rising Star": "bg-purple-100 text-purple-700",
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-lg transition-shadow cursor-pointer group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 ${freelancer.bgColor} rounded-full flex items-center justify-center text-white font-bold text-sm shadow-sm`}>
            {freelancer.avatar}
          </div>
          <div>
            <h4 className="font-bold text-gray-800 text-sm group-hover:text-blue-700 transition-colors">
              {freelancer.name}
            </h4>
            <p className="text-gray-500 text-xs">{freelancer.title}</p>
          </div>
        </div>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${levelColors[freelancer.level] || "bg-gray-100 text-gray-600"}`}>
          {freelancer.level}
        </span>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {freelancer.tags.map((tag) => (
          <span key={tag} className="text-xs bg-blue-50 text-blue-600 px-2.5 py-0.5 rounded-full">
            {tag}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-50">
        <div className="flex items-center gap-1">
          <span className="text-yellow-400 text-sm">★</span>
          <span className="font-bold text-gray-700 text-sm">{freelancer.rating}</span>
          <span className="text-gray-400 text-xs">({freelancer.reviews})</span>
        </div>
        <div className="text-right">
          <span className="text-xs text-gray-400">เริ่มต้น</span>
          <div className="font-bold text-blue-700 text-sm">฿{freelancer.price.toLocaleString()}</div>
        </div>
      </div>
    </div>
  );
}

export default function CategoryDetail({ category, onBack }) {
  const relevantFreelancers = featuredFreelancers.filter(
    (f) => f.category === category.name
  );
  const allFreelancers = relevantFreelancers.length > 0 ? relevantFreelancers : featuredFreelancers;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Category Hero */}
      <div
        className="text-white py-12 px-4 w-full"
        style={{ background: `linear-gradient(135deg, ${category.gradientFrom}, ${category.gradientTo})` }}
      >
        <div className="max-w-7xl mx-auto">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            กลับหน้าหลัก
          </button>
          <div className="flex items-center gap-4">
            <div className="text-5xl">{category.icon}</div>
            <div>
              <h1 className="text-3xl font-bold">{category.name}</h1>
              <p className="text-white/80 mt-1">{category.count.toLocaleString()} บริการพร้อมให้เลือก</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Subcategories */}
        <div className="mb-8">
          <h3 className="font-semibold text-gray-700 mb-3">หมวดย่อย</h3>
          <div className="flex flex-wrap gap-2">
            <button className="bg-blue-600 text-white px-4 py-1.5 rounded-full text-sm font-medium">ทั้งหมด</button>
            {category.subcategories.map((sub) => (
              <button
                key={sub}
                className="bg-white border border-gray-200 hover:border-blue-400 hover:text-blue-600 text-gray-600 px-4 py-1.5 rounded-full text-sm transition-colors"
              >
                {sub}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap gap-3 items-center mb-6">
          <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 bg-white focus:outline-none focus:border-blue-400">
            <option>เรียงตาม: แนะนำ</option>
            <option>ราคาต่ำ - สูง</option>
            <option>ราคาสูง - ต่ำ</option>
            <option>คะแนนสูงสุด</option>
          </select>
          <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 bg-white focus:outline-none focus:border-blue-400">
            <option>ราคา: ทั้งหมด</option>
            <option>ต่ำกว่า ฿500</option>
            <option>฿500 - ฿2,000</option>
            <option>มากกว่า ฿2,000</option>
          </select>
          <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 bg-white focus:outline-none focus:border-blue-400">
            <option>ระดับ: ทั้งหมด</option>
            <option>Pro</option>
            <option>Top Rated</option>
            <option>Rising Star</option>
          </select>
        </div>

        {/* Freelancers Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {allFreelancers.map((f) => (
            <FreelancerCard key={f.id} freelancer={f} />
          ))}
          {/* Placeholder cards */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={`placeholder-${i}`} className="bg-white border border-gray-100 rounded-2xl p-5 animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div>
                  <div className="h-3 bg-gray-200 rounded w-24 mb-2"></div>
                  <div className="h-2.5 bg-gray-100 rounded w-16"></div>
                </div>
              </div>
              <div className="flex gap-1.5 mb-4">
                <div className="h-5 bg-blue-50 rounded-full w-14"></div>
                <div className="h-5 bg-blue-50 rounded-full w-16"></div>
              </div>
              <div className="border-t border-gray-50 pt-3 flex justify-between">
                <div className="h-3 bg-gray-100 rounded w-16"></div>
                <div className="h-3 bg-gray-100 rounded w-12"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
