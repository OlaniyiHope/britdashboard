import { useMemo, useState } from "react";
import {
  BookOpen,
  Check,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  Edit3,
  FileText,
  Layers3,
  Plus,
  Search,
  Settings2,
  Trash2,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Course = {
  id: string;
  code: string;
  title: string;
  programme: string;
  department: string;
  level: string;
  semester: string;
  credits: number;
  type: "Compulsory" | "Elective";
  status: "Approved" | "Draft";
};

const initialCourses: Course[] = [
  {
    id: "1",
    code: "CSC101",
    title: "Introduction to Computer Science",
    programme: "BSc Computer Science",
    department: "Computing",
    level: "100",
    semester: "First Semester",
    credits: 3,
    type: "Compulsory",
    status: "Approved",
  },
  {
    id: "2",
    code: "MTH101",
    title: "Elementary Mathematics",
    programme: "BSc Computer Science",
    department: "Computing",
    level: "100",
    semester: "First Semester",
    credits: 3,
    type: "Compulsory",
    status: "Approved",
  },
  {
    id: "3",
    code: "GST101",
    title: "Use of English",
    programme: "BSc Computer Science",
    department: "General Studies",
    level: "100",
    semester: "First Semester",
    credits: 2,
    type: "Compulsory",
    status: "Approved",
  },
  {
    id: "4",
    code: "CSC201",
    title: "Data Structures",
    programme: "BSc Computer Science",
    department: "Computing",
    level: "200",
    semester: "First Semester",
    credits: 3,
    type: "Compulsory",
    status: "Approved",
  },
  {
    id: "5",
    code: "CSC205",
    title: "Web Application Development",
    programme: "BSc Computer Science",
    department: "Computing",
    level: "200",
    semester: "Second Semester",
    credits: 3,
    type: "Elective",
    status: "Draft",
  },
];

export default function Curriculum() {
  const [courses, setCourses] = useState<Course[]>(initialCourses);

  const [search, setSearch] = useState("");
  const [programmeFilter, setProgrammeFilter] = useState("All Programmes");
  const [levelFilter, setLevelFilter] = useState("All Levels");
  const [semesterFilter, setSemesterFilter] = useState("All Semesters");

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const [expandedProgramme, setExpandedProgramme] = useState<string | null>(
    "BSc Computer Science"
  );

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const searchMatch =
        course.code.toLowerCase().includes(search.toLowerCase()) ||
        course.title.toLowerCase().includes(search.toLowerCase()) ||
        course.department.toLowerCase().includes(search.toLowerCase());

      const programmeMatch =
        programmeFilter === "All Programmes" ||
        course.programme === programmeFilter;

      const levelMatch =
        levelFilter === "All Levels" || course.level === levelFilter;

      const semesterMatch =
        semesterFilter === "All Semesters" ||
        course.semester === semesterFilter;

      return (
        searchMatch &&
        programmeMatch &&
        levelMatch &&
        semesterMatch
      );
    });
  }, [
    courses,
    search,
    programmeFilter,
    levelFilter,
    semesterFilter,
  ]);

  const programmeCount = new Set(
    courses.map((course) => course.programme)
  ).size;

  const courseCount = courses.length;

  const draftCount = courses.filter(
    (course) => course.status === "Draft"
  ).length;

  const approvedCount = courses.filter(
    (course) => course.status === "Approved"
  ).length;

  const totalCredits = courses.reduce(
    (total, course) => total + course.credits,
    0
  );

  const programmes = Array.from(
    new Set(courses.map((course) => course.programme))
  );

  const deleteCourse = (id: string) => {
    if (!window.confirm("Are you sure you want to remove this course?")) {
      return;
    }

    setCourses((current) =>
      current.filter((course) => course.id !== id)
    );
  };

  const approveCourse = (id: string) => {
    setCourses((current) =>
      current.map((course) =>
        course.id === id
          ? { ...course, status: "Approved" }
          : course
      )
    );
  };

  return (
    <div className="min-h-full space-y-6 bg-slate-50 p-4 md:p-6">

      {/* HEADER */}

      <div className="rounded-2xl bg-[#081022] p-6 text-white shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

          <div>
            <div className="flex items-center gap-2 text-blue-200">
              <BookOpen className="h-5 w-5" />

              <span className="text-[11px] font-bold uppercase tracking-[0.2em]">
                Programmes & Curriculum
              </span>
            </div>

            <h1 className="mt-2 text-2xl font-bold md:text-3xl">
              Curriculum
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Manage programmes, courses, academic levels, semesters,
              credit units and curriculum requirements.
            </p>
          </div>

          <Button
            onClick={() => setShowAddModal(true)}
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
          icon={Layers3}
          label="Programmes"
          value={programmeCount}
          description="Academic programmes"
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

      {/* CURRICULUM CONTROLS */}

      <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

        <CardHeader className="border-b border-slate-200">

          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <CardTitle className="text-base font-bold text-[#081022]">
                Curriculum Structure
              </CardTitle>

              <p className="mt-1 text-xs text-slate-500">
                Browse and manage courses within each academic programme.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">

              <button
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center rounded-lg bg-[#081022] px-3 py-2 text-xs font-semibold text-white hover:bg-slate-800"
              >
                <Plus className="mr-1.5 h-4 w-4" />
                Add Course
              </button>

            </div>

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
              value={programmeFilter}
              onChange={(event) =>
                setProgrammeFilter(event.target.value)
              }
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#006dcc]"
            >
              <option>All Programmes</option>

              {programmes.map((programme) => (
                <option key={programme}>{programme}</option>
              ))}
            </select>

            <select
              value={levelFilter}
              onChange={(event) =>
                setLevelFilter(event.target.value)
              }
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#006dcc]"
            >
              <option>All Levels</option>
              <option>100</option>
              <option>200</option>
              <option>300</option>
              <option>400</option>
              <option>500</option>
            </select>

            <select
              value={semesterFilter}
              onChange={(event) =>
                setSemesterFilter(event.target.value)
              }
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#006dcc]"
            >
              <option>All Semesters</option>
              <option>First Semester</option>
              <option>Second Semester</option>
            </select>

          </div>

        </CardContent>

      </Card>

      {/* PROGRAMMES */}

      <div className="space-y-4">

        {programmes.map((programme) => {

          const programmeCourses = filteredCourses.filter(
            (course) => course.programme === programme
          );

          const isExpanded = expandedProgramme === programme;

          const programmeCredits = programmeCourses.reduce(
            (total, course) => total + course.credits,
            0
          );

          return (
            <Card
              key={programme}
              className="overflow-hidden border-none bg-white shadow-sm ring-1 ring-slate-200"
            >

              {/* PROGRAMME HEADER */}

              <button
                type="button"
                onClick={() =>
                  setExpandedProgramme(
                    isExpanded ? null : programme
                  )
                }
                className="flex w-full items-center justify-between p-5 text-left hover:bg-slate-50"
              >

                <div className="flex min-w-0 items-center gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                    <Layers3 className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">

                    <p className="truncate text-sm font-bold text-[#081022]">
                      {programme}
                    </p>

                    <div className="mt-1 flex flex-wrap gap-3 text-xs text-slate-500">

                      <span>
                        {programmeCourses.length} courses
                      </span>

                      <span>
                        {programmeCredits} credit units
                      </span>

                    </div>

                  </div>

                </div>

                {isExpanded ? (
                  <ChevronDown className="h-5 w-5 text-slate-400" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-slate-400" />
                )}

              </button>

              {/* COURSE TABLE */}

              {isExpanded && (

                <div className="border-t border-slate-200">

                  {programmeCourses.length === 0 ? (

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

                      <table className="w-full min-w-[950px]">

                        <thead className="bg-slate-50">

                          <tr className="border-b border-slate-200">

                            <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                              Course
                            </th>

                            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                              Department
                            </th>

                            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                              Level
                            </th>

                            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                              Semester
                            </th>

                            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                              Credits
                            </th>

                            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                              Type
                            </th>

                            <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                              Status
                            </th>

                            <th className="px-5 py-3 text-right text-[10px] font-bold uppercase tracking-wider text-slate-500">
                              Actions
                            </th>

                          </tr>

                        </thead>

                        <tbody className="divide-y divide-slate-100">

                          {programmeCourses.map((course) => (

                            <tr
                              key={course.id}
                              className="hover:bg-slate-50"
                            >

                              <td className="px-5 py-4">

                                <div>
                                  <p className="text-sm font-bold text-[#081022]">
                                    {course.code}
                                  </p>

                                  <p className="mt-1 text-xs text-slate-500">
                                    {course.title}
                                  </p>
                                </div>

                              </td>

                              <td className="px-4 py-4 text-sm text-slate-600">
                                {course.department}
                              </td>

                              <td className="px-4 py-4">

                                <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                                  {course.level} Level
                                </span>

                              </td>

                              <td className="px-4 py-4 text-sm text-slate-600">
                                {course.semester}
                              </td>

                              <td className="px-4 py-4">

                                <span className="font-bold text-[#081022]">
                                  {course.credits}
                                </span>

                              </td>

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

                              <td className="px-4 py-4">

                                <span
                                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                                    course.status === "Approved"
                                      ? "bg-emerald-50 text-emerald-700"
                                      : "bg-amber-50 text-amber-700"
                                  }`}
                                >
                                  {course.status}
                                </span>

                              </td>

                              <td className="px-5 py-4">

                                <div className="flex justify-end gap-1">

                                  {course.status === "Draft" && (
                                    <button
                                      title="Approve"
                                      onClick={() =>
                                        approveCourse(course.id)
                                      }
                                      className="rounded-lg p-2 text-emerald-600 hover:bg-emerald-50"
                                    >
                                      <Check className="h-4 w-4" />
                                    </button>
                                  )}

                                  <button
                                    title="Edit"
                                    onClick={() =>
                                      setEditingCourse(course)
                                    }
                                    className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-[#081022]"
                                  >
                                    <Edit3 className="h-4 w-4" />
                                  </button>

                                  <button
                                    title="Delete"
                                    onClick={() =>
                                      deleteCourse(course.id)
                                    }
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

      {/* ADD COURSE MODAL */}

      {(showAddModal || editingCourse) && (
        <CourseModal
          course={editingCourse}
          programmes={programmes}
          onClose={() => {
            setShowAddModal(false);
            setEditingCourse(null);
          }}
          onSave={(course) => {

            if (editingCourse) {
              setCourses((current) =>
                current.map((item) =>
                  item.id === course.id ? course : item
                )
              );
            } else {
              setCourses((current) => [
                ...current,
                {
                  ...course,
                  id: String(Date.now()),
                },
              ]);
            }

            setShowAddModal(false);
            setEditingCourse(null);
          }}
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

          <span className="text-2xl font-black text-[#081022]">
            {value}
          </span>

        </div>

        <p className="mt-4 text-sm font-bold text-[#081022]">
          {label}
        </p>

        <p className="mt-1 text-xs text-slate-500">
          {description}
        </p>

      </CardContent>
    </Card>
  );
}

/* ================================================================
   COURSE MODAL
================================================================ */

function CourseModal({
  course,
  programmes,
  onClose,
  onSave,
}: {
  course: Course | null;
  programmes: string[];
  onClose: () => void;
  onSave: (course: Course) => void;
}) {
  const [form, setForm] = useState<Course>(
    course || {
      id: "",
      code: "",
      title: "",
      programme: programmes[0] || "",
      department: "",
      level: "100",
      semester: "First Semester",
      credits: 3,
      type: "Compulsory",
      status: "Draft",
    }
  );

  const update = <K extends keyof Course>(
    key: K,
    value: Course[K]
  ) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (
      !form.code.trim() ||
      !form.title.trim() ||
      !form.programme.trim() ||
      !form.department.trim()
    ) {
      return;
    }

    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">

      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

        {/* MODAL HEADER */}

        <div className="flex items-center justify-between border-b border-slate-200 p-5">

          <div>
            <h2 className="text-lg font-bold text-[#081022]">
              {course ? "Edit Course" : "Add Course"}
            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Configure the course within the institution's curriculum.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-100"
          >
            <X className="h-5 w-5" />
          </button>

        </div>

        {/* FORM */}

        <form onSubmit={handleSubmit} className="space-y-5 p-5">

          <div className="grid gap-4 sm:grid-cols-2">

            <FormField label="Course Code">
              <input
                value={form.code}
                onChange={(event) =>
                  update("code", event.target.value.toUpperCase())
                }
                placeholder="e.g. CSC101"
                className="form-input"
                required
              />
            </FormField>

            <FormField label="Course Title">
              <input
                value={form.title}
                onChange={(event) =>
                  update("title", event.target.value)
                }
                placeholder="e.g. Introduction to Computer Science"
                className="form-input"
                required
              />
            </FormField>

            <FormField label="Programme">
              <select
                value={form.programme}
                onChange={(event) =>
                  update("programme", event.target.value)
                }
                className="form-input"
              >
                {programmes.map((programme) => (
                  <option key={programme}>{programme}</option>
                ))}
              </select>
            </FormField>

            <FormField label="Department">
              <input
                value={form.department}
                onChange={(event) =>
                  update("department", event.target.value)
                }
                placeholder="e.g. Computing"
                className="form-input"
                required
              />
            </FormField>

            <FormField label="Level">
              <select
                value={form.level}
                onChange={(event) =>
                  update("level", event.target.value)
                }
                className="form-input"
              >
                <option>100</option>
                <option>200</option>
                <option>300</option>
                <option>400</option>
                <option>500</option>
              </select>
            </FormField>

            <FormField label="Semester">
              <select
                value={form.semester}
                onChange={(event) =>
                  update("semester", event.target.value)
                }
                className="form-input"
              >
                <option>First Semester</option>
                <option>Second Semester</option>
              </select>
            </FormField>

            <FormField label="Credit Units">
              <input
                type="number"
                min="1"
                max="12"
                value={form.credits}
                onChange={(event) =>
                  update(
                    "credits",
                    Number(event.target.value)
                  )
                }
                className="form-input"
              />
            </FormField>

            <FormField label="Course Type">
              <select
                value={form.type}
                onChange={(event) =>
                  update(
                    "type",
                    event.target.value as Course["type"]
                  )
                }
                className="form-input"
              >
                <option>Compulsory</option>
                <option>Elective</option>
              </select>
            </FormField>

          </div>

          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">

            <div className="flex gap-3">

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-blue-700">
                <BookOpen className="h-4 w-4" />
              </div>

              <div>

                <p className="text-sm font-bold text-blue-900">
                  Curriculum placement
                </p>

                <p className="mt-1 text-xs leading-5 text-blue-700">
                  This course will appear under the selected programme,
                  academic level and semester. Students enrolled in the
                  programme can then see the course in their academic
                  structure.
                </p>

              </div>

            </div>

          </div>

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">

            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="bg-[#006dcc] text-white hover:bg-[#005ca8]"
            >
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

      <span className="text-xs font-bold text-slate-700">
        {label}
      </span>

      {children}

    </label>
  );
}