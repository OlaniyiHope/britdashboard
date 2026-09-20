import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import useFetch from "@/hooks/useFetch";
import { BookOpen, ChevronRight, Layers } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────

type Course = {
  id: string;
  code: string;
  title: string;
  unit: number;
  fee: number;
  type: "Compulsory" | "Elective";
};

type MyCoursesResponse = {
  session: string;
  semester: string;
  registration: {
    status: "Pending Payment" | "Registered";
    totalUnits: number;
    totalAmount: number;
    courses: Course[];
  } | null;
};

// Change this if your course registration page lives at a different path
const REGISTRATION_PATH = "/student/dashboard/course/course-registration";

// ─────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────

export default function MyCourses() {
  // useFetch adds the API URL, "/api" and the login token for us.
  const { data, loading, error } = useFetch("/student/courses/registration");

  const result = data as MyCoursesResponse | null;
  const registration = result?.registration ?? null;
  const courses = registration?.courses ?? [];
  const totalUnits = registration?.totalUnits ?? 0;

  const errorMessage =
    (error as any)?.response?.data?.message ||
    (error ? "Could not load your courses." : "");

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-800">My Courses</h2>
      <p className="text-sm text-slate-500">
        Home <span className="mx-1">/</span>
        <span className="font-medium text-slate-600">My Courses</span>
        {result?.session && (
          <span className="ml-3 text-slate-400">
            {result.session} — {result.semester}
          </span>
        )}
      </p>

      {/* Stat circles */}
      <Card className="overflow-hidden border-none shadow-sm ring-1 ring-slate-200">
        <CardContent className="p-0">
          <div className="flex flex-col divide-y divide-slate-100 sm:flex-row sm:divide-x sm:divide-y-0">
            <div className="flex flex-1 items-center justify-center gap-4 px-4 py-8">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-amber-400">
                <BookOpen className="h-7 w-7 text-white" />
              </div>
              <div>
                <p className="text-3xl font-extrabold text-slate-800">
                  {loading ? "…" : courses.length}
                </p>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Courses
                </p>
              </div>
            </div>
            <div className="flex flex-1 items-center justify-center gap-4 px-4 py-8">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-rose-500">
                <Layers className="h-7 w-7 text-white" />
              </div>
              <div>
                <p className="text-3xl font-extrabold text-slate-800">
                  {loading ? "…" : totalUnits}
                </p>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Total Units
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment reminder */}
      {registration?.status === "Pending Payment" && (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Your course registration is saved but not complete yet.{" "}
          <Link to={REGISTRATION_PATH} className="font-semibold underline">
            Finish registration
          </Link>
        </div>
      )}

      {/* Course list */}
      <Card className="border-none shadow-sm ring-1 ring-slate-200">
        <CardContent className="space-y-4 p-5 md:p-6">
          <h3 className="text-sm font-bold text-slate-800">Course List</h3>

          {loading ? (
            <p className="py-10 text-center text-sm text-slate-500">
              Loading courses…
            </p>
          ) : errorMessage ? (
            <p className="py-10 text-center text-sm text-rose-600">
              {errorMessage}
            </p>
          ) : courses.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm text-slate-500">
                You are not registered for any courses this semester.
              </p>
              <Link
                to={REGISTRATION_PATH}
                className="mt-4 inline-block rounded-md bg-[#081022] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
              >
                Register courses
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {courses.map((course) => (
                <Link
                  key={course.id}
                  to={`/course/${course.code.toLowerCase().replace(/\s+/g, "-")}`}
                  className="flex items-center gap-4 py-3 transition-colors hover:bg-slate-50/60"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#081022]">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-[#081022]">
                      {course.code}
                    </p>
                    <p className="truncate text-sm text-slate-600">
                      {course.title}
                    </p>
                  </div>
                  <div className="hidden shrink-0 text-right sm:block">
                    <p className="text-xs font-medium text-slate-600">
                      {course.unit} {course.unit === 1 ? "unit" : "units"}
                    </p>
                    <p className="text-[11px] text-slate-400">{course.type}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 shrink-0 text-slate-300" />
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
