import { useState } from "react";
import { BarChart2, ArrowRight, Sparkles, Users, Search, Info, Zap, ChevronRight } from "lucide-react";

import type { JobRow } from "../data/jobs";

const tabLabels = [
  "ออนไลน์",
  "ออฟไลน์",
  "Active Search",
  "Job Fair",
];

function DayTag({ days }: { days: number }) {
  const isNew = days <= 3;
  const isRecent = days <= 7;
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[14px] font-semibold ${
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

interface RecruitmentSummaryProps {
  jobs: JobRow[];
  onViewTopPicks: () => void;
  onViewJobTopPicks: (jobId: string, jobTitle: string) => void;
  onManageJobs: () => void;
  onViewApplicants: (jobTitle: string) => void;
  onViewShortlist: (jobId: string, jobTitle: string) => void;
  onViewApplicantsShortlist: (jobId: string, jobTitle: string) => void;
  onViewApplicantsInterview: (jobId: string, jobTitle: string) => void;
  onEditJob: (jobId: string) => void;
}

function TopPickInlinePreview({ onViewTopPicks, jobTitle }: { onViewTopPicks: () => void; jobTitle?: string }) {
  return (
    <div className="overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-2.5 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#F0F8FF] border border-[#0DC2FF]/20">
            <Sparkles className="w-3 h-3 text-[#0DC2FF]" />
            <span className="text-[12px] font-bold text-[#0277a8] tracking-wide uppercase">Top Picks</span>
          </div>
          <span className="text-[14px] text-gray-500">
            ตัวอย่าง 1 ใน <strong className="text-[#1A1A2E]">142 คน</strong> ที่ AI คัดสำหรับ
            {jobTitle && <span className="ml-1 font-semibold text-[#127EE3]">{jobTitle}</span>}
          </span>
        </div>
        <button
          onClick={onViewTopPicks}
          className="flex items-center gap-1 text-[14px] font-semibold text-[#127EE3] hover:text-[#0DC2FF] transition-colors"
        >
          ดูทั้งหมด <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="px-6 pt-4 pb-4 grid grid-cols-[0.9fr_2.1fr] gap-0">
        <div className="flex flex-col gap-4 pr-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F0F2F5] border border-gray-200 flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-gray-300" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-[15px] text-[#1A1A2E] font-bold leading-snug">Senior Product Designer</p>
              <div className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 border border-emerald-200 text-emerald-600 tracking-wide uppercase w-fit">
                <Zap className="w-2 h-2" />
                Perfectly Fit
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-[13.5px] text-gray-500">
              <span className="font-medium">LINE MAN Wongnai</span>
              <span className="mx-1.5 text-gray-300">•</span>
              <span className="text-gray-400">6 ปี</span>
            </span>
            <span className="text-[13.5px] font-semibold text-gray-600">75K–95K THB</span>
            <div className="flex flex-wrap gap-1 mt-0.5">
              {["Figma", "Design System", "User Research"].map((s) => (
                <span key={s} className="text-[11px] font-semibold px-1.5 py-0.5 rounded bg-[#F0F8FF] border border-[#0DC2FF]/20 text-[#0277a8]">{s}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 pl-4 border-l border-[#E5E7EB]">
          <p className="text-[13px] font-bold text-gray-400 uppercase tracking-wider">Why This Candidate Stands Out</p>
          <ul className="space-y-1.5">
            {[
              "ผ่านการทำงานบน product ที่คนใช้จริงหลักล้านคนมา 6 ปี — ประสบการณ์แบบนี้ให้ความเข้าใจ scale และ impact ที่คนในสายอื่นไม่มีทาง calibrate ได้",
              "ทำได้ครบตั้งแต่ออกแบบ component library, สร้าง design system, ไปจนถึงเก็บ user insight ด้วยตัวเอง",
            ].map((item, i) => (
              <li key={i} className="flex gap-2 text-[14px] text-gray-700 leading-relaxed list-none">
                <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#0DC2FF] mt-[5px]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <button
            onClick={onViewTopPicks}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0DC2FF] to-[#127EE3] text-white text-[14.5px] font-bold shadow-md shadow-[#0DC2FF]/20 hover:shadow-[#0DC2FF]/35 hover:scale-[1.02] transition-all w-fit"
          >
            <Sparkles className="w-3.5 h-3.5" />
            ดูโปรไฟล์เต็ม + อีก 141 คน
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function RecruitmentSummary({
  jobs,
  onViewTopPicks,
  onViewJobTopPicks,
  onManageJobs,
  onViewApplicants,
  onViewShortlist,
  onViewApplicantsShortlist,
  onViewApplicantsInterview,
  onEditJob,
}: RecruitmentSummaryProps) {
  const [activeTab, setActiveTab] = useState(0);

  const onlineJobs = jobs.filter((j) => j.status === "online" && j.channel === "online");
  const offlineJobs = jobs.filter((j) => j.status === "offline");
  const searchJobs = jobs.filter((j) => j.channel === "search");
  const jobFairJobs = jobs.filter((j) => j.channel === "jobfair");

  const tabCounts = [onlineJobs.length, offlineJobs.length, searchJobs.length, jobFairJobs.length];
  const tabRows = [onlineJobs, offlineJobs, searchJobs, jobFairJobs];
  const rows = tabRows[activeTab] ?? [];

  const isSearchTab = activeTab === 2;
  const isJobFairTab = activeTab === 3;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
      {/* Title row — plain heading, no box */}
      <div className="flex items-center justify-between px-6 pt-6 pb-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[#0DC2FF]/10 rounded-lg flex items-center justify-center">
            <BarChart2 className="w-4 h-4 text-[#0DC2FF]" />
          </div>
          <h2 className="text-[#1A1A2E] font-bold text-[19px] tracking-tight">สรุปสถานะการสรรหา</h2>
        </div>
      </div>

      {/* Tabs — directly under heading, act as section header */}
      <div className="flex border-b border-gray-200 px-6 mt-4 overflow-x-auto">
        {tabLabels.map((label, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            className={`relative flex items-center gap-1.5 py-3 px-1 mr-7 text-[15.5px] font-semibold transition-all whitespace-nowrap ${
              activeTab === i
                ? "text-[#127EE3]"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {label}
            {tabCounts[i] > 0 ? (
              <span
                className={`text-[13.5px] px-1.5 py-0.5 rounded-full font-bold min-w-[20px] text-center ${
                  activeTab === i
                    ? "bg-[#127EE3]/12 text-[#127EE3]"
                    : "bg-gray-100 text-gray-400"
                }`}
              >
                {tabCounts[i]}
              </span>
            ) : (
              <span className="text-[13.5px] text-gray-300 font-medium">0</span>
            )}
            {activeTab === i && (
              <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#127EE3] rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* Context banners */}
      {activeTab === 1 && offlineJobs.length > 0 && (
        <div className="mx-6 mt-4 flex items-start gap-2.5 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          <span className="w-2 h-2 mt-1.5 rounded-full bg-red-400 shrink-0" />
          <p className="text-[15px] text-red-700 leading-relaxed">
            ตำแหน่งเหล่านี้ถูก offline ไปแล้ว — ไม่รับสมัครใหม่แล้ว แต่ยังสามารถดูและจัดการผู้สมัครที่ค้างอยู่ได้
          </p>
        </div>
      )}
      {activeTab === 2 && searchJobs.length > 0 && (
        <div className="mx-6 mt-4 flex items-start gap-2.5 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
          <Search className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
          <p className="text-[15px] text-amber-800 leading-relaxed">
            ตำแหน่งเหล่านี้ไม่ได้เปิดรับสมัครสาธารณะ — ทีมค้นหาและติดต่อผู้สมัครโดยตรง (Executive / Referral Search) กด <span className="font-semibold">จัดการ</span> เพื่อดู Shortlist ของแต่ละตำแหน่ง
          </p>
        </div>
      )}
      {activeTab === 3 && jobFairJobs.length > 0 && (
        <div className="mx-6 mt-4 flex items-start gap-2.5 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
          <Users className="w-4 h-4 text-[#127EE3] mt-0.5 shrink-0" />
          <p className="text-[15px] text-[#127EE3] leading-relaxed">
            ตำแหน่งที่นำไปเปิดรับสมัครใน <span className="font-semibold">Thailand Tech & Digital Job Fair 2025</span> — ผู้สมัครที่พบในงานสามารถเพิ่มเข้าระบบได้เลย
          </p>
        </div>
      )}

      {/* Table */}
      <div className="px-6">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="text-left py-3.5 text-[14px] font-semibold text-gray-400 uppercase tracking-wider w-[38%]">
                ตำแหน่งงาน
              </th>
              <th className="text-center py-3.5 w-[16%]">
                <div className="relative flex items-center justify-center gap-1.5 group/tpheader">
                  <Sparkles className="w-3.5 h-3.5 text-[#0DC2FF]" />
                  <span className="text-[14px] font-bold text-[#0DC2FF] uppercase tracking-wider">
                    Top Picks
                  </span>
                  <Info className="w-3 h-3 text-[#0DC2FF]/60 cursor-default" />
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-[#1A1A2E] text-white text-[14px] leading-relaxed rounded-xl px-3.5 py-3 opacity-0 group-hover/tpheader:opacity-100 transition-all duration-150 pointer-events-none z-50 shadow-xl">
                    <p className="font-semibold text-[#0DC2FF] mb-1">Top Picks คืออะไร?</p>
                    <p className="text-gray-300">AI คัดเลือกผู้สมัครที่ตรงกับตำแหน่งงานของคุณมากที่สุด จาก profile, skills, และ experience — เรียงตาม match score สูงสุด</p>
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 border-4 border-transparent border-b-[#1A1A2E]" />
                  </div>
                </div>
              </th>
              <th className="text-center py-3.5 px-4 text-[14px] font-semibold text-gray-400 uppercase tracking-wider">
                สมัครเอง
              </th>
              {isJobFairTab && (
                <th className="text-right py-3.5 text-[14px] font-semibold text-gray-400 uppercase tracking-wider">
                  งาน Job Fair
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((job, rowIdx) => (
              <>
              <tr
                key={job.id}
                className="border-b border-gray-50 last:border-0 hover:bg-[#F0F2F5]/50 transition-colors"
              >
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEditJob(job.id)}
                      className="text-[17px] font-semibold text-[#1A1A2E] hover:text-[#127EE3] transition-colors text-left"
                    >
                      {job.title}
                    </button>
                    {isSearchTab && job.searchNote && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-[13px] font-semibold text-amber-700">
                        <Search className="w-3 h-3" />
                        {job.searchNote}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 mt-1">
                    <DayTag days={job.daysOnline} />
                  </div>
                </td>
                <td className="py-4 text-center">
                  <div className="flex items-center justify-center gap-1.5 relative group/tpcell">
                    <button
                      onClick={(job.topPicks ?? 0) > 0 ? () => onViewJobTopPicks(job.id, job.title) : undefined}
                      className={`inline-flex items-center justify-center min-w-[40px] h-8 px-3 rounded-full text-[17px] font-bold bg-[#0DC2FF]/12 text-[#0891b2] transition-all ${
                        (job.topPicks ?? 0) > 0 ? "hover:bg-[#0DC2FF]/25 hover:text-[#0277a8] cursor-pointer" : "cursor-default"
                      }`}
                    >
                      {job.topPicks}
                    </button>
                    {job.topPicksNew && (
                      <span className="flex items-center gap-0.5 text-[14px] font-bold text-[#0DC2FF]">
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0DC2FF] opacity-75" />
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#0DC2FF]" />
                        </span>
                        +{job.topPicksNew}
                      </span>
                    )}
                    {(job.topPicks ?? 0) > 0 && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 bg-[#1A1A2E] text-white text-[13.5px] leading-relaxed rounded-xl px-3 py-2.5 opacity-0 group-hover/tpcell:opacity-100 transition-all duration-150 pointer-events-none z-50 shadow-xl text-center">
                        <p className="font-semibold text-[#0DC2FF] mb-0.5">AI คัดไว้แล้ว</p>
                        <p className="text-gray-300">คลิกเพื่อดูผู้สมัครที่ match กับตำแหน่งนี้มากที่สุด</p>
                        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1A1A2E]" />
                      </div>
                    )}
                  </div>
                </td>
                <td className="py-4 px-4 text-center">
                  <button
                    onClick={() => onViewApplicants(job.title)}
                    className="inline-flex items-center justify-center min-w-[40px] h-8 px-3 rounded-full text-[17px] font-bold bg-gray-50 text-gray-500 hover:bg-[#127EE3]/10 hover:text-[#127EE3] transition-all cursor-pointer"
                  >
                    {job.applicants}
                  </button>
                </td>
                {isJobFairTab && (
                  <td className="py-4 text-right">
                    {job.jobFairName ? (
                      <span className="text-[15px] text-gray-500 max-w-[180px] inline-block text-right leading-snug">
                        {job.jobFairName}
                      </span>
                    ) : null}
                  </td>
                )}
              </tr>
              {rowIdx === 0 && activeTab === 0 && (
                <tr key={`${job.id}-toppick`} className="border-b border-gray-100">
                  <td colSpan={3} className="pb-4 pt-2 bg-gray-50 rounded-lg">
                    <TopPickInlinePreview onViewTopPicks={onViewTopPicks} jobTitle={job.title} />
                  </td>
                </tr>
              )}
              </>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="py-10 text-center text-[16px] text-gray-400">
                  ไม่มีข้อมูล
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer: ดูตำแหน่งทั้งหมด — bottom-right */}
      <div className="flex justify-end px-6 pb-5 pt-2">
        <button
          onClick={onManageJobs}
          className="flex items-center gap-1.5 text-[15px] text-[#127EE3] font-semibold hover:text-[#0f6cc7] transition-colors"
        >
          ดูตำแหน่งทั้งหมด
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
