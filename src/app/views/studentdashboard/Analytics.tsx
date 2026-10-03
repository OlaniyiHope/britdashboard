import { useContext } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { SessionContext } from "@/contexts/SessionContext";
import useFetch from "@/hooks/useFetch";
import {
  BookOpen,
  CalendarClock,
  ChevronRight,
  GraduationCap,
  Info,
  Layers,
  ShieldCheck,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────
// Types (same shape as the My Courses page)
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

const REGISTRATION_PATH = "/student/dashboard/course/course-registration";

// ─────────────────────────────────────────────────────────────────────────
// Presentational helpers
// ─────────────────────────────────────────────────────────────────────────

function SectionBanner({
  icon: Icon,
  children,
}: {
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div
      className="relative inline-flex items-center gap-2 bg-[#081022] py-2 pl-4 pr-7 text-sm font-semibold text-white"
      style={{ clipPath: "polygon(0 0, 100% 0, 92% 50%, 100% 100%, 0 100%)" }}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span>{children}</span>
    </div>
  );
}

function StatCircle({
  icon: Icon,
  value,
  label,
  ring,
}: {
  icon: React.ElementType;
  value: number | string;
  label: string;
  ring: string;
}) {
  return (
    <div className="flex flex-1 items-center justify-center gap-4 px-4 py-6">
      <div
        className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-full ${ring}`}
      >
        <Icon className="h-7 w-7 text-white" />
      </div>
      <div>
        <p className="text-3xl font-extrabold text-slate-800">{value}</p>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          {label}
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────

const StudentDashboard = () => {
  const { currentSession } = useContext(SessionContext);

  // useFetch adds the API URL, "/api" and the login token for us.
  const { data, loading, error } = useFetch("/student/courses/registration");

  const result = data as MyCoursesResponse | null;
  const registration = result?.registration ?? null;
  const courses = registration?.courses ?? [];
  const totalUnits = registration?.totalUnits ?? 0;

  const statusLabel = loading
    ? "…"
    : registration?.status ?? "Not Registered";

  const statusRing =
    registration?.status === "Registered"
      ? "bg-emerald-500"
      : registration?.status === "Pending Payment"
      ? "bg-amber-500"
      : "bg-slate-400";

  const sessionName = currentSession?.name || result?.session;

  const errorMessage =
    (error as any)?.response?.data?.message ||
    (error ? "Could not load your courses." : "");

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-[#081022]">Student Dashboard</h1>
        <p className="text-sm font-medium text-slate-500">
          {sessionName
            ? `Current Session: ${sessionName}${
                result?.semester ? ` — ${result.semester}` : ""
              }`
            : "Welcome to your student portal."}
        </p>
      </div>

      {/* Registration reminder */}
      {!loading && !errorMessage && registration?.status === "Pending Payment" && (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Your course registration is saved but not complete yet.{" "}
          <Link to={REGISTRATION_PATH} className="font-semibold underline">
            Finish registration
          </Link>
        </div>
      )}

      {/* Course & Registration Information */}
      <Card className="overflow-hidden border-none shadow-sm ring-1 ring-slate-200">
        <div className="p-4 pb-0">
          <SectionBanner icon={Info}>Course &amp; Registration Information</SectionBanner>
        </div>
        <CardContent className="p-4 pt-6 md:p-6 md:pt-6">
          <div className="flex flex-col divide-y divide-slate-100 rounded-xl border border-slate-200 sm:flex-row sm:divide-x sm:divide-y-0">
            <StatCircle
              icon={GraduationCap}
              value={loading ? "…" : courses.length}
              label="Courses"
              ring="bg-emerald-500"
            />
            <StatCircle
              icon={Layers}
              value={loading ? "…" : totalUnits}
              label="Total Units"
              ring="bg-rose-700"
            />
            <StatCircle
              icon={ShieldCheck}
              value={statusLabel}
              label="Registration"
              ring={statusRing}
            />
          </div>
        </CardContent>
      </Card>

      {/* Registered courses */}
      <Card className="overflow-hidden border-none shadow-sm ring-1 ring-slate-200">
        <div className="p-4 pb-0">
          <SectionBanner icon={BookOpen}>My Courses</SectionBanner>
        </div>
        <CardContent className="p-0 pt-4 md:pt-6">
          {loading ? (
            <p className="px-4 py-10 text-center text-sm text-slate-500">
              Loading courses…
            </p>
          ) : errorMessage ? (
            <p className="px-4 py-10 text-center text-sm text-rose-600">
              {errorMessage}
            </p>
          ) : courses.length === 0 ? (
            <div className="px-4 py-10 text-center">
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
                  // to={`/course/${course.code.toLowerCase().replace(/\s+/g, "-")}`}
                  to={`/student/dashboard/my-courses/${course.id}`}
                  className="flex items-center gap-4 px-4 py-3 transition-colors hover:bg-slate-50/60 md:px-6"
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

      {/* Deadlines */}
      <Card className="overflow-hidden border-none shadow-sm ring-1 ring-slate-200">
        <div className="p-4 pb-0">
          <SectionBanner icon={CalendarClock}>Deadlines</SectionBanner>
        </div>
        <CardContent className="px-4 py-8 text-center md:px-6">
          <p className="text-sm text-slate-500">
            Assignment and quiz deadlines will appear here once your lecturers
            publish them.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentDashboard;