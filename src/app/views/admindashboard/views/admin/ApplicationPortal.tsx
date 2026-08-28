// // import { useMemo, useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import {
// //   ArrowRight,
// //   CalendarDays,
// //   CheckCircle2,
// //   ClipboardCheck,
// //   Clock3,
// //   FileText,
// //   GraduationCap,
// //   Info,
// //   Settings2,
// //   Users,
// //   XCircle,
// //   AlertCircle,
// //   Power,
// // } from "lucide-react";

// // import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// // import { Button } from "@/components/ui/button";
// // import { useContext } from "react";
// // import { SessionContext } from "@/contexts/SessionContext";
// // import useFetch from "@/hooks/useFetch";

// // type Application = {
// //   _id?: string;
// //   id?: string;
// //   applicationId?: string;
// //   name?: string;
// //   fullname?: string;
// //   fullName?: string;
// //   email?: string;
// //   programme?: string;
// //   course?: string;
// //   status?: string;
// //   createdAt?: string;
// //   created?: string;
// //   submittedAt?: string;
// // };

// // const countItems = (value: unknown) =>
// //   Array.isArray(value) ? value.length : 0;

// // const normalizeStatus = (status?: string) =>
// //   (status || "").toLowerCase().replace(/[\s_-]/g, "");

// // export default function ApplicationPortal() {
// //   const navigate = useNavigate();

// //   const { currentSession } = useContext(SessionContext);

// //   const sessionId = currentSession?._id;

// //   /*
// //    * ------------------------------------------------------------------
// //    * APPLICATION DATA
// //    * ------------------------------------------------------------------
// //    *
// //    * This page reads the applications submitted by students.
// //    *
// //    * The actual approval/rejection process will happen on:
// //    *
// //    * /admin/admissions/review
// //    *
// //    * If your backend endpoint has a different name, change it here.
// //    */

// //   const { data: rawApplications } = useFetch(
// //     sessionId ? `/applications/${sessionId}` : null
// //   );

// //   const applications: Application[] = Array.isArray(rawApplications)
// //     ? rawApplications
// //     : [];

// //   /*
// //    * ------------------------------------------------------------------
// //    * APPLICATION COUNTS
// //    * ------------------------------------------------------------------
// //    */

// //   const submittedCount = useMemo(
// //     () =>
// //       applications.filter((application) => {
// //         const status = normalizeStatus(application.status);

// //         return (
// //           status === "submitted" ||
// //           status === "underreview" ||
// //           status === "review"
// //         );
// //       }).length,
// //     [applications]
// //   );

// //   const pendingCount = useMemo(
// //     () =>
// //       applications.filter((application) => {
// //         const status = normalizeStatus(application.status);

// //         return (
// //           status === "pending" ||
// //           status === "submitted" ||
// //           status === "underreview" ||
// //           status === "under_review"
// //         );
// //       }).length,
// //     [applications]
// //   );

// //   const acceptedCount = useMemo(
// //     () =>
// //       applications.filter((application) => {
// //         const status = normalizeStatus(application.status);

// //         return (
// //           status === "accepted" ||
// //           status === "approved" ||
// //           status === "admitted"
// //         );
// //       }).length,
// //     [applications]
// //   );

// //   const rejectedCount = useMemo(
// //     () =>
// //       applications.filter((application) => {
// //         const status = normalizeStatus(application.status);

// //         return status === "rejected" || status === "declined";
// //       }).length,
// //     [applications]
// //   );

// //   /*
// //    * ------------------------------------------------------------------
// //    * APPLICATION PORTAL STATE
// //    * ------------------------------------------------------------------
// //    *
// //    * This can later be connected to the backend.
// //    */

// //   const [applicationsOpen, setApplicationsOpen] = useState(true);

// //   /*
// //    * ------------------------------------------------------------------
// //    * RECENT APPLICATIONS
// //    * ------------------------------------------------------------------
// //    */

// //   const recentApplications = useMemo(() => {
// //     return [...applications]
// //       .sort((a, b) => {
// //         const dateA = new Date(
// //           a.submittedAt || a.createdAt || a.created || 0
// //         ).getTime();

// //         const dateB = new Date(
// //           b.submittedAt || b.createdAt || b.created || 0
// //         ).getTime();

// //         return dateB - dateA;
// //       })
// //       .slice(0, 6);
// //   }, [applications]);

// //   /*
// //    * ------------------------------------------------------------------
// //    * STATUS UI
// //    * ------------------------------------------------------------------
// //    */

// //   const getStatusStyle = (status?: string) => {
// //     const normalized = normalizeStatus(status);

// //     if (
// //       normalized === "accepted" ||
// //       normalized === "approved" ||
// //       normalized === "admitted"
// //     ) {
// //       return "bg-emerald-50 text-emerald-700 border-emerald-200";
// //     }

// //     if (
// //       normalized === "rejected" ||
// //       normalized === "declined"
// //     ) {
// //       return "bg-red-50 text-red-700 border-red-200";
// //     }

// //     if (
// //       normalized === "underreview" ||
// //       normalized === "review" ||
// //       normalized === "submitted" ||
// //       normalized === "pending"
// //     ) {
// //       return "bg-amber-50 text-amber-700 border-amber-200";
// //     }

// //     if (normalized === "draft") {
// //       return "bg-slate-100 text-slate-600 border-slate-200";
// //     }

// //     return "bg-slate-100 text-slate-600 border-slate-200";
// //   };

// //   /*
// //    * ------------------------------------------------------------------
// //    * RETURN
// //    * ------------------------------------------------------------------
// //    */

// //   return (
// //     <div className="min-h-full space-y-6 bg-slate-50 p-4 md:p-6">

// //       {/* ============================================================
// //           PAGE HEADER
// //       ============================================================ */}

// //       <div className="rounded-2xl bg-[#081022] p-6 text-white shadow-sm">

// //         <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

// //           <div>

// //             <div className="flex items-center gap-2 text-blue-200">

// //               <GraduationCap className="h-4 w-4" />

// //               <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
// //                 Admissions
// //               </span>

// //             </div>

// //             <h1 className="mt-2 text-2xl font-bold md:text-3xl">
// //               Application Portal
// //             </h1>

// //             <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
// //               Manage the institution's admission intake, monitor submitted
// //               applications and control when students can apply.
// //             </p>

// //           </div>

// //           {/* Portal Status */}

// //           <div className="min-w-[250px] rounded-xl border border-white/10 bg-white/10 p-4">

// //             <div className="flex items-center justify-between">

// //               <div className="flex items-center gap-2">

// //                 <div
// //                   className={`h-2.5 w-2.5 rounded-full ${
// //                     applicationsOpen
// //                       ? "bg-emerald-400"
// //                       : "bg-red-400"
// //                   }`}
// //                 />

// //                 <span className="text-xs font-semibold text-slate-200">
// //                   Application Portal
// //                 </span>

// //               </div>

// //               <span
// //                 className={`text-xs font-bold ${
// //                   applicationsOpen
// //                     ? "text-emerald-300"
// //                     : "text-red-300"
// //                 }`}
// //               >
// //                 {applicationsOpen ? "OPEN" : "CLOSED"}
// //               </span>

// //             </div>

// //             <p className="mt-3 text-sm text-slate-400">
// //               {currentSession?.name || "Current admission session"}
// //             </p>

// //           </div>

// //         </div>

// //       </div>

// //       {/* ============================================================
// //           PORTAL CONTROL
// //       ============================================================ */}

// //       <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

// //         <CardContent className="p-5">

// //           <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

// //             <div className="flex items-start gap-4">

// //               <div
// //                 className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
// //                   applicationsOpen
// //                     ? "bg-emerald-50 text-emerald-700"
// //                     : "bg-red-50 text-red-700"
// //                 }`}
// //               >
// //                 <Power className="h-5 w-5" />
// //               </div>

// //               <div>

// //                 <p className="text-sm font-bold text-[#081022]">
// //                   Application Intake
// //                 </p>

// //                 <p className="mt-1 text-xs leading-5 text-slate-500">
// //                   {applicationsOpen
// //                     ? "Students can currently submit admission applications."
// //                     : "The admission application portal is currently closed."}
// //                 </p>

// //               </div>

// //             </div>

// //             <div className="flex flex-col gap-2 sm:flex-row">

// //               <Button
// //                 variant="outline"
// //                 onClick={() => navigate("/admin/admissions/review")}
// //                 className="border-slate-300"
// //               >
// //                 <ClipboardCheck className="mr-2 h-4 w-4" />
// //                 Review Applications
// //               </Button>

// //               <Button
// //                 onClick={() => setApplicationsOpen((value) => !value)}
// //                 className={
// //                   applicationsOpen
// //                     ? "bg-red-600 hover:bg-red-700"
// //                     : "bg-emerald-600 hover:bg-emerald-700"
// //                 }
// //               >
// //                 <Power className="mr-2 h-4 w-4" />
// //                 {applicationsOpen ? "Close Portal" : "Open Portal"}
// //               </Button>

// //             </div>

// //           </div>

// //         </CardContent>

// //       </Card>

// //       {/* ============================================================
// //           APPLICATION STATISTICS
// //       ============================================================ */}

// //       <div>

// //         <div className="mb-3">

// //           <h2 className="text-lg font-bold text-[#081022]">
// //             Application Overview
// //           </h2>

// //           <p className="text-xs text-slate-500">
// //             Current admission application activity
// //           </p>

// //         </div>

// //         <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

// //           {/* Total */}

// //           <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

// //             <CardContent className="flex items-center gap-4 p-5">

// //               <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
// //                 <FileText className="h-5 w-5" />
// //               </div>

// //               <div>
// //                 <p className="text-2xl font-black text-[#081022]">
// //                   {countItems(applications)}
// //                 </p>

// //                 <p className="text-sm font-bold text-slate-800">
// //                   Total Applications
// //                 </p>

// //                 <p className="text-[10px] uppercase tracking-wider text-slate-400">
// //                   All applications
// //                 </p>
// //               </div>

// //             </CardContent>

// //           </Card>

// //           {/* Pending */}

// //           <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

// //             <CardContent className="flex items-center gap-4 p-5">

// //               <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
// //                 <Clock3 className="h-5 w-5" />
// //               </div>

// //               <div>
// //                 <p className="text-2xl font-black text-[#081022]">
// //                   {pendingCount}
// //                 </p>

// //                 <p className="text-sm font-bold text-slate-800">
// //                   Pending Review
// //                 </p>

// //                 <p className="text-[10px] uppercase tracking-wider text-slate-400">
// //                   Need attention
// //                 </p>
// //               </div>

// //             </CardContent>

// //           </Card>

// //           {/* Accepted */}

// //           <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

// //             <CardContent className="flex items-center gap-4 p-5">

// //               <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
// //                 <CheckCircle2 className="h-5 w-5" />
// //               </div>

// //               <div>
// //                 <p className="text-2xl font-black text-[#081022]">
// //                   {acceptedCount}
// //                 </p>

// //                 <p className="text-sm font-bold text-slate-800">
// //                   Accepted
// //                 </p>

// //                 <p className="text-[10px] uppercase tracking-wider text-slate-400">
// //                   Approved applicants
// //                 </p>
// //               </div>

// //             </CardContent>

// //           </Card>

// //           {/* Rejected */}

// //           <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

// //             <CardContent className="flex items-center gap-4 p-5">

// //               <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-700">
// //                 <XCircle className="h-5 w-5" />
// //               </div>

// //               <div>
// //                 <p className="text-2xl font-black text-[#081022]">
// //                   {rejectedCount}
// //                 </p>

// //                 <p className="text-sm font-bold text-slate-800">
// //                   Rejected
// //                 </p>

// //                 <p className="text-[10px] uppercase tracking-wider text-slate-400">
// //                   Unsuccessful
// //                 </p>
// //               </div>

// //             </CardContent>

// //           </Card>

// //         </div>

// //       </div>

// //       {/* ============================================================
// //           ADMISSION SESSION
// //       ============================================================ */}

// //       <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">

// //         {/* Session information */}

// //         <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

// //           <CardHeader className="border-b border-slate-200">

// //             <CardTitle className="flex items-center gap-2 text-base font-bold text-[#081022]">

// //               <CalendarDays className="h-5 w-5" />

// //               Admission Session

// //             </CardTitle>

// //           </CardHeader>

// //           <CardContent className="p-5">

// //             <div className="grid gap-4 sm:grid-cols-2">

// //               <div className="rounded-xl border border-slate-200 p-4">

// //                 <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
// //                   Academic Session
// //                 </p>

// //                 <p className="mt-2 text-lg font-bold text-[#081022]">
// //                   {currentSession?.name || "Not Set"}
// //                 </p>

// //               </div>

// //               <div className="rounded-xl border border-slate-200 p-4">

// //                 <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
// //                   Application Status
// //                 </p>

// //                 <p
// //                   className={`mt-2 text-lg font-bold ${
// //                     applicationsOpen
// //                       ? "text-emerald-600"
// //                       : "text-red-600"
// //                   }`}
// //                 >
// //                   {applicationsOpen ? "Applications Open" : "Applications Closed"}
// //                 </p>

// //               </div>

// //               <div className="rounded-xl border border-slate-200 p-4">

// //                 <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
// //                   Applications Received
// //                 </p>

// //                 <p className="mt-2 text-lg font-bold text-[#081022]">
// //                   {submittedCount}
// //                 </p>

// //               </div>

// //               <div className="rounded-xl border border-slate-200 p-4">

// //                 <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
// //                   Awaiting Decision
// //                 </p>

// //                 <p className="mt-2 text-lg font-bold text-amber-600">
// //                   {pendingCount}
// //                 </p>

// //               </div>

// //             </div>

// //           </CardContent>

// //         </Card>

// //         {/* Portal settings */}

// //         <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

// //           <CardHeader className="border-b border-slate-200">

// //             <CardTitle className="flex items-center gap-2 text-base font-bold text-[#081022]">

// //               <Settings2 className="h-5 w-5" />

// //               Portal Management

// //             </CardTitle>

// //           </CardHeader>

// //           <CardContent className="space-y-3 p-4">

// //             <button
// //               type="button"
// //               onClick={() =>
// //                 navigate("/admin/admissions/credentials")
// //               }
// //               className="flex w-full items-center gap-3 rounded-xl border border-slate-200 p-4 text-left transition hover:border-[#081022] hover:bg-slate-50"
// //             >

// //               <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
// //                 <GraduationCap className="h-5 w-5" />
// //               </div>

// //               <div className="min-w-0">

// //                 <p className="text-sm font-bold text-[#081022]">
// //                   Admission Requirements
// //                 </p>

// //                 <p className="mt-1 text-xs text-slate-500">
// //                   Configure academic and credential requirements
// //                 </p>

// //               </div>

// //               <ArrowRight className="ml-auto h-4 w-4 text-slate-400" />

// //             </button>

// //             <button
// //               type="button"
// //               onClick={() =>
// //                 navigate("/admin/admissions/batches")
// //               }
// //               className="flex w-full items-center gap-3 rounded-xl border border-slate-200 p-4 text-left transition hover:border-[#081022] hover:bg-slate-50"
// //             >

// //               <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-700">
// //                 <Users className="h-5 w-5" />
// //               </div>

// //               <div className="min-w-0">

// //                 <p className="text-sm font-bold text-[#081022]">
// //                   Admission Batches
// //                 </p>

// //                 <p className="mt-1 text-xs text-slate-500">
// //                   Manage admission groups and intake periods
// //                 </p>

// //               </div>

// //               <ArrowRight className="ml-auto h-4 w-4 text-slate-400" />

// //             </button>

// //             <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">

// //               <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />

// //               <p className="text-xs leading-5 text-slate-500">
// //                 Applications submitted by students remain pending until an
// //                 administrator reviews and makes an admission decision.
// //               </p>

// //             </div>

// //           </CardContent>

// //         </Card>

// //       </div>

// //       {/* ============================================================
// //           RECENT APPLICATIONS
// //       ============================================================ */}

// //       <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

// //         <CardHeader className="flex flex-col gap-3 border-b border-slate-200 sm:flex-row sm:items-center sm:justify-between">

// //           <div>

// //             <CardTitle className="text-base font-bold text-[#081022]">
// //               Recent Applications
// //             </CardTitle>

// //             <p className="mt-1 text-xs text-slate-500">
// //               Latest students who have submitted admission applications
// //             </p>

// //           </div>

// //           <Button
// //             variant="outline"
// //             size="sm"
// //             onClick={() =>
// //               navigate("/admin/admissions/review")
// //             }
// //             className="w-full sm:w-auto"
// //           >
// //             Review All Applications
// //             <ArrowRight className="ml-2 h-4 w-4" />
// //           </Button>

// //         </CardHeader>

// //         <CardContent className="p-0">

// //           {recentApplications.length === 0 ? (

// //             <div className="flex flex-col items-center justify-center px-6 py-12 text-center">

// //               <FileText className="h-9 w-9 text-slate-300" />

// //               <p className="mt-3 text-sm font-semibold text-slate-500">
// //                 No applications yet
// //               </p>

// //               <p className="mt-1 text-xs text-slate-400">
// //                 Submitted student applications will appear here.
// //               </p>

// //             </div>

// //           ) : (

// //             <div className="overflow-x-auto">

// //               <table className="w-full min-w-[700px]">

// //                 <thead>

// //                   <tr className="border-b border-slate-200 bg-slate-50">

// //                     <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
// //                       Applicant
// //                     </th>

// //                     <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
// //                       Application ID
// //                     </th>

// //                     <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
// //                       Programme
// //                     </th>

// //                     <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
// //                       Status
// //                     </th>

// //                     <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-500">
// //                       Action
// //                     </th>

// //                   </tr>

// //                 </thead>

// //                 <tbody className="divide-y divide-slate-100">

// //                   {recentApplications.map((application, index) => {

// //                     const applicantName =
// //                       application.fullName ||
// //                       application.fullname ||
// //                       application.name ||
// //                       "Unknown Applicant";

// //                     const applicationId =
// //                       application.applicationId ||
// //                       application.id ||
// //                       application._id ||
// //                       `APP-${index + 1}`;

// //                     const programme =
// //                       application.programme ||
// //                       application.course ||
// //                       "Not specified";

// //                     return (

// //                       <tr
// //                         key={
// //                           application._id ||
// //                           application.id ||
// //                           applicationId
// //                         }
// //                         className="transition hover:bg-slate-50"
// //                       >

// //                         <td className="px-5 py-4">

// //                           <div className="flex items-center gap-3">

// //                             <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#081022] text-xs font-bold text-white">
// //                               {applicantName
// //                                 .charAt(0)
// //                                 .toUpperCase()}
// //                             </div>

// //                             <div>

// //                               <p className="text-sm font-bold text-[#081022]">
// //                                 {applicantName}
// //                               </p>

// //                               <p className="text-xs text-slate-400">
// //                                 {application.email || "No email"}
// //                               </p>

// //                             </div>

// //                           </div>

// //                         </td>

// //                         <td className="px-5 py-4">

// //                           <span className="font-mono text-xs text-slate-600">
// //                             {applicationId}
// //                           </span>

// //                         </td>

// //                         <td className="px-5 py-4">

// //                           <span className="text-sm text-slate-600">
// //                             {programme}
// //                           </span>

// //                         </td>

// //                         <td className="px-5 py-4">

// //                           <span
// //                             className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-bold ${getStatusStyle(
// //                               application.status
// //                             )}`}
// //                           >
// //                             {application.status || "Pending"}
// //                           </span>

// //                         </td>

// //                         <td className="px-5 py-4 text-right">

// //                           <Button
// //                             variant="outline"
// //                             size="sm"
// //                             onClick={() =>
// //                               navigate(
// //                                 `/admin/admissions/review/${applicationId}`
// //                               )
// //                             }
// //                             className="h-8 text-xs"
// //                           >
// //                             Review
// //                           </Button>

// //                         </td>

// //                       </tr>

// //                     );
// //                   })}

// //                 </tbody>

// //               </table>

// //             </div>

// //           )}

// //         </CardContent>

// //       </Card>

// //       {/* ============================================================
// //           IMPORTANT NOTICE
// //       ============================================================ */}

// //       {pendingCount > 0 && (

// //         <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">

// //           <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

// //           <div>

// //             <p className="text-sm font-bold text-amber-900">
// //               {pendingCount} application
// //               {pendingCount === 1 ? "" : "s"} awaiting review
// //             </p>

// //             <p className="mt-1 text-xs leading-5 text-amber-700">
// //               These applicants have submitted their applications and are
// //               waiting for an administrator to review and approve or reject
// //               their admission.
// //             </p>

// //             <button
// //               type="button"
// //               onClick={() =>
// //                 navigate("/admin/admissions/review")
// //               }
// //               className="mt-2 text-xs font-bold text-amber-800 underline"
// //             >
// //               Go to Application Review
// //             </button>

// //           </div>

// //         </div>

// //       )}

// //     </div>
// //   );
// // }
// import { useMemo, useState, useContext } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   ArrowRight,
//   CalendarDays,
//   CheckCircle2,
//   ClipboardCheck,
//   Clock3,
//   FileText,
//   GraduationCap,
//   Info,
//   Settings2,
//   Users,
//   XCircle,
//   AlertCircle,
//   Power,
// } from "lucide-react";

// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";

// import { Button } from "@/components/ui/button";

// import { SessionContext } from "@/contexts/SessionContext";
// import useFetch from "@/hooks/useFetch";

// /* ============================================================
//    TYPES
// ============================================================ */

// type Programme = {
//   _id?: string;
//   name?: string;
//   title?: string;
//   code?: string;
// };

// type User = {
//   _id?: string;
//   firstName?: string;
//   lastName?: string;
//   fullName?: string;
//   fullname?: string;
//   name?: string;
//   email?: string;
// };

// type Session = {
//   _id?: string;
//   name?: string;
// };

// type Application = {
//   _id?: string;

//   applicationNumber?: string;
//   applicationId?: string;
//   id?: string;

//   status?: string;

//   applicationFee?: number;
//   applicationFeePaid?: boolean;

//   acceptanceFee?: number;
//   acceptanceFeePaid?: boolean;

//   user?: User | string;

//   session?: Session | string;

//   programme?: Programme | string;

//   createdAt?: string;
//   updatedAt?: string;
//   created?: string;
//   submittedAt?: string;
// };

// /* ============================================================
//    HELPERS
// ============================================================ */

// const normalizeStatus = (status?: string) =>
//   (status || "")
//     .toLowerCase()
//     .replace(/[\s_-]/g, "");

// /* ============================================================
//    PROGRAMME NAME
// ============================================================ */

// const getProgrammeName = (
//   programme?: Programme | string
// ): string => {
//   if (!programme) {
//     return "Not specified";
//   }

//   if (typeof programme === "string") {
//     return programme;
//   }

//   return (
//     programme.name ||
//     programme.title ||
//     programme.code ||
//     "Not specified"
//   );
// };

// /* ============================================================
//    APPLICANT NAME
// ============================================================ */

// const getApplicantName = (
//   user?: User | string
// ): string => {
//   if (!user) {
//     return "Unknown Applicant";
//   }

//   if (typeof user === "string") {
//     return "Applicant";
//   }

//   if (user.fullName) {
//     return user.fullName;
//   }

//   if (user.fullname) {
//     return user.fullname;
//   }

//   if (user.name) {
//     return user.name;
//   }

//   const fullName = [user.firstName, user.lastName]
//     .filter(Boolean)
//     .join(" ");

//   return fullName || "Unknown Applicant";
// };

// /* ============================================================
//    APPLICANT EMAIL
// ============================================================ */

// const getApplicantEmail = (
//   user?: User | string
// ): string => {
//   if (!user || typeof user === "string") {
//     return "No email";
//   }

//   return user.email || "No email";
// };

// /* ============================================================
//    MAIN PAGE
// ============================================================ */

// export default function ApplicationPortal() {
//   const navigate = useNavigate();

//   const { currentSession } = useContext(SessionContext);

//   const sessionId = currentSession?._id;

//   /* ============================================================
//      APPLICATION DATA
//   ============================================================ */

//   const { data: rawApplications } = useFetch(
//     sessionId
//       ? `/applications/${sessionId}`
//       : null
//   );

//   /*
//    * Some APIs return:
//    *
//    * [
//    *   {...},
//    *   {...}
//    * ]
//    *
//    * Others return:
//    *
//    * {
//    *   applications: [...]
//    * }
//    *
//    * This handles both.
//    */

//   const applications: Application[] = useMemo(() => {
//     if (Array.isArray(rawApplications)) {
//       return rawApplications;
//     }import { useContext, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import {
//   ArrowRight,
//   CalendarDays,
//   CheckCircle2,
//   ClipboardCheck,
//   Clock3,
//   FileText,
//   GraduationCap,
//   Info,
//   Settings2,
//   Users,
//   XCircle,
//   AlertCircle,
//   Power,
//   Loader2,
//   RefreshCw,
// } from "lucide-react";

// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { SessionContext } from "@/contexts/SessionContext";
// import useFetch from "@/hooks/useFetch";

// /* ================================================================
//    TYPES — mirrors ApplicationReview.tsx's backend shape exactly,
//    so both pages agree on what the API actually returns.
// ================================================================ */

// type BackendApplicationStatus =
//   | "Pending"
//   | "Submitted"
//   | "Approved"
//   | "Rejected";

// interface BackendUser {
//   _id: string;
//   username?: string;
//   studentName?: string;
//   email?: string;
//   phone?: number | string;
// }

// interface BackendProgramme {
//   _id: string;
//   name?: string;
//   programmeName?: string;
//   title?: string;
//   code?: string;
// }

// interface BackendApplication {
//   _id: string;
//   applicationNumber?: string;
//   user?: BackendUser | string;
//   programme?: BackendProgramme | string;
//   status: BackendApplicationStatus;
//   applicationFeePaid?: boolean;
//   createdAt?: string;
//   updatedAt?: string;
// }

// /*
//  * getAllApplications may come back as a bare array, or wrapped as
//  * { applications: [...] } / { data: [...] }. We narrow with typeof +
//  * Array.isArray on every branch instead of ever indexing `unknown`
//  * directly — that's what was throwing ts(2339).
//  */
// type ApplicationsResponse =
//   | BackendApplication[]
//   | { applications?: BackendApplication[] }
//   | { data?: BackendApplication[] }
//   | null
//   | undefined;

// interface Application {
//   id: string;
//   applicationNumber: string;
//   name: string;
//   email: string;
//   programme: string;
//   status: BackendApplicationStatus;
//   applicationFeePaid: boolean;
//   submittedDate?: string;
// }

// /* ================================================================
//    HELPERS
// ================================================================ */

// const getProgrammeName = (programme?: BackendProgramme | string): string => {
//   if (!programme) return "Not specified";
//   if (typeof programme === "string") return programme;
//   return (
//     programme.name ||
//     programme.programmeName ||
//     programme.title ||
//     programme.code ||
//     "Not specified"
//   );
// };

// const getApplicantName = (user?: BackendUser | string): string => {
//   if (!user) return "Unknown Applicant";
//   if (typeof user === "string") return "Applicant";
//   return user.studentName || user.username || "Unnamed Applicant";
// };

// const getApplicantEmail = (user?: BackendUser | string): string => {
//   if (!user || typeof user === "string") return "No email";
//   return user.email || "No email";
// };

// const getStatusStyle = (status: BackendApplicationStatus) => {
//   switch (status) {
//     case "Approved":
//       return "bg-emerald-50 text-emerald-700 border-emerald-200";
//     case "Rejected":
//       return "bg-red-50 text-red-700 border-red-200";
//     case "Submitted":
//       return "bg-blue-50 text-blue-700 border-blue-200";
//     case "Pending":
//     default:
//       return "bg-amber-50 text-amber-700 border-amber-200";
//   }
// };

// /* ================================================================
//    MAIN COMPONENT
// ================================================================ */

// export default function ApplicationPortal() {
//   const navigate = useNavigate();
//   const { currentSession } = useContext(SessionContext);

//   // Same endpoint the Review page uses — getAllApplications lives at /applications,
//   // not /applications/:sessionId.
//   const {
//     data: rawApplications,
//     loading,
//     error,
//     reFetch,
//   } = useFetch<ApplicationsResponse>("/applications");

//   const [applicationsOpen, setApplicationsOpen] = useState(true);

//   /* ==============================================================
//      NORMALIZE RESPONSE — properly type-guarded, no `unknown` indexing
//   ============================================================== */

//   const applications = useMemo<Application[]>(() => {
//     let list: BackendApplication[] = [];

//     if (Array.isArray(rawApplications)) {
//       list = rawApplications;
//     } else if (
//       rawApplications &&
//       typeof rawApplications === "object" &&
//       Array.isArray((rawApplications as { applications?: BackendApplication[] }).applications)
//     ) {
//       list = (rawApplications as { applications: BackendApplication[] }).applications;
//     } else if (
//       rawApplications &&
//       typeof rawApplications === "object" &&
//       Array.isArray((rawApplications as { data?: BackendApplication[] }).data)
//     ) {
//       list = (rawApplications as { data: BackendApplication[] }).data;
//     }

//     return list.map((application): Application => ({
//       id: application._id,
//       applicationNumber: application.applicationNumber || "No Application Number",
//       name: getApplicantName(application.user),
//       email: getApplicantEmail(application.user),
//       programme: getProgrammeName(application.programme),
//       status: application.status || "Pending",
//       applicationFeePaid: Boolean(application.applicationFeePaid),
//       submittedDate: application.createdAt,
//     }));
//   }, [rawApplications]);

//   /* ==============================================================
//      COUNTS — aligned to the real 4-value backend enum
//   ============================================================== */

//   const pendingCount = useMemo(
//     () => applications.filter((a) => a.status === "Pending" || a.status === "Submitted").length,
//     [applications]
//   );

//   const submittedCount = useMemo(
//     () => applications.filter((a) => a.status === "Submitted").length,
//     [applications]
//   );

//   const acceptedCount = useMemo(
//     () => applications.filter((a) => a.status === "Approved").length,
//     [applications]
//   );

//   const rejectedCount = useMemo(
//     () => applications.filter((a) => a.status === "Rejected").length,
//     [applications]
//   );

//   const recentApplications = useMemo(() => {
//     return [...applications]
//       .sort((a, b) => {
//         const dateA = new Date(a.submittedDate || 0).getTime();
//         const dateB = new Date(b.submittedDate || 0).getTime();
//         return dateB - dateA;
//       })
//       .slice(0, 6);
//   }, [applications]);

//   /* ==============================================================
//      LOADING
//   ============================================================== */

//   if (loading) {
//     return (
//       <div className="flex min-h-[500px] items-center justify-center bg-slate-50 p-6">
//         <div className="flex flex-col items-center">
//           <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
//           <p className="mt-3 text-sm text-slate-500">Loading applications...</p>
//         </div>
//       </div>
//     );
//   }

//   /* ==============================================================
//      RENDER
//   ============================================================== */

//   return (
//     <div className="min-h-full space-y-6 bg-slate-50 p-4 md:p-6">
//       {/* HEADER */}
//       <div className="rounded-2xl bg-[#081022] p-6 text-white shadow-sm">
//         <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
//           <div>
//             <div className="flex items-center gap-2 text-blue-200">
//               <GraduationCap className="h-4 w-4" />
//               <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Admissions</span>
//             </div>
//             <h1 className="mt-2 text-2xl font-bold md:text-3xl">Application Portal</h1>
//             <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
//               Manage the institution&apos;s admission intake, monitor submitted applications and control
//               when students can apply.
//             </p>
//           </div>

//           <div className="min-w-[250px] rounded-xl border border-white/10 bg-white/10 p-4">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center gap-2">
//                 <div
//                   className={`h-2.5 w-2.5 rounded-full ${
//                     applicationsOpen ? "bg-emerald-400" : "bg-red-400"
//                   }`}
//                 />
//                 <span className="text-xs font-semibold text-slate-200">Application Portal</span>
//               </div>
//               <span className={`text-xs font-bold ${applicationsOpen ? "text-emerald-300" : "text-red-300"}`}>
//                 {applicationsOpen ? "OPEN" : "CLOSED"}
//               </span>
//             </div>
//             <p className="mt-3 text-sm text-slate-400">
//               {currentSession?.name || "Current admission session"}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* ERROR */}
//       {error && (
//         <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
//           <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
//           <div className="flex-1">
//             <p className="text-sm font-bold text-red-700">Unable to load applications</p>
//             <p className="mt-1 text-xs leading-5 text-red-600">
//               The application list could not be loaded from the server.
//             </p>
//           </div>
//           <button
//             type="button"
//             onClick={() => reFetch()}
//             className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50"
//           >
//             <RefreshCw className="h-3.5 w-3.5" />
//             Retry
//           </button>
//         </div>
//       )}

//       {/* PORTAL CONTROL */}
//       <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
//         <CardContent className="p-5">
//           <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
//             <div className="flex items-start gap-4">
//               <div
//                 className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
//                   applicationsOpen ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
//                 }`}
//               >
//                 <Power className="h-5 w-5" />
//               </div>
//               <div>
//                 <p className="text-sm font-bold text-[#081022]">Application Intake</p>
//                 <p className="mt-1 text-xs leading-5 text-slate-500">
//                   {applicationsOpen
//                     ? "Students can currently submit admission applications."
//                     : "The admission application portal is currently closed."}
//                 </p>
//               </div>
//             </div>

//             <div className="flex flex-col gap-2 sm:flex-row">
//               <Button
//                 variant="outline"
//                 onClick={() => navigate("/admin/admissions/review")}
//                 className="border-slate-300"
//               >
//                 <ClipboardCheck className="mr-2 h-4 w-4" />
//                 Review Applications
//               </Button>

//               <Button
//                 onClick={() => setApplicationsOpen((v) => !v)}
//                 className={applicationsOpen ? "bg-red-600 hover:bg-red-700" : "bg-emerald-600 hover:bg-emerald-700"}
//               >
//                 <Power className="mr-2 h-4 w-4" />
//                 {applicationsOpen ? "Close Portal" : "Open Portal"}
//               </Button>
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* STATISTICS */}
//       <div>
//         <div className="mb-3">
//           <h2 className="text-lg font-bold text-[#081022]">Application Overview</h2>
//           <p className="text-xs text-slate-500">Current admission application activity</p>
//         </div>

//         <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
//           <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
//             <CardContent className="flex items-center gap-4 p-5">
//               <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
//                 <FileText className="h-5 w-5" />
//               </div>
//               <div>
//                 <p className="text-2xl font-black text-[#081022]">{applications.length}</p>
//                 <p className="text-sm font-bold text-slate-800">Total Applications</p>
//                 <p className="text-[10px] uppercase tracking-wider text-slate-400">All applications</p>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
//             <CardContent className="flex items-center gap-4 p-5">
//               <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
//                 <Clock3 className="h-5 w-5" />
//               </div>
//               <div>
//                 <p className="text-2xl font-black text-[#081022]">{pendingCount}</p>
//                 <p className="text-sm font-bold text-slate-800">Pending Review</p>
//                 <p className="text-[10px] uppercase tracking-wider text-slate-400">Need attention</p>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
//             <CardContent className="flex items-center gap-4 p-5">
//               <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
//                 <CheckCircle2 className="h-5 w-5" />
//               </div>
//               <div>
//                 <p className="text-2xl font-black text-[#081022]">{acceptedCount}</p>
//                 <p className="text-sm font-bold text-slate-800">Accepted</p>
//                 <p className="text-[10px] uppercase tracking-wider text-slate-400">Approved applicants</p>
//               </div>
//             </CardContent>
//           </Card>

//           <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
//             <CardContent className="flex items-center gap-4 p-5">
//               <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-700">
//                 <XCircle className="h-5 w-5" />
//               </div>
//               <div>
//                 <p className="text-2xl font-black text-[#081022]">{rejectedCount}</p>
//                 <p className="text-sm font-bold text-slate-800">Rejected</p>
//                 <p className="text-[10px] uppercase tracking-wider text-slate-400">Unsuccessful</p>
//               </div>
//             </CardContent>
//           </Card>
//         </div>
//       </div>

//       {/* SESSION + PORTAL MGMT */}
//       <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
//         <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
//           <CardHeader className="border-b border-slate-200">
//             <CardTitle className="flex items-center gap-2 text-base font-bold text-[#081022]">
//               <CalendarDays className="h-5 w-5" />
//               Admission Session
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="p-5">
//             <div className="grid gap-4 sm:grid-cols-2">
//               <div className="rounded-xl border border-slate-200 p-4">
//                 <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Academic Session</p>
//                 <p className="mt-2 text-lg font-bold text-[#081022]">{currentSession?.name || "Not Set"}</p>
//               </div>
//               <div className="rounded-xl border border-slate-200 p-4">
//                 <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Application Status</p>
//                 <p className={`mt-2 text-lg font-bold ${applicationsOpen ? "text-emerald-600" : "text-red-600"}`}>
//                   {applicationsOpen ? "Applications Open" : "Applications Closed"}
//                 </p>
//               </div>
//               <div className="rounded-xl border border-slate-200 p-4">
//                 <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Applications Received</p>
//                 <p className="mt-2 text-lg font-bold text-[#081022]">{applications.length}</p>
//               </div>
//               <div className="rounded-xl border border-slate-200 p-4">
//                 <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Awaiting Decision</p>
//                 <p className="mt-2 text-lg font-bold text-amber-600">{pendingCount}</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
//           <CardHeader className="border-b border-slate-200">
//             <CardTitle className="flex items-center gap-2 text-base font-bold text-[#081022]">
//               <Settings2 className="h-5 w-5" />
//               Portal Management
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-3 p-4">
//             <button
//               type="button"
//               onClick={() => navigate("/admin/admissions/credentials")}
//               className="flex w-full items-center gap-3 rounded-xl border border-slate-200 p-4 text-left transition hover:border-[#081022] hover:bg-slate-50"
//             >
//               <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
//                 <GraduationCap className="h-5 w-5" />
//               </div>
//               <div className="min-w-0">
//                 <p className="text-sm font-bold text-[#081022]">Admission Requirements</p>
//                 <p className="mt-1 text-xs text-slate-500">Configure academic and credential requirements</p>
//               </div>
//               <ArrowRight className="ml-auto h-4 w-4 text-slate-400" />
//             </button>

//             <button
//               type="button"
//               onClick={() => navigate("/admin/admissions/batches")}
//               className="flex w-full items-center gap-3 rounded-xl border border-slate-200 p-4 text-left transition hover:border-[#081022] hover:bg-slate-50"
//             >
//               <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-700">
//                 <Users className="h-5 w-5" />
//               </div>
//               <div className="min-w-0">
//                 <p className="text-sm font-bold text-[#081022]">Admission Batches</p>
//                 <p className="mt-1 text-xs text-slate-500">Manage admission groups and intake periods</p>
//               </div>
//               <ArrowRight className="ml-auto h-4 w-4 text-slate-400" />
//             </button>

//             <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
//               <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
//               <p className="text-xs leading-5 text-slate-500">
//                 Applications submitted by students remain pending until an administrator reviews and makes an
//                 admission decision.
//               </p>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* RECENT APPLICATIONS */}
//       <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
//         <CardHeader className="flex flex-col gap-3 border-b border-slate-200 sm:flex-row sm:items-center sm:justify-between">
//           <div>
//             <CardTitle className="text-base font-bold text-[#081022]">Recent Applications</CardTitle>
//             <p className="mt-1 text-xs text-slate-500">Latest students who have submitted admission applications</p>
//           </div>
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => navigate("/admin/admissions/review")}
//             className="w-full sm:w-auto"
//           >
//             Review All Applications
//             <ArrowRight className="ml-2 h-4 w-4" />
//           </Button>
//         </CardHeader>
//         <CardContent className="p-0">
//           {recentApplications.length === 0 ? (
//             <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
//               <FileText className="h-9 w-9 text-slate-300" />
//               <p className="mt-3 text-sm font-semibold text-slate-500">No applications yet</p>
//               <p className="mt-1 text-xs text-slate-400">Submitted student applications will appear here.</p>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full min-w-[700px]">
//                 <thead>
//                   <tr className="border-b border-slate-200 bg-slate-50">
//                     <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
//                       Applicant
//                     </th>
//                     <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
//                       Application No.
//                     </th>
//                     <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
//                       Programme
//                     </th>
//                     <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
//                       Status
//                     </th>
//                     <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-500">
//                       Action
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-100">
//                   {recentApplications.map((application) => (
//                     <tr key={application.id} className="transition hover:bg-slate-50">
//                       <td className="px-5 py-4">
//                         <div className="flex items-center gap-3">
//                           <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#081022] text-xs font-bold text-white">
//                             {application.name.charAt(0).toUpperCase()}
//                           </div>
//                           <div>
//                             <p className="text-sm font-bold text-[#081022]">{application.name}</p>
//                             <p className="text-xs text-slate-400">{application.email}</p>
//                           </div>
//                         </div>
//                       </td>
//                       <td className="px-5 py-4">
//                         <span className="font-mono text-xs text-slate-600">{application.applicationNumber}</span>
//                       </td>
//                       <td className="px-5 py-4">
//                         <span className="text-sm text-slate-600">{application.programme}</span>
//                       </td>
//                       <td className="px-5 py-4">
//                         <span
//                           className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-bold ${getStatusStyle(
//                             application.status
//                           )}`}
//                         >
//                           {application.status}
//                         </span>
//                       </td>
//                       <td className="px-5 py-4 text-right">
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => navigate("/admin/admissions/review")}
//                           className="h-8 text-xs"
//                         >
//                           Review
//                         </Button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </CardContent>
//       </Card>

//       {/* NOTICE */}
//       {pendingCount > 0 && (
//         <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
//           <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
//           <div>
//             <p className="text-sm font-bold text-amber-900">
//               {pendingCount} application{pendingCount === 1 ? "" : "s"} awaiting review
//             </p>
//             <p className="mt-1 text-xs leading-5 text-amber-700">
//               These applicants have submitted their applications and are waiting for an administrator to review
//               and approve or reject their admission.
//             </p>
//             <button
//               type="button"
//               onClick={() => navigate("/admin/admissions/review")}
//               className="mt-2 text-xs font-bold text-amber-800 underline"
//             >
//               Go to Application Review
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

//     if (
//       rawApplications &&
//       Array.isArray(rawApplications.applications)
//     ) {
//       return rawApplications.applications;
//     }

//     return [];
//   }, [rawApplications]);

//   /* ============================================================
//      APPLICATION COUNTS
//   ============================================================ */

//   const submittedCount = useMemo(() => {
//     return applications.filter((application) => {
//       const status = normalizeStatus(application.status);

//       return (
//         status === "submitted" ||
//         status === "underreview" ||
//         status === "review"
//       );
//     }).length;
//   }, [applications]);

//   /* ============================================================
//      PENDING
//   ============================================================ */

//   const pendingCount = useMemo(() => {
//     return applications.filter((application) => {
//       const status = normalizeStatus(application.status);

//       return (
//         status === "pending" ||
//         status === "submitted" ||
//         status === "underreview" ||
//         status === "review"
//       );
//     }).length;
//   }, [applications]);

//   /* ============================================================
//      ACCEPTED
//   ============================================================ */

//   const acceptedCount = useMemo(() => {
//     return applications.filter((application) => {
//       const status = normalizeStatus(application.status);

//       return (
//         status === "accepted" ||
//         status === "approved" ||
//         status === "admitted"
//       );
//     }).length;
//   }, [applications]);

//   /* ============================================================
//      REJECTED
//   ============================================================ */

//   const rejectedCount = useMemo(() => {
//     return applications.filter((application) => {
//       const status = normalizeStatus(application.status);

//       return (
//         status === "rejected" ||
//         status === "declined"
//       );
//     }).length;
//   }, [applications]);

//   /* ============================================================
//      PORTAL STATUS
//   ============================================================ */

//   const [applicationsOpen, setApplicationsOpen] =
//     useState(true);

//   /* ============================================================
//      RECENT APPLICATIONS
//   ============================================================ */

//   const recentApplications = useMemo(() => {
//     return [...applications]
//       .sort((a, b) => {
//         const dateA = new Date(
//           a.submittedAt ||
//             a.createdAt ||
//             a.created ||
//             0
//         ).getTime();

//         const dateB = new Date(
//           b.submittedAt ||
//             b.createdAt ||
//             b.created ||
//             0
//         ).getTime();

//         return dateB - dateA;
//       })
//       .slice(0, 6);
//   }, [applications]);

//   /* ============================================================
//      STATUS STYLE
//   ============================================================ */

//   const getStatusStyle = (
//     status?: string
//   ) => {
//     const normalized =
//       normalizeStatus(status);

//     if (
//       normalized === "accepted" ||
//       normalized === "approved" ||
//       normalized === "admitted"
//     ) {
//       return "bg-emerald-50 text-emerald-700 border-emerald-200";
//     }

//     if (
//       normalized === "rejected" ||
//       normalized === "declined"
//     ) {
//       return "bg-red-50 text-red-700 border-red-200";
//     }

//     if (
//       normalized === "underreview" ||
//       normalized === "review" ||
//       normalized === "submitted" ||
//       normalized === "pending"
//     ) {
//       return "bg-amber-50 text-amber-700 border-amber-200";
//     }

//     if (normalized === "draft") {
//       return "bg-slate-100 text-slate-600 border-slate-200";
//     }

//     return "bg-slate-100 text-slate-600 border-slate-200";
//   };

//   /* ============================================================
//      RENDER
//   ============================================================ */

//   return (
//     <div className="min-h-full space-y-6 bg-slate-50 p-4 md:p-6">

//       {/* ========================================================
//           HEADER
//       ======================================================== */}

//       <div className="rounded-2xl bg-[#081022] p-6 text-white shadow-sm">

//         <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

//           <div>

//             <div className="flex items-center gap-2 text-blue-200">

//               <GraduationCap className="h-4 w-4" />

//               <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
//                 Admissions
//               </span>

//             </div>

//             <h1 className="mt-2 text-2xl font-bold md:text-3xl">
//               Application Portal
//             </h1>

//             <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
//               Manage the institution&apos;s admission intake,
//               monitor submitted applications and control when
//               students can apply.
//             </p>

//           </div>

//           {/* Portal status */}

//           <div className="min-w-[250px] rounded-xl border border-white/10 bg-white/10 p-4">

//             <div className="flex items-center justify-between">

//               <div className="flex items-center gap-2">

//                 <div
//                   className={`h-2.5 w-2.5 rounded-full ${
//                     applicationsOpen
//                       ? "bg-emerald-400"
//                       : "bg-red-400"
//                   }`}
//                 />

//                 <span className="text-xs font-semibold text-slate-200">
//                   Application Portal
//                 </span>

//               </div>

//               <span
//                 className={`text-xs font-bold ${
//                   applicationsOpen
//                     ? "text-emerald-300"
//                     : "text-red-300"
//                 }`}
//               >
//                 {applicationsOpen
//                   ? "OPEN"
//                   : "CLOSED"}
//               </span>

//             </div>

//             <p className="mt-3 text-sm text-slate-400">
//               {currentSession?.name ||
//                 "Current admission session"}
//             </p>

//           </div>

//         </div>

//       </div>

//       {/* ========================================================
//           PORTAL CONTROL
//       ======================================================== */}

//       <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

//         <CardContent className="p-5">

//           <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

//             <div className="flex items-start gap-4">

//               <div
//                 className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
//                   applicationsOpen
//                     ? "bg-emerald-50 text-emerald-700"
//                     : "bg-red-50 text-red-700"
//                 }`}
//               >
//                 <Power className="h-5 w-5" />
//               </div>

//               <div>

//                 <p className="text-sm font-bold text-[#081022]">
//                   Application Intake
//                 </p>

//                 <p className="mt-1 text-xs leading-5 text-slate-500">
//                   {applicationsOpen
//                     ? "Students can currently submit admission applications."
//                     : "The admission application portal is currently closed."}
//                 </p>

//               </div>

//             </div>

//             <div className="flex flex-col gap-2 sm:flex-row">

//               <Button
//                 variant="outline"
//                 onClick={() =>
//                   navigate(
//                     "/admin/admissions/review"
//                   )
//                 }
//                 className="border-slate-300"
//               >
//                 <ClipboardCheck className="mr-2 h-4 w-4" />
//                 Review Applications
//               </Button>

//               <Button
//                 onClick={() =>
//                   setApplicationsOpen(
//                     (value) => !value
//                   )
//                 }
//                 className={
//                   applicationsOpen
//                     ? "bg-red-600 hover:bg-red-700"
//                     : "bg-emerald-600 hover:bg-emerald-700"
//                 }
//               >
//                 <Power className="mr-2 h-4 w-4" />

//                 {applicationsOpen
//                   ? "Close Portal"
//                   : "Open Portal"}
//               </Button>

//             </div>

//           </div>

//         </CardContent>

//       </Card>

//       {/* ========================================================
//           STATISTICS
//       ======================================================== */}

//       <div>

//         <div className="mb-3">

//           <h2 className="text-lg font-bold text-[#081022]">
//             Application Overview
//           </h2>

//           <p className="text-xs text-slate-500">
//             Current admission application activity
//           </p>

//         </div>

//         <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

//           {/* Total */}

//           <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

//             <CardContent className="flex items-center gap-4 p-5">

//               <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
//                 <FileText className="h-5 w-5" />
//               </div>

//               <div>

//                 <p className="text-2xl font-black text-[#081022]">
//                   {applications.length}
//                 </p>

//                 <p className="text-sm font-bold text-slate-800">
//                   Total Applications
//                 </p>

//                 <p className="text-[10px] uppercase tracking-wider text-slate-400">
//                   All applications
//                 </p>

//               </div>

//             </CardContent>

//           </Card>

//           {/* Pending */}

//           <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

//             <CardContent className="flex items-center gap-4 p-5">

//               <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
//                 <Clock3 className="h-5 w-5" />
//               </div>

//               <div>

//                 <p className="text-2xl font-black text-[#081022]">
//                   {pendingCount}
//                 </p>

//                 <p className="text-sm font-bold text-slate-800">
//                   Pending Review
//                 </p>

//                 <p className="text-[10px] uppercase tracking-wider text-slate-400">
//                   Need attention
//                 </p>

//               </div>

//             </CardContent>

//           </Card>

//           {/* Accepted */}

//           <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

//             <CardContent className="flex items-center gap-4 p-5">

//               <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
//                 <CheckCircle2 className="h-5 w-5" />
//               </div>

//               <div>

//                 <p className="text-2xl font-black text-[#081022]">
//                   {acceptedCount}
//                 </p>

//                 <p className="text-sm font-bold text-slate-800">
//                   Accepted
//                 </p>

//                 <p className="text-[10px] uppercase tracking-wider text-slate-400">
//                   Approved applicants
//                 </p>

//               </div>

//             </CardContent>

//           </Card>

//           {/* Rejected */}

//           <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

//             <CardContent className="flex items-center gap-4 p-5">

//               <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-700">
//                 <XCircle className="h-5 w-5" />
//               </div>

//               <div>

//                 <p className="text-2xl font-black text-[#081022]">
//                   {rejectedCount}
//                 </p>

//                 <p className="text-sm font-bold text-slate-800">
//                   Rejected
//                 </p>

//                 <p className="text-[10px] uppercase tracking-wider text-slate-400">
//                   Unsuccessful
//                 </p>

//               </div>

//             </CardContent>

//           </Card>

//         </div>

//       </div>

//       {/* ========================================================
//           SESSION
//       ======================================================== */}

//       <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">

//         <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

//           <CardHeader className="border-b border-slate-200">

//             <CardTitle className="flex items-center gap-2 text-base font-bold text-[#081022]">

//               <CalendarDays className="h-5 w-5" />

//               Admission Session

//             </CardTitle>

//           </CardHeader>

//           <CardContent className="p-5">

//             <div className="grid gap-4 sm:grid-cols-2">

//               <div className="rounded-xl border border-slate-200 p-4">

//                 <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
//                   Academic Session
//                 </p>

//                 <p className="mt-2 text-lg font-bold text-[#081022]">
//                   {currentSession?.name ||
//                     "Not Set"}
//                 </p>

//               </div>

//               <div className="rounded-xl border border-slate-200 p-4">

//                 <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
//                   Application Status
//                 </p>

//                 <p
//                   className={`mt-2 text-lg font-bold ${
//                     applicationsOpen
//                       ? "text-emerald-600"
//                       : "text-red-600"
//                   }`}
//                 >
//                   {applicationsOpen
//                     ? "Applications Open"
//                     : "Applications Closed"}
//                 </p>

//               </div>

//               <div className="rounded-xl border border-slate-200 p-4">

//                 <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
//                   Applications Received
//                 </p>

//                 <p className="mt-2 text-lg font-bold text-[#081022]">
//                   {applications.length}
//                 </p>

//               </div>

//               <div className="rounded-xl border border-slate-200 p-4">

//                 <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
//                   Awaiting Decision
//                 </p>

//                 <p className="mt-2 text-lg font-bold text-amber-600">
//                   {pendingCount}
//                 </p>

//               </div>

//             </div>

//           </CardContent>

//         </Card>

//         {/* Portal management */}

//         <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

//           <CardHeader className="border-b border-slate-200">

//             <CardTitle className="flex items-center gap-2 text-base font-bold text-[#081022]">

//               <Settings2 className="h-5 w-5" />

//               Portal Management

//             </CardTitle>

//           </CardHeader>

//           <CardContent className="space-y-3 p-4">

//             <button
//               type="button"
//               onClick={() =>
//                 navigate(
//                   "/admin/admissions/credentials"
//                 )
//               }
//               className="flex w-full items-center gap-3 rounded-xl border border-slate-200 p-4 text-left transition hover:border-[#081022] hover:bg-slate-50"
//             >

//               <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
//                 <GraduationCap className="h-5 w-5" />
//               </div>

//               <div className="min-w-0">

//                 <p className="text-sm font-bold text-[#081022]">
//                   Admission Requirements
//                 </p>

//                 <p className="mt-1 text-xs text-slate-500">
//                   Configure academic and credential requirements
//                 </p>

//               </div>

//               <ArrowRight className="ml-auto h-4 w-4 text-slate-400" />

//             </button>

//             <button
//               type="button"
//               onClick={() =>
//                 navigate(
//                   "/admin/admissions/batches"
//                 )
//               }
//               className="flex w-full items-center gap-3 rounded-xl border border-slate-200 p-4 text-left transition hover:border-[#081022] hover:bg-slate-50"
//             >

//               <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-700">
//                 <Users className="h-5 w-5" />
//               </div>

//               <div className="min-w-0">

//                 <p className="text-sm font-bold text-[#081022]">
//                   Admission Batches
//                 </p>

//                 <p className="mt-1 text-xs text-slate-500">
//                   Manage admission groups and intake periods
//                 </p>

//               </div>

//               <ArrowRight className="ml-auto h-4 w-4 text-slate-400" />

//             </button>

//             <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">

//               <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />

//               <p className="text-xs leading-5 text-slate-500">
//                 Applications submitted by students remain
//                 pending until an administrator reviews and
//                 makes an admission decision.
//               </p>

//             </div>

//           </CardContent>

//         </Card>

//       </div>

//       {/* ========================================================
//           RECENT APPLICATIONS
//       ======================================================== */}

//       <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

//         <CardHeader className="flex flex-col gap-3 border-b border-slate-200 sm:flex-row sm:items-center sm:justify-between">

//           <div>

//             <CardTitle className="text-base font-bold text-[#081022]">
//               Recent Applications
//             </CardTitle>

//             <p className="mt-1 text-xs text-slate-500">
//               Latest students who have submitted admission applications
//             </p>

//           </div>

//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() =>
//               navigate(
//                 "/admin/admissions/review"
//               )
//             }
//             className="w-full sm:w-auto"
//           >
//             Review All Applications

//             <ArrowRight className="ml-2 h-4 w-4" />

//           </Button>

//         </CardHeader>

//         <CardContent className="p-0">

//           {recentApplications.length === 0 ? (

//             <div className="flex flex-col items-center justify-center px-6 py-12 text-center">

//               <FileText className="h-9 w-9 text-slate-300" />

//               <p className="mt-3 text-sm font-semibold text-slate-500">
//                 No applications yet
//               </p>

//               <p className="mt-1 text-xs text-slate-400">
//                 Submitted student applications will appear here.
//               </p>

//             </div>

//           ) : (

//             <div className="overflow-x-auto">

//               <table className="w-full min-w-[850px]">

//                 <thead>

//                   <tr className="border-b border-slate-200 bg-slate-50">

//                     <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
//                       Applicant
//                     </th>

//                     <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
//                       Application ID
//                     </th>

//                     <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
//                       Programme
//                     </th>

//                     <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
//                       Status
//                     </th>

//                     <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-500">
//                       Action
//                     </th>

//                   </tr>

//                 </thead>

//                 <tbody className="divide-y divide-slate-100">

//                   {recentApplications.map(
//                     (application, index) => {

//                       const applicantName =
//                         getApplicantName(
//                           application.user
//                         );

//                       const applicantEmail =
//                         getApplicantEmail(
//                           application.user
//                         );

//                       const applicationId =
//                         application.applicationNumber ||
//                         application.applicationId ||
//                         application.id ||
//                         application._id ||
//                         `APP-${index + 1}`;

//                       const programmeName =
//                         getProgrammeName(
//                           application.programme
//                         );

//                       return (

//                         <tr
//                           key={
//                             application._id ||
//                             applicationId
//                           }
//                           className="transition hover:bg-slate-50"
//                         >

//                           {/* Applicant */}

//                           <td className="px-5 py-4">

//                             <div className="flex items-center gap-3">

//                               <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#081022] text-xs font-bold text-white">

//                                 {applicantName
//                                   .charAt(0)
//                                   .toUpperCase()}

//                               </div>

//                               <div>

//                                 <p className="text-sm font-bold text-[#081022]">
//                                   {applicantName}
//                                 </p>

//                                 <p className="text-xs text-slate-400">
//                                   {applicantEmail}
//                                 </p>

//                               </div>

//                             </div>

//                           </td>

//                           {/* Application Number */}

//                           <td className="px-5 py-4">

//                             <span className="font-mono text-xs text-slate-600">
//                               {applicationId}
//                             </span>

//                           </td>

//                           {/* Programme */}

//                           <td className="px-5 py-4">

//                             <div>

//                               <span className="text-sm font-medium text-slate-700">
//                                 {programmeName}
//                               </span>

//                               {typeof application.programme ===
//                                 "object" &&
//                                 application.programme?.code && (
//                                   <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
//                                     {
//                                       application
//                                         .programme
//                                         .code
//                                     }
//                                   </p>
//                                 )}

//                             </div>

//                           </td>

//                           {/* Status */}

//                           <td className="px-5 py-4">

//                             <span
//                               className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-bold ${getStatusStyle(
//                                 application.status
//                               )}`}
//                             >
//                               {application.status ||
//                                 "Pending"}
//                             </span>

//                           </td>

//                           {/* Action */}

//                           <td className="px-5 py-4 text-right">

//                             <Button
//                               variant="outline"
//                               size="sm"
//                               onClick={() =>
//                                 navigate(
//                                   `/admin/admissions/review/${application._id}`
//                                 )
//                               }
//                               className="h-8 text-xs"
//                             >
//                               Review
//                             </Button>

//                           </td>

//                         </tr>

//                       );
//                     }
//                   )}

//                 </tbody>

//               </table>

//             </div>

//           )}

//         </CardContent>

//       </Card>

//       {/* ========================================================
//           NOTICE
//       ======================================================== */}

//       {pendingCount > 0 && (

//         <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">

//           <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

//           <div>

//             <p className="text-sm font-bold text-amber-900">

//               {pendingCount} application
//               {pendingCount === 1
//                 ? ""
//                 : "s"} awaiting review

//             </p>

//             <p className="mt-1 text-xs leading-5 text-amber-700">
//               These applicants have submitted their
//               applications and are waiting for an administrator
//               to review and approve or reject their admission.
//             </p>

//             <button
//               type="button"
//               onClick={() =>
//                 navigate(
//                   "/admin/admissions/review"
//                 )
//               }
//               className="mt-2 text-xs font-bold text-amber-800 underline"
//             >
//               Go to Application Review
//             </button>

//           </div>

//         </div>

//       )}

//     </div>
//   );
// }

import { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  Clock3,
  FileText,
  GraduationCap,
  Info,
  Settings2,
  Users,
  XCircle,
  AlertCircle,
  Power,
  Loader2,
  RefreshCw,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SessionContext } from "@/contexts/SessionContext";
import useFetch from "@/hooks/useFetch";

/* ================================================================
   TYPES — matches applicationController.js exactly:
   getAllApplications always responds { applications: [...] },
   with user/programme/session populated.
================================================================ */

type BackendApplicationStatus =
  | "Pending"
  | "Submitted"
  | "Approved"
  | "Rejected";

interface BackendUser {
  _id: string;
  username?: string;
  studentName?: string;
  email?: string;
  phone?: number | string;
  address?: string;
}

interface BackendProgramme {
  _id: string;
  name?: string;
  programmeName?: string;
  title?: string;
  code?: string;
}

interface BackendApplication {
  _id: string;
  applicationNumber?: string;
  user?: BackendUser | string;
  programme?: BackendProgramme | string;
  status: BackendApplicationStatus;
  applicationFeePaid?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface Application {
  id: string;
  applicationNumber: string;
  name: string;
  email: string;
  programme: string;
  status: BackendApplicationStatus;
  applicationFeePaid: boolean;
  submittedDate?: string;
}

/* ================================================================
   HELPERS
================================================================ */

const getProgrammeName = (programme?: BackendProgramme | string): string => {
  if (!programme) return "Not specified";
  if (typeof programme === "string") return programme;
  return (
    programme.name ||
    programme.programmeName ||
    programme.title ||
    programme.code ||
    "Not specified"
  );
};

const getApplicantName = (user?: BackendUser | string): string => {
  if (!user) return "Unknown Applicant";
  if (typeof user === "string") return "Applicant";
  return user.studentName || user.username || "Unnamed Applicant";
};

const getApplicantEmail = (user?: BackendUser | string): string => {
  if (!user || typeof user === "string") return "No email";
  return user.email || "No email";
};

const getStatusStyle = (status: BackendApplicationStatus) => {
  switch (status) {
    case "Approved":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "Rejected":
      return "bg-red-50 text-red-700 border-red-200";
    case "Submitted":
      return "bg-blue-50 text-blue-700 border-blue-200";
    case "Pending":
    default:
      return "bg-amber-50 text-amber-700 border-amber-200";
  }
};

/* ================================================================
   MAIN COMPONENT
================================================================ */

export default function ApplicationPortal() {
  const navigate = useNavigate();
  const { currentSession } = useContext(SessionContext);

  // NOTE: useFetch is not generic — do not write useFetch<T>(...).
  // rawApplications comes back untyped; we narrow it ourselves below,
  // same as ApplicationReview.tsx does.
  const {
    data: rawApplications,
    loading,
    error,
    reFetch,
  } = useFetch("/applications");

  const [applicationsOpen, setApplicationsOpen] = useState(true);

  /* ==============================================================
     NORMALIZE RESPONSE
     Backend (applicationController.js) always sends:
       { applications: BackendApplication[] }
     We still guard defensively for a bare array, in case that
     ever changes, without ever indexing `unknown` directly.
  ============================================================== */

  const applications = useMemo<Application[]>(() => {
    let list: BackendApplication[] = [];

    if (Array.isArray(rawApplications)) {
      list = rawApplications as BackendApplication[];
    } else if (
      rawApplications &&
      typeof rawApplications === "object" &&
      Array.isArray((rawApplications as { applications?: BackendApplication[] }).applications)
    ) {
      list = (rawApplications as { applications: BackendApplication[] }).applications;
    }

    return list.map((application): Application => ({
      id: application._id,
      applicationNumber: application.applicationNumber || "No Application Number",
      name: getApplicantName(application.user),
      email: getApplicantEmail(application.user),
      programme: getProgrammeName(application.programme),
      status: application.status || "Pending",
      applicationFeePaid: Boolean(application.applicationFeePaid),
      submittedDate: application.createdAt,
    }));
  }, [rawApplications]);

  /* ==============================================================
     COUNTS
  ============================================================== */

  const pendingCount = useMemo(
    () => applications.filter((a) => a.status === "Pending" || a.status === "Submitted").length,
    [applications]
  );

  const acceptedCount = useMemo(
    () => applications.filter((a) => a.status === "Approved").length,
    [applications]
  );

  const rejectedCount = useMemo(
    () => applications.filter((a) => a.status === "Rejected").length,
    [applications]
  );

  const recentApplications = useMemo(() => {
    return [...applications]
      .sort((a, b) => {
        const dateA = new Date(a.submittedDate || 0).getTime();
        const dateB = new Date(b.submittedDate || 0).getTime();
        return dateB - dateA;
      })
      .slice(0, 6);
  }, [applications]);

  /* ==============================================================
     LOADING
  ============================================================== */

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center bg-slate-50 p-6">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="mt-3 text-sm text-slate-500">Loading applications...</p>
        </div>
      </div>
    );
  }

  /* ==============================================================
     RENDER
  ============================================================== */

  return (
    <div className="min-h-full space-y-6 bg-slate-50 p-4 md:p-6">
      {/* HEADER */}
      <div className="rounded-2xl bg-[#081022] p-6 text-white shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-blue-200">
              <GraduationCap className="h-4 w-4" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Admissions</span>
            </div>
            <h1 className="mt-2 text-2xl font-bold md:text-3xl">Application Portal</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
              Manage the institution&apos;s admission intake, monitor submitted applications and control
              when students can apply.
            </p>
          </div>

          <div className="min-w-[250px] rounded-xl border border-white/10 bg-white/10 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div
                  className={`h-2.5 w-2.5 rounded-full ${
                    applicationsOpen ? "bg-emerald-400" : "bg-red-400"
                  }`}
                />
                <span className="text-xs font-semibold text-slate-200">Application Portal</span>
              </div>
              <span className={`text-xs font-bold ${applicationsOpen ? "text-emerald-300" : "text-red-300"}`}>
                {applicationsOpen ? "OPEN" : "CLOSED"}
              </span>
            </div>
            <p className="mt-3 text-sm text-slate-400">
              {currentSession?.name || "Current admission session"}
            </p>
          </div>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
          <div className="flex-1">
            <p className="text-sm font-bold text-red-700">Unable to load applications</p>
            <p className="mt-1 text-xs leading-5 text-red-600">
              The application list could not be loaded from the server.
            </p>
          </div>
          <button
            type="button"
            onClick={() => reFetch()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Retry
          </button>
        </div>
      )}

      {/* PORTAL CONTROL */}
      <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
        <CardContent className="p-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                  applicationsOpen ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                }`}
              >
                <Power className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-[#081022]">Application Intake</p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {applicationsOpen
                    ? "Students can currently submit admission applications."
                    : "The admission application portal is currently closed."}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                variant="outline"
                onClick={() => navigate("/admin/admissions/review")}
                className="border-slate-300"
              >
                <ClipboardCheck className="mr-2 h-4 w-4" />
                Review Applications
              </Button>

              <Button
                onClick={() => setApplicationsOpen((v) => !v)}
                className={applicationsOpen ? "bg-red-600 hover:bg-red-700" : "bg-emerald-600 hover:bg-emerald-700"}
              >
                <Power className="mr-2 h-4 w-4" />
                {applicationsOpen ? "Close Portal" : "Open Portal"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* STATISTICS */}
      <div>
        <div className="mb-3">
          <h2 className="text-lg font-bold text-[#081022]">Application Overview</h2>
          <p className="text-xs text-slate-500">Current admission application activity</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-black text-[#081022]">{applications.length}</p>
                <p className="text-sm font-bold text-slate-800">Total Applications</p>
                <p className="text-[10px] uppercase tracking-wider text-slate-400">All applications</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <Clock3 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-black text-[#081022]">{pendingCount}</p>
                <p className="text-sm font-bold text-slate-800">Pending Review</p>
                <p className="text-[10px] uppercase tracking-wider text-slate-400">Need attention</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-black text-[#081022]">{acceptedCount}</p>
                <p className="text-sm font-bold text-slate-800">Accepted</p>
                <p className="text-[10px] uppercase tracking-wider text-slate-400">Approved applicants</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-700">
                <XCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-black text-[#081022]">{rejectedCount}</p>
                <p className="text-sm font-bold text-slate-800">Rejected</p>
                <p className="text-[10px] uppercase tracking-wider text-slate-400">Unsuccessful</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* SESSION + PORTAL MGMT */}
      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardHeader className="border-b border-slate-200">
            <CardTitle className="flex items-center gap-2 text-base font-bold text-[#081022]">
              <CalendarDays className="h-5 w-5" />
              Admission Session
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Academic Session</p>
                <p className="mt-2 text-lg font-bold text-[#081022]">{currentSession?.name || "Not Set"}</p>
              </div>
              <div className="rounded-xl border border-slate-200 p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Application Status</p>
                <p className={`mt-2 text-lg font-bold ${applicationsOpen ? "text-emerald-600" : "text-red-600"}`}>
                  {applicationsOpen ? "Applications Open" : "Applications Closed"}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Applications Received</p>
                <p className="mt-2 text-lg font-bold text-[#081022]">{applications.length}</p>
              </div>
              <div className="rounded-xl border border-slate-200 p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Awaiting Decision</p>
                <p className="mt-2 text-lg font-bold text-amber-600">{pendingCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardHeader className="border-b border-slate-200">
            <CardTitle className="flex items-center gap-2 text-base font-bold text-[#081022]">
              <Settings2 className="h-5 w-5" />
              Portal Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-4">
            <button
              type="button"
              onClick={() => navigate("/admin/admissions/credentials")}
              className="flex w-full items-center gap-3 rounded-xl border border-slate-200 p-4 text-left transition hover:border-[#081022] hover:bg-slate-50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-[#081022]">Admission Requirements</p>
                <p className="mt-1 text-xs text-slate-500">Configure academic and credential requirements</p>
              </div>
              <ArrowRight className="ml-auto h-4 w-4 text-slate-400" />
            </button>

            <button
              type="button"
              onClick={() => navigate("/admin/admissions/batches")}
              className="flex w-full items-center gap-3 rounded-xl border border-slate-200 p-4 text-left transition hover:border-[#081022] hover:bg-slate-50"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-700">
                <Users className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-[#081022]">Admission Batches</p>
                <p className="mt-1 text-xs text-slate-500">Manage admission groups and intake periods</p>
              </div>
              <ArrowRight className="ml-auto h-4 w-4 text-slate-400" />
            </button>

            <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />
              <p className="text-xs leading-5 text-slate-500">
                Applications submitted by students remain pending until an administrator reviews and makes an
                admission decision.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* RECENT APPLICATIONS */}
      <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
        <CardHeader className="flex flex-col gap-3 border-b border-slate-200 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base font-bold text-[#081022]">Recent Applications</CardTitle>
            <p className="mt-1 text-xs text-slate-500">Latest students who have submitted admission applications</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/admin/admissions/review")}
            className="w-full sm:w-auto"
          >
            Review All Applications
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {recentApplications.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-12 text-center">
              <FileText className="h-9 w-9 text-slate-300" />
              <p className="mt-3 text-sm font-semibold text-slate-500">No applications yet</p>
              <p className="mt-1 text-xs text-slate-400">Submitted student applications will appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Applicant
                    </th>
                    <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Application No.
                    </th>
                    <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Programme
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
                  {recentApplications.map((application) => (
                    <tr key={application.id} className="transition hover:bg-slate-50">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#081022] text-xs font-bold text-white">
                            {application.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-[#081022]">{application.name}</p>
                            <p className="text-xs text-slate-400">{application.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-mono text-xs text-slate-600">{application.applicationNumber}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-sm text-slate-600">{application.programme}</span>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-bold ${getStatusStyle(
                            application.status
                          )}`}
                        >
                          {application.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate("/admin/admissions/review")}
                          className="h-8 text-xs"
                        >
                          Review
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* NOTICE */}
      {pendingCount > 0 && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div>
            <p className="text-sm font-bold text-amber-900">
              {pendingCount} application{pendingCount === 1 ? "" : "s"} awaiting review
            </p>
            <p className="mt-1 text-xs leading-5 text-amber-700">
              These applicants have submitted their applications and are waiting for an administrator to review
              and approve or reject their admission.
            </p>
            <button
              type="button"
              onClick={() => navigate("/admin/admissions/review")}
              className="mt-2 text-xs font-bold text-amber-800 underline"
            >
              Go to Application Review
            </button>
          </div>
        </div>
      )}
    </div>
  );
}