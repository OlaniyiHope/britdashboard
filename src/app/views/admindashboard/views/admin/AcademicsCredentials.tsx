import { useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Download,
  Eye,
  FileCheck2,
  FileText,
  GraduationCap,
  Search,
  ShieldAlert,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type CredentialStatus =
  | "Pending Verification"
  | "Verified"
  | "Rejected"
  | "Issue Found";

type Credential = {
  id: string;
  applicantId: string;
  applicant: string;
  applicationNo: string;
  programme: string;
  credential: string;
  document: string;
  submittedDate: string;
  status: CredentialStatus;
  verifiedBy?: string;
};

const credentialsData: Credential[] = [
  {
    id: "CR-001",
    applicantId: "APP-2026-0012",
    applicant: "John Mensah",
    applicationNo: "APP-2026-0012",
    programme: "Computer Science",
    credential: "WAEC / WASSCE",
    document: "WASSCE Certificate.pdf",
    submittedDate: "18 Aug 2026",
    status: "Pending Verification",
  },
  {
    id: "CR-002",
    applicantId: "APP-2026-0018",
    applicant: "Mary Johnson",
    applicationNo: "APP-2026-0018",
    programme: "Business Administration",
    credential: "NECO",
    document: "NECO Result.pdf",
    submittedDate: "17 Aug 2026",
    status: "Verified",
    verifiedBy: "Admissions Officer",
  },
  {
    id: "CR-003",
    applicantId: "APP-2026-0021",
    applicant: "David Williams",
    applicationNo: "APP-2026-0021",
    programme: "Accounting",
    credential: "WASSCE",
    document: "WAEC Certificate.pdf",
    submittedDate: "16 Aug 2026",
    status: "Issue Found",
  },
  {
    id: "CR-004",
    applicantId: "APP-2026-0027",
    applicant: "Sarah Okafor",
    applicationNo: "APP-2026-0027",
    programme: "Public Administration",
    credential: "JAMB Result",
    document: "JAMB Result.pdf",
    submittedDate: "15 Aug 2026",
    status: "Verified",
    verifiedBy: "Admissions Officer",
  },
  {
    id: "CR-005",
    applicantId: "APP-2026-0030",
    applicant: "Michael Brown",
    applicationNo: "APP-2026-0030",
    programme: "Information Technology",
    credential: "WASSCE",
    document: "Result Slip.pdf",
    submittedDate: "14 Aug 2026",
    status: "Rejected",
  },
];

const statusClasses: Record<CredentialStatus, string> = {
  "Pending Verification":
    "bg-amber-50 text-amber-700 border-amber-200",
  Verified:
    "bg-emerald-50 text-emerald-700 border-emerald-200",
  Rejected:
    "bg-red-50 text-red-700 border-red-200",
  "Issue Found":
    "bg-orange-50 text-orange-700 border-orange-200",
};

function StatusBadge({ status }: { status: CredentialStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold ${statusClasses[status]}`}
    >
      {status}
    </span>
  );
}

export default function AcademicsCredentials() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "All" | CredentialStatus
  >("All");

  const filteredCredentials = useMemo(() => {
    return credentialsData.filter((credential) => {
      const matchesSearch =
        credential.applicant
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        credential.applicationNo
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        credential.programme
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        credential.credential
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        credential.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const pendingCount = credentialsData.filter(
    (item) => item.status === "Pending Verification"
  ).length;

  const verifiedCount = credentialsData.filter(
    (item) => item.status === "Verified"
  ).length;

  const issueCount = credentialsData.filter(
    (item) =>
      item.status === "Issue Found" ||
      item.status === "Rejected"
  ).length;

  const totalDocuments = credentialsData.length;

  return (
    <div className="min-h-full space-y-6 bg-slate-50 p-4 md:p-6">

      {/* HEADER */}
      <div>
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#006dcc]">
              <GraduationCap className="h-5 w-5" />

              <span className="text-[11px] font-bold uppercase tracking-[0.18em]">
                Admissions
              </span>
            </div>

            <h1 className="mt-2 text-2xl font-bold text-[#081022] md:text-3xl">
              Academics & Credentials
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-slate-500">
              Review and verify academic qualifications and supporting
              documents submitted by applicants.
            </p>
          </div>

          <Button
            variant="outline"
            className="border-slate-300"
          >
            <FileCheck2 className="mr-2 h-4 w-4" />
            Verification Guidelines
          </Button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">
                  Documents Submitted
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {totalDocuments}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <FileText className="h-5 w-5" />
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-400">
              Academic documents received
            </p>
          </CardContent>
        </Card>

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">
                  Pending Verification
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {pendingCount}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <Clock3 className="h-5 w-5" />
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-400">
              Documents requiring review
            </p>
          </CardContent>
        </Card>

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">
                  Verified
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {verifiedCount}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <CheckCircle2 className="h-5 w-5" />
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-400">
              Successfully verified documents
            </p>
          </CardContent>
        </Card>

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500">
                  Issues / Rejected
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {issueCount}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-700">
                <ShieldAlert className="h-5 w-5" />
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-400">
              Documents requiring attention
            </p>
          </CardContent>
        </Card>

      </div>

      {/* MAIN CARD */}
      <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

        {/* TOOLBAR */}
        <div className="border-b border-slate-200 p-4">

          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <h2 className="text-base font-bold text-[#081022]">
                Applicant Credentials
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Verify the academic evidence submitted with admission
                applications.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">

              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search applicant, application..."
                  className="w-full pl-9 sm:w-[260px]"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value as "All" | CredentialStatus
                  )
                }
                className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#006dcc]"
              >
                <option value="All">All Status</option>
                <option value="Pending Verification">
                  Pending Verification
                </option>
                <option value="Verified">Verified</option>
                <option value="Issue Found">Issue Found</option>
                <option value="Rejected">Rejected</option>
              </select>

            </div>

          </div>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">

          <table className="w-full min-w-[1000px] text-sm">

            <thead className="bg-slate-50">

              <tr className="border-b border-slate-200 text-left">

                <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Applicant
                </th>

                <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Programme
                </th>

                <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Credential
                </th>

                <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Document
                </th>

                <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Submitted
                </th>

                <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Status
                </th>

                <th className="px-5 py-3 text-right text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Action
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-slate-100">

              {filteredCredentials.map((credential) => (

                <tr
                  key={credential.id}
                  className="transition hover:bg-slate-50"
                >

                  {/* APPLICANT */}
                  <td className="px-5 py-4">

                    <div>
                      <p className="font-bold text-[#081022]">
                        {credential.applicant}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {credential.applicationNo}
                      </p>
                    </div>

                  </td>

                  {/* PROGRAMME */}
                  <td className="px-5 py-4">

                    <p className="font-medium text-slate-700">
                      {credential.programme}
                    </p>

                  </td>

                  {/* CREDENTIAL */}
                  <td className="px-5 py-4">

                    <span className="font-medium text-slate-700">
                      {credential.credential}
                    </span>

                  </td>

                  {/* DOCUMENT */}
                  <td className="px-5 py-4">

                    <div className="flex items-center gap-2">

                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                        <FileText className="h-4 w-4" />
                      </div>

                      <span className="max-w-[180px] truncate text-xs font-medium text-slate-600">
                        {credential.document}
                      </span>

                    </div>

                  </td>

                  {/* DATE */}
                  <td className="px-5 py-4 text-xs text-slate-500">
                    {credential.submittedDate}
                  </td>

                  {/* STATUS */}
                  <td className="px-5 py-4">

                    <StatusBadge status={credential.status} />

                  </td>

                  {/* ACTIONS */}
                  <td className="px-5 py-4">

                    <div className="flex justify-end gap-2">

                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8"
                      >
                        <Eye className="mr-1.5 h-3.5 w-3.5" />
                        Review
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8"
                      >
                        <Download className="mr-1.5 h-3.5 w-3.5" />
                        Download
                      </Button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {/* EMPTY STATE */}
        {filteredCredentials.length === 0 && (

          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">

            <FileText className="h-10 w-10 text-slate-300" />

            <p className="mt-3 text-sm font-bold text-slate-600">
              No credentials found
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Try changing your search or status filter.
            </p>

          </div>

        )}

      </Card>

      {/* VERIFICATION NOTE */}
      <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">

        <div className="flex gap-3">

          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-blue-700" />

          <div>

            <p className="text-sm font-bold text-blue-900">
              Credential verification
            </p>

            <p className="mt-1 text-xs leading-5 text-blue-800">
              Verify the applicant's academic documents before the
              admission application is finally approved. Any missing,
              invalid, or questionable document should be flagged for
              correction before admission processing continues.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}