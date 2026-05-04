import { useState } from "react";
import { Plus, Search, Sparkles, MapPin, Briefcase, Eye, EyeOff, Pencil, Trash2, MoreHorizontal, ChevronDown, X, CheckCircle2, XCircle, FileText, Users, ArrowUpDown, DollarSign, AlertCircle, Send, ChevronRight, Zap, BookmarkCheck, UserCheck, Calendar, User, Copy, Ligature as FileSignature } from "lucide-react";
import type { JobRow, JobStatus } from "../data/jobs";
import { contracts } from "../data/jobs";

interface ManageJobsPageProps {
  jobs: JobRow[];
  onJobStatusChange: (id: string, status: JobStatus) => void;
  onCreateJob: () => void;
  onViewTopPicks: () => void;
  onViewJobTopPicks: (jobId: string, jobTitle: string) => void;
  onViewApplicants: (jobTitle: string) => void;
  onViewApplicantsShortlist: (jobId: string, jobTitle: string) => void;
  onViewApplicantsHired: (jobId: string, jobTitle: string) => void;
  onEditJob: (jobId: string) => void;
  onCopyJob: (jobId: string) => void;
  onDeleteJob: (jobId: string) => void;
}

type Period = "7d" | "30d" | "90d" | "all" | "custom";

const PERIOD_OPTIONS: { key: Period; label: string }[] = [
  { key: "7d", label: "7 วันล่าสุด" },
  { key: "30d", label: "30 วันล่าสุด" },
  { key: "90d", label: "90 วันล่าสุด" },
  { key: "all", label: "ทั้งหมด" },
  { key: "custom", label: "กำหนดเอง..." },
];

const STATUS_CONFIG: Record<JobStatus, { label: string; color: string; icon: React.ReactNode }> = {
  online: {
    label: "ออนไลน์",
    color: "bg-emerald-50 text-emerald-600 border-emerald-200",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
  offline: {
    label: "ออฟไลน์",
    color: "bg-gray-100 text-gray-500 border-gray-200",
    icon: <XCircle className="w-3.5 h-3.5" />,
  },
  draft: {
    label: "ร่าง",
    color: "bg-[#0DC2FF]/10 text-[#127EE3] border-[#0DC2FF]/30",
    icon: <FileText className="w-3.5 h-3.5" />,
  },
};

function DayTag({ days }: { days: number }) {
  if (days >= 365) return null;
  const isNew = days <= 3;
  const isRecent = days <= 7;
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${
        isNew
          ? "bg-emerald-50 text-emerald-600"
          : isRecent
          ? "bg-[#0DC2FF]/10 text-[#0891b2]"
          : "bg-gray-100 text-gray-500"
      }`}
    >
      {days === 1 ? "วันนี้" : `${days} วัน`}
    </span>
  );
}

function ActionMenu({
  job,
  onStatusChange,
  onEdit,
  onCopy,
  onDelete,
  onClose,
}: {
  job: JobRow;
  onStatusChange: (id: string, status: JobStatus) => void;
  onEdit: () => void;
  onCopy: () => void;
  onDelete: () => void;
  onClose: () => void;
}) {
  const menuItems = [
    {
      label: "แก้ไขประกาศ",
      icon: <Pencil className="w-3.5 h-3.5" />,
      onClick: () => { onEdit(); onClose(); },
    },
    {
      label: "คัดลอกตำแหน่งงาน",
      icon: <Copy className="w-3.5 h-3.5" />,
      onClick: () => { onCopy(); onClose(); },
    },
    {
      label: "ออฟไลน์",
      icon: <EyeOff className="w-3.5 h-3.5" />,
      onClick: () => { onStatusChange(job.id, "offline"); onClose(); },
      hidden: job.status === "offline",
    },
  ];

  return (
    <div className="absolute right-0 top-8 z-30 w-48 bg-white rounded-xl border border-gray-100 shadow-xl py-1.5 overflow-hidden">
      {menuItems.filter((item) => !item.hidden).map((item) => (
        <button
          key={item.label}
          onClick={item.onClick}
          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-medium text-gray-600 hover:bg-gray-50 hover:text-[#1A1A2E] transition-colors"
        >
          {item.icon}
          {item.label}
        </button>
      ))}
      {job.status === "draft" && (
        <>
          <div className="my-1 border-t border-gray-100" />
          <button
            onClick={() => { onDelete(); onClose(); }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-medium text-red-500 hover:bg-red-50 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            ลบประกาศ
          </button>
        </>
      )}
    </div>
  );
}

function TopPicksNudge({ topPicks, onViewTopPicks }: { topPicks: number; onViewTopPicks: () => void }) {
  return (
    <div className="mt-3 rounded-xl bg-gradient-to-r from-[#0DC2FF]/8 to-[#127EE3]/10 border border-[#0DC2FF]/20 p-3">
      <div className="flex items-start gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-[#127EE3] flex items-center justify-center flex-shrink-0 mt-0.5">
          <Zap className="w-3.5 h-3.5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-bold text-[#127EE3] mb-0.5">ไม่ต้องรอให้เค้า apply มาเอง</p>
          <p className="text-[11.5px] text-gray-500 leading-relaxed">
            Top Picks <span className="font-semibold text-[#1A1A2E]">{topPicks} คน</span> ถูก AI คัดมาแล้ว — ส่ง invite ให้เค้าได้ทันที ไม่ต้องรอ
          </p>
        </div>
      </div>
      <button
        onClick={onViewTopPicks}
        className="mt-2.5 w-full flex items-center justify-center gap-1.5 py-2 bg-[#127EE3] hover:bg-[#0f6bc7] text-white text-[12px] font-bold rounded-lg transition-colors"
      >
        <Send className="w-3 h-3" />
        ส่ง invite ให้ Top Picks
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

// List row
function JobListRow({
  job,
  onStatusChange,
  onViewTopPicks,
  onViewJobTopPicks,
  onViewApplicants,
  onViewApplicantsShortlist,
  onViewApplicantsHired,
  onEdit,
  onCopy,
  onDelete,
}: {
  job: JobRow;
  onStatusChange: (id: string, status: JobStatus) => void;
  onViewTopPicks: () => void;
  onViewJobTopPicks: () => void;
  onViewApplicants: () => void;
  onViewApplicantsShortlist: () => void;
  onViewApplicantsHired: () => void;
  onEdit: () => void;
  onCopy: () => void;
  onDelete: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const cfg = STATUS_CONFIG[job.status];

  return (
    <div className={`bg-white border-b border-gray-100 last:border-0 hover:bg-[#F8FAFD] transition-colors relative ${
      job.status === "offline" ? "opacity-55" : ""
    }`}>
      <div className="flex items-center gap-4 px-5 py-3.5">
        {/* Status badge */}
        <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold border flex-shrink-0 ${cfg.color}`}>
          {cfg.icon}
          {cfg.label}
        </div>

        {/* Title + meta */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[14px] font-semibold text-[#1A1A2E] truncate">{job.title}</span>
            <DayTag days={job.daysOnline} />
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <span className="flex items-center gap-1 text-[12px] text-gray-400">
              <MapPin className="w-3 h-3" />
              {job.location}
            </span>
            <span className="flex items-center gap-1 text-[12px] text-gray-400">
              <Briefcase className="w-3 h-3" />
              {job.type}
            </span>
            {job.salary && (
              <span className="flex items-center gap-1 text-[12px] text-emerald-600 font-medium">
                <DollarSign className="w-3 h-3" />
                {job.salary}
              </span>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={onViewJobTopPicks}
            title="ดู Top Picks"
            className="group flex flex-col items-center justify-center w-[52px] h-[44px] rounded-xl bg-[#EBF8FF] hover:bg-[#D6F0FF] cursor-pointer transition-all gap-0.5"
          >
            <span className="text-[16px] font-black leading-none text-[#127EE3]">{job.topPicks}</span>
            <span className="text-[8.5px] font-semibold text-[#127EE3]/70 uppercase tracking-wide">picks</span>
          </button>

          <button
            onClick={onViewApplicants}
            title="ดูใบสมัคร"
            className="group flex flex-col items-center justify-center w-[52px] h-[44px] rounded-xl bg-[#F5F5F7] hover:bg-[#ECEDF0] cursor-pointer transition-all gap-0.5"
          >
            <span className="text-[16px] font-black leading-none text-[#1A1A2E]">{job.applicants}</span>
            <span className="text-[8.5px] font-semibold text-gray-400 uppercase tracking-wide">สมัคร</span>
          </button>

          <button
            type="button"
            onClick={onViewApplicantsShortlist}
            title="ดู Shortlist"
            className="group flex flex-col items-center justify-center w-[52px] h-[44px] rounded-xl bg-emerald-50 hover:bg-emerald-100 cursor-pointer transition-all gap-0.5"
          >
            <span className="text-[16px] font-black leading-none text-emerald-600">{job.shortlist ?? 0}</span>
            <span className="text-[8.5px] font-semibold text-emerald-500/70 uppercase tracking-wide">list</span>
          </button>

          <button
            type="button"
            onClick={onViewApplicantsHired}
            title="ดูรายชื่อรับเข้าทำงาน"
            className="group flex flex-col items-center justify-center w-[52px] h-[44px] rounded-xl bg-[#F5F5F7] hover:bg-[#EBF8FF] cursor-pointer transition-all gap-0.5"
          >
            <span className="text-[16px] font-black leading-none text-[#127EE3]">{job.hired ?? 0}</span>
            <span className="text-[8.5px] font-semibold text-[#127EE3]/60 uppercase tracking-wide">รับเข้า</span>
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center flex-shrink-0">
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="w-8 h-8 rounded-lg hover:bg-[#F0F2F5] flex items-center justify-center text-gray-400 hover:text-[#1A1A2E] transition-colors"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setMenuOpen(false)} />
                <ActionMenu
                  job={job}
                  onStatusChange={onStatusChange}
                  onEdit={onEdit}
                  onCopy={onCopy}
                  onDelete={onDelete}
                  onClose={() => setMenuOpen(false)}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const STATUS_FILTER_OPTIONS: { key: JobStatus | "all"; label: string }[] = [
  { key: "all", label: "ทั้งหมด" },
  { key: "online", label: "ออนไลน์" },
  { key: "offline", label: "ออฟไลน์" },
  { key: "draft", label: "ร่าง" },
];

export default function ManageJobsPage({ jobs, onJobStatusChange, onCreateJob, onViewTopPicks, onViewJobTopPicks, onViewApplicants, onViewApplicantsShortlist, onViewApplicantsHired, onEditJob, onCopyJob, onDeleteJob }: ManageJobsPageProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<JobStatus | "all">("all");
  const [channelFilter, setChannelFilter] = useState<"all" | "online" | "search" | "jobfair">("all");
  const [recruiterFilter, setRecruiterFilter] = useState<string>("all");
  const [contractFilter, setContractFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"daysOnline" | "topPicks" | "applicants">("daysOnline");
  const [period, setPeriod] = useState<Period>("30d");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [showCustomDate, setShowCustomDate] = useState(false);

  const recruiters = Array.from(new Set(jobs.map((j) => j.recruiter))).sort();

  const filtered = jobs
    .filter((j) => {
      if (statusFilter !== "all" && j.status !== statusFilter) return false;
      if (channelFilter !== "all" && j.channel !== channelFilter) return false;
      if (recruiterFilter !== "all" && j.recruiter !== recruiterFilter) return false;
      if (contractFilter !== "all" && j.contractId !== contractFilter) return false;
      if (search && !j.title.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "topPicks") return b.topPicks - a.topPicks;
      if (sortBy === "applicants") return b.applicants - a.applicants;
      return a.daysOnline - b.daysOnline;
    });

  const periodMultiplier = period === "7d" ? 0.25 : period === "30d" ? 1 : period === "90d" ? 2.8 : 3.5;
  const round = (n: number) => Math.round(n * periodMultiplier);

  const scopeJobs = contractFilter !== "all" ? jobs.filter((j) => j.contractId === contractFilter) : jobs;

  const totalOnline = scopeJobs.filter((j) => j.status === "online").length;
  const totalSearchJobs = scopeJobs.filter((j) => j.channel === "search").length;
  const totalApplicants = round(scopeJobs.reduce((s, j) => s + j.applicants, 0));
  const totalShortlist = round(scopeJobs.reduce((s, j) => s + (j.shortlist ?? 0), 0));
  const totalHired = round(scopeJobs.reduce((s, j) => s + (j.hired ?? 0), 0));

  const statCards = [
    {
      label: "ประกาศออนไลน์",
      value: totalOnline,
      iconNode: <Eye className="w-[18px] h-[18px] text-[#127EE3]" />,
      color: "bg-[#127EE3]/10 text-[#127EE3]",
      note: `${scopeJobs.length} ทั้งหมด`,
      noPeriod: true,
    },
    {
      label: "ค้นหาเชิงรุก",
      value: totalSearchJobs,
      iconNode: <Zap className="w-[18px] h-[18px] text-amber-500" />,
      color: "bg-amber-50 text-amber-500",
      note: "ตำแหน่ง Active Search",
      noPeriod: true,
    },
    {
      label: "สมัครเอง",
      value: totalApplicants,
      iconNode: <Users className="w-[18px] h-[18px] text-emerald-500" />,
      color: "bg-emerald-50 text-emerald-500",
      note: `ใน ${period === "all" ? "ทุกช่วง" : period}`,
    },
    {
      label: "ชอร์ตลิสต์",
      value: totalShortlist,
      iconNode: <BookmarkCheck className="w-[18px] h-[18px] text-[#0DC2FF]" />,
      color: "bg-[#0DC2FF]/10 text-[#0DC2FF]",
      note: `ใน ${period === "all" ? "ทุกช่วง" : period}`,
    },
    {
      label: "รับเข้าทำงาน",
      value: totalHired,
      iconNode: <UserCheck className="w-[18px] h-[18px] text-rose-500" />,
      color: "bg-rose-50 text-rose-500",
      note: `ใน ${period === "all" ? "ทุกช่วง" : period}`,
    },
  ];

  const handlePeriodChange = (val: string) => {
    const p = val as Period;
    setPeriod(p);
    setShowCustomDate(p === "custom");
  };

  const selectedContract = contracts.find((c) => c.id === contractFilter);

  return (
    <div className="min-h-[calc(100vh-64px)] bg-[#F0F2F5]">
      <div className="max-w-screen-xl mx-auto px-6 py-6">
        {/* Page header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-[12px] font-bold text-[#0DC2FF] uppercase tracking-widest mb-0.5">Super Recruit</p>
            <h1 className="text-[22px] font-bold text-[#1A1A2E]">จัดการประกาศงาน</h1>
            <p className="text-[13px] text-gray-400 mt-0.5">
              {totalOnline} ประกาศออนไลน์ · {scopeJobs.length} ทั้งหมด
              {selectedContract && (
                <span className="ml-1.5 text-[#127EE3] font-medium">· {selectedContract.label}</span>
              )}
            </p>
          </div>
          <button
            onClick={onCreateJob}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#127EE3] text-white text-[14px] font-semibold rounded-xl hover:bg-[#0f6bc7] transition-colors shadow-md shadow-[#127EE3]/20"
          >
            <Plus className="w-4 h-4" />
            สร้างประกาศใหม่
          </button>
        </div>

        {/* Stats section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-[13px] font-semibold text-gray-500">ภาพรวมการสรรหา</span>
            </div>
            <div className="flex items-center gap-2">
              {/* Period dropdown */}
              <div className="relative">
                <select
                  value={period}
                  onChange={(e) => handlePeriodChange(e.target.value)}
                  className="appearance-none bg-[#F0F2F5] border border-transparent rounded-xl pl-3 pr-8 py-1.5 text-[12.5px] font-medium text-gray-600 focus:outline-none focus:border-[#0DC2FF] focus:bg-white transition-all cursor-pointer"
                >
                  {PERIOD_OPTIONS.map((o) => (
                    <option key={o.key} value={o.key}>{o.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>

              {/* Contract dropdown */}
              <div className="relative">
                <FileSignature className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                <select
                  value={contractFilter}
                  onChange={(e) => setContractFilter(e.target.value)}
                  className={`appearance-none border rounded-xl pl-8 pr-8 py-1.5 text-[12.5px] font-medium focus:outline-none transition-all cursor-pointer ${
                    contractFilter !== "all"
                      ? "bg-[#127EE3]/8 border-[#127EE3]/30 text-[#127EE3] focus:border-[#0DC2FF]"
                      : "bg-[#F0F2F5] border-transparent text-gray-600 focus:border-[#0DC2FF] focus:bg-white"
                  }`}
                >
                  <option value="all">ทุกสัญญา</option>
                  {contracts.map((c) => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Custom date range */}
          {showCustomDate && (
            <div className="flex items-center gap-2 mb-4 p-3 bg-[#F0F2F5] rounded-xl">
              <span className="text-[12px] text-gray-500 font-medium">ตั้งแต่</span>
              <input
                type="date"
                value={customFrom}
                onChange={(e) => setCustomFrom(e.target.value)}
                className="px-3 py-1.5 text-[12.5px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#0DC2FF] transition-all"
              />
              <span className="text-[12px] text-gray-400">—</span>
              <input
                type="date"
                value={customTo}
                onChange={(e) => setCustomTo(e.target.value)}
                className="px-3 py-1.5 text-[12.5px] bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-[#0DC2FF] transition-all"
              />
              <button
                onClick={() => { setPeriod("all"); setShowCustomDate(false); }}
                className="ml-auto p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Stat cards */}
          <div className="grid grid-cols-5 gap-3">
            {statCards.map((s, i) => (
              <div key={i} className="rounded-xl border border-gray-100 bg-[#FAFBFC] p-4 hover:border-gray-200 hover:bg-white transition-all">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${s.color}`}>
                    {s.iconNode}
                  </div>
                  <span className="text-[11.5px] text-gray-500 font-medium leading-tight">{s.label}</span>
                </div>
                <p className="text-[28px] font-black text-[#1A1A2E] leading-none mb-1.5">{s.value}</p>
                <p className="text-[11px] text-gray-400 font-medium">{s.note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Filter bar */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-3.5 mb-4 flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="ค้นหาตำแหน่งงาน..."
              className="w-full pl-9 pr-3 py-2 text-[13.5px] bg-[#F0F2F5] rounded-xl border border-transparent focus:outline-none focus:border-[#0DC2FF] focus:bg-white transition-all placeholder:text-gray-400"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="w-3.5 h-3.5 text-gray-400" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-[#F0F2F5] rounded-xl">
            {STATUS_FILTER_OPTIONS.map((opt) => {
              const count = opt.key === "all" ? jobs.length : jobs.filter((j) => j.status === opt.key).length;
              return (
                <button
                  key={opt.key}
                  onClick={() => setStatusFilter(opt.key)}
                  className={`px-3 py-1.5 rounded-lg text-[12.5px] font-medium transition-all ${
                    statusFilter === opt.key
                      ? "bg-white text-[#127EE3] shadow-sm font-semibold"
                      : "text-gray-500 hover:text-[#1A1A2E]"
                  }`}
                >
                  {opt.label}
                  {count > 0 && (
                    <span className={`ml-1.5 text-[10.5px] font-bold ${statusFilter === opt.key ? "text-[#127EE3]" : "text-gray-400"}`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Channel filter */}
          <div className="relative">
            <select
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value as typeof channelFilter)}
              className="appearance-none bg-[#F0F2F5] border border-transparent rounded-xl pl-3 pr-8 py-2 text-[12.5px] font-medium text-gray-600 focus:outline-none focus:border-[#0DC2FF] focus:bg-white transition-all cursor-pointer"
            >
              <option value="all">ทุกช่องทาง</option>
              <option value="online">ประกาศออนไลน์</option>
              <option value="search">ค้นหาเชิงรุก</option>
              <option value="jobfair">Job Fair</option>
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          </div>

          {/* Recruiter filter */}
          <div className="relative">
            <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            <select
              value={recruiterFilter}
              onChange={(e) => setRecruiterFilter(e.target.value)}
              className={`appearance-none border rounded-xl pl-8 pr-8 py-2 text-[12.5px] font-medium focus:outline-none transition-all cursor-pointer ${
                recruiterFilter !== "all"
                  ? "bg-[#127EE3]/8 border-[#127EE3]/30 text-[#127EE3] focus:border-[#0DC2FF]"
                  : "bg-[#F0F2F5] border-transparent text-gray-600 focus:border-[#0DC2FF] focus:bg-white"
              }`}
            >
              <option value="all">ทุก Recruiter</option>
              {recruiters.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-[12.5px] text-gray-500">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>เรียงตาม</span>
            </div>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="appearance-none bg-[#F0F2F5] border border-transparent rounded-xl pl-3 pr-8 py-2 text-[12.5px] font-medium text-gray-600 focus:outline-none focus:border-[#0DC2FF] focus:bg-white transition-all cursor-pointer"
              >
                <option value="daysOnline">วันที่ประกาศ</option>
                <option value="topPicks">Top Picks</option>
                <option value="applicants">ผู้สมัคร</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Job list */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-gray-100">
            <div className="w-14 h-14 rounded-2xl bg-[#F0F2F5] flex items-center justify-center mb-3">
              <AlertCircle className="w-6 h-6 text-gray-300" />
            </div>
            <p className="text-[15px] font-semibold text-gray-400 mb-1">ไม่พบประกาศงาน</p>
            <p className="text-[13px] text-gray-400">ลองปรับ filter หรือสร้างประกาศใหม่</p>
            <button
              onClick={onCreateJob}
              className="mt-4 flex items-center gap-2 px-5 py-2.5 bg-[#127EE3] text-white text-[13.5px] font-semibold rounded-xl hover:bg-[#0f6bc7] transition-colors"
            >
              <Plus className="w-4 h-4" />
              สร้างประกาศใหม่
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* List header */}
            <div className="flex items-center gap-4 px-5 py-2.5 border-b border-gray-100 bg-[#F8FAFD]">
              <div className="flex-shrink-0 w-[90px]">
                <span className="text-[10.5px] font-semibold text-gray-400 uppercase tracking-wider">สถานะ</span>
              </div>
              <div className="flex-1 text-[10.5px] font-semibold text-gray-400 uppercase tracking-wider">ตำแหน่งงาน</div>
              <div className="flex items-center gap-1.5 flex-shrink-0">
                {[
                  { w: 52, icon: <Sparkles className="w-3 h-3 text-[#127EE3]" />, label: "Top Picks" },
                  { w: 52, icon: <Users className="w-3 h-3 text-gray-400" />, label: "ผู้สมัคร" },
                  { w: 52, icon: <BookmarkCheck className="w-3 h-3 text-gray-400" />, label: "Shortlist" },
                  { w: 52, icon: <UserCheck className="w-3 h-3 text-gray-400" />, label: "รับเข้า" },
                ].map((col) => (
                  <div key={col.label} style={{ width: col.w }} className="flex flex-col items-center justify-center gap-0.5">
                    {col.icon}
                    <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-wide">{col.label}</span>
                  </div>
                ))}
              </div>
              <div className="w-8 flex-shrink-0" />
            </div>
            {filtered.map((job) => (
              <JobListRow
                key={job.id}
                job={job}
                onStatusChange={onJobStatusChange}
                onViewTopPicks={onViewTopPicks}
                onViewJobTopPicks={() => onViewJobTopPicks(job.id, job.title)}
                onViewApplicants={() => onViewApplicants(job.title)}
                onViewApplicantsShortlist={() => onViewApplicantsShortlist(job.id, job.title)}
                onViewApplicantsHired={() => onViewApplicantsHired(job.id, job.title)}
                onEdit={() => onEditJob(job.id)}
                onCopy={() => onCopyJob(job.id)}
                onDelete={() => onDeleteJob(job.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
