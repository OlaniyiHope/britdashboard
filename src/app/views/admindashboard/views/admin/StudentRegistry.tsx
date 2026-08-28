import { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Eye,
  UserPlus,
  GraduationCap,
  Users,
  UserCheck,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  Download,
  Mail,
  Phone,
  X,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SessionContext } from "@/contexts/SessionContext";
import useFetch from "@/hooks/useFetch";

/* ================================================================
   TYPES

   ⚠️ These field names are BEST-GUESS based on patterns seen in your
   other admin pages (studentName/username/email/phone/address on the
   User model, programme as a ref-or-string). You have not shared a
   student/User model or controller, so verify these against your
   actual schema and trim/rename what doesn't match.
================================================================ */

type StudentStatus =
  | "Active"
  | "Pending"
  | "Suspended"
  | "Graduated"
  | "Inactive";

interface BackendProgramme {
  _id?: string;
  name?: string;
  programmeName?: string;
  title?: string;
  code?: string;
}

interface BackendDepartment {
  _id?: string;
  name?: string;
  title?: string;
}

interface BackendStudent {
  _id: string;
  studentName?: string;
  fullName?: string;
  username?: string;
  email?: string;
  phone?: string | number;
  address?: string;
  matricNumber?: string;
  regNumber?: string;
  registrationNumber?: string;
  programme?: BackendProgramme | string;
  course?: BackendProgramme | string;
  department?: BackendDepartment | string;
  level?: string | number;
  status?: string;
  admissionYear?: string | number;
  createdAt?: string;
  updatedAt?: string;
}

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

/* ================================================================
   HELPERS — adjust field priority order to match your real schema
================================================================ */

const getStudentName = (s: BackendStudent): string =>
  s.studentName || s.fullName || s.username || "Unnamed Student";

const getMatricNumber = (s: BackendStudent): string =>
  s.matricNumber || s.regNumber || s.registrationNumber || `ID-${s._id.slice(-6).toUpperCase()}`;

const getRefName = (
  ref?: BackendProgramme | BackendDepartment | string
): string => {
  if (!ref) return "Not specified";
  if (typeof ref === "string") return ref;
  return (
    (ref as BackendProgramme).name ||
    (ref as BackendProgramme).programmeName ||
    (ref as BackendProgramme).title ||
    (ref as BackendProgramme).code ||
    "Not specified"
  );
};

const VALID_STATUSES: StudentStatus[] = [
  "Active",
  "Pending",
  "Suspended",
  "Graduated",
  "Inactive",
];

const getStudentStatus = (status?: string): StudentStatus => {
  const found = VALID_STATUSES.find(
    (s) => s.toLowerCase() === (status || "").toLowerCase()
  );
  return found || "Active";
};

const formatDate = (date?: string): string => {
  if (!date) return "—";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "—";
  return parsed.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

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
  const { currentSession } = useContext(SessionContext);
  const sessionId = currentSession?._id;

  // Same endpoint your Dashboard.tsx already calls to count students.
  const {
    data: rawStudents,
    loading,
    error,
    reFetch,
  } = useFetch(sessionId ? `/users/student/${sessionId}` : null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  /* ==============================================================
     NORMALIZE — type-guarded, never indexes `unknown` directly
  ============================================================== */

  const students = useMemo<Student[]>(() => {
    let list: BackendStudent[] = [];

    if (Array.isArray(rawStudents)) {
      list = rawStudents as BackendStudent[];
    } else if (
      rawStudents &&
      typeof rawStudents === "object" &&
      Array.isArray((rawStudents as { students?: BackendStudent[] }).students)
    ) {
      list = (rawStudents as { students: BackendStudent[] }).students;
    } else if (
      rawStudents &&
      typeof rawStudents === "object" &&
      Array.isArray((rawStudents as { data?: BackendStudent[] }).data)
    ) {
      list = (rawStudents as { data: BackendStudent[] }).data;
    }

    return list.map((s): Student => ({
      id: s._id,
      matricNumber: getMatricNumber(s),
      name: getStudentName(s),
      email: s.email || "No email",
      phone: s.phone !== undefined && s.phone !== null ? String(s.phone) : "No phone",
      programme: getRefName(s.programme || s.course),
      department: getRefName(s.department),
      level: s.level ? String(s.level) : "Not set",
      status: getStudentStatus(s.status),
      admissionYear: s.admissionYear ? String(s.admissionYear) : "—",
      lastUpdated: formatDate(s.updatedAt || s.createdAt),
    }));
  }, [rawStudents]);

  /* ==============================================================
     COUNTS
  ============================================================== */

  const studentCount = students.length;
  const activeCount = students.filter((s) => s.status === "Active").length;
  const pendingCount = students.filter((s) => s.status === "Pending").length;
  const graduatedCount = students.filter((s) => s.status === "Graduated").length;

  /* ==============================================================
     FILTERING
  ============================================================== */

  const departments = useMemo(() => {
    return Array.from(
      new Set(students.map((s) => s.department).filter((d) => d && d !== "Not specified"))
    );
  }, [students]);

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return students.filter((student) => {
      const matchesSearch =
        !query ||
        student.name.toLowerCase().includes(query) ||
        student.matricNumber.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query) ||
        student.programme.toLowerCase().includes(query);

      const matchesStatus = statusFilter === "All" || student.status === statusFilter;
      const matchesDepartment = departmentFilter === "All" || student.department === departmentFilter;

      return matchesSearch && matchesStatus && matchesDepartment;
    });
  }, [students, search, statusFilter, departmentFilter]);

  /* ==============================================================
     EXPORT
  ============================================================== */

  const handleExport = () => {
    const headers = [
      "Matric Number", "Name", "Email", "Phone",
      "Programme", "Department", "Level", "Status", "Admission Year",
    ];

    const rows = filteredStudents.map((student) => [
      student.matricNumber, student.name, student.email, student.phone,
      student.programme, student.department, student.level, student.status, student.admissionYear,
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) => row.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "student-registry.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  /* ==============================================================
     LOADING / NO SESSION
  ============================================================== */

  if (!sessionId) {
    return (
      <div className="flex min-h-[400px] items-center justify-center bg-slate-50 p-6">
        <div className="text-center">
          <AlertCircle className="mx-auto h-8 w-8 text-slate-300" />
          <p className="mt-3 text-sm font-semibold text-slate-500">No active session selected</p>
          <p className="mt-1 text-xs text-slate-400">Select an academic session to view students.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center bg-slate-50 p-6">
        <div className="flex flex-col items-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="mt-3 text-sm text-slate-500">Loading students...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full space-y-6 bg-slate-50 p-4 md:p-6">

      {/* HEADER */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#081022] text-white">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#081022] md:text-2xl">Student Registry</h1>
            <p className="mt-1 text-xs text-slate-500">
              View and manage all registered students — {currentSession?.name || "current session"}.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <Button variant="outline" onClick={handleExport} className="gap-2 border-slate-300 bg-white">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button
            onClick={() => navigate("/admin/students/registration")}
            className="gap-2 bg-[#006dcc] hover:bg-[#005ca8]"
          >
            <UserPlus className="h-4 w-4" />
            Register Student
          </Button>
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
          <div className="flex-1">
            <p className="text-sm font-bold text-red-700">Unable to load students</p>
            <p className="mt-1 text-xs leading-5 text-red-600">
              The student registry could not be loaded from the server.
            </p>
          </div>
          <button
            type="button"
            onClick={() => reFetch()}
            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-50"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Retry
          </button>
        </div>
      )}

      {/* STATISTICS */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">Total Students</p>
                <p className="mt-2 text-3xl font-black text-[#081022]">{studentCount}</p>
                <p className="mt-1 text-[11px] text-slate-400">All registered students</p>
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
                <p className="text-xs font-medium text-slate-500">Active Students</p>
                <p className="mt-2 text-3xl font-black text-[#081022]">{activeCount}</p>
                <p className="mt-1 text-[11px] text-slate-400">Currently enrolled</p>
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
                <p className="text-xs font-medium text-slate-500">Pending</p>
                <p className="mt-2 text-3xl font-black text-[#081022]">{pendingCount}</p>
                <p className="mt-1 text-[11px] text-slate-400">Awaiting activation</p>
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
                <p className="text-xs font-medium text-slate-500">Graduated</p>
                <p className="mt-2 text-3xl font-black text-[#081022]">{graduatedCount}</p>
                <p className="mt-1 text-[11px] text-slate-400">Completed their programme</p>
              </div>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-700">
                <GraduationCap className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SEARCH + FILTER */}
      <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 lg:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, matric number, email or programme..."
                className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-[#006dcc] focus:bg-white focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
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

            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#006dcc]"
            >
              <option value="All">All Departments</option>
              {departments.map((department) => (
                <option key={department} value={department}>{department}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* STUDENT TABLE */}
      <Card className="overflow-hidden border-none bg-white shadow-sm ring-1 ring-slate-200">
        <div className="border-b border-slate-200 px-5 py-4">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#081022]">Registered Students</h2>
              <p className="text-xs text-slate-500">
                {filteredStudents.length} student{filteredStudents.length !== 1 ? "s" : ""} displayed
              </p>
            </div>

            {(search || statusFilter !== "All" || departmentFilter !== "All") && (
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
                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">Student</th>
                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">Matric Number</th>
                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">Programme</th>
                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">Department</th>
                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">Level</th>
                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">Status</th>
                <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-500">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <Users className="mx-auto h-8 w-8 text-slate-300" />
                    <p className="mt-3 text-sm font-semibold text-slate-500">No students found</p>
                    <p className="mt-1 text-xs text-slate-400">
                      {students.length === 0
                        ? "No students have been registered for this session yet."
                        : "Try changing your search or filters."}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student.id} className="transition hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#081022] text-sm font-bold text-white">
                          {student.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-[#081022]">{student.name}</p>
                          <p className="truncate text-xs text-slate-500">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-xs font-semibold text-slate-700">{student.matricNumber}</span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-xs font-semibold text-slate-700">{student.programme}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="max-w-[180px] text-xs text-slate-600">{student.department}</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                        {student.level}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <StatusBadge status={student.status} />
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedStudent(student)}
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

        {/* Pagination — static placeholder; wire up when the backend paginates */}
        <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3">
          <p className="text-xs text-slate-500">
            Showing <strong className="text-slate-700">{filteredStudents.length}</strong> of{" "}
            <strong className="text-slate-700">{studentCount}</strong> students
          </p>
          <div className="flex items-center gap-1">
            <button type="button" className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-400" disabled>
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button type="button" className="flex h-8 min-w-8 items-center justify-center rounded-md bg-[#081022] px-2 text-xs font-bold text-white">
              1
            </button>
            <button type="button" className="flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 text-slate-400" disabled>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </Card>

      {/* STUDENT DETAILS MODAL */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <div className="flex items-start justify-between bg-[#081022] p-6 text-white">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-lg font-bold">
                  {selectedStudent.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
                </div>
                <div>
                  <p className="text-lg font-bold">{selectedStudent.name}</p>
                  <p className="mt-1 text-xs text-slate-300">{selectedStudent.matricNumber}</p>
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

            <div className="space-y-5 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-500">Student Status</p>
                  <div className="mt-2">
                    <StatusBadge status={selectedStudent.status} />
                  </div>
                </div>
                <Button
                  onClick={() => {
                    setSelectedStudent(null);
                    navigate(`/admin/students/registry/${selectedStudent.id}`);
                  }}
                  className="gap-2 bg-[#006dcc] hover:bg-[#005ca8]"
                >
                  <Eye className="h-4 w-4" />
                  Open Full Profile
                </Button>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Programme</p>
                  <p className="mt-2 text-sm font-bold text-[#081022]">{selectedStudent.programme}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Department</p>
                  <p className="mt-2 text-sm font-bold text-[#081022]">{selectedStudent.department}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Level</p>
                  <p className="mt-2 text-sm font-bold text-[#081022]">{selectedStudent.level}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Admission Year</p>
                  <p className="mt-2 text-sm font-bold text-[#081022]">{selectedStudent.admissionYear}</p>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-5">
                <p className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-400">Contact Information</p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-600">{selectedStudent.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-600">{selectedStudent.phone}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-6 py-4">
              <Button variant="outline" onClick={() => setSelectedStudent(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}