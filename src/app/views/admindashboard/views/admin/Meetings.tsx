import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Plus,
  Eye,
  CalendarDays,
  Clock,
  Users,
  Video,
  MapPin,
  UserRound,
  BookOpen,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  X,
  Radio,
  CheckCircle2,
  AlertCircle,
  CalendarCheck,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type LectureStatus =
  | "Upcoming"
  | "Live"
  | "Completed"
  | "Cancelled";

interface Lecture {
  id: string;
  title: string;
  courseCode: string;
  course: string;
  lecturer: string;
  department: string;
  date: string;
  time: string;
  duration: string;
  venue: string;
  mode: "Physical" | "Online" | "Hybrid";
  students: number;
  attendance: number;
  status: LectureStatus;
  updated: string;
}

const lectures: Lecture[] = [
  {
    id: "1",
    title: "Introduction to Data Structures",
    courseCode: "CSC 201",
    course: "Data Structures & Algorithms",
    lecturer: "Dr. Michael Johnson",
    department: "Computing & Technology",
    date: "26 Aug 2026",
    time: "10:00 AM",
    duration: "2 hrs",
    venue: "Lecture Hall A",
    mode: "Physical",
    students: 86,
    attendance: 74,
    status: "Live",
    updated: "2 mins ago",
  },
  {
    id: "2",
    title: "Financial Accounting II",
    courseCode: "ACC 204",
    course: "Financial Accounting",
    lecturer: "Mrs. Grace Mensima",
    department: "Business Studies",
    date: "26 Aug 2026",
    time: "12:00 PM",
    duration: "1 hr 30 mins",
    venue: "Online Classroom",
    mode: "Online",
    students: 64,
    attendance: 0,
    status: "Upcoming",
    updated: "15 mins ago",
  },
  {
    id: "3",
    title: "Engineering Mechanics",
    courseCode: "MEC 202",
    course: "Engineering Mechanics",
    lecturer: "Engr. Samuel Okoro",
    department: "Engineering",
    date: "26 Aug 2026",
    time: "2:00 PM",
    duration: "2 hrs",
    venue: "Engineering Block B",
    mode: "Hybrid",
    students: 92,
    attendance: 0,
    status: "Upcoming",
    updated: "32 mins ago",
  },
  {
    id: "4",
    title: "Introduction to Programming",
    courseCode: "CSC 101",
    course: "Programming Fundamentals",
    lecturer: "Mr. Daniel Mensah",
    department: "Computing & Technology",
    date: "25 Aug 2026",
    time: "9:00 AM",
    duration: "2 hrs",
    venue: "Computer Lab 1",
    mode: "Physical",
    students: 78,
    attendance: 71,
    status: "Completed",
    updated: "Yesterday",
  },
  {
    id: "5",
    title: "Business Communication",
    courseCode: "BUS 105",
    course: "Business Communication",
    lecturer: "Dr. Sarah Williams",
    department: "Business Studies",
    date: "25 Aug 2026",
    time: "1:00 PM",
    duration: "1 hr",
    venue: "Online Classroom",
    mode: "Online",
    students: 57,
    attendance: 48,
    status: "Completed",
    updated: "Yesterday",
  },
  {
    id: "6",
    title: "Thermodynamics",
    courseCode: "MEC 305",
    course: "Engineering Thermodynamics",
    lecturer: "Dr. David Adams",
    department: "Engineering",
    date: "27 Aug 2026",
    time: "11:00 AM",
    duration: "2 hrs",
    venue: "Engineering Hall",
    mode: "Physical",
    students: 71,
    attendance: 0,
    status: "Upcoming",
    updated: "1 hr ago",
  },
];

/* -------------------------------------------------------------------------- */
/* STATUS BADGE                                                               */
/* -------------------------------------------------------------------------- */

function StatusBadge({ status }: { status: LectureStatus }) {
  const styles: Record<LectureStatus, string> = {
    Upcoming:
      "bg-blue-50 text-blue-700 border-blue-200",
    Live:
      "bg-red-50 text-red-700 border-red-200",
    Completed:
      "bg-emerald-50 text-emerald-700 border-emerald-200",
    Cancelled:
      "bg-slate-100 text-slate-600 border-slate-200",
  };

  const icons = {
    Upcoming: CalendarCheck,
    Live: Radio,
    Completed: CheckCircle2,
    Cancelled: AlertCircle,
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

/* -------------------------------------------------------------------------- */
/* MODE BADGE                                                                 */
/* -------------------------------------------------------------------------- */

function ModeBadge({ mode }: { mode: Lecture["mode"] }) {
  if (mode === "Online") {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-purple-50 px-2 py-1 text-[11px] font-semibold text-purple-700">
        <Video className="h-3 w-3" />
        Online
      </span>
    );
  }

  if (mode === "Hybrid") {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-1 text-[11px] font-semibold text-amber-700">
        <Video className="h-3 w-3" />
        Hybrid
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700">
      <MapPin className="h-3 w-3" />
      Physical
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/* PAGE                                                                       */
/* -------------------------------------------------------------------------- */

export default function Meetings() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] =
    useState("All");
  const [selectedLecture, setSelectedLecture] =
    useState<Lecture | null>(null);

  /* ------------------------------------------------------------------------ */
  /* COUNTS                                                                   */
  /* ------------------------------------------------------------------------ */

  const totalLectures = lectures.length;

  const liveLectures = lectures.filter(
    (lecture) => lecture.status === "Live"
  ).length;

  const upcomingLectures = lectures.filter(
    (lecture) => lecture.status === "Upcoming"
  ).length;

  const completedLectures = lectures.filter(
    (lecture) => lecture.status === "Completed"
  ).length;

  /* ------------------------------------------------------------------------ */
  /* DEPARTMENTS                                                              */
  /* ------------------------------------------------------------------------ */

  const departments = useMemo(() => {
    return Array.from(
      new Set(lectures.map((lecture) => lecture.department))
    );
  }, []);

  /* ------------------------------------------------------------------------ */
  /* FILTERING                                                                */
  /* ------------------------------------------------------------------------ */

  const filteredLectures = useMemo(() => {
    const query = search.trim().toLowerCase();

    return lectures.filter((lecture) => {
      const matchesSearch =
        !query ||
        lecture.title.toLowerCase().includes(query) ||
        lecture.course.toLowerCase().includes(query) ||
        lecture.courseCode.toLowerCase().includes(query) ||
        lecture.lecturer.toLowerCase().includes(query) ||
        lecture.venue.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        lecture.status === statusFilter;

      const matchesDepartment =
        departmentFilter === "All" ||
        lecture.department === departmentFilter;

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

  return (
    <div className="min-h-full space-y-6 bg-slate-50 p-4 md:p-6">

      {/* ================================================================== */}
      {/* HEADER                                                             */}
      {/* ================================================================== */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#081022] text-white">
              <BookOpen className="h-5 w-5" />
            </div>

            <div>
              <h1 className="text-xl font-bold text-[#081022] md:text-2xl">
                Lecture Management
              </h1>

              <p className="mt-1 text-xs text-slate-500">
                Manage institutional lectures, schedules, lecturers,
                attendance and delivery modes.
              </p>
            </div>

          </div>
        </div>

        <Button
          onClick={() =>
            navigate("/admin/meetings/create")
          }
          className="gap-2 bg-[#006dcc] hover:bg-[#005ca8]"
        >
          <Plus className="h-4 w-4" />
          Schedule Lecture
        </Button>

      </div>

      {/* ================================================================== */}
      {/* LIVE LECTURE ALERT                                                 */}
      {/* ================================================================== */}

      {liveLectures > 0 && (
        <Card className="border-none bg-white shadow-sm ring-1 ring-red-200">
          <CardContent className="p-4">

            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600">
                  <Radio className="h-5 w-5 animate-pulse" />
                </div>

                <div>
                  <p className="text-sm font-bold text-[#081022]">
                    {liveLectures} lecture currently live
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Students are currently attending an active lecture.
                  </p>
                </div>

              </div>

              <Button
                variant="outline"
                onClick={() =>
                  navigate("/admin/studio/live-stream")
                }
                className="gap-2 border-red-200 text-red-600 hover:bg-red-50"
              >
                <Video className="h-4 w-4" />
                Monitor Live Session
              </Button>

            </div>

          </CardContent>
        </Card>
      )}

      {/* ================================================================== */}
      {/* STATISTICS                                                         */}
      {/* ================================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* Total */}

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-5">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-medium text-slate-500">
                  Total Lectures
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {totalLectures}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Scheduled lecture sessions
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <BookOpen className="h-5 w-5" />
              </div>

            </div>

          </CardContent>
        </Card>

        {/* Live */}

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-5">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-medium text-slate-500">
                  Live Now
                </p>

                <p className="mt-2 text-3xl font-black text-red-600">
                  {liveLectures}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Currently in progress
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <Radio className="h-5 w-5" />
              </div>

            </div>

          </CardContent>
        </Card>

        {/* Upcoming */}

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-5">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-medium text-slate-500">
                  Upcoming
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {upcomingLectures}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Scheduled to start
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <CalendarDays className="h-5 w-5" />
              </div>

            </div>

          </CardContent>
        </Card>

        {/* Completed */}

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-5">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-medium text-slate-500">
                  Completed
                </p>

                <p className="mt-2 text-3xl font-black text-emerald-600">
                  {completedLectures}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Completed sessions
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <CheckCircle2 className="h-5 w-5" />
              </div>

            </div>

          </CardContent>
        </Card>

      </div>

      {/* ================================================================== */}
      {/* SEARCH + FILTER                                                    */}
      {/* ================================================================== */}

      <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

        <CardContent className="p-4">

          <div className="flex flex-col gap-3 xl:flex-row">

            <div className="relative flex-1">

              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search by lecture, course, lecturer, code or venue..."
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
                <option value="Live">
                  Live
                </option>
                <option value="Upcoming">
                  Upcoming
                </option>
                <option value="Completed">
                  Completed
                </option>
                <option value="Cancelled">
                  Cancelled
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

      {/* ================================================================== */}
      {/* LECTURES TABLE                                                     */}
      {/* ================================================================== */}

      <Card className="overflow-hidden border-none bg-white shadow-sm ring-1 ring-slate-200">

        <div className="border-b border-slate-200 px-5 py-4">

          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h2 className="text-sm font-bold text-[#081022]">
                Lecture Sessions
              </h2>

              <p className="text-xs text-slate-500">
                {filteredLectures.length} lecture
                {filteredLectures.length !== 1
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

          <table className="w-full min-w-[1200px]">

            <thead className="bg-slate-50">

              <tr className="border-b border-slate-200">

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Lecture
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Lecturer
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Schedule
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Venue / Mode
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Students
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

              {filteredLectures.length === 0 ? (

                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-16 text-center"
                  >
                    <BookOpen className="mx-auto h-8 w-8 text-slate-300" />

                    <p className="mt-3 text-sm font-semibold text-slate-500">
                      No lectures found
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Try changing your search or filters.
                    </p>
                  </td>
                </tr>

              ) : (

                filteredLectures.map((lecture) => (

                  <tr
                    key={lecture.id}
                    className="transition hover:bg-slate-50"
                  >

                    {/* Lecture */}

                    <td className="px-5 py-4">

                      <div className="flex items-start gap-3">

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                          <BookOpen className="h-4 w-4" />
                        </div>

                        <div className="min-w-0">

                          <p className="text-sm font-bold text-[#081022]">
                            {lecture.title}
                          </p>

                          <p className="mt-1 text-xs font-semibold text-[#006dcc]">
                            {lecture.courseCode}
                          </p>

                          <p className="mt-0.5 text-[11px] text-slate-500">
                            {lecture.course}
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* Lecturer */}

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-2">

                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                          <UserRound className="h-4 w-4" />
                        </div>

                        <div>

                          <p className="text-xs font-semibold text-slate-700">
                            {lecture.lecturer}
                          </p>

                          <p className="mt-0.5 text-[10px] text-slate-400">
                            {lecture.department}
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* Schedule */}

                    <td className="px-5 py-4">

                      <div className="space-y-1">

                        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                          <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                          {lecture.date}
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <Clock className="h-3.5 w-3.5 text-slate-400" />
                          {lecture.time} · {lecture.duration}
                        </div>

                      </div>

                    </td>

                    {/* Venue */}

                    <td className="px-5 py-4">

                      <div className="space-y-2">

                        <div className="flex items-center gap-1.5 text-xs text-slate-600">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          {lecture.venue}
                        </div>

                        <ModeBadge mode={lecture.mode} />

                      </div>

                    </td>

                    {/* Students */}

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-2">

                        <Users className="h-4 w-4 text-slate-400" />

                        <div>
                          <p className="text-xs font-bold text-slate-700">
                            {lecture.students}
                          </p>

                          {lecture.status === "Completed" && (
                            <p className="text-[10px] text-emerald-600">
                              {lecture.attendance} attended
                            </p>
                          )}

                          {lecture.status === "Live" && (
                            <p className="text-[10px] text-red-600">
                              {lecture.attendance} present
                            </p>
                          )}
                        </div>

                      </div>

                    </td>

                    {/* Status */}

                    <td className="px-5 py-4">
                      <StatusBadge status={lecture.status} />
                    </td>

                    {/* Action */}

                    <td className="px-5 py-4">

                      <div className="flex justify-end gap-2">

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setSelectedLecture(lecture)
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

        {/* Pagination */}

        <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3">

          <p className="text-xs text-slate-500">
            Showing{" "}
            <strong className="text-slate-700">
              {filteredLectures.length}
            </strong>{" "}
            of{" "}
            <strong className="text-slate-700">
              {totalLectures}
            </strong>{" "}
            lectures
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

      {/* ================================================================== */}
      {/* LECTURE DETAILS MODAL                                              */}
      {/* ================================================================== */}

      {selectedLecture && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* Header */}

            <div className="flex items-start justify-between bg-[#081022] p-6 text-white">

              <div>

                <div className="flex items-center gap-2">

                  {selectedLecture.status === "Live" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-red-500/20 px-2 py-1 text-[10px] font-bold text-red-300">
                      <Radio className="h-3 w-3" />
                      LIVE NOW
                    </span>
                  )}

                  <StatusBadge
                    status={selectedLecture.status}
                  />

                </div>

                <h2 className="mt-3 text-lg font-bold">
                  {selectedLecture.title}
                </h2>

                <p className="mt-1 text-xs text-slate-300">
                  {selectedLecture.courseCode} ·{" "}
                  {selectedLecture.course}
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedLecture(null)
                }
                className="rounded-lg p-2 text-slate-300 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

            </div>

            {/* Content */}

            <div className="space-y-5 p-6">

              {/* Lecturer */}

              <div className="rounded-xl bg-slate-50 p-4">

                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Lecturer
                </p>

                <div className="mt-2 flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#081022] text-white">
                    <UserRound className="h-4 w-4" />
                  </div>

                  <div>

                    <p className="text-sm font-bold text-[#081022]">
                      {selectedLecture.lecturer}
                    </p>

                    <p className="text-xs text-slate-500">
                      {selectedLecture.department}
                    </p>

                  </div>

                </div>

              </div>

              {/* Details */}

              <div className="grid gap-4 sm:grid-cols-2">

                <div className="rounded-xl bg-slate-50 p-4">

                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Date & Time
                  </p>

                  <div className="mt-2 space-y-1">

                    <p className="flex items-center gap-2 text-sm font-bold text-[#081022]">
                      <CalendarDays className="h-4 w-4 text-slate-400" />
                      {selectedLecture.date}
                    </p>

                    <p className="flex items-center gap-2 text-xs text-slate-500">
                      <Clock className="h-4 w-4 text-slate-400" />
                      {selectedLecture.time} ·{" "}
                      {selectedLecture.duration}
                    </p>

                  </div>

                </div>

                <div className="rounded-xl bg-slate-50 p-4">

                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Venue
                  </p>

                  <p className="mt-2 flex items-center gap-2 text-sm font-bold text-[#081022]">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    {selectedLecture.venue}
                  </p>

                  <div className="mt-2">
                    <ModeBadge
                      mode={selectedLecture.mode}
                    />
                  </div>

                </div>

              </div>

              {/* Attendance */}

              <div className="rounded-xl border border-slate-200 p-4">

                <div className="flex items-center justify-between">

                  <div>

                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Attendance
                    </p>

                    <p className="mt-1 text-sm font-bold text-[#081022]">
                      {selectedLecture.attendance} of{" "}
                      {selectedLecture.students} students
                    </p>

                  </div>

                  <Users className="h-5 w-5 text-slate-400" />

                </div>

                {selectedLecture.status !== "Upcoming" && (
                  <div className="mt-3">

                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                      <div
                        className="h-full rounded-full bg-[#006dcc]"
                        style={{
                          width: `${Math.min(
                            100,
                            (selectedLecture.attendance /
                              selectedLecture.students) *
                              100
                          )}%`,
                        }}
                      />

                    </div>

                    <p className="mt-2 text-[11px] text-slate-500">
                      {Math.round(
                        (selectedLecture.attendance /
                          selectedLecture.students) *
                          100
                      )}
                      % attendance
                    </p>

                  </div>
                )}

              </div>

              {/* Live monitoring */}

              {selectedLecture.status === "Live" && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4">

                  <div className="flex items-center justify-between">

                    <div className="flex items-center gap-3">

                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-100 text-red-600">
                        <Radio className="h-4 w-4" />
                      </div>

                      <div>

                        <p className="text-sm font-bold text-red-800">
                          Lecture is currently live
                        </p>

                        <p className="mt-1 text-xs text-red-600">
                          {selectedLecture.attendance} students
                          currently marked present.
                        </p>

                      </div>

                    </div>

                    <Button
                      onClick={() => {
                        setSelectedLecture(null);
                        navigate(
                          "/admin/studio/live-stream"
                        );
                      }}
                      className="gap-2 bg-red-600 hover:bg-red-700"
                    >
                      <Video className="h-4 w-4" />
                      Monitor
                    </Button>

                  </div>

                </div>
              )}

            </div>

            {/* Footer */}

            <div className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50 px-6 py-4">

              <Button
                variant="outline"
                onClick={() =>
                  setSelectedLecture(null)
                }
              >
                Close
              </Button>

              {selectedLecture.status === "Upcoming" && (
                <Button
                  onClick={() => {
                    setSelectedLecture(null);
                    navigate(
                      `/admin/meetings/${selectedLecture.id}/edit`
                    );
                  }}
                  className="bg-[#006dcc] hover:bg-[#005ca8]"
                >
                  Edit Lecture
                </Button>
              )}

            </div>

          </div>

        </div>

      )}

    </div>
  );
}