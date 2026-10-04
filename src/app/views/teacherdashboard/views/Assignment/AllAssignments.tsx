

import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Clock,
  Download,
  Eye,
  FileText,
  Loader2,
  Pencil,
  Users,  
  Plus,
  RefreshCw,
  Search,
  Send,
  Trash2,
  XCircle,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

import {
  api,
  errorMessage,
  courseLabel,
  formatDate,
  formatFileSize,
  openAttachment,
  StatusBadge,
  type AllocationOption,
  type Assignment,
  type AssignmentStatus,
} from "@/lib/assignments";

export default function AllAssignments() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [allocations, setAllocations] = useState<AllocationOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState(searchParams.get("course") || "all");

  const [selected, setSelected] = useState<Assignment | null>(null);

  /* ----------------------------- LOAD ----------------------------- */

  const load = useCallback(async (spinner = true) => {
    try {
      if (spinner) setLoading(true);
      setError("");
      const data = await api<{ assignments: Assignment[]; allocations: AllocationOption[] }>(
        "/assignments/mine"
      );
      setAssignments(data.assignments || []);
      setAllocations(data.allocations || []);
    } catch (err) {
      setError(errorMessage(err, "Failed to load assignments"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  /* ---------------------------- ACTIONS --------------------------- */

  const changeStatus = async (assignment: Assignment, status: AssignmentStatus) => {
    try {
      setBusyId(assignment._id);
      await api(`/assignments/${assignment._id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      toast.success(`Assignment ${status}`);
      setSelected(null);
      await load(false);
    } catch (err) {
      toast.error(errorMessage(err, "Could not update the assignment"));
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (assignment: Assignment) => {
    if (!window.confirm(`Delete "${assignment.title}"? This cannot be undone.`)) return;
    try {
      setBusyId(assignment._id);
      await api(`/assignments/${assignment._id}`, { method: "DELETE" });
      setAssignments((current) => current.filter((a) => a._id !== assignment._id));
      setSelected(null);
      toast.success("Assignment deleted");
    } catch (err) {
      toast.error(errorMessage(err, "Could not delete the assignment"));
    } finally {
      setBusyId(null);
    }
  };

  const download = async (assignment: Assignment) => {
    try {
      setBusyId(assignment._id);
      await openAttachment(assignment._id);
    } catch (err) {
      toast.error(errorMessage(err, "Could not open the attachment"));
    } finally {
      setBusyId(null);
    }
  };

  const goCreate = () =>
    navigate(
      `/staff/dashboard/assignment/create${
        courseFilter !== "all" ? `?course=${courseFilter}` : ""
      }`
    );

  const goEdit = (id: string) => navigate(`/staff/dashboard/assignment/create?edit=${id}`);

  /* ---------------------------- DERIVED --------------------------- */

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();

    return assignments.filter((a) => {
      const matchesSearch =
        !q ||
        [a.title, a.description, a.course?.code, a.course?.title, a.attachment?.fileName]
          .join(" ")
          .toLowerCase()
          .includes(q);
      const matchesStatus = statusFilter === "all" || a.status === statusFilter;
      const matchesCourse = courseFilter === "all" || a.allocation === courseFilter;
      return matchesSearch && matchesStatus && matchesCourse;
    });
  }, [assignments, search, statusFilter, courseFilter]);

  const count = (status: AssignmentStatus) =>
    assignments.filter((a) => a.status === status).length;

  const filteredCourse = allocations.find((a) => a._id === courseFilter);

  /* ----------------------------- RENDER --------------------------- */

  return (
    <div className="min-h-full space-y-6 p-4 md:p-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#006dcc]/10">
            <ClipboardList className="h-5 w-5 text-[#006dcc]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Assignments</h1>
            <p className="text-sm text-muted-foreground">
              {filteredCourse
                ? `Assignments for ${courseLabel(filteredCourse.course)}`
                : "View and manage assignments across your assigned courses."}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => load()} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button className="bg-[#006dcc] hover:bg-[#005ca8]" onClick={goCreate}>
            <Plus className="mr-2 h-4 w-4" />
            Create Assignment
          </Button>
         
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* SUMMARY */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total", value: assignments.length, icon: ClipboardList, note: "All assignments" },
          { label: "Published", value: count("published"), icon: CheckCircle2, note: "Visible to students" },
          { label: "Drafts", value: count("draft"), icon: Clock, note: "Not yet published" },
          { label: "Closed", value: count("closed"), icon: XCircle, note: "No longer active" },
        ].map(({ label, value, icon: Icon, note }) => (
          <Card key={label}>
            <CardHeader className="pb-2">
              <CardDescription>{label}</CardDescription>
              <CardTitle className="text-2xl">{loading ? "…" : value}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Icon className="h-4 w-4" />
                {note}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* FILTERS */}
      <Card>
        <CardContent className="flex flex-col gap-3 p-4 lg:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              className="pl-9"
              placeholder="Search by title, course or attachment..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full lg:w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={courseFilter} onValueChange={setCourseFilter}>
            <SelectTrigger className="w-full lg:w-[280px]">
              <SelectValue placeholder="Course" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Courses</SelectItem>
              {allocations.map((a) => (
                <SelectItem key={a._id} value={a._id}>
                  {courseLabel(a.course)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* LIST */}
      <Card>
        <CardHeader>
          <CardTitle>Assignment List</CardTitle>
          <CardDescription>
            {filtered.length} assignment{filtered.length === 1 ? "" : "s"} found.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex min-h-[240px] items-center justify-center">
              <Loader2 className="h-7 w-7 animate-spin text-[#006dcc]" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex min-h-[280px] flex-col items-center justify-center rounded-lg border border-dashed text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                <ClipboardList className="h-7 w-7 text-muted-foreground" />
              </div>
              <h3 className="font-semibold">No assignments found</h3>
              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                {assignments.length === 0
                  ? "Create your first assignment for one of your courses."
                  : "Try changing your search or filters."}
              </p>
              {assignments.length === 0 && (
                <Button className="mt-4 bg-[#006dcc] hover:bg-[#005ca8]" onClick={goCreate}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Assignment
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((a) => {
                const busy = busyId === a._id;
                return (
                  <div key={a._id} className="rounded-xl border p-4 transition hover:bg-muted/40">
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                      <div className="flex min-w-0 gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#006dcc]/10">
                          <ClipboardList className="h-6 w-6 text-[#006dcc]" />
                        </div>

                        <div className="min-w-0">
                          <div className="mb-1 flex flex-wrap items-center gap-2">
                            <h3 className="font-semibold">{a.title}</h3>
                            <StatusBadge status={a.status} />
                          </div>

                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <BookOpen className="h-3.5 w-3.5" />
                              {courseLabel(a.course)}
                            </span>
                            <span className="flex items-center gap-1">
                              <CalendarDays className="h-3.5 w-3.5" />
                              Due {formatDate(a.dueDate)}
                            </span>
                            <span>{a.maxMarks} marks</span>
                          </div>

                          {a.description && (
                            <p className="mt-2 line-clamp-2 max-w-3xl text-sm text-muted-foreground">
                              {a.description}
                            </p>
                          )}

                          {a.hasAttachment && a.attachment && (
                            <div className="mt-3 inline-flex items-center gap-2 rounded-md border bg-muted/30 px-3 py-2 text-sm">
                              <FileText className="h-4 w-4 text-[#006dcc]" />
                              <span className="max-w-[250px] truncate">{a.attachment.fileName}</span>
                              <span className="text-xs text-muted-foreground">
                                ({formatFileSize(a.attachment.size)})
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-wrap items-center gap-2">
                        <Button size="sm" variant="outline" onClick={() => setSelected(a)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => goEdit(a._id)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </Button>
<Button
  size="sm"
  variant="outline"
  onClick={() => navigate(`/staff/dashboard/assignment/${a._id}/submissions`)}
>
  <Users className="mr-2 h-4 w-4" />
  Submissions{a.submissionCount ? ` (${a.submissionCount})` : ""}
</Button>
                        {a.status === "draft" && (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={busy}
                            onClick={() => changeStatus(a, "published")}
                          >
                            <Send className="mr-2 h-4 w-4" />
                            Publish
                          </Button>
                        )}
                        {a.status === "published" && (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={busy}
                            onClick={() => changeStatus(a, "closed")}
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Close
                          </Button>
                        )}

                        <Button
                          size="icon"
                          variant="ghost"
                          disabled={busy}
                          onClick={() => remove(a)}
                        >
                          {busy ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4 text-red-600" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* VIEW DIALOG */}
      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[700px]">
          {selected && (
            <>
              <DialogHeader>
                <div className="flex flex-wrap items-center gap-2">
                  <DialogTitle>{selected.title}</DialogTitle>
                  <StatusBadge status={selected.status} />
                </div>
                <DialogDescription>{courseLabel(selected.course)}</DialogDescription>
              </DialogHeader>

              <div className="space-y-5">
                <div>
                  <p className="mb-2 text-sm font-medium">Instructions</p>
                  <div className="whitespace-pre-wrap rounded-lg border bg-muted/30 p-4 text-sm leading-6">
                    {selected.description || "No instructions provided."}
                  </div>
                </div>

                {selected.hasAttachment && selected.attachment && (
                  <div className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                        <FileText className="h-5 w-5 text-[#006dcc]" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium">{selected.attachment.fileName}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(selected.attachment.size)}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      disabled={busyId === selected._id}
                      onClick={() => download(selected)}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Open
                    </Button>
                  </div>
                )}

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-lg border p-4">
                    <p className="text-xs text-muted-foreground">Maximum Marks</p>
                    <p className="mt-1 text-lg font-semibold">{selected.maxMarks}</p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <p className="text-xs text-muted-foreground">Due Date</p>
                    <p className="mt-1 text-sm font-semibold">{formatDate(selected.dueDate)}</p>
                  </div>
                  <div className="rounded-lg border p-4">
                    <p className="text-xs text-muted-foreground">Created</p>
                    <p className="mt-1 text-sm font-semibold">{formatDate(selected.createdAt)}</p>
                  </div>
                </div>

                <div className="grid gap-3 text-sm sm:grid-cols-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Programme</p>
                    <p className="font-medium">{selected.programme?.name || "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Level / Semester</p>
                    <p className="font-medium">
                      {[selected.level, selected.semester].filter(Boolean).join(" · ") || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Session</p>
                    <p className="font-medium">{selected.academicSession?.name || "—"}</p>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setSelected(null)}>
                  Close
                </Button>
                <Button
                  className="bg-[#006dcc] hover:bg-[#005ca8]"
                  onClick={() => goEdit(selected._id)}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit Assignment
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}