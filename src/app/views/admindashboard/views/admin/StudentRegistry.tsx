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
  UserX,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Download,
  Mail,
  Phone,
  X,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type StudentStatus =
  | "Active"
  | "Pending"
  | "Suspended"
  | "Graduated"
  | "Inactive";

interface Student {
  id: string;
  matricNumber: string;
  name: string;
  email: string;
  phone: string;
  programme: string;
  department: string;
  level: string;
  status: StudentStatus;
  admissionYear: string;
  lastUpdated: string;
}

/*
|--------------------------------------------------------------------------
| TEMPORARY DATA
|--------------------------------------------------------------------------
|
| Replace this with your API data when the student endpoint is connected.
|
*/

const students: Student[] = [
  {
    id: "1",
    matricNumber: "BTP/CSC/2024/001",
    name: "Daniel Mensah",
    email: "daniel.mensah@example.com",
    phone: "+234 801 234 5678",
    programme: "Computer Science",
    department: "Computing & Technology",
    level: "200 Level",
    status: "Active",
    admissionYear: "2024",
    lastUpdated: "25 Aug 2026",
  },
  {
    id: "2",
    matricNumber: "BTP/BUS/2024/014",
    name: "Sarah Williams",
    email: "sarah.williams@example.com",
    phone: "+234 802 345 6789",
    programme: "Business Administration",
    department: "Business Studies",
    level: "200 Level",
    status: "Active",
    admissionYear: "2024",
    lastUpdated: "24 Aug 2026",
  },
  {
    id: "3",
    matricNumber: "BTP/ENG/2025/008",
    name: "Michael Johnson",
    email: "michael.johnson@example.com",
    phone: "+234 803 456 7890",
    programme: "Mechanical Engineering",
    department: "Engineering",
    level: "100 Level",
    status: "Pending",
    admissionYear: "2025",
    lastUpdated: "23 Aug 2026",
  },
  {
    id: "4",
    matricNumber: "BTP/ACC/2023/031",
    name: "Grace Mensima",
    email: "grace.mensima@example.com",
    phone: "+234 804 567 8901",
    programme: "Accounting",
    department: "Business Studies",
    level: "300 Level",
    status: "Active",
    admissionYear: "2023",
    lastUpdated: "22 Aug 2026",
  },
  {
    id: "5",
    matricNumber: "BTP/CVE/2022/017",
    name: "Samuel Okoro",
    email: "samuel.okoro@example.com",
    phone: "+234 805 678 9012",
    programme: "Civil Engineering",
    department: "Engineering",
    level: "400 Level",
    status: "Graduated",
    admissionYear: "2022",
    lastUpdated: "20 Aug 2026",
  },
  {
    id: "6",
    matricNumber: "BTP/INF/2024/045",
    name: "Esther Adams",
    email: "esther.adams@example.com",
    phone: "+234 806 789 0123",
    programme: "Information Technology",
    department: "Computing & Technology",
    level: "200 Level",
    status: "Suspended",
    admissionYear: "2024",
    lastUpdated: "19 Aug 2026",
  },
];

/*
|--------------------------------------------------------------------------
| STATUS BADGE
|--------------------------------------------------------------------------
*/

function StatusBadge({ status }: { status: StudentStatus }) {
  const styles: Record<StudentStatus, string> = {
    Active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
    Suspended: "bg-red-50 text-red-700 border-red-200",
    Graduated: "bg-blue-50 text-blue-700 border-blue-200",
    Inactive: "bg-slate-100 text-slate-600 border-slate-200",
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
| PAGE
|--------------------------------------------------------------------------
*/

export default function StudentRegistry() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [selectedStudent, setSelectedStudent] =
    useState<Student | null>(null);

  /*
  |--------------------------------------------------------------------------
  | COUNTS
  |--------------------------------------------------------------------------
  */

  const studentCount = students.length;

  const activeCount = students.filter(
    (student) => student.status === "Active"
  ).length;

  const pendingCount = students.filter(
    (student) => student.status === "Pending"
  ).length;

  const graduatedCount = students.filter(
    (student) => student.status === "Graduated"
  ).length;

  /*
  |--------------------------------------------------------------------------
  | FILTERING
  |--------------------------------------------------------------------------
  */

  const departments = useMemo(() => {
    return Array.from(
      new Set(students.map((student) => student.department))
    );
  }, []);

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return students.filter((student) => {
      const matchesSearch =
        !query ||
        student.name.toLowerCase().includes(query) ||
        student.matricNumber.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query) ||
        student.programme.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "All" ||
        student.status === statusFilter;

      const matchesDepartment =
        departmentFilter === "All" ||
        student.department === departmentFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesDepartment
      );
    });
  }, [search, statusFilter, departmentFilter]);

  /*
  |--------------------------------------------------------------------------
  | EXPORT
  |--------------------------------------------------------------------------
  */

  const handleExport = () => {
    const headers = [
      "Matric Number",
      "Name",
      "Email",
      "Phone",
      "Programme",
      "Department",
      "Level",
      "Status",
      "Admission Year",
    ];

    const rows = filteredStudents.map((student) => [
      student.matricNumber,
      student.name,
      student.email,
      student.phone,
      student.programme,
      student.department,
      student.level,
      student.status,
      student.admissionYear,
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "student-registry.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-full space-y-6 bg-slate-50 p-4 md:p-6">

      {/* ============================================================
          HEADER
      ============================================================ */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#081022] text-white">
              <GraduationCap className="h-5 w-5" />
            </div>

            <div>
              <h1 className="text-xl font-bold text-[#081022] md:text-2xl">
                Student Registry
              </h1>

              <p className="mt-1 text-xs text-slate-500">
                View and manage all registered students in the institution.
              </p>
            </div>
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
              navigate("/admin/students/registration")
            }
            className="gap-2 bg-[#006dcc] hover:bg-[#005ca8]"
          >
            <UserPlus className="h-4 w-4" />
            Register Student
          </Button>

        </div>
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
                  Total Students
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {studentCount}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  All registered students
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
                  Active Students
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {activeCount}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Currently enrolled
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
                  Pending
                </p>

                <p className="mt-2 text-3xl font-black text-[#081022]">
                  {pendingCount}
                </p>

                <p className="mt-1 text-[11px] text-slate-400">
                  Awaiting activation
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <UserPlus className="h-5 w-5" />
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
                  Completed their programme
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

            {/* Search */}

            <div className="relative flex-1">

              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search by name, matric number, email or programme..."
                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-[#006dcc] focus:bg-white focus:ring-2 focus:ring-blue-100"
              />

            </div>

            {/* Status */}

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
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Suspended">Suspended</option>
                <option value="Graduated">Graduated</option>
                <option value="Inactive">Inactive</option>
              </select>

            </div>

            {/* Department */}

            <select
              value={departmentFilter}
              onChange={(event) =>
                setDepartmentFilter(event.target.value)
              }
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#006dcc]"
            >
              <option value="All">All Departments</option>

              {departments.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>

          </div>

        </CardContent>

      </Card>

      {/* ============================================================
          STUDENT TABLE
      ============================================================ */}

      <Card className="overflow-hidden border-none bg-white shadow-sm ring-1 ring-slate-200">

        <div className="border-b border-slate-200 px-5 py-4">

          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h2 className="text-sm font-bold text-[#081022]">
                Registered Students
              </h2>

              <p className="text-xs text-slate-500">
                {filteredStudents.length} student
                {filteredStudents.length !== 1 ? "s" : ""} displayed
              </p>
            </div>

            {(search ||
              statusFilter !== "All" ||
              departmentFilter !== "All") && (
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("All");
                  setDepartmentFilter("All");
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

          <table className="w-full min-w-[1050px]">

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
                  Department
                </th>

                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Level
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

              {filteredStudents.length === 0 ? (

                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-16 text-center"
                  >
                    <Users className="mx-auto h-8 w-8 text-slate-300" />

                    <p className="mt-3 text-sm font-semibold text-slate-500">
                      No students found
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

                      <p className="text-xs font-semibold text-slate-700">
                        {student.programme}
                      </p>

                    </td>

                    {/* Department */}

                    <td className="px-5 py-4">

                      <p className="max-w-[180px] text-xs text-slate-600">
                        {student.department}
                      </p>

                    </td>

                    {/* Level */}

                    <td className="px-5 py-4">

                      <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                        {student.level}
                      </span>

                    </td>

                    {/* Status */}

                    <td className="px-5 py-4">

                      <StatusBadge status={student.status} />

                    </td>

                    {/* Action */}

                    <td className="px-5 py-4">

                      <div className="flex justify-end gap-2">

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
              {studentCount}
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

          <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">

            {/* Modal Header */}

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

            {/* Modal Content */}

            <div className="space-y-5 p-6">

              <div className="flex items-center justify-between">

                <div>
                  <p className="text-xs text-slate-500">
                    Student Status
                  </p>

                  <div className="mt-2">
                    <StatusBadge
                      status={selectedStudent.status}
                    />
                  </div>
                </div>

                <Button
                  onClick={() => {
                    setSelectedStudent(null);

                    navigate(
                      `/admin/students/registry/${selectedStudent.id}`
                    );
                  }}
                  className="gap-2 bg-[#006dcc] hover:bg-[#005ca8]"
                >
                  <Eye className="h-4 w-4" />
                  Open Full Profile
                </Button>

              </div>

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
                    Admission Year
                  </p>

                  <p className="mt-2 text-sm font-bold text-[#081022]">
                    {selectedStudent.admissionYear}
                  </p>
                </div>

              </div>

              <div className="border-t border-slate-200 pt-5">

                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">
                  Contact Information
                </p>

                <div className="space-y-3">

                  <div className="flex items-center gap-3">

                    <Mail className="h-4 w-4 text-slate-400" />

                    <span className="text-sm text-slate-600">
                      {selectedStudent.email}
                    </span>

                  </div>

                  <div className="flex items-center gap-3">

                    <Phone className="h-4 w-4 text-slate-400" />

                    <span className="text-sm text-slate-600">
                      {selectedStudent.phone}
                    </span>

                  </div>

                </div>

              </div>

            </div>

            {/* Modal Footer */}

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