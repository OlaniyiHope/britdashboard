import { useContext, useMemo } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import useFetch from "@/hooks/useFetch";
import { SessionContext } from "@/contexts/SessionContext";
import { useAuth } from "@/contexts/AuthContext";
import { BookOpen, ChevronRight, Users } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────

type Course = {
  _id?: string;
  code: string;
  title: string;
  slug?: string;
};

// ─────────────────────────────────────────────────────────────────────────
// Fallback/mock data — swap out once the real courses endpoint exists.
// ─────────────────────────────────────────────────────────────────────────

const fallbackCourses: Course[] = [
  { code: "COSC 101", title: "Introduction to Computing", slug: "introduction-to-computing-673" },
  { code: "MATH 101", title: "Sets and Number System", slug: "sets-and-number-system" },
  { code: "MATH 103", title: "Trigonometry and Co-ordinate Geometry", slug: "trigonometry-and-co-ordinate-geometry" },
  { code: "MATH 105", title: "Differential and Integral Calculus", slug: "differential-and-integral-calculus" },
  { code: "PHYS 111", title: "Mechanics", slug: "mechanics" },
  { code: "PHYS 131", title: "Heat and Properties of Matter", slug: "heat-and-properties-of-matter" },
  { code: "GENS 101", title: "Nationalism", slug: "nationalism" },
  { code: "GENS 103", title: "English and Communication Skills", slug: "english-and-communication-skills" },
];

// ─────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────

export default function MyCourses() {
  const { currentSession } = useContext(SessionContext);
  const { user } = useAuth();

  const studentId = useMemo(() => {
    const stored = localStorage.getItem("user");
    const parsed = stored ? JSON.parse(stored) : {};
    const merged = { ...parsed, ...user } as any;
    return String(merged?._id || merged?.id || "");
  }, [user]);

  const { data: coursesData, loading: coursesLoading } = useFetch(
    currentSession?._id && studentId
      ? `/student/${studentId}/courses/${currentSession._id}`
      : null
  );
  const courses: Course[] =
    Array.isArray(coursesData) && coursesData.length > 0
      ? (coursesData as Course[])
      : fallbackCourses;

  const { data: groupingData } = useFetch(
    currentSession?._id && studentId
      ? `/student/${studentId}/course-grouping-summary/${currentSession._id}`
      : null
  );
  const courseGrouping =
    groupingData && typeof groupingData === "object"
      ? Number((groupingData as any).courseGrouping ?? courses.length)
      : courses.length;

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-800">My Courses</h2>
      <p className="text-sm text-slate-500">
        Home <span className="mx-1">/</span>
        <span className="font-medium text-slate-600">My Courses</span>
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
                  {coursesLoading ? "…" : courses.length}
                </p>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Courses
                </p>
              </div>
            </div>
            <div className="flex flex-1 items-center justify-center gap-4 px-4 py-8">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-rose-500">
                <Users className="h-7 w-7 text-white" />
              </div>
              <div>
                <p className="text-3xl font-extrabold text-slate-800">
                  {coursesLoading ? "…" : courseGrouping}
                </p>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Course Grouping
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Course list */}
      <Card className="border-none shadow-sm ring-1 ring-slate-200">
        <CardContent className="space-y-4 p-5 md:p-6">
          <h3 className="text-sm font-bold text-slate-800">Course List</h3>

          {coursesLoading ? (
            <p className="py-10 text-center text-sm text-slate-500">
              Loading courses…
            </p>
          ) : courses.length === 0 ? (
            <p className="py-10 text-center text-sm text-slate-500">
              You are not registered for any courses this semester.
            </p>
          ) : (
            <div className="divide-y divide-slate-100">
              {courses.map((course) => (
                <Link
                  key={course._id || course.code}
                  to={`/course/${course.slug || course.code.toLowerCase().replace(/\s+/g, "-")}`}
                  className="flex items-center gap-4 py-3 transition-colors hover:bg-slate-50/60"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#004aaa]">
                    <BookOpen className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-[#004aaa]">
                      {course.code}
                    </p>
                    <p className="truncate text-sm text-slate-600">{course.title}</p>
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
