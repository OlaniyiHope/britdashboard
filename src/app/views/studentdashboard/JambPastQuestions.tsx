import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Course {
  id: number;
  name: string;
  code: string;
  assignment: string;
  quiz: string;
  forum: string;
}

const courses: Course[] = [
  {
    id: 1,
    name: "Nationalism",
    code: "GENS 101",
    assignment: "4.00 / 5.00",
    quiz: "0.00 / 0.00",
    forum: "0.00 / 0.00",
  },
  {
    id: 2,
    name: "ENGLISH AND COMMUNICATION SKILLS",
    code: "GENS 103",
    assignment: "4.20 / 10.00",
    quiz: "16.50 / 25.00",
    forum: "1.00 / 3.00",
  },
  {
    id: 3,
    name: "Introduction to Computing",
    code: "COSC 101",
    assignment: "0.00 / 0.00",
    quiz: "0.00 / 0.00",
    forum: "0.00 / 0.00",
  },
  {
    id: 4,
    name: "Sets and Number System",
    code: "MATH 101",
    assignment: "0.00 / 5.00",
    quiz: "0.00 / 0.00",
    forum: "0.00 / 0.00",
  },
  {
    id: 5,
    name: "Trigonometry and Co-ordinate Geometry",
    code: "MATH 103",
    assignment: "0.00 / 10.00",
    quiz: "0.00 / 0.00",
    forum: "0.00 / 0.00",
  },
  {
    id: 6,
    name: "Differential and Integral Calculus",
    code: "MATH 105",
    assignment: "0.00 / 0.00",
    quiz: "0.00 / 0.00",
    forum: "0.00 / 0.00",
  },
  {
    id: 7,
    name: "Mechanics",
    code: "PHYS 111",
    assignment: "0.00 / 0.00",
    quiz: "0.00 / 0.00",
    forum: "0.00 / 4.00",
  },
  {
    id: 8,
    name: "Heat and properties of matter",
    code: "PHYS 131",
    assignment: "0.00 / 0.00",
    quiz: "0.00 / 0.00",
    forum: "0.00 / 0.00",
  },
];

export default function GradeBook() {
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">
          My Grade Book
        </h2>

        <div className="mt-4 text-sm text-slate-500">
          <span>Home</span>
          <span className="mx-2">/</span>
          <span className="text-slate-700">Pick a course</span>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="relative px-4 pt-8 pb-5">
        {/* Horizontal line */}
        <div className="absolute left-[12%] right-[12%] top-[42px] h-px bg-slate-300" />

        <div className="relative z-10 flex items-start justify-between">
          {/* Step 1 */}
          <div className="flex w-1/2 flex-col items-center">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-600 text-xs font-semibold text-white">
              1
            </div>

            <span className="mt-2 text-xs font-medium text-slate-700">
              Pick a course
            </span>
          </div>

          {/* Step 2 */}
          <div className="flex w-1/2 flex-col items-center">
            <div className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-300 bg-white text-xs font-medium text-slate-500">
              2
            </div>

            <span className="mt-2 text-xs text-slate-500">
              See grade breakdown
            </span>
          </div>
        </div>
      </div>

      {/* Courses */}
      {!selectedCourse ? (
        <Card className="border-none shadow-none">
          <CardContent className="p-0">
            <div className="mb-4">
              <h3 className="text-xl font-semibold text-slate-800">
                Courses ({courses.length})
              </h3>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <div className="min-w-[850px] overflow-hidden rounded-md border border-slate-200 bg-white">
                {/* Table Header */}
                <div className="grid grid-cols-[70px_minmax(300px,1fr)_150px_150px_150px_140px] border-b border-slate-200 bg-white px-4 py-4 text-sm font-semibold text-slate-700">
                  <div></div>

                  <div>Course</div>

                  <div>Assignment</div>

                  <div>Quiz</div>

                  <div>Forum</div>

                  <div>Action</div>
                </div>

                {/* Table Rows */}
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="grid grid-cols-[70px_minmax(300px,1fr)_150px_150px_150px_140px] items-center border-b border-slate-100 px-4 py-3 last:border-b-0 hover:bg-slate-50"
                  >
                    {/* Number */}
                    <div>
                      <div className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-300 text-xs text-slate-600">
                        {course.id}
                      </div>
                    </div>

                    {/* Course */}
                    <div className="pr-4">
                      <p className="text-sm font-medium text-slate-700">
                        {course.name}
                        <span className="ml-1 text-slate-500">
                          - {course.code}
                        </span>
                      </p>
                    </div>

                    {/* Assignment */}
                    <div className="text-sm">
                      <span
                        className={
                          course.assignment !== "0.00 / 0.00"
                            ? "text-red-500"
                            : "text-red-400"
                        }
                      >
                        {course.assignment}
                      </span>
                    </div>

                    {/* Quiz */}
                    <div className="text-sm">
                      <span className="text-red-400">
                        {course.quiz}
                      </span>
                    </div>

                    {/* Forum */}
                    <div className="text-sm">
                      <span className="text-red-400">
                        {course.forum}
                      </span>
                    </div>

                    {/* Action */}
                    <div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedCourse(course)}
                        className="border-slate-200 bg-white text-xs font-normal text-slate-600 hover:bg-slate-50"
                      >
                        See Breakdown
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Grade Breakdown */
        <Card className="border-none shadow-none">
          <CardContent className="p-0">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-slate-800">
                  Grade Breakdown
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  {selectedCourse.name} - {selectedCourse.code}
                </p>
              </div>

              <Button
                variant="outline"
                onClick={() => setSelectedCourse(null)}
              >
                Back to Courses
              </Button>
            </div>

            <div className="rounded-md border border-slate-200 bg-white">
              <div className="grid grid-cols-3 border-b border-slate-200 px-5 py-4 text-sm font-semibold text-slate-700">
                <div>Assessment</div>
                <div>Score</div>
                <div>Maximum</div>
              </div>

              <div className="grid grid-cols-3 border-b border-slate-100 px-5 py-4 text-sm">
                <div>Assignment</div>
                <div className="text-red-500">
                  {selectedCourse.assignment.split("/")[0]}
                </div>
                <div>
                  {selectedCourse.assignment.split("/")[1]}
                </div>
              </div>

              <div className="grid grid-cols-3 border-b border-slate-100 px-5 py-4 text-sm">
                <div>Quiz</div>
                <div className="text-red-500">
                  {selectedCourse.quiz.split("/")[0]}
                </div>
                <div>
                  {selectedCourse.quiz.split("/")[1]}
                </div>
              </div>

              <div className="grid grid-cols-3 px-5 py-4 text-sm">
                <div>Forum</div>
                <div className="text-red-500">
                  {selectedCourse.forum.split("/")[0]}
                </div>
                <div>
                  {selectedCourse.forum.split("/")[1]}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}