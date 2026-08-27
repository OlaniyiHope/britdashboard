import { useMemo, useState } from "react";
import {
  Search,
  Filter,
  Eye,
  ClipboardList,
  Users,
  CheckCircle2,
  Clock3,
  AlertTriangle,
  X,
  CalendarDays,
  BookOpen,
  User,
  ChevronLeft,
  ChevronRight,
  Download,
  MoreHorizontal,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type AssignmentStatus =
  | "Active"
  | "Upcoming"
  | "Closed"
  | "Grading";

interface Assignment {
  id: string;
  title: string;
  courseCode: string;
  course: string;
  lecturer: string;
  department: string;
  submissions: number;
  expectedSubmissions: number;
  graded: number;
  dueDate: string;
  status: AssignmentStatus;
  created: string;
}

const assignments: Assignment[] = [
  {
    id: "1",
    title: "Data Structures & Algorithms Assignment",
    courseCode: "CSC 201",
    course: "Data Structures & Algorithms",
    lecturer: "Dr. Michael Mensah",
    department: "Computing & Technology",
    submissions: 42,
    expectedSubmissions: 58,
    graded: 30,
    dueDate: "30 Aug 2026",
    status: "Active",
    created: "20 Aug 2026",
  },
  {
    id: "2",
    title: "Business Management Case Study",
    courseCode: "BUS 204",
    course: "Business Management",
    lecturer: "Mrs. Sarah Williams",
    department: "Business Studies",
    submissions: 51,
    expectedSubmissions: 55,
    graded: 48,
    dueDate: "28 Aug 2026",
    status: "Grading",
    created: "18 Aug 2026",
  },
  {
    id: "3",
    title: "Engineering Mechanics Project",
    courseCode: "MEC 202",
    course: "Engineering Mechanics",
    lecturer: "Engr. David Johnson",
    department: "Engineering",
    submissions: 35,
    expectedSubmissions: 60,
    graded: 12,
    dueDate: "02 Sep 2026",
    status: "Active",
    created: "22 Aug 2026",
  },
  {
    id: "4",
    title: "Introduction to Accounting",
    courseCode: "ACC 101",
    course: "Financial Accounting",
    lecturer: "Mr. Daniel Okoro",
    department: "Business Studies",
    submissions: 68,
    expectedSubmissions: 70,
    graded: 68,
    dueDate: "20 Aug 2026",
    status: "Closed",
    created: "10 Aug 2026",
  },
  {
    id: "5",
    title: "Computer Networks Research",
    courseCode: "CSC 305",
    course: "Computer Networks",
    lecturer: "Dr. Esther Adams",
    department: "Computing & Technology",
    submissions: 0,
    expectedSubmissions: 45,
    graded: 0,
    dueDate: "05 Sep 2026",
    status: "Upcoming",
    created: "25 Aug 2026",
  },
  {
    id: "6",
    title: "Structural Design Report",
    courseCode: "CVE 401",
    course: "Structural Engineering",
    lecturer: "Engr. Samuel Okoro",
    department: "Engineering",
    submissions: 49,
    expectedSubmissions: 52,
    graded: 35,
    dueDate: "25 Aug 2026",
    status: "Grading",
    created: "12 Aug 2026",
  },
];

function StatusBadge({
  status,
}: {
  status: AssignmentStatus;
}) {
  const styles: Record<AssignmentStatus, string> = {
    Active:
      "bg-emerald-50 text-emerald-700 border-emerald-200",
    Upcoming:
      "bg-blue-50 text-blue-700 border-blue-200",
    Closed:
      "bg-slate-100 text-slate-600 border-slate-200",
    Grading:
      "bg-amber-50 text-amber-700 border-amber-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold ${styles[status]}`}
    >
      {status}
    </span>
  );
}

export default function Assignments() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] =
    useState("All");

  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);

  const totalAssignments = assignments.length;

  const totalSubmitted = assignments.reduce(
    (sum, assignment) => sum + assignment.submissions,
    0
  );

  const totalExpected = assignments.reduce(
    (sum, assignment) =>
      sum + assignment.expectedSubmissions,
    0
  );

  const totalGraded = assignments.reduce(
    (sum, assignment) => sum + assignment.graded,
    0
  );

  const pendingGrading = totalSubmitted - totalGraded;

  const lateAssignments = assignments.filter(
    (assignment) => assignment.status === "Closed"
  ).length;

  const departments = useMemo(() => {
    return Array.from(
      new Set(assignments.map((assignment) => assignment.department))
    );
  }, []);

  const filteredAssignments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return assignments.filter((assignment) => {
      const matchesSearch =
        !query ||
        assignment.title.toLowerCase().includes(query) ||
        assignment.course.toLowerCase().includes(query) ||
        assignment.courseCode.toLowerCase().includes(query) ||
        assignment.lecturer.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        assignment.status === statusFilter;

      const matchesDepartment =
        departmentFilter === "All" ||
        assignment.department === departmentFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesDepartment
      );
    });
  }, [search, statusFilter, departmentFilter]);

  const handleExport = () => {
    const headers = [
      "Assignment",
      "Course Code",
      "Course",
      "Lecturer",
      "Department",
      "Submissions",
      "Expected",
      "Graded",
      "Due Date",
      "Status",
    ];

    const rows = filteredAssignments.map((assignment) => [
      assignment.title,
      assignment.courseCode,
      assignment.course,
      assignment.lecturer,
      assignment.department,
      assignment.submissions,
      assignment.expectedSubmissions,
      assignment.graded,
      assignment.dueDate,
      assignment.status,
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((value) =>
            `"${String(value).replace(/"/g, '""')}"`
          )
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "assignment-oversight.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-full space-y-6 bg-slate-50 p-4 md:p-6">

      {/* HEADER */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#081022] text-white">
            <ClipboardList className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-[#081022] md:text-2xl">
              Assignment Oversight
            </h1>

            <p className="mt-1 text-xs text-slate-500">
              Monitor assignments, submissions, deadlines and
              grading progress across the institution.
            </p>
          </div>

        </div>

        <Button
          variant="outline"
          onClick={handleExport}
          className="w-full gap-2 border-slate-300 bg-white sm:w-auto"
        >
          <Download className="h-4 w-4" />
          Export Report
        </Button>

      </div>

      {/* STATISTICS */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-5">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-medium text-slate-500">
                  Assignments
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {totalAssignments}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Across all courses
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <ClipboardList className="h-5 w-5" />
              </div>

            </div>

          </CardContent>
        </Card>

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-5">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-medium text-slate-500">
                  Submitted
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {totalSubmitted}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Of {totalExpected} expected submissions
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <CheckCircle2 className="h-5 w-5" />
              </div>

            </div>

          </CardContent>
        </Card>

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-5">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-medium text-slate-500">
                  Pending Grading
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {pendingGrading}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Submitted but not graded
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <Clock3 className="h-5 w-5" />
              </div>

            </div>

          </CardContent>
        </Card>

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-5">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-medium text-slate-500">
                  Closed / Late
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {lateAssignments}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Assignments past their active period
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-700">
                <AlertTriangle className="h-5 w-5" />
              </div>

            </div>

          </CardContent>
        </Card>

      </div>

      {/* SEARCH + FILTER */}

      <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

        <CardContent className="p-4">

          <div className="flex flex-col gap-3 lg:flex-row">

            <div className="relative flex-1">

              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search assignment, course, course code or lecturer..."
                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-[#006dcc] focus:bg-white focus:ring-2 focus:ring-blue-100"
              />

            </div>

            <div className="flex items-center gap-2">

              <Filter className="h-4 w-4 text-slate-400" />

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#006dcc]"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Grading">Grading</option>
                <option value="Closed">Closed</option>
              </select>

            </div>

            <select
              value={departmentFilter}
              onChange={(event) =>
                setDepartmentFilter(event.target.value)
              }
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#006dcc]"
            >
              <option value="All">All Departments</option>

              {departments.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>

          </div>

        </CardContent>

      </Card>

      {/* TABLE */}

      <Card className="overflow-hidden border-none bg-white shadow-sm ring-1 ring-slate-200">

        <div className="border-b border-slate-200 px-5 py-4">

          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h2 className="text-sm font-bold text-[#081022]">
                Assignment Records
              </h2>

              <p className="text-xs text-slate-500">
                {filteredAssignments.length} assignment
                {filteredAssignments.length !== 1
                  ? "s"
                  : ""}{" "}
                displayed
              </p>
            </div>

            {(search ||
              statusFilter !== "All" ||
              departmentFilter !== "All") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("All");
                  setDepartmentFilter("All");
                }}
                className="flex items-center gap-1 text-xs font-semibold text-[#006dcc] hover:underline"
              >
                <X className="h-3 w-3" />
                Clear filters
              </button>
            )}

          </div>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1150px]">

            <thead className="bg-slate-50">

              <tr className="border-b border-slate-200">

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Assignment
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Course
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Lecturer
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Submissions
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Grading
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Due Date
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Status
                </th>

                <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Action
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-slate-100">

              {filteredAssignments.length === 0 ? (

                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-16 text-center"
                  >
                    <ClipboardList className="mx-auto h-8 w-8 text-slate-300" />

                    <p className="mt-3 text-sm font-semibold text-slate-500">
                      No assignments found
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Try changing your search or filters.
                    </p>
                  </td>
                </tr>

              ) : (

                filteredAssignments.map((assignment) => {

                  const submissionPercentage =
                    assignment.expectedSubmissions > 0
                      ? Math.round(
                          (assignment.submissions /
                            assignment.expectedSubmissions) *
                            100
                        )
                      : 0;

                  const gradingPercentage =
                    assignment.submissions > 0
                      ? Math.round(
                          (assignment.graded /
                            assignment.submissions) *
                            100
                        )
                      : 0;

                  return (
                    <tr
                      key={assignment.id}
                      className="transition hover:bg-slate-50"
                    >

                      {/* Assignment */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                            <ClipboardList className="h-4 w-4" />
                          </div>

                          <div className="min-w-0">

                            <p className="max-w-[250px] truncate text-sm font-bold text-[#081022]">
                              {assignment.title}
                            </p>

                            <p className="mt-1 text-[11px] text-slate-400">
                              Created {assignment.created}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* Course */}

                      <td className="px-5 py-4">

                        <p className="text-xs font-bold text-[#081022]">
                          {assignment.courseCode}
                        </p>

                        <p className="mt-1 text-[11px] text-slate-500">
                          {assignment.course}
                        </p>

                      </td>

                      {/* Lecturer */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2">

                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                            <User className="h-3.5 w-3.5" />
                          </div>

                          <span className="text-xs font-semibold text-slate-700">
                            {assignment.lecturer}
                          </span>

                        </div>

                      </td>

                      {/* Submissions */}

                      <td className="px-5 py-4">

                        <div className="w-[130px]">

                          <div className="mb-1 flex justify-between text-[10px]">

                            <span className="font-semibold text-slate-700">
                              {assignment.submissions}/
                              {assignment.expectedSubmissions}
                            </span>

                            <span className="text-slate-400">
                              {submissionPercentage}%
                            </span>

                          </div>

                          <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">

                            <div
                              className="h-full rounded-full bg-[#006dcc]"
                              style={{
                                width: `${submissionPercentage}%`,
                              }}
                            />

                          </div>

                        </div>

                      </td>

                      {/* Grading */}

                      <td className="px-5 py-4">

                        <div className="w-[120px]">

                          <div className="mb-1 flex justify-between text-[10px]">

                            <span className="font-semibold text-slate-700">
                              {assignment.graded}
                            </span>

                            <span className="text-slate-400">
                              {gradingPercentage}%
                            </span>

                          </div>

                          <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">

                            <div
                              className="h-full rounded-full bg-emerald-500"
                              style={{
                                width: `${gradingPercentage}%`,
                              }}
                            />

                          </div>

                        </div>

                      </td>

                      {/* Due Date */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2">

                          <CalendarDays className="h-3.5 w-3.5 text-slate-400" />

                          <span className="text-xs font-semibold text-slate-700">
                            {assignment.dueDate}
                          </span>

                        </div>

                      </td>

                      {/* Status */}

                      <td className="px-5 py-4">
                        <StatusBadge status={assignment.status} />
                      </td>

                      {/* Actions */}

                      <td className="px-5 py-4">

                        <div className="flex justify-end gap-2">

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setSelectedAssignment(
                                assignment
                              )
                            }
                            className="h-8 gap-1.5 border-slate-200 text-xs"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View
                          </Button>

                          <button
                            type="button"
                            className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </button>

                        </div>

                      </td>

                    </tr>
                  );
                })

              )}

            </tbody>

          </table>

        </div>

        {/* PAGINATION */}

        <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3">

          <p className="text-xs text-slate-500">
            Showing{" "}
            <strong className="text-slate-700">
              {filteredAssignments.length}
            </strong>{" "}
            of{" "}
            <strong className="text-slate-700">
              {totalAssignments}
            </strong>{" "}
            assignments
          </p>

          <div className="flex items-center gap-1">

            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-400"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <button
              type="button"
              className="flex h-8 min-w-8 items-center justify-center rounded-md bg-[#081022] px-2 text-xs font-bold text-white"
            >
              1
            </button>

            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-400"
            >
              <ChevronRight className="h-4 w-4" />
            </button>

          </div>

        </div>

      </Card>

      {/* DETAILS MODAL */}

      {selectedAssignment && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* Modal Header */}

            <div className="flex items-start justify-between bg-[#081022] p-6 text-white">

              <div className="flex items-start gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                  <ClipboardList className="h-6 w-6" />
                </div>

                <div>

                  <p className="text-lg font-bold">
                    {selectedAssignment.title}
                  </p>

                  <p className="mt-1 text-xs text-slate-300">
                    {selectedAssignment.courseCode} ·{" "}
                    {selectedAssignment.course}
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedAssignment(null)
                }
                className="rounded-lg p-2 text-slate-300 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

            </div>

            {/* Modal Body */}

            <div className="space-y-5 p-6">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Assignment Status
                  </p>

                  <div className="mt-2">
                    <StatusBadge
                      status={selectedAssignment.status}
                    />
                  </div>

                </div>

                <div className="text-right">

                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Due Date
                  </p>

                  <p className="mt-1 text-sm font-bold text-[#081022]">
                    {selectedAssignment.dueDate}
                  </p>

                </div>

              </div>

              {/* Information */}

              <div className="grid gap-4 sm:grid-cols-2">

                <div className="rounded-xl bg-slate-50 p-4">

                  <div className="flex items-center gap-2">

                    <BookOpen className="h-4 w-4 text-slate-400" />

                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Course
                    </p>

                  </div>

                  <p className="mt-2 text-sm font-bold text-[#081022]">
                    {selectedAssignment.course}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {selectedAssignment.courseCode}
                  </p>

                </div>

                <div className="rounded-xl bg-slate-50 p-4">

                  <div className="flex items-center gap-2">

                    <User className="h-4 w-4 text-slate-400" />

                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Lecturer
                    </p>

                  </div>

                  <p className="mt-2 text-sm font-bold text-[#081022]">
                    {selectedAssignment.lecturer}
                  </p>

                </div>

                <div className="rounded-xl bg-slate-50 p-4">

                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Submissions
                  </p>

                  <p className="mt-2 text-xl font-black text-[#081022]">
                    {selectedAssignment.submissions}
                    <span className="text-sm font-medium text-slate-400">
                      {" "}
                      /{" "}
                      {selectedAssignment.expectedSubmissions}
                    </span>
                  </p>

                </div>

                <div className="rounded-xl bg-slate-50 p-4">

                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Graded
                  </p>

                  <p className="mt-2 text-xl font-black text-[#081022]">
                    {selectedAssignment.graded}
                    <span className="text-sm font-medium text-slate-400">
                      {" "}
                      /{" "}
                      {selectedAssignment.submissions}
                    </span>
                  </p>

                </div>

              </div>

              {/* Progress */}

              <div>

                <div className="mb-2 flex justify-between">

                  <p className="text-xs font-bold text-slate-700">
                    Grading Progress
                  </p>

                  <p className="text-xs font-bold text-[#006dcc]">
                    {selectedAssignment.submissions > 0
                      ? Math.round(
                          (selectedAssignment.graded /
                            selectedAssignment.submissions) *
                            100
                        )
                      : 0}
                    %
                  </p>

                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                  <div
                    className="h-full rounded-full bg-[#006dcc]"
                    style={{
                      width: `${
                        selectedAssignment.submissions > 0
                          ? Math.round(
                              (selectedAssignment.graded /
                                selectedAssignment.submissions) *
                                100
                            )
                          : 0
                      }%`,
                    }}
                  />

                </div>

              </div>

              {/* Department */}

              <div className="border-t border-slate-200 pt-4">

                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Department
                </p>

                <p className="mt-2 text-sm font-semibold text-slate-700">
                  {selectedAssignment.department}
                </p>

              </div>

            </div>

            {/* Footer */}

            <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-6 py-4">

              <Button
                variant="outline"
                onClick={() =>
                  setSelectedAssignment(null)
                }
              >
                Close
              </Button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}