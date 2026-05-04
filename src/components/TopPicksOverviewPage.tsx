import { useState } from "react";
import { Sparkles, Clock, ChevronRight, Users, Search } from "lucide-react";

type JobStatus = "online" | "offline";
type TabFilter = "all" | "online" | "offline";

interface JobPickEntry {
  id: string;
  title: string;
  count: number;
  newCount: number;
  updatedAt: string;
  status: JobStatus;
}

const JOB_PICKS: JobPickEntry[] = [
  { id: "1", title: "Product Designer (UI/UX)", count: 210, newCount: 12, updatedAt: "อัปเดตเมื่อ 2 ชั่วโมงที่แล้ว", status: "online" },
  { id: "2", title: "Sales Executive", count: 185, newCount: 8, updatedAt: "อัปเดตเมื่อ 5 ชั่วโมงที่แล้ว", status: "online" },
  { id: "3", title: "Marketing Manager", count: 96, newCount: 0, updatedAt: "อัปเดตเมื่อ 1 วันที่แล้ว", status: "offline" },
  { id: "4", title: "Software Engineer", count: 142, newCount: 5, updatedAt: "อัปเดตเมื่อ 3 ชั่วโมงที่แล้ว", status: "online" },
];

const TABS: { key: TabFilter; label: string }[] = [
  { key: "all", label: "ทั้งหมด" },
  { key: "online", label: "ตำแหน่งงานออนไลน์" },
  { key: "offline", label: "ตำแหน่งงานออฟไลน์" },
];

interface TopPicksOverviewPageProps {
  onSelectJob: (jobId: string, jobTitle: string) => void;
}

export default function TopPicksOverviewPage({ onSelectJob }: TopPicksOverviewPageProps) {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<TabFilter>("all");

  const filtered = JOB_PICKS.filter((job) => {
    const matchesTab = tab === "all" || job.status === tab;
    const matchesQuery = job.title.toLowerCase().includes(query.toLowerCase());
    return matchesTab && matchesQuery;
  });

  return (
    <div className="max-w-screen-md mx-auto px-6 py-10 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0DC2FF] to-[#127EE3] flex items-center justify-center shadow-sm shadow-[#127EE3]/20">
            <Sparkles className="w-[18px] h-[18px] text-white" />
          </div>
          <h1 className="text-[30px] font-semibold text-[#1A1A2E] leading-tight">Top Picks</h1>
        </div>
        <p className="text-[17px] text-gray-500 mt-1">
          เลือกตำแหน่งงานที่ต้องการดูผู้สมัครที่ AI แนะนำ
        </p>
      </div>

      {/* Search + Tabs */}
      <div className="flex flex-col gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ค้นหาตำแหน่งงาน..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-[16px] text-[#1A1A2E] placeholder-gray-400 focus:outline-none focus:border-[#127EE3]/50 focus:ring-2 focus:ring-[#127EE3]/10 shadow-sm transition-all"
          />
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 bg-white border border-gray-100 rounded-xl p-1 shadow-sm w-fit">
          {TABS.map((t) => {
            const count =
              t.key === "all"
                ? JOB_PICKS.length
                : JOB_PICKS.filter((j) => j.status === t.key).length;
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-[15px] font-medium transition-all whitespace-nowrap ${
                  active
                    ? "bg-gradient-to-r from-[#01BFF9] to-[#019EFC] text-white shadow-sm"
                    : "text-gray-500 hover:text-[#1A1A2E] hover:bg-gray-50"
                }`}
              >
                {t.label}
                <span
                  className={`text-[13px] font-bold px-1.5 py-0.5 rounded-full ${
                    active ? "bg-white/25 text-white" : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Job cards */}
      <div className="flex flex-col gap-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-[16px] text-gray-400">
            ไม่พบตำแหน่งงานที่ตรงกับเงื่อนไข
          </div>
        ) : (
          filtered.map((job) => (
            <button
              key={job.id}
              onClick={() => onSelectJob(job.id, job.title)}
              className="group w-full text-left bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-[#127EE3]/30 transition-all duration-200 px-6 py-5 flex items-center gap-5"
            >
              {/* Icon */}
              <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-[#F0F8FF] border border-[#127EE3]/10 flex items-center justify-center group-hover:bg-[#127EE3]/10 transition-colors">
                <Sparkles className="w-5 h-5 text-[#127EE3]" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-[18px] font-semibold text-[#1A1A2E] leading-snug truncate">{job.title}</p>
                  <span
                    className={`flex-shrink-0 text-[12px] font-semibold px-2 py-0.5 rounded-full ${
                      job.status === "online"
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                        : "bg-gray-100 text-gray-500 border border-gray-200"
                    }`}
                  >
                    {job.status === "online" ? "ออนไลน์" : "ออฟไลน์"}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-[15px] text-[#127EE3] font-medium">
                    <Users className="w-3.5 h-3.5" />
                    {job.count} ผู้สมัครที่ AI แนะนำ
                    {job.newCount > 0 && (
                      <>
                        <span className="text-gray-300 mx-0.5">·</span>
                        <span className="text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded-full font-semibold leading-none">
                          ใหม่ {job.newCount} คน
                        </span>
                      </>
                    )}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-gray-300" />
                  <span className="flex items-center gap-1 text-[14.5px] text-gray-400">
                    <Clock className="w-3 h-3" />
                    {job.updatedAt}
                  </span>
                </div>
              </div>

              {/* CTA */}
              <div className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#01BFF9] to-[#019EFC] text-white text-[15px] font-semibold shadow-sm shadow-[#019EFC]/20 group-hover:opacity-90 transition-opacity">
                ดู Top Picks
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
