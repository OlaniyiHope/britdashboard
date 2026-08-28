import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  MoreVertical,
  Eye,
  Pencil,
  Trash2,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Clock3,
  Copy,
  FileQuestion,
  Users,
  CalendarDays,
  Loader2,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";


// ============================================================
// TYPES
// ============================================================

type QuizStatus = "draft" | "published" | "closed" | "active";

type Quiz = {
  _id: string;
  title: string;
  description?: string;

  course?: {
    _id?: string;
    name?: string;
    code?: string;
  };

  courseId?: string;

  questions?: any[];

  questionCount?: number;

  duration?: number;

  durationMinutes?: number;

  totalMarks?: number;

  status?: QuizStatus | string;

  startDate?: string;
  endDate?: string;

  createdAt?: string;
  updatedAt?: string;

  attempts?: number;
  submissions?: number;
};


// ============================================================
// API
// ============================================================

const API_URL =
  import.meta.env.VITE_NODE_API_URL || "http://localhost:5001";


// ============================================================
// HELPERS
// ============================================================

const getToken = () => {
  return localStorage.getItem("jwtToken");
};


const getQuizQuestionCount = (quiz: Quiz) => {
  if (typeof quiz.questionCount === "number") {
    return quiz.questionCount;
  }

  if (Array.isArray(quiz.questions)) {
    return quiz.questions.length;
  }

  return 0;
};


const getQuizDuration = (quiz: Quiz) => {
  return quiz.durationMinutes ?? quiz.duration ?? 0;
};


const getCourseName = (quiz: Quiz) => {
  if (quiz.course?.name) {
    return quiz.course.name;
  }

  if (quiz.course?.code) {
    return quiz.course.code;
  }

  if (quiz.courseId) {
    return quiz.courseId;
  }

  return "No course";
};


const formatDate = (date?: string) => {
  if (!date) return "—";

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "—";
  }

  return parsed.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};


// ============================================================
// STATUS BADGE
// ============================================================

function QuizStatusBadge({ status }: { status?: string }) {
  const normalized = String(status || "draft").toLowerCase();

  if (normalized === "published" || normalized === "active") {
    return (
      <Badge className="gap-1 bg-green-100 text-green-700 hover:bg-green-100">
        <CheckCircle2 className="h-3.5 w-3.5" />
        {normalized === "active" ? "Active" : "Published"}
      </Badge>
    );
  }

  if (normalized === "closed") {
    return (
      <Badge
        variant="secondary"
        className="gap-1 bg-gray-100 text-gray-700"
      >
        <XCircle className="h-3.5 w-3.5" />
        Closed
      </Badge>
    );
  }

  return (
    <Badge
      variant="secondary"
      className="gap-1 bg-yellow-100 text-yellow-700"
    >
      <Clock3 className="h-3.5 w-3.5" />
      Draft
    </Badge>
  );
}


// ============================================================
// COMPONENT
// ============================================================

export default function ManageQuiz() {
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);

  const [deleting, setDeleting] = useState(false);


  // ============================================================
  // FETCH STAFF QUIZZES
  // ============================================================

  const fetchQuizzes = useCallback(
    async (showRefreshLoader = false) => {
      const jwtToken = getToken();

      if (!jwtToken) {
        toast.error("Authentication token not found.");
        setLoading(false);
        return;
      }

      try {
        if (showRefreshLoader) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const response = await fetch(
          `${API_URL}/api/quizzes/my`,
          {
            method: "GET",

            headers: {
              Authorization: `Bearer ${jwtToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        const contentType =
          response.headers.get("content-type") || "";

        const data = contentType.includes("application/json")
          ? await response.json()
          : await response.text();

        if (!response.ok) {
          throw new Error(
            typeof data === "object"
              ? data?.message || "Failed to load quizzes."
              : "Failed to load quizzes."
          );
        }

        // Support either:
        // { quizzes: [...] }
        // or
        // { data: [...] }
        // or
        // [...]
        const quizData = Array.isArray(data)
          ? data
          : Array.isArray(data?.quizzes)
          ? data.quizzes
          : Array.isArray(data?.data)
          ? data.data
          : [];

        setQuizzes(quizData);
      } catch (error: any) {
        console.error("Fetch quizzes error:", error);

        toast.error(
          error?.message || "Unable to load your quizzes."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );


  useEffect(() => {
    fetchQuizzes();
  }, [fetchQuizzes]);


  // ============================================================
  // SEARCH
  // ============================================================

  const filteredQuizzes = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return quizzes;
    }

    return quizzes.filter((quiz) => {
      const searchable = [
        quiz.title,
        quiz.description,
        getCourseName(quiz),
        quiz.course?.code,
        quiz.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(query);
    });
  }, [quizzes, search]);


  // ============================================================
  // STATISTICS
  // ============================================================

  const totalQuizzes = quizzes.length;

  const publishedQuizzes = quizzes.filter(
    (quiz) =>
      quiz.status === "published" ||
      quiz.status === "active"
  ).length;

  const draftQuizzes = quizzes.filter(
    (quiz) =>
      !quiz.status ||
      quiz.status === "draft"
  ).length;

  const totalQuestions = quizzes.reduce(
    (total, quiz) =>
      total + getQuizQuestionCount(quiz),
    0
  );


  // ============================================================
  // DELETE
  // ============================================================

  const openDeleteDialog = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setDeleteDialogOpen(true);
  };


  const handleDelete = async () => {
    if (!selectedQuiz?._id) {
      return;
    }

    const jwtToken = getToken();

    if (!jwtToken) {
      toast.error("Authentication token not found.");
      return;
    }

    try {
      setDeleting(true);

      const response = await fetch(
        `${API_URL}/api/quizzes/${selectedQuiz._id}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const contentType =
        response.headers.get("content-type") || "";

      const data = contentType.includes("application/json")
        ? await response.json()
        : await response.text();

      if (!response.ok) {
        throw new Error(
          typeof data === "object"
            ? data?.message || "Failed to delete quiz."
            : "Failed to delete quiz."
        );
      }

      setQuizzes((prev) =>
        prev.filter(
          (quiz) => quiz._id !== selectedQuiz._id
        )
      );

      toast.success("Quiz deleted successfully.");

      setDeleteDialogOpen(false);
      setSelectedQuiz(null);
    } catch (error: any) {
      console.error("Delete quiz error:", error);

      toast.error(
        error?.message || "Unable to delete quiz."
      );
    } finally {
      setDeleting(false);
    }
  };


  // ============================================================
  // DUPLICATE
  // ============================================================

  const handleDuplicate = async (quiz: Quiz) => {
    const jwtToken = getToken();

    if (!jwtToken) {
      toast.error("Authentication token not found.");
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/quizzes/${quiz._id}/duplicate`,
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${jwtToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      const contentType =
        response.headers.get("content-type") || "";

      const data = contentType.includes("application/json")
        ? await response.json()
        : await response.text();

      if (!response.ok) {
        throw new Error(
          typeof data === "object"
            ? data?.message || "Failed to duplicate quiz."
            : "Failed to duplicate quiz."
        );
      }

      const duplicatedQuiz =
        data?.quiz || data?.data || data;

      if (duplicatedQuiz?._id) {
        setQuizzes((prev) => [
          duplicatedQuiz,
          ...prev,
        ]);
      } else {
        await fetchQuizzes();
      }

      toast.success("Quiz duplicated successfully.");
    } catch (error: any) {
      console.error("Duplicate quiz error:", error);

      toast.error(
        error?.message ||
          "Unable to duplicate quiz."
      );
    }
  };


  // ============================================================
  // NAVIGATION
  // ============================================================

  const handleCreateQuiz = () => {
    navigate("/staff/dashboard/quiz/create");
  };


  const handleViewQuiz = (quiz: Quiz) => {
    navigate(
      `/staff/dashboard/quiz/${quiz._id}`
    );
  };


  const handleEditQuiz = (quiz: Quiz) => {
    navigate(
      `/staff/dashboard/quiz/${quiz._id}/edit`
    );
  };


  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#006dcc]" />

          <p className="text-sm text-muted-foreground">
            Loading your quizzes...
          </p>
        </div>
      </div>
    );
  }


  // ============================================================
  // UI
  // ============================================================

  return (
    <div className="space-y-6 p-4 md:p-6">

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Manage Quiz
          </h1>

          <p className="text-sm text-muted-foreground">
            View, edit and manage quizzes you have created for your courses.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">

          <Button
            variant="outline"
            onClick={() => fetchQuizzes(true)}
            disabled={refreshing}
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${
                refreshing ? "animate-spin" : ""
              }`}
            />

            Refresh
          </Button>

          <Button
            className="bg-[#006dcc] hover:bg-[#005ca8]"
            onClick={handleCreateQuiz}
          >
            <Plus className="mr-2 h-4 w-4" />

            Create Quiz
          </Button>

        </div>
      </div>


      {/* ======================================================
          STATISTICS
      ====================================================== */}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>
              Total Quizzes
            </CardDescription>

            <CardTitle className="text-2xl">
              {totalQuizzes}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex items-center text-xs text-muted-foreground">
              <FileQuestion className="mr-2 h-4 w-4" />
              All quizzes
            </div>
          </CardContent>
        </Card>


        <Card>
          <CardHeader className="pb-2">
            <CardDescription>
              Published
            </CardDescription>

            <CardTitle className="text-2xl">
              {publishedQuizzes}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex items-center text-xs text-muted-foreground">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Available to students
            </div>
          </CardContent>
        </Card>


        <Card>
          <CardHeader className="pb-2">
            <CardDescription>
              Drafts
            </CardDescription>

            <CardTitle className="text-2xl">
              {draftQuizzes}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock3 className="mr-2 h-4 w-4" />
              Not published
            </div>
          </CardContent>
        </Card>


        <Card>
          <CardHeader className="pb-2">
            <CardDescription>
              Total Questions
            </CardDescription>

            <CardTitle className="text-2xl">
              {totalQuestions}
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex items-center text-xs text-muted-foreground">
              <FileQuestion className="mr-2 h-4 w-4" />
              Across all quizzes
            </div>
          </CardContent>
        </Card>

      </div>


      {/* ======================================================
          QUIZ TABLE
      ====================================================== */}

      <Card>

        <CardHeader>

          <CardTitle>
            My Quizzes
          </CardTitle>

          <CardDescription>
            Quizzes created by you and assigned to your courses.
          </CardDescription>

        </CardHeader>


        <CardContent>

          {/* SEARCH */}

          <div className="mb-5 flex flex-col gap-2 sm:flex-row">

            <div className="relative flex-1">

              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />

              <Input
                className="pl-9"
                placeholder="Search quiz title, course or status..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>

            {search && (
              <Button
                variant="outline"
                onClick={() => setSearch("")}
              >
                Clear
              </Button>
            )}

          </div>


          {/* EMPTY */}

          {!filteredQuizzes.length ? (

            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed">

              <div className="mb-4 rounded-full bg-muted p-4">
                <FileQuestion className="h-8 w-8 text-muted-foreground" />
              </div>

              <h3 className="text-lg font-semibold">
                {search
                  ? "No quizzes found"
                  : "You haven't created any quizzes yet"}
              </h3>

              <p className="mt-1 max-w-md text-center text-sm text-muted-foreground">
                {search
                  ? "Try changing your search term."
                  : "Create your first quiz and make it available to students."}
              </p>

              {!search && (
                <Button
                  className="mt-5 bg-[#006dcc] hover:bg-[#005ca8]"
                  onClick={handleCreateQuiz}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Quiz
                </Button>
              )}

            </div>

          ) : (

            /* ==================================================
               TABLE
            ================================================== */

            <div className="overflow-x-auto rounded-md border">

              <Table>

                <TableHeader>

                  <TableRow>

                    <TableHead>
                      Quiz
                    </TableHead>

                    <TableHead>
                      Course
                    </TableHead>

                    <TableHead>
                      Questions
                    </TableHead>

                    <TableHead>
                      Duration
                    </TableHead>

                    <TableHead>
                      Marks
                    </TableHead>

                    <TableHead>
                      Status
                    </TableHead>

                    <TableHead>
                      Created
                    </TableHead>

                    <TableHead className="w-[60px] text-right">
                      Action
                    </TableHead>

                  </TableRow>

                </TableHeader>


                <TableBody>

                  {filteredQuizzes.map((quiz) => (

                    <TableRow key={quiz._id}>

                      {/* QUIZ */}

                      <TableCell>

                        <div className="max-w-[260px]">

                          <div className="font-medium">
                            {quiz.title || "Untitled Quiz"}
                          </div>

                          {quiz.description && (
                            <div className="mt-1 truncate text-xs text-muted-foreground">
                              {quiz.description}
                            </div>
                          )}

                        </div>

                      </TableCell>


                      {/* COURSE */}

                      <TableCell>

                        <div className="flex items-center gap-2">

                          <div className="rounded-md bg-blue-50 p-2">
                            <FileQuestion className="h-4 w-4 text-blue-600" />
                          </div>

                          <div>

                            <div className="font-medium">
                              {getCourseName(quiz)}
                            </div>

                            {quiz.course?.code && (
                              <div className="text-xs text-muted-foreground">
                                {quiz.course.code}
                              </div>
                            )}

                          </div>

                        </div>

                      </TableCell>


                      {/* QUESTIONS */}

                      <TableCell>

                        <div className="flex items-center gap-2">

                          <FileQuestion className="h-4 w-4 text-muted-foreground" />

                          <span>
                            {getQuizQuestionCount(quiz)}
                          </span>

                        </div>

                      </TableCell>


                      {/* DURATION */}

                      <TableCell>

                        {getQuizDuration(quiz) > 0
                          ? `${getQuizDuration(quiz)} mins`
                          : "—"}

                      </TableCell>


                      {/* MARKS */}

                      <TableCell>

                        {quiz.totalMarks ??
                          getQuizQuestionCount(quiz)}

                      </TableCell>


                      {/* STATUS */}

                      <TableCell>

                        <QuizStatusBadge
                          status={quiz.status}
                        />

                      </TableCell>


                      {/* DATE */}

                      <TableCell>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">

                          <CalendarDays className="h-4 w-4" />

                          {formatDate(
                            quiz.createdAt
                          )}

                        </div>

                      </TableCell>


                      {/* ACTION MENU */}

                      <TableCell className="text-right">

                        <DropdownMenu>

                          <DropdownMenuTrigger asChild>

                            <Button
                              variant="ghost"
                              size="icon"
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>

                          </DropdownMenuTrigger>


                          <DropdownMenuContent
                            align="end"
                            className="w-48"
                          >

                            <DropdownMenuItem
                              onClick={() =>
                                handleViewQuiz(quiz)
                              }
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              View Quiz
                            </DropdownMenuItem>


                            <DropdownMenuItem
                              onClick={() =>
                                handleEditQuiz(quiz)
                              }
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit Quiz
                            </DropdownMenuItem>


                            <DropdownMenuItem
                              onClick={() =>
                                handleDuplicate(quiz)
                              }
                            >
                              <Copy className="mr-2 h-4 w-4" />
                              Duplicate
                            </DropdownMenuItem>


                            <DropdownMenuSeparator />


                            <DropdownMenuItem
                              className="text-red-600 focus:text-red-600"
                              onClick={() =>
                                openDeleteDialog(quiz)
                              }
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Quiz
                            </DropdownMenuItem>

                          </DropdownMenuContent>

                        </DropdownMenu>

                      </TableCell>

                    </TableRow>

                  ))}

                </TableBody>

              </Table>

            </div>

          )}

        </CardContent>

      </Card>


      {/* ======================================================
          DELETE CONFIRMATION
      ====================================================== */}

      <AlertDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      >

        <AlertDialogContent>

          <AlertDialogHeader>

            <AlertDialogTitle>
              Delete Quiz?
            </AlertDialogTitle>

            <AlertDialogDescription>
              Are you sure you want to delete{" "}
              <strong>
                {selectedQuiz?.title}
              </strong>
              ? This action cannot be undone.
            </AlertDialogDescription>

          </AlertDialogHeader>


          <AlertDialogFooter>

            <AlertDialogCancel
              disabled={deleting}
            >
              Cancel
            </AlertDialogCancel>

            <AlertDialogAction
              disabled={deleting}
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              className="bg-red-600 hover:bg-red-700"
            >

              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Quiz
                </>
              )}

            </AlertDialogAction>

          </AlertDialogFooter>

        </AlertDialogContent>

      </AlertDialog>

    </div>
  );
}