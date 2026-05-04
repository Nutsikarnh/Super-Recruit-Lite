import { Star, GraduationCap, ExternalLink, ArrowUpRight, Calendar, Zap, Coins, Mail, Phone, Award, AlertTriangle } from "lucide-react";

interface RightPanelProps {
  onBuyPackage?: () => void;
  onNavigate?: (page: string) => void;
}

const accountTeam = [
  {
    role: "AE",
    roleLabel: "Account Executive",
    name: "ศิริพร วงศ์ทอง",
    email: "siriporn.w@superrecruit.co.th",
    mobile: "081-456-7890",
    initials: "ศว",
    gradient: "linear-gradient(135deg, #127EE3 0%, #0DC2FF 100%)",
  },
  {
    role: "CC",
    roleLabel: "Customer Care",
    name: "ณัฐวุฒิ ชัยประสิทธิ์",
    email: "nattawut.c@superrecruit.co.th",
    mobile: "089-321-6540",
    initials: "ณช",
    gradient: "linear-gradient(135deg, #10b981 0%, #34d399 100%)",
  },
];

function SectionCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-xl border border-gray-100 ${className}`}>
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-4">{children}</p>
  );
}

function AccountTeamSection() {
  return (
    <SectionCard className="p-5">
      <SectionLabel>ทีมดูแลบัญชีของคุณ</SectionLabel>
      <div className="flex flex-col gap-4">
        {accountTeam.map((member, idx) => (
          <div key={member.role}>
            {idx > 0 && <div className="border-t border-gray-50 mb-4" />}
            <div className="flex items-start gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
                style={{ background: member.gradient }}
              >
                <span className="text-white text-[12px] font-bold">{member.initials}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
                    style={{ background: member.gradient }}
                  >
                    {member.role}
                  </span>
                  <span className="text-[11px] text-gray-400">{member.roleLabel}</span>
                </div>
                <p className="text-[13.5px] font-semibold text-[#0F1724] leading-snug mb-1.5">{member.name}</p>
                <a
                  href={`mailto:${member.email}`}
                  className="flex items-center gap-1.5 text-[11.5px] text-gray-400 hover:text-[#127EE3] transition-colors truncate mb-1"
                >
                  <Mail className="w-3 h-3 flex-shrink-0" />
                  <span className="truncate">{member.email}</span>
                </a>
                <a
                  href={`tel:${member.mobile}`}
                  className="flex items-center gap-1.5 text-[11.5px] text-gray-400 hover:text-[#127EE3] transition-colors"
                >
                  <Phone className="w-3 h-3 flex-shrink-0" />
                  {member.mobile}
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionCard>
  );
}

function BrandSection({ onNavigate }: { onNavigate?: (page: string) => void }) {
  return (
    <SectionCard className="p-5">
      <SectionLabel>แบรนด์ขององค์กร</SectionLabel>

      <div className="flex items-start gap-3 mb-4">
        <div className="w-10 h-10 bg-[#0F1724] rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
          <span className="text-white text-[10.5px] font-bold tracking-tight">HiB</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-[#0F1724] leading-tight mb-1.5">TechVibe Solutions</p>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10.5px] font-semibold text-[#127EE3] bg-[#EBF5FF] px-2 py-0.5 rounded-full border border-[#127EE3]/15">
              DREAM COMPANY
            </span>
            <span className="text-[10.5px] font-semibold text-[#0DC2FF] bg-sky-50 px-2 py-0.5 rounded-full border border-[#0DC2FF]/20">
              YOU SAY
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between bg-gray-50 rounded-xl px-3.5 py-3 border border-gray-100 mb-3">
        <div>
          <span className="text-[26px] font-semibold text-[#0F1724] leading-none">4.8</span>
          <div className="flex items-center gap-0.5 mt-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
            ))}
          </div>
        </div>
        <div className="text-right">
          <p className="text-[13px] font-semibold text-emerald-600">คะแนนดีเยี่ยม</p>
          <p className="text-[11.5px] text-gray-400 mt-0.5">จาก 124 รีวิว</p>
        </div>
      </div>

      <button onClick={() => onNavigate?.("employer-branding")} className="w-full flex items-center justify-center gap-1.5 py-2.5 border border-gray-200 text-[13px] font-medium text-gray-500 rounded-xl hover:border-[#127EE3] hover:text-[#127EE3] transition-all">
        <ExternalLink className="w-3.5 h-3.5" />
        ดูหน้า Branding Page
      </button>
    </SectionCard>
  );
}

function LearningSection() {
  return (
    <SectionCard className="p-5">
      <SectionLabel>การเรียนรู้</SectionLabel>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-[#EBF5FF] rounded-xl flex items-center justify-center flex-shrink-0">
          <GraduationCap className="w-5 h-5 text-[#127EE3]" />
        </div>
        <div>
          <p className="text-[14px] font-semibold text-[#0F1724] leading-tight">HR Academy</p>
          <p className="text-[12px] text-gray-400 mt-0.5">พัฒนาทักษะสัมภาษณ์ระดับ Pro</p>
        </div>
      </div>
      <a href="https://www.topgunacademy.com/" target="_blank" rel="noopener noreferrer" className="w-full py-2.5 border border-[#127EE3] text-[#127EE3] hover:bg-[#127EE3] hover:text-white text-[13px] font-semibold rounded-xl transition-all flex items-center justify-center">
        ไป Up Skill เลย
      </a>
    </SectionCard>
  );
}

function daysLeft(dateStr: string): number {
  const MONTHS: Record<string, number> = {
    "ม.ค.": 0, "ก.พ.": 1, "มี.ค.": 2, "เม.ย.": 3, "พ.ค.": 4, "มิ.ย.": 5,
    "ก.ค.": 6, "ส.ค.": 7, "ก.ย.": 8, "ต.ค.": 9, "พ.ย.": 10, "ธ.ค.": 11,
  };
  const parts = dateStr.split(" ");
  const day = parseInt(parts[0]);
  const month = MONTHS[parts[1]] ?? 0;
  const year = parseInt(parts[2]) - 543;
  const target = new Date(year, month, day);
  const today = new Date(2026, 3, 24);
  return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function ExpiryBadge({ date }: { date: string }) {
  const days = daysLeft(date);
  const isWarning = days <= 14;
  const isCritical = days <= 7;
  return (
    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${
      isCritical ? "bg-red-50 border border-red-100" :
      isWarning ? "bg-amber-50 border border-amber-100" :
      "bg-gray-50 border border-gray-100"
    }`}>
      {(isCritical || isWarning) ? (
        <AlertTriangle className={`w-3 h-3 flex-shrink-0 ${isCritical ? "text-red-400" : "text-amber-400"}`} />
      ) : (
        <Calendar className="w-3 h-3 text-gray-400 flex-shrink-0" />
      )}
      <span className={`text-[11px] font-medium ${
        isCritical ? "text-red-600" :
        isWarning ? "text-amber-600" :
        "text-gray-500"
      }`}>
        {date}
      </span>
      {isWarning && (
        <span className={`text-[10px] font-semibold ${isCritical ? "text-red-500" : "text-amber-500"}`}>
          ({days} วัน)
        </span>
      )}
    </div>
  );
}

function PackageSection({ onBuyPackage }: { onBuyPackage?: () => void }) {
  const jobUsed = 3;
  const jobTotal = 5;
  const jobPct = (jobUsed / jobTotal) * 100;

  const creditUsed = 1200;
  const creditTotal = 2000;
  const creditPct = (creditUsed / creditTotal) * 100;

  const packageExpiry = "30 มิ.ย. 2569";
  const brandingExpiry = "31 ก.ค. 2569";

  return (
    <SectionCard className="p-5">
      <SectionLabel>แพ็กเกจปัจจุบัน</SectionLabel>

      <div className="flex flex-col gap-5">
        {/* Job Quota */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#127EE3]" />
              <span className="text-[13px] font-medium text-[#0F1724]">Job Quota</span>
            </div>
            <span className="text-[13px] font-semibold text-[#0F1724]">
              <span className="text-[#127EE3]">{jobUsed}</span>
              <span className="text-gray-300 font-normal"> / {jobTotal}</span>
            </span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{ width: `${jobPct}%`, background: "linear-gradient(90deg, #127EE3, #0DC2FF)" }}
            />
          </div>
          <p className="text-[11.5px] text-gray-400 mt-1.5">เหลือ {jobTotal - jobUsed} ตำแหน่ง</p>
        </div>

        {/* Talent Credit */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-amber-500" />
              <span className="text-[13px] font-medium text-[#0F1724]">Talent Credit</span>
            </div>
            <span className="text-[13px] font-semibold text-[#0F1724]">
              <span className="text-amber-500">{creditUsed.toLocaleString()}</span>
              <span className="text-gray-300 font-normal"> / {creditTotal.toLocaleString()}</span>
            </span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all"
              style={{ width: `${creditPct}%` }}
            />
          </div>
          <p className="text-[11.5px] text-gray-400 mt-1.5">เหลือ {(creditTotal - creditUsed).toLocaleString()} เครดิต</p>
        </div>

        {/* Expiry */}
        <div className="flex items-center justify-between pt-3 border-t border-dashed border-gray-100">
          <p className="text-[11.5px] text-gray-400">วันหมดอายุแพ็กเกจ</p>
          <ExpiryBadge date={packageExpiry} />
        </div>

        {/* Employer Branding */}
        <div className="pt-1 border-t border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-rose-400" />
              <span className="text-[13px] font-medium text-[#0F1724]">Employer Branding</span>
            </div>
            <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
              Active
            </span>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-[11.5px] text-gray-400">YOU SAY · HR SAY</p>
            <ExpiryBadge date={brandingExpiry} />
          </div>
        </div>
      </div>

    </SectionCard>
  );
}

export default function RightPanel({ onBuyPackage, onNavigate }: RightPanelProps) {
  return (
    <aside className="w-[276px] min-w-[276px] flex flex-col gap-4 pt-0 pb-8">
      <BrandSection onNavigate={onNavigate} />
      <PackageSection onBuyPackage={onBuyPackage} />
      <LearningSection />
      <AccountTeamSection />
    </aside>
  );
}
