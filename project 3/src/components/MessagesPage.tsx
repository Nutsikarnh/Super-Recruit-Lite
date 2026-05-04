import { useState } from "react";
import {
  Search, ChevronDown, Check, Filter, X, ArrowLeft,
  FileText, Mail, MapPin, Briefcase, Clock, Star,
  ThumbsUp, Clock3, Building2, Eye, CheckCircle2,
} from "lucide-react";
import ResumePanel from "./ResumePanel";
import { mockShortlistByJob } from "../data/applicants";
import type { ShortlistCandidate } from "../data/applicants";

interface MessagesPageProps {
  onBack: () => void;
}

type CandidateResponse = "interested" | "later" | null;
type StatusFilter = "all" | "interested" | "later" | "pending";

interface OutreachRecord {
  id: string;
  candidateName: string;
  candidateRole: string;
  candidateAvatar: string;
  jobPosition: string;
  jobId: string;
  source: "top-pick" | "search" | "shortlist";
  sentAt: string;
  sentDate: string;
  emailSubject: string;
  emailBody: string;
  response: CandidateResponse;
  responseAt?: string;
  candidateDetails: {
    location: string;
    experience: string;
    education: string;
    skills: string[];
  };
}


const RESPONSE_CONFIG: Record<NonNullable<CandidateResponse>, {
  label: string;
  icon: typeof ThumbsUp;
  badge: string;
  dot: string;
  card: string;
  ctaBg: string;
  ctaRing: string;
  ctaIcon: string;
  ctaText: string;
}> = {
  interested: {
    label: "สนใจพูดคุยด้วย",
    icon: ThumbsUp,
    badge: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    dot: "bg-emerald-500",
    card: "bg-emerald-50 border-emerald-200 text-emerald-700",
    ctaBg: "bg-emerald-100",
    ctaRing: "bg-emerald-50 border-emerald-400 ring-2 ring-emerald-200",
    ctaIcon: "text-emerald-600",
    ctaText: "text-emerald-700",
  },
  later: {
    label: "เอาไว้ก่อน",
    icon: Clock3,
    badge: "bg-gray-100 text-gray-600 border border-gray-200",
    dot: "bg-gray-400",
    card: "bg-gray-50 border-gray-200 text-gray-600",
    ctaBg: "bg-gray-100",
    ctaRing: "bg-gray-50 border-gray-400 ring-2 ring-gray-200",
    ctaIcon: "text-gray-500",
    ctaText: "text-gray-600",
  },
};

const SOURCE_CONFIG = {
  "top-pick": { label: "Top Pick", style: "bg-amber-50 text-amber-700 border border-amber-200" },
  "search": { label: "ค้นหาเชิงรุก", style: "bg-[#EBF5FF] text-[#127EE3] border border-[#127EE3]/20" },
  "shortlist": { label: "Shortlist", style: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
};

const JOB_POSITIONS = [
  { id: "all", label: "ทุกตำแหน่ง" },
  { id: "designer", label: "Senior Product Designer" },
  { id: "frontend", label: "Frontend Engineer" },
  { id: "marketing", label: "Marketing Manager" },
];

const STATUS_FILTERS: { id: StatusFilter; label: string }[] = [
  { id: "all", label: "ทั้งหมด" },
  { id: "pending", label: "รอตอบ" },
  { id: "interested", label: "สนใจพูดคุยด้วย" },
  { id: "later", label: "เอาไว้ก่อน" },
];

const OUTREACH_RECORDS: OutreachRecord[] = [
  {
    id: "o1",
    candidateName: "ปุณณวิช สุวรรณ",
    candidateRole: "Senior UX Designer",
    candidateAvatar: "ป",
    jobPosition: "Senior Product Designer",
    jobId: "designer",
    source: "top-pick",
    sentAt: "09:41",
    sentDate: "เมื่อวาน",
    emailSubject: "โอกาสพิเศษ — Senior Product Designer @ TechFlow",
    emailBody: `เรียน คุณปุณณวิช\n\nทีมงาน TechFlow Co., Ltd. ได้ติดตาม portfolio และผลงานของคุณมาสักระยะ และต้องบอกเลยว่าประทับใจมากครับ โดยเฉพาะ case study เรื่อง mobile banking experience ที่คุณทำ ถือว่าโดดเด่นมากในวงการ\n\nเราเปิดรับสมัครตำแหน่ง Senior Product Designer ซึ่งน่าจะเหมาะกับ background และความสามารถของคุณมากเลย\n\nไฮไลต์ของตำแหน่ง:\n• เงินเดือน 80,000 – 120,000 บาท/เดือน\n• Hybrid work (3 วันออฟฟิศ, 2 วัน WFH)\n• ทีมเล็ก autonomy สูง มีผลกระทบต่อ product จริง\n• ออฟฟิศย่านอโศก ใกล้ BTS\n\nถ้าสนใจ กดปุ่มด้านล่างเพื่อบอกให้เราทราบได้เลยนะครับ\n\nด้วยความนับถือ\nอลิสา สุขใจ — HR Manager, TechFlow Co., Ltd.`,
    response: "interested",
    responseAt: "เมื่อวาน 14:18",
    candidateDetails: {
      location: "กรุงเทพฯ",
      experience: "6 ปี",
      education: "ม.เกษตรศาสตร์ — Digital Design",
      skills: ["Figma", "Prototyping", "User Research", "Design System"],
    },
  },
  {
    id: "o2",
    candidateName: "ณัฐนรี วิชัยดิษฐ์",
    candidateRole: "Product Designer",
    candidateAvatar: "ณ",
    jobPosition: "Senior Product Designer",
    jobId: "designer",
    source: "search",
    sentAt: "09:30",
    sentDate: "3 วันที่แล้ว",
    emailSubject: "ชวนคุยเรื่องโอกาสใหม่ — Senior Product Designer",
    emailBody: `เรียน คุณณัฐนรี\n\nเราเห็น profile ของคุณบน Jobtopgun และประทับใจมากค่ะ คุณมีประสบการณ์ด้าน Product Design ที่ match กับที่เราต้องการพอดีเลย\n\nTechFlow กำลังมองหา Senior Product Designer ที่มีความสามารถด้าน iOS design และ Illustration เหมือนคุณ\n\nอยากชวนมาคุยกันสั้น ๆ ได้ไหมคะ?\n\nด้วยความนับถือ\nอลิสา สุขใจ — HR Manager, TechFlow Co., Ltd.`,
    response: "interested",
    responseAt: "3 วันที่แล้ว 10:15",
    candidateDetails: {
      location: "กรุงเทพฯ",
      experience: "4 ปี",
      education: "จุฬาลงกรณ์มหาวิทยาลัย — Fine Arts",
      skills: ["Figma", "Adobe XD", "iOS Design", "Illustration"],
    },
  },
  {
    id: "o3",
    candidateName: "วริษฐา เกษมจิตร",
    candidateRole: "Marketing Manager",
    candidateAvatar: "ว",
    jobPosition: "Marketing Manager",
    jobId: "marketing",
    source: "top-pick",
    sentAt: "09:00",
    sentDate: "จันทร์",
    emailSubject: "ร่วมทีม TechFlow — Marketing Manager",
    emailBody: `เรียน คุณวริษฐา\n\nเราประทับใจผลงานที่คุณทำ growth campaign ให้บริษัทก่อนหน้ามากค่ะ ยอดเติบโต 3x ใน 6 เดือนนั้นน่าทึ่งมากเลย\n\nTechFlow กำลังมองหา Marketing Manager ที่จะมาดูแล digital marketing ทั้งหมด และนำทีม 5 คนค่ะ เราเชื่อว่าคุณคือคนที่เราตามหา\n\nด้วยความนับถือ\nอลิสา สุขใจ — HR Manager, TechFlow Co., Ltd.`,
    response: "later",
    responseAt: "จันทร์ 09:45",
    candidateDetails: {
      location: "กรุงเทพฯ",
      experience: "7 ปี",
      education: "ม.ธรรมศาสตร์ — Business Administration",
      skills: ["Growth Hacking", "SEO/SEM", "Data Analytics", "Content Strategy"],
    },
  },
  {
    id: "o4",
    candidateName: "รวิกานต์ ศรีประภา",
    candidateRole: "Product Designer",
    candidateAvatar: "ร",
    jobPosition: "Senior Product Designer",
    jobId: "designer",
    source: "top-pick",
    sentAt: "10:15",
    sentDate: "2 วันที่แล้ว",
    emailSubject: "คุณตรงกับสิ่งที่เราตามหา — Senior Product Designer",
    emailBody: `เรียน คุณรวิกานต์\n\nประสบการณ์ 5 ปีที่ Airbnb Singapore ของคุณนั้นโดดเด่นมากครับ การได้ทำงานกับ product ระดับ global ที่มี user กว่า 190 ประเทศเป็นสิ่งที่หาได้ยากมากในตลาด\n\nเราที่ TechFlow กำลังสร้าง product ที่ต้องการ designer ที่เข้าใจ user experience อย่างลึกซึ้ง และเชื่อว่าคุณคือคนที่เหมาะที่สุด\n\nอยากนัดคุยสั้น ๆ 30 นาทีได้ไหมครับ?\n\nด้วยความนับถือ\nอลิสา สุขใจ — HR Manager, TechFlow Co., Ltd.`,
    response: null,
    candidateDetails: {
      location: "กรุงเทพฯ (Remote OK)",
      experience: "5 ปี",
      education: "ปริญญาตรี Digital Design มหาวิทยาลัยกรุงเทพ",
      skills: ["Figma", "Design System", "Motion Design", "User Research"],
    },
  },
  {
    id: "o5",
    candidateName: "ธีรวัฒน์ ชำนาญการ",
    candidateRole: "Senior Product Designer",
    candidateAvatar: "ธ",
    jobPosition: "Senior Product Designer",
    jobId: "designer",
    source: "search",
    sentAt: "14:30",
    sentDate: "อังคาร",
    emailSubject: "Canva Experience + TechFlow = Perfect Match",
    emailBody: `เรียน คุณธีรวัฒน์\n\n6 ปีที่ Canva Bangkok หมายความว่าคุณได้สร้าง product ที่ user นับร้อยล้านคนใช้งาน ทักษะ design system และ scalable components แบบนี้ตรงกับสิ่งที่เราต้องการพอดีเลย\n\nเราที่ TechFlow กำลัง build design system ใหม่ และเชื่อว่าประสบการณ์ของคุณจะมีคุณค่ามากกับทีมเรา\n\nอยากคุยกันได้ไหมครับ?\n\nด้วยความนับถือ\nอลิสา สุขใจ — HR Manager, TechFlow Co., Ltd.`,
    response: null,
    candidateDetails: {
      location: "กรุงเทพฯ",
      experience: "6 ปี",
      education: "จุฬาลงกรณ์มหาวิทยาลัย — Visual Communication",
      skills: ["Figma", "Design Systems", "Scalable Design", "Component Design"],
    },
  },
  {
    id: "o6",
    candidateName: "สุภาพร มีแสง",
    candidateRole: "UI/UX Designer",
    candidateAvatar: "ส",
    jobPosition: "Senior Product Designer",
    jobId: "designer",
    source: "shortlist",
    sentAt: "11:00",
    sentDate: "พุธ",
    emailSubject: "ตำแหน่ง Senior Product Designer ที่น่าจะตรงกับคุณ",
    emailBody: `เรียน คุณสุภาพร\n\nจาก profile ที่เราเห็น ประสบการณ์ด้าน fintech UX จาก KBTG นั้นน่าประทับใจมากค่ะ ความเข้าใจ compliance และ accessibility design เป็นสิ่งที่หาได้ยากมาก\n\nTechFlow มีตำแหน่ง Senior Product Designer ที่น่าจะเหมาะกับทักษะของคุณมาก รายละเอียดมีดังนี้:\n\n• เงินเดือน 75,000 – 100,000 บาท/เดือน\n• Hybrid work (3+2)\n• Product-focused team\n\nสนใจคุยเพิ่มเติมได้เลยนะคะ\n\nด้วยความนับถือ\nอลิสา สุขใจ — HR Manager, TechFlow Co., Ltd.`,
    response: "interested",
    responseAt: "พุธ 13:22",
    candidateDetails: {
      location: "กรุงเทพฯ",
      experience: "4 ปี",
      education: "ม.มหิดล — เทคโนโลยีมัลติมีเดีย",
      skills: ["Figma", "Zeplin", "Accessibility", "Design Token"],
    },
  },
];

function Avatar({ char, size = "md" }: { char: string; size?: "sm" | "md" | "lg" }) {
  const sizeClass =
    size === "sm" ? "w-8 h-8 text-[12px]" :
    size === "lg" ? "w-12 h-12 text-[17px]" :
    "w-10 h-10 text-[14px]";
  return (
    <div className={`${sizeClass} rounded-full bg-gradient-to-br from-[#0DC2FF] to-[#127EE3] flex items-center justify-center text-white font-bold flex-shrink-0`}>
      {char}
    </div>
  );
}

function PendingBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-gray-100 text-gray-500 border border-gray-200">
      <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-pulse" />
      รอตอบ
    </span>
  );
}

function ResponseBadge({ response }: { response: NonNullable<CandidateResponse> }) {
  const cfg = RESPONSE_CONFIG[response];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${cfg.badge}`}>
      <Icon className="w-3 h-3" />
      {cfg.label}
    </span>
  );
}

export default function MessagesPage({ onBack }: MessagesPageProps) {
  const [selected, setSelected] = useState<OutreachRecord>(OUTREACH_RECORDS[0]);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [jobFilter, setJobFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showJobDropdown, setShowJobDropdown] = useState(false);
  const [resumeOpen, setResumeOpen] = useState(false);
  const [shortlistedIds, setShortlistedIds] = useState<Set<string>>(new Set());

  const handleAddToShortlist = (record: OutreachRecord) => {
    if (shortlistedIds.has(record.id)) return;
    const newCandidate: ShortlistCandidate = {
      id: `msg-${record.id}`,
      name: record.candidateName,
      initials: record.candidateAvatar,
      avatarColor: "#127EE3",
      currentTitle: record.candidateRole,
      currentCompany: "",
      experience: record.candidateDetails.experience,
      location: record.candidateDetails.location,
      salaryExpect: "",
      stage: "new",
      aiSummary: "",
      strengths: [],
      concerns: [],
      skills: record.candidateDetails.skills,
      source: record.source === "top-pick" ? "top_pick" : record.source === "search" ? "headhunt" : "self_apply",
      addedAt: "เพิ่งเพิ่ม",
      isRead: false,
      education: record.candidateDetails.education,
    };
    const jobId = record.jobId;
    if (!mockShortlistByJob[jobId]) mockShortlistByJob[jobId] = [];
    mockShortlistByJob[jobId].unshift(newCandidate);
    setShortlistedIds(prev => new Set(prev).add(record.id));
  };

  const filtered = OUTREACH_RECORDS.filter((r) => {
    const matchJob = jobFilter === "all" || r.jobId === jobFilter;
    const matchSearch =
      !searchQuery ||
      r.candidateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.jobPosition.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus =
      statusFilter === "all" ||
      (statusFilter === "pending" && r.response === null) ||
      r.response === statusFilter;
    return matchJob && matchSearch && matchStatus;
  });

  const pendingCount = OUTREACH_RECORDS.filter((r) => r.response === null).length;
  const currentJobLabel = JOB_POSITIONS.find((j) => j.id === jobFilter)?.label || "ทุกตำแหน่ง";

  const statusCounts: Record<StatusFilter, number> = {
    all: OUTREACH_RECORDS.length,
    pending: OUTREACH_RECORDS.filter((r) => r.response === null).length,
    interested: OUTREACH_RECORDS.filter((r) => r.response === "interested").length,
    later: OUTREACH_RECORDS.filter((r) => r.response === "later").length,
  };

  const emailLines = selected.emailBody.split("\n");

  return (
    <div className="h-[calc(100vh-64px)] flex bg-[#F0F2F5] overflow-hidden">
      {resumeOpen && <ResumePanel onClose={() => setResumeOpen(false)} isApplicant={true} />}

      {/* Left sidebar — outreach list */}
      <div className="w-[300px] min-w-[300px] flex flex-col bg-white border-r border-gray-100 shadow-sm">
        {/* Header */}
        <div className="px-5 pt-4 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={onBack}
              className="w-8 h-8 rounded-xl bg-[#F0F2F5] flex items-center justify-center hover:bg-gray-200 transition-colors text-gray-500"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="text-[16px] font-bold text-[#1A1A2E] leading-tight">อีเมลที่ส่งออก</h1>
              <p className="text-[11px] text-gray-400 mt-0.5">
                {pendingCount > 0
                  ? <span><span className="text-amber-600 font-bold">{pendingCount}</span> รายการรอตอบ</span>
                  : "ติดตามการตอบรับ"}
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาชื่อหรือตำแหน่ง..."
              className="w-full pl-9 pr-8 py-2 text-[12.5px] bg-[#F7F9FC] rounded-xl border border-gray-200 focus:outline-none focus:border-[#0DC2FF] focus:bg-white transition-all placeholder:text-gray-400"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="absolute right-2.5 top-1/2 -translate-y-1/2">
                <X className="w-3.5 h-3.5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          {/* Status filter tabs */}
          <div className="flex gap-1 mb-3 overflow-x-auto">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id)}
                className={`flex-shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors ${
                  statusFilter === f.id
                    ? "bg-[#127EE3] text-white shadow-sm shadow-[#127EE3]/20"
                    : "bg-[#F0F2F5] text-gray-500 hover:bg-gray-200"
                }`}
              >
                {f.label}
                <span className={`text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none ${
                  statusFilter === f.id ? "bg-white/25 text-white" : "bg-white text-gray-500"
                }`}>
                  {statusCounts[f.id]}
                </span>
              </button>
            ))}
          </div>

          {/* Job filter dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowJobDropdown((v) => !v)}
              className="w-full flex items-center justify-between px-3 py-2 bg-[#F7F9FC] hover:bg-gray-100 rounded-xl transition-colors text-[12.5px] border border-gray-200"
            >
              <div className="flex items-center gap-2 text-gray-600">
                <Filter className="w-3.5 h-3.5 text-gray-400" />
                <span className="font-medium">{currentJobLabel}</span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 text-gray-400 transition-transform ${showJobDropdown ? "rotate-180" : ""}`} />
            </button>
            {showJobDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-lg z-10 overflow-hidden">
                {JOB_POSITIONS.map((j) => (
                  <button
                    key={j.id}
                    onClick={() => { setJobFilter(j.id); setShowJobDropdown(false); }}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-[12.5px] hover:bg-[#F0F2F5] transition-colors ${jobFilter === j.id ? "text-[#127EE3] font-semibold" : "text-gray-600"}`}
                  >
                    {j.label}
                    {jobFilter === j.id && <Check className="w-3.5 h-3.5 text-[#127EE3]" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-400 gap-2">
              <Search className="w-8 h-8 text-gray-200" />
              <p className="text-[13px]">ไม่พบรายการ</p>
            </div>
          ) : (
            filtered.map((record) => (
              <button
                key={record.id}
                onClick={() => setSelected(record)}
                className={`w-full flex items-start gap-3 px-4 py-3.5 border-b border-gray-50 hover:bg-[#F8F9FB] transition-colors text-left relative ${
                  selected.id === record.id ? "bg-[#EBF5FF]" : ""
                }`}
              >
                {selected.id === record.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[#127EE3] rounded-r" />
                )}
                <div className="relative mt-0.5">
                  <Avatar char={record.candidateAvatar} />
                  {record.response === null && (
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-[13px] font-semibold truncate text-[#1A1A2E]">
                      {record.candidateName}
                    </span>
                    <span className="text-[10px] text-gray-400 flex-shrink-0 ml-2">{record.sentDate}</span>
                  </div>
                  <p className="text-[11.5px] text-[#127EE3] font-medium truncate mb-1.5">{record.jobPosition}</p>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${SOURCE_CONFIG[record.source].style}`}>
                      {SOURCE_CONFIG[record.source].label}
                    </span>
                    {record.response === null
                      ? <PendingBadge />
                      : <ResponseBadge response={record.response} />
                    }
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Main — email viewer */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Email header bar */}
        <div className="bg-white border-b border-gray-100 px-6 py-4 flex-shrink-0 shadow-sm">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <Avatar char={selected.candidateAvatar} size="md" />
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <h2 className="text-[15px] font-bold text-[#1A1A2E]">{selected.candidateName}</h2>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${SOURCE_CONFIG[selected.source].style}`}>
                    {SOURCE_CONFIG[selected.source].label}
                  </span>
                </div>
                <p className="text-[11.5px] text-gray-400">
                  {selected.candidateRole} · ส่งอีเมลเมื่อ {selected.sentDate} {selected.sentAt}
                </p>
              </div>
            </div>
            <div className="flex-shrink-0">
              {selected.response === null
                ? <PendingBadge />
                : <ResponseBadge response={selected.response} />
              }
            </div>
          </div>
        </div>

        {/* Email body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 bg-[#F7F9FC]">
          {/* Response status card */}
          {selected.response !== null && (() => {
            const cfg = RESPONSE_CONFIG[selected.response];
            const Icon = cfg.icon;
            return (
              <div className={`mb-4 flex items-center gap-3 p-4 rounded-2xl border ${cfg.card} shadow-sm`}>
                <div className="w-8 h-8 rounded-xl bg-white/70 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10.5px] font-medium opacity-70">Candidate ตอบกลับ · {selected.responseAt}</p>
                  <p className="text-[13.5px] font-bold">{cfg.label}</p>
                </div>
              </div>
            );
          })()}

          {/* Email card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Email meta */}
            <div className="px-6 py-4 border-b border-gray-100 space-y-2.5 bg-[#FAFBFC]">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 bg-[#127EE3]/10 border border-[#127EE3]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-3.5 h-3.5 text-[#127EE3]" />
                </div>
                <p className="text-[13px] font-bold text-[#1A1A2E] flex-1 truncate">{selected.emailSubject}</p>
              </div>
              <div className="grid grid-cols-[52px_1fr] gap-y-1 text-[11.5px]">
                <span className="text-gray-400">จาก:</span>
                <span className="text-[#1A1A2E] font-medium">อลิสา สุขใจ &lt;alisa@techflow.co.th&gt;</span>
                <span className="text-gray-400">ถึง:</span>
                <span className="text-[#1A1A2E] font-medium">{selected.candidateName}</span>
                <span className="text-gray-400">วันที่:</span>
                <span className="text-gray-600">{selected.sentDate} เวลา {selected.sentAt}</span>
              </div>
            </div>

            {/* Email content */}
            <div className="px-8 py-7">
              <div className="mb-6 flex items-center gap-3 pb-5 border-b border-gray-100">
                <div className="w-9 h-9 bg-gradient-to-br from-[#0DC2FF] to-[#127EE3] rounded-xl flex items-center justify-center flex-shrink-0">
                  <Building2 className="w-[18px] h-[18px] text-white" />
                </div>
                <div>
                  <p className="text-[14px] font-bold text-[#1A1A2E]">TechFlow Co., Ltd.</p>
                  <p className="text-[11px] text-gray-400">Super Recruit — Talent Outreach</p>
                </div>
              </div>

              <div className="text-[14px] text-[#374151] leading-[1.85] space-y-3">
                {emailLines.map((line, i) => {
                  if (line.trim() === "") return <div key={i} className="h-2" />;
                  if (line.startsWith("•")) {
                    return (
                      <div key={i} className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#127EE3] flex-shrink-0 mt-2.5" />
                        <span>{line.replace(/^•\s*/, "")}</span>
                      </div>
                    );
                  }
                  return <p key={i}>{line}</p>;
                })}
              </div>

              {/* CTA buttons (read-only display) */}
              <div className="mt-8 border-t border-gray-100 pt-6">
                <p className="text-[12px] text-gray-400 font-medium text-center mb-4">
                  คุณ{selected.candidateName} รู้สึกอย่างไรกับโอกาสนี้?
                </p>
                <div className="flex gap-3 justify-center">
                  {(Object.entries(RESPONSE_CONFIG) as [NonNullable<CandidateResponse>, typeof RESPONSE_CONFIG[NonNullable<CandidateResponse>]][]).map(([type, cfg]) => {
                    const Icon = cfg.icon;
                    const isChosen = selected.response === type;
                    return (
                      <div
                        key={type}
                        className={`flex-1 max-w-[180px] flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                          isChosen ? cfg.ctaRing + " shadow-sm" : "bg-gray-50 border-gray-200 opacity-40"
                        }`}
                      >
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${cfg.ctaBg}`}>
                          <Icon className={`w-4.5 h-4.5 ${cfg.ctaIcon}`} />
                        </div>
                        <span className={`text-[11.5px] font-bold text-center leading-tight ${cfg.ctaText}`}>
                          {cfg.label}
                        </span>
                        {isChosen && (
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/60 ${cfg.ctaText}`}>
                            เลือกแล้ว
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
                <p className="text-[11px] text-gray-400 text-center mt-4">
                  ปุ่มเหล่านี้อยู่ในอีเมลจริงที่ Candidate ได้รับ
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel — candidate info */}
      <div className="w-[240px] min-w-[240px] bg-white border-l border-gray-100 overflow-y-auto shadow-sm">
        <div className="p-5">
          <p className="text-[10.5px] font-bold text-gray-400 uppercase tracking-widest mb-4">รายละเอียด Candidate</p>

          <div className="flex flex-col items-center mb-5 pb-5 border-b border-gray-100">
            <Avatar char={selected.candidateAvatar} size="lg" />
            <h4 className="text-[14px] font-bold text-[#1A1A2E] mt-3 text-center">{selected.candidateName}</h4>
            <p className="text-[11.5px] text-gray-400 text-center mt-0.5">{selected.candidateRole}</p>
          </div>

          {/* Response status */}
          {selected.response !== null && (() => {
            const cfg = RESPONSE_CONFIG[selected.response];
            const Icon = cfg.icon;
            return (
              <div className={`mb-4 p-3 rounded-xl border flex items-center gap-2 ${cfg.card}`}>
                <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                <div>
                  <p className="text-[9.5px] font-medium opacity-70 uppercase tracking-wide">ตอบกลับ</p>
                  <p className="text-[12px] font-bold">{cfg.label}</p>
                </div>
              </div>
            );
          })()}

          {/* Details */}
          <div className="space-y-3 mb-5">
            {[
              { icon: <MapPin className="w-3.5 h-3.5 text-gray-300" />, label: "ที่อยู่", value: selected.candidateDetails.location },
              { icon: <Briefcase className="w-3.5 h-3.5 text-gray-300" />, label: "ประสบการณ์", value: selected.candidateDetails.experience },
              { icon: <FileText className="w-3.5 h-3.5 text-gray-300" />, label: "การศึกษา", value: selected.candidateDetails.education },
              { icon: <Eye className="w-3.5 h-3.5 text-gray-300" />, label: "ช่องทาง", value: SOURCE_CONFIG[selected.source].label },
              { icon: <Clock className="w-3.5 h-3.5 text-gray-300" />, label: "ส่งอีเมล", value: selected.sentDate },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-2.5">
                <div className="mt-0.5 flex-shrink-0">{item.icon}</div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold">{item.label}</p>
                  <p className="text-[12px] font-medium text-[#1A1A2E] mt-0.5">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Skills */}
          <div className="mb-5">
            <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold mb-2">Skills</p>
            <div className="flex flex-wrap gap-1.5">
              {selected.candidateDetails.skills.map((s) => (
                <span key={s} className="text-[10.5px] font-medium px-2 py-1 bg-[#EBF5FF] text-[#127EE3] rounded-lg border border-[#127EE3]/10">
                  {s}
                </span>
              ))}
            </div>
          </div>

          {/* Job */}
          <div className="mb-5 p-3 bg-[#F7F9FC] rounded-xl border border-gray-100">
            <p className="text-[10px] text-gray-400 uppercase tracking-wide font-semibold mb-1.5">ตำแหน่งที่ส่งไป</p>
            <div className="flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-[#127EE3]" />
              <p className="text-[12px] font-semibold text-[#1A1A2E]">{selected.jobPosition}</p>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => setResumeOpen(true)}
              className="w-full py-2.5 bg-gradient-to-r from-[#01BFF9] to-[#019EFC] hover:opacity-90 text-white text-[12.5px] font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm shadow-[#019EFC]/20"
            >
              <FileText className="w-3.5 h-3.5" />ดู Resume
            </button>
            {shortlistedIds.has(selected.id) ? (
              <button
                disabled
                className="w-full py-2 border border-emerald-200 bg-emerald-50 text-emerald-600 text-[12.5px] font-semibold rounded-xl flex items-center justify-center gap-2 cursor-not-allowed"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />อยู่ใน Shortlist แล้ว
              </button>
            ) : (
              <button
                onClick={() => handleAddToShortlist(selected)}
                className="w-full py-2 border border-gray-200 text-gray-600 text-[12.5px] font-semibold rounded-xl hover:border-[#127EE3] hover:text-[#127EE3] transition-all flex items-center justify-center gap-2"
              >
                <Star className="w-3.5 h-3.5" />เพิ่มใน Shortlist
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
