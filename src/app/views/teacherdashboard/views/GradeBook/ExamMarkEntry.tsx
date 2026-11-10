import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Download,
  FileSpreadsheet,
  Loader2,
  RefreshCw,
  Save,
  Search,
  Send,
} from "lucide-react";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { SessionContext } from "@/contexts/SessionContext";
import { normalizeSemester } from "@/lib/semester";
import { API_BASE_URL, getToken } from "@/lib/api";

/* ------------------------------------------------------------------ */
/* TYPES                                                               */
/* ------------------------------------------------------------------ */

const CA_MAX = 30;
const EXAM_MAX = 70;

type Status = "not_entered" | "draft" | "submitted" | "approved" | "published";
type Field = "caScore" | "examScore" | "comment";

type Student = {
  resultId: string | null;
  studentId: string;
  name: string;
  matricNumber: string;
  caScore: number | null;
  examScore: number | null;
  total: number | null;
  grade: string | null;
  comment: string;
  status: Status;
};

type Allocation = {
  _id: string;
  status: string;
  semester: string;
  level?: string;
  course?: { code?: string; title?: string };
  academicSession?: { name?: string };
};

type RosterResponse = {
  allocation: {
    id: string;
    course: { code?: string; title?: string };
    semester: string;
    session: string;
    level: string;
    editable: boolean;
  };
  students: Student[];
  summary: Record<string, number>;
};

type Draft = Partial<Record<Field, string>>;

/* ------------------------------------------------------------------ */
/* HELPERS                                                             */
/* ------------------------------------------------------------------ */

// Same scale as the server. Used only for the live preview; the server's value is final.
const previewGrade = (total: number) => {
  if (total >= 70) return { grade: "A", point: 4 };
  if (total >= 60) return { grade: "B", point: 3 };
  if (total >= 50) return { grade: "C", point: 2 };
  if (total >= 45) return { grade: "D", point: 1 };
  return { grade: "F", point: 0 };
};

const parseScore = (
  raw: string,
  max: number
): { ok: true; value: number | null } | { ok: false; message: string } => {
  if (raw.trim() === "") return { ok: true, value: null };
  const n = Number(raw);
  if (!Number.isFinite(n) || n < 0 || n > max) {
    return { ok: false, message: `must be between 0 and ${max}.` };
  }
  return { ok: true, value: n };
};

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
  if (!res.ok) {
    const err = new Error(data?.message || "Request failed.") as Error & { data?: any };
    err.data = data;
    throw err;
  }
  return data as T;
}

const STATUS_BADGE: Record<Status, { label: string; className: string }> = {
  not_entered: { label: "Not entered", className: "bg-slate-100 text-slate-700" },
  draft: { label: "Draft", className: "bg-amber-100 text-amber-800" },
  submitted: { label: "Submitted", className: "bg-blue-100 text-blue-800" },
  approved: { label: "Approved", className: "bg-indigo-100 text-indigo-800" },
  published: { label: "Published", className: "bg-green-100 text-green-800" },
};

function StatusPill({ status }: { status: Status }) {
  const s = STATUS_BADGE[status];
  return <Badge className={`${s.className} hover:${s.className}`}>{s.label}</Badge>;
}

/* ------------------------------------------------------------------ */
/* PAGE                                                                */
/* ------------------------------------------------------------------ */

export default function ExamMarkEntrySheet() {
  const { currentSemester, currentSession } = useContext(SessionContext);

  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [allocationId, setAllocationId] = useState("");
  const [roster, setRoster] = useState<RosterResponse | null>(null);
  const [loadingRoster, setLoadingRoster] = useState(false);
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState<"save" | "submit" | null>(null);

  /* ----------------------------- COURSES -------------------------- */

  const eligible = useMemo(
    () =>
      allocations.filter(
        (a) => a.status === "Active" && normalizeSemester(a.semester) === currentSemester
      ),
    [allocations, currentSemester]
  );

  useEffect(() => {
    request<{ allocations: Allocation[] }>("/course-allocations/my")
      .then((data) => setAllocations(data.allocations || []))
      .catch((err) => toast.error(err.message));
  }, []);

  // Drop the selected course if the semester changes and it no longer applies
  useEffect(() => {
    if (allocationId && !eligible.some((a) => a._id === allocationId)) {
      setAllocationId("");
      setDrafts({});
    }
  }, [eligible, allocationId]);

  /* ----------------------------- ROSTER --------------------------- */

  const loadRoster = useCallback(async (id: string) => {
    if (!id) {
      setRoster(null);
      return;
    }
    try {
      setLoadingRoster(true);
      setRoster(await request<RosterResponse>(`/results/allocation/${id}`));
    } catch (err) {
      setRoster(null);
      toast.error((err as Error).message);
    } finally {
      setLoadingRoster(false);
    }
  }, []);

  useEffect(() => {
    loadRoster(allocationId);
  }, [allocationId, loadRoster]);

  const canEdit = (s: Student) =>
    Boolean(roster?.allocation.editable) && (s.status === "not_entered" || s.status === "draft");

  /* ----------------------------- VALUES --------------------------- */

  const valueOf = (s: Student, field: Field): string => {
    const draft = drafts[s.studentId]?.[field];
    if (draft !== undefined) return draft;
    const v = s[field];
    return v == null ? "" : String(v);
  };

  const setDraft = (studentId: string, field: Field, value: string) => {
    if (field !== "comment") {
      const max = field === "caScore" ? CA_MAX : EXAM_MAX;
      const parsed = parseScore(value, max);
      if (!parsed.ok) {
        toast.error(`${field === "caScore" ? "CA" : "Exam"} score ${parsed.message}`);
        return;
      }
    }
    setDrafts((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], [field]: value },
    }));
  };

  const dirtyCount = Object.keys(drafts).length;

  const filteredStudents = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = roster?.students ?? [];
    if (!q) return list;
    return list.filter(
      (s) => s.name.toLowerCase().includes(q) || s.matricNumber.toLowerCase().includes(q)
    );
  }, [roster, search]);

  const averageTotal = useMemo(() => {
    const totals = (roster?.students ?? [])
      .map((s) => s.total)
      .filter((t): t is number => t !== null);
    return totals.length ? totals.reduce((a, b) => a + b, 0) / totals.length : null;
  }, [roster]);

  /* ----------------------------- SAVE / SUBMIT -------------------- */

  // Returns the number of rows the server rejected
  const saveDrafts = async (): Promise<number> => {
    const scores: {
      studentId: string;
      caScore: number | null;
      examScore: number | null;
      comment: string;
    }[] = [];

    for (const s of roster?.students ?? []) {
      if (!drafts[s.studentId] || !canEdit(s)) continue;
      const ca = parseScore(valueOf(s, "caScore"), CA_MAX);
      const ex = parseScore(valueOf(s, "examScore"), EXAM_MAX);
      scores.push({
        studentId: s.studentId,
        caScore: ca.ok ? ca.value : null,
        examScore: ex.ok ? ex.value : null,
        comment: valueOf(s, "comment"),
      });
    }

    if (scores.length === 0) return 0;

    const res = await request<{
      message: string;
      errors: { studentId: string; message: string }[];
    }>(`/results/allocation/${allocationId}/scores`, {
      method: "PUT",
      body: JSON.stringify({ scores }),
    });

    const names = new Map((roster?.students ?? []).map((s) => [s.studentId, s.name]));
    const failed = new Set(res.errors.map((e) => e.studentId));

    res.errors.forEach((e) =>
      toast.error(`${names.get(e.studentId) ?? "Student"}: ${e.message}`)
    );

    // Keep drafts for rows that failed so the lecturer can fix them
    setDrafts((prev) => {
      const next: Record<string, Draft> = {};
      for (const id of Object.keys(prev)) {
        if (failed.has(id)) next[id] = prev[id];
      }
      return next;
    });

    if (res.saved > 0) toast.success(res.message);
    await loadRoster(allocationId);
    return res.errors.length;
  };

  const handleSave = async () => {
    try {
      setBusy("save");
      await saveDrafts();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(null);
    }
  };

  const handleSubmit = async () => {
    const confirmed = window.confirm(
      "Submit these results to the administrator? You won't be able to change them unless the administrator returns them."
    );
    if (!confirmed) return;

    try {
      setBusy("submit");

      // Save any pending edits first. Stop if the server rejected any of them.
      const rejected = await saveDrafts();
      if (rejected > 0) return;

      const res = await request<{ message: string }>(
        `/results/allocation/${allocationId}/submit`,
        { method: "POST" }
      );
      toast.success(res.message);
      await loadRoster(allocationId);
    } catch (err) {
      const e = err as Error & { data?: { incomplete?: string[] } };
      toast.error(e.message);
      if (e.data?.incomplete?.length) {
        toast.message(`Missing: ${e.data.incomplete.slice(0, 5).join(", ")}`);
      }
    } finally {
      setBusy(null);
    }
  };

  /* ----------------------------- EXPORT --------------------------- */

  const exportCsv = () => {
    if (!roster) return;
    const header = "Matric Number,Student Name,CA,Exam,Total,Grade,Comment\n";
    const rows = roster.students
      .map((s) => {
        const ca = valueOf(s, "caScore");
        const ex = valueOf(s, "examScore");
        const total = ca !== "" && ex !== "" ? Number(ca) + Number(ex) : s.total ?? "";
        const grade = typeof total === "number" ? previewGrade(total).grade : s.grade ?? "";
        const comment = valueOf(s, "comment").replace(/"/g, '""');
        return `${s.matricNumber},"${s.name}",${ca},${ex},${total},${grade},"${comment}"`;
      })
      .join("\n");

    const blob = new Blob([header + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${roster.allocation.course.code || "results"}-mark-sheet.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  /* ----------------------------- RENDER --------------------------- */

  const course = roster?.allocation.course;
  const summary = roster?.summary ?? {};
  const totalStudents = roster?.students.length ?? 0;

  return (
    <div className="min-h-full space-y-6 p-4 md:p-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#006dcc]/10">
            <FileSpreadsheet className="h-5 w-5 text-[#006dcc]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Exam Mark Entry Sheet</h1>
            <p className="text-sm text-muted-foreground">
              Enter CA, exam and comments for your course in the{" "}
              {currentSemester} Semester
              {currentSession?.name ? ` · ${currentSession.name}` : ""}.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => loadRoster(allocationId)} disabled={!allocationId || loadingRoster}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loadingRoster ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline" onClick={exportCsv} disabled={!roster}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* COURSE SELECTION */}
      <Card>
        <CardHeader>
          <CardTitle>Select Course</CardTitle>
          <CardDescription>
            Only your active courses for the current semester are listed.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {eligible.length === 0 ? (
            <div className="rounded-lg border border-dashed p-6 text-center">
              <BookOpen className="mx-auto mb-3 h-8 w-8 text-muted-foreground/60" />
              <p className="font-medium">No courses for {currentSemester} Semester</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Courses assigned to you by the administrator for this semester will appear here.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Course</label>
                <Select
                  value={allocationId}
                  onValueChange={(value) => {
                    setAllocationId(value);
                    setDrafts({});
                    setSearch("");
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {eligible.map((a) => (
                      <SelectItem key={a._id} value={a._id}>
                        {a.course?.code ? `${a.course.code} — ` : ""}
                        {a.course?.title || "Untitled Course"}
                        {a.level ? ` (${a.level})` : ""}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {course && (
                <div className="flex items-end">
                  <div className="flex w-full items-center gap-3 rounded-lg border bg-muted/40 p-3">
                    <BookOpen className="h-5 w-5 text-[#006dcc]" />
                    <div>
                      <p className="text-sm font-medium">{course.code}</p>
                      <p className="text-xs text-muted-foreground">{course.title}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* SUMMARY */}
      {roster && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard label="Registered Students" value={totalStudents} icon={<Clock className="h-4 w-4" />} note="Enrolled this semester" />
          <SummaryCard
            label="Not Yet Entered"
            value={(summary.not_entered ?? 0) + (summary.draft ?? 0)}
            icon={<Clock className="h-4 w-4" />}
            note="Draft or missing"
            tone="text-orange-600"
          />
          <SummaryCard
            label="Submitted"
            value={(summary.submitted ?? 0) + (summary.approved ?? 0) + (summary.published ?? 0)}
            icon={<CheckCircle2 className="h-4 w-4" />}
            note="With the administrator"
            tone="text-blue-600"
          />
          <SummaryCard
            label="Class Average"
            value={averageTotal === null ? "—" : averageTotal.toFixed(1)}
            icon={<CheckCircle2 className="h-4 w-4" />}
            note="Out of 100"
          />
        </div>
      )}

      {/* MARK SHEET */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Examination Marks</CardTitle>
              <CardDescription>
                CA is out of {CA_MAX}, exam is out of {EXAM_MAX}. Grades shown while typing are a preview;
                the server calculates the final grade.
              </CardDescription>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Search name or matric number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                disabled={!roster}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {!allocationId ? (
            <div className="flex min-h-[260px] flex-col items-center justify-center rounded-lg border border-dashed text-center">
              <BookOpen className="mb-3 h-7 w-7 text-muted-foreground" />
              <h3 className="font-semibold">Select a course</h3>
              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                Choose one of your courses above to enter scores.
              </p>
            </div>
          ) : loadingRoster && !roster ? (
            <div className="flex min-h-[260px] items-center justify-center">
              <Loader2 className="h-7 w-7 animate-spin text-[#006dcc]" />
            </div>
          ) : roster ? (
            <>
              {!roster.allocation.editable && (
                <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  This course is not in the current semester, so its results are read-only.
                </div>
              )}

              <div className="overflow-x-auto rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Matric No.</TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead className="w-28">CA / {CA_MAX}</TableHead>
                      <TableHead className="w-28">Exam / {EXAM_MAX}</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead className="min-w-[220px]">Comment</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>

                  <TableBody>
                    {filteredStudents.map((s, index) => {
                      const editable = canEdit(s);
                      const caText = valueOf(s, "caScore");
                      const exText = valueOf(s, "examScore");
                      const previewTotal =
                        caText !== "" && exText !== "" ? Number(caText) + Number(exText) : s.total;
                      const grade =
                        previewTotal === null ? null : previewGrade(previewTotal).grade;
                      const dirty = Boolean(drafts[s.studentId]);

                      return (
                        <TableRow key={s.studentId} className={dirty ? "bg-amber-50/50" : ""}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell className="font-medium">{s.matricNumber || "—"}</TableCell>
                          <TableCell>{s.name}</TableCell>

                          <TableCell>
                            <Input
                              type="number"
                              min={0}
                              max={CA_MAX}
                              className="w-24"
                              value={caText}
                              disabled={!editable}
                              onChange={(e) => setDraft(s.studentId, "caScore", e.target.value)}
                            />
                          </TableCell>

                          <TableCell>
                            <Input
                              type="number"
                              min={0}
                              max={EXAM_MAX}
                              className="w-24"
                              value={exText}
                              disabled={!editable}
                              onChange={(e) => setDraft(s.studentId, "examScore", e.target.value)}
                            />
                          </TableCell>

                          <TableCell className="font-semibold">{previewTotal ?? "—"}</TableCell>

                          <TableCell>
                            {grade ? <Badge variant="outline">{grade}</Badge> : <span className="text-muted-foreground">—</span>}
                          </TableCell>

                          <TableCell>
                            <Input
                              placeholder="Optional remark"
                              value={valueOf(s, "comment")}
                              disabled={!editable}
                              onChange={(e) => setDraft(s.studentId, "comment", e.target.value)}
                            />
                          </TableCell>

                          <TableCell>
                            <StatusPill status={s.status} />
                          </TableCell>
                        </TableRow>
                      );
                    })}

                    {filteredStudents.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={9} className="h-24 text-center text-muted-foreground">
                          {totalStudents === 0
                            ? "No students are registered for this course this semester."
                            : "No students match your search."}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* FOOTER ACTIONS */}
              {roster.allocation.editable && totalStudents > 0 && (
                <div className="mt-5 flex flex-col gap-3 rounded-lg border bg-muted/30 p-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-sm font-medium">
                      {dirtyCount > 0
                        ? `${dirtyCount} unsaved change${dirtyCount === 1 ? "" : "s"}`
                        : "All changes saved"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Save as draft to keep working. Submit when every student has both scores; after that,
                      the administrator reviews the results.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleSave} disabled={busy !== null || dirtyCount === 0}>
                      {busy === "save" ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="mr-2 h-4 w-4" />
                      )}
                      Save Draft
                    </Button>
                    <Button
                      className="bg-[#006dcc] hover:bg-[#005ca8]"
                      onClick={handleSubmit}
                      disabled={busy !== null}
                    >
                      {busy === "submit" ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="mr-2 h-4 w-4" />
                      )}
                      Submit to Administrator
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* SUMMARY CARD                                                        */
/* ------------------------------------------------------------------ */

function SummaryCard({
  label,
  value,
  icon,
  note,
  tone = "",
}: {
  label: string;
  value: number | string;
  icon: React.ReactNode;
  note: string;
  tone?: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardDescription>{label}</CardDescription>
        <CardTitle className={`text-2xl ${tone}`}>{value}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {icon}
          {note}
        </div>
      </CardContent>
    </Card>
  );
}