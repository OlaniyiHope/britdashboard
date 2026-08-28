import { useMemo, useState } from "react";
import {
  Search,
  Download,
  RefreshCw,
  FileSpreadsheet,
  BookOpen,
  Users,
  CheckCircle2,
  Clock,
  Award,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { toast } from "sonner";

// ============================================================
// TYPES
// ============================================================

type Course = {
  id: string;
  code: string;
  name: string;
  semester: string;
};

type ResultRow = {
  id: string;
  matricNumber: string;
  studentName: string;
  ca: number;
  exam: number;
  total: number;
  grade: string;
  gradePoint: number;
  status: "Pass" | "Fail" | "Pending";
};

// ============================================================
// DEMO COURSES
// ============================================================

const courses: Course[] = [
  {
    id: "1",
    code: "BTE 301",
    name: "Digital Electronics",
    semester: "First Semester",
  },
  {
    id: "2",
    code: "CPE 302",
    name: "Computer Engineering",
    semester: "First Semester",
  },
  {
    id: "3",
    code: "EEE 305",
    name: "Electrical Measurements",
    semester: "Second Semester",
  },
];

// ============================================================
// DEMO RESULTS
// ============================================================

const initialResults: ResultRow[] = [
  {
    id: "1",
    matricNumber: "BTP/2024/001",
    studentName: "John Adewale",
    ca: 24,
    exam: 62,
    total: 86,
    grade: "A",
    gradePoint: 4.0,
    status: "Pass",
  },
  {
    id: "2",
    matricNumber: "BTP/2024/002",
    studentName: "Mary Johnson",
    ca: 21,
    exam: 58,
    total: 79,
    grade: "A",
    gradePoint: 4.0,
    status: "Pass",
  },
  {
    id: "3",
    matricNumber: "BTP/2024/003",
    studentName: "David Williams",
    ca: 18,
    exam: 51,
    total: 69,
    grade: "B",
    gradePoint: 3.0,
    status: "Pass",
  },
  {
    id: "4",
    matricNumber: "BTP/2024/004",
    studentName: "Sarah Ibrahim",
    ca: 26,
    exam: 61,
    total: 87,
    grade: "A",
    gradePoint: 4.0,
    status: "Pass",
  },
  {
    id: "5",
    matricNumber: "BTP/2024/005",
    studentName: "Michael Okoro",
    ca: 13,
    exam: 29,
    total: 42,
    grade: "E",
    gradePoint: 1.0,
    status: "Pass",
  },
  {
    id: "6",
    matricNumber: "BTP/2024/006",
    studentName: "Daniel James",
    ca: 11,
    exam: 25,
    total: 36,
    grade: "F",
    gradePoint: 0,
    status: "Fail",
  },
];

// ============================================================
// GRADE HELPERS
// ============================================================

function getGrade(total: number) {
  if (total >= 70) return "A";
  if (total >= 60) return "B";
  if (total >= 50) return "C";
  if (total >= 45) return "D";
  if (total >= 40) return "E";

  return "F";
}

function getGradePoint(grade: string) {
  switch (grade) {
    case "A":
      return 4.0;

    case "B":
      return 3.0;

    case "C":
      return 2.0;

    case "D":
      return 1.5;

    case "E":
      return 1.0;

    default:
      return 0;
  }
}

function getStatus(total: number) {
  return total >= 40 ? "Pass" : "Fail";
}

// ============================================================
// GRADE BADGE
// ============================================================

function GradeBadge({
  grade,
}: {
  grade: string;
}) {
  if (grade === "A") {
    return (
      <Badge className="bg-green-600 hover:bg-green-600">
        A
      </Badge>
    );
  }

  if (grade === "B") {
    return (
      <Badge className="bg-blue-600 hover:bg-blue-600">
        B
      </Badge>
    );
  }

  if (grade === "C") {
    return (
      <Badge variant="secondary">
        C
      </Badge>
    );
  }

  if (grade === "D" || grade === "E") {
    return (
      <Badge variant="outline">
        {grade}
      </Badge>
    );
  }

  return (
    <Badge variant="destructive">
      F
    </Badge>
  );
}

// ============================================================
// COMPONENT
// ============================================================

export default function TabulationSheet() {
  const [selectedCourse, setSelectedCourse] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [results, setResults] =
    useState<ResultRow[]>(initialResults);

  const [loading, setLoading] =
    useState(false);

  // ============================================================
  // SELECTED COURSE
  // ============================================================

  const course = courses.find(
    (item) => item.id === selectedCourse
  );

  // ============================================================
  // FILTER
  // ============================================================

  const filteredResults = useMemo(() => {
    const query =
      search.toLowerCase().trim();

    if (!query) {
      return results;
    }

    return results.filter(
      (student) =>
        student.studentName
          .toLowerCase()
          .includes(query) ||
        student.matricNumber
          .toLowerCase()
          .includes(query) ||
        student.grade
          .toLowerCase()
          .includes(query)
    );
  }, [results, search]);

  // ============================================================
  // STATISTICS
  // ============================================================

  const totalStudents =
    results.length;

  const passedStudents =
    results.filter(
      (student) =>
        student.status === "Pass"
    ).length;

  const failedStudents =
    results.filter(
      (student) =>
        student.status === "Fail"
    ).length;

  const average =
    results.length
      ? results.reduce(
          (sum, student) =>
            sum + student.total,
          0
        ) / results.length
      : 0;

  // ============================================================
  // REFRESH
  // ============================================================

  const refresh = () => {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      toast.success(
        "Tabulation sheet refreshed"
      );
    }, 700);
  };

  // ============================================================
  // EXPORT CSV
  // ============================================================

  const exportSheet = () => {
    if (!selectedCourse) {
      toast.error(
        "Please select a course first"
      );

      return;
    }

    const header =
      "S/N,Matric Number,Student Name,CA,Exam,Total,Grade,Grade Point,Status\n";

    const body = results
      .map(
        (student, index) =>
          `${index + 1},"${student.matricNumber}","${student.studentName}",${student.ca},${student.exam},${student.total},${student.grade},${student.gradePoint},${student.status}`
      )
      .join("\n");

    const csv =
      header + body;

    const blob =
      new Blob([csv], {
        type: "text/csv;charset=utf-8;",
      });

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      `${course?.code || "tabulation"}-tabulation-sheet.csv`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    toast.success(
      "Tabulation sheet exported"
    );
  };

  // ============================================================
  // PRINT
  // ============================================================

  const printSheet = () => {
    window.print();
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="min-h-full space-y-6 p-4 md:p-6">

      {/* ====================================================== */}
      {/* HEADER */}
      {/* ====================================================== */}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#006dcc]/10">

              <FileSpreadsheet className="h-5 w-5 text-[#006dcc]" />

            </div>

            <div>

              <h1 className="text-2xl font-bold tracking-tight">
                Tabulation Sheet
              </h1>

              <p className="text-sm text-muted-foreground">
                View and review compiled examination results for your assigned courses.
              </p>

            </div>

          </div>

        </div>

        <div className="flex flex-wrap gap-2">

          <Button
            variant="outline"
            onClick={refresh}
            disabled={loading}
          >

            <RefreshCw
              className={`mr-2 h-4 w-4 ${
                loading
                  ? "animate-spin"
                  : ""
              }`}
            />

            Refresh

          </Button>

          <Button
            variant="outline"
            onClick={printSheet}
          >
            <Download className="mr-2 h-4 w-4" />
            Print
          </Button>

          <Button
            className="bg-[#006dcc] hover:bg-[#005ca8]"
            onClick={exportSheet}
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>

        </div>

      </div>

      {/* ====================================================== */}
      {/* COURSE SELECTION */}
      {/* ====================================================== */}

      <Card>

        <CardHeader>

          <CardTitle>
            Select Course
          </CardTitle>

          <CardDescription>
            Select a course to view its compiled student results.
          </CardDescription>

        </CardHeader>

        <CardContent>

          <div className="grid gap-4 md:grid-cols-2">

            <div className="space-y-2">

              <label className="text-sm font-medium">
                Course
              </label>

              <Select
                value={selectedCourse}
                onValueChange={
                  setSelectedCourse
                }
              >

                <SelectTrigger>

                  <SelectValue
                    placeholder="Select a course"
                  />

                </SelectTrigger>

                <SelectContent>

                  {courses.map(
                    (item) => (

                      <SelectItem
                        key={item.id}
                        value={item.id}
                      >

                        {item.code} —{" "}
                        {item.name}

                      </SelectItem>

                    )
                  )}

                </SelectContent>

              </Select>

            </div>

            {course && (

              <div className="flex items-end">

                <div className="flex w-full items-center gap-3 rounded-lg border bg-muted/40 p-3">

                  <BookOpen className="h-5 w-5 text-[#006dcc]" />

                  <div className="flex-1">

                    <p className="font-semibold">
                      {course.code}
                    </p>

                    <p className="text-sm text-muted-foreground">
                      {course.name}
                    </p>

                  </div>

                  <Badge variant="outline">
                    {course.semester}
                  </Badge>

                </div>

              </div>

            )}

          </div>

        </CardContent>

      </Card>

      {/* ====================================================== */}
      {/* STATISTICS */}
      {/* ====================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <Card>

          <CardHeader className="pb-2">

            <CardDescription>
              Students
            </CardDescription>

            <CardTitle className="text-2xl">
              {totalStudents}
            </CardTitle>

          </CardHeader>

          <CardContent>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">

              <Users className="h-4 w-4" />

              Total students

            </div>

          </CardContent>

        </Card>

        <Card>

          <CardHeader className="pb-2">

            <CardDescription>
              Passed
            </CardDescription>

            <CardTitle className="text-2xl text-green-600">
              {passedStudents}
            </CardTitle>

          </CardHeader>

          <CardContent>

            <div className="flex items-center gap-2 text-xs text-green-600">

              <CheckCircle2 className="h-4 w-4" />

              Successful students

            </div>

          </CardContent>

        </Card>

        <Card>

          <CardHeader className="pb-2">

            <CardDescription>
              Failed
            </CardDescription>

            <CardTitle className="text-2xl text-red-600">
              {failedStudents}
            </CardTitle>

          </CardHeader>

          <CardContent>

            <div className="flex items-center gap-2 text-xs text-red-600">

              <Award className="h-4 w-4" />

              Students below pass mark

            </div>

          </CardContent>

        </Card>

        <Card>

          <CardHeader className="pb-2">

            <CardDescription>
              Class Average
            </CardDescription>

            <CardTitle className="text-2xl">
              {average.toFixed(1)}
            </CardTitle>

          </CardHeader>

          <CardContent>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">

              <BookOpen className="h-4 w-4" />

              Average score / 100

            </div>

          </CardContent>

        </Card>

      </div>

      {/* ====================================================== */}
      {/* TABULATION */}
      {/* ====================================================== */}

      <Card>

        <CardHeader>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div>

              <CardTitle>
                Result Tabulation
              </CardTitle>

              <CardDescription>
                Compiled CA and examination results for the selected course.
              </CardDescription>

            </div>

            <div className="relative w-full md:w-80">

              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />

              <Input
                className="pl-9"
                placeholder="Search student..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
              />

            </div>

          </div>

        </CardHeader>

        <CardContent>

          {!selectedCourse ? (

            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed text-center">

              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-muted">

                <FileSpreadsheet className="h-7 w-7 text-muted-foreground" />

              </div>

              <h3 className="font-semibold">
                Select a course
              </h3>

              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                Select one of your assigned courses above to view the compiled student results.
              </p>

            </div>

          ) : (

            <>

              {/* COURSE SUMMARY */}

              <div className="mb-4 rounded-lg border bg-[#006dcc]/5 p-4">

                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">

                  <div className="flex items-center gap-3">

                    <BookOpen className="h-5 w-5 text-[#006dcc]" />

                    <div>

                      <p className="font-semibold">
                        {course?.code}
                      </p>

                      <p className="text-sm text-muted-foreground">
                        {course?.name}
                      </p>

                    </div>

                  </div>

                  <div className="flex gap-2">

                    <Badge variant="outline">
                      {course?.semester}
                    </Badge>

                    <Badge variant="outline">
                      {results.length} Students
                    </Badge>

                  </div>

                </div>

              </div>

              {/* TABLE */}

              <div className="overflow-x-auto rounded-md border">

                <Table>

                  <TableHeader>

                    <TableRow>

                      <TableHead>
                        S/N
                      </TableHead>

                      <TableHead>
                        Matric Number
                      </TableHead>

                      <TableHead>
                        Student Name
                      </TableHead>

                      <TableHead className="text-center">
                        CA
                      </TableHead>

                      <TableHead className="text-center">
                        Exam
                      </TableHead>

                      <TableHead className="text-center">
                        Total
                      </TableHead>

                      <TableHead className="text-center">
                        Grade
                      </TableHead>

                      <TableHead className="text-center">
                        GP
                      </TableHead>

                      <TableHead>
                        Status
                      </TableHead>

                    </TableRow>

                  </TableHeader>

                  <TableBody>

                    {filteredResults.map(
                      (student, index) => (

                        <TableRow
                          key={student.id}
                        >

                          <TableCell>
                            {index + 1}
                          </TableCell>

                          <TableCell className="font-medium">
                            {student.matricNumber}
                          </TableCell>

                          <TableCell>
                            {student.studentName}
                          </TableCell>

                          <TableCell className="text-center">
                            {student.ca}
                          </TableCell>

                          <TableCell className="text-center">
                            {student.exam}
                          </TableCell>

                          <TableCell className="text-center font-semibold">
                            {student.total}
                          </TableCell>

                          <TableCell className="text-center">
                            <GradeBadge
                              grade={
                                student.grade
                              }
                            />
                          </TableCell>

                          <TableCell className="text-center">
                            {student.gradePoint.toFixed(
                              1
                            )}
                          </TableCell>

                          <TableCell>

                            {student.status ===
                            "Pass" ? (

                              <Badge
                                variant="outline"
                                className="gap-1 text-green-600"
                              >

                                <CheckCircle2 className="h-3 w-3" />

                                Pass

                              </Badge>

                            ) : (

                              <Badge
                                variant="destructive"
                                className="gap-1"
                              >

                                <Clock className="h-3 w-3" />

                                Fail

                              </Badge>

                            )}

                          </TableCell>

                        </TableRow>

                      )
                    )}

                    {!filteredResults.length && (

                      <TableRow>

                        <TableCell
                          colSpan={9}
                          className="h-24 text-center"
                        >

                          No students found.

                        </TableCell>

                      </TableRow>

                    )}

                  </TableBody>

                </Table>

              </div>

              {/* FOOTER */}

              <div className="mt-5 flex flex-col gap-3 rounded-lg border bg-muted/30 p-4 md:flex-row md:items-center md:justify-between">

                <div>

                  <p className="text-sm font-medium">
                    Result Summary
                  </p>

                  <p className="text-xs text-muted-foreground">
                    {passedStudents} of{" "}
                    {totalStudents} students
                    passed this course.
                  </p>

                </div>

                <div className="flex gap-2">

                  <Button
                    variant="outline"
                    onClick={printSheet}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Print Tabulation
                  </Button>

                  <Button
                    className="bg-[#006dcc] hover:bg-[#005ca8]"
                    onClick={exportSheet}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export Excel/CSV
                  </Button>

                </div>

              </div>

            </>

          )}

        </CardContent>

      </Card>

    </div>
  );
}