import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  FileText,
  GraduationCap,
  Users,
  Video,
  MessageSquare,
  Upload,
  Plus,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";


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
  return (
    localStorage.getItem("jwtToken") ||
    ""
  );
};


// ============================================================
// PAGE
// ============================================================

export default function StaffCourseDetails() {

  const { allocationId } = useParams();

  const navigate = useNavigate();

  const [allocation, setAllocation] =
    useState<CourseAllocation | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");


  // ============================================================
  // FETCH COURSE ALLOCATION
  // ============================================================

  useEffect(() => {

    const fetchCourse = async () => {

      try {

        setLoading(true);
        setError("");

        const token = getToken();

        if (!token) {
          throw new Error("You are not logged in.");
        }

        if (!allocationId) {
          throw new Error("Course allocation ID is missing.");
        }


        const response = await fetch(
          `${API_BASE_URL}/api/course-allocations/${allocationId}`,
          {
            method: "GET",

            headers: {
              "Content-Type": "application/json",

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
            "Failed to load course."
          );

        }


        setAllocation(
          data?.allocation ||
          data?.courseAllocation ||
          data
        );

      } catch (err: any) {

        console.error(
          "Staff course error:",
          err
        );

        setError(
          err?.message ||
          "Failed to load course."
        );

      } finally {

        setLoading(false);

      }

    };


    fetchCourse();

  }, [allocationId]);


  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {

    return (

      <div className="min-h-full bg-slate-50 p-4 md:p-6">

        <div className="flex min-h-[400px] items-center justify-center">

          <div className="text-center">

            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#006dcc]" />

            <p className="mt-4 text-sm text-slate-500">
              Loading course...
            </p>

          </div>

        </div>

      </div>

    );

  }


  // ============================================================
  // ERROR
  // ============================================================

  if (error || !allocation) {

    return (

      <div className="min-h-full bg-slate-50 p-4 md:p-6">

        <Card>

          <CardContent className="flex min-h-[300px] items-center justify-center">

            <div className="text-center">

              <h2 className="text-lg font-bold">
                Unable to load course
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                {error || "Course allocation not found."}
              </p>

              <Button
                className="mt-5"
                onClick={() => navigate(-1)}
              >
                Go Back
              </Button>

            </div>

          </CardContent>

        </Card>

      </div>

    );

  }


  const course =
    allocation.course;

  const programme =
    allocation.programme;

  const session =
    allocation.academicSession;


  // ============================================================
  // PAGE
  // ============================================================

  return (

    <div className="min-h-full space-y-6 bg-slate-50 p-4 md:p-6">

      {/* ========================================================
          BACK
      ======================================================== */}

      <Button
        variant="ghost"
        className="gap-2"
        onClick={() => navigate(-1)}
      >

        <ArrowLeft className="h-4 w-4" />

        Back

      </Button>


      {/* ========================================================
          COURSE HEADER
      ======================================================== */}

      <Card className="overflow-hidden border-none bg-white shadow-sm ring-1 ring-slate-200">

        <CardContent className="p-6">

          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

            <div className="flex items-start gap-4">

              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-[#006dcc]">

                <BookOpen className="h-7 w-7" />

              </div>

              <div>

                <div className="flex flex-wrap items-center gap-2">

                  <Badge>
                    {course?.code || "N/A"}
                  </Badge>

                  <Badge variant="outline">
                    {allocation.status}
                  </Badge>

                </div>

                <h1 className="mt-2 text-2xl font-black tracking-tight text-[#081022] md:text-3xl">

                  {course?.title ||
                    "Untitled Course"}

                </h1>

                <p className="mt-2 text-sm text-slate-500">

                  Manage your teaching activities
                  for this course.

                </p>

              </div>

            </div>

            <Button
              className="bg-[#006dcc] hover:bg-[#005ca8]"
              onClick={() =>
                navigate(
                  `/staff/dashboard/course/${allocationId}/materials`
                )
              }
            >

              <Upload className="mr-2 h-4 w-4" />

              Course Materials

            </Button>

          </div>

        </CardContent>

      </Card>


      {/* ========================================================
          COURSE INFORMATION
      ======================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

          <CardContent className="p-5">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-[#006dcc]">

                <GraduationCap className="h-5 w-5" />

              </div>

              <div>

                <p className="text-xs text-slate-400">
                  Programme
                </p>

                <p className="mt-1 text-sm font-bold text-[#081022]">

                  {programme?.name ||
                    programme?.code ||
                    "Not available"}

                </p>

              </div>

            </div>

          </CardContent>

        </Card>


        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

          <CardContent className="p-5">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-50 text-purple-600">

                <Users className="h-5 w-5" />

              </div>

              <div>

                <p className="text-xs text-slate-400">
                  Level
                </p>

                <p className="mt-1 text-sm font-bold text-[#081022]">

                  {allocation.level ||
                    "Not available"}

                </p>

              </div>

            </div>

          </CardContent>

        </Card>


        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

          <CardContent className="p-5">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-50 text-amber-600">

                <CalendarDays className="h-5 w-5" />

              </div>

              <div>

                <p className="text-xs text-slate-400">
                  Semester
                </p>

                <p className="mt-1 text-sm font-bold text-[#081022]">

                  {allocation.semester ||
                    "Not available"}

                </p>

              </div>

            </div>

          </CardContent>

        </Card>


        <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

          <CardContent className="p-5">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">

                <BookOpen className="h-5 w-5" />

              </div>

              <div>

                <p className="text-xs text-slate-400">
                  Credits
                </p>

                <p className="mt-1 text-sm font-bold text-[#081022]">

                  {course?.credits ??
                    "N/A"}

                </p>

              </div>

            </div>

          </CardContent>

        </Card>

      </div>


      {/* ========================================================
          ACADEMIC SESSION
      ======================================================== */}

      <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

        <CardHeader>

          <CardTitle className="text-base text-[#081022]">
            Academic Information
          </CardTitle>

          <CardDescription>
            Information about your current course allocation.
          </CardDescription>

        </CardHeader>

        <CardContent>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            <div className="rounded-xl bg-slate-50 p-4">

              <p className="text-xs text-slate-400">
                Course Code
              </p>

              <p className="mt-1 font-bold">
                {course?.code || "N/A"}
              </p>

            </div>

            <div className="rounded-xl bg-slate-50 p-4">

              <p className="text-xs text-slate-400">
                Course Title
              </p>

              <p className="mt-1 font-bold">
                {course?.title || "N/A"}
              </p>

            </div>

            <div className="rounded-xl bg-slate-50 p-4">

              <p className="text-xs text-slate-400">
                Academic Session
              </p>

              <p className="mt-1 font-bold">
                {session?.name || "N/A"}
              </p>

            </div>

            <div className="rounded-xl bg-slate-50 p-4">

              <p className="text-xs text-slate-400">
                Allocation Status
              </p>

              <p className="mt-1 font-bold">
                {allocation.status}
              </p>

            </div>

          </div>

        </CardContent>

      </Card>


      {/* ========================================================
          TEACHING TOOLS
      ======================================================== */}

      <div>

        <h2 className="mb-3 text-lg font-bold text-[#081022]">
          Course Management
        </h2>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {/* MATERIALS */}

          <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

            <CardContent className="p-5">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-[#006dcc]">

                <FileText className="h-5 w-5" />

              </div>

              <h3 className="mt-4 font-bold">
                Course Materials
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Upload and manage lecture notes,
                resources and learning materials.
              </p>

              <Button
                variant="outline"
                className="mt-4 w-full"
                onClick={() =>
                  navigate(
                    `/staff/dashboard/course/${allocationId}/materials`
                  )
                }
              >
                Manage Materials
              </Button>

            </CardContent>

          </Card>


          {/* ASSIGNMENTS */}

          <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

            <CardContent className="p-5">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">

                <ClipboardCheck className="h-5 w-5" />

              </div>

              <h3 className="mt-4 font-bold">
                Assignments
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Create assignments and review
                student submissions.
              </p>

              <Button
                variant="outline"
                className="mt-4 w-full"
                onClick={() =>
                  navigate(
                    `/staff/dashboard/assignment/all?course=${allocationId}`
                  )
                }
              >
                Manage Assignments
              </Button>

            </CardContent>

          </Card>


          {/* QUIZZES */}

          <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

            <CardContent className="p-5">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-purple-600">

                <ClipboardCheck className="h-5 w-5" />

              </div>

              <h3 className="mt-4 font-bold">
                Quizzes
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Create quizzes and manage student
                attempts and results.
              </p>

              <Button
                variant="outline"
                className="mt-4 w-full"
                onClick={() =>
                  navigate(
                    `/staff/dashboard/quiz/manage?course=${allocationId}`
                  )
                }
              >
                Manage Quizzes
              </Button>

            </CardContent>

          </Card>


          {/* GRADE BOOK */}

          <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

            <CardContent className="p-5">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">

                <GraduationCap className="h-5 w-5" />

              </div>

              <h3 className="mt-4 font-bold">
                Grade Book
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Enter continuous assessment and
                examination marks.
              </p>

              <Button
                variant="outline"
                className="mt-4 w-full"
                onClick={() =>
                  navigate(
                    `/staff/dashboard/grade-book/continuous-assessment?course=${allocationId}`
                  )
                }
              >
                Open Grade Book
              </Button>

            </CardContent>

          </Card>


          {/* STUDENTS */}

          <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

            <CardContent className="p-5">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">

                <Users className="h-5 w-5" />

              </div>

              <h3 className="mt-4 font-bold">
                Students
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                View students registered for this
                course.
              </p>

              <Button
                variant="outline"
                className="mt-4 w-full"
              >
                View Students
              </Button>

            </CardContent>

          </Card>


          {/* LIVE CLASS */}

          <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

            <CardContent className="p-5">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">

                <Video className="h-5 w-5" />

              </div>

              <h3 className="mt-4 font-bold">
                Live Class
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Start or manage a live teaching
                session for this course.
              </p>

              <Button
                variant="outline"
                className="mt-4 w-full"
              >
                Start Live Class
              </Button>

            </CardContent>

          </Card>


          {/* FORUM */}

          <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">

            <CardContent className="p-5">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600">

                <MessageSquare className="h-5 w-5" />

              </div>

              <h3 className="mt-4 font-bold">
                Course Forum
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Interact with students and manage
                course discussions.
              </p>

              <Button
                variant="outline"
                className="mt-4 w-full"
                onClick={() =>
                  navigate(
                    `/staff/dashboard/course-forum?course=${allocationId}`
                  )
                }
              >
                Open Forum
              </Button>

            </CardContent>

          </Card>

        </div>

      </div>

    </div>

  );

}