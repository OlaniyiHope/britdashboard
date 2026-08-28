import { useMemo, useState } from "react";
import {
  Search,
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
  FileText,
  Image as ImageIcon,
  ExternalLink,
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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { toast } from "sonner";


// ============================================================
// TYPES
// ============================================================

type AssignmentStatus =
  | "draft"
  | "published"
  | "closed";

type AssignmentAttachment = {
  name: string;
  url: string;
  type: string;
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

  attachment?: AssignmentAttachment | null;
};


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


function getAttachmentIcon(type?: string) {
  if (!type) {
    return <FileText className="h-5 w-5" />;
  }

  if (type.startsWith("image/")) {
    return <ImageIcon className="h-5 w-5" />;
  }

  return <FileText className="h-5 w-5" />;
}


// ============================================================
// COMPONENT
// ============================================================

export default function AllAssignments() {

  // ============================================================
  // STATE
  // ============================================================

  const [assignments, setAssignments] =
    useState<Assignment[]>(() => {

      try {
        const saved =
          localStorage.getItem(
            "staff_assignments"
          );

        if (saved) {
          const parsed = JSON.parse(saved);

          if (Array.isArray(parsed)) {
            return parsed;
          }
        }

      } catch (error) {
        console.error(
          "Unable to load assignments:",
          error
        );
      }

      return [];
    });


  const [search, setSearch] =
    useState("");


  const [statusFilter, setStatusFilter] =
    useState("all");


  const [courseFilter, setCourseFilter] =
    useState("all");


  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);


  const [showView, setShowView] =
    useState(false);


  // ============================================================
  // COURSES
  // ============================================================

  const courses = useMemo(() => {

    const uniqueCourses =
      assignments.reduce<
        {
          id: string;
          name: string;
          code: string;
        }[]
      >((result, assignment) => {

        const exists =
          result.some(
            course =>
              course.id ===
              assignment.courseId
          );

        if (!exists) {

          result.push({
            id: assignment.courseId,
            name: assignment.courseName,
            code: assignment.courseCode,
          });

        }

        return result;

      }, []);

    return uniqueCourses;

  }, [assignments]);


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
  // REFRESH
  // ============================================================

  const refresh = () => {

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

          toast.success(
            "Assignments refreshed"
          );

          return;
        }

      }

      setAssignments([]);

      toast.success(
        "Assignments refreshed"
      );

    } catch (error) {

      console.error(error);

      toast.error(
        "Unable to refresh assignments"
      );

    }

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

      return assignments.filter(
        assignment => {

          const matchesSearch =
            !query ||
            `${assignment.title}
             ${assignment.courseName}
             ${assignment.courseCode}
             ${assignment.description}
             ${assignment.status}
             ${assignment.attachment?.name || ""}`
              .toLowerCase()
              .includes(query);


          const matchesStatus =
            statusFilter === "all" ||
            assignment.status ===
              statusFilter;


          const matchesCourse =
            courseFilter === "all" ||
            assignment.courseId ===
              courseFilter;


          return (
            matchesSearch &&
            matchesStatus &&
            matchesCourse
          );

        }
      );

    }, [
      assignments,
      search,
      statusFilter,
      courseFilter,
    ]);


  // ============================================================
  // COUNTERS
  // ============================================================

  const totalAssignments =
    assignments.length;


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


  const closedCount =
    assignments.filter(
      assignment =>
        assignment.status ===
        "closed"
    ).length;


  const totalSubmissions =
    assignments.reduce(
      (total, assignment) =>
        total +
        (assignment.submissions || 0),
      0
    );


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


    if (
      selectedAssignment?.id === id
    ) {

      setSelectedAssignment(null);
      setShowView(false);

    }

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


    setSelectedAssignment({
      ...assignment,
      status: "closed",
    });


    toast.success(
      "Assignment closed"
    );

  };


  // ============================================================
  // OPEN VIEW
  // ============================================================

  const openView = (
    assignment: Assignment
  ) => {

    setSelectedAssignment(
      assignment
    );

    setShowView(true);

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

        <div>

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#006dcc]/10">

              <ClipboardList className="h-5 w-5 text-[#006dcc]" />

            </div>

            <div>

              <h1 className="text-2xl font-bold tracking-tight">
                All Assignments
              </h1>

              <p className="text-sm text-muted-foreground">
                View and manage assignments across your assigned courses.
              </p>

            </div>

          </div>

        </div>


        <Button
          variant="outline"
          onClick={refresh}
        >

          <RefreshCw className="mr-2 h-4 w-4" />

          Refresh

        </Button>

      </div>


      {/* ====================================================== */}
      {/* SUMMARY CARDS */}
      {/* ====================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">

        <Card>

          <CardHeader className="pb-2">

            <CardDescription>
              Total Assignments
            </CardDescription>

            <CardTitle className="text-2xl">
              {totalAssignments}
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

              Not published

            </div>

          </CardContent>

        </Card>


        <Card>

          <CardHeader className="pb-2">

            <CardDescription>
              Closed
            </CardDescription>

            <CardTitle className="text-2xl">
              {closedCount}
            </CardTitle>

          </CardHeader>

          <CardContent>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">

              <XCircle className="h-4 w-4" />

              No longer active

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


      {/* ====================================================== */}
      {/* FILTERS */}
      {/* ====================================================== */}

      <Card>

        <CardHeader>

          <CardTitle>
            Assignment Library
          </CardTitle>

          <CardDescription>
            Search and filter assignments created for your courses.
          </CardDescription>

        </CardHeader>


        <CardContent>

          <div className="flex flex-col gap-3 lg:flex-row">

            {/* SEARCH */}

            <div className="relative flex-1">

              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />

              <Input
                className="pl-9"
                placeholder="Search by assignment, course or attachment..."
                value={search}
                onChange={e =>
                  setSearch(
                    e.target.value
                  )
                }
              />

            </div>


            {/* STATUS */}

            <Select
              value={statusFilter}
              onValueChange={
                setStatusFilter
              }
            >

              <SelectTrigger className="w-full lg:w-[180px]">

                <SelectValue placeholder="Status" />

              </SelectTrigger>

              <SelectContent>

                <SelectItem value="all">
                  All Statuses
                </SelectItem>

                <SelectItem value="published">
                  Published
                </SelectItem>

                <SelectItem value="draft">
                  Draft
                </SelectItem>

                <SelectItem value="closed">
                  Closed
                </SelectItem>

              </SelectContent>

            </Select>


            {/* COURSE */}

            <Select
              value={courseFilter}
              onValueChange={
                setCourseFilter
              }
            >

              <SelectTrigger className="w-full lg:w-[240px]">

                <SelectValue placeholder="Course" />

              </SelectTrigger>

              <SelectContent>

                <SelectItem value="all">
                  All Courses
                </SelectItem>

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

        </CardContent>

      </Card>


      {/* ====================================================== */}
      {/* ASSIGNMENT LIST */}
      {/* ====================================================== */}

      <Card>

        <CardHeader>

          <CardTitle>
            Assignments
          </CardTitle>

          <CardDescription>
            {filteredAssignments.length} assignment
            {filteredAssignments.length === 1
              ? ""
              : "s"} found.
          </CardDescription>

        </CardHeader>


        <CardContent>

          {filteredAssignments.length ===
          0 ? (

            <div className="flex min-h-[320px] flex-col items-center justify-center rounded-lg border border-dashed text-center">

              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">

                <ClipboardList className="h-7 w-7 text-muted-foreground" />

              </div>

              <h3 className="font-semibold">
                No assignments found
              </h3>

              <p className="mt-1 max-w-md text-sm text-muted-foreground">

                Try changing your search or filters.

              </p>

            </div>

          ) : (

            <div className="space-y-3">

              {filteredAssignments.map(
                assignment => (

                  <div
                    key={assignment.id}
                    className="rounded-xl border p-4 transition hover:bg-muted/40"
                  >

                    <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

                      {/* ================================================= */}
                      {/* ASSIGNMENT INFO */}
                      {/* ================================================= */}

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


                          {/* COURSE */}

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


                            <span className="flex items-center gap-1">

                              <Users className="h-3.5 w-3.5" />

                              {assignment.submissions || 0}
                              {" "}
                              submissions

                            </span>

                          </div>


                          {/* DESCRIPTION */}

                          {assignment.description && (

                            <p className="mt-2 line-clamp-2 max-w-3xl text-sm text-muted-foreground">

                              {assignment.description}

                            </p>

                          )}


                          {/* ATTACHMENT */}

                          {assignment.attachment && (

                            <div className="mt-3 inline-flex items-center gap-2 rounded-md border bg-muted/30 px-3 py-2 text-sm">

                              {getAttachmentIcon(
                                assignment
                                  .attachment
                                  .type
                              )}

                              <span className="max-w-[250px] truncate">

                                {
                                  assignment
                                    .attachment
                                    .name
                                }

                              </span>

                              <Badge
                                variant="outline"
                                className="text-xs"
                              >

                                Attachment

                              </Badge>

                            </div>

                          )}

                        </div>

                      </div>


                      {/* ================================================= */}
                      {/* ACTIONS */}
                      {/* ================================================= */}

                      <div className="flex shrink-0 flex-wrap items-center gap-2">

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            openView(
                              assignment
                            )
                          }
                        >

                          <Eye className="mr-2 h-4 w-4" />

                          View

                        </Button>


                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {

                            window.location.href =
                              `/staff/dashboard/studio/assignments/create?edit=${assignment.id}`;

                          }}
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


      {/* ====================================================== */}
      {/* VIEW ASSIGNMENT DIALOG */}
      {/* ====================================================== */}

      <Dialog
        open={showView}
        onOpenChange={
          setShowView
        }
      >

        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[700px]">

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

                  <div className="rounded-lg border bg-muted/30 p-4 text-sm leading-6 whitespace-pre-wrap">

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


                    <div className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">

                      <div className="flex min-w-0 items-center gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted">

                          {getAttachmentIcon(
                            selectedAssignment
                              .attachment
                              .type
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

                            {
                              selectedAssignment
                                .attachment
                                .type
                            }

                          </p>

                        </div>

                      </div>


                      <Button
                        variant="outline"
                        onClick={() =>
                          window.open(
                            selectedAssignment
                              ?.attachment
                              ?.url,
                            "_blank",
                            "noopener,noreferrer"
                          )
                        }
                      >

                        <ExternalLink className="mr-2 h-4 w-4" />

                        Open Attachment

                      </Button>

                    </div>

                  </div>

                )}


                {/* DETAILS */}

                <div className="grid gap-3 sm:grid-cols-4">

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

                      {selectedAssignment.submissions || 0}

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


                  <div className="rounded-lg border p-4">

                    <p className="text-xs text-muted-foreground">

                      Created

                    </p>

                    <p className="mt-1 text-sm font-semibold">

                      {formatDate(
                        selectedAssignment.createdAt
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


                {selectedAssignment.status ===
                  "published" && (

                  <Button
                    variant="outline"
                    onClick={() =>
                      closeAssignment(
                        selectedAssignment
                      )
                    }
                  >

                    <XCircle className="mr-2 h-4 w-4" />

                    Close Assignment

                  </Button>

                )}


                <Button
                  className="bg-[#006dcc] hover:bg-[#005ca8]"
                  onClick={() => {

                    window.location.href =
                      `/staff/dashboard/studio/assignments/create?edit=${selectedAssignment.id}`;

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