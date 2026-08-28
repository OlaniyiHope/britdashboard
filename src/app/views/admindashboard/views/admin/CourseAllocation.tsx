import { useEffect, useMemo, useState } from "react";

import {
  BookOpen,
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

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5001";

/* ================================================================
   TYPES
================================================================ */

type Department = {
  _id: string;
  name: string;
  code?: string;
};

type Programme = {
  _id: string;
  name: string;
  code: string;
  department?: string | Department;
};

type Course = {
  _id: string;
  code: string;
  title: string;

  programme:
    | string
    | Programme;

  department?:
    | string
    | Department;

  level:
    | "ND 1"
    | "ND 2"
    | "HND 1"
    | "HND 2"
    | string;

  semester:
    | "First Semester"
    | "Second Semester"
    | string;

  credits: number;

  type:
    | "Compulsory"
    | "Elective"
    | string;

  status:
    | "Approved"
    | "Draft"
    | "Inactive"
    | string;
};

type Staff = {
  _id: string;

  firstName?: string;
  lastName?: string;

  name?: string;

  username?: string;

  email?: string;

  role?: string;
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

  staff:
    | string
    | Staff;

  course:
    | string
    | Course;

  programme:
    | string
    | Programme;

  level: string;

  semester: string;

  academicSession:
    | string
    | AcademicSession;

  status:
    | "Active"
    | "Inactive"
    | string;

  createdAt?: string;
  updatedAt?: string;
};

type AllocationForm = {
  staff: string;

  course: string;

  programme: string;

  academicSession: string;

  status: "Active" | "Inactive";
};

/* ================================================================
   COMPONENT
================================================================ */

export default function CourseAllocation() {
  const [allocations, setAllocations] =
    useState<CourseAllocation[]>([]);

  const [staff, setStaff] =
    useState<Staff[]>([]);

  const [courses, setCourses] =
    useState<Course[]>([]);

  const [programmes, setProgrammes] =
    useState<Programme[]>([]);

  const [academicSessions, setAcademicSessions] =
    useState<AcademicSession[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [search, setSearch] =
    useState("");

  const [staffFilter, setStaffFilter] =
    useState("All");

  const [programmeFilter, setProgrammeFilter] =
    useState("All");

  const [sessionFilter, setSessionFilter] =
    useState("All");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [showModal, setShowModal] =
    useState(false);

  const [editingAllocation, setEditingAllocation] =
    useState<CourseAllocation | null>(null);

  /* ================================================================
     HELPERS
  ================================================================ */

  const getId = (
    value:
      | string
      | { _id: string }
      | null
      | undefined
  ) => {
    if (!value) return "";

    if (typeof value === "string") {
      return value;
    }

    return value._id;
  };

  /* ================================================================
     STAFF NAME
  ================================================================ */

  const getStaffName = (
    value:
      | string
      | Staff
      | null
      | undefined
  ) => {
    if (!value) {
      return "Unknown Staff";
    }

    if (typeof value === "string") {
      const found = staff.find(
        (item) => item._id === value
      );

      if (!found) {
        return "Unknown Staff";
      }

      return (
        `${found.firstName || ""} ${
          found.lastName || ""
        }`.trim() ||
        found.name ||
        found.username ||
        found.email ||
        "Unknown Staff"
      );
    }

    return (
      `${value.firstName || ""} ${
        value.lastName || ""
      }`.trim() ||
      value.name ||
      value.username ||
      value.email ||
      "Unknown Staff"
    );
  };

  /* ================================================================
     COURSE NAME
  ================================================================ */

  const getCourseName = (
    value:
      | string
      | Course
      | null
      | undefined
  ) => {
    if (!value) {
      return "Unknown Course";
    }

    if (typeof value === "string") {
      const found = courses.find(
        (item) => item._id === value
      );

      return found
        ? `${found.code} - ${found.title}`
        : "Unknown Course";
    }

    return `${value.code} - ${value.title}`;
  };

  /* ================================================================
     PROGRAMME NAME
  ================================================================ */

  const getProgrammeName = (
    value:
      | string
      | Programme
      | null
      | undefined
  ) => {
    if (!value) {
      return "Unknown Programme";
    }

    if (typeof value === "string") {
      const found = programmes.find(
        (item) => item._id === value
      );

      return found
        ? `${found.code} - ${found.name}`
        : "Unknown Programme";
    }

    return `${value.code} - ${value.name}`;
  };

  /* ================================================================
     SESSION NAME
  ================================================================ */

  const getSessionName = (
    value:
      | string
      | AcademicSession
      | null
      | undefined
  ) => {
    if (!value) {
      return "Unknown Session";
    }

    if (typeof value === "string") {
      const found =
        academicSessions.find(
          (item) => item._id === value
        );

      if (!found) {
        return value;
      }

      return (
        found.name ||
        found.session ||
        found.title ||
        "Academic Session"
      );
    }

    return (
      value.name ||
      value.session ||
      value.title ||
      "Academic Session"
    );
  };

  /* ================================================================
     FETCH STAFF
  ================================================================ */

/* ================================================================
   FETCH STAFF / LECTURERS
================================================================ */

const fetchStaff = async () => {
  try {
    // Get the JWT token used by your login system


      const token =
  localStorage.getItem("jwtToken");

    const response = await fetch(
      `${API_BASE_URL}/api/staff`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",

          ...(token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {}),
        },
      }
    );

    const data = await response.json();

    console.log("STAFF API RESPONSE:", data);

    if (!response.ok) {
      throw new Error(
        data.message ||
          `Failed to load staff (${response.status})`
      );
    }

    /*
      Your getAllStaff controller may return:

      [
        {...},
        {...}
      ]

      OR

      {
        staff: [...]
      }

      OR

      {
        data: [...]
      }
    */

    const users =
      Array.isArray(data)
        ? data
        : Array.isArray(data.staff)
        ? data.staff
        : Array.isArray(data.users)
        ? data.users
        : Array.isArray(data.data)
        ? data.data
        : [];

    console.log("STAFF LIST:", users);

    /*
      Only keep actual lecturers/staff.
    */

    const lecturers = users.filter(
      (user: Staff) => {
        if (!user.role) {
          return true;
        }

        const role =
          String(user.role).toLowerCase().trim();

        return (
          role === "staff" ||
          role === "lecturer" ||
          role === "teacher" ||
          role === "academic"
        );
      }
    );

    console.log(
      "FILTERED LECTURERS:",
      lecturers
    );

    setStaff(lecturers);

  } catch (error) {
    console.error(
      "Fetch staff error:",
      error
    );

    setStaff([]);
  }
};

  /* ================================================================
     FETCH COURSES
  ================================================================ */

  const fetchCourses = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/courses`
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load courses"
        );
      }

      const result =
        Array.isArray(data)
          ? data
          : Array.isArray(data.courses)
          ? data.courses
          : Array.isArray(data.data)
          ? data.data
          : [];

      setCourses(result);

    } catch (error) {
      console.error(
        "Fetch courses error:",
        error
      );

      setCourses([]);
    }
  };

  /* ================================================================
     FETCH PROGRAMMES
  ================================================================ */

  const fetchProgrammes = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/programmes`
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load programmes"
        );
      }

      const result =
        Array.isArray(data)
          ? data
          : Array.isArray(data.programmes)
          ? data.programmes
          : Array.isArray(data.data)
          ? data.data
          : [];

      setProgrammes(result);

    } catch (error) {
      console.error(
        "Fetch programmes error:",
        error
      );

      setProgrammes([]);
    }
  };

  /* ================================================================
     FETCH ACADEMIC SESSIONS
  ================================================================ */

/* ================================================================
   FETCH ACADEMIC SESSIONS
================================================================ */

const fetchAcademicSessions = async () => {
  try {
    const token = localStorage.getItem("jwtToken");

    console.log(
      "ACADEMIC SESSION URL:",
      `${API_BASE_URL}/api/sessions`
    );

    console.log(
      "ACADEMIC SESSION TOKEN:",
      token ? "TOKEN EXISTS" : "NO TOKEN"
    );

    const response = await fetch(
      `${API_BASE_URL}/api/sessions`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",

          ...(token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {}),
        },
      }
    );

    const data = await response.json();

    console.log(
      "ACADEMIC SESSION RESPONSE:",
      data
    );

    if (!response.ok) {
      throw new Error(
        data.message ||
          `Failed to load academic sessions (${response.status})`
      );
    }

    /*
      Backend may return:

      [
        {...},
        {...}
      ]

      OR

      {
        sessions: [...]
      }

      OR

      {
        data: [...]
      }
    */

    const result =
      Array.isArray(data)
        ? data
        : Array.isArray(data.sessions)
        ? data.sessions
        : Array.isArray(data.academicSessions)
        ? data.academicSessions
        : Array.isArray(data.data)
        ? data.data
        : [];

    console.log(
      "ACADEMIC SESSION LIST:",
      result
    );

    setAcademicSessions(result);

  } catch (error) {
    console.error(
      "Fetch academic sessions error:",
      error
    );

    setAcademicSessions([]);
  }
};
  /* ================================================================
     FETCH ALLOCATIONS
  ================================================================ */

  const fetchAllocations = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/course-allocations`
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load course allocations"
        );
      }

      const result =
        Array.isArray(data)
          ? data
          : Array.isArray(
              data.allocations
            )
          ? data.allocations
          : Array.isArray(data.data)
          ? data.data
          : [];

      setAllocations(result);

    } catch (error) {
      console.error(
        "Fetch allocations error:",
        error
      );

      setAllocations([]);

    } finally {
      setLoading(false);
    }
  };

  /* ================================================================
     LOAD EVERYTHING
  ================================================================ */

  useEffect(() => {
    const loadData =
      async () => {
        setLoading(true);

        await Promise.all([
          fetchStaff(),
          fetchCourses(),
          fetchProgrammes(),
          fetchAcademicSessions(),
          fetchAllocations(),
        ]);
      };

    loadData();
  }, []);

  /* ================================================================
     FILTER ALLOCATIONS
  ================================================================ */

  const filteredAllocations =
    useMemo(() => {
      const searchValue =
        search
          .toLowerCase()
          .trim();

      return allocations.filter(
        (allocation) => {
          const staffName =
            getStaffName(
              allocation.staff
            );

          const courseName =
            getCourseName(
              allocation.course
            );

          const programmeName =
            getProgrammeName(
              allocation.programme
            );

          const sessionName =
            getSessionName(
              allocation.academicSession
            );

          const searchMatch =
            staffName
              .toLowerCase()
              .includes(searchValue) ||
            courseName
              .toLowerCase()
              .includes(searchValue) ||
            programmeName
              .toLowerCase()
              .includes(searchValue) ||
            allocation.level
              ?.toLowerCase()
              .includes(searchValue) ||
            allocation.semester
              ?.toLowerCase()
              .includes(searchValue) ||
            sessionName
              .toLowerCase()
              .includes(searchValue);

          const staffMatch =
            staffFilter === "All" ||
            getId(
              allocation.staff
            ) === staffFilter;

          const programmeMatch =
            programmeFilter ===
              "All" ||
            getId(
              allocation.programme
            ) === programmeFilter;

          const sessionMatch =
            sessionFilter ===
              "All" ||
            getId(
              allocation.academicSession
            ) === sessionFilter;

          const statusMatch =
            statusFilter ===
              "All" ||
            allocation.status ===
              statusFilter;

          return (
            searchMatch &&
            staffMatch &&
            programmeMatch &&
            sessionMatch &&
            statusMatch
          );
        }
      );
    }, [
      allocations,
      staff,
      courses,
      programmes,
      academicSessions,
      search,
      staffFilter,
      programmeFilter,
      sessionFilter,
      statusFilter,
    ]);

  /* ================================================================
     STATISTICS
  ================================================================ */

  const totalAllocations =
    allocations.length;

  const activeAllocations =
    allocations.filter(
      (item) =>
        item.status === "Active"
    ).length;

  const inactiveAllocations =
    allocations.filter(
      (item) =>
        item.status === "Inactive"
    ).length;

  const assignedStaff =
    new Set(
      allocations.map((item) =>
        getId(item.staff)
      )
    ).size;

  const assignedCourses =
    new Set(
      allocations.map((item) =>
        getId(item.course)
      )
    ).size;

  /* ================================================================
     SAVE ALLOCATION
  ================================================================ */

  const saveAllocation =
    async (
      form: AllocationForm
    ) => {
      try {
        setSaving(true);

        const isEditing =
          Boolean(editingAllocation);

        const url = isEditing
          ? `${API_BASE_URL}/api/course-allocations/${editingAllocation?._id}`
          : `${API_BASE_URL}/api/course-allocations`;

        const response =
          await fetch(url, {
            method: isEditing
              ? "PUT"
              : "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              form
            ),
          });

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to save course allocation"
          );
        }

        await fetchAllocations();

        setShowModal(false);
        setEditingAllocation(null);

      } catch (error) {
        console.error(
          "Save allocation error:",
          error
        );

        alert(
          error instanceof Error
            ? error.message
            : "Failed to save course allocation"
        );

      } finally {
        setSaving(false);
      }
    };

  /* ================================================================
     DELETE ALLOCATION
  ================================================================ */

  const deleteAllocation =
    async (
      allocation: CourseAllocation
    ) => {
      const confirmed =
        window.confirm(
          `Remove ${getCourseName(
            allocation.course
          )} from ${getStaffName(
            allocation.staff
          )}?`
        );

      if (!confirmed) {
        return;
      }

      try {
        const response =
          await fetch(
            `${API_BASE_URL}/api/course-allocations/${allocation._id}`,
            {
              method: "DELETE",
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to delete allocation"
          );
        }

        await fetchAllocations();

      } catch (error) {
        console.error(
          "Delete allocation error:",
          error
        );

        alert(
          error instanceof Error
            ? error.message
            : "Failed to delete allocation"
        );
      }
    };

  /* ================================================================
     EDIT
  ================================================================ */

  const openEditModal = (
    allocation: CourseAllocation
  ) => {
    setEditingAllocation(
      allocation
    );

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

          <p className="text-sm text-slate-500">
            Loading course allocations...
          </p>
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

            <h1 className="mt-2 text-2xl font-bold md:text-3xl">
              Course Allocation
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-slate-300">
              Assign curriculum courses to
              lecturers and academic staff for
              each academic session.
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
            Search and filter lecturer course
            assignments.
          </p>

        </CardHeader>

        <CardContent className="space-y-4 p-4">

          {/* SEARCH */}

          <div className="relative">

            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

            <input
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              placeholder="Search lecturer, course, programme, level or session..."
              className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-4 text-sm outline-none focus:border-[#006dcc] focus:ring-2 focus:ring-blue-100"
            />

          </div>

          {/* FILTERS */}

          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">

            <select
              value={staffFilter}
              onChange={(event) =>
                setStaffFilter(
                  event.target.value
                )
              }
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#006dcc]"
            >

              <option value="All">
                All Staff
              </option>

              {staff.map((item) => (
                <option
                  key={item._id}
                  value={item._id}
                >
                  {getStaffName(item)}
                </option>
              ))}

            </select>

            <select
              value={programmeFilter}
              onChange={(event) =>
                setProgrammeFilter(
                  event.target.value
                )
              }
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#006dcc]"
            >

              <option value="All">
                All Programmes
              </option>

              {programmes.map(
                (programme) => (
                  <option
                    key={
                      programme._id
                    }
                    value={
                      programme._id
                    }
                  >
                    {programme.code} -{" "}
                    {programme.name}
                  </option>
                )
              )}

            </select>

            <select
              value={sessionFilter}
              onChange={(event) =>
                setSessionFilter(
                  event.target.value
                )
              }
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#006dcc]"
            >

              <option value="All">
                All Academic Sessions
              </option>

              {academicSessions.map(
                (session) => (
                  <option
                    key={
                      session._id
                    }
                    value={
                      session._id
                    }
                  >
                    {getSessionName(
                      session
                    )}
                  </option>
                )
              )}

            </select>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value
                )
              }
              className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#006dcc]"
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

        </CardContent>

      </Card>

      {/* TABLE */}

      <Card className="overflow-hidden border-none bg-white shadow-sm ring-1 ring-slate-200">

        <CardContent className="p-0">

          {filteredAllocations.length ===
          0 ? (

            <div className="px-5 py-16 text-center">

              <ClipboardCheck className="mx-auto h-10 w-10 text-slate-300" />

              <p className="mt-4 text-sm font-bold text-slate-700">
                No course allocations found
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Assign a course to a lecturer
                to see it here.
              </p>

              <Button
                onClick={() => {
                  setEditingAllocation(
                    null
                  );
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

                    <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Lecturer
                    </th>

                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Course
                    </th>

                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Programme
                    </th>

                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Level
                    </th>

                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Semester
                    </th>

                    <th className="px-4 py-3 text-left text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Session
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

                  {filteredAllocations.map(
                    (allocation) => (

                      <tr
                        key={
                          allocation._id
                        }
                        className="hover:bg-slate-50"
                      >

                        {/* STAFF */}

                        <td className="px-5 py-4">

                          <div className="flex items-center gap-3">

                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-700">

                              <UserRound className="h-4 w-4" />

                            </div>

                            <div>

                              <p className="text-sm font-bold text-[#081022]">
                                {getStaffName(
                                  allocation.staff
                                )}
                              </p>

                              {typeof allocation.staff !==
                                "string" &&
                                allocation.staff
                                  ?.email && (

                                <p className="mt-0.5 text-xs text-slate-500">
                                  {
                                    allocation
                                      .staff
                                      .email
                                  }
                                </p>

                              )}

                            </div>

                          </div>

                        </td>

                        {/* COURSE */}

                        <td className="px-4 py-4">

                          <p className="text-sm font-bold text-[#081022]">
                            {typeof allocation.course !==
                            "string"
                              ? allocation
                                  .course
                                  ?.code
                              : getCourseName(
                                  allocation.course
                                )}
                          </p>

                          {typeof allocation.course !==
                            "string" && (

                            <p className="mt-1 text-xs text-slate-500">
                              {
                                allocation
                                  .course
                                  ?.title
                              }
                            </p>

                          )}

                        </td>

                        {/* PROGRAMME */}

                        <td className="px-4 py-4">

                          <span className="text-sm text-slate-600">
                            {getProgrammeName(
                              allocation.programme
                            )}
                          </span>

                        </td>

                        {/* LEVEL */}

                        <td className="px-4 py-4">

                          <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                            {
                              allocation.level
                            }
                          </span>

                        </td>

                        {/* SEMESTER */}

                        <td className="px-4 py-4 text-sm text-slate-600">
                          {
                            allocation.semester
                          }
                        </td>

                        {/* SESSION */}

                        <td className="px-4 py-4 text-sm text-slate-600">
                          {getSessionName(
                            allocation.academicSession
                          )}
                        </td>

                        {/* STATUS */}

                        <td className="px-4 py-4">

                          <span
                            className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                              allocation.status ===
                              "Active"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {
                              allocation.status
                            }
                          </span>

                        </td>

                        {/* ACTIONS */}

                        <td className="px-5 py-4">

                          <div className="flex justify-end gap-1">

                            <button
                              title="Edit Allocation"
                              onClick={() =>
                                openEditModal(
                                  allocation
                                )
                              }
                              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-[#081022]"
                            >

                              <Edit3 className="h-4 w-4" />

                            </button>

                            <button
                              title="Delete Allocation"
                              onClick={() =>
                                deleteAllocation(
                                  allocation
                                )
                              }
                              className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                            >

                              <Trash2 className="h-4 w-4" />

                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          )}

        </CardContent>

      </Card>

      {/* MODAL */}

      {showModal && (

        <AllocationModal
          allocation={
            editingAllocation
          }
          staff={staff}
          courses={courses}
          programmes={programmes}
          academicSessions={
            academicSessions
          }
          saving={saving}
          onClose={() => {
            setShowModal(false);
            setEditingAllocation(
              null
            );
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
   ALLOCATION MODAL
================================================================ */
function AllocationModal({
  allocation,
  staff,
  courses,
  programmes,
  academicSessions,
  saving,
  onClose,
  onSave,
}: {
  allocation:
    | CourseAllocation
    | null;

  staff: Staff[];

  courses: Course[];

  programmes: Programme[];

  academicSessions:
    AcademicSession[];

  saving: boolean;

  onClose: () => void;

  onSave: (
    form: AllocationForm
  ) => void;
}) {
  /* ================================================================
     GET ID
  ================================================================ */

  const getId = (
    value:
      | string
      | { _id: string }
      | null
      | undefined
  ) => {
    if (!value) return "";

    return typeof value === "string"
      ? value
      : value._id;
  };

  /* ================================================================
     FORM
  ================================================================ */

  const [form, setForm] =
    useState<AllocationForm>({
      staff: getId(
        allocation?.staff
      ),

      course: getId(
        allocation?.course
      ),

      programme: getId(
        allocation?.programme
      ),

      academicSession: getId(
        allocation?.academicSession
      ),

      status:
        allocation?.status ===
        "Inactive"
          ? "Inactive"
          : "Active",
    });

  /* ================================================================
     UPDATE FORM
  ================================================================ */

  const update = <
    K extends keyof AllocationForm
  >(
    key: K,
    value: AllocationForm[K]
  ) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  /* ================================================================
     SELECTED PROGRAMME
  ================================================================ */

  const selectedProgramme =
    programmes.find(
      (programme) =>
        programme._id ===
        form.programme
    );

  /* ================================================================
     FILTER COURSES BY PROGRAMME
  ================================================================ */

  const programmeCourses =
    courses.filter((course) => {
      const courseProgrammeId =
        getId(course.programme);

      return (
        courseProgrammeId ===
        form.programme
      );
    });

  /* ================================================================
     SELECTED COURSE
  ================================================================ */

  const selectedCourse =
    courses.find(
      (course) =>
        course._id ===
        form.course
    );

  /* ================================================================
     APPROVED COURSES
  ================================================================ */

  const approvedCourses =
    programmeCourses.filter(
      (course) =>
        course.status !==
        "Inactive"
    );

  /* ================================================================
     HANDLE PROGRAMME CHANGE
  ================================================================ */

  const handleProgrammeChange = (
    value: string
  ) => {
    setForm((current) => ({
      ...current,

      programme: value,

      // Clear course because
      // courses belong to programme
      course: "",
    }));
  };

  /* ================================================================
     HANDLE SUBMIT
  ================================================================ */

  const handleSubmit = (
    event: React.FormEvent
  ) => {
    event.preventDefault();

    if (!form.staff) {
      alert(
        "Please select a lecturer/staff member."
      );
      return;
    }

    if (!form.programme) {
      alert(
        "Please select a programme."
      );
      return;
    }

    if (!form.course) {
      alert(
        "Please select a course."
      );
      return;
    }

    if (!form.academicSession) {
      alert(
        "Please select an academic session."
      );
      return;
    }

    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">

      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

        {/* ============================================================
           HEADER
        ============================================================ */}

        <div className="flex items-center justify-between border-b border-slate-200 p-5">

          <div>

            <h2 className="text-lg font-bold text-[#081022]">

              {allocation
                ? "Edit Course Allocation"
                : "Assign Course"}

            </h2>

            <p className="mt-1 text-xs text-slate-500">
              Assign a curriculum course to
              a lecturer for an academic
              session.
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

        {/* ============================================================
           FORM
        ============================================================ */}

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-5"
        >

          <div className="grid gap-4 sm:grid-cols-2">

            {/* ========================================================
               STAFF
            ======================================================== */}

            <FormField label="Lecturer / Staff *">

              <select
                value={form.staff}
                onChange={(event) =>
                  update(
                    "staff",
                    event.target.value
                  )
                }
                className="form-input"
              >

                <option value="">
                  Select Lecturer
                </option>

                {staff.map((item) => (
                  <option
                    key={item._id}
                    value={item._id}
                  >
                    {`${item.firstName || ""} ${
                      item.lastName || ""
                    }`.trim() ||
                      item.name ||
                      item.username ||
                      item.email}
                  </option>
                ))}

              </select>

            </FormField>

            {/* ========================================================
               PROGRAMME
            ======================================================== */}

            <FormField label="Programme *">

              <select
                value={form.programme}
                onChange={(event) =>
                  handleProgrammeChange(
                    event.target.value
                  )
                }
                className="form-input"
              >

                <option value="">
                  Select Programme
                </option>

                {programmes.map(
                  (programme) => (
                    <option
                      key={
                        programme._id
                      }
                      value={
                        programme._id
                      }
                    >
                      {programme.code
                        ? `${programme.code} - ${programme.name}`
                        : programme.name}
                    </option>
                  )
                )}

              </select>

            </FormField>

            {/* ========================================================
               COURSE
            ======================================================== */}

            <FormField label="Course *">

              <select
                value={form.course}
                onChange={(event) =>
                  update(
                    "course",
                    event.target.value
                  )
                }
                disabled={
                  !form.programme
                }
                className={`form-input ${
                  !form.programme
                    ? "cursor-not-allowed bg-slate-100 text-slate-400"
                    : ""
                }`}
              >

                <option value="">
                  {!form.programme
                    ? "Select programme first"
                    : "Select Course"}
                </option>

                {approvedCourses.map(
                  (course) => (
                    <option
                      key={
                        course._id
                      }
                      value={
                        course._id
                      }
                    >
                      {course.code} -{" "}
                      {course.title}
                    </option>
                  )
                )}

              </select>

              {/* COURSE COUNT */}

              {form.programme && (
                <p className="mt-1 text-[11px] text-slate-400">
                  {approvedCourses.length}{" "}
                  course
                  {approvedCourses.length !==
                  1
                    ? "s"
                    : ""}{" "}
                  available for this
                  programme
                </p>
              )}

            </FormField>

            {/* ========================================================
               LEVEL
            ======================================================== */}

            <FormField label="Level">

              <input
                value={
                  selectedCourse?.level ||
                  ""
                }
                disabled
                placeholder={
                  selectedCourse
                    ? ""
                    : "Automatically selected from course"
                }
                className="form-input bg-slate-100 text-slate-500"
              />

            </FormField>

            {/* ========================================================
               SEMESTER
            ======================================================== */}

            <FormField label="Semester">

              <input
                value={
                  selectedCourse
                    ?.semester || ""
                }
                disabled
                placeholder={
                  selectedCourse
                    ? ""
                    : "Automatically selected from course"
                }
                className="form-input bg-slate-100 text-slate-500"
              />

            </FormField>

            {/* ========================================================
               ACADEMIC SESSION
            ======================================================== */}

            <FormField label="Academic Session *">

              <select
                value={
                  form.academicSession
                }
                onChange={(event) =>
                  update(
                    "academicSession",
                    event.target.value
                  )
                }
                className="form-input"
              >

                <option value="">
                  Select Academic Session
                </option>

                {academicSessions.map(
                  (session) => (
                    <option
                      key={
                        session._id
                      }
                      value={
                        session._id
                      }
                    >
                      {session.name ||
                        session.session ||
                        session.title ||
                        "Academic Session"}
                    </option>
                  )
                )}

              </select>

            </FormField>

            {/* ========================================================
               STATUS
            ======================================================== */}

            <FormField label="Status">

              <select
                value={form.status}
                onChange={(event) =>
                  update(
                    "status",
                    event.target
                      .value as
                      | "Active"
                      | "Inactive"
                  )
                }
                className="form-input"
              >

                <option value="Active">
                  Active
                </option>

                <option value="Inactive">
                  Inactive
                </option>

              </select>

            </FormField>

          </div>

          {/* ==========================================================
             SELECTED PROGRAMME INFORMATION
          ========================================================== */}

          {selectedProgramme && (
            <div className="rounded-xl border border-indigo-100 bg-indigo-50 p-4">

              <div className="flex gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-indigo-700">

                  <GraduationCap className="h-4 w-4" />

                </div>

                <div>

                  <p className="text-sm font-bold text-indigo-900">
                    Selected Programme
                  </p>

                  <p className="mt-1 text-xs text-indigo-700">

                    <strong>
                      {selectedProgramme.code}
                    </strong>{" "}
                    —{" "}
                    {
                      selectedProgramme.name
                    }

                  </p>

                  <p className="mt-1 text-xs text-indigo-600">

                    {approvedCourses.length}{" "}
                    available course
                    {approvedCourses.length !==
                    1
                      ? "s"
                      : ""}{" "}
                    for this programme.

                  </p>

                </div>

              </div>

            </div>
          )}

          {/* ==========================================================
             COURSE INFORMATION
          ========================================================== */}

          {selectedCourse && (
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">

              <div className="flex gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-blue-700">

                  <BookOpen className="h-4 w-4" />

                </div>

                <div>

                  <p className="text-sm font-bold text-blue-900">
                    Course assignment
                  </p>

                  <p className="mt-1 text-xs leading-5 text-blue-700">

                    <strong>
                      {
                        selectedCourse.code
                      }
                    </strong>{" "}
                    —{" "}
                    {
                      selectedCourse.title
                    }{" "}
                    will be assigned to the
                    selected lecturer for{" "}
                    <strong>
                      {
                        selectedCourse.level
                      }
                    </strong>{" "}
                    /
                    <strong>
                      {" "}
                      {
                        selectedCourse.semester
                      }
                    </strong>
                    .

                  </p>

                  <p className="mt-1 text-xs text-blue-600">

                    {selectedCourse.credits}{" "}
                    credit unit
                    {selectedCourse.credits !==
                    1
                      ? "s"
                      : ""}

                  </p>

                </div>

              </div>

            </div>
          )}

          {/* ==========================================================
             NO COURSES
          ========================================================== */}

          {form.programme &&
            approvedCourses.length ===
              0 && (
              <div className="rounded-xl border border-amber-100 bg-amber-50 p-4">

                <p className="text-sm font-bold text-amber-800">
                  No courses found
                </p>

                <p className="mt-1 text-xs text-amber-700">
                  There are currently no active
                  courses assigned to this
                  programme.
                </p>

              </div>
            )}

          {/* ==========================================================
             FOOTER
          ========================================================== */}

          <div className="flex justify-end gap-3 border-t border-slate-200 pt-5">

            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={saving}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={
                saving ||
                staff.length === 0 ||
                courses.length === 0 ||
                programmes.length ===
                  0 ||
                academicSessions.length ===
                  0
              }
              className="bg-[#006dcc] text-white hover:bg-[#005ca8]"
            >

              {saving && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}

              {allocation
                ? "Save Changes"
                : "Assign Course"}

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