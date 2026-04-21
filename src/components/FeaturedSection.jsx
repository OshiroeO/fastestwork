import { featuredFreelancers } from "../data/categories";

const levelColors = {
  Pro:          "bg-yellow-100 text-yellow-700",
  "Top Rated":  "bg-green-100 text-green-700",
  "Rising Star":"bg-purple-100 text-purple-700",
  "New":        "bg-blue-100 text-blue-600",
};

function FreelancerCard({ freelancer, isNew, hasPostedJob, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border overflow-hidden hover:shadow-xl transition-all duration-200 cursor-pointer group hover:-translate-y-1 ${
        hasPostedJob ? "border-blue-300 ring-2 ring-blue-200" :
        isNew ? "border-green-200 ring-2 ring-green-200" : "border-gray-100"
      }`}
    >
      {/* Badge ribbons */}
      {hasPostedJob && (
        <div className="bg-blue-600 text-white text-xs font-bold text-center py-1 tracking-wide">
          📋 มีบริการใหม่ — คลิกเพื่อดูรายละเอียด
        </div>
      )}
      {isNew && !hasPostedJob && (
        <div className="bg-green-500 text-white text-xs font-bold text-center py-1 tracking-wide">
          ✓ สมาชิกใหม่ — ผ่านการตรวจสอบ AI แล้ว
        </div>
      )}

      {/* Header bar */}
      <div className="h-20" style={{
        background: `linear-gradient(135deg, ${freelancer.headerColor}, ${freelancer.avatarColor})`,
      }} />

      <div className="px-5 pb-5 -mt-7">
        {/* Avatar */}
        <div className="w-14 h-14 rounded-full border-4 border-white flex items-center justify-center text-white font-bold text-sm shadow-md mb-3"
          style={{ backgroundColor: freelancer.avatarColor }}>
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
            {isNew ? "✓ Verified" : freelancer.level}
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
            <span className="font-bold text-gray-700 text-sm">
              {freelancer.rating ?? "ใหม่"}
            </span>
            {freelancer.reviews > 0 && (
              <span className="text-gray-400 text-xs">({freelancer.reviews})</span>
            )}
          </div>
          <div className="text-right">
            {freelancer.price ? (
              <>
                <p className="text-xs text-gray-400">เริ่มต้น</p>
                <p className="font-bold text-blue-700 text-sm">฿{freelancer.price.toLocaleString()}</p>
              </>
            ) : (
              <span className="text-xs text-blue-500 font-medium">เพิ่งเข้าร่วม</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FeaturedSection({ newFreelancers = [], postedJob, onFreelancerClick }) {
  return (
    <section style={{ width: "100%", display: "block", boxSizing: "border-box", background: "linear-gradient(to bottom, #ffffff, #eff6ff)", padding: "4rem 1rem" }}>
      <div className="max-w-7xl mx-auto">

        {/* New members banner */}
        {newFreelancers.length > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-2xl px-5 py-4 mb-8 flex items-center gap-3">
            <span className="text-2xl">🎉</span>
            <div>
              <p className="font-bold text-green-700 text-sm">มีฟรีแลนซ์ใหม่เข้าร่วม {newFreelancers.length} คน!</p>
              <p className="text-green-600 text-xs mt-0.5">ผ่านการตรวจสอบ AI Anti-Fraud เรียบร้อยแล้ว</p>
            </div>
          </div>
        )}

        {/* Posted job banner */}
        {postedJob && (
          <div className="bg-blue-50 border border-blue-200 rounded-2xl px-5 py-4 mb-8 flex items-center gap-3">
            <span className="text-2xl">📋</span>
            <div>
              <p className="font-bold text-blue-700 text-sm">ณัฐวุฒิ แสงทอง เพิ่งลงประกาศบริการใหม่!</p>
              <p className="text-blue-600 text-xs mt-0.5">กดที่การ์ดฟรีแลนซ์เพื่อดูรายละเอียดและว่าจ้าง</p>
            </div>
          </div>
        )}

        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">ฟรีแลนซ์แนะนำ</h2>
          <p className="text-gray-500">ฟรีแลนซ์ที่ได้รับการรับรองคุณภาพและมีผลงานยอดเยี่ยม</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {newFreelancers.map((f) => (
            <FreelancerCard key={f.id} freelancer={f} isNew onClick={() => onFreelancerClick?.(f)} />
          ))}
          {featuredFreelancers.map((f) => (
            <FreelancerCard
              key={f.id}
              freelancer={f}
              hasPostedJob={postedJob && f.id === 1}
              onClick={() => onFreelancerClick?.(f)}
            />
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
