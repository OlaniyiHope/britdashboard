import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Eye,
  Flag,
  MessageSquare,
  MoreHorizontal,
  Search,
  ShieldCheck,
  Users,
  XCircle,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type ForumThread = {
  id: string;
  threadCode: string;
  courseCode: string;
  courseName: string;
  title: string;
  postedBy: string;
  postedAgo: string;
  replies: number;
  views: number;
  reports: number;
  status: "Open" | "Closed" | "Reported";
  lastActivity: string;
};

const forumThreads: ForumThread[] = [
  {
    id: "1",
    threadCode: "FRM-104",
    courseCode: "PHYS 111",
    courseName: "General Physics",
    title: "What's an impulse?",
    postedBy: "Course Tutor",
    postedAgo: "4 days ago",
    replies: 12,
    views: 87,
    reports: 0,
    status: "Closed",
    lastActivity: "4 days ago",
  },
  {
    id: "2",
    threadCode: "FRM-103",
    courseCode: "CSC 201",
    courseName: "Data Structures",
    title: "Help understanding linked lists",
    postedBy: "Student",
    postedAgo: "2 hours ago",
    replies: 8,
    views: 42,
    reports: 0,
    status: "Open",
    lastActivity: "18 mins ago",
  },
  {
    id: "3",
    threadCode: "FRM-102",
    courseCode: "MTH 202",
    courseName: "Calculus II",
    title: "Integration by substitution",
    postedBy: "Student",
    postedAgo: "5 hours ago",
    replies: 15,
    views: 63,
    reports: 1,
    status: "Reported",
    lastActivity: "31 mins ago",
  },
  {
    id: "4",
    threadCode: "FRM-101",
    courseCode: "GST 101",
    courseName: "Communication Skills",
    title: "Assignment discussion",
    postedBy: "Lecturer",
    postedAgo: "1 day ago",
    replies: 6,
    views: 31,
    reports: 0,
    status: "Open",
    lastActivity: "2 hours ago",
  },
  {
    id: "5",
    threadCode: "FRM-100",
    courseCode: "BIO 101",
    courseName: "Introduction to Biology",
    title: "Cell structure discussion",
    postedBy: "Student",
    postedAgo: "2 days ago",
    replies: 19,
    views: 94,
    reports: 0,
    status: "Open",
    lastActivity: "3 hours ago",
  },
];

export default function CourseForumOversight() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredThreads = useMemo(() => {
    return forumThreads.filter((thread) => {
      const matchesSearch =
        `${thread.threadCode} ${thread.courseCode} ${thread.courseName} ${thread.title} ${thread.postedBy}`
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" || thread.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const totalForums = 12;
  const activeForums = 8;
  const totalThreads = 126;
  const reportedThreads = 3;

  const stats = [
    {
      title: "Course Forums",
      value: totalForums,
      subtitle: "Active course forums",
      icon: BookOpen,
      iconClass: "bg-blue-50 text-blue-700",
    },
    {
      title: "Active Discussions",
      value: activeForums,
      subtitle: "Currently open forums",
      icon: MessageSquare,
      iconClass: "bg-emerald-50 text-emerald-700",
    },
    {
      title: "Total Threads",
      value: totalThreads,
      subtitle: "Discussions across courses",
      icon: Users,
      iconClass: "bg-purple-50 text-purple-700",
    },
    {
      title: "Reported",
      value: reportedThreads,
      subtitle: "Require administrator attention",
      icon: AlertTriangle,
      iconClass: "bg-rose-50 text-rose-700",
    },
  ];

  return (
    <div className="min-h-full space-y-6 bg-slate-50 p-4 md:p-6">

      {/* ============================================================
          HEADER
      ============================================================ */}

      <div className="rounded-2xl bg-[#081022] p-6 text-white shadow-sm">

        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <div className="flex items-center gap-2 text-blue-200">
              <ShieldCheck className="h-5 w-5" />

              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                Academic Administration
              </span>
            </div>

            <h1 className="mt-2 text-2xl font-bold md:text-3xl">
              Course Forum Oversight
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
              Monitor course discussions, student activity, reported content,
              and forum participation across the institution.
            </p>

          </div>

          <div className="rounded-xl border border-white/10 bg-white/10 px-5 py-4">

            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-200">
              Forum Status
            </p>

            <div className="mt-2 flex items-center gap-2">

              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />

              <span className="text-sm font-semibold">
                Monitoring Active
              </span>

            </div>

          </div>

        </div>

      </div>

      {/* ============================================================
          STATISTICS
      ============================================================ */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Card
              key={stat.title}
              className="border-none bg-white shadow-sm ring-1 ring-slate-200"
            >

              <CardContent className="p-5">

                <div className="flex items-start justify-between">

                  <div>

                    <p className="text-3xl font-black text-[#081022]">
                      {stat.value}
                    </p>

                    <p className="mt-1 text-sm font-bold text-slate-800">
                      {stat.title}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {stat.subtitle}
                    </p>

                  </div>

                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconClass}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                </div>

              </CardContent>

            </Card>
          );
        })}

      </div>

      {/* ============================================================
          MODERATION ALERT
      ============================================================ */}

      {reportedThreads > 0 && (
        <Card className="border-rose-200 bg-rose-50 shadow-sm">

          <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-start gap-3">

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-100 text-rose-700">
                <Flag className="h-5 w-5" />
              </div>

              <div>

                {/* <p className="text-sm font-bold text-rose-900">
                  {reportedThreads} discussion
                  {reportedThreads !== 1 ? "s" : ""} require attention
                </p> */}

                <p className="mt-1 text-xs text-rose-700">
                  Review reported discussions and take appropriate moderation
                  action.
                </p>

              </div>

            </div>

            <Button
              onClick={() => setStatusFilter("Reported")}
              className="bg-rose-700 text-white hover:bg-rose-800"
              size="sm"
            >
              Review Reports
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

          </CardContent>

        </Card>
      )}

      {/* ============================================================
          RECENT DISCUSSIONS
      ============================================================ */}

      <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

        <CardHeader className="border-b border-slate-200">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div>

              <CardTitle className="text-base font-bold text-[#081022]">
                Course Discussions
              </CardTitle>

              <p className="mt-1 text-xs text-slate-500">
                Monitor discussion activity across all courses.
              </p>

            </div>

            <div className="flex flex-col gap-2 sm:flex-row">

              <div className="relative">

                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search discussions..."
                  className="h-9 w-full pl-9 sm:w-[240px]"
                />

              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 rounded-md border border-slate-200 bg-white px-3 text-sm outline-none"
              >
                <option value="All">All Status</option>
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
                <option value="Reported">Reported</option>
              </select>

            </div>

          </div>

        </CardHeader>

        <CardContent className="p-0">

          {/* Desktop Table */}

          <div className="hidden overflow-x-auto md:block">

            <table className="w-full">

              <thead className="bg-slate-50">

                <tr className="border-b border-slate-200 text-left">

                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Discussion
                  </th>

                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Course
                  </th>

                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Activity
                  </th>

                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Reports
                  </th>

                  <th className="px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Status
                  </th>

                  <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-slate-100">

                {filteredThreads.map((thread) => (

                  <tr
                    key={thread.id}
                    className="transition hover:bg-slate-50"
                  >

                    <td className="px-5 py-4">

                      <div className="flex items-start gap-3">

                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                          <MessageSquare className="h-4 w-4" />
                        </div>

                        <div className="min-w-0">

                          <p className="text-sm font-bold text-[#081022]">
                            {thread.title}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {thread.threadCode} • Posted by {thread.postedBy}
                          </p>

                        </div>

                      </div>

                    </td>

                    <td className="px-5 py-4">

                      <p className="text-sm font-semibold text-slate-700">
                        {thread.courseCode}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {thread.courseName}
                      </p>

                    </td>

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-4 text-xs text-slate-500">

                        <span className="flex items-center gap-1">
                          <Eye className="h-3.5 w-3.5" />
                          {thread.views}
                        </span>

                        <span className="flex items-center gap-1">
                          <MessageSquare className="h-3.5 w-3.5" />
                          {thread.replies}
                        </span>

                      </div>

                      <p className="mt-1 text-[10px] text-slate-400">
                        Active {thread.lastActivity}
                      </p>

                    </td>

                    <td className="px-5 py-4">

                      {thread.reports > 0 ? (

                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700">
                          <Flag className="h-3 w-3" />
                          {thread.reports}
                        </span>

                      ) : (

                        <span className="text-xs text-slate-400">
                          None
                        </span>

                      )}

                    </td>

                    <td className="px-5 py-4">

                      {thread.status === "Open" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                          <CheckCircle2 className="h-3 w-3" />
                          Open
                        </span>
                      )}

                      {thread.status === "Closed" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                          <XCircle className="h-3 w-3" />
                          Closed
                        </span>
                      )}

                      {thread.status === "Reported" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700">
                          <AlertTriangle className="h-3 w-3" />
                          Reported
                        </span>
                      )}

                    </td>

                    <td className="px-5 py-4 text-right">

                      <div className="flex justify-end gap-2">

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            navigate(
                              `/admin/course-forum/thread/${thread.id}`
                            )
                          }
                          className="h-8 gap-1 text-xs"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </Button>

                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>

          </div>

          {/* Mobile Cards */}

          <div className="space-y-3 p-4 md:hidden">

            {filteredThreads.map((thread) => (

              <div
                key={thread.id}
                className="rounded-xl border border-slate-200 p-4"
              >

                <div className="flex items-start justify-between gap-3">

                  <div>

                    <p className="text-sm font-bold text-[#081022]">
                      {thread.title}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {thread.courseCode} • {thread.threadCode}
                    </p>

                  </div>

                  {thread.status === "Reported" ? (
                    <AlertTriangle className="h-4 w-4 text-rose-600" />
                  ) : thread.status === "Open" ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-slate-400" />
                  )}

                </div>

                <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">

                  <span className="flex items-center gap-1">
                    <Eye className="h-3.5 w-3.5" />
                    {thread.views}
                  </span>

                  <span className="flex items-center gap-1">
                    <MessageSquare className="h-3.5 w-3.5" />
                    {thread.replies}
                  </span>

                  <span>
                    {thread.reports} reports
                  </span>

                </div>

                <Button
                  size="sm"
                  variant="outline"
                  className="mt-4 w-full"
                  onClick={() =>
                    navigate(`/admin/course-forum/thread/${thread.id}`)
                  }
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View Discussion
                </Button>

              </div>

            ))}

          </div>

          {filteredThreads.length === 0 && (

            <div className="px-6 py-12 text-center">

              <MessageSquare className="mx-auto h-8 w-8 text-slate-300" />

              <p className="mt-3 text-sm font-semibold text-slate-500">
                No discussions found
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Try changing your search or status filter.
              </p>

            </div>

          )}

        </CardContent>

      </Card>

      {/* ============================================================
          COURSE ACTIVITY SUMMARY
      ============================================================ */}

      <div className="grid gap-6 lg:grid-cols-2">

        {/* Most Active Courses */}

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

          <CardHeader className="border-b border-slate-200">

            <CardTitle className="text-base font-bold text-[#081022]">
              Most Active Courses
            </CardTitle>

          </CardHeader>

          <CardContent className="space-y-3 p-4">

            {[
              ["CSC 201", "Data Structures", 32],
              ["MTH 202", "Calculus II", 27],
              ["BIO 101", "Introduction to Biology", 21],
              ["PHYS 111", "General Physics", 18],
            ].map(([code, name, threads]) => (

              <div
                key={String(code)}
                className="flex items-center justify-between rounded-lg bg-slate-50 p-3"
              >

                <div className="flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white text-slate-600 shadow-sm">
                    <BookOpen className="h-4 w-4" />
                  </div>

                  <div>

                    <p className="text-sm font-bold text-[#081022]">
                      {code}
                    </p>

                    <p className="text-xs text-slate-500">
                      {name}
                    </p>

                  </div>

                </div>

                <span className="text-sm font-black text-[#081022]">
                  {threads}
                </span>

              </div>

            ))}

          </CardContent>

        </Card>

        {/* Moderation */}

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

          <CardHeader className="border-b border-slate-200">

            <CardTitle className="text-base font-bold text-[#081022]">
              Moderation Overview
            </CardTitle>

          </CardHeader>

          <CardContent className="space-y-3 p-4">

            <div className="flex items-center justify-between rounded-lg bg-emerald-50 p-4">

              <div className="flex items-center gap-3">

                <CheckCircle2 className="h-5 w-5 text-emerald-700" />

                <div>

                  <p className="text-sm font-bold text-emerald-900">
                    Healthy Discussions
                  </p>

                  <p className="text-xs text-emerald-700">
                    No moderation action required
                  </p>

                </div>

              </div>

              <span className="font-black text-emerald-800">
                118
              </span>

            </div>

            <div className="flex items-center justify-between rounded-lg bg-rose-50 p-4">

              <div className="flex items-center gap-3">

                <AlertTriangle className="h-5 w-5 text-rose-700" />

                <div>

                  <p className="text-sm font-bold text-rose-900">
                    Reported Discussions
                  </p>

                  <p className="text-xs text-rose-700">
                    Require administrator review
                  </p>

                </div>

              </div>

              <span className="font-black text-rose-800">
                3
              </span>

            </div>

            <div className="flex items-center justify-between rounded-lg bg-slate-50 p-4">

              <div className="flex items-center gap-3">

                <XCircle className="h-5 w-5 text-slate-600" />

                <div>

                  <p className="text-sm font-bold text-slate-800">
                    Closed Discussions
                  </p>

                  <p className="text-xs text-slate-500">
                    Discussions no longer accepting replies
                  </p>

                </div>

              </div>

              <span className="font-black text-slate-700">
                8
              </span>

            </div>

          </CardContent>

        </Card>

      </div>

    </div>
  );
}