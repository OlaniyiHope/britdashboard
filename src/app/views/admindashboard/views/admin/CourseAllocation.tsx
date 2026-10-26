import { useEffect, useMemo, useState } from "react";

import {
  BookOpen,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  Edit3,
  GraduationCap,
  Loader2,
  Plus,
  Search,
  Trash2,
  UserRound,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

/* ================================================================
   API BASE URL
================================================================ */

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

/* ================================================================
   TYPES
================================================================ */

type Department = {
  _id: string;
  name: string;
  code?: string;
  status?: string;
};

type Course = {
  _id: string;
  code: string;
  title: string;
  department: string | Department;
  level: string;
  semester: string;
  credits: number;
  type: string;
  status: string;
};

type Staff = {
  _id: string;
  firstName?: string;
  lastName?: string;
  fullname?: string;
  name?: string;
  username?: string;
  email?: string;
  role?: string;
  staffType?: string;
  department?: string | Department;
};

type AcademicSession = {
  _id: string;
  name?: string;
  session?: string;
  title?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
};

type CourseAllocation = {
  _id: string;
  staff: string | Staff;
  course: string | Course;
  department?: string | Department;
  level: string;
  semester: string;
  academicSession: string | AcademicSession;
  status: "Active" | "Inactive" | string;
  createdAt?: string;
  updatedAt?: string;
};

type AllocationForm = {
  staff: string;
  course: string;
  department: string;
  academicSession: string;
  status: "Active" | "Inactive";
};

/* ================================================================
   HELPERS
================================================================ */

const getId = (value: string | { _id: string } | null | undefined): string => {
  if (!value) return "";
  return typeof value === "string" ? value : value._id;
};

const authHeaders = (): HeadersInit => {
  const token = localStorage.getItem("jwtToken");

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const extractArray = <T,>(data: unknown, keys: string[]): T[] => {
  if (Array.isArray(data)) return data as T[];

  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;

    for (const key of [...keys, "data"]) {
      if (Array.isArray(record[key])) return record[key] as T[];
    }
  }

  return [];
};

const formatStaffName = (staff: Staff): string =>
  staff.fullname ||
  `${staff.firstName || ""} ${staff.lastName || ""}`.trim() ||
  staff.name ||
  staff.username ||
  staff.email ||
  "Unknown Staff";

const formatSessionName = (session: AcademicSession): string =>
  session.name || session.session || session.title || "Academic Session";

// Staff types that should never be offered a course
const NON_TEACHING_TYPES = ["non-academic staff", "administrator"];

/* ================================================================
   COMPONENT
================================================================ */

export default function CourseAllocation() {
  const [allocations, setAllocations] = useState<CourseAllocation[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [academicSessions, setAcademicSessions] = useState<AcademicSession[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [staffFilter, setStaffFilter] = useState("All");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [sessionFilter, setSessionFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [editingAllocation, setEditingAllocation] =
    useState<CourseAllocation | null>(null);

  /* ================================================================
     NAME LOOKUPS
  ================================================================ */

  const getStaffName = (value: string | Staff | null | undefined) => {
    if (!value) return "Unknown Staff";

    if (typeof value === "string") {
      const found = staff.find((item) => item._id === value);
      return found ? formatStaffName(found) : "Unknown Staff";
    }

    return formatStaffName(value);
  };

  const getCourseName = (value: string | Course | null | undefined) => {
    if (!value) return "Unknown Course";

    if (typeof value === "string") {
      const found = courses.find((item) => item._id === value);
      return found ? `${found.code} - ${found.title}` : "Unknown Course";
    }

    return `${value.code} - ${value.title}`;
  };

  const getDepartmentName = (value: string | Department | null | undefined) => {
    if (!value) return "Unknown Department";

    const department =
      typeof value === "string"
        ? departments.find((item) => item._id === value)
        : value;

    if (!department) return "Unknown Department";

    return department.code
      ? `${department.code} - ${department.name}`
      : department.name;
  };

  const getSessionName = (value: string | AcademicSession | null | undefined) => {
    if (!value) return "Unknown Session";

    if (typeof value === "string") {
      const found = academicSessions.find((item) => item._id === value);
      return found ? formatSessionName(found) : value;
    }

    return formatSessionName(value);
  };

  // An allocation's department, falling back to its course's department
  // for older records that were saved before departments existed here.
  const getAllocationDepartment = (allocation: CourseAllocation) => {
    if (allocation.department) return allocation.department;

    const course =
      typeof allocation.course === "string"
        ? courses.find((item) => item._id === allocation.course)
        : allocation.course;

    return course?.department;
  };

  /* ================================================================
     FETCH
  ================================================================ */

  const fetchStaff = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/staff`, {
        headers: authHeaders(),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Failed to load staff (${response.status})`);
      }

      const users = extractArray<Staff>(data, ["staff", "users"]);

      // Keep only people who can teach
      const lecturers = users.filter((user) => {
        const role = String(user.role || "staff").toLowerCase().trim();
        const type = String(user.staffType || "").toLowerCase().trim();

        return (
          ["staff", "lecturer", "teacher", "academic"].includes(role) &&
          !NON_TEACHING_TYPES.includes(type)
        );
      });

      setStaff(lecturers);
    } catch (error) {
      console.error("Fetch staff error:", error);
      setStaff([]);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/courses`, {
        headers: authHeaders(),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load courses");
      }

      setCourses(extractArray<Course>(data, ["courses"]));
    } catch (error) {
      console.error("Fetch courses error:", error);
      setCourses([]);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/departments`, {
        headers: authHeaders(),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load departments");
      }

      setDepartments(extractArray<Department>(data, ["departments"]));
    } catch (error) {
      console.error("Fetch departments error:", error);
      setDepartments([]);
    }
  };

  const fetchAcademicSessions = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/sessions`, {
        headers: authHeaders(),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `Failed to load academic sessions (${response.status})`
        );
      }

      setAcademicSessions(
        extractArray<AcademicSession>(data, ["sessions", "academicSessions"])
      );
    } catch (error) {
      console.error("Fetch academic sessions error:", error);
      setAcademicSessions([]);
    }
  };

  const fetchAllocations = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/course-allocations`, {
        headers: authHeaders(),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load course allocations");
      }

      setAllocations(extractArray<CourseAllocation>(data, ["allocations"]));
    } catch (error) {
      console.error("Fetch allocations error:", error);
      setAllocations([]);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        await Promise.all([
          fetchStaff(),
          fetchCourses(),
          fetchDepartments(),
          fetchAcademicSessions(),
          fetchAllocations(),
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  /* ================================================================
     FILTER
  ================================================================ */

  const filteredAllocations = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return allocations.filter((allocation) => {
      const department = getAllocationDepartment(allocation);

      const searchMatch =
        !searchValue ||
        getStaffName(allocation.staff).toLowerCase().includes(searchValue) ||
        getCourseName(allocation.course).toLowerCase().includes(searchValue) ||
        getDepartmentName(department).toLowerCase().includes(searchValue) ||
        allocation.level?.toLowerCase().includes(searchValue) ||
        allocation.semester?.toLowerCase().includes(searchValue) ||
        getSessionName(allocation.academicSession)
          .toLowerCase()
          .includes(searchValue);

      const staffMatch =
        staffFilter === "All" || getId(allocation.staff) === staffFilter;

      const departmentMatch =
        departmentFilter === "All" || getId(department) === departmentFilter;

      const sessionMatch =
        sessionFilter === "All" ||
        getId(allocation.academicSession) === sessionFilter;

      const statusMatch =
        statusFilter === "All" || allocation.status === statusFilter;

      return (
        searchMatch &&
        staffMatch &&
        departmentMatch &&
        sessionMatch &&
        statusMatch
      );
    });
  }, [
    allocations,
    staff,
    courses,
    departments,
    academicSessions,
    search,
    staffFilter,
    departmentFilter,
    sessionFilter,
    statusFilter,
  ]);

  /* ================================================================
     STATISTICS
  ================================================================ */

  const totalAllocations = allocations.length;
  const activeAllocations = allocations.filter((i) => i.status === "Active").length;
  const inactiveAllocations = allocations.filter((i) => i.status === "Inactive").length;
  const assignedStaff = new Set(allocations.map((i) => getId(i.staff))).size;
  const assignedCourses = new Set(allocations.map((i) => getId(i.course))).size;

  /* ================================================================
     SAVE / DELETE
  ================================================================ */

  const saveAllocation = async (form: AllocationForm) => {
    try {
      setSaving(true);

      const isEditing = Boolean(editingAllocation);

      const url = isEditing
        ? `${API_BASE_URL}/api/course-allocations/${editingAllocation?._id}`
        : `${API_BASE_URL}/api/course-allocations`;

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: authHeaders(),
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save course allocation");
      }

      await fetchAllocations();

      setShowModal(false);
      setEditingAllocation(null);
    } catch (error) {
      console.error("Save allocation error:", error);
      alert(
        error instanceof Error ? error.message : "Failed to save course allocation"
      );
    } finally {
      setSaving(false);
    }
  };

  const deleteAllocation = async (allocation: CourseAllocation) => {
    const confirmed = window.confirm(
      `Remove ${getCourseName(allocation.course)} from ${getStaffName(
        allocation.staff
      )}?`
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/course-allocations/${allocation._id}`,
        { method: "DELETE", headers: authHeaders() }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete allocation");
      }

      await fetchAllocations();
    } catch (error) {
      console.error("Delete allocation error:", error);
      alert(error instanceof Error ? error.message : "Failed to delete allocation");
    }
  };

  const openEditModal = (allocation: CourseAllocation) => {
    setEditingAllocation(allocation);
    setShowModal(true);
  };

  /* ================================================================
     LOADING
  ================================================================ */

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#006dcc]" />
          <p className="text-sm text-slate-500">Loading course allocations...</p>
        </div>
      </div>
    );
  }

  /* ================================================================
     RENDER
  ================================================================ */

  return (
    <div className="min-h-full space-y-6 bg-slate-50 p-4 md:p-6">
      {/* HEADER */}
      <div className="rounded-2xl bg-[#081022] p-6 text-white shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-blue-200">
              <ClipboardCheck className="h-5 w-5" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em]">
                Academic Management
              </span>
            </div>

            <h1 className="mt-2 text-2xl font-bold md:text-3xl">Course Allocation</h1>

            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Assign curriculum courses to lecturers and academic staff for each
              academic session.
            </p>
          </div>

          <Button
            onClick={() => {
              setEditingAllocation(null);
              setShowModal(true);
            }}
            className="bg-[#006dcc] text-white hover:bg-[#005ca8]"
          >
            <Plus className="mr-2 h-4 w-4" />
            Assign Course
          </Button>
        </div>
      </div>

      {/* STATISTICS */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          icon={ClipboardCheck}
          label="Allocations"
          value={totalAllocations}
          description="Total assignments"
        />
        <StatCard
          icon={CheckCircle2}
          label="Active"
          value={activeAllocations}
          description="Active assignments"
        />
        <StatCard
          icon={UserRound}
          label="Lecturers"
          value={assignedStaff}
          description="Staff with courses"
        />
        <StatCard
          icon={BookOpen}
          label="Courses"
          value={assignedCourses}
          description="Courses allocated"
        />
        <StatCard
          icon={GraduationCap}
          label="Inactive"
          value={inactiveAllocations}
          description="Inactive assignments"
        />
      </div>

      {/* FILTERS */}
      <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
        <CardHeader className="border-b border-slate-200">
          <CardTitle className="text-base font-bold text-[#081022]">
            Course Allocations
          </CardTitle>
          <p className="text-xs text-slate-500">
            Search and filter lecturer course assignments.
          </p>
        </CardHeader>

        <CardContent className="space-y-4 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search lecturer, course, department, level or session..."
              className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-4 text-sm outline-none focus:border-[#006dcc] focus:ring-2 focus:ring-blue-100"
            />
          </div>

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <select
              value={staffFilter}
              onChange={(event) => setStaffFilter(event.target.value)}
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#006dcc]"
            >
              <option value="All">All Staff</option>
              {staff.map((item) => (
                <option key={item._id} value={item._id}>
                  {formatStaffName(item)}
                </option>
              ))}
            </select>

            <select
              value={departmentFilter}
              onChange={(event) => setDepartmentFilter(event.target.value)}
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#006dcc]"
            >
              <option value="All">All Departments</option>
              {departments.map((department) => (
                <option key={department._id} value={department._id}>
                  {department.code ? `${department.code} - ` : ""}
                  {department.name}
                </option>
              ))}
            </select>

            <select
              value={sessionFilter}
              onChange={(event) => setSessionFilter(event.target.value)}
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#006dcc]"
            >
              <option value="All">All Academic Sessions</option>
              {academicSessions.map((session) => (
                <option key={session._id} value={session._id}>
                  {formatSessionName(session)}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#006dcc]"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* TABLE */}
      <Card className="overflow-hidden border-none bg-white shadow-sm ring-1 ring-slate-200">
        <CardContent className="p-0">
          {filteredAllocations.length === 0 ? (
            <div className="px-5 py-16 text-center">
              <ClipboardCheck className="mx-auto h-10 w-10 text-slate-300" />
              <p className="mt-4 text-sm font-bold text-slate-700">
                No course allocations found
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Assign a course to a lecturer to see it here.
              </p>

              <Button
                onClick={() => {
                  setEditingAllocation(null);
                  setShowModal(true);
                }}
                className="mt-5 bg-[#006dcc] text-white hover:bg-[#005ca8]"
              >
                <Plus className="mr-2 h-4 w-4" />
                Assign Course
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px]">
                <thead className="bg-slate-50">
                  <tr className="border-b border-slate-200">
                    {["Lecturer", "Course", "Department", "Level", "Semester", "Session", "Status"].map(
                      (heading, index) => (
                        <th
                          key={heading}
                          className={`py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500 ${
                            index === 0 ? "px-5" : "px-4"
                          }`}
                        >
                          {heading}
                        </th>
                      )
                    )}
                    <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {filteredAllocations.map((allocation) => (
                    <tr key={allocation._id} className="hover:bg-slate-50">
                      {/* STAFF */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700">
                            <UserRound className="h-4 w-4" />
                          </div>

                          <div>
                            <p className="text-sm font-bold text-[#081022]">
                              {getStaffName(allocation.staff)}
                            </p>

                            {typeof allocation.staff !== "string" &&
                              allocation.staff?.email && (
                                <p className="mt-0.5 text-xs text-slate-500">
                                  {allocation.staff.email}
                                </p>
                              )}
                          </div>
                        </div>
                      </td>

                      {/* COURSE */}
                      <td className="px-4 py-4">
                        <p className="text-sm font-bold text-[#081022]">
                          {typeof allocation.course !== "string"
                            ? allocation.course?.code
                            : getCourseName(allocation.course)}
                        </p>

                        {typeof allocation.course !== "string" && (
                          <p className="mt-1 text-xs text-slate-500">
                            {allocation.course?.title}
                          </p>
                        )}
                      </td>

                      {/* DEPARTMENT */}
                      <td className="px-4 py-4">
                        <span className="text-sm text-slate-600">
                          {getDepartmentName(getAllocationDepartment(allocation))}
                        </span>
                      </td>

                      {/* LEVEL */}
                      <td className="px-4 py-4">
                        <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                          {allocation.level}
                        </span>
                      </td>

                      {/* SEMESTER */}
                      <td className="px-4 py-4 text-sm text-slate-600">
                        {allocation.semester}
                      </td>

                      {/* SESSION */}
                      <td className="px-4 py-4 text-sm text-slate-600">
                        {getSessionName(allocation.academicSession)}
                      </td>

                      {/* STATUS */}
                      <td className="px-4 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                            allocation.status === "Active"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {allocation.status}
                        </span>
                      </td>

                      {/* ACTIONS */}
                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-1">
                          <button
                            title="Edit Allocation"
                            onClick={() => openEditModal(allocation)}
                            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-[#081022]"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>

                          <button
                            title="Delete Allocation"
                            onClick={() => deleteAllocation(allocation)}
                            className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* MODAL */}
      {showModal && (
        <AllocationModal
          allocation={editingAllocation}
          staff={staff}
          courses={courses}
          departments={departments}
          academicSessions={academicSessions}
          saving={saving}
          onClose={() => {
            setShowModal(false);
            setEditingAllocation(null);
          }}
          onSave={saveAllocation}
        />
      )}
    </div>
  );
}

/* ================================================================
   STAT CARD
================================================================ */

function StatCard({
  icon: Icon,
  label,
  value,
  description,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  description: string;
}) {
  return (
    <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#081022] text-white">
            <Icon className="h-5 w-5" />
          </div>
          <span className="text-2xl font-black text-[#081022]">{value}</span>
        </div>

        <p className="mt-4 text-sm font-bold text-[#081022]">{label}</p>
        <p className="mt-1 text-xs text-slate-500">{description}</p>
      </CardContent>
    </Card>
  );
}

/* ================================================================
   ALLOCATION MODAL
================================================================ */

function AllocationModal({
  allocation,
  staff,
  courses,
  departments,
  academicSessions,
  saving,
  onClose,
  onSave,
}: {
  allocation: CourseAllocation | null;
  staff: Staff[];
  courses: Course[];
  departments: Department[];
  academicSessions: AcademicSession[];
  saving: boolean;
  onClose: () => void;
  onSave: (form: AllocationForm) => void;
}) {
  /* ---------------- FORM ---------------- */

  const [form, setForm] = useState<AllocationForm>(() => {
    const courseId = getId(allocation?.course);

    const populatedCourse =
      allocation && typeof allocation.course === "object"
        ? allocation.course
        : undefined;

    const existingCourse =
      courses.find((item) => item._id === courseId) ?? populatedCourse;

    return {
      staff: getId(allocation?.staff),
      course: courseId,
      department:
        getId(allocation?.department) || getId(existingCourse?.department),
      academicSession: getId(allocation?.academicSession),
      status: allocation?.status === "Inactive" ? "Inactive" : "Active",
    };
  });

  const update = <K extends keyof AllocationForm>(
    key: K,
    value: AllocationForm[K]
  ) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  /* ---------------- DERIVED DATA ---------------- */

  // Only active departments, but keep the current one when editing
  const selectableDepartments = departments.filter(
    (department) =>
      department.status !== "Inactive" || department._id === form.department
  );

  const selectedDepartment = departments.find(
    (department) => department._id === form.department
  );

  // Courses in the chosen department. Inactive courses are hidden unless
  // one is already selected on the allocation being edited.
  const availableCourses = courses.filter(
    (course) =>
      getId(course.department) === form.department &&
      (course.status !== "Inactive" || course._id === form.course)
  );

  const selectedCourse = courses.find((course) => course._id === form.course);

  const selectedStaff = staff.find((item) => item._id === form.staff);

  // Soft warning only: lecturers can teach general courses across departments
  const staffInDifferentDepartment =
    Boolean(selectedStaff && form.department) &&
    Boolean(getId(selectedStaff?.department)) &&
    getId(selectedStaff?.department) !== form.department;

  /* ---------------- HANDLERS ---------------- */

  const handleDepartmentChange = (value: string) => {
    setForm((current) => ({
      ...current,
      department: value,
      // Courses belong to a department, so the old choice no longer applies
      course: "",
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.staff) return alert("Please select a lecturer/staff member.");
    if (!form.department) return alert("Please select a department.");
    if (!form.course) return alert("Please select a course.");
    if (!form.academicSession) return alert("Please select an academic session.");

    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 p-5">
          <div>
            <h2 className="text-lg font-bold text-[#081022]">
              {allocation ? "Edit Course Allocation" : "Assign Course"}
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Assign a curriculum course to a lecturer for an academic session.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* STAFF */}
            <FormField label="Lecturer / Staff *">
              <select
                value={form.staff}
                onChange={(event) => update("staff", event.target.value)}
                className="form-input"
              >
                <option value="">Select Lecturer</option>
                {staff.map((item) => (
                  <option key={item._id} value={item._id}>
                    {formatStaffName(item)}
                  </option>
                ))}
              </select>
            </FormField>

            {/* DEPARTMENT */}
            <FormField label="Department *">
              <select
                value={form.department}
                onChange={(event) => handleDepartmentChange(event.target.value)}
                className="form-input"
              >
                <option value="">Select Department</option>
                {selectableDepartments.map((department) => (
                  <option key={department._id} value={department._id}>
                    {department.code
                      ? `${department.code} - ${department.name}`
                      : department.name}
                  </option>
                ))}
              </select>
            </FormField>

            {/* COURSE */}
            <FormField label="Course *">
              <select
                value={form.course}
                onChange={(event) => update("course", event.target.value)}
                disabled={!form.department}
                className={`form-input ${
                  !form.department
                    ? "cursor-not-allowed bg-slate-100 text-slate-400"
                    : ""
                }`}
              >
                <option value="">
                  {!form.department ? "Select department first" : "Select Course"}
                </option>
                {availableCourses.map((course) => (
                  <option key={course._id} value={course._id}>
                    {course.code} - {course.title} ({course.level})
                  </option>
                ))}
              </select>

              {form.department && (
                <p className="mt-1 text-[11px] text-slate-400">
                  {availableCourses.length} course
                  {availableCourses.length !== 1 ? "s" : ""} available in this
                  department
                </p>
              )}
            </FormField>

            {/* ACADEMIC SESSION */}
            <FormField label="Academic Session *">
              <select
                value={form.academicSession}
                onChange={(event) => update("academicSession", event.target.value)}
                className="form-input"
              >
                <option value="">Select Academic Session</option>
                {academicSessions.map((session) => (
                  <option key={session._id} value={session._id}>
                    {formatSessionName(session)}
                  </option>
                ))}
              </select>
            </FormField>

            {/* LEVEL */}
            <FormField label="Level">
              <input
                value={selectedCourse?.level || ""}
                disabled
                placeholder="Automatically selected from course"
                className="form-input bg-slate-100 text-slate-500"
              />
            </FormField>

            {/* SEMESTER */}
            <FormField label="Semester">
              <input
                value={selectedCourse?.semester || ""}
                disabled
                placeholder="Automatically selected from course"
                className="form-input bg-slate-100 text-slate-500"
              />
            </FormField>

            {/* STATUS */}
            <FormField label="Status">
              <select
                value={form.status}
                onChange={(event) =>
                  update("status", event.target.value as "Active" | "Inactive")
                }
                className="form-input"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </FormField>
          </div>

          {/* SELECTED DEPARTMENT */}
          {selectedDepartment && (
            <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4">
              <div className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-indigo-700">
                  <Building2 className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-sm font-bold text-indigo-900">
                    Selected Department
                  </p>
                  <p className="mt-1 text-xs text-indigo-700">
                    {selectedDepartment.code && (
                      <>
                        <strong>{selectedDepartment.code}</strong> —{" "}
                      </>
                    )}
                    {selectedDepartment.name}
                  </p>
                  <p className="mt-1 text-xs text-indigo-600">
                    {availableCourses.length} available course
                    {availableCourses.length !== 1 ? "s" : ""} in this department.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* COURSE INFORMATION */}
          {selectedCourse && (
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
              <div className="flex gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-blue-700">
                  <BookOpen className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-sm font-bold text-blue-900">Course assignment</p>

                  <p className="mt-1 text-xs leading-5 text-blue-700">
                    <strong>{selectedCourse.code}</strong> — {selectedCourse.title}{" "}
                    will be assigned to the selected lecturer for{" "}
                    <strong>{selectedCourse.level}</strong> /{" "}
                    <strong>{selectedCourse.semester}</strong>.
                  </p>

                  <p className="mt-1 text-xs text-blue-600">
                    {selectedCourse.credits} credit unit
                    {selectedCourse.credits !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* DIFFERENT DEPARTMENT WARNING */}
          {staffInDifferentDepartment && (
            <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
              <p className="text-sm font-bold text-amber-800">
                Different department
              </p>
              <p className="mt-1 text-xs text-amber-700">
                This lecturer belongs to another department. That is fine for
                general courses, but double-check this is intended.
              </p>
            </div>
          )}

          {/* NO COURSES */}
          {form.department && availableCourses.length === 0 && (
            <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
              <p className="text-sm font-bold text-amber-800">No courses found</p>
              <p className="mt-1 text-xs text-amber-700">
                There are currently no active courses in this department. Add
                courses from the Curriculum page first.
              </p>
            </div>
          )}

          {/* FOOTER */}
          <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
            <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={
                saving ||
                staff.length === 0 ||
                courses.length === 0 ||
                departments.length === 0 ||
                academicSessions.length === 0
              }
              className="bg-[#006dcc] text-white hover:bg-[#005ca8]"
            >
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {allocation ? "Save Changes" : "Assign Course"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ================================================================
   FORM FIELD
================================================================ */

function FormField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="space-y-1.5">
      <span className="text-xs font-bold text-slate-700">{label}</span>
      {children}
    </label>
  );
}