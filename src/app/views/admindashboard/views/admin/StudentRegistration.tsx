import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Eye,
  UserPlus,
  GraduationCap,
  Users,
  UserCheck,
  Clock3,
  MoreHorizontal,
  Download,
  X,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  FileText,
  Pencil,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type RegistrationStatus =
  | "Completed"
  | "Pending"
  | "Incomplete"
  | "Not Started";

interface StudentRegistrationRecord {
  id: string;
  applicationNumber: string;
  matricNumber: string;
  name: string;
  email: string;
  phone: string;
  programme: string;
  department: string;
  level: string;
  session: string;
  registrationStatus: RegistrationStatus;
  courseRegistration: "Completed" | "Pending" | "Not Started";
  registeredDate?: string;
  lastUpdated: string;
}

/*
|--------------------------------------------------------------------------
| TEMPORARY DATA
|--------------------------------------------------------------------------
|
| Replace this with your API data when the student registration endpoint
| is connected.
|
*/

const registrationRecords: StudentRegistrationRecord[] = [
  {
    id: "1",
    applicationNumber: "BTP/APP/2026/0012",
    matricNumber: "BTP/CSC/2026/001",
    name: "Daniel Mensah",
    email: "daniel.mensah@example.com",
    phone: "+234 801 234 5678",
    programme: "Computer Science",
    department: "Computing & Technology",
    level: "100 Level",
    session: "2026/2027",
    registrationStatus: "Completed",
    courseRegistration: "Completed",
    registeredDate: "20 Aug 2026",
    lastUpdated: "25 Aug 2026",
  },
  {
    id: "2",
    applicationNumber: "BTP/APP/2026/0018",
    matricNumber: "BTP/BUS/2026/002",
    name: "Sarah Williams",
    email: "sarah.williams@example.com",
    phone: "+234 802 345 6789",
    programme: "Business Administration",
    department: "Business Studies",
    level: "100 Level",
    session: "2026/2027",
    registrationStatus: "Pending",
    courseRegistration: "Not Started",
    lastUpdated: "25 Aug 2026",
  },
  {
    id: "3",
    applicationNumber: "BTP/APP/2026/0021",
    matricNumber: "BTP/ENG/2026/003",
    name: "Michael Johnson",
    email: "michael.johnson@example.com",
    phone: "+234 803 456 7890",
    programme: "Mechanical Engineering",
    department: "Engineering",
    level: "100 Level",
    session: "2026/2027",
    registrationStatus: "Incomplete",
    courseRegistration: "Pending",
    lastUpdated: "24 Aug 2026",
  },
  {
    id: "4",
    applicationNumber: "BTP/APP/2026/0027",
    matricNumber: "BTP/ACC/2026/004",
    name: "Grace Mensima",
    email: "grace.mensima@example.com",
    phone: "+234 804 567 8901",
    programme: "Accounting",
    department: "Business Studies",
    level: "100 Level",
    session: "2026/2027",
    registrationStatus: "Completed",
    courseRegistration: "Completed",
    registeredDate: "18 Aug 2026",
    lastUpdated: "23 Aug 2026",
  },
  {
    id: "5",
    applicationNumber: "BTP/APP/2026/0034",
    matricNumber: "BTP/CVE/2026/005",
    name: "Samuel Okoro",
    email: "samuel.okoro@example.com",
    phone: "+234 805 678 9012",
    programme: "Civil Engineering",
    department: "Engineering",
    level: "100 Level",
    session: "2026/2027",
    registrationStatus: "Not Started",
    courseRegistration: "Not Started",
    lastUpdated: "22 Aug 2026",
  },
  {
    id: "6",
    applicationNumber: "BTP/APP/2026/0040",
    matricNumber: "BTP/INF/2026/006",
    name: "Esther Adams",
    email: "esther.adams@example.com",
    phone: "+234 806 789 0123",
    programme: "Information Technology",
    department: "Computing & Technology",
    level: "100 Level",
    session: "2026/2027",
    registrationStatus: "Completed",
    courseRegistration: "Pending",
    registeredDate: "16 Aug 2026",
    lastUpdated: "21 Aug 2026",
  },
];

/*
|--------------------------------------------------------------------------
| STATUS BADGE
|--------------------------------------------------------------------------
*/

function RegistrationStatusBadge({
  status,
}: {
  status: RegistrationStatus;
}) {
  const styles: Record<RegistrationStatus, string> = {
    Completed:
      "bg-emerald-50 text-emerald-700 border-emerald-200",
    Pending:
      "bg-amber-50 text-amber-700 border-amber-200",
    Incomplete:
      "bg-orange-50 text-orange-700 border-orange-200",
    "Not Started":
      "bg-slate-100 text-slate-600 border-slate-200",
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
| COURSE REGISTRATION BADGE
|--------------------------------------------------------------------------
*/

function CourseRegistrationBadge({
  status,
}: {
  status: StudentRegistrationRecord["courseRegistration"];
}) {
  const styles = {
    Completed:
      "bg-emerald-50 text-emerald-700 border-emerald-200",
    Pending:
      "bg-amber-50 text-amber-700 border-amber-200",
    "Not Started":
      "bg-slate-100 text-slate-600 border-slate-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold ${styles[status]}`}
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

export default function StudentRegistration() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [sessionFilter, setSessionFilter] = useState("All");

  const [selectedStudent, setSelectedStudent] =
    useState<StudentRegistrationRecord | null>(null);

  /*
  |--------------------------------------------------------------------------
  | COUNTS
  |--------------------------------------------------------------------------
  */

  const totalStudents = registrationRecords.length;

  const completedCount = registrationRecords.filter(
    (student) => student.registrationStatus === "Completed"
  ).length;

  const pendingCount = registrationRecords.filter(
    (student) => student.registrationStatus === "Pending"
  ).length;

  const incompleteCount = registrationRecords.filter(
    (student) =>
      student.registrationStatus === "Incomplete" ||
      student.registrationStatus === "Not Started"
  ).length;

  /*
  |--------------------------------------------------------------------------
  | FILTER OPTIONS
  |--------------------------------------------------------------------------
  */

  const departments = useMemo(
    () =>
      Array.from(
        new Set(
          registrationRecords.map(
            (student) => student.department
          )
        )
      ),
    []
  );

  const sessions = useMemo(
    () =>
      Array.from(
        new Set(
          registrationRecords.map(
            (student) => student.session
          )
        )
      ),
    []
  );

  /*
  |--------------------------------------------------------------------------
  | FILTERING
  |--------------------------------------------------------------------------
  */

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return registrationRecords.filter((student) => {
      const matchesSearch =
        !query ||
        student.name.toLowerCase().includes(query) ||
        student.matricNumber.toLowerCase().includes(query) ||
        student.applicationNumber
          .toLowerCase()
          .includes(query) ||
        student.email.toLowerCase().includes(query) ||
        student.programme.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        student.registrationStatus === statusFilter;

      const matchesDepartment =
        departmentFilter === "All" ||
        student.department === departmentFilter;

      const matchesSession =
        sessionFilter === "All" ||
        student.session === sessionFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesDepartment &&
        matchesSession
      );
    });
  }, [
    search,
    statusFilter,
    departmentFilter,
    sessionFilter,
  ]);

  /*
  |--------------------------------------------------------------------------
  | EXPORT
  |--------------------------------------------------------------------------
  */

  const handleExport = () => {
    const headers = [
      "Application Number",
      "Matric Number",
      "Name",
      "Email",
      "Phone",
      "Programme",
      "Department",
      "Level",
      "Session",
      "Registration Status",
      "Course Registration",
    ];

    const rows = filteredStudents.map((student) => [
      student.applicationNumber,
      student.matricNumber,
      student.name,
      student.email,
      student.phone,
      student.programme,
      student.department,
      student.level,
      student.session,
      student.registrationStatus,
      student.courseRegistration,
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
    link.download = "student-registration.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  /*
  |--------------------------------------------------------------------------
  | CLEAR FILTERS
  |--------------------------------------------------------------------------
  */

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setDepartmentFilter("All");
    setSessionFilter("All");
  };

  return (
    <div className="min-h-full space-y-6 bg-slate-50 p-4 md:p-6">

      {/* ============================================================
          HEADER
      ============================================================ */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#081022] text-white">
            <UserPlus className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-xl font-bold text-[#081022] md:text-2xl">
              Student Registration
            </h1>

            <p className="mt-1 text-xs text-slate-500">
              Register approved students and manage their academic
              registration records.
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
            Export
          </Button>

          <Button
            onClick={() =>
              navigate("/admin/students/registration/new")
            }
            className="gap-2 bg-[#006dcc] hover:bg-[#005ca8]"
          >
            <UserPlus className="h-4 w-4" />
            Register Student
          </Button>

        </div>
      </div>

      {/* ============================================================
          INFORMATION BANNER
      ============================================================ */}

      <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">

        <div className="flex gap-3">

          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
            <FileText className="h-4 w-4" />
          </div>

          <div>
            <p className="text-sm font-bold text-blue-900">
              Student registration workflow
            </p>

            <p className="mt-1 max-w-3xl text-xs leading-5 text-blue-700">
              Only students whose admission has been approved should
              proceed to student registration. Once registered, the
              student can continue with course registration and other
              academic activities.
            </p>
          </div>

        </div>

      </div>

      {/* ============================================================
          STATISTICS
      ============================================================ */}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* Total */}

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-5">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-medium text-slate-500">
                  Total Registrations
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {totalStudents}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Students in registration records
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <Users className="h-5 w-5" />
              </div>

            </div>

          </CardContent>
        </Card>

        {/* Completed */}

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-5">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-medium text-slate-500">
                  Completed
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {completedCount}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Registration completed
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <UserCheck className="h-5 w-5" />
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
                  Pending
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {pendingCount}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Awaiting registration
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <Clock3 className="h-5 w-5" />
              </div>

            </div>

          </CardContent>
        </Card>

        {/* Issues */}

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-5">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs font-medium text-slate-500">
                  Incomplete
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {incompleteCount}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Require administrator attention
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-700">
                <AlertCircle className="h-5 w-5" />
              </div>

            </div>

          </CardContent>
        </Card>

      </div>

      {/* ============================================================
          SEARCH AND FILTERS
      ============================================================ */}

      <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

        <CardContent className="p-4">

          <div className="flex flex-col gap-3 xl:flex-row">

            {/* Search */}

            <div className="relative flex-1">

              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search by name, matric number, application number or programme..."
                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-[#006dcc] focus:bg-white focus:ring-2 focus:ring-blue-100"
              />

            </div>

            {/* Filters */}

            <div className="flex flex-col gap-2 sm:flex-row">

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
                    All Registration Status
                  </option>
                  <option value="Completed">
                    Completed
                  </option>
                  <option value="Pending">
                    Pending
                  </option>
                  <option value="Incomplete">
                    Incomplete
                  </option>
                  <option value="Not Started">
                    Not Started
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

              <select
                value={sessionFilter}
                onChange={(event) =>
                  setSessionFilter(event.target.value)
                }
                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#006dcc]"
              >
                <option value="All">
                  All Sessions
                </option>

                {sessions.map((session) => (
                  <option key={session} value={session}>
                    {session}
                  </option>
                ))}
              </select>

            </div>

          </div>

        </CardContent>

      </Card>

      {/* ============================================================
          REGISTRATION TABLE
      ============================================================ */}

      <Card className="overflow-hidden border-none bg-white shadow-sm ring-1 ring-slate-200">

        <div className="border-b border-slate-200 px-5 py-4">

          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

            <div>

              <h2 className="text-sm font-bold text-[#081022]">
                Student Registration Records
              </h2>

              <p className="text-xs text-slate-500">
                {filteredStudents.length} student
                {filteredStudents.length !== 1 ? "s" : ""} displayed
              </p>

            </div>

            {(search ||
              statusFilter !== "All" ||
              departmentFilter !== "All" ||
              sessionFilter !== "All") && (

              <button
                type="button"
                onClick={clearFilters}
                className="flex items-center gap-1 text-xs font-semibold text-[#006dcc] hover:underline"
              >
                <X className="h-3 w-3" />
                Clear filters
              </button>

            )}

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
                  Matric Number
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Programme
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Level
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Session
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Registration
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Course Reg.
                </th>

                <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Action
                </th>

              </tr>

            </thead>

            <tbody className="divide-y divide-slate-100">

              {filteredStudents.length === 0 ? (

                <tr>

                  <td
                    colSpan={8}
                    className="px-5 py-16 text-center"
                  >

                    <Users className="mx-auto h-8 w-8 text-slate-300" />

                    <p className="mt-3 text-sm font-semibold text-slate-500">
                      No registration records found
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Try changing your search or filters.
                    </p>

                  </td>

                </tr>

              ) : (

                filteredStudents.map((student) => (

                  <tr
                    key={student.id}
                    className="transition hover:bg-slate-50"
                  >

                    {/* Student */}

                    <td className="px-5 py-4">

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#081022] text-sm font-bold text-white">
                          {student.name
                            .split(" ")
                            .map((name) => name[0])
                            .slice(0, 2)
                            .join("")}
                        </div>

                        <div className="min-w-0">

                          <p className="truncate text-sm font-bold text-[#081022]">
                            {student.name}
                          </p>

                          <p className="truncate text-xs text-slate-500">
                            {student.email}
                          </p>

                        </div>

                      </div>

                    </td>

                    {/* Matric */}

                    <td className="px-5 py-4">

                      <span className="text-xs font-semibold text-slate-700">
                        {student.matricNumber}
                      </span>

                    </td>

                    {/* Programme */}

                    <td className="px-5 py-4">

                      <div>

                        <p className="text-xs font-semibold text-slate-700">
                          {student.programme}
                        </p>

                        <p className="mt-1 text-[10px] text-slate-400">
                          {student.department}
                        </p>

                      </div>

                    </td>

                    {/* Level */}

                    <td className="px-5 py-4">

                      <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                        {student.level}
                      </span>

                    </td>

                    {/* Session */}

                    <td className="px-5 py-4">

                      <span className="text-xs font-semibold text-slate-600">
                        {student.session}
                      </span>

                    </td>

                    {/* Registration */}

                    <td className="px-5 py-4">

                      <RegistrationStatusBadge
                        status={student.registrationStatus}
                      />

                    </td>

                    {/* Course registration */}

                    <td className="px-5 py-4">

                      <CourseRegistrationBadge
                        status={student.courseRegistration}
                      />

                    </td>

                    {/* Actions */}

                    <td className="px-5 py-4">

                      <div className="flex justify-end gap-2">

                        {student.registrationStatus !==
                          "Completed" && (

                          <Button
                            size="sm"
                            onClick={() =>
                              navigate(
                                `/admin/students/registration/${student.id}`
                              )
                            }
                            className="h-8 gap-1.5 bg-[#006dcc] text-xs hover:bg-[#005ca8]"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Complete
                          </Button>

                        )}

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setSelectedStudent(student)
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
              {filteredStudents.length}
            </strong>{" "}
            of{" "}
            <strong className="text-slate-700">
              {totalStudents}
            </strong>{" "}
            students
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
          STUDENT DETAILS MODAL
      ============================================================ */}

      {selectedStudent && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* Header */}

            <div className="flex items-start justify-between bg-[#081022] p-6 text-white">

              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-lg font-bold">
                  {selectedStudent.name
                    .split(" ")
                    .map((name) => name[0])
                    .slice(0, 2)
                    .join("")}
                </div>

                <div>

                  <p className="text-lg font-bold">
                    {selectedStudent.name}
                  </p>

                  <p className="mt-1 text-xs text-slate-300">
                    {selectedStudent.matricNumber}
                  </p>

                </div>

              </div>

              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="rounded-lg p-2 text-slate-300 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

            </div>

            {/* Content */}

            <div className="space-y-5 p-6">

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <p className="text-xs text-slate-500">
                    Registration Status
                  </p>

                  <div className="mt-2">
                    <RegistrationStatusBadge
                      status={
                        selectedStudent.registrationStatus
                      }
                    />
                  </div>

                </div>

                {selectedStudent.registrationStatus !==
                  "Completed" && (

                  <Button
                    onClick={() => {
                      setSelectedStudent(null);

                      navigate(
                        `/admin/students/registration/${selectedStudent.id}`
                      );
                    }}
                    className="gap-2 bg-[#006dcc] hover:bg-[#005ca8]"
                  >
                    <Pencil className="h-4 w-4" />
                    Complete Registration
                  </Button>

                )}

              </div>

              {/* Academic information */}

              <div>

                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Academic Information
                </p>

                <div className="grid gap-4 sm:grid-cols-2">

                  <div className="rounded-xl bg-slate-50 p-4">

                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Programme
                    </p>

                    <p className="mt-2 text-sm font-bold text-[#081022]">
                      {selectedStudent.programme}
                    </p>

                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">

                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Department
                    </p>

                    <p className="mt-2 text-sm font-bold text-[#081022]">
                      {selectedStudent.department}
                    </p>

                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">

                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Level
                    </p>

                    <p className="mt-2 text-sm font-bold text-[#081022]">
                      {selectedStudent.level}
                    </p>

                  </div>

                  <div className="rounded-xl bg-slate-50 p-4">

                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Academic Session
                    </p>

                    <p className="mt-2 text-sm font-bold text-[#081022]">
                      {selectedStudent.session}
                    </p>

                  </div>

                </div>

              </div>

              {/* Registration progress */}

              <div>

                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Registration Progress
                </p>

                <div className="space-y-3">

                  <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3">

                    <div className="flex items-center gap-3">

                      <CheckCircle2
                        className={`h-4 w-4 ${
                          selectedStudent.registrationStatus ===
                          "Completed"
                            ? "text-emerald-600"
                            : "text-slate-300"
                        }`}
                      />

                      <span className="text-sm font-medium text-slate-700">
                        Student Registration
                      </span>

                    </div>

                    <RegistrationStatusBadge
                      status={
                        selectedStudent.registrationStatus
                      }
                    />

                  </div>

                  <div className="flex items-center justify-between rounded-lg border border-slate-200 p-3">

                    <div className="flex items-center gap-3">

                      <BookOpen className="h-4 w-4 text-slate-400" />

                      <span className="text-sm font-medium text-slate-700">
                        Course Registration
                      </span>

                    </div>

                    <CourseRegistrationBadge
                      status={
                        selectedStudent.courseRegistration
                      }
                    />

                  </div>

                </div>

              </div>

              {/* Contact */}

              <div className="border-t border-slate-200 pt-5">

                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Contact Information
                </p>

                <div className="grid gap-3 sm:grid-cols-2">

                  <div>
                    <p className="text-[10px] text-slate-400">
                      Email
                    </p>

                    <p className="mt-1 text-sm text-slate-600">
                      {selectedStudent.email}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] text-slate-400">
                      Phone
                    </p>

                    <p className="mt-1 text-sm text-slate-600">
                      {selectedStudent.phone}
                    </p>
                  </div>

                </div>

              </div>

            </div>

            {/* Footer */}

            <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-6 py-4">

              <Button
                variant="outline"
                onClick={() => setSelectedStudent(null)}
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