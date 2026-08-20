import { useContext, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/useFetch";
import { SessionContext } from "@/contexts/SessionContext";

// ─────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────

type QuizStatus = "available" | "not_started" | "closed";

type Quiz = {
  _id?: string;
  title: string;
  courseCode: string;
  courseTitle: string;
  creator: string;
  startLabel: string; // e.g. "Starting in" or "Start Date"
  startValue: string;
  deadlineLabel: string; // e.g. "Deadline" or "Expiring in"
  deadlineValue: string;
  durationMins: number;
  attemptsUsed: number;
  attemptsTotal: number;
  successfulSubmissions: number;
  quizPrerequisite: string;
  topicPrerequisite: string;
  status: QuizStatus;
};

// ─────────────────────────────────────────────────────────────────────────
// Fallback/mock data — swap out once the real quiz endpoint exists.
// Creator names below are placeholders, not real staff.
// ─────────────────────────────────────────────────────────────────────────

const fallbackQuizzes: Quiz[] = [
  {
    title: "Tutor Mark Quiz for MATH 101 May Semester",
    courseCode: "MATH 101",
    courseTitle: "Sets and Number System",
    creator: "Course Tutor",
    startLabel: "Starting in",
    startValue: "0day(s) 03:07:48",
    deadlineLabel: "Deadline",
    deadlineValue: "05/09/26 02:55:00",
    durationMins: 20,
    attemptsUsed: 0,
    attemptsTotal: 2,
    successfulSubmissions: 0,
    quizPrerequisite: "MATH 101 Quiz",
    topicPrerequisite: "MATH 101 Note",
    status: "not_started",
  },
  {
    title: "Gens 101 Tutor's Quiz",
    courseCode: "GENS 101",
    courseTitle: "Nationalism",
    creator: "Course Tutor",
    startLabel: "Start Date",
    startValue: "18/08/26 09:00:00",
    deadlineLabel: "Expiring in",
    deadlineValue: "6day(s) 13:12:48",
    durationMins: 20,
    attemptsUsed: 0,
    attemptsTotal: 3,
    successfulSubmissions: 0,
    quizPrerequisite: "Nil",
    topicPrerequisite: "Nil",
    status: "available",
  },
  {
    title: "maths 101 quiz",
    courseCode: "MATH 101",
    courseTitle: "Sets and Number System",
    creator: "Course Tutor",
    startLabel: "Start Date",
    startValue: "17/08/26 18:50:00",
    deadlineLabel: "Expiring in",
    deadlineValue: "3day(s) 14:02:48",
    durationMins: 25,
    attemptsUsed: 0,
    attemptsTotal: 2,
    successfulSubmissions: 0,
    quizPrerequisite: "Nil",
    topicPrerequisite: "Nil",
    status: "available",
  },
  {
    title: "Tutor Quiz",
    courseCode: "PHYS 131",
    courseTitle: "Heat and Properties of Matter",
    creator: "Course Tutor",
    startLabel: "Start Date",
    startValue: "17/08/26 14:36:00",
    deadlineLabel: "Expiring in",
    deadlineValue: "29day(s) 04:48:48",
    durationMins: 20,
    attemptsUsed: 0,
    attemptsTotal: 2,
    successfulSubmissions: 0,
    quizPrerequisite: "Nil",
    topicPrerequisite: "Nil",
    status: "available",
  },
  {
    title: "Quiz 1",
    courseCode: "GENS 101",
    courseTitle: "Nationalism",
    creator: "Course Tutor",
    startLabel: "Start Date",
    startValue: "15/08/26 19:00:00",
    deadlineLabel: "Deadline",
    deadlineValue: "18/08/26 19:00:00",
    durationMins: 20,
    attemptsUsed: 0,
    attemptsTotal: 1,
    successfulSubmissions: 0,
    quizPrerequisite: "Nil",
    topicPrerequisite: "Nil",
    status: "closed",
  },
  {
    title: "Quiz of Happiness",
    courseCode: "GENS 103",
    courseTitle: "English and Communication Skills",
    creator: "Course Tutor",
    startLabel: "Start Date",
    startValue: "15/08/26 19:00:00",
    deadlineLabel: "Deadline",
    deadlineValue: "15/08/26 19:30:00",
    durationMins: 15,
    attemptsUsed: 0,
    attemptsTotal: 1,
    successfulSubmissions: 0,
    quizPrerequisite: "Nil",
    topicPrerequisite: "Nil",
    status: "closed",
  },
];

// ─────────────────────────────────────────────────────────────────────────
// Small helpers
// ─────────────────────────────────────────────────────────────────────────

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <p className="text-sm text-slate-700">
      <span className="font-bold text-slate-800">{label}:</span> {value}
    </p>
  );
}

function statusAction(quiz: Quiz) {
  switch (quiz.status) {
    case "available":
      return (
        <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
          Take Quiz
        </Button>
      );
    case "not_started":
      return (
        <Button
          disabled
          className="w-full cursor-not-allowed bg-rose-400 hover:bg-rose-400"
        >
          Not Started
        </Button>
      );
    case "closed":
    default:
      return (
        <Button disabled className="w-full cursor-not-allowed bg-slate-300">
          Closed
        </Button>
      );
  }
}

function statusLabel(status: QuizStatus) {
  if (status === "available") return "Available";
  if (status === "not_started") return "Not Started";
  return "Closed";
}

// ─────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────

export default function QuizList() {
  const { currentSession } = useContext(SessionContext);

  const { data, loading } = useFetch(
    currentSession?._id ? `/learner/quiz/${currentSession._id}` : null
  );
  const quizzes: Quiz[] =
    Array.isArray(data) && data.length > 0 ? (data as Quiz[]) : fallbackQuizzes;

  const grouped = useMemo(() => quizzes, [quizzes]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-800">Quiz List</h2>
      <p className="text-sm text-slate-500">
        Home <span className="mx-1">/</span>
        <span className="font-medium text-slate-600">Quiz list</span>
      </p>

      {loading ? (
        <p className="py-10 text-center text-sm text-slate-500">
          Loading quizzes…
        </p>
      ) : grouped.length === 0 ? (
        <p className="py-10 text-center text-sm text-slate-500">
          No quizzes have been scheduled yet.
        </p>
      ) : (
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
          {grouped.map((quiz, i) => (
            <Card
              key={quiz._id || i}
              className="break-inside-avoid border-none shadow-sm ring-1 ring-slate-200"
            >
              <CardContent className="space-y-2 p-5">
                <h3 className="pb-2 text-sm font-bold text-slate-800">
                  {quiz.title}
                </h3>
                <div className="space-y-1.5 border-t border-slate-100 pt-3">
                  <DetailRow
                    label="Course"
                    value={`${quiz.courseTitle} (${quiz.courseCode})`}
                  />
                  <DetailRow label="Creator" value={quiz.creator} />
                  <p className="text-sm text-emerald-600">
                    <span className="font-bold">{quiz.startLabel}:</span>{" "}
                    {quiz.startValue}
                  </p>
                  <p className="text-sm text-rose-600">
                    <span className="font-bold">{quiz.deadlineLabel}:</span>{" "}
                    {quiz.deadlineValue}
                  </p>
                  <DetailRow label="Duration" value={`${quiz.durationMins} Mins`} />
                  <DetailRow
                    label="Attempt(s)"
                    value={`${quiz.attemptsUsed} out of ${quiz.attemptsTotal}`}
                  />
                  <DetailRow
                    label="Successful Submission(s)"
                    value={quiz.successfulSubmissions}
                  />
                  <DetailRow label="Quiz Prerequisite" value={quiz.quizPrerequisite} />
                  <DetailRow label="Topic Prerequisite" value={quiz.topicPrerequisite} />
                  <DetailRow label="Status" value={statusLabel(quiz.status)} />
                </div>
                <div className="pt-2">{statusAction(quiz)}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
