import { useState, useEffect } from "react";
import { Search, Plus, TrendingUp, Clock, ChevronLeft, ChevronRight, Megaphone, Users, Calendar } from "lucide-react";

interface WelcomeBannerProps {
  onCreateJob?: () => void;
  onSearchTalent?: () => void;
}

const SERVICE_MESSAGES = [
  {
    id: 1,
    title: "Search Challenge #8",
    text: "บ่ายวันพุธนี้! Live สาธิตค้นหา System Analyst แบบ Step-by-Step จองที่นั่งฟรีได้เลย",
    date: "วันพุธ 1 เม.ย. 14:00 น.",
    accent: "#127EE3",
    accentBg: "#EBF5FF",
    dotColor: "bg-[#127EE3]",
  },
  {
    id: 2,
    title: "Tips ประจำสัปดาห์",
    text: "รู้ไหมว่า? การส่ง Email จีบพร้อม Personalized Message เพิ่ม Response Rate ได้ถึง 3x เทียบกับ Cold Message",
    date: "20 เม.ย. 2568",
    accent: "#d97706",
    accentBg: "#FFFBEB",
    dotColor: "bg-amber-500",
  },
  {
    id: 3,
    title: "Feature ใหม่: AI Top Picks",
    text: "ตอนนี้ Top Picks ของคุณใช้ AI คัดเลือกผู้สมัครที่เหมาะสมกับ JD ให้อัตโนมัติ ลองดูได้เลยในหน้า Top Picks!",
    date: "18 เม.ย. 2568",
    accent: "#059669",
    accentBg: "#ECFDF5",
    dotColor: "bg-emerald-600",
  },
];

const QUICK_STATS = [
  { icon: TrendingUp, label: "ผู้สมัครใหม่", value: "45", unit: "ราย", color: "text-[#127EE3]", bg: "bg-[#EBF5FF]" },
];

export default function WelcomeBanner({ onCreateJob, onSearchTalent }: WelcomeBannerProps) {
  const [msgIdx, setMsgIdx] = useState(0);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      goNext();
    }, 6000);
    return () => clearInterval(timer);
  }, [msgIdx]);

  const goNext = () => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setMsgIdx((i) => (i + 1) % SERVICE_MESSAGES.length);
      setAnimating(false);
    }, 200);
  };

  const goPrev = () => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setMsgIdx((i) => (i - 1 + SERVICE_MESSAGES.length) % SERVICE_MESSAGES.length);
      setAnimating(false);
    }, 200);
  };

  const msg = SERVICE_MESSAGES[msgIdx];

  return (
    <div className="flex flex-col gap-5">
      {/* Top row: greeting + CTA buttons */}
      <div className="flex items-start justify-between gap-6">
        <div className="flex flex-col gap-1">
          <p className="text-[12.5px] text-gray-400 font-medium tracking-wide">
            วันอาทิตย์, 20 เมษายน 2568
          </p>
          <h1 className="text-[28px] font-semibold text-[#0F1724] leading-tight tracking-tight">
            สวัสดี, คุณอลิสา
          </h1>
          <p className="text-[14px] text-gray-500 mt-0.5">
            วันนี้มีสัมภาษณ์ 3 คน
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-shrink-0 pt-1">
          <button
            onClick={onCreateJob}
            className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-gray-600 hover:border-[#127EE3] hover:text-[#127EE3] text-[13.5px] font-medium rounded-xl transition-all bg-white"
          >
            <Plus className="w-4 h-4" />
            สร้างประกาศงาน
          </button>
          <button
            onClick={onSearchTalent}
            className="flex items-center gap-2 px-4 py-2.5 text-white text-[13.5px] font-semibold rounded-xl transition-all shadow-md shadow-[#127EE3]/20 hover:shadow-[#127EE3]/35 hover:opacity-95"
            style={{ background: "linear-gradient(135deg, #01BFF9 0%, #019EFC 100%)" }}
          >
            <Search className="w-4 h-4" />
            ค้นหา Talent
          </button>
        </div>
      </div>

      {/* Service message ticker */}
      <div
        className="relative bg-white border border-gray-100 rounded-xl px-5 py-3.5 overflow-hidden transition-opacity duration-200"
        style={{ opacity: animating ? 0 : 1 }}
      >
        {/* Left accent bar */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1 rounded-l-xl"
          style={{ backgroundColor: msg.accent }}
        />

        <div className="flex items-center gap-4 pl-2">
          {/* Icon */}
          <div
            className="flex-shrink-0 w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: msg.accentBg }}
          >
            <Megaphone className="w-4 h-4" style={{ color: msg.accent }} />
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[12px] font-semibold" style={{ color: msg.accent }}>
                {msg.title}
              </span>
              <span className="text-[11px] text-gray-400">{msg.date}</span>
            </div>
            <p className="text-[13px] text-gray-600 leading-snug line-clamp-1">{msg.text}</p>
          </div>

          {/* Navigation */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="flex items-center gap-1.5 mr-1">
              {SERVICE_MESSAGES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setMsgIdx(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === msgIdx ? "w-5" : "w-1.5 bg-gray-200"
                  }`}
                  style={i === msgIdx ? { backgroundColor: msg.accent } : {}}
                />
              ))}
            </div>
            <button
              onClick={goPrev}
              className="w-7 h-7 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors border border-gray-100"
            >
              <ChevronLeft className="w-3.5 h-3.5 text-gray-500" />
            </button>
            <button
              onClick={goNext}
              className="w-7 h-7 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-colors border border-gray-100"
            >
              <ChevronRight className="w-3.5 h-3.5 text-gray-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
