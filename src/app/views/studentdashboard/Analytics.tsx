// import { useContext, useMemo } from "react";
// import { Link } from "react-router-dom";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Calendar } from "@/components/ui/calendar";
// import { Button } from "@/components/ui/button";
// import { SessionContext } from "@/contexts/SessionContext";
// import { useAuth } from "@/contexts/AuthContext";
// import useFetch from "@/hooks/useFetch";
// import {
//   Bell,
//   BookOpen,
//   Calendar as CalendarIcon,
//   Clock,
//   CreditCard,
//   Megaphone,
//   Users,
// } from "lucide-react";

// type NoticeRecord = {
//   _id?: string;
//   id?: string;
//   notice?: string;
//   date?: string;
//   posted_by?: string;
// };

// const fallbackNotices: NoticeRecord[] = [
//   {
//     id: "sn1",
//     notice: "Continuous assessment results will be released next week.",
//     date: "2026-04-18",
//     posted_by: "Exams Unit",
//   },
//   {
//     id: "sn2",
//     notice: "Students should submit all outstanding assignments before Monday.",
//     date: "2026-04-15",
//     posted_by: "Class Teacher",
//   },
// ];

// const StudentDashboard = () => {
//   const { currentSession } = useContext(SessionContext);
//   const { user } = useAuth();
//   const { data: noticesData } = useFetch(
//     currentSession ? `/get-all-notices/${currentSession._id}` : null
//   );

//   const notices = useMemo(
//     () =>
//       Array.isArray(noticesData) && noticesData.length > 0
//         ? (noticesData as NoticeRecord[])
//         : fallbackNotices,
//     [noticesData]
//   );

//   const userInfo = useMemo(() => {
//     const stored = localStorage.getItem("user");
//     const parsed = stored ? JSON.parse(stored) : {};
//     return { ...parsed, ...user } as Record<string, any>;
//   }, [user]);

//   const className = String(
//     userInfo?.classname || userInfo?.className || userInfo?.class || ""
//   );
//   const studentId = String(userInfo?._id || userInfo?.id || "");

//   const { data: classmatesData, loading: loadingClassmates } = useFetch(
//     currentSession && className
//       ? `/students/${currentSession._id}/${className}`
//       : null
//   );
//   const { data: subjectRows, loading: loadingSubjects } = useFetch(
//     currentSession && className
//       ? `/get-subject/${className}/${currentSession._id}`
//       : null
//   );

//   const statCards = [
//     {
//       title: "Classmates",
//       value: Array.isArray(classmatesData) ? classmatesData.length : 0,
//       icon: Users,
//       accent: "bg-blue-100 text-blue-700",
//       isLoading: loadingClassmates,
//     },
//     {
//       title: "Subjects",
//       value: Array.isArray(subjectRows) ? subjectRows.length : 0,
//       icon: BookOpen,
//       accent: "bg-indigo-100 text-indigo-700",
//       isLoading: loadingSubjects,
//     },
//   ];

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col gap-1">
//         <h1 className="text-2xl font-bold text-[#004aaa]">Student Dashboard</h1>
//         <p className="font-medium text-sm text-slate-500">
//           {currentSession?.name
//             ? `Current Session: ${currentSession.name}`
//             : "Welcome to your student portal."}
//         </p>
//       </div>

//       <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
//         {statCards.map((card) => (
//           <Card
//             key={card.title}
//             className="overflow-hidden border-none shadow-sm ring-1 ring-slate-200"
//           >
//             <CardContent className="p-0">
//               <div className="grid min-h-[96px] grid-cols-1 sm:grid-cols-[44%_56%]">
//                 <div
//                   className={`flex min-h-[72px] items-center justify-center py-3 sm:min-h-0 sm:py-0 ${card.accent}`}
//                 >
//                   <card.icon className="h-7 w-7" />
//                 </div>
//                 <div className="flex flex-col justify-center px-4 py-4 sm:px-6">
//                   <p className="text-sm font-semibold text-[#004aaa]">
//                     {card.title}
//                   </p>
//                   <p className="mt-1 text-3xl font-black text-[#004aaa]">
//                     {card.isLoading ? "..." : card.value}
//                   </p>
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         ))}

//         <Card className="overflow-hidden border-none shadow-sm ring-1 ring-slate-200">
//           <CardContent className="p-0">
//             <div className="grid min-h-[96px] grid-cols-1 sm:grid-cols-[44%_56%]">
//               <div className="flex min-h-[72px] items-center justify-center bg-emerald-100 py-3 text-emerald-700 sm:min-h-0 sm:py-0">
//                 <CreditCard className="h-7 w-7" />
//               </div>
//               <div className="flex flex-col justify-center gap-3 px-4 py-4 sm:px-6">
//                 <div>
//                   <p className="text-sm font-semibold text-[#004aaa]">
//                     Student ID Card
//                   </p>
//                   <p className="mt-1 text-xs text-slate-500">
//                     View and print your school ID card anytime.
//                   </p>
//                 </div>
//                 <Button
//                   asChild
//                   size="sm"
//                   className="w-fit bg-[#004aaa] hover:bg-[#004aaa]/90"
//                   disabled={!studentId}
//                 >
//                   <Link
//                     to={
//                       studentId
//                         ? `/student/id-card/${studentId}`
//                         : "/student/dashboard/default"
//                     }
//                   >
//                     View ID Card
//                   </Link>
//                 </Button>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
//         <Card className="border-none shadow-sm ring-1 ring-slate-200">
//           <CardHeader className="border-b bg-slate-50/50">
//             <div className="flex items-center gap-2">
//               <CalendarIcon className="h-5 w-5 text-blue-600" />
//               <CardTitle className="text-xl text-[#004aaa]">
//                 Term Calendar
//               </CardTitle>
//             </div>
//           </CardHeader>
//           <CardContent className="p-4 md:p-6">
//             <div className="rounded-xl border border-slate-200 bg-white p-3 md:p-5">
//               <Calendar
//                 mode="single"
//                 selected={new Date()}
//                 className="w-full rounded-md"
//               />
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="min-h-[420px] border-none shadow-sm ring-1 ring-slate-200">
//           <CardHeader className="flex flex-col gap-3 border-b bg-slate-50/50 sm:flex-row sm:items-center sm:justify-between">
//             <div className="flex items-center gap-2">
//               <Bell className="h-5 w-5 text-orange-500" />
//               <CardTitle className="text-lg text-[#004aaa] sm:text-xl">
//                 School Notices
//               </CardTitle>
//             </div>
//             <Button
//               variant="ghost"
//               size="sm"
//               className="w-full text-xs font-bold text-blue-600 sm:w-auto"
//             >
//               Refresh
//             </Button>
//           </CardHeader>
//           <CardContent className="p-0">
//             <div className="max-h-[430px] divide-y divide-slate-100 overflow-y-auto">
//               {notices.map((notice) => (
//                 <div
//                   key={notice._id || notice.id}
//                   className="flex gap-4 p-4 transition-colors hover:bg-slate-50/60"
//                 >
//                   <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#004aaa]">
//                     <Megaphone className="h-4 w-4" />
//                   </div>
//                   <div className="min-w-0 flex-1">
//                     <div className="flex items-start justify-between gap-3">
//                       <p className="text-sm font-semibold leading-6 text-[#004aaa]">
//                         {notice.notice || "No notice content"}
//                       </p>
//                       <span className="whitespace-nowrap text-[10px] text-slate-400">
//                         {notice.date
//                           ? new Date(notice.date).toLocaleDateString()
//                           : ""}
//                       </span>
//                     </div>
//                     <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px]">
//                       <span className="rounded-full bg-blue-50 px-2 py-1 font-bold text-blue-600">
//                         {notice.posted_by || "School Admin"}
//                       </span>
//                       <span className="flex items-center gap-1 text-slate-400">
//                         <Clock className="h-3 w-3" />
//                         Recent update
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default StudentDashboard;

import { useContext, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { SessionContext } from "@/contexts/SessionContext";
import { useAuth } from "@/contexts/AuthContext";
import useFetch from "@/hooks/useFetch";
import {
  BookOpen,
  CalendarClock,
  GraduationCap,
  Info,
  MessageCircleMore,
  Users,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────

type GroupingSummary = {
  courses?: number;
  courseGrouping?: number;
  tutorGrouping?: number;
};

type CourseProgressRow = {
  _id?: string;
  code: string;
  name: string;
  assignmentDone: number;
  assignmentTotal: number;
  quizDone: number;
  quizTotal: number;
  forumDone: number;
  forumTotal: number;
  // percent (0-100) to show a bar, "completed" for a finished course,
  // or null/undefined when there's nothing to measure yet ("N/A").
  progressPercent?: number | null;
  progressStatus?: "completed" | null;
};

type Deadline = {
  _id?: string;
  title?: string;
  course?: string;
  dueDate?: string;
};

// ─────────────────────────────────────────────────────────────────────────
// Fallback/mock data — mirrors the shape the API is expected to return.
// Swap out once the real polytechnic endpoints exist.
// ─────────────────────────────────────────────────────────────────────────

const fallbackGrouping: GroupingSummary = {
  courses: 8,
  courseGrouping: 8,
  tutorGrouping: 6,
};

const fallbackCourseProgress: CourseProgressRow[] = [
  { code: "COSC 101", name: "Introduction to Computing", assignmentDone: 0, assignmentTotal: 0, quizDone: 0, quizTotal: 0, forumDone: 0, forumTotal: 0, progressPercent: null },
  { code: "MATH 101", name: "Sets and Number System", assignmentDone: 0, assignmentTotal: 1, quizDone: 0, quizTotal: 0, forumDone: 0, forumTotal: 0, progressPercent: 10 },
  { code: "MATH 103", name: "Trigonometry and Co-ordinate Geometry", assignmentDone: 1, assignmentTotal: 2, quizDone: 0, quizTotal: 0, forumDone: 0, forumTotal: 0, progressPercent: 50 },
  { code: "MATH 105", name: "Differential and Integral Calculus", assignmentDone: 0, assignmentTotal: 0, quizDone: 0, quizTotal: 0, forumDone: 0, forumTotal: 0, progressPercent: null },
  { code: "PHYS 111", name: "Mechanics", assignmentDone: 0, assignmentTotal: 0, quizDone: 0, quizTotal: 0, forumDone: 1, forumTotal: 4, progressPercent: 25 },
  { code: "PHYS 131", name: "Heat and Properties of Matter", assignmentDone: 0, assignmentTotal: 0, quizDone: 0, quizTotal: 0, forumDone: 0, forumTotal: 0, progressPercent: null },
  { code: "GENS 101", name: "Nationalism", assignmentDone: 1, assignmentTotal: 1, quizDone: 0, quizTotal: 0, forumDone: 0, forumTotal: 0, progressStatus: "completed" },
  { code: "GENS 103", name: "English and Communication Skills", assignmentDone: 2, assignmentTotal: 2, quizDone: 1, quizTotal: 1, forumDone: 1, forumTotal: 2, progressPercent: 75 },
];

const fallbackDeadlines: Deadline[] = [
  { id: "d1", title: "Assignment 2 — Sets and Number System", course: "MATH 101", dueDate: "2026-08-25" } as Deadline,
  { id: "d2", title: "Quiz 1 — English and Communication Skills", course: "GENS 103", dueDate: "2026-08-28" } as Deadline,
];

// ─────────────────────────────────────────────────────────────────────────
// Small presentational helpers
// ─────────────────────────────────────────────────────────────────────────

function SectionBanner({
  icon: Icon,
  children,
}: {
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div
      className="relative inline-flex items-center gap-2 bg-[#004aaa] py-2 pl-4 pr-7 text-sm font-semibold text-white"
      style={{ clipPath: "polygon(0 0, 100% 0, 92% 50%, 100% 100%, 0 100%)" }}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span>{children}</span>
    </div>
  );
}

function StatCircle({
  icon: Icon,
  value,
  label,
  ring,
}: {
  icon: React.ElementType;
  value: number;
  label: string;
  ring: string;
}) {
  return (
    <div className="flex flex-1 items-center justify-center gap-4 px-4 py-6">
      <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full ${ring}`}>
        <Icon className="h-7 w-7 text-white" />
      </div>
      <div>
        <p className="text-3xl font-extrabold text-slate-800">{value}</p>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {label}
        </p>
      </div>
    </div>
  );
}

function ProgressCell({ row }: { row: CourseProgressRow }) {
  if (row.progressStatus === "completed") {
    return (
      <span className="text-xs font-semibold text-emerald-600">
        Completed &#10003;
      </span>
    );
  }
  if (row.progressPercent == null) {
    return <span className="text-xs italic text-slate-400">N/A</span>;
  }
  return (
    <div className="h-2 w-28 overflow-hidden rounded-full bg-slate-100">
      <div
        className="h-full rounded-full bg-[#004aaa]"
        style={{ width: `${Math.min(100, Math.max(0, row.progressPercent))}%` }}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────

const StudentDashboard = () => {
  const { currentSession } = useContext(SessionContext);
  const { user } = useAuth();

  const userInfo = useMemo(() => {
    const stored = localStorage.getItem("user");
    const parsed = stored ? JSON.parse(stored) : {};
    return { ...parsed, ...user } as Record<string, any>;
  }, [user]);

  const studentId = String(userInfo?._id || userInfo?.id || "");

  const { data: groupingData } = useFetch(
    currentSession && studentId
      ? `/student/${studentId}/course-grouping-summary/${currentSession._id}`
      : null
  );
  const grouping: GroupingSummary =
    groupingData && typeof groupingData === "object"
      ? (groupingData as GroupingSummary)
      : fallbackGrouping;

  const { data: progressData } = useFetch(
    currentSession && studentId
      ? `/student/${studentId}/course-progress/${currentSession._id}`
      : null
  );
  const courseProgress: CourseProgressRow[] =
    Array.isArray(progressData) && progressData.length > 0
      ? (progressData as CourseProgressRow[])
      : fallbackCourseProgress;

  const { data: deadlinesData } = useFetch(
    currentSession && studentId
      ? `/student/${studentId}/deadlines/${currentSession._id}`
      : null
  );
  const deadlines: Deadline[] =
    Array.isArray(deadlinesData) && deadlinesData.length > 0
      ? (deadlinesData as Deadline[])
      : fallbackDeadlines;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-[#004aaa]">Student Dashboard</h1>
        <p className="font-medium text-sm text-slate-500">
          {currentSession?.name
            ? `Current Session: ${currentSession.name}`
            : "Welcome to your student portal."}
        </p>
      </div>

      {/* Course & Grouping Information */}
      <Card className="overflow-hidden border-none shadow-sm ring-1 ring-slate-200">
        <div className="p-4 pb-0">
          <SectionBanner icon={Info}>Course &amp; Grouping Information</SectionBanner>
        </div>
        <CardContent className="p-4 pt-6 md:p-6 md:pt-6">
          <div className="flex flex-col divide-y divide-slate-100 rounded-xl border border-slate-200 sm:flex-row sm:divide-x sm:divide-y-0">
            <StatCircle
              icon={GraduationCap}
              value={grouping.courses ?? 0}
              label="Courses"
              ring="bg-emerald-500"
            />
            <StatCircle
              icon={Users}
              value={grouping.courseGrouping ?? 0}
              label="Course Grouping"
              ring="bg-rose-700"
            />
            <StatCircle
              icon={Users}
              value={grouping.tutorGrouping ?? 0}
              label="Tutor Grouping"
              ring="bg-orange-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* Course Progress Information */}
      <Card className="overflow-hidden border-none shadow-sm ring-1 ring-slate-200">
        <div className="p-4 pb-0">
          <SectionBanner icon={Info}>Course Progress Information</SectionBanner>
        </div>
        <CardContent className="p-0 pt-4 md:pt-6">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-4 py-3 md:px-6">Name</th>
                  <th className="px-4 py-3">Assignment Completion</th>
                  <th className="px-4 py-3">Quiz Completion</th>
                  <th className="px-4 py-3">Forum Participation</th>
                  <th className="px-4 py-3">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {courseProgress.map((row) => (
                  <tr key={row._id || row.code} className="hover:bg-slate-50/60">
                    <td className="whitespace-nowrap px-4 py-3 md:px-6">
                      <span className="font-semibold text-[#004aaa]">{row.code}</span>
                      <span className="text-slate-500"> - </span>
                      <span className="italic text-slate-600">{row.name}</span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                      {row.assignmentDone} out of {row.assignmentTotal}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                      {row.quizDone} out of {row.quizTotal}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                      {row.forumDone} out of {row.forumTotal}
                    </td>
                    <td className="px-4 py-3">
                      <ProgressCell row={row} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Deadlines */}
      <Card className="overflow-hidden border-none shadow-sm ring-1 ring-slate-200">
        <div className="p-4 pb-0">
          <SectionBanner icon={CalendarClock}>Deadlines</SectionBanner>
        </div>
        <CardContent className="p-0 pt-4 md:pt-6">
          <div className="divide-y divide-slate-100">
            {deadlines.length === 0 && (
              <p className="px-4 py-6 text-sm text-slate-400 md:px-6">
                No upcoming deadlines.
              </p>
            )}
            {deadlines.map((d, i) => (
              <div
                key={d._id || i}
                className="flex items-center gap-4 px-4 py-3 md:px-6"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#004aaa]">
                  <BookOpen className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[#004aaa]">
                    {d.title || "Untitled"}
                  </p>
                  <p className="text-xs text-slate-500">{d.course}</p>
                </div>
                <span className="flex shrink-0 items-center gap-1 whitespace-nowrap text-xs text-slate-400">
                  <MessageCircleMore className="hidden h-3 w-3" />
                  {d.dueDate ? new Date(d.dueDate).toLocaleDateString() : ""}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;
