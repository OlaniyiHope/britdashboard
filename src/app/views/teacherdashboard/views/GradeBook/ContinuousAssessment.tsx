import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  Download,
  RefreshCw,
  ClipboardList,
  Users,
  CheckCircle2,
  Clock,
  BookOpen,
  X,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

// ============================================================
// TYPES
// ============================================================

type AssessmentStatus = "Draft" | "Published" | "Completed";

type Assessment = {
  id: string;
  title: string;
  courseCode: string;
  courseName: string;
  className: string;
  type: string;
  totalMarks: number;
  studentCount: number;
  submittedCount: number;
  status: AssessmentStatus;
  dueDate: string;
  description?: string;
  createdAt: string;
};

// ============================================================
// SAMPLE DATA
// ============================================================

const initialAssessments: Assessment[] = [
  {
    id: "ca-001",
    title: "Digital Electronics Test 1",
    courseCode: "EEE 204",
    courseName: "Digital Electronics",
    className: "ND II Electrical Engineering",
    type: "Test",
    totalMarks: 20,
    studentCount: 42,
    submittedCount: 42,
    status: "Completed",
    dueDate: "2026-08-20",
    description: "First continuous assessment test.",
    createdAt: "2026-08-01",
  },
  {
    id: "ca-002",
    title: "Basic Electronics Assignment",
    courseCode: "EEE 202",
    courseName: "Basic Electronics",
    className: "ND II Electrical Engineering",
    type: "Assignment",
    totalMarks: 10,
    studentCount: 38,
    submittedCount: 31,
    status: "Published",
    dueDate: "2026-09-05",
    description: "Assignment covering semiconductor devices.",
    createdAt: "2026-08-15",
  },
  {
    id: "ca-003",
    title: "Computer Hardware Practical",
    courseCode: "CPE 206",
    courseName: "Computer Hardware",
    className: "ND II Computer Engineering",
    type: "Practical",
    totalMarks: 20,
    studentCount: 35,
    submittedCount: 20,
    status: "Published",
    dueDate: "2026-09-10",
    description: "Practical assessment on computer hardware.",
    createdAt: "2026-08-18",
  },
  {
    id: "ca-004",
    title: "Electrical Installation Quiz",
    courseCode: "EET 208",
    courseName: "Electrical Installation",
    className: "ND II Electrical Engineering",
    type: "Quiz",
    totalMarks: 15,
    studentCount: 40,
    submittedCount: 0,
    status: "Draft",
    dueDate: "2026-09-15",
    description: "Quiz covering domestic electrical installation.",
    createdAt: "2026-08-22",
  },
];

// ============================================================
// HELPERS
// ============================================================

const statusVariant = (
  status: AssessmentStatus
): "default" | "secondary" | "outline" => {
  if (status === "Published") return "default";
  if (status === "Draft") return "secondary";
  return "outline";
};

const formatDate = (date: string) => {
  if (!date) return "Not set";

  return new Date(date).toLocaleDateString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// ============================================================
// COMPONENT
// ============================================================

export default function ContinuousAssessment() {
  const [assessments, setAssessments] =
    useState<Assessment[]>(initialAssessments);

  const [search, setSearch] = useState("");

  const [showCreate, setShowCreate] =
    useState(false);

  const [showView, setShowView] =
    useState(false);

  const [selectedAssessment, setSelectedAssessment] =
    useState<Assessment | null>(null);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  // ============================================================
  // FORM
  // ============================================================

  const [form, setForm] = useState({
    title: "",
    courseCode: "",
    courseName: "",
    className: "",
    type: "",
    totalMarks: "",
    dueDate: "",
    description: "",
  });

  // ============================================================
  // FILTER
  // ============================================================

  const filteredAssessments = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) {
      return assessments;
    }

    return assessments.filter((assessment) =>
      `
        ${assessment.title}
        ${assessment.courseCode}
        ${assessment.courseName}
        ${assessment.className}
        ${assessment.type}
        ${assessment.status}
      `
        .toLowerCase()
        .includes(query)
    );
  }, [assessments, search]);

  // ============================================================
  // COUNTERS
  // ============================================================

  const totalAssessments = assessments.length;

  const publishedCount = assessments.filter(
    (item) => item.status === "Published"
  ).length;

  const completedCount = assessments.filter(
    (item) => item.status === "Completed"
  ).length;

  const pendingMarks = assessments.reduce(
    (total, item) =>
      total + (item.studentCount - item.submittedCount),
    0
  );

  // ============================================================
  // RESET FORM
  // ============================================================

  const resetForm = () => {
    setForm({
      title: "",
      courseCode: "",
      courseName: "",
      className: "",
      type: "",
      totalMarks: "",
      dueDate: "",
      description: "",
    });

    setEditingId(null);
  };

  // ============================================================
  // OPEN CREATE
  // ============================================================

  const openCreate = () => {
    resetForm();
    setShowCreate(true);
  };

  // ============================================================
  // EDIT
  // ============================================================

  const editAssessment = (
    assessment: Assessment
  ) => {
    setEditingId(assessment.id);

    setForm({
      title: assessment.title,
      courseCode: assessment.courseCode,
      courseName: assessment.courseName,
      className: assessment.className,
      type: assessment.type,
      totalMarks: String(assessment.totalMarks),
      dueDate: assessment.dueDate,
      description: assessment.description || "",
    });

    setShowCreate(true);
  };

  // ============================================================
  // CREATE / UPDATE
  // ============================================================

  const saveAssessment = () => {
    if (!form.title.trim()) {
      toast.error("Enter an assessment title");
      return;
    }

    if (!form.courseCode.trim()) {
      toast.error("Enter the course code");
      return;
    }

    if (!form.courseName.trim()) {
      toast.error("Enter the course name");
      return;
    }

    if (!form.className.trim()) {
      toast.error("Enter the class");
      return;
    }

    if (!form.type) {
      toast.error("Select assessment type");
      return;
    }

    if (!form.totalMarks) {
      toast.error("Enter total marks");
      return;
    }

    if (editingId) {
      setAssessments((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                title: form.title.trim(),
                courseCode:
                  form.courseCode.trim(),
                courseName:
                  form.courseName.trim(),
                className:
                  form.className.trim(),
                type: form.type,
                totalMarks:
                  Number(form.totalMarks),
                dueDate: form.dueDate,
                description:
                  form.description.trim(),
              }
            : item
        )
      );

      toast.success(
        "Assessment updated successfully"
      );
    } else {
      const newAssessment: Assessment = {
        id: `ca-${Date.now()}`,
        title: form.title.trim(),
        courseCode: form.courseCode.trim(),
        courseName: form.courseName.trim(),
        className: form.className.trim(),
        type: form.type,
        totalMarks: Number(form.totalMarks),
        studentCount: 0,
        submittedCount: 0,
        status: "Draft",
        dueDate: form.dueDate,
        description:
          form.description.trim(),
        createdAt:
          new Date().toISOString(),
      };

      setAssessments((prev) => [
        newAssessment,
        ...prev,
      ]);

      toast.success(
        "Assessment created successfully"
      );
    }

    resetForm();
    setShowCreate(false);
  };

  // ============================================================
  // DELETE
  // ============================================================

  const deleteAssessment = (
    id: string
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this assessment?"
    );

    if (!confirmed) return;

    setAssessments((prev) =>
      prev.filter(
        (item) => item.id !== id
      )
    );

    toast.success(
      "Assessment deleted successfully"
    );
  };

  // ============================================================
  // VIEW
  // ============================================================

  const viewAssessment = (
    assessment: Assessment
  ) => {
    setSelectedAssessment(assessment);
    setShowView(true);
  };

  // ============================================================
  // PUBLISH
  // ============================================================

  const publishAssessment = (
    assessment: Assessment
  ) => {
    setAssessments((prev) =>
      prev.map((item) =>
        item.id === assessment.id
          ? {
              ...item,
              status: "Published",
            }
          : item
      )
    );

    toast.success(
      "Assessment published successfully"
    );
  };

  // ============================================================
  // REFRESH
  // ============================================================

  const refresh = () => {
    toast.success(
      "Assessment list refreshed"
    );
  };

  // ============================================================
  // EXPORT
  // ============================================================

  const exportAssessments = () => {
    const headers = [
      "Assessment",
      "Course",
      "Class",
      "Type",
      "Total Marks",
      "Students",
      "Submitted",
      "Status",
      "Due Date",
    ];

    const rows = assessments.map(
      (item) => [
        item.title,
        `${item.courseCode} - ${item.courseName}`,
        item.className,
        item.type,
        item.totalMarks,
        item.studentCount,
        item.submittedCount,
        item.status,
        item.dueDate,
      ]
    );

    const csv = [
      headers,
      ...rows,
    ]
      .map((row) =>
        row
          .map((value) =>
            `"${String(value).replace(
              /"/g,
              '""'
            )}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob(
      [csv],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;
    link.download =
      "continuous-assessments.csv";

    link.click();

    URL.revokeObjectURL(url);

    toast.success(
      "Assessment list exported"
    );
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="min-h-full space-y-6 p-4 md:p-6">

      {/* ====================================================== */}
      {/* HEADER */}
      {/* ====================================================== */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#006dcc]/10">

            <ClipboardList className="h-6 w-6 text-[#006dcc]" />

          </div>

          <div>

            <h1 className="text-2xl font-bold tracking-tight">
              Continuous Assessment
            </h1>

            <p className="text-sm text-muted-foreground">
              Create, manage and grade continuous assessments for your courses.
            </p>

          </div>

        </div>

        <div className="flex flex-wrap gap-2">

          <Button
            variant="outline"
            onClick={refresh}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>

          <Button
            className="bg-[#006dcc] hover:bg-[#005ca8]"
            onClick={openCreate}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Assessment
          </Button>

        </div>

      </div>

      {/* ====================================================== */}
      {/* SUMMARY */}
      {/* ====================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>
              Total Assessments
            </CardDescription>

            <CardTitle className="text-2xl">
              {totalAssessments}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ClipboardList className="h-4 w-4" />
              All assessments
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>
              Published
            </CardDescription>

            <CardTitle className="text-2xl">
              {publishedCount}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CheckCircle2 className="h-4 w-4" />
              Available to students
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>
              Completed
            </CardDescription>

            <CardTitle className="text-2xl">
              {completedCount}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <BookOpen className="h-4 w-4" />
              Assessments completed
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>
              Pending Submissions
            </CardDescription>

            <CardTitle className="text-2xl">
              {pendingMarks}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-4 w-4" />
              Student submissions
            </div>
          </CardContent>
        </Card>

      </div>

      {/* ====================================================== */}
      {/* TABLE */}
      {/* ====================================================== */}

      <Card>

        <CardHeader>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <CardTitle>
                My Assessments
              </CardTitle>

              <CardDescription>
                Manage continuous assessments for your assigned courses.
              </CardDescription>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">

              <div className="relative w-full sm:w-80">

                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />

                <Input
                  className="pl-9"
                  placeholder="Search assessments..."
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                />

              </div>

              <Button
                variant="outline"
                onClick={exportAssessments}
              >
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>

            </div>

          </div>

        </CardHeader>

        <CardContent>

          <div className="rounded-md border">

            <Table>

              <TableHeader>

                <TableRow>

                  <TableHead>
                    Assessment
                  </TableHead>

                  <TableHead>
                    Course
                  </TableHead>

                  <TableHead>
                    Class
                  </TableHead>

                  <TableHead>
                    Type
                  </TableHead>

                  <TableHead>
                    Marks
                  </TableHead>

                  <TableHead>
                    Submissions
                  </TableHead>

                  <TableHead>
                    Status
                  </TableHead>

                  <TableHead>
                    Due Date
                  </TableHead>

                  <TableHead className="text-right">
                    Actions
                  </TableHead>

                </TableRow>

              </TableHeader>

              <TableBody>

                {filteredAssessments.map(
                  (assessment) => (

                    <TableRow
                      key={assessment.id}
                    >

                      <TableCell>

                        <div>

                          <p className="font-medium">
                            {assessment.title}
                          </p>

                          <p className="text-xs text-muted-foreground">
                            {assessment.courseCode}
                          </p>

                        </div>

                      </TableCell>

                      <TableCell>

                        <div>

                          <p className="font-medium">
                            {assessment.courseName}
                          </p>

                          <p className="text-xs text-muted-foreground">
                            {assessment.courseCode}
                          </p>

                        </div>

                      </TableCell>

                      <TableCell>
                        {assessment.className}
                      </TableCell>

                      <TableCell>
                        <Badge variant="outline">
                          {assessment.type}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        {assessment.totalMarks}
                      </TableCell>

                      <TableCell>

                        <div className="flex items-center gap-1">

                          <Users className="h-3.5 w-3.5 text-muted-foreground" />

                          <span>
                            {assessment.submittedCount}/
                            {assessment.studentCount}
                          </span>

                        </div>

                      </TableCell>

                      <TableCell>

                        <Badge
                          variant={statusVariant(
                            assessment.status
                          )}
                        >
                          {assessment.status}
                        </Badge>

                      </TableCell>

                      <TableCell>
                        {formatDate(
                          assessment.dueDate
                        )}
                      </TableCell>

                      <TableCell className="text-right">

                        <div className="flex justify-end gap-1">

                          <Button
                            size="icon"
                            variant="ghost"
                            title="View"
                            onClick={() =>
                              viewAssessment(
                                assessment
                              )
                            }
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                          <Button
                            size="icon"
                            variant="ghost"
                            title="Edit"
                            onClick={() =>
                              editAssessment(
                                assessment
                              )
                            }
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>

                          {assessment.status ===
                            "Draft" && (
                            <Button
                              size="icon"
                              variant="ghost"
                              title="Publish"
                              onClick={() =>
                                publishAssessment(
                                  assessment
                                )
                              }
                            >
                              <CheckCircle2 className="h-4 w-4" />
                            </Button>
                          )}

                          <Button
                            size="icon"
                            variant="ghost"
                            title="Delete"
                            onClick={() =>
                              deleteAssessment(
                                assessment.id
                              )
                            }
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>

                        </div>

                      </TableCell>

                    </TableRow>

                  )
                )}

                {!filteredAssessments.length && (

                  <TableRow>

                    <TableCell
                      colSpan={9}
                      className="h-32 text-center"
                    >

                      <ClipboardList className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />

                      <p className="font-medium">
                        No assessments found
                      </p>

                      <p className="text-sm text-muted-foreground">
                        Try another search or create a new assessment.
                      </p>

                    </TableCell>

                  </TableRow>

                )}

              </TableBody>

            </Table>

          </div>

        </CardContent>

      </Card>

      {/* ====================================================== */}
      {/* CREATE / EDIT DIALOG */}
      {/* ====================================================== */}

      <Dialog
        open={showCreate}
        onOpenChange={setShowCreate}
      >

        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">

          <DialogHeader>

            <DialogTitle>
              {editingId
                ? "Edit Assessment"
                : "Create Continuous Assessment"}
            </DialogTitle>

            <DialogDescription>
              Create an assessment for one of your assigned courses.
            </DialogDescription>

          </DialogHeader>

          <div className="space-y-5 py-3">

            {/* TITLE */}

            <div className="space-y-2">

              <Label>
                Assessment Title
              </Label>

              <Input
                placeholder="e.g. Digital Electronics Test 2"
                value={form.title}
                onChange={(e) =>
                  setForm({
                    ...form,
                    title:
                      e.target.value,
                  })
                }
              />

            </div>

            {/* COURSE */}

            <div className="grid gap-4 sm:grid-cols-2">

              <div className="space-y-2">

                <Label>
                  Course Code
                </Label>

                <Input
                  placeholder="e.g. EEE 204"
                  value={form.courseCode}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      courseCode:
                        e.target.value,
                    })
                  }
                />

              </div>

              <div className="space-y-2">

                <Label>
                  Course Name
                </Label>

                <Input
                  placeholder="e.g. Digital Electronics"
                  value={form.courseName}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      courseName:
                        e.target.value,
                    })
                  }
                />

              </div>

            </div>

            {/* CLASS */}

            <div className="space-y-2">

              <Label>
                Class / Programme
              </Label>

              <Input
                placeholder="e.g. ND II Electrical Engineering"
                value={form.className}
                onChange={(e) =>
                  setForm({
                    ...form,
                    className:
                      e.target.value,
                  })
                }
              />

            </div>

            {/* TYPE + MARKS */}

            <div className="grid gap-4 sm:grid-cols-2">

              <div className="space-y-2">

                <Label>
                  Assessment Type
                </Label>

                <Select
                  value={form.type}
                  onValueChange={(value) =>
                    setForm({
                      ...form,
                      type: value,
                    })
                  }
                >

                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>

                  <SelectContent>

                    <SelectItem value="Test">
                      Test
                    </SelectItem>

                    <SelectItem value="Assignment">
                      Assignment
                    </SelectItem>

                    <SelectItem value="Quiz">
                      Quiz
                    </SelectItem>

                    <SelectItem value="Practical">
                      Practical
                    </SelectItem>

                    <SelectItem value="Project">
                      Project
                    </SelectItem>

                  </SelectContent>

                </Select>

              </div>

              <div className="space-y-2">

                <Label>
                  Total Marks
                </Label>

                <Input
                  type="number"
                  min="1"
                  placeholder="e.g. 20"
                  value={form.totalMarks}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      totalMarks:
                        e.target.value,
                    })
                  }
                />

              </div>

            </div>

            {/* DUE DATE */}

            <div className="space-y-2">

              <Label>
                Due Date
              </Label>

              <Input
                type="date"
                value={form.dueDate}
                onChange={(e) =>
                  setForm({
                    ...form,
                    dueDate:
                      e.target.value,
                  })
                }
              />

            </div>

            {/* DESCRIPTION */}

            <div className="space-y-2">

              <Label>
                Description
              </Label>

              <Textarea
                placeholder="Describe what students are expected to complete..."
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description:
                      e.target.value,
                  })
                }
              />

            </div>

          </div>

          <DialogFooter>

            <Button
              variant="outline"
              onClick={() => {
                resetForm();
                setShowCreate(false);
              }}
            >
              Cancel
            </Button>

            <Button
              className="bg-[#006dcc] hover:bg-[#005ca8]"
              onClick={saveAssessment}
            >
              {editingId
                ? "Save Changes"
                : "Create Assessment"}
            </Button>

          </DialogFooter>

        </DialogContent>

      </Dialog>

      {/* ====================================================== */}
      {/* VIEW DIALOG */}
      {/* ====================================================== */}

      <Dialog
        open={showView}
        onOpenChange={setShowView}
      >

        <DialogContent className="sm:max-w-[600px]">

          <DialogHeader>

            <DialogTitle>
              Assessment Details
            </DialogTitle>

            <DialogDescription>
              Review the assessment information and student submission status.
            </DialogDescription>

          </DialogHeader>

          {selectedAssessment && (

            <div className="space-y-5">

              <div className="rounded-lg border bg-muted/30 p-4">

                <div className="flex items-start justify-between gap-4">

                  <div>

                    <h3 className="font-semibold">
                      {selectedAssessment.title}
                    </h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {selectedAssessment.courseCode} —{" "}
                      {selectedAssessment.courseName}
                    </p>

                  </div>

                  <Badge
                    variant={statusVariant(
                      selectedAssessment.status
                    )}
                  >
                    {selectedAssessment.status}
                  </Badge>

                </div>

              </div>

              <div className="grid gap-4 sm:grid-cols-2">

                <div className="rounded-lg border p-4">

                  <p className="text-xs text-muted-foreground">
                    Class
                  </p>

                  <p className="mt-1 font-medium">
                    {selectedAssessment.className}
                  </p>

                </div>

                <div className="rounded-lg border p-4">

                  <p className="text-xs text-muted-foreground">
                    Assessment Type
                  </p>

                  <p className="mt-1 font-medium">
                    {selectedAssessment.type}
                  </p>

                </div>

                <div className="rounded-lg border p-4">

                  <p className="text-xs text-muted-foreground">
                    Total Marks
                  </p>

                  <p className="mt-1 font-medium">
                    {selectedAssessment.totalMarks}
                  </p>

                </div>

                <div className="rounded-lg border p-4">

                  <p className="text-xs text-muted-foreground">
                    Due Date
                  </p>

                  <p className="mt-1 font-medium">
                    {formatDate(
                      selectedAssessment.dueDate
                    )}
                  </p>

                </div>

              </div>

              <div className="rounded-lg border p-4">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="font-medium">
                      Student Submissions
                    </p>

                    <p className="text-sm text-muted-foreground">
                      Students who have submitted this assessment.
                    </p>

                  </div>

                  <Users className="h-5 w-5 text-muted-foreground" />

                </div>

                <div className="mt-4">

                  <div className="mb-2 flex justify-between text-sm">

                    <span>
                      Submitted
                    </span>

                    <span className="font-medium">
                      {selectedAssessment.submittedCount} /{" "}
                      {selectedAssessment.studentCount}
                    </span>

                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-muted">

                    <div
                      className="h-full rounded-full bg-[#006dcc]"
                      style={{
                        width:
                          selectedAssessment.studentCount >
                          0
                            ? `${
                                (selectedAssessment.submittedCount /
                                  selectedAssessment.studentCount) *
                                100
                              }%`
                            : "0%",
                      }}
                    />

                  </div>

                </div>

              </div>

              {selectedAssessment.description && (

                <div>

                  <p className="text-sm font-medium">
                    Description
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {selectedAssessment.description}
                  </p>

                </div>

              )}

            </div>

          )}

          <DialogFooter>

            <Button
              variant="outline"
              onClick={() =>
                setShowView(false)
              }
            >
              Close
            </Button>

            {selectedAssessment && (
              <Button
                className="bg-[#006dcc] hover:bg-[#005ca8]"
                onClick={() => {
                  setShowView(false);
                  editAssessment(
                    selectedAssessment
                  );
                }}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit Assessment
              </Button>
            )}

          </DialogFooter>

        </DialogContent>

      </Dialog>

    </div>
  );
}