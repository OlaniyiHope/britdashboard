import {
  Activity,
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  FileEdit,
  FileText,
  Users,
  Video,
  Wallet,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

/*
|--------------------------------------------------------------------------
| TEMPORARY DASHBOARD DATA
|--------------------------------------------------------------------------
|
| Replace these values with API data when the backend is connected.
|
*/

const stats = [
  {
    label: "Assigned Students",
    value: "248",
    description: "Students in your assigned courses",
    icon: Users,
  },
  {
    label: "My Courses",
    value: "8",
    description: "Courses currently assigned",
    icon: BookOpen,
  },
  {
    label: "To Grade",
    value: "17",
    description: "Assignments awaiting grading",
    icon: FileText,
  },
  {
    label: "Quiz Results",
    value: "42",
    description: "Quiz attempts awaiting review",
    icon: ClipboardCheck,
  },
  {
    label: "Live Now",
    value: "1",
    description: "Class currently broadcasting",
    icon: Video,
  },
  {
    label: "Payroll",
    value: "Current",
    description: "Latest payroll status",
    icon: Wallet,
  },
];

const courses = [
  {
    code: "CSC 201",
    name: "Data Structures",
    students: 86,
    nextClass: "Today • 10:00 AM",
  },
  {
    code: "CSC 305",
    name: "Database Systems",
    students: 72,
    nextClass: "Today • 1:00 PM",
  },
  {
    code: "CSC 401",
    name: "Software Engineering",
    students: 90,
    nextClass: "Tomorrow • 9:00 AM",
  },
];

const upcomingLectures = [
  {
    course: "CSC 201",
    title: "Data Structures",
    time: "10:00 AM",
    date: "Today",
  },
  {
    course: "CSC 305",
    title: "Database Systems",
    time: "1:00 PM",
    date: "Today",
  },
  {
    course: "CSC 401",
    title: "Software Engineering",
    time: "9:00 AM",
    date: "Tomorrow",
  },
];

const recentActivity = [
  {
    title: "New assignment submission",
    description: "12 students submitted CSC 201 Assignment 2",
    time: "10 minutes ago",
  },
  {
    title: "Quiz completed",
    description: "18 students completed Database Systems Quiz 1",
    time: "35 minutes ago",
  },
  {
    title: "Course material updated",
    description: "Lecture notes were uploaded to CSC 305",
    time: "1 hour ago",
  },
  {
    title: "Student application received",
    description: "A new course application requires review",
    time: "2 hours ago",
  },
];

export default function StaffDashboard() {
  return (
    <div className="min-h-full space-y-6 bg-slate-50 p-4 md:p-6">

      {/* ============================================================
          HEADER
      ============================================================ */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#006dcc]">
            Staff Portal
          </p>

          <h1 className="mt-1 text-2xl font-black tracking-tight text-[#081022] md:text-3xl">
            Staff Dashboard
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Your academic, teaching and staff management overview.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-sm">
          <CalendarDays className="h-4 w-4 text-slate-500" />

          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Academic Session
            </p>

            <p className="text-sm font-bold text-[#081022]">
              2026/2027
            </p>
          </div>
        </div>

      </div>

      {/* ============================================================
          STATISTICS
      ============================================================ */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">

        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card
              key={stat.label}
              className="border-none bg-white shadow-sm ring-1 ring-slate-200"
            >
              <CardContent className="p-5">

                <div className="flex items-start justify-between">

                  <div>
                    <p className="text-xs font-medium text-slate-500">
                      {stat.label}
                    </p>

                    <p className="mt-2 text-3xl font-black text-[#081022]">
                      {stat.value}
                    </p>

                    <p className="mt-1 text-[11px] text-slate-400">
                      {stat.description}
                    </p>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#006dcc]">
                    <Icon className="h-5 w-5" />
                  </div>

                </div>

              </CardContent>
            </Card>
          );
        })}

      </div>

      {/* ============================================================
          QUICK ACTIONS
      ============================================================ */}

      <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

        <CardHeader>
          <CardTitle className="text-base text-[#081022]">
            Quick Actions
          </CardTitle>

          <CardDescription>
            Quickly access the tools you use most.
          </CardDescription>
        </CardHeader>

        <CardContent>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">

            <Button
              className="h-11 justify-start gap-2 bg-[#006dcc] hover:bg-[#005ca8]"
            >
              <FileEdit className="h-4 w-4" />
              Create Quiz
            </Button>

            <Button
              variant="outline"
              className="h-11 justify-start gap-2"
            >
              <FileText className="h-4 w-4" />
              Create Assignment
            </Button>

            <Button
              variant="outline"
              className="h-11 justify-start gap-2"
            >
              <Video className="h-4 w-4" />
              Start Live Class
            </Button>

            <Button
              variant="outline"
              className="h-11 justify-start gap-2"
            >
              <BookOpen className="h-4 w-4" />
              Upload Material
            </Button>

          </div>

        </CardContent>

      </Card>

      {/* ============================================================
          LIVE CLASS + UPCOMING LECTURES
      ============================================================ */}

      <div className="grid gap-4 lg:grid-cols-2">

        {/* Live Class */}

        <Card className="overflow-hidden border-none bg-white shadow-sm ring-1 ring-slate-200">

          <CardHeader className="border-b border-slate-100">

            <div className="flex items-center justify-between">

              <div>
                <CardTitle className="text-base text-[#081022]">
                  Live Class
                </CardTitle>

                <CardDescription>
                  Monitor your active live teaching session.
                </CardDescription>
              </div>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-[11px] font-bold text-red-600">
                <span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
                LIVE
              </span>

            </div>

          </CardHeader>

          <CardContent className="p-5">

            <div className="rounded-xl bg-[#081022] p-5 text-white">

              <div className="flex items-start justify-between gap-4">

                <div>

                  <p className="text-xs font-semibold text-slate-400">
                    CSC 201
                  </p>

                  <h3 className="mt-1 text-lg font-bold">
                    Data Structures
                  </h3>

                  <p className="mt-2 text-xs text-slate-400">
                    Trees, Graphs and Traversal Algorithms
                  </p>

                </div>

                <Video className="h-6 w-6 text-blue-300" />

              </div>

              <div className="mt-5 flex items-center gap-4 text-xs text-slate-300">

                <span className="flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5" />
                  47 students watching
                </span>

                <span className="flex items-center gap-1.5">
                  <Clock3 className="h-3.5 w-3.5" />
                  38 min
                </span>

              </div>

              <Button
                className="mt-5 w-full bg-white text-[#081022] hover:bg-slate-100"
              >
                Open Live Session
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

            </div>

          </CardContent>

        </Card>

        {/* Upcoming Lectures */}

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

          <CardHeader>

            <CardTitle className="text-base text-[#081022]">
              Upcoming Lectures
            </CardTitle>

            <CardDescription>
              Your scheduled classes and lectures.
            </CardDescription>

          </CardHeader>

          <CardContent className="space-y-3">

            {upcomingLectures.map((lecture) => (

              <div
                key={`${lecture.course}-${lecture.time}`}
                className="flex items-center justify-between rounded-xl border border-slate-100 p-4 transition hover:bg-slate-50"
              >

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-[#006dcc]">
                    <BookOpen className="h-4 w-4" />
                  </div>

                  <div>

                    <p className="text-sm font-bold text-[#081022]">
                      {lecture.title}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {lecture.course}
                    </p>

                  </div>

                </div>

                <div className="text-right">

                  <p className="text-xs font-bold text-[#081022]">
                    {lecture.time}
                  </p>

                  <p className="mt-1 text-[11px] text-slate-400">
                    {lecture.date}
                  </p>

                </div>

              </div>

            ))}

          </CardContent>

        </Card>

      </div>

      {/* ============================================================
          COURSES + TODAY'S WORK
      ============================================================ */}

      <div className="grid gap-4 lg:grid-cols-2">

        {/* My Courses */}

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

          <CardHeader>

            <div className="flex items-center justify-between">

              <div>
                <CardTitle className="text-base text-[#081022]">
                  My Courses
                </CardTitle>

                <CardDescription>
                  Courses currently assigned to you.
                </CardDescription>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="gap-1 text-xs text-[#006dcc]"
              >
                View All
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>

            </div>

          </CardHeader>

          <CardContent className="space-y-3">

            {courses.map((course) => (

              <div
                key={course.code}
                className="rounded-xl border border-slate-100 p-4"
              >

                <div className="flex items-start justify-between">

                  <div>

                    <p className="text-[11px] font-bold text-[#006dcc]">
                      {course.code}
                    </p>

                    <p className="mt-1 text-sm font-bold text-[#081022]">
                      {course.name}
                    </p>

                  </div>

                  <BookOpen className="h-4 w-4 text-slate-400" />

                </div>

                <div className="mt-3 flex items-center justify-between text-xs">

                  <span className="flex items-center gap-1.5 text-slate-500">
                    <Users className="h-3.5 w-3.5" />
                    {course.students} students
                  </span>

                  <span className="text-slate-400">
                    {course.nextClass}
                  </span>

                </div>

              </div>

            ))}

          </CardContent>

        </Card>

        {/* Today's Tasks */}

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

          <CardHeader>

            <CardTitle className="text-base text-[#081022]">
              Today's Tasks
            </CardTitle>

            <CardDescription>
              Teaching activities requiring your attention.
            </CardDescription>

          </CardHeader>

          <CardContent className="space-y-3">

            <div className="flex items-center justify-between rounded-xl border border-slate-100 p-4">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                  <FileText className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#081022]">
                    Grade assignment submissions
                  </p>

                  <p className="text-xs text-slate-400">
                    17 submissions waiting
                  </p>
                </div>

              </div>

              <ArrowRight className="h-4 w-4 text-slate-400" />

            </div>

            <div className="flex items-center justify-between rounded-xl border border-slate-100 p-4">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <ClipboardCheck className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#081022]">
                    Review quiz results
                  </p>

                  <p className="text-xs text-slate-400">
                    42 attempts available
                  </p>
                </div>

              </div>

              <ArrowRight className="h-4 w-4 text-slate-400" />

            </div>

            <div className="flex items-center justify-between rounded-xl border border-slate-100 p-4">

              <div className="flex items-center gap-3">

                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <CheckCircle2 className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-[#081022]">
                    Enter continuous assessment
                  </p>

                  <p className="text-xs text-slate-400">
                    2 courses awaiting marks
                  </p>
                </div>

              </div>

              <ArrowRight className="h-4 w-4 text-slate-400" />

            </div>

          </CardContent>

        </Card>

      </div>

      {/* ============================================================
          RECENT ACTIVITY
      ============================================================ */}

      <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

        <CardHeader>

          <div className="flex items-center justify-between">

            <div>
              <CardTitle className="text-base text-[#081022]">
                Recent Activity
              </CardTitle>

              <CardDescription>
                Recent activity across your courses and students.
              </CardDescription>
            </div>

            <Activity className="h-5 w-5 text-slate-400" />

          </div>

        </CardHeader>

        <CardContent className="space-y-1">

          {recentActivity.map((activity, index) => (

            <div
              key={activity.title}
              className="flex items-start gap-3 rounded-xl p-3 transition hover:bg-slate-50"
            >

              <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#006dcc]">
                <span className="h-2 w-2 rounded-full bg-[#006dcc]" />
              </div>

              <div className="min-w-0 flex-1">

                <div className="flex flex-col justify-between gap-1 sm:flex-row">

                  <p className="text-sm font-semibold text-[#081022]">
                    {activity.title}
                  </p>

                  <span className="text-[11px] text-slate-400">
                    {activity.time}
                  </span>

                </div>

                <p className="mt-1 text-xs text-slate-500">
                  {activity.description}
                </p>

              </div>

            </div>

          ))}

        </CardContent>

      </Card>

    </div>
  );
}