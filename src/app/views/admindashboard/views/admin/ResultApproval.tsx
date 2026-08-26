import { useMemo, useState } from "react";
import {
  Search,
  Filter,
  Eye,
  CheckCircle2,
  RotateCcw,
  Clock3,
  FileCheck2,
  Users,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  X,
  AlertCircle,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type ResultStatus =
  | "Pending"
  | "Approved"
  | "Returned"
  | "Published";

interface ResultSubmission {
  id: string;
  lecturer: string;
  lecturerEmail: string;
  courseCode: string;
  courseTitle: string;
  programme: string;
  department: string;
  level: string;
  semester: string;
  session: string;
  studentCount: number;
  submittedDate: string;
  status: ResultStatus;
  averageScore: number;
}

/*
|--------------------------------------------------------------------------
| TEMPORARY DATA
|--------------------------------------------------------------------------
|
| Replace this with your API data when the result endpoint is connected.
|
*/

const resultSubmissions: ResultSubmission[] = [
  {
    id: "RES-001",
    lecturer: "Dr. Michael Anderson",
    lecturerEmail: "m.anderson@btp.edu",
    courseCode: "CSC 201",
    courseTitle: "Data Structures",
    programme: "Computer Science",
    department: "Computing & Technology",
    level: "200 Level",
    semester: "First Semester",
    session: "2025/2026",
    studentCount: 48,
    submittedDate: "25 Aug 2026",
    status: "Pending",
    averageScore: 68,
  },
  {
    id: "RES-002",
    lecturer: "Dr. Sarah Williams",
    lecturerEmail: "s.williams@btp.edu",
    courseCode: "ACC 203",
    courseTitle: "Financial Accounting",
    programme: "Accounting",
    department: "Business Studies",
    level: "200 Level",
    semester: "First Semester",
    session: "2025/2026",
    studentCount: 62,
    submittedDate: "24 Aug 2026",
    status: "Pending",
    averageScore: 71,
  },
  {
    id: "RES-003",
    lecturer: "Engr. David Mensah",
    lecturerEmail: "d.mensah@btp.edu",
    courseCode: "MEE 305",
    courseTitle: "Thermodynamics",
    programme: "Mechanical Engineering",
    department: "Engineering",
    level: "300 Level",
    semester: "First Semester",
    session: "2025/2026",
    studentCount: 41,
    submittedDate: "23 Aug 2026",
    status: "Approved",
    averageScore: 64,
  },
  {
    id: "RES-004",
    lecturer: "Dr. Grace Mensima",
    lecturerEmail: "g.mensima@btp.edu",
    courseCode: "BUS 301",
    courseTitle: "Business Management",
    programme: "Business Administration",
    department: "Business Studies",
    level: "300 Level",
    semester: "First Semester",
    session: "2025/2026",
    studentCount: 55,
    submittedDate: "22 Aug 2026",
    status: "Returned",
    averageScore: 59,
  },
  {
    id: "RES-005",
    lecturer: "Prof. Samuel Okoro",
    lecturerEmail: "s.okoro@btp.edu",
    courseCode: "CVE 402",
    courseTitle: "Structural Engineering",
    programme: "Civil Engineering",
    department: "Engineering",
    level: "400 Level",
    semester: "First Semester",
    session: "2024/2025",
    studentCount: 36,
    submittedDate: "20 Aug 2026",
    status: "Published",
    averageScore: 73,
  },
];

/*
|--------------------------------------------------------------------------
| STATUS BADGE
|--------------------------------------------------------------------------
*/

function StatusBadge({ status }: { status: ResultStatus }) {
  const styles: Record<ResultStatus, string> = {
    Pending:
      "bg-amber-50 text-amber-700 border-amber-200",
    Approved:
      "bg-emerald-50 text-emerald-700 border-emerald-200",
    Returned:
      "bg-red-50 text-red-700 border-red-200",
    Published:
      "bg-blue-50 text-blue-700 border-blue-200",
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

export default function ResultApproval() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] =
    useState("All");

  const [selectedResult, setSelectedResult] =
    useState<ResultSubmission | null>(null);

  /*
  |--------------------------------------------------------------------------
  | COUNTS
  |--------------------------------------------------------------------------
  */

  const pendingCount = resultSubmissions.filter(
    (result) => result.status === "Pending"
  ).length;

  const approvedCount = resultSubmissions.filter(
    (result) => result.status === "Approved"
  ).length;

  const returnedCount = resultSubmissions.filter(
    (result) => result.status === "Returned"
  ).length;

  const publishedCount = resultSubmissions.filter(
    (result) => result.status === "Published"
  ).length;

  /*
  |--------------------------------------------------------------------------
  | DEPARTMENTS
  |--------------------------------------------------------------------------
  */

  const departments = useMemo(() => {
    return Array.from(
      new Set(
        resultSubmissions.map(
          (result) => result.department
        )
      )
    );
  }, []);

  /*
  |--------------------------------------------------------------------------
  | FILTERING
  |--------------------------------------------------------------------------
  */

  const filteredResults = useMemo(() => {
    const query = search.trim().toLowerCase();

    return resultSubmissions.filter((result) => {
      const matchesSearch =
        !query ||
        result.lecturer.toLowerCase().includes(query) ||
        result.courseCode.toLowerCase().includes(query) ||
        result.courseTitle.toLowerCase().includes(query) ||
        result.programme.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        result.status === statusFilter;

      const matchesDepartment =
        departmentFilter === "All" ||
        result.department === departmentFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesDepartment
      );
    });
  }, [
    search,
    statusFilter,
    departmentFilter,
  ]);

  /*
  |--------------------------------------------------------------------------
  | ACTIONS
  |--------------------------------------------------------------------------
  */

  const handleApprove = (result: ResultSubmission) => {
    console.log("Approve result:", result.id);

    /*
     * Connect to your backend here.
     *
     * Example:
     *
     * await api.patch(`/results/${result.id}/approve`);
     *
     * After successful approval, refresh the results.
     */
  };

  const handleReturn = (result: ResultSubmission) => {
    console.log("Return result:", result.id);

    /*
     * Connect to your backend here.
     *
     * Example:
     *
     * await api.patch(`/results/${result.id}/return`, {
     *   reason: "Please review submitted scores"
     * });
     */
  };

  return (
    <div className="min-h-full space-y-6 bg-slate-50 p-4 md:p-6">

      {/* ============================================================
          HEADER
      ============================================================ */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#081022] text-white">
            <FileCheck2 className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-[#081022] md:text-2xl">
              Result Approval Panel
            </h1>

            <p className="mt-1 text-xs text-slate-500">
              Review lecturer-submitted results before they are
              released to students.
            </p>
          </div>

        </div>

      </div>

      {/* ============================================================
          INFORMATION BANNER
      ============================================================ */}

      <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4">

        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" />

        <div>
          <p className="text-sm font-bold text-blue-900">
            Result approval workflow
          </p>

          <p className="mt-1 text-xs leading-5 text-blue-700">
            Lecturers submit course results for administrative
            review. Approved results can then be published and
            made available to students. Returned results must be
            corrected and resubmitted by the lecturer.
          </p>
        </div>

      </div>

      {/* ============================================================
          STATISTICS
      ============================================================ */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* Pending */}

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-5">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-medium text-slate-500">
                  Pending Review
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {pendingCount}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Awaiting administrator review
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
                  {approvedCount}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Passed administrative review
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <CheckCircle2 className="h-5 w-5" />
              </div>

            </div>

          </CardContent>
        </Card>

        {/* Returned */}

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-5">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-medium text-slate-500">
                  Returned
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {returnedCount}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Need lecturer correction
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-700">
                <RotateCcw className="h-5 w-5" />
              </div>

            </div>

          </CardContent>
        </Card>

        {/* Published */}

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-5">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-medium text-slate-500">
                  Published
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {publishedCount}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Available to students
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <FileCheck2 className="h-5 w-5" />
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

          <div className="flex flex-col gap-3 lg:flex-row">

            <div className="relative flex-1">

              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search lecturer, course code, course title or programme..."
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
                <option value="All">
                  All Status
                </option>

                <option value="Pending">
                  Pending
                </option>

                <option value="Approved">
                  Approved
                </option>

                <option value="Returned">
                  Returned
                </option>

                <option value="Published">
                  Published
                </option>
              </select>

            </div>

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

          </div>

        </CardContent>

      </Card>

      {/* ============================================================
          RESULTS TABLE
      ============================================================ */}

      <Card className="overflow-hidden border-none bg-white shadow-sm ring-1 ring-slate-200">

        <div className="border-b border-slate-200 px-5 py-4">

          <div>
            <h2 className="text-sm font-bold text-[#081022]">
              Submitted Results
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              {filteredResults.length} result submission
              {filteredResults.length !== 1 ? "s" : ""} displayed
            </p>
          </div>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1200px]">

            <thead className="bg-slate-50">

              <tr className="border-b border-slate-200">

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Course
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Lecturer
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Programme
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Level / Semester
                </th>

                <th className="px-5 py-3 text-center text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Students
                </th>

                <th className="px-5 py-3 text-center text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Average
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

              {filteredResults.length === 0 ? (

                <tr>

                  <td
                    colSpan={8}
                    className="px-5 py-16 text-center"
                  >

                    <FileCheck2 className="mx-auto h-8 w-8 text-slate-300" />

                    <p className="mt-3 text-sm font-semibold text-slate-500">
                      No result submissions found
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Try changing your search or filters.
                    </p>

                  </td>

                </tr>

              ) : (

                filteredResults.map((result) => (

                  <tr
                    key={result.id}
                    className="transition hover:bg-slate-50"
                  >

                    {/* Course */}

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                          <BookOpen className="h-4 w-4" />
                        </div>

                        <div>

                          <p className="text-sm font-bold text-[#081022]">
                            {result.courseCode}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {result.courseTitle}
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* Lecturer */}

                    <td className="px-5 py-4">

                      <p className="text-xs font-bold text-slate-700">
                        {result.lecturer}
                      </p>

                      <p className="mt-1 text-[11px] text-slate-400">
                        {result.lecturerEmail}
                      </p>

                    </td>

                    {/* Programme */}

                    <td className="px-5 py-4">

                      <p className="max-w-[180px] text-xs font-semibold text-slate-700">
                        {result.programme}
                      </p>

                      <p className="mt-1 text-[11px] text-slate-400">
                        {result.department}
                      </p>

                    </td>

                    {/* Level */}

                    <td className="px-5 py-4">

                      <p className="text-xs font-semibold text-slate-700">
                        {result.level}
                      </p>

                      <p className="mt-1 text-[11px] text-slate-400">
                        {result.semester}
                      </p>

                    </td>

                    {/* Students */}

                    <td className="px-5 py-4 text-center">

                      <div className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700">
                        <Users className="h-3.5 w-3.5 text-slate-400" />
                        {result.studentCount}
                      </div>

                    </td>

                    {/* Average */}

                    <td className="px-5 py-4 text-center">

                      <span className="text-sm font-black text-[#081022]">
                        {result.averageScore}%
                      </span>

                    </td>

                    {/* Status */}

                    <td className="px-5 py-4">

                      <StatusBadge status={result.status} />

                    </td>

                    {/* Action */}

                    <td className="px-5 py-4">

                      <div className="flex justify-end gap-2">

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setSelectedResult(result)
                          }
                          className="h-8 gap-1.5 border-slate-200 text-xs"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Review
                        </Button>

                        {result.status === "Pending" && (
                          <>
                            <button
                              type="button"
                              onClick={() =>
                                handleApprove(result)
                              }
                              className="flex h-8 items-center gap-1.5 rounded-md bg-emerald-600 px-3 text-xs font-semibold text-white hover:bg-emerald-700"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Approve
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleReturn(result)
                              }
                              className="flex h-8 items-center gap-1.5 rounded-md border border-red-200 px-3 text-xs font-semibold text-red-600 hover:bg-red-50"
                            >
                              <RotateCcw className="h-3.5 w-3.5" />
                              Return
                            </button>
                          </>
                        )}

                      </div>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

        {/* Pagination */}

        <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3">

          <p className="text-xs text-slate-500">
            Showing{" "}
            <strong className="text-slate-700">
              {filteredResults.length}
            </strong>{" "}
            of{" "}
            <strong className="text-slate-700">
              {resultSubmissions.length}
            </strong>{" "}
            submissions
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

      {/* ============================================================
          RESULT REVIEW MODAL
      ============================================================ */}

      {selectedResult && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

            {/* Header */}

            <div className="flex items-start justify-between bg-[#081022] p-6 text-white">

              <div>

                <div className="flex items-center gap-2">

                  <BookOpen className="h-5 w-5 text-blue-200" />

                  <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
                    Result Submission
                  </span>

                </div>

                <h2 className="mt-2 text-xl font-bold">
                  {selectedResult.courseCode}
                </h2>

                <p className="mt-1 text-sm text-slate-300">
                  {selectedResult.courseTitle}
                </p>

              </div>

              <button
                type="button"
                onClick={() => setSelectedResult(null)}
                className="rounded-lg p-2 text-slate-300 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

            </div>

            {/* Details */}

            <div className="space-y-6 p-6">

              {/* Status */}

              <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Current Status
                  </p>

                  <div className="mt-2">
                    <StatusBadge
                      status={selectedResult.status}
                    />
                  </div>

                </div>

                <div className="text-left sm:text-right">

                  <p className="text-xs text-slate-400">
                    Submitted
                  </p>

                  <p className="mt-1 text-sm font-bold text-[#081022]">
                    {selectedResult.submittedDate}
                  </p>

                </div>

              </div>

              {/* Course Information */}

              <div>

                <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Course Information
                </h3>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400">
                      Course
                    </p>

                    <p className="mt-2 text-sm font-bold text-[#081022]">
                      {selectedResult.courseCode}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {selectedResult.courseTitle}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400">
                      Programme
                    </p>

                    <p className="mt-2 text-sm font-bold text-[#081022]">
                      {selectedResult.programme}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400">
                      Level
                    </p>

                    <p className="mt-2 text-sm font-bold text-[#081022]">
                      {selectedResult.level}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400">
                      Semester
                    </p>

                    <p className="mt-2 text-sm font-bold text-[#081022]">
                      {selectedResult.semester}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400">
                      Academic Session
                    </p>

                    <p className="mt-2 text-sm font-bold text-[#081022]">
                      {selectedResult.session}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400">
                      Students
                    </p>

                    <p className="mt-2 text-sm font-bold text-[#081022]">
                      {selectedResult.studentCount}
                    </p>
                  </div>

                </div>

              </div>

              {/* Lecturer */}

              <div>

                <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Submitted By
                </h3>

                <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-4">

                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#081022] text-sm font-bold text-white">
                    {selectedResult.lecturer
                      .split(" ")
                      .map((name) => name[0])
                      .slice(0, 2)
                      .join("")}
                  </div>

                  <div>

                    <p className="text-sm font-bold text-[#081022]">
                      {selectedResult.lecturer}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {selectedResult.lecturerEmail}
                    </p>

                  </div>

                </div>

              </div>

              {/* Result Summary */}

              <div>

                <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Result Summary
                </h3>

                <div className="grid gap-3 sm:grid-cols-3">

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-500">
                      Students
                    </p>

                    <p className="mt-2 text-2xl font-black text-[#081022]">
                      {selectedResult.studentCount}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-500">
                      Class Average
                    </p>

                    <p className="mt-2 text-2xl font-black text-[#081022]">
                      {selectedResult.averageScore}%
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-xs text-slate-500">
                      Submission
                    </p>

                    <p className="mt-2 text-sm font-bold text-[#081022]">
                      {selectedResult.submittedDate}
                    </p>
                  </div>

                </div>

              </div>

            </div>

            {/* Footer */}

            <div className="flex flex-col-reverse gap-2 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">

              <Button
                variant="outline"
                onClick={() => setSelectedResult(null)}
              >
                Close
              </Button>

              {selectedResult.status === "Pending" && (

                <div className="flex gap-2">

                  <Button
                    variant="outline"
                    onClick={() =>
                      handleReturn(selectedResult)
                    }
                    className="gap-2 border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Return for Correction
                  </Button>

                  <Button
                    onClick={() =>
                      handleApprove(selectedResult)
                    }
                    className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Approve Result
                  </Button>

                </div>

              )}

            </div>

          </div>

        </div>

      )}

    </div>
  );
}