import { useState } from "react";
import {
  ArrowLeft, Search, Star, Briefcase, MapPin, Clock,
  Circle, Mail, MessageCircle, Send, Award, AlertCircle, UserCheck, Sparkles, Users,
  Eye, CheckCircle2, FileText, ChevronDown
} from "lucide-react";
import type { ShortlistCandidate, PipelineStage } from "../data/applicants";
import {
  mockShortlistByJob, PIPELINE_STAGES,
  SOURCE_LABELS_SEARCH, SOURCE_COLORS_SEARCH
} from "../data/applicants";
import ApplicantDetailPanel from "./ApplicantDetailPanel";
import type { ApplicantRow } from "../data/applicants";



function StageBadge({ stage }: { stage: PipelineStage }) {
  const cfg = PIPELINE_STAGES.find((s) => s.key === stage)!;
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold ${cfg.bg} ${cfg.color}`}>
      {cfg.label}
    </span>
  );
}

function toApplicantRow(c: ShortlistCandidate): ApplicantRow {
  return {
    id: c.id,
    name: c.name,
    initials: c.initials,
    avatarColor: c.avatarColor,
    currentTitle: c.currentTitle,
    currentCompany: c.currentCompany,
    experience: c.experience,
    education: c.education,
    location: c.location,
    salaryExpect: c.salaryExpect,
    appliedAt: c.addedAt,
    source: c.source === "headhunt" ? "direct" : c.source === "refer" ? "refer" : "linkedin",
    stage: c.stage,
    aiSummary: c.aiSummary,
    strengths: c.strengths,
    concerns: c.concerns,
    skills: c.skills,
    note: c.note,
    interviewDate: c.interviewDate,
    offerAmount: c.offerAmount,
    isRead: c.isRead,
  };
}

const STAGE_FILTER_OPTIONS: { key: PipelineStage | "all"; label: string }[] = [
  { key: "all",          label: "ทั้งหมด" },
  { key: "new",          label: "ใหม่" },
  { key: "shortlist",    label: "ชอร์ตลิสต์" },
  { key: "review",       label: "ส่งต่อให้พิจารณา" },
  { key: "to_interview", label: "ต้องนัดสัมภาษณ์" },
  { key: "interview",    label: "สัมภาษณ์" },
  { key: "passed",       label: "ผ่านสัมภาษณ์" },
  { key: "offer",        label: "Offer" },
  { key: "hired",        label: "รับเข้าทำงาน" },
  { key: "rejected",     label: "ไม่ผ่าน / ยกเลิก" },
];

interface ShortlistPageProps {
  jobId: string;
  jobTitle: string;
  onBack: () => void;
}

export default function ShortlistPage({ jobId, jobTitle, onBack }: ShortlistPageProps) {
  const [stageFilter, setStageFilter] = useState<PipelineStage | "all">("all");
  const [sourceFilter, setSourceFilter] = useState<"all" | "top_pick" | "self_apply">("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<ShortlistCandidate | null>(null);
  const [candidates, setCandidates] = useState<ShortlistCandidate[]>(
    mockShortlistByJob[jobId] ?? []
  );

  const isOnlineJob = !["s1", "s2", "s3", "j9", "j10", "j11"].includes(jobId);

  const filtered = candidates.filter((c) => {
    if (stageFilter !== "all" && c.stage !== stageFilter) return false;
    if (isOnlineJob && sourceFilter !== "all" && c.source !== sourceFilter) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.currentTitle.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const stageStats = PIPELINE_STAGES.reduce((acc, s) => {
    acc[s.key] = candidates.filter((c) => c.stage === s.key).length;
    return acc;
  }, {} as Record<PipelineStage, number>);

  const unreadCount = candidates.filter((c) => !c.isRead).length;

  const handleStageChange = (candidateId: string, newStage: PipelineStage) => {
    setCandidates((prev) =>
      prev.map((c) => (c.id === candidateId ? { ...c, stage: newStage } : c))
    );
    if (selected && selected.id === candidateId) {
      setSelected((prev) => prev ? { ...prev, stage: newStage } : prev);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5]">
      <div className="max-w-screen-2xl mx-auto px-6 py-6">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-xl bg-white border border-gray-100 flex items-center justify-center hover:border-[#127EE3] hover:text-[#127EE3] transition-all"
          >
            <ArrowLeft className="w-4.5 h-4.5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-[12px] font-bold text-emerald-600 uppercase tracking-widest">Shortlist</p>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[11px] font-bold">
                  {unreadCount} ใหม่
                </span>
              )}
            </div>
            <h1 className="text-[22px] font-bold text-[#1A1A2E]">{jobTitle}</h1>
            <p className="text-[13px] text-gray-400">
              {candidates.length} คนใน Shortlist · {(stageStats.interview ?? 0) + (stageStats.to_interview ?? 0)} สัมภาษณ์ · {stageStats.offer ?? 0} Offer
            </p>
          </div>
        </div>

        <div className="flex gap-2 mb-5 overflow-x-auto pb-0.5">
          {([
            { label: "ใหม่",             key: "new"          as PipelineStage, icon: <Circle        className="w-3.5 h-3.5" style={{ color: "#9CA3AF" }} />, accent: "#9CA3AF" },
            { label: "ชอร์ตลิสต์",       key: "shortlist"    as PipelineStage, icon: <Eye           className="w-3.5 h-3.5" style={{ color: "#3B82F6" }} />, accent: "#3B82F6" },
            { label: "ส่งต่อให้พิจารณา", key: "review"       as PipelineStage, icon: <Send          className="w-3.5 h-3.5" style={{ color: "#6366F1" }} />, accent: "#6366F1" },
            { label: "ต้องนัดสัมภาษณ์",  key: "to_interview" as PipelineStage, icon: <Clock         className="w-3.5 h-3.5" style={{ color: "#F59E0B" }} />, accent: "#F59E0B" },
            { label: "สัมภาษณ์",          key: "interview"    as PipelineStage, icon: <MessageCircle className="w-3.5 h-3.5" style={{ color: "#F97316" }} />, accent: "#F97316" },
            { label: "ผ่านสัมภาษณ์",      key: "passed"       as PipelineStage, icon: <CheckCircle2  className="w-3.5 h-3.5" style={{ color: "#22C55E" }} />, accent: "#22C55E" },
            { label: "Offer",             key: "offer"        as PipelineStage, icon: <FileText      className="w-3.5 h-3.5" style={{ color: "#8B5CF6" }} />, accent: "#8B5CF6" },
            { label: "รับเข้าทำงาน",      key: "hired"        as PipelineStage, icon: <Award         className="w-3.5 h-3.5" style={{ color: "#10B981" }} />, accent: "#10B981" },
            { label: "ไม่ผ่าน / ยกเลิก",   key: "rejected"     as PipelineStage, icon: <AlertCircle   className="w-3.5 h-3.5" style={{ color: "#EF4444" }} />, accent: "#EF4444" },
          ]).map((s) => {
            const isActive = stageFilter === s.key;
            const cnt = stageStats[s.key] ?? 0;
            return (
              <button
                key={s.key}
                onClick={() => setStageFilter(stageFilter === s.key ? "all" : s.key)}
                style={isActive ? { borderColor: s.accent, backgroundColor: `${s.accent}0D` } : {}}
                className={`flex-shrink-0 flex flex-col gap-2 px-4 py-3 rounded-xl border text-left transition-all min-w-[110px] ${
                  isActive
                    ? "shadow-sm"
                    : "bg-white border-gray-100 hover:border-gray-300 hover:shadow-sm"
                }`}
              >
                <div className="flex items-center gap-1.5">
                  {s.icon}
                  <span className="text-[10.5px] font-semibold uppercase tracking-wide leading-none text-gray-400">{s.label}</span>
                </div>
                <p className="text-[26px] font-black leading-none" style={{ color: isActive ? s.accent : "#1A1A2E" }}>{cnt}</p>
              </button>
            );
          })}
        </div>

        {selected && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <div
              className="absolute inset-0 bg-black/25 backdrop-blur-[1px]"
              onClick={() => setSelected(null)}
            />
            <div className="relative w-[75vw] max-w-[1100px] min-w-[720px] h-full bg-white shadow-2xl flex flex-col animate-slide-in-right overflow-hidden">
              <ApplicantDetailPanel
                applicant={toApplicantRow(selected)}
                onClose={() => setSelected(null)}
                onStageChange={handleStageChange}
              />
            </div>
          </div>
        )}

        <div className="flex gap-5">
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl border border-gray-100 p-3.5 mb-4 flex items-center gap-3 flex-wrap shadow-sm">
              <div className="relative flex-1 min-w-[180px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="ค้นหาชื่อหรือตำแหน่ง..."
                  className="w-full pl-9 pr-3 py-2 text-[13px] bg-[#F0F2F5] rounded-xl border border-transparent focus:outline-none focus:border-emerald-400 focus:bg-white transition-all"
                />
              </div>

              {isOnlineJob && (
                <div className="flex items-center gap-1.5 p-1 bg-[#F0F2F5] rounded-xl">
                  {[
                    { key: "all" as const, label: "ทั้งหมด", count: candidates.length },
                    { key: "top_pick" as const, label: "ค้นหาเชิงรุก", count: candidates.filter((c) => c.source === "top_pick").length },
                    { key: "self_apply" as const, label: "สมัครเอง", count: candidates.filter((c) => c.source === "self_apply").length },
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => setSourceFilter(opt.key)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] font-medium transition-all ${
                        sourceFilter === opt.key
                          ? "bg-white text-emerald-600 shadow-sm font-semibold"
                          : "text-gray-500 hover:text-[#1A1A2E]"
                      }`}
                    >
                      {opt.key === "top_pick" && <Sparkles className="w-3 h-3" />}
                      {opt.key === "self_apply" && <Users className="w-3 h-3" />}
                      {opt.label}
                      <span className={`text-[10.5px] font-bold ${sourceFilter === opt.key ? "text-emerald-500" : "text-gray-400"}`}>
                        {opt.count}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              <div className="relative">
                <select
                  value={stageFilter}
                  onChange={(e) => setStageFilter(e.target.value as PipelineStage | "all")}
                  className="appearance-none bg-[#F0F2F5] rounded-xl pl-3 pr-8 py-2 text-[12.5px] font-medium text-gray-600 focus:outline-none border border-transparent focus:border-emerald-400 focus:bg-white transition-all cursor-pointer"
                >
                  <option value="all">สถานะทั้งหมด</option>
                  <option value="new">ใหม่</option>
                  <option value="shortlist">ชอร์ตลิสต์</option>
                  <option value="review">ส่งต่อให้พิจารณา</option>
                  <option value="to_interview">ลิสต์ต้องนัดสัมภาษณ์</option>
                  <option value="interview">สัมภาษณ์</option>
                  <option value="passed">ผ่านสัมภาษณ์</option>
                  <option value="offer">Offer</option>
                  <option value="hired">รับเข้าทำงาน</option>
                  <option value="rejected">ไม่ผ่าน / ยกเลิก</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-gray-100">
                <AlertCircle className="w-10 h-10 text-gray-200 mb-3" />
                <p className="text-[14px] font-semibold text-gray-400">ไม่พบข้อมูล Shortlist</p>
                <p className="text-[13px] text-gray-300 mt-1">ยังไม่มีคนใน Shortlist สำหรับตำแหน่งนี้</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((candidate) => (
                  <ShortlistCard
                    key={candidate.id}
                    candidate={candidate}
                    onSelect={() => setSelected(candidate)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ShortlistCard({
  candidate,
  onSelect,
}: {
  candidate: ShortlistCandidate;
  onSelect: () => void;
}) {
  return (
    <div
      onClick={onSelect}
      className={`bg-white rounded-2xl border cursor-pointer hover:shadow-md transition-all duration-200 group overflow-hidden ${
        !candidate.isRead
          ? "border-emerald-200 shadow-sm"
          : "border-gray-200 hover:border-emerald-300"
      }`}
    >
      {!candidate.isRead && (
        <div className="h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400" />
      )}
      <div className="p-4 flex items-start gap-3.5">
        <div className="relative flex-shrink-0">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-[13px] font-bold shadow-sm"
            style={{ backgroundColor: candidate.avatarColor }}
          >
            {candidate.initials}
          </div>
          {!candidate.isRead && (
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-sm" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="min-w-0">
              <p className="text-[14px] font-semibold text-[#111827] leading-snug group-hover:text-emerald-700 transition-colors truncate">
                {candidate.name}
              </p>
              <p className="text-[12px] text-gray-500 mt-0.5 truncate">
                {candidate.currentTitle} · {candidate.currentCompany}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap mt-2">
            <span className="flex items-center gap-1 text-[11px] text-gray-400">
              <Briefcase className="w-3 h-3 text-gray-300" />
              {candidate.experience}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-gray-400">
              <MapPin className="w-3 h-3 text-gray-300" />
              {candidate.location}
            </span>
            <span className="flex items-center gap-1 text-[11px] text-gray-400">
              <Clock className="w-3 h-3 text-gray-300" />
              เพิ่มเมื่อ {candidate.addedAt}
            </span>
          </div>

          <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">
            <StageBadge stage={candidate.stage} />
            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10.5px] font-semibold ${SOURCE_COLORS_SEARCH[candidate.source]}`}>
              <UserCheck className="w-3 h-3" />
              {SOURCE_LABELS_SEARCH[candidate.source]}
            </span>
            {candidate.skills.slice(0, 3).map((s) => (
              <span key={s} className="px-2 py-0.5 rounded-md text-[10.5px] font-medium bg-gray-100 text-gray-500">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-4 mb-4 pt-3 border-t border-gray-100">
        <p className="text-[11.5px] text-gray-500 line-clamp-2 leading-relaxed">
          <span className="text-emerald-600 font-semibold">AI · </span>
          {candidate.aiSummary}
        </p>
      </div>
    </div>
  );
}
