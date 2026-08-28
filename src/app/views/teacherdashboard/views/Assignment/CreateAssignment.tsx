import { useEffect, useMemo, useRef, useState } from "react";
import {
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  RefreshCw,
  ClipboardList,
  CalendarDays,
  BookOpen,
  CheckCircle2,
  Clock,
  XCircle,
  Loader2,
  Paperclip,
  FileText,
  Image as ImageIcon,
  Download,
  Upload,
  X,
  Users,
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

type AssignmentStatus = "draft" | "published" | "closed";

type AssignmentAttachment = {
  name: string;
  type: string;
  size: number;
  url?: string;
};

type Assignment = {
  id: string;

  title: string;

  courseId: string;

  courseName: string;

  courseCode: string;

  description: string;

  dueDate: string;

  maxMarks: number;

  status: AssignmentStatus;

  submissions: number;

  createdAt: string;

  attachment?: AssignmentAttachment;
};

type Course = {
  id: string;
  name: string;
  code: string;
};

// ============================================================
// COURSES
// ============================================================

const courses: Course[] = [
  {
    id: "course-1",
    name: "Digital Electronics",
    code: "EEE 201",
  },
  {
    id: "course-2",
    name: "Basic Electricity",
    code: "EEE 101",
  },
  {
    id: "course-3",
    name: "Computer Electronics",
    code: "CPE 203",
  },
  {
    id: "course-4",
    name: "Programming Fundamentals",
    code: "CSC 101",
  },
];

// ============================================================
// DEMO ASSIGNMENTS
// ============================================================

const initialAssignments: Assignment[] = [
  {
    id: "assignment-1",
    title: "Introduction to Logic Gates",
    courseId: "course-1",
    courseName: "Digital Electronics",
    courseCode: "EEE 201",
    description:
      "Explain the operation of AND, OR, NOT, NAND and NOR logic gates.",
    dueDate: "2026-09-10T23:59",
    maxMarks: 20,
    status: "published",
    submissions: 18,
    createdAt: "2026-08-20T10:00:00",
    attachment: {
      name: "logic-gates-assignment.pdf",
      type: "application/pdf",
      size: 245000,
    },
  },

  {
    id: "assignment-2",
    title: "Ohm's Law Practical Questions",
    courseId: "course-2",
    courseName: "Basic Electricity",
    courseCode: "EEE 101",
    description:
      "Answer the practical questions based on Ohm's Law.",
    dueDate: "2026-09-15T23:59",
    maxMarks: 25,
    status: "published",
    submissions: 12,
    createdAt: "2026-08-21T10:00:00",
  },

  {
    id: "assignment-3",
    title: "Introduction to Microprocessors",
    courseId: "course-3",
    courseName: "Computer Electronics",
    courseCode: "CPE 203",
    description:
      "Write a short report explaining the basic functions of a microprocessor.",
    dueDate: "2026-09-20T23:59",
    maxMarks: 30,
    status: "draft",
    submissions: 0,
    createdAt: "2026-08-22T10:00:00",
    attachment: {
      name: "microprocessor-diagram.png",
      type: "image/png",
      size: 180000,
    },
  },
];

// ============================================================
// HELPERS
// ============================================================

function formatDate(date?: string) {
  if (!date) {
    return "No due date";
  }

  return new Date(date).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatFileSize(bytes?: number) {
  if (!bytes) return "0 KB";

  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getStatusBadge(status: AssignmentStatus) {
  if (status === "published") {
    return (
      <Badge className="gap-1">
        <CheckCircle2 className="h-3 w-3" />
        Published
      </Badge>
    );
  }

  if (status === "draft") {
    return (
      <Badge variant="secondary" className="gap-1">
        <Clock className="h-3 w-3" />
        Draft
      </Badge>
    );
  }

  return (
    <Badge variant="outline" className="gap-1">
      <XCircle className="h-3 w-3" />
      Closed
    </Badge>
  );
}

function getFileIcon(type: string) {
  if (type.startsWith("image/")) {
    return <ImageIcon className="h-5 w-5 text-[#006dcc]" />;
  }

  return <FileText className="h-5 w-5 text-[#006dcc]" />;
}

// ============================================================
// COMPONENT
// ============================================================

export default function CreateAssignment() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ============================================================
  // STATE
  // ============================================================

  const [assignments, setAssignments] =
    useState<Assignment[]>([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);

  const [showCreate, setShowCreate] = useState(false);

  const [showView, setShowView] = useState(false);

  const [editingAssignment, setEditingAssignment] =
    useState<Assignment | null>(null);

  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);

  const [form, setForm] = useState({
    title: "",
    courseId: "",
    description: "",
    dueDate: "",
    maxMarks: "20",
    status: "draft" as AssignmentStatus,
    attachment: null as AssignmentAttachment | null,
  });

  // ============================================================
  // LOAD
  // ============================================================

  useEffect(() => {
    try {
      const saved = localStorage.getItem(
        "staff_assignments"
      );

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          setAssignments(parsed);
          return;
        }
      }

      setAssignments(initialAssignments);

      localStorage.setItem(
        "staff_assignments",
        JSON.stringify(initialAssignments)
      );
    } catch (error) {
      console.error(
        "Unable to load assignments:",
        error
      );

      setAssignments(initialAssignments);
    }
  }, []);

  // ============================================================
  // SAVE
  // ============================================================

  const saveAssignments = (
    items: Assignment[]
  ) => {
    setAssignments(items);

    localStorage.setItem(
      "staff_assignments",
      JSON.stringify(items)
    );
  };

  // ============================================================
  // RESET
  // ============================================================

  const resetForm = () => {
    setForm({
      title: "",
      courseId: "",
      description: "",
      dueDate: "",
      maxMarks: "20",
      status: "draft",
      attachment: null,
    });

    setEditingAssignment(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ============================================================
  // CREATE
  // ============================================================

  const openCreate = () => {
    resetForm();
    setShowCreate(true);
  };

  // ============================================================
  // EDIT
  // ============================================================

  const openEdit = (
    assignment: Assignment
  ) => {
    setEditingAssignment(assignment);

    setForm({
      title: assignment.title,
      courseId: assignment.courseId,
      description: assignment.description,
      dueDate: assignment.dueDate,
      maxMarks: String(
        assignment.maxMarks
      ),
      status: assignment.status,
      attachment:
        assignment.attachment || null,
    });

    setShowCreate(true);
  };

  // ============================================================
  // FILE UPLOAD
  // ============================================================

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    // 10MB limit
    const maxSize =
      10 * 1024 * 1024;

    if (file.size > maxSize) {
      toast.error(
        "File is too large. Maximum size is 10MB."
      );

      event.target.value = "";

      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      toast.error(
        "Unsupported file type. Upload PDF, Word or image files."
      );

      event.target.value = "";

      return;
    }

    const attachment: AssignmentAttachment = {
      name: file.name,
      type: file.type,
      size: file.size,
      url: URL.createObjectURL(file),
    };

    setForm(prev => ({
      ...prev,
      attachment,
    }));

    toast.success(
      "Assignment file attached"
    );
  };

  // ============================================================
  // REMOVE FILE
  // ============================================================

  const removeAttachment = () => {
    setForm(prev => ({
      ...prev,
      attachment: null,
    }));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ============================================================
  // SUBMIT
  // ============================================================

  const handleSubmit = () => {
    if (!form.title.trim()) {
      toast.error(
        "Enter an assignment title"
      );
      return;
    }

    if (!form.courseId) {
      toast.error(
        "Select a course"
      );
      return;
    }

    if (!form.dueDate) {
      toast.error(
        "Select a due date"
      );
      return;
    }

    const marks =
      Number(form.maxMarks);

    if (!marks || marks <= 0) {
      toast.error(
        "Enter a valid maximum mark"
      );
      return;
    }

    const selectedCourse =
      courses.find(
        course =>
          course.id ===
          form.courseId
      );

    if (!selectedCourse) {
      toast.error(
        "Selected course could not be found"
      );
      return;
    }

    // ========================================================
    // UPDATE
    // ========================================================

    if (editingAssignment) {
      const updated =
        assignments.map(
          assignment =>
            assignment.id ===
            editingAssignment.id
              ? {
                  ...assignment,

                  title:
                    form.title.trim(),

                  courseId:
                    selectedCourse.id,

                  courseName:
                    selectedCourse.name,

                  courseCode:
                    selectedCourse.code,

                  description:
                    form.description.trim(),

                  dueDate:
                    form.dueDate,

                  maxMarks:
                    marks,

                  status:
                    form.status,

                  attachment:
                    form.attachment ||
                    undefined,
                }
              : assignment
        );

      saveAssignments(updated);

      toast.success(
        "Assignment updated successfully"
      );
    }

    // ========================================================
    // CREATE
    // ========================================================

    else {
      const newAssignment: Assignment = {
        id:
          crypto.randomUUID(),

        title:
          form.title.trim(),

        courseId:
          selectedCourse.id,

        courseName:
          selectedCourse.name,

        courseCode:
          selectedCourse.code,

        description:
          form.description.trim(),

        dueDate:
          form.dueDate,

        maxMarks:
          marks,

        status:
          form.status,

        submissions:
          0,

        createdAt:
          new Date().toISOString(),

        attachment:
          form.attachment ||
          undefined,
      };

      saveAssignments([
        newAssignment,
        ...assignments,
      ]);

      toast.success(
        "Assignment created successfully"
      );
    }

    resetForm();

    setShowCreate(false);
  };

  // ============================================================
  // DELETE
  // ============================================================

  const deleteAssignment = (
    id: string
  ) => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this assignment?"
      );

    if (!confirmed) {
      return;
    }

    const updated =
      assignments.filter(
        assignment =>
          assignment.id !== id
      );

    saveAssignments(updated);

    toast.success(
      "Assignment deleted"
    );
  };

  // ============================================================
  // CLOSE
  // ============================================================

  const closeAssignment = (
    assignment: Assignment
  ) => {
    const updated =
      assignments.map(
        item =>
          item.id === assignment.id
            ? {
                ...item,
                status:
                  "closed" as AssignmentStatus,
              }
            : item
      );

    saveAssignments(updated);

    toast.success(
      "Assignment closed"
    );
  };

  // ============================================================
  // REFRESH
  // ============================================================

  const refresh = () => {
    setLoading(true);

    setTimeout(() => {
      try {
        const saved =
          localStorage.getItem(
            "staff_assignments"
          );

        if (saved) {
          const parsed =
            JSON.parse(saved);

          if (Array.isArray(parsed)) {
            setAssignments(parsed);
          }
        }
      } catch (error) {
        console.error(error);
      }

      setLoading(false);

      toast.success(
        "Assignments refreshed"
      );
    }, 500);
  };

  // ============================================================
  // FILTER
  // ============================================================

  const filteredAssignments =
    useMemo(() => {
      const query =
        search
          .toLowerCase()
          .trim();

      if (!query) {
        return assignments;
      }

      return assignments.filter(
        assignment =>
          `${assignment.title}
           ${assignment.courseName}
           ${assignment.courseCode}
           ${assignment.status}`
            .toLowerCase()
            .includes(query)
      );
    }, [
      assignments,
      search,
    ]);

  // ============================================================
  // COUNTERS
  // ============================================================

  const publishedCount =
    assignments.filter(
      assignment =>
        assignment.status ===
        "published"
    ).length;

  const draftCount =
    assignments.filter(
      assignment =>
        assignment.status ===
        "draft"
    ).length;

  const totalSubmissions =
    assignments.reduce(
      (total, assignment) =>
        total +
        assignment.submissions,
      0
    );

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="min-h-full space-y-6 p-4 md:p-6">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#006dcc]/10">
              <ClipboardList className="h-5 w-5 text-[#006dcc]" />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Assignments
              </h1>

              <p className="text-sm text-muted-foreground">
                Create, publish and manage assignments for your courses.
              </p>
            </div>

          </div>
        </div>

        <div className="flex flex-wrap gap-2">

          <Button
            variant="outline"
            onClick={refresh}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}

            Refresh
          </Button>

          <Button
            className="bg-[#006dcc] hover:bg-[#005ca8]"
            onClick={openCreate}
          >
            <Plus className="mr-2 h-4 w-4" />

            Create Assignment
          </Button>

        </div>
      </div>

      {/* ======================================================
          SUMMARY
      ====================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>
              Total Assignments
            </CardDescription>

            <CardTitle className="text-2xl">
              {assignments.length}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <ClipboardList className="h-4 w-4" />
              All assignments
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
              Drafts
            </CardDescription>

            <CardTitle className="text-2xl">
              {draftCount}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Clock className="h-4 w-4" />
              Not yet published
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>
              Submissions
            </CardDescription>

            <CardTitle className="text-2xl">
              {totalSubmissions}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Users className="h-4 w-4" />
              Student submissions
            </div>
          </CardContent>
        </Card>

      </div>

      {/* ======================================================
          ASSIGNMENTS
      ====================================================== */}

      <Card>

        <CardHeader>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div>
              <CardTitle>
                My Assignments
              </CardTitle>

              <CardDescription>
                Manage assignments created for your assigned courses.
              </CardDescription>
            </div>

            <div className="relative w-full md:w-80">

              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />

              <Input
                className="pl-9"
                placeholder="Search assignments..."
                value={search}
                onChange={e =>
                  setSearch(
                    e.target.value
                  )
                }
              />

            </div>

          </div>

        </CardHeader>

        <CardContent>

          {filteredAssignments.length === 0 ? (

            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed text-center">

              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">
                <ClipboardList className="h-7 w-7 text-muted-foreground" />
              </div>

              <h3 className="font-semibold">
                No assignments found
              </h3>

              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                Create an assignment for one of your assigned courses.
              </p>

              <Button
                className="mt-4 bg-[#006dcc] hover:bg-[#005ca8]"
                onClick={openCreate}
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Assignment
              </Button>

            </div>

          ) : (

            <div className="space-y-3">

              {filteredAssignments.map(
                assignment => (

                  <div
                    key={assignment.id}
                    className="rounded-xl border p-4 transition hover:bg-muted/40"
                  >

                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

                      {/* LEFT */}

                      <div className="flex min-w-0 gap-4">

                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#006dcc]/10">
                          <ClipboardList className="h-6 w-6 text-[#006dcc]" />
                        </div>

                        <div className="min-w-0">

                          <div className="mb-1 flex flex-wrap items-center gap-2">

                            <h3 className="font-semibold">
                              {assignment.title}
                            </h3>

                            {getStatusBadge(
                              assignment.status
                            )}

                          </div>

                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">

                            <span className="flex items-center gap-1">
                              <BookOpen className="h-3.5 w-3.5" />

                              {assignment.courseCode}
                              {" — "}
                              {assignment.courseName}
                            </span>

                            <span className="flex items-center gap-1">
                              <CalendarDays className="h-3.5 w-3.5" />

                              Due{" "}
                              {formatDate(
                                assignment.dueDate
                              )}
                            </span>

                            <span>
                              {assignment.maxMarks} marks
                            </span>

                            <span>
                              {assignment.submissions} submissions
                            </span>

                          </div>

                          {assignment.attachment && (
                            <div className="mt-2 flex items-center gap-2 text-sm text-[#006dcc]">

                              {getFileIcon(
                                assignment.attachment.type
                              )}

                              <span>
                                {assignment.attachment.name}
                              </span>

                              <span className="text-xs text-muted-foreground">
                                (
                                {formatFileSize(
                                  assignment.attachment.size
                                )}
                                )
                              </span>

                            </div>
                          )}

                          {assignment.description && (
                            <p className="mt-2 line-clamp-1 text-sm text-muted-foreground">
                              {assignment.description}
                            </p>
                          )}

                        </div>
                      </div>

                      {/* ACTIONS */}

                      <div className="flex flex-wrap items-center gap-2">

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedAssignment(
                              assignment
                            );

                            setShowView(true);
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            openEdit(
                              assignment
                            )
                          }
                        >
                          <Pencil className="mr-2 h-4 w-4" />
                          Edit
                        </Button>

                        {assignment.status ===
                          "published" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              closeAssignment(
                                assignment
                              )
                            }
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Close
                          </Button>
                        )}

                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() =>
                            deleteAssignment(
                              assignment.id
                            )
                          }
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>

                      </div>

                    </div>

                  </div>
                )
              )}

            </div>
          )}

        </CardContent>
      </Card>

      {/* ======================================================
          CREATE / EDIT
      ====================================================== */}

      <Dialog
        open={showCreate}
        onOpenChange={open => {

          setShowCreate(open);

          if (!open) {
            resetForm();
          }

        }}
      >

        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[650px]">

          <DialogHeader>

            <DialogTitle>
              {editingAssignment
                ? "Edit Assignment"
                : "Create Assignment"}
            </DialogTitle>

            <DialogDescription>
              {editingAssignment
                ? "Update the assignment details and attachment."
                : "Create an assignment for one of your assigned courses."}
            </DialogDescription>

          </DialogHeader>

          <div className="space-y-5 py-3">

            {/* TITLE */}

            <div className="space-y-2">

              <Label>
                Assignment Title
              </Label>

              <Input
                placeholder="e.g. Logic Gates Assignment"
                value={form.title}
                onChange={e =>
                  setForm({
                    ...form,
                    title:
                      e.target.value,
                  })
                }
              />

            </div>

            {/* COURSE */}

            <div className="space-y-2">

              <Label>
                Course
              </Label>

              <Select
                value={
                  form.courseId
                }
                onValueChange={value =>
                  setForm({
                    ...form,
                    courseId:
                      value,
                  })
                }
              >

                <SelectTrigger>
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>

                <SelectContent>

                  {courses.map(
                    course => (
                      <SelectItem
                        key={course.id}
                        value={course.id}
                      >
                        {course.code}
                        {" — "}
                        {course.name}
                      </SelectItem>
                    )
                  )}

                </SelectContent>

              </Select>

            </div>

            {/* INSTRUCTIONS */}

            <div className="space-y-2">

              <Label>
                Instructions
              </Label>

              <Textarea
                placeholder="Enter assignment instructions..."
                value={
                  form.description
                }
                onChange={e =>
                  setForm({
                    ...form,
                    description:
                      e.target.value,
                  })
                }
                className="min-h-[120px]"
              />

            </div>

            {/* ATTACHMENT */}

            <div className="space-y-2">

              <Label>
                Assignment Attachment
              </Label>

              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp"
                onChange={
                  handleFileChange
                }
              />

              {!form.attachment ? (

                <button
                  type="button"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  className="flex w-full flex-col items-center justify-center rounded-lg border border-dashed p-6 text-center transition hover:bg-muted/40"
                >

                  <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#006dcc]/10">

                    <Upload className="h-6 w-6 text-[#006dcc]" />

                  </div>

                  <p className="font-medium">
                    Upload assignment file
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    PDF, Word document or image
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Maximum file size: 10MB
                  </p>

                </button>

              ) : (

                <div className="flex items-center justify-between rounded-lg border p-4">

                  <div className="flex min-w-0 items-center gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#006dcc]/10">

                      {getFileIcon(
                        form.attachment.type
                      )}

                    </div>

                    <div className="min-w-0">

                      <p className="truncate text-sm font-medium">
                        {form.attachment.name}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(
                          form.attachment.size
                        )}
                      </p>

                    </div>

                  </div>

                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={
                      removeAttachment
                    }
                  >
                    <X className="h-4 w-4" />
                  </Button>

                </div>
              )}

              <p className="text-xs text-muted-foreground">
                Students will be able to access this attachment when the assignment is published.
              </p>

            </div>

            {/* DATE + MARKS */}

            <div className="grid gap-4 sm:grid-cols-2">

              <div className="space-y-2">

                <Label>
                  Due Date & Time
                </Label>

                <Input
                  type="datetime-local"
                  value={
                    form.dueDate
                  }
                  onChange={e =>
                    setForm({
                      ...form,
                      dueDate:
                        e.target.value,
                    })
                  }
                />

              </div>

              <div className="space-y-2">

                <Label>
                  Maximum Marks
                </Label>

                <Input
                  type="number"
                  min="1"
                  value={
                    form.maxMarks
                  }
                  onChange={e =>
                    setForm({
                      ...form,
                      maxMarks:
                        e.target.value,
                    })
                  }
                />

              </div>

            </div>

            {/* STATUS */}

            <div className="space-y-2">

              <Label>
                Assignment Status
              </Label>

              <Select
                value={
                  form.status
                }
                onValueChange={value =>
                  setForm({
                    ...form,
                    status:
                      value as AssignmentStatus,
                  })
                }
              >

                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>

                <SelectContent>

                  <SelectItem value="draft">
                    Draft
                  </SelectItem>

                  <SelectItem value="published">
                    Published
                  </SelectItem>

                  <SelectItem value="closed">
                    Closed
                  </SelectItem>

                </SelectContent>

              </Select>

              <p className="text-xs text-muted-foreground">
                Published assignments will be available to students.
              </p>

            </div>

          </div>

          <DialogFooter>

            <Button
              variant="outline"
              onClick={() => {
                setShowCreate(false);
                resetForm();
              }}
            >
              Cancel
            </Button>

            <Button
              className="bg-[#006dcc] hover:bg-[#005ca8]"
              onClick={handleSubmit}
            >

              <ClipboardList className="mr-2 h-4 w-4" />

              {editingAssignment
                ? "Save Changes"
                : "Create Assignment"}

            </Button>

          </DialogFooter>

        </DialogContent>

      </Dialog>

      {/* ======================================================
          VIEW ASSIGNMENT
      ====================================================== */}

      <Dialog
        open={showView}
        onOpenChange={
          setShowView
        }
      >

        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[650px]">

          {selectedAssignment && (
            <>

              <DialogHeader>

                <div className="flex flex-wrap items-center gap-2">

                  <DialogTitle>
                    {selectedAssignment.title}
                  </DialogTitle>

                  {getStatusBadge(
                    selectedAssignment.status
                  )}

                </div>

                <DialogDescription>

                  {selectedAssignment.courseCode}
                  {" — "}
                  {selectedAssignment.courseName}

                </DialogDescription>

              </DialogHeader>

              <div className="space-y-5">

                {/* COURSE */}

                <div className="rounded-lg border p-4">

                  <div className="flex items-center gap-3">

                    <BookOpen className="h-5 w-5 text-[#006dcc]" />

                    <div>

                      <p className="text-sm font-medium">
                        Course
                      </p>

                      <p className="text-sm text-muted-foreground">

                        {selectedAssignment.courseCode}
                        {" — "}
                        {selectedAssignment.courseName}

                      </p>

                    </div>

                  </div>

                </div>

                {/* INSTRUCTIONS */}

                <div>

                  <p className="mb-2 text-sm font-medium">
                    Assignment Instructions
                  </p>

                  <div className="rounded-lg border bg-muted/30 p-4 text-sm leading-6">

                    {selectedAssignment.description ||
                      "No instructions provided."}

                  </div>

                </div>

                {/* ATTACHMENT */}

                {selectedAssignment.attachment && (

                  <div>

                    <p className="mb-2 text-sm font-medium">
                      Assignment Attachment
                    </p>

                    <div className="flex items-center justify-between rounded-lg border p-4">

                      <div className="flex min-w-0 items-center gap-3">

                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-[#006dcc]/10">

                          {getFileIcon(
                            selectedAssignment
                              .attachment.type
                          )}

                        </div>

                        <div className="min-w-0">

                          <p className="truncate font-medium">

                            {
                              selectedAssignment
                                .attachment
                                .name
                            }

                          </p>

                          <p className="text-xs text-muted-foreground">

                            {formatFileSize(
                              selectedAssignment
                                .attachment
                                .size
                            )}

                          </p>

                        </div>

                      </div>

                      {selectedAssignment.attachment.url && (

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            window.open(
                              selectedAssignment
                                ?.attachment
                                ?.url,
                              "_blank"
                            )
                          }
                        >

                          <Download className="mr-2 h-4 w-4" />

                          Open

                        </Button>

                      )}

                    </div>

                  </div>
                )}

                {/* DETAILS */}

                <div className="grid gap-3 sm:grid-cols-3">

                  <div className="rounded-lg border p-4">

                    <p className="text-xs text-muted-foreground">
                      Maximum Marks
                    </p>

                    <p className="mt-1 text-lg font-semibold">
                      {selectedAssignment.maxMarks}
                    </p>

                  </div>

                  <div className="rounded-lg border p-4">

                    <p className="text-xs text-muted-foreground">
                      Submissions
                    </p>

                    <p className="mt-1 text-lg font-semibold">
                      {selectedAssignment.submissions}
                    </p>

                  </div>

                  <div className="rounded-lg border p-4">

                    <p className="text-xs text-muted-foreground">
                      Due Date
                    </p>

                    <p className="mt-1 text-sm font-semibold">
                      {formatDate(
                        selectedAssignment.dueDate
                      )}
                    </p>

                  </div>

                </div>

              </div>

              <DialogFooter>

                <Button
                  variant="outline"
                  onClick={() =>
                    setShowView(false)
                  }
                >
                  Close
                </Button>

                <Button
                  className="bg-[#006dcc] hover:bg-[#005ca8]"
                  onClick={() => {

                    setShowView(false);

                    openEdit(
                      selectedAssignment
                    );

                  }}
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