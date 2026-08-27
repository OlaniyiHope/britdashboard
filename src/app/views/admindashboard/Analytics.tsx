// import { useContext, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   ArrowRight,
//   BookOpen,
//   ClipboardCheck,
//   ClipboardList,
//   FileCheck2,
//   GraduationCap,
//   Megaphone,
//   Layers3,
//   UserPlus,
//   UserRoundCog,
//   Users,
// } from "lucide-react";

// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";

// import { Button } from "@/components/ui/button";
// import { SessionContext } from "@/contexts/SessionContext";
// import { useAuth } from "@/contexts/AuthContext";
// import useFetch from "@/hooks/useFetch";

// type Notice = {
//   _id?: string;
//   id?: string;
//   title?: string;
//   notice?: string;
//   message?: string;
//   description?: string;
//   posted_by?: string;
//   postedBy?: string;
//   date?: string;
// };

// type DashboardStat = {
//   title: string;
//   value: number;
//   subtitle: string;
//   icon: React.ElementType;
//   href: string;
// };

// const countItems = (value: unknown) =>
//   Array.isArray(value) ? value.length : 0;

// export default function Dashboard() {
//   const navigate = useNavigate();

//   const { currentSession } = useContext(SessionContext);
//   const { user } = useAuth();

//   const sessionId = currentSession?._id;

//   /*
//    * ================================================================
//    * DASHBOARD DATA
//    * ================================================================
//    */

//   const { data: rawStudents } = useFetch(
//     sessionId ? `/users/student/${sessionId}` : null
//   );

//   const { data: rawStaff } = useFetch(
//     sessionId ? `/users/teacher/${sessionId}` : null
//   );

//   const { data: rawAdmins } = useFetch(
//     sessionId ? `/users/admin/${sessionId}` : null
//   );

//   const { data: notices } = useFetch(
//     sessionId ? `/get-all-notices/${sessionId}` : null
//   );

//   const { data: programmes } = useFetch(
//     sessionId ? `/programmes/${sessionId}` : null
//   );

//   const { data: courses } = useFetch(
//     sessionId ? `/courses/${sessionId}` : null
//   );

//   const { data: applications } = useFetch(
//     sessionId ? `/applications/${sessionId}` : null
//   );

//   const { data: pendingResults } = useFetch(
//     sessionId ? `/results/pending/${sessionId}` : null
//   );

//   const { data: assignments } = useFetch(
//     sessionId ? `/assignments/${sessionId}` : null
//   );

//   const { data: quizzes } = useFetch(
//     sessionId ? `/quizzes/${sessionId}` : null
//   );

//   /*
//    * ================================================================
//    * COUNTS
//    * ================================================================
//    */

//   const studentCount = countItems(rawStudents);
//   const staffCount = countItems(rawStaff);
//   const adminCount = countItems(rawAdmins);

//   const programmeCount = countItems(programmes);
//   const courseCount = countItems(courses);

//   const applicationCount = countItems(applications);
//   const resultCount = countItems(pendingResults);

//   const assignmentCount = countItems(assignments);
//   const quizCount = countItems(quizzes);

//   /*
//    * ================================================================
//    * MAIN DASHBOARD STATISTICS
//    * ================================================================
//    */

//   const statistics = useMemo<DashboardStat[]>(
//     () => [
//       {
//         title: "Students",
//         value: studentCount,
//         subtitle: "Registered students",
//         icon: GraduationCap,
//         href: "/admin/students/registry",
//       },
//       {
//         title: "Academic Staff",
//         value: staffCount,
//         subtitle: "Lecturers & staff",
//         icon: Users,
//         href: "/admin/staff/management",
//       },
//       {
//         title: "Programmes",
//         value: programmeCount,
//         subtitle: "Academic programmes",
//         icon: Layers3,
//         href: "/admin/programmes",
//       },
//       {
//         title: "Courses",
//         value: courseCount,
//         subtitle: "Available courses",
//         icon: BookOpen,
//         href: "/admin/curriculum",
//       },
//     ],
//     [
//       studentCount,
//       staffCount,
//       programmeCount,
//       courseCount,
//     ]
//   );

//   /*
//    * ================================================================
//    * RECENT NOTICES
//    * ================================================================
//    */

//   const latestNotices = useMemo(() => {
//     if (!Array.isArray(notices)) {
//       return [];
//     }

//     return (notices as Notice[]).slice(0, 5);
//   }, [notices]);

//   /*
//    * ================================================================
//    * QUICK ACTIONS
//    * ================================================================
//    */

//   const quickActions = [
//     {
//       title: "Register Student",
//       description: "Add a new student",
//       icon: UserPlus,
//       href: "/admin/students/registration",
//     },
//     {
//       title: "Manage Staff",
//       description: "View and manage staff",
//       icon: UserRoundCog,
//       href: "/admin/staff/management",
//     },
//     {
//       title: "Review Applications",
//       description: "Process admissions",
//       icon: FileCheck2,
//       href: "/admin/admissions/review",
//     },
//     {
//       title: "Approve Results",
//       description: "Review pending results",
//       icon: ClipboardCheck,
//       href: "/admin/students/result-approval",
//     },
//   ];

//   /*
//    * ================================================================
//    * RETURN
//    * ================================================================
//    */

//   return (
//     <div className="min-h-full space-y-6 bg-slate-50 p-4 md:p-6">

//       {/* ============================================================
//           HEADER
//       ============================================================ */}

//       <div className="rounded-2xl bg-[#081022] p-6 text-white shadow-sm">

//         <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

//           <div>
//             <p className="text-xs font-semibold uppercase tracking-[0.18em] text-blue-200">
//               Administration
//             </p>

//             <h1 className="mt-2 text-2xl font-bold md:text-3xl">
//               Dashboard
//             </h1>

//             {/* {user?.name && (
//               <p className="mt-2 text-sm text-slate-300">
//                 Welcome back, {user.name}.
//               </p>
//             )} */}
//           </div>

//           <div className="rounded-xl border border-white/10 bg-white/10 px-4 py-3">

//             <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-blue-200">
//               Current Session
//             </p>

//             <p className="mt-1 text-sm font-bold text-white">
//               {currentSession?.name || "Not Set"}
//             </p>

//           </div>

//         </div>

//       </div>

//       {/* ============================================================
//           MAIN STATISTICS
//       ============================================================ */}

//       <section>

//         <div className="mb-4">
//           <h2 className="text-lg font-bold text-[#081022]">
//             Overview
//           </h2>

//           <p className="text-xs text-slate-500">
//             Key academic statistics
//           </p>
//         </div>

//         <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

//           {statistics.map((stat) => {
//             const Icon = stat.icon;

//             return (
//               <Card
//                 key={stat.title}
//                 className="overflow-hidden border-none bg-white shadow-sm ring-1 ring-slate-200"
//               >

//                 <CardContent className="p-0">

//                   <div className="flex min-h-[135px]">

//                     <div className="flex w-[36%] items-center justify-center bg-[#081022] text-white">
//                       <Icon
//                         className="h-8 w-8"
//                         strokeWidth={1.5}
//                       />
//                     </div>

//                     <div className="flex flex-1 flex-col justify-center px-5">

//                       <p className="text-3xl font-black text-[#081022]">
//                         {stat.value}
//                       </p>

//                       <p className="mt-1 text-sm font-bold text-slate-800">
//                         {stat.title}
//                       </p>

//                       <p className="mt-1 text-[10px] uppercase tracking-wider text-slate-400">
//                         {stat.subtitle}
//                       </p>

//                     </div>

//                   </div>

//                   <button
//                     type="button"
//                     onClick={() => navigate(stat.href)}
//                     className="flex h-8 w-full items-center justify-center gap-2 bg-[#006dcc] text-xs font-medium text-white transition hover:bg-[#005ca8]"
//                   >
//                     View Details

//                     <ArrowRight className="h-3.5 w-3.5" />
//                   </button>

//                 </CardContent>

//               </Card>
//             );
//           })}

//         </div>

//       </section>

//       {/* ============================================================
//           ACADEMIC ACTIVITY + SUMMARY
//       ============================================================ */}

//       <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">

//         {/* ==========================================================
//             LEFT COLUMN
//         ========================================================== */}

//         <div className="space-y-6">

//           {/* Academic Activity */}

//           <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

//             <CardHeader className="border-b border-slate-200">

//               <CardTitle className="flex items-center gap-2 text-base font-bold text-[#081022]">

//                 <GraduationCap className="h-5 w-5" />

//                 Academic Activity

//               </CardTitle>

//             </CardHeader>

//             <CardContent className="grid gap-3 p-4 sm:grid-cols-2">

//               {/* Admissions */}

//               <button
//                 type="button"
//                 onClick={() =>
//                   navigate("/admin/admissions/review")
//                 }
//                 className="flex items-center justify-between rounded-xl border border-slate-200 p-4 text-left transition hover:border-[#081022] hover:bg-slate-50"
//               >

//                 <div className="flex items-center gap-3">

//                   <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">

//                     <UserPlus className="h-5 w-5" />

//                   </div>

//                   <div>

//                     <p className="text-sm font-bold text-[#081022]">
//                       Admissions
//                     </p>

//                     <p className="text-xs text-slate-500">
//                       Applications to process
//                     </p>

//                   </div>

//                 </div>

//                 <span className="text-xl font-black text-[#081022]">
//                   {applicationCount}
//                 </span>

//               </button>

//               {/* Results */}

//               <button
//                 type="button"
//                 onClick={() =>
//                   navigate("/admin/students/result-approval")
//                 }
//                 className="flex items-center justify-between rounded-xl border border-slate-200 p-4 text-left transition hover:border-[#081022] hover:bg-slate-50"
//               >

//                 <div className="flex items-center gap-3">

//                   <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">

//                     <ClipboardCheck className="h-5 w-5" />

//                   </div>

//                   <div>

//                     <p className="text-sm font-bold text-[#081022]">
//                       Result Approval
//                     </p>

//                     <p className="text-xs text-slate-500">
//                       Results awaiting approval
//                     </p>

//                   </div>

//                 </div>

//                 <span className="text-xl font-black text-[#081022]">
//                   {resultCount}
//                 </span>

//               </button>

//               {/* Assignments */}

//               <button
//                 type="button"
//                 onClick={() =>
//                   navigate("/admin/assignments")
//                 }
//                 className="flex items-center justify-between rounded-xl border border-slate-200 p-4 text-left transition hover:border-[#081022] hover:bg-slate-50"
//               >

//                 <div className="flex items-center gap-3">

//                   <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-700">

//                     <ClipboardList className="h-5 w-5" />

//                   </div>

//                   <div>

//                     <p className="text-sm font-bold text-[#081022]">
//                       Assignments
//                     </p>

//                     <p className="text-xs text-slate-500">
//                       E-learning assignments
//                     </p>

//                   </div>

//                 </div>

//                 <span className="text-xl font-black text-[#081022]">
//                   {assignmentCount}
//                 </span>

//               </button>

//               {/* Quizzes */}

//               <button
//                 type="button"
//                 onClick={() =>
//                   navigate("/admin/quiz/all")
//                 }
//                 className="flex items-center justify-between rounded-xl border border-slate-200 p-4 text-left transition hover:border-[#081022] hover:bg-slate-50"
//               >

//                 <div className="flex items-center gap-3">

//                   <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-700">

//                     <BookOpen className="h-5 w-5" />

//                   </div>

//                   <div>

//                     <p className="text-sm font-bold text-[#081022]">
//                       Online Quizzes
//                     </p>

//                     <p className="text-xs text-slate-500">
//                       Online assessments
//                     </p>

//                   </div>

//                 </div>

//                 <span className="text-xl font-black text-[#081022]">
//                   {quizCount}
//                 </span>

//               </button>

//             </CardContent>

//           </Card>

//           {/* ========================================================
//               QUICK ADMINISTRATION
//           ======================================================== */}

//           <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

//             <CardHeader className="border-b border-slate-200">

//               <CardTitle className="text-base font-bold text-[#081022]">
//                 Quick Administration
//               </CardTitle>

//             </CardHeader>

//             <CardContent className="grid gap-3 p-4 sm:grid-cols-2">

//               {quickActions.map((action) => {
//                 const Icon = action.icon;

//                 return (
//                   <button
//                     key={action.title}
//                     type="button"
//                     onClick={() => navigate(action.href)}
//                     className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 text-left transition hover:border-[#081022] hover:bg-slate-50"
//                   >

//                     <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#081022] text-white">

//                       <Icon className="h-5 w-5" />

//                     </div>

//                     <div className="min-w-0">

//                       <p className="text-sm font-bold text-[#081022]">
//                         {action.title}
//                       </p>

//                       <p className="mt-1 text-xs text-slate-500">
//                         {action.description}
//                       </p>

//                     </div>

//                     <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-slate-400" />

//                   </button>
//                 );
//               })}

//             </CardContent>

//           </Card>

//         </div>

//         {/* ==========================================================
//             RIGHT COLUMN
//         ========================================================== */}

//         <div>

//           <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

//             <CardHeader className="border-b border-slate-200">

//               <CardTitle className="text-base font-bold text-[#081022]">
//                 Administration Summary
//               </CardTitle>

//             </CardHeader>

//             <CardContent className="space-y-3 p-4">

//               {/* Administrators */}

//               <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">

//                 <div className="flex items-center gap-3">

//                   <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white ring-1 ring-slate-200">

//                     <Users className="h-5 w-5 text-[#081022]" />

//                   </div>

//                   <div>

//                     <p className="text-sm font-semibold text-slate-800">
//                       Administrators
//                     </p>

//                     <p className="text-xs text-slate-500">
//                       System administrators
//                     </p>

//                   </div>

//                 </div>

//                 <span className="text-xl font-black text-[#081022]">
//                   {adminCount}
//                 </span>

//               </div>

//               {/* Students */}

//               <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">

//                 <div className="flex items-center gap-3">

//                   <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white ring-1 ring-slate-200">

//                     <GraduationCap className="h-5 w-5 text-[#081022]" />

//                   </div>

//                   <div>

//                     <p className="text-sm font-semibold text-slate-800">
//                       Students
//                     </p>

//                     <p className="text-xs text-slate-500">
//                       Total registered
//                     </p>

//                   </div>

//                 </div>

//                 <span className="text-xl font-black text-[#081022]">
//                   {studentCount}
//                 </span>

//               </div>

//               {/* Staff */}

//               <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">

//                 <div className="flex items-center gap-3">

//                   <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white ring-1 ring-slate-200">

//                     <Users className="h-5 w-5 text-[#081022]" />

//                   </div>

//                   <div>

//                     <p className="text-sm font-semibold text-slate-800">
//                       Academic Staff
//                     </p>

//                     <p className="text-xs text-slate-500">
//                       Lecturers and staff
//                     </p>

//                   </div>

//                 </div>

//                 <span className="text-xl font-black text-[#081022]">
//                   {staffCount}
//                 </span>

//               </div>

//               {/* Programmes */}

//               <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">

//                 <div className="flex items-center gap-3">

//                   <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white ring-1 ring-slate-200">

//                     <Layers3 className="h-5 w-5 text-[#081022]" />

//                   </div>

//                   <div>

//                     <p className="text-sm font-semibold text-slate-800">
//                       Programmes
//                     </p>

//                     <p className="text-xs text-slate-500">
//                       Active programmes
//                     </p>

//                   </div>

//                 </div>

//                 <span className="text-xl font-black text-[#081022]">
//                   {programmeCount}
//                 </span>

//               </div>

//               {/* Courses */}

//               <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">

//                 <div className="flex items-center gap-3">

//                   <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white ring-1 ring-slate-200">

//                     <BookOpen className="h-5 w-5 text-[#081022]" />

//                   </div>

//                   <div>

//                     <p className="text-sm font-semibold text-slate-800">
//                       Courses
//                     </p>

//                     <p className="text-xs text-slate-500">
//                       Available courses
//                     </p>

//                   </div>

//                 </div>

//                 <span className="text-xl font-black text-[#081022]">
//                   {courseCount}
//                 </span>

//               </div>

//             </CardContent>

//           </Card>

//         </div>

//       </div>

//       {/* ============================================================
//           NOTICE BOARD
//       ============================================================ */}

//       <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

//         <CardHeader className="flex flex-col gap-3 border-b border-slate-200 sm:flex-row sm:items-center sm:justify-between">

//           <div className="flex items-center gap-2">

//             <Megaphone className="h-5 w-5 text-[#081022]" />

//             <div>

//               <CardTitle className="text-base font-bold text-[#081022]">
//                 Notice Board
//               </CardTitle>

//               <p className="mt-1 text-xs text-slate-500">
//                 Recent institution announcements
//               </p>

//             </div>

//           </div>

//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() =>
//               navigate("/admin/notifications")
//             }
//             className="w-full sm:w-auto"
//           >
//             View All Notices
//           </Button>

//         </CardHeader>

//         <CardContent className="p-0">

//           {latestNotices.length === 0 ? (

//             <div className="flex flex-col items-center justify-center px-6 py-12 text-center">

//               <Megaphone className="h-8 w-8 text-slate-300" />

//               <p className="mt-3 text-sm font-semibold text-slate-500">
//                 No recent notices
//               </p>

//               <p className="mt-1 text-xs text-slate-400">
//                 Announcements will appear here.
//               </p>

//             </div>

//           ) : (

//             <div className="divide-y divide-slate-100">

//               {latestNotices.map((notice, index) => (

//                 <div
//                   key={notice._id || notice.id || index}
//                   className="flex gap-4 p-5 transition hover:bg-slate-50"
//                 >

//                   <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">

//                     <Megaphone className="h-4 w-4" />

//                   </div>

//                   <div className="min-w-0 flex-1">

//                     <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">

//                       <p className="text-sm font-bold text-[#081022]">
//                         {notice.title || "Institution Notice"}
//                       </p>

//                       {notice.date && (
//                         <span className="shrink-0 text-[10px] text-slate-400">
//                           {new Date(
//                             notice.date
//                           ).toLocaleDateString()}
//                         </span>
//                       )}

//                     </div>

//                     <p className="mt-1 text-sm leading-6 text-slate-600">
//                       {notice.notice ||
//                         notice.message ||
//                         notice.description ||
//                         "No notice content provided."}
//                     </p>

//                     <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
//                       Posted by{" "}
//                       {notice.posted_by ||
//                         notice.postedBy ||
//                         "Administration"}
//                     </p>

//                   </div>

//                 </div>

//               ))}

//             </div>

//           )}

//         </CardContent>

//       </Card>

//     </div>
//   );
// }
import { useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  ClipboardCheck,
  ClipboardList,
  FileCheck2,
  GraduationCap,
  Megaphone,
  Layers3,
  UserPlus,
  UserRoundCog,
  Users,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { SessionContext } from "@/contexts/SessionContext";
import { useAuth } from "@/contexts/AuthContext";
import useFetch from "@/hooks/useFetch";

type Notice = {
  _id?: string;
  id?: string;
  title?: string;
  notice?: string;
  message?: string;
  description?: string;
  posted_by?: string;
  postedBy?: string;
  date?: string;
};

type DashboardStat = {
  title: string;
  value: number;
  subtitle: string;
  icon: React.ElementType;
  href: string;
};

const countItems = (value: unknown) =>
  Array.isArray(value) ? value.length : 0;

export default function Dashboard() {
  const navigate = useNavigate();

  const { currentSession } = useContext(SessionContext);
  const { user } = useAuth();

  const sessionId = currentSession?._id;

  /*
   * ================================================================
   * DASHBOARD DATA
   * ================================================================
   */

  const { data: rawStudents } = useFetch(
    sessionId ? `/users/student/${sessionId}` : null
  );

  const { data: rawStaff } = useFetch(
    sessionId ? `/users/teacher/${sessionId}` : null
  );

  const { data: rawAdmins } = useFetch(
    sessionId ? `/users/admin/${sessionId}` : null
  );

  const { data: notices } = useFetch(
    sessionId ? `/get-all-notices/${sessionId}` : null
  );

  const { data: programmes } = useFetch(
    sessionId ? `/programmes/${sessionId}` : null
  );

  const { data: courses } = useFetch(
    sessionId ? `/courses/${sessionId}` : null
  );

  const { data: applications } = useFetch(
    sessionId ? `/applications/${sessionId}` : null
  );

  const { data: pendingResults } = useFetch(
    sessionId ? `/results/pending/${sessionId}` : null
  );

  const { data: assignments } = useFetch(
    sessionId ? `/assignments/${sessionId}` : null
  );

  const { data: quizzes } = useFetch(
    sessionId ? `/quizzes/${sessionId}` : null
  );

  /*
   * ================================================================
   * COUNTS
   * ================================================================
   */

  const studentCount = countItems(rawStudents);
  const staffCount = countItems(rawStaff);
  const adminCount = countItems(rawAdmins);

  const programmeCount = countItems(programmes);
  const courseCount = countItems(courses);

  const applicationCount = countItems(applications);
  const resultCount = countItems(pendingResults);

  const assignmentCount = countItems(assignments);
  const quizCount = countItems(quizzes);

  /*
   * ================================================================
   * MAIN DASHBOARD STATISTICS
   * ================================================================
   */

  const statistics = useMemo<DashboardStat[]>(
    () => [
      {
        title: "Students",
        value: studentCount,
        subtitle: "Registered students",
        icon: GraduationCap,
        href: "/admin/students/registry",
      },
      {
        title: "Academic Staff",
        value: staffCount,
        subtitle: "Lecturers & staff",
        icon: Users,
        href: "/admin/staff/management",
      },
      {
        title: "Programmes",
        value: programmeCount,
        subtitle: "Academic programmes",
        icon: Layers3,
        href: "/admin/programmes",
      },
      {
        title: "Courses",
        value: courseCount,
        subtitle: "Available courses",
        icon: BookOpen,
        href: "/admin/curriculum",
      },
    ],
    [
      studentCount,
      staffCount,
      programmeCount,
      courseCount,
    ]
  );

  /*
   * ================================================================
   * RECENT NOTICES
   * ================================================================
   */

  const latestNotices = useMemo(() => {
    if (!Array.isArray(notices)) {
      return [];
    }

    return (notices as Notice[]).slice(0, 5);
  }, [notices]);

  /*
   * ================================================================
   * QUICK ACTIONS
   * ================================================================
   */

  const quickActions = [
    {
      title: "Register Student",
      description: "Add a new student",
      icon: UserPlus,
      href: "/admin/students/registration",
    },
    {
      title: "Manage Staff",
      description: "View and manage staff",
      icon: UserRoundCog,
      href: "/admin/staff/management",
    },
    {
      title: "Review Applications",
      description: "Process admissions",
      icon: FileCheck2,
      href: "/admin/admissions/review",
    },
    {
      title: "Approve Results",
      description: "Review pending results",
      icon: ClipboardCheck,
      href: "/admin/students/result-approval",
    },
  ];

  /*
   * ================================================================
   * RETURN
   * ================================================================
   */

  return (
    <div className="min-h-full space-y-6 bg-slate-50 p-4 md:p-6">

      {/* ============================================================
          HEADER
      ============================================================ */}

      <div className="rounded-2xl bg-[#081022] p-6 text-white shadow-sm">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#e3c374]">
              Administration
            </p>

            <h1 className="mt-2 text-2xl font-bold md:text-3xl">
              Dashboard
            </h1>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/10 px-4 py-3">

            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-blue-200">
              Current Session
            </p>

            <p className="mt-1 text-sm font-bold text-white">
              {currentSession?.name || "Not Set"}
            </p>

          </div>

        </div>

      </div>

      {/* ============================================================
          MAIN STATISTICS
      ============================================================ */}

      <section>

        <div className="mb-4">
          <h2 className="text-lg font-bold text-[#081022]">
            Overview
          </h2>

          <p className="text-xs text-slate-500">
            Key academic statistics
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {statistics.map((stat) => {
            const Icon = stat.icon;

            return (
              <Card
                key={stat.title}
                className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <CardContent className="p-0">

                  {/* ==================================================
                      CARD CONTENT
                  ================================================== */}

                  <div className="flex min-h-[150px] flex-col p-5">

                    <div className="flex items-start justify-between">

                      {/* Small Icon */}

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#faf6ec] text-[#8a6a1f] ring-1 ring-[#e3c374]/30">
                        <Icon
                          className="h-5 w-5"
                          strokeWidth={1.8}
                        />
                      </div>

                      {/* Number */}

                      <span className="text-3xl font-black tracking-tight text-[#081022]">
                        {stat.value}
                      </span>

                    </div>

                    {/* Title */}

                    <div className="mt-auto">

                      <p className="text-sm font-bold text-[#081022]">
                        {stat.title}
                      </p>

                      <p className="mt-1 text-[10px] font-medium uppercase tracking-[0.08em] text-slate-400">
                        {stat.subtitle}
                      </p>

                    </div>

                  </div>

                  {/* ==================================================
                      VIEW DETAILS
                  ================================================== */}

                  <button
                    type="button"
                    onClick={() => navigate(stat.href)}
                    className="flex w-full items-center justify-between border-t border-slate-100 px-5 py-3 text-xs font-semibold text-[#8a6a1f] transition hover:bg-[#faf6ec]"
                  >
                    <span>
                      View Details
                    </span>

                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                  </button>

                </CardContent>
              </Card>
            );
          })}

        </div>

      </section>

      {/* ============================================================
          ACADEMIC ACTIVITY + SUMMARY
      ============================================================ */}

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">

        {/* ==========================================================
            LEFT COLUMN
        ========================================================== */}

        <div className="space-y-6">

          {/* Academic Activity */}

          <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

            <CardHeader className="border-b border-slate-200">

              <CardTitle className="flex items-center gap-2 text-base font-bold text-[#081022]">

                <GraduationCap className="h-5 w-5 text-[#8a6a1f]" />

                Academic Activity

              </CardTitle>

            </CardHeader>

            <CardContent className="grid gap-3 p-4 sm:grid-cols-2">

              {/* Admissions */}

              <button
                type="button"
                onClick={() =>
                  navigate("/admin/admissions/review")
                }
                className="flex items-center justify-between rounded-xl border border-slate-200 p-4 text-left transition hover:border-[#c9a24a] hover:bg-[#faf6ec]"
              >

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">

                    <UserPlus className="h-5 w-5" />

                  </div>

                  <div>

                    <p className="text-sm font-bold text-[#081022]">
                      Admissions
                    </p>

                    <p className="text-xs text-slate-500">
                      Applications to process
                    </p>

                  </div>

                </div>

                <span className="text-xl font-black text-[#081022]">
                  {applicationCount}
                </span>

              </button>

              {/* Results */}

              <button
                type="button"
                onClick={() =>
                  navigate("/admin/students/result-approval")
                }
                className="flex items-center justify-between rounded-xl border border-slate-200 p-4 text-left transition hover:border-[#c9a24a] hover:bg-[#faf6ec]"
              >

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">

                    <ClipboardCheck className="h-5 w-5" />

                  </div>

                  <div>

                    <p className="text-sm font-bold text-[#081022]">
                      Result Approval
                    </p>

                    <p className="text-xs text-slate-500">
                      Results awaiting approval
                    </p>

                  </div>

                </div>

                <span className="text-xl font-black text-[#081022]">
                  {resultCount}
                </span>

              </button>

              {/* Assignments */}

              <button
                type="button"
                onClick={() =>
                  navigate("/admin/assignments")
                }
                className="flex items-center justify-between rounded-xl border border-slate-200 p-4 text-left transition hover:border-[#c9a24a] hover:bg-[#faf6ec]"
              >

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-700">

                    <ClipboardList className="h-5 w-5" />

                  </div>

                  <div>

                    <p className="text-sm font-bold text-[#081022]">
                      Assignments
                    </p>

                    <p className="text-xs text-slate-500">
                      E-learning assignments
                    </p>

                  </div>

                </div>

                <span className="text-xl font-black text-[#081022]">
                  {assignmentCount}
                </span>

              </button>

              {/* Quizzes */}

              <button
                type="button"
                onClick={() =>
                  navigate("/admin/quiz/all")
                }
                className="flex items-center justify-between rounded-xl border border-slate-200 p-4 text-left transition hover:border-[#c9a24a] hover:bg-[#faf6ec]"
              >

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-700">

                    <BookOpen className="h-5 w-5" />

                  </div>

                  <div>

                    <p className="text-sm font-bold text-[#081022]">
                      Online Quizzes
                    </p>

                    <p className="text-xs text-slate-500">
                      Online assessments
                    </p>

                  </div>

                </div>

                <span className="text-xl font-black text-[#081022]">
                  {quizCount}
                </span>

              </button>

            </CardContent>

          </Card>

          {/* ========================================================
              QUICK ADMINISTRATION
          ======================================================== */}

          <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

            <CardHeader className="border-b border-slate-200">

              <CardTitle className="text-base font-bold text-[#081022]">
                Quick Administration
              </CardTitle>

            </CardHeader>

            <CardContent className="grid gap-3 p-4 sm:grid-cols-2">

              {quickActions.map((action) => {
                const Icon = action.icon;

                return (
                  <button
                    key={action.title}
                    type="button"
                    onClick={() => navigate(action.href)}
                    className="flex items-center gap-3 rounded-xl border border-slate-200 p-4 text-left transition hover:border-[#c9a24a] hover:bg-[#faf6ec]"
                  >

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#081022] text-white">

                      <Icon className="h-5 w-5" />

                    </div>

                    <div className="min-w-0">

                      <p className="text-sm font-bold text-[#081022]">
                        {action.title}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {action.description}
                      </p>

                    </div>

                    <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-slate-400" />

                  </button>
                );
              })}

            </CardContent>

          </Card>

        </div>

        {/* ==========================================================
            RIGHT COLUMN
        ========================================================== */}

        <div>

          <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

            <CardHeader className="border-b border-slate-200">

              <CardTitle className="text-base font-bold text-[#081022]">
                Administration Summary
              </CardTitle>

            </CardHeader>

            <CardContent className="space-y-3 p-4">

              {/* Administrators */}

              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white ring-1 ring-slate-200">

                    <Users className="h-5 w-5 text-[#081022]" />

                  </div>

                  <div>

                    <p className="text-sm font-semibold text-slate-800">
                      Administrators
                    </p>

                    <p className="text-xs text-slate-500">
                      System administrators
                    </p>

                  </div>

                </div>

                <span className="text-xl font-black text-[#081022]">
                  {adminCount}
                </span>

              </div>

              {/* Students */}

              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white ring-1 ring-slate-200">

                    <GraduationCap className="h-5 w-5 text-[#081022]" />

                  </div>

                  <div>

                    <p className="text-sm font-semibold text-slate-800">
                      Students
                    </p>

                    <p className="text-xs text-slate-500">
                      Total registered
                    </p>

                  </div>

                </div>

                <span className="text-xl font-black text-[#081022]">
                  {studentCount}
                </span>

              </div>

              {/* Staff */}

              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white ring-1 ring-slate-200">

                    <Users className="h-5 w-5 text-[#081022]" />

                  </div>

                  <div>

                    <p className="text-sm font-semibold text-slate-800">
                      Academic Staff
                    </p>

                    <p className="text-xs text-slate-500">
                      Lecturers and staff
                    </p>

                  </div>

                </div>

                <span className="text-xl font-black text-[#081022]">
                  {staffCount}
                </span>

              </div>

              {/* Programmes */}

              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white ring-1 ring-slate-200">

                    <Layers3 className="h-5 w-5 text-[#081022]" />

                  </div>

                  <div>

                    <p className="text-sm font-semibold text-slate-800">
                      Programmes
                    </p>

                    <p className="text-xs text-slate-500">
                      Active programmes
                    </p>

                  </div>

                </div>

                <span className="text-xl font-black text-[#081022]">
                  {programmeCount}
                </span>

              </div>

              {/* Courses */}

              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white ring-1 ring-slate-200">

                    <BookOpen className="h-5 w-5 text-[#081022]" />

                  </div>

                  <div>

                    <p className="text-sm font-semibold text-slate-800">
                      Courses
                    </p>

                    <p className="text-xs text-slate-500">
                      Available courses
                    </p>

                  </div>

                </div>

                <span className="text-xl font-black text-[#081022]">
                  {courseCount}
                </span>

              </div>

            </CardContent>

          </Card>

        </div>

      </div>

      {/* ============================================================
          NOTICE BOARD
      ============================================================ */}

      <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

        <CardHeader className="flex flex-col gap-3 border-b border-slate-200 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-2">

            <Megaphone className="h-5 w-5 text-[#8a6a1f]" />

            <div>

              <CardTitle className="text-base font-bold text-[#081022]">
                Notice Board
              </CardTitle>

              <p className="mt-1 text-xs text-slate-500">
                Recent institution announcements
              </p>

            </div>

          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              navigate("/admin/notifications")
            }
            className="w-full sm:w-auto"
          >
            View All Notices
          </Button>

        </CardHeader>

        <CardContent className="p-0">

          {latestNotices.length === 0 ? (

            <div className="flex flex-col items-center justify-center px-6 py-12 text-center">

              <Megaphone className="h-8 w-8 text-slate-300" />

              <p className="mt-3 text-sm font-semibold text-slate-500">
                No recent notices
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Announcements will appear here.
              </p>

            </div>

          ) : (

            <div className="divide-y divide-slate-100">

              {latestNotices.map((notice, index) => (

                <div
                  key={notice._id || notice.id || index}
                  className="flex gap-4 p-5 transition hover:bg-slate-50"
                >

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#faf6ec] text-[#8a6a1f]">

                    <Megaphone className="h-4 w-4" />

                  </div>

                  <div className="min-w-0 flex-1">

                    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">

                      <p className="text-sm font-bold text-[#081022]">
                        {notice.title || "Institution Notice"}
                      </p>

                      {notice.date && (
                        <span className="shrink-0 text-[10px] text-slate-400">
                          {new Date(
                            notice.date
                          ).toLocaleDateString()}
                        </span>
                      )}

                    </div>

                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {notice.notice ||
                        notice.message ||
                        notice.description ||
                        "No notice content provided."}
                    </p>

                    <p className="mt-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Posted by{" "}
                      {notice.posted_by ||
                        notice.postedBy ||
                        "Administration"}
                    </p>

                  </div>

                </div>

              ))}

            </div>

          )}

        </CardContent>

      </Card>

    </div>
  );
}