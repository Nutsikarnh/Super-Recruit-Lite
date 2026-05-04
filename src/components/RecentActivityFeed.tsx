import { useState } from "react";
import {
  UserCheck,
  MessageSquare,
  Calendar,
  FileText,
  Search,
  Star,
  Send,
  Clock,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle2,
  Eye,
} from "lucide-react";

type ActivityType =
  | "viewed_applicant"
  | "moved_stage"
  | "sent_message"
  | "scheduled_interview"
  | "ai_analyzed"
  | "shortlisted"
  | "searched"
  | "follow_up";

interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  subtitle: string;
  time: string;
  timeAgo: string;
  meta?: string;
  needsFollowUp?: boolean;
  done?: boolean;
  jobTitle?: string;
  candidateName?: string;
}

const ACTIVITIES: Activity[] = [
  {
    id: "a1",
    type: "scheduled_interview",
    title: "นัดสัมภาษณ์ ปริชาติ สิทธิกุล",
    subtitle: "Product Designer (UI/UX) — รอบ Interview 1",
    time: "วันนี้ 14:32",
    timeAgo: "30 นาทีที่แล้ว",
    jobTitle: "Product Designer (UI/UX)",
    candidateName: "ปริชาติ สิทธิกุล",
    meta: "พรุ่งนี้ 10:00 น.",
    needsFollowUp: false,
    done: true,
  },
  {
    id: "a2",
    type: "sent_message",
    title: "ส่ง Message ถึง ณัฐพล เจริญวงศ์",
    subtitle: "Senior Backend Engineer — ทาบทามตำแหน่ง",
    time: "วันนี้ 13:15",
    timeAgo: "1 ชั่วโมงที่แล้ว",
    jobTitle: "Senior Backend Engineer",
    candidateName: "ณัฐพล เจริญวงศ์",
    needsFollowUp: true,
    done: false,
  },
  {
    id: "a3",
    type: "moved_stage",
    title: "ย้าย สุธิดา อินทรา → Shortlist",
    subtitle: "Product Designer (UI/UX) — จาก Screening",
    time: "วันนี้ 11:48",
    timeAgo: "2 ชั่วโมงที่แล้ว",
    jobTitle: "Product Designer (UI/UX)",
    candidateName: "สุธิดา อินทรา",
    needsFollowUp: false,
    done: true,
  },
  {
    id: "a4",
    type: "ai_analyzed",
    title: "ดู AI วิเคราะห์ ชัยณรงค์ ภูมิพันธ์",
    subtitle: "Data Analyst",
    time: "วานนี้ 17:22",
    timeAgo: "เมื่อวาน 17:22",
    jobTitle: "Data Analyst",
    candidateName: "ชัยณรงค์ ภูมิพันธ์",
    meta: "",
    needsFollowUp: true,
    done: false,
  },
  {
    id: "a5",
    type: "shortlisted",
    title: "Shortlist ณัฐมน วรรณศิลป์",
    subtitle: "Product Designer (UI/UX) — เพิ่มใน Shortlist",
    time: "วานนี้ 15:10",
    timeAgo: "เมื่อวาน 15:10",
    jobTitle: "Product Designer (UI/UX)",
    candidateName: "ณัฐมน วรรณศิลป์",
    needsFollowUp: false,
    done: true,
  },
  {
    id: "a6",
    type: "searched",
    title: "ค้นหา \"React Native + 3 ปีขึ้นไป\"",
    subtitle: "Candidate Search — พบ 34 คน",
    time: "วานนี้ 11:05",
    timeAgo: "เมื่อวาน 11:05",
    meta: "34 ผลลัพธ์",
    needsFollowUp: false,
    done: true,
  },
  {
    id: "a7",
    type: "sent_message",
    title: "ส่ง Message ถึง วิภาวี ศรีนวล",
    subtitle: "Senior Backend Engineer — นัดสัมภาษณ์รอบแรก",
    time: "22 เม.ย.",
    timeAgo: "2 วันที่แล้ว",
    jobTitle: "Senior Backend Engineer",
    candidateName: "วิภาวี ศรีนวล",
    needsFollowUp: true,
    done: false,
  },
  {
    id: "a8",
    type: "viewed_applicant",
    title: "ดูโปรไฟล์ กิตติภณ ลาภวิสุทธิ์",
    subtitle: "Product Designer (UI/UX) — เปิดดู Resume",
    time: "22 เม.ย.",
    timeAgo: "2 วันที่แล้ว",
    jobTitle: "Product Designer (UI/UX)",
    candidateName: "กิตติภณ ลาภวิสุทธิ์",
    needsFollowUp: false,
    done: true,
  },
];

const ICON_MAP: Record<ActivityType, { icon: React.ElementType; bg: string; color: string }> = {
  viewed_applicant: { icon: Eye, bg: "bg-gray-100", color: "text-gray-500" },
  moved_stage: { icon: UserCheck, bg: "bg-emerald-50", color: "text-emerald-600" },
  sent_message: { icon: Send, bg: "bg-blue-50", color: "text-[#127EE3]" },
  scheduled_interview: { icon: Calendar, bg: "bg-violet-50", color: "text-violet-500" },
  ai_analyzed: { icon: FileText, bg: "bg-amber-50", color: "text-amber-500" },
  shortlisted: { icon: Star, bg: "bg-pink-50", color: "text-pink-500" },
  searched: { icon: Search, bg: "bg-sky-50", color: "text-sky-500" },
  follow_up: { icon: MessageSquare, bg: "bg-orange-50", color: "text-orange-500" },
};

function ActivityItem({ activity, isLast }: { activity: Activity; isLast: boolean }) {
  const { icon: Icon, bg, color } = ICON_MAP[activity.type];

  return (
    <div className="flex gap-3 group">
      <div className="flex flex-col items-center flex-shrink-0">
        <div className={`w-8 h-8 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
          <Icon className={`w-3.5 h-3.5 ${color}`} />
        </div>
        {!isLast && <div className="w-px flex-1 bg-gray-100 mt-1 min-h-[16px]" />}
      </div>
      <div className="pb-4 flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-[#1A1A2E] leading-snug truncate">{activity.title}</p>
            <p className="text-[11.5px] text-gray-400 mt-0.5 truncate">{activity.subtitle}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
            {activity.meta && (
              <span className="text-[10.5px] font-semibold text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-full">
                {activity.meta}
              </span>
            )}
            {activity.needsFollowUp && !activity.done && (
              <span className="flex items-center gap-1 text-[10.5px] font-semibold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-full">
                <AlertCircle className="w-3 h-3" />
                ติดตาม
              </span>
            )}
            {activity.done && (
              <span className="flex items-center gap-1 text-[10.5px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3 h-3" />
                เสร็จ
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5 mt-1">
          <Clock className="w-3 h-3 text-gray-300" />
          <span className="text-[11px] text-gray-400">{activity.timeAgo}</span>
        </div>
      </div>
    </div>
  );
}

export default function RecentActivityFeed() {
  const [expanded, setExpanded] = useState(false);

  const followUpCount = ACTIVITIES.filter((a) => a.needsFollowUp && !a.done).length;
  const shown = expanded ? ACTIVITIES : ACTIVITIES.slice(0, 4);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-50">
        <div className="flex items-center gap-3">
          <h2 className="text-[13px] font-bold text-[#1A1A2E]">Recent Activity</h2>
          {followUpCount > 0 && (
            <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2.5 py-0.5 rounded-full">
              <AlertCircle className="w-3 h-3" />
              {followUpCount} รายการรอติดตาม
            </span>
          )}
        </div>
        <span className="text-[11.5px] text-gray-400">อลิสา สุขใจ</span>
      </div>

      <div className="px-5 pt-4">
        {shown.map((activity, i) => (
          <ActivityItem
            key={activity.id}
            activity={activity}
            isLast={i === shown.length - 1}
          />
        ))}
      </div>

      <div className="px-5 pb-4">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="w-full flex items-center justify-center gap-1.5 py-2 text-[12.5px] font-medium text-gray-400 hover:text-[#127EE3] transition-colors border border-dashed border-gray-200 hover:border-[#127EE3]/40 rounded-xl"
        >
          {expanded ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" />
              ย่อ
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" />
              ดูทั้งหมด {ACTIVITIES.length} รายการ
            </>
          )}
        </button>
      </div>
    </div>
  );
}
