import { featuredFreelancers } from "../data/categories";

const levelColors = {
  Pro: "bg-yellow-100 text-yellow-700",
  "Top Rated": "bg-green-100 text-green-700",
  "Rising Star": "bg-purple-100 text-purple-700",
};

function FreelancerCard({ freelancer }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-200 cursor-pointer group hover:-translate-y-1">
      {/* Header bar */}
      <div
        className="h-20"
        style={{
          background: `linear-gradient(135deg, ${freelancer.headerColor}, ${freelancer.avatarColor})`,
        }}
      />

      <div className="px-5 pb-5 -mt-7">
        {/* Avatar */}
        <div
          className="w-14 h-14 rounded-full border-4 border-white flex items-center justify-center text-white font-bold text-sm shadow-md mb-3"
          style={{ backgroundColor: freelancer.avatarColor }}
        >
          {freelancer.avatar}
        </div>

        <div className="flex items-start justify-between mb-2">
          <div>
            <h4 className="font-bold text-gray-800 text-sm group-hover:text-blue-700 transition-colors leading-tight">
              {freelancer.name}
            </h4>
            <p className="text-gray-500 text-xs mt-0.5">{freelancer.title}</p>
          </div>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full mt-0.5 whitespace-nowrap ml-2 ${levelColors[freelancer.level] || "bg-gray-100 text-gray-600"}`}>
            {freelancer.level}
          </span>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
          {freelancer.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <div className="flex items-center gap-1">
            <span className="text-yellow-400 text-xs">★</span>
            <span className="font-bold text-gray-700 text-sm">{freelancer.rating}</span>
            <span className="text-gray-400 text-xs">({freelancer.reviews})</span>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">เริ่มต้น</p>
            <p className="font-bold text-blue-700 text-sm">฿{freelancer.price.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FeaturedSection() {
  return (
    <section style={{ width: "100%", display: "block", boxSizing: "border-box", background: "linear-gradient(to bottom, #ffffff, #eff6ff)", padding: "4rem 1rem" }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">ฟรีแลนซ์แนะนำ</h2>
          <p className="text-gray-500">ฟรีแลนซ์ที่ได้รับการรับรองคุณภาพและมีผลงานยอดเยี่ยม</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuredFreelancers.map((f) => (
            <FreelancerCard key={f.id} freelancer={f} />
          ))}
        </div>

        <div className="text-center mt-8">
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors shadow-md hover:shadow-lg">
            ดูฟรีแลนซ์ทั้งหมด
          </button>
        </div>
      </div>
    </section>
  );
}
