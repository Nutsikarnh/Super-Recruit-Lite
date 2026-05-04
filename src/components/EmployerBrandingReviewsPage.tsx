import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";

interface CandidateImpression {
  id: string;
  name: string;
  role: string;
  avatar: string;
  text: string;
  appliedAfter: boolean;
  date: string;
  sentiment: "positive" | "very_positive";
}

function AvatarBubble({ initials, color }: { initials: string; color: string }) {
  return (
    <div className={`w-9 h-9 text-[12px] rounded-xl flex items-center justify-center font-bold flex-shrink-0 ${color}`}>
      {initials}
    </div>
  );
}

interface Props {
  impressions: CandidateImpression[];
  onBack: () => void;
}

export default function EmployerBrandingReviewsPage({ impressions, onBack }: Props) {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-[13px] font-semibold text-[#127EE3] hover:text-[#0f6bc7] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          กลับ
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-7 py-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-[18px] font-bold text-[#1A1A2E]">
            ความประทับใจจากผู้สมัครทั้งหมด
          </h2>
          <span className="text-[12px] px-2 py-0.5 rounded-full bg-[#F0F8FF] text-[#127EE3] font-bold">
            {impressions.length}
          </span>
        </div>
        <div className="divide-y divide-gray-50">
          {impressions.map((imp) => (
            <div key={imp.id} className="px-7 py-5">
              <div className="flex items-start gap-4">
                <AvatarBubble
                  initials={imp.avatar}
                  color={imp.sentiment === "very_positive" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[13.5px] font-bold text-[#1A1A2E]">{imp.name}</span>
                      <span className="text-[12px] text-gray-400 ml-2">{imp.role}</span>
                    </div>
                    <span className="text-[11.5px] text-gray-400 flex-shrink-0">{imp.date}</span>
                  </div>
                  <p className="text-[13.5px] text-gray-600 mt-2 leading-relaxed">{imp.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
