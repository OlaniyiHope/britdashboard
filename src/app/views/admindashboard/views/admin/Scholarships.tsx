import { useMemo, useState } from "react";
import {
  Search,
  Plus,
  Filter,
  GraduationCap,
  Users,
  CheckCircle2,
  Clock3,
  XCircle,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  X,
  CalendarDays,
  Banknote,
  FileText,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type ScholarshipStatus =
  | "Open"
  | "Closed"
  | "Draft"
  | "Awarded";

type ApplicationStatus =
  | "Pending"
  | "Approved"
  | "Rejected"
  | "Under Review";

interface Scholarship {
  id: string;
  name: string;
  provider: string;
  amount: string;
  applicants: number;
  awarded: number;
  deadline: string;
  status: ScholarshipStatus;
  eligibility: string;
  updated: string;
}

const scholarships: Scholarship[] = [
  {
    id: "SCH-001",
    name: "Academic Excellence Scholarship",
    provider: "Institution",
    amount: "₦250,000",
    applicants: 42,
    awarded: 12,
    deadline: "30 Sep 2026",
    status: "Open",
    eligibility: "Students with CGPA of 4.0 and above",
    updated: "25 Aug 2026",
  },
  {
    id: "SCH-002",
    name: "STEM Innovation Scholarship",
    provider: "Technology Foundation",
    amount: "₦500,000",
    applicants: 31,
    awarded: 8,
    deadline: "15 Oct 2026",
    status: "Open",
    eligibility: "Computing, Engineering and Technology students",
    updated: "24 Aug 2026",
  },
  {
    id: "SCH-003",
    name: "Women in Technology Award",
    provider: "Tech Women Initiative",
    amount: "₦300,000",
    applicants: 24,
    awarded: 6,
    deadline: "10 Aug 2026",
    status: "Closed",
    eligibility: "Female students studying technology-related programmes",
    updated: "20 Aug 2026",
  },
  {
    id: "SCH-004",
    name: "First-Year Student Support Grant",
    provider: "Institution",
    amount: "₦150,000",
    applicants: 0,
    awarded: 0,
    deadline: "20 Nov 2026",
    status: "Draft",
    eligibility: "Newly admitted students",
    updated: "18 Aug 2026",
  },
  {
    id: "SCH-005",
    name: "Leadership Development Scholarship",
    provider: "Alumni Association",
    amount: "₦200,000",
    applicants: 18,
    awarded: 5,
    deadline: "31 Jul 2026",
    status: "Awarded",
    eligibility: "Students with demonstrated leadership experience",
    updated: "05 Aug 2026",
  },
];

function StatusBadge({
  status,
}: {
  status: ScholarshipStatus;
}) {
  const styles: Record<ScholarshipStatus, string> = {
    Open: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Closed: "bg-slate-100 text-slate-600 border-slate-200",
    Draft: "bg-amber-50 text-amber-700 border-amber-200",
    Awarded: "bg-blue-50 text-blue-700 border-blue-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-bold ${styles[status]}`}
    >
      {status}
    </span>
  );
}

export default function Scholarships() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedScholarship, setSelectedScholarship] =
    useState<Scholarship | null>(null);

  const [showCreateModal, setShowCreateModal] =
    useState(false);

  const filteredScholarships = useMemo(() => {
    const query = search.trim().toLowerCase();

    return scholarships.filter((scholarship) => {
      const matchesSearch =
        !query ||
        scholarship.name.toLowerCase().includes(query) ||
        scholarship.provider.toLowerCase().includes(query) ||
        scholarship.eligibility.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        scholarship.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const openCount = scholarships.filter(
    (item) => item.status === "Open"
  ).length;

  const applicationCount = scholarships.reduce(
    (total, item) => total + item.applicants,
    0
  );

  const awardedCount = scholarships.reduce(
    (total, item) => total + item.awarded,
    0
  );

  const pendingCount = applicationCount - awardedCount;

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
              Scholarship Opportunities
            </h1>

            <p className="mt-1 text-xs text-slate-500">
              Manage scholarship opportunities, applications and student awards.
            </p>
          </div>

        </div>

        <Button
          onClick={() => setShowCreateModal(true)}
          className="gap-2 bg-[#006dcc] hover:bg-[#005ca8]"
        >
          <Plus className="h-4 w-4" />
          Create Scholarship
        </Button>

      </div>

      {/* ============================================================
          STATISTICS
      ============================================================ */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          label="Opportunities"
          value={scholarships.length}
          hint="All scholarship programmes"
          icon={<GraduationCap className="h-5 w-5" />}
          iconClass="bg-blue-50 text-blue-700"
        />

        <StatCard
          label="Open Opportunities"
          value={openCount}
          hint="Currently accepting applications"
          icon={<CheckCircle2 className="h-5 w-5" />}
          iconClass="bg-emerald-50 text-emerald-700"
        />

        <StatCard
          label="Applications"
          value={applicationCount}
          hint="Applications received"
          icon={<Users className="h-5 w-5" />}
          iconClass="bg-purple-50 text-purple-700"
        />

        <StatCard
          label="Awarded"
          value={awardedCount}
          hint={`${pendingCount} applications still pending`}
          icon={<Banknote className="h-5 w-5" />}
          iconClass="bg-amber-50 text-amber-700"
        />

      </div>

      {/* ============================================================
          SEARCH / FILTER
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
                placeholder="Search scholarship name, provider or eligibility..."
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
                <option value="Open">Open</option>
                <option value="Draft">Draft</option>
                <option value="Closed">Closed</option>
                <option value="Awarded">Awarded</option>
              </select>

            </div>

          </div>

        </CardContent>
      </Card>

      {/* ============================================================
          SCHOLARSHIP TABLE
      ============================================================ */}

      <Card className="overflow-hidden border-none bg-white shadow-sm ring-1 ring-slate-200">

        <div className="border-b border-slate-200 px-5 py-4">

          <div>
            <h2 className="text-sm font-bold text-[#081022]">
              Scholarship Opportunities
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Manage available scholarships and monitor applications.
            </p>
          </div>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1050px]">

            <thead className="bg-slate-50">

              <tr className="border-b border-slate-200">

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Scholarship
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Provider
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Award
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Applications
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Deadline
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

              {filteredScholarships.map((scholarship) => (

                <tr
                  key={scholarship.id}
                  className="transition hover:bg-slate-50"
                >

                  <td className="px-5 py-4">

                    <div className="flex items-center gap-3">

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                        <GraduationCap className="h-5 w-5" />
                      </div>

                      <div className="min-w-0">

                        <p className="text-sm font-bold text-[#081022]">
                          {scholarship.name}
                        </p>

                        <p className="mt-1 max-w-[300px] truncate text-xs text-slate-500">
                          {scholarship.eligibility}
                        </p>

                      </div>

                    </div>

                  </td>

                  <td className="px-5 py-4">

                    <span className="text-xs font-semibold text-slate-700">
                      {scholarship.provider}
                    </span>

                  </td>

                  <td className="px-5 py-4">

                    <span className="inline-flex items-center gap-1 text-xs font-bold text-[#081022]">
                      <Banknote className="h-3.5 w-3.5 text-emerald-600" />
                      {scholarship.amount}
                    </span>

                  </td>

                  <td className="px-5 py-4">

                    <div>
                      <p className="text-xs font-bold text-slate-700">
                        {scholarship.applicants} applicants
                      </p>

                      <p className="mt-1 text-[11px] text-slate-400">
                        {scholarship.awarded} awarded
                      </p>
                    </div>

                  </td>

                  <td className="px-5 py-4">

                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                      {scholarship.deadline}
                    </div>

                  </td>

                  <td className="px-5 py-4">
                    <StatusBadge status={scholarship.status} />
                  </td>

                  <td className="px-5 py-4">

                    <div className="flex justify-end gap-2">

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setSelectedScholarship(scholarship)
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

              ))}

            </tbody>

          </table>

        </div>

        {filteredScholarships.length === 0 && (
          <div className="px-5 py-16 text-center">

            <GraduationCap className="mx-auto h-8 w-8 text-slate-300" />

            <p className="mt-3 text-sm font-semibold text-slate-500">
              No scholarships found
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Try changing your search or filter.
            </p>

          </div>
        )}

      </Card>

      {/* ============================================================
          SCHOLARSHIP DETAILS MODAL
      ============================================================ */}

      {selectedScholarship && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">

            <div className="flex items-start justify-between bg-[#081022] p-6 text-white">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                  <GraduationCap className="h-6 w-6" />
                </div>

                <div>

                  <h2 className="text-lg font-bold">
                    {selectedScholarship.name}
                  </h2>

                  <p className="mt-1 text-xs text-slate-300">
                    {selectedScholarship.provider}
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={() => setSelectedScholarship(null)}
                className="rounded-lg p-2 text-slate-300 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

            </div>

            <div className="space-y-5 p-6">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-xs text-slate-500">
                    Scholarship Status
                  </p>

                  <div className="mt-2">
                    <StatusBadge
                      status={selectedScholarship.status}
                    />
                  </div>
                </div>

                <div className="text-right">

                  <p className="text-xs text-slate-400">
                    Award Amount
                  </p>

                  <p className="mt-1 text-xl font-black text-[#081022]">
                    {selectedScholarship.amount}
                  </p>

                </div>

              </div>

              <div className="grid gap-4 sm:grid-cols-2">

                <DetailBox
                  label="Applications"
                  value={`${selectedScholarship.applicants}`}
                  icon={<Users className="h-4 w-4" />}
                />

                <DetailBox
                  label="Students Awarded"
                  value={`${selectedScholarship.awarded}`}
                  icon={<CheckCircle2 className="h-4 w-4" />}
                />

                <DetailBox
                  label="Application Deadline"
                  value={selectedScholarship.deadline}
                  icon={<CalendarDays className="h-4 w-4" />}
                />

                <DetailBox
                  label="Provider"
                  value={selectedScholarship.provider}
                  icon={<GraduationCap className="h-4 w-4" />}
                />

              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                <div className="flex items-center gap-2">

                  <FileText className="h-4 w-4 text-slate-500" />

                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Eligibility
                  </p>

                </div>

                <p className="mt-2 text-sm text-slate-700">
                  {selectedScholarship.eligibility}
                </p>

              </div>

              <div className="flex gap-3">

                <Button className="flex-1 gap-2 bg-[#006dcc] hover:bg-[#005ca8]">
                  <Users className="h-4 w-4" />
                  View Applications
                </Button>

                <Button
                  variant="outline"
                  className="gap-2"
                >
                  <Pencil className="h-4 w-4" />
                  Edit
                </Button>

              </div>

            </div>

            <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-6 py-4">

              <Button
                variant="outline"
                onClick={() => setSelectedScholarship(null)}
              >
                Close
              </Button>

            </div>

          </div>

        </div>

      )}

      {/* ============================================================
          CREATE SCHOLARSHIP MODAL
      ============================================================ */}

      {showCreateModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">

              <div>

                <h2 className="text-lg font-bold text-[#081022]">
                  Create Scholarship
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Add a new scholarship opportunity for students.
                </p>

              </div>

              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>

            </div>

            <div className="space-y-5 p-6">

              <div className="grid gap-4 sm:grid-cols-2">

                <FormField
                  label="Scholarship Name"
                  placeholder="e.g. Academic Excellence Scholarship"
                />

                <FormField
                  label="Provider"
                  placeholder="e.g. Institution"
                />

                <FormField
                  label="Award Amount"
                  placeholder="e.g. ₦250,000"
                />

                <FormField
                  label="Application Deadline"
                  type="date"
                />

              </div>

              <div>

                <label className="text-xs font-bold text-slate-600">
                  Eligibility Requirements
                </label>

                <textarea
                  rows={4}
                  placeholder="Describe who is eligible to apply..."
                  className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-[#006dcc] focus:ring-2 focus:ring-blue-100"
                />

              </div>

              <div>

                <label className="text-xs font-bold text-slate-600">
                  Status
                </label>

                <select className="mt-2 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#006dcc]">
                  <option>Draft</option>
                  <option>Open</option>
                </select>

              </div>

            </div>

            <div className="flex justify-end gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4">

              <Button
                variant="outline"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </Button>

              <Button className="gap-2 bg-[#006dcc] hover:bg-[#005ca8]">
                <Plus className="h-4 w-4" />
                Create Scholarship
              </Button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

/* ================================================================
   STAT CARD
================================================================ */

function StatCard({
  label,
  value,
  hint,
  icon,
  iconClass,
}: {
  label: string;
  value: number;
  hint: string;
  icon: React.ReactNode;
  iconClass: string;
}) {
  return (
    <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
      <CardContent className="p-5">

        <div className="flex items-center justify-between">

          <div>

            <p className="text-xs font-medium text-slate-500">
              {label}
            </p>

            <p className="mt-2 text-3xl font-black text-[#081022]">
              {value}
            </p>

            <p className="mt-1 text-[11px] text-slate-400">
              {hint}
            </p>

          </div>

          <div
            className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
          >
            {icon}
          </div>

        </div>

      </CardContent>
    </Card>
  );
}

/* ================================================================
   DETAIL BOX
================================================================ */

function DetailBox({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">

      <div className="flex items-center gap-2 text-slate-400">
        {icon}

        <p className="text-[10px] font-bold uppercase tracking-wider">
          {label}
        </p>
      </div>

      <p className="mt-2 text-sm font-bold text-[#081022]">
        {value}
      </p>

    </div>
  );
}

/* ================================================================
   FORM FIELD
================================================================ */

function FormField({
  label,
  placeholder,
  type = "text",
}: {
  label: string;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div>

      <label className="text-xs font-bold text-slate-600">
        {label}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        className="mt-2 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#006dcc] focus:ring-2 focus:ring-blue-100"
      />

    </div>
  );
}