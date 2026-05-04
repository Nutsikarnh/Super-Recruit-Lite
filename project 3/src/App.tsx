import { useState } from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import WelcomeBanner from "./components/WelcomeBanner";
import RecruitmentSummary from "./components/RecruitmentSummary";
import RightPanel from "./components/RightPanel";
import TopPicksPage from "./components/TopPicksPage";
import TopPicksOverviewPage from "./components/TopPicksOverviewPage";
import CreateJobPage from "./components/CreateJobPage";
import MessagesPage from "./components/MessagesPage";
import CandidateSearchPage from "./components/CandidateSearchPage";
import ManageJobsPage from "./components/ManageJobsPage";
import ApplicantsPage from "./components/ApplicantsPage";
import ShortlistPage from "./components/ShortlistPage";
import FloatingChat from "./components/FloatingChat";
import EmployerBrandingPage from "./components/EmployerBrandingPage";
import OrganizationSettingsPage from "./components/OrganizationSettingsPage";
import { initialJobs } from "./data/jobs";
import type { JobRow, JobStatus } from "./data/jobs";

export type AppPage =
  | "dashboard"
  | "top-picks"
  | "create-job"
  | "messages"
  | "candidate-search"
  | "manage-jobs"
  | "applicants"
  | "shortlist"
  | "employer-branding"
  | "org-settings";

export default function App() {
  const [page, setPage] = useState<AppPage>("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [jobs, setJobs] = useState<JobRow[]>(initialJobs);
  const [selectedJobTitle, setSelectedJobTitle] = useState<string>("Product Designer (UI/UX)");
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [topPicksJobId, setTopPicksJobId] = useState<string | null>(null);
  const [topPicksJobTitle, setTopPicksJobTitle] = useState<string | null>(null);
  const [editJobId, setEditJobId] = useState<string | null>(null);
  const [applicantsInitialTab, setApplicantsInitialTab] = useState<string>("all");

  const handleJobStatusChange = (id: string, status: JobStatus) => {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, status } : j)));
  };

  const handleCreateJobDone = () => {
    setEditJobId(null);
    setPage("manage-jobs");
  };

  const handleEditJob = (jobId: string) => {
    setEditJobId(jobId);
    setPage("create-job");
  };

  const handleCopyJob = (jobId: string) => {
    const source = jobs.find((j) => j.id === jobId);
    if (!source) return;
    const copy: JobRow = {
      ...source,
      id: `${source.id}-copy-${Date.now()}`,
      title: `${source.title} (Copy)`,
      status: "draft",
      daysOnline: 0,
      applicants: 0,
      topPicks: 0,
      shortlist: 0,
      hired: 0,
    };
    setJobs((prev) => [copy, ...prev]);
  };

  const handleDeleteJob = (jobId: string) => {
    setJobs((prev) => prev.filter((j) => j.id !== jobId));
  };

  const handleViewApplicants = (jobTitle?: string) => {
    if (jobTitle) setSelectedJobTitle(jobTitle);
    setApplicantsInitialTab("all");
    setPage("applicants");
  };

  const handleViewApplicantsShortlist = (jobId: string, jobTitle: string) => {
    setSelectedJobId(jobId);
    setSelectedJobTitle(jobTitle);
    setApplicantsInitialTab("shortlist");
    setPage("applicants");
  };

  const handleViewApplicantsHired = (jobId: string, jobTitle: string) => {
    setSelectedJobId(jobId);
    setSelectedJobTitle(jobTitle);
    setApplicantsInitialTab("hired");
    setPage("applicants");
  };

  const handleViewApplicantsInterview = (jobId: string, jobTitle: string) => {
    setSelectedJobId(jobId);
    setSelectedJobTitle(jobTitle);
    setApplicantsInitialTab("interview");
    setPage("applicants");
  };

  const handleViewShortlist = (jobId: string, jobTitle: string) => {
    setSelectedJobId(jobId);
    setSelectedJobTitle(jobTitle);
    setPage("shortlist");
  };

  return (
    <div className="min-h-screen bg-[#F0F2F5] flex font-sans">
      <Sidebar
        activePage={page}
        onNavigate={(p) => {
          if (p === "top-picks") { setTopPicksJobId(null); setTopPicksJobTitle(null); }
          setPage(p);
        }}
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((v) => !v)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header activePage={page} onNavigate={setPage} />

        <div className="flex-1 overflow-y-auto">
          {page === "dashboard" && (
            <div className="max-w-screen-xl mx-auto px-6 py-6 flex gap-6">
              <main className="flex-1 flex flex-col gap-6 min-w-0">
                <WelcomeBanner
                  onCreateJob={() => setPage("create-job")}
                  onSearchTalent={() => setPage("candidate-search")}
                />
                <RecruitmentSummary
                  jobs={jobs}
                  onViewTopPicks={() => setPage("top-picks")}
                  onViewJobTopPicks={(id, title) => { setTopPicksJobId(id); setTopPicksJobTitle(title); setPage("top-picks"); }}
                  onManageJobs={() => setPage("manage-jobs")}
                  onViewApplicants={handleViewApplicants}
                  onViewShortlist={handleViewShortlist}
                  onViewApplicantsShortlist={handleViewApplicantsShortlist}
                  onViewApplicantsInterview={handleViewApplicantsInterview}
                  onEditJob={handleEditJob}
                />
              </main>
              <RightPanel onBuyPackage={() => {}} onNavigate={setPage} />
            </div>
          )}

          {page === "top-picks" && !topPicksJobId && (
            <TopPicksOverviewPage
              onSelectJob={(id, title) => {
                setTopPicksJobId(id);
                setTopPicksJobTitle(title);
              }}
            />
          )}

          {page === "top-picks" && topPicksJobId && (
            <TopPicksPage
              onBack={() => { setTopPicksJobId(null); setTopPicksJobTitle(null); }}
              jobs={jobs}
            />
          )}

          {page === "create-job" && (
            <CreateJobPage onBack={handleCreateJobDone} />
          )}

          {page === "messages" && (
            <MessagesPage onBack={() => setPage("dashboard")} />
          )}

          {page === "candidate-search" && (
            <CandidateSearchPage />
          )}

          {page === "manage-jobs" && (
            <ManageJobsPage
              jobs={jobs}
              onJobStatusChange={handleJobStatusChange}
              onCreateJob={() => setPage("create-job")}
              onViewTopPicks={() => setPage("top-picks")}
              onViewJobTopPicks={(id, title) => {
                setTopPicksJobId(id);
                setTopPicksJobTitle(title);
                setPage("top-picks");
              }}
              onViewApplicants={handleViewApplicants}
              onViewApplicantsShortlist={handleViewApplicantsShortlist}
              onViewApplicantsHired={handleViewApplicantsHired}
              onEditJob={handleEditJob}
              onCopyJob={handleCopyJob}
              onDeleteJob={handleDeleteJob}
            />
          )}

          {page === "applicants" && (
            <ApplicantsPage
              jobTitle={selectedJobTitle}
              onBack={() => setPage("dashboard")}
              initialTab={applicantsInitialTab as "all" | "new" | "shortlist" | "review" | "to_interview" | "interview" | "passed" | "offer" | "hired" | "rejected"}
            />
          )}

          {page === "shortlist" && (
            <ShortlistPage
              jobId={selectedJobId}
              jobTitle={selectedJobTitle}
              onBack={() => setPage("dashboard")}
            />
          )}

          {page === "employer-branding" && (
            <EmployerBrandingPage onBack={() => setPage("dashboard")} />
          )}

          {page === "org-settings" && (
            <OrganizationSettingsPage onBack={() => setPage("dashboard")} />
          )}

        </div>
      </div>

      <FloatingChat />
    </div>
  );
}
