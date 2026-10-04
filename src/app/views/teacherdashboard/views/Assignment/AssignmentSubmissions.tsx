import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Download, FileText, Loader2, Search } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api, courseLabel, errorMessage, formatDate, formatFileSize } from "@/lib/assignments";

type Submission = {
  _id: string;
  student: { name: string; matric: string };
  text?: string;
  fileName?: string;
  hasFile: boolean;
  fileSize?: number;
  status: "Submitted" | "Graded";
  score?: number;
  feedback?: string;
  submittedAt: string;
  late: boolean;
};

type AssignmentInfo = {
  _id: string;
  title: string;
  course?: { _id: string; code?: string; title?: string } | null;
  maxMarks: number;
  dueDate: string;
  status: string;
};

export default function AssignmentSubmissions() {
  const { id } = useParams<{ id: string }>();

  const [assignment, setAssignment] = useState<AssignmentInfo | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const [grading, setGrading] = useState<Submission | null>(null);
  const [score, setScore] = useState("");
  const [feedback, setFeedback] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError("");
      const data = await api<{ assignment: AssignmentInfo; submissions: Submission[] }>(
        `/assignments/${id}/submissions`
      );
      setAssignment(data.assignment);
      setSubmissions(data.submissions || []);
    } catch (err) {
      setError(errorMessage(err, "Failed to load submissions"));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const openFile = async (s: Submission) => {
    try {
      setBusyId(s._id);
      const data = await api<{ url: string }>(`/assignments/${id}/submissions/${s._id}/file`);
      window.location.assign(data.url); // short-lived presigned S3 link
    } catch (err) {
      toast.error(errorMessage(err, "Could not open the file"));
    } finally {
      setBusyId(null);
    }
  };

  const startGrading = (s: Submission) => {
    setGrading(s);
    setScore(s.score != null ? String(s.score) : "");
    setFeedback(s.feedback || "");
  };

  const saveGrade = async () => {
    if (!grading || !assignment) return;
    const value = Number(score);
    if (score.trim() === "" || !Number.isFinite(value) || value < 0 || value > assignment.maxMarks) {
      toast.error(`Enter a score between 0 and ${assignment.maxMarks}`);
      return;
    }
    try {
      setSaving(true);
      await api(`/assignments/${id}/submissions/${grading._id}/grade`, {
        method: "PATCH",
        body: JSON.stringify({ score: value, feedback }),
      });
      setSubmissions((list) =>
        list.map((s) =>
          s._id === grading._id ? { ...s, status: "Graded", score: value, feedback } : s
        )
      );
      toast.success("Grade saved");
      setGrading(null);
    } catch (err) {
      toast.error(errorMessage(err, "Could not save the grade"));
    } finally {
      setSaving(false);
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return submissions.filter(
      (s) =>
        !q ||
        [s.student.name, s.student.matric, s.fileName].join(" ").toLowerCase().includes(q)
    );
  }, [submissions, search]);

  const gradedCount = submissions.filter((s) => s.status === "Graded").length;

  return (
    <div className="min-h-full space-y-6 p-4 md:p-6">
      <Link
        to="/staff/dashboard/assignment"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Assignments
      </Link>

      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <Loader2 className="h-7 w-7 animate-spin text-[#006dcc]" />
        </div>
      ) : error ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : (
        <>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{assignment?.title}</h1>
            <p className="text-sm text-muted-foreground">
              {courseLabel(assignment?.course)} · Due {formatDate(assignment?.dueDate)} ·{" "}
              {assignment?.maxMarks} marks
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Submissions</CardDescription>
                <CardTitle className="text-2xl">{submissions.length}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Graded</CardDescription>
                <CardTitle className="text-2xl">{gradedCount}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Awaiting grading</CardDescription>
                <CardTitle className="text-2xl">{submissions.length - gradedCount}</CardTitle>
              </CardHeader>
            </Card>
          </div>

          <Card>
            <CardHeader className="gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <CardTitle>Student Submissions</CardTitle>
                <CardDescription>
                  {filtered.length} submission{filtered.length === 1 ? "" : "s"} shown.
                </CardDescription>
              </div>
              <div className="relative md:w-[260px]">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="Search student or file..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </CardHeader>

            <CardContent>
              {filtered.length === 0 ? (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  {submissions.length === 0
                    ? "No student has submitted yet."
                    : "No submissions match your search."}
                </div>
              ) : (
                <div className="divide-y">
                  {filtered.map((s) => (
                    <div
                      key={s._id}
                      className="flex flex-col gap-3 py-4 lg:flex-row lg:items-center lg:justify-between"
                    >
                      <div className="min-w-0">
                        <p className="font-semibold">{s.student.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {[s.student.matric, `Submitted ${formatDate(s.submittedAt)}`]
                            .filter(Boolean)
                            .join(" · ")}
                          {s.late && <span className="ml-2 font-medium text-red-600">Late</span>}
                        </p>
                        {s.text && (
                          <p className="mt-2 line-clamp-2 max-w-2xl whitespace-pre-wrap text-sm text-muted-foreground">
                            {s.text}
                          </p>
                        )}
                        {s.hasFile && (
                          <div className="mt-2 inline-flex items-center gap-2 rounded-md border bg-muted/30 px-3 py-1.5 text-xs">
                            <FileText className="h-4 w-4 text-[#006dcc]" />
                            <span className="max-w-[240px] truncate">{s.fileName}</span>
                            <span className="text-muted-foreground">({formatFileSize(s.fileSize)})</span>
                          </div>
                        )}
                      </div>

                      <div className="flex shrink-0 flex-wrap items-center gap-2">
                        <span
                          className={`rounded-sm border px-2 py-1 text-xs font-medium ${
                            s.status === "Graded"
                              ? "border-blue-600 bg-blue-600 text-white"
                              : "border-green-300 bg-green-50 text-green-700"
                          }`}
                        >
                          {s.status === "Graded" ? `${s.score}/${assignment?.maxMarks}` : "Awaiting grade"}
                        </span>
                        {s.hasFile && (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={busyId === s._id}
                            onClick={() => openFile(s)}
                          >
                            {busyId === s._id ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Download className="mr-2 h-4 w-4" />
                            )}
                            Download
                          </Button>
                        )}
                        <Button
                          size="sm"
                          className="bg-[#006dcc] hover:bg-[#005ca8]"
                          onClick={() => startGrading(s)}
                        >
                          {s.status === "Graded" ? "Edit grade" : "Grade"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      <Dialog open={!!grading} onOpenChange={(open) => !open && setGrading(null)}>
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Grade submission</DialogTitle>
            <DialogDescription>
              {grading?.student.name} · out of {assignment?.maxMarks}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Score</label>
              <Input
                type="number"
                min={0}
                max={assignment?.maxMarks}
                value={score}
                onChange={(e) => setScore(e.target.value)}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Feedback (optional)</label>
              <textarea
                rows={4}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full rounded-md border bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-[#006dcc]/30"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setGrading(null)}>
              Cancel
            </Button>
            <Button className="bg-[#006dcc] hover:bg-[#005ca8]" disabled={saving} onClick={saveGrade}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save grade
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}