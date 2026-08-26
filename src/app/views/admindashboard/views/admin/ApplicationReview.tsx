import { useMemo, useState } from "react";
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
} from "lucide-react";

type ApplicationStatus =
  | "Pending Review"
  | "Approved"
  | "Needs Correction"
  | "Rejected";

interface Application {
  id: string;
  applicationNumber: string;
  name: string;
  email: string;
  phone: string;
  programme: string;
  qualification: string;
  submittedDate: string;
  status: ApplicationStatus;
  state: string;
  documents: number;
}

const applications: Application[] = [
  {
    id: "1",
    applicationNumber: "BTP-2026-00124",
    name: "Daniel Okafor",
    email: "daniel.okafor@example.com",
    phone: "+234 801 234 5678",
    programme: "Computer Science",
    qualification: "WAEC",
    submittedDate: "Aug 24, 2026",
    status: "Pending Review",
    state: "Lagos",
    documents: 5,
  },
  {
    id: "2",
    applicationNumber: "BTP-2026-00121",
    name: "Amaka Johnson",
    email: "amaka.johnson@example.com",
    phone: "+234 802 345 6789",
    programme: "Business Administration",
    qualification: "NECO",
    submittedDate: "Aug 23, 2026",
    status: "Pending Review",
    state: "Rivers",
    documents: 4,
  },
  {
    id: "3",
    applicationNumber: "BTP-2026-00118",
    name: "Michael Adeyemi",
    email: "michael.adeyemi@example.com",
    phone: "+234 803 456 7890",
    programme: "Accounting",
    qualification: "WAEC",
    submittedDate: "Aug 22, 2026",
    status: "Approved",
    state: "Oyo",
    documents: 6,
  },
  {
    id: "4",
    applicationNumber: "BTP-2026-00115",
    name: "Sarah Williams",
    email: "sarah.williams@example.com",
    phone: "+234 804 567 8901",
    programme: "Mass Communication",
    qualification: "WAEC",
    submittedDate: "Aug 21, 2026",
    status: "Needs Correction",
    state: "Abuja",
    documents: 3,
  },
  {
    id: "5",
    applicationNumber: "BTP-2026-00109",
    name: "Ibrahim Musa",
    email: "ibrahim.musa@example.com",
    phone: "+234 805 678 9012",
    programme: "Electrical Engineering",
    qualification: "NECO",
    submittedDate: "Aug 20, 2026",
    status: "Rejected",
    state: "Kaduna",
    documents: 4,
  },
];

const statusStyles: Record<ApplicationStatus, string> = {
  "Pending Review":
    "bg-amber-50 text-amber-700 border-amber-200",
  Approved:
    "bg-emerald-50 text-emerald-700 border-emerald-200",
  "Needs Correction":
    "bg-orange-50 text-orange-700 border-orange-200",
  Rejected:
    "bg-red-50 text-red-700 border-red-200",
};

export default function ApplicationReview() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<"All" | ApplicationStatus>("All");

  const [selectedApplication, setSelectedApplication] =
    useState<Application | null>(null);

  const [actionModal, setActionModal] = useState<
    "approve" | "return" | "reject" | null
  >(null);

  const filteredApplications = useMemo(() => {
    return applications.filter((application) => {
      const matchesSearch =
        application.name
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        application.applicationNumber
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        application.programme
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        application.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const pendingCount = applications.filter(
    (item) => item.status === "Pending Review"
  ).length;

  const approvedCount = applications.filter(
    (item) => item.status === "Approved"
  ).length;

  const returnedCount = applications.filter(
    (item) => item.status === "Needs Correction"
  ).length;

  const rejectedCount = applications.filter(
    (item) => item.status === "Rejected"
  ).length;

  return (
    <div className="min-h-full space-y-6 bg-slate-50 p-4 md:p-6">

      {/* HEADER */}

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
              Review submitted admission applications and make admission
              decisions.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500 shadow-sm">
            <Clock3 className="h-4 w-4" />
            Applications awaiting your review
          </div>

        </div>
      </div>

      {/* STATISTICS */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <ReviewStat
          title="Pending Review"
          value={pendingCount}
          subtitle="Require administrator action"
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
          title="Needs Correction"
          value={returnedCount}
          subtitle="Returned to applicants"
          icon={RotateCcw}
          iconClass="bg-orange-50 text-orange-700"
        />

        <ReviewStat
          title="Rejected"
          value={rejectedCount}
          subtitle="Applications declined"
          icon={XCircle}
          iconClass="bg-red-50 text-red-700"
        />

      </div>

      {/* MAIN REVIEW AREA */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {/* TOOLBAR */}

        <div className="border-b border-slate-200 p-4">

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

            <div className="relative flex-1 lg:max-w-md">

              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search applicant, application number or programme..."
                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
              />

            </div>

            <div className="flex items-center gap-2">

              <Filter className="h-4 w-4 text-slate-400" />

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value as "All" | ApplicationStatus
                  )
                }
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none"
              >
                <option value="All">All Applications</option>
                <option value="Pending Review">
                  Pending Review
                </option>
                <option value="Approved">Approved</option>
                <option value="Needs Correction">
                  Needs Correction
                </option>
                <option value="Rejected">Rejected</option>
              </select>

            </div>

          </div>

        </div>

        {/* TABLE */}

        <div className="overflow-x-auto">

          <table className="w-full min-w-[950px]">

            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Applicant
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Programme
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Qualification
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Submitted
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

              {filteredApplications.map((application) => (

                <tr
                  key={application.id}
                  className="transition hover:bg-slate-50"
                >

                  {/* APPLICANT */}

                  <td className="px-5 py-4">

                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#081022] text-sm font-bold text-white">
                        {application.name
                          .split(" ")
                          .map((name) => name[0])
                          .join("")
                          .slice(0, 2)}
                      </div>

                      <div>

                        <p className="text-sm font-bold text-[#081022]">
                          {application.name}
                        </p>

                        <p className="mt-0.5 text-xs text-slate-400">
                          {application.applicationNumber}
                        </p>

                      </div>

                    </div>

                  </td>

                  {/* PROGRAMME */}

                  <td className="px-5 py-4">

                    <p className="text-sm font-medium text-slate-700">
                      {application.programme}
                    </p>

                  </td>

                  {/* QUALIFICATION */}

                  <td className="px-5 py-4">

                    <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                      {application.qualification}
                    </span>

                  </td>

                  {/* DATE */}

                  <td className="px-5 py-4">

                    <p className="text-xs text-slate-500">
                      {application.submittedDate}
                    </p>

                  </td>

                  {/* STATUS */}

                  <td className="px-5 py-4">

                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-bold ${statusStyles[application.status]}`}
                    >
                      {application.status}
                    </span>

                  </td>

                  {/* ACTION */}

                  <td className="px-5 py-4 text-right">

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedApplication(application)
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-[#081022] transition hover:border-[#081022] hover:bg-slate-50"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      Review
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

          {filteredApplications.length === 0 && (
            <div className="py-16 text-center">

              <FileText className="mx-auto h-9 w-9 text-slate-300" />

              <p className="mt-3 text-sm font-semibold text-slate-500">
                No applications found
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Try changing your search or status filter.
              </p>

            </div>
          )}

        </div>

      </div>

      {/* REVIEW DRAWER */}

      {selectedApplication && (
        <div className="fixed inset-0 z-50">

          <div
            className="absolute inset-0 bg-slate-950/40"
            onClick={() => setSelectedApplication(null)}
          />

          <div className="absolute right-0 top-0 flex h-full w-full max-w-2xl flex-col bg-white shadow-2xl">

            {/* DRAWER HEADER */}

            <div className="flex items-start justify-between border-b border-slate-200 p-5">

              <div>

                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-600">
                  Application Review
                </p>

                <h2 className="mt-1 text-xl font-bold text-[#081022]">
                  {selectedApplication.name}
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  {selectedApplication.applicationNumber}
                </p>

              </div>

              <button
                type="button"
                onClick={() => setSelectedApplication(null)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>

            </div>

            {/* DRAWER CONTENT */}

            <div className="flex-1 overflow-y-auto p-5">

              {/* STATUS */}

              <div className="mb-5 flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4">

                <div className="flex items-center gap-3">

                  <Clock3 className="h-5 w-5 text-slate-500" />

                  <div>

                    <p className="text-xs font-semibold text-slate-500">
                      Current Application Status
                    </p>

                    <p className="mt-1 text-sm font-bold text-[#081022]">
                      {selectedApplication.status}
                    </p>

                  </div>

                </div>

                <span
                  className={`rounded-full border px-3 py-1 text-[11px] font-bold ${statusStyles[selectedApplication.status]}`}
                >
                  {selectedApplication.status}
                </span>

              </div>

              {/* APPLICANT INFORMATION */}

              <ReviewSection title="Applicant Information">

                <InfoItem
                  icon={User}
                  label="Full Name"
                  value={selectedApplication.name}
                />

                <InfoItem
                  icon={Mail}
                  label="Email Address"
                  value={selectedApplication.email}
                />

                <InfoItem
                  icon={Phone}
                  label="Phone Number"
                  value={selectedApplication.phone}
                />

                <InfoItem
                  icon={MapPin}
                  label="State of Residence"
                  value={selectedApplication.state}
                />

              </ReviewSection>

              {/* ACADEMIC INFORMATION */}

              <ReviewSection title="Academic Information">

                <InfoItem
                  icon={GraduationCap}
                  label="Programme Applied For"
                  value={selectedApplication.programme}
                />

                <InfoItem
                  icon={FileText}
                  label="Highest Qualification"
                  value={selectedApplication.qualification}
                />

                <InfoItem
                  icon={CalendarDays}
                  label="Date Submitted"
                  value={selectedApplication.submittedDate}
                />

              </ReviewSection>

              {/* DOCUMENTS */}

              <ReviewSection title="Submitted Documents">

                <div className="rounded-xl border border-slate-200">

                  <div className="flex items-center justify-between p-4">

                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
                        <FileText className="h-5 w-5" />
                      </div>

                      <div>

                        <p className="text-sm font-bold text-[#081022]">
                          Application Documents
                        </p>

                        <p className="text-xs text-slate-500">
                          {selectedApplication.documents} documents submitted
                        </p>

                      </div>

                    </div>

                    <button
                      type="button"
                      className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-[#081022] hover:bg-slate-50"
                    >
                      View Documents
                    </button>

                  </div>

                </div>

              </ReviewSection>

              {/* REVIEW NOTICE */}

              {selectedApplication.status === "Pending Review" && (
                <div className="mt-5 flex gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">

                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />

                  <div>

                    <p className="text-sm font-bold text-blue-900">
                      Admission decision required
                    </p>

                    <p className="mt-1 text-xs leading-5 text-blue-700">
                      Review the applicant's information and supporting
                      documents before approving, returning, or rejecting
                      this application.
                    </p>

                  </div>

                </div>
              )}

            </div>

            {/* ACTION FOOTER */}

            {selectedApplication.status === "Pending Review" && (
              <div className="border-t border-slate-200 bg-white p-4">

                <div className="grid gap-2 sm:grid-cols-3">

                  <button
                    type="button"
                    onClick={() => setActionModal("approve")}
                    className="flex h-10 items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 text-xs font-bold text-white transition hover:bg-emerald-700"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Approve
                  </button>

                  <button
                    type="button"
                    onClick={() => setActionModal("return")}
                    className="flex h-10 items-center justify-center gap-2 rounded-lg border border-orange-200 bg-orange-50 px-4 text-xs font-bold text-orange-700 transition hover:bg-orange-100"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Return
                  </button>

                  <button
                    type="button"
                    onClick={() => setActionModal("reject")}
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

      {/* ACTION CONFIRMATION */}

      {actionModal && selectedApplication && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/50 p-4">

          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100">

              {actionModal === "approve" && (
                <CheckCircle2 className="h-6 w-6 text-emerald-600" />
              )}

              {actionModal === "return" && (
                <RotateCcw className="h-6 w-6 text-orange-600" />
              )}

              {actionModal === "reject" && (
                <XCircle className="h-6 w-6 text-red-600" />
              )}

            </div>

            <h3 className="mt-4 text-lg font-bold text-[#081022]">

              {actionModal === "approve" &&
                "Approve this application?"}

              {actionModal === "return" &&
                "Return this application?"}

              {actionModal === "reject" &&
                "Reject this application?"}

            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">

              {actionModal === "approve" &&
                `Approving ${selectedApplication.name}'s application will mark the applicant as accepted.`}

              {actionModal === "return" &&
                `Returning ${selectedApplication.name}'s application will allow the applicant to correct the required information and resubmit.`}

              {actionModal === "reject" &&
                `Rejecting ${selectedApplication.name}'s application will mark the application as rejected.`}

            </p>

            <div className="mt-5 flex gap-2">

              <button
                type="button"
                onClick={() => setActionModal(null)}
                className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => {
                  /*
                   * Connect these actions to your backend later.
                   *
                   * APPROVE:
                   * PATCH /applications/:id/approve
                   *
                   * RETURN:
                   * PATCH /applications/:id/return
                   *
                   * REJECT:
                   * PATCH /applications/:id/reject
                   */

                  setActionModal(null);
                }}
                className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-bold text-white ${
                  actionModal === "approve"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : actionModal === "return"
                    ? "bg-orange-600 hover:bg-orange-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                Confirm
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

/* ================================================================
   COMPONENTS
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

      <p className="mt-2 text-sm font-semibold text-slate-700">
        {value}
      </p>

    </div>
  );
}