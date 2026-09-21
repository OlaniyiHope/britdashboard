import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Circle,
  ClipboardList,
  ArrowRight,
  Loader2,
  AlertCircle,
  CreditCard,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/* CONFIG                                                              */
/* ------------------------------------------------------------------ */

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";
const ENDPOINT = `${API_URL}/api/student/courses/registration`;

// Change to wherever your Make Payment page lives
const PAYMENT_PATH = "/student/dashboard/payment/make-payment";

const getToken = () => localStorage.getItem("jwtToken");

// true  = students cannot untick compulsory courses
// false = compulsory courses are pre-selected but can be unticked
const LOCK_COMPULSORY = false;

/* ------------------------------------------------------------------ */
/* TYPES                                                               */
/* ------------------------------------------------------------------ */

interface Course {
  id: string;
  code: string;
  title: string;
  unit: number;
  type: "Compulsory" | "Elective";
}

interface Registration {
  status: string;
  totalUnits: number;
  courses: Course[];
}

interface FeeItem {
  code: string;
  title: string;
  due: number;
  paid: number;
  balance: number;
  requiredNow: number;
  status: string;
}

interface FeeStatus {
  items: FeeItem[];
  eligible: boolean;
  outstandingNow: number;
}

interface RegistrationData {
  student: { name: string; programme: string; level: string };
  session: string;
  semester: string;
  courses: Course[];
  registration: Registration | null;
  fees: FeeStatus;
}

const normaliseCourse = (c: any): Course => ({
  id: String(c._id ?? c.id),
  code: c.code,
  title: c.title,
  unit: Number(c.unit ?? c.credits ?? 0),
  type: c.type === "Compulsory" ? "Compulsory" : "Elective",
});

const naira = (n: number) => `₦${n.toLocaleString()}`;

/* ------------------------------------------------------------------ */
/* SMALL SHARED PIECES                                                 */
/* ------------------------------------------------------------------ */

const PageShell = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen bg-[#f8f9fb] text-[#333]">
    <div className="border-b border-[#ddd] bg-white px-7 py-5">
      <h1 className="text-[18px] font-medium text-[#333]">
        Course Registration
      </h1>
    </div>

    <div className="px-5 md:px-8 py-7">
      <div className="flex items-center gap-2 text-[11px] text-[#999] mb-7">
        <Link
          to="/student/dashboard"
          className="hover:text-[#006b5d] transition"
        >
          Dashboard
        </Link>
        <ChevronRight size={13} />
        <span>Course</span>
        <ChevronRight size={13} />
        <span className="text-[#555]">Course Registration</span>
      </div>

      {children}
    </div>
  </div>
);

const StudentCard = ({ data }: { data: RegistrationData }) => (
  <div className="bg-white border border-[#ddd] rounded-md mb-6 overflow-hidden">
    <div className="px-5 py-4 border-b border-[#eee] flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-[#eef8f6] text-[#006b5d] flex items-center justify-center">
        <BookOpen size={19} />
      </div>
      <div>
        <h2 className="text-[14px] font-semibold text-[#333]">
          Course Registration
        </h2>
        <p className="text-[10px] text-[#999]">
          Your courses for the current semester.
        </p>
      </div>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <div className="px-5 py-4 border-b sm:border-r border-[#eee]">
        <p className="text-[10px] text-[#999]">Student</p>
        <p className="text-[12px] font-medium text-[#444] mt-1">
          {data.student.name}
        </p>
      </div>
      <div className="px-5 py-4 border-b lg:border-r border-[#eee]">
        <p className="text-[10px] text-[#999]">Programme</p>
        <p className="text-[12px] font-medium text-[#444] mt-1">
          {data.student.programme}
        </p>
      </div>
      <div className="px-5 py-4 border-b sm:border-r border-[#eee]">
        <p className="text-[10px] text-[#999]">Level</p>
        <p className="text-[12px] font-medium text-[#444] mt-1">
          {data.student.level}
        </p>
      </div>
      <div className="px-5 py-4 border-b border-[#eee]">
        <p className="text-[10px] text-[#999]">Academic Session</p>
        <p className="text-[12px] font-medium text-[#006b5d] mt-1">
          {data.session} — {data.semester}
        </p>
      </div>
    </div>
  </div>
);

const TH = ({
  children,
  align = "left",
}: {
  children: React.ReactNode;
  align?: "left" | "center" | "right";
}) => (
  <th
    className={`px-4 py-4 ${
      align === "center"
        ? "text-center"
        : align === "right"
        ? "text-right"
        : "text-left"
    } text-[10px] font-bold text-[#444] border-b border-[#d5dbe2]`}
  >
    {children}
  </th>
);

const TypeBadge = ({ type }: { type: Course["type"] }) => (
  <span
    className={`inline-block text-[9px] px-2 py-1 rounded ${
      type === "Compulsory"
        ? "bg-[#eef8f6] text-[#006b5d]"
        : "bg-[#f3f3f3] text-[#777]"
    }`}
  >
    {type}
  </span>
);

/* ------------------------------------------------------------------ */
/* PAGE                                                                */
/* ------------------------------------------------------------------ */

const CourseRegistration = () => {
  const [data, setData] = useState<RegistrationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  /* -------------------------- LOAD DATA --------------------------- */

  useEffect(() => {
    const controller = new AbortController();

    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(ENDPOINT, {
          headers: { Authorization: `Bearer ${getToken()}` },
          signal: controller.signal,
        });

        const json = await res.json();

        if (!res.ok) {
          throw new Error(
            json.message || json.error || "Could not load courses."
          );
        }

        const courses: Course[] = (json.courses || []).map(normaliseCourse);

        const registration: Registration | null = json.registration
          ? {
              ...json.registration,
              courses: (json.registration.courses || []).map(normaliseCourse),
            }
          : null;

        setData({
          student: json.student,
          session: json.session,
          semester: json.semester,
          courses,
          registration,
          fees: json.fees ?? { items: [], eligible: true, outstandingNow: 0 },
        });

        // Compulsory courses are selected by default
        setSelectedCourses(
          courses.filter((c) => c.type === "Compulsory").map((c) => c.id)
        );
      } catch (err: any) {
        if (err.name !== "AbortError") {
          setError(err.message || "Something went wrong.");
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    load();

    return () => controller.abort();
  }, [reloadKey]);

  /* --------------------------- DERIVED ---------------------------- */

  const availableCourses = data?.courses ?? [];

  const compulsoryCourses = useMemo(
    () => availableCourses.filter((c) => c.type === "Compulsory"),
    [availableCourses]
  );

  const electiveCourses = useMemo(
    () => availableCourses.filter((c) => c.type === "Elective"),
    [availableCourses]
  );

  const selectedCourseData = useMemo(
    () => availableCourses.filter((c) => selectedCourses.includes(c.id)),
    [availableCourses, selectedCourses]
  );

  const totalUnits = selectedCourseData.reduce((t, c) => t + c.unit, 0);

  /* --------------------------- ACTIONS ---------------------------- */

  const toggleCourse = (course: Course) => {
    if (LOCK_COMPULSORY && course.type === "Compulsory") return;

    setSelectedCourses((current) =>
      current.includes(course.id)
        ? current.filter((id) => id !== course.id)
        : [...current, course.id]
    );
  };

  const selectAllCompulsory = () => {
    const ids = compulsoryCourses.map((c) => c.id);
    setSelectedCourses((current) => [
      ...current,
      ...ids.filter((id) => !current.includes(id)),
    ]);
  };

  const clearSelection = () => {
    setSelectedCourses(
      LOCK_COMPULSORY ? compulsoryCourses.map((c) => c.id) : []
    );
  };

  const handleRegister = async () => {
    if (selectedCourses.length === 0 || !data?.fees.eligible) return;

    try {
      setSubmitting(true);
      setSubmitError("");

      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ courseIds: selectedCourses }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || json.error || "Registration failed.");
      }

      // Reload so the page shows the saved registration
      setReloadKey((k) => k + 1);
    } catch (err: any) {
      setSubmitError(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------------------------- STATES ---------------------------- */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fb] flex items-center justify-center">
        <div className="flex items-center gap-3 text-[#777] text-[12px]">
          <Loader2 size={18} className="animate-spin text-[#006b5d]" />
          Loading your courses...
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[#f8f9fb] flex items-center justify-center px-5">
        <div className="bg-white border border-[#ddd] rounded-md p-8 max-w-md text-center">
          <AlertCircle size={32} className="mx-auto text-[#c0392b] mb-3" />
          <p className="text-[13px] font-semibold text-[#333]">
            Could not load course registration
          </p>
          <p className="text-[11px] text-[#888] mt-2">{error}</p>
          <button
            type="button"
            onClick={() => setReloadKey((k) => k + 1)}
            className="mt-5 bg-[#006b5d] hover:bg-[#005548] text-white text-[11px] font-medium px-5 py-2.5 rounded-[3px]"
          >
            TRY AGAIN
          </button>
        </div>
      </div>
    );
  }

  /* ------------------ ALREADY REGISTERED: READ-ONLY --------------- */

  if (data.registration) {
    const reg = data.registration;

    return (
      <PageShell>
        <StudentCard data={data} />

        <div className="bg-[#f0f8f6] border border-[#cce5df] rounded-md p-4 mb-6 flex items-start gap-3">
          <CheckCircle2
            size={17}
            className="text-[#006b5d] mt-0.5 flex-shrink-0"
          />
          <div>
            <p className="text-[11px] font-semibold text-[#006b5d]">
              You are registered for {data.semester}
            </p>
            <p className="text-[10px] text-[#687] leading-5 mt-1">
              {reg.courses.length} courses, {reg.totalUnits} units. Contact the
              admin office if you need to change your registration.
            </p>
          </div>
        </div>

        <div className="bg-white border border-[#ddd] rounded-md overflow-hidden">
          <div className="px-5 py-4 border-b border-[#eee] flex items-center gap-3">
            <ClipboardList size={18} className="text-[#006b5d]" />
            <div>
              <h2 className="text-[14px] font-semibold text-[#333]">
                Registered Courses
              </h2>
              <p className="text-[10px] text-[#999]">
                {data.session} — {data.semester}
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse">
              <thead>
                <tr className="bg-[#e9edf3]">
                  <TH>COURSE CODE</TH>
                  <TH>COURSE TITLE</TH>
                  <TH align="center">UNIT</TH>
                  <TH>TYPE</TH>
                </tr>
              </thead>
              <tbody>
                {reg.courses.map((course) => (
                  <tr key={course.id}>
                    <td className="px-4 py-4 border-b border-[#eee] text-[11px] font-semibold text-[#444]">
                      {course.code}
                    </td>
                    <td className="px-4 py-4 border-b border-[#eee] text-[12px] font-medium text-[#444]">
                      {course.title}
                    </td>
                    <td className="px-4 py-4 border-b border-[#eee] text-center text-[11px] text-[#555]">
                      {course.unit}
                    </td>
                    <td className="px-4 py-4 border-b border-[#eee]">
                      <TypeBadge type={course.type} />
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-[#fafafa]">
                  <td
                    colSpan={2}
                    className="px-4 py-4 text-[11px] font-bold text-[#444]"
                  >
                    TOTAL UNITS
                  </td>
                  <td className="px-4 py-4 text-center text-[11px] font-bold text-[#006b5d]">
                    {reg.totalUnits}
                  </td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </PageShell>
    );
  }

  /* ------------------ NOT REGISTERED: PICK COURSES ---------------- */

  const renderRow = (course: Course) => {
    const selected = selectedCourses.includes(course.id);
    const locked = LOCK_COMPULSORY && course.type === "Compulsory";

    return (
      <tr
        key={course.id}
        onClick={() => toggleCourse(course)}
        className={`transition ${locked ? "cursor-default" : "cursor-pointer"} ${
          selected ? "bg-[#f0f8f6]" : "hover:bg-[#fafafa]"
        }`}
      >
        <td className="px-4 py-4 text-center border-b border-[#eee]">
          {selected ? (
            <CheckCircle2 size={19} className="mx-auto text-[#006b5d]" />
          ) : (
            <Circle size={19} className="mx-auto text-[#bbb]" />
          )}
        </td>
        <td className="px-4 py-4 border-b border-[#eee]">
          <span className="text-[11px] font-semibold text-[#444]">
            {course.code}
          </span>
        </td>
        <td className="px-4 py-4 border-b border-[#eee]">
          <p className="text-[12px] font-medium text-[#444]">{course.title}</p>
        </td>
        <td className="px-4 py-4 text-center text-[11px] text-[#555] border-b border-[#eee]">
          {course.unit}
        </td>
        <td className="px-4 py-4 border-b border-[#eee]">
          <TypeBadge type={course.type} />
        </td>
      </tr>
    );
  };

  const sectionHeader = (label: string) => (
    <tr className="bg-[#fafafa]">
      <td
        colSpan={5}
        className="px-4 py-2.5 text-[10px] font-bold text-[#006b5d] border-b border-[#eee]"
      >
        {label}
      </td>
    </tr>
  );

  const unpaid = data.fees.items.filter((item) => item.requiredNow > 0);

  return (
    <PageShell>
      <StudentCard data={data} />

      {/* FEES NOTICE */}
      {data.fees.eligible ? (
        <div className="bg-[#f0f8f6] border border-[#cce5df] rounded-md p-4 mb-6 flex items-start gap-3">
          <CheckCircle2
            size={17}
            className="text-[#006b5d] mt-0.5 flex-shrink-0"
          />
          <div>
            <p className="text-[11px] font-semibold text-[#006b5d]">
              Your fees are cleared
            </p>
            <p className="text-[10px] text-[#687] leading-5 mt-1">
              Your compulsory courses are already selected. Add any electives
              you want, then register.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-[#fff8e6] border border-[#f1df9b] rounded-md p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertCircle
              size={17}
              className="text-[#b7791f] mt-0.5 flex-shrink-0"
            />
            <div className="flex-1">
              <p className="text-[11px] font-semibold text-[#7a5a13]">
                Pay your fees before registering courses
              </p>
              <p className="text-[10px] text-[#92752c] leading-5 mt-1">
                You can look at the courses below, but you can only register
                once these are paid:
              </p>

              <ul className="mt-3 space-y-1.5">
                {unpaid.map((item) => (
                  <li
                    key={item.code}
                    className="flex items-center justify-between text-[11px] text-[#7a5a13]"
                  >
                    <span>
                      {item.title}
                      {item.code === "TUITION" && (
                        <span className="text-[#a58a45]">
                          {" "}
                          (at least half)
                        </span>
                      )}
                    </span>
                    <span className="font-semibold">
                      {naira(item.requiredNow)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-between border-t border-[#f1df9b] mt-3 pt-3">
                <span className="text-[11px] font-semibold text-[#7a5a13]">
                  Total to pay now
                </span>
                <span className="text-[13px] font-bold text-[#7a5a13]">
                  {naira(data.fees.outstandingNow)}
                </span>
              </div>

              <Link
                to={PAYMENT_PATH}
                className="mt-4 inline-flex items-center gap-2 bg-[#006b5d] hover:bg-[#005548] text-white text-[11px] font-medium px-4 py-2.5 rounded-[3px]"
              >
                <CreditCard size={14} />
                PAY FEES
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* COURSE TABLE */}
      <div className="bg-white border border-[#ddd] rounded-md overflow-hidden">
        <div className="px-5 py-4 border-b border-[#eee] flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-3">
            <ClipboardList size={18} className="text-[#006b5d]" />
            <div>
              <h2 className="text-[14px] font-semibold text-[#333]">
                Available Courses
              </h2>
              <p className="text-[10px] text-[#999]">
                {availableCourses.length} courses available
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={selectAllCompulsory}
              className="border border-[#006b5d] text-[#006b5d] hover:bg-[#eef8f6] px-3 py-2 rounded-[3px] text-[10px] font-medium"
            >
              SELECT COMPULSORY
            </button>
            <button
              type="button"
              onClick={clearSelection}
              className="border border-[#ccc] text-[#777] hover:bg-[#f5f5f5] px-3 py-2 rounded-[3px] text-[10px] font-medium"
            >
              CLEAR
            </button>
          </div>
        </div>

        {availableCourses.length === 0 ? (
          <div className="py-14 text-center">
            <BookOpen size={34} className="mx-auto text-[#ccc] mb-3" />
            <p className="text-[12px] text-[#777]">
              No approved courses for your programme, level and semester yet.
            </p>
            <p className="text-[10px] text-[#aaa] mt-1">
              Please contact your HOD or the admin office.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] border-collapse">
              <thead>
                <tr className="bg-[#e9edf3]">
                  <th className="w-[60px] px-4 py-4 text-center text-[10px] font-bold text-[#444] border-b border-[#d5dbe2]">
                    SELECT
                  </th>
                  <TH>COURSE CODE</TH>
                  <TH>COURSE TITLE</TH>
                  <TH align="center">UNIT</TH>
                  <TH>TYPE</TH>
                </tr>
              </thead>
              <tbody>
                {compulsoryCourses.length > 0 && (
                  <>
                    {sectionHeader("COMPULSORY COURSES")}
                    {compulsoryCourses.map(renderRow)}
                  </>
                )}
                {electiveCourses.length > 0 && (
                  <>
                    {sectionHeader("ELECTIVE COURSES")}
                    {electiveCourses.map(renderRow)}
                  </>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* SUMMARY */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-5">
        <div className="bg-white border border-[#ddd] rounded-md overflow-hidden">
          <div className="px-5 py-4 border-b border-[#eee]">
            <h2 className="text-[14px] font-semibold text-[#333]">
              Selected Courses
            </h2>
            <p className="text-[10px] text-[#999] mt-1">
              Courses selected for {data.semester}.
            </p>
          </div>

          {selectedCourseData.length === 0 ? (
            <div className="py-12 text-center">
              <BookOpen size={34} className="mx-auto text-[#ccc] mb-3" />
              <p className="text-[12px] text-[#777]">
                No courses selected yet.
              </p>
              <p className="text-[10px] text-[#aaa] mt-1">
                Select courses from the list above.
              </p>
            </div>
          ) : (
            selectedCourseData.map((course) => (
              <div
                key={course.id}
                className="px-5 py-3 border-b border-[#eee] flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-[#006b5d]" />
                  <div>
                    <p className="text-[11px] font-semibold text-[#444]">
                      {course.code}
                    </p>
                    <p className="text-[10px] text-[#999]">{course.title}</p>
                  </div>
                </div>
                <span className="text-[11px] font-medium text-[#555]">
                  {course.unit} {course.unit === 1 ? "unit" : "units"}
                </span>
              </div>
            ))
          )}
        </div>

        <div className="bg-white border border-[#ddd] rounded-md overflow-hidden h-fit">
          <div className="px-5 py-4 bg-[#006b5d] text-white">
            <p className="text-[10px] opacity-80">REGISTRATION SUMMARY</p>
            <p className="text-[16px] font-semibold mt-1">{data.session}</p>
            <p className="text-[10px] opacity-80 mt-0.5">{data.semester}</p>
          </div>

          <div className="p-5">
            <div className="flex justify-between text-[11px] mb-3">
              <span className="text-[#888]">Selected Courses</span>
              <span className="font-semibold text-[#444]">
                {selectedCourses.length}
              </span>
            </div>

            <div className="flex justify-between text-[11px]">
              <span className="text-[#888]">Total Units</span>
              <span className="font-semibold text-[#444]">{totalUnits}</span>
            </div>

            {submitError && (
              <p className="mt-4 text-[10px] text-[#c0392b] leading-4">
                {submitError}
              </p>
            )}

            <button
              type="button"
              disabled={
                selectedCourses.length === 0 ||
                submitting ||
                !data.fees.eligible
              }
              onClick={handleRegister}
              className="w-full mt-5 flex items-center justify-center gap-2 bg-[#006b5d] hover:bg-[#005548] disabled:bg-[#ccc] disabled:cursor-not-allowed text-white text-[11px] font-medium py-3 rounded-[3px] transition"
            >
              {submitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  REGISTERING...
                </>
              ) : (
                <>
                  REGISTER COURSES
                  <ArrowRight size={14} />
                </>
              )}
            </button>

            {!data.fees.eligible && (
              <p className="text-[9px] text-[#aaa] text-center mt-3 leading-4">
                Registration opens once your required fees are paid.
              </p>
            )}
          </div>
        </div>
      </div>
    </PageShell>
  );
};

export default CourseRegistration;