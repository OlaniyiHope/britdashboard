import { useEffect, useMemo, useState } from "react";

import {
  BookOpen,
  Building2,
  Check,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  Edit3,
  FileText,
  Loader2,
  Plus,
  Search,
  Settings2,
  Trash2,
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

type CourseStatus = "Approved" | "Draft" | "Inactive";
type CourseType = "Compulsory" | "Elective";
type CourseLevel = "ND 1" | "ND 2" | "HND 1" | "HND 2";
type CourseSemester = "First Semester" | "Second Semester";

type Department = {
  _id: string;
  name: string;
  code?: string;
  qualification?: string;
  duration?: string;
  status?: "Active" | "Inactive";
};

type Course = {
  _id: string;
  code: string;
  title: string;
  department: string | Department;
  level: CourseLevel;
  semester: CourseSemester;
  credits: number;
  type: CourseType;
  status: CourseStatus;
  createdAt?: string;
  updatedAt?: string;
};

type CourseForm = {
  code: string;
  title: string;
  department: string;
  level: CourseLevel;
  semester: CourseSemester;
  credits: number;
  type: CourseType;
  status: CourseStatus;
};

/* ================================================================
   CONSTANTS
================================================================ */

const LEVELS: CourseLevel[] = ["ND 1", "ND 2", "HND 1", "HND 2"];
const SEMESTERS: CourseSemester[] = ["First Semester", "Second Semester"];
const COURSE_TYPES: CourseType[] = ["Compulsory", "Elective"];
const COURSE_STATUSES: CourseStatus[] = ["Draft", "Approved", "Inactive"];

/* ================================================================
   HELPERS
================================================================ */

const extractArray = <T,>(data: unknown, key: string): T[] => {
  if (Array.isArray(data)) return data as T[];

  if (typeof data === "object" && data !== null) {
    const record = data as Record<string, unknown>;
    if (Array.isArray(record[key])) return record[key] as T[];
    if (Array.isArray(record.data)) return record.data as T[];
  }

  return [];
};

// A course's department can be a plain id or a populated object
const getDepartmentId = (department: Course["department"] | undefined): string => {
  if (!department) return "";
  return typeof department === "string" ? department : department._id || "";
};

/* ================================================================
   CURRICULUM
================================================================ */

export default function Curriculum() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("All");
  const [levelFilter, setLevelFilter] = useState("All");
  const [semesterFilter, setSemesterFilter] = useState("All");

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [expandedDepartment, setExpandedDepartment] = useState<string | null>(null);

  /* ---------------- FETCH ---------------- */

  const fetchDepartments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/departments`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to load departments");
      }

      setDepartments(extractArray<Department>(data, "departments"));
    } catch (error) {
      console.error("Fetch departments error:", error);
      setDepartments([]);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/courses`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to load courses");
      }

      setCourses(extractArray<Course>(data, "courses"));
    } catch (error) {
      console.error("Fetch courses error:", error);
      setCourses([]);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchDepartments(), fetchCourses()]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  /* ---------------- FILTER ---------------- */

  const filteredCourses = useMemo(() => {
    const searchValue = search.toLowerCase().trim();

    return courses.filter((course) => {
      const departmentId = getDepartmentId(course.department);
      const departmentName =
        departments.find((d) => d._id === departmentId)?.name || "";

      const searchMatch =
        !searchValue ||
        course.code?.toLowerCase().includes(searchValue) ||
        course.title?.toLowerCase().includes(searchValue) ||
        departmentName.toLowerCase().includes(searchValue);

      const departmentMatch =
        departmentFilter === "All" || departmentId === departmentFilter;

      const levelMatch = levelFilter === "All" || course.level === levelFilter;

      const semesterMatch =
        semesterFilter === "All" || course.semester === semesterFilter;

      return searchMatch && departmentMatch && levelMatch && semesterMatch;
    });
  }, [courses, departments, search, departmentFilter, levelFilter, semesterFilter]);

  /* ---------------- STATISTICS ---------------- */

  const departmentCount = departments.length;
  const courseCount = courses.length;
  const draftCount = courses.filter((c) => c.status === "Draft").length;
  const approvedCount = courses.filter((c) => c.status === "Approved").length;
  const totalCredits = courses.reduce(
    (total, course) => total + (Number(course.credits) || 0),
    0
  );

  /* ---------------- MODAL ---------------- */

  const openAddModal = () => {
    setEditingCourse(null);
    setShowAddModal(true);
  };

  const openEditModal = (course: Course) => {
    setShowAddModal(false);
    setEditingCourse(course);
  };

  const closeModal = () => {
    setShowAddModal(false);
    setEditingCourse(null);
  };

  /* ---------------- SAVE ---------------- */

  const saveCourse = async (form: CourseForm) => {
    try {
      setSaving(true);

      const isEditing = Boolean(editingCourse);

      const url = isEditing
        ? `${API_BASE_URL}/api/courses/${editingCourse?._id}`
        : `${API_BASE_URL}/api/courses`;

      const payload = {
        code: form.code.trim().toUpperCase(),
        title: form.title.trim(),
        department: form.department,
        level: form.level,
        semester: form.semester,
        credits: Number(form.credits),
        type: form.type,
        status: form.status,
      };

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to save course");
      }

      await fetchCourses();
      closeModal();
    } catch (error) {
      console.error("Save course error:", error);
      alert(error instanceof Error ? error.message : "Failed to save course");
    } finally {
      setSaving(false);
    }
  };

  /* ---------------- DELETE ---------------- */

  const deleteCourse = async (course: Course) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${course.code} - ${course.title}"?`
    );
    if (!confirmed) return;

    try {
      const response = await fetch(`${API_BASE_URL}/api/courses/${course._id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to delete course");
      }

      await fetchCourses();
    } catch (error) {
      console.error("Delete course error:", error);
      alert(error instanceof Error ? error.message : "Failed to delete course");
    }
  };

  /* ---------------- APPROVE ---------------- */

  const approveCourse = async (course: Course) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/courses/${course._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Approved" }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to approve course");
      }

      await fetchCourses();
    } catch (error) {
      console.error("Approve course error:", error);
      alert(error instanceof Error ? error.message : "Failed to approve course");
    }
  };

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#006dcc]" />
          <p className="text-sm text-slate-500">Loading curriculum...</p>
        </div>
      </div>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-full space-y-6 bg-slate-50 p-4 md:p-6">
      {/* HEADER */}
      <div className="rounded-2xl bg-[#081022] p-6 text-white shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2 text-blue-200">
              <BookOpen className="h-5 w-5" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em]">
                Departments & Curriculum
              </span>
            </div>

            <h1 className="mt-2 text-2xl font-bold md:text-3xl">Curriculum</h1>

            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Manage courses, academic levels, semesters and credit units.
            </p>
          </div>

          <Button
            onClick={openAddModal}
            className="bg-[#006dcc] text-white hover:bg-[#005ca8]"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Course
          </Button>
        </div>
      </div>

      {/* STATISTICS */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          icon={Building2}
          label="Departments"
          value={departmentCount}
          description="Academic departments"
        />
        <StatCard
          icon={BookOpen}
          label="Courses"
          value={courseCount}
          description="Curriculum courses"
        />
        <StatCard
          icon={ClipboardCheck}
          label="Approved"
          value={approvedCount}
          description="Approved courses"
        />
        <StatCard
          icon={FileText}
          label="Drafts"
          value={draftCount}
          description="Awaiting approval"
        />
        <StatCard
          icon={Settings2}
          label="Credit Units"
          value={totalCredits}
          description="Total configured credits"
        />
      </div>

      {/* CONTROLS */}
      <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
        <CardHeader className="border-b border-slate-200">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle className="text-base font-bold text-[#081022]">
                Curriculum Structure
              </CardTitle>
              <p className="mt-1 text-xs text-slate-500">
                Browse and manage courses within each department.
              </p>
            </div>

            <button
              onClick={openAddModal}
              className="inline-flex items-center rounded-lg bg-[#081022] px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800"
            >
              <Plus className="mr-1.5 h-4 w-4" />
              Add Course
            </button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 p-4">
          {/* SEARCH */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search course code, title or department..."
              className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-4 text-sm outline-none focus:border-[#006dcc] focus:ring-2 focus:ring-blue-100"
            />
          </div>

          {/* FILTERS */}
          <div className="grid gap-3 sm:grid-cols-3">
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
              value={levelFilter}
              onChange={(event) => setLevelFilter(event.target.value)}
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#006dcc]"
            >
              <option value="All">All Levels</option>
              {LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>

            <select
              value={semesterFilter}
              onChange={(event) => setSemesterFilter(event.target.value)}
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#006dcc]"
            >
              <option value="All">All Semesters</option>
              {SEMESTERS.map((semester) => (
                <option key={semester} value={semester}>
                  {semester}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* DEPARTMENTS */}
      <div className="space-y-4">
        {departments.map((department) => {
          const departmentCourses = filteredCourses.filter(
            (course) => getDepartmentId(course.department) === department._id
          );

          const isExpanded = expandedDepartment === department._id;

          const departmentCredits = departmentCourses.reduce(
            (total, course) => total + (Number(course.credits) || 0),
            0
          );

          return (
            <Card
              key={department._id}
              className="overflow-hidden border-none bg-white shadow-sm ring-1 ring-slate-200"
            >
              {/* DEPARTMENT HEADER */}
              <button
                type="button"
                onClick={() =>
                  setExpandedDepartment(isExpanded ? null : department._id)
                }
                className="flex w-full items-center justify-between p-5 text-left hover:bg-slate-50"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                    <Building2 className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-[#081022]">
                      {department.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {department.code}
                      {department.qualification
                        ? ` • ${department.qualification}`
                        : ""}
                      {department.duration ? ` • ${department.duration}` : ""}
                    </p>

                    <div className="mt-1 flex flex-wrap gap-3 text-xs text-slate-500">
                      <span>{departmentCourses.length} courses</span>
                      <span>{departmentCredits} credit units</span>
                      {department.status === "Inactive" && (
                        <span className="font-semibold text-amber-600">
                          Inactive
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {isExpanded ? (
                  <ChevronDown className="h-5 w-5 text-slate-400" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-slate-400" />
                )}
              </button>

              {/* COURSES */}
              {isExpanded && (
                <div className="border-t border-slate-200">
                  {departmentCourses.length === 0 ? (
                    <div className="px-5 py-10 text-center">
                      <BookOpen className="mx-auto h-8 w-8 text-slate-300" />
                      <p className="mt-3 text-sm font-semibold text-slate-500">
                        No courses found
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Try changing your search or filters.
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[900px]">
                        <thead className="bg-slate-50">
                          <tr className="border-b border-slate-200">
                            {["Course", "Level", "Semester", "Credits", "Type", "Status"].map(
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
                          {departmentCourses.map((course) => (
                            <tr key={course._id} className="hover:bg-slate-50">
                              {/* COURSE */}
                              <td className="px-5 py-4">
                                <p className="text-sm font-bold text-[#081022]">
                                  {course.code}
                                </p>
                                <p className="mt-1 text-xs text-slate-500">
                                  {course.title}
                                </p>
                              </td>

                              {/* LEVEL */}
                              <td className="px-4 py-4">
                                <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                                  {course.level}
                                </span>
                              </td>

                              {/* SEMESTER */}
                              <td className="px-4 py-4 text-sm text-slate-600">
                                {course.semester}
                              </td>

                              {/* CREDITS */}
                              <td className="px-4 py-4">
                                <span className="font-bold text-[#081022]">
                                  {course.credits}
                                </span>
                              </td>

                              {/* TYPE */}
                              <td className="px-4 py-4">
                                <span
                                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                                    course.type === "Compulsory"
                                      ? "bg-blue-50 text-blue-700"
                                      : "bg-purple-50 text-purple-700"
                                  }`}
                                >
                                  {course.type}
                                </span>
                              </td>

                              {/* STATUS */}
                              <td className="px-4 py-4">
                                <span
                                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                                    course.status === "Approved"
                                      ? "bg-emerald-50 text-emerald-700"
                                      : course.status === "Inactive"
                                      ? "bg-slate-100 text-slate-600"
                                      : "bg-amber-50 text-amber-700"
                                  }`}
                                >
                                  {course.status}
                                </span>
                              </td>

                              {/* ACTIONS */}
                              <td className="px-5 py-4">
                                <div className="flex justify-end gap-1">
                                  {course.status === "Draft" && (
                                    <button
                                      type="button"
                                      title="Approve"
                                      onClick={() => approveCourse(course)}
                                      className="rounded-lg p-2 text-emerald-600 hover:bg-emerald-50"
                                    >
                                      <Check className="h-4 w-4" />
                                    </button>
                                  )}

                                  <button
                                    type="button"
                                    title="Edit"
                                    onClick={() => openEditModal(course)}
                                    className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-[#081022]"
                                  >
                                    <Edit3 className="h-4 w-4" />
                                  </button>

                                  <button
                                    type="button"
                                    title="Delete"
                                    onClick={() => deleteCourse(course)}
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
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* EMPTY STATE */}
      {departments.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <Building2 className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-4 font-bold text-slate-700">No departments available</p>
          <p className="mt-1 text-sm text-slate-500">
            Create a department before adding courses.
          </p>
        </div>
      )}

      {/* COURSE MODAL */}
      {(showAddModal || editingCourse) && (
        <CourseModal
          course={editingCourse}
          departments={departments}
          saving={saving}
          onClose={closeModal}
          onSave={saveCourse}
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
   COURSE MODAL
================================================================ */

function CourseModal({
  course,
  departments,
  saving,
  onClose,
  onSave,
}: {
  course: Course | null;
  departments: Department[];
  saving: boolean;
  onClose: () => void;
  onSave: (form: CourseForm) => void;
}) {
  const [form, setForm] = useState<CourseForm>(() => ({
    code: course?.code || "",
    title: course?.title || "",
    department: getDepartmentId(course?.department),
    level: course?.level || "ND 1",
    semester: course?.semester || "First Semester",
    credits: course?.credits || 3,
    type: course?.type || "Compulsory",
    status: course?.status || "Draft",
  }));

  const update = <K extends keyof CourseForm>(key: K, value: CourseForm[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  // New courses can only go into active departments. When editing, the
  // course's current department stays selectable even if it was deactivated.
  const selectableDepartments = departments.filter(
    (department) =>
      department.status !== "Inactive" || department._id === form.department
  );

  const selectedDepartment = departments.find(
    (department) => department._id === form.department
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !form.code.trim() ||
      !form.title.trim() ||
      !form.department ||
      !form.level ||
      !form.semester ||
      !form.credits
    ) {
      alert("Please complete all required fields.");
      return;
    }

    if (Number(form.credits) < 1 || Number(form.credits) > 12) {
      alert("Credit units must be between 1 and 12.");
      return;
    }

    onSave({
      ...form,
      code: form.code.trim().toUpperCase(),
      title: form.title.trim(),
      credits: Number(form.credits),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <div
        className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-slate-200 p-5">
          <div>
            <h2 className="text-lg font-bold text-[#081022]">
              {course ? "Edit Course" : "Add Course"}
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Configure the course within the department curriculum.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-5 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Course Code *">
              <input
                value={form.code}
                onChange={(event) => update("code", event.target.value.toUpperCase())}
                placeholder="e.g. CSC101"
                className="form-input"
                required
              />
            </FormField>

            <FormField label="Course Title *">
              <input
                value={form.title}
                onChange={(event) => update("title", event.target.value)}
                placeholder="e.g. Introduction to Computer Science"
                className="form-input"
                required
              />
            </FormField>

            <FormField label="Department *">
              <select
                value={form.department}
                onChange={(event) => update("department", event.target.value)}
                className="form-input"
                required
              >
                <option value="">Select Department</option>
                {selectableDepartments.map((department) => (
                  <option key={department._id} value={department._id}>
                    {department.code ? `${department.code} - ` : ""}
                    {department.name}
                  </option>
                ))}
              </select>

              {selectedDepartment && (
                <p className="text-[11px] text-slate-500">
                  Selected: {selectedDepartment.name}
                </p>
              )}
            </FormField>

            <FormField label="Level *">
              <select
                value={form.level}
                onChange={(event) => update("level", event.target.value as CourseLevel)}
                className="form-input"
                required
              >
                {LEVELS.map((level) => (
                  <option key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Semester *">
              <select
                value={form.semester}
                onChange={(event) =>
                  update("semester", event.target.value as CourseSemester)
                }
                className="form-input"
                required
              >
                {SEMESTERS.map((semester) => (
                  <option key={semester} value={semester}>
                    {semester}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Credit Units *">
              <input
                type="number"
                min="1"
                max="12"
                value={form.credits}
                onChange={(event) => update("credits", Number(event.target.value))}
                className="form-input"
                required
              />
            </FormField>

            <FormField label="Course Type">
              <select
                value={form.type}
                onChange={(event) => update("type", event.target.value as CourseType)}
                className="form-input"
              >
                {COURSE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Status">
              <select
                value={form.status}
                onChange={(event) =>
                  update("status", event.target.value as CourseStatus)
                }
                className="form-input"
              >
                {COURSE_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </FormField>
          </div>

          {/* CURRICULUM INFORMATION */}
          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
            <div className="flex gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-blue-700">
                <BookOpen className="h-4 w-4" />
              </div>

              <div>
                <p className="text-sm font-bold text-blue-900">Curriculum placement</p>
                <p className="mt-1 text-xs leading-5 text-blue-700">
                  The course will belong to the selected department and will be
                  placed under the selected level and semester.
                </p>
              </div>
            </div>
          </div>

          {/* DUPLICATE WARNING */}
          <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">
            <p className="text-xs font-semibold text-amber-800">Course code rule</p>
            <p className="mt-1 text-xs leading-5 text-amber-700">
              The same course code can be used in different departments (for
              example a general course like GNS 101), but it cannot be duplicated
              within the same department, level and semester.
            </p>
          </div>

          {/* FOOTER */}
          <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">
            <Button type="button" variant="outline" onClick={onClose} disabled={saving}>
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={saving || departments.length === 0}
              className="bg-[#006dcc] text-white hover:bg-[#005ca8]"
            >
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {course ? "Save Changes" : "Add Course"}
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
      <span className="block text-xs font-bold text-slate-700">{label}</span>
      {children}
    </label>
  );
}