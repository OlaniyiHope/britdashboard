import { useMemo, useState } from "react";
import {
  Search,
  Filter,
  Eye,
  Plus,
  Users,
  Building2,
  UserCheck,
  Clock3,
  MapPin,
  CalendarDays,
  FileText,
  CheckCircle2,
  AlertCircle,
  MoreHorizontal,
  X,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type SIWESStatus =
  | "Pending"
  | "Approved"
  | "Ongoing"
  | "Completed"
  | "Not Placed";

interface SIWESRecord {
  id: string;
  studentName: string;
  matricNumber: string;
  programme: string;
  department: string;
  level: string;

  organization: string;
  organizationAddress: string;
  industry: string;

  supervisor: string;
  supervisorEmail: string;
  supervisorPhone: string;

  startDate: string;
  endDate: string;

  status: SIWESStatus;

  logbookStatus: "Not Submitted" | "Submitted" | "Verified";
  reportStatus: "Not Submitted" | "Submitted" | "Approved";

  lastUpdated: string;
}

/*
|--------------------------------------------------------------------------
| TEMPORARY DATA
|--------------------------------------------------------------------------
|
| Replace this with your API data when the SIWES endpoint is connected.
|
*/

const siwesRecords: SIWESRecord[] = [
  {
    id: "SIWES-001",
    studentName: "Daniel Mensah",
    matricNumber: "BTP/CSC/2024/001",
    programme: "Computer Science",
    department: "Computing & Technology",
    level: "300 Level",

    organization: "Tech Solutions Nigeria Ltd",
    organizationAddress: "Ikeja, Lagos",
    industry: "Information Technology",

    supervisor: "Mr. James Adeyemi",
    supervisorEmail: "james.ade@techsolutions.com",
    supervisorPhone: "+234 801 234 5678",

    startDate: "01 Jun 2026",
    endDate: "30 Sep 2026",

    status: "Ongoing",

    logbookStatus: "Submitted",
    reportStatus: "Not Submitted",

    lastUpdated: "25 Aug 2026",
  },

  {
    id: "SIWES-002",
    studentName: "Sarah Williams",
    matricNumber: "BTP/BUS/2024/014",
    programme: "Business Administration",
    department: "Business Studies",
    level: "300 Level",

    organization: "Global Business Consult",
    organizationAddress: "Victoria Island, Lagos",
    industry: "Business & Management",

    supervisor: "Mrs. Anita Johnson",
    supervisorEmail: "anita@globalbusiness.com",
    supervisorPhone: "+234 802 345 6789",

    startDate: "15 Jun 2026",
    endDate: "15 Sep 2026",

    status: "Ongoing",

    logbookStatus: "Submitted",
    reportStatus: "Not Submitted",

    lastUpdated: "24 Aug 2026",
  },

  {
    id: "SIWES-003",
    studentName: "Michael Johnson",
    matricNumber: "BTP/ENG/2025/008",
    programme: "Mechanical Engineering",
    department: "Engineering",
    level: "300 Level",

    organization: "Industrial Engineering Works",
    organizationAddress: "Apapa, Lagos",
    industry: "Engineering",

    supervisor: "Engr. Peter Okafor",
    supervisorEmail: "p.okafor@iew.com",
    supervisorPhone: "+234 803 456 7890",

    startDate: "01 Jul 2026",
    endDate: "30 Sep 2026",

    status: "Approved",

    logbookStatus: "Not Submitted",
    reportStatus: "Not Submitted",

    lastUpdated: "23 Aug 2026",
  },

  {
    id: "SIWES-004",
    studentName: "Grace Mensima",
    matricNumber: "BTP/ACC/2023/031",
    programme: "Accounting",
    department: "Business Studies",
    level: "400 Level",

    organization: "Prime Audit & Associates",
    organizationAddress: "Yaba, Lagos",
    industry: "Accounting & Finance",

    supervisor: "Mr. Samuel Boateng",
    supervisorEmail: "samuel@primeaudit.com",
    supervisorPhone: "+234 804 567 8901",

    startDate: "01 Feb 2026",
    endDate: "30 Apr 2026",

    status: "Completed",

    logbookStatus: "Verified",
    reportStatus: "Approved",

    lastUpdated: "20 Aug 2026",
  },

  {
    id: "SIWES-005",
    studentName: "Esther Adams",
    matricNumber: "BTP/INF/2024/045",
    programme: "Information Technology",
    department: "Computing & Technology",
    level: "300 Level",

    organization: "",
    organizationAddress: "",
    industry: "",

    supervisor: "",
    supervisorEmail: "",
    supervisorPhone: "",

    startDate: "",
    endDate: "",

    status: "Not Placed",

    logbookStatus: "Not Submitted",
    reportStatus: "Not Submitted",

    lastUpdated: "19 Aug 2026",
  },

  {
    id: "SIWES-006",
    studentName: "Samuel Okoro",
    matricNumber: "BTP/CVE/2022/017",
    programme: "Civil Engineering",
    department: "Engineering",
    level: "400 Level",

    organization: "BuildRight Construction Ltd",
    organizationAddress: "Lekki, Lagos",
    industry: "Construction",

    supervisor: "Engr. David Williams",
    supervisorEmail: "david@buildright.com",
    supervisorPhone: "+234 805 678 9012",

    startDate: "10 Jan 2026",
    endDate: "10 Apr 2026",

    status: "Completed",

    logbookStatus: "Verified",
    reportStatus: "Approved",

    lastUpdated: "18 Aug 2026",
  },
];

/*
|--------------------------------------------------------------------------
| STATUS BADGE
|--------------------------------------------------------------------------
*/

function StatusBadge({
  status,
}: {
  status: SIWESStatus;
}) {
  const styles: Record<SIWESStatus, string> = {
    Pending:
      "bg-amber-50 text-amber-700 border-amber-200",

    Approved:
      "bg-blue-50 text-blue-700 border-blue-200",

    Ongoing:
      "bg-emerald-50 text-emerald-700 border-emerald-200",

    Completed:
      "bg-purple-50 text-purple-700 border-purple-200",

    "Not Placed":
      "bg-red-50 text-red-700 border-red-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold ${styles[status]}`}
    >
      {status}
    </span>
  );
}

/*
|--------------------------------------------------------------------------
| DOCUMENT BADGE
|--------------------------------------------------------------------------
*/

function DocumentBadge({
  status,
}: {
  status: string;
}) {
  const isGood =
    status === "Submitted" ||
    status === "Verified" ||
    status === "Approved";

  return (
    <span
      className={`inline-flex rounded-full border px-2 py-1 text-[10px] font-semibold ${
        isGood
          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
          : "border-slate-200 bg-slate-50 text-slate-500"
      }`}
    >
      {status}
    </span>
  );
}

/*
|--------------------------------------------------------------------------
| PAGE
|--------------------------------------------------------------------------
*/

export default function SiwesTracker() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("All");

  const [departmentFilter, setDepartmentFilter] =
    useState("All");

  const [selectedRecord, setSelectedRecord] =
    useState<SIWESRecord | null>(null);

  /*
  |--------------------------------------------------------------------------
  | STATISTICS
  |--------------------------------------------------------------------------
  */

  const studentCount = siwesRecords.length;

  const placementCount = siwesRecords.filter(
    (record) =>
      record.status !== "Not Placed"
  ).length;

  const pendingCount = siwesRecords.filter(
    (record) =>
      record.status === "Pending" ||
      record.status === "Not Placed"
  ).length;

  const supervisorCount = new Set(
    siwesRecords
      .map((record) => record.supervisor)
      .filter(Boolean)
  ).size;

  /*
  |--------------------------------------------------------------------------
  | DEPARTMENTS
  |--------------------------------------------------------------------------
  */

  const departments = useMemo(() => {
    return Array.from(
      new Set(
        siwesRecords.map(
          (record) => record.department
        )
      )
    );
  }, []);

  /*
  |--------------------------------------------------------------------------
  | FILTERING
  |--------------------------------------------------------------------------
  */

  const filteredRecords = useMemo(() => {
    const query = search.trim().toLowerCase();

    return siwesRecords.filter((record) => {
      const matchesSearch =
        !query ||
        record.studentName
          .toLowerCase()
          .includes(query) ||
        record.matricNumber
          .toLowerCase()
          .includes(query) ||
        record.programme
          .toLowerCase()
          .includes(query) ||
        record.organization
          .toLowerCase()
          .includes(query) ||
        record.supervisor
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        record.status === statusFilter;

      const matchesDepartment =
        departmentFilter === "All" ||
        record.department === departmentFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesDepartment
      );
    });
  }, [
    search,
    statusFilter,
    departmentFilter,
  ]);

  return (
    <div className="min-h-full space-y-6 bg-slate-50 p-4 md:p-6">

      {/* ============================================================
          HEADER
      ============================================================ */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#081022] text-white">
            <Building2 className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-[#081022] md:text-2xl">
              SIWES & IT Tracker
            </h1>

            <p className="mt-1 text-xs text-slate-500">
              Monitor student industrial training,
              placements, supervisors and training progress.
            </p>
          </div>

        </div>

        <Button
          className="gap-2 bg-[#006dcc] hover:bg-[#005ca8]"
          onClick={() =>
            console.log("Add SIWES placement")
          }
        >
          <Plus className="h-4 w-4" />
          Add Placement
        </Button>

      </div>

      {/* ============================================================
          OVERVIEW
      ============================================================ */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* Students */}

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-5">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-medium text-slate-500">
                  SIWES Students
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {studentCount}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Students in the tracker
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <Users className="h-5 w-5" />
              </div>

            </div>

          </CardContent>
        </Card>

        {/* Placements */}

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-5">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-medium text-slate-500">
                  Placements
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {placementCount}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Students with placements
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <Building2 className="h-5 w-5" />
              </div>

            </div>

          </CardContent>
        </Card>

        {/* Pending */}

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-5">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-medium text-slate-500">
                  Pending / Unplaced
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {pendingCount}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Require attention
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <Clock3 className="h-5 w-5" />
              </div>

            </div>

          </CardContent>
        </Card>

        {/* Supervisors */}

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-5">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-medium text-slate-500">
                  Supervisors
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {supervisorCount}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Assigned supervisors
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
                <UserCheck className="h-5 w-5" />
              </div>

            </div>

          </CardContent>
        </Card>

      </div>

      {/* ============================================================
          ATTENTION PANEL
      ============================================================ */}

      <div className="grid gap-4 md:grid-cols-3">

        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">

          <div className="flex items-start gap-3">

            <Clock3 className="mt-0.5 h-5 w-5 text-amber-700" />

            <div>
              <p className="text-sm font-bold text-amber-900">
                Pending placements
              </p>

              <p className="mt-1 text-xs leading-5 text-amber-700">
                Students who still need an approved
                SIWES/IT placement.
              </p>
            </div>

          </div>

        </div>

        <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">

          <div className="flex items-start gap-3">

            <FileText className="mt-0.5 h-5 w-5 text-blue-700" />

            <div>
              <p className="text-sm font-bold text-blue-900">
                Logbooks & reports
              </p>

              <p className="mt-1 text-xs leading-5 text-blue-700">
                Monitor student logbooks and final
                training reports.
              </p>
            </div>

          </div>

        </div>

        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">

          <div className="flex items-start gap-3">

            <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-700" />

            <div>
              <p className="text-sm font-bold text-emerald-900">
                Completed training
              </p>

              <p className="mt-1 text-xs leading-5 text-emerald-700">
                Track students who have completed
                their industrial training.
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* ============================================================
          SEARCH + FILTER
      ============================================================ */}

      <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

        <CardContent className="p-4">

          <div className="flex flex-col gap-3 lg:flex-row">

            <div className="relative flex-1">

              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search student, matric number, organization or supervisor..."
                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-[#006dcc] focus:bg-white focus:ring-2 focus:ring-blue-100"
              />

            </div>

            <div className="flex items-center gap-2">

              <Filter className="h-4 w-4 text-slate-400" />

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#006dcc]"
              >
                <option value="All">
                  All Status
                </option>

                <option value="Pending">
                  Pending
                </option>

                <option value="Approved">
                  Approved
                </option>

                <option value="Ongoing">
                  Ongoing
                </option>

                <option value="Completed">
                  Completed
                </option>

                <option value="Not Placed">
                  Not Placed
                </option>
              </select>

            </div>

            <select
              value={departmentFilter}
              onChange={(event) =>
                setDepartmentFilter(event.target.value)
              }
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#006dcc]"
            >
              <option value="All">
                All Departments
              </option>

              {departments.map((department) => (
                <option
                  key={department}
                  value={department}
                >
                  {department}
                </option>
              ))}
            </select>

          </div>

        </CardContent>

      </Card>

      {/* ============================================================
          SIWES TABLE
      ============================================================ */}

      <Card className="overflow-hidden border-none bg-white shadow-sm ring-1 ring-slate-200">

        <div className="border-b border-slate-200 px-5 py-4">

          <div>
            <h2 className="text-sm font-bold text-[#081022]">
              Student Industrial Training Records
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              {filteredRecords.length} record
              {filteredRecords.length !== 1 ? "s" : ""} displayed
            </p>
          </div>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1250px]">

            <thead className="bg-slate-50">

              <tr className="border-b border-slate-200">

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Student
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Programme
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Organization
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Supervisor
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Training Period
                </th>

                <th className="px-5 py-3 text-center text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Documents
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

              {filteredRecords.length === 0 ? (

                <tr>

                  <td
                    colSpan={8}
                    className="px-5 py-16 text-center"
                  >

                    <Building2 className="mx-auto h-8 w-8 text-slate-300" />

                    <p className="mt-3 text-sm font-semibold text-slate-500">
                      No SIWES records found
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Try changing your search or filters.
                    </p>

                  </td>

                </tr>

              ) : (

                filteredRecords.map((record) => (

                  <tr
                    key={record.id}
                    className="transition hover:bg-slate-50"
                  >

                    {/* Student */}

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#081022] text-sm font-bold text-white">
                          {record.studentName
                            .split(" ")
                            .map((name) => name[0])
                            .slice(0, 2)
                            .join("")}
                        </div>

                        <div>

                          <p className="text-sm font-bold text-[#081022]">
                            {record.studentName}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {record.matricNumber}
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* Programme */}

                    <td className="px-5 py-4">

                      <p className="text-xs font-semibold text-slate-700">
                        {record.programme}
                      </p>

                      <p className="mt-1 text-[11px] text-slate-400">
                        {record.level}
                      </p>

                    </td>

                    {/* Organization */}

                    <td className="px-5 py-4">

                      {record.organization ? (

                        <>
                          <p className="text-xs font-bold text-slate-700">
                            {record.organization}
                          </p>

                          <div className="mt-1 flex items-center gap-1 text-[11px] text-slate-400">
                            <MapPin className="h-3 w-3" />
                            {record.organizationAddress}
                          </div>
                        </>

                      ) : (

                        <span className="text-xs font-semibold text-red-500">
                          Placement required
                        </span>

                      )}

                    </td>

                    {/* Supervisor */}

                    <td className="px-5 py-4">

                      {record.supervisor ? (

                        <p className="text-xs font-semibold text-slate-700">
                          {record.supervisor}
                        </p>

                      ) : (

                        <span className="text-xs text-slate-400">
                          Not assigned
                        </span>

                      )}

                    </td>

                    {/* Training Period */}

                    <td className="px-5 py-4">

                      {record.startDate ? (

                        <div className="flex items-center gap-2">

                          <CalendarDays className="h-4 w-4 text-slate-400" />

                          <div>

                            <p className="text-xs font-semibold text-slate-700">
                              {record.startDate}
                            </p>

                            <p className="mt-1 text-[11px] text-slate-400">
                              to {record.endDate}
                            </p>

                          </div>

                        </div>

                      ) : (

                        <span className="text-xs text-slate-400">
                          Not scheduled
                        </span>

                      )}

                    </td>

                    {/* Documents */}

                    <td className="px-5 py-4">

                      <div className="flex flex-col items-center gap-1">

                        <DocumentBadge
                          status={record.logbookStatus}
                        />

                        <DocumentBadge
                          status={record.reportStatus}
                        />

                      </div>

                    </td>

                    {/* Status */}

                    <td className="px-5 py-4">

                      <StatusBadge
                        status={record.status}
                      />

                    </td>

                    {/* Actions */}

                    <td className="px-5 py-4">

                      <div className="flex justify-end gap-2">

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setSelectedRecord(record)
                          }
                          className="h-8 gap-1.5 border-slate-200 text-xs"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </Button>

                        <button
                          type="button"
                          className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-500 hover:bg-slate-50"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>

                      </div>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

        {/* Pagination */}

        <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3">

          <p className="text-xs text-slate-500">
            Showing{" "}
            <strong className="text-slate-700">
              {filteredRecords.length}
            </strong>{" "}
            of{" "}
            <strong className="text-slate-700">
              {studentCount}
            </strong>{" "}
            records
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

      {/* ============================================================
          DETAILS MODAL
      ============================================================ */}

      {selectedRecord && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

            {/* Header */}

            <div className="flex items-start justify-between bg-[#081022] p-6 text-white">

              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-lg font-bold">
                  {selectedRecord.studentName
                    .split(" ")
                    .map((name) => name[0])
                    .slice(0, 2)
                    .join("")}
                </div>

                <div>

                  <p className="text-lg font-bold">
                    {selectedRecord.studentName}
                  </p>

                  <p className="mt-1 text-xs text-slate-300">
                    {selectedRecord.matricNumber}
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedRecord(null)
                }
                className="rounded-lg p-2 text-slate-300 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

            </div>

            {/* Content */}

            <div className="space-y-6 p-6">

              {/* Status */}

              <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    SIWES Status
                  </p>

                  <div className="mt-2">
                    <StatusBadge
                      status={selectedRecord.status}
                    />
                  </div>

                </div>

                <div className="text-left sm:text-right">

                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Last Updated
                  </p>

                  <p className="mt-1 text-sm font-bold text-[#081022]">
                    {selectedRecord.lastUpdated}
                  </p>

                </div>

              </div>

              {/* Student Information */}

              <div>

                <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Student Information
                </h3>

                <div className="grid gap-3 sm:grid-cols-2">

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400">
                      Programme
                    </p>

                    <p className="mt-2 text-sm font-bold text-[#081022]">
                      {selectedRecord.programme}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400">
                      Department
                    </p>

                    <p className="mt-2 text-sm font-bold text-[#081022]">
                      {selectedRecord.department}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400">
                      Level
                    </p>

                    <p className="mt-2 text-sm font-bold text-[#081022]">
                      {selectedRecord.level}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-[10px] uppercase tracking-wider text-slate-400">
                      Matric Number
                    </p>

                    <p className="mt-2 text-sm font-bold text-[#081022]">
                      {selectedRecord.matricNumber}
                    </p>
                  </div>

                </div>

              </div>

              {/* Placement */}

              <div>

                <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Industrial Placement
                </h3>

                {selectedRecord.organization ? (

                  <div className="space-y-3">

                    <div className="rounded-xl border border-slate-200 p-4">

                      <div className="flex items-start gap-3">

                        <Building2 className="mt-0.5 h-5 w-5 text-[#006dcc]" />

                        <div>

                          <p className="text-sm font-bold text-[#081022]">
                            {selectedRecord.organization}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {selectedRecord.industry}
                          </p>

                          <div className="mt-2 flex items-center gap-1 text-xs text-slate-500">
                            <MapPin className="h-3.5 w-3.5" />
                            {selectedRecord.organizationAddress}
                          </div>

                        </div>

                      </div>

                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">

                      <div className="rounded-xl bg-slate-50 p-4">

                        <div className="flex items-center gap-2">

                          <CalendarDays className="h-4 w-4 text-slate-400" />

                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            Start Date
                          </p>

                        </div>

                        <p className="mt-2 text-sm font-bold text-[#081022]">
                          {selectedRecord.startDate}
                        </p>

                      </div>

                      <div className="rounded-xl bg-slate-50 p-4">

                        <div className="flex items-center gap-2">

                          <CalendarDays className="h-4 w-4 text-slate-400" />

                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                            End Date
                          </p>

                        </div>

                        <p className="mt-2 text-sm font-bold text-[#081022]">
                          {selectedRecord.endDate}
                        </p>

                      </div>

                    </div>

                  </div>

                ) : (

                  <div className="rounded-xl border border-red-200 bg-red-50 p-4">

                    <div className="flex items-start gap-3">

                      <AlertCircle className="h-5 w-5 text-red-600" />

                      <div>

                        <p className="text-sm font-bold text-red-800">
                          No placement assigned
                        </p>

                        <p className="mt-1 text-xs text-red-600">
                          This student requires a SIWES/IT
                          placement before training can begin.
                        </p>

                      </div>

                    </div>

                  </div>

                )}

              </div>

              {/* Supervisor */}

              <div>

                <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Industry Supervisor
                </h3>

                {selectedRecord.supervisor ? (

                  <div className="rounded-xl border border-slate-200 p-4">

                    <div className="flex items-center gap-3">

                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#081022] text-sm font-bold text-white">
                        {selectedRecord.supervisor
                          .split(" ")
                          .map((name) => name[0])
                          .slice(0, 2)
                          .join("")}
                      </div>

                      <div>

                        <p className="text-sm font-bold text-[#081022]">
                          {selectedRecord.supervisor}
                        </p>

                        <div className="mt-1 flex flex-col gap-1 sm:flex-row sm:gap-4">

                          <span className="flex items-center gap-1 text-xs text-slate-500">
                            <Mail className="h-3 w-3" />
                            {selectedRecord.supervisorEmail}
                          </span>

                          <span className="flex items-center gap-1 text-xs text-slate-500">
                            <Phone className="h-3 w-3" />
                            {selectedRecord.supervisorPhone}
                          </span>

                        </div>

                      </div>

                    </div>

                  </div>

                ) : (

                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">

                    <p className="text-sm font-semibold text-amber-800">
                      No supervisor assigned
                    </p>

                  </div>

                )}

              </div>

              {/* Documents */}

              <div>

                <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Training Documents
                </h3>

                <div className="grid gap-3 sm:grid-cols-2">

                  <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4">

                    <div className="flex items-center gap-3">

                      <FileText className="h-5 w-5 text-slate-400" />

                      <div>

                        <p className="text-sm font-bold text-[#081022]">
                          Logbook
                        </p>

                        <p className="text-xs text-slate-500">
                          Student training logbook
                        </p>

                      </div>

                    </div>

                    <DocumentBadge
                      status={
                        selectedRecord.logbookStatus
                      }
                    />

                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4">

                    <div className="flex items-center gap-3">

                      <FileText className="h-5 w-5 text-slate-400" />

                      <div>

                        <p className="text-sm font-bold text-[#081022]">
                          Final Report
                        </p>

                        <p className="text-xs text-slate-500">
                          Industrial training report
                        </p>

                      </div>

                    </div>

                    <DocumentBadge
                      status={
                        selectedRecord.reportStatus
                      }
                    />

                  </div>

                </div>

              </div>

            </div>

            {/* Footer */}

            <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-6 py-4">

              <Button
                variant="outline"
                onClick={() =>
                  setSelectedRecord(null)
                }
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