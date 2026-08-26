import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Eye,
  Plus,
  ListChecks,
  CheckCircle2,
  FileEdit,
  Lock,
  MoreHorizontal,
  Clock3,
  BookOpen,
  User,
  Users,
  X,
  Pencil,
  Power,
  PowerOff,
  Trash2,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type QuizStatus = "Published" | "Draft" | "Closed";

interface Quiz {
  id: string;
  title: string;
  courseCode: string;
  courseTitle: string;
  lecturer: string;
  questions: number;
  duration: number;
  attempts: number;
  status: QuizStatus;
  created: string;
  updated: string;
}

/*
|--------------------------------------------------------------------------
| TEMPORARY DATA
|--------------------------------------------------------------------------
|
| Replace this with your API data when the quiz endpoint is connected.
|
*/

const quizzes: Quiz[] = [
  {
    id: "1",
    title: "Introduction to Programming Test",
    courseCode: "CSC 201",
    courseTitle: "Introduction to Programming",
    lecturer: "Dr. Daniel Mensah",
    questions: 25,
    duration: 30,
    attempts: 86,
    status: "Published",
    created: "20 Aug 2026",
    updated: "25 Aug 2026",
  },
  {
    id: "2",
    title: "Database Systems Mid-Semester Test",
    courseCode: "CSC 305",
    courseTitle: "Database Systems",
    lecturer: "Dr. Sarah Williams",
    questions: 30,
    duration: 45,
    attempts: 64,
    status: "Published",
    created: "18 Aug 2026",
    updated: "24 Aug 2026",
  },
  {
    id: "3",
    title: "Engineering Mathematics Quiz 2",
    courseCode: "MTH 203",
    courseTitle: "Engineering Mathematics II",
    lecturer: "Engr. Michael Johnson",
    questions: 20,
    duration: 25,
    attempts: 0,
    status: "Draft",
    created: "23 Aug 2026",
    updated: "23 Aug 2026",
  },
  {
    id: "4",
    title: "Business Communication Assessment",
    courseCode: "BUS 201",
    courseTitle: "Business Communication",
    lecturer: "Mrs. Grace Mensima",
    questions: 15,
    duration: 20,
    attempts: 102,
    status: "Closed",
    created: "10 Aug 2026",
    updated: "21 Aug 2026",
  },
  {
    id: "5",
    title: "Computer Networks Test",
    courseCode: "CSC 401",
    courseTitle: "Computer Networks",
    lecturer: "Mr. Samuel Okoro",
    questions: 40,
    duration: 60,
    attempts: 47,
    status: "Published",
    created: "21 Aug 2026",
    updated: "25 Aug 2026",
  },
  {
    id: "6",
    title: "Accounting Principles Quiz",
    courseCode: "ACC 201",
    courseTitle: "Principles of Accounting",
    lecturer: "Mrs. Esther Adams",
    questions: 20,
    duration: 30,
    attempts: 0,
    status: "Draft",
    created: "24 Aug 2026",
    updated: "24 Aug 2026",
  },
];

/*
|--------------------------------------------------------------------------
| STATUS BADGE
|--------------------------------------------------------------------------
*/

function StatusBadge({ status }: { status: QuizStatus }) {
  const styles: Record<QuizStatus, string> = {
    Published:
      "bg-emerald-50 text-emerald-700 border-emerald-200",
    Draft:
      "bg-amber-50 text-amber-700 border-amber-200",
    Closed:
      "bg-slate-100 text-slate-600 border-slate-200",
  };

  const icons: Record<QuizStatus, React.ElementType> = {
    Published: CheckCircle2,
    Draft: FileEdit,
    Closed: Lock,
  };

  const Icon = icons[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${styles[status]}`}
    >
      <Icon className="h-3 w-3" />
      {status}
    </span>
  );
}

/*
|--------------------------------------------------------------------------
| PAGE
|--------------------------------------------------------------------------
*/

export default function AllQuizzes() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedQuiz, setSelectedQuiz] =
    useState<Quiz | null>(null);

  /*
  |--------------------------------------------------------------------------
  | STATISTICS
  |--------------------------------------------------------------------------
  */

  const quizCount = quizzes.length;

  const publishedCount = quizzes.filter(
    (quiz) => quiz.status === "Published"
  ).length;

  const draftCount = quizzes.filter(
    (quiz) => quiz.status === "Draft"
  ).length;

  const closedCount = quizzes.filter(
    (quiz) => quiz.status === "Closed"
  ).length;

  /*
  |--------------------------------------------------------------------------
  | FILTERING
  |--------------------------------------------------------------------------
  */

  const filteredQuizzes = useMemo(() => {
    const query = search.trim().toLowerCase();

    return quizzes.filter((quiz) => {
      const matchesSearch =
        !query ||
        quiz.title.toLowerCase().includes(query) ||
        quiz.courseCode.toLowerCase().includes(query) ||
        quiz.courseTitle.toLowerCase().includes(query) ||
        quiz.lecturer.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        quiz.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  /*
  |--------------------------------------------------------------------------
  | RETURN
  |--------------------------------------------------------------------------
  */

  return (
    <div className="min-h-full space-y-6 bg-slate-50 p-4 md:p-6">

      {/* ============================================================
          HEADER
      ============================================================ */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#081022] text-white">
            <ListChecks className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-[#081022] md:text-2xl">
              All Quizzes
            </h1>

            <p className="mt-1 text-xs text-slate-500">
              Manage and monitor quizzes created across the institution.
            </p>
          </div>

        </div>

        <Button
          onClick={() => navigate("/admin/quiz/create")}
          className="gap-2 bg-[#006dcc] hover:bg-[#005ca8]"
        >
          <Plus className="h-4 w-4" />
          Create Quiz
        </Button>

      </div>

      {/* ============================================================
          STATISTICS
      ============================================================ */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* Total */}

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-5">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-medium text-slate-500">
                  Total Quizzes
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {quizCount}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Institution-wide quizzes
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <ListChecks className="h-5 w-5" />
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

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <CheckCircle2 className="h-5 w-5" />
              </div>

            </div>

          </CardContent>
        </Card>

        {/* Drafts */}

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-5">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-medium text-slate-500">
                  Drafts
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {draftCount}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Not yet published
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <FileEdit className="h-5 w-5" />
              </div>

            </div>

          </CardContent>
        </Card>

        {/* Closed */}

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-5">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-medium text-slate-500">
                  Closed
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {closedCount}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  No longer available
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
                <Lock className="h-5 w-5" />
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
                placeholder="Search quiz, course or lecturer..."
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

                <option value="Published">
                  Published
                </option>

                <option value="Draft">
                  Draft
                </option>

                <option value="Closed">
                  Closed
                </option>
              </select>

            </div>

            {(search || statusFilter !== "All") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("All");
                }}
                className="flex items-center justify-center gap-1 text-xs font-semibold text-[#006dcc] hover:underline"
              >
                <X className="h-3 w-3" />
                Clear
              </button>
            )}

          </div>

        </CardContent>

      </Card>

      {/* ============================================================
          QUIZ TABLE
      ============================================================ */}

      <Card className="overflow-hidden border-none bg-white shadow-sm ring-1 ring-slate-200">

        <div className="border-b border-slate-200 px-5 py-4">

          <h2 className="text-sm font-bold text-[#081022]">
            Quiz Catalogue
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            {filteredQuizzes.length} quiz
            {filteredQuizzes.length !== 1 ? "zes" : ""} displayed
          </p>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1100px]">

            <thead className="bg-slate-50">

              <tr className="border-b border-slate-200">

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Quiz
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Course
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Lecturer
                </th>

                <th className="px-5 py-3 text-center text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Questions
                </th>

                <th className="px-5 py-3 text-center text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Duration
                </th>

                <th className="px-5 py-3 text-center text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Attempts
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

              {filteredQuizzes.length === 0 ? (

                <tr>

                  <td
                    colSpan={8}
                    className="px-5 py-16 text-center"
                  >

                    <ListChecks className="mx-auto h-8 w-8 text-slate-300" />

                    <p className="mt-3 text-sm font-semibold text-slate-500">
                      No quizzes found
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Try changing your search or filter.
                    </p>

                  </td>

                </tr>

              ) : (

                filteredQuizzes.map((quiz) => (

                  <tr
                    key={quiz.id}
                    className="transition hover:bg-slate-50"
                  >

                    {/* Quiz */}

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#081022] text-white">
                          <ListChecks className="h-4 w-4" />
                        </div>

                        <div className="min-w-0">

                          <p className="truncate text-sm font-bold text-[#081022]">
                            {quiz.title}
                          </p>

                          <p className="mt-1 text-[11px] text-slate-400">
                            Updated {quiz.updated}
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* Course */}

                    <td className="px-5 py-4">

                      <div>

                        <p className="text-xs font-bold text-[#081022]">
                          {quiz.courseCode}
                        </p>

                        <p className="mt-1 max-w-[190px] truncate text-xs text-slate-500">
                          {quiz.courseTitle}
                        </p>

                      </div>

                    </td>

                    {/* Lecturer */}

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-2">

                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                          <User className="h-3.5 w-3.5" />
                        </div>

                        <span className="text-xs font-semibold text-slate-700">
                          {quiz.lecturer}
                        </span>

                      </div>

                    </td>

                    {/* Questions */}

                    <td className="px-5 py-4 text-center">

                      <span className="text-xs font-bold text-[#081022]">
                        {quiz.questions}
                      </span>

                    </td>

                    {/* Duration */}

                    <td className="px-5 py-4">

                      <div className="flex items-center justify-center gap-1.5 text-xs text-slate-600">

                        <Clock3 className="h-3.5 w-3.5 text-slate-400" />

                        {quiz.duration} min

                      </div>

                    </td>

                    {/* Attempts */}

                    <td className="px-5 py-4">

                      <div className="flex items-center justify-center gap-1.5">

                        <Users className="h-3.5 w-3.5 text-slate-400" />

                        <span className="text-xs font-bold text-[#081022]">
                          {quiz.attempts}
                        </span>

                      </div>

                    </td>

                    {/* Status */}

                    <td className="px-5 py-4">

                      <StatusBadge status={quiz.status} />

                    </td>

                    {/* Actions */}

                    <td className="px-5 py-4">

                      <div className="flex justify-end gap-2">

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setSelectedQuiz(quiz)
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

                ))

              )}

            </tbody>

          </table>

        </div>

        {/* Footer */}

        <div className="flex flex-col gap-2 border-t border-slate-200 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-xs text-slate-500">
            Showing{" "}
            <strong className="text-slate-700">
              {filteredQuizzes.length}
            </strong>{" "}
            of{" "}
            <strong className="text-slate-700">
              {quizCount}
            </strong>{" "}
            quizzes
          </p>

          <p className="text-[11px] text-slate-400">
            Quiz management is controlled by institution administration.
          </p>

        </div>

      </Card>

      {/* ============================================================
          QUIZ DETAILS MODAL
      ============================================================ */}

      {selectedQuiz && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* Header */}

            <div className="flex items-start justify-between bg-[#081022] p-6 text-white">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                  <ListChecks className="h-6 w-6" />
                </div>

                <div>

                  <p className="text-lg font-bold">
                    {selectedQuiz.title}
                  </p>

                  <p className="mt-1 text-xs text-slate-300">
                    {selectedQuiz.courseCode} ·{" "}
                    {selectedQuiz.courseTitle}
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={() => setSelectedQuiz(null)}
                className="rounded-lg p-2 text-slate-300 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

            </div>

            {/* Content */}

            <div className="space-y-5 p-6">

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-xs text-slate-500">
                    Quiz Status
                  </p>

                  <div className="mt-2">
                    <StatusBadge
                      status={selectedQuiz.status}
                    />
                  </div>

                </div>

                <Button
                  onClick={() => {
                    setSelectedQuiz(null);

                    navigate(
                      `/admin/quiz/${selectedQuiz.id}`
                    );
                  }}
                  className="gap-2 bg-[#006dcc] hover:bg-[#005ca8]"
                >
                  <Eye className="h-4 w-4" />
                  Open Quiz
                </Button>

              </div>

              {/* Details */}

              <div className="grid gap-4 sm:grid-cols-2">

                <div className="rounded-xl bg-slate-50 p-4">

                  <div className="flex items-center gap-2">

                    <BookOpen className="h-4 w-4 text-slate-400" />

                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Course
                    </p>

                  </div>

                  <p className="mt-2 text-sm font-bold text-[#081022]">
                    {selectedQuiz.courseCode}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {selectedQuiz.courseTitle}
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
                    {selectedQuiz.lecturer}
                  </p>

                </div>

                <div className="rounded-xl bg-slate-50 p-4">

                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Questions
                  </p>

                  <p className="mt-2 text-lg font-black text-[#081022]">
                    {selectedQuiz.questions}
                  </p>

                </div>

                <div className="rounded-xl bg-slate-50 p-4">

                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Duration
                  </p>

                  <p className="mt-2 text-lg font-black text-[#081022]">
                    {selectedQuiz.duration} minutes
                  </p>

                </div>

                <div className="rounded-xl bg-slate-50 p-4">

                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Student Attempts
                  </p>

                  <p className="mt-2 text-lg font-black text-[#081022]">
                    {selectedQuiz.attempts}
                  </p>

                </div>

                <div className="rounded-xl bg-slate-50 p-4">

                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Last Updated
                  </p>

                  <p className="mt-2 text-sm font-bold text-[#081022]">
                    {selectedQuiz.updated}
                  </p>

                </div>

              </div>

              {/* Admin actions */}

              <div className="border-t border-slate-200 pt-5">

                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Administration Actions
                </p>

                <div className="grid gap-2 sm:grid-cols-3">

                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() =>
                      navigate(`/admin/quiz/${selectedQuiz.id}/edit`)
                    }
                  >
                    <Pencil className="h-4 w-4" />
                    Edit Quiz
                  </Button>

                  {selectedQuiz.status === "Published" ? (

                    <Button
                      variant="outline"
                      className="gap-2 text-amber-700"
                    >
                      <PowerOff className="h-4 w-4" />
                      Unpublish
                    </Button>

                  ) : (

                    <Button
                      variant="outline"
                      className="gap-2 text-emerald-700"
                    >
                      <Power className="h-4 w-4" />
                      Publish
                    </Button>

                  )}

                  <Button
                    variant="outline"
                    className="gap-2 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </Button>

                </div>

              </div>

            </div>

            {/* Footer */}

            <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-6 py-4">

              <Button
                variant="outline"
                onClick={() => setSelectedQuiz(null)}
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