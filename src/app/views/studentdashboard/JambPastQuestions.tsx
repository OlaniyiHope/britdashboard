// import { useEffect, useState } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { API_BASE_URL, getToken } from "@/lib/api";

// type PublishedResult = {
//   id: string;
//   courseCode: string;
//   courseTitle: string;
//   session: string;
//   semester: string;
//   level: string;
//   creditUnits: number;
//   caScore: number | null;
//   examScore: number | null;
//   total: number | null;
//   grade: string | null;
//   gradePoint: number | null;
//   comment: string;
//   publishedAt: string | null;
// };

// async function request<T>(path: string): Promise<T> {
//   const res = await fetch(`${API_BASE_URL}${path}`, {
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${getToken()}`,
//     },
//   });
//   const data = await res.json().catch(() => ({}));
//   if (!res.ok) throw new Error(data?.message || "Request failed.");
//   return data as T;
// }

// const display = (v: number | null | undefined) => (v == null ? "—" : String(v));

// const GRADE_STYLE: Record<string, string> = {
//   A: "bg-emerald-50 text-emerald-700 border-emerald-200",
//   B: "bg-blue-50 text-blue-700 border-blue-200",
//   C: "bg-indigo-50 text-indigo-700 border-indigo-200",
//   D: "bg-amber-50 text-amber-700 border-amber-200",
//   F: "bg-red-50 text-red-700 border-red-200",
// };

// export default function GradeBook() {
//   const [results, setResults] = useState<PublishedResult[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [selected, setSelected] = useState<PublishedResult | null>(null);

//   useEffect(() => {
//     request<{ results: PublishedResult[] }>("/results/my-published")
//       .then((data) => setResults(data.results || []))
//       .catch((err) => setError((err as Error).message))
//       .finally(() => setLoading(false));
//   }, []);

//   return (
//     <div className="w-full space-y-6">
//       {/* Header */}
//       <div>
//         <h2 className="text-2xl font-bold text-slate-800">My Grade Book</h2>
//         <div className="mt-4 text-sm text-slate-500">
//           <span>Home</span>
//           <span className="mx-2">/</span>
//           <span className="text-slate-700">{selected ? "See grade breakdown" : "Pick a course"}</span>
//         </div>
//       </div>

//       {/* Progress Steps */}
//       <div className="relative px-4 pt-8 pb-5">
//         <div className="absolute left-[12%] right-[12%] top-[42px] h-px bg-slate-300" />
//         <div className="relative z-10 flex items-start justify-between">
//           <div className="flex w-1/2 flex-col items-center">
//             <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-600 text-xs font-semibold text-white">
//               1
//             </div>
//             <span className="mt-2 text-xs font-medium text-slate-700">Pick a course</span>
//           </div>
//           <div className="flex w-1/2 flex-col items-center">
//             <div
//               className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
//                 selected
//                   ? "bg-green-600 text-white"
//                   : "border border-slate-300 bg-white font-medium text-slate-500"
//               }`}
//             >
//               2
//             </div>
//             <span className={`mt-2 text-xs ${selected ? "font-medium text-slate-700" : "text-slate-500"}`}>
//               See grade breakdown
//             </span>
//           </div>
//         </div>
//       </div>

//       {loading ? (
//         <p className="py-10 text-center text-sm text-slate-500">Loading your results...</p>
//       ) : error ? (
//         <p className="py-10 text-center text-sm text-red-600">{error}</p>
//       ) : !selected ? (
//         <Card className="border-none shadow-none">
//           <CardContent className="p-0">
//             <div className="mb-4">
//               <h3 className="text-xl font-semibold text-slate-800">
//                 Courses ({results.length})
//               </h3>
//             </div>

//             {results.length === 0 ? (
//               <div className="rounded-md border border-dashed border-slate-300 p-10 text-center">
//                 <p className="text-sm font-semibold text-slate-500">No published results yet</p>
//                 <p className="mt-1 text-xs text-slate-400">
//                   Your results will appear here once the administrator publishes them.
//                 </p>
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <div className="min-w-[760px] overflow-hidden rounded-md border border-slate-200 bg-white">
//                   <div className="grid grid-cols-[1fr_110px_110px_110px_90px_140px] border-b border-slate-200 px-4 py-4 text-sm font-semibold text-slate-700">
//                     <div>Course</div>
//                     <div>CA / 30</div>
//                     <div>Exam / 70</div>
//                     <div>Total</div>
//                     <div>Grade</div>
//                     <div>Action</div>
//                   </div>

//                   {results.map((r) => (
//                     <div
//                       key={r.id}
//                       className="grid grid-cols-[1fr_110px_110px_110px_90px_140px] items-center border-b border-slate-100 px-4 py-3 last:border-b-0 hover:bg-slate-50"
//                     >
//                       <div className="pr-4">
//                         <p className="text-sm font-medium text-slate-700">
//                           {r.courseTitle}
//                           <span className="ml-1 text-slate-500">- {r.courseCode}</span>
//                         </p>
//                       </div>
//                       <div className="text-sm text-slate-700">{display(r.caScore)}</div>
//                       <div className="text-sm text-slate-700">{display(r.examScore)}</div>
//                       <div className="text-sm font-semibold text-slate-800">{display(r.total)}</div>
//                       <div>
//                         {r.grade ? (
//                           <span
//                             className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-bold ${
//                               GRADE_STYLE[r.grade] ?? "bg-slate-100 text-slate-700 border-slate-200"
//                             }`}
//                           >
//                             {r.grade}
//                           </span>
//                         ) : (
//                           <span className="text-sm text-slate-400">—</span>
//                         )}
//                       </div>
//                       <div>
//                         <Button
//                           variant="outline"
//                           size="sm"
//                           onClick={() => setSelected(r)}
//                           className="border-slate-200 bg-white text-xs font-normal text-slate-600 hover:bg-slate-50"
//                         >
//                           See Breakdown
//                         </Button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       ) : (
//         <Card className="border-none shadow-none">
//           <CardContent className="p-0">
//             <div className="mb-5 flex items-center justify-between">
//               <div>
//                 <h3 className="text-xl font-semibold text-slate-800">Grade Breakdown</h3>
//                 <p className="mt-1 text-sm text-slate-500">
//                   {selected.courseTitle} - {selected.courseCode}
//                 </p>
//               </div>
//               <Button variant="outline" onClick={() => setSelected(null)}>
//                 Back to Courses
//               </Button>
//             </div>

//             <div className="rounded-md border border-slate-200 bg-white">
//               <div className="grid grid-cols-3 border-b border-slate-200 px-5 py-4 text-sm font-semibold text-slate-700">
//                 <div>Assessment</div>
//                 <div>Score</div>
//                 <div>Maximum</div>
//               </div>

//               <div className="grid grid-cols-3 border-b border-slate-100 px-5 py-4 text-sm">
//                 <div>Continuous Assessment</div>
//                 <div className="text-slate-800">{display(selected.caScore)}</div>
//                 <div>30</div>
//               </div>

//               <div className="grid grid-cols-3 border-b border-slate-100 px-5 py-4 text-sm">
//                 <div>Examination</div>
//                 <div className="text-slate-800">{display(selected.examScore)}</div>
//                 <div>70</div>
//               </div>

//               <div className="grid grid-cols-3 border-b border-slate-100 px-5 py-4 text-sm font-semibold">
//                 <div>Total</div>
//                 <div className="text-slate-800">{display(selected.total)}</div>
//                 <div>100</div>
//               </div>

//               <div className="grid grid-cols-3 border-b border-slate-100 px-5 py-4 text-sm">
//                 <div>Grade</div>
//                 <div className="text-slate-800">{selected.grade ?? "—"}</div>
//                 <div>Point: {display(selected.gradePoint)}</div>
//               </div>

//               {selected.comment && (
//                 <div className="px-5 py-4 text-sm">
//                   <p className="font-semibold text-slate-700">Lecturer's remark</p>
//                   <p className="mt-1 text-slate-600">{selected.comment}</p>
//                 </div>
//               )}
//             </div>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// }
import { useContext, useEffect, useState } from "react";
import { AlertCircle, Loader2, Printer } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SessionContext } from "@/contexts/SessionContext";
import { API_BASE_URL, getToken } from "@/lib/api";

const SCHOOL_NAME = "BRITISH POLYTECHNIC";

type Row = {
  courseCode: string;
  courseTitle: string;
  units: number;
  total: number | null;
  grade: string | null;
  weightedGradePoints: number;
};

type Summary = {
  unitsAttempted: number;
  unitsPassed: number;
  weightedGradePoints: number;
  gpa: number;
};

type Semester = {
  session: string;
  semester: string;
  level: string;
  rows: Row[];
  summary: Summary;
};

type Statement = {
  student: { name: string; matricNumber: string; email: string };
  period: { session: string; semester: string };
  semesters: Semester[];
  cumulative: Summary;
};

async function request<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.message || "Request failed.");
  return data as T;
}

export default function GradeBook() {
  const { currentSession, currentSemester } = useContext(SessionContext);

  const [statement, setStatement] = useState<Statement | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!currentSession?._id) return;

    let cancelled = false;
    setLoading(true);
    setError("");

    const params = new URLSearchParams({
      sessionId: currentSession._id,
      semester: currentSemester,
    });

    request<Statement>(`/results/my-statement?${params.toString()}`)
      .then((data) => {
        if (!cancelled) setStatement(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setStatement(null);
          setError((err as Error).message);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [currentSession?._id, currentSemester]);

  return (
    <div className="w-full space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">My Grade Book</h2>
        <p className="mt-1 text-sm text-slate-500">
          {currentSession?.name ?? "No session"} · {currentSemester} Semester. Change these in the header.
        </p>
      </div>

      {loading ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <Loader2 className="h-7 w-7 animate-spin text-[#006dcc]" />
        </div>
      ) : error ? (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      ) : statement ? (
        <div className="space-y-6">
          <div className="flex justify-end print:hidden">
            <Button variant="outline" onClick={() => window.print()} className="gap-2">
              <Printer className="h-4 w-4" />
              Print
            </Button>
          </div>

          <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
            <CardContent className="space-y-6 p-6 print:p-0">
              <div className="border-b-2 border-slate-800 pb-4 text-center">
                <p className="text-lg font-bold uppercase tracking-wide text-[#081022]">{SCHOOL_NAME}</p>
                <p className="mt-2 text-xl font-black uppercase">Statement of Examination Results</p>
              </div>

              <div className="grid gap-3 text-sm sm:grid-cols-2">
                <p>
                  <span className="font-semibold text-slate-500">Student's name: </span>
                  <span className="font-bold text-[#081022]">{statement.student.name}</span>
                </p>
                <p>
                  <span className="font-semibold text-slate-500">Matric no: </span>
                  <span className="font-bold text-[#081022]">{statement.student.matricNumber}</span>
                </p>
                {statement.student.email && (
                  <p>
                    <span className="font-semibold text-slate-500">Email: </span>
                    <span>{statement.student.email}</span>
                  </p>
                )}
              </div>

              {statement.semesters.length === 0 ? (
                <p className="py-10 text-center text-sm text-slate-500">
                  No published results for {statement.period.session} · {statement.period.semester} Semester yet.
                </p>
              ) : (
                <>
                  {statement.semesters.map((sem) => (
                    <section key={`${sem.session}-${sem.semester}`} className="space-y-3">
                      <h2 className="text-sm font-bold uppercase text-[#081022]">
                        {sem.session} · {sem.semester} Semester
                        {sem.level ? ` · ${sem.level}` : ""}
                      </h2>

                      <div className="overflow-x-auto rounded-md border border-slate-300">
                        <table className="w-full text-sm">
                          <thead className="bg-slate-900 text-left text-xs uppercase text-white">
                            <tr>
                              <th className="px-3 py-2">SN</th>
                              <th className="px-3 py-2">Code</th>
                              <th className="px-3 py-2">Title</th>
                              <th className="px-3 py-2 text-center">Unit</th>
                              <th className="px-3 py-2 text-center">Grade</th>
                              <th className="px-3 py-2 text-right">WGP</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-200">
                            {sem.rows.map((r, i) => (
                              <tr key={`${r.courseCode}-${i}`}>
                                <td className="px-3 py-2">{i + 1}</td>
                                <td className="px-3 py-2 font-medium">{r.courseCode}</td>
                                <td className="px-3 py-2">{r.courseTitle}</td>
                                <td className="px-3 py-2 text-center">{r.units}</td>
                                <td className="px-3 py-2 text-center font-bold">{r.grade ?? "—"}</td>
                                <td className="px-3 py-2 text-right">{r.weightedGradePoints.toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm sm:grid-cols-4">
                        <p>Units attempted: <strong>{sem.summary.unitsAttempted}</strong></p>
                        <p>Units passed: <strong>{sem.summary.unitsPassed}</strong></p>
                        <p>Weighted grade points: <strong>{sem.summary.weightedGradePoints.toFixed(2)}</strong></p>
                        <p>GPA: <strong>{sem.summary.gpa.toFixed(2)}</strong></p>
                      </div>
                    </section>
                  ))}

                  <div className="rounded-md border-2 border-slate-800 p-4">
                    <p className="text-sm font-bold uppercase">Cumulative</p>
                    <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 text-sm sm:grid-cols-4">
                      <p>Units attempted: <strong>{statement.cumulative.unitsAttempted}</strong></p>
                      <p>Units passed: <strong>{statement.cumulative.unitsPassed}</strong></p>
                      <p>Weighted grade points: <strong>{statement.cumulative.weightedGradePoints.toFixed(2)}</strong></p>
                      <p>CGPA: <strong>{statement.cumulative.gpa.toFixed(2)}</strong></p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}