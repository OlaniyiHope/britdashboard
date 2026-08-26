import { useMemo, useState } from "react";
import {
  Activity,
  AlertTriangle,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Download,
  Eye,
  Filter,
  GraduationCap,
  LogIn,
  MessageSquare,
  PlayCircle,
  Search,
  UserPlus,
  Users,
  X,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type ActivityType =
  | "Login"
  | "Course"
  | "Assignment"
  | "Quiz"
  | "Live Class"
  | "Registration"
  | "Discussion"
  | "System"
  | "Alert";

type ActivityStatus =
  | "Completed"
  | "Active"
  | "Pending"
  | "Warning"
  | "Failed";

interface ActivityEvent {
  id: string;
  user: string;
  role: "Student" | "Lecturer" | "Admin" | "System";
  avatar: string;
  type: ActivityType;
  title: string;
  description: string;
  course?: string;
  status: ActivityStatus;
  time: string;
  timestamp: string;
  ip?: string;
}

const activities: ActivityEvent[] = [
  {
    id: "ACT-001",
    user: "Daniel Mensah",
    role: "Student",
    avatar: "DM",
    type: "Quiz",
    title: "Completed a quiz",
    description: "Completed Introduction to Programming Quiz 2.",
    course: "CSC 201 - Introduction to Programming",
    status: "Completed",
    time: "2 minutes ago",
    timestamp: "26 Aug 2026, 10:42 AM",
    ip: "102.89.24.11",
  },
  {
    id: "ACT-002",
    user: "Dr. Michael Johnson",
    role: "Lecturer",
    avatar: "MJ",
    type: "Live Class",
    title: "Started a live class",
    description: "Started a live lecture session.",
    course: "MEE 301 - Thermodynamics",
    status: "Active",
    time: "5 minutes ago",
    timestamp: "26 Aug 2026, 10:39 AM",
    ip: "105.112.18.42",
  },
  {
    id: "ACT-003",
    user: "Sarah Williams",
    role: "Student",
    avatar: "SW",
    type: "Course",
    title: "Opened course material",
    description: "Viewed Week 4 course material.",
    course: "BUS 205 - Business Management",
    status: "Active",
    time: "8 minutes ago",
    timestamp: "26 Aug 2026, 10:36 AM",
    ip: "197.210.54.91",
  },
  {
    id: "ACT-004",
    user: "Grace Mensima",
    role: "Student",
    avatar: "GM",
    type: "Assignment",
    title: "Submitted an assignment",
    description: "Submitted the Week 5 assignment.",
    course: "ACC 302 - Financial Accounting",
    status: "Completed",
    time: "14 minutes ago",
    timestamp: "26 Aug 2026, 10:30 AM",
    ip: "41.58.104.22",
  },
  {
    id: "ACT-005",
    user: "Samuel Okoro",
    role: "Student",
    avatar: "SO",
    type: "Discussion",
    title: "Posted in course forum",
    description: "Created a new discussion thread.",
    course: "CVE 401 - Structural Engineering",
    status: "Completed",
    time: "21 minutes ago",
    timestamp: "26 Aug 2026, 10:23 AM",
    ip: "102.88.17.65",
  },
  {
    id: "ACT-006",
    user: "Esther Adams",
    role: "Student",
    avatar: "EA",
    type: "Login",
    title: "Signed into the platform",
    description: "Student successfully logged in.",
    status: "Completed",
    time: "28 minutes ago",
    timestamp: "26 Aug 2026, 10:16 AM",
    ip: "154.113.92.14",
  },
  {
    id: "ACT-007",
    user: "John Mensah",
    role: "Lecturer",
    avatar: "JM",
    type: "Course",
    title: "Uploaded course material",
    description: "Uploaded a new lecture note.",
    course: "CSC 305 - Database Systems",
    status: "Completed",
    time: "35 minutes ago",
    timestamp: "26 Aug 2026, 10:09 AM",
    ip: "105.112.44.21",
  },
  {
    id: "ACT-008",
    user: "Platform System",
    role: "System",
    avatar: "SY",
    type: "Alert",
    title: "High activity detected",
    description: "Unusually high traffic detected on the quiz service.",
    status: "Warning",
    time: "42 minutes ago",
    timestamp: "26 Aug 2026, 10:02 AM",
  },
  {
    id: "ACT-009",
    user: "David Anderson",
    role: "Student",
    avatar: "DA",
    type: "Registration",
    title: "Registered courses",
    description: "Completed course registration for the semester.",
    course: "2026/2027 Academic Session",
    status: "Completed",
    time: "51 minutes ago",
    timestamp: "26 Aug 2026, 09:53 AM",
    ip: "102.90.18.31",
  },
  {
    id: "ACT-010",
    user: "Admin",
    role: "Admin",
    avatar: "AD",
    type: "System",
    title: "Updated academic settings",
    description: "Updated the current academic session settings.",
    status: "Completed",
    time: "1 hour ago",
    timestamp: "26 Aug 2026, 09:42 AM",
    ip: "41.190.12.88",
  },
];

function TypeIcon({ type }: { type: ActivityType }) {
  const icons: Record<ActivityType, React.ReactNode> = {
    Login: <LogIn className="h-4 w-4" />,
    Course: <BookOpen className="h-4 w-4" />,
    Assignment: <CheckCircle2 className="h-4 w-4" />,
    Quiz: <GraduationCap className="h-4 w-4" />,
    "Live Class": <PlayCircle className="h-4 w-4" />,
    Registration: <UserPlus className="h-4 w-4" />,
    Discussion: <MessageSquare className="h-4 w-4" />,
    System: <Activity className="h-4 w-4" />,
    Alert: <AlertTriangle className="h-4 w-4" />,
  };

  return icons[type];
}

function typeStyle(type: ActivityType) {
  const styles: Record<ActivityType, string> = {
    Login: "bg-blue-50 text-blue-700",
    Course: "bg-indigo-50 text-indigo-700",
    Assignment: "bg-emerald-50 text-emerald-700",
    Quiz: "bg-purple-50 text-purple-700",
    "Live Class": "bg-red-50 text-red-700",
    Registration: "bg-cyan-50 text-cyan-700",
    Discussion: "bg-orange-50 text-orange-700",
    System: "bg-slate-100 text-slate-700",
    Alert: "bg-amber-50 text-amber-700",
  };

  return styles[type];
}

function StatusBadge({ status }: { status: ActivityStatus }) {
  const styles: Record<ActivityStatus, string> = {
    Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Active: "bg-blue-50 text-blue-700 border-blue-200",
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
    Warning: "bg-orange-50 text-orange-700 border-orange-200",
    Failed: "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold ${styles[status]}`}
    >
      {status}
    </span>
  );
}

export default function ActivityStream() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");
  const [selectedActivity, setSelectedActivity] =
    useState<ActivityEvent | null>(null);

  const filteredActivities = useMemo(() => {
    const query = search.trim().toLowerCase();

    return activities.filter((activity) => {
      const matchesSearch =
        !query ||
        activity.user.toLowerCase().includes(query) ||
        activity.title.toLowerCase().includes(query) ||
        activity.description.toLowerCase().includes(query) ||
        activity.course?.toLowerCase().includes(query);

      const matchesType =
        typeFilter === "All" || activity.type === typeFilter;

      const matchesRole =
        roleFilter === "All" || activity.role === roleFilter;

      return matchesSearch && matchesType && matchesRole;
    });
  }, [search, typeFilter, roleFilter]);

  const eventsCount = activities.length;

  const studentCount = new Set(
    activities
      .filter((activity) => activity.role === "Student")
      .map((activity) => activity.user)
  ).size;

  const courseCount = new Set(
    activities
      .filter((activity) => activity.course)
      .map((activity) => activity.course)
  ).size;

  const alertCount = activities.filter(
    (activity) =>
      activity.status === "Warning" || activity.type === "Alert"
  ).length;

  const liveCount = activities.filter(
    (activity) => activity.type === "Live Class" && activity.status === "Active"
  ).length;

  const handleExport = () => {
    const headers = [
      "User",
      "Role",
      "Activity",
      "Description",
      "Course",
      "Status",
      "Time",
    ];

    const rows = filteredActivities.map((activity) => [
      activity.user,
      activity.role,
      activity.title,
      activity.description,
      activity.course || "",
      activity.status,
      activity.timestamp,
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
    link.download = "activity-stream.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-full space-y-6 bg-slate-50 p-4 md:p-6">

      {/* HEADER */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#081022] text-white">
            <Activity className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-[#081022] md:text-2xl">
              Activity Stream
            </h1>

            <p className="mt-1 text-xs text-slate-500">
              Monitor recent student, lecturer and platform activity.
            </p>
          </div>

        </div>

        <Button
          variant="outline"
          onClick={handleExport}
          className="gap-2 border-slate-300 bg-white"
        >
          <Download className="h-4 w-4" />
          Export Activity
        </Button>

      </div>

      {/* STATS */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-5">
            <p className="text-xs font-medium text-slate-500">
              Events Today
            </p>
            <p className="mt-2 text-3xl font-black text-[#081022]">
              {eventsCount}
            </p>
            <p className="mt-1 text-[11px] text-slate-400">
              Recorded platform events
            </p>
          </CardContent>
        </Card>

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-5">
            <p className="text-xs font-medium text-slate-500">
              Active Students
            </p>
            <p className="mt-2 text-3xl font-black text-[#081022]">
              {studentCount}
            </p>
            <p className="mt-1 text-[11px] text-slate-400">
              Students generating activity
            </p>
          </CardContent>
        </Card>

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-5">
            <p className="text-xs font-medium text-slate-500">
              Active Courses
            </p>
            <p className="mt-2 text-3xl font-black text-[#081022]">
              {courseCount}
            </p>
            <p className="mt-1 text-[11px] text-slate-400">
              Courses with recent activity
            </p>
          </CardContent>
        </Card>

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-5">
            <p className="text-xs font-medium text-slate-500">
              Alerts
            </p>
            <p className="mt-2 text-3xl font-black text-[#081022]">
              {alertCount}
            </p>
            <p className="mt-1 text-[11px] text-slate-400">
              Events requiring attention
            </p>
          </CardContent>
        </Card>

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-5">
            <p className="text-xs font-medium text-slate-500">
              Live Classes
            </p>
            <p className="mt-2 text-3xl font-black text-[#081022]">
              {liveCount}
            </p>
            <p className="mt-1 text-[11px] text-slate-400">
              Currently active
            </p>
          </CardContent>
        </Card>

      </div>

      {/* FILTERS */}

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
                placeholder="Search activity, student, lecturer or course..."
                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none focus:border-[#006dcc] focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400" />

              <select
                value={typeFilter}
                onChange={(event) =>
                  setTypeFilter(event.target.value)
                }
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none"
              >
                <option value="All">All Activities</option>
                <option value="Login">Login</option>
                <option value="Course">Course</option>
                <option value="Assignment">Assignment</option>
                <option value="Quiz">Quiz</option>
                <option value="Live Class">Live Class</option>
                <option value="Registration">Registration</option>
                <option value="Discussion">Discussion</option>
                <option value="System">System</option>
                <option value="Alert">Alert</option>
              </select>
            </div>

            <select
              value={roleFilter}
              onChange={(event) =>
                setRoleFilter(event.target.value)
              }
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none"
            >
              <option value="All">All Users</option>
              <option value="Student">Students</option>
              <option value="Lecturer">Lecturers</option>
              <option value="Admin">Admins</option>
              <option value="System">System</option>
            </select>

          </div>

        </CardContent>
      </Card>

      {/* ACTIVITY TABLE */}

      <Card className="overflow-hidden border-none bg-white shadow-sm ring-1 ring-slate-200">

        <div className="border-b border-slate-200 px-5 py-4">

          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-sm font-bold text-[#081022]">
                Recent Activity
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                {filteredActivities.length} event
                {filteredActivities.length !== 1 ? "s" : ""} displayed
              </p>
            </div>

            <div className="hidden items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-[11px] font-semibold text-emerald-700 sm:flex">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              Monitoring Active
            </div>

          </div>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1050px]">

            <thead className="bg-slate-50">

              <tr className="border-b border-slate-200">

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  User
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Activity
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Course / Context
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Status
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Time
                </th>

                <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Action
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-slate-100">

              {filteredActivities.length === 0 ? (

                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-16 text-center"
                  >
                    <Activity className="mx-auto h-8 w-8 text-slate-300" />

                    <p className="mt-3 text-sm font-semibold text-slate-500">
                      No activity found
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Try changing your search or filters.
                    </p>
                  </td>
                </tr>

              ) : (

                filteredActivities.map((activity) => (

                  <tr
                    key={activity.id}
                    className="transition hover:bg-slate-50"
                  >

                    {/* USER */}

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#081022] text-[11px] font-bold text-white">
                          {activity.avatar}
                        </div>

                        <div>
                          <p className="text-xs font-bold text-[#081022]">
                            {activity.user}
                          </p>

                          <p className="mt-0.5 text-[10px] text-slate-400">
                            {activity.role}
                          </p>
                        </div>

                      </div>

                    </td>

                    {/* ACTIVITY */}

                    <td className="px-5 py-4">

                      <div className="flex items-start gap-3">

                        <div
                          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${typeStyle(
                            activity.type
                          )}`}
                        >
                          <TypeIcon type={activity.type} />
                        </div>

                        <div>

                          <p className="text-xs font-bold text-[#081022]">
                            {activity.title}
                          </p>

                          <p className="mt-1 max-w-[300px] text-[11px] leading-4 text-slate-500">
                            {activity.description}
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* COURSE */}

                    <td className="px-5 py-4">

                      {activity.course ? (
                        <p className="max-w-[230px] text-xs font-semibold text-slate-700">
                          {activity.course}
                        </p>
                      ) : (
                        <span className="text-xs text-slate-400">
                          —
                        </span>
                      )}

                    </td>

                    {/* STATUS */}

                    <td className="px-5 py-4">
                      <StatusBadge status={activity.status} />
                    </td>

                    {/* TIME */}

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Clock3 className="h-3.5 w-3.5" />
                        {activity.time}
                      </div>

                    </td>

                    {/* ACTION */}

                    <td className="px-5 py-4">

                      <div className="flex justify-end">

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setSelectedActivity(activity)
                          }
                          className="h-8 gap-1.5 border-slate-200 text-xs"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Details
                        </Button>

                      </div>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

        {/* PAGINATION */}

        <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3">

          <p className="text-xs text-slate-500">
            Showing{" "}
            <strong className="text-slate-700">
              {filteredActivities.length}
            </strong>{" "}
            of{" "}
            <strong className="text-slate-700">
              {eventsCount}
            </strong>{" "}
            events
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

      {selectedActivity && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl">

            <div className="flex items-start justify-between bg-[#081022] p-6 text-white">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                  <TypeIcon type={selectedActivity.type} />
                </div>

                <div>
                  <p className="text-lg font-bold">
                    Activity Details
                  </p>

                  <p className="mt-1 text-xs text-slate-300">
                    {selectedActivity.id}
                  </p>
                </div>

              </div>

              <button
                type="button"
                onClick={() => setSelectedActivity(null)}
                className="rounded-lg p-2 text-slate-300 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

            </div>

            <div className="space-y-5 p-6">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#081022] text-xs font-bold text-white">
                  {selectedActivity.avatar}
                </div>

                <div>
                  <p className="text-sm font-bold text-[#081022]">
                    {selectedActivity.user}
                  </p>

                  <p className="text-xs text-slate-500">
                    {selectedActivity.role}
                  </p>
                </div>

              </div>

              <div className="rounded-xl bg-slate-50 p-4">

                <div className="flex items-center justify-between">

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Activity
                    </p>

                    <p className="mt-2 text-sm font-bold text-[#081022]">
                      {selectedActivity.title}
                    </p>
                  </div>

                  <StatusBadge
                    status={selectedActivity.status}
                  />

                </div>

                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {selectedActivity.description}
                </p>

              </div>

              <div className="grid gap-4 sm:grid-cols-2">

                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Activity Type
                  </p>

                  <p className="mt-2 text-sm font-semibold text-slate-700">
                    {selectedActivity.type}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-200 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Time
                  </p>

                  <p className="mt-2 text-sm font-semibold text-slate-700">
                    {selectedActivity.timestamp}
                  </p>
                </div>

                {selectedActivity.course && (
                  <div className="rounded-xl border border-slate-200 p-4 sm:col-span-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Course / Context
                    </p>

                    <p className="mt-2 text-sm font-semibold text-slate-700">
                      {selectedActivity.course}
                    </p>
                  </div>
                )}

                {selectedActivity.ip && (
                  <div className="rounded-xl border border-slate-200 p-4 sm:col-span-2">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      IP Address
                    </p>

                    <p className="mt-2 font-mono text-sm font-semibold text-slate-700">
                      {selectedActivity.ip}
                    </p>
                  </div>
                )}

              </div>

            </div>

            <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-6 py-4">

              <Button
                variant="outline"
                onClick={() => setSelectedActivity(null)}
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