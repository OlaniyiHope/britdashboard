import { useMemo, useState } from "react";
import {
  Search,
  Filter,
  Printer,
  Download,
  Eye,
  FileText,
  Users,
  BookOpen,
  CheckCircle2,
  Clock3,
  X,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type RegistrationStatus =
  | "Registered"
  | "Pending"
  | "Incomplete";

interface CourseRegistration {
  id: string;
  matricNumber: string;
  studentName: string;
  programme: string;
  department: string;
  level: string;
  session: string;
  semester: string;
  courses: number;
  creditUnits: number;
  status: RegistrationStatus;
  registeredDate: string;
}

const registrations: CourseRegistration[] = [
  {
    id: "1",
    matricNumber: "BTP/CSC/2024/001",
    studentName: "Daniel Mensah",
    programme: "Computer Science",
    department: "Computing & Technology",
    level: "200 Level",
    session: "2025/2026",
    semester: "First Semester",
    courses: 8,
    creditUnits: 21,
    status: "Registered",
    registeredDate: "25 Aug 2026",
  },
  {
    id: "2",
    matricNumber: "BTP/BUS/2024/014",
    studentName: "Sarah Williams",
    programme: "Business Administration",
    department: "Business Studies",
    level: "200 Level",
    session: "2025/2026",
    semester: "First Semester",
    courses: 7,
    creditUnits: 19,
    status: "Registered",
    registeredDate: "24 Aug 2026",
  },
  {
    id: "3",
    matricNumber: "BTP/ENG/2025/008",
    studentName: "Michael Johnson",
    programme: "Mechanical Engineering",
    department: "Engineering",
    level: "100 Level",
    session: "2025/2026",
    semester: "First Semester",
    courses: 9,
    creditUnits: 24,
    status: "Pending",
    registeredDate: "23 Aug 2026",
  },
  {
    id: "4",
    matricNumber: "BTP/ACC/2023/031",
    studentName: "Grace Mensima",
    programme: "Accounting",
    department: "Business Studies",
    level: "300 Level",
    session: "2025/2026",
    semester: "First Semester",
    courses: 8,
    creditUnits: 20,
    status: "Registered",
    registeredDate: "22 Aug 2026",
  },
  {
    id: "5",
    matricNumber: "BTP/CVE/2022/017",
    studentName: "Samuel Okoro",
    programme: "Civil Engineering",
    department: "Engineering",
    level: "400 Level",
    session: "2025/2026",
    semester: "First Semester",
    courses: 6,
    creditUnits: 18,
    status: "Incomplete",
    registeredDate: "20 Aug 2026",
  },
  {
    id: "6",
    matricNumber: "BTP/INF/2024/045",
    studentName: "Esther Adams",
    programme: "Information Technology",
    department: "Computing & Technology",
    level: "200 Level",
    session: "2025/2026",
    semester: "First Semester",
    courses: 8,
    creditUnits: 21,
    status: "Registered",
    registeredDate: "19 Aug 2026",
  },
];

function StatusBadge({
  status,
}: {
  status: RegistrationStatus;
}) {
  const styles: Record<RegistrationStatus, string> = {
    Registered:
      "bg-emerald-50 text-emerald-700 border-emerald-200",
    Pending:
      "bg-amber-50 text-amber-700 border-amber-200",
    Incomplete:
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

export default function CourseRegistrationPrintout() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [levelFilter, setLevelFilter] = useState("All");
  const [selectedRegistration, setSelectedRegistration] =
    useState<CourseRegistration | null>(null);

  const totalRecords = registrations.length;

  const registeredCount = registrations.filter(
    (item) => item.status === "Registered"
  ).length;

  const pendingCount = registrations.filter(
    (item) => item.status === "Pending"
  ).length;

  const incompleteCount = registrations.filter(
    (item) => item.status === "Incomplete"
  ).length;

  const departments = useMemo(
    () =>
      Array.from(
        new Set(registrations.map((item) => item.department))
      ),
    []
  );

  const levels = useMemo(
    () =>
      Array.from(
        new Set(registrations.map((item) => item.level))
      ),
    []
  );

  const filteredRegistrations = useMemo(() => {
    const query = search.trim().toLowerCase();

    return registrations.filter((registration) => {
      const matchesSearch =
        !query ||
        registration.studentName
          .toLowerCase()
          .includes(query) ||
        registration.matricNumber
          .toLowerCase()
          .includes(query) ||
        registration.programme
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        registration.status === statusFilter;

      const matchesDepartment =
        departmentFilter === "All" ||
        registration.department === departmentFilter;

      const matchesLevel =
        levelFilter === "All" ||
        registration.level === levelFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesDepartment &&
        matchesLevel
      );
    });
  }, [
    search,
    statusFilter,
    departmentFilter,
    levelFilter,
  ]);

  const handlePrint = (registration: CourseRegistration) => {
    setSelectedRegistration(registration);

    setTimeout(() => {
      window.print();
    }, 100);
  };

  const handleExport = () => {
    const headers = [
      "Matric Number",
      "Student Name",
      "Programme",
      "Department",
      "Level",
      "Session",
      "Semester",
      "Courses",
      "Credit Units",
      "Status",
      "Registered Date",
    ];

    const rows = filteredRegistrations.map((item) => [
      item.matricNumber,
      item.studentName,
      item.programme,
      item.department,
      item.level,
      item.session,
      item.semester,
      item.courses,
      item.creditUnits,
      item.status,
      item.registeredDate,
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
    link.download = "course-registration-records.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-full space-y-6 bg-slate-50 p-4 md:p-6">

      {/* HEADER */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#081022] text-white">
            <FileText className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-[#081022] md:text-2xl">
              Course Registration Printout
            </h1>

            <p className="mt-1 text-xs text-slate-500">
              View, print and export students' course registration
              records.
            </p>
          </div>

        </div>

        <div className="flex flex-col gap-2 sm:flex-row">

          <Button
            variant="outline"
            onClick={handleExport}
            className="gap-2 border-slate-300 bg-white"
          >
            <Download className="h-4 w-4" />
            Export Records
          </Button>

          <Button
            onClick={() => {
              if (filteredRegistrations.length > 0) {
                window.print();
              }
            }}
            className="gap-2 bg-[#006dcc] hover:bg-[#005ca8]"
          >
            <Printer className="h-4 w-4" />
            Print Records
          </Button>

        </div>

      </div>

      {/* SESSION SELECTOR */}

      <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

        <CardContent className="p-4">

          <div className="grid gap-3 md:grid-cols-3">

            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Academic Session
              </label>

              <select className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#006dcc]">
                <option>2025/2026</option>
                <option>2024/2025</option>
                <option>2023/2024</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Semester
              </label>

              <select className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#006dcc]">
                <option>First Semester</option>
                <option>Second Semester</option>
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Print Format
              </label>

              <select className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#006dcc]">
                <option>Student Registration Slip</option>
                <option>Administrative Summary</option>
              </select>
            </div>

          </div>

        </CardContent>

      </Card>

      {/* STATISTICS */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs text-slate-500">
                  Registration Records
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {totalRecords}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Current records
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
                <p className="text-xs text-slate-500">
                  Registered
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {registeredCount}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Complete registration
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <CheckCircle2 className="h-5 w-5" />
              </div>

            </div>
          </CardContent>
        </Card>

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs text-slate-500">
                  Pending
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {pendingCount}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Awaiting completion
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
                <p className="text-xs text-slate-500">
                  Incomplete
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {incompleteCount}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Requires attention
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-700">
                <BookOpen className="h-5 w-5" />
              </div>

            </div>
          </CardContent>
        </Card>

      </div>

      {/* SEARCH + FILTERS */}

      <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

        <CardContent className="p-4">

          <div className="flex flex-col gap-3 xl:flex-row">

            <div className="relative flex-1">

              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by student name, matric number or programme..."
                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none focus:border-[#006dcc] focus:bg-white focus:ring-2 focus:ring-blue-100"
              />

            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400" />

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(e.target.value)
                }
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none"
              >
                <option value="All">All Status</option>
                <option value="Registered">Registered</option>
                <option value="Pending">Pending</option>
                <option value="Incomplete">Incomplete</option>
              </select>
            </div>

            <select
              value={departmentFilter}
              onChange={(e) =>
                setDepartmentFilter(e.target.value)
              }
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none"
            >
              <option value="All">All Departments</option>

              {departments.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>

            <select
              value={levelFilter}
              onChange={(e) =>
                setLevelFilter(e.target.value)
              }
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none"
            >
              <option value="All">All Levels</option>

              {levels.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>

          </div>

        </CardContent>

      </Card>

      {/* TABLE */}

      <Card className="overflow-hidden border-none bg-white shadow-sm ring-1 ring-slate-200">

        <div className="border-b border-slate-200 px-5 py-4">

          <h2 className="text-sm font-bold text-[#081022]">
            Student Course Registrations
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            {filteredRegistrations.length} registration record
            {filteredRegistrations.length !== 1 ? "s" : ""} displayed
          </p>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1100px]">

            <thead className="bg-slate-50">

              <tr className="border-b border-slate-200">

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Student
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Programme
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Level
                </th>

                <th className="px-5 py-3 text-center text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Courses
                </th>

                <th className="px-5 py-3 text-center text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Units
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Status
                </th>

                <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Actions
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-slate-100">

              {filteredRegistrations.length === 0 ? (

                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-16 text-center"
                  >
                    <FileText className="mx-auto h-8 w-8 text-slate-300" />

                    <p className="mt-3 text-sm font-semibold text-slate-500">
                      No registration records found
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Try changing your search or filters.
                    </p>
                  </td>
                </tr>

              ) : (

                filteredRegistrations.map((registration) => (

                  <tr
                    key={registration.id}
                    className="transition hover:bg-slate-50"
                  >

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#081022] text-xs font-bold text-white">
                          {registration.studentName
                            .split(" ")
                            .map((name) => name[0])
                            .slice(0, 2)
                            .join("")}
                        </div>

                        <div>
                          <p className="text-sm font-bold text-[#081022]">
                            {registration.studentName}
                          </p>

                          <p className="text-xs text-slate-500">
                            {registration.matricNumber}
                          </p>
                        </div>

                      </div>

                    </td>

                    <td className="px-5 py-4">

                      <p className="text-xs font-semibold text-slate-700">
                        {registration.programme}
                      </p>

                      <p className="mt-1 text-[11px] text-slate-400">
                        {registration.department}
                      </p>

                    </td>

                    <td className="px-5 py-4">

                      <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                        {registration.level}
                      </span>

                    </td>

                    <td className="px-5 py-4 text-center">

                      <span className="text-sm font-bold text-[#081022]">
                        {registration.courses}
                      </span>

                    </td>

                    <td className="px-5 py-4 text-center">

                      <span className="text-sm font-bold text-[#081022]">
                        {registration.creditUnits}
                      </span>

                    </td>

                    <td className="px-5 py-4">

                      <StatusBadge
                        status={registration.status}
                      />

                    </td>

                    <td className="px-5 py-4">

                      <div className="flex justify-end gap-2">

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setSelectedRegistration(
                              registration
                            )
                          }
                          className="h-8 gap-1.5 text-xs"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          Preview
                        </Button>

                        <Button
                          size="sm"
                          onClick={() =>
                            handlePrint(registration)
                          }
                          className="h-8 gap-1.5 bg-[#081022] text-xs hover:bg-[#111b32]"
                        >
                          <Printer className="h-3.5 w-3.5" />
                          Print
                        </Button>

                      </div>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </Card>

      {/* PREVIEW MODAL */}

      {selectedRegistration && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

            <div className="flex items-start justify-between bg-[#081022] p-6 text-white">

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-200">
                  British Transatlantic Polytechnic
                </p>

                <h2 className="mt-2 text-xl font-bold">
                  Course Registration Slip
                </h2>

                <p className="mt-1 text-xs text-slate-300">
                  {selectedRegistration.session} •{" "}
                  {selectedRegistration.semester}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedRegistration(null)
                }
                className="rounded-lg p-2 text-slate-300 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

            </div>

            <div className="space-y-6 p-6">

              <div className="grid gap-4 sm:grid-cols-2">

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Student
                  </p>

                  <p className="mt-2 text-sm font-bold text-[#081022]">
                    {selectedRegistration.studentName}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {selectedRegistration.matricNumber}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Programme
                  </p>

                  <p className="mt-2 text-sm font-bold text-[#081022]">
                    {selectedRegistration.programme}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {selectedRegistration.level}
                  </p>
                </div>

              </div>

              <div>

                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#081022]">
                    Registered Courses
                  </h3>

                  <StatusBadge
                    status={selectedRegistration.status}
                  />
                </div>

                <div className="overflow-hidden rounded-xl border border-slate-200">

                  <table className="w-full">

                    <thead className="bg-slate-50">

                      <tr>
                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase text-slate-500">
                          Code
                        </th>

                        <th className="px-4 py-3 text-left text-[10px] font-bold uppercase text-slate-500">
                          Course Title
                        </th>

                        <th className="px-4 py-3 text-center text-[10px] font-bold uppercase text-slate-500">
                          Units
                        </th>
                      </tr>

                    </thead>

                    <tbody className="divide-y divide-slate-100">

                      {[
                        ["CSC201", "Data Structures", 3],
                        ["CSC203", "Computer Architecture", 3],
                        ["CSC205", "Database Systems", 3],
                        ["CSC207", "Operating Systems", 3],
                        ["GST201", "Communication Skills", 2],
                        ["MTH203", "Discrete Mathematics", 3],
                      ].map(([code, title, units]) => (

                        <tr key={String(code)}>

                          <td className="px-4 py-3 text-xs font-bold text-[#081022]">
                            {code}
                          </td>

                          <td className="px-4 py-3 text-xs text-slate-600">
                            {title}
                          </td>

                          <td className="px-4 py-3 text-center text-xs font-bold text-[#081022]">
                            {units}
                          </td>

                        </tr>

                      ))}

                    </tbody>

                  </table>

                </div>

              </div>

              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">

                <div>
                  <p className="text-xs text-slate-500">
                    Total Registered Courses
                  </p>

                  <p className="mt-1 text-lg font-black text-[#081022]">
                    {selectedRegistration.courses}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">
                    Total Credit Units
                  </p>

                  <p className="mt-1 text-lg font-black text-[#081022]">
                    {selectedRegistration.creditUnits}
                  </p>
                </div>

              </div>

            </div>

            <div className="flex justify-end gap-2 border-t border-slate-200 bg-slate-50 px-6 py-4">

              <Button
                variant="outline"
                onClick={() =>
                  setSelectedRegistration(null)
                }
              >
                Close
              </Button>

              <Button
                onClick={() =>
                  handlePrint(selectedRegistration)
                }
                className="gap-2 bg-[#006dcc] hover:bg-[#005ca8]"
              >
                <Printer className="h-4 w-4" />
                Print Registration Slip
              </Button>

            </div>

          </div>

        </div>

      )}

      {/* PRINT ONLY */}

      <div className="hidden print:block">
        {selectedRegistration && (
          <div className="p-10">

            <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold">
                British Transatlantic Polytechnic
              </h1>

              <h2 className="mt-2 text-lg font-bold">
                Course Registration Slip
              </h2>

              <p className="mt-1 text-sm">
                {selectedRegistration.session} —{" "}
                {selectedRegistration.semester}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 border p-4">
              <div>
                <strong>Student:</strong>{" "}
                {selectedRegistration.studentName}
              </div>

              <div>
                <strong>Matric Number:</strong>{" "}
                {selectedRegistration.matricNumber}
              </div>

              <div>
                <strong>Programme:</strong>{" "}
                {selectedRegistration.programme}
              </div>

              <div>
                <strong>Level:</strong>{" "}
                {selectedRegistration.level}
              </div>
            </div>

            <table className="mt-8 w-full border-collapse border">
              <thead>
                <tr>
                  <th className="border p-2 text-left">
                    Course Code
                  </th>

                  <th className="border p-2 text-left">
                    Course Title
                  </th>

                  <th className="border p-2">
                    Units
                  </th>
                </tr>
              </thead>

              <tbody>
                {[
                  ["CSC201", "Data Structures", 3],
                  ["CSC203", "Computer Architecture", 3],
                  ["CSC205", "Database Systems", 3],
                  ["CSC207", "Operating Systems", 3],
                  ["GST201", "Communication Skills", 2],
                  ["MTH203", "Discrete Mathematics", 3],
                ].map(([code, title, units]) => (
                  <tr key={String(code)}>
                    <td className="border p-2">
                      {code}
                    </td>

                    <td className="border p-2">
                      {title}
                    </td>

                    <td className="border p-2 text-center">
                      {units}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          </div>
        )}
      </div>

    </div>
  );
}