import { useEffect, useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  Eye,
  BookOpen,
  GraduationCap,
  CalendarDays,
  Layers3,
  Clock3,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";


// ============================================================
// API
// ============================================================

const API_BASE_URL =
  import.meta.env.VITE_NODE_API_URL ||
  "http://localhost:5001";


// ============================================================
// TYPES
// ============================================================

interface Course {
  _id: string;
  code?: string;
  title?: string;
  credits?: number;
}

interface Programme {
  _id: string;
  name?: string;
  code?: string;
}

interface AcademicSession {
  _id: string;
  name?: string;
}

interface Staff {
  _id: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
}

interface CourseAllocation {
  _id: string;
  status: string;

  staff: Staff;

  course: Course;

  programme: Programme;

  level: string;

  semester: string;

  academicSession: AcademicSession;

  createdAt?: string;

  updatedAt?: string;
}


// ============================================================
// TOKEN
// ============================================================

const getToken = () => {
  return localStorage.getItem("jwtToken") || "";
};


// ============================================================
// STATUS BADGE
// ============================================================

function StatusBadge({
  status,
}: {
  status?: string;
}) {
  const normalized =
    String(status || "").toLowerCase();

  if (normalized === "active") {
    return (
      <Badge className="gap-1 bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
        <CheckCircle2 className="h-3 w-3" />
        Active
      </Badge>
    );
  }

  if (normalized === "pending") {
    return (
      <Badge className="gap-1 bg-amber-100 text-amber-700 hover:bg-amber-100">
        <Clock3 className="h-3 w-3" />
        Pending
      </Badge>
    );
  }

  if (
    normalized === "inactive" ||
    normalized === "cancelled"
  ) {
    return (
      <Badge className="gap-1 bg-red-100 text-red-700 hover:bg-red-100">
        <AlertCircle className="h-3 w-3" />
        {status}
      </Badge>
    );
  }

  return (
    <Badge variant="outline">
      {status || "Unknown"}
    </Badge>
  );
}


// ============================================================
// COMPONENT
// ============================================================

export default function MyCourses() {

  // ==========================================================
  // STATE
  // ==========================================================

  const [allocations, setAllocations] =
    useState<CourseAllocation[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [selectedCourse, setSelectedCourse] =
    useState<CourseAllocation | null>(null);


  // ==========================================================
  // FETCH MY COURSES
  // ==========================================================

  const fetchMyCourses = async (
    showRefresh = false
  ) => {

    try {

      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const token = getToken();

      if (!token) {
        throw new Error(
          "You are not logged in."
        );
      }

      const response = await fetch(
        `${API_BASE_URL}/api/course-allocations/my`,
        {
          method: "GET",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
          "Failed to load your courses."
        );
      }

      setAllocations(
        Array.isArray(data?.allocations)
          ? data.allocations
          : []
      );

    } catch (err: any) {

      console.error(
        "My courses error:",
        err
      );

      setError(
        err?.message ||
        "Failed to load your courses."
      );

    } finally {

      setLoading(false);
      setRefreshing(false);

    }
  };


  // ==========================================================
  // INITIAL LOAD
  // ==========================================================

  useEffect(() => {
    fetchMyCourses();
  }, []);


  // ==========================================================
  // FILTER COURSES
  // ==========================================================

  const filteredCourses =
    useMemo(() => {

      const value =
        search.trim().toLowerCase();

      if (!value) {
        return allocations;
      }

      return allocations.filter(
        (allocation) => {

          const searchableText = [

            allocation.course?.code,

            allocation.course?.title,

            allocation.programme?.name,

            allocation.programme?.code,

            allocation.level,

            allocation.semester,

            allocation.academicSession?.name,

            allocation.status,

          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

          return searchableText.includes(value);
        }
      );

    }, [allocations, search]);


  // ==========================================================
  // STATISTICS
  // ==========================================================

  const totalCourses =
    allocations.length;

  const activeCourses =
    allocations.filter(
      (course) =>
        String(course.status).toLowerCase() ===
        "active"
    ).length;

  const programmeCount =
    new Set(
      allocations
        .map(
          (course) =>
            course.programme?._id
        )
        .filter(Boolean)
    ).size;

  const levelCount =
    new Set(
      allocations
        .map(
          (course) =>
            course.level
        )
        .filter(Boolean)
    ).size;


  // ==========================================================
  // FORMAT DATE
  // ==========================================================

  const formatDate = (
    date?: string
  ) => {

    if (!date) {
      return "Not available";
    }

    const parsed =
      new Date(date);

    if (
      Number.isNaN(
        parsed.getTime()
      )
    ) {
      return "Not available";
    }

    return parsed.toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };


  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {

    return (
      <div className="min-h-full bg-slate-50 p-4 md:p-6">

        <div className="mx-auto max-w-7xl">

          <div className="flex min-h-[500px] items-center justify-center">

            <div className="text-center">

              <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-[#006dcc]" />

              <p className="mt-4 text-sm font-medium text-slate-500">
                Loading your courses...
              </p>

            </div>

          </div>

        </div>

      </div>
    );
  }


  // ==========================================================
  // ERROR
  // ==========================================================

  if (error) {

    return (
      <div className="min-h-full bg-slate-50 p-4 md:p-6">

        <div className="mx-auto max-w-7xl">

          <Card className="border-none bg-white shadow-sm ring-1 ring-red-200">

            <CardContent className="flex min-h-[350px] items-center justify-center">

              <div className="max-w-md text-center">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50">

                  <AlertCircle className="h-7 w-7 text-red-500" />

                </div>

                <h2 className="mt-4 text-lg font-bold text-[#081022]">
                  Unable to load your courses
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  {error}
                </p>

                <Button
                  className="mt-5 bg-[#006dcc] hover:bg-[#005ca8]"
                  onClick={() =>
                    fetchMyCourses()
                  }
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>

              </div>

            </CardContent>

          </Card>

        </div>

      </div>
    );
  }


  // ==========================================================
  // PAGE
  // ==========================================================

  return (

    <div className="min-h-full space-y-6 bg-slate-50 p-4 md:p-6">

      <div className="mx-auto max-w-7xl space-y-6">


        {/* ====================================================
            HEADER
        ==================================================== */}

        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

          <div>

            <p className="text-xs font-semibold uppercase tracking-wider text-[#006dcc]">
              Staff Portal
            </p>

            <h1 className="mt-1 text-2xl font-black tracking-tight text-[#081022] md:text-3xl">
              My Courses
            </h1>

            <p className="mt-1 max-w-2xl text-sm text-slate-500">
              View the courses assigned to you by the
              administrator for the current academic session.
            </p>

          </div>


          <Button
            variant="outline"
            onClick={() =>
              fetchMyCourses(true)
            }
            disabled={refreshing}
            className="w-fit bg-white"
          >

            <RefreshCw
              className={`mr-2 h-4 w-4 ${
                refreshing
                  ? "animate-spin"
                  : ""
              }`}
            />

            {refreshing
              ? "Refreshing..."
              : "Refresh"}

          </Button>

        </div>


        {/* ====================================================
            STATISTICS
        ==================================================== */}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">


          {/* TOTAL */}

          <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

            <CardContent className="p-5">

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-xs font-medium text-slate-500">
                    Total Courses
                  </p>

                  <p className="mt-2 text-3xl font-black text-[#081022]">
                    {totalCourses}
                  </p>

                  <p className="mt-1 text-[11px] text-slate-400">
                    Courses allocated to you
                  </p>

                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#006dcc]">

                  <BookOpen className="h-5 w-5" />

                </div>

              </div>

            </CardContent>

          </Card>


          {/* ACTIVE */}

          <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

            <CardContent className="p-5">

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-xs font-medium text-slate-500">
                    Active Courses
                  </p>

                  <p className="mt-2 text-3xl font-black text-[#081022]">
                    {activeCourses}
                  </p>

                  <p className="mt-1 text-[11px] text-slate-400">
                    Currently assigned
                  </p>

                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">

                  <CheckCircle2 className="h-5 w-5" />

                </div>

              </div>

            </CardContent>

          </Card>


          {/* PROGRAMMES */}

          <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

            <CardContent className="p-5">

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-xs font-medium text-slate-500">
                    Programmes
                  </p>

                  <p className="mt-2 text-3xl font-black text-[#081022]">
                    {programmeCount}
                  </p>

                  <p className="mt-1 text-[11px] text-slate-400">
                    Programmes you teach
                  </p>

                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">

                  <GraduationCap className="h-5 w-5" />

                </div>

              </div>

            </CardContent>

          </Card>


          {/* LEVELS */}

          <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

            <CardContent className="p-5">

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-xs font-medium text-slate-500">
                    Levels
                  </p>

                  <p className="mt-2 text-3xl font-black text-[#081022]">
                    {levelCount}
                  </p>

                  <p className="mt-1 text-[11px] text-slate-400">
                    Student levels covered
                  </p>

                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">

                  <Layers3 className="h-5 w-5" />

                </div>

              </div>

            </CardContent>

          </Card>

        </div>


        {/* ====================================================
            COURSE TABLE
        ==================================================== */}

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

          <CardHeader className="border-b border-slate-100">

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              <div>

                <CardTitle className="text-base text-[#081022]">
                  Assigned Courses
                </CardTitle>

                <CardDescription>
                  Courses currently allocated to your staff account.
                </CardDescription>

              </div>


              <div className="relative w-full lg:w-80">

                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />

                <Input
                  className="bg-slate-50 pl-9"
                  placeholder="Search courses..."
                  value={search}
                  onChange={(e) =>
                    setSearch(e.target.value)
                  }
                />

              </div>

            </div>

          </CardHeader>


          <CardContent className="p-0">


            {filteredCourses.length === 0 ? (

              <div className="px-6 py-16 text-center">

                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">

                  <BookOpen className="h-7 w-7 text-slate-400" />

                </div>

                <h3 className="mt-4 text-sm font-bold text-[#081022]">

                  {search
                    ? "No courses found"
                    : "No courses assigned"}

                </h3>

                <p className="mx-auto mt-1 max-w-md text-xs text-slate-400">

                  {search
                    ? "Try changing your search terms."
                    : "You currently have no course allocations. Courses assigned by the administrator will appear here."}

                </p>

              </div>

            ) : (

              <div className="overflow-x-auto">

                <Table>

                  <TableHeader>

                    <TableRow className="bg-slate-50/70">

                      <TableHead>
                        Course
                      </TableHead>

                      <TableHead>
                        Programme
                      </TableHead>

                      <TableHead>
                        Level
                      </TableHead>

                      <TableHead>
                        Semester
                      </TableHead>

                      <TableHead>
                        Session
                      </TableHead>

                      <TableHead>
                        Status
                      </TableHead>

                      <TableHead className="text-right">
                        Action
                      </TableHead>

                    </TableRow>

                  </TableHeader>


                  <TableBody>

                    {filteredCourses.map(
                      (allocation) => (

                        <TableRow
                          key={
                            allocation._id
                          }
                          className="hover:bg-slate-50"
                        >

                          {/* COURSE */}

                          <TableCell>

                            <div className="flex items-center gap-3">

                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-[#006dcc]">

                                <BookOpen className="h-4 w-4" />

                              </div>

                              <div>

                                <p className="font-semibold text-[#081022]">

                                  {allocation.course?.title ||
                                    "Untitled Course"}

                                </p>

                                <p className="mt-0.5 text-xs font-medium text-[#006dcc]">

                                  {allocation.course?.code ||
                                    "N/A"}

                                </p>

                              </div>

                            </div>

                          </TableCell>


                          {/* PROGRAMME */}

                          <TableCell>

                            <div>

                              <p className="text-sm font-medium text-slate-700">

                                {allocation.programme?.name ||
                                  allocation.programme?.code ||
                                  "Not specified"}

                              </p>

                              {allocation.programme?.code &&
                                allocation.programme?.name && (
                                  <p className="text-[11px] text-slate-400">
                                    {
                                      allocation
                                        .programme
                                        .code
                                    }
                                  </p>
                                )}

                            </div>

                          </TableCell>


                          {/* LEVEL */}

                          <TableCell>

                            <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">

                              {allocation.level ||
                                "N/A"}

                            </span>

                          </TableCell>


                          {/* SEMESTER */}

                          <TableCell>

                            <span className="text-sm text-slate-600">

                              {allocation.semester ||
                                "N/A"}

                            </span>

                          </TableCell>


                          {/* SESSION */}

                          <TableCell>

                            <div className="flex items-center gap-2">

                              <CalendarDays className="h-4 w-4 text-slate-400" />

                              <span className="text-sm text-slate-600">

                                {allocation
                                  .academicSession
                                  ?.name ||
                                  "N/A"}

                              </span>

                            </div>

                          </TableCell>


                          {/* STATUS */}

                          <TableCell>

                            <StatusBadge
                              status={
                                allocation.status
                              }
                            />

                          </TableCell>


                          {/* ACTION */}

                          <TableCell className="text-right">

                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                setSelectedCourse(
                                  allocation
                                )
                              }
                            >

                              <Eye className="mr-2 h-4 w-4" />

                              View

                            </Button>

                          </TableCell>

                        </TableRow>

                      )
                    )}

                  </TableBody>

                </Table>

              </div>

            )}

          </CardContent>

        </Card>


        {/* ====================================================
            COURSE CARDS
        ==================================================== */}

        {filteredCourses.length > 0 && (

          <div>

            <div className="mb-4">

              <h2 className="text-base font-bold text-[#081022]">
                Course Overview
              </h2>

              <p className="text-xs text-slate-500">
                Quick overview of your allocated courses.
              </p>

            </div>


            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

              {filteredCourses.map(
                (allocation) => (

                  <Card
                    key={
                      `card-${allocation._id}`
                    }
                    className="border-none bg-white shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md"
                  >

                    <CardContent className="p-5">

                      <div className="flex items-start justify-between gap-3">

                        <div className="flex items-start gap-3">

                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#006dcc]">

                            <BookOpen className="h-5 w-5" />

                          </div>

                          <div>

                            <p className="text-[11px] font-bold uppercase tracking-wide text-[#006dcc]">

                              {allocation.course?.code ||
                                "N/A"}

                            </p>

                            <h3 className="mt-1 text-sm font-bold text-[#081022]">

                              {allocation.course?.title ||
                                "Untitled Course"}

                            </h3>

                          </div>

                        </div>

                        <StatusBadge
                          status={
                            allocation.status
                          }
                        />

                      </div>


                      <div className="mt-5 space-y-3">

                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">

                          <span className="text-xs text-slate-400">
                            Programme
                          </span>

                          <span className="max-w-[60%] text-right text-xs font-semibold text-slate-600">

                            {allocation
                              .programme
                              ?.name ||
                              allocation
                                .programme
                                ?.code ||
                              "N/A"}

                          </span>

                        </div>


                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">

                          <span className="text-xs text-slate-400">
                            Level
                          </span>

                          <span className="text-xs font-semibold text-slate-600">

                            {allocation.level ||
                              "N/A"}

                          </span>

                        </div>


                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">

                          <span className="text-xs text-slate-400">
                            Semester
                          </span>

                          <span className="text-xs font-semibold text-slate-600">

                            {allocation.semester ||
                              "N/A"}

                          </span>

                        </div>


                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">

                          <span className="text-xs text-slate-400">
                            Academic Session
                          </span>

                          <span className="text-xs font-semibold text-slate-600">

                            {allocation
                              .academicSession
                              ?.name ||
                              "N/A"}

                          </span>

                        </div>


                        {allocation.course?.credits !==
                          undefined && (

                          <div className="flex items-center justify-between">

                            <span className="text-xs text-slate-400">
                              Credit Units
                            </span>

                            <span className="text-xs font-semibold text-slate-600">

                              {
                                allocation
                                  .course
                                  .credits
                              }

                            </span>

                          </div>

                        )}

                      </div>


                      <Button
                        variant="outline"
                        className="mt-5 w-full"
                        onClick={() =>
                          setSelectedCourse(
                            allocation
                          )
                        }
                      >

                        <Eye className="mr-2 h-4 w-4" />

                        View Course Details

                      </Button>

                    </CardContent>

                  </Card>

                )
              )}

            </div>

          </div>

        )}


        {/* ====================================================
            COURSE DETAILS
        ==================================================== */}

        {selectedCourse && (

          <Card className="border-none bg-white shadow-sm ring-1 ring-blue-200">

            <CardHeader className="border-b border-slate-100">

              <div className="flex items-start justify-between gap-4">

                <div className="flex items-start gap-3">

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#006dcc]">

                    <BookOpen className="h-6 w-6" />

                  </div>

                  <div>

                    <p className="text-xs font-bold uppercase tracking-wide text-[#006dcc]">

                      {
                        selectedCourse
                          .course
                          ?.code ||
                        "N/A"
                      }

                    </p>

                    <CardTitle className="mt-1 text-lg text-[#081022]">

                      {
                        selectedCourse
                          .course
                          ?.title ||
                        "Untitled Course"
                      }

                    </CardTitle>

                    <CardDescription className="mt-1">

                      Course allocation details

                    </CardDescription>

                  </div>

                </div>


                <StatusBadge
                  status={
                    selectedCourse.status
                  }
                />

              </div>

            </CardHeader>


            <CardContent className="p-5">

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">


                <div className="rounded-xl bg-slate-50 p-4">

                  <div className="flex items-center gap-2">

                    <GraduationCap className="h-4 w-4 text-[#006dcc]" />

                    <p className="text-xs text-slate-400">
                      Programme
                    </p>

                  </div>

                  <p className="mt-2 text-sm font-bold text-[#081022]">

                    {
                      selectedCourse
                        .programme
                        ?.name ||
                      selectedCourse
                        .programme
                        ?.code ||
                      "N/A"
                    }

                  </p>

                </div>


                <div className="rounded-xl bg-slate-50 p-4">

                  <div className="flex items-center gap-2">

                    <Layers3 className="h-4 w-4 text-[#006dcc]" />

                    <p className="text-xs text-slate-400">
                      Level
                    </p>

                  </div>

                  <p className="mt-2 text-sm font-bold text-[#081022]">

                    {
                      selectedCourse
                        .level ||
                      "N/A"
                    }

                  </p>

                </div>


                <div className="rounded-xl bg-slate-50 p-4">

                  <div className="flex items-center gap-2">

                    <Clock3 className="h-4 w-4 text-[#006dcc]" />

                    <p className="text-xs text-slate-400">
                      Semester
                    </p>

                  </div>

                  <p className="mt-2 text-sm font-bold text-[#081022]">

                    {
                      selectedCourse
                        .semester ||
                      "N/A"
                    }

                  </p>

                </div>


                <div className="rounded-xl bg-slate-50 p-4">

                  <div className="flex items-center gap-2">

                    <CalendarDays className="h-4 w-4 text-[#006dcc]" />

                    <p className="text-xs text-slate-400">
                      Academic Session
                    </p>

                  </div>

                  <p className="mt-2 text-sm font-bold text-[#081022]">

                    {
                      selectedCourse
                        .academicSession
                        ?.name ||
                      "N/A"
                    }

                  </p>

                </div>


                <div className="rounded-xl bg-slate-50 p-4">

                  <div className="flex items-center gap-2">

                    <BookOpen className="h-4 w-4 text-[#006dcc]" />

                    <p className="text-xs text-slate-400">
                      Credit Units
                    </p>

                  </div>

                  <p className="mt-2 text-sm font-bold text-[#081022]">

                    {
                      selectedCourse
                        .course
                        ?.credits ??
                      "N/A"
                    }

                  </p>

                </div>


                <div className="rounded-xl bg-slate-50 p-4">

                  <div className="flex items-center gap-2">

                    <CalendarDays className="h-4 w-4 text-[#006dcc]" />

                    <p className="text-xs text-slate-400">
                      Assigned On
                    </p>

                  </div>

                  <p className="mt-2 text-sm font-bold text-[#081022]">

                    {formatDate(
                      selectedCourse.createdAt
                    )}

                  </p>

                </div>

              </div>


              <div className="mt-5 flex justify-end">

                <Button
                  variant="outline"
                  onClick={() =>
                    setSelectedCourse(null)
                  }
                >
                  Close Details
                </Button>

              </div>

            </CardContent>

          </Card>

        )}

      </div>

    </div>
  );
}