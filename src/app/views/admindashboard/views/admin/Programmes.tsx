import { useMemo, useState } from "react";
import {
  BookCopy,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock3,
  GraduationCap,
  Plus,
  Search,
  Users,
  XCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type ProgrammeStatus = "Active" | "Inactive";

type Programme = {
  id: string;
  code: string;
  name: string;
  department: string;
  qualification: string;
  duration: string;
  students: number;
  status: ProgrammeStatus;
  updated: string;
};

const programmeData: Programme[] = [
  {
    id: "PRG-001",
    code: "BSC-CS",
    name: "Computer Science",
    department: "Computing & Information Technology",
    qualification: "B.Sc.",
    duration: "4 Years",
    students: 248,
    status: "Active",
    updated: "20 Aug 2026",
  },
  {
    id: "PRG-002",
    code: "BSC-IT",
    name: "Information Technology",
    department: "Computing & Information Technology",
    qualification: "B.Sc.",
    duration: "4 Years",
    students: 193,
    status: "Active",
    updated: "19 Aug 2026",
  },
  {
    id: "PRG-003",
    code: "BSC-ACC",
    name: "Accounting",
    department: "Business & Management",
    qualification: "B.Sc.",
    duration: "4 Years",
    students: 176,
    status: "Active",
    updated: "18 Aug 2026",
  },
  {
    id: "PRG-004",
    code: "BSC-BUS",
    name: "Business Administration",
    department: "Business & Management",
    qualification: "B.Sc.",
    duration: "4 Years",
    students: 221,
    status: "Active",
    updated: "18 Aug 2026",
  },
  {
    id: "PRG-005",
    code: "BSC-PAM",
    name: "Public Administration",
    department: "Social & Administrative Sciences",
    qualification: "B.Sc.",
    duration: "4 Years",
    students: 154,
    status: "Active",
    updated: "16 Aug 2026",
  },
  {
    id: "PRG-006",
    code: "ND-COM",
    name: "Computer Engineering",
    department: "Engineering",
    qualification: "ND",
    duration: "2 Years",
    students: 87,
    status: "Inactive",
    updated: "10 Aug 2026",
  },
];

const statusStyles: Record<ProgrammeStatus, string> = {
  Active: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Inactive: "border-slate-200 bg-slate-100 text-slate-600",
};

export default function Programmes() {
  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState<
    "All" | ProgrammeStatus
  >("All");

  const departments = useMemo(() => {
    return Array.from(
      new Set(programmeData.map((programme) => programme.department))
    );
  }, []);

  const filteredProgrammes = useMemo(() => {
    return programmeData.filter((programme) => {
      const searchValue = search.toLowerCase();

      const matchesSearch =
        programme.name.toLowerCase().includes(searchValue) ||
        programme.code.toLowerCase().includes(searchValue) ||
        programme.department.toLowerCase().includes(searchValue);

      const matchesDepartment =
        departmentFilter === "All" ||
        programme.department === departmentFilter;

      const matchesStatus =
        statusFilter === "All" ||
        programme.status === statusFilter;

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesStatus
      );
    });
  }, [search, departmentFilter, statusFilter]);

  const activeProgrammes = programmeData.filter(
    (programme) => programme.status === "Active"
  ).length;

  const inactiveProgrammes = programmeData.filter(
    (programme) => programme.status === "Inactive"
  ).length;

  const totalStudents = programmeData.reduce(
    (total, programme) => total + programme.students,
    0
  );

  return (
    <div className="min-h-full space-y-6 bg-slate-50 p-4 md:p-6">

      {/* ============================================================
          HEADER
      ============================================================ */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">

        <div>

          <div className="flex items-center gap-2 text-[#006dcc]">

            <BookCopy className="h-5 w-5" />

            <span className="text-[11px] font-bold uppercase tracking-[0.18em]">
              Academic Structure
            </span>

          </div>

          <h1 className="mt-2 text-2xl font-bold text-[#081022] md:text-3xl">
            Programmes by Department
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            Manage academic departments, programmes, qualifications,
            programme status, and student enrolment.
          </p>

        </div>

        <Button
          className="bg-[#081022] hover:bg-[#111c32]"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Programme
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
                <p className="text-xs font-semibold text-slate-500">
                  Programmes
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {programmeData.length}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <BookCopy className="h-5 w-5" />
              </div>

            </div>

            <p className="mt-3 text-xs text-slate-400">
              Academic programmes
            </p>

          </CardContent>
        </Card>

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-5">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-semibold text-slate-500">
                  Departments
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {departments.length}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
                <Building2 className="h-5 w-5" />
              </div>

            </div>

            <p className="mt-3 text-xs text-slate-400">
              Academic departments
            </p>

          </CardContent>
        </Card>

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-5">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-semibold text-slate-500">
                  Active Programmes
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {activeProgrammes}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <CheckCircle2 className="h-5 w-5" />
              </div>

            </div>

            <p className="mt-3 text-xs text-slate-400">
              Currently accepting students
            </p>

          </CardContent>
        </Card>

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-5">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-semibold text-slate-500">
                  Students
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {totalStudents.toLocaleString()}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-700">
                <Users className="h-5 w-5" />
              </div>

            </div>

            <p className="mt-3 text-xs text-slate-400">
              Students across programmes
            </p>

          </CardContent>
        </Card>

      </div>

      {/* ============================================================
          DEPARTMENT OVERVIEW
      ============================================================ */}

      <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

        <div className="border-b border-slate-200 p-5">

          <div className="flex items-center gap-2">

            <Building2 className="h-5 w-5 text-[#081022]" />

            <div>

              <h2 className="text-base font-bold text-[#081022]">
                Departments
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Academic programmes grouped by department.
              </p>

            </div>

          </div>

        </div>

        <div className="grid gap-3 p-4 md:grid-cols-2 xl:grid-cols-3">

          {departments.map((department) => {

            const departmentProgrammes = programmeData.filter(
              (programme) =>
                programme.department === department
            );

            const departmentStudents =
              departmentProgrammes.reduce(
                (total, programme) =>
                  total + programme.students,
                0
              );

            return (
              <button
                key={department}
                type="button"
                onClick={() => setDepartmentFilter(department)}
                className="group flex items-center justify-between rounded-xl border border-slate-200 p-4 text-left transition hover:border-[#081022] hover:bg-slate-50"
              >

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-[#081022]">
                    <Building2 className="h-5 w-5" />
                  </div>

                  <div>

                    <p className="text-sm font-bold text-[#081022]">
                      {department}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {departmentProgrammes.length}{" "}
                      {departmentProgrammes.length === 1
                        ? "programme"
                        : "programmes"}{" "}
                      · {departmentStudents} students
                    </p>

                  </div>

                </div>

                <ChevronRight className="h-4 w-4 text-slate-400 transition group-hover:translate-x-1" />

              </button>
            );

          })}

        </div>

      </Card>

      {/* ============================================================
          PROGRAMME LIST
      ============================================================ */}

      <Card className="overflow-hidden border-none bg-white shadow-sm ring-1 ring-slate-200">

        {/* TOOLBAR */}

        <div className="border-b border-slate-200 p-4">

          <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">

            <div>

              <h2 className="text-base font-bold text-[#081022]">
                Academic Programmes
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                View and manage programmes offered by the institution.
              </p>

            </div>

            <div className="flex flex-col gap-2 md:flex-row">

              <div className="relative">

                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

                <Input
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search programmes..."
                  className="w-full pl-9 md:w-[250px]"
                />

              </div>

              <select
                value={departmentFilter}
                onChange={(event) =>
                  setDepartmentFilter(event.target.value)
                }
                className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#006dcc]"
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

              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value as
                      | "All"
                      | ProgrammeStatus
                  )
                }
                className="h-10 rounded-md border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#006dcc]"
              >
                <option value="All">
                  All Status
                </option>

                <option value="Active">
                  Active
                </option>

                <option value="Inactive">
                  Inactive
                </option>

              </select>

            </div>

          </div>

        </div>

        {/* TABLE */}

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1100px]">

            <thead className="bg-slate-50">

              <tr className="border-b border-slate-200 text-left">

                <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Programme
                </th>

                <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Department
                </th>

                <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Qualification
                </th>

                <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Duration
                </th>

                <th className="px-5 py-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  Students
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

              {filteredProgrammes.map((programme) => (

                <tr
                  key={programme.id}
                  className="transition hover:bg-slate-50"
                >

                  {/* PROGRAMME */}

                  <td className="px-5 py-4">

                    <div>

                      <div className="flex items-center gap-2">

                        <p className="font-bold text-[#081022]">
                          {programme.name}
                        </p>

                      </div>

                      <p className="mt-1 text-xs font-medium text-[#006dcc]">
                        {programme.code}
                      </p>

                    </div>

                  </td>

                  {/* DEPARTMENT */}

                  <td className="px-5 py-4">

                    <div className="flex items-center gap-2">

                      <Building2 className="h-4 w-4 text-slate-400" />

                      <span className="max-w-[220px] text-sm text-slate-600">
                        {programme.department}
                      </span>

                    </div>

                  </td>

                  {/* QUALIFICATION */}

                  <td className="px-5 py-4">

                    <div className="flex items-center gap-2">

                      <GraduationCap className="h-4 w-4 text-slate-400" />

                      <span className="text-sm font-medium text-slate-700">
                        {programme.qualification}
                      </span>

                    </div>

                  </td>

                  {/* DURATION */}

                  <td className="px-5 py-4">

                    <div className="flex items-center gap-2 text-sm text-slate-600">

                      <Clock3 className="h-4 w-4 text-slate-400" />

                      {programme.duration}

                    </div>

                  </td>

                  {/* STUDENTS */}

                  <td className="px-5 py-4">

                    <div className="flex items-center gap-2">

                      <Users className="h-4 w-4 text-slate-400" />

                      <span className="font-bold text-[#081022]">
                        {programme.students}
                      </span>

                    </div>

                  </td>

                  {/* STATUS */}

                  <td className="px-5 py-4">

                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${statusStyles[programme.status]}`}
                    >

                      {programme.status === "Active" ? (
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      ) : (
                        <XCircle className="h-3.5 w-3.5" />
                      )}

                      {programme.status}

                    </span>

                  </td>

                  {/* ACTION */}

                  <td className="px-5 py-4">

                    <div className="flex justify-end gap-2">

                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8"
                      >
                        View
                      </Button>

                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8"
                      >
                        Manage
                      </Button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        {/* EMPTY */}

        {filteredProgrammes.length === 0 && (

          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">

            <BookCopy className="h-10 w-10 text-slate-300" />

            <p className="mt-3 text-sm font-bold text-slate-600">
              No programmes found
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Try changing your search or filters.
            </p>

          </div>

        )}

      </Card>

      {/* ============================================================
          FOOTER
      ============================================================ */}

      <div className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-500 shadow-sm sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-2">

          <BookCopy className="h-4 w-4" />

          <span>
            Showing{" "}
            <strong className="text-[#081022]">
              {filteredProgrammes.length}
            </strong>{" "}
            of{" "}
            <strong className="text-[#081022]">
              {programmeData.length}
            </strong>{" "}
            programmes
          </span>

        </div>

        <span>
          Inactive programmes:{" "}
          <strong className="text-[#081022]">
            {inactiveProgrammes}
          </strong>
        </span>

      </div>

    </div>
  );
}