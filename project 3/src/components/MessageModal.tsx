import { useState } from "react";
import { X, Send, ChevronDown, Sparkles, Building2, Star } from "lucide-react";

interface MessageModalProps {
  candidateTitle: string;
  candidateCompany: string;
  candidateExp: string;
  onClose: () => void;
}

interface DreamCompany {
  name: string;
  logo: string;
  color: string;
  scores: { label: string; value: number }[];
}

interface DreamCompanyData extends DreamCompany {
  tagline: string;
}

const dreamCompanies: DreamCompanyData[] = [
  {
    name: "TechVibe Co., Ltd.",
    logo: "TV",
    color: "from-[#0DC2FF] to-[#127EE3]",
    tagline: "ที่นี่ชีวิตดี งานท้าทาย และทีมที่แข็งแกร่ง — คนที่นี่บอกว่าอยากแนะนำให้คนที่รัก",
    scores: [
      { label: "ชีวิตดี", value: 4.3 },
      { label: "งานดี", value: 4.2 },
      { label: "เงินดี", value: 3.2 },
      { label: "สังคมดี", value: 3.9 },
    ],
  },
  {
    name: "LINE MAN Wongnai",
    logo: "LM",
    color: "from-emerald-500 to-teal-500",
    tagline: "สเกลใหญ่ระดับภูมิภาค วัฒนธรรมเปิด และคนที่นี่รักงานตัวเองอย่างแท้จริง",
    scores: [
      { label: "ชีวิตดี", value: 4.5 },
      { label: "งานดี", value: 4.4 },
      { label: "เงินดี", value: 4.1 },
      { label: "สังคมดี", value: 4.3 },
    ],
  },
  {
    name: "Agoda",
    logo: "AG",
    color: "from-red-500 to-rose-500",
    tagline: "งานระดับโลก เพื่อนร่วมงานเก่งมาก และผลตอบแทนที่แข่งขันได้กับบริษัทชั้นนำทั่วโลก",
    scores: [
      { label: "ชีวิตดี", value: 4.2 },
      { label: "งานดี", value: 4.5 },
      { label: "เงินดี", value: 4.4 },
      { label: "สังคมดี", value: 4.0 },
    ],
  },
  {
    name: "SCB TechX",
    logo: "SX",
    color: "from-sky-500 to-blue-600",
    tagline: "สตาร์ทอัพที่ได้แบ็กของธนาคารใหญ่ — impact จริง ทีม tech แน่น และโตเร็วกว่าที่คิด",
    scores: [
      { label: "ชีวิตดี", value: 3.9 },
      { label: "งานดี", value: 4.1 },
      { label: "เงินดี", value: 4.3 },
      { label: "สังคมดี", value: 3.8 },
    ],
  },
  {
    name: "Bitkub Online",
    logo: "BK",
    color: "from-amber-500 to-orange-500",
    tagline: "Crypto ที่โตเร็วที่สุดในไทย ค่าตอบแทนดีเยี่ยม และคุณจะได้สัมผัส fintech ระดับแนวหน้า",
    scores: [
      { label: "ชีวิตดี", value: 3.8 },
      { label: "งานดี", value: 4.0 },
      { label: "เงินดี", value: 4.6 },
      { label: "สังคมดี", value: 3.7 },
    ],
  },
];

function generatePersonalizedMessage(
  company: string,
  tagline: string,
  title: string,
  exp: string,
  why: string
): string {
  return `เรียน ผู้สมัครที่สนใจ

ทาง ${company} มีความยินดีที่ได้พบโปรไฟล์ของคุณบนระบบ และรู้สึกสนใจเป็นอย่างมาก

"${tagline}"

เราเป็นบริษัทด้าน [Product / Tech] ที่กำลังขยายทีม Design อย่างจริงจัง และกำลังมองหา ${title} ที่มีประสบการณ์ตรงและความสามารถที่โดดเด่น

สิ่งที่ทำให้เราสนใจโปรไฟล์ของคุณเป็นพิเศษ:
${why}

เราเชื่อว่าด้วยประสบการณ์ ${exp} ของคุณ จะเป็นประโยชน์อย่างมากต่อทิศทางของ product ที่เรากำลังพัฒนาอยู่

หากคุณสนใจ ยินดีนัดคุยเบื้องต้นแบบ informal เพื่อแนะนำทีมและ product direction ของเราให้ฟังก่อนได้เลย โดยไม่มีข้อผูกมัดใดๆ

รอฟังจากคุณด้วยความยินดี

คุณสมใจ รักษ์ดี
Head of People & Talent
${company}`;
}

function ScoreBar({ label, value }: { label: string; value: number }) {
  const pct = (value / 5) * 100;
  return (
    <div className="flex items-center gap-2">
      <span className="text-[12px] text-gray-600 w-14 flex-shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-[#0DC2FF]"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-[12px] font-bold text-[#0DC2FF] w-6 text-right flex-shrink-0">{value}</span>
    </div>
  );
}

export default function MessageModal({ candidateTitle, candidateCompany, candidateExp, onClose }: MessageModalProps) {
  const [selectedCompany, setSelectedCompany] = useState<DreamCompanyData>(dreamCompanies[0]);
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [subject, setSubject] = useState(`สนใจพูดคุยเรื่องโอกาส — ${candidateTitle}`);
  const [whyInterested, setWhyInterested] = useState(
    `• ประสบการณ์ ${candidateExp} ด้าน product design ตรงกับที่เราต้องการพอดี\n• Background ${candidateCompany} บ่งบอกถึง product quality ที่สูง\n• Portfolio และ skill set เข้ากับ design direction ของทีมเราเป็นอย่างมาก`
  );

  const fullMessage = generatePersonalizedMessage(
    selectedCompany.name,
    selectedCompany.tagline,
    candidateTitle,
    candidateExp,
    whyInterested
  );

  const [sent, setSent] = useState(false);

  const handleSend = () => {
    setSent(true);
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  if (sent) {
    return (
      <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-200 flex items-center justify-center mx-auto mb-4">
            <Send className="w-7 h-7 text-emerald-500" />
          </div>
          <h3 className="text-[18px] font-bold text-[#1A1A2E] mb-2">ส่งข้อความเรียบร้อยแล้ว</h3>
          <p className="text-[13px] text-gray-500 leading-relaxed">ระบบจะแจ้งเตือนคุณเมื่อผู้สมัครตอบรับหรือเปิดข้อความ</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0DC2FF]/10 flex items-center justify-center">
              <Send className="w-4 h-4 text-[#0DC2FF]" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-[#1A1A2E]">ส่งข้อความสนใจ</h3>
              <p className="text-[12px] text-gray-400">ผ่านระบบ — ไม่เปิดเผยตัวตนจนกว่าผู้สมัครจะตอบรับ</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* From — Dream Company selector */}
          <div>
            <label className="block text-[12px] font-bold text-[#1A1A2E] mb-2 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-gray-400" />
              ส่งในนามบริษัท
            </label>
            <div className="relative">
              <button
                onClick={() => setShowCompanyDropdown(!showCompanyDropdown)}
                className="w-full flex items-center justify-between gap-2 px-4 py-3 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors text-left"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  {/* Logo */}
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${selectedCompany.color} flex items-center justify-center text-white text-[11px] font-black flex-shrink-0 shadow-sm`}>
                    {selectedCompany.logo}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-[14px] font-semibold text-[#1A1A2E]">{selectedCompany.name}</p>
                      <div className="flex items-center gap-0.5">
                        <Star className="w-2.5 h-2.5 text-rose-400 fill-rose-400" />
                        <Star className="w-2.5 h-2.5 text-rose-400 fill-rose-400" />
                        <Star className="w-2.5 h-2.5 text-rose-400 fill-rose-400" />
                        <span className="text-[10px] text-rose-500 font-semibold ml-0.5">Dream Company</span>
                      </div>
                    </div>
                    {/* Score bars inline */}
                    <div className="mt-1.5 grid grid-cols-2 gap-x-4 gap-y-1">
                      {selectedCompany.scores.map((s) => (
                        <ScoreBar key={s.label} label={s.label} value={s.value} />
                      ))}
                    </div>
                  </div>
                </div>
                <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${showCompanyDropdown ? "rotate-180" : ""}`} />
              </button>

              {showCompanyDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-gray-200 shadow-lg z-10 overflow-hidden">
                  {dreamCompanies.map((company) => (
                    <button
                      key={company.name}
                      onClick={() => { setSelectedCompany(company); setShowCompanyDropdown(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${selectedCompany.name === company.name ? "bg-[#0DC2FF]/5" : ""}`}
                    >
                      <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${company.color} flex items-center justify-center text-white text-[10px] font-black flex-shrink-0 shadow-sm`}>
                        {company.logo}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-[#1A1A2E]">{company.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          {company.scores.map((s) => (
                            <span key={s.label} className="text-[10px] text-gray-400">
                              {s.label} <span className="font-bold text-[#0DC2FF]">{s.value}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* To */}
          <div>
            <label className="block text-[12px] font-bold text-[#1A1A2E] mb-2">ถึง</label>
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 border border-gray-100">
              <div className="w-8 h-8 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-gray-400" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <div>
                <p className="text-[13px] font-semibold text-[#1A1A2E]">{candidateTitle}</p>
                <p className="text-[11px] text-gray-400">จาก {candidateCompany}  ·  ยังไม่เปิดเผยชื่อ</p>
              </div>
            </div>
          </div>

          {/* Subject */}
          <div>
            <label className="block text-[12px] font-bold text-[#1A1A2E] mb-2">หัวข้อ</label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[14px] text-[#1A1A2E] focus:outline-none focus:border-[#127EE3] transition-colors"
            />
          </div>

          {/* Why interested — editable */}
          <div>
            <label className="block text-[12px] font-bold text-[#1A1A2E] mb-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#0DC2FF]" />
              เหตุผลที่สนใจ (AI ช่วย personalise ให้แล้ว — แก้ได้)
            </label>
            <textarea
              value={whyInterested}
              onChange={(e) => setWhyInterested(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 text-[13px] text-gray-600 leading-relaxed focus:outline-none focus:border-[#127EE3] transition-colors resize-none"
            />
          </div>

          {/* Full message preview with company header */}
          <div>
            <label className="block text-[12px] font-bold text-[#1A1A2E] mb-2">ตัวอย่างข้อความเต็ม</label>
            <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
              {/* Company header in email */}
              <div className="px-5 py-4 bg-white border-b border-gray-100 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${selectedCompany.color} flex items-center justify-center text-white text-[12px] font-black shadow-sm flex-shrink-0`}>
                    {selectedCompany.logo}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[14px] font-bold text-[#1A1A2E]">{selectedCompany.name}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Star className="w-2.5 h-2.5 text-rose-400 fill-rose-400" />
                      <Star className="w-2.5 h-2.5 text-rose-400 fill-rose-400" />
                      <Star className="w-2.5 h-2.5 text-rose-400 fill-rose-400" />
                      <span className="text-[10px] text-rose-500 font-bold ml-0.5">Dream Company — วิเศษสุด</span>
                    </div>
                    <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed italic">"{selectedCompany.tagline}"</p>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <div className="grid grid-cols-2 gap-x-5 gap-y-1">
                    {selectedCompany.scores.map((s) => (
                      <ScoreBar key={s.label} label={s.label} value={s.value} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="px-5 py-5 space-y-3">
                <pre className="text-[12px] text-gray-600 leading-relaxed whitespace-pre-wrap font-sans">
                  {fullMessage}
                </pre>
                {/* CTA buttons inside the email preview */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleSend}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gradient-to-r from-[#0DC2FF] to-[#127EE3] text-white text-[13px] font-bold shadow-sm shadow-[#0DC2FF]/25 hover:shadow-[#0DC2FF]/40 transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    สนใจพูดคุยด้วย
                  </button>
                  <button
                    onClick={onClose}
                    className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold text-gray-500 hover:text-gray-700 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors text-center"
                  >
                    เอาไว้โอกาสหน้า
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy note */}
          <div className="flex items-start gap-2.5 px-3.5 py-3 rounded-xl bg-[#F0F8FF] border border-[#0DC2FF]/20">
            <Sparkles className="w-4 h-4 text-[#127EE3] flex-shrink-0 mt-0.5" />
            <p className="text-[12px] text-[#127EE3] leading-relaxed">
              ข้อความจะส่งผ่านระบบโดยไม่เปิดเผยข้อมูลทั้งสองฝ่าย จนกว่าผู้สมัครจะตอบรับและอนุญาตให้แลกเปลี่ยนข้อมูลติดต่อ
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-2 px-6 py-4 border-t border-gray-100 flex-shrink-0">
          <button
            onClick={handleSend}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-[#0DC2FF] to-[#127EE3] text-white text-[14px] font-bold shadow-md shadow-[#0DC2FF]/25 hover:shadow-[#0DC2FF]/40 transition-all"
          >
            <Send className="w-4 h-4" />
            ส่งข้อความสนใจ
          </button>
          <button
            onClick={onClose}
            className="px-5 py-3 rounded-xl text-[14px] font-semibold text-gray-400 hover:text-gray-600 border border-gray-100 hover:border-gray-200 transition-colors"
          >
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  );
}
