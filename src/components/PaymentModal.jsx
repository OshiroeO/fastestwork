import { useState, useEffect } from "react";

// ─── Mock QR Code (SVG) ───────────────────────────────────────────────────────

function MockQRCode({ size = 168 }) {
  const n = 21;
  const c = size / n;

  const isDark = (x, y) => {
    // Finder pattern helper (square-within-square at corner)
    const finder = (cx, cy) => {
      const dx = Math.abs(x - cx), dy = Math.abs(y - cy);
      return dx <= 3 && dy <= 3 && (dx === 3 || dy === 3 || (dx <= 1 && dy <= 1));
    };
    if (finder(3, 3) || finder(17, 3) || finder(3, 17)) return true;

    // Separator lines (white zones around finders)
    if (y === 7 && x <= 7) return false;
    if (y === 7 && x >= 14) return false;
    if (x === 7 && y <= 7) return false;
    if (x === 7 && y >= 14) return false;

    // Timing patterns (alternating row/col 6)
    if (y === 6 && x >= 8 && x <= 12) return x % 2 === 0;
    if (x === 6 && y >= 8 && y <= 12) return y % 2 === 0;

    // Alignment pattern (bottom-right quadrant)
    if (x >= 14 && x <= 18 && y >= 14 && y <= 18) {
      const dx = Math.abs(x - 16), dy = Math.abs(y - 16);
      return dx === 2 || dy === 2 || (dx === 0 && dy === 0);
    }

    // Dark module (always dark)
    if (x === 8 && y === 13) return true;

    // Data area — pseudo-random but visually dense
    const h = (x * 7 + y * 13 + x * y * 3 + x * x + y * y * 2) % 11;
    return h < 4;
  };

  const rects = [];
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++)
      if (isDark(x, y)) rects.push([x, y]);

  return (
    <svg width={size} height={size} style={{ display: "block" }}>
      <rect width={size} height={size} fill="white" />
      {rects.map(([x, y]) => (
        <rect
          key={`${x}-${y}`}
          x={x * c + 0.5} y={y * c + 0.5}
          width={c - 1} height={c - 1}
          fill="#111827" rx="1"
        />
      ))}
    </svg>
  );
}

// ─── Credit Card Visual ───────────────────────────────────────────────────────

function CardVisual({ number, name, expiry }) {
  const masked = number.replace(/\s/g, "").padEnd(16, "·");
  const groups = [masked.slice(0,4), masked.slice(4,8), masked.slice(8,12), masked.slice(12,16)];

  return (
    <div
      className="relative rounded-2xl px-5 py-4 text-white overflow-hidden select-none"
      style={{ background: "linear-gradient(135deg, #1e3a8a 0%, #3730a3 55%, #4f46e5 100%)", minHeight: 128 }}
    >
      {/* Decorative circles */}
      <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full bg-white/10" />
      <div className="absolute -bottom-8 -left-4 w-24 h-24 rounded-full bg-white/10" />

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-0.5">
            <div className="w-6 h-4 rounded-sm bg-yellow-400 opacity-90" />
            <div className="w-6 h-4 rounded-sm bg-orange-400 opacity-70 -ml-2" />
          </div>
          <span className="text-blue-200 text-xs font-bold tracking-widest">VISA</span>
        </div>

        <p className="font-mono font-bold text-lg tracking-widest mb-3">
          {groups.join(" ")}
        </p>

        <div className="flex justify-between items-end">
          <div>
            <p className="text-blue-300 text-[10px] uppercase tracking-wider mb-0.5">ชื่อผู้ถือบัตร</p>
            <p className="font-semibold text-sm tracking-wider truncate max-w-[140px]">
              {name || "CARDHOLDER NAME"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-blue-300 text-[10px] uppercase tracking-wider mb-0.5">หมดอายุ</p>
            <p className="font-semibold text-sm font-mono">{expiry || "MM/YY"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main PaymentModal ────────────────────────────────────────────────────────

const MOCK_CARD = {
  number: "4532 1234 5678 9012",
  name: "SOMCHAI THONGDEE",
  expiry: "12/27",
  cvv: "123",
};

export default function PaymentModal({ amount, packageName, freelancerName, onClose, onSuccess }) {
  const [method, setMethod]   = useState("qr");        // "qr" | "card"
  const [step, setStep]       = useState("pay");        // "pay" | "processing" | "done"
  const [card, setCard]       = useState(MOCK_CARD);
  const [timeLeft, setTimeLeft] = useState(10 * 60);   // 10-min countdown

  // QR countdown
  useEffect(() => {
    if (method !== "qr" || step !== "pay") return;
    const t = setInterval(() => setTimeLeft(v => Math.max(0, v - 1)), 1000);
    return () => clearInterval(t);
  }, [method, step]);

  const fmt = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const fmtCard = (raw) => {
    const digits = raw.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const fmtExpiry = (raw) => {
    const digits = raw.replace(/\D/g, "").slice(0, 4);
    return digits.length > 2 ? digits.slice(0, 2) + "/" + digits.slice(2) : digits;
  };

  const handlePay = () => {
    setStep("processing");
    setTimeout(() => setStep("done"), 2200);
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.65)", zIndex: 200 }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full overflow-hidden flex flex-col"
        style={{ maxWidth: 420, maxHeight: "95vh" }}
        onClick={e => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div
          className="flex-shrink-0 px-5 py-4 flex items-center justify-between"
          style={{ background: "linear-gradient(135deg, #1e40af, #4338ca)" }}
        >
          <div>
            <p className="text-blue-200 text-xs">ชำระเงินสำหรับ</p>
            <p className="text-white font-bold text-sm">{packageName} · {freelancerName}</p>
          </div>
          <div className="text-right">
            <p className="text-blue-200 text-xs">ยอดชำระ</p>
            <p className="text-white font-black text-xl">฿{amount}</p>
          </div>
        </div>

        {/* ── Processing ── */}
        {step === "processing" && (
          <div className="flex-1 py-14 flex flex-col items-center justify-center px-6 text-center">
            <div className="w-16 h-16 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin mb-5" />
            <p className="font-bold text-gray-700 text-lg">กำลังประมวลผล...</p>
            <p className="text-gray-400 text-sm mt-1">กำลังตรวจสอบการชำระเงิน กรุณารอสักครู่</p>
          </div>
        )}

        {/* ── Done ── */}
        {step === "done" && (
          <div className="flex-1 overflow-y-auto py-8 px-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-black text-gray-800 mb-1">ชำระเงินสำเร็จ!</h3>
            <p className="text-green-600 font-black text-2xl mb-5">฿{amount}</p>

            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm text-left space-y-2 mb-5">
              {[
                ["แพ็กเกจ",   packageName],
                ["ฟรีแลนซ์",  freelancerName],
                ["วิธีชำระ",  method === "qr" ? "PromptPay / QR Code" : "บัตรเครดิต VISA"],
                ["สถานะ",     "✓ สำเร็จ"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-gray-400">{k}</span>
                  <span className={`font-semibold ${k === "สถานะ" ? "text-green-600" : "text-gray-700"}`}>{v}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => { onSuccess(); onClose(); }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-colors shadow-md"
            >
              🚀 เริ่มโปรเจกต์
            </button>
          </div>
        )}

        {/* ── Pay step ── */}
        {step === "pay" && (
          <>
            {/* Method tabs */}
            <div className="flex flex-shrink-0 border-b border-gray-100">
              {[
                { id: "qr",   label: "📱 สแกน QR Code" },
                { id: "card", label: "💳 บัตรเครดิต" },
              ].map(m => (
                <button
                  key={m.id}
                  onClick={() => setMethod(m.id)}
                  className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                    method === m.id
                      ? "text-blue-700 border-b-2 border-blue-600"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">

              {/* ── QR Code tab ── */}
              {method === "qr" && (
                <>
                  <p className="text-center text-gray-500 text-sm">
                    สแกน QR Code ด้วยแอปธนาคารหรือแอป PromptPay
                  </p>

                  {/* QR frame */}
                  <div className="flex justify-center">
                    <div className="p-3 border-2 border-gray-200 rounded-2xl shadow-sm bg-white inline-block">
                      <MockQRCode size={168} />
                    </div>
                  </div>

                  {/* Bank info */}
                  <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-center">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <span className="text-lg">🏦</span>
                      <span className="text-blue-700 font-bold text-sm">PromptPay · ณัฐวุฒิ แสงทอง</span>
                    </div>
                    <p className="text-blue-400 text-xs">หมายเลข: 089-123-4567</p>
                    <p className="text-blue-800 font-black text-xl mt-1">฿{amount}</p>
                  </div>

                  {/* Countdown */}
                  <div className={`flex items-center justify-center gap-1.5 text-sm font-medium ${
                    timeLeft < 60 ? "text-red-500" : "text-gray-500"
                  }`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    QR Code หมดอายุใน{" "}
                    <span className={`font-mono font-black ${timeLeft < 60 ? "text-red-600" : "text-gray-700"}`}>
                      {fmt(timeLeft)}
                    </span>
                  </div>

                  <button
                    onClick={handlePay}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
                  >
                    <span className="text-lg">✅</span> ฉันชำระเงินแล้ว
                  </button>
                </>
              )}

              {/* ── Credit card tab ── */}
              {method === "card" && (
                <>
                  <CardVisual number={card.number} name={card.name} expiry={card.expiry} />

                  <div className="space-y-3">
                    {/* Card number */}
                    <div>
                      <label className="text-xs font-semibold text-gray-500 mb-1 block">หมายเลขบัตร</label>
                      <input
                        type="text"
                        value={card.number}
                        onChange={e => setCard(c => ({ ...c, number: fmtCard(e.target.value) }))}
                        placeholder="XXXX XXXX XXXX XXXX"
                        maxLength={19}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-300 tracking-widest"
                      />
                    </div>

                    {/* Cardholder */}
                    <div>
                      <label className="text-xs font-semibold text-gray-500 mb-1 block">ชื่อผู้ถือบัตร</label>
                      <input
                        type="text"
                        value={card.name}
                        onChange={e => setCard(c => ({ ...c, name: e.target.value.toUpperCase() }))}
                        placeholder="NAME ON CARD"
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-300 tracking-wider"
                      />
                    </div>

                    {/* Expiry + CVV */}
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-semibold text-gray-500 mb-1 block">วันหมดอายุ</label>
                        <input
                          type="text"
                          value={card.expiry}
                          onChange={e => setCard(c => ({ ...c, expiry: fmtExpiry(e.target.value) }))}
                          placeholder="MM/YY"
                          maxLength={5}
                          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-300 tracking-widest text-center"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-gray-500 mb-1 block">CVV</label>
                        <input
                          type="text"
                          value={card.cvv}
                          onChange={e => setCard(c => ({ ...c, cvv: e.target.value.replace(/\D/g, "").slice(0, 3) }))}
                          placeholder="123"
                          maxLength={3}
                          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-300 tracking-widest text-center"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handlePay}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
                  >
                    <span className="text-lg">💳</span> ยืนยันการชำระเงิน ฿{amount}
                  </button>
                </>
              )}

              {/* Security note */}
              <p className="text-center text-gray-400 text-xs flex items-center justify-center gap-1">
                <span>🔒</span> ชำระเงินผ่านระบบที่ปลอดภัย SSL 256-bit
              </p>
            </div>

            {/* Cancel */}
            <div className="flex-shrink-0 px-5 pb-4">
              <button
                onClick={onClose}
                className="w-full text-gray-400 hover:text-gray-600 text-sm py-2 transition-colors"
              >
                ยกเลิก
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
