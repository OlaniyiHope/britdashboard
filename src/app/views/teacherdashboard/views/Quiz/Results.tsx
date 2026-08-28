import { useMemo, useState } from "react";
import {
  Search,
  Eye,
  Download,
  RefreshCw,
  Trophy,
  Users,
  CheckCircle2,
  Clock,
  MoreVertical,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type QuizResult = {
  id: number;
  studentName: string;
  matricNumber: string;
  quizTitle: string;
  course: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  status: "Passed" | "Failed" | "Pending";
  submittedAt: string;
};

const seedResults: QuizResult[] = [
  {
    id: 1,
    studentName: "John Doe",
    matricNumber: "BTP/2025/001",
    quizTitle: "Introduction to Programming",
    course: "Computer Science",
    score: 18,
    totalQuestions: 20,
    percentage: 90,
    status: "Passed",
    submittedAt: "26 Aug 2026, 10:35 AM",
  },
  {
    id: 2,
    studentName: "Mary Johnson",
    matricNumber: "BTP/2025/002",
    quizTitle: "Introduction to Programming",
    course: "Computer Science",
    score: 15,
    totalQuestions: 20,
    percentage: 75,
    status: "Passed",
    submittedAt: "26 Aug 2026, 11:12 AM",
  },
  {
    id: 3,
    studentName: "David Williams",
    matricNumber: "BTP/2025/003",
    quizTitle: "Introduction to Programming",
    course: "Computer Science",
    score: 9,
    totalQuestions: 20,
    percentage: 45,
    status: "Failed",
    submittedAt: "26 Aug 2026, 12:05 PM",
  },
  {
    id: 4,
    studentName: "Sarah Brown",
    matricNumber: "BTP/2025/004",
    quizTitle: "Database Fundamentals",
    course: "Computer Science",
    score: 17,
    totalQuestions: 20,
    percentage: 85,
    status: "Passed",
    submittedAt: "25 Aug 2026, 02:25 PM",
  },
  {
    id: 5,
    studentName: "Michael Smith",
    matricNumber: "BTP/2025/005",
    quizTitle: "Database Fundamentals",
    course: "Computer Science",
    score: 12,
    totalQuestions: 20,
    percentage: 60,
    status: "Passed",
    submittedAt: "25 Aug 2026, 03:10 PM",
  },
];

export default function QuizResults() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<QuizResult[]>(seedResults);

  const filteredResults = useMemo(() => {
    const value = search.toLowerCase().trim();

    if (!value) return results;

    return results.filter((result) =>
      [
        result.studentName,
        result.matricNumber,
        result.quizTitle,
        result.course,
        result.status,
      ]
        .join(" ")
        .toLowerCase()
        .includes(value)
    );
  }, [results, search]);

  const totalResults = results.length;

  const passedResults = results.filter(
    (result) => result.status === "Passed"
  ).length;

  const failedResults = results.filter(
    (result) => result.status === "Failed"
  ).length;

  const averageScore =
    results.length > 0
      ? Math.round(
          results.reduce((total, result) => total + result.percentage, 0) /
            results.length
        )
      : 0;

  const refreshResults = () => {
    // Replace this later with your API request.
    setResults([...seedResults]);
  };

  const exportResults = () => {
    const headers = [
      "Student",
      "Matric Number",
      "Quiz",
      "Course",
      "Score",
      "Percentage",
      "Status",
      "Submitted At",
    ];

    const rows = filteredResults.map((result) => [
      result.studentName,
      result.matricNumber,
      result.quizTitle,
      result.course,
      `${result.score}/${result.totalQuestions}`,
      `${result.percentage}%`,
      result.status,
      result.submittedAt,
    ]);

    const csv = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "quiz-results.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  const viewResult = (result: QuizResult) => {
    console.log("View quiz result:", result);

    // Later you can navigate to:
    // /staff/dashboard/quiz/results/${result.id}
  };

  return (
    <div className="space-y-6 p-4 md:p-6">

      {/* HEADER */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Quiz Results
          </h1>

          <p className="text-sm text-muted-foreground">
            View and monitor quiz submissions and student performance.
          </p>
        </div>

        <div className="flex gap-2">

          <Button
            variant="outline"
            onClick={refreshResults}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>

          <Button
            variant="outline"
            onClick={exportResults}
          >
            <Download className="mr-2 h-4 w-4" />
            Export Results
          </Button>

        </div>
      </div>

      {/* STATISTICS */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Total Submissions</CardDescription>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <CardTitle className="text-2xl">
              {totalResults}
            </CardTitle>

            <p className="mt-1 text-xs text-muted-foreground">
              Quiz submissions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Passed</CardDescription>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>

          <CardContent>
            <CardTitle className="text-2xl">
              {passedResults}
            </CardTitle>

            <p className="mt-1 text-xs text-muted-foreground">
              Students who passed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Failed</CardDescription>
            <Clock className="h-4 w-4 text-red-500" />
          </CardHeader>

          <CardContent>
            <CardTitle className="text-2xl">
              {failedResults}
            </CardTitle>

            <p className="mt-1 text-xs text-muted-foreground">
              Students who need improvement
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardDescription>Average Score</CardDescription>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>

          <CardContent>
            <CardTitle className="text-2xl">
              {averageScore}%
            </CardTitle>

            <p className="mt-1 text-xs text-muted-foreground">
              Overall quiz average
            </p>
          </CardContent>
        </Card>

      </div>

      {/* RESULTS TABLE */}
      <Card>

        <CardHeader>

          <CardTitle>
            Student Quiz Results
          </CardTitle>

          <CardDescription>
            Review quiz submissions from students enrolled in your courses.
          </CardDescription>

        </CardHeader>

        <CardContent>

          {/* SEARCH */}
          <div className="mb-5 flex flex-col gap-2 sm:flex-row">

            <div className="relative flex-1">

              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />

              <Input
                className="pl-9"
                placeholder="Search student, matric number, quiz or course..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

            </div>

            <Button
              variant="outline"
              onClick={exportResults}
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>

          </div>

          {/* TABLE */}
          <div className="rounded-md border overflow-x-auto">

            <Table>

              <TableHeader>

                <TableRow>

                  <TableHead>Student</TableHead>

                  <TableHead>Matric Number</TableHead>

                  <TableHead>Quiz</TableHead>

                  <TableHead>Course</TableHead>

                  <TableHead>Score</TableHead>

                  <TableHead>Percentage</TableHead>

                  <TableHead>Status</TableHead>

                  <TableHead>Submitted</TableHead>

                  <TableHead className="text-right">
                    Action
                  </TableHead>

                </TableRow>

              </TableHeader>

              <TableBody>

                {filteredResults.map((result) => (

                  <TableRow key={result.id}>

                    <TableCell className="font-medium">
                      {result.studentName}
                    </TableCell>

                    <TableCell>
                      {result.matricNumber}
                    </TableCell>

                    <TableCell>
                      {result.quizTitle}
                    </TableCell>

                    <TableCell>
                      {result.course}
                    </TableCell>

                    <TableCell className="font-semibold">
                      {result.score}/{result.totalQuestions}
                    </TableCell>

                    <TableCell>

                      <span
                        className={
                          result.percentage >= 70
                            ? "font-semibold text-green-600"
                            : result.percentage >= 50
                            ? "font-semibold text-orange-500"
                            : "font-semibold text-red-500"
                        }
                      >
                        {result.percentage}%
                      </span>

                    </TableCell>

                    <TableCell>

                      <Badge
                        variant={
                          result.status === "Passed"
                            ? "default"
                            : result.status === "Failed"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {result.status}
                      </Badge>

                    </TableCell>

                    <TableCell className="whitespace-nowrap">
                      {result.submittedAt}
                    </TableCell>

                    <TableCell className="text-right">

                      <DropdownMenu>

                        <DropdownMenuTrigger asChild>

                          <Button
                            size="icon"
                            variant="ghost"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>

                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">

                          <DropdownMenuItem
                            onClick={() => viewResult(result)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Result
                          </DropdownMenuItem>

                          <DropdownMenuSeparator />

                          <DropdownMenuItem
                            onClick={() =>
                              console.log(
                                "Student:",
                                result.studentName
                              )
                            }
                          >
                            <Users className="mr-2 h-4 w-4" />
                            View Student
                          </DropdownMenuItem>

                        </DropdownMenuContent>

                      </DropdownMenu>

                    </TableCell>

                  </TableRow>

                ))}

                {!filteredResults.length && (

                  <TableRow>

                    <TableCell
                      colSpan={9}
                      className="h-32 text-center"
                    >
                      <div className="flex flex-col items-center justify-center gap-2">

                        <Search className="h-8 w-8 text-muted-foreground" />

                        <p className="font-medium">
                          No quiz results found
                        </p>

                        <p className="text-sm text-muted-foreground">
                          Try searching with another student, quiz or course.
                        </p>

                      </div>
                    </TableCell>

                  </TableRow>

                )}

              </TableBody>

            </Table>

          </div>

        </CardContent>

      </Card>

    </div>
  );
}