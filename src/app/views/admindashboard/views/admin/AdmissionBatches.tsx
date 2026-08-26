import { useMemo, useState } from "react";
import {
  Archive,
  ArrowRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  GraduationCap,
  Layers3,
  Plus,
  Search,
  Users,
  UserPlus,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

type AdmissionBatch = {
  id: string;
  name: string;
  code: string;
  session: string;
  admissionType: string;
  programmes: string[];
  students: number;
  capacity: number;
  status: "Open" | "Full" | "Closed";
  startDate: string;
  endDate: string;
};

const admissionBatches: AdmissionBatch[] = [
  {
    id: "1",
    name: "2026/2027 Regular Admission",
    code: "ADM-26-REG",
    session: "2026/2027",
    admissionType: "Regular",
    programmes: [
      "Computer Science",
      "Business Administration",
      "Mass Communication",
    ],
    students: 284,
    capacity: 400,
    status: "Open",
    startDate: "01 Aug 2026",
    endDate: "30 Sep 2026",
  },
  {
    id: "2",
    name: "2026/2027 Direct Entry",
    code: "ADM-26-DE",
    session: "2026/2027",
    admissionType: "Direct Entry",
    programmes: [
      "Computer Science",
      "Accounting",
    ],
    students: 96,
    capacity: 100,
    status: "Full",
    startDate: "01 Aug 2026",
    endDate: "15 Sep 2026",
  },
  {
    id: "3",
    name: "2025/2026 Regular Admission",
    code: "ADM-25-REG",
    session: "2025/2026",
    admissionType: "Regular",
    programmes: [
      "Computer Science",
      "Business Administration",
    ],
    students: 352,
    capacity: 400,
    status: "Closed",
    startDate: "01 Aug 2025",
    endDate: "30 Sep 2025",
  },
];

export default function AdmissionBatches() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredBatches = useMemo(() => {
    return admissionBatches.filter((batch) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        batch.name.toLowerCase().includes(searchValue) ||
        batch.code.toLowerCase().includes(searchValue) ||
        batch.session.toLowerCase().includes(searchValue) ||
        batch.admissionType.toLowerCase().includes(searchValue) ||
        batch.programmes.some((programme) =>
          programme.toLowerCase().includes(searchValue)
        );

      const matchesStatus =
        statusFilter === "All" ||
        batch.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const totalStudents = admissionBatches.reduce(
    (total, batch) => total + batch.students,
    0
  );

  const openBatches = admissionBatches.filter(
    (batch) => batch.status === "Open"
  ).length;

  const fullBatches = admissionBatches.filter(
    (batch) => batch.status === "Full"
  ).length;

  const closedBatches = admissionBatches.filter(
    (batch) => batch.status === "Closed"
  ).length;

  return (
    <div className="min-h-full space-y-6 bg-slate-50 p-4 md:p-6">

      {/* ============================================================
          HEADER
      ============================================================ */}

      <div className="rounded-2xl bg-[#081022] p-6 text-white shadow-sm">

        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <div className="flex items-center gap-2 text-blue-200">
              <Layers3 className="h-4 w-4" />

              <span className="text-[11px] font-bold uppercase tracking-[0.2em]">
                Admissions
              </span>
            </div>

            <h1 className="mt-2 text-2xl font-bold md:text-3xl">
              Admission Batches
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Organise approved students into admission batches and manage
              their intake, programme allocation, capacity and admission
              status.
            </p>

          </div>

          <Button
            onClick={() => {
              // Connect to your create batch modal/page
            }}
            className="bg-[#006dcc] text-white hover:bg-[#005ca8]"
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Admission Batch
          </Button>

        </div>

      </div>

      {/* ============================================================
          STATISTICS
      ============================================================ */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="flex items-center gap-4 p-5">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <Layers3 className="h-6 w-6" />
            </div>

            <div>
              <p className="text-2xl font-black text-[#081022]">
                {admissionBatches.length}
              </p>

              <p className="text-sm font-semibold text-slate-700">
                Admission Batches
              </p>

              <p className="text-xs text-slate-400">
                All batches
              </p>
            </div>

          </CardContent>
        </Card>

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="flex items-center gap-4 p-5">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <CheckCircle2 className="h-6 w-6" />
            </div>

            <div>
              <p className="text-2xl font-black text-[#081022]">
                {openBatches}
              </p>

              <p className="text-sm font-semibold text-slate-700">
                Open Batches
              </p>

              <p className="text-xs text-slate-400">
                Currently accepting students
              </p>
            </div>

          </CardContent>
        </Card>

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="flex items-center gap-4 p-5">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
              <Users className="h-6 w-6" />
            </div>

            <div>
              <p className="text-2xl font-black text-[#081022]">
                {totalStudents}
              </p>

              <p className="text-sm font-semibold text-slate-700">
                Admitted Students
              </p>

              <p className="text-xs text-slate-400">
                Assigned to batches
              </p>
            </div>

          </CardContent>
        </Card>

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="flex items-center gap-4 p-5">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-700">
              <Archive className="h-6 w-6" />
            </div>

            <div>
              <p className="text-2xl font-black text-[#081022]">
                {closedBatches}
              </p>

              <p className="text-sm font-semibold text-slate-700">
                Closed Batches
              </p>

              <p className="text-xs text-slate-400">
                Previous intakes
              </p>
            </div>

          </CardContent>
        </Card>

      </div>

      {/* ============================================================
          BATCH ASSIGNMENT ALERT
      ============================================================ */}

      <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

        <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">

          <div className="flex items-center gap-4">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
              <UserPlus className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-bold text-[#081022]">
                Students Awaiting Batch Assignment
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Approved students who have not yet been assigned to an
                admission batch.
              </p>
            </div>

          </div>

          <Button
            variant="outline"
            onClick={() =>
              navigate("/admin/admissions/review")
            }
            className="border-slate-300"
          >
            View Approved Students
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>

        </CardContent>

      </Card>

      {/* ============================================================
          BATCHES
      ============================================================ */}

      <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

        <CardHeader className="border-b border-slate-200">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <CardTitle className="text-base font-bold text-[#081022]">
                Admission Intake Batches
              </CardTitle>

              <p className="mt-1 text-xs text-slate-500">
                View and manage students grouped by admission intake.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">

              {/* Search */}

              <div className="relative">

                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search batches..."
                  className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-xs outline-none focus:border-[#006dcc] sm:w-[220px]"
                />

              </div>

              {/* Filter */}

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-9 rounded-lg border border-slate-200 bg-white px-3 text-xs outline-none focus:border-[#006dcc]"
              >
                <option value="All">All Status</option>
                <option value="Open">Open</option>
                <option value="Full">Full</option>
                <option value="Closed">Closed</option>
              </select>

            </div>

          </div>

        </CardHeader>

        <CardContent className="p-0">

          {/* Desktop table */}

          <div className="hidden overflow-x-auto md:block">

            <table className="w-full">

              <thead className="border-b border-slate-200 bg-slate-50">

                <tr>

                  <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Batch
                  </th>

                  <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Session
                  </th>

                  <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Admission Type
                  </th>

                  <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Students
                  </th>

                  <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    Capacity
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

                {filteredBatches.map((batch) => {

                  const percentage = Math.min(
                    (batch.students / batch.capacity) * 100,
                    100
                  );

                  return (
                    <tr
                      key={batch.id}
                      className="transition hover:bg-slate-50"
                    >

                      <td className="px-5 py-4">

                        <div>

                          <p className="text-sm font-bold text-[#081022]">
                            {batch.name}
                          </p>

                          <p className="mt-1 text-[10px] font-semibold text-slate-400">
                            {batch.code}
                          </p>

                        </div>

                      </td>

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2 text-xs text-slate-600">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {batch.session}
                        </div>

                      </td>

                      <td className="px-5 py-4">

                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">
                          {batch.admissionType}
                        </span>

                      </td>

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2">

                          <Users className="h-4 w-4 text-slate-400" />

                          <span className="text-sm font-bold text-[#081022]">
                            {batch.students}
                          </span>

                        </div>

                      </td>

                      <td className="px-5 py-4">

                        <div className="w-[120px]">

                          <div className="mb-1 flex justify-between text-[10px]">
                            <span className="text-slate-400">
                              Capacity
                            </span>

                            <span className="font-bold text-slate-600">
                              {batch.capacity}
                            </span>
                          </div>

                          <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">

                            <div
                              className="h-full rounded-full bg-[#006dcc]"
                              style={{
                                width: `${percentage}%`,
                              }}
                            />

                          </div>

                        </div>

                      </td>

                      <td className="px-5 py-4">

                        {batch.status === "Open" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">
                            <CheckCircle2 className="h-3 w-3" />
                            Open
                          </span>
                        )}

                        {batch.status === "Full" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2.5 py-1 text-[10px] font-bold text-orange-700">
                            <XCircle className="h-3 w-3" />
                            Full
                          </span>
                        )}

                        {batch.status === "Closed" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold text-slate-600">
                            <Archive className="h-3 w-3" />
                            Closed
                          </span>
                        )}

                      </td>

                      <td className="px-5 py-4 text-right">

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            navigate(
                              `/admin/admissions/batches/${batch.id}`
                            )
                          }
                          className="h-8 text-xs"
                        >
                          Manage
                          <ChevronRight className="ml-1 h-3.5 w-3.5" />
                        </Button>

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>

          {/* Mobile cards */}

          <div className="divide-y divide-slate-100 md:hidden">

            {filteredBatches.map((batch) => {

              const percentage = Math.min(
                (batch.students / batch.capacity) * 100,
                100
              );

              return (
                <div
                  key={batch.id}
                  className="space-y-4 p-5"
                >

                  <div className="flex items-start justify-between gap-3">

                    <div>

                      <p className="text-sm font-bold text-[#081022]">
                        {batch.name}
                      </p>

                      <p className="mt-1 text-[10px] text-slate-400">
                        {batch.code}
                      </p>

                    </div>

                    <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600">
                      {batch.status}
                    </span>

                  </div>

                  <div className="grid grid-cols-2 gap-3">

                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-[10px] uppercase text-slate-400">
                        Session
                      </p>

                      <p className="mt-1 text-xs font-bold text-[#081022]">
                        {batch.session}
                      </p>
                    </div>

                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-[10px] uppercase text-slate-400">
                        Type
                      </p>

                      <p className="mt-1 text-xs font-bold text-[#081022]">
                        {batch.admissionType}
                      </p>
                    </div>

                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-[10px] uppercase text-slate-400">
                        Students
                      </p>

                      <p className="mt-1 text-xs font-bold text-[#081022]">
                        {batch.students}
                      </p>
                    </div>

                    <div className="rounded-lg bg-slate-50 p-3">
                      <p className="text-[10px] uppercase text-slate-400">
                        Capacity
                      </p>

                      <p className="mt-1 text-xs font-bold text-[#081022]">
                        {batch.capacity}
                      </p>
                    </div>

                  </div>

                  <div>

                    <div className="mb-1 flex justify-between text-[10px]">
                      <span className="text-slate-400">
                        Batch Capacity
                      </span>

                      <span className="font-bold text-slate-600">
                        {Math.round(percentage)}%
                      </span>
                    </div>

                    <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">

                      <div
                        className="h-full rounded-full bg-[#006dcc]"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />

                    </div>

                  </div>

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() =>
                      navigate(
                        `/admin/admissions/batches/${batch.id}`
                      )
                    }
                  >
                    Manage Batch
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>

                </div>
              );
            })}

          </div>

          {filteredBatches.length === 0 && (
            <div className="px-6 py-14 text-center">

              <Layers3 className="mx-auto h-8 w-8 text-slate-300" />

              <p className="mt-3 text-sm font-semibold text-slate-500">
                No admission batches found
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Try changing your search or status filter.
              </p>

            </div>
          )}

        </CardContent>

      </Card>

    </div>
  );
}