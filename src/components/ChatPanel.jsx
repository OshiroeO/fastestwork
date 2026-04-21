import { useState, useEffect, useRef } from "react";

const MESSAGES = [
  { id: 1,  from: "customer",   text: "สวัสดีครับ คุณณัฐวุฒิ สนใจจ้างพัฒนาเว็บ e-commerce ครับ ดูโปรไฟล์แล้วประทับใจมากเลย",                                                                 time: "10:28" },
  { id: 2,  from: "freelancer", text: "สวัสดีครับ! ขอบคุณที่ไว้วางใจนะครับ 😊 ช่วยเล่าให้ฟังหน่อยได้เลยว่าต้องการอะไรบ้างครับ?",                                                            time: "10:29" },
  { id: 3,  from: "customer",   text: "ต้องการ e-commerce ขายสินค้า fashion ประมาณ 100 รายการ มี payment gateway และระบบ inventory tracking ครับ",                                             time: "10:31" },
  { id: 4,  from: "freelancer", text: "ครับ scope แบบนี้ผมเคยทำมาหลายโปรเจกต์เลยครับ ใช้ React + Node.js + MongoDB + Omise สำหรับ payment ได้เลยครับ",                                        time: "10:32" },
  { id: 5,  from: "freelancer", text: "มีอะไรพิเศษเพิ่มเติมไหมครับ เช่น loyalty points, discount code หรือ multi-currency?",                                                                   time: "10:33" },
  { id: 6,  from: "customer",   text: "ต้องการ loyalty points และ discount code ด้วยครับ แล้วก็ admin dashboard สำหรับจัดการสินค้า",                                                          time: "10:35" },
  { id: 7,  from: "freelancer", text: "ครับ ทุกอย่างทำได้หมดเลยครับ Admin dashboard จะมี: จัดการสินค้า, คำสั่งซื้อ, ลูกค้า, รายงานยอดขาย และระบบ loyalty/discount ครับ",                    time: "10:36" },
  { id: 8,  from: "customer",   text: "timeline และราคาเท่าไหร่ครับ?",                                                                                                                         time: "10:38" },
  { id: 9,  from: "freelancer", text: "สำหรับ scope นี้แนะนำ Standard Package ที่ ฿15,000 ครับ ใช้เวลา 3 สัปดาห์ รวม: frontend + backend + admin + loyalty + payment integration ครับ",     time: "10:39" },
  { id: 10, from: "freelancer", text: "ถ้าต้องการ CI/CD pipeline + AWS deployment พร้อม support 3 เดือน เป็น ฿35,000 ครับ แนะนำถ้าคิดจะ scale ในอนาคตนะครับ 😊",                            time: "10:40" },
  { id: 11, from: "customer",   text: "ขอดู portfolio ที่เคยทำ e-commerce มาก่อนได้ไหมครับ?",                                                                                                 time: "10:42" },
  { id: 12, from: "freelancer", text: "ได้เลยครับ! 👉 github.com/nathawut-projects — มี 3 โปรเจกต์ e-commerce จริงให้ดู ถ้าสนใจนัด call คุยรายละเอียดได้เลยนะครับ 🙏",                       time: "10:43" },
];

export default function ChatPanel({ freelancer, onClose }) {
  const [visibleCount, setVisibleCount] = useState(0);
  const [inputText, setInputText] = useState("");
  const [extraMessages, setExtraMessages] = useState([]);
  const bottomRef = useRef(null);

  // Stagger messages on open
  useEffect(() => {
    if (visibleCount < MESSAGES.length) {
      const delay = visibleCount === 0 ? 200 : 180;
      const t = setTimeout(() => setVisibleCount(v => v + 1), delay);
      return () => clearTimeout(t);
    }
  }, [visibleCount]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [visibleCount, extraMessages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    setExtraMessages(prev => [...prev, {
      id: Date.now(),
      from: "customer",
      text: inputText.trim(),
      time: new Date().toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }),
    }]);
    setInputText("");
  };

  const allMessages = [...MESSAGES.slice(0, visibleCount), ...extraMessages];

  return (
    <div className="fixed inset-0 z-50 flex justify-end" style={{ background: "rgba(0,0,0,0.4)" }} onClick={onClose}>
      <div
        className="w-full sm:w-96 bg-white flex flex-col h-full shadow-2xl"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: "100vw" }}
      >
        {/* Header */}
        <div className="bg-blue-700 px-4 py-3 flex items-center gap-3 flex-shrink-0">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
            style={{ backgroundColor: freelancer.color ?? "#3b82f6" }}>
            {freelancer.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-semibold text-sm truncate">{freelancer.name}</p>
            <p className="text-blue-200 text-xs flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block" />
              ออนไลน์
            </p>
          </div>
          <button onClick={onClose} className="text-blue-200 hover:text-white text-lg leading-none flex-shrink-0">✕</button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50">
          {allMessages.map(msg => {
            const isCustomer = msg.from === "customer";
            return (
              <div key={msg.id} className={`flex ${isCustomer ? "justify-end" : "justify-start"} items-end gap-2`}>
                {!isCustomer && (
                  <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0 mb-0.5">
                    {freelancer.avatar}
                  </div>
                )}
                <div className={`max-w-[75%] group`}>
                  <div className={`px-3.5 py-2 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    isCustomer
                      ? "bg-blue-600 text-white rounded-br-sm"
                      : "bg-white text-gray-700 rounded-bl-sm border border-gray-100"
                  }`}>
                    {msg.text}
                  </div>
                  <p className={`text-xs text-gray-400 mt-0.5 ${isCustomer ? "text-right" : "text-left"}`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            );
          })}

          {visibleCount < MESSAGES.length && (
            <div className="flex justify-start items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-xs">
                {freelancer.avatar}
              </div>
              <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-sm px-4 py-2 shadow-sm">
                <div className="flex gap-1 items-center">
                  {[0, 1, 2].map(i => (
                    <span key={i} className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: `${i * 150}ms` }} />
                  ))}
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSend} className="px-3 py-3 bg-white border-t border-gray-100 flex gap-2 flex-shrink-0">
          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="พิมพ์ข้อความ..."
            className="flex-1 px-3.5 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 text-white disabled:text-gray-400 px-4 py-2 rounded-xl text-sm font-semibold transition-colors flex-shrink-0"
          >
            ส่ง
          </button>
        </form>
      </div>
    </div>
  );
}
