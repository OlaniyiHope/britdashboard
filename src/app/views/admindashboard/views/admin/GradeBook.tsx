import { useMemo, useState } from "react";
import {
  Search,
  Filter,
  BookOpen,
  Users,
  CheckCircle2,
  Clock3,
  Eye,
  Download,
  ChevronDown,
  X,
  GraduationCap,
  FileCheck2,
  AlertCircle,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type GradeStatus =
  | "Approved"
  | "Pending"
  | "Returned"
  | "Draft";

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
  lastUpdated: string;
}

/*
|--------------------------------------------------------------------------
| TEMPORARY DATA
|--------------------------------------------------------------------------
|
| Replace this with your API data when the grade book backend is connected.
|
*/

const gradeBooks: GradeBookRecord[] = [
  {
    id: "1",
    courseCode: "CSC 201",
    courseTitle: "Data Structures",
    lecturer: "Dr. Michael Anderson",
    department: "Computing & Technology",
    level: "200 Level",
    semester: "First Semester",
    students: 84,
    graded: 84,
    status: "Approved",
    lastUpdated: "25 Aug 2026",
  },
  {
    id: "2",
    courseCode: "CSC 305",
    courseTitle: "Database Management Systems",
    lecturer: "Prof. James Okoro",
    department: "Computing & Technology",
    level: "300 Level",
    semester: "First Semester",
    students: 72,
    graded: 68,
    status: "Pending",
    lastUpdated: "24 Aug 2026",
  },
  {
    id: "3",
    courseCode: "BUS 202",
    courseTitle: "Principles of Marketing",
    lecturer: "Dr. Sarah Thompson",
    department: "Business Studies",
    level: "200 Level",
    semester: "First Semester",
    students: 96,
    graded: 96,
    status: "Approved",
    lastUpdated: "23 Aug 2026",
  },
  {
    id: "4",
    courseCode: "ENG 101",
    courseTitle: "Engineering Mathematics I",
    lecturer: "Dr. Robert Mensah",
    department: "Engineering",
    level: "100 Level",
    semester: "First Semester",
    students: 118,
    graded: 110,
    status: "Pending",
    lastUpdated: "22 Aug 2026",
  },
  {
    id: "5",
    courseCode: "ACC 301",
    courseTitle: "Financial Accounting",
    lecturer: "Mrs. Grace Mensima",
    department: "Business Studies",
    level: "300 Level",
    semester: "Second Semester",
    students: 64,
    graded: 0,
    status: "Draft",
    lastUpdated: "20 Aug 2026",
  },
  {
    id: "6",
    courseCode: "CVE 401",
    courseTitle: "Structural Analysis",
    lecturer: "Engr. Samuel Okoro",
    department: "Engineering",
    level: "400 Level",
    semester: "Second Semester",
    students: 51,
    graded: 51,
    status: "Returned",
    lastUpdated: "19 Aug 2026",
  },
];

/*
|--------------------------------------------------------------------------
| STATUS BADGE
|--------------------------------------------------------------------------
*/

function StatusBadge({ status }: { status: GradeStatus }) {
  const styles: Record<GradeStatus, string> = {
    Approved:
      "bg-emerald-50 text-emerald-700 border-emerald-200",
    Pending:
      "bg-amber-50 text-amber-700 border-amber-200",
    Returned:
      "bg-red-50 text-red-700 border-red-200",
    Draft:
      "bg-slate-100 text-slate-600 border-slate-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold ${styles[status]}`}
    >
      {status}
    </span>
  );
}

/*
|--------------------------------------------------------------------------
| PAGE
|--------------------------------------------------------------------------
*/

export default function GradeBook() {
  const [search, setSearch] = useState("");

  const [departmentFilter, setDepartmentFilter] =
    useState("All");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [levelFilter, setLevelFilter] =
    useState("All");

  const [selectedCourse, setSelectedCourse] =
    useState<GradeBookRecord | null>(null);

  /*
  |--------------------------------------------------------------------------
  | COUNTS
  |--------------------------------------------------------------------------
  */

  const totalCourses = gradeBooks.length;

  const totalStudents = gradeBooks.reduce(
    (total, course) => total + course.students,
    0
  );

  const pendingCourses = gradeBooks.filter(
    (course) => course.status === "Pending"
  ).length;

  const approvedCourses = gradeBooks.filter(
    (course) => course.status === "Approved"
  ).length;

  /*
  |--------------------------------------------------------------------------
  | FILTER OPTIONS
  |--------------------------------------------------------------------------
  */

  const departments = useMemo(
    () =>
      Array.from(
        new Set(
          gradeBooks.map(
            (course) => course.department
          )
        )
      ),
    []
  );

  const levels = useMemo(
    () =>
      Array.from(
        new Set(
          gradeBooks.map(
            (course) => course.level
          )
        )
      ),
    []
  );

  /*
  |--------------------------------------------------------------------------
  | FILTERING
  |--------------------------------------------------------------------------
  */

  const filteredGradeBooks = useMemo(() => {
    const query = search.trim().toLowerCase();

    return gradeBooks.filter((course) => {
      const matchesSearch =
        !query ||
        course.courseCode
          .toLowerCase()
          .includes(query) ||
        course.courseTitle
          .toLowerCase()
          .includes(query) ||
        course.lecturer
          .toLowerCase()
          .includes(query);

      const matchesDepartment =
        departmentFilter === "All" ||
        course.department === departmentFilter;

      const matchesStatus =
        statusFilter === "All" ||
        course.status === statusFilter;

      const matchesLevel =
        levelFilter === "All" ||
        course.level === levelFilter;

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesStatus &&
        matchesLevel
      );
    });
  }, [
    search,
    departmentFilter,
    statusFilter,
    levelFilter,
  ]);

  /*
  |--------------------------------------------------------------------------
  | EXPORT
  |--------------------------------------------------------------------------
  */

  const handleExport = () => {
    const headers = [
      "Course Code",
      "Course Title",
      "Lecturer",
      "Department",
      "Level",
      "Semester",
      "Students",
      "Graded",
      "Status",
      "Last Updated",
    ];

    const rows = filteredGradeBooks.map((course) => [
      course.courseCode,
      course.courseTitle,
      course.lecturer,
      course.department,
      course.level,
      course.semester,
      course.students,
      course.graded,
      course.status,
      course.lastUpdated,
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
    link.download = "grade-book.csv";

    link.click();

    URL.revokeObjectURL(url);
  };

  /*
  |--------------------------------------------------------------------------
  | CLEAR FILTERS
  |--------------------------------------------------------------------------
  */

  const clearFilters = () => {
    setSearch("");
    setDepartmentFilter("All");
    setStatusFilter("All");
    setLevelFilter("All");
  };

  return (
    <div className="min-h-full space-y-6 bg-slate-50 p-4 md:p-6">

      {/* ============================================================
          HEADER
      ============================================================ */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#081022] text-white">
            <BookOpen className="h-5 w-5" />
          </div>

          <div>

            <h1 className="text-xl font-bold text-[#081022] md:text-2xl">
              Grade Book
            </h1>

            <p className="mt-1 text-xs text-slate-500">
              Monitor course grades, submissions and academic
              result approval across the institution.
            </p>

          </div>

        </div>

        <Button
          variant="outline"
          onClick={handleExport}
          className="gap-2 border-slate-300 bg-white"
        >
          <Download className="h-4 w-4" />
          Export Grade Book
        </Button>

      </div>

      {/* ============================================================
          STATISTICS
      ============================================================ */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* Courses */}

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

          <CardContent className="p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs font-medium text-slate-500">
                  Courses
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {totalCourses}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Grade books available
                </p>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <BookOpen className="h-5 w-5" />
              </div>

            </div>

          </CardContent>

        </Card>

        {/* Students */}

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

          <CardContent className="p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs font-medium text-slate-500">
                  Students
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {totalStudents}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Across listed courses
                </p>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
                <Users className="h-5 w-5" />
              </div>

            </div>

          </CardContent>

        </Card>

        {/* Pending */}

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

          <CardContent className="p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs font-medium text-slate-500">
                  Pending Approval
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {pendingCourses}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Awaiting admin review
                </p>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <Clock3 className="h-5 w-5" />
              </div>

            </div>

          </CardContent>

        </Card>

        {/* Approved */}

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

          <CardContent className="p-5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-xs font-medium text-slate-500">
                  Approved
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {approvedCourses}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Ready for publication
                </p>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <CheckCircle2 className="h-5 w-5" />
              </div>

            </div>

          </CardContent>

        </Card>

      </div>

      {/* ============================================================
          SEARCH + FILTERS
      ============================================================ */}

      <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

        <CardContent className="p-4">

          <div className="flex flex-col gap-3 xl:flex-row">

            {/* Search */}

            <div className="relative flex-1">

              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search course code, course title or lecturer..."
                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-[#006dcc] focus:bg-white focus:ring-2 focus:ring-blue-100"
              />

            </div>

            {/* Department */}

            <select
              value={departmentFilter}
              onChange={(event) =>
                setDepartmentFilter(event.target.value)
              }
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#006dcc]"
            >

              <option value="All">
                All Departments
              </option>

              {departments.map((department) => (
                <option
                  key={department}
                  value={department}
                >
                  {department}
                </option>
              ))}

            </select>

            {/* Level */}

            <select
              value={levelFilter}
              onChange={(event) =>
                setLevelFilter(event.target.value)
              }
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#006dcc]"
            >

              <option value="All">
                All Levels
              </option>

              {levels.map((level) => (
                <option
                  key={level}
                  value={level}
                >
                  {level}
                </option>
              ))}

            </select>

            {/* Status */}

            <div className="flex items-center gap-2">

              <Filter className="h-4 w-4 text-slate-400" />

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#006dcc]"
              >

                <option value="All">
                  All Status
                </option>

                <option value="Approved">
                  Approved
                </option>

                <option value="Pending">
                  Pending
                </option>

                <option value="Returned">
                  Returned
                </option>

                <option value="Draft">
                  Draft
                </option>

              </select>

            </div>

          </div>

        </CardContent>

      </Card>

      {/* ============================================================
          GRADE BOOK TABLE
      ============================================================ */}

      <Card className="overflow-hidden border-none bg-white shadow-sm ring-1 ring-slate-200">

        <div className="border-b border-slate-200 px-5 py-4">

          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <h2 className="text-sm font-bold text-[#081022]">
                Course Grade Books
              </h2>

              <p className="text-xs text-slate-500">
                {filteredGradeBooks.length} grade book
                {filteredGradeBooks.length !== 1
                  ? "s"
                  : ""}{" "}
                displayed
              </p>

            </div>

            {(search ||
              departmentFilter !== "All" ||
              statusFilter !== "All" ||
              levelFilter !== "All") && (

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

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Course
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Lecturer
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Department
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Level
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Students
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Graded
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

              {filteredGradeBooks.length === 0 ? (

                <tr>

                  <td
                    colSpan={8}
                    className="px-5 py-16 text-center"
                  >

                    <BookOpen className="mx-auto h-8 w-8 text-slate-300" />

                    <p className="mt-3 text-sm font-semibold text-slate-500">
                      No grade books found
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Try changing your search or filters.
                    </p>

                  </td>

                </tr>

              ) : (

                filteredGradeBooks.map((course) => {

                  const completion =
                    course.students > 0
                      ? Math.round(
                          (course.graded /
                            course.students) *
                            100
                        )
                      : 0;

                  return (

                    <tr
                      key={course.id}
                      className="transition hover:bg-slate-50"
                    >

                      {/* Course */}

                      <td className="px-5 py-4">

                        <div>

                          <p className="text-sm font-bold text-[#081022]">
                            {course.courseCode}
                          </p>

                          <p className="mt-0.5 max-w-[230px] text-xs text-slate-500">
                            {course.courseTitle}
                          </p>

                        </div>

                      </td>

                      {/* Lecturer */}

                      <td className="px-5 py-4">

                        <p className="text-xs font-semibold text-slate-700">
                          {course.lecturer}
                        </p>

                      </td>

                      {/* Department */}

                      <td className="px-5 py-4">

                        <p className="max-w-[170px] text-xs text-slate-600">
                          {course.department}
                        </p>

                      </td>

                      {/* Level */}

                      <td className="px-5 py-4">

                        <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                          {course.level}
                        </span>

                      </td>

                      {/* Students */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2">

                          <Users className="h-3.5 w-3.5 text-slate-400" />

                          <span className="text-xs font-semibold text-slate-700">
                            {course.students}
                          </span>

                        </div>

                      </td>

                      {/* Graded */}

                      <td className="px-5 py-4">

                        <div className="min-w-[100px]">

                          <div className="flex items-center justify-between">

                            <span className="text-xs font-semibold text-slate-700">
                              {course.graded}/
                              {course.students}
                            </span>

                            <span className="text-[10px] text-slate-400">
                              {completion}%
                            </span>

                          </div>

                          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100">

                            <div
                              className="h-full rounded-full bg-[#006dcc]"
                              style={{
                                width: `${completion}%`,
                              }}
                            />

                          </div>

                        </div>

                      </td>

                      {/* Status */}

                      <td className="px-5 py-4">

                        <StatusBadge
                          status={course.status}
                        />

                      </td>

                      {/* Action */}

                      <td className="px-5 py-4">

                        <div className="flex justify-end">

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setSelectedCourse(course)
                            }
                            className="h-8 gap-1.5 border-slate-200 text-xs"
                          >

                            <Eye className="h-3.5 w-3.5" />

                            View Grade Book

                          </Button>

                        </div>

                      </td>

                    </tr>

                  );
                })

              )}

            </tbody>

          </table>

        </div>

        {/* Footer */}

        <div className="border-t border-slate-200 px-5 py-3">

          <p className="text-xs text-slate-500">

            Showing{" "}

            <strong className="text-slate-700">
              {filteredGradeBooks.length}
            </strong>{" "}

            of{" "}

            <strong className="text-slate-700">
              {totalCourses}
            </strong>{" "}

            grade books

          </p>

        </div>

      </Card>

      {/* ============================================================
          GRADE BOOK DETAILS MODAL
      ============================================================ */}

      {selectedCourse && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* Modal Header */}

            <div className="flex items-start justify-between bg-[#081022] p-6 text-white">

              <div>

                <div className="flex items-center gap-2">

                  <span className="rounded-md bg-white/10 px-2 py-1 text-xs font-bold">
                    {selectedCourse.courseCode}
                  </span>

                  <StatusBadge
                    status={selectedCourse.status}
                  />

                </div>

                <h2 className="mt-3 text-xl font-bold">
                  {selectedCourse.courseTitle}
                </h2>

                <p className="mt-1 text-xs text-slate-300">
                  {selectedCourse.lecturer} •{" "}
                  {selectedCourse.department}
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedCourse(null)
                }
                className="rounded-lg p-2 text-slate-300 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

            </div>

            {/* Modal Content */}

            <div className="max-h-[65vh] space-y-5 overflow-y-auto p-6">

              {/* Course Information */}

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                <div className="rounded-xl bg-slate-50 p-4">

                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Level
                  </p>

                  <p className="mt-2 text-sm font-bold text-[#081022]">
                    {selectedCourse.level}
                  </p>

                </div>

                <div className="rounded-xl bg-slate-50 p-4">

                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Semester
                  </p>

                  <p className="mt-2 text-sm font-bold text-[#081022]">
                    {selectedCourse.semester}
                  </p>

                </div>

                <div className="rounded-xl bg-slate-50 p-4">

                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Students
                  </p>

                  <p className="mt-2 text-sm font-bold text-[#081022]">
                    {selectedCourse.students}
                  </p>

                </div>

                <div className="rounded-xl bg-slate-50 p-4">

                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Last Updated
                  </p>

                  <p className="mt-2 text-sm font-bold text-[#081022]">
                    {selectedCourse.lastUpdated}
                  </p>

                </div>

              </div>

              {/* Grade Progress */}

              <div className="rounded-xl border border-slate-200 p-5">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-sm font-bold text-[#081022]">
                      Grade Submission Progress
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {selectedCourse.graded} of{" "}
                      {selectedCourse.students} students
                      have grades recorded.
                    </p>

                  </div>

                  <GraduationCap className="h-5 w-5 text-slate-400" />

                </div>

                <div className="mt-4">

                  <div className="flex items-center justify-between text-xs">

                    <span className="font-semibold text-slate-600">
                      Completion
                    </span>

                    <span className="font-bold text-[#081022]">
                      {Math.round(
                        (selectedCourse.graded /
                          selectedCourse.students) *
                          100
                      )}
                      %
                    </span>

                  </div>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">

                    <div
                      className="h-full rounded-full bg-[#006dcc]"
                      style={{
                        width: `${Math.round(
                          (selectedCourse.graded /
                            selectedCourse.students) *
                            100
                        )}%`,
                      }}
                    />

                  </div>

                </div>

              </div>

              {/* Administrative Review */}

              <div>

                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Administrative Review
                </p>

                <div className="grid gap-3 sm:grid-cols-3">

                  <div className="rounded-xl border border-slate-200 p-4">

                    <FileCheck2 className="h-5 w-5 text-emerald-600" />

                    <p className="mt-3 text-sm font-bold text-[#081022]">
                      Grade Records
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Review individual student scores and
                      final grades.
                    </p>

                  </div>

                  <div className="rounded-xl border border-slate-200 p-4">

                    <CheckCircle2 className="h-5 w-5 text-blue-600" />

                    <p className="mt-3 text-sm font-bold text-[#081022]">
                      Approval
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Approve or return submitted grades.
                    </p>

                  </div>

                  <div className="rounded-xl border border-slate-200 p-4">

                    <AlertCircle className="h-5 w-5 text-amber-600" />

                    <p className="mt-3 text-sm font-bold text-[#081022]">
                      Exceptions
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Identify incomplete or unusual grade
                      records.
                    </p>

                  </div>

                </div>

              </div>

            </div>

            {/* Modal Footer */}

            <div className="flex flex-col gap-2 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="text-xs text-slate-500">
                Status:{" "}
                <strong className="text-slate-700">
                  {selectedCourse.status}
                </strong>
              </div>

              <div className="flex gap-2">

                <Button
                  variant="outline"
                  onClick={() =>
                    setSelectedCourse(null)
                  }
                >
                  Close
                </Button>

                {selectedCourse.status === "Pending" && (
                  <Button className="gap-2 bg-[#006dcc] hover:bg-[#005ca8]">
                    <CheckCircle2 className="h-4 w-4" />
                    Review Grades
                  </Button>
                )}

                {selectedCourse.status === "Approved" && (
                  <Button className="gap-2 bg-[#006dcc] hover:bg-[#005ca8]">
                    <Eye className="h-4 w-4" />
                    View Grades
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