// import { useContext, useMemo } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import useFetch from "@/hooks/useFetch";
// import { SessionContext } from "@/contexts/SessionContext";

// // ─────────────────────────────────────────────────────────────────────────
// // Types
// // ─────────────────────────────────────────────────────────────────────────

// type QuizStatus = "available" | "not_started" | "closed";

// type Quiz = {
//   _id?: string;
//   title: string;
//   courseCode: string;
//   courseTitle: string;
//   creator: string;
//   startLabel: string; // e.g. "Starting in" or "Start Date"
//   startValue: string;
//   deadlineLabel: string; // e.g. "Deadline" or "Expiring in"
//   deadlineValue: string;
//   durationMins: number;
//   attemptsUsed: number;
//   attemptsTotal: number;
//   successfulSubmissions: number;
//   quizPrerequisite: string;
//   topicPrerequisite: string;
//   status: QuizStatus;
// };

// // ─────────────────────────────────────────────────────────────────────────
// // Fallback/mock data — swap out once the real quiz endpoint exists.
// // Creator names below are placeholders, not real staff.
// // ─────────────────────────────────────────────────────────────────────────

// const fallbackQuizzes: Quiz[] = [
//   {
//     title: "Tutor Mark Quiz for MATH 101 May Semester",
//     courseCode: "MATH 101",
//     courseTitle: "Sets and Number System",
//     creator: "Course Tutor",
//     startLabel: "Starting in",
//     startValue: "0day(s) 03:07:48",
//     deadlineLabel: "Deadline",
//     deadlineValue: "05/09/26 02:55:00",
//     durationMins: 20,
//     attemptsUsed: 0,
//     attemptsTotal: 2,
//     successfulSubmissions: 0,
//     quizPrerequisite: "MATH 101 Quiz",
//     topicPrerequisite: "MATH 101 Note",
//     status: "not_started",
//   },
//   {
//     title: "Gens 101 Tutor's Quiz",
//     courseCode: "GENS 101",
//     courseTitle: "Nationalism",
//     creator: "Course Tutor",
//     startLabel: "Start Date",
//     startValue: "18/08/26 09:00:00",
//     deadlineLabel: "Expiring in",
//     deadlineValue: "6day(s) 13:12:48",
//     durationMins: 20,
//     attemptsUsed: 0,
//     attemptsTotal: 3,
//     successfulSubmissions: 0,
//     quizPrerequisite: "Nil",
//     topicPrerequisite: "Nil",
//     status: "available",
//   },
//   {
//     title: "maths 101 quiz",
//     courseCode: "MATH 101",
//     courseTitle: "Sets and Number System",
//     creator: "Course Tutor",
//     startLabel: "Start Date",
//     startValue: "17/08/26 18:50:00",
//     deadlineLabel: "Expiring in",
//     deadlineValue: "3day(s) 14:02:48",
//     durationMins: 25,
//     attemptsUsed: 0,
//     attemptsTotal: 2,
//     successfulSubmissions: 0,
//     quizPrerequisite: "Nil",
//     topicPrerequisite: "Nil",
//     status: "available",
//   },
//   {
//     title: "Tutor Quiz",
//     courseCode: "PHYS 131",
//     courseTitle: "Heat and Properties of Matter",
//     creator: "Course Tutor",
//     startLabel: "Start Date",
//     startValue: "17/08/26 14:36:00",
//     deadlineLabel: "Expiring in",
//     deadlineValue: "29day(s) 04:48:48",
//     durationMins: 20,
//     attemptsUsed: 0,
//     attemptsTotal: 2,
//     successfulSubmissions: 0,
//     quizPrerequisite: "Nil",
//     topicPrerequisite: "Nil",
//     status: "available",
//   },
//   {
//     title: "Quiz 1",
//     courseCode: "GENS 101",
//     courseTitle: "Nationalism",
//     creator: "Course Tutor",
//     startLabel: "Start Date",
//     startValue: "15/08/26 19:00:00",
//     deadlineLabel: "Deadline",
//     deadlineValue: "18/08/26 19:00:00",
//     durationMins: 20,
//     attemptsUsed: 0,
//     attemptsTotal: 1,
//     successfulSubmissions: 0,
//     quizPrerequisite: "Nil",
//     topicPrerequisite: "Nil",
//     status: "closed",
//   },
//   {
//     title: "Quiz of Happiness",
//     courseCode: "GENS 103",
//     courseTitle: "English and Communication Skills",
//     creator: "Course Tutor",
//     startLabel: "Start Date",
//     startValue: "15/08/26 19:00:00",
//     deadlineLabel: "Deadline",
//     deadlineValue: "15/08/26 19:30:00",
//     durationMins: 15,
//     attemptsUsed: 0,
//     attemptsTotal: 1,
//     successfulSubmissions: 0,
//     quizPrerequisite: "Nil",
//     topicPrerequisite: "Nil",
//     status: "closed",
//   },
// ];

// // ─────────────────────────────────────────────────────────────────────────
// // Small helpers
// // ─────────────────────────────────────────────────────────────────────────

// function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
//   return (
//     <p className="text-sm text-slate-700">
//       <span className="font-bold text-slate-800">{label}:</span> {value}
//     </p>
//   );
// }

// function statusAction(quiz: Quiz) {
//   switch (quiz.status) {
//     case "available":
//       return (
//         <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
//           Take Quiz
//         </Button>
//       );
//     case "not_started":
//       return (
//         <Button
//           disabled
//           className="w-full cursor-not-allowed bg-rose-400 hover:bg-rose-400"
//         >
//           Not Started
//         </Button>
//       );
//     case "closed":
//     default:
//       return (
//         <Button disabled className="w-full cursor-not-allowed bg-slate-300">
//           Closed
//         </Button>
//       );
//   }
// }

// function statusLabel(status: QuizStatus) {
//   if (status === "available") return "Available";
//   if (status === "not_started") return "Not Started";
//   return "Closed";
// }

// // ─────────────────────────────────────────────────────────────────────────
// // Page
// // ─────────────────────────────────────────────────────────────────────────

// export default function QuizList() {
//   const { currentSession } = useContext(SessionContext);

//   const { data, loading } = useFetch(
//     currentSession?._id ? `/learner/quiz/${currentSession._id}` : null
//   );
//   const quizzes: Quiz[] =
//     Array.isArray(data) && data.length > 0 ? (data as Quiz[]) : fallbackQuizzes;

//   const grouped = useMemo(() => quizzes, [quizzes]);

//   return (
//     <div className="space-y-4">
//       <h2 className="text-xl font-bold text-slate-800">Quiz List</h2>
//       <p className="text-sm text-slate-500">
//         Home <span className="mx-1">/</span>
//         <span className="font-medium text-slate-600">Quiz list</span>
//       </p>

//       {loading ? (
//         <p className="py-10 text-center text-sm text-slate-500">
//           Loading quizzes…
//         </p>
//       ) : grouped.length === 0 ? (
//         <p className="py-10 text-center text-sm text-slate-500">
//           No quizzes have been scheduled yet.
//         </p>
//       ) : (
//         <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
//           {grouped.map((quiz, i) => (
//             <Card
//               key={quiz._id || i}
//               className="break-inside-avoid border-none shadow-sm ring-1 ring-slate-200"
//             >
//               <CardContent className="space-y-2 p-5">
//                 <h3 className="pb-2 text-sm font-bold text-slate-800">
//                   {quiz.title}
//                 </h3>
//                 <div className="space-y-1.5 border-t border-slate-100 pt-3">
//                   <DetailRow
//                     label="Course"
//                     value={`${quiz.courseTitle} (${quiz.courseCode})`}
//                   />
//                   <DetailRow label="Creator" value={quiz.creator} />
//                   <p className="text-sm text-emerald-600">
//                     <span className="font-bold">{quiz.startLabel}:</span>{" "}
//                     {quiz.startValue}
//                   </p>
//                   <p className="text-sm text-rose-600">
//                     <span className="font-bold">{quiz.deadlineLabel}:</span>{" "}
//                     {quiz.deadlineValue}
//                   </p>
//                   <DetailRow label="Duration" value={`${quiz.durationMins} Mins`} />
//                   <DetailRow
//                     label="Attempt(s)"
//                     value={`${quiz.attemptsUsed} out of ${quiz.attemptsTotal}`}
//                   />
//                   <DetailRow
//                     label="Successful Submission(s)"
//                     value={quiz.successfulSubmissions}
//                   />
//                   <DetailRow label="Quiz Prerequisite" value={quiz.quizPrerequisite} />
//                   <DetailRow label="Topic Prerequisite" value={quiz.topicPrerequisite} />
//                   <DetailRow label="Status" value={statusLabel(quiz.status)} />
//                 </div>
//                 <div className="pt-2">{statusAction(quiz)}</div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useFetch from "@/hooks/useFetch";

// ─────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────

type QuizStatus = "available" | "not_started" | "closed";

type ApiQuiz = {
  _id: string;
  title: string;
  type?: "Test" | "Exam";
  instructions?: string;
  duration: number;
  passMark?: number;
  totalMarks?: number;
  questionCount?: number;
  startDate?: string | null;
  endDate?: string | null;
  course?: { code?: string; title?: string };
  creator?: string;
};

type QuizResponse = {
  quizzes?: ApiQuiz[];
  registered?: boolean;
} | null;

// ─────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────

const getStatus = (quiz: ApiQuiz, now: number): QuizStatus => {
  const start = quiz.startDate ? new Date(quiz.startDate).getTime() : null;
  const end = quiz.endDate ? new Date(quiz.endDate).getTime() : null;

  if (start && now < start) return "not_started";
  if (end && now > end) return "closed";
  return "available";
};

const formatDateTime = (date?: string | null) => {
  if (!date) return "—";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const countdown = (ms: number) => {
  const totalMinutes = Math.max(0, Math.floor(ms / 60000));
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;

  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

const statusLabel = (status: QuizStatus) =>
  status === "available" ? "Available" : status === "not_started" ? "Not Started" : "Closed";

const STATUS_ORDER: Record<QuizStatus, number> = {
  available: 0,
  not_started: 1,
  closed: 2,
};

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <p className="text-sm text-slate-700">
      <span className="font-bold text-slate-800">{label}:</span> {value}
    </p>
  );
}

function StatusAction({ status }: { status: QuizStatus }) {
  if (status === "available") {
    return (
      <Button className="w-full bg-emerald-600 hover:bg-emerald-700">
        Take Quiz
      </Button>
    );
  }

  if (status === "not_started") {
    return (
      <Button disabled className="w-full cursor-not-allowed bg-rose-400 hover:bg-rose-400">
        Not Started
      </Button>
    );
  }

  return (
    <Button disabled className="w-full cursor-not-allowed bg-slate-300">
      Closed
    </Button>
  );
}

// ─────────────────────────────────────────────────────────────────────────
// Page
// ─────────────────────────────────────────────────────────────────────────

export default function QuizList() {
  const { data, loading, error } = useFetch("/quizzes/available");

  // Re-check statuses every 30 seconds so "Take Quiz" unlocks on time
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(timer);
  }, []);

  const response = data as QuizResponse;
  const registered = response?.registered ?? true;

  const quizzes = useMemo(() => {
    const list = response?.quizzes ?? [];

    return list
      .map((quiz) => ({ quiz, status: getStatus(quiz, now) }))
      .sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]);
  }, [response, now]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-slate-800">Quiz List</h2>
      <p className="text-sm text-slate-500">
        Home <span className="mx-1">/</span>
        <span className="font-medium text-slate-600">Quiz list</span>
      </p>

      {loading ? (
        <p className="py-10 text-center text-sm text-slate-500">Loading quizzes…</p>
      ) : error ? (
        <p className="py-10 text-center text-sm text-red-600">
          Could not load your quizzes. Please try again.
        </p>
      ) : !registered ? (
        <p className="py-10 text-center text-sm text-slate-500">
          Register your courses for this semester to see your quizzes.
        </p>
      ) : quizzes.length === 0 ? (
        <p className="py-10 text-center text-sm text-slate-500">
          No quizzes have been published for your courses yet.
        </p>
      ) : (
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
          {quizzes.map(({ quiz, status }) => {
            const start = quiz.startDate ? new Date(quiz.startDate).getTime() : null;
            const end = quiz.endDate ? new Date(quiz.endDate).getTime() : null;

            return (
              <Card
                key={quiz._id}
                className="break-inside-avoid border-none shadow-sm ring-1 ring-slate-200"
              >
                <CardContent className="space-y-2 p-5">
                  <h3 className="pb-2 text-sm font-bold text-slate-800">{quiz.title}</h3>

                  <div className="space-y-1.5 border-t border-slate-100 pt-3">
                    <DetailRow
                      label="Course"
                      value={
                        quiz.course?.title
                          ? `${quiz.course.title}${quiz.course.code ? ` (${quiz.course.code})` : ""}`
                          : quiz.course?.code || "—"
                      }
                    />
                    <DetailRow label="Creator" value={quiz.creator || "Course Tutor"} />
                    {quiz.type && <DetailRow label="Type" value={quiz.type} />}

                    {start && (
                      <p className="text-sm text-emerald-600">
                        <span className="font-bold">
                          {status === "not_started" ? "Starting in" : "Start Date"}:
                        </span>{" "}
                        {status === "not_started"
                          ? countdown(start - now)
                          : formatDateTime(quiz.startDate)}
                      </p>
                    )}

                    {end && (
                      <p className="text-sm text-rose-600">
                        <span className="font-bold">
                          {status === "available" ? "Expiring in" : "Deadline"}:
                        </span>{" "}
                        {status === "available"
                          ? countdown(end - now)
                          : formatDateTime(quiz.endDate)}
                      </p>
                    )}

                    <DetailRow label="Duration" value={`${quiz.duration} Mins`} />
                    <DetailRow label="Questions" value={quiz.questionCount ?? 0} />
                    <DetailRow label="Total Marks" value={quiz.totalMarks ?? 0} />
                    {quiz.passMark !== undefined && (
                      <DetailRow label="Pass Mark" value={`${quiz.passMark}%`} />
                    )}
                    {quiz.instructions && (
                      <DetailRow label="Instructions" value={quiz.instructions} />
                    )}
                    <DetailRow label="Status" value={statusLabel(status)} />
                  </div>

                  <div className="pt-2">
                    <StatusAction status={status} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}