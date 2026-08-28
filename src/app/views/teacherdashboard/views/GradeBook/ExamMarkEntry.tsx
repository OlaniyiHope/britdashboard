import { useMemo, useState } from "react";
import {
  Search,
  Save,
  Download,
  RefreshCw,
  BookOpen,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileSpreadsheet,
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

type StudentMark = {
  id: string;
  matricNumber: string;
  name: string;
  ca: number | "";
  exam: number | "";
  submitted: boolean;
};

type Course = {
  id: string;
  code: string;
  name: string;
  students: number;
};

// ============================================================
// DEMO COURSES
// ============================================================

const courses: Course[] = [
  {
    id: "1",
    code: "BTE 301",
    name: "Digital Electronics",
    students: 5,
  },
  {
    id: "2",
    code: "CPE 302",
    name: "Computer Engineering",
    students: 4,
  },
  {
    id: "3",
    code: "EEE 305",
    name: "Electrical Measurements",
    students: 6,
  },
];

// ============================================================
// DEMO STUDENTS
// ============================================================

const initialStudents: StudentMark[] = [
  {
    id: "1",
    matricNumber: "BTP/2024/001",
    name: "John Adewale",
    ca: 18,
    exam: 62,
    submitted: true,
  },
  {
    id: "2",
    matricNumber: "BTP/2024/002",
    name: "Mary Johnson",
    ca: 16,
    exam: 55,
    submitted: true,
  },
  {
    id: "3",
    matricNumber: "BTP/2024/003",
    name: "David Williams",
    ca: 14,
    exam: "",
    submitted: false,
  },
  {
    id: "4",
    matricNumber: "BTP/2024/004",
    name: "Sarah Ibrahim",
    ca: 19,
    exam: 68,
    submitted: true,
  },
  {
    id: "5",
    matricNumber: "BTP/2024/005",
    name: "Michael Okoro",
    ca: "",
    exam: "",
    submitted: false,
  },
];

// ============================================================
// HELPERS
// ============================================================

function getTotal(student: StudentMark) {
  const ca = Number(student.ca) || 0;
  const exam = Number(student.exam) || 0;

  return ca + exam;
}

function getGrade(total: number) {
  if (total >= 70) return "A";
  if (total >= 60) return "B";
  if (total >= 50) return "C";
  if (total >= 45) return "D";
  if (total >= 40) return "E";
  return "F";
}

function getGradeBadge(total: number) {
  const grade = getGrade(total);

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

export default function ExamMarkEntrySheet() {
  const [selectedCourse, setSelectedCourse] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [students, setStudents] =
    useState<StudentMark[]>(initialStudents);

  const [saving, setSaving] =
    useState(false);

  // ============================================================
  // SELECTED COURSE
  // ============================================================

  const course = courses.find(
    (item) => item.id === selectedCourse
  );

  // ============================================================
  // FILTER STUDENTS
  // ============================================================

  const filteredStudents = useMemo(() => {
    const query = search.toLowerCase().trim();

    if (!query) {
      return students;
    }

    return students.filter(
      (student) =>
        student.name
          .toLowerCase()
          .includes(query) ||
        student.matricNumber
          .toLowerCase()
          .includes(query)
    );
  }, [students, search]);

  // ============================================================
  // UPDATE MARK
  // ============================================================

  const updateMark = (
    id: string,
    field: "ca" | "exam",
    value: string
  ) => {
    if (value === "") {
      setStudents((prev) =>
        prev.map((student) =>
          student.id === id
            ? {
                ...student,
                [field]: "",
                submitted: false,
              }
            : student
        )
      );

      return;
    }

    const numericValue = Number(value);

    const max =
      field === "ca"
        ? 30
        : 70;

    if (
      numericValue < 0 ||
      numericValue > max
    ) {
      toast.error(
        `${field === "ca" ? "CA" : "Exam"} mark must be between 0 and ${max}`
      );

      return;
    }

    setStudents((prev) =>
      prev.map((student) =>
        student.id === id
          ? {
              ...student,
              [field]: numericValue,
              submitted: false,
            }
          : student
      )
    );
  };

  // ============================================================
  // SAVE MARKS
  // ============================================================

  const saveMarks = () => {
    if (!selectedCourse) {
      toast.error(
        "Please select a course first"
      );

      return;
    }

    const incomplete = students.some(
      (student) =>
        student.ca === "" ||
        student.exam === ""
    );

    if (incomplete) {
      toast.error(
        "Please enter all CA and examination marks before submitting."
      );

      return;
    }

    setSaving(true);

    setTimeout(() => {
      setStudents((prev) =>
        prev.map((student) => ({
          ...student,
          submitted: true,
        }))
      );

      setSaving(false);

      toast.success(
        "Examination marks saved successfully"
      );
    }, 800);
  };

  // ============================================================
  // REFRESH
  // ============================================================

  const refresh = () => {
    toast.success(
      "Mark sheet refreshed"
    );
  };

  // ============================================================
  // STATISTICS
  // ============================================================

  const totalStudents =
    students.length;

  const submittedStudents =
    students.filter(
      (student) =>
        student.submitted
    ).length;

  const pendingStudents =
    students.filter(
      (student) =>
        !student.submitted
    ).length;

  const average =
    students.length > 0
      ? students.reduce(
          (sum, student) =>
            sum +
            getTotal(student),
          0
        ) / students.length
      : 0;

  // ============================================================
  // EXPORT
  // ============================================================

  const exportMarks = () => {
    if (!selectedCourse) {
      toast.error(
        "Please select a course first"
      );

      return;
    }

    const header =
      "Matric Number,Student Name,CA,Exam,Total,Grade\n";

    const rows = students
      .map(
        (student) =>
          `${student.matricNumber},"${student.name}",${student.ca},${student.exam},${getTotal(student)},${getGrade(getTotal(student))}`
      )
      .join("\n");

    const csv =
      header + rows;

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
      `${course?.code || "exam"}-mark-sheet.csv`;

    link.click();

    URL.revokeObjectURL(url);

    toast.success(
      "Mark sheet exported"
    );
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
                Exam Mark Entry Sheet
              </h1>

              <p className="text-sm text-muted-foreground">
                Enter, review and submit examination marks for your assigned courses.
              </p>

            </div>

          </div>

        </div>

        <div className="flex flex-wrap gap-2">

          <Button
            variant="outline"
            onClick={refresh}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>

          <Button
            variant="outline"
            onClick={exportMarks}
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>

          <Button
            className="bg-[#006dcc] hover:bg-[#005ca8]"
            onClick={saveMarks}
            disabled={saving}
          >
            <Save className="mr-2 h-4 w-4" />

            {saving
              ? "Saving..."
              : "Save Marks"}
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
            Select the course and examination you want to enter marks for.
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

                  <SelectValue placeholder="Select a course" />

                </SelectTrigger>

                <SelectContent>

                  {courses.map(
                    (item) => (

                      <SelectItem
                        key={item.id}
                        value={item.id}
                      >
                        {item.code} — {item.name}
                      </SelectItem>

                    )
                  )}

                </SelectContent>

              </Select>

            </div>

            <div className="flex items-end">

              {course && (

                <div className="flex w-full items-center gap-3 rounded-lg border bg-muted/40 p-3">

                  <BookOpen className="h-5 w-5 text-[#006dcc]" />

                  <div>

                    <p className="text-sm font-medium">
                      {course.code}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {course.name}
                    </p>

                  </div>

                </div>

              )}

            </div>

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
              Total Students
            </CardDescription>

            <CardTitle className="text-2xl">
              {totalStudents}
            </CardTitle>

          </CardHeader>

          <CardContent>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">

              <Users className="h-4 w-4" />

              Students enrolled

            </div>

          </CardContent>

        </Card>

        <Card>

          <CardHeader className="pb-2">

            <CardDescription>
              Marks Entered
            </CardDescription>

            <CardTitle className="text-2xl text-green-600">
              {submittedStudents}
            </CardTitle>

          </CardHeader>

          <CardContent>

            <div className="flex items-center gap-2 text-xs text-green-600">

              <CheckCircle2 className="h-4 w-4" />

              Completed

            </div>

          </CardContent>

        </Card>

        <Card>

          <CardHeader className="pb-2">

            <CardDescription>
              Pending
            </CardDescription>

            <CardTitle className="text-2xl text-orange-600">
              {pendingStudents}
            </CardTitle>

          </CardHeader>

          <CardContent>

            <div className="flex items-center gap-2 text-xs text-orange-600">

              <Clock className="h-4 w-4" />

              Awaiting marks

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

              <AlertCircle className="h-4 w-4" />

              Out of 100

            </div>

          </CardContent>

        </Card>

      </div>

      {/* ====================================================== */}
      {/* MARK SHEET */}
      {/* ====================================================== */}

      <Card>

        <CardHeader>

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

            <div>

              <CardTitle>
                Examination Marks
              </CardTitle>

              <CardDescription>
                CA is out of 30 marks and Examination is out of 70 marks.
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

                <BookOpen className="h-7 w-7 text-muted-foreground" />

              </div>

              <h3 className="font-semibold">
                Select a course
              </h3>

              <p className="mt-1 max-w-md text-sm text-muted-foreground">
                Select one of your assigned courses above to view the students and enter their examination marks.
              </p>

            </div>

          ) : (

            <>

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

                  <Badge variant="outline">
                    {students.length} Students
                  </Badge>

                </div>

              </div>

              <div className="overflow-x-auto rounded-md border">

                <Table>

                  <TableHeader>

                    <TableRow>

                      <TableHead>
                        #
                      </TableHead>

                      <TableHead>
                        Matric Number
                      </TableHead>

                      <TableHead>
                        Student Name
                      </TableHead>

                      <TableHead className="w-[130px]">
                        CA / 30
                      </TableHead>

                      <TableHead className="w-[130px]">
                        Exam / 70
                      </TableHead>

                      <TableHead>
                        Total / 100
                      </TableHead>

                      <TableHead>
                        Grade
                      </TableHead>

                      <TableHead>
                        Status
                      </TableHead>

                    </TableRow>

                  </TableHeader>

                  <TableBody>

                    {filteredStudents.map(
                      (student, index) => {

                        const total =
                          getTotal(student);

                        return (

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
                              {student.name}
                            </TableCell>

                            <TableCell>

                              <Input
                                type="number"
                                min={0}
                                max={30}
                                value={
                                  student.ca
                                }
                                onChange={(e) =>
                                  updateMark(
                                    student.id,
                                    "ca",
                                    e.target.value
                                  )
                                }
                                className="w-24"
                              />

                            </TableCell>

                            <TableCell>

                              <Input
                                type="number"
                                min={0}
                                max={70}
                                value={
                                  student.exam
                                }
                                onChange={(e) =>
                                  updateMark(
                                    student.id,
                                    "exam",
                                    e.target.value
                                  )
                                }
                                className="w-24"
                              />

                            </TableCell>

                            <TableCell className="font-semibold">
                              {total}
                            </TableCell>

                            <TableCell>
                              {getGradeBadge(
                                total
                              )}
                            </TableCell>

                            <TableCell>

                              {student.submitted ? (

                                <Badge
                                  variant="outline"
                                  className="gap-1 text-green-600"
                                >
                                  <CheckCircle2 className="h-3 w-3" />
                                  Saved
                                </Badge>

                              ) : (

                                <Badge
                                  variant="secondary"
                                  className="gap-1"
                                >
                                  <Clock className="h-3 w-3" />
                                  Pending
                                </Badge>

                              )}

                            </TableCell>

                          </TableRow>

                        );
                      }
                    )}

                    {!filteredStudents.length && (

                      <TableRow>

                        <TableCell
                          colSpan={8}
                          className="h-24 text-center"
                        >
                          No students found.
                        </TableCell>

                      </TableRow>

                    )}

                  </TableBody>

                </Table>

              </div>

              {/* ================================================= */}
              {/* FOOTER ACTION */}
              {/* ================================================= */}

              <div className="mt-5 flex flex-col gap-3 rounded-lg border bg-muted/30 p-4 md:flex-row md:items-center md:justify-between">

                <div>

                  <p className="text-sm font-medium">
                    Ready to submit marks?
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Make sure all CA and examination marks are correct before saving.
                  </p>

                </div>

                <div className="flex gap-2">

                  <Button
                    variant="outline"
                    onClick={exportMarks}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export Sheet
                  </Button>

                  <Button
                    className="bg-[#006dcc] hover:bg-[#005ca8]"
                    onClick={saveMarks}
                    disabled={saving}
                  >
                    <Save className="mr-2 h-4 w-4" />

                    {saving
                      ? "Saving..."
                      : "Save Examination Marks"}
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