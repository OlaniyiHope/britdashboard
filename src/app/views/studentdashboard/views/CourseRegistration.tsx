import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Circle,
  ClipboardList,
  Info,
  ArrowRight,
} from "lucide-react";

interface Course {
  id: string;
  code: string;
  title: string;
  unit: number;
  fee: number;
  type: "Compulsory" | "Elective";
}

const availableCourses: Course[] = [
  {
    id: "1",
    code: "MTH 101",
    title: "Elementary Mathematics I",
    unit: 3,
    fee: 25000,
    type: "Compulsory",
  },
  {
    id: "2",
    code: "PHY 101",
    title: "General Physics I",
    unit: 3,
    fee: 20000,
    type: "Compulsory",
  },
  {
    id: "3",
    code: "CSC 101",
    title: "Introduction to Computer Science",
    unit: 3,
    fee: 30000,
    type: "Compulsory",
  },
  {
    id: "4",
    code: "GST 101",
    title: "Communication in English",
    unit: 2,
    fee: 15000,
    type: "Compulsory",
  },
  {
    id: "5",
    code: "GST 103",
    title: "Introduction to Philosophy",
    unit: 2,
    fee: 12000,
    type: "Compulsory",
  },
  {
    id: "6",
    code: "CSC 103",
    title: "Computer Programming I",
    unit: 3,
    fee: 30000,
    type: "Compulsory",
  },
  {
    id: "7",
    code: "STA 101",
    title: "Introduction to Statistics",
    unit: 3,
    fee: 20000,
    type: "Elective",
  },
  {
    id: "8",
    code: "ENT 101",
    title: "Introduction to Entrepreneurship",
    unit: 2,
    fee: 15000,
    type: "Elective",
  },
];

const CourseRegistration = () => {
  const navigate = useNavigate();

  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);

  const academicSession = "2025/2026";
  const semester = "Semester One";

  const studentName = "Student Name";
  const programme = "B.Sc. Computer Science";
  const level = "100 Level";

  const toggleCourse = (courseId: string) => {
    setSelectedCourses((current) => {
      if (current.includes(courseId)) {
        return current.filter((id) => id !== courseId);
      }

      return [...current, courseId];
    });
  };

  const selectedCourseData = useMemo(() => {
    return availableCourses.filter((course) =>
      selectedCourses.includes(course.id)
    );
  }, [selectedCourses]);

  const totalUnits = selectedCourseData.reduce(
    (total, course) => total + course.unit,
    0
  );

  const totalAmount = selectedCourseData.reduce(
    (total, course) => total + course.fee,
    0
  );

  const compulsoryCourses = availableCourses.filter(
    (course) => course.type === "Compulsory"
  );

  const electiveCourses = availableCourses.filter(
    (course) => course.type === "Elective"
  );

  const selectAllCompulsory = () => {
    const compulsoryIds = compulsoryCourses.map((course) => course.id);

    setSelectedCourses((current) => {
      const newIds = compulsoryIds.filter(
        (id) => !current.includes(id)
      );

      return [...current, ...newIds];
    });
  };

  const clearSelection = () => {
    setSelectedCourses([]);
  };

  const handleContinue = () => {
    if (selectedCourses.length === 0) {
      return;
    }

    navigate("/student/dashboard/payment/course-payment", {
      state: {
        academicSession,
        semester,
        courses: selectedCourseData,
        totalUnits,
        totalAmount,
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#f8f9fb] text-[#333]">

      {/* PAGE HEADER */}
      <div className="border-b border-[#ddd] bg-white px-7 py-5">
        <h1 className="text-[18px] font-medium text-[#333]">
          Course Registration
        </h1>
      </div>

      {/* PAGE CONTENT */}
      <div className="px-5 md:px-8 py-7">

        {/* BREADCRUMB */}
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

          <span className="text-[#555]">
            Course Registration
          </span>
        </div>

        {/* STUDENT INFORMATION */}
        <div className="bg-white border border-[#ddd] rounded-md mb-6 overflow-hidden">

          {/* CARD HEADER */}
          <div className="px-5 py-4 border-b border-[#eee] flex items-center gap-3">

            <div className="w-10 h-10 rounded-full bg-[#eef8f6] text-[#006b5d] flex items-center justify-center">
              <BookOpen size={19} />
            </div>

            <div>
              <h2 className="text-[14px] font-semibold text-[#333]">
                Course Registration
              </h2>

              <p className="text-[10px] text-[#999]">
                Select your courses for the current semester.
              </p>
            </div>

          </div>

          {/* STUDENT DETAILS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">

            <div className="px-5 py-4 border-b sm:border-r border-[#eee]">
              <p className="text-[10px] text-[#999]">
                Student
              </p>

              <p className="text-[12px] font-medium text-[#444] mt-1">
                {studentName}
              </p>
            </div>

            <div className="px-5 py-4 border-b lg:border-r border-[#eee]">
              <p className="text-[10px] text-[#999]">
                Programme
              </p>

              <p className="text-[12px] font-medium text-[#444] mt-1">
                {programme}
              </p>
            </div>

            <div className="px-5 py-4 border-b sm:border-r border-[#eee]">
              <p className="text-[10px] text-[#999]">
                Level
              </p>

              <p className="text-[12px] font-medium text-[#444] mt-1">
                {level}
              </p>
            </div>

            <div className="px-5 py-4 border-b border-[#eee]">
              <p className="text-[10px] text-[#999]">
                Academic Session
              </p>

              <p className="text-[12px] font-medium text-[#006b5d] mt-1">
                {academicSession} — {semester}
              </p>
            </div>

          </div>

        </div>

        {/* INFORMATION MESSAGE */}
        <div className="bg-[#f0f8f6] border border-[#cce5df] rounded-md p-4 mb-6 flex items-start gap-3">

          <Info
            size={17}
            className="text-[#006b5d] mt-0.5 flex-shrink-0"
          />

          <div>
            <p className="text-[11px] font-semibold text-[#006b5d]">
              Course Registration Instructions
            </p>

            <p className="text-[10px] text-[#687] leading-5 mt-1">
              Select the courses you wish to register for this semester.
              Course fees are charged per course. After selecting your
              courses, review your registration and proceed to payment.
            </p>
          </div>

        </div>

        {/* COURSE TABLE */}
        <div className="bg-white border border-[#ddd] rounded-md overflow-hidden">

          {/* TABLE HEADER */}
          <div className="px-5 py-4 border-b border-[#eee] flex flex-col md:flex-row md:items-center md:justify-between gap-3">

            <div className="flex items-center gap-3">

              <ClipboardList
                size={18}
                className="text-[#006b5d]"
              />

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

          {/* TABLE */}
          <div className="overflow-x-auto">

            <table className="w-full min-w-[850px] border-collapse">

              <thead>
                <tr className="bg-[#e9edf3]">

                  <th className="w-[60px] px-4 py-4 text-center text-[10px] font-bold text-[#444] border-b border-[#d5dbe2]">
                    SELECT
                  </th>

                  <th className="px-4 py-4 text-left text-[10px] font-bold text-[#444] border-b border-[#d5dbe2]">
                    COURSE CODE
                  </th>

                  <th className="px-4 py-4 text-left text-[10px] font-bold text-[#444] border-b border-[#d5dbe2]">
                    COURSE TITLE
                  </th>

                  <th className="px-4 py-4 text-center text-[10px] font-bold text-[#444] border-b border-[#d5dbe2]">
                    UNIT
                  </th>

                  <th className="px-4 py-4 text-left text-[10px] font-bold text-[#444] border-b border-[#d5dbe2]">
                    TYPE
                  </th>

                  <th className="px-4 py-4 text-right text-[10px] font-bold text-[#444] border-b border-[#d5dbe2]">
                    COURSE FEE
                  </th>

                </tr>
              </thead>

              <tbody>

                {/* COMPULSORY COURSES */}
                <tr className="bg-[#fafafa]">

                  <td
                    colSpan={6}
                    className="px-4 py-2.5 text-[10px] font-bold text-[#006b5d] border-b border-[#eee]"
                  >
                    COMPULSORY COURSES
                  </td>

                </tr>

                {compulsoryCourses.map((course) => {

                  const selected = selectedCourses.includes(course.id);

                  return (
                    <tr
                      key={course.id}
                      onClick={() => toggleCourse(course.id)}
                      className={`cursor-pointer transition ${
                        selected
                          ? "bg-[#f0f8f6]"
                          : "hover:bg-[#fafafa]"
                      }`}
                    >

                      <td className="px-4 py-4 text-center border-b border-[#eee]">

                        {selected ? (
                          <CheckCircle2
                            size={19}
                            className="mx-auto text-[#006b5d]"
                          />
                        ) : (
                          <Circle
                            size={19}
                            className="mx-auto text-[#bbb]"
                          />
                        )}

                      </td>

                      <td className="px-4 py-4 border-b border-[#eee]">
                        <span className="text-[11px] font-semibold text-[#444]">
                          {course.code}
                        </span>
                      </td>

                      <td className="px-4 py-4 border-b border-[#eee]">
                        <p className="text-[12px] font-medium text-[#444]">
                          {course.title}
                        </p>
                      </td>

                      <td className="px-4 py-4 text-center text-[11px] text-[#555] border-b border-[#eee]">
                        {course.unit}
                      </td>

                      <td className="px-4 py-4 border-b border-[#eee]">
                        <span className="inline-block bg-[#eef8f6] text-[#006b5d] text-[9px] px-2 py-1 rounded">
                          Compulsory
                        </span>
                      </td>

                      <td className="px-4 py-4 text-right text-[12px] font-semibold text-[#333] border-b border-[#eee]">
                        ₦{course.fee.toLocaleString()}
                      </td>

                    </tr>
                  );
                })}

                {/* ELECTIVE COURSES */}
                <tr className="bg-[#fafafa]">

                  <td
                    colSpan={6}
                    className="px-4 py-2.5 text-[10px] font-bold text-[#006b5d] border-b border-[#eee]"
                  >
                    ELECTIVE COURSES
                  </td>

                </tr>

                {electiveCourses.map((course) => {

                  const selected = selectedCourses.includes(course.id);

                  return (
                    <tr
                      key={course.id}
                      onClick={() => toggleCourse(course.id)}
                      className={`cursor-pointer transition ${
                        selected
                          ? "bg-[#f0f8f6]"
                          : "hover:bg-[#fafafa]"
                      }`}
                    >

                      <td className="px-4 py-4 text-center border-b border-[#eee]">

                        {selected ? (
                          <CheckCircle2
                            size={19}
                            className="mx-auto text-[#006b5d]"
                          />
                        ) : (
                          <Circle
                            size={19}
                            className="mx-auto text-[#bbb]"
                          />
                        )}

                      </td>

                      <td className="px-4 py-4 border-b border-[#eee]">
                        <span className="text-[11px] font-semibold text-[#444]">
                          {course.code}
                        </span>
                      </td>

                      <td className="px-4 py-4 border-b border-[#eee]">
                        <p className="text-[12px] font-medium text-[#444]">
                          {course.title}
                        </p>
                      </td>

                      <td className="px-4 py-4 text-center text-[11px] text-[#555] border-b border-[#eee]">
                        {course.unit}
                      </td>

                      <td className="px-4 py-4 border-b border-[#eee]">
                        <span className="inline-block bg-[#f3f3f3] text-[#777] text-[9px] px-2 py-1 rounded">
                          Elective
                        </span>
                      </td>

                      <td className="px-4 py-4 text-right text-[12px] font-semibold text-[#333] border-b border-[#eee]">
                        ₦{course.fee.toLocaleString()}
                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>

        </div>

        {/* REGISTRATION SUMMARY */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-5">

          {/* SELECTED COURSES */}
          <div className="bg-white border border-[#ddd] rounded-md overflow-hidden">

            <div className="px-5 py-4 border-b border-[#eee]">

              <h2 className="text-[14px] font-semibold text-[#333]">
                Selected Courses
              </h2>

              <p className="text-[10px] text-[#999] mt-1">
                Courses selected for {semester}.
              </p>

            </div>

            {selectedCourseData.length === 0 ? (

              <div className="py-12 text-center">

                <BookOpen
                  size={34}
                  className="mx-auto text-[#ccc] mb-3"
                />

                <p className="text-[12px] text-[#777]">
                  No courses selected yet.
                </p>

                <p className="text-[10px] text-[#aaa] mt-1">
                  Select courses from the list above.
                </p>

              </div>

            ) : (

              <div>

                {selectedCourseData.map((course) => (

                  <div
                    key={course.id}
                    className="px-5 py-3 border-b border-[#eee] flex items-center justify-between gap-4"
                  >

                    <div className="flex items-center gap-3">

                      <CheckCircle2
                        size={16}
                        className="text-[#006b5d]"
                      />

                      <div>

                        <p className="text-[11px] font-semibold text-[#444]">
                          {course.code}
                        </p>

                        <p className="text-[10px] text-[#999]">
                          {course.title}
                        </p>

                      </div>

                    </div>

                    <span className="text-[11px] font-medium text-[#555]">
                      ₦{course.fee.toLocaleString()}
                    </span>

                  </div>

                ))}

              </div>

            )}

          </div>

          {/* REGISTRATION TOTAL */}
          <div className="bg-white border border-[#ddd] rounded-md overflow-hidden h-fit">

            <div className="px-5 py-4 bg-[#006b5d] text-white">

              <p className="text-[10px] opacity-80">
                REGISTRATION SUMMARY
              </p>

              <p className="text-[16px] font-semibold mt-1">
                {academicSession}
              </p>

              <p className="text-[10px] opacity-80 mt-0.5">
                {semester}
              </p>

            </div>

            <div className="p-5">

              <div className="flex justify-between text-[11px] mb-3">

                <span className="text-[#888]">
                  Selected Courses
                </span>

                <span className="font-semibold text-[#444]">
                  {selectedCourses.length}
                </span>

              </div>

              <div className="flex justify-between text-[11px] mb-3">

                <span className="text-[#888]">
                  Total Units
                </span>

                <span className="font-semibold text-[#444]">
                  {totalUnits}
                </span>

              </div>

              <div className="border-t border-[#eee] my-4" />

              <div className="flex justify-between items-end">

                <div>

                  <p className="text-[10px] text-[#999]">
                    TOTAL COURSE FEES
                  </p>

                  <p className="text-[22px] font-bold text-[#006b5d] mt-1">
                    ₦{totalAmount.toLocaleString()}
                  </p>

                </div>

              </div>

              <button
                type="button"
                disabled={selectedCourses.length === 0}
                onClick={handleContinue}
                className="w-full mt-5 flex items-center justify-center gap-2 bg-[#006b5d] hover:bg-[#005548] disabled:bg-[#ccc] disabled:cursor-not-allowed text-white text-[11px] font-medium py-3 rounded-[3px] transition"
              >
                CONTINUE TO PAYMENT
                <ArrowRight size={14} />
              </button>

              <p className="text-[9px] text-[#aaa] text-center mt-3 leading-4">
                You will review your course registration before making
                payment.
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default CourseRegistration;