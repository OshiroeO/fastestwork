const NAV_ITEMS = [
  { id: "post-job", label: "📋 ลงประกาศงาน" },
  { id: "my-jobs",  label: "💼 งานของฉัน" },
  { id: "income",   label: "💰 รายได้" },
  { id: "profile",  label: "👤 โปรไฟล์" },
];

export default function FreelancerBar({ activePage, onPageChange }) {
  return (
    <div style={{ width: "100%", background: "#1e40af", borderBottom: "1px solid #1d4ed8" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-1 py-1.5 overflow-x-auto">
          <div className="flex items-center gap-1.5 mr-3 flex-shrink-0">
            <div className="w-6 h-6 rounded-full bg-blue-300 flex items-center justify-center text-blue-900 font-bold text-xs">NT</div>
            <span className="text-blue-200 text-xs font-medium hidden sm:inline">ณัฐวุฒิ แสงทอง</span>
            <span className="text-blue-400 text-xs hidden sm:inline">·</span>
            <span className="text-green-300 text-xs hidden sm:inline">● ออนไลน์</span>
          </div>
          <div className="w-px h-5 bg-blue-600 flex-shrink-0 mr-1" />
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => onPageChange(item.id)}
              className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors flex-shrink-0 ${
                activePage === item.id
                  ? "bg-white text-blue-700 font-semibold"
                  : "text-blue-200 hover:text-white hover:bg-blue-600"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
