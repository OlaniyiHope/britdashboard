import { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  CalendarDays,
  CheckCircle2,
  Clock,
  Eye,
  Filter,
  GraduationCap,
  MonitorPlay,
  MoreHorizontal,
  Radio,
  Search,
  Signal,
  Users,
  UserRound,
  Video,
  X,
  Wifi,
  ChevronRight,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/*
|--------------------------------------------------------------------------
| TYPES
|--------------------------------------------------------------------------
*/

type SessionStatus = "Live" | "Starting Soon" | "Ended";
type SessionHealth = "Excellent" | "Good" | "Poor";

interface LiveSession {
  id: string;
  title: string;
  courseCode: string;
  course: string;
  lecturer: string;
  department: string;
  programme: string;
  startTime: string;
  duration: string;
  viewers: number;
  registeredStudents: number;
  status: SessionStatus;
  health: SessionHealth;
}

interface Participant {
  id: string;
  name: string;
  matricNumber: string;
  joinedAt: string;
  duration: string;
  status: "Watching" | "Left";
}

/*
|--------------------------------------------------------------------------
| TEMPORARY DATA
|--------------------------------------------------------------------------
*/

const liveSessions: LiveSession[] = [
  {
    id: "1",
    title: "Introduction to Database Systems",
    courseCode: "CSC 201",
    course: "Database Systems",
    lecturer: "Dr. Daniel Mensah",
    department: "Computing & Technology",
    programme: "Computer Science",
    startTime: "09:00 AM",
    duration: "1h 24m",
    viewers: 86,
    registeredStudents: 112,
    status: "Live",
    health: "Excellent",
  },
  {
    id: "2",
    title: "Engineering Mechanics II",
    courseCode: "MEC 204",
    course: "Engineering Mechanics",
    lecturer: "Engr. Michael Johnson",
    department: "Engineering",
    programme: "Mechanical Engineering",
    startTime: "10:30 AM",
    duration: "48m",
    viewers: 64,
    registeredStudents: 89,
    status: "Live",
    health: "Good",
  },
  {
    id: "3",
    title: "Financial Accounting",
    courseCode: "ACC 202",
    course: "Financial Accounting",
    lecturer: "Mrs. Grace Mensima",
    department: "Business Studies",
    programme: "Accounting",
    startTime: "12:00 PM",
    duration: "—",
    viewers: 0,
    registeredStudents: 76,
    status: "Starting Soon",
    health: "Good",
  },
  {
    id: "4",
    title: "Introduction to Information Technology",
    courseCode: "IFT 101",
    course: "Information Technology",
    lecturer: "Mr. Samuel Okoro",
    department: "Computing & Technology",
    programme: "Information Technology",
    startTime: "01:30 PM",
    duration: "—",
    viewers: 0,
    registeredStudents: 95,
    status: "Starting Soon",
    health: "Good",
  },
  {
    id: "5",
    title: "Business Communication",
    courseCode: "BUS 205",
    course: "Business Communication",
    lecturer: "Dr. Sarah Williams",
    department: "Business Studies",
    programme: "Business Administration",
    startTime: "08:00 AM",
    duration: "1h 10m",
    viewers: 71,
    registeredStudents: 82,
    status: "Ended",
    health: "Excellent",
  },
];

/*
|--------------------------------------------------------------------------
| PARTICIPANTS
|--------------------------------------------------------------------------
*/

const participants: Participant[] = [
  {
    id: "1",
    name: "Esther Adams",
    matricNumber: "BTP/INF/2024/045",
    joinedAt: "09:04 AM",
    duration: "1h 20m",
    status: "Watching",
  },
  {
    id: "2",
    name: "Daniel Mensah",
    matricNumber: "BTP/CSC/2024/001",
    joinedAt: "09:07 AM",
    duration: "1h 17m",
    status: "Watching",
  },
  {
    id: "3",
    name: "Sarah Williams",
    matricNumber: "BTP/BUS/2024/014",
    joinedAt: "09:11 AM",
    duration: "1h 13m",
    status: "Watching",
  },
  {
    id: "4",
    name: "Michael Johnson",
    matricNumber: "BTP/ENG/2025/008",
    joinedAt: "09:16 AM",
    duration: "1h 08m",
    status: "Watching",
  },
  {
    id: "5",
    name: "Grace Mensima",
    matricNumber: "BTP/ACC/2023/031",
    joinedAt: "09:22 AM",
    duration: "1h 02m",
    status: "Left",
  },
];

/*
|--------------------------------------------------------------------------
| STATUS BADGE
|--------------------------------------------------------------------------
*/

function SessionStatusBadge({
  status,
}: {
  status: SessionStatus;
}) {
  if (status === "Live") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-[11px] font-bold text-red-700">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-600" />
        LIVE
      </span>
    );
  }

  if (status === "Starting Soon") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[11px] font-bold text-amber-700">
        <Clock className="h-3 w-3" />
        Starting Soon
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">
      <CheckCircle2 className="h-3 w-3" />
      Ended
    </span>
  );
}

/*
|--------------------------------------------------------------------------
| HEALTH BADGE
|--------------------------------------------------------------------------
*/

function HealthBadge({
  health,
}: {
  health: SessionHealth;
}) {
  const styles: Record<SessionHealth, string> = {
    Excellent:
      "bg-emerald-50 text-emerald-700 border-emerald-200",
    Good:
      "bg-blue-50 text-blue-700 border-blue-200",
    Poor:
      "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${styles[health]}`}
    >
      <Signal className="h-3 w-3" />
      {health}
    </span>
  );
}

/*
|--------------------------------------------------------------------------
| PAGE
|--------------------------------------------------------------------------
*/

export default function LiveStreamMonitoring() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedSession, setSelectedSession] =
    useState<LiveSession | null>(null);

  const [showParticipants, setShowParticipants] =
    useState(false);

  /*
  |--------------------------------------------------------------------------
  | STATISTICS
  |--------------------------------------------------------------------------
  */

  const liveCount = liveSessions.filter(
    (session) => session.status === "Live"
  ).length;

  const totalViewers = liveSessions
    .filter((session) => session.status === "Live")
    .reduce((total, session) => total + session.viewers, 0);

  const upcomingCount = liveSessions.filter(
    (session) => session.status === "Starting Soon"
  ).length;

  const issueCount = liveSessions.filter(
    (session) => session.health === "Poor"
  ).length;

  /*
  |--------------------------------------------------------------------------
  | FILTER
  |--------------------------------------------------------------------------
  */

  const filteredSessions = useMemo(() => {
    const query = search.trim().toLowerCase();

    return liveSessions.filter((session) => {
      const matchesSearch =
        !query ||
        session.title.toLowerCase().includes(query) ||
        session.courseCode.toLowerCase().includes(query) ||
        session.course.toLowerCase().includes(query) ||
        session.lecturer.toLowerCase().includes(query) ||
        session.department.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        session.status === statusFilter;

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
            <MonitorPlay className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-[#081022] md:text-2xl">
              Live Stream Monitoring
            </h1>

            <p className="mt-1 text-xs text-slate-500">
              Monitor live academic classes, lecturers, student participation
              and session health.
            </p>
          </div>

        </div>

        <div className="flex items-center gap-2">

          <span className="inline-flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            Monitoring Active
          </span>

        </div>

      </div>

      {/* ============================================================
          STATISTICS
      ============================================================ */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* Live */}

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-5">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-medium text-slate-500">
                  Live Classes
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {liveCount}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Currently broadcasting
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <Radio className="h-5 w-5" />
              </div>

            </div>

          </CardContent>
        </Card>

        {/* Viewers */}

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-5">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-medium text-slate-500">
                  Active Viewers
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {totalViewers}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Students currently watching
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <Users className="h-5 w-5" />
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
                  Upcoming Sessions
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {upcomingCount}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Scheduled to start
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <CalendarDays className="h-5 w-5" />
              </div>

            </div>

          </CardContent>
        </Card>

        {/* Issues */}

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-5">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-medium text-slate-500">
                  Stream Issues
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {issueCount}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Sessions requiring attention
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <AlertTriangle className="h-5 w-5" />
              </div>

            </div>

          </CardContent>
        </Card>

      </div>

      {/* ============================================================
          LIVE NOW PANEL
      ============================================================ */}

      <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

        <div className="border-b border-slate-200 px-5 py-4">

          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <div className="flex items-center gap-2">

                <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />

                <h2 className="text-sm font-bold text-[#081022]">
                  Classes Live Now
                </h2>

              </div>

              <p className="mt-1 text-xs text-slate-500">
                Monitor lecturers and students currently participating in live
                classes.
              </p>

            </div>

            <span className="text-xs font-semibold text-slate-400">
              {liveCount} active session{liveCount !== 1 ? "s" : ""}
            </span>

          </div>

        </div>

        <div className="grid gap-4 p-5 lg:grid-cols-2">

          {liveSessions
            .filter((session) => session.status === "Live")
            .map((session) => (

              <div
                key={session.id}
                className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
              >

                {/* Session top */}

                <div className="flex items-start justify-between gap-3">

                  <div className="flex min-w-0 items-start gap-3">

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#081022] text-white">
                      <Video className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">

                      <div className="flex flex-wrap items-center gap-2">

                        <h3 className="text-sm font-bold text-[#081022]">
                          {session.title}
                        </h3>

                        <SessionStatusBadge status={session.status} />

                      </div>

                      <p className="mt-1 text-xs font-semibold text-[#006dcc]">
                        {session.courseCode}
                      </p>

                    </div>

                  </div>

                  <button
                    type="button"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-100"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </button>

                </div>

                {/* Lecturer */}

                <div className="mt-5 flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                    <UserRound className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Lecturer
                    </p>

                    <p className="text-sm font-bold text-slate-700">
                      {session.lecturer}
                    </p>
                  </div>

                </div>

                {/* Details */}

                <div className="mt-4 grid grid-cols-2 gap-3">

                  <div className="rounded-xl bg-white p-3 ring-1 ring-slate-200">

                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Students Watching
                    </p>

                    <div className="mt-2 flex items-center gap-2">

                      <Users className="h-4 w-4 text-blue-600" />

                      <span className="text-lg font-black text-[#081022]">
                        {session.viewers}
                      </span>

                      <span className="text-[10px] text-slate-400">
                        / {session.registeredStudents}
                      </span>

                    </div>

                  </div>

                  <div className="rounded-xl bg-white p-3 ring-1 ring-slate-200">

                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Duration
                    </p>

                    <div className="mt-2 flex items-center gap-2">

                      <Clock className="h-4 w-4 text-slate-500" />

                      <span className="text-sm font-black text-[#081022]">
                        {session.duration}
                      </span>

                    </div>

                  </div>

                </div>

                {/* Health */}

                <div className="mt-4 flex items-center justify-between">

                  <div className="flex items-center gap-2">

                    <Wifi className="h-4 w-4 text-slate-400" />

                    <span className="text-xs text-slate-500">
                      Stream health
                    </span>

                    <HealthBadge health={session.health} />

                  </div>

                  <span className="text-[11px] text-slate-400">
                    Started {session.startTime}
                  </span>

                </div>

                {/* Actions */}

                <div className="mt-5 flex gap-2">

                  <Button
                    onClick={() => setSelectedSession(session)}
                    className="flex-1 gap-2 bg-[#081022] hover:bg-[#111c35]"
                  >
                    <Eye className="h-4 w-4" />
                    Monitor Session
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => setShowParticipants(true)}
                    className="gap-2 border-slate-200 bg-white"
                  >
                    <Users className="h-4 w-4" />
                    Students
                  </Button>

                </div>

              </div>

            ))}

        </div>

      </Card>

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
                placeholder="Search by course, code, lecturer or department..."
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
                <option value="All">All Sessions</option>
                <option value="Live">Live</option>
                <option value="Starting Soon">
                  Starting Soon
                </option>
                <option value="Ended">Ended</option>
              </select>

            </div>

          </div>

        </CardContent>

      </Card>

      {/* ============================================================
          ALL SESSIONS
      ============================================================ */}

      <Card className="overflow-hidden border-none bg-white shadow-sm ring-1 ring-slate-200">

        <div className="border-b border-slate-200 px-5 py-4">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-sm font-bold text-[#081022]">
                Live Session Activity
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Current, upcoming and recently completed academic broadcasts.
              </p>

            </div>

            <Activity className="h-5 w-5 text-slate-400" />

          </div>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1100px]">

            <thead className="bg-slate-50">

              <tr className="border-b border-slate-200">

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Session
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Lecturer
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Programme
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Students
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Status
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Health
                </th>

                <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Action
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-slate-100">

              {filteredSessions.map((session) => (

                <tr
                  key={session.id}
                  className="transition hover:bg-slate-50"
                >

                  <td className="px-5 py-4">

                    <div>

                      <p className="text-sm font-bold text-[#081022]">
                        {session.title}
                      </p>

                      <p className="mt-1 text-xs font-semibold text-[#006dcc]">
                        {session.courseCode}
                      </p>

                    </div>

                  </td>

                  <td className="px-5 py-4">

                    <div className="flex items-center gap-2">

                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-600">
                        <UserRound className="h-4 w-4" />
                      </div>

                      <span className="text-xs font-semibold text-slate-700">
                        {session.lecturer}
                      </span>

                    </div>

                  </td>

                  <td className="px-5 py-4">

                    <div>

                      <p className="text-xs font-semibold text-slate-700">
                        {session.programme}
                      </p>

                      <p className="mt-1 text-[11px] text-slate-400">
                        {session.department}
                      </p>

                    </div>

                  </td>

                  <td className="px-5 py-4">

                    <div className="flex items-center gap-1.5">

                      <Users className="h-3.5 w-3.5 text-slate-400" />

                      <span className="text-xs font-bold text-slate-700">
                        {session.viewers}
                      </span>

                      {session.status === "Live" && (
                        <span className="text-[10px] text-slate-400">
                          watching
                        </span>
                      )}

                    </div>

                  </td>

                  <td className="px-5 py-4">

                    <SessionStatusBadge status={session.status} />

                  </td>

                  <td className="px-5 py-4">

                    <HealthBadge health={session.health} />

                  </td>

                  <td className="px-5 py-4">

                    <div className="flex justify-end">

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setSelectedSession(session)
                        }
                        className="h-8 gap-1.5 border-slate-200 text-xs"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </Button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </Card>

      {/* ============================================================
          UPCOMING SESSIONS
      ============================================================ */}

      <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

        <div className="border-b border-slate-200 px-5 py-4">

          <div className="flex items-center gap-2">

            <CalendarDays className="h-4 w-4 text-[#006dcc]" />

            <h2 className="text-sm font-bold text-[#081022]">
              Upcoming Live Sessions
            </h2>

          </div>

          <p className="mt-1 text-xs text-slate-500">
            Classes scheduled to begin later.
          </p>

        </div>

        <div className="divide-y divide-slate-100">

          {liveSessions
            .filter(
              (session) => session.status === "Starting Soon"
            )
            .map((session) => (

              <div
                key={session.id}
                className="flex flex-col gap-4 px-5 py-4 md:flex-row md:items-center md:justify-between"
              >

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                    <GraduationCap className="h-5 w-5" />
                  </div>

                  <div>

                    <p className="text-sm font-bold text-[#081022]">
                      {session.title}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {session.courseCode} · {session.lecturer}
                    </p>

                  </div>

                </div>

                <div className="flex items-center gap-6">

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Starts
                    </p>

                    <p className="mt-1 text-xs font-bold text-slate-700">
                      {session.startTime}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Registered
                    </p>

                    <p className="mt-1 flex items-center gap-1 text-xs font-bold text-slate-700">
                      <Users className="h-3.5 w-3.5" />
                      {session.registeredStudents}
                    </p>
                  </div>

                  <ChevronRight className="h-4 w-4 text-slate-400" />

                </div>

              </div>

            ))}

        </div>

      </Card>

      {/* ============================================================
          SESSION DETAILS MODAL
      ============================================================ */}

      {selectedSession && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* Header */}

            <div className="flex items-start justify-between bg-[#081022] p-6 text-white">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                  <Video className="h-5 w-5" />
                </div>

                <div>

                  <div className="flex items-center gap-2">
                    <p className="text-lg font-bold">
                      {selectedSession.title}
                    </p>

                    <SessionStatusBadge
                      status={selectedSession.status}
                    />
                  </div>

                  <p className="mt-1 text-xs text-slate-300">
                    {selectedSession.courseCode} ·{" "}
                    {selectedSession.lecturer}
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={() => setSelectedSession(null)}
                className="rounded-lg p-2 text-slate-300 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

            </div>

            {/* Content */}

            <div className="space-y-5 p-6">

              <div className="grid gap-3 sm:grid-cols-3">

                <div className="rounded-xl bg-slate-50 p-4">

                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Lecturer
                  </p>

                  <p className="mt-2 text-sm font-bold text-[#081022]">
                    {selectedSession.lecturer}
                  </p>

                </div>

                <div className="rounded-xl bg-slate-50 p-4">

                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Active Students
                  </p>

                  <p className="mt-2 flex items-center gap-2 text-lg font-black text-[#081022]">
                    <Users className="h-4 w-4 text-blue-600" />
                    {selectedSession.viewers}
                  </p>

                </div>

                <div className="rounded-xl bg-slate-50 p-4">

                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Stream Health
                  </p>

                  <div className="mt-2">
                    <HealthBadge
                      health={selectedSession.health}
                    />
                  </div>

                </div>

              </div>

              <div>

                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Session Information
                </p>

                <div className="grid gap-3 sm:grid-cols-2">

                  <div>
                    <p className="text-xs text-slate-400">
                      Programme
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      {selectedSession.programme}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Department
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      {selectedSession.department}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Start Time
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      {selectedSession.startTime}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">
                      Duration
                    </p>

                    <p className="mt-1 text-sm font-semibold text-slate-700">
                      {selectedSession.duration}
                    </p>
                  </div>

                </div>

              </div>

            </div>

            {/* Footer */}

            <div className="flex flex-col gap-2 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:justify-end">

              {selectedSession.status === "Live" && (
                <Button
                  onClick={() => setShowParticipants(true)}
                  className="gap-2 bg-[#006dcc] hover:bg-[#005ca8]"
                >
                  <Users className="h-4 w-4" />
                  View Participants
                </Button>
              )}

              <Button
                variant="outline"
                onClick={() => setSelectedSession(null)}
              >
                Close
              </Button>

            </div>

          </div>

        </div>

      )}

      {/* ============================================================
          PARTICIPANTS MODAL
      ============================================================ */}

      {showParticipants && (

        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

              <div>

                <h2 className="text-lg font-bold text-[#081022]">
                  Live Participants
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Students currently attending or recently left the session.
                </p>

              </div>

              <button
                type="button"
                onClick={() => setShowParticipants(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>

            </div>

            <div className="max-h-[450px] overflow-y-auto">

              {participants.map((participant) => (

                <div
                  key={participant.id}
                  className="flex items-center justify-between border-b border-slate-100 px-6 py-4"
                >

                  <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#081022] text-xs font-bold text-white">
                      {participant.name
                        .split(" ")
                        .map((name) => name[0])
                        .slice(0, 2)
                        .join("")}
                    </div>

                    <div>

                      <p className="text-sm font-bold text-[#081022]">
                        {participant.name}
                      </p>

                      <p className="mt-1 text-[11px] text-slate-400">
                        {participant.matricNumber}
                      </p>

                    </div>

                  </div>

                  <div className="text-right">

                    <p
                      className={`text-xs font-bold ${
                        participant.status === "Watching"
                          ? "text-emerald-600"
                          : "text-slate-400"
                      }`}
                    >
                      {participant.status}
                    </p>

                    <p className="mt-1 text-[10px] text-slate-400">
                      Joined {participant.joinedAt} ·{" "}
                      {participant.duration}
                    </p>

                  </div>

                </div>

              ))}

            </div>

            <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-6 py-4">

              <Button
                variant="outline"
                onClick={() => setShowParticipants(false)}
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