// import { useState } from "react";
// import { Search, Printer, Loader2, AlertCircle } from "lucide-react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { API_BASE_URL, getToken } from "@/lib/api";

// const SCHOOL_NAME = "BRITISH POLYTECHNIC";

// type Row = {
//   courseCode: string;
//   courseTitle: string;
//   units: number;
//   total: number | null;
//   grade: string | null;
//   weightedGradePoints: number;
// };

// type Summary = {
//   unitsAttempted: number;
//   unitsPassed: number;
//   weightedGradePoints: number;
//   gpa: number;
// };

// type Semester = {
//   session: string;
//   semester: string;
//   level: string;
//   rows: Row[];
//   summary: Summary;
// };

// type Statement = {
//   student: { name: string; matricNumber: string; email: string };
//   semesters: Semester[];
//   cumulative: Summary;
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

// export default function StudentResultStatement() {
//   const [matric, setMatric] = useState("");
//   const [statement, setStatement] = useState<Statement | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const handleSearch = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const value = matric.trim();
//     if (!value) return;

//     try {
//       setLoading(true);
//       setError("");
//       setStatement(null);
//       setStatement(
//         await request<Statement>(
//           `/results/admin/student-statement?matricNo=${encodeURIComponent(value)}`
//         )
//       );
//     } catch (err) {
//       setError((err as Error).message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-full space-y-6 bg-slate-50 p-4 md:p-6">
//       {/* Search (hidden when printing) */}
//       <div className="flex flex-col gap-3 print:hidden md:flex-row md:items-center md:justify-between">
//         <div>
//           <h1 className="text-xl font-bold text-[#081022] md:text-2xl">Student Results</h1>
//           <p className="mt-1 text-xs text-slate-500">
//             Look up a student by matric number to view their published statement.
//           </p>
//         </div>

//         <form onSubmit={handleSearch} className="flex gap-2">
//           <div className="relative">
//             <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
//             <input
//               value={matric}
//               onChange={(e) => setMatric(e.target.value)}
//               placeholder="Matric number"
//               className="h-10 w-64 rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none focus:border-[#006dcc]"
//             />
//           </div>
//           <Button type="submit" disabled={loading || !matric.trim()} className="bg-[#081022] hover:bg-[#0d1a33]">
//             {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
//           </Button>
//         </form>
//       </div>

//       {error && (
//         <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 print:hidden">
//           <AlertCircle className="h-5 w-5 text-red-600" />
//           <p className="text-sm text-red-700">{error}</p>
//         </div>
//       )}

//       {statement && (
//         <Card className="border-none bg-white shadow-sm ring-1 ring-slate-200">
//           <CardContent className="space-y-6 p-6 print:p-0">
//             {/* Print button */}
//             <div className="flex justify-end print:hidden">
//               <Button variant="outline" onClick={() => window.print()} className="gap-2">
//                 <Printer className="h-4 w-4" />
//                 Print
//               </Button>
//             </div>

//             {/* Letterhead */}
//             <div className="border-b-2 border-slate-800 pb-4 text-center">
//               <p className="text-lg font-bold uppercase tracking-wide text-[#081022]">{SCHOOL_NAME}</p>
//               <p className="mt-2 text-xl font-black uppercase">Statement of Examination Results</p>
//             </div>

//             {/* Student details */}
//             <div className="grid gap-3 text-sm sm:grid-cols-2">
//               <p>
//                 <span className="font-semibold text-slate-500">Student's name: </span>
//                 <span className="font-bold text-[#081022]">{statement.student.name}</span>
//               </p>
//               <p>
//                 <span className="font-semibold text-slate-500">Matric no: </span>
//                 <span className="font-bold text-[#081022]">{statement.student.matricNumber}</span>
//               </p>
//               {statement.student.email && (
//                 <p>
//                   <span className="font-semibold text-slate-500">Email: </span>
//                   <span>{statement.student.email}</span>
//                 </p>
//               )}
//             </div>

//             {statement.semesters.length === 0 ? (
//               <p className="py-10 text-center text-sm text-slate-500">
//                 This student has no published results yet.
//               </p>
//             ) : (
//               <>
//                 {statement.semesters.map((sem) => (
//                   <section key={`${sem.session}-${sem.semester}`} className="space-y-3">
//                     <h2 className="text-sm font-bold uppercase text-[#081022]">
//                       {sem.session} · {sem.semester} Semester
//                       {sem.level ? ` · ${sem.level}` : ""}
//                     </h2>

//                     <div className="overflow-x-auto rounded-md border border-slate-300">
//                       <table className="w-full text-sm">
//                         <thead className="bg-slate-900 text-left text-xs uppercase text-white">
//                           <tr>
//                             <th className="px-3 py-2">SN</th>
//                             <th className="px-3 py-2">Code</th>
//                             <th className="px-3 py-2">Title</th>
//                             <th className="px-3 py-2 text-center">Unit</th>
//                             <th className="px-3 py-2 text-center">Grade</th>
//                             <th className="px-3 py-2 text-right">WGP</th>
//                           </tr>
//                         </thead>
//                         <tbody className="divide-y divide-slate-200">
//                           {sem.rows.map((r, i) => (
//                             <tr key={`${r.courseCode}-${i}`}>
//                               <td className="px-3 py-2">{i + 1}</td>
//                               <td className="px-3 py-2 font-medium">{r.courseCode}</td>
//                               <td className="px-3 py-2">{r.courseTitle}</td>
//                               <td className="px-3 py-2 text-center">{r.units}</td>
//                               <td className="px-3 py-2 text-center font-bold">{r.grade ?? "—"}</td>
//                               <td className="px-3 py-2 text-right">{r.weightedGradePoints.toFixed(2)}</td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>

//                     <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm sm:grid-cols-4">
//                       <p>Units attempted: <strong>{sem.summary.unitsAttempted}</strong></p>
//                       <p>Units passed: <strong>{sem.summary.unitsPassed}</strong></p>
//                       <p>Weighted grade points: <strong>{sem.summary.weightedGradePoints.toFixed(2)}</strong></p>
//                       <p>GPA: <strong>{sem.summary.gpa.toFixed(2)}</strong></p>
//                     </div>
//                   </section>
//                 ))}

//                 {/* Cumulative */}
//                 <div className="rounded-md border-2 border-slate-800 p-4">
//                   <p className="text-sm font-bold uppercase">Cumulative</p>
//                   <div className="mt-2 grid grid-cols-2 gap-x-6 gap-y-1 text-sm sm:grid-cols-4">
//                     <p>Units attempted: <strong>{statement.cumulative.unitsAttempted}</strong></p>
//                     <p>Units passed: <strong>{statement.cumulative.unitsPassed}</strong></p>
//                     <p>Weighted grade points: <strong>{statement.cumulative.weightedGradePoints.toFixed(2)}</strong></p>
//                     <p>CGPA: <strong>{statement.cumulative.gpa.toFixed(2)}</strong></p>
//                   </div>
//                 </div>
//               </>
//             )}
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   );
// }
import { useContext, useEffect, useState } from "react";
import {
  Search,
  Printer,
  Loader2,
  AlertCircle,
  MoreHorizontal,
  FileText,
  ArrowLeft,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { API_BASE_URL, getToken } from "@/lib/api";
import { SessionContext } from "@/contexts/SessionContext";
const SCHOOL_NAME = "BRITISH POLYTECHNIC";

type Department = { id: string; name: string; code: string };
type Student = { id: string; name: string; matricNumber: string; email: string };

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

export default function StudentResults() {
  const { currentSession, currentSemester } = useContext(SessionContext);

  const [departments, setDepartments] = useState<Department[]>([]);
  const [departmentId, setDepartmentId] = useState("");
  const [students, setStudents] = useState<Student[] | null>(null);
  const [listLoading, setListLoading] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const [statementLoading, setStatementLoading] = useState(false);
  const [statement, setStatement] = useState<Statement | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    request<{ departments: Department[] }>("/results/admin/departments")
      .then((data) => setDepartments(data.departments || []))
      .catch((err) => setError((err as Error).message));
  }, []);

  // Load the statement for the selected student, session and semester.
  // Reruns when any of them changes, so the page always matches the header.
  useEffect(() => {
    if (!selectedStudentId || !currentSession?._id) return;

    let cancelled = false;
    const params = new URLSearchParams({
      studentId: selectedStudentId,
      sessionId: currentSession._id,
      semester: currentSemester,
    });

    setStatementLoading(true);
    setStatement(null);
    setError("");

    request<Statement>(`/results/admin/student-statement?${params.toString()}`)
      .then((data) => {
        if (!cancelled) setStatement(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setError((err as Error).message);
          setSelectedStudentId(null);
        }
      })
      .finally(() => {
        if (!cancelled) setStatementLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedStudentId, currentSession?._id, currentSemester]);

  const handleSearch = async () => {
    if (!departmentId) {
      setError("Select a department first.");
      return;
    }
    try {
      setError("");
      setListLoading(true);
      const data = await request<{ students: Student[] }>(
        `/results/admin/students?departmentId=${departmentId}`
      );
      setStudents(data.students || []);
    } catch (err) {
      setStudents(null);
      setError((err as Error).message);
    } finally {
      setListLoading(false);
    }
  };

  const viewStatement = (studentId: string) => {
    setOpenMenuId(null);
    setSelectedStudentId(studentId);
  };

  const backToList = () => {
    setSelectedStudentId(null);
    setStatement(null);
  };

  if (statementLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-[#006dcc]" />
      </div>
    );
  }

  if (statement) {
    return <StatementView statement={statement} onBack={backToList} />;
  }

  const departmentName = departments.find((d) => d.id === departmentId)?.name ?? "";

  return (
    <div className="min-h-full space-y-6 bg-slate-50 p-4 md:p-6">
      {/* Header and filter */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#081022] md:text-2xl">Student Results</h1>
          <p className="mt-1 text-xs text-slate-500">
            Showing statements for{" "}
            <span className="font-semibold text-slate-700">
              {currentSession?.name ?? "no session"} · {currentSemester} Semester
            </span>
            . Change them in the header.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <select
            value={departmentId}
            onChange={(e) => {
              setDepartmentId(e.target.value);
              setStudents(null);
              setOpenMenuId(null);
            }}
            className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#006dcc] sm:w-72"
          >
            <option value="">Select department</option>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
                {d.code ? ` (${d.code})` : ""}
              </option>
            ))}
          </select>

          <Button
            onClick={handleSearch}
            disabled={!departmentId || listLoading}
            className="h-10 gap-2 bg-[#081022] hover:bg-[#0d1a33]"
          >
            {listLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            Search
          </Button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Student list */}
      {students === null ? (
        <div className="flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white text-center">
          <Search className="mb-3 h-7 w-7 text-slate-300" />
          <p className="text-sm font-semibold text-slate-500">No department searched yet</p>
          <p className="mt-1 text-xs text-slate-400">Pick a department and click Search.</p>
        </div>
      ) : (
        <Card className="overflow-hidden border-none bg-white shadow-sm ring-1 ring-slate-200">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="text-sm font-bold text-[#081022]">
              {departmentName} · {students.length} student{students.length !== 1 ? "s" : ""}
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead className="bg-slate-50">
                <tr className="border-b border-slate-200 text-left text-xs font-semibold uppercase text-slate-500">
                  <th className="px-5 py-3">S/N</th>
                  <th className="px-5 py-3">Matric No.</th>
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-5 py-12 text-center text-sm text-slate-500">
                      No students are in this department.
                    </td>
                  </tr>
                ) : (
                  students.map((s, i) => (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="px-5 py-3 text-sm text-slate-500">{i + 1}</td>
                      <td className="px-5 py-3 text-sm font-semibold text-slate-800">{s.matricNumber}</td>
                      <td className="px-5 py-3 text-sm text-[#006dcc]">{s.name}</td>
                      <td className="px-5 py-3 text-sm text-slate-600">{s.email || "—"}</td>
                      <td className="px-5 py-3">
                        <div className="relative flex justify-end">
                          <button
                            type="button"
                            onClick={() => setOpenMenuId(openMenuId === s.id ? null : s.id)}
                            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100"
                          >
                            <MoreHorizontal className="h-5 w-5" />
                          </button>

                          {openMenuId === s.id && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                              <div className="absolute right-0 top-8 z-20 w-44 overflow-hidden rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
                                <button
                                  type="button"
                                  onClick={() => viewStatement(s.id)}
                                  className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
                                >
                                  <FileText className="h-4 w-4 text-[#006dcc]" />
                                  View Statement
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* STATEMENT                                                           */
/* ------------------------------------------------------------------ */

function StatementView({ statement, onBack }: { statement: Statement; onBack: () => void }) {
  return (
    <div className="min-h-full space-y-6 bg-slate-50 p-4 md:p-6">
      <div className="flex items-center justify-between print:hidden">
        <Button variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to list
        </Button>
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
              This student has no published results yet.
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
  );
}