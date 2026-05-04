import { useState } from "react";
import {
  LayoutDashboard,
  Briefcase,
  Search,
  Star,
  Award,
  Settings,
  Zap,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { AppPage } from "../App";

interface SidebarProps {
  activePage: AppPage;
  onNavigate: (page: AppPage) => void;
  collapsed: boolean;
  onToggle: () => void;
}

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  collapsed?: boolean;
  badge?: number;
  onClick?: () => void;
}

function NavItem({ icon, label, active, collapsed, badge, onClick }: NavItemProps) {
  return (
    <li>
      <button
        onClick={onClick}
        title={collapsed ? label : undefined}
        className={`w-full flex items-center gap-3 rounded-xl text-[15.5px] font-medium transition-all relative group ${
          collapsed ? "px-0 py-2.5 justify-center" : "px-3 py-2.5"
        } ${
          active
            ? "bg-[#0DC2FF]/12 text-[#0DC2FF]"
            : "text-gray-500 hover:bg-gray-100 hover:text-[#1A1A2E]"
        }`}
      >
        <span className={`flex-shrink-0 ${active ? "text-[#0DC2FF]" : ""}`}>{icon}</span>
        {!collapsed && <span className="truncate">{label}</span>}
        {badge !== undefined && badge > 0 && (
          <span className={`min-w-[18px] h-[18px] bg-[#127EE3] text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 flex-shrink-0 ${collapsed ? "absolute top-1 right-1" : "ml-auto"}`}>
            {badge}
          </span>
        )}
        {collapsed && (
          <span className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-[#1A1A2E] text-white text-[14px] font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-150 pointer-events-none z-50 shadow-lg">
            {label}
            <span className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1.5 w-2 h-2 bg-[#1A1A2E] rotate-45" />
          </span>
        )}
      </button>
    </li>
  );
}

function SectionLabel({ label, collapsed }: { label: string; collapsed: boolean }) {
  if (collapsed) {
    return <div className="my-2 h-px bg-gray-100 mx-2" />;
  }
  return (
    <div className="mt-5 mb-1.5 px-3">
      <p className="text-[12px] font-bold text-gray-400 uppercase tracking-widest">{label}</p>
    </div>
  );
}

export default function Sidebar({ activePage, onNavigate, collapsed, onToggle }: SidebarProps) {
  return (
    <aside
      className={`${collapsed ? "w-[60px]" : "w-[220px]"} min-h-screen bg-white border-r border-gray-100 flex flex-col flex-shrink-0 sticky top-0 h-screen transition-all duration-200 ease-in-out z-10 ${collapsed ? "overflow-visible" : "overflow-hidden"}`}
    >
      <div className={`flex items-center border-b border-gray-100 h-16 flex-shrink-0 ${collapsed ? "justify-center px-0" : "px-4 justify-between"}`}>
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#0DC2FF] rounded-lg flex items-center justify-center flex-shrink-0">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="text-[#1A1A2E] font-bold text-[17px] tracking-tight">Super Recruit</span>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 bg-[#0DC2FF] rounded-lg flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
        )}
        {!collapsed && (
          <button
            onClick={onToggle}
            className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors flex-shrink-0"
          >
            <ChevronLeft className="w-4 h-4 text-gray-500" />
          </button>
        )}
      </div>

      <nav className={`flex-1 py-3 ${collapsed ? "px-2" : "px-3 overflow-y-auto overflow-x-hidden"}`}>
        <ul className="space-y-0.5">
          <NavItem
            icon={<LayoutDashboard size={18} />}
            label="หน้าหลัก"
            active={activePage === "dashboard"}
            collapsed={collapsed}
            onClick={() => onNavigate("dashboard")}
          />
          <NavItem
            icon={<Briefcase size={18} />}
            label="จัดการประกาศงาน"
            active={activePage === "manage-jobs"}
            collapsed={collapsed}
            onClick={() => onNavigate("manage-jobs")}
          />
          <NavItem
            icon={<Search size={18} />}
            label="ค้นหาผู้หางาน"
            active={activePage === "candidate-search"}
            collapsed={collapsed}
            onClick={() => onNavigate("candidate-search")}
          />
          <NavItem
            icon={<Star size={18} />}
            label="Top Picks"
            active={activePage === "top-picks"}
            collapsed={collapsed}
            onClick={() => onNavigate("top-picks")}
          />
          <NavItem
            icon={<MessageSquare size={18} />}
            label="ข้อความ"
            active={activePage === "messages"}
            collapsed={collapsed}
            badge={3}
            onClick={() => onNavigate("messages")}
          />
        </ul>

        <SectionLabel label="รายงาน" collapsed={collapsed} />
        <ul className="space-y-0.5">
          <NavItem icon={<Award size={18} />} label="Employer Branding" active={activePage === "employer-branding"} collapsed={collapsed} onClick={() => onNavigate("employer-branding")} />
        </ul>

        <SectionLabel label="การตั้งค่า" collapsed={collapsed} />
        <ul className="space-y-0.5">
          <NavItem icon={<Settings size={18} />} label="ตั้งค่าองค์กร" active={activePage === "org-settings"} collapsed={collapsed} onClick={() => onNavigate("org-settings")} />
        </ul>
      </nav>

      {collapsed && (
        <div className="px-2 pb-3 flex flex-col items-center gap-2">
          <button
            onClick={onToggle}
            className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      )}
    </aside>
  );
}
