import { useMemo, useState } from "react";
import {
  Search,
  Filter,
  Eye,
  Download,
  ClipboardCheck,
  Users,
  CheckCircle2,
  XCircle,
  Clock3,
  X,
  ChevronLeft,
  ChevronRight,
  BarChart3,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type ResultStatus =
  | "Completed"
  | "Pending"
  | "Passed"
  | "Failed";

interface QuizResult {
  id: string;
  student: string;
  matricNumber: string;
  quiz: string;
  course: string;
  programme: string;
  score: number;
  totalMarks: number;
  percentage: number;
  status: ResultStatus;
  submittedAt: string;
  duration: string;
}

/*
|--------------------------------------------------------------------------
| TEMPORARY DATA
|--------------------------------------------------------------------------
|
| Replace this with your API result data when the backend is connected.
|
*/

const quizResults: QuizResult[] = [
  {
    id: "1",
    student: "Daniel Mensah",
    matricNumber: "BTP/CSC/2024/001",
    quiz: "Introduction to Programming Test 1",
    course: "CSC 201",
    programme: "Computer Science",
    score: 18,
    totalMarks: 20,
    percentage: 90,
    status: "Passed",
    submittedAt: "25 Aug 2026, 10:42 AM",
    duration: "18 mins",
  },
  {
    id: "2",
    student: "Sarah Williams",
    matricNumber: "BTP/BUS/2024/014",
    quiz: "Business Management Quiz",
    course: "BUS 201",
    programme: "Business Administration",
    score: 16,
    totalMarks: 20,
    percentage: 80,
    status: "Passed",
    submittedAt: "25 Aug 2026, 09:15 AM",
    duration: "21 mins",
  },
  {
    id: "3",
    student: "Michael Johnson",
    matricNumber: "BTP/ENG/2025/008",
    quiz: "Engineering Mathematics Test",
    course: "MTH 101",
    programme: "Mechanical Engineering",
    score: 9,
    totalMarks: 20,
    percentage: 45,
    status: "Failed",
    submittedAt: "24 Aug 2026, 03:20 PM",
    duration: "25 mins",
  },
  {
    id: "4",
    student: "Grace Mensima",
    matricNumber: "BTP/ACC/2023/031",
    quiz: "Financial Accounting Quiz",
    course: "ACC 301",
    programme: "Accounting",
    score: 17,
    totalMarks: 20,
    percentage: 85,
    status: "Passed",
    submittedAt: "24 Aug 2026, 01:05 PM",
    duration: "19 mins",
  },
  {
    id: "5",
    student: "Esther Adams",
    matricNumber: "BTP/INF/2024/045",
    quiz: "Database Systems Quiz",
    course: "IFT 201",
    programme: "Information Technology",
    score: 13,
    totalMarks: 20,
    percentage: 65,
    status: "Passed",
    submittedAt: "23 Aug 2026, 11:40 AM",
    duration: "22 mins",
  },
  {
    id: "6",
    student: "Samuel Okoro",
    matricNumber: "BTP/CVE/2022/017",
    quiz: "Structural Engineering Assessment",
    course: "CVE 401",
    programme: "Civil Engineering",
    score: 12,
    totalMarks: 20,
    percentage: 60,
    status: "Completed",
    submittedAt: "22 Aug 2026, 04:10 PM",
    duration: "28 mins",
  },
];

/*
|--------------------------------------------------------------------------
| STATUS BADGE
|--------------------------------------------------------------------------
*/

function StatusBadge({ status }: { status: ResultStatus }) {
  const styles: Record<ResultStatus, string> = {
    Completed:
      "bg-blue-50 text-blue-700 border-blue-200",
    Pending:
      "bg-amber-50 text-amber-700 border-amber-200",
    Passed:
      "bg-emerald-50 text-emerald-700 border-emerald-200",
    Failed:
      "bg-red-50 text-red-700 border-red-200",
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

export default function QuizResults() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [programmeFilter, setProgrammeFilter] = useState("All");
  const [selectedResult, setSelectedResult] =
    useState<QuizResult | null>(null);

  /*
  |--------------------------------------------------------------------------
  | STATISTICS
  |--------------------------------------------------------------------------
  */

  const attemptCount = quizResults.length;

  const completedCount = quizResults.filter(
    (result) =>
      result.status === "Completed" ||
      result.status === "Passed" ||
      result.status === "Failed"
  ).length;

  const passedCount = quizResults.filter(
    (result) => result.status === "Passed"
  ).length;

  const failedCount = quizResults.filter(
    (result) => result.status === "Failed"
  ).length;

  const averageScore =
    quizResults.length > 0
      ? Math.round(
          quizResults.reduce(
            (total, result) => total + result.percentage,
            0
          ) / quizResults.length
        )
      : 0;

  /*
  |--------------------------------------------------------------------------
  | PROGRAMMES
  |--------------------------------------------------------------------------
  */

  const programmes = useMemo(() => {
    return Array.from(
      new Set(quizResults.map((result) => result.programme))
    );
  }, []);

  /*
  |--------------------------------------------------------------------------
  | FILTER RESULTS
  |--------------------------------------------------------------------------
  */

  const filteredResults = useMemo(() => {
    const query = search.trim().toLowerCase();

    return quizResults.filter((result) => {
      const matchesSearch =
        !query ||
        result.student.toLowerCase().includes(query) ||
        result.matricNumber.toLowerCase().includes(query) ||
        result.quiz.toLowerCase().includes(query) ||
        result.course.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        result.status === statusFilter;

      const matchesProgramme =
        programmeFilter === "All" ||
        result.programme === programmeFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesProgramme
      );
    });
  }, [search, statusFilter, programmeFilter]);

  /*
  |--------------------------------------------------------------------------
  | EXPORT
  |--------------------------------------------------------------------------
  */

  const handleExport = () => {
    const headers = [
      "Student",
      "Matric Number",
      "Quiz",
      "Course",
      "Programme",
      "Score",
      "Total Marks",
      "Percentage",
      "Status",
      "Submitted At",
      "Duration",
    ];

    const rows = filteredResults.map((result) => [
      result.student,
      result.matricNumber,
      result.quiz,
      result.course,
      result.programme,
      result.score,
      result.totalMarks,
      `${result.percentage}%`,
      result.status,
      result.submittedAt,
      result.duration,
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
    link.download = "quiz-results.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-full space-y-6 bg-slate-50 p-4 md:p-6">

      {/* ============================================================
          HEADER
      ============================================================ */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#081022] text-white">
            <ClipboardCheck className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-[#081022] md:text-2xl">
              Quiz Results
            </h1>

            <p className="mt-1 text-xs text-slate-500">
              Monitor student quiz attempts, scores and assessment performance.
            </p>
          </div>

        </div>

        <Button
          variant="outline"
          onClick={handleExport}
          className="gap-2 border-slate-300 bg-white"
        >
          <Download className="h-4 w-4" />
          Export Results
        </Button>

      </div>

      {/* ============================================================
          STATISTICS
      ============================================================ */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">
                  Total Attempts
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {attemptCount}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  All quiz submissions
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <Users className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">
                  Completed
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {completedCount}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Submitted assessments
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
                <p className="text-xs text-slate-500">
                  Passed
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {passedCount}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Successful attempts
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
                <p className="text-xs text-slate-500">
                  Failed
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {failedCount}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Unsuccessful attempts
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-700">
                <XCircle className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-slate-500">
                  Average Score
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {averageScore}%
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Across all attempts
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
                <BarChart3 className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

      </div>

      {/* ============================================================
          SEARCH + FILTER
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
                placeholder="Search student, matric number, quiz or course..."
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
                <option value="All">All Results</option>
                <option value="Passed">Passed</option>
                <option value="Failed">Failed</option>
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
              </select>

            </div>

            <select
              value={programmeFilter}
              onChange={(event) =>
                setProgrammeFilter(event.target.value)
              }
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#006dcc]"
            >
              <option value="All">All Programmes</option>

              {programmes.map((programme) => (
                <option key={programme} value={programme}>
                  {programme}
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
              Student Quiz Results
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              {filteredResults.length} result
              {filteredResults.length !== 1 ? "s" : ""} displayed
            </p>
          </div>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1200px]">

            <thead className="bg-slate-50">

              <tr className="border-b border-slate-200">

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Student
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Quiz
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Course
                </th>

                <th className="px-5 py-3 text-center text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Score
                </th>

                <th className="px-5 py-3 text-center text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Percentage
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Status
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Submitted
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
                    <ClipboardCheck className="mx-auto h-8 w-8 text-slate-300" />

                    <p className="mt-3 text-sm font-semibold text-slate-500">
                      No quiz results found
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

                    {/* Student */}

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#081022] text-xs font-bold text-white">
                          {result.student
                            .split(" ")
                            .map((name) => name[0])
                            .slice(0, 2)
                            .join("")}
                        </div>

                        <div>

                          <p className="text-xs font-bold text-[#081022]">
                            {result.student}
                          </p>

                          <p className="mt-1 text-[10px] text-slate-500">
                            {result.matricNumber}
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* Quiz */}

                    <td className="px-5 py-4">

                      <p className="max-w-[230px] text-xs font-semibold text-slate-700">
                        {result.quiz}
                      </p>

                    </td>

                    {/* Course */}

                    <td className="px-5 py-4">

                      <p className="text-xs font-semibold text-slate-700">
                        {result.course}
                      </p>

                      <p className="mt-1 text-[10px] text-slate-400">
                        {result.programme}
                      </p>

                    </td>

                    {/* Score */}

                    <td className="px-5 py-4 text-center">

                      <span className="text-sm font-black text-[#081022]">
                        {result.score}
                      </span>

                      <span className="text-xs text-slate-400">
                        /{result.totalMarks}
                      </span>

                    </td>

                    {/* Percentage */}

                    <td className="px-5 py-4 text-center">

                      <span
                        className={`text-sm font-black ${
                          result.percentage >= 50
                            ? "text-emerald-700"
                            : "text-red-700"
                        }`}
                      >
                        {result.percentage}%
                      </span>

                    </td>

                    {/* Status */}

                    <td className="px-5 py-4">
                      <StatusBadge status={result.status} />
                    </td>

                    {/* Submitted */}

                    <td className="px-5 py-4">

                      <p className="text-xs text-slate-600">
                        {result.submittedAt}
                      </p>

                      <p className="mt-1 flex items-center gap-1 text-[10px] text-slate-400">
                        <Clock3 className="h-3 w-3" />
                        {result.duration}
                      </p>

                    </td>

                    {/* Action */}

                    <td className="px-5 py-4">

                      <div className="flex justify-end">

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setSelectedResult(result)
                          }
                          className="h-8 gap-1.5 border-slate-200 text-xs"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View Result
                        </Button>

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
              {attemptCount}
            </strong>{" "}
            results
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
          RESULT DETAILS MODAL
      ============================================================ */}

      {selectedResult && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* Header */}

            <div className="flex items-start justify-between bg-[#081022] p-6 text-white">

              <div>

                <p className="text-lg font-bold">
                  {selectedResult.quiz}
                </p>

                <p className="mt-1 text-xs text-slate-300">
                  {selectedResult.student} •{" "}
                  {selectedResult.matricNumber}
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

            {/* Content */}

            <div className="space-y-5 p-6">

              <div className="grid gap-4 sm:grid-cols-3">

                <div className="rounded-xl bg-slate-50 p-4 text-center">

                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Score
                  </p>

                  <p className="mt-2 text-2xl font-black text-[#081022]">
                    {selectedResult.score}/{selectedResult.totalMarks}
                  </p>

                </div>

                <div className="rounded-xl bg-slate-50 p-4 text-center">

                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Percentage
                  </p>

                  <p className="mt-2 text-2xl font-black text-[#006dcc]">
                    {selectedResult.percentage}%
                  </p>

                </div>

                <div className="rounded-xl bg-slate-50 p-4 text-center">

                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Status
                  </p>

                  <div className="mt-2">
                    <StatusBadge
                      status={selectedResult.status}
                    />
                  </div>

                </div>

              </div>

              <div className="grid gap-4 sm:grid-cols-2">

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Student
                  </p>

                  <p className="mt-1 text-sm font-bold text-[#081022]">
                    {selectedResult.student}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Matric Number
                  </p>

                  <p className="mt-1 text-sm font-bold text-[#081022]">
                    {selectedResult.matricNumber}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Course
                  </p>

                  <p className="mt-1 text-sm font-bold text-[#081022]">
                    {selectedResult.course}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Programme
                  </p>

                  <p className="mt-1 text-sm font-bold text-[#081022]">
                    {selectedResult.programme}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Submitted
                  </p>

                  <p className="mt-1 text-sm text-slate-600">
                    {selectedResult.submittedAt}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Time Taken
                  </p>

                  <p className="mt-1 text-sm text-slate-600">
                    {selectedResult.duration}
                  </p>
                </div>

              </div>

            </div>

            {/* Footer */}

            <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-6 py-4">

              <Button
                variant="outline"
                onClick={() => setSelectedResult(null)}
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