import { useMemo, useState } from "react";
import {
  Search,
  Filter,
  Eye,
  GraduationCap,
  Users,
  UserCheck,
  Clock3,
  CheckCircle2,
  AlertCircle,
  Download,
  X,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  FileCheck2,
  CreditCard,
  BookOpen,
  Building2,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type GraduationStatus =
  | "Pending Clearance"
  | "Cleared"
  | "Ready"
  | "Graduated"
  | "On Hold";

type ClearanceStatus = "Cleared" | "Pending" | "Issue";

interface GraduationCandidate {
  id: string;
  matricNumber: string;
  name: string;
  email: string;
  programme: string;
  department: string;
  level: string;
  graduationSession: string;

  academicClearance: ClearanceStatus;
  financialClearance: ClearanceStatus;
  libraryClearance: ClearanceStatus;
  hostelClearance: ClearanceStatus;
  departmentClearance: ClearanceStatus;

  status: GraduationStatus;
  ceremony: string;
  updated: string;
}

/*
|--------------------------------------------------------------------------
| TEMPORARY DATA
|--------------------------------------------------------------------------
*/

const candidates: GraduationCandidate[] = [
  {
    id: "1",
    matricNumber: "BTP/CVE/2022/017",
    name: "Samuel Okoro",
    email: "samuel.okoro@example.com",
    programme: "Civil Engineering",
    department: "Engineering",
    level: "400 Level",
    graduationSession: "2025/2026",
    academicClearance: "Cleared",
    financialClearance: "Cleared",
    libraryClearance: "Cleared",
    hostelClearance: "Cleared",
    departmentClearance: "Cleared",
    status: "Ready",
    ceremony: "2026 Convocation",
    updated: "25 Aug 2026",
  },

  {
    id: "2",
    matricNumber: "BTP/CSC/2022/009",
    name: "Daniel Mensah",
    email: "daniel.mensah@example.com",
    programme: "Computer Science",
    department: "Computing & Technology",
    level: "400 Level",
    graduationSession: "2025/2026",
    academicClearance: "Cleared",
    financialClearance: "Pending",
    libraryClearance: "Cleared",
    hostelClearance: "Cleared",
    departmentClearance: "Cleared",
    status: "Pending Clearance",
    ceremony: "2026 Convocation",
    updated: "24 Aug 2026",
  },

  {
    id: "3",
    matricNumber: "BTP/BUS/2022/021",
    name: "Sarah Williams",
    email: "sarah.williams@example.com",
    programme: "Business Administration",
    department: "Business Studies",
    level: "400 Level",
    graduationSession: "2025/2026",
    academicClearance: "Cleared",
    financialClearance: "Cleared",
    libraryClearance: "Pending",
    hostelClearance: "Cleared",
    departmentClearance: "Cleared",
    status: "Pending Clearance",
    ceremony: "2026 Convocation",
    updated: "23 Aug 2026",
  },

  {
    id: "4",
    matricNumber: "BTP/ACC/2021/031",
    name: "Grace Mensima",
    email: "grace.mensima@example.com",
    programme: "Accounting",
    department: "Business Studies",
    level: "400 Level",
    graduationSession: "2024/2025",
    academicClearance: "Cleared",
    financialClearance: "Cleared",
    libraryClearance: "Cleared",
    hostelClearance: "Cleared",
    departmentClearance: "Cleared",
    status: "Graduated",
    ceremony: "2025 Convocation",
    updated: "15 Aug 2026",
  },

  {
    id: "5",
    matricNumber: "BTP/ENG/2022/008",
    name: "Michael Johnson",
    email: "michael.johnson@example.com",
    programme: "Mechanical Engineering",
    department: "Engineering",
    level: "400 Level",
    graduationSession: "2025/2026",
    academicClearance: "Issue",
    financialClearance: "Cleared",
    libraryClearance: "Cleared",
    hostelClearance: "Cleared",
    departmentClearance: "Pending",
    status: "On Hold",
    ceremony: "2026 Convocation",
    updated: "20 Aug 2026",
  },

  {
    id: "6",
    matricNumber: "BTP/INF/2022/045",
    name: "Esther Adams",
    email: "esther.adams@example.com",
    programme: "Information Technology",
    department: "Computing & Technology",
    level: "400 Level",
    graduationSession: "2025/2026",
    academicClearance: "Cleared",
    financialClearance: "Cleared",
    libraryClearance: "Cleared",
    hostelClearance: "Cleared",
    departmentClearance: "Cleared",
    status: "Cleared",
    ceremony: "2026 Convocation",
    updated: "19 Aug 2026",
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
  status: GraduationStatus;
}) {
  const styles: Record<GraduationStatus, string> = {
    "Pending Clearance":
      "bg-amber-50 text-amber-700 border-amber-200",

    Cleared:
      "bg-emerald-50 text-emerald-700 border-emerald-200",

    Ready:
      "bg-blue-50 text-blue-700 border-blue-200",

    Graduated:
      "bg-purple-50 text-purple-700 border-purple-200",

    "On Hold":
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
| CLEARANCE BADGE
|--------------------------------------------------------------------------
*/

function ClearanceBadge({
  status,
}: {
  status: ClearanceStatus;
}) {
  if (status === "Cleared") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600">
        <CheckCircle2 className="h-3.5 w-3.5" />
        Cleared
      </span>
    );
  }

  if (status === "Pending") {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-amber-600">
        <Clock3 className="h-3.5 w-3.5" />
        Pending
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600">
      <AlertCircle className="h-3.5 w-3.5" />
      Issue
    </span>
  );
}

/*
|--------------------------------------------------------------------------
| PAGE
|--------------------------------------------------------------------------
*/

export default function Graduation() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sessionFilter, setSessionFilter] = useState("All");

  const [selectedCandidate, setSelectedCandidate] =
    useState<GraduationCandidate | null>(null);

  /*
  |--------------------------------------------------------------------------
  | STATISTICS
  |--------------------------------------------------------------------------
  */

  const totalCandidates = candidates.length;

  const clearedCount = candidates.filter(
    (candidate) =>
      candidate.status === "Cleared" ||
      candidate.status === "Ready"
  ).length;

  const pendingCount = candidates.filter(
    (candidate) => candidate.status === "Pending Clearance"
  ).length;

  const graduatedCount = candidates.filter(
    (candidate) => candidate.status === "Graduated"
  ).length;

  /*
  |--------------------------------------------------------------------------
  | FILTER OPTIONS
  |--------------------------------------------------------------------------
  */

  const sessions = useMemo(() => {
    return Array.from(
      new Set(candidates.map((candidate) => candidate.graduationSession))
    );
  }, []);

  /*
  |--------------------------------------------------------------------------
  | FILTERING
  |--------------------------------------------------------------------------
  */

  const filteredCandidates = useMemo(() => {
    const query = search.trim().toLowerCase();

    return candidates.filter((candidate) => {
      const matchesSearch =
        !query ||
        candidate.name.toLowerCase().includes(query) ||
        candidate.matricNumber.toLowerCase().includes(query) ||
        candidate.email.toLowerCase().includes(query) ||
        candidate.programme.toLowerCase().includes(query) ||
        candidate.department.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        candidate.status === statusFilter;

      const matchesSession =
        sessionFilter === "All" ||
        candidate.graduationSession === sessionFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesSession
      );
    });
  }, [search, statusFilter, sessionFilter]);

  /*
  |--------------------------------------------------------------------------
  | EXPORT
  |--------------------------------------------------------------------------
  */

  const handleExport = () => {
    const headers = [
      "Matric Number",
      "Name",
      "Programme",
      "Department",
      "Graduation Session",
      "Academic Clearance",
      "Financial Clearance",
      "Library Clearance",
      "Hostel Clearance",
      "Department Clearance",
      "Status",
    ];

    const rows = filteredCandidates.map((candidate) => [
      candidate.matricNumber,
      candidate.name,
      candidate.programme,
      candidate.department,
      candidate.graduationSession,
      candidate.academicClearance,
      candidate.financialClearance,
      candidate.libraryClearance,
      candidate.hostelClearance,
      candidate.departmentClearance,
      candidate.status,
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((value) =>
            `"${String(value).replace(/"/g, '""')}"`
          )
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "graduation-candidates.csv";

    link.click();

    URL.revokeObjectURL(url);
  };

  /*
  |--------------------------------------------------------------------------
  | CLEARANCE COUNT
  |--------------------------------------------------------------------------
  */

  const clearanceItems = selectedCandidate
    ? [
        {
          label: "Academic Clearance",
          icon: BookOpen,
          status: selectedCandidate.academicClearance,
        },
        {
          label: "Financial Clearance",
          icon: CreditCard,
          status: selectedCandidate.financialClearance,
        },
        {
          label: "Library Clearance",
          icon: FileCheck2,
          status: selectedCandidate.libraryClearance,
        },
        {
          label: "Hostel Clearance",
          icon: Building2,
          status: selectedCandidate.hostelClearance,
        },
        {
          label: "Department Clearance",
          icon: GraduationCap,
          status: selectedCandidate.departmentClearance,
        },
      ]
    : [];

  return (
    <div className="min-h-full space-y-6 bg-slate-50 p-4 md:p-6">

      {/* ============================================================
          HEADER
      ============================================================ */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#081022] text-white">
            <GraduationCap className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-[#081022] md:text-2xl">
              Graduation Management
            </h1>

            <p className="mt-1 text-xs text-slate-500">
              Manage graduation candidates, clearance, eligibility and ceremony readiness.
            </p>
          </div>

        </div>

        <Button
          variant="outline"
          onClick={handleExport}
          className="gap-2 border-slate-300 bg-white"
        >
          <Download className="h-4 w-4" />
          Export Candidates
        </Button>

      </div>

      {/* ============================================================
          STATISTICS
      ============================================================ */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-5">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-medium text-slate-500">
                  Graduation Candidates
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {totalCandidates}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Students being processed
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <Users className="h-5 w-5" />
              </div>

            </div>

          </CardContent>
        </Card>

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-5">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-medium text-slate-500">
                  Cleared / Ready
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {clearedCount}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Ready for graduation processing
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <UserCheck className="h-5 w-5" />
              </div>

            </div>

          </CardContent>
        </Card>

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-5">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-medium text-slate-500">
                  Pending Clearance
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {pendingCount}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Require action before approval
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <Clock3 className="h-5 w-5" />
              </div>

            </div>

          </CardContent>
        </Card>

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-5">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-medium text-slate-500">
                  Graduated
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {graduatedCount}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Successfully completed
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
                <GraduationCap className="h-5 w-5" />
              </div>

            </div>

          </CardContent>
        </Card>

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
                placeholder="Search candidate, matric number, programme..."
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
                <option value="All">All Status</option>
                <option value="Pending Clearance">
                  Pending Clearance
                </option>
                <option value="Cleared">Cleared</option>
                <option value="Ready">Ready</option>
                <option value="Graduated">Graduated</option>
                <option value="On Hold">On Hold</option>
              </select>

            </div>

            <select
              value={sessionFilter}
              onChange={(event) =>
                setSessionFilter(event.target.value)
              }
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#006dcc]"
            >
              <option value="All">
                All Graduation Sessions
              </option>

              {sessions.map((session) => (
                <option key={session} value={session}>
                  {session}
                </option>
              ))}

            </select>

          </div>

        </CardContent>

      </Card>

      {/* ============================================================
          CANDIDATES TABLE
      ============================================================ */}

      <Card className="overflow-hidden border-none bg-white shadow-sm ring-1 ring-slate-200">

        <div className="border-b border-slate-200 px-5 py-4">

          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h2 className="text-sm font-bold text-[#081022]">
                Graduation Candidates
              </h2>

              <p className="text-xs text-slate-500">
                Review candidate eligibility and clearance status.
              </p>
            </div>

            {(search ||
              statusFilter !== "All" ||
              sessionFilter !== "All") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("All");
                  setSessionFilter("All");
                }}
                className="flex items-center gap-1 text-xs font-semibold text-[#006dcc] hover:underline"
              >
                <X className="h-3 w-3" />
                Clear filters
              </button>
            )}

          </div>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1100px]">

            <thead className="bg-slate-50">

              <tr className="border-b border-slate-200">

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Candidate
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Programme
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Session
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Clearance
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

              {filteredCandidates.length === 0 ? (

                <tr>

                  <td
                    colSpan={6}
                    className="px-5 py-16 text-center"
                  >

                    <GraduationCap className="mx-auto h-8 w-8 text-slate-300" />

                    <p className="mt-3 text-sm font-semibold text-slate-500">
                      No graduation candidates found
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Try changing your search or filters.
                    </p>

                  </td>

                </tr>

              ) : (

                filteredCandidates.map((candidate) => {

                  const clearanceStatuses = [
                    candidate.academicClearance,
                    candidate.financialClearance,
                    candidate.libraryClearance,
                    candidate.hostelClearance,
                    candidate.departmentClearance,
                  ];

                  const cleared = clearanceStatuses.filter(
                    (status) => status === "Cleared"
                  ).length;

                  return (
                    <tr
                      key={candidate.id}
                      className="transition hover:bg-slate-50"
                    >

                      {/* Candidate */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#081022] text-sm font-bold text-white">
                            {candidate.name
                              .split(" ")
                              .map((name) => name[0])
                              .slice(0, 2)
                              .join("")}
                          </div>

                          <div className="min-w-0">

                            <p className="truncate text-sm font-bold text-[#081022]">
                              {candidate.name}
                            </p>

                            <p className="truncate text-xs text-slate-500">
                              {candidate.matricNumber}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* Programme */}

                      <td className="px-5 py-4">

                        <p className="text-xs font-semibold text-slate-700">
                          {candidate.programme}
                        </p>

                        <p className="mt-1 text-[11px] text-slate-400">
                          {candidate.department}
                        </p>

                      </td>

                      {/* Session */}

                      <td className="px-5 py-4">

                        <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                          {candidate.graduationSession}
                        </span>

                      </td>

                      {/* Clearance */}

                      <td className="px-5 py-4">

                        <div>

                          <div className="mb-2 flex items-center justify-between gap-3">

                            <span className="text-[11px] font-semibold text-slate-600">
                              {cleared}/5 cleared
                            </span>

                          </div>

                          <div className="h-1.5 w-28 overflow-hidden rounded-full bg-slate-100">

                            <div
                              className="h-full rounded-full bg-emerald-500"
                              style={{
                                width: `${(cleared / 5) * 100}%`,
                              }}
                            />

                          </div>

                        </div>

                      </td>

                      {/* Status */}

                      <td className="px-5 py-4">

                        <StatusBadge
                          status={candidate.status}
                        />

                      </td>

                      {/* Action */}

                      <td className="px-5 py-4">

                        <div className="flex justify-end gap-2">

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              setSelectedCandidate(candidate)
                            }
                            className="h-8 gap-1.5 border-slate-200 text-xs"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            Review
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
                  );
                })

              )}

            </tbody>

          </table>

        </div>

        {/* Pagination */}

        <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3">

          <p className="text-xs text-slate-500">
            Showing{" "}
            <strong className="text-slate-700">
              {filteredCandidates.length}
            </strong>{" "}
            of{" "}
            <strong className="text-slate-700">
              {totalCandidates}
            </strong>{" "}
            candidates
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
          CANDIDATE REVIEW MODAL
      ============================================================ */}

      {selectedCandidate && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

            {/* Header */}

            <div className="flex items-start justify-between bg-[#081022] p-6 text-white">

              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-lg font-bold">
                  {selectedCandidate.name
                    .split(" ")
                    .map((name) => name[0])
                    .slice(0, 2)
                    .join("")}
                </div>

                <div>

                  <p className="text-lg font-bold">
                    {selectedCandidate.name}
                  </p>

                  <p className="mt-1 text-xs text-slate-300">
                    {selectedCandidate.matricNumber}
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedCandidate(null)
                }
                className="rounded-lg p-2 text-slate-300 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

            </div>

            {/* Content */}

            <div className="space-y-6 p-6">

              {/* Candidate information */}

              <div>

                <div className="mb-3 flex items-center justify-between">

                  <div>
                    <h3 className="text-sm font-bold text-[#081022]">
                      Candidate Information
                    </h3>

                    <p className="text-xs text-slate-500">
                      Academic and graduation details.
                    </p>
                  </div>

                  <StatusBadge
                    status={selectedCandidate.status}
                  />

                </div>

                <div className="grid gap-4 sm:grid-cols-2">

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Programme
                    </p>

                    <p className="mt-2 text-sm font-bold text-[#081022]">
                      {selectedCandidate.programme}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Department
                    </p>

                    <p className="mt-2 text-sm font-bold text-[#081022]">
                      {selectedCandidate.department}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Level
                    </p>

                    <p className="mt-2 text-sm font-bold text-[#081022]">
                      {selectedCandidate.level}
                    </p>
                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Graduation Session
                    </p>

                    <p className="mt-2 text-sm font-bold text-[#081022]">
                      {selectedCandidate.graduationSession}
                    </p>
                  </div>

                </div>

              </div>

              {/* Clearance */}

              <div>

                <div className="mb-3">

                  <h3 className="text-sm font-bold text-[#081022]">
                    Graduation Clearance
                  </h3>

                  <p className="text-xs text-slate-500">
                    Every clearance area must be resolved before final approval.
                  </p>

                </div>

                <div className="grid gap-3 sm:grid-cols-2">

                  {clearanceItems.map((item) => {

                    const Icon = item.icon;

                    return (
                      <div
                        key={item.label}
                        className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4"
                      >

                        <div className="flex items-center gap-3">

                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                            <Icon className="h-4 w-4" />
                          </div>

                          <span className="text-xs font-semibold text-slate-700">
                            {item.label}
                          </span>

                        </div>

                        <ClearanceBadge
                          status={item.status}
                        />

                      </div>
                    );
                  })}

                </div>

              </div>

              {/* Warning */}

              {selectedCandidate.status !== "Ready" &&
                selectedCandidate.status !== "Graduated" && (

                <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">

                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />

                  <div>

                    <p className="text-xs font-bold text-amber-800">
                      Graduation approval not yet complete
                    </p>

                    <p className="mt-1 text-xs leading-5 text-amber-700">
                      Resolve all outstanding clearance issues before marking this candidate as ready for graduation.
                    </p>

                  </div>

                </div>

              )}

            </div>

            {/* Footer */}

            <div className="flex flex-col gap-2 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:justify-end">

              {selectedCandidate.status === "Ready" && (
                <Button
                  className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  Confirm Graduation
                </Button>
              )}

              {selectedCandidate.status === "Pending Clearance" && (
                <Button
                  variant="outline"
                  className="gap-2 border-amber-300 text-amber-700 hover:bg-amber-50"
                >
                  <AlertCircle className="h-4 w-4" />
                  View Outstanding Issues
                </Button>
              )}

              <Button
                variant="outline"
                onClick={() =>
                  setSelectedCandidate(null)
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