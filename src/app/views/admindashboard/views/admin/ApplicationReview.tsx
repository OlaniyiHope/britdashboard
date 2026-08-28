import { useContext, useMemo, useState } from "react";
import {
  Search,
  Filter,
  Eye,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Clock3,
  FileText,
  User,
  GraduationCap,
  CalendarDays,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  X,
  AlertCircle,
  CreditCard,
  CircleDollarSign,
  Loader2,
  RefreshCw,
} from "lucide-react";

import { SessionContext } from "@/contexts/SessionContext";
import useFetch from "@/hooks/useFetch";

/* ================================================================
   TYPES
================================================================ */

type BackendApplicationStatus =
  | "Pending"
  | "Submitted"
  | "Approved"
  | "Rejected";

type DisplayStatus =
  | "Pending Review"
  | "Submitted"
  | "Approved"
  | "Rejected";

type ActionType =
  | "approve"
  | "return"
  | "reject";

interface BackendUser {
  _id: string;
  username?: string;
  studentName?: string;
  email?: string;
  phone?: number | string;
  address?: string;
  gender?: string;
  birthday?: string;
  programme?: string;
}

interface BackendProgramme {
  _id: string;
  name?: string;
  programmeName?: string;
  title?: string;
  code?: string;
}

interface BackendSession {
  _id: string;
  name?: string;
  sessionName?: string;
}

interface BackendApplication {
  _id: string;

  applicationNumber?: string;

  user?: BackendUser | string;

  programme?: BackendProgramme | string;

  session?:
    | BackendSession
    | string;

  status: BackendApplicationStatus;

  applicationFee?: number;

  applicationFeePaid?: boolean;

  applicationFeePaidAt?: string;

  acceptanceFee?: number;

  acceptanceFeePaid?: boolean;

  acceptanceFeePaidAt?: string;

  createdAt?: string;

  updatedAt?: string;

  reviewNotes?: string;
}

/*
 * getAllApplications may return either:
 *
 * [
 *   {...},
 *   {...}
 * ]
 *
 * OR
 *
 * {
 *   applications: [...]
 * }
 *
 * OR
 *
 * {
 *   data: [...]
 * }
 */
type ApplicationsResponse =
  | BackendApplication[]
  | {
      applications?: BackendApplication[];
      data?: BackendApplication[];
    };

interface Application {
  id: string;

  applicationNumber: string;

  name: string;

  email: string;

  phone: string;

  programme: string;

  programmeId?: string;

  sessionId?: string;

  submittedDate: string;

  status: DisplayStatus;

  applicationFee: number;

  applicationFeePaid: boolean;

  applicationFeePaidAt?: string;

  acceptanceFee: number;

  acceptanceFeePaid: boolean;

  state: string;

  reviewNotes?: string;
}

/* ================================================================
   STATUS STYLES
================================================================ */

const statusStyles: Record<
  DisplayStatus,
  string
> = {
  "Pending Review":
    "bg-amber-50 text-amber-700 border-amber-200",

  Submitted:
    "bg-blue-50 text-blue-700 border-blue-200",

  Approved:
    "bg-emerald-50 text-emerald-700 border-emerald-200",

  Rejected:
    "bg-red-50 text-red-700 border-red-200",
};

/* ================================================================
   HELPERS
================================================================ */

const getDisplayStatus = (
  status?: BackendApplicationStatus
): DisplayStatus => {
  switch (status) {
    case "Pending":
      return "Pending Review";

    case "Submitted":
      return "Submitted";

    case "Approved":
      return "Approved";

    case "Rejected":
      return "Rejected";

    default:
      return "Pending Review";
  }
};

/* ---------------------------------------------------------------
   Get ObjectId from string/object
---------------------------------------------------------------- */

const getReferenceId = (
  value:
    | string
    | {
        _id?: string;
      }
    | undefined
): string | undefined => {
  if (!value) return undefined;

  if (typeof value === "string") {
    return value;
  }

  return value._id;
};

/* ---------------------------------------------------------------
   Programme name
---------------------------------------------------------------- */

// const getProgrammeName = (
//   programme:
//     | BackendProgramme
//     | string
//     | undefined
// ): string => {
//   if (!programme) {
//     return "Not specified";
//   }

//   if (typeof programme === "string") {
//     /*
//      * If the backend has not populated programme,
//      * this will be the ObjectId.
//      *
//      * We don't display the raw ObjectId.
//      */
//     return "Programme not populated";
//   }

//   return (
//     programme.name ||
//     programme.programmeName ||
//     programme.title ||
//     programme.code ||
//     "Not specified"
//   );
// };
const getProgrammeName = (
  programme?: BackendProgramme | string
): string => {
  if (!programme) {
    return "Not specified";
  }

  if (typeof programme === "string") {
    return programme;
  }

  return (
    programme.name ||
    programme.programmeName ||
    programme.title ||
    programme.code ||
    "Not specified"
  );
};
/* ---------------------------------------------------------------
   Date
---------------------------------------------------------------- */

const formatDate = (
  date?: string
): string => {
  if (!date) {
    return "Not available";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Not available";
  }

  return parsedDate.toLocaleDateString(
    "en-NG",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
};

/* ---------------------------------------------------------------
   Currency
---------------------------------------------------------------- */

const formatCurrency = (
  amount?: number
): string => {
  return new Intl.NumberFormat(
    "en-NG",
    {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }
  ).format(amount || 0);
};

/* ================================================================
   MAIN COMPONENT
================================================================ */

export default function ApplicationReview() {
  const {
    currentSession,
  } = useContext(SessionContext);

  /*
   * IMPORTANT:
   *
   * We DO NOT use:
   *
   * /applications/${sessionId}
   *
   * because your backend defines:
   *
   * GET /applications
   *
   * for getAllApplications.
   */

  const {
    data: rawApplications,
    loading,
    error,
    reFetch,
  } = useFetch(
    "/applications"
  );

  /* ==============================================================
     STATE
  ============================================================== */

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState<
    "All" | DisplayStatus
  >("All");

  const [
    paymentFilter,
    setPaymentFilter,
  ] = useState<
    "All" | "Paid" | "Unpaid"
  >("All");

  const [
    selectedApplication,
    setSelectedApplication,
  ] = useState<Application | null>(
    null
  );

  const [
    actionModal,
    setActionModal,
  ] = useState<ActionType | null>(
    null
  );

  const [
    actionLoading,
    setActionLoading,
  ] = useState(false);

  const [
    actionError,
    setActionError,
  ] = useState("");

  /* ==============================================================
     NORMALIZE RESPONSE
  ============================================================== */

  const applications = useMemo<
    Application[]
  >(() => {
    let applicationList: BackendApplication[] =
      [];

    /*
     * Direct array
     */
    if (
      Array.isArray(
        rawApplications
      )
    ) {
      applicationList =
        rawApplications;
    }

    /*
     * { applications: [] }
     */
    else if (
      rawApplications &&
      typeof rawApplications ===
        "object" &&
      Array.isArray(
        (
          rawApplications as {
            applications?: BackendApplication[];
          }
        ).applications
      )
    ) {
      applicationList =
        (
          rawApplications as {
            applications: BackendApplication[];
          }
        ).applications;
    }

    /*
     * { data: [] }
     */
    else if (
      rawApplications &&
      typeof rawApplications ===
        "object" &&
      Array.isArray(
        (
          rawApplications as {
            data?: BackendApplication[];
          }
        ).data
      )
    ) {
      applicationList =
        (
          rawApplications as {
            data: BackendApplication[];
          }
        ).data;
    }

    return applicationList.map(
      (
        application
      ): Application => {
        const applicant =
          typeof application.user ===
            "object" &&
          application.user !== null
            ? application.user
            : null;

        const programmeId =
          getReferenceId(
            application.programme
          );

        const sessionId =
          getReferenceId(
            application.session
          );

        return {
          id:
            application._id,

          applicationNumber:
            application.applicationNumber ||
            "No Application Number",

          name:
            applicant?.studentName ||
            applicant?.username ||
            "Unnamed Applicant",

          email:
            applicant?.email ||
            "No email provided",

          phone:
            applicant?.phone !==
              undefined &&
            applicant?.phone !==
              null
              ? String(
                  applicant.phone
                )
              : "No phone provided",

          programme:
            getProgrammeName(
              application.programme
            ),

          programmeId,

          sessionId,

          submittedDate:
            formatDate(
              application.createdAt
            ),

          status:
            getDisplayStatus(
              application.status
            ),

          applicationFee:
            application.applicationFee ||
            0,

          applicationFeePaid:
            Boolean(
              application.applicationFeePaid
            ),

          applicationFeePaidAt:
            application.applicationFeePaidAt,

          acceptanceFee:
            application.acceptanceFee ||
            0,

          acceptanceFeePaid:
            Boolean(
              application.acceptanceFeePaid
            ),

          state:
            applicant?.address ||
            "Not provided",

          reviewNotes:
            application.reviewNotes,
        };
      }
    );
  }, [rawApplications]);

  /* ==============================================================
     CURRENT SESSION APPLICATIONS
  ============================================================== */

  const sessionApplications =
    useMemo(() => {
      const sessionId =
        currentSession?._id;

      /*
       * If no current session is selected,
       * show everything returned by API.
       */
      if (!sessionId) {
        return applications;
      }

      /*
       * If applications contain session IDs,
       * filter them by the current session.
       *
       * If an application does not contain
       * a session ID, we keep it rather than
       * incorrectly hiding it.
       */
      return applications.filter(
        (application) => {
          if (
            !application.sessionId
          ) {
            return true;
          }

          return (
            application.sessionId ===
            sessionId
          );
        }
      );
    }, [
      applications,
      currentSession?._id,
    ]);

  /* ==============================================================
     FILTER APPLICATIONS
  ============================================================== */

  const filteredApplications =
    useMemo(() => {
      const searchValue =
        search
          .trim()
          .toLowerCase();

      return sessionApplications.filter(
        (application) => {
          const matchesSearch =
            !searchValue ||
            application.name
              .toLowerCase()
              .includes(
                searchValue
              ) ||
            application.applicationNumber
              .toLowerCase()
              .includes(
                searchValue
              ) ||
            application.programme
              .toLowerCase()
              .includes(
                searchValue
              ) ||
            application.email
              .toLowerCase()
              .includes(
                searchValue
              );

          const matchesStatus =
            statusFilter === "All" ||
            application.status ===
              statusFilter;

          const matchesPayment =
            paymentFilter ===
              "All" ||
            (paymentFilter ===
              "Paid" &&
              application.applicationFeePaid) ||
            (paymentFilter ===
              "Unpaid" &&
              !application.applicationFeePaid);

          return (
            matchesSearch &&
            matchesStatus &&
            matchesPayment
          );
        }
      );
    }, [
      sessionApplications,
      search,
      statusFilter,
      paymentFilter,
    ]);

  /* ==============================================================
     STATISTICS
  ============================================================== */

  const pendingCount =
    sessionApplications.filter(
      (application) =>
        application.status ===
        "Pending Review"
    ).length;

  const approvedCount =
    sessionApplications.filter(
      (application) =>
        application.status ===
        "Approved"
    ).length;

  const paidCount =
    sessionApplications.filter(
      (application) =>
        application.applicationFeePaid
    ).length;

  const unpaidCount =
    sessionApplications.filter(
      (application) =>
        !application.applicationFeePaid
    ).length;

  /* ==============================================================
     ACTION
  ============================================================== */
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5001";

const handleApplicationAction = async () => {
  if (!selectedApplication || !actionModal) {
    return;
  }

  setActionLoading(true);
  setActionError("");

  try {
    let status: BackendApplicationStatus;
    let reviewNotes = "";

    /*
     * ============================================================
     * DETERMINE APPLICATION ACTION
     * ============================================================
     */

    if (actionModal === "approve") {
      status = "Approved";

      reviewNotes =
        "Application approved by administrator.";
    } else if (actionModal === "reject") {
      status = "Rejected";

      reviewNotes =
        "Application rejected by administrator.";
    } else {
      /*
       * Your backend currently supports:
       *
       * Pending
       * Submitted
       * Approved
       * Rejected
       *
       * There is no "Needs Correction" status in the
       * backend status enum.
       *
       * Therefore Return changes the application back
       * to Pending and adds a review note.
       */

      status = "Pending";

      reviewNotes =
        "Application returned to applicant for correction.";
    }

    /*
     * ============================================================
     * AUTHENTICATION TOKEN
     * ============================================================
     */

    const token = localStorage.getItem("jwtToken");

    if (!token) {
      throw new Error(
        "Authentication token not found. Please login again."
      );
    }

    /*
     * ============================================================
     * API URL
     * ============================================================
     *
     * API_BASE_URL is:
     *
     * http://localhost:5001/api
     *
     * Therefore this becomes:
     *
     * http://localhost:5001/api/applications/:id/review
     */

    const response = await fetch(
      `${API_BASE_URL}/api/applications/${selectedApplication.id}/review`,
      {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          status,
          reviewNotes,
        }),
      }
    );

    /*
     * ============================================================
     * READ SERVER RESPONSE
     * ============================================================
     */

    const responseData =
      await response.json().catch(() => null);

    /*
     * ============================================================
     * HANDLE SERVER ERROR
     * ============================================================
     */

    if (!response.ok) {
      throw new Error(
        responseData?.message ||
          responseData?.error ||
          `Unable to update application. Server returned ${response.status}.`
      );
    }

    /*
     * ============================================================
     * SUCCESS
     * ============================================================
     */

    console.log(
      "Application updated successfully:",
      responseData
    );

    /*
     * Close confirmation modal
     */

    setActionModal(null);

    /*
     * Close application drawer
     */

    setSelectedApplication(null);

    /*
     * Reload applications
     */

    await reFetch();

  } catch (err) {
    console.error(
      "Application action failed:",
      err
    );

    setActionError(
      err instanceof Error
        ? err.message
        : "Unable to update application."
    );
  } finally {
    setActionLoading(false);
  }
};

  /* ==============================================================
     LOADING
  ============================================================== */

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center bg-slate-50 p-6">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />

          <p className="mt-3 text-sm text-slate-500">
            Loading applications...
          </p>
        </div>
      </div>
    );
  }

  /* ==============================================================
     PAGE
  ============================================================== */

  return (
    <div className="min-h-full space-y-6 bg-slate-50 p-4 md:p-6">

      {/* ========================================================
          HEADER
      ======================================================== */}

      <div>
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
              Admissions
            </p>

            <h1 className="mt-1 text-2xl font-bold text-[#081022]">
              Application Review
            </h1>

            <p className="mt-1 max-w-2xl text-sm text-slate-500">
              View everyone who has registered
              for admission, including applicants
              who have and have not paid the
              application fee.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500 shadow-sm">

            <Clock3 className="h-4 w-4" />

            {currentSession?.name ||
              "Current academic session"}

          </div>
        </div>
      </div>

      {/* ========================================================
          ERROR
      ======================================================== */}

      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">

          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

          <div className="flex-1">

            <p className="text-sm font-bold text-red-700">
              Unable to load applications
            </p>

            <p className="mt-1 text-xs leading-5 text-red-600">
              The application list could not
              be loaded from the server.
            </p>

          </div>

          <button
            type="button"
            onClick={() =>
              reFetch()
            }
            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Retry
          </button>

        </div>
      )}

      {/* ========================================================
          STATISTICS
      ======================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <ReviewStat
          title="Pending Review"
          value={pendingCount}
          subtitle="Applications awaiting review"
          icon={Clock3}
          iconClass="bg-amber-50 text-amber-700"
        />

        <ReviewStat
          title="Approved"
          value={approvedCount}
          subtitle="Applicants accepted"
          icon={CheckCircle2}
          iconClass="bg-emerald-50 text-emerald-700"
        />

        <ReviewStat
          title="Application Fee Paid"
          value={paidCount}
          subtitle="Applicants who have paid"
          icon={CreditCard}
          iconClass="bg-blue-50 text-blue-700"
        />

        <ReviewStat
          title="Application Fee Unpaid"
          value={unpaidCount}
          subtitle="Registered but not yet paid"
          icon={CircleDollarSign}
          iconClass="bg-red-50 text-red-700"
        />

      </div>

      {/* ========================================================
          MAIN TABLE
      ======================================================== */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {/* TOOLBAR */}

        <div className="border-b border-slate-200 p-4">

          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">

            {/* SEARCH */}

            <div className="relative flex-1 xl:max-w-md">

              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Search applicant, application number or programme..."
                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
              />

            </div>

            {/* FILTERS */}

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">

              <div className="flex items-center gap-2">

                <Filter className="h-4 w-4 text-slate-400" />

                <select
                  value={
                    statusFilter
                  }
                  onChange={(e) =>
                    setStatusFilter(
                      e.target
                        .value as
                        | "All"
                        | DisplayStatus
                    )
                  }
                  className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none"
                >

                  <option value="All">
                    All Statuses
                  </option>

                  <option value="Pending Review">
                    Pending Review
                  </option>

                  <option value="Submitted">
                    Submitted
                  </option>

                  <option value="Approved">
                    Approved
                  </option>

                  <option value="Rejected">
                    Rejected
                  </option>

                </select>

              </div>

              <select
                value={
                  paymentFilter
                }
                onChange={(e) =>
                  setPaymentFilter(
                    e.target
                      .value as
                      | "All"
                      | "Paid"
                      | "Unpaid"
                  )
                }
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none"
              >

                <option value="All">
                  All Payment Status
                </option>

                <option value="Paid">
                  Application Fee Paid
                </option>

                <option value="Unpaid">
                  Application Fee Unpaid
                </option>

              </select>

            </div>

          </div>

        </div>

        {/* TABLE */}

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1100px]">

            <thead>

              <tr className="border-b border-slate-200 bg-slate-50">

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Applicant
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Programme
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Registered
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Application Fee
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Application Status
                </th>

                <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Action
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-slate-100">

              {filteredApplications.map(
                (application) => (

                  <tr
                    key={
                      application.id
                    }
                    className="transition hover:bg-slate-50"
                  >

                    {/* APPLICANT */}

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#081022] text-sm font-bold text-white">

                          {application.name
                            .split(" ")
                            .map(
                              (name) =>
                                name[0]
                            )
                            .join("")
                            .slice(
                              0,
                              2
                            )
                            .toUpperCase()}

                        </div>

                        <div>

                          <p className="text-sm font-bold text-[#081022]">
                            {
                              application.name
                            }
                          </p>

                          <p className="mt-0.5 text-xs text-slate-400">
                            {
                              application.applicationNumber
                            }
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* PROGRAMME */}

                    <td className="px-5 py-4">

                      <p className="text-sm font-medium text-slate-700">
                        {
                          application.programme
                        }
                      </p>

                    </td>

                    {/* REGISTERED */}

                    <td className="px-5 py-4">

                      <p className="text-xs text-slate-500">
                        {
                          application.submittedDate
                        }
                      </p>

                    </td>

                    {/* PAYMENT */}

                    <td className="px-5 py-4">

                      <div>

                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-bold ${
                            application.applicationFeePaid
                              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                              : "border-red-200 bg-red-50 text-red-700"
                          }`}
                        >

                          {application.applicationFeePaid
                            ? "Paid"
                            : "Unpaid"}

                        </span>

                        <p className="mt-1 text-[10px] text-slate-400">
                          {formatCurrency(
                            application.applicationFee
                          )}
                        </p>

                      </div>

                    </td>

                    {/* STATUS */}

                    <td className="px-5 py-4">

                      <span
                        className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-bold ${
                          statusStyles[
                            application.status
                          ]
                        }`}
                      >
                        {
                          application.status
                        }
                      </span>

                    </td>

                    {/* ACTION */}

                    <td className="px-5 py-4 text-right">

                      <button
                        type="button"
                        onClick={() =>
                          setSelectedApplication(
                            application
                          )
                        }
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-[#081022] transition hover:border-[#081022] hover:bg-slate-50"
                      >

                        <Eye className="h-3.5 w-3.5" />

                        Review

                        <ChevronRight className="h-3.5 w-3.5" />

                      </button>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

          {/* EMPTY */}

          {filteredApplications.length ===
            0 && (

            <div className="py-16 text-center">

              <FileText className="mx-auto h-9 w-9 text-slate-300" />

              <p className="mt-3 text-sm font-semibold text-slate-500">
                No applications found
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Registered applicants will automatically appear here.
              </p>

            </div>

          )}

        </div>

      </div>

      {/* ========================================================
          REVIEW DRAWER
      ======================================================== */}

      {selectedApplication && (

        <div className="fixed inset-0 z-50">

          {/* BACKDROP */}

          <div
            className="absolute inset-0 bg-slate-950/40"
            onClick={() => {
              if (!actionLoading) {
                setSelectedApplication(
                  null
                );
              }
            }}
          />

          {/* DRAWER */}

          <div className="absolute right-0 top-0 flex h-full w-full max-w-2xl flex-col bg-white shadow-2xl">

            {/* HEADER */}

            <div className="flex items-start justify-between border-b border-slate-200 p-5">

              <div>

                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
                  Application Review
                </p>

                <h2 className="mt-1 text-xl font-bold text-[#081022]">
                  {
                    selectedApplication.name
                  }
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  {
                    selectedApplication.applicationNumber
                  }
                </p>

              </div>

              <button
                type="button"
                disabled={
                  actionLoading
                }
                onClick={() =>
                  setSelectedApplication(
                    null
                  )
                }
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
              >

                <X className="h-5 w-5" />

              </button>

            </div>

            {/* CONTENT */}

            <div className="flex-1 overflow-y-auto p-5">

              {/* APPLICATION STATUS */}

              <div className="mb-5 flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-center gap-3">

                  <Clock3 className="h-5 w-5 text-slate-500" />

                  <div>

                    <p className="text-xs font-semibold text-slate-500">
                      Current Application Status
                    </p>

                    <p className="mt-1 text-sm font-bold text-[#081022]">
                      {
                        selectedApplication.status
                      }
                    </p>

                  </div>

                </div>

                <span
                  className={`w-fit rounded-full border px-3 py-1 text-[11px] font-bold ${
                    statusStyles[
                      selectedApplication.status
                    ]
                  }`}
                >
                  {
                    selectedApplication.status
                  }
                </span>

              </div>

              {/* APPLICATION PAYMENT */}

              <div
                className={`mb-5 rounded-xl border p-4 ${
                  selectedApplication.applicationFeePaid
                    ? "border-emerald-200 bg-emerald-50"
                    : "border-red-200 bg-red-50"
                }`}
              >

                <div className="flex items-center justify-between gap-4">

                  <div className="flex items-center gap-3">

                    <CreditCard
                      className={`h-5 w-5 ${
                        selectedApplication.applicationFeePaid
                          ? "text-emerald-600"
                          : "text-red-600"
                      }`}
                    />

                    <div>

                      <p className="text-xs font-semibold text-slate-500">
                        Application Fee
                      </p>

                      <p className="mt-1 text-sm font-bold text-[#081022]">
                        {formatCurrency(
                          selectedApplication.applicationFee
                        )}
                      </p>

                    </div>

                  </div>

                  <div className="text-right">

                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                        selectedApplication.applicationFeePaid
                          ? "bg-emerald-600 text-white"
                          : "bg-red-600 text-white"
                      }`}
                    >

                      {selectedApplication.applicationFeePaid
                        ? "PAID"
                        : "UNPAID"}

                    </span>

                    {selectedApplication.applicationFeePaidAt && (

                      <p className="mt-1 text-[10px] text-slate-500">

                        Paid{" "}
                        {formatDate(
                          selectedApplication.applicationFeePaidAt
                        )}

                      </p>

                    )}

                  </div>

                </div>

              </div>

              {/* APPLICANT INFORMATION */}

              <ReviewSection title="Applicant Information">

                <InfoItem
                  icon={User}
                  label="Full Name"
                  value={
                    selectedApplication.name
                  }
                />

                <InfoItem
                  icon={Mail}
                  label="Email Address"
                  value={
                    selectedApplication.email
                  }
                />

                <InfoItem
                  icon={Phone}
                  label="Phone Number"
                  value={
                    selectedApplication.phone
                  }
                />

                <InfoItem
                  icon={MapPin}
                  label="Address"
                  value={
                    selectedApplication.state
                  }
                />

              </ReviewSection>

              {/* APPLICATION INFORMATION */}

              <ReviewSection title="Application Information">

                <InfoItem
                  icon={GraduationCap}
                  label="Programme Applied For"
                  value={
                    selectedApplication.programme
                  }
                />

                <InfoItem
                  icon={FileText}
                  label="Application Number"
                  value={
                    selectedApplication.applicationNumber
                  }
                />

                <InfoItem
                  icon={CalendarDays}
                  label="Registration Date"
                  value={
                    selectedApplication.submittedDate
                  }
                />

                <InfoItem
                  icon={CircleDollarSign}
                  label="Application Fee"
                  value={formatCurrency(
                    selectedApplication.applicationFee
                  )}
                />

              </ReviewSection>

              {/* ACCEPTANCE FEE */}

              <ReviewSection title="Acceptance Fee">

                <InfoItem
                  icon={CircleDollarSign}
                  label="Acceptance Fee"
                  value={formatCurrency(
                    selectedApplication.acceptanceFee
                  )}
                />

                <InfoItem
                  icon={CreditCard}
                  label="Payment Status"
                  value={
                    selectedApplication.acceptanceFeePaid
                      ? "Paid"
                      : "Unpaid"
                  }
                />

              </ReviewSection>

              {/* REVIEW NOTES */}

              {selectedApplication.reviewNotes && (

                <ReviewSection title="Review Notes">

                  <div className="rounded-xl border border-slate-200 p-4 sm:col-span-2">

                    <p className="text-sm leading-6 text-slate-600">
                      {
                        selectedApplication.reviewNotes
                      }
                    </p>

                  </div>

                </ReviewSection>

              )}

              {/* UNPAID NOTICE */}

              {!selectedApplication.applicationFeePaid && (

                <div className="mt-5 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">

                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

                  <div>

                    <p className="text-sm font-bold text-amber-900">
                      Application fee not yet paid
                    </p>

                    <p className="mt-1 text-xs leading-5 text-amber-700">
                      This applicant has successfully registered
                      and received an application number, but has
                      not completed payment for the application form.
                    </p>

                  </div>

                </div>

              )}

            </div>

            {/* ACTION FOOTER */}

            {selectedApplication.status ===
              "Pending Review" && (

              <div className="border-t border-slate-200 bg-white p-4">

                <div className="grid gap-2 sm:grid-cols-3">

                  {/* APPROVE */}

                  <button
                    type="button"
                    onClick={() =>
                      setActionModal(
                        "approve"
                      )
                    }
                    className="flex h-10 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-xs font-bold text-white transition hover:bg-emerald-700"
                  >

                    <CheckCircle2 className="h-4 w-4" />

                    Approve

                  </button>

                  {/* RETURN */}

                  <button
                    type="button"
                    onClick={() =>
                      setActionModal(
                        "return"
                      )
                    }
                    className="flex h-10 items-center justify-center gap-2 rounded-lg border border-orange-200 bg-orange-50 px-4 text-xs font-bold text-orange-700 transition hover:bg-orange-100"
                  >

                    <RotateCcw className="h-4 w-4" />

                    Return

                  </button>

                  {/* REJECT */}

                  <button
                    type="button"
                    onClick={() =>
                      setActionModal(
                        "reject"
                      )
                    }
                    className="flex h-10 items-center justify-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 text-xs font-bold text-red-700 transition hover:bg-red-100"
                  >

                    <XCircle className="h-4 w-4" />

                    Reject

                  </button>

                </div>

              </div>

            )}

          </div>

        </div>

      )}

      {/* ========================================================
          ACTION MODAL
      ======================================================== */}

      {actionModal &&
        selectedApplication && (

        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4">

          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

            {/* ICON */}

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">

              {actionModal ===
                "approve" && (
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              )}

              {actionModal ===
                "return" && (
                <RotateCcw className="h-6 w-6 text-orange-600" />
              )}

              {actionModal ===
                "reject" && (
                <XCircle className="h-6 w-6 text-red-600" />
              )}

            </div>

            {/* TITLE */}

            <h3 className="mt-4 text-lg font-bold text-[#081022]">

              {actionModal ===
                "approve" &&
                "Approve this application?"}

              {actionModal ===
                "return" &&
                "Return this application?"}

              {actionModal ===
                "reject" &&
                "Reject this application?"}

            </h3>

            {/* DESCRIPTION */}

            <p className="mt-2 text-sm leading-6 text-slate-500">

              {actionModal ===
                "approve" &&
                `Approving ${selectedApplication.name}'s application will mark the applicant as accepted.`}

              {actionModal ===
                "return" &&
                `Returning ${selectedApplication.name}'s application will send it back for correction.`}

              {actionModal ===
                "reject" &&
                `Rejecting ${selectedApplication.name}'s application will mark the application as rejected.`}

            </p>

            {/* ERROR */}

            {actionError && (

              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3">

                <p className="text-xs font-medium text-red-700">
                  {actionError}
                </p>

              </div>

            )}

            {/* BUTTONS */}

            <div className="mt-5 flex gap-2">

              <button
                type="button"
                disabled={
                  actionLoading
                }
                onClick={() => {
                  setActionModal(
                    null
                  );
                  setActionError(
                    ""
                  );
                }}
                className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={
                  actionLoading
                }
                onClick={
                  handleApplicationAction
                }
                className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60 ${
                  actionModal ===
                  "approve"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : actionModal ===
                      "return"
                    ? "bg-orange-600 hover:bg-orange-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >

                {actionLoading && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}

                {actionLoading
                  ? "Updating..."
                  : "Confirm"}

              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

/* ================================================================
   REVIEW STAT
================================================================ */

function ReviewStat({
  title,
  value,
  subtitle,
  icon: Icon,
  iconClass,
}: {
  title: string;
  value: number;
  subtitle: string;
  icon: React.ElementType;
  iconClass: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">

      <div className="flex items-start justify-between">

        <div>

          <p className="text-2xl font-black text-[#081022]">
            {value}
          </p>

          <p className="mt-1 text-sm font-bold text-slate-700">
            {title}
          </p>

          <p className="mt-1 text-[11px] text-slate-400">
            {subtitle}
          </p>

        </div>

        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}
        >
          <Icon className="h-5 w-5" />
        </div>

      </div>

    </div>
  );
}

/* ================================================================
   REVIEW SECTION
================================================================ */

function ReviewSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6">

      <h3 className="mb-3 text-sm font-bold text-[#081022]">
        {title}
      </h3>

      <div className="grid gap-3 sm:grid-cols-2">
        {children}
      </div>

    </div>
  );
}

/* ================================================================
   INFO ITEM
================================================================ */

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 p-3">

      <div className="flex items-center gap-2">

        <Icon className="h-4 w-4 text-slate-400" />

        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {label}
        </p>

      </div>

      <p className="mt-2 break-words text-sm font-semibold text-slate-700">
        {value}
      </p>

    </div>
  );
}