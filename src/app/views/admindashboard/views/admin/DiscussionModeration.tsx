import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Eye,
  Flag,
  MessageSquare,
  MoreHorizontal,
  Search,
  ShieldAlert,
  User,
  XCircle,
} from "lucide-react";

type DiscussionReport = {
  id: string;
  student: string;
  course: string;
  topic: string;
  reason: string;
  reportedBy: string;
  date: string;
  status: "Pending" | "Resolved" | "Escalated" | "Dismissed";
  severity: "Low" | "Medium" | "High";
};

const discussionReports: DiscussionReport[] = [
  {
    id: "REP-001",
    student: "Michael Mensah",
    course: "Computer Science",
    topic: "Database Management Discussion",
    reason: "Inappropriate language",
    reportedBy: "John Doe",
    date: "Aug 25, 2026",
    status: "Pending",
    severity: "Medium",
  },
  {
    id: "REP-002",
    student: "Sarah Williams",
    course: "Business Administration",
    topic: "Entrepreneurship Forum",
    reason: "Offensive comment",
    reportedBy: "James Brown",
    date: "Aug 24, 2026",
    status: "Escalated",
    severity: "High",
  },
  {
    id: "REP-003",
    student: "Daniel Adams",
    course: "Information Technology",
    topic: "Web Development",
    reason: "Spam / irrelevant content",
    reportedBy: "Mary Johnson",
    date: "Aug 23, 2026",
    status: "Resolved",
    severity: "Low",
  },
  {
    id: "REP-004",
    student: "Grace Thompson",
    course: "Accounting",
    topic: "Financial Accounting",
    reason: "Harassment",
    reportedBy: "Peter Mensah",
    date: "Aug 22, 2026",
    status: "Pending",
    severity: "High",
  },
];

export default function DiscussionModeration() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedReport, setSelectedReport] =
    useState<DiscussionReport | null>(null);

  const filteredReports = useMemo(() => {
    return discussionReports.filter((report) => {
      const matchesSearch =
        report.student.toLowerCase().includes(search.toLowerCase()) ||
        report.course.toLowerCase().includes(search.toLowerCase()) ||
        report.topic.toLowerCase().includes(search.toLowerCase()) ||
        report.reason.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || report.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const pendingCount = discussionReports.filter(
    (item) => item.status === "Pending"
  ).length;

  const resolvedCount = discussionReports.filter(
    (item) => item.status === "Resolved"
  ).length;

  const escalatedCount = discussionReports.filter(
    (item) => item.status === "Escalated"
  ).length;

  const highSeverityCount = discussionReports.filter(
    (item) => item.severity === "High"
  ).length;

  return (
    <div className="min-h-full space-y-6 bg-slate-50 p-4 md:p-6">

      {/* Header */}
      <div className="rounded-2xl bg-[#081022] p-6 text-white shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <div className="flex items-center gap-2 text-blue-200">
              <ShieldAlert className="h-5 w-5" />

              <span className="text-[11px] font-bold uppercase tracking-[0.2em]">
                Academic Administration
              </span>
            </div>

            <h1 className="mt-2 text-2xl font-bold md:text-3xl">
              Discussion Moderation
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Review reported student discussions, moderate inappropriate
              content, and monitor academic conversations across the
              institution.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/10 px-5 py-4">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-200">
              Reports Requiring Attention
            </p>

            <p className="mt-1 text-3xl font-black">
              {pendingCount + escalatedCount}
            </p>

            <p className="text-xs text-slate-400">
              Pending and escalated reports
            </p>
          </div>

        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Pending Reports"
          value={pendingCount}
          subtitle="Awaiting moderation"
          icon={Flag}
          iconClass="bg-orange-50 text-orange-700"
        />

        <StatCard
          title="Resolved"
          value={resolvedCount}
          subtitle="Reports handled"
          icon={CheckCircle2}
          iconClass="bg-emerald-50 text-emerald-700"
        />

        <StatCard
          title="Escalated"
          value={escalatedCount}
          subtitle="Requires higher review"
          icon={ShieldAlert}
          iconClass="bg-red-50 text-red-700"
        />

        <StatCard
          title="High Severity"
          value={highSeverityCount}
          subtitle="Serious reports"
          icon={AlertTriangle}
          iconClass="bg-purple-50 text-purple-700"
        />

      </div>

      {/* Main moderation panel */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">

        {/* Toolbar */}
        <div className="border-b border-slate-200 p-4">

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <h2 className="text-base font-bold text-[#081022]">
                Reported Discussions
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Review conversations reported by students and staff.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search reports..."
                  className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none transition focus:border-[#006dcc] sm:w-[250px]"
                />
              </div>

              {/* Status */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none"
              >
                <option value="All">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Resolved">Resolved</option>
                <option value="Escalated">Escalated</option>
                <option value="Dismissed">Dismissed</option>
              </select>

            </div>

          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">

          <table className="w-full min-w-[1000px]">

            <thead className="bg-slate-50">

              <tr className="border-b border-slate-200 text-left">

                <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Report
                </th>

                <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Student
                </th>

                <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Course / Topic
                </th>

                <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Reason
                </th>

                <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Severity
                </th>

                <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Status
                </th>

                <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Action
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-slate-100">

              {filteredReports.length === 0 ? (

                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">

                    <MessageSquare className="mx-auto h-8 w-8 text-slate-300" />

                    <p className="mt-3 text-sm font-semibold text-slate-500">
                      No discussion reports found
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Try changing your search or status filter.
                    </p>

                  </td>
                </tr>

              ) : (

                filteredReports.map((report) => (

                  <tr
                    key={report.id}
                    className="transition hover:bg-slate-50"
                  >

                    {/* Report */}
                    <td className="px-5 py-4">

                      <p className="text-sm font-bold text-[#081022]">
                        {report.id}
                      </p>

                      <p className="mt-1 text-[11px] text-slate-400">
                        {report.date}
                      </p>

                    </td>

                    {/* Student */}
                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100">
                          <User className="h-4 w-4 text-slate-500" />
                        </div>

                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            {report.student}
                          </p>

                          <p className="text-[11px] text-slate-400">
                            Reported by {report.reportedBy}
                          </p>
                        </div>

                      </div>

                    </td>

                    {/* Course */}
                    <td className="px-5 py-4">

                      <p className="text-sm font-semibold text-slate-700">
                        {report.course}
                      </p>

                      <p className="mt-1 max-w-[220px] truncate text-xs text-slate-400">
                        {report.topic}
                      </p>

                    </td>

                    {/* Reason */}
                    <td className="px-5 py-4">

                      <div className="flex items-center gap-2">

                        <AlertTriangle className="h-4 w-4 text-orange-500" />

                        <span className="text-sm text-slate-600">
                          {report.reason}
                        </span>

                      </div>

                    </td>

                    {/* Severity */}
                    <td className="px-5 py-4">
                      <SeverityBadge severity={report.severity} />
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <StatusBadge status={report.status} />
                    </td>

                    {/* Action */}
                    <td className="px-5 py-4 text-right">

                      <button
                        type="button"
                        onClick={() => setSelectedReport(report)}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-[#081022] hover:bg-slate-50"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Review
                      </button>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

        {/* Footer */}
        <div className="flex flex-col gap-2 border-t border-slate-200 px-5 py-4 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">

          <span>
            Showing{" "}
            <strong className="text-slate-700">
              {filteredReports.length}
            </strong>{" "}
            discussion report
            {filteredReports.length !== 1 ? "s" : ""}
          </span>

          <span>
            Moderators should review reported content promptly.
          </span>

        </div>

      </div>

      {/* Moderation Guidelines */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="flex items-start gap-3">

          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
            <ShieldAlert className="h-5 w-5" />
          </div>

          <div>
            <h3 className="text-sm font-bold text-[#081022]">
              Moderation Responsibilities
            </h3>

            <p className="mt-1 text-xs leading-5 text-slate-500">
              Administrators can review reported discussions, remove
              inappropriate content, dismiss invalid reports, resolve cases,
              or escalate serious incidents for further institutional action.
            </p>
          </div>

        </div>

      </div>

      {/* Review Modal */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl">

            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 p-5">

              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Discussion Report
                </p>

                <h2 className="mt-1 text-lg font-bold text-[#081022]">
                  {selectedReport.id}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <XCircle className="h-5 w-5" />
              </button>

            </div>

            {/* Modal Body */}
            <div className="space-y-5 p-5">

              <div className="grid gap-4 sm:grid-cols-2">

                <InfoItem
                  label="Student"
                  value={selectedReport.student}
                />

                <InfoItem
                  label="Course"
                  value={selectedReport.course}
                />

                <InfoItem
                  label="Discussion"
                  value={selectedReport.topic}
                />

                <InfoItem
                  label="Reported By"
                  value={selectedReport.reportedBy}
                />

                <InfoItem
                  label="Reason"
                  value={selectedReport.reason}
                />

                <InfoItem
                  label="Reported Date"
                  value={selectedReport.date}
                />

              </div>

              {/* Reported content */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Reported Content
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  The reported discussion content will appear here when the
                  discussion API is connected.
                </p>

              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2 border-t border-slate-200 pt-4 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={() => setSelectedReport(null)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Dismiss Report
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedReport(null)}
                  className="rounded-lg border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-700 hover:bg-orange-100"
                >
                  Escalate
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedReport(null)}
                  className="rounded-lg bg-[#081022] px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  Resolve Report
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

/* ================================================================
   STAT CARD
================================================================ */

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconClass,
}: {
  title: string;
  value: number;
  subtitle: string;
  icon: React.ElementType;
  iconClass: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-start justify-between">

        <div>
          <p className="text-3xl font-black text-[#081022]">
            {value}
          </p>

          <p className="mt-1 text-sm font-bold text-slate-800">
            {title}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {subtitle}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
        >
          <Icon className="h-5 w-5" />
        </div>

      </div>

    </div>
  );
}

/* ================================================================
   STATUS BADGE
================================================================ */

function StatusBadge({
  status,
}: {
  status: DiscussionReport["status"];
}) {
  const styles = {
    Pending: "bg-orange-50 text-orange-700 border-orange-200",
    Resolved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Escalated: "bg-red-50 text-red-700 border-red-200",
    Dismissed: "bg-slate-100 text-slate-600 border-slate-200",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold ${styles[status]}`}
    >
      {status}
    </span>
  );
}

/* ================================================================
   SEVERITY BADGE
================================================================ */

function SeverityBadge({
  severity,
}: {
  severity: DiscussionReport["severity"];
}) {
  const styles = {
    Low: "bg-slate-100 text-slate-600",
    Medium: "bg-orange-50 text-orange-700",
    High: "bg-red-50 text-red-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${styles[severity]}`}
    >
      {severity}
    </span>
  );
}

/* ================================================================
   INFO ITEM
================================================================ */

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-sm font-semibold text-slate-700">
        {value}
      </p>
    </div>
  );
}