import { useState, useMemo, useRef, useEffect } from "react";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  GraduationCap,
  BookmarkPlus,
  BookmarkCheck,
  ChevronDown,
  ChevronUp,
  Zap,
  Clock,
  CheckCircle2,
  Eye,
  Filter,
  RotateCcw,
  Languages,
  DollarSign,
  Users,
  Info,
  AlertTriangle,
  AlertCircle,
  Lightbulb,
  TrendingDown,
  History,
  Bookmark,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  Briefcase,
  Building2,
  BookOpen,
  Music,
  BarChart2,
  CalendarDays,
  Pin,
  PinOff,
  Send,
  Trash2,
  X,
  Check,
} from "lucide-react";
import ResumePanel from "./ResumePanel";
import MessageModal from "./MessageModal";

type TabType = "search" | "history" | "bookmarked" | "opened";

interface ActiveFilter {
  id: string;
  label: string;
  category: string;
}

interface Candidate {
  id: string;
  code: string;
  name?: string;
  title: string;
  company: string;
  period: string;
  years: string;
  experience: string[];
  education: { degree: string; major: string; school: string; year: string }[];
  skills: string[];
  languages: string[];
  location: string;
  salary: string;
  lastActive: string;
  hasResume: boolean;
  aiSummary: string;
}

const CANDIDATES: Candidate[] = [
  {
    id: "1",
    code: "JTG07150170R048",
    name: "สมชาย วงศ์ประเสริฐ",
    title: "Logistics Supervisor (Export & Import)",
    company: "KONA Enterprises Co., Ltd.",
    period: "พ.ย. 2563 – ปัจจุบัน (5 ปี 6 เดือน)",
    years: "13 ปี 6 เดือน",
    experience: [
      "เจ้าหน้าที่ส่งออกนำเข้า (5 ปี 6 เดือน)",
      "เจ้าหน้าที่ส่งออกนำเข้า (1 ปี 11 เดือน)",
    ],
    education: [
      { degree: "ปริญญาโท", major: "MBA – Logistics & Supply Chain", school: "ม.รามคำแหง", year: "2560" },
      { degree: "ปริญญาตรี", major: "การจัดการโลจิสติกส์", school: "ม.ราชภัฏสวนสุนันทา", year: "2555" },
    ],
    skills: ["Internet", "Ms Excel", "Ms Outlook", "Ms PowerPoint", "Ms Word"],
    languages: ["Thai", "English"],
    location: "นนทบุรี / สมุทรสาคร / กรุงเทพมหานคร",
    salary: "ยังไม่ระบุ",
    lastActive: "1 ชั่วโมงที่แล้ว",
    hasResume: true,
    aiSummary: "ผู้สมัครมีประสบการณ์ด้าน Export/Import กว่า 13 ปี ทำงานต่อเนื่องที่ KONA มา 5 ปี แสดงถึงความซื่อสัตย์และความมั่นคง จบ MBA สายโลจิสติกส์โดยตรง น่าจะรับบทหัวหน้าทีมได้ทันที",
  },
  {
    id: "2",
    code: "JTG09618403R004",
    name: "วิภาวี ทองดี",
    title: "ผู้ช่วยผู้จัดการ",
    company: "Home Sukkapat Co., Ltd.",
    period: "ม.ค. 2567 – ปัจจุบัน (2 ปี 4 เดือน)",
    years: "5 ปี 10 เดือน",
    experience: [
      "ผู้จัดการฝ่ายโกดังและ Logistics (2 ปี 4 เดือน)",
      "เจ้าหน้าที่โกดังสินค้า (4 เดือน)",
    ],
    education: [
      { degree: "ปริญญาตรี", major: "วิศวกรรมศาสตร์โลจิสติกส์", school: "ม.เทคโนโลยีราชมงคลล้านนา", year: "2562" },
      { degree: "มัธยมศึกษา", major: "", school: "Fakkwan Wittayakom School", year: "" },
    ],
    skills: ["ERP", "WMS"],
    languages: ["English"],
    location: "ภาคตะวันออก",
    salary: "XXXXXX บาท/เดือน",
    lastActive: "1 ชั่วโมงที่แล้ว",
    hasResume: true,
    aiSummary: "เชี่ยวชาญด้านคลังสินค้าและ WMS เหมาะกับตำแหน่งที่ต้องการ warehouse management แต่พื้นที่อยู่ภาคตะวันออก ควรถามว่า relocation ได้ไหม",
  },
  {
    id: "3",
    code: "JTG10230734R011",
    name: "ธนากร ศรีสมบูรณ์",
    title: "Senior Supply Chain Analyst",
    company: "PTG Energy PCL.",
    period: "มี.ค. 2565 – ปัจจุบัน (3 ปี 1 เดือน)",
    years: "8 ปี 3 เดือน",
    experience: [
      "Supply Chain Analyst (3 ปี 1 เดือน)",
      "Procurement Officer (2 ปี 5 เดือน)",
      "Logistics Coordinator (2 ปี 9 เดือน)",
    ],
    education: [
      { degree: "ปริญญาโท", major: "Supply Chain Management", school: "จุฬาลงกรณ์มหาวิทยาลัย", year: "2561" },
    ],
    skills: ["SAP", "Power BI", "Excel Advanced", "Python (Basic)"],
    languages: ["Thai", "English", "Chinese (Basic)"],
    location: "กรุงเทพมหานคร",
    salary: "65,000 บาท/เดือน",
    lastActive: "3 ชั่วโมงที่แล้ว",
    hasResume: true,
    aiSummary: "Background แน่นมาก ผ่านทั้ง procurement, logistics และ analysis ที่บริษัทพลังงานใหญ่ ใช้ SAP และ Power BI ได้จริง เงินเดือน 65k อาจสูงกว่า budget เล็กน้อย แต่ทักษะคุ้มค่า",
  },
  {
    id: "4",
    code: "JTG08340192R027",
    name: "ปิยะนุช แก้วมณี",
    title: "Freight Forwarding Coordinator",
    company: "DHL Supply Chain Thailand",
    period: "ก.พ. 2564 – ปัจจุบัน (4 ปี 2 เดือน)",
    years: "7 ปี",
    experience: [
      "Freight Coordinator (4 ปี 2 เดือน)",
      "Customer Service Logistics (2 ปี 10 เดือน)",
    ],
    education: [
      { degree: "ปริญญาตรี", major: "International Business", school: "ม.กรุงเทพ", year: "2558" },
    ],
    skills: ["CargoWise", "MS Office", "English Communication"],
    languages: ["Thai", "English (Fluent)", "Japanese (Basic)"],
    location: "กรุงเทพมหานคร / สมุทรปราการ",
    salary: "42,000 บาท/เดือน",
    lastActive: "30 นาทีที่แล้ว",
    hasResume: true,
    aiSummary: "ทำงาน DHL มา 4 ปี มีประสบการณ์ freight forwarding จริงๆ ภาษาอังกฤษคล่อง มีภาษาญี่ปุ่นเพิ่มเติม เหมาะกับงานที่ดีลกับลูกค้าต่างชาติ",
  },
];

const FILTER_OPTIONS = {
  salary: ["ต่ำกว่า 15,000", "15,000–25,000", "25,000–35,000", "35,000–50,000", "50,000–80,000", "80,000+"],
  career: ["โลจิสติกส์ / ซัพพลายเชน", "การตลาด", "บัญชี / การเงิน", "ขาย", "ไอที / โปรแกรมเมอร์", "วิศวกรรม", "บริหาร / ผู้จัดการ", "ทรัพยากรบุคคล", "กฎหมาย", "การผลิต / โรงงาน"],
  experience: ["ไม่มีประสบการณ์", "0–2 ปี", "3–5 ปี", "6–10 ปี", "10–15 ปี", "15+ ปี"],
  education: ["ต่ำกว่าปริญญาตรี", "ปวช / ปวส", "ปริญญาตรี", "ปริญญาโท", "ปริญญาเอก"],
  industry: ["โลจิสติกส์", "ค้าปลีก / E-Commerce", "การผลิต", "พลังงาน", "ไอที / ซอฟต์แวร์", "การเงิน / ธนาคาร", "สุขภาพ / โรงพยาบาล", "อสังหาริมทรัพย์", "อาหารและเครื่องดื่ม", "ยานยนต์"],
  schoolDomestic: ["จุฬาลงกรณ์มหาวิทยาลัย", "มหาวิทยาลัยธรรมศาสตร์", "มหาวิทยาลัยมหิดล", "มหาวิทยาลัยเกษตรศาสตร์", "มหาวิทยาลัยรามคำแหง", "มหาวิทยาลัยราชภัฏ", "สถาบันเทคโนโลยีพระจอมเกล้า", "มหาวิทยาลัยอื่นๆ ในประเทศ"],
  schoolAbroad: ["สถาบันในสหรัฐอเมริกา", "สถาบันในสหราชอาณาจักร", "สถาบันในออสเตรเลีย", "สถาบันในญี่ปุ่น", "สถาบันในสิงคโปร์", "สถาบันในจีน", "สถาบันในยุโรป", "สถาบันอื่นๆ ต่างประเทศ"],
  faculty: ["บริหารธุรกิจ", "วิศวกรรมศาสตร์", "วิทยาการคอมพิวเตอร์", "บัญชี", "นิติศาสตร์", "แพทยศาสตร์", "เศรษฐศาสตร์", "สถาปัตยกรรมศาสตร์", "นิเทศศาสตร์", "อื่นๆ"],
  gpa: ["3.50 – 4.00", "3.00 – 3.49", "2.50 – 2.99", "2.00 – 2.49", "ต่ำกว่า 2.00"],
  gradYear: ["2567 (ปัจจุบัน)", "2565–2566", "2561–2564", "2556–2560", "ก่อน 2556"],
  languages: ["ภาษาไทย", "ภาษาอังกฤษ", "ภาษาจีน (กลาง)", "ภาษาญี่ปุ่น", "ภาษาเกาหลี", "ภาษาฝรั่งเศส", "ภาษาเยอรมัน", "ภาษาอื่นๆ"],
  hobbies: ["กีฬา", "ดนตรี", "ศิลปะ / การวาดภาพ", "อ่านหนังสือ", "ท่องเที่ยว", "งานอาสาสมัคร", "การทำอาหาร"],
  location: ["กรุงเทพมหานคร", "นนทบุรี", "ปทุมธานี", "สมุทรปราการ", "ภาคกลาง", "ภาคเหนือ", "ภาคตะวันออกเฉียงเหนือ", "ภาคตะวันออก", "ภาคตะวันตก", "ภาคใต้"],
  age: ["18–22 ปี", "23–27 ปี", "28–32 ปี", "33–38 ปี", "39–45 ปี", "45+ ปี"],
  gender: ["ชาย", "หญิง", "ไม่ระบุ"],
  vehicle: ["รถยนต์ส่วนตัว", "รถจักรยานยนต์", "ใบขับขี่รถยนต์", "ใบขับขี่รถบรรทุก"],
  lastLogin: ["ภายใน 24 ชั่วโมง", "ภายใน 3 วัน", "ภายใน 1 สัปดาห์", "ภายใน 1 เดือน", "ภายใน 3 เดือน"],
  company: [],
};

const TOTAL_CANDIDATES = 3161739;

const FILTER_WEIGHT: Record<string, number> = {
  salary: 0.35,
  career: 0.45,
  experience: 0.40,
  education: 0.30,
  industry: 0.38,
  schoolDomestic: 0.55,
  schoolAbroad: 0.70,
  faculty: 0.50,
  gpa: 0.60,
  gradYear: 0.45,
  languages: 0.42,
  hobbies: 0.65,
  location: 0.38,
  age: 0.35,
  gender: 0.50,
  vehicle: 0.30,
  lastLogin: 0.55,
  company: 0.72,
};

const OPTION_WEIGHT: Record<string, number> = {
  "ต่ำกว่า 15,000": 0.12,
  "80,000+": 0.08,
  "ปริญญาเอก": 0.05,
  "สถาบันในสหรัฐอเมริกา": 0.03,
  "สถาบันในสหราชอาณาจักร": 0.03,
  "3.50 – 4.00": 0.12,
  "3.00 – 3.49": 0.22,
  "ภายใน 24 ชั่วโมง": 0.15,
  "ภายใน 3 วัน": 0.28,
  "15+ ปี": 0.10,
  "ไม่มีประสบการณ์": 0.18,
};

function estimateResultCount(filters: Record<string, string[]>): number {
  let multiplier = 1;
  let activeCount = 0;
  for (const [cat, vals] of Object.entries(filters)) {
    if (vals.length === 0) continue;
    activeCount++;
    const catWeight = FILTER_WEIGHT[cat] ?? 0.40;
    let optionMult = 1;
    for (const v of vals) {
      const w = OPTION_WEIGHT[v] ?? (0.30 + Math.random() * 0.25);
      optionMult = Math.min(optionMult + w * 0.6, 0.95);
    }
    multiplier *= (1 - catWeight * (1 - optionMult));
  }
  const base = Math.round(TOTAL_CANDIDATES * multiplier);
  return Math.max(base, 0);
}

interface ConflictWarning {
  message: string;
  filters: string[];
}

function detectConflicts(filters: Record<string, string[]>): ConflictWarning[] {
  const warnings: ConflictWarning[] = [];
  const { education, gpa, experience, age, gradYear, schoolDomestic, schoolAbroad } = filters;

  if (
    education.includes("ต่ำกว่าปริญญาตรี") &&
    (gpa.length > 0 || schoolDomestic.length > 0 || schoolAbroad.length > 0)
  ) {
    warnings.push({
      message: "วุฒิ \"ต่ำกว่าปริญญาตรี\" ไม่มีข้อมูลเกรด/สถาบัน ปริญญาตรี",
      filters: ["education", "gpa", "schoolDomestic", "schoolAbroad"],
    });
  }

  if (experience.includes("ไม่มีประสบการณ์") && experience.some((e) => e.includes("ปี") && !e.includes("0–2"))) {
    warnings.push({
      message: "เลือกทั้ง \"ไม่มีประสบการณ์\" และ \"มีประสบการณ์\" พร้อมกัน",
      filters: ["experience"],
    });
  }

  if (
    age.length > 0 && gradYear.length > 0 &&
    age.some((a) => a.includes("18–22")) &&
    gradYear.some((g) => g.includes("2556") || g.includes("ก่อน"))
  ) {
    warnings.push({
      message: "อายุ 18–22 ปี ไม่น่าจะจบการศึกษาก่อนปี 2556",
      filters: ["age", "gradYear"],
    });
  }

  if (
    experience.some((e) => e.includes("15+") || e.includes("10–15")) &&
    age.some((a) => a.includes("18–22") || a.includes("23–27"))
  ) {
    warnings.push({
      message: "ประสบการณ์ 10+ ปี ไม่สอดคล้องกับช่วงอายุที่เลือก",
      filters: ["experience", "age"],
    });
  }

  return warnings;
}

interface FilterImpact {
  category: string;
  label: string;
  removedPct: number;
}

function getTopImpacts(filters: Record<string, string[]>): FilterImpact[] {
  const impacts: FilterImpact[] = [];
  const LABEL_MAP: Record<string, string> = {
    salary: "เงินเดือน", career: "สายอาชีพ", experience: "ประสบการณ์",
    education: "วุฒิการศึกษา", industry: "ธุรกิจ", schoolDomestic: "สถาบัน (ในประเทศ)",
    schoolAbroad: "สถาบัน (ต่างประเทศ)", faculty: "คณะ", gpa: "เกรดเฉลี่ย",
    gradYear: "ปีจบการศึกษา", languages: "ภาษา", hobbies: "งานอดิเรก",
    location: "ที่อยู่", age: "อายุ", gender: "เพศ", vehicle: "รถ",
    lastLogin: "เข้าสู่ระบบ", company: "บริษัท",
  };
  for (const [cat, vals] of Object.entries(filters)) {
    if (vals.length === 0) continue;
    const w = FILTER_WEIGHT[cat] ?? 0.40;
    const removed = Math.round(w * 85 + (vals.length > 1 ? 5 : 0));
    impacts.push({ category: cat, label: LABEL_MAP[cat] ?? cat, removedPct: Math.min(removed, 95) });
  }
  return impacts.sort((a, b) => b.removedPct - a.removedPct).slice(0, 3);
}


function formatCount(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(0) + "K";
  return n.toLocaleString();
}

function FilterSection({
  title,
  options,
  selected,
  onToggle,
  currentResultCount,
  isConflicted = false,
}: {
  title: string;
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
  currentResultCount: number;
  isConflicted?: boolean;
}) {
  const [open, setOpen] = useState(false);

  const optionPreviews = useMemo(() => {
    return options.map((opt) => {
      const w = OPTION_WEIGHT[opt] ?? (0.28 + ((opt.charCodeAt(0) % 20) / 100));
      const added = Math.round(currentResultCount * w * 0.7);
      return { opt, addCount: Math.max(added, 1) };
    });
  }, [options, currentResultCount]);

  return (
    <div className={`border-b border-gray-100 last:border-0 ${isConflicted ? "bg-amber-50/40" : ""}`}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`w-full flex items-center justify-between px-4 py-3 text-[13px] font-semibold hover:bg-gray-50 transition-colors ${isConflicted ? "text-amber-700" : "text-[#1A1A2E]"}`}
      >
        <span className="flex items-center gap-2">
          {isConflicted && <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />}
          {title}
          {selected.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-[#127EE3] text-white text-[10px] font-bold flex items-center justify-center">
              {selected.length}
            </span>
          )}
        </span>
        {open ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      {open && (
        <div className="px-4 pb-3 flex flex-col gap-1">
          {options.length === 0 && (
            <p className="text-[12px] text-gray-400 italic py-1">พิมพ์ชื่อบริษัทในช่องค้นหา</p>
          )}
          {optionPreviews.map(({ opt, addCount }) => {
            const isChecked = selected.includes(opt);
            const wouldBeEmpty = !isChecked && currentResultCount > 0 && addCount < 50;
            return (
              <label
                key={opt}
                className={`flex items-center justify-between gap-2 cursor-pointer group rounded-lg px-2 py-1.5 -mx-2 transition-colors ${
                  isChecked ? "bg-[#127EE3]/5" : "hover:bg-gray-50"
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => onToggle(opt)}
                    className="w-4 h-4 rounded border-gray-300 text-[#127EE3] accent-[#127EE3] cursor-pointer flex-shrink-0"
                  />
                  <span className={`text-[12.5px] transition-colors ${isChecked ? "text-[#127EE3] font-medium" : "text-gray-600 group-hover:text-[#1A1A2E]"}`}>
                    {opt}
                  </span>
                </span>
                {!isChecked && (
                  <span className={`text-[11px] font-medium flex-shrink-0 ${wouldBeEmpty ? "text-amber-500" : "text-gray-400"}`}>
                    +{formatCount(addCount)}
                  </span>
                )}
                {isChecked && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#127EE3] flex-shrink-0" />
                )}
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
}

function CandidateCard({
  candidate,
  onBookmark,
  onView,
  interactable = false,
  bookmarked = false,
  revealed = false,
  selected = false,
  onSelect,
}: {
  candidate: Candidate;
  onBookmark: () => void;
  onView: () => void;
  interactable?: boolean;
  bookmarked?: boolean;
  revealed?: boolean;
  selected?: boolean;
  onSelect?: () => void;
}) {
  return (
    <div className={`bg-white rounded-xl border transition-all group overflow-hidden ${selected ? "border-[#127EE3]/50 shadow-md shadow-[#127EE3]/8" : "border-gray-100 hover:border-[#127EE3]/25 hover:shadow-lg"}`}>
      {revealed && <div className="h-0.5 bg-gradient-to-r from-[#01BFF9] to-[#019EFC]" />}
      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start gap-3.5 mb-4">
          {onSelect && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onSelect(); }}
              className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${selected ? "bg-[#127EE3] border-[#127EE3]" : "border-gray-300 hover:border-[#127EE3]"}`}
            >
              {selected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
            </button>
          )}
          <div className={`w-11 h-11 rounded-xl flex-shrink-0 flex items-center justify-center font-black text-[14px] ${revealed ? "bg-gradient-to-br from-[#0DC2FF] to-[#127EE3] text-white shadow-sm shadow-[#127EE3]/20" : "bg-[#F0F4F8] text-gray-300 border border-gray-200"}`}>
            {revealed && candidate.name ? candidate.name.charAt(0) : "?"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <span className="text-[11px] text-[#127EE3] font-bold font-mono bg-[#EBF5FF] px-1.5 py-0.5 rounded">{candidate.code}</span>
                  {revealed && (
                    <span className="flex items-center gap-1 px-1.5 py-0.5 bg-emerald-50 border border-emerald-100 rounded-full text-[10px] font-bold text-emerald-600">
                      <CheckCircle2 className="w-2.5 h-2.5" />เปิดดูแล้ว
                    </span>
                  )}
                </div>
                {revealed && candidate.name ? (
                  <div className="flex items-baseline gap-2 flex-wrap">
                    <h3 className="text-[15.5px] font-bold text-[#1A1A2E]">{candidate.name}</h3>
                    <span className="text-[12.5px] text-gray-500">{candidate.title}</span>
                  </div>
                ) : (
                  <h3 className="text-[14.5px] font-bold text-[#1A1A2E] leading-snug">{candidate.title}</h3>
                )}
                <p className="text-[12px] text-gray-400 mt-0.5">{candidate.company} · {candidate.period}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-4 gap-0 mb-4 rounded-xl overflow-hidden border border-gray-100">
          {[
            { label: "ประสบการณ์", value: candidate.years, color: "text-[#1A1A2E] font-bold" },
            { label: "ที่อยู่", value: candidate.location, color: "text-[#1A1A2E] font-medium" },
            { label: "วุฒิการศึกษา", value: candidate.education[0]?.degree ?? "-", color: "text-[#1A1A2E] font-medium" },
            { label: "เงินเดือน", value: candidate.salary, color: "text-[#127EE3] font-bold" },
          ].map((item, i) => (
            <div key={i} className={`px-3 py-2.5 bg-[#F8FAFC] ${i < 3 ? "border-r border-gray-100" : ""}`}>
              <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide mb-0.5">{item.label}</p>
              <p className={`text-[12px] leading-tight ${item.color}`}>{item.value}</p>
            </div>
          ))}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3.5">
          {candidate.languages.map((lang) => (
            <span key={lang} className="flex items-center gap-1 px-2 py-0.5 bg-[#EBF5FF] border border-[#C7E3FA] rounded-full text-[11px] text-[#127EE3] font-semibold">
              <Languages className="w-2.5 h-2.5" />{lang}
            </span>
          ))}
          {candidate.skills.slice(0, 5).map((skill) => (
            <span key={skill} className="px-2 py-0.5 bg-[#F0F2F5] rounded-full text-[11px] text-gray-600 font-medium">
              {skill}
            </span>
          ))}
          {candidate.skills.length > 5 && (
            <span className="px-2 py-0.5 bg-[#F0F2F5] rounded-full text-[11px] text-gray-400">
              +{candidate.skills.length - 5}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-3 text-[11px] text-gray-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />{candidate.lastActive}
            </span>
            {candidate.hasResume && (
              <span className="flex items-center gap-1 text-emerald-600 font-medium">
                <CheckCircle2 className="w-3 h-3" />มีเรซูเม่
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={onBookmark}
              className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${bookmarked ? "bg-[#EBF5FF] text-[#127EE3]" : "hover:bg-[#F0F2F5] text-gray-300 hover:text-[#127EE3]"}`}
            >
              {bookmarked ? <BookmarkCheck className="w-4 h-4" /> : <BookmarkPlus className="w-4 h-4" />}
            </button>
            <button
              onClick={onView}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[12px] font-semibold transition-all ${interactable ? "bg-gradient-to-r from-[#01BFF9] to-[#019EFC] text-white hover:opacity-90 shadow-sm shadow-[#019EFC]/25" : "bg-[#F0F2F5] text-gray-400 cursor-default"}`}
            >
              <Eye className="w-3.5 h-3.5" />ดูโปรไฟล์
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface CandidateSearchPageProps {
  onBack?: () => void;
}

const HISTORY_ITEMS = [
  { id: "h1", query: "Logistics Manager 5+ ปี พูดอังกฤษได้ อยู่กรุงเทพ", date: "วันนี้ 09:15", results: 248, searchCount: 6, newCount: 15 },
  { id: "h2", query: "Supply Chain วุฒิโท ใช้ SAP ได้", date: "เมื่อวาน 14:30", results: 93, searchCount: 2, newCount: 3 },
  { id: "h3", query: "ผู้จัดการคลังสินค้า มีประสบการณ์ FMCG", date: "3 วันที่แล้ว", results: 57, searchCount: 4, newCount: 0 },
  { id: "h4", query: "Procurement เงินเดือน 40–60k กรุงเทพ", date: "5 วันที่แล้ว", results: 312, searchCount: 7, newCount: 22 },
  { id: "h5", query: "Freight Forwarding 3 ปีขึ้น ภาษาอังกฤษดี", date: "1 สัปดาห์ที่แล้ว", results: 184, searchCount: 3, newCount: 7 },
];

const BOOKMARKED_IDS = ["1", "3"];
const OPENED_IDS = ["1", "2", "3"];

const BOOKMARKED_BY: Record<string, string> = {
  "1": "ฉัน",
  "3": "คุณแพม",
};

const VIEWED_BY: Record<string, string> = {
  "1": "ฉัน",
  "2": "ทีม HR",
  "3": "คุณแพม",
};

type LandingCategoryKey = "career" | "location" | "education" | "premium" | "industry" | "university";

const LANDING_TABS: { key: LandingCategoryKey; label: string }[] = [
  { key: "career", label: "สายอาชีพ" },
  { key: "location", label: "พื้นที่ทำงาน" },
  { key: "education", label: "วุฒิการศึกษา" },
  { key: "premium", label: "โปรไฟล์ระดับสูง" },
  { key: "industry", label: "ประเภทธุรกิจ" },
  { key: "university", label: "มหาวิทยาลัย (MyU)" },
];

type PremiumSection = {
  title: string;
  items: { label: string; count: number }[];
};

const PREMIUM_SECTIONS: PremiumSection[] = [
  {
    title: "ประสบการณ์",
    items: [
      { label: "ประสบการณ์ 10 ปีขึ้นไป", count: 698469 },
      { label: "ประสบการณ์ 5 ปีขึ้นไป", count: 1182235 },
      { label: "โปรไฟล์พรีเมี่ยมเงินเดือน 100,000 บาทขึ้นไป", count: 22014 },
      { label: "CEO เงินเดือน 120,000 บาทขึ้นไป", count: 1040 },
    ],
  },
  {
    title: "การศึกษา",
    items: [
      { label: "จบจากมหาวิทยาลัยชั้นนำ", count: 745841 },
      { label: "จบการศึกษาจากต่างประเทศ", count: 66005 },
    ],
  },
  {
    title: "ทักษะภาษา",
    items: [
      { label: "ผู้ที่สามารถสื่อสารภาษาอังกฤษได้", count: 419834 },
      { label: "TOEIC > 600 คะแนน", count: 43493 },
      { label: "IELTS > 6.0 คะแนน", count: 6716 },
      { label: "TOEFL > 100 คะแนน", count: 2514 },
      { label: "ภาษาเกาหลี", count: 7177 },
      { label: "ภาษาญี่ปุ่น", count: 17740 },
      { label: "ภาษาจีน (แบบย่อ)", count: 25079 },
      { label: "ภาษาจีน (แบบดั้งเดิม)", count: 9608 },
    ],
  },
];

type UniRegion = "กรุงเทพฯ และปริมณฑล" | "ภาคกลาง" | "ภาคเหนือ" | "ภาคตะวันออกเฉียงเหนือ" | "ภาคตะวันออก" | "ภาคตะวันตก" | "ภาคใต้";
type UniGroup = "รัฐบาล" | "สามพระจอม" | "ราชภัฏ" | "ราชมงคล" | "เอกชน" | "ต่างประเทศ";

interface UniversityEntry { name: string; province: string; region: UniRegion; group: UniGroup; count: number }

const PROVINCE_REGION: Record<string, UniRegion> = {
  "กรุงเทพมหานคร": "กรุงเทพฯ และปริมณฑล",
  "นนทบุรี": "กรุงเทพฯ และปริมณฑล",
  "ปทุมธานี": "กรุงเทพฯ และปริมณฑล",
  "สมุทรปราการ": "กรุงเทพฯ และปริมณฑล",
  "นครปฐม": "ภาคกลาง",
  "พระนครศรีอยุธยา": "ภาคกลาง",
  "สระบุรี": "ภาคกลาง",
  "นครสวรรค์": "ภาคกลาง",
  "กาญจนบุรี": "ภาคตะวันตก",
  "เพชรบุรี": "ภาคตะวันตก",
  "เชียงใหม่": "ภาคเหนือ",
  "เชียงราย": "ภาคเหนือ",
  "พิษณุโลก": "ภาคเหนือ",
  "พะเยา": "ภาคเหนือ",
  "ลำปาง": "ภาคเหนือ",
  "ขอนแก่น": "ภาคตะวันออกเฉียงเหนือ",
  "มหาสารคาม": "ภาคตะวันออกเฉียงเหนือ",
  "นครราชสีมา": "ภาคตะวันออกเฉียงเหนือ",
  "อุบลราชธานี": "ภาคตะวันออกเฉียงเหนือ",
  "นครพนม": "ภาคตะวันออกเฉียงเหนือ",
  "กาฬสินธุ์": "ภาคตะวันออกเฉียงเหนือ",
  "ศรีสะเกษ": "ภาคตะวันออกเฉียงเหนือ",
  "ชลบุรี": "ภาคตะวันออก",
  "ระยอง": "ภาคตะวันออก",
  "สงขลา": "ภาคใต้",
  "นครศรีธรรมราช": "ภาคใต้",
  "ภูเก็ต": "ภาคใต้",
  "นราธิวาส": "ภาคใต้",
  "สุราษฎร์ธานี": "ภาคใต้",
};

function getRegion(province: string): UniRegion {
  return PROVINCE_REGION[province] ?? "ภาคกลาง";
}

const UNIVERSITIES: UniversityEntry[] = [
  { name: "จุฬาลงกรณ์มหาวิทยาลัย", province: "กรุงเทพมหานคร", region: getRegion("กรุงเทพมหานคร"), group: "รัฐบาล", count: 56904 },
  { name: "มหาวิทยาลัยธรรมศาสตร์", province: "ปทุมธานี", region: getRegion("ปทุมธานี"), group: "รัฐบาล", count: 73905 },
  { name: "มหาวิทยาลัยเกษตรศาสตร์", province: "กรุงเทพมหานคร", region: getRegion("กรุงเทพมหานคร"), group: "รัฐบาล", count: 131911 },
  { name: "สถาบันเทคโนโลยีพระจอมเกล้าเจ้าคุณทหารลาดกระบัง", province: "กรุงเทพมหานคร", region: getRegion("กรุงเทพมหานคร"), group: "สามพระจอม", count: 67688 },
  { name: "มหาวิทยาลัยรามคำแหง", province: "กรุงเทพมหานคร", region: getRegion("กรุงเทพมหานคร"), group: "รัฐบาล", count: 154313 },
  { name: "มหาวิทยาลัยบูรพา", province: "ชลบุรี", region: getRegion("ชลบุรี"), group: "รัฐบาล", count: 67330 },
  { name: "มหาวิทยาลัยกรุงเทพ", province: "ปทุมธานี", region: getRegion("ปทุมธานี"), group: "เอกชน", count: 66020 },
  { name: "มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าพระนครเหนือ", province: "กรุงเทพมหานคร", region: getRegion("กรุงเทพมหานคร"), group: "สามพระจอม", count: 63330 },
  { name: "มหาวิทยาลัยมหาสารคาม", province: "มหาสารคาม", region: getRegion("มหาสารคาม"), group: "รัฐบาล", count: 56557 },
  { name: "มหาวิทยาลัยเทคโนโลยีราชมงคลธัญบุรี", province: "ปทุมธานี", region: getRegion("ปทุมธานี"), group: "ราชมงคล", count: 55345 },
  { name: "มหาวิทยาลัยสงขลานครินทร์", province: "สงขลา", region: getRegion("สงขลา"), group: "รัฐบาล", count: 54260 },
  { name: "มหาวิทยาลัยหอการค้าไทย", province: "กรุงเทพมหานคร", region: getRegion("กรุงเทพมหานคร"), group: "เอกชน", count: 51951 },
  { name: "มหาวิทยาลัยขอนแก่น", province: "ขอนแก่น", region: getRegion("ขอนแก่น"), group: "รัฐบาล", count: 50658 },
  { name: "มหาวิทยาลัยศรีปทุม", province: "กรุงเทพมหานคร", region: getRegion("กรุงเทพมหานคร"), group: "เอกชน", count: 44754 },
  { name: "มหาวิทยาลัยเชียงใหม่", province: "เชียงใหม่", region: getRegion("เชียงใหม่"), group: "รัฐบาล", count: 44751 },
  { name: "มหาวิทยาลัยศิลปากร", province: "กรุงเทพมหานคร", region: getRegion("กรุงเทพมหานคร"), group: "รัฐบาล", count: 42757 },
  { name: "มหาวิทยาลัยนเรศวร", province: "พิษณุโลก", region: getRegion("พิษณุโลก"), group: "รัฐบาล", count: 42319 },
  { name: "มหาวิทยาลัยสวนดุสิต", province: "กรุงเทพมหานคร", region: getRegion("กรุงเทพมหานคร"), group: "รัฐบาล", count: 40444 },
  { name: "มหาวิทยาลัยศรีนครินทรวิโรฒ", province: "กรุงเทพมหานคร", region: getRegion("กรุงเทพมหานคร"), group: "รัฐบาล", count: 39772 },
  { name: "มหาวิทยาลัยเทคโนโลยีราชมงคลอีสาน", province: "นครราชสีมา", region: getRegion("นครราชสีมา"), group: "ราชมงคล", count: 39151 },
  { name: "มหาวิทยาลัยเทคโนโลยีพระจอมเกล้าธนบุรี", province: "กรุงเทพมหานคร", region: getRegion("กรุงเทพมหานคร"), group: "สามพระจอม", count: 39095 },
  { name: "มหาวิทยาลัยอัสสัมชัญ", province: "กรุงเทพมหานคร", region: getRegion("กรุงเทพมหานคร"), group: "เอกชน", count: 38925 },
  { name: "มหาวิทยาลัยธุรกิจบัณฑิตย์", province: "กรุงเทพมหานคร", region: getRegion("กรุงเทพมหานคร"), group: "เอกชน", count: 32967 },
  { name: "มหาวิทยาลัยรังสิต", province: "ปทุมธานี", region: getRegion("ปทุมธานี"), group: "เอกชน", count: 32421 },
  { name: "มหาวิทยาลัยแม่โจ้", province: "เชียงใหม่", region: getRegion("เชียงใหม่"), group: "รัฐบาล", count: 32033 },
  { name: "มหาวิทยาลัยเทคโนโลยีราชมงคลพระนคร", province: "กรุงเทพมหานคร", region: getRegion("กรุงเทพมหานคร"), group: "ราชมงคล", count: 31496 },
  { name: "มหาวิทยาลัยเทคโนโลยีราชมงคลล้านนา", province: "เชียงใหม่", region: getRegion("เชียงใหม่"), group: "ราชมงคล", count: 28565 },
  { name: "มหาวิทยาลัยมหิดล", province: "นครปฐม", region: getRegion("นครปฐม"), group: "รัฐบาล", count: 27284 },
  { name: "มหาวิทยาลัยอุบลราชธานี", province: "อุบลราชธานี", region: getRegion("อุบลราชธานี"), group: "รัฐบาล", count: 23927 },
  { name: "มหาวิทยาลัยเทคโนโลยีสุรนารี", province: "นครราชสีมา", region: getRegion("นครราชสีมา"), group: "รัฐบาล", count: 22145 },
  { name: "มหาวิทยาลัยเทคโนโลยีราชมงคลศรีวิชัย", province: "สงขลา", region: getRegion("สงขลา"), group: "ราชมงคล", count: 21778 },
  { name: "มหาวิทยาลัยเทคโนโลยีราชมงคลสุวรรณภูมิ", province: "พระนครศรีอยุธยา", region: getRegion("พระนครศรีอยุธยา"), group: "ราชมงคล", count: 21130 },
  { name: "มหาวิทยาลัยสยาม", province: "กรุงเทพมหานคร", region: getRegion("กรุงเทพมหานคร"), group: "เอกชน", count: 20981 },
  { name: "มหาวิทยาลัยสุโขทัยธรรมาธิราช", province: "นนทบุรี", region: getRegion("นนทบุรี"), group: "รัฐบาล", count: 19565 },
  { name: "มหาวิทยาลัยเทคโนโลยีราชมงคลตะวันออก", province: "ชลบุรี", region: getRegion("ชลบุรี"), group: "ราชมงคล", count: 19425 },
  { name: "มหาวิทยาลัยรัตนบัณฑิต", province: "กรุงเทพมหานคร", region: getRegion("กรุงเทพมหานคร"), group: "เอกชน", count: 19291 },
  { name: "มหาวิทยาลัยเกษมบัณฑิต", province: "กรุงเทพมหานคร", region: getRegion("กรุงเทพมหานคร"), group: "เอกชน", count: 17435 },
  { name: "มหาวิทยาลัยพะเยา", province: "พะเยา", region: getRegion("พะเยา"), group: "รัฐบาล", count: 17086 },
  { name: "มหาวิทยาลัยทักษิณ", province: "สงขลา", region: getRegion("สงขลา"), group: "รัฐบาล", count: 16806 },
  { name: "มหาวิทยาลัยเทคโนโลยีราชมงคลรัตนโกสินทร์", province: "กรุงเทพมหานคร", region: getRegion("กรุงเทพมหานคร"), group: "ราชมงคล", count: 16219 },
  { name: "มหาวิทยาลัยแม่ฟ้าหลวง", province: "เชียงราย", region: getRegion("เชียงราย"), group: "รัฐบาล", count: 14895 },
  { name: "มหาวิทยาลัยเทคโนโลยีมหานคร", province: "กรุงเทพมหานคร", region: getRegion("กรุงเทพมหานคร"), group: "เอกชน", count: 13918 },
  { name: "มหาวิทยาลัยหัวเฉียวเฉลิมพระเกียรติ", province: "สมุทรปราการ", region: getRegion("สมุทรปราการ"), group: "เอกชน", count: 13806 },
  { name: "มหาวิทยาลัยเอเชียอาคเนย์", province: "กรุงเทพมหานคร", region: getRegion("กรุงเทพมหานคร"), group: "เอกชน", count: 13104 },
  { name: "สถาบันบัณฑิตพัฒนบริหารศาสตร์", province: "กรุงเทพมหานคร", region: getRegion("กรุงเทพมหานคร"), group: "รัฐบาล", count: 12448 },
  { name: "มหาวิทยาลัยวลัยลักษณ์", province: "นครศรีธรรมราช", region: getRegion("นครศรีธรรมราช"), group: "รัฐบาล", count: 11698 },
  { name: "มหาวิทยาลัยธนบุรี", province: "กรุงเทพมหานคร", region: getRegion("กรุงเทพมหานคร"), group: "เอกชน", count: 8808 },
  { name: "มหาวิทยาลัยกรุงเทพธนบุรี", province: "กรุงเทพมหานคร", region: getRegion("กรุงเทพมหานคร"), group: "เอกชน", count: 8343 },
  { name: "มหาวิทยาลัยนอร์ทกรุงเทพ", province: "กรุงเทพมหานคร", region: getRegion("กรุงเทพมหานคร"), group: "เอกชน", count: 8002 },
  { name: "มหาวิทยาลัยภาคตะวันออกเฉียงเหนือ", province: "ขอนแก่น", region: getRegion("ขอนแก่น"), group: "เอกชน", count: 7752 },
  { name: "มหาวิทยาลัยพายัพ", province: "เชียงใหม่", region: getRegion("เชียงใหม่"), group: "เอกชน", count: 7590 },
  { name: "มหาวิทยาลัยหาดใหญ่", province: "สงขลา", region: getRegion("สงขลา"), group: "เอกชน", count: 6794 },
  { name: "สถาบันการจัดการปัญญาภิวัฒน์", province: "นนทบุรี", region: getRegion("นนทบุรี"), group: "เอกชน", count: 5777 },
  { name: "มหาวิทยาลัยอีสเทิร์นเอเชีย", province: "ปทุมธานี", region: getRegion("ปทุมธานี"), group: "เอกชน", count: 5268 },
  { name: "มหาวิทยาลัยวงษ์ชวลิตกุล", province: "นครราชสีมา", region: getRegion("นครราชสีมา"), group: "เอกชน", count: 4770 },
  { name: "สถาบันเทคโนโลยีไทย-ญี่ปุ่น", province: "กรุงเทพมหานคร", region: getRegion("กรุงเทพมหานคร"), group: "ต่างประเทศ", count: 4556 },
  { name: "มหาวิทยาลัยเกริก", province: "กรุงเทพมหานคร", region: getRegion("กรุงเทพมหานคร"), group: "เอกชน", count: 4143 },
  { name: "มหาวิทยาลัยเซนต์จอห์น", province: "กรุงเทพมหานคร", region: getRegion("กรุงเทพมหานคร"), group: "เอกชน", count: 3461 },
  { name: "มหาวิทยาลัยปทุมธานี", province: "ปทุมธานี", region: getRegion("ปทุมธานี"), group: "เอกชน", count: 3249 },
  { name: "มหาวิทยาลัยนครพนม", province: "นครพนม", region: getRegion("นครพนม"), group: "รัฐบาล", count: 2593 },
  { name: "มหาวิทยาลัยราชพฤกษ์", province: "นนทบุรี", region: getRegion("นนทบุรี"), group: "เอกชน", count: 2537 },
  { name: "มหาวิทยาลัยกาฬสินธุ์", province: "กาฬสินธุ์", region: getRegion("กาฬสินธุ์"), group: "รัฐบาล", count: 2403 },
  { name: "มหาวิทยาลัยฟาร์อีสเทอร์น", province: "เชียงใหม่", region: getRegion("เชียงใหม่"), group: "เอกชน", count: 2104 },
  { name: "มหาวิทยาลัยนานาชาติแสตมฟอร์ด", province: "กรุงเทพมหานคร", region: getRegion("กรุงเทพมหานคร"), group: "ต่างประเทศ", count: 2071 },
  { name: "มหาวิทยาลัยพิษณุโลก", province: "พิษณุโลก", region: getRegion("พิษณุโลก"), group: "เอกชน", count: 1984 },
  { name: "มหาวิทยาลัยเจ้าพระยา", province: "นครสวรรค์", region: getRegion("นครสวรรค์"), group: "เอกชน", count: 1911 },
  { name: "มหาวิทยาลัยกรุงเทพสุวรรณภูมิ", province: "กรุงเทพมหานคร", region: getRegion("กรุงเทพมหานคร"), group: "เอกชน", count: 1782 },
  { name: "มหาวิทยาลัยเฉลิมกาญจนา", province: "ศรีสะเกษ", region: getRegion("ศรีสะเกษ"), group: "เอกชน", count: 1757 },
  { name: "สถาบันเทคโนโลยีปทุมวัน", province: "กรุงเทพมหานคร", region: getRegion("กรุงเทพมหานคร"), group: "รัฐบาล", count: 1742 },
  { name: "สถาบันเทคโนโลยีเอเชีย", province: "ปทุมธานี", region: getRegion("ปทุมธานี"), group: "ต่างประเทศ", count: 1588 },
  { name: "มหาวิทยาลัยนอร์ท-เชียงใหม่", province: "เชียงใหม่", region: getRegion("เชียงใหม่"), group: "เอกชน", count: 1358 },
  { name: "มหาวิทยาลัยเซาธ์อีสท์บางกอก", province: "กรุงเทพมหานคร", region: getRegion("กรุงเทพมหานคร"), group: "เอกชน", count: 1332 },
  { name: "มหาวิทยาลัยนราธิวาสราชนครินทร์", province: "นราธิวาส", region: getRegion("นราธิวาส"), group: "รัฐบาล", count: 1266 },
  { name: "มหาวิทยาลัยเนชั่น", province: "ลำปาง", region: getRegion("ลำปาง"), group: "เอกชน", count: 1130 },
  { name: "มหาวิทยาลัยราชธานี", province: "อุบลราชธานี", region: getRegion("อุบลราชธานี"), group: "เอกชน", count: 1070 },
  { name: "มหาวิทยาลัยเวสเทิร์น", province: "กาญจนบุรี", region: getRegion("กาญจนบุรี"), group: "เอกชน", count: 954 },
  { name: "มหาวิทยาลัยตาปี", province: "สุราษฎร์ธานี", region: getRegion("สุราษฎร์ธานี"), group: "เอกชน", count: 787 },
  { name: "มหาวิทยาลัยคริสเตียน", province: "นครปฐม", region: getRegion("นครปฐม"), group: "เอกชน", count: 688 },
  { name: "มหาวิทยาลัยการจัดการและเทคโนโลยีอีสเทิร์น", province: "นนทบุรี", region: getRegion("นนทบุรี"), group: "เอกชน", count: 598 },
  { name: "มหาวิทยาลัยภาคกลาง", province: "นครสวรรค์", region: getRegion("นครสวรรค์"), group: "เอกชน", count: 528 },
  { name: "วิทยาลัยเซนต์หลุยส์", province: "กรุงเทพมหานคร", region: getRegion("กรุงเทพมหานคร"), group: "เอกชน", count: 424 },
  { name: "มหาวิทยาลัยเชียงราย", province: "เชียงราย", region: getRegion("เชียงราย"), group: "เอกชน", count: 388 },
  { name: "มหาวิทยาลัยนานาชาติเอเชีย-แปซิฟิก", province: "สระบุรี", region: getRegion("สระบุรี"), group: "ต่างประเทศ", count: 325 },
  { name: "สถาบันบัณฑิตบริหารธุรกิจศศินทร์", province: "กรุงเทพมหานคร", region: getRegion("กรุงเทพมหานคร"), group: "ต่างประเทศ", count: 286 },
  { name: "มหาวิทยาลัยชินวัตร", province: "ปทุมธานี", region: getRegion("ปทุมธานี"), group: "เอกชน", count: 255 },
  { name: "สถาบันเทคโนโลยีแห่งสุวรรณภูมิ", province: "สมุทรปราการ", region: getRegion("สมุทรปราการ"), group: "เอกชน", count: 164 },
  { name: "มหาวิทยาลัยเอเชียน", province: "ชลบุรี", region: getRegion("ชลบุรี"), group: "ต่างประเทศ", count: 151 },
  { name: "วิทยาลัยเทคโนโลยีจิตรลดา", province: "กรุงเทพมหานคร", region: getRegion("กรุงเทพมหานคร"), group: "รัฐบาล", count: 149 },
  { name: "วิทยาลัยเทคโนโลยีปทุมธานี", province: "กรุงเทพมหานคร", region: getRegion("กรุงเทพมหานคร"), group: "เอกชน", count: 133 },
  { name: "มหาวิทยาลัยเว็บสเตอร์ ประเทศไทย", province: "เพชรบุรี", region: getRegion("เพชรบุรี"), group: "ต่างประเทศ", count: 88 },
];


const LANDING_DATA: Record<Exclude<LandingCategoryKey, "university" | "premium">, { label: string; count: number }[]> = {
  career: [
    { label: "โลจิสติกส์ / ซัพพลายเชน", count: 236132 },
    { label: "การตลาด", count: 429551 },
    { label: "งานขาย", count: 545093 },
    { label: "บัญชี / การเงิน", count: 305864 },
    { label: "ไอที / โปรแกรมเมอร์", count: 183061 },
    { label: "วิศวกรรม", count: 378891 },
    { label: "ทรัพยากรบุคคล", count: 357180 },
    { label: "บริการลูกค้า", count: 546260 },
    { label: "จัดซื้อ", count: 185483 },
    { label: "ธุรการ", count: 743605 },
    { label: "ฝ่ายผลิต / ผลิตภัณฑ์", count: 352329 },
    { label: "บริหาร / ผู้จัดการ", count: 52226 },
    { label: "กฎหมาย", count: 70551 },
    { label: "การศึกษา / การฝึกอบรม", count: 205575 },
    { label: "เกษตรกร / แพทย์ / สาธารณสุข", count: 91133 },
    { label: "ออกแบบ / สถาปนิก", count: 142264 },
    { label: "ช่างเทคนิค", count: 235009 },
    { label: "การเงิน", count: 345786 },
    { label: "ท่องเที่ยว งานโรงแรม งานอาหาร", count: 261486 },
    { label: "สังคมสงเคราะห์", count: 31200 },
  ],
  location: [
    { label: "กรุงเทพมหานคร", count: 1240000 },
    { label: "นนทบุรี", count: 198400 },
    { label: "ปทุมธานี", count: 176200 },
    { label: "สมุทรปราการ", count: 210500 },
    { label: "ชลบุรี", count: 134700 },
    { label: "ภาคกลาง", count: 287600 },
    { label: "ภาคเหนือ", count: 192300 },
    { label: "ภาคตะวันออกเฉียงเหนือ", count: 245800 },
    { label: "ภาคตะวันออก", count: 163400 },
    { label: "ภาคใต้", count: 148900 },
  ],
  education: [
    { label: "ปริญญาตรี", count: 1820000 },
    { label: "ปริญญาโท", count: 432000 },
    { label: "ปวส / อนุปริญญา", count: 384000 },
    { label: "ปวช", count: 218000 },
    { label: "ปริญญาเอก", count: 42000 },
    { label: "มัธยมศึกษา / ต่ำกว่า", count: 265000 },
  ],
  experience: [
    { label: "ไม่มีประสบการณ์", count: 318000 },
    { label: "0–2 ปี", count: 542000 },
    { label: "3–5 ปี", count: 728000 },
    { label: "6–10 ปี", count: 614000 },
    { label: "10–15 ปี", count: 398000 },
    { label: "15+ ปี", count: 162000 },
  ],
  industry: [
    { label: "โลจิสติกส์", count: 312000 },
    { label: "ค้าปลีก / E-Commerce", count: 487000 },
    { label: "การผลิต", count: 428000 },
    { label: "ไอที / ซอฟต์แวร์", count: 294000 },
    { label: "การเงิน / ธนาคาร", count: 265000 },
    { label: "สุขภาพ / โรงพยาบาล", count: 198000 },
    { label: "อสังหาริมทรัพย์", count: 143000 },
    { label: "อาหารและเครื่องดื่ม", count: 236000 },
    { label: "ยานยนต์", count: 178000 },
    { label: "พลังงาน", count: 112000 },
  ],
};

const LOCATION_OPTIONS = [
  "กรุงเทพฯ", "นนทบุรี", "ปทุมธานี", "สมุทรปราการ", "ชลบุรี",
  "ระยอง", "เชียงใหม่", "ขอนแก่น", "นครราชสีมา", "ภูเก็ต",
  "Remote", "Hybrid", "ใกล้ BTS", "ใกล้ MRT",
];

function LocationDropdown({
  query, setQuery, selected, setSelected, open, setOpen,
}: {
  query: string;
  setQuery: (v: string) => void;
  selected: string;
  setSelected: (v: string) => void;
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [setOpen]);

  const filtered = LOCATION_OPTIONS.filter((o) =>
    o.toLowerCase().includes(query.toLowerCase())
  );

  const displayValue = selected && !open ? selected : query;

  return (
    <div ref={ref} className="relative">
      <MapPin className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none z-10" />
      <input
        type="text"
        value={displayValue}
        placeholder="เลือกหรือค้นหาพื้นที่ทำงาน"
        onFocus={() => { setOpen(true); if (selected) { setQuery(""); } }}
        onChange={(e) => { setQuery(e.target.value); setSelected(""); setOpen(true); }}
        className="w-full pl-8 pr-7 py-2 text-[12.5px] bg-[#F0F2F5] rounded-lg border border-transparent focus:outline-none focus:border-[#0DC2FF] focus:bg-white transition-all placeholder:text-gray-400"
      />
      <ChevronDown className={`absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none transition-transform ${open ? "rotate-180" : ""}`} />
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 p-2 max-h-64 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="px-3 py-2 text-sm text-gray-400 italic">ไม่พบผลลัพธ์</p>
          ) : (
            filtered.map((opt) => (
              <button
                key={opt}
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => { setSelected(opt); setQuery(""); setOpen(false); }}
                className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${selected === opt ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"}`}
              >
                {opt}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* University Insight Page                                               */
/* ------------------------------------------------------------------ */
const UNI_INSIGHTS: {
  icon: JSX.Element;
  title: string;
  desc: string;
  items: { label: string; count: number }[];
}[] = [
  {
    icon: <Briefcase className="w-4 h-4 text-[#127EE3]" />,
    title: "บริษัทที่ทำงาน",
    desc: "องค์กรที่ศิษย์เก่าทำงานมากที่สุด",
    items: [
      { label: "SCB (ไทยพาณิชย์)", count: 3840 },
      { label: "CP Group", count: 3210 },
      { label: "กสิกรไทย", count: 2980 },
      { label: "PTT", count: 2670 },
      { label: "True Corporation", count: 2510 },
    ],
  },
  {
    icon: <BarChart2 className="w-4 h-4 text-[#127EE3]" />,
    title: "สายอาชีพ",
    desc: "สายงานที่นิยมมากที่สุด",
    items: [
      { label: "วิศวกรรมซอฟต์แวร์", count: 9820 },
      { label: "การตลาด", count: 7650 },
      { label: "บัญชี / การเงิน", count: 6910 },
      { label: "HR", count: 4320 },
      { label: "บริหารโครงการ", count: 3890 },
    ],
  },
  {
    icon: <Building2 className="w-4 h-4 text-[#127EE3]" />,
    title: "ประเภทธุรกิจ",
    desc: "อุตสาหกรรมที่ศิษย์เก่าสังกัดมากที่สุด",
    items: [
      { label: "เทคโนโลยีสารสนเทศ", count: 12400 },
      { label: "ธนาคาร / การเงิน", count: 9800 },
      { label: "การผลิต / โรงงาน", count: 7300 },
      { label: "ค้าปลีก / E-commerce", count: 6200 },
      { label: "โทรคมนาคม", count: 5100 },
    ],
  },
  {
    icon: <BookOpen className="w-4 h-4 text-[#127EE3]" />,
    title: "คณะ",
    desc: "คณะที่มีผู้หางานมากที่สุด",
    items: [
      { label: "วิศวกรรมศาสตร์", count: 14200 },
      { label: "พาณิชยศาสตร์และการบัญชี", count: 10800 },
      { label: "รัฐศาสตร์", count: 8600 },
      { label: "วิทยาศาสตร์", count: 7400 },
      { label: "เศรษฐศาสตร์", count: 5900 },
    ],
  },
  {
    icon: <GraduationCap className="w-4 h-4 text-[#127EE3]" />,
    title: "วุฒิการศึกษา",
    desc: "ระดับปริญญาของผู้หางาน",
    items: [
      { label: "ปริญญาตรี", count: 43200 },
      { label: "ปริญญาโท", count: 10800 },
      { label: "ปริญญาเอก", count: 1800 },
      { label: "ปวส.", count: 900 },
      { label: "อื่นๆ", count: 204 },
    ],
  },
  {
    icon: <Music className="w-4 h-4 text-[#127EE3]" />,
    title: "ดนตรี กีฬา งานอดิเรก",
    desc: "ความสนใจพิเศษที่พบบ่อย",
    items: [
      { label: "ฟุตบอล / กีฬาทีม", count: 18400 },
      { label: "ดนตรี / ร้องเพลง", count: 12700 },
      { label: "ท่องเที่ยว", count: 11300 },
      { label: "ถ่ายภาพ", count: 7800 },
      { label: "ออกกำลังกาย / ฟิตเนส", count: 6200 },
    ],
  },
  {
    icon: <MapPin className="w-4 h-4 text-[#127EE3]" />,
    title: "พื้นที่ทำงาน",
    desc: "จังหวัด / เขตที่ทำงานมากที่สุด",
    items: [
      { label: "กรุงเทพมหานคร", count: 31200 },
      { label: "นนทบุรี / ปทุมธานี", count: 7400 },
      { label: "ชลบุรี", count: 4800 },
      { label: "เชียงใหม่", count: 3900 },
      { label: "สมุทรปราการ", count: 3600 },
    ],
  },
];

function UniversityInsightPage({
  university,
  onBack,
  onViewCandidates,
}: {
  university: UniversityEntry;
  onBack: () => void;
  onViewCandidates: () => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [gradYearFrom, setGradYearFrom] = useState("");
  const [gradYearTo, setGradYearTo] = useState("");

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir === "left" ? -340 : 340, behavior: "smooth" });
  };

  const maxCount = Math.max(...UNI_INSIGHTS[0].items.map((i) => i.count));

  return (
    <div className="flex-1 overflow-y-auto bg-[#F4F7FA]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-5">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-[12.5px] text-[#127EE3] font-semibold hover:text-[#0f6bc7] transition-colors mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          กลับไปหน้ารายชื่อมหาวิทยาลัย
        </button>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#EBF5FF] to-[#DCEFFE] flex items-center justify-center flex-shrink-0">
              <GraduationCap className="w-6 h-6 text-[#127EE3]" />
            </div>
            <div>
              <h1 className="text-[20px] font-bold text-[#1A1A2E] leading-snug">{university.name}</h1>
              <p className="text-[12.5px] text-gray-400 mt-0.5 flex items-center gap-1.5">
                <MapPin className="w-3 h-3" />{university.province}
                <span className="text-gray-300">·</span>
                <span className="px-2 py-0.5 bg-[#EBF5FF] text-[#127EE3] text-[11px] font-semibold rounded-full">{university.group}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onViewCandidates}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-[#01BFF9] to-[#019EFC] text-white text-[13px] font-bold rounded-xl hover:opacity-90 transition-opacity shadow-sm shadow-[#019EFC]/20 flex-shrink-0 whitespace-nowrap"
          >
            <Search className="w-4 h-4" />
            ดูผู้สมัคร
          </button>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6">
        {/* Count + description */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <p className="text-[13px] font-bold text-gray-400 uppercase tracking-widest mb-1">จำนวนผู้ศึกษาที่{university.name}</p>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-[36px] font-black text-[#127EE3] leading-none">{university.count.toLocaleString()}</span>
            <span className="text-[14px] text-gray-400 font-medium">คน</span>
          </div>
          <p className="text-[13px] text-gray-500 leading-relaxed">
            ผู้หางานอนุญาตให้ดูข้อมูลการติดต่อได้{" "}
            <span className="font-bold text-[#1A1A2E]">{university.count.toLocaleString()} คน</span>{" "}
            (ผู้หางานที่เหลือจะได้รับการเสนอตำแหน่งงานผ่านอีเมล และส่งมาสมัครเองเท่านั้น)
          </p>
        </div>

        {/* Graduation year filter */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays className="w-4 h-4 text-[#127EE3]" />
            <span className="text-[14px] font-semibold text-[#1A1A2E]">ปีที่จบการศึกษา</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5 block">เก่าสุด</label>
              <div className="relative">
                <select
                  value={gradYearFrom}
                  onChange={(e) => setGradYearFrom(e.target.value)}
                  className="w-full appearance-none pl-3 pr-8 py-2.5 text-[13px] bg-[#F4F7FA] border border-gray-200 rounded-xl focus:outline-none focus:border-[#0DC2FF] focus:ring-2 focus:ring-[#0DC2FF]/10 transition-all text-gray-700 cursor-pointer"
                >
                  <option value="">เลือกปี</option>
                  {Array.from({ length: 30 }, (_, i) => 2568 - i).map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div className="text-gray-300 font-bold mt-5">—</div>
            <div className="flex-1">
              <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5 block">ล่าสุด</label>
              <div className="relative">
                <select
                  value={gradYearTo}
                  onChange={(e) => setGradYearTo(e.target.value)}
                  className="w-full appearance-none pl-3 pr-8 py-2.5 text-[13px] bg-[#F4F7FA] border border-gray-200 rounded-xl focus:outline-none focus:border-[#0DC2FF] focus:ring-2 focus:ring-[#0DC2FF]/10 transition-all text-gray-700 cursor-pointer"
                >
                  <option value="">เลือกปี</option>
                  {Array.from({ length: 30 }, (_, i) => 2568 - i).map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Insight cards carousel */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-[14px] font-bold text-[#1A1A2E]">ข้อมูล Insight</p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => scroll("left")}
                className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:text-[#127EE3] hover:border-[#127EE3]/30 transition-all shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:text-[#127EE3] hover:border-[#127EE3]/30 transition-all shadow-sm"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto pb-2 scroll-smooth"
            style={{ scrollbarWidth: "none" }}
          >
            {UNI_INSIGHTS.map((insight) => {
              const top = insight.items[0].count;
              return (
                <div
                  key={insight.title}
                  className="flex-shrink-0 w-[300px] bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md hover:border-[#127EE3]/20 transition-all"
                >
                  <div className="flex items-center gap-2.5 mb-1">
                    <div className="w-7 h-7 rounded-lg bg-[#EBF5FF] flex items-center justify-center flex-shrink-0">
                      {insight.icon}
                    </div>
                    <p className="text-[13.5px] font-bold text-[#1A1A2E]">{insight.title}</p>
                  </div>
                  <p className="text-[11.5px] text-gray-400 mb-4">{insight.desc}</p>
                  <div className="space-y-3">
                    {insight.items.map((item) => {
                      const pct = Math.round((item.count / top) * 100);
                      return (
                        <div key={item.label}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[12.5px] text-gray-700 font-medium leading-snug">{item.label}</span>
                            <span className="text-[12px] font-bold text-[#127EE3] ml-2 flex-shrink-0">{item.count.toLocaleString()}</span>
                          </div>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-[#01BFF9] to-[#019EFC] rounded-full transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CandidateSearchPage({ onBack }: CandidateSearchPageProps) {
  const [activeTab, setActiveTab] = useState<TabType>("search");
  const [searchView, setSearchView] = useState<"landing" | "results">("landing");
  const [landingTab, setLandingTab] = useState<LandingCategoryKey>("career");
  const [uniSearch, setUniSearch] = useState("");
  const [uniGroupFilter, setUniGroupFilter] = useState<UniGroup | "">("");
  const [uniRegionFilter, setUniRegionFilter] = useState<UniRegion | "">("");
  const [selectedUniversity, setSelectedUniversity] = useState<UniversityEntry | null>(null);
  const [showFilters, setShowFilters] = useState(true);
  const [expertMode, setExpertMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  const [locationSelected, setLocationSelected] = useState("");
  const [locationDropdownOpen, setLocationDropdownOpen] = useState(false);

  const [showResumePanel, setShowResumePanel] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [activeCandidateForModal, setActiveCandidateForModal] = useState<Candidate | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set(BOOKMARKED_IDS));
  const [bookmarkByFilter, setBookmarkByFilter] = useState<string>("ทั้งหมด");
  const [bookmarkByDropdownOpen, setBookmarkByDropdownOpen] = useState(false);
  const bookmarkByRef = useRef<HTMLDivElement>(null);
  const [bookmarkSelected, setBookmarkSelected] = useState<Set<string>>(new Set());
  const [openedSelected, setOpenedSelected] = useState<Set<string>>(new Set());
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [forwardSource, setForwardSource] = useState<"bookmark" | "opened">("bookmark");
  const [forwardRecipient, setForwardRecipient] = useState("");
  const [forwardMessage, setForwardMessage] = useState("");
  const [openedByFilter, setOpenedByFilter] = useState<string>("ทั้งหมด");
  const [openedByDropdownOpen, setOpenedByDropdownOpen] = useState(false);
  const openedByRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (bookmarkByRef.current && !bookmarkByRef.current.contains(e.target as Node)) {
        setBookmarkByDropdownOpen(false);
      }
      if (openedByRef.current && !openedByRef.current.contains(e.target as Node)) {
        setOpenedByDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
    salary: [],
    career: [],
    experience: [],
    education: [],
    industry: [],
    schoolDomestic: [],
    schoolAbroad: [],
    faculty: [],
    gpa: [],
    gradYear: [],
    languages: [],
    hobbies: [],
    location: [],
    age: [],
    gender: [],
    vehicle: [],
    lastLogin: [],
    company: [],
  });

  const [activeFilterChips, setActiveFilterChips] = useState<ActiveFilter[]>([]);

  const toggleFilter = (category: string, value: string) => {
    setSelectedFilters((prev) => {
      const current = prev[category] || [];
      return {
        ...prev,
        [category]: current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value],
      };
    });
  };

  const removeChip = (id: string) => {
    setActiveFilterChips((prev) => prev.filter((c) => c.id !== id));
  };

  const clearAll = () => {
    setSelectedFilters({ salary: [], career: [], experience: [], education: [], industry: [], schoolDomestic: [], schoolAbroad: [], faculty: [], gpa: [], gradYear: [], languages: [], hobbies: [], location: [], age: [], gender: [], vehicle: [], lastLogin: [], company: [] });
    setActiveFilterChips([]);
  };

  const handleViewProfile = (candidate: Candidate) => {
    setActiveCandidateForModal(candidate);
    setShowResumePanel(true);
  };

  const handleContact = (candidate: Candidate) => {
    setActiveCandidateForModal(candidate);
    setShowMessageModal(true);
  };

  const handleToggleBookmark = (id: string) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  type SavedSearch = { id: string; query: string; results: number; date: string; newCount?: number };
  const [savedSearchIds, setSavedSearchIds] = useState<Set<string>>(new Set(["pin-1", "pin-2"]));
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([
    { id: "pin-1", query: "Logistics Manager 5+ ปี ต้องการ SAP", results: 248, date: "วันนี้ 09:15", newCount: 12 },
    { id: "pin-2", query: "Supply Chain Manager FMCG กรุงเทพ", results: 312, date: "เมื่อวาน 14:30", newCount: 8 },
  ]);
  const [searchJustSaved, setSearchJustSaved] = useState(false);

  const handleSaveSearch = () => {
    if (!searchQuery.trim()) return;
    const id = `saved-${Date.now()}`;
    const newSaved: SavedSearch = {
      id,
      query: searchQuery.trim(),
      results: estimatedCount,
      date: "เพิ่งบันทึก",
    };
    setSavedSearches((prev) => [newSaved, ...prev]);
    setSearchJustSaved(true);
    setTimeout(() => setSearchJustSaved(false), 2000);
  };

  const [historyItems, setHistoryItems] = useState(HISTORY_ITEMS);

  const handleDeleteHistory = (id: string) => {
    setHistoryItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handlePinFromHistory = (item: typeof HISTORY_ITEMS[number]) => {
    if (savedSearchIds.has(item.id)) return;
    setSavedSearchIds((prev) => new Set(prev).add(item.id));
    setSavedSearches((prev) => [
      { id: item.id, query: item.query, results: item.results, date: item.date },
      ...prev,
    ]);
  };

  const handleUnpin = (id: string) => {
    setSavedSearchIds((prev) => { const n = new Set(prev); n.delete(id); return n; });
    setSavedSearches((prev) => prev.filter((s) => s.id !== id));
  };

  const bookmarkedCandidates = CANDIDATES.filter((c) => bookmarkedIds.has(c.id));
  const openedCandidates = CANDIDATES.filter((c) => OPENED_IDS.includes(c.id));

  const totalActive = Object.values(selectedFilters).reduce((a, b) => a + b.length, 0);
  const estimatedCount = useMemo(() => estimateResultCount(selectedFilters), [selectedFilters]);
  const conflicts = useMemo(() => detectConflicts(selectedFilters), [selectedFilters]);
  const topImpacts = useMemo(() => getTopImpacts(selectedFilters), [selectedFilters]);
  const conflictedCategories = useMemo(() => new Set(conflicts.flatMap((c) => c.filters)), [conflicts]);

  const isTooStrict = totalActive > 0 && estimatedCount < 500;
  const isVeryStrict = totalActive > 0 && estimatedCount < 100;

  const tabs: { key: TabType; label: string; count?: number }[] = [
    { key: "search", label: "ค้นหา" },
    { key: "history", label: "ประวัติการค้นหา", count: historyItems.length },
    { key: "bookmarked", label: "บุ๊กมาร์กไว้", count: bookmarkedCandidates.length },
    { key: "opened", label: "เปิดดูแล้ว", count: openedCandidates.length },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="bg-white border-b border-gray-100 px-6 pt-5 flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-[22px] font-bold text-[#1A1A2E] leading-tight">ค้นหาผู้หางาน</h1>
            <div className="flex items-center gap-2.5 mt-1.5 flex-wrap">
              <span className="text-[12.5px] text-gray-500">
                พบ <span className="font-bold text-[#127EE3]">3,161,739</span> เรซูเม่
              </span>
              <span className="w-1 h-1 rounded-full bg-gray-300 flex-shrink-0" />
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EBF5FF] border border-[#C7E3FA]">
                <Zap className="w-3 h-3 text-[#127EE3]" />
                <span className="text-[11.5px] font-bold text-[#127EE3]">48 / 100 เครดิต</span>
              </div>
              <span className="text-[11.5px] text-gray-400">เปิดเรซูเม่ไม่เสียเครดิต · ค้นจากตำแหน่งงานฟรี</span>
            </div>
          </div>
        </div>

        <div className="flex gap-0">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => {
                setActiveTab(tab.key);
                if (tab.key === "search") setSearchView("landing");
              }}
              className={`relative px-4 py-2.5 text-[13px] font-medium transition-all border-b-2 -mb-px whitespace-nowrap ${
                activeTab === tab.key
                  ? "border-[#127EE3] text-[#127EE3] font-semibold"
                  : "border-transparent text-gray-400 hover:text-[#1A1A2E] hover:border-gray-200"
              }`}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span className={`ml-1.5 px-1.5 py-0.5 text-[10px] font-bold rounded-full ${activeTab === tab.key ? "bg-[#127EE3]/12 text-[#127EE3]" : "bg-gray-100 text-gray-500"}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {showResumePanel && (
        <ResumePanel
          onClose={() => setShowResumePanel(false)}
          onContact={activeCandidateForModal ? () => handleContact(activeCandidateForModal) : undefined}
        />
      )}
      {showMessageModal && activeCandidateForModal && (
        <MessageModal
          candidateTitle={activeCandidateForModal.title}
          candidateCompany={activeCandidateForModal.company}
          candidateExp={activeCandidateForModal.years}
          onClose={() => setShowMessageModal(false)}
        />
      )}

      {activeTab !== "search" && (
        <div className="flex-1 overflow-y-auto bg-[#F4F7FA] px-6 py-5">
          {activeTab === "history" && (
            <div className="space-y-6">
              {/* Saved searches section */}
              {savedSearches.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Pin className="w-4 h-4 text-[#127EE3]" />
                    <p className="text-[14.5px] font-bold text-[#1A1A2E]">การค้นหาที่บันทึกไว้</p>
                    <span className="text-[12px] text-gray-400 font-medium">{savedSearches.length} รายการ</span>
                  </div>
                  <div className="space-y-2">
                    {savedSearches.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white rounded-2xl border border-[#127EE3]/20 ring-1 ring-[#127EE3]/8 px-5 py-4 flex items-center justify-between hover:shadow-sm transition-all"
                      >
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-[#127EE3]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Pin className="w-3.5 h-3.5 text-[#127EE3]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-[14px] font-semibold text-[#1A1A2E] truncate">{item.query}</p>
                            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                              <span className="text-[12px] text-gray-400">{item.date} · ทั้งหมด {item.results.toLocaleString()} คน</span>
                              {(item.newCount ?? 0) > 0 ? (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#EBF5FF] text-[#127EE3] border border-[#C7E3FA]">ใหม่ {item.newCount} คน</span>
                              ) : (
                                <span className="text-[12px] text-gray-400">· ไม่มีรายการใหม่</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                          <button
                            onClick={() => {
                              setSearchQuery(item.query);
                              setSearchView("results");
                              setActiveTab("search");
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#127EE3]/8 text-[#127EE3] text-[12px] font-semibold hover:bg-[#127EE3]/15 transition-colors"
                          >
                            <Search className="w-3 h-3" />
                            ค้นหาอีกครั้ง
                          </button>
                          <button
                            onClick={() => handleUnpin(item.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 text-gray-500 text-[12px] font-medium hover:bg-red-50 hover:text-red-500 transition-colors border border-gray-100"
                          >
                            <PinOff className="w-3 h-3" />
                            ยกเลิกบันทึก
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Normal history section */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <History className="w-4 h-4 text-[#127EE3]" />
                  <p className="text-[14.5px] font-bold text-[#1A1A2E]">ประวัติการค้นหา</p>
                  <span className="text-[12px] text-gray-400 font-medium">{historyItems.length} รายการ</span>
                </div>
                <div className="space-y-2">
                  {historyItems.length === 0 && (
                    <div className="bg-white rounded-2xl border border-gray-100 px-5 py-8 flex flex-col items-center justify-center gap-2 text-center">
                      <History className="w-8 h-8 text-gray-200" />
                      <p className="text-[13px] text-gray-400">ยังไม่มีประวัติการค้นหา</p>
                    </div>
                  )}
                  {historyItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl border border-gray-100 px-5 py-4 flex items-center justify-between hover:shadow-sm transition-all"
                    >
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-[#F0F2F5] flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Search className="w-3.5 h-3.5 text-gray-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[14px] font-semibold text-[#1A1A2E] truncate">{item.query}</p>
                          <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                            <span className="text-[12px] text-gray-400">{item.date} · ทั้งหมด {item.results.toLocaleString()} คน</span>
                            {item.newCount > 0 ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#EBF5FF] text-[#127EE3] border border-[#C7E3FA]">ใหม่ {item.newCount} คน</span>
                            ) : (
                              <span className="text-[12px] text-gray-400">· ไม่มีรายการใหม่</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0 ml-3">
                        <button
                          onClick={() => {
                            setSearchQuery(item.query);
                            setSearchView("results");
                            setActiveTab("search");
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#127EE3]/8 text-[#127EE3] text-[12px] font-semibold hover:bg-[#127EE3]/15 transition-colors"
                        >
                          <Search className="w-3 h-3" />
                          ค้นหาอีกครั้ง
                        </button>
                        <button
                          onClick={() => handlePinFromHistory(item)}
                          disabled={savedSearchIds.has(item.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium border transition-colors ${
                            savedSearchIds.has(item.id)
                              ? "bg-[#127EE3]/8 text-[#127EE3] border-[#127EE3]/20 cursor-default"
                              : "bg-gray-50 text-gray-500 border-gray-100 hover:bg-[#127EE3]/8 hover:text-[#127EE3] hover:border-[#127EE3]/20"
                          }`}
                        >
                          <Pin className="w-3 h-3" />
                          {savedSearchIds.has(item.id) ? "บันทึกแล้ว" : "บันทึกไว้ด้านบน"}
                        </button>
                        <button
                          onClick={() => handleDeleteHistory(item.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 border border-transparent hover:border-red-100 transition-colors"
                        >
                          <Trash2 className="w-3 h-3" />
                          ลบประวัติ
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "bookmarked" && (() => {
            const BOOKMARK_BY_OPTIONS = ["ทั้งหมด", "ฉัน", "ทีม HR", "คุณแพม", "คุณกิ๊ก"];
            const filteredBookmarks = bookmarkedCandidates.filter((c) =>
              bookmarkByFilter === "ทั้งหมด" || BOOKMARKED_BY[c.id] === bookmarkByFilter
            );
            const filteredIds = filteredBookmarks.map((c) => c.id);
            const allSelected = filteredIds.length > 0 && filteredIds.every((id) => bookmarkSelected.has(id));
            const someSelected = filteredIds.some((id) => bookmarkSelected.has(id));

            const toggleSelectAll = () => {
              if (allSelected) {
                setBookmarkSelected((prev) => {
                  const next = new Set(prev);
                  filteredIds.forEach((id) => next.delete(id));
                  return next;
                });
              } else {
                setBookmarkSelected((prev) => new Set([...prev, ...filteredIds]));
              }
            };

            const toggleOne = (id: string) => {
              setBookmarkSelected((prev) => {
                const next = new Set(prev);
                next.has(id) ? next.delete(id) : next.add(id);
                return next;
              });
            };

            const selectedInView = filteredIds.filter((id) => bookmarkSelected.has(id));
            const selectedCount = selectedInView.length;

            const handleBulkRemove = () => {
              selectedInView.forEach((id) => {
                setBookmarkedIds((prev) => { const next = new Set(prev); next.delete(id); return next; });
              });
              setBookmarkSelected((prev) => {
                const next = new Set(prev);
                selectedInView.forEach((id) => next.delete(id));
                return next;
              });
            };

            return (
              <div>
                {/* Header row */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Bookmark className="w-4 h-4 text-[#127EE3]" />
                    <p className="text-[14.5px] font-bold text-[#1A1A2E]">บุ๊กมาร์กไว้</p>
                    <span className="text-[12px] text-gray-400 font-medium">{filteredBookmarks.length} คน</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] text-gray-400">ผู้ที่บุ๊กมาร์ก:</span>
                    <div ref={bookmarkByRef} className="relative">
                      <button
                        type="button"
                        onClick={() => setBookmarkByDropdownOpen((o) => !o)}
                        className={`flex items-center gap-2 pl-3 pr-2.5 py-1.5 text-[12.5px] bg-white border rounded-lg transition-all cursor-pointer ${bookmarkByDropdownOpen ? "border-[#0DC2FF]" : "border-gray-200 hover:border-[#127EE3]/40"} text-gray-700`}
                      >
                        <span className={bookmarkByFilter !== "ทั้งหมด" ? "text-blue-700 font-medium" : ""}>{bookmarkByFilter}</span>
                        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${bookmarkByDropdownOpen ? "rotate-180" : ""}`} />
                      </button>
                      {bookmarkByDropdownOpen && (
                        <div className="absolute top-full right-0 mt-1 w-36 bg-white border border-gray-200 rounded-xl shadow-lg z-50 p-2">
                          {BOOKMARK_BY_OPTIONS.map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => { setBookmarkByFilter(opt); setBookmarkByDropdownOpen(false); }}
                              className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${opt === bookmarkByFilter ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"}`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bulk action bar */}
                {selectedCount > 0 && (
                  <div className="flex items-center justify-between px-4 py-2.5 mb-3 bg-[#EBF5FF] border border-[#127EE3]/20 rounded-xl">
                    <span className="text-[13px] font-medium text-[#127EE3]">เลือกแล้ว {selectedCount} รายการ</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => { setForwardSource("bookmark"); setShowForwardModal(true); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-[12.5px] font-medium text-[#127EE3] bg-white border border-[#127EE3]/30 rounded-lg hover:bg-[#127EE3] hover:text-white transition-all"
                      >
                        <Send className="w-3.5 h-3.5" />
                        ส่งต่อให้ผู้อื่น
                      </button>
                      <button
                        type="button"
                        onClick={handleBulkRemove}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-[12.5px] font-medium text-red-500 bg-white border border-red-200 rounded-lg hover:bg-red-500 hover:text-white transition-all"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        เอาบุ๊กมาร์กออก
                      </button>
                    </div>
                  </div>
                )}

                {filteredBookmarks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-white border border-gray-200 flex items-center justify-center mb-3 shadow-sm">
                      <BookmarkPlus className="w-6 h-6 text-gray-300" />
                    </div>
                    <p className="text-[14px] font-semibold text-gray-400">ยังไม่มีบุ๊กมาร์ก</p>
                    <p className="text-[12px] text-gray-400 mt-1">
                      {bookmarkByFilter === "ทั้งหมด"
                        ? "กดไอคอนบุ๊กมาร์กที่ card ผู้สมัครเพื่อบันทึกไว้"
                        : `ไม่มีบุ๊กมาร์กจาก ${bookmarkByFilter}`}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Select all row */}
                    <label className="flex items-center gap-2.5 px-1 cursor-pointer select-none">
                      <button
                        type="button"
                        onClick={toggleSelectAll}
                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0 ${allSelected ? "bg-[#127EE3] border-[#127EE3]" : someSelected ? "bg-[#127EE3]/20 border-[#127EE3]" : "border-gray-300 hover:border-[#127EE3]"}`}
                      >
                        {allSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                        {someSelected && !allSelected && <div className="w-2 h-0.5 bg-[#127EE3] rounded-full" />}
                      </button>
                      <span className="text-[12.5px] text-gray-500 font-medium">เลือกทั้งหมด</span>
                    </label>

                    {filteredBookmarks.map((candidate) => (
                      <CandidateCard
                        key={candidate.id}
                        candidate={candidate}
                        interactable={OPENED_IDS.includes(candidate.id)}
                        revealed={OPENED_IDS.includes(candidate.id)}
                        bookmarked={bookmarkedIds.has(candidate.id)}
                        selected={bookmarkSelected.has(candidate.id)}
                        onSelect={() => toggleOne(candidate.id)}
                        onView={() => handleViewProfile(candidate)}
                        onBookmark={() => handleToggleBookmark(candidate.id)}
                      />
                    ))}
                  </div>
                )}

              </div>
            );
          })()}

          {activeTab === "opened" && (() => {
            const OPENED_BY_OPTIONS = ["ทั้งหมด", "ฉัน", "ทีม HR", "คุณแพม", "คุณกิ๊ก"];
            const filteredOpened = openedCandidates.filter((c) =>
              openedByFilter === "ทั้งหมด" || VIEWED_BY[c.id] === openedByFilter
            );
            const filteredOpenedIds = filteredOpened.map((c) => c.id);
            const allOpenedSelected = filteredOpenedIds.length > 0 && filteredOpenedIds.every((id) => openedSelected.has(id));
            const someOpenedSelected = filteredOpenedIds.some((id) => openedSelected.has(id));
            const selectedOpenedInView = filteredOpenedIds.filter((id) => openedSelected.has(id));
            const selectedOpenedCount = selectedOpenedInView.length;

            const toggleOpenedSelectAll = () => {
              if (allOpenedSelected) {
                setOpenedSelected((prev) => { const next = new Set(prev); filteredOpenedIds.forEach((id) => next.delete(id)); return next; });
              } else {
                setOpenedSelected((prev) => new Set([...prev, ...filteredOpenedIds]));
              }
            };

            const toggleOpenedOne = (id: string) => {
              setOpenedSelected((prev) => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });
            };

            return (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-[#127EE3]" />
                    <p className="text-[14.5px] font-bold text-[#1A1A2E]">เปิดดูแล้ว</p>
                    <span className="text-[12px] text-gray-400 font-medium">{filteredOpened.length} คน</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] text-gray-400">ผู้ที่เปิดดู:</span>
                    <div ref={openedByRef} className="relative">
                      <button
                        type="button"
                        onClick={() => setOpenedByDropdownOpen((o) => !o)}
                        className={`flex items-center gap-2 pl-3 pr-2.5 py-1.5 text-[12.5px] bg-white border rounded-lg transition-all cursor-pointer ${openedByDropdownOpen ? "border-[#0DC2FF]" : "border-gray-200 hover:border-[#127EE3]/40"} text-gray-700`}
                      >
                        <span className={openedByFilter !== "ทั้งหมด" ? "text-blue-700 font-medium" : ""}>{openedByFilter}</span>
                        <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${openedByDropdownOpen ? "rotate-180" : ""}`} />
                      </button>
                      {openedByDropdownOpen && (
                        <div className="absolute top-full right-0 mt-1 w-36 bg-white border border-gray-200 rounded-xl shadow-lg z-50 p-2">
                          {OPENED_BY_OPTIONS.map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => { setOpenedByFilter(opt); setOpenedByDropdownOpen(false); }}
                              className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${opt === openedByFilter ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"}`}
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bulk action bar */}
                {selectedOpenedCount > 0 && (
                  <div className="flex items-center justify-between px-4 py-2.5 mb-3 bg-[#EBF5FF] border border-[#127EE3]/20 rounded-xl">
                    <span className="text-[13px] font-medium text-[#127EE3]">เลือกแล้ว {selectedOpenedCount} รายการ</span>
                    <button
                      type="button"
                      onClick={() => { setForwardSource("opened"); setShowForwardModal(true); }}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-[12.5px] font-medium text-[#127EE3] bg-white border border-[#127EE3]/30 rounded-lg hover:bg-[#127EE3] hover:text-white transition-all"
                    >
                      <Send className="w-3.5 h-3.5" />
                      ส่งต่อให้ผู้อื่น
                    </button>
                  </div>
                )}

                {filteredOpened.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="w-14 h-14 rounded-2xl bg-white border border-gray-200 flex items-center justify-center mb-3 shadow-sm">
                      <Eye className="w-6 h-6 text-gray-300" />
                    </div>
                    <p className="text-[14px] font-semibold text-gray-400">ไม่พบผู้สมัคร</p>
                    <p className="text-[12px] text-gray-400 mt-1">
                      {openedByFilter === "ทั้งหมด" ? "ยังไม่มีโปรไฟล์ที่เปิดดู" : `ไม่มีการเปิดดูจาก ${openedByFilter}`}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Select all row */}
                    <label className="flex items-center gap-2.5 px-1 cursor-pointer select-none">
                      <button
                        type="button"
                        onClick={toggleOpenedSelectAll}
                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0 ${allOpenedSelected ? "bg-[#127EE3] border-[#127EE3]" : someOpenedSelected ? "bg-[#127EE3]/20 border-[#127EE3]" : "border-gray-300 hover:border-[#127EE3]"}`}
                      >
                        {allOpenedSelected && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
                        {someOpenedSelected && !allOpenedSelected && <div className="w-2 h-0.5 bg-[#127EE3] rounded-full" />}
                      </button>
                      <span className="text-[12.5px] text-gray-500 font-medium">เลือกทั้งหมด</span>
                    </label>

                    {filteredOpened.map((candidate) => (
                      <CandidateCard
                        key={candidate.id}
                        candidate={candidate}
                        interactable={true}
                        revealed={true}
                        bookmarked={bookmarkedIds.has(candidate.id)}
                        selected={openedSelected.has(candidate.id)}
                        onSelect={() => toggleOpenedOne(candidate.id)}
                        onView={() => handleViewProfile(candidate)}
                        onBookmark={() => handleToggleBookmark(candidate.id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}

      {/* Shared forward modal */}
      {showForwardModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowForwardModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[17px] font-bold text-[#1A1A2E]">ส่งต่อเรซูเม่</h3>
              <button
                type="button"
                onClick={() => setShowForwardModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[12.5px] text-gray-400 mb-5">
              ส่งต่อเรซูเม่ {forwardSource === "bookmark"
                ? [...bookmarkSelected].filter((id) => bookmarkedCandidates.some((c) => c.id === id)).length
                : openedSelected.size} คนให้ผู้รับที่เลือก
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-[13px] font-semibold text-[#1A1A2E] mb-1.5">ผู้รับ / อีเมลผู้รับ <span className="text-red-400">*</span></label>
                <input
                  type="text"
                  value={forwardRecipient}
                  onChange={(e) => setForwardRecipient(e.target.value)}
                  placeholder="ชื่อหรืออีเมลผู้รับ"
                  className="w-full px-3.5 py-2.5 text-[13.5px] bg-[#F8F9FB] border border-gray-200 rounded-xl focus:outline-none focus:border-[#0DC2FF] focus:bg-white transition-all placeholder:text-gray-400"
                />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-[#1A1A2E] mb-1.5">ข้อความเพิ่มเติม <span className="text-[12px] text-gray-400 font-normal">(ไม่บังคับ)</span></label>
                <textarea
                  value={forwardMessage}
                  onChange={(e) => setForwardMessage(e.target.value)}
                  placeholder="เพิ่มข้อความสั้น ๆ ให้ผู้รับ..."
                  rows={3}
                  className="w-full px-3.5 py-2.5 text-[13.5px] bg-[#F8F9FB] border border-gray-200 rounded-xl focus:outline-none focus:border-[#0DC2FF] focus:bg-white transition-all placeholder:text-gray-400 resize-none"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setShowForwardModal(false)}
                className="flex-1 py-2.5 text-[13.5px] font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForwardModal(false);
                  if (forwardSource === "bookmark") setBookmarkSelected(new Set());
                  else setOpenedSelected(new Set());
                  setForwardRecipient("");
                  setForwardMessage("");
                }}
                className="flex-1 py-2.5 text-[13.5px] font-medium text-white rounded-xl transition-all bg-gradient-to-r from-[#01BFF9] to-[#019EFC] hover:shadow-md hover:shadow-[#127EE3]/20 flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                ส่งต่อ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search Landing Page */}
      {activeTab === "search" && searchView === "landing" && selectedUniversity && (
        <UniversityInsightPage
          university={selectedUniversity}
          onBack={() => setSelectedUniversity(null)}
          onViewCandidates={() => {
            toggleFilter("schoolDomestic", selectedUniversity.name);
            setSelectedUniversity(null);
            setSearchView("results");
          }}
        />
      )}

      {activeTab === "search" && searchView === "landing" && !selectedUniversity && (
        <div className="flex-1 overflow-y-auto bg-[#F4F7FA]">
          {/* Search bar */}
          <div className="bg-white border-b border-gray-100 px-6 py-5">
            <div className="flex gap-2.5">
              <div className="flex-1 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="ชื่อตำแหน่งงาน เช่น Logistics Manager, Supply Chain"
                  className="w-full pl-10 pr-4 py-3 text-[13.5px] bg-[#F4F7FA] border border-gray-200 rounded-xl focus:outline-none focus:border-[#0DC2FF] focus:bg-white focus:ring-2 focus:ring-[#0DC2FF]/10 transition-all placeholder:text-gray-400"
                  onKeyDown={(e) => e.key === "Enter" && setSearchView("results")}
                />
              </div>
              <button
                onClick={() => setSearchView("results")}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#01BFF9] to-[#019EFC] hover:opacity-90 text-white text-[13.5px] font-bold rounded-xl transition-all shadow-sm shadow-[#019EFC]/20 flex-shrink-0"
              >
                <Search className="w-4 h-4" />
                ค้นหา
              </button>
            </div>
          </div>

          {/* Category explorer */}
          <div className="px-6 py-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="w-4 h-4 text-gray-400" />
              <p className="text-[13.5px] font-semibold text-[#1A1A2E]">เลือกดูผู้สมัครตามหมวดหมู่</p>
            </div>

            {/* Landing tabs */}
            <div className="flex gap-2 flex-wrap mb-5">
              {LANDING_TABS.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setLandingTab(t.key)}
                  className={`px-4 py-1.5 rounded-full text-[12.5px] font-semibold border transition-all ${
                    landingTab === t.key
                      ? "bg-[#127EE3] text-white border-[#127EE3] shadow-sm shadow-[#127EE3]/20"
                      : "bg-white text-gray-600 border-gray-200 hover:border-[#127EE3]/50 hover:text-[#127EE3]"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Grid cards — regular tabs */}
            {landingTab !== "university" && landingTab !== "premium" && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {LANDING_DATA[landingTab as Exclude<LandingCategoryKey, "university" | "premium">].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => {
                      toggleFilter(
                        landingTab === "location" ? "location"
                        : landingTab === "education" ? "education"
                        : landingTab === "industry" ? "industry"
                        : "career",
                        item.label
                      );
                      setSearchView("results");
                    }}
                    className="bg-white border border-gray-100 rounded-xl p-4 text-left hover:border-[#127EE3]/30 hover:shadow-md hover:-translate-y-0.5 transition-all group"
                  >
                    <p className="text-[13px] font-semibold text-[#1A1A2E] mb-2 group-hover:text-[#127EE3] transition-colors leading-snug">
                      {item.label}
                    </p>
                    <p className="text-[13px] font-bold text-[#127EE3]">
                      {item.count.toLocaleString()} <span className="text-[11px] font-medium text-gray-400">คน</span>
                    </p>
                  </button>
                ))}
              </div>
            )}

            {/* Premium profiles tab */}
            {landingTab === "premium" && (
              <div className="space-y-6">
                {PREMIUM_SECTIONS.map((section) => (
                  <div key={section.title}>
                    <p className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider mb-3">{section.title}</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                      {section.items.map((item) => (
                        <button
                          key={item.label}
                          onClick={() => {
                            toggleFilter("career", item.label);
                            setSearchView("results");
                          }}
                          className="bg-white border border-gray-100 rounded-xl p-4 text-left hover:border-[#127EE3]/30 hover:shadow-md hover:-translate-y-0.5 transition-all group"
                        >
                          <p className="text-[13px] font-semibold text-[#1A1A2E] mb-2 group-hover:text-[#127EE3] transition-colors leading-snug">
                            {item.label}
                          </p>
                          <p className="text-[13px] font-bold text-[#127EE3]">
                            {item.count.toLocaleString()} <span className="text-[11px] font-medium text-gray-400">คน</span>
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* University tab */}
            {landingTab === "university" && (() => {
              const UNI_GROUPS: UniGroup[] = ["รัฐบาล", "สามพระจอม", "ราชภัฏ", "ราชมงคล", "เอกชน", "ต่างประเทศ"];
              const UNI_REGIONS: UniRegion[] = [
                "กรุงเทพฯ และปริมณฑล", "ภาคกลาง", "ภาคเหนือ",
                "ภาคตะวันออกเฉียงเหนือ", "ภาคตะวันออก", "ภาคตะวันตก", "ภาคใต้",
              ];
              const filteredUnis = UNIVERSITIES.filter((u) => {
                const matchName = uniSearch === "" || u.name.includes(uniSearch);
                const matchGroup = uniGroupFilter === "" || u.group === uniGroupFilter;
                const matchRegion = uniRegionFilter === "" || u.region === uniRegionFilter;
                return matchName && matchGroup && matchRegion;
              });
              const hasFilters = uniSearch || uniGroupFilter || uniRegionFilter;
              return (
                <div>
                  {/* Filter row: dropdowns + search */}
                  <div className="flex gap-2 mb-4 flex-wrap">
                    {/* ประเภท dropdown */}
                    <div className="relative">
                      <select
                        value={uniGroupFilter}
                        onChange={(e) => setUniGroupFilter(e.target.value as UniGroup | "")}
                        className="appearance-none pl-3 pr-8 py-2.5 text-[13px] bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#0DC2FF] focus:ring-2 focus:ring-[#0DC2FF]/10 transition-all text-gray-700 cursor-pointer hover:border-[#127EE3]/40"
                      >
                        <option value="">ประเภท: ทั้งหมด</option>
                        {UNI_GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                    </div>
                    {/* ภูมิภาค dropdown */}
                    <div className="relative">
                      <select
                        value={uniRegionFilter}
                        onChange={(e) => setUniRegionFilter(e.target.value as UniRegion | "")}
                        className="appearance-none pl-3 pr-8 py-2.5 text-[13px] bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#0DC2FF] focus:ring-2 focus:ring-[#0DC2FF]/10 transition-all text-gray-700 cursor-pointer hover:border-[#127EE3]/40"
                      >
                        <option value="">ภูมิภาค: ทั้งหมด</option>
                        {UNI_REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                      </select>
                      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                    </div>
                    {/* Search */}
                    <div className="relative flex-1 min-w-[180px]">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                      <input
                        type="text"
                        value={uniSearch}
                        onChange={(e) => setUniSearch(e.target.value)}
                        placeholder="ค้นหาชื่อมหาวิทยาลัย..."
                        className="w-full pl-9 pr-3 py-2.5 text-[13px] bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#0DC2FF] focus:ring-2 focus:ring-[#0DC2FF]/10 transition-all placeholder:text-gray-400"
                      />
                    </div>
                    {hasFilters && (
                      <button
                        onClick={() => { setUniSearch(""); setUniGroupFilter(""); setUniRegionFilter(""); }}
                        className="flex items-center gap-1 px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-400 hover:text-[#127EE3] hover:border-[#127EE3]/30 text-[12px] transition-all"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        ล้าง
                      </button>
                    )}
                  </div>
                  <p className="text-[12px] text-gray-400 mb-3">{filteredUnis.length} มหาวิทยาลัย</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                    {filteredUnis.map((uni) => (
                      <button
                        key={uni.name}
                        onClick={() => setSelectedUniversity(uni)}
                        className="bg-white border border-gray-100 rounded-xl p-3 text-left hover:border-[#127EE3]/30 hover:shadow-md hover:-translate-y-0.5 transition-all group flex flex-col gap-2"
                      >
                        {/* Logo placeholder */}
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#EBF5FF] to-[#DCEFFE] flex items-center justify-center flex-shrink-0 group-hover:from-[#D6EDFF] group-hover:to-[#C3E3FF] transition-all">
                          <GraduationCap className="w-5 h-5 text-[#127EE3]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-semibold text-[#1A1A2E] leading-snug group-hover:text-[#127EE3] transition-colors line-clamp-2 mb-1">
                            {uni.name}
                          </p>
                          <p className="text-[11px] text-gray-400 mb-1.5 flex items-center gap-1">
                            <MapPin className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{uni.province}</span>
                          </p>
                          <p className="text-[12px] font-bold text-[#127EE3]">
                            {uni.count.toLocaleString()} <span className="text-[11px] font-medium text-gray-400">คน</span>
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      <div className={`flex flex-1 min-h-0 overflow-hidden ${activeTab !== "search" || searchView !== "results" ? "hidden" : ""}`}>
        {showFilters && (
          <aside className="w-[265px] flex-shrink-0 bg-white border-r border-gray-100 flex flex-col overflow-y-auto">
            <div className="px-4 py-3.5 border-b border-gray-100 sticky top-0 bg-white z-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#127EE3]" />
                  <span className="text-[13.5px] font-bold text-[#1A1A2E]">ตัวกรอง</span>
                  {totalActive > 0 && (
                    <span className="w-5 h-5 rounded-full bg-[#127EE3] text-white text-[10px] font-bold flex items-center justify-center">
                      {totalActive}
                    </span>
                  )}
                </div>
                {totalActive > 0 && (
                  <button
                    onClick={clearAll}
                    className="flex items-center gap-1 text-[11.5px] text-gray-400 hover:text-[#127EE3] transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    ล้างทั้งหมด
                  </button>
                )}
              </div>
            </div>

            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">ชื่อตำแหน่ง</p>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="เช่น Logistics Manager"
                  className="w-full pl-8 pr-3 py-2 text-[12.5px] bg-[#F0F2F5] rounded-lg border border-transparent focus:outline-none focus:border-[#0DC2FF] focus:bg-white transition-all placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">คำค้นหา</p>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="ทักษะ, เครื่องมือ, ฯลฯ"
                  className="w-full pl-8 pr-3 py-2 text-[12.5px] bg-[#F0F2F5] rounded-lg border border-transparent focus:outline-none focus:border-[#0DC2FF] focus:bg-white transition-all placeholder:text-gray-400"
                />
              </div>
            </div>

            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">พื้นที่ทำงานที่ต้องการ</p>
              <LocationDropdown
                query={locationQuery}
                setQuery={setLocationQuery}
                selected={locationSelected}
                setSelected={setLocationSelected}
                open={locationDropdownOpen}
                setOpen={setLocationDropdownOpen}
              />
            </div>

            <div className="flex-1">

              {(conflicts.length > 0 || isTooStrict) && (
                <div className="mx-3 mt-3 mb-1 space-y-2">
                  {isVeryStrict && (
                    <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2.5">
                      <div className="flex items-start gap-2 mb-2">
                        <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
                        <p className="text-[12px] font-semibold text-red-700">Filter เข้มงวดเกินไป</p>
                      </div>
                      <p className="text-[11.5px] text-red-600 mb-2">เหลือผู้สมัครน้อยมาก ลองผ่อนคลาย filter เหล่านี้:</p>
                      <div className="space-y-1">
                        {topImpacts.map((imp) => (
                          <div key={imp.category} className="flex items-center justify-between">
                            <span className="text-[11px] text-red-700 font-medium">{imp.label}</span>
                            <button
                              onClick={() => toggleFilter(imp.category, selectedFilters[imp.category]?.[0] ?? "")}
                              className="text-[10.5px] text-red-500 hover:text-red-700 underline"
                            >
                              ผ่อนคลาย
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {!isVeryStrict && isTooStrict && (
                    <div className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2.5">
                      <div className="flex items-start gap-2 mb-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <p className="text-[12px] font-semibold text-amber-800">ผลลัพธ์น้อยกว่าที่ควร</p>
                      </div>
                      <div className="space-y-1">
                        {topImpacts.map((imp) => (
                          <div key={imp.category} className="flex items-center gap-1.5">
                            <TrendingDown className="w-3 h-3 text-amber-500 flex-shrink-0" />
                            <span className="text-[11.5px] text-amber-700">{imp.label} ตัดออก ~{imp.removedPct}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {conflicts.map((c, i) => (
                    <div key={i} className="rounded-lg bg-orange-50 border border-orange-200 px-3 py-2.5 flex items-start gap-2">
                      <Lightbulb className="w-3.5 h-3.5 text-orange-500 flex-shrink-0 mt-0.5" />
                      <p className="text-[11.5px] text-orange-700">{c.message}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="px-4 pt-3 pb-1">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">ตัวกรองผลการค้นหา</p>
              </div>
              <FilterSection
                title="เงินเดือนปัจจุบัน"
                options={FILTER_OPTIONS.salary}
                selected={selectedFilters.salary}
                onToggle={(v) => toggleFilter("salary", v)}
                currentResultCount={estimatedCount}
                isConflicted={conflictedCategories.has("salary")}
              />
              <FilterSection
                title="สายอาชีพ"
                options={FILTER_OPTIONS.career}
                selected={selectedFilters.career}
                onToggle={(v) => toggleFilter("career", v)}
                currentResultCount={estimatedCount}
                isConflicted={conflictedCategories.has("career")}
              />
              <FilterSection
                title="ปีประสบการณ์"
                options={FILTER_OPTIONS.experience}
                selected={selectedFilters.experience}
                onToggle={(v) => toggleFilter("experience", v)}
                currentResultCount={estimatedCount}
                isConflicted={conflictedCategories.has("experience")}
              />
              <FilterSection
                title="วุฒิการศึกษา"
                options={FILTER_OPTIONS.education}
                selected={selectedFilters.education}
                onToggle={(v) => toggleFilter("education", v)}
                currentResultCount={estimatedCount}
                isConflicted={conflictedCategories.has("education")}
              />
              <FilterSection
                title="ประเภทธุรกิจ"
                options={FILTER_OPTIONS.industry}
                selected={selectedFilters.industry}
                onToggle={(v) => toggleFilter("industry", v)}
                currentResultCount={estimatedCount}
                isConflicted={conflictedCategories.has("industry")}
              />

              <div className="px-4 pt-4 pb-2 flex items-center justify-between">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">ตัวกรองขั้นสูง</p>
                <button
                  onClick={() => setExpertMode((v) => !v)}
                  className={`flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-all ${
                    expertMode
                      ? "bg-[#127EE3] text-white border-[#127EE3]"
                      : "bg-white text-gray-500 border-gray-200 hover:border-[#127EE3] hover:text-[#127EE3]"
                  }`}
                >
                  {expertMode ? "ซ่อน" : "เปิดใช้"}
                </button>
              </div>

              {!expertMode && (
                <div className="mx-3 mb-3 rounded-lg bg-[#F0F2F5] px-3 py-2.5 flex items-start gap-2">
                  <Info className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
                  <p className="text-[11.5px] text-gray-500">
                    Filter ขั้นสูง เช่น สถาบัน, เกรด, งานอดิเรก — เปิดใช้เมื่อต้องการคัดเฉพาะเจาะจงมากขึ้น
                  </p>
                </div>
              )}

              {expertMode && (
                <>
                  <div className="px-4 pt-1 pb-1">
                    <p className="text-[11.5px] font-semibold text-gray-500">การศึกษา</p>
                  </div>
                  <FilterSection
                    title="สถาบันการศึกษา (ในประเทศ)"
                    options={FILTER_OPTIONS.schoolDomestic}
                    selected={selectedFilters.schoolDomestic}
                    onToggle={(v) => toggleFilter("schoolDomestic", v)}
                    currentResultCount={estimatedCount}
                    isConflicted={conflictedCategories.has("schoolDomestic")}
                  />
                  <FilterSection
                    title="สถาบันการศึกษา (ต่างประเทศ)"
                    options={FILTER_OPTIONS.schoolAbroad}
                    selected={selectedFilters.schoolAbroad}
                    onToggle={(v) => toggleFilter("schoolAbroad", v)}
                    currentResultCount={estimatedCount}
                    isConflicted={conflictedCategories.has("schoolAbroad")}
                  />
                  <FilterSection
                    title="คณะในสายงาน"
                    options={FILTER_OPTIONS.faculty}
                    selected={selectedFilters.faculty}
                    onToggle={(v) => toggleFilter("faculty", v)}
                    currentResultCount={estimatedCount}
                    isConflicted={conflictedCategories.has("faculty")}
                  />
                  <FilterSection
                    title="เกรดเฉลี่ย"
                    options={FILTER_OPTIONS.gpa}
                    selected={selectedFilters.gpa}
                    onToggle={(v) => toggleFilter("gpa", v)}
                    currentResultCount={estimatedCount}
                    isConflicted={conflictedCategories.has("gpa")}
                  />
                  <FilterSection
                    title="ปีที่จบการศึกษา (ปริญญาตรี)"
                    options={FILTER_OPTIONS.gradYear}
                    selected={selectedFilters.gradYear}
                    onToggle={(v) => toggleFilter("gradYear", v)}
                    currentResultCount={estimatedCount}
                    isConflicted={conflictedCategories.has("gradYear")}
                  />

                  <div className="px-4 pt-3 pb-1">
                    <p className="text-[11.5px] font-semibold text-gray-500">ข้อมูลส่วนตัว</p>
                  </div>
                  <FilterSection
                    title="ทักษะภาษา"
                    options={FILTER_OPTIONS.languages}
                    selected={selectedFilters.languages}
                    onToggle={(v) => toggleFilter("languages", v)}
                    currentResultCount={estimatedCount}
                    isConflicted={conflictedCategories.has("languages")}
                  />
                  <FilterSection
                    title="ดนตรี กีฬา งานอดิเรก"
                    options={FILTER_OPTIONS.hobbies}
                    selected={selectedFilters.hobbies}
                    onToggle={(v) => toggleFilter("hobbies", v)}
                    currentResultCount={estimatedCount}
                    isConflicted={conflictedCategories.has("hobbies")}
                  />
                  <FilterSection
                    title="ที่อยู่ปัจจุบัน"
                    options={FILTER_OPTIONS.location}
                    selected={selectedFilters.location}
                    onToggle={(v) => toggleFilter("location", v)}
                    currentResultCount={estimatedCount}
                    isConflicted={conflictedCategories.has("location")}
                  />
                  <FilterSection
                    title="อายุ"
                    options={FILTER_OPTIONS.age}
                    selected={selectedFilters.age}
                    onToggle={(v) => toggleFilter("age", v)}
                    currentResultCount={estimatedCount}
                    isConflicted={conflictedCategories.has("age")}
                  />
                  <FilterSection
                    title="เพศ"
                    options={FILTER_OPTIONS.gender}
                    selected={selectedFilters.gender}
                    onToggle={(v) => toggleFilter("gender", v)}
                    currentResultCount={estimatedCount}
                    isConflicted={conflictedCategories.has("gender")}
                  />

                  <div className="px-4 pt-3 pb-1">
                    <p className="text-[11.5px] font-semibold text-gray-500">อื่นๆ</p>
                  </div>
                  <FilterSection
                    title="รถส่วนตัว"
                    options={FILTER_OPTIONS.vehicle}
                    selected={selectedFilters.vehicle}
                    onToggle={(v) => toggleFilter("vehicle", v)}
                    currentResultCount={estimatedCount}
                    isConflicted={conflictedCategories.has("vehicle")}
                  />
                  <FilterSection
                    title="เข้าสู่ระบบภายในระยะเวลา"
                    options={FILTER_OPTIONS.lastLogin}
                    selected={selectedFilters.lastLogin}
                    onToggle={(v) => toggleFilter("lastLogin", v)}
                    currentResultCount={estimatedCount}
                    isConflicted={conflictedCategories.has("lastLogin")}
                  />
                  <FilterSection
                    title="บริษัท"
                    options={FILTER_OPTIONS.company}
                    selected={selectedFilters.company}
                    onToggle={(v) => toggleFilter("company", v)}
                    currentResultCount={estimatedCount}
                    isConflicted={conflictedCategories.has("company")}
                  />
                </>
              )}
            </div>
          </aside>
        )}

        <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#F4F7FA]">
          <div className="bg-white px-5 py-3 flex-shrink-0 border-b border-gray-100">
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => { setSearchView("landing"); clearAll(); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-gray-500 text-[12px] font-medium hover:border-[#127EE3]/50 hover:text-[#127EE3] transition-all flex-shrink-0"
              >
                <ArrowRight className="w-3.5 h-3.5 rotate-180" />
                หมวดหมู่
              </button>
              {activeFilterChips.length > 0 && (
                <>
                  {activeFilterChips.map((chip) => (
                    <div
                      key={chip.id}
                      className="flex items-center gap-1.5 px-2.5 py-1 bg-[#EBF5FF] rounded-full border border-[#C7E3FA]"
                    >
                      <span className="text-[10px] text-[#127EE3]/60">{chip.category}</span>
                      <span className="text-[11.5px] text-[#127EE3] font-semibold">{chip.label}</span>
                      <button
                        onClick={() => removeChip(chip.id)}
                        className="text-[#127EE3]/50 hover:text-[#127EE3] ml-0.5 transition-colors"
                      >
                        <RotateCcw className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={clearAll}
                    className="text-[11.5px] text-gray-400 hover:text-gray-600 flex items-center gap-1 ml-1 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    ล้างทั้งหมด
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[14px] font-semibold text-[#1A1A2E]">
                  <span className="text-[#127EE3] font-bold">{CANDIDATES.length.toLocaleString()}</span> ผู้สมัคร
                  <span className="text-[12px] text-gray-400 font-normal ml-1.5">จากทั้งหมด 3,161,739 เรซูเม่</span>
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSaveSearch}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold border transition-all ${
                    searchJustSaved
                      ? "bg-green-50 border-green-200 text-green-600"
                      : "bg-white border-gray-200 text-gray-500 hover:border-[#127EE3]/50 hover:text-[#127EE3]"
                  }`}
                >
                  <Pin className="w-3 h-3" />
                  {searchJustSaved ? "บันทึกแล้ว" : "บันทึกการค้นหา"}
                </button>
                <span className="text-[12px] text-gray-400">เรียงตาม</span>
                <select className="text-[12px] border border-gray-200 rounded-lg px-2.5 py-1.5 bg-white focus:outline-none focus:border-[#0DC2FF] text-gray-600 font-medium cursor-pointer">
                  <option>เข้าสู่ระบบล่าสุด</option>
                  <option>ประสบการณ์มากสุด</option>
                  <option>เงินเดือนน้อยสุด</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              {CANDIDATES.map((candidate, idx) => (
                <CandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  interactable={idx < 2}
                  bookmarked={bookmarkedIds.has(candidate.id)}
                  onBookmark={() => handleToggleBookmark(candidate.id)}
                  onView={() => idx < 2 ? handleViewProfile(candidate) : undefined}
                />
              ))}
            </div>

            <div className="mt-8 flex items-center justify-center gap-1.5">
              {[1, 2, 3, "...", 12].map((p, i) => (
                <button
                  key={i}
                  className={`w-8 h-8 rounded-lg text-[13px] font-medium transition-colors ${
                    p === 1
                      ? "bg-[#127EE3] text-white shadow-sm shadow-[#127EE3]/30"
                      : typeof p === "number" ? "bg-white text-gray-500 border border-gray-200 hover:border-[#127EE3]/40 hover:text-[#127EE3]" : "text-gray-400 cursor-default"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
