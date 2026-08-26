import { useMemo, useState } from "react";
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
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useContext } from "react";
import { SessionContext } from "@/contexts/SessionContext";
import useFetch from "@/hooks/useFetch";

type Application = {
  _id?: string;
  id?: string;
  applicationId?: string;
  name?: string;
  fullname?: string;
  fullName?: string;
  email?: string;
  programme?: string;
  course?: string;
  status?: string;
  createdAt?: string;
  created?: string;
  submittedAt?: string;
};

const countItems = (value: unknown) =>
  Array.isArray(value) ? value.length : 0;

const normalizeStatus = (status?: string) =>
  (status || "").toLowerCase().replace(/[\s_-]/g, "");

export default function ApplicationPortal() {
  const navigate = useNavigate();

  const { currentSession } = useContext(SessionContext);

  const sessionId = currentSession?._id;

  /*
   * ------------------------------------------------------------------
   * APPLICATION DATA
   * ------------------------------------------------------------------
   *
   * This page reads the applications submitted by students.
   *
   * The actual approval/rejection process will happen on:
   *
   * /admin/admissions/review
   *
   * If your backend endpoint has a different name, change it here.
   */

  const { data: rawApplications } = useFetch(
    sessionId ? `/applications/${sessionId}` : null
  );

  const applications: Application[] = Array.isArray(rawApplications)
    ? rawApplications
    : [];

  /*
   * ------------------------------------------------------------------
   * APPLICATION COUNTS
   * ------------------------------------------------------------------
   */

  const submittedCount = useMemo(
    () =>
      applications.filter((application) => {
        const status = normalizeStatus(application.status);

        return (
          status === "submitted" ||
          status === "underreview" ||
          status === "review"
        );
      }).length,
    [applications]
  );

  const pendingCount = useMemo(
    () =>
      applications.filter((application) => {
        const status = normalizeStatus(application.status);

        return (
          status === "pending" ||
          status === "submitted" ||
          status === "underreview" ||
          status === "under_review"
        );
      }).length,
    [applications]
  );

  const acceptedCount = useMemo(
    () =>
      applications.filter((application) => {
        const status = normalizeStatus(application.status);

        return (
          status === "accepted" ||
          status === "approved" ||
          status === "admitted"
        );
      }).length,
    [applications]
  );

  const rejectedCount = useMemo(
    () =>
      applications.filter((application) => {
        const status = normalizeStatus(application.status);

        return status === "rejected" || status === "declined";
      }).length,
    [applications]
  );

  /*
   * ------------------------------------------------------------------
   * APPLICATION PORTAL STATE
   * ------------------------------------------------------------------
   *
   * This can later be connected to the backend.
   */

  const [applicationsOpen, setApplicationsOpen] = useState(true);

  /*
   * ------------------------------------------------------------------
   * RECENT APPLICATIONS
   * ------------------------------------------------------------------
   */

  const recentApplications = useMemo(() => {
    return [...applications]
      .sort((a, b) => {
        const dateA = new Date(
          a.submittedAt || a.createdAt || a.created || 0
        ).getTime();

        const dateB = new Date(
          b.submittedAt || b.createdAt || b.created || 0
        ).getTime();

        return dateB - dateA;
      })
      .slice(0, 6);
  }, [applications]);

  /*
   * ------------------------------------------------------------------
   * STATUS UI
   * ------------------------------------------------------------------
   */

  const getStatusStyle = (status?: string) => {
    const normalized = normalizeStatus(status);

    if (
      normalized === "accepted" ||
      normalized === "approved" ||
      normalized === "admitted"
    ) {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }

    if (
      normalized === "rejected" ||
      normalized === "declined"
    ) {
      return "bg-red-50 text-red-700 border-red-200";
    }

    if (
      normalized === "underreview" ||
      normalized === "review" ||
      normalized === "submitted" ||
      normalized === "pending"
    ) {
      return "bg-amber-50 text-amber-700 border-amber-200";
    }

    if (normalized === "draft") {
      return "bg-slate-100 text-slate-600 border-slate-200";
    }

    return "bg-slate-100 text-slate-600 border-slate-200";
  };

  /*
   * ------------------------------------------------------------------
   * RETURN
   * ------------------------------------------------------------------
   */

  return (
    <div className="min-h-full space-y-6 bg-slate-50 p-4 md:p-6">

      {/* ============================================================
          PAGE HEADER
      ============================================================ */}

      <div className="rounded-2xl bg-[#081022] p-6 text-white shadow-sm">

        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <div className="flex items-center gap-2 text-blue-200">

              <GraduationCap className="h-4 w-4" />

              <span className="text-[10px] font-bold uppercase tracking-[0.2em]">
                Admissions
              </span>

            </div>

            <h1 className="mt-2 text-2xl font-bold md:text-3xl">
              Application Portal
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
              Manage the institution's admission intake, monitor submitted
              applications and control when students can apply.
            </p>

          </div>

          {/* Portal Status */}

          <div className="min-w-[250px] rounded-xl border border-white/10 bg-white/10 p-4">

            <div className="flex items-center justify-between">

              <div className="flex items-center gap-2">

                <div
                  className={`h-2.5 w-2.5 rounded-full ${
                    applicationsOpen
                      ? "bg-emerald-400"
                      : "bg-red-400"
                  }`}
                />

                <span className="text-xs font-semibold text-slate-200">
                  Application Portal
                </span>

              </div>

              <span
                className={`text-xs font-bold ${
                  applicationsOpen
                    ? "text-emerald-300"
                    : "text-red-300"
                }`}
              >
                {applicationsOpen ? "OPEN" : "CLOSED"}
              </span>

            </div>

            <p className="mt-3 text-sm text-slate-400">
              {currentSession?.name || "Current admission session"}
            </p>

          </div>

        </div>

      </div>

      {/* ============================================================
          PORTAL CONTROL
      ============================================================ */}

      <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

        <CardContent className="p-5">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex items-start gap-4">

              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                  applicationsOpen
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-700"
                }`}
              >
                <Power className="h-5 w-5" />
              </div>

              <div>

                <p className="text-sm font-bold text-[#081022]">
                  Application Intake
                </p>

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
                onClick={() => setApplicationsOpen((value) => !value)}
                className={
                  applicationsOpen
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-emerald-600 hover:bg-emerald-700"
                }
              >
                <Power className="mr-2 h-4 w-4" />
                {applicationsOpen ? "Close Portal" : "Open Portal"}
              </Button>

            </div>

          </div>

        </CardContent>

      </Card>

      {/* ============================================================
          APPLICATION STATISTICS
      ============================================================ */}

      <div>

        <div className="mb-3">

          <h2 className="text-lg font-bold text-[#081022]">
            Application Overview
          </h2>

          <p className="text-xs text-slate-500">
            Current admission application activity
          </p>

        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          {/* Total */}

          <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

            <CardContent className="flex items-center gap-4 p-5">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <FileText className="h-5 w-5" />
              </div>

              <div>
                <p className="text-2xl font-black text-[#081022]">
                  {countItems(applications)}
                </p>

                <p className="text-sm font-bold text-slate-800">
                  Total Applications
                </p>

                <p className="text-[10px] uppercase tracking-wider text-slate-400">
                  All applications
                </p>
              </div>

            </CardContent>

          </Card>

          {/* Pending */}

          <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

            <CardContent className="flex items-center gap-4 p-5">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <Clock3 className="h-5 w-5" />
              </div>

              <div>
                <p className="text-2xl font-black text-[#081022]">
                  {pendingCount}
                </p>

                <p className="text-sm font-bold text-slate-800">
                  Pending Review
                </p>

                <p className="text-[10px] uppercase tracking-wider text-slate-400">
                  Need attention
                </p>
              </div>

            </CardContent>

          </Card>

          {/* Accepted */}

          <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

            <CardContent className="flex items-center gap-4 p-5">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <CheckCircle2 className="h-5 w-5" />
              </div>

              <div>
                <p className="text-2xl font-black text-[#081022]">
                  {acceptedCount}
                </p>

                <p className="text-sm font-bold text-slate-800">
                  Accepted
                </p>

                <p className="text-[10px] uppercase tracking-wider text-slate-400">
                  Approved applicants
                </p>
              </div>

            </CardContent>

          </Card>

          {/* Rejected */}

          <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

            <CardContent className="flex items-center gap-4 p-5">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-700">
                <XCircle className="h-5 w-5" />
              </div>

              <div>
                <p className="text-2xl font-black text-[#081022]">
                  {rejectedCount}
                </p>

                <p className="text-sm font-bold text-slate-800">
                  Rejected
                </p>

                <p className="text-[10px] uppercase tracking-wider text-slate-400">
                  Unsuccessful
                </p>
              </div>

            </CardContent>

          </Card>

        </div>

      </div>

      {/* ============================================================
          ADMISSION SESSION
      ============================================================ */}

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">

        {/* Session information */}

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

                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Academic Session
                </p>

                <p className="mt-2 text-lg font-bold text-[#081022]">
                  {currentSession?.name || "Not Set"}
                </p>

              </div>

              <div className="rounded-xl border border-slate-200 p-4">

                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Application Status
                </p>

                <p
                  className={`mt-2 text-lg font-bold ${
                    applicationsOpen
                      ? "text-emerald-600"
                      : "text-red-600"
                  }`}
                >
                  {applicationsOpen ? "Applications Open" : "Applications Closed"}
                </p>

              </div>

              <div className="rounded-xl border border-slate-200 p-4">

                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Applications Received
                </p>

                <p className="mt-2 text-lg font-bold text-[#081022]">
                  {submittedCount}
                </p>

              </div>

              <div className="rounded-xl border border-slate-200 p-4">

                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Awaiting Decision
                </p>

                <p className="mt-2 text-lg font-bold text-amber-600">
                  {pendingCount}
                </p>

              </div>

            </div>

          </CardContent>

        </Card>

        {/* Portal settings */}

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
              onClick={() =>
                navigate("/admin/admissions/credentials")
              }
              className="flex w-full items-center gap-3 rounded-xl border border-slate-200 p-4 text-left transition hover:border-[#081022] hover:bg-slate-50"
            >

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                <GraduationCap className="h-5 w-5" />
              </div>

              <div className="min-w-0">

                <p className="text-sm font-bold text-[#081022]">
                  Admission Requirements
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Configure academic and credential requirements
                </p>

              </div>

              <ArrowRight className="ml-auto h-4 w-4 text-slate-400" />

            </button>

            <button
              type="button"
              onClick={() =>
                navigate("/admin/admissions/batches")
              }
              className="flex w-full items-center gap-3 rounded-xl border border-slate-200 p-4 text-left transition hover:border-[#081022] hover:bg-slate-50"
            >

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-700">
                <Users className="h-5 w-5" />
              </div>

              <div className="min-w-0">

                <p className="text-sm font-bold text-[#081022]">
                  Admission Batches
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  Manage admission groups and intake periods
                </p>

              </div>

              <ArrowRight className="ml-auto h-4 w-4 text-slate-400" />

            </button>

            <div className="flex items-start gap-3 rounded-xl bg-slate-50 p-4">

              <Info className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" />

              <p className="text-xs leading-5 text-slate-500">
                Applications submitted by students remain pending until an
                administrator reviews and makes an admission decision.
              </p>

            </div>

          </CardContent>

        </Card>

      </div>

      {/* ============================================================
          RECENT APPLICATIONS
      ============================================================ */}

      <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

        <CardHeader className="flex flex-col gap-3 border-b border-slate-200 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <CardTitle className="text-base font-bold text-[#081022]">
              Recent Applications
            </CardTitle>

            <p className="mt-1 text-xs text-slate-500">
              Latest students who have submitted admission applications
            </p>

          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              navigate("/admin/admissions/review")
            }
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

              <p className="mt-3 text-sm font-semibold text-slate-500">
                No applications yet
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Submitted student applications will appear here.
              </p>

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
                      Application ID
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

                  {recentApplications.map((application, index) => {

                    const applicantName =
                      application.fullName ||
                      application.fullname ||
                      application.name ||
                      "Unknown Applicant";

                    const applicationId =
                      application.applicationId ||
                      application.id ||
                      application._id ||
                      `APP-${index + 1}`;

                    const programme =
                      application.programme ||
                      application.course ||
                      "Not specified";

                    return (

                      <tr
                        key={
                          application._id ||
                          application.id ||
                          applicationId
                        }
                        className="transition hover:bg-slate-50"
                      >

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-3">

                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#081022] text-xs font-bold text-white">
                              {applicantName
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div>

                              <p className="text-sm font-bold text-[#081022]">
                                {applicantName}
                              </p>

                              <p className="text-xs text-slate-400">
                                {application.email || "No email"}
                              </p>

                            </div>

                          </div>

                        </td>

                        <td className="px-5 py-4">

                          <span className="font-mono text-xs text-slate-600">
                            {applicationId}
                          </span>

                        </td>

                        <td className="px-5 py-4">

                          <span className="text-sm text-slate-600">
                            {programme}
                          </span>

                        </td>

                        <td className="px-5 py-4">

                          <span
                            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-bold ${getStatusStyle(
                              application.status
                            )}`}
                          >
                            {application.status || "Pending"}
                          </span>

                        </td>

                        <td className="px-5 py-4 text-right">

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              navigate(
                                `/admin/admissions/review/${applicationId}`
                              )
                            }
                            className="h-8 text-xs"
                          >
                            Review
                          </Button>

                        </td>

                      </tr>

                    );
                  })}

                </tbody>

              </table>

            </div>

          )}

        </CardContent>

      </Card>

      {/* ============================================================
          IMPORTANT NOTICE
      ============================================================ */}

      {pendingCount > 0 && (

        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">

          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

          <div>

            <p className="text-sm font-bold text-amber-900">
              {pendingCount} application
              {pendingCount === 1 ? "" : "s"} awaiting review
            </p>

            <p className="mt-1 text-xs leading-5 text-amber-700">
              These applicants have submitted their applications and are
              waiting for an administrator to review and approve or reject
              their admission.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate("/admin/admissions/review")
              }
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