import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  Search,
  Filter,
  BookOpen,
  Users,
  CheckCircle2,
  Clock3,
  Eye,
  Download,
  X,
  GraduationCap,
  Loader2,
  RefreshCw,
  Send,
  RotateCcw,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SessionContext } from "@/contexts/SessionContext";
import { API_BASE_URL, getToken } from "@/lib/api";

/* ------------------------------------------------------------------ */
/* TYPES                                                               */
/* ------------------------------------------------------------------ */

type GradeStatus = "Not started" | "Draft" | "Pending approval" | "Approved" | "Published";

interface GradeBookRecord {
  id: string;
  courseCode: string;
  courseTitle: string;
  lecturer: string;
  department: string;
  level: string;
  semester: string;
  students: number;
  graded: number;
  status: GradeStatus;
  lastUpdated: string | null;
}

interface DetailStudent {
  resultId: string;
  name: string;
  matricNumber: string;
  caScore: number | null;
  examScore: number | null;
  total: number | null;
  grade: string | null;
  comment: string;
  status: string;
}

interface Detail {
  allocation: Omit<GradeBookRecord, "students" | "graded" | "lastUpdated"> & { session: string };
  students: DetailStudent[];
  counts: { total: number; graded: number; draft: number; submitted: number; approved: number; published: number };
}

/* ------------------------------------------------------------------ */
/* HELPERS                                                             */
/* ------------------------------------------------------------------ */

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
      ...(init?.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Request failed.");
  return data as T;
}

const semesterKey = (v: string) => {
  const s = v.toLowerCase();
  if (s.startsWith("first")) return "First";
  if (s.startsWith("second")) return "Second";
  return "";
};

const formatDate = (date: string | null) => {
  if (!date) return "—";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
};

const STATUSES: GradeStatus[] = ["Pending approval", "Approved", "Published", "Draft", "Not started"];

function StatusBadge({ status }: { status: GradeStatus }) {
  const styles: Record<GradeStatus, string> = {
    "Pending approval": "bg-amber-50 text-amber-700 border-amber-200",
    Approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Published: "bg-blue-50 text-blue-700 border-blue-200",
    Draft: "bg-slate-100 text-slate-600 border-slate-200",
    "Not started": "bg-slate-50 text-slate-400 border-slate-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold ${styles[status]}`}
    >
      {status}
    </span>
  );
}

const TH = "px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500";
const selectClass =
  "h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#006dcc]";

/* ------------------------------------------------------------------ */
/* PAGE                                                                */
/* ------------------------------------------------------------------ */

export default function GradeBook() {
  const { currentSession } = useContext(SessionContext);
  const sessionId = currentSession?._id;

  const [records, setRecords] = useState<GradeBookRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [levelFilter, setLevelFilter] = useState("All");
  const [semesterFilter, setSemesterFilter] = useState("All");

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detail, setDetail] = useState<Detail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [busy, setBusy] = useState<"approve" | "return" | "publish" | null>(null);
  const [returning, setReturning] = useState(false);
  const [note, setNote] = useState("");

  /* ----------------------------- LOAD ----------------------------- */

  const loadOverview = useCallback(
    async (silent = false) => {
      if (!sessionId) return;
      try {
        if (silent) setRefreshing(true);
        else setLoading(true);
        setError("");

        const data = await request<{ records: GradeBookRecord[] }>(
          `/results/admin/overview?sessionId=${sessionId}`
        );
        setRecords(data.records || []);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [sessionId]
  );

  useEffect(() => {
    loadOverview();
  }, [loadOverview]);

  const loadDetail = useCallback(async (id: string) => {
    try {
      setDetailLoading(true);
      setDetail(await request<Detail>(`/results/admin/allocation/${id}`));
    } catch (err) {
      toast.error((err as Error).message);
      setSelectedId(null);
    } finally {
      setDetailLoading(false);
    }
  }, []);

  useEffect(() => {
    setReturning(false);
    setNote("");
    if (selectedId) loadDetail(selectedId);
    else setDetail(null);
  }, [selectedId, loadDetail]);

  /* ----------------------------- ACTIONS -------------------------- */

  const act = async (kind: "approve" | "return" | "publish", body?: object) => {
    if (!selectedId) return;
    try {
      setBusy(kind);
      const res = await request<{ message: string }>(
        `/results/admin/allocation/${selectedId}/${kind}`,
        { method: "POST", body: JSON.stringify(body ?? {}) }
      );
      toast.success(res.message);
      setReturning(false);
      setNote("");
      await Promise.all([loadDetail(selectedId), loadOverview(true)]);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(null);
    }
  };

  const handleApprove = () => {
    if (!detail) return;
    const ok = window.confirm(
      `Approve all submitted results for ${detail.allocation.courseCode}? Students will not see them until you publish.`
    );
    if (ok) act("approve");
  };

  const handleReturn = () => {
    if (!note.trim()) {
      toast.error("Add a note telling the lecturer what to correct.");
      return;
    }
    act("return", { note: note.trim() });
  };

  const handlePublish = () => {
    if (!detail) return;
    const ok = window.confirm(
      `Publish results for ${detail.allocation.courseCode}? Students will be able to see them.`
    );
    if (ok) act("publish");
  };

  /* ----------------------------- DERIVED -------------------------- */

  const totalCourses = records.length;
  const totalStudents = records.reduce((sum, r) => sum + r.students, 0);
  const pendingCourses = records.filter((r) => r.status === "Pending approval").length;
  const approvedCourses = records.filter(
    (r) => r.status === "Approved" || r.status === "Published"
  ).length;

  const departments = useMemo(
    () => Array.from(new Set(records.map((r) => r.department))).sort(),
    [records]
  );
  const levels = useMemo(
    () => Array.from(new Set(records.map((r) => r.level))).sort(),
    [records]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return records.filter((r) => {
      const matchesSearch =
        !q ||
        r.courseCode.toLowerCase().includes(q) ||
        r.courseTitle.toLowerCase().includes(q) ||
        r.lecturer.toLowerCase().includes(q);

      return (
        matchesSearch &&
        (departmentFilter === "All" || r.department === departmentFilter) &&
        (statusFilter === "All" || r.status === statusFilter) &&
        (levelFilter === "All" || r.level === levelFilter) &&
        (semesterFilter === "All" || semesterKey(r.semester) === semesterFilter)
      );
    });
  }, [records, search, departmentFilter, statusFilter, levelFilter, semesterFilter]);

  const hasFilters =
    Boolean(search) ||
    departmentFilter !== "All" ||
    statusFilter !== "All" ||
    levelFilter !== "All" ||
    semesterFilter !== "All";

  const clearFilters = () => {
    setSearch("");
    setDepartmentFilter("All");
    setStatusFilter("All");
    setLevelFilter("All");
    setSemesterFilter("All");
  };

  const handleExport = () => {
    const headers = [
      "Course Code", "Course Title", "Lecturer", "Department", "Level",
      "Semester", "Students", "Graded", "Status", "Last Updated",
    ];

    const rows = filtered.map((r) => [
      r.courseCode, r.courseTitle, r.lecturer, r.department, r.level,
      r.semester, r.students, r.graded, r.status, formatDate(r.lastUpdated),
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "grade-book.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  /* ----------------------------- STATES --------------------------- */

  if (!sessionId) {
    return (
      <div className="flex min-h-[400px] items-center justify-center bg-slate-50 p-6">
        <div className="text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-slate-300" />
          <p className="mt-3 text-sm font-semibold text-slate-500">No session selected</p>
          <p className="mt-1 text-xs text-slate-400">Select an academic session to view the grade book.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center bg-slate-50 p-6">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="mt-3 text-sm text-slate-500">Loading grade book...</p>
        </div>
      </div>
    );
  }

  const detailStatus = detail?.allocation.status;
  const progress = (r: GradeBookRecord) =>
    r.students > 0 ? Math.min(100, Math.round((r.graded / r.students) * 100)) : 0;

  return (
    <div className="min-h-full space-y-6 bg-slate-50 p-4 md:p-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#081022] text-white">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#081022] md:text-2xl">Grade Book</h1>
            <p className="mt-1 text-xs text-slate-500">
              Review lecturer submissions, approve results and publish them
              {currentSession?.name ? ` — ${currentSession.name}` : ""}.
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => loadOverview(true)}
            disabled={refreshing}
            className="gap-2 border-slate-300 bg-white"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={handleExport} className="gap-2 border-slate-300 bg-white">
            <Download className="h-4 w-4" />
            Export Grade Book
          </Button>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
          <div className="flex-1">
            <p className="text-sm font-bold text-red-700">Unable to load the grade book</p>
            <p className="mt-1 text-xs text-red-600">{error}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => loadOverview()}>
            Retry
          </Button>
        </div>
      )}

      {/* STATISTICS */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Courses", value: totalCourses, note: "Allocated this session", icon: BookOpen, tone: "bg-blue-50 text-blue-700" },
          { label: "Students", value: totalStudents, note: "Registered across courses", icon: Users, tone: "bg-purple-50 text-purple-700" },
          { label: "Pending Approval", value: pendingCourses, note: "Awaiting your review", icon: Clock3, tone: "bg-amber-50 text-amber-700" },
          { label: "Approved", value: approvedCourses, note: "Approved or published", icon: CheckCircle2, tone: "bg-emerald-50 text-emerald-700" },
        ].map((card) => (
          <Card key={card.label} className="border-none bg-white shadow-sm ring-1 ring-slate-200">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500">{card.label}</p>
                  <p className="mt-2 text-3xl font-black text-[#081022]">{card.value}</p>
                  <p className="mt-1 text-[11px] text-slate-400">{card.note}</p>
                </div>
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${card.tone}`}>
                  <card.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* SEARCH + FILTERS */}
      <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 xl:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search course code, course title or lecturer..."
                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-[#006dcc] focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <select value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)} className={selectClass}>
              <option value="All">All Departments</option>
              {departments.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            <select value={levelFilter} onChange={(e) => setLevelFilter(e.target.value)} className={selectClass}>
              <option value="All">All Levels</option>
              {levels.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>

            <select value={semesterFilter} onChange={(e) => setSemesterFilter(e.target.value)} className={selectClass}>
              <option value="All">All Semesters</option>
              <option value="First">First Semester</option>
              <option value="Second">Second Semester</option>
            </select>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={selectClass}>
                <option value="All">All Status</option>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* TABLE */}
      <Card className="overflow-hidden border-none bg-white shadow-sm ring-1 ring-slate-200">
        <div className="border-b border-slate-200 px-5 py-4">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#081022]">Course Grade Books</h2>
              <p className="text-xs text-slate-500">
                {filtered.length} grade book{filtered.length !== 1 ? "s" : ""} displayed
              </p>
            </div>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="flex items-center gap-1 text-xs font-semibold text-[#006dcc] hover:underline"
              >
                <X className="h-3 w-3" />
                Clear filters
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-200">
                <th className={TH}>Course</th>
                <th className={TH}>Lecturer</th>
                <th className={TH}>Department</th>
                <th className={TH}>Level</th>
                <th className={TH}>Students</th>
                <th className={TH}>Graded</th>
                <th className={TH}>Status</th>
                <th className={`${TH} text-right`}>Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center">
                    <BookOpen className="mx-auto h-8 w-8 text-slate-300" />
                    <p className="mt-3 text-sm font-semibold text-slate-500">No grade books found</p>
                    <p className="mt-1 text-xs text-slate-400">
                      {records.length === 0
                        ? "No courses have been allocated for this session yet."
                        : "Try changing your search or filters."}
                    </p>
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="transition hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <p className="text-sm font-bold text-[#081022]">{r.courseCode}</p>
                      <p className="mt-0.5 max-w-[230px] text-xs text-slate-500">{r.courseTitle}</p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-xs font-semibold text-slate-700">{r.lecturer}</p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="max-w-[170px] text-xs text-slate-600">{r.department}</p>
                    </td>

                    <td className="px-5 py-4">
                      <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                        {r.level}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Users className="h-3.5 w-3.5 text-slate-400" />
                        <span className="text-xs font-semibold text-slate-700">{r.students}</span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="min-w-[100px]">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-700">
                            {r.graded}/{r.students}
                          </span>
                          <span className="text-[10px] text-slate-400">{progress(r)}%</span>
                        </div>
                        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-[#006dcc]"
                            style={{ width: `${progress(r)}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={r.status} />
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedId(r.id)}
                          className="h-8 gap-1.5 border-slate-200 text-xs"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          {r.status === "Pending approval" ? "Review" : "View"}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-200 px-5 py-3">
          <p className="text-xs text-slate-500">
            Showing <strong className="text-slate-700">{filtered.length}</strong> of{" "}
            <strong className="text-slate-700">{totalCourses}</strong> grade books
          </p>
        </div>
      </Card>

      {/* DETAIL / REVIEW MODAL */}
      {selectedId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* Header */}
            <div className="flex items-start justify-between bg-[#081022] p-6 text-white">
              {detail ? (
                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-white/10 px-2 py-1 text-xs font-bold">
                      {detail.allocation.courseCode}
                    </span>
                    <StatusBadge status={detail.allocation.status} />
                  </div>
                  <h2 className="mt-3 text-xl font-bold">{detail.allocation.courseTitle}</h2>
                  <p className="mt-1 text-xs text-slate-300">
                    {detail.allocation.lecturer} • {detail.allocation.department} •{" "}
                    {detail.allocation.level} • {detail.allocation.semester}
                  </p>
                </div>
              ) : (
                <div className="h-16" />
              )}

              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="rounded-lg p-2 text-slate-300 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 space-y-5 overflow-y-auto p-6">
              {detailLoading && !detail ? (
                <div className="flex min-h-[200px] items-center justify-center">
                  <Loader2 className="h-7 w-7 animate-spin text-[#006dcc]" />
                </div>
              ) : detail ? (
                <>
                  <div className="grid gap-4 sm:grid-cols-4">
                    {[
                      ["Saved", detail.counts.total],
                      ["Drafts", detail.counts.draft],
                      ["Submitted", detail.counts.submitted],
                      ["Approved / Published", detail.counts.approved + detail.counts.published],
                    ].map(([label, value]) => (
                      <div key={String(label)} className="rounded-xl bg-slate-50 p-4">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
                        <p className="mt-2 text-lg font-bold text-[#081022]">{value}</p>
                      </div>
                    ))}
                  </div>

                  {detail.students.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-300 p-10 text-center">
                      <GraduationCap className="mx-auto h-8 w-8 text-slate-300" />
                      <p className="mt-3 text-sm font-semibold text-slate-500">
                        The lecturer has not entered any scores yet.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-xl border border-slate-200">
                      <table className="w-full min-w-[700px]">
                        <thead className="bg-slate-50">
                          <tr className="border-b border-slate-200">
                            <th className={TH}>#</th>
                            <th className={TH}>Matric No.</th>
                            <th className={TH}>Student</th>
                            <th className={TH}>CA</th>
                            <th className={TH}>Exam</th>
                            <th className={TH}>Total</th>
                            <th className={TH}>Grade</th>
                            <th className={TH}>Comment</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {detail.students.map((s, i) => (
                            <tr key={s.resultId}>
                              <td className="px-5 py-3 text-xs text-slate-500">{i + 1}</td>
                              <td className="px-5 py-3 text-xs font-semibold text-slate-700">{s.matricNumber}</td>
                              <td className="px-5 py-3 text-xs text-slate-700">{s.name}</td>
                              <td className="px-5 py-3 text-xs text-slate-700">{s.caScore ?? "—"}</td>
                              <td className="px-5 py-3 text-xs text-slate-700">{s.examScore ?? "—"}</td>
                              <td className="px-5 py-3 text-xs font-bold text-[#081022]">{s.total ?? "—"}</td>
                              <td className="px-5 py-3 text-xs font-bold text-[#081022]">{s.grade ?? "—"}</td>
                              <td className="px-5 py-3 text-xs text-slate-500">{s.comment || "—"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {returning && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                      <p className="text-sm font-bold text-amber-800">Return to lecturer</p>
                      <p className="mt-1 text-xs text-amber-700">
                        The results become editable again. Tell the lecturer what to correct.
                      </p>
                      <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        rows={3}
                        placeholder="e.g. Exam scores for three students look wrong. Please recheck."
                        className="mt-3 w-full rounded-lg border border-amber-200 bg-white p-3 text-sm outline-none focus:border-amber-400"
                      />
                    </div>
                  )}
                </>
              ) : null}
            </div>

            {/* Footer */}
            <div className="flex flex-col gap-2 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="text-xs text-slate-500">
                Status: <strong className="text-slate-700">{detailStatus ?? "—"}</strong>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={() => setSelectedId(null)} disabled={busy !== null}>
                  Close
                </Button>

                {detailStatus === "Pending approval" && !returning && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => setReturning(true)}
                      disabled={busy !== null}
                      className="gap-2 border-amber-300 text-amber-700 hover:bg-amber-50"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Return to Lecturer
                    </Button>
                    <Button
                      onClick={handleApprove}
                      disabled={busy !== null}
                      className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                    >
                      {busy === "approve" ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                      Approve Results
                    </Button>
                  </>
                )}

                {detailStatus === "Pending approval" && returning && (
                  <>
                    <Button variant="outline" onClick={() => setReturning(false)} disabled={busy !== null}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleReturn}
                      disabled={busy !== null}
                      className="gap-2 bg-amber-600 hover:bg-amber-700"
                    >
                      {busy === "return" ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
                      Confirm Return
                    </Button>
                  </>
                )}

                {detailStatus === "Approved" && (
                  <Button
                    onClick={handlePublish}
                    disabled={busy !== null}
                    className="gap-2 bg-[#006dcc] hover:bg-[#005ca8]"
                  >
                    {busy === "publish" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    Publish Results
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}